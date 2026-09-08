import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import archiver from 'archiver';

import { createQueue, getQueue, addJob, getJobStatus, closeQueues } from './queue/bullmq.js';
import { handlePDFOperation } from './utils/pdf-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 200 * 1024 * 1024; // 200MB

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../temp/uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/csv'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx?|xlsx?|pptx?|txt|csv|jpg|jpeg|png|webp)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Queue names
const QUEUES = {
  OCR: 'ocr',
  CONVERT: 'convert',
  COMPRESS: 'compress',
  TABLE: 'table',
  SIGN: 'sign',
  OPTIMIZE: 'optimize',
  EDIT: 'edit'
};

// Initialize queues on startup
async function initializeQueues() {
  for (const queueName of Object.values(QUEUES)) {
    await createQueue(queueName);
  }
  console.log('All queues initialized');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Queue status
app.get('/api/queues/status', async (req, res) => {
  try {
    const status = {};
    for (const [name, queueName] of Object.entries(QUEUES)) {
      const queue = getQueue(queueName);
      if (queue) {
        const [waiting, active, completed, failed] = await Promise.all([
          queue.getWaitingCount(),
          queue.getActiveCount(),
          queue.getCompletedCount(),
          queue.getFailedCount()
        ]);
        status[name] = { waiting, active, completed, failed };
      }
    }
    res.json(status);
  } catch (err) {
    console.error('Queue status error:', err);
    res.status(500).json({ error: 'Failed to get queue status' });
  }
});

// Single file upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      fileId: path.basename(req.file.path, path.extname(req.file.path)),
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Multiple files upload
app.post('/api/upload/multiple', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const files = req.files.map(f => ({
      fileId: path.basename(f.path, path.extname(f.path)),
      filename: f.originalname,
      size: f.size,
      mimetype: f.mimetype,
      path: f.path
    }));
    res.json({ files });
  } catch (err) {
    console.error('Multi-upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Generic PDF operation endpoint
app.post('/api/pdf/:operation', upload.array('files', 20), async (req, res) => {
  try {
    const { operation } = req.params;
    const files = req.files || [];
    const options = req.body.options ? JSON.parse(req.body.options) : {};
    
    const validOps = ['merge', 'split', 'rotate', 'delete', 'reorder', 'extract', 
      'duplicate', 'replace', 'crop', 'resize', 'number', 'watermark', 
      'header-footer', 'metadata', 'flatten', 'remove-blank', 'repair', 'info'];
    
    if (!validOps.includes(operation)) {
      return res.status(400).json({ error: `Unknown operation: ${operation}` });
    }

    const jobId = uuidv4();
    const filePaths = req.files.map(f => f.path);
    
    // For simple operations, process directly (no queue)
    const quickOps = ['merge', 'rotate', 'delete', 'reorder', 'extract', 'info'];
    if (quickOps.includes(operation) && req.files.length <= 5) {
      try {
        const result = await handlePDFOperation(operation, filePaths, options);
        // Cleanup temp files
        await Promise.all(filePaths.map(p => fs.unlink(p).catch(() => {})));
        return res.json({ success: true, result, jobId });
      } catch (err) {
        await Promise.all(filePaths.map(p => fs.unlink(p).catch(() => {})));
        throw err;
      }
    }

    // For heavy operations, queue them
    const queueName = getQueueForOperation(operation);
    const queue = getQueue(queueName);
    
    const job = await addJob(queueName, {
      operation,
      filePaths,
      options,
      jobId
    });

    res.json({ 
      success: true, 
      jobId: job.id, 
      status: 'queued',
      queue: queueName
    });
  } catch (err) {
    console.error(`PDF ${req.params.operation} error:`, err);
    // Cleanup on error
    if (req.files) {
      await Promise.all(req.files.map(f => fs.unlink(f.path).catch(() => {})));
    }
    res.status(500).json({ error: err.message || 'Operation failed' });
  }
});

// Job status polling
app.get('/api/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { queue: queueName } = req.query;
    
    if (!queueName || !QUEUES[queueName]) {
      return res.status(400).json({ error: 'Invalid queue name' });
    }
    
    const status = await getJobStatus(QUEUES[queueName], jobId);
    if (!status) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(status);
  } catch (err) {
    console.error('Job status error:', err);
    res.status(500).json({ error: 'Failed to get job status' });
  }
});

// Download result
app.get('/api/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(__dirname, '../temp/outputs', fileId);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found or expired' });
    }
    
    const stat = await fs.stat(filePath);
    const filename = req.query.filename || `output.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const stream = (await import('fs')).createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Download multiple files as ZIP
app.get('/api/download/zip', async (req, res) => {
  try {
    const { files } = req.query;
    if (!files) return res.status(400).json({ error: 'No files specified' });
    
    const fileIds = files.split(',');
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="pdf-suite-output.zip"');
    
    archive.pipe(res);
    
    for (const fileId of fileIds) {
      const filePath = path.join(__dirname, '../temp/outputs', fileId.trim());
      try {
        await fs.access(filePath);
        archive.file(filePath, { name: fileId.trim() });
      } catch {
        // Skip missing files
      }
    }
    
    await archive.finalize();
  } catch (err) {
    console.error('ZIP download error:', err);
    res.status(500).json({ error: 'ZIP creation failed' });
  }
});

// OCR specific endpoint
app.post('/api/ocr', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files || [];
    const options = req.body.options ? JSON.parse(req.body.options) : {};
    
    const jobId = uuidv4();
    const filePaths = req.files.map(f => f.path);
    
    const job = await addJob('ocr', {
      operation: 'ocr',
      filePaths,
      options: {
        language: options.language || 'eng+hin+asm',
        deskew: options.deskew !== false,
        clean: options.clean !== false,
        forceOcr: options.forceOcr || false,
        outputType: options.outputType || 'pdf', // pdf, txt, both
        ...options
      },
      jobId
    });
    
    res.json({ success: true, jobId: job.id, status: 'queued' });
  } catch (err) {
    console.error('OCR queue error:', err);
    if (req.files) {
      await Promise.all(req.files.map(f => fs.unlink(f.path).catch(() => {})));
    }
    res.status(500).json({ error: 'OCR job failed to queue' });
  }
});

// OCR with Tesseract.js (browser fallback for small files)
app.post('/api/ocr/browser', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // For small files, we can return the file path for browser-side OCR
    // The frontend will use Tesseract.js
    res.json({
      success: true,
      fileId: path.basename(req.file.path, path.extname(req.file.path)),
      filename: req.file.originalname,
      path: req.file.path,
      useBrowserOcr: true
    });
  } catch (err) {
    console.error('Browser OCR upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Convert endpoint
app.post('/api/convert', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files || [];
    const options = req.body.options ? JSON.parse(req.body.options) : {};
    
    const jobId = uuidv4();
    const filePaths = req.files.map(f => f.path);
    
    const job = await addJob('convert', {
      operation: 'convert',
      filePaths,
      options: {
        targetFormat: options.targetFormat || 'docx',
        ocrIfNeeded: options.ocrIfNeeded !== false,
        ...options
      },
      jobId
    });
    
    res.json({ success: true, jobId: job.id, status: 'queued' });
  } catch (err) {
    console.error('Convert queue error:', err);
    if (req.files) {
      await Promise.all(req.files.map(f => fs.unlink(f.path).catch(() => {})));
    }
    res.status(500).json({ error: 'Convert job failed to queue' });
  }
});

// Compression endpoint
app.post('/api/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const options = req.body.options ? JSON.parse(req.body.options) : {};
    const filePath = req.file.path;
    
    const jobId = uuidv4();
    const job = await addJob('compress', {
      operation: 'compress',
      filePaths: [filePath],
      options: {
        preset: options.preset || 'recommended', // lossless, recommended, high, maximum
        dpi: options.dpi || 150,
        imageQuality: options.imageQuality || 75,
        stripMetadata: options.stripMetadata !== false,
        ...options
      },
      jobId
    });
    
    res.json({ success: true, jobId: job.id, status: 'queued' });
  } catch (err) {
    console.error('Compress queue error:', err);
    res.status(500).json({ error: 'Compress job failed to queue' });
  }
});

// OCR Table extraction
app.post('/api/table-extract', upload.array('files', 3), async (req, res) => {
  try {
    const files = req.files || [];
    const options = req.body.options ? JSON.parse(req.body.options) : {};
    
    const jobId = uuidv4();
    const filePaths = req.files.map(f => f.path);
    
    const job = await addJob('table', {
      operation: 'table-extract',
      filePaths,
      options: {
        pages: options.pages || 'all',
        flavor: options.flavor || 'lattice', // lattice, stream
        ocrIfScanned: options.ocrIfScanned !== false,
        outputFormat: options.outputFormat || 'csv', // csv, xlsx, json
        ...options
      },
      jobId
    });
    
    res.json({ success: true, jobId: job.id, status: 'queued' });
  } catch (err) {
    console.error('Table extract queue error:', err);
    if (req.files) {
      await Promise.all(req.files.map(f => fs.unlink(f.path).catch(() => {})));
    }
    res.status(500).json({ error: 'Table extraction job failed to queue' });
  }
});

// Digital Sign (PAdES)
app.post('/api/sign', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
  { name: 'signatureImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const pdfFile = req.files.pdf?.[0];
    const certFile = req.files.certificate?.[0];
    const sigImageFile = req.files.signatureImage?.[0];
    const options = req.body.options ? JSON.parse(req.body.options) : {};
    
    if (!pdfFile) {
      return res.status(400).json({ error: 'PDF file required' });
    }
    
    const jobId = uuidv4();
    const job = await addJob('sign', {
      operation: 'sign',
      filePaths: {
        pdf: pdfFile.path,
        certificate: certFile?.path,
        signatureImage: sigImageFile?.path
      },
      options: {
        type: options.type || 'esign', // esign, pades
        position: options.position || { x: 100, y: 100, page: 1 },
        reason: options.reason || 'Document signed',
        contact: options.contact || '',
        location: options.location || '',
        appearance: options.appearance || 'draw', // draw, type, upload
        ...options
      },
      jobId
    });
    
    res.json({ success: true, jobId: job.id, status: 'queued' });
  } catch (err) {
    console.error('Sign queue error:', err);
    res.status(500).json({ error: 'Sign job failed to queue' });
  }
});

// e-Signature (simple draw/type/upload - browser side)
app.post('/api/esign', upload.array('files', 2), async (req, res) => {
  try {
    // e-signatures are handled client-side with pdf-lib
    // This endpoint just receives the PDF and signature data
    const files = req.files || [];
    const options = req.body.options ? JSON.parse(req.body.options) : {};
    
    // Process directly with pdf-lib (lightweight)
    const result = await handlePDFOperation('esign', 
      req.files.map(f => f.path), 
      options
    );
    
    await Promise.all(req.files.map(f => fs.unlink(f.path).catch(() => {})));
    res.json({ success: true, result });
  } catch (err) {
    console.error('eSign error:', err);
    if (req.files) {
      await Promise.all(req.files.map(f => fs.unlink(f.path).catch(() => {})));
    }
    res.status(500).json({ error: err.message || 'eSign failed' });
  }
});

// Cleanup temp files periodically
setInterval(async () => {
  try {
    const dirs = ['uploads', 'outputs'];
    for (const dir of dirs) {
      const dirPath = path.join(__dirname, `../temp/${dir}`);
      try {
        const files = await fs.readdir(dirPath);
        const now = Date.now();
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stat = await fs.stat(filePath);
          // Delete files older than 1 hour
          if (now - stat.mtimeMs > 60 * 60 * 1000) {
            await fs.unlink(filePath);
          }
        }
      } catch (err) {
        // Directory might not exist
      }
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}, 15 * 60 * 1000); // Every 15 minutes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Max 200MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down...');
  await closeQueues();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
async function start() {
  await initializeQueues();
  
  // Create temp directories
  const dirs = ['temp/uploads', 'temp/outputs', 'temp/temp'];
  for (const dir of dirs) {
    await fs.mkdir(path.join(__dirname, `../temp/${dir.split('/')[1]}`), { recursive: true });
  }
  
  app.listen(PORT, () => {
    console.log(`PDF Suite Backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

start().catch(console.error);

function getQueueForOperation(operation) {
  const map = {
    ocr: 'ocr',
    convert: 'convert',
    compress: 'compress',
    'table-extract': 'table',
    sign: 'sign',
    pades: 'sign',
    optimize: 'optimize',
    'pdf-a': 'optimize',
    repair: 'optimize'
  };
  return QUEUES[map[operation]] || QUEUES.EDIT;
}

export default app;