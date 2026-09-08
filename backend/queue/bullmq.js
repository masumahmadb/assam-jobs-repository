import { Queue, Worker, QueueEvents } from 'bullmq';
import { createClient } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  lazyConnect: true
});

// Connection for Workers (different settings)
const workerRedis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

const queues = new Map();
const workers = new Map();
const queueEvents = new Map();

export async function createQueue(name) {
  if (queues.has(name)) return queues.get(name);
  
  const queue = new Queue(name, { 
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 50,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      timeout: 30 * 60 * 1000 // 30 min timeout
    }
  });
  
  const events = new QueueEvents(name, { connection: redisConnection });
  await events.waitUntilReady();
  
  queues.set(name, queue);
  queueEvents.set(name, events);
  
  console.log(`Queue "${name}" created`);
  return queue;
}

export function getQueue(name) {
  return queues.get(name);
}

export async function addJob(queueName, data, opts = {}) {
  const queue = queues.get(queueName) || await createQueue(queueName);
  const job = await queue.add(queueName, data, {
    jobId: data.jobId || undefined,
    priority: opts.priority || 0,
    delay: opts.delay || 0,
    ...opts
  });
  return job;
}

export async function getJobStatus(queueName, jobId) {
  const queue = queues.get(queueName);
  if (!queue) return null;
  
  const job = await queue.getJob(jobId);
  if (!job) return null;
  
  const state = await job.getState();
  const progress = job.progress;
  const returnvalue = job.returnvalue;
  const failedReason = job.failedReason;
  
  return {
    jobId: job.id,
    name: job.name,
    state,
    progress,
    result: returnvalue,
    error: failedReason,
    createdAt: job.timestamp,
    processedAt: job.processedOn,
    finishedAt: job.finishedOn
  };
}

export async function cancelJob(queueName, jobId) {
  const queue = queues.get(queueName);
  if (!queue) return false;
  
  const job = await queue.getJob(jobId);
  if (!job) return false;
  
  await job.remove();
  return true;
}

export async function retryJob(queueName, jobId) {
  const queue = queues.get(queueName);
  if (!queue) return false;
  
  const job = await queue.getJob(jobId);
  if (!job) return false;
  
  await job.retry();
  return true;
}

export async function getQueueStats(queueName) {
  const queue = queues.get(queueName);
  if (!queue) return null;
  
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount()
  ]);
  
  return { waiting, active, completed, failed, delayed };
}

// Python worker spawner utility
export function spawnPythonWorker(scriptName, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON_PATH || 'python3';
    const scriptPath = path.join(process.cwd(), 'workers', 'python', `${scriptName}.py`);
    
    const child = spawn(pythonPath, [scriptPath, ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { 
        ...process.env, 
        PYTHONUNBUFFERED: '1',
        PYTHONIOENCODING: 'utf-8',
        ...options.env
      }
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });
    
    child.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout));
        } catch {
          resolve(stdout);
        }
      } else {
        reject(new Error(stderr || `Python script exited with code ${code}`));
      }
    });
    
    child.on('error', reject);
    
    // Timeout
    const timeout = options.timeout || 300000; // 5 min default
    setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('Worker timeout'));
    }, timeout);
  });
}

// Node.js worker functions (for pdf-lib operations)
export async function processEditOperation(job) {
  const { operation, filePaths, options } = job.data;
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  const fs = await import('fs/promises');
  
  let pdfDoc;
  
  if (Array.isArray(filePaths)) {
    const firstFile = await fs.readFile(filePaths[0]);
    pdfDoc = await PDFDocument.load(firstFile);
  } else {
    pdfDoc = filePaths; // Already a PDFDocument
  }
  
  const pageCount = pdfDoc.getPageCount();
  
  switch (operation) {
    case 'merge': {
      const mergedPdf = await import('pdf-lib').then(m => m.PDFDocument.create());
      for (const filePath of filePaths) {
        const bytes = await fs.readFile(filePath);
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
      }
      const bytes = await mergedPdf.save();
      return { bytes: Array.from(bytes), filename: options.filename || 'merged.pdf' };
    }
    
    case 'rotate': {
      const pageIndex = options.pageIndex;
      const degrees = options.degrees || 90;
      if (pageIndex >= 0 && pageIndex < pageCount) {
        const page = pdfDoc.getPage(pageIndex);
        page.setRotation(page.getRotation().plus({ angle: degrees }));
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'delete': {
      const pageIndex = options.pageIndex;
      if (pageIndex >= 0 && pageIndex < pageCount && pageCount > 1) {
        pdfDoc.removePage(pageIndex);
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'reorder': {
      const { fromIndex, toIndex } = options;
      if (fromIndex >= 0 && fromIndex < pageCount && toIndex >= 0 && toIndex < pageCount) {
        const page = pdfDoc.getPage(fromIndex);
        pdfDoc.removePage(fromIndex);
        pdfDoc.insertPage(toIndex, page);
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'extract': {
      const { startPage, endPage } = options;
      const newPdf = await import('pdf-lib').then(m => m.PDFDocument.create());
      const pages = await pdfDoc.copyPages(pdfDoc, 
        Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
      );
      pages.forEach(p => newPdf.addPage(p));
      const bytes = await newPdf.save();
      return { bytes: Array.from(bytes), filename: options.filename || 'extracted.pdf' };
    }
    
    case 'split': {
      const { ranges } = options; // [{start, end}, ...]
      const results = [];
      for (const range of ranges) {
        const newPdf = await import('pdf-lib').then(m => m.PDFDocument.create());
        const pages = await pdfDoc.copyPages(pdfDoc, 
          Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i)
        );
        pages.forEach(p => newPdf.addPage(p));
        const bytes = await newPdf.save();
        results.push({ 
          bytes: Array.from(bytes), 
          filename: `split_${range.start + 1}-${range.end + 1}.pdf` 
        });
      }
      return { results };
    }
    
    case 'duplicate': {
      const pageIndex = options.pageIndex;
      const count = options.count || 1;
      for (let i = 0; i < count; i++) {
        const page = pdfDoc.getPage(pageIndex);
        const [newPage] = await pdfDoc.copyPages(pdfDoc, [pageIndex]);
        pdfDoc.insertPage(pageIndex + 1 + i, newPage);
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'replace': {
      const { pageIndex, replacementPath } = options;
      const replacementBytes = await fs.readFile(replacementPath);
      const replacementPdf = await PDFDocument.load(replacementBytes);
      const [newPage] = await pdfDoc.copyPages(replacementPdf, [0]);
      pdfDoc.removePage(options.pageIndex);
      pdfDoc.insertPage(options.pageIndex, newPage);
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'crop': {
      const { pageIndex, x, y, width, height } = options;
      if (pageIndex >= 0 && pageIndex < pageCount) {
        const page = pdfDoc.getPage(pageIndex);
        page.setCropBox(x, y, x + width, y + height);
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'resize': {
      const { pageIndex, width, height } = options;
      if (pageIndex >= 0 && pageIndex < pageCount) {
        const page = pdfDoc.getPage(pageIndex);
        page.setSize(width, height);
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'number': {
      const { startNumber, format, position, fontSize, color, pages: pageRange } = options;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pagesToNumber = pageRange === 'all' 
        ? Array.from({ length: pageCount }, (_, i) => i)
        : pageRange;
      
      for (const pageIndex of pagesToNumber) {
        const page = pdfDoc.getPage(pageIndex);
        const { width, height } = page.getSize();
        const pageNum = options.startNumber + pageIndex;
        const text = format.replace('{page}', pageNum + 1).replace('{total}', pageCount);
        
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        let x, y;
        
        switch (position) {
          case 'bottom-center': x = (width - textWidth) / 2; y = 30; break;
          case 'bottom-right': x = width - textWidth - 30; y = 30; break;
          case 'bottom-left': x = 30; y = 30; break;
          case 'top-center': x = (width - textWidth) / 2; y = height - 30; break;
          case 'top-right': x = width - textWidth - 30; y = height - 30; break;
          case 'top-left': x = 30; y = height - 30; break;
          default: x = (width - textWidth) / 2; y = 30;
        }
        
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(...color) });
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'watermark': {
      const { text, imagePath, opacity, rotation, position, pages: pageRange } = options;
      const pagesToMark = pageRange === 'all' 
        ? Array.from({ length: pageCount }, (_, i) => i)
        : pageRange;
      
      let watermarkImage;
      if (imagePath) {
        const imageBytes = await fs.readFile(imagePath);
        watermarkImage = imagePath.endsWith('.png') 
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);
      }
      
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      for (const pageIndex of pagesToMark) {
        const page = pdfDoc.getPage(pageIndex);
        const { width, height } = page.getSize();
        
        if (text) {
          const fontSize = Math.min(width, height) / 10;
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          
          page.drawText(text, {
            x: (width - textWidth) / 2,
            y: height / 2,
            size: fontSize,
            font,
            color: rgb(0.5, 0.5, 0.5),
            opacity,
            rotate: rotation || 45
          });
        }
        
        if (watermarkImage) {
          const imgWidth = width * 0.3;
          const imgHeight = imgWidth * (watermarkImage.height / watermarkImage.width);
          page.drawImage(watermarkImage, {
            x: (width - imgWidth) / 2,
            y: (height - imgHeight) / 2,
            width: imgWidth,
            height: imgHeight,
            opacity,
            rotate: rotation || 0
          });
        }
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'header-footer': {
      const { header, footer, fontSize, fontColor, pages: pageRange } = options;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pagesToMark = pageRange === 'all' 
        ? Array.from({ length: pageCount }, (_, i) => i)
        : pageRange;
      
      for (const pageIndex of pagesToMark) {
        const page = pdfDoc.getPage(pageIndex);
        const { width, height } = page.getSize();
        
        if (header) {
          page.drawText(header, {
            x: 50,
            y: height - 40,
            size: fontSize,
            font,
            color: rgb(...fontColor)
          });
        }
        
        if (footer) {
          page.drawText(footer, {
            x: 50,
            y: 30,
            size: fontSize,
            font,
            color: rgb(...fontColor)
          });
        }
      }
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'metadata': {
      const { title, author, subject, keywords, creator, producer } = options;
      if (title) pdfDoc.setTitle(title);
      if (author) pdfDoc.setAuthor(author);
      if (subject) pdfDoc.setSubject(subject);
      if (keywords) pdfDoc.setKeywords(keywords);
      if (creator) pdfDoc.setCreator(creator);
      if (producer) pdfDoc.setProducer(producer);
      pdfDoc.setCreationDate(options.creationDate ? new Date(options.creationDate) : new Date());
      pdfDoc.setModificationDate(new Date());
      const bytes = await pdfDoc.save();
      return { bytes: Array.from(bytes) };
    }
    
    case 'flatten': {
      // Flatten form fields and annotations
      const form = pdfDoc.getForm();
      form.flatten();
      const bytes = await pdfDoc.save({ useObjectStreams: false });
      return { bytes: Array.from(bytes) };
    }
    
    case 'remove-blank': {
      const threshold = options.threshold || 0.01;
      const pagesToKeep = [];
      
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const content = page.node.Contents();
        // Simple heuristic: check if page has content
        if (content && content.length > 100) {
          pagesToKeep.push(i);
        }
      }
      
      const newPdf = await import('pdf-lib').then(m => m.PDFDocument.create());
      const pages = await pdfDoc.copyPages(pdfDoc, pagesToKeep);
      pages.forEach(p => newPdf.addPage(p));
      const bytes = await newPdf.save();
      return { bytes: Array.from(bytes), removedPages: pageCount - pagesToKeep.length };
    }
    
    case 'info': {
      const form = pdfDoc.getForm();
      const fields = form.getFields().map(f => ({
        name: f.getName(),
        type: f.constructor.name,
        value: f.getValue()
      }));
      
      return {
        pageCount: pdfDoc.getPageCount(),
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        keywords: pdfDoc.getKeywords(),
        creator: pdfDoc.getCreator(),
        producer: pdfDoc.getProducer(),
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate(),
        formFields: fields,
        isEncrypted: pdfDoc.isEncrypted,
        permissions: pdfDoc.getPermissions?.()
      };
    }
    
    case 'esign': {
      // Simple e-signature (draw/type/upload)
      const { signatureData, position, pageIndex } = options;
      // signatureData: { type: 'draw'|'type'|'upload', data: string, ... }
      // This creates a visual signature annotation
      // For true digital signatures, use PAdES endpoint
      return { message: 'Use /api/esign endpoint for browser-based e-signatures' };
    }
    
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// Export the handler
export async function handlePDFOperation(operation, filePaths, options) {
  return processEditOperation({ data: { operation, filePaths, options } });
}

export async function closeQueues() {
  for (const [name, queue] of queues) {
    await queue.close();
  }
  for (const [name, events] of queueEvents) {
    await events.close();
  }
  await redisConnection.quit();
  await workerRedis.quit();
  queues.clear();
  workers.clear();
  queueEvents.clear();
}