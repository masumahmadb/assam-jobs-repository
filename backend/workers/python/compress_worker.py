#!/usr/bin/env python3
"""
Compress Worker - Ghostscript + QPDF for PDF compression
"""

import sys
import json
import os
import tempfile
import subprocess
import asyncio
from pathlib import Path

async def run_ghostscript(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Compress PDF using Ghostscript"""
    
    preset = options.get('preset', 'recommended')
    dpi = options.get('dpi', 150)
    image_quality = options.get('imageQuality', 75)
    strip_metadata = options.get('stripMetadata', True)
    
    # Ghostscript quality settings
    preset_map = {
        'lossless': {
            'dPDFSETTINGS': '/printer',
            'dColorImageResolution': 300,
            'dGrayImageResolution': 300,
            'dMonoImageResolution': 300,
            'dDownsampleColorImages': 'false',
            'dDownsampleGrayImages': 'false',
            'dDownsampleMonoImages': 'false'
        },
        'recommended': {
            'dPDFSETTINGS': '/ebook',
            'dColorImageResolution': dpi,
            'dGrayImageResolution': dpi,
            'dMonoImageResolution': dpi,
            'dColorImageDownsampleType': '/Bicubic',
            'dGrayImageDownsampleType': '/Bicubic',
            'dMonoImageDownsampleType': '/Bicubic'
        },
        'high': {
            'dPDFSETTINGS': '/screen',
            'dColorImageResolution': max(72, dpi // 2),
            'dGrayImageResolution': max(72, dpi // 2),
            'dMonoImageResolution': max(72, dpi // 2),
            'dColorImageDownsampleType': '/Bicubic',
            'dGrayImageDownsampleType': '/Bicubic',
            'dMonoImageDownsampleType': '/Bicubic'
        },
        'maximum': {
            'dPDFSETTINGS': '/screen',
            'dColorImageResolution': 72,
            'dGrayImageResolution': 72,
            'dMonoImageResolution': 72,
            'dColorImageDownsampleType': '/Subsample',
            'dGrayImageDownsampleType': '/Subsample',
            'dMonoImageDownsampleType': '/Subsample'
        }
    }
    
    settings = preset_map.get(preset, preset_map['recommended'])
    
    cmd = [
        'gs',
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        '-dPrinted=false',
        '-dEmbedAllFonts=true',
        '-dSubsetFonts=true',
    ]
    
    # Add preset settings
    for key, value in settings.items():
        cmd.append(f'-d{key}={value}')
    
    # Image quality
    cmd.extend([
        f'-dColorImageDownsampleThreshold=1.5',
        f'-dGrayImageDownsampleThreshold=1.5',
        f'-dMonoImageDownsampleThreshold=1.5',
        f'-dEncodeColorImages=true',
        f'-dEncodeGrayImages=true',
        f'-dEncodeMonoImages=true',
        f'-sColorImageFilter=DCTEncode',
        f'-sGrayImageFilter=DCTEncode',
        f'-sMonoImageFilter=CCITTFaxEncode',
        f'-dJPEGQ={image_quality}',
    ])
    
    if strip_metadata:
        cmd.extend([
            '-dPreserveAnnots=false',
            '-dPreserveOPIComments=false',
            '-dPreserveOverprintSettings=false',
            '-dTransferFunctionInfo=Remove',
            '-dUCRandBGInfo=Remove',
        ])
    
    cmd.extend([
        f'-sOutputFile={output_path}',
        input_path
    ])
    
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            raise Exception(f"Ghostscript failed: {stderr.decode()}")
        
        if not os.path.exists(output_path):
            raise Exception("Output file not created")
        
        return {'success': True, 'output_path': output_path}
        
    except Exception as e:
        raise Exception(f"Ghostscript compression failed: {str(e)}")

async def run_qpdf_optimize(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Optimize PDF using QPDF"""
    
    cmd = [
        'qpdf',
        '--linearize',  # Fast web view
        '--replace-input',
        '--object-streams=generate',
        '--compress-streams=y',
        '--decode-level=all',
        input_path,
        output_path
    ]
    
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
        raise Exception(f"QPDF optimization failed: {str(e)}")

async def get_pdf_info(input_path: str) -> Dict[str, Any]:
    """Get PDF file info including size"""
    try:
        stat = os.stat(input_path)
        return {
            'size': stat.st_size,
            'size_mb': round(stat.st_size / (1024 * 1024), 2)
        }
    except:
        return {'size': 0, 'size_mb': 0}

async def compress_pdf(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Main compression function - tries Ghostscript first, falls back to QPDF"""
    
    # Get original size
    orig_info = await get_pdf_info(input_path)
    
    try:
        # Try Ghostscript first (better compression)
        result = await run_ghostscript(input_path, output_path, options)
        
        # Verify output
        if not os.path.exists(output_path):
            raise Exception("Output file not created")
        
        new_info = await get_pdf_info(output_path)
        
        return {
            'success': True,
            'output_path': output_path,
            'original_size': orig_info['size'],
            'compressed_size': new_info['size'],
            'compression_ratio': round((1 - new_info['size'] / orig_info['size']) * 100, 1) if orig_info['size'] > 0 else 0,
            'method': 'ghostscript'
        }
    except Exception as e:
        # Fallback to QPDF
        try:
            await run_qpdf_optimize(input_path, output_path, options)
            new_info = await get_pdf_info(output_path)
            
            return {
                'success': True,
                'output_path': output_path,
                'original_size': orig_info['size'],
                'compressed_size': new_info['size'],
                'compression_ratio': round((1 - new_info['size'] / orig_info['size']) * 100, 1) if orig_info['size'] > 0 else 0,
                'method': 'qpdf',
                'warning': f'Ghostscript failed, used QPDF fallback: {str(e)}'
            }
        except Exception as e2:
            raise Exception(f"Both Ghostscript and QPDF failed: {str(e2)}")

async def repair_pdf(input_path: str, output_path: str) -> Dict[str, Any]:
    """Repair corrupted PDF using QPDF"""
    cmd = ['qpdf', '--replace-input', '--decode-level=all', input_path, output_path]
    
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            raise Exception(f"QPDF repair failed: {stderr.decode()}")
        
        return {'success': True, 'output_path': output_path, 'method': 'qpdf'}
    except Exception as e:
        raise Exception(f"PDF repair failed: {str(e)}")

async def pdf_a_convert(input_path: str, output_path: str, level: str = '2b') -> Dict[str, Any]:
    """Convert to PDF/A using Ghostscript"""
    level_map = {'1b': '/PDFA1b', '2b': '/PDFA2b', '2u': '/PDFA2u', '3b': '/PDFA3b', '3u': '/PDFA3u'}
    
    if level not in level_map:
        raise Exception(f"Unsupported PDF/A level: {level}")
    
    cmd = [
        'gs',
        '-sDEVICE=pdfwrite',
        f'-dPDFA={level_map[level]}',
        '-dPDFACompatibilityPolicy=1',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
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

async def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No operation specified'}))
        sys.exit(1)
    
    operation = sys.argv[1]
    
    try:
        if operation == 'compress':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await compress_pdf(input_path, output_path, options)
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
            
        elif operation == 'info':
            input_path = sys.argv[2]
            info = await get_pdf_info(input_path)
            print(json.dumps({'success': True, 'info': info}))
            
        else:
            print(json.dumps({'error': f'Unknown operation: {operation}'}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())