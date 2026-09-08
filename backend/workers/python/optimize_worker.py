#!/usr/bin/env python3
"""
Optimize Worker - Ghostscript + QPDF for advanced operations
Repair, PDF/A, linearize, optimize, remove blank pages
"""

import sys
import json
import os
import tempfile
import subprocess
import asyncio
from pathlib import Path
from typing import Dict, Any

async def run_qpdf(input_path: str, output_path: str, args: list) -> Dict[str, Any]:
    """Run QPDF with given arguments"""
    
    cmd = ['qpdf'] + args + [input_path, output_path]
    
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            raise Exception(f"QPDF failed: {stderr.decode()}")
        
        return {'success': True, 'output_path': output_path}
        
    except Exception as e:
        raise Exception(f"QPDF failed: {str(e)}")

async def run_ghostscript(input_path: str, output_path: str, args: list) -> Dict[str, Any]:
    """Run Ghostscript with given arguments"""
    
    cmd = ['gs', '-sDEVICE=pdfwrite', '-dNOPAUSE', '-dQUIET', '-dBATCH'] + args + [
        f'-sOutputFile={output_path}',
        input_path
    ]
    
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            raise Exception(f"Ghostscript failed: {stderr.decode()}")
        
        return {'success': True, 'output_path': output_path}
        
    except Exception as e:
        raise Exception(f"Ghostscript failed: {str(e)}")

async def linearize_pdf(input_path: str, output_path: str) -> Dict[str, Any]:
    """Linearize PDF for fast web view (QPDF)"""
    return await run_qpdf(input_path, output_path, ['--linearize'])

async def optimize_pdf(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Full optimization: QPDF linearize + Ghostscript compress"""
    
    # First linearize with QPDF
    temp_path = output_path.replace('.pdf', '_temp.pdf')
    await run_qpdf(input_path, temp_path, ['--linearize', '--object-streams=generate'])
    
    # Then compress with Ghostscript
    preset = options.get('preset', 'recommended')
    dpi = options.get('dpi', 150)
    quality = options.get('imageQuality', 75)
    strip_meta = options.get('stripMetadata', True)
    
    preset_settings = {
        'lossless': ['-dPDFSETTINGS=/printer', '-dColorImageResolution=300'],
        'recommended': ['-dPDFSETTINGS=/ebook', f'-dColorImageResolution={dpi}'],
        'high': ['-dPDFSETTINGS=/screen', f'-dColorImageResolution={max(72, dpi//2)}'],
        'maximum': ['-dPDFSETTINGS=/screen', '-dColorImageResolution=72']
    }
    
    gs_args = [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dNOPAUSE', '-dQUIET', '-dBATCH',
        '-dPrinted=false',
        '-dEmbedAllFonts=true',
        '-dSubsetFonts=true',
        f'-sOutputFile={output_path}'
    ] + preset_settings.get(preset, preset_settings['recommended'])
    
    if strip_meta:
        gs_args.extend([
            '-dPreserveAnnots=false',
            '-dPreserveOPIComments=false',
            '-dPreserveOverprintSettings=false'
        ])
    
    gs_args.extend([
        '-dEncodeColorImages=true',
        '-dEncodeGrayImages=true',
        '-dEncodeMonoImages=true',
        '-sColorImageFilter=DCTEncode',
        '-sGrayImageFilter=DCTEncode',
        '-sMonoImageFilter=CCITTFaxEncode',
        f'-dJPEGQ={options.get("imageQuality", 75)}'
    ])
    
    gs_args.append(temp_path)
    
    try:
        proc = await asyncio.create_subprocess_exec(
            'gs', *gs_args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()
        
        # Cleanup temp
        os.unlink(temp_path)
        
        return {'success': True, 'output_path': output_path}
    except Exception as e:
        if os.path.exists(temp_path):
            os.unlink(temp_path)
        raise Exception(f"Optimization failed: {str(e)}")

async def repair_pdf(input_path: str, output_path: str) -> Dict[str, Any]:
    """Repair corrupted PDF"""
    try:
        # Try QPDF first
        await run_qpdf(input_path, output_path, [
            '--replace-input',
            '--decode-level=all',
            '--check'
        ])
        return {'success': True, 'output_path': output_path, 'method': 'qpdf'}
    except:
        # Try Ghostscript as fallback
        try:
            await run_ghostscript(input_path, output_path, [
                '-sDEVICE=pdfwrite',
                '-dNOPAUSE', '-dQUIET', '-dBATCH',
                f'-sOutputFile={output_path}'
            ])
            return {'success': True, 'output_path': output_path, 'method': 'ghostscript'}
        except Exception as e:
            raise Exception(f"Repair failed: {str(e)}")

async def pdf_a_convert(input_path: str, output_path: str, level: str = '2b') -> Dict[str, Any]:
    """Convert to PDF/A"""
    level_map = {'1b': '1b', '2b': '2b', '2u': '2u', '3b': '3b', '3u': '3u'}
    if level not in level_map:
        raise Exception(f"Unsupported PDF/A level: {level}")
    
    # Use Ghostscript for PDF/A conversion
    cmd = [
        'gs',
        '-sDEVICE=pdfwrite',
        f'-dPDFA={level}',
        '-dPDFACompatibilityPolicy=1',
        '-dNOPAUSE', '-dQUIET', '-dBATCH',
        f'-sOutputFile={output_path}',
        input_path
    ]
    
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            raise Exception(f"PDF/A conversion failed: {stderr.decode()}")
        
        return {'success': True, 'output_path': output_path, 'level': level}
    except Exception as e:
        raise Exception(f"PDF/A conversion failed: {str(e)}")

async def remove_blank_pages(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Remove blank pages using PyMuPDF"""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        raise Exception("PyMuPDF not installed. Install with: pip install pymupdf")
    
    threshold = options.get('threshold', 0.01)
    
    doc = fitz.open(input_path)
    pages_to_keep = []
    
    for i in range(len(doc)):
        page = doc[i]
        # Check if page has meaningful content
        text = page.get_text().strip()
        images = page.get_images()
        drawings = page.get_drawings()
        
        has_content = len(text) > 10 or len(images) > 0 or len(drawings) > 0
        
        if has_content:
            pages_to_keep.append(i)
    
    if len(pages_to_keep) == len(doc):
        # No blank pages, just copy
        import shutil
        shutil.copy2(input_path, output_path)
        return {
            'success': True, 
            'output_path': output_path, 
            'removed': 0,
            'message': 'No blank pages found'
        }
    
    # Create new doc with non-blank pages
    doc.select(pages_to_keep)
    doc.save(output_path)
    doc.close()
    
    return {
        'success': True,
        'output_path': output_path,
        'removed': len(pages_to_keep) - len(doc),
        'kept': len(pages_to_keep)
    }

async def split_pdf(input_path: str, output_dir: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Split PDF by ranges or every N pages"""
    try:
        import fitz
    except ImportError:
        raise Exception("PyMuPDF not installed")
    
    doc = fitz.open(input_path)
    total_pages = len(doc)
    
    split_type = options.get('type', 'range')  # 'range', 'every-n', 'bookmarks'
    
    os.makedirs(output_dir, exist_ok=True)
    results = []
    
    if options.get('type') == 'every-n':
        n = options.get('n', 1)
        for i in range(0, len(doc), n):
            new_doc = fitz.open()
            end = min(i + n, len(doc))
            new_doc.insert_pdf(doc, from_page=i, to_page=end-1)
            out_path = os.path.join(output_dir, f'split_{i+1}-{end}.pdf')
            new_doc.save(out_path)
            new_doc.close()
            results.append({'path': out_path, 'pages': f'{i+1}-{end}'})
    
    elif options.get('type') == 'range':
        ranges = options.get('ranges', [])
        for idx, r in enumerate(ranges):
            start = r.get('start', 1) - 1
            end = r.get('end', len(doc))
            new_doc = fitz.open()
            new_doc.insert_pdf(doc, from_page=start, to_page=end-1)
            out_path = os.path.join(output_dir, f'range_{idx+1}_p{start+1}-{end}.pdf')
            new_doc.save(out_path)
            new_doc.close()
            results.append({'path': out_path, 'pages': f'{start+1}-{end}'})
    
    else:
        # Split by bookmarks
        toc = doc.get_toc()
        if toc:
            for i, entry in enumerate(toc):
                level, title, page = entry
                start = page - 1
                end = toc[i+1][2] - 1 if i+1 < len(toc) else len(doc)
                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=start, to_page=end-1)
                safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
                out_path = os.path.join(output_dir, f'{i+1}_{safe_title}.pdf')
                new_doc.save(out_path)
                new_doc.close()
                results.append({'path': out_path, 'title': title, 'pages': f'{start+1}-{end}'})
    
    doc.close()
    
    return {'success': True, 'files': results, 'count': len(results)}

async def extract_pages(input_path: str, output_path: str, pages: list) -> Dict[str, Any]:
    """Extract specific pages"""
    try:
        import fitz
    except ImportError:
        raise Exception("PyMuPDF not installed")
    
    doc = fitz.open(input_path)
    new_doc = fitz.open()
    
    for page_num in pages:
        if 0 <= page_num < len(doc):
            new_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)
    
    new_doc.save(output_path)
    new_doc.close()
    doc.close()
    
    return {'success': True, 'output_path': output_path, 'pages': pages}

async def duplicate_page(input_path: str, output_path: str, page_index: int, count: int = 1) -> Dict[str, Any]:
    """Duplicate a page N times"""
    try:
        import fitz
    except ImportError:
        raise Exception("PyMuPDF not installed")
    
    doc = fitz.open(input_path)
    
    for i in range(count):
        doc.insert_pdf(doc, from_page=page_index, to_page=page_index)
    
    doc.save(output_path)
    doc.close()
    
    return {'success': True, 'output_path': output_path, 'duplicated': count}

async def replace_page(input_path: str, output_path: str, page_index: int, replacement_path: str) -> Dict[str, Any]:
    """Replace a page with another PDF's first page"""
    try:
        import fitz
    except ImportError:
        raise Exception("PyMuPDF not installed")
    
    doc = fitz.open(input_path)
    replacement = fitz.open(replacement_path)
    
    if len(replacement) > 0:
        doc.insert_pdf(replacement, from_page=0, to_page=0, start_at=page_index)
        doc.delete_page(page_index + 1)  # Remove old page (shifted by insertion)
    
    doc.save(output_path)
    doc.close()
    replacement.close()
    
    return {'success': True, 'output_path': output_path}

async def crop_page(input_path: str, output_path: str, page_index: int, rect: list) -> Dict[str, Any]:
    """Crop page to rectangle [x0, y0, x1, y1]"""
    try:
        import fitz
    except ImportError:
        raise Exception("PyMuPDF not installed")
    
    doc = fitz.open(input_path)
    page = doc[page_index]
    
    # Set crop box
    page.set_cropbox(fitz.Rect(*rect))
    
    doc.save(output_path)
    doc.close()
    
    return {'success': True, 'output_path': output_path}

async def resize_page(input_path: str, output_path: str, page_index: int, width: float, height: float) -> Dict[str, Any]:
    """Resize page to specific dimensions"""
    try:
        import fitz
    except ImportError:
        raise Exception("PyMuPDF not installed")
    
    doc = fitz.open(input_path)
    page = doc[page_index]
    
    # Set mediabox and cropbox
    page.set_mediabox(fitz.Rect(0, 0, width, height))
    page.set_cropbox(fitz.Rect(0, 0, width, height))
    
    doc.save(output_path)
    doc.close()
    
    return {'success': True, 'output_path': output_path}

async def get_pdf_info(input_path: str) -> Dict[str, Any]:
    """Get detailed PDF information"""
    try:
        import fitz
    except ImportError:
        raise Exception("PyMuPDF not installed")
    
    doc = fitz.open(input_path)
    
    info = {
        'page_count': len(doc),
        'metadata': doc.metadata,
        'is_encrypted': doc.is_encrypted,
        'permissions': doc.permissions,
        'is_pdf_a': doc.is_pdfa,
        'pages': []
    }
    
    for i in range(len(doc)):
        page = doc[i]
        rect = page.rect
        info['pages'].append({
            'index': i,
            'width': rect.width,
            'height': rect.height,
            'rotation': page.rotation,
            'text_length': len(page.get_text().strip()),
            'image_count': len(page.get_images()),
            'is_blank': len(page.get_text().strip()) < 10 and len(page.get_images()) == 0
        })
    
    doc.close()
    
    return {'success': True, 'info': info}

async def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No operation specified'}))
        sys.exit(1)
    
    operation = sys.argv[1]
    
    try:
        if operation == 'linearize':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            result = await linearize_pdf(input_path, output_path)
            print(json.dumps(result))
            
        elif operation == 'optimize':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            result = await optimize_pdf(input_path, output_path, options)
            print(json.dumps(result))
            
        elif operation == 'repair':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            result = await repair_pdf(input_path, output_path)
            print(json.dumps(result))
            
        elif operation == 'pdf-a':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            level = sys.argv[4] if len(sys.argv) > 4 else '2b'
            result = await pdf_a_convert(input_path, output_path, level)
            print(json.dumps(result))
            
        elif operation == 'remove-blank':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            result = await remove_blank_pages(input_path, output_path, options)
            print(json.dumps(result))
            
        elif operation == 'split':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            result = await split_pdf(input_path, output_dir, options)
            print(json.dumps(result))
            
        elif operation == 'extract':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            pages = json.loads(sys.argv[3]) if len(sys.argv) > 3 else []
            result = await extract_pages(input_path, output_path, pages)
            print(json.dumps(result))
            
        elif operation == 'duplicate':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            page_index = int(sys.argv[4])
            count = int(sys.argv[5]) if len(sys.argv) > 5 else 1
            result = await duplicate_page(input_path, output_path, page_index, count)
            print(json.dumps(result))
            
        elif operation == 'replace':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            page_index = int(sys.argv[4])
            replacement_path = sys.argv[5]
            result = await replace_page(input_path, output_path, page_index, replacement_path)
            print(json.dumps(result))
            
        elif operation == 'crop':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            page_index = int(sys.argv[4])
            rect = json.loads(sys.argv[5])
            result = await crop_page(input_path, output_path, page_index, rect)
            print(json.dumps(result))
            
        elif operation == 'resize':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            page_index = int(sys.argv[4])
            width = float(sys.argv[5])
            height = float(sys.argv[6])
            result = await resize_page(input_path, output_path, page_index, width, height)
            print(json.dumps(result))
            
        elif operation == 'info':
            input_path = sys.argv[2]
            result = await get_pdf_info(input_path)
            print(json.dumps(result))
            
        else:
            print(json.dumps({'error': f'Unknown operation: {operation}'}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())