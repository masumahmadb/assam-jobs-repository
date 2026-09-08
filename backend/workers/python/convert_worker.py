#!/usr/bin/env python3
"""
Convert Worker - LibreOffice + Docling for PDF↔Office conversions
"""

import sys
import json
import os
import tempfile
import subprocess
import asyncio
from pathlib import Path
from typing import Dict, Any, List

LIBREOFFICE_PATH = os.environ.get('LIBREOFFICE_PATH', 'libreoffice')

async def run_libreoffice(input_path: str, output_dir: str, format: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """Convert using LibreOffice headless"""
    
    format_map = {
        'docx': 'docx',
        'doc': 'doc',
        'xlsx': 'xlsx',
        'xls': 'xls',
        'csv': 'csv',
        'pptx': 'pptx',
        'ppt': 'ppt',
        'txt': 'txt',
        'html': 'html',
        'odt': 'odt',
        'ods': 'ods',
        'odp': 'odp',
        'pdf': 'pdf'
    }
    
    if format not in format_map:
        raise Exception(f"Unsupported format: {format}")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    cmd = [
        LIBREOFFICE_PATH,
        '--headless',
        '--norestore',
        '--nologo',
        '--nofirststartwizard',
        '--convert-to', format_map[format],
        '--outdir', output_dir,
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
            raise Exception(f"LibreOffice failed: {stderr.decode()}")
        
        # Find output file
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        output_ext = '.' + format_map[format]
        output_path = os.path.join(output_dir, base_name + output_ext)
        
        if os.path.exists(output_path):
            return {
                'success': True,
                'output_path': output_path,
                'format': format
            }
        else:
            # Try to find any file with the right extension
            for f in os.listdir(output_dir):
                if f.startswith(os.path.splitext(os.path.basename(input_path))[0]):
                    return {
                        'success': True,
                        'output_path': os.path.join(output_dir, f),
                        'format': format
                    }
            raise Exception("Output file not found after conversion")
            
    except Exception as e:
        raise Exception(f"LibreOffice conversion failed: {str(e)}")

async def pdf_to_images(input_path: str, output_dir: str, format: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """Convert PDF to images using pdftoppm (poppler)"""
    
    format_map = {
        'jpg': 'jpeg',
        'png': 'png',
        'webp': 'webp'
    }
    
    if format not in format_map:
        raise Exception(f"Unsupported image format: {format}")
    
    os.makedirs(output_dir, exist_ok=True)
    
    dpi = options.get('dpi', 150)
    pages = options.get('pages', 'all')
    
    cmd = [
        'pdftoppm',
        '-r', str(dpi),
        '-{}'.format(format_map[format]),
        input_path,
        os.path.join(output_dir, 'page')
    ]
    
    if pages != 'all':
        # pdftoppm uses -f for first page, -l for last page
        if '-' in pages:
            start, end = pages.split('-')
            cmd.extend(['-f', start, '-l', end])
        else:
            cmd.extend(['-f', pages, '-l', pages])
    
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()
        
        if proc.returncode != 0:
            raise Exception(f"pdftoppm failed")
        
        # List generated files
        files = sorted([f for f in os.listdir(output_dir) if f.startswith('page-')])
        output_paths = [os.path.join(output_dir, f) for f in files]
        
        return {
            'success': True,
            'output_paths': output_paths,
            'page_count': len(output_paths)
        }
    except Exception as e:
        raise Exception(f"PDF to images failed: {str(e)}")

async def images_to_pdf(input_paths: List[str], output_path: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """Convert images to PDF using img2pdf or pdflatex"""
    
    # Try img2pdf first
    try:
        import img2pdf
        with open(output_path, 'wb') as f:
            f.write(img2pdf.convert(input_paths))
        return {'success': True, 'output_path': output_path}
    except ImportError:
        pass
    
    # Fallback: use pdflatex with a simple template
    try:
        # Create a simple LaTeX file
        tex_content = r'''
\documentclass{article}
\usepackage[margin=0cm]{geometry}
\usepackage{graphicx}
\begin{document}
'''
        for img_path in input_paths:
            tex_content += f'\\includegraphics[width=\\textwidth,height=\\textheight,keepaspectratio]{{{img_path}}}\n\\newpage\n'
        tex_content += r'\end{document}'
        
        tex_path = output_path.replace('.pdf', '.tex')
        with open(tex_path, 'w') as f:
            f.write(tex_content)
        
        cmd = ['pdflatex', '-interaction=nonstopmode', '-output-directory', os.path.dirname(output_path), tex_path]
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()
        
        if os.path.exists(output_path):
            return {'success': True, 'output_path': output_path}
        raise Exception("pdflatex failed")
        
    except Exception as e:
        raise Exception(f"Images to PDF failed: {str(e)}")

async def pdf_to_office_libreoffice(input_path: str, output_dir: str, format: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """Convert PDF to Office format using LibreOffice"""
    return await run_libreoffice(input_path, output_dir, format, options)

async def office_to_pdf_libreoffice(input_path: str, output_dir: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """Convert Office document to PDF using LibreOffice"""
    return await run_libreoffice(input_path, output_dir, 'pdf', options)

async def pdf_to_docling(input_path: str, output_dir: str, format: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """Convert PDF using Docling (better for complex layouts)"""
    try:
        from docling.document_converter import DocumentConverter
        from docling.datamodel.base_models import InputFormat
        from docling.datamodel.pipeline_options import PdfPipelineOptions
        
        converter = DocumentConverter()
        
        # Configure pipeline
        pipeline_options = PdfPipelineOptions()
        pipeline_options.do_ocr = options.get('ocr', False)
        pipeline_options.do_table_structure = options.get('tables', False)
        
        converter = DocumentConverter(pipeline_options=pipeline_options)
        
        result = converter.convert(input_path)
        
        if format == 'docx':
            output_path = os.path.join(output_dir, os.path.splitext(os.path.basename(input_path))[0] + '.docx')
            result.document.save_as_docx(output_path)
        elif format == 'md':
            output_path = os.path.join(output_dir, os.path.splitext(os.path.basename(input_path))[0] + '.md')
            result.document.save_as_markdown(output_path)
        elif format == 'html':
            output_path = os.path.join(output_dir, os.path.splitext(os.path.basename(input_path))[0] + '.html')
            result.document.save_as_html(output_path)
        else:
            raise Exception(f"Docling doesn't support format: {format}")
        
        return {'success': True, 'output_path': output_path}
        
    except ImportError:
        raise Exception("Docling not installed")
    except Exception as e:
        raise Exception(f"Docling conversion failed: {str(e)}")

async def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No operation specified'}))
        sys.exit(1)
    
    operation = sys.argv[1]
    
    try:
        if operation == 'libreoffice':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            format = sys.argv[4]
            options = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {}
            
            result = await run_libreoffice(input_path, output_dir, format, options)
            print(json.dumps(result))
            
        elif operation == 'pdf-to-images':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            format = sys.argv[4]
            options = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {}
            
            result = await pdf_to_images(input_path, output_dir, format, options)
            print(json.dumps(result))
            
        elif operation == 'images-to-pdf':
            input_paths = json.loads(sys.argv[2])
            output_path = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await images_to_pdf(input_paths, output_path, options)
            print(json.dumps(result))
            
        elif operation == 'pdf-to-docling':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            format = sys.argv[4]
            options = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {}
            
            result = await pdf_to_docling(input_path, output_dir, format, options)
            print(json.dumps(result))
            
        elif operation == 'pdf-to-office':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            format = sys.argv[4]
            options = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {}
            
            result = await pdf_to_office_libreoffice(input_path, output_dir, format, options)
            print(json.dumps(result))
            
        elif operation == 'office-to-pdf':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await office_to_pdf_libreoffice(input_path, output_dir, options)
            print(json.dumps(result))
            
        else:
            print(json.dumps({'error': f'Unknown operation: {operation}'}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())