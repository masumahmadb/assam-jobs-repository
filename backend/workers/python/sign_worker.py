#!/usr/bin/env python3
"""
Sign Worker - EU DSS for PAdES digital signatures
Also handles simple e-signatures
"""

import sys
import json
import os
import tempfile
import subprocess
import asyncio
from pathlib import Path
from typing import Dict, Any, Optional

async def sign_pades(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Sign PDF with PAdES using EU DSS (DSS CLI)"""
    
    # DSS CLI requires Java and DSS jar
    # This is a simplified implementation - full DSS integration is complex
    # For production, use the DSS REST API or library
    
    try:
        # Check if DSS is available
        dss_path = os.environ.get('DSS_CLI_PATH', '/opt/dss/dss-cli.jar')
        if not os.path.exists(dss_path):
            raise Exception("DSS CLI not found. Install DSS from https://ec.europa.eu/isa2/dss")
        
        # Build DSS command
        cmd = [
            'java', '-jar', dss_path,
            '-sign',
            '-input', input_path,
            '-output', output_path,
            '-keystore', options.get('keystore', ''),
            '-alias', options.get('alias', ''),
            '-storepass', options.get('storepass', ''),
            '-keypass', options.get('keypass', ''),
            '-level', options.get('level', 'PAdES_BASELINE_LTA'),
            '-reason', options.get('reason', 'Document signed'),
            '-location', options.get('location', ''),
            '-contact', options.get('contact', ''),
            '-timestamp', options.get('timestamp', 'true')
        ]
        
        # Add visual signature if provided
        if options.get('visual', {}).get('enabled'):
            visual = options['visual']
            cmd.extend([
                '-visual',
                '-page', str(visual.get('page', 1)),
                '-x', str(visual.get('x', 100)),
                '-y', str(visual.get('y', 100)),
                '-width', str(visual.get('width', 200)),
                '-height', str(visual.get('height', 100)),
                '-image', visual.get('image', '')
            ])
        
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            raise Exception(f"DSS signing failed: {stderr.decode()}")
        
        return {'success': True, 'output_path': output_path, 'standard': 'PAdES'}
        
    except FileNotFoundError:
        # Fallback: Use pdf-lib for simple certificate signing (not PAdES)
        return await sign_with_pdflib(input_path, output_path, options)
    except Exception as e:
        raise Exception(f"PAdES signing failed: {str(e)}")

async def sign_with_pdflib(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Fallback: Use pdf-lib for basic signing (not PAdES compliant)"""
    try:
        # This would use a Node.js subprocess with pdf-lib
        # For now, return not fully implemented
        return {
            'success': False,
            'error': 'Full PAdES signing requires EU DSS. Use /api/esign for simple e-signatures.'
        }
    except Exception as e:
        raise Exception(f"Fallback signing failed: {str(e)}")

async def validate_pades(input_path: str) -> Dict[str, Any]:
    """Validate PAdES signature"""
    try:
        dss_path = os.environ.get('DSS_CLI_PATH', '/opt/dss/dss-cli.jar')
        
        cmd = ['java', '-jar', dss_path, '-validate', '-input', input_path]
        
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            return {
                'valid': False,
                'error': stderr.decode()
            }
        
        # Parse DSS output
        # This is simplified - real implementation would parse XML output
        output = stdout.decode()
        return {
            'valid': 'VALID' in output.upper(),
            'details': output,
            'standard': 'PAdES'
        }
        
    except Exception as e:
        return {'valid': False, 'error': str(e)}

async def sign_esign(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Simple e-signature (draw/type/upload) - processed client-side with pdf-lib"""
    # This is handled client-side with pdf-lib
    # Server just validates and returns success
    return {
        'success': True,
        'message': 'e-signature handled client-side. Use pdf-lib on frontend.'
    }

async def add_signature_appearance(input_path: str, output_path: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Add visual signature appearance to PDF"""
    try:
        # This uses pdf-lib to add visual signature
        # Implementation would use Node.js subprocess
        return {
            'success': False,
            'error': 'Visual signature appearance handled client-side with pdf-lib'
        }
    except Exception as e:
        raise Exception(f"Signature appearance failed: {str(e)}")

async def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No operation specified'}))
        sys.exit(1)
    
    operation = sys.argv[1]
    
    try:
        if operation == 'pades':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await sign_pades(input_path, output_path, options)
            print(json.dumps(result))
            
        elif operation == 'validate':
            input_path = sys.argv[2]
            result = await validate_pades(input_path)
            print(json.dumps(result))
            
        elif operation == 'esign':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await sign_esign(input_path, output_path, options)
            print(json.dumps(result))
            
        elif operation == 'appearance':
            input_path = sys.argv[2]
            output_path = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await add_signature_appearance(input_path, output_path, options)
            print(json.dumps(result))
            
        else:
            print(json.dumps({'error': f'Unknown operation: {operation}'}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())