#!/usr/bin/env python3
"""
OCR Worker - Uses OCRmyPDF + Tesseract for OCR operations
Supports: image->text, scanned->searchable PDF, multi-language, deskew/clean
"""

import sys
import json
import os
import tempfile
import subprocess
import asyncio
from pathlib import Path
from typing import Dict, Any, List

async def run_ocrmypdf(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Run OCRmyPDF with given options"""
    
    cmd = ['ocrmypdf']
    
    # Language
    language = options.get('language', 'eng+hin+asm')
    cmd.extend(['-l', language])
    
    # Deskew
    if options.get('deskew', True):
        cmd.append('--deskew')
    
    # Clean
    if options.get('clean', True):
        cmd.append('--clean')
    
    # Force OCR
    if options.get('forceOcr', False):
        cmd.append('--force-ocr')
    
    # Output type
    output_type = options.get('outputType', 'pdf')
    if output_type == 'txt':
        cmd.append('--sidecar')
        txt_path = output_path.replace('.pdf', '.txt')
        cmd.append(txt_path)
    elif output_type == 'both':
        cmd.extend(['--sidecar', output_path.replace('.pdf', '.txt')])
    
    # Skip text if already has text
    if not options.get('forceOcr', False):
        cmd.append('--skip-text')
    
    # Optimize
    cmd.append('--optimize')
    cmd.append('1')
    
    # Jobs (parallel)
    cmd.extend(['--jobs', str(os.cpu_count() or 4)])
    
    # Input/Output
    cmd.extend([input_path, output_path])
    
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            # Check if it's a "already has text" error (exit code 6)
            if proc.returncode == 6:
                # Copy input to output if it already has text
                import shutil
                shutil.copy2(options.get('input_path', ''), output_path)
                return {
                    'success': True,
                    'message': 'PDF already contains text, copied as-is',
                    'pages': 0
                }
            raise Exception(f"OCRmyPDF failed: {stderr.decode()}")
        
        # Get page count
        page_count = await get_pdf_page_count(output_path)
        
        return {
            'success': True,
            'output_path': output_path,
            'pages': page_count,
            'message': 'OCR completed successfully'
        }
        
    except Exception as e:
        raise Exception(f"OCR failed: {str(e)}")

async def get_pdf_page_count(pdf_path: str) -> int:
    """Get page count using qpdf"""
    try:
        proc = await asyncio.create_subprocess_exec(
            'qpdf', '--show-npages', pdf_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, _ = await proc.communicate()
        return int(stdout.decode().strip())
    except:
        return 0

async def extract_text_tesseract(input_path: str, output_path: str, language: str) -> Dict[str, Any]:
    """Extract text using Tesseract directly (for text-only output)"""
    try:
        cmd = ['tesseract', input_path, output_path.replace('.txt', ''), '-l', language, 'txt']
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()
        
        if os.path.exists(output_path):
            with open(output_path, 'r', encoding='utf-8') as f:
                text = f.read()
            return {'success': True, 'text': text}
        else:
            raise Exception("Text file not created")
    except Exception as e:
        raise Exception(f"Tesseract extraction failed: {str(e)}")

async def deskew_image(input_path: str, output_path: str) -> Dict[str, Any]:
    """Deskew image using ImageMagick"""
    try:
        cmd = ['convert', input_path, '-deskew', '40%', output_path]
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()
        
        if os.path.exists(output_path):
            return {'success': True, 'output_path': output_path}
        raise Exception("Deskew failed")
    except Exception as e:
        raise Exception(f"Deskew failed: {str(e)}")

async def clean_image(input_path: str, output_path: str) -> Dict[str, Any]:
    """Clean image (remove noise, enhance contrast)"""
    try:
        cmd = [
            'convert', input_path,
            '-colorspace', 'Gray',
            '-contrast-stretch', '0.5%x0.5%',
            '-sharpen', '0x1',
            output_path
        ]
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()
        
        if os.path.exists(output_path):
            return {'success': True, 'output_path': output_path}
        raise Exception("Clean failed")
    except Exception as e:
        raise Exception(f"Clean failed: {str(e)}")

async def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No operation specified'}))
        sys.exit(1)
    
    operation = sys.argv[1]
    
    try:
        if operation == 'ocr':
            # Arguments: input_path output_path options_json
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            options['input_path'] = input_path
            
            result = await run_ocrmypdf(input_path, output_path, options)
            print(json.dumps(result))
            
        elif operation == 'extract-text':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            language = sys.argv[4] if len(sys.argv) > 4 else 'eng+hin+asm'
            
            result = await extract_text_tesseract(input_path, output_path, language)
            print(json.dumps(result))
            
        elif operation == 'deskew':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            result = await deskew_image(input_path, output_path)
            print(json.dumps(result))
            
        elif operation == 'clean':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            result = await clean_image(input_path, output_path)
            print(json.dumps(result))
            
        else:
            print(json.dumps({'error': f'Unknown operation: {operation}'}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())