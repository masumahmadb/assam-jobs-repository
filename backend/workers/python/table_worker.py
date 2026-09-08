#!/usr/bin/env python3
"""
Table Worker - Camelot + pdfplumber for table extraction
"""

import sys
import json
import os
import tempfile
import asyncio
from pathlib import Path

async def extract_tables_camelot(input_path: str, output_dir: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Extract tables using Camelot"""
    
    try:
        import camelot
    except ImportError:
        raise Exception("Camelot not installed. Install with: pip install camelot-py[cv2]")
    
    pages = options.get('pages', 'all')
    flavor = options.get('flavor', 'lattice')  # lattice or stream
    line_scale = options.get('lineScale', 40)
    copy_text = options.get('copyText', ['v', 'h'])
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Extract tables
        tables = camelot.read_pdf(
            input_path,
            pages=pages,
            flavor=flavor,
            line_scale=line_scale,
            copy_text=copy_text,
            suppress_stdout=True
        )
        
        if tables.n == 0:
            return {
                'success': True,
                'tables': [],
                'count': 0,
                'message': 'No tables found'
            }
        
        results = []
        for i, table in enumerate(tables):
            # Save as CSV
            csv_path = os.path.join(output_dir, f'table_{i+1}.csv')
            table.to_csv(csv_path)
            
            # Save as Excel
            xlsx_path = os.path.join(output_dir, f'table_{i+1}.xlsx')
            table.to_excel(xlsx_path)
            
            # Get JSON
            json_data = table.df.to_dict(orient='records')
            
            # Get accuracy/confidence
            accuracy = getattr(table, 'accuracy', None)
            
            results.append({
                'index': i,
                'page': table.page,
                'shape': table.shape,
                'accuracy': accuracy,
                'csv_path': csv_path,
                'xlsx_path': xlsx_path,
                'data': json_data,
                'confidence': accuracy
            })
        
        return {
            'success': True,
            'tables': results,
            'count': len(results),
            'message': f'Extracted {len(results)} table(s)'
        }
        
    except Exception as e:
        raise Exception(f"Camelot extraction failed: {str(e)}")

async def extract_tables_pdfplumber(input_path: str, output_dir: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Extract tables using pdfplumber (fallback)"""
    
    try:
        import pdfplumber
    except ImportError:
        raise Exception("pdfplumber not installed. Install with: pip install pdfplumber")
    
    pages = options.get('pages', 'all')
    table_settings = options.get('tableSettings', {
        'vertical_strategy': 'lines',
        'horizontal_strategy': 'lines',
        'snap_tolerance': 3,
        'join_tolerance': 3,
        'edge_min_length': 3,
        'min_words_vertical': 3,
        'min_words_horizontal': 1,
        'keep_blank_chars': True
    })
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        with pdfplumber.open(input_path) as pdf:
            page_nums = range(len(pdf.pages)) if pages == 'all' else parse_pages(pages, len(pdf.pages))
            
            results = []
            for page_num in page_nums:
                page = pdf.pages[page_num]
                tables = page.extract_tables(table_settings)
                
                for table_idx, table in enumerate(tables):
                    if not table or len(table) < 2:
                        continue
                    
                    # Convert to list of lists (handle None values)
                    clean_table = [[cell if cell is not None else '' for cell in row] for row in table]
                    
                    if len(clean_table) < 2:
                        continue
                    
                    # Save CSV
                    csv_path = os.path.join(output_dir, f'page{page_num+1}_table{table_idx+1}.csv')
                    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
                        import csv
                        writer = csv.writer(f)
                        writer.writerows(clean_table)
                    
                    # Save Excel
                    xlsx_path = os.path.join(output_dir, f'page{page_num+1}_table{table_idx+1}.xlsx')
                    try:
                        import openpyxl
                        wb = openpyxl.Workbook()
                        ws = wb.active
                        for row in clean_table:
                            ws.append(row)
                        wb.save(xlsx_path)
                    except:
                        pass
                    
                    results.append({
                        'page': page_num + 1,
                        'table_index': table_idx + 1,
                        'rows': len(clean_table),
                        'cols': len(clean_table[0]) if clean_table else 0,
                        'csv_path': csv_path,
                        'xlsx_path': xlsx_path,
                        'data': clean_table
                    })
        
        if not results:
            return {
                'success': True,
                'tables': [],
                'count': 0,
                'message': 'No tables found with pdfplumber'
            }
        
        return {
            'success': True,
            'tables': results,
            'count': len(results),
            'message': f'Extracted {len(results)} table(s) with pdfplumber'
        }
        
    except Exception as e:
        raise Exception(f"pdfplumber extraction failed: {str(e)}")

async def extract_tables_ocr(input_path: str, output_dir: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """Extract tables from scanned PDFs using OCR + table detection"""
    # This would use OCRmyPDF + Camelot/pdflumber
    # For now, return not implemented
    return {
        'success': False,
        'error': 'OCR table extraction not yet implemented. Use OCR first, then extract tables.'
    }

def parse_pages(pages_str: str, total_pages: int) -> List[int]:
    """Parse page string like '1-3,5,7-9' into list of page numbers (0-indexed)"""
    if pages_str == 'all':
        return list(range(total_pages))
    
    pages = set()
    for part in pages_str.split(','):
        part = part.strip()
        if '-' in part:
            start, end = part.split('-')
            start, end = int(start), int(end)
            pages.update(range(max(1, start), min(total_pages, end) + 1))
        else:
            pages.add(int(part))
    
    # Convert to 0-indexed and filter valid
    return sorted([p - 1 for p in pages if 1 <= p <= total_pages])

async def extract_tables_ocr_first(input_path: str, output_dir: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """OCR first, then extract tables"""
    # This would run OCRmyPDF first, then extract tables
    # For now, return not implemented
    return {
        'success': False,
        'error': 'OCR + table extraction pipeline not yet implemented. Run OCR first, then extract tables.'
    }

async def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No operation specified'}))
        sys.exit(1)
    
    operation = sys.argv[1]
    
    try:
        if operation == 'camelot':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await extract_tables_camelot(input_path, output_dir, options)
            print(json.dumps(result))
            
        elif operation == 'pdfplumber':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await extract_tables_pdfplumber(input_path, output_dir, options)
            print(json.dumps(result))
            
        elif operation == 'ocr-table':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await extract_tables_ocr(input_path, output_dir, options)
            print(json.dumps(result))
            
        elif operation == 'ocr-first':
            input_path = sys.argv[2]
            output_dir = sys.argv[3]
            options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
            
            result = await extract_tables_ocr_first(input_path, output_dir, options)
            print(json.dumps(result))
            
        else:
            print(json.dumps({'error': f'Unknown operation: {operation}'}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())