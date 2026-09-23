# Tool Verification Report - Assam Jobs Repository

**Date**: 2026-09-24  
**Session**: Phase 2 - Verify `.vibe/registry/tools.yaml` against actual state

---

## Summary

| Status | Count |
|--------|-------|
| **Installed & Configured** | 28 |
| **Installed, Not Configured** | 2 |
| **Not Installed (Planned)** | 18 |
| **Available to Agent** | 30 |
| **Used This Session** | 8 |

---

## Detailed Tool Status

### ✅ Installed & Configured (Active)

| Tool | Category | Installed | Configured | Available | Used This Session | Integration Method | Location |
|------|----------|-----------|------------|-----------|-------------------|-------------------|----------|
| **Vite** | build | ✅ | ✅ | ✅ | ✅ | CLI + config | `vite.config.js`, `package.json:devDependencies` |
| **React 18** | framework | ✅ | ✅ | ✅ | ✅ | Library | `package.json:dependencies` |
| **Tailwind CSS 3** | styling | ✅ | ✅ | ✅ | ✅ | CLI + PostCSS | `tailwind.config.js`, `postcss.config.js` |
| **React Router v6** | routing | ✅ | ✅ | ✅ | ✅ | Library | `package.json:dependencies`, `src/App.jsx` |
| **21st.dev Components** | ui-library | ✅ | ✅ | ✅ | ✅ | Local components + MCP | `src/components/ui/21st/` |
| **react-icons (Fi)** | icons | ✅ | ✅ | ✅ | ✅ | Library | `package.json:dependencies` |
| **vite-plugin-pwa / Workbox** | pwa | ✅ | ✅ | ✅ | ✅ | Vite plugin | `vite.config.js`, `package.json:devDependencies` |
| **Firebase SDK v10** | backend | ✅ | ✅ | ✅ | ✅ | Library | `package.json:dependencies`, `src/firebase/*.js` |
| **Express.js** | backend | ✅ | ✅ | ✅ | ❌ | Library | `backend/package.json:dependencies`, `backend/server.js` |
| **BullMQ** | queue | ✅ | ✅ | ✅ | ❌ | Library | `backend/package.json:dependencies`, `backend/queue/bullmq.js` |
| **pdf-lib** | pdf | ✅ | ✅ | ✅ | ✅ | Library | `package.json:dependencies`, `backend/package.json:dependencies`, used in frontend + backend |
| **pdfjs-dist** | pdf | ✅ | ✅ | ✅ | ✅ | Library | `package.json:dependencies`, `src/components/utilities/pdf-editor/PDFEditor.jsx` |
| **trafilatura** | scraping | ✅ | ✅ | ✅ | ❌ | Python library | `scripts/scrapegraph/requirements.txt` |
| **cheerio** | scraping | ✅ | ✅ | ✅ | ✅ | Library | `package.json:dependencies`, `scripts/scrapeGovtJobs.js` |
| **ESLint 9 (flat config)** | lint | ✅ | ✅ | ✅ | ✅ | CLI + config | `eslint.config.js`, `package.json:devDependencies` |
| **Google Gemini 2.5 Flash** | ai | ✅ | ⚠️ | ✅ | ❌ | API (Cloud Functions) | `functions/package.json:dependencies`, `functions/index.js` |
| **Firebase Functions** | backend | ✅ | ⚠️ | ✅ | ❌ | Library + Cloud | `functions/package.json`, `functions/index.js` |

### ⚠️ Installed, Not Fully Configured

| Tool | Category | Installed | Configured | Issue |
|------|----------|-----------|------------|-------|
| **Google Gemini 2.5 Flash** | ai | ✅ | ⚠️ | API key not set in Functions secret (`GEMINI_API_KEY`) |
| **Firebase Functions** | backend | ✅ | ⚠️ | Deployed code exists but not deployed to Firebase; requires `GEMINI_API_KEY` secret |

### ❌ Not Installed (Planned/On-Demand)

| Tool | Category | Status | When Needed |
|------|----------|--------|-------------|
| **Redis** | infrastructure | Planned | Backend workers deployment (BullMQ requires Redis) |
| **OCRmyPDF** | pdf-ocr | Planned | OCR tool category deployment |
| **Tesseract OCR** | pdf-ocr | Planned | OCR tool category deployment |
| **LibreOffice** | pdf-convert | Planned | Convert tool category deployment |
| **Docling** | pdf-convert | Planned | Convert tool category (complex layouts) |
| **Camelot / pdfplumber** | pdf-table | Planned | Extract → Tables tool |
| **PyMuPDF (fitz)** | pdf | Planned | Clean, Optimize, Info tools |
| **img2pdf** | pdf-convert | Planned | Images → PDF tool |
| **Oxlint** | lint | Available | Fast CI checks (optional) |
| **Playwright** | testing | Planned | E2E testing |
| **Docker** | infrastructure | Planned | Backend containerization (not in PATH) |
| **Multi-stage Dockerfile** | infrastructure | Planned | Production backend image |
| **Sentry** | monitoring | Available | Production error tracking |
| **Firebase Analytics** | analytics | Available | Production analytics |

### ❌ Backend Python Workers (Declared in requirements.txt, Not Installed Locally)

| Tool | Category | In requirements.txt | Local Python Env |
|------|----------|---------------------|------------------|
| **OCRmyPDF** | pdf-ocr | ✅ | ❌ (needs Docker) |
| **Tesseract** | pdf-ocr | ✅ (via pytesseract) | ❌ |
| **pymupdf (PyMuPDF)** | pdf | ✅ | ❌ |
| **pdfplumber** | pdf-table | ✅ | ❌ |
| **camelot-py[cv2]** | pdf-table | ✅ | ❌ |
| **docling** | pdf-convert | ✅ | ❌ |
| **opencv-python-headless** | utilities | ✅ | ❌ |
| **pillow** | utilities | ✅ | ❌ |
| **img2pdf** | pdf-convert | ✅ | ❌ |
| **redis (Python)** | infrastructure | ✅ | ❌ |

---

## Tools Available to Current Coding Agent

| Tool | Available | How |
|------|-----------|-----|
| **bash** | ✅ | Native shell access |
| **read/write/edit/glob/grep** | ✅ | Built-in file tools |
| **task/agent** | ✅ | Subagent spawning |
| **webfetch/websearch** | ✅ | Web access |
| **skill (opencode skills)** | ✅ | `.opencode/skill/` |
| **npm/npx** | ✅ | Node.js in PATH |
| **python/pip** | ✅ | Python 3.12 in PATH |
| **firebase CLI** | ❌ | Not installed globally |
| **docker** | ❌ | Not in PATH (Docker Desktop not running) |
| **git** | ✅ | Git in PATH |

---

## Actually Used This Session

| Tool | Used For |
|------|----------|
| **bash** | git commands, npm install, npm run lint/build |
| **read** | Reading package.json, config files, source files |
| **write** | Creating eslint.config.js, .vibe state files |
| **edit** | Fixing imports, unescaped entities, duplicate exports |
| **glob** | Finding file patterns |
| **grep** | Searching for patterns in code |
| **npm/npx** | Installing ESLint plugins, running lint/build |
| **git** | Committing and pushing changes |

---

## Genuinely Useful for Phase 2 (Current Work)

### Must Have (Already Working)
1. **ESLint 9** - Linting and code quality enforcement
2. **bash + file tools** - Core development workflow
3. **npm/npx** - Package management and scripts
4. **git** - Version control
5. **Firebase SDK** - Auth, Firestore, Storage operations
6. **React + Vite + Tailwind** - Frontend development stack

### Should Activate Soon
7. **Firebase Functions** - Need to deploy with `GEMINI_API_KEY` secret for:
   - `extractJobFromUpload` (job scraping)
   - `synthesizeAndNotify` (push notifications)
   - `chatWithAssistant` (AI Assistant page)
   - `cleanupExpiredJobs` (daily cleanup)

8. **Redis** - Required for BullMQ queue (backend workers)
9. **Docker** - Required for backend deployment with Python workers

### On-Demand Only (Defer Until Needed)
- **Playwright** - Only when E2E testing phase begins
- **Oxlint** - Only if ESLint becomes too slow
- **Sentry** - Only for production deployment
- **Firebase Analytics** - Only for production launch
- **All Python workers (OCRmyPDF, LibreOffice, Docling, etc.)** - Only when backend workers are containerized and deployed

---

## Configuration Locations

| Tool | Config Location |
|------|-----------------|
| ESLint 9 | `eslint.config.js` (root) |
| Vite | `vite.config.js` (root) |
| Tailwind | `tailwind.config.js` (root) |
| PostCSS | `postcss.config.js` (root) |
| TypeScript | Not configured |
| Firebase | `src/firebase/config.js`, `firestore.rules`, `storage.rules` |
| Backend Express | `backend/server.js`, `backend/package.json` |
| BullMQ | `backend/queue/bullmq.js` |
| Firebase Functions | `functions/index.js`, `functions/package.json` |
| Python Workers | `backend/requirements.txt`, `backend/workers/python/*.py` |
| Scraping | `scripts/scrapeGovtJobs.js`, `scripts/scrapegraph/requirements.txt` |
| PWA | `vite.config.js` (VitePWA plugin) |

---

## Recommendations

1. **Install Docker Desktop** - Required for backend deployment verification
2. **Deploy Firebase Functions** - Run `firebase functions:secrets:set GEMINI_API_KEY` then `firebase deploy --only functions`
3. **Install Firebase CLI** - `npm install -g firebase-tools` for rules/functions deployment
4. **Keep Python workers in Docker only** - Don't install locally; they require system deps (LibreOffice, Ghostscript, Tesseract)
4. **Defer Playwright, Sentry, Analytics** - Until pre-production phase

---

## Registry Update Needed

The following tools in `.vibe/registry/tools.yaml` have outdated status:

| Tool | Current Status | Actual Status | Action |
|------|----------------|---------------|--------|
| ESLint 9 | "pending" | "active" | Update to "active" |
| Firebase Functions | "planned" | "installed, needs deploy" | Update status |
| Google Gemini | "planned" | "installed, needs API key" | Update status |
| Docker | "planned" | "not installed" | Keep "planned" |
| Redis | "planned" | "not installed" | Keep "planned" |
| All Python workers | "planned" | "declared in requirements.txt" | Keep "planned" |

*Recommendation: Update `.vibe/registry/tools.yaml` statuses to match actual state before next session.*