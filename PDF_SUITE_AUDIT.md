# PDF Suite Upgrade - Audit & Implementation Plan

## Current State Audit (as of 2025-09-08)

### Existing PDF Editor Features (PRESERVE - Do Not Rebuild)
| Feature | Status | Engine | Location |
|---------|--------|--------|----------|
| Merge PDFs | ✅ Working | pdf-lib | `PDFEditor.jsx` lines 52-73 |
| Rotate Pages (90°) | ✅ Working | pdf-lib | `PDFEditor.jsx` lines 88-94 |
| Delete Pages | ✅ Working | pdf-lib | `PDFEditor.jsx` lines 96-100 |
| Reorder Pages (Move Up/Down) | ✅ Working | pdf-lib | `PDFEditor.jsx` lines 102-113 |
| Add Blank Pages | ✅ Working | pdf-lib | `PDFEditor.jsx` lines 115-120 |
| Zoom/Preview | ✅ Working | pdf.js | `PDFEditor.jsx` lines 75-86 |
| Save/Download | ✅ Working | pdf-lib | `PDFEditor.jsx` lines 122-135 |
| Print | ✅ Working | browser | `PDFEditor.jsx` line 243 |
| Page Thumbnails | ✅ Working | pdf.js | `PDFEditor.jsx` lines 252-285 |
| Multi-file Management | ✅ Working | pdf-lib | `PDFEditor.jsx` lines 6-16 |

### Tech Stack (Current)
- **Frontend**: React 18 + Vite + Tailwind CSS
- **PDF Engine (browser)**: pdf-lib + pdfjs-dist
- **Bundle**: ~1.7MB (needs code-splitting)

---

## Missing Features by Category (Build Order)

### 1. EDIT FOUNDATION (Priority 1)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Add/Edit Text (bold/italic/underline/color/highlight/strikethrough) | pdf-lib | Medium | No |
| Insert/Resize/Move Images | pdf-lib | Medium | No |
| Draw (pen/line/rect/circle/arrow) | pdf-lib + canvas | Medium | No |
| Sticky Notes/Annotations | pdf-lib | Medium | No |
| Undo/Redo System | Custom state | Medium | No |
| Form Field Fill (text/checkbox/radio/dropdown/date/signature) | pdf-lib | Medium | No |

### 2. OCR (Priority 2) - REQUIRES BACKEND
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Image → Text | Tesseract.js (browser) / OCRmyPDF (server) | High | Yes |
| Scanned → Searchable PDF | OCRmyPDF + Tesseract | High | Yes |
| Per-page / Full-doc OCR | OCRmyPDF | High | Yes |
| Multi-language (Assamese, Hindi, English) | Tesseract | High | Yes |
| Deskew/Clean | OCRmyPDF | High | Yes |
| Copy/Download extracted text | Tesseract.js | Medium | No |

### 3. CONVERT (Priority 3) - REQUIRES BACKEND
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| PDF → DOCX/XLSX/CSV/TXT/JPG/PNG/WebP | LibreOffice + Docling + pdfjs | High | Yes |
| DOCX/XLSX/PPTX/JPG/PNG/TXT/HTML → PDF | LibreOffice + pdf-lib | High | Yes |

### 4. TABLE EXTRACTION (Priority 4) - REQUIRES BACKEND
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| All/Selected pages → Preview → CSV/XLSX | Camelot + pdfplumber | High | Yes |
| OCR fallback for scans | OCRmyPDF + Camelot | High | Yes |
| Confidence warning | Camelot | Medium | Yes |

### 5. COMPRESS (Priority 5)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Presets (Lossless/Recommended/High/Maximum) | QPDF + Ghostscript | Medium | Yes (for GS) |
| DPI/Image quality controls | Ghostscript | Medium | Yes |
| Metadata strip | pdf-lib | Low | No |
| Before/After size display | Custom | Low | No |

### 6. ORGANIZE (Priority 6)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Extract Pages | pdf-lib | Low | No |
| Split by Range / Every-N Pages | pdf-lib | Low | No |
| Duplicate/Replace Page | pdf-lib | Low | No |
| Crop Pages | pdf-lib | Medium | No |
| Resize (A4/A3/Letter/Legal/Custom) | pdf-lib | Medium | No |
| Page Numbering | pdf-lib | Low | No |

### 7. SECURITY (Priority 7)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Password Protect/Remove | pdf-lib | Low | No |
| Encryption (AES-256) | pdf-lib | Low | No |
| Print/Copy/Edit Permissions | pdf-lib | Low | No |
| Metadata Removal | pdf-lib | Low | No |
| Strip Embedded JS/Hidden Objects | pdf-lib | Low | No |

### 8. REDACT (Priority 8)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Draw Redaction Box | pdf-lib | Medium | No |
| Redact Selected/Searched Text | pdf-lib | Medium | No |
| Auto-redact Emails/Phones/Keywords | pdf-lib | Medium | No |
| **Must remove underlying content (not paint over)** | pdf-lib | High | No |

### 9. SIGN (Priority 9)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| e-Signature (Draw/Type/Upload) | pdf-lib + canvas | Medium | No |
| Place/Move/Resize/Rotate Signature | pdf-lib + canvas | Medium | No |
| Date/Name Auto-fill | Custom | Low | No |
| **Separate from PAdES/Certificate signing** | EU DSS | High | Yes |

### 10. CLEAN/OPTIMIZE (Priority 10) - "Advanced"
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Strip Metadata/Annotations/Comments | pdf-lib | Low | No |
| Flatten Annotations/Forms | pdf-lib | Low | No |
| Remove Blank Pages | pdf-lib | Low | No |
| Repair Corrupted PDFs | QPDF | Medium | Yes |
| Optimize | QPDF + Ghostscript | Medium | Yes |
| PDF/A Conversion | Ghostscript | High | Yes |

### 11. SEARCH & EXTRACT (Priority 11)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Text Search (case-sensitive, basic regex) | pdf-lib + pdf.js | Low | No |
| Highlight Results | pdf.js | Low | No |
| Extract Text/Images | pdf-lib + pdf.js | Low | No |
| Auto-OCR Scanned Docs First | Tesseract.js | High | Yes |

### 12. FORMS (Priority 12)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Fill Fields (text/checkbox/radio/dropdown/date/signature) | pdf-lib | Medium | No |
| Save/Flatten | pdf-lib | Low | No |

### 13. WATERMARK (Priority 13)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Text/Image Watermark | pdf-lib | Medium | No |
| Opacity/Rotation/Position | pdf-lib | Medium | No |
| All/Selected Pages | pdf-lib | Low | No |
| Presets (CONFIDENTIAL/SAMPLE/DRAFT/COPY/STUDY MATERIAL) | Custom | Low | No |

### 14. HEADER/FOOTER (Priority 14)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Text + Page Numbers (X of Y) | pdf-lib | Low | No |
| Date | pdf-lib | Low | No |
| Selected/All Pages | pdf-lib | Low | No |

### 15. PDF INFO PANEL (Priority 15)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| Page Count, Size, Version, Dimensions | pdf-lib | Low | No |
| Author/Title/Subject, Dates | pdf-lib | Low | No |
| Encryption/PDF-A/OCR Status | pdf-lib | Low | No |

### 16. COMPARE (Priority 16)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| A-vs-B Page/Text Diff | pdf-lib + diff | Medium | No |

### 17. PDF↔IMAGE (Priority 17)
| Feature | Engine | Complexity | Backend Needed |
|---------|--------|------------|----------------|
| PDF → JPG/PNG/WebP | pdf.js | Low | No |
| Image(s) → PDF | pdf-lib | Low | No |
| Download Selected Pages as Images | pdf.js | Low | No |

---

## Architecture Decision

### Frontend (Existing Project)
- **Location**: `src/components/utilities/PDFEditor.jsx` → Split into modular components
- **State Management**: React Context + useReducer for complex editor state
- **Code Splitting**: Lazy load heavy components per category

### Backend (NEW - Required for OCR, Convert, Compress, Tables, OCR Sign)
```
assam-jobs-repo/
├── backend/
│   ├── server.js              # Express API gateway
│   ├── workers/
│   │   ├── ocr-worker.js      # OCRmyPDF + Tesseract
│   │   ├── convert-worker.js  # LibreOffice + Docling
│   │   ├── compress-worker.js # Ghostscript + QPDF
│   │   ├── table-worker.js    # Camelot + pdfplumber
│   │   ├── sign-worker.js     # EU DSS for PAdES
│   │   └── optimize-worker.js # Ghostscript + QPDF
│   ├── queue/
│   │   └── bullmq.js          # Job queue (Redis)
│   ├── utils/
│   │   ├── pdf-utils.js       # Shared PDF utilities
│   │   └── file-handler.js    # Temp file management
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
```

### Engine Installation (Docker)
```dockerfile
# Base: python:3.11-slim + node:20
# Install: tesseract-ocr, ghostscript, qpdf, libreoffice, 
#          poppler-utils, ocrmypdf, camelot-py, pdfplumber, 
#          docling, pymupdf, european-dss
```

---

## Implementation Plan (Phased)

### Phase 1: Foundation & Edit (Week 1-2)
- [ ] Split `PDFEditor.jsx` into modular components
- [ ] Add React Context for editor state (undo/redo)
- [ ] Implement: Text edit, Image insert, Draw, Sticky notes
- [ ] Form field filling
- [ ] Undo/Redo system

### Phase 2: OCR Pipeline (Week 2-3)
- [ ] Backend: OCR worker with OCRmyPDF + Tesseract
- [ ] API: `/api/ocr` endpoint
- [ ] Frontend: OCR category UI
- [ ] Multi-language support (asm, hin, eng)
- [ ] Deskew/clean options

### Phase 3: Compression (Week 3)
- [ ] Backend: Ghostscript + QPDF worker
- [ ] Presets: Lossless/Recommended/High/Maximum
- [ ] DPI/Image quality controls
- [ ] Before/After size comparison

### Phase 4: Conversion (Week 4)
- [ ] Backend: LibreOffice + Docling worker
- [ ] PDF → Office formats
- [ ] Office → PDF

### Phase 4b: Table Extraction (Week 4-5)
- [ ] Backend: Camelot + pdfplumber worker
- [ ] Preview → CSV/XLSX export
- [ ] OCR fallback for scans

### Phase 5: Security/Redaction/Sign (Week 5-6)
- [ ] Redaction (true content removal)
- [ ] Password/Encrypt/Permissions
- [ ] e-Signature (draw/type/upload)
- [ ] PAdES signing (EU DSS) - separate category

### Phase 5b: Organize/Clean/Advanced (Week 6)
- [ ] Extract/Split/Duplicate/Replace/Crop/Resize
- [ ] Page numbering, Watermark, Header/Footer
- [ ] Clean/Optimize/Repair/PDF-A

### Phase 6: Forms/Search/Compare/PDF↔Image (Week 7)
- [ ] Form filling + flatten
- [ ] Search/Highlight/Extract
- [ ] Compare (A vs B)
- [ ] PDF ↔ Image

### Phase 7: Polish & Regression (Week 8)
- [ ] Full regression test (all 17 original features)
- [ ] Error handling & user-friendly messages
- [ ] Performance optimization
- [ ] Code splitting

---

## Dependencies to Add

### Frontend (package.json)
```json
{
  "dependencies": {
    "pdf-lib": "^1.17.1",           // ✅ existing
    "pdfjs-dist": "^4.0.0",         // ✅ existing
    "fabric": "^5.3.0",             // NEW: canvas drawing
    "react-dnd": "^16.0.1",         // NEW: drag-drop reorder
    "react-dnd-html5-backend": "^16.0.1",
    "zustand": "^4.4.0",            // NEW: global state
    "idb": "^8.0.0"                 // NEW: IndexedDB for large files
  }
}
```

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "bullmq": "^5.0.0",
    "ioredis": "^5.3.0",
    "multer": "^1.4.5",
    "pdf-lib": "^1.17.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### Python (requirements.txt)
```txt
# OCR
ocrmypdf==16.0.0
tesseract-ocr
tesseract-ocr-asm
tesseract-ocr-hin

# PDF Processing
pymupdf==1.23.0
pdfplumber==0.11.0
camelot-py[cv2]==0.11.0
qpdf==1.0.0

# OCR/Conversion
ocrmypdf==16.0.0
pytesseract==0.3.10
docling==2.0.0

# Compression/Optimization
ghostscript==0.7.0

# Office Conversion
libreoffice

# Table Extraction
camelot-py[cv2]==0.11.0

# Digital Signatures
dss-client==3.0.0

# Utilities
opencv-python-headless==4.8.0
pillow==10.0.0
```

---

## Server Infrastructure Requirements

| Component | Spec | Est. Cost |
|-----------|------|-----------|
| API Server | 2 vCPU, 4GB RAM | $20-40/mo |
| Redis | 1 vCPU, 2GB RAM | $10-15/mo |
| Workers (4x) | 2 vCPU, 4GB RAM each | $80-160/mo |
| Storage (temp files) | 50GB SSD | $5-10/mo |
| **Total** | | **~$115-225/mo** |

**Alternative**: Run workers on same server as API (2 vCPU, 8GB) = ~$40/mo

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large file handling (>100MB) | High | Chunked upload, streaming, IndexedDB |
| OCR accuracy (Assamese) | Medium | Train custom Tesseract model |
| LibreOffice headless stability | Medium | Restart worker on crash, timeout |
| Memory leaks (pdf.js) | Medium | Worker termination, canvas cleanup |
| Bundle size > 2MB | Medium | Code splitting, lazy loading |
| Corrupted PDF handling | High | Try/catch, QPDF repair fallback |

---

## Next Steps

1. **Create backend project structure** - Express + Python workers
2. **Dockerize** - Single docker-compose for all services
3. **Implement Phase 1** - Editor foundation (undo/redo, text, draw, images)
3. **Add API routes** to frontend
4. **Test existing features** - Ensure regression-free
5. **Phase 2** - OCR pipeline

---

## Files to Create/Modify

### New Files
- `backend/` - Entire backend directory
- `src/components/utilities/pdf-editor/` - Modular editor components
- `src/context/PDFEditorContext.jsx` - Global editor state
- `src/hooks/usePDFEditor.js` - Editor hooks
- `src/components/utilities/pdf-tools/` - Category components

### Modified Files
- `src/components/utilities/PDFEditor.jsx` → Split into modules
- `src/pages/Utilities.jsx` - Add new category tabs
- `package.json` - Add dependencies
- `vite.config.js` - Code splitting config

---

## Verification Checklist (Before Each Commit)

- [ ] Build passes (`npm run build`)
- [ ] All 17 original features work (regression test)
- [ ] New feature works end-to-end
- [ ] No paid APIs used
- [ ] No external SaaS calls
- [ ] Error handling for corrupt/large/password-protected PDFs
- [ ] Student-friendly error messages
- [ ] Bundle size < 2MB (after code splitting)
- [ ] Works offline for browser-only features

---

*Document created: 2025-09-08*
*Last updated: 2025-09-08*
*Status: Phase 0 - Audit Complete*