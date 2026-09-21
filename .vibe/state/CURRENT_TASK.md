# Current Task

## Objective
Complete the remaining functionality, clean the codebase, harden security, and leave it professional and maintainable for the Assam Jobs Repository project.

## Phase
**Phase 1: Understand current state** (in progress)

## Current Focus
Comprehensive codebase inspection completed. Now identifying highest-priority unfinished tasks.

## Key Findings from Inspection

### ✅ Working Features
- Frontend: React 18 + Vite + Tailwind + PWA (build passes)
- Authentication: Firebase Auth (email/password + Google OAuth)
- Routing: 12 routes with PrivateRoute, EmployerRoute protection
- Pages: Home, Jobs, NewJobsNews, Utilities, Material, Profile, Assistant, Employer pages, AdminPanel
- UI Components: 21st.dev design system (13 components)
- PDF Editor: 17 tool categories, lazy-loaded, client-side with pdf-lib
- Backend: Express + BullMQ + Redis + 7 Python workers (OCR, Convert, Compress, Table, Sign, Optimize, Edit)
- Job scraping: Scripts ready for govt jobs (Gemini API + trafilatura)
- Firebase config: Auth, Firestore, Storage, Messaging with offline persistence

### ⚠️ Partial / Incomplete
1. **AdminPanel.jsx** - Only "overview" tab implemented; 7 other tabs (users, jobs, content, analytics, settings, security, logs) are stubs
2. **EmployerDashboard.jsx** - Uses mock data, no real Firestore integration
3. **EmployerLogin.jsx** - TODO: Implement employer sign in (passwordless/email-link)
4. **JobList/SectorExplorer** - Need to verify Firestore queries work
5. **Backend workers** - Created but not deployed/tested; require Redis, LibreOffice, OCRmyPDF, Docling
6. **Firebase Functions** - Referenced in README but `functions/` directory missing
7. **Private jobs collection** - Firestore rules missing for `private_jobs` and `employers` collections
8. **PDF Editor** - Duplicate tool categories in TOOL_CATEGORIES array (lines 36-45 duplicate 21-35)

### 🔴 Security Risks
1. **Firestore rules incomplete** - Missing rules for `private_jobs`, `employers`, `notices` collections
2. **Storage rules** - `/notices` allows any authenticated user to write (should be admin only)
3. **No rate limiting** on API endpoints
4. **No input validation** on backend endpoints (file upload, PDF operations)
5. **CORS** - Only allows single origin, no production domain configured
6. **Helmet CSP** - May be too permissive for PWA
7. **No authentication** on backend PDF API endpoints
8. **File upload** - 200MB limit, temp files cleaned every 15 min but no virus scanning

### 🏗️ Architecture Inconsistencies
1. **Duplicate tool categories** in PDFEditor.jsx (lines 36-45)
2. **Mock data** in EmployerDashboard, AdminPanel instead of real Firestore
3. **Missing `functions/` directory** for Cloud Functions (Gemini AI agents)
4. **Inconsistent error handling** - some try/catch, some not
5. **No ESLint config** - lint command fails
6. **Large bundle chunks** - 967 kB main chunk despite lazy loading

### 📋 Highest Priority Unfinished Tasks
1. **Fix AdminPanel** - Implement all 8 tabs with real Firestore data
2. **Complete Employer system** - Real auth + Firestore integration for job posting
3. **Fix Firestore/Storage rules** - Add missing collections, tighten permissions
4. **Deploy backend workers** - Dockerize, test with Redis, verify all 7 workers
5. **Add Firebase Functions** - Implement Gemini AI agents (extractJobFromUpload, synthesizeAndNotify, etc.)
6. **Remove duplicate tool categories** in PDFEditor.jsx
7. **Add ESLint config** and fix linting issues
8. **Security hardening** - Rate limiting, auth on backend, input validation
9. **Verify all 12 routes** work end-to-end
10. **Add integration tests** for critical flows

## Next Action
Fix the duplicate tool categories in PDFEditor.jsx (quick win), then begin Phase 2: Complete remaining functionality starting with AdminPanel and Employer system.