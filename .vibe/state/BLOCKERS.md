# Blockers & Risks

## Active Blockers

### 1. Firebase Functions Not Deployed
- **Impact**: Cannot use Gemini AI agents (extractJobFromUpload, synthesizeAndNotify, chatWithAssistant, cleanupExpiredJobs, summarizeNotification)
- **Status**: Code exists in `functions/`, needs `GEMINI_API_KEY` secret and deploy
- **Resolution**: 
  1. `firebase functions:secrets:set GEMINI_API_KEY`
  2. `firebase deploy --only functions`
- **Blocked Features**: Job scraping automation, AI Assistant, PDF summarizer, push notifications

### 2. Backend Not Deployed / Tested
- **Impact**: PDF Editor server-side tools (OCR, Convert, Compress, Table, PAdES) non-functional
- **Status**: Dockerfile exists but untested; requires Redis, LibreOffice, OCRmyPDF, Docling, Poppler
- **Resolution**: Build Docker image locally, test all 7 workers, then deploy
- **Note**: Docker not in PATH on current machine - need Docker Desktop or Codespaces

### 3. Firestore Rules Incomplete
- **Impact**: `private_jobs` and `employers` collections have no rules (open or denied)
- **Status**: Rules only cover job_listings, user_profiles, vault_documents, chat_history
- **Resolution**: Add rules for missing collections before enabling employer features

### 4. Storage Rules Over-Permissive
- **Impact**: Any authenticated user can write to `/notices/` (should be admin only)
- **Status**: Current rule: `allow write: if request.auth != null;`
- **Resolution**: Restrict to admin UIDs or custom claim

### 5. PDF Editor Tool Parsing Errors (12 lint errors)
- **Impact**: 10 PDF Editor tool components have JSX parsing errors blocking clean lint
- **Status**: CompareTools, ConvertTools, EditTools, ExtractTools, FormsTools, ImageTools, OCRTools, OrganizeTools, SecureTools, SignTools have issues
- **Resolution**: Fix adjacent JSX elements, duplicate declarations, unexpected tokens, missing closing tags

## Technical Risks

### 1. Large Bundle Size
- **Risk**: 967 kB main chunk affects load time on 2G/3G
- **Mitigation**: Add manualChunks in vite.config.js, analyze with rollup-plugin-visualizer

### 2. PDF Worker Dependencies
- **Risk**: LibreOffice (heavy), Docling (ML models), OCRmyPDF (system deps) may cause Docker build issues
- **Mitigation**: Use multi-stage build, consider separate worker images

### 3. Redis Connection in Production
- **Risk**: Local Redis won't work in serverless; need managed Redis
- **Mitigation**: Configure REDIS_URL for Upstash/Redis Cloud, test connection pooling

### 4. Firebase Functions Cold Starts
- **Risk**: Gemini API calls may timeout on cold start (>10s)
- **Mitigation**: Set minInstances=1 for critical functions, optimize imports

### 5. File Upload Security
- **Risk**: 200MB uploads, no virus scanning, temp files on disk
- **Mitigation**: Add ClamAV scan, stream to Storage directly, signed URLs

### 6. Employer Auth Not Implemented
- **Risk**: EmployerLogin.jsx has TODO, no real auth flow
- **Mitigation**: Implement email-link auth via Firebase Functions

## Dependency Risks

### Outdated / Vulnerable Packages
- `firebase@10.13.0` - Check for v11 migration
- `pdfjs-dist@6.3.289` - Frequent updates, verify compatibility
- `eslint@8.57.0` - ✅ RESOLVED: Upgraded to ESLint 9.17 with flat config

### Python Worker Dependencies
- `ocrmypdf==16.0.0` - Requires system: tesseract, ghostscript, qpdf, unpaper
- `docling==2.0.0` - Large ML models (~2GB), may need model caching
- `camelot-py[cv2]==0.11.0` - Requires opencv, ghostscript
- `libreoffice` - ~500MB install, headless mode

## Resource Constraints

### Low-End Machine (Development)
- Docker build may exceed memory
- Python workers need 2GB+ RAM for Docling models
- **Workaround**: Use GitHub Codespaces / Cloud Shell for heavy builds

### Cost Considerations
- Firebase Functions: Pay per invocation (generous free tier)
- Cloud Run: Pay per request + CPU/memory
- Redis: Upstash free tier 10k commands/day
- Vercel: Free for personal projects

## Decision Needed

1. **Backend hosting platform** - Affects Docker config, Redis, scaling
2. **Admin authorization model** - Custom claims vs Firestore collection
3. **Employer auth method** - Email-link (requires Functions) vs password
4. **PDF worker scaling** - Single container vs separate worker containers