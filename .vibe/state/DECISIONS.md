# Architectural Decisions

## Frontend Architecture
- **React 18 + Vite** - Modern, fast, good ecosystem
- **Tailwind CSS** - Utility-first, consistent design system
- **21st.dev components** - Pre-built accessible components, customized with tea/muga/sand tokens
- **React Router v6** - File-based routing via App.jsx
- **Context API** - Auth, Language, Theme, PDFEditor (no Redux/Zustand needed)
- **Lazy loading** - Code splitting for heavy tools (PDF Editor, CV Builder, etc.)

## Backend Architecture
- **Express + BullMQ + Redis** - Job queue for heavy PDF operations
- **Python workers** - OCRmyPDF, LibreOffice, Docling, Camelot for specialized tasks
- **pdf-lib (Node.js)** - Lightweight operations (merge, rotate, watermark, etc.)
- **Multer** - File uploads to temp directory with cleanup
- **Docker** - Containerized deployment with all system dependencies

## Authentication & Authorization
- **Firebase Auth** - Email/password + Google OAuth for users
- **Employer auth** - Email-link (passwordless) via Firebase Functions (planned)
- **Admin** - Custom claim `admin: true` on Firebase Auth token
- **Route guards** - PrivateRoute, EmployerRoute in App.jsx

## Data Layer
- **Firestore** - Primary database (user_profiles, job_listings, private_jobs, employers, vault_documents, chat_history, updates)
- **Firebase Storage** - User vault documents (10MB limit), notice PDFs for extraction
- **Offline persistence** - IndexedDB via `enableIndexedDbPersistence`

## PDF Processing Strategy
- **Client-side (pdf-lib)** - Fast operations: merge, split, rotate, reorder, watermark, page numbers, flatten, metadata
- **Server-side (Python workers)** - Heavy operations: OCR, conversion, compression, table extraction, PAdES signing
- **Hybrid** - Browser Tesseract.js fallback for small OCR jobs

## Job Scraping
- **Termux (Android)** - Daily cron for Indian IP bypass
- **Gemini 2.5 Flash** - Extract structured data from notice PDFs
- **trafilatura** - Web scraping for HTML sources
- **Firestore** - Auto-approved govt jobs in `job_listings`

## Design System
- **Colors**: tea (primary), muga (accent), sand (neutral), gamosa (highlight)
- **Dark mode** - Full support via Tailwind `dark:` variants
- **Animations** - slide-up, fade-in, scale-in, pulse-soft
- **Responsive** - Mobile-first, breakpoints: 375, 768, 1024, 1440

## Security Decisions
- **Client secrets** - Only Firebase web config in `.env` (VITE_* prefixed)
- **Server secrets** - Gemini API key in Cloud Functions secret manager only
- **PDF processing** - Temp files auto-cleaned after 1 hour
- **File uploads** - 200MB max, type validation, no execution

## Deployment
- **Frontend** - Vercel (static + PWA)
- **Backend** - Docker on Cloud Run / Render / Railway
- **Firebase** - Auth, Firestore, Storage, Functions, Hosting (optional)
- **Android** - Capacitor (native shell) or Bubblewrap (TWA)

## Rejected Alternatives
- ❌ Next.js - Overkill for SPA, Vite simpler
- ❌ Redux/Zustand - Context sufficient for current state
- ❌ Firebase Functions for PDF - Too slow, cold starts, 540s timeout
- ❌ Paid OCR APIs - Cost, privacy; using OCRmyPDF + Tesseract
- ❌ Electron - Web-first PWA wraps to Android via Capacitor

## Decisions Made This Session (2026-09-24)
- ✅ **ESLint 9 flat config** - Added `eslint.config.js` with React/recommended, react-hooks/recommended, custom rules for no-unused-vars (underscore prefix), no-console (warn only for warn/error)
- ✅ **Code splitting** - Confirmed working for PDF Editor (440 kB), CV Builder (361 kB), Photo Resizer (2.8 kB), Document Scanner (2.5 kB)
- ✅ **Duplicate removal** - Removed duplicate tool categories in PDFEditor.jsx (lines 36-45), 14 duplicate export statements in PDF Editor tools, 6 duplicate imports
- ✅ **Import hygiene** - Added missing imports (FiBookOpen, FiRefreshCw, FiUser, FiFilter, FiSearch, FiMapPin, Badge, FiX), removed unused imports
- ✅ **Entity escaping** - Fixed 15+ unescaped apostrophe/quote entities across 8 files using `&apos;`, `"`
- ✅ **React hooks compliance** - Fixed Input.jsx `useId()` conditional call violation
- ✅ **TypeScript syntax removal** - Fixed JobPortalExample.jsx `job: any` type annotation

## Open Decisions
- [ ] Backend hosting: Cloud Run vs Render vs Railway vs VPS
- [ ] Redis: Local Docker vs Upstash vs Redis Cloud
- [ ] Employer auth: Email-link (Functions) vs custom token
- [ ] Admin claims: Custom claims vs Firestore `admins` collection
- [ ] Analytics: Firebase Analytics vs Plausible vs custom
- [ ] Error tracking: Sentry vs LogRocket vs custom
- [ ] Bundle optimization: manualChunks for vendor/firebase/pdf-lib
- [ ] PDF Editor parsing errors: Fix 10 tool components with JSX parsing issues