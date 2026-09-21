# Verification Checklist

## Build & Lint
- [x] `npm run build` - Production build passes
- [ ] `npm run lint` - ESLint passes (needs config)
- [ ] `npm run typecheck` - TypeScript check (not configured)
- [ ] Bundle analysis - Main chunk < 500 kB

## Route Verification (All 12 Routes)
- [ ] `/` - Home (PrivateRoute)
- [ ] `/login` - Login (Public)
- [ ] `/signup` - Signup (Public)
- [ ] `/profile-setup` - Onboarding (PrivateRoute)
- [ ] `/jobs` - Jobs (PrivateRoute)
- [ ] `/newjobsnews` - News (PrivateRoute)
- [ ] `/utilities` - Tools (PrivateRoute)
- [ ] `/material` - Material (PrivateRoute)
- [ ] `/profile` - Profile (PrivateRoute)
- [ ] `/employer/login` - Employer Login (Public)
- [ ] `/employer/verify` - Employer Verify (Public)
- [ ] `/employer/dashboard` - Employer Dashboard (EmployerRoute)
- [ ] `/admin` - Admin Panel (AdminRoute - needs implementation)

## Auth Flows
- [ ] Email/password signup → profile setup → home
- [ ] Email/password login → home
- [ ] Google OAuth signup/login
- [ ] Password reset flow
- [ ] Employer email-link login → verify → dashboard
- [ ] Admin access (custom claim)
- [ ] Session persistence across refresh
- [ ] Logout clears state

## Core Features

### Jobs
- [ ] JobList loads from Firestore `job_listings`
- [ ] SectorExplorer filters work
- [ ] Search, category, type, location filters
- [ ] Pagination works
- [ ] JobDetailModal opens with full details
- [ ] Private jobs section shows approved `private_jobs`

### Utilities
- [ ] CV Builder - Create, preview, export PDF
- [ ] Photo Resizer - Presets, custom dimensions, KB targets
- [ ] Document Scanner - Capture, crop, enhance, OCR, save to vault
- [ ] PDF Editor - All 17 tool categories load lazily

### Profile
- [ ] View/edit profile data
- [ ] Applications tab - User's job applications
- [ ] Saved tab - Bookmarked jobs
- [ ] Settings - Theme, language, notifications

### Employer Dashboard
- [ ] Post new job → saves to `private_jobs` (status: pending)
- [ ] My Jobs tab - List, edit, delete own jobs
- [ ] Applications tab - View applicants
- [ ] Analytics tab - Views, applications, conversion
- [ ] Profile tab - Company info

### Admin Panel
- [ ] Overview - Stats, recent activity, system status
- [ ] Users - Search, filter, paginate, view/edit/suspend
- [ ] Jobs - All jobs, approve/reject private jobs
- [ ] Content - Manage news/updates
- [ ] Analytics - Real metrics
- [ ] Settings - App config
- [ ] Security - Audit logs
- [ ] Logs - System logs

### PDF Editor
- [ ] File upload (drag-drop, click, multiple)
- [ ] Category sidebar - All 17 tools switch correctly
- [ ] Organize - Merge, split, rotate, reorder, extract
- [ ] Edit - Add text, images, draw, annotations
- [ ] OCR - Multi-lang, deskew, clean, searchable PDF
- [ ] Convert - PDF ↔ Word/Excel/PPT/Images/HTML
- [ ] Compress - 4 presets, preview size
- [ ] Secure - Encrypt, redact, permissions
- [ ] Sign - Draw/type/upload e-sig, PAdES cert
- [ ] Clean - Optimize, repair, PDF/A, remove blank
- [ ] Extract - Text, images, tables, search
- [ ] Forms - Fill, create, flatten fields
- [ ] Watermark - Text/image, presets, opacity/rotation
- [ ] Header/Footer - Page numbers, dates, placeholders
- [ ] Compare - Visual/text diff side-by-side
- [ ] Images - PDF ↔ JPG/PNG/WebP, images → PDF
- [ ] Undo/Redo works
- [ ] Download result

## Backend API
- [ ] `GET /api/health` - Returns status
- [ ] `GET /api/queues/status` - All 7 queues report
- [ ] `POST /api/upload` - Single file → fileId
- [ ] `POST /api/upload/multiple` - Multiple files
- [ ] `POST /api/pdf/:operation` - Quick ops (merge, rotate, etc.) return result
- [ ] `POST /api/pdf/:operation` - Heavy ops return jobId (queued)
- [ ] `GET /api/jobs/:jobId` - Poll status → result
- [ ] `GET /api/download/:fileId` - Download result
- [ ] `GET /api/download/zip` - Multiple files as ZIP
- [ ] `POST /api/ocr` - Queues OCR job
- [ ] `POST /api/convert` - Queues conversion
- [ ] `POST /api/compress` - Queues compression
- [ ] `POST /api/table-extract` - Queues table extraction
- [ ] `POST /api/sign` - Queues PAdES signing
- [ ] `POST /api/esign` - Browser e-signature
- [ ] Temp file cleanup works (15 min interval)

## Firebase
- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] IndexedDB persistence enabled
- [ ] FCM token registration on login
- [ ] Push notifications received (background/foreground)

## Scraping
- [ ] `npm run scrape` - Govt jobs scraped to Firestore
- [ ] `npm run watch` - Cron runs daily
- [ ] Private jobs probe checks source reachability

## PWA
- [ ] Install prompt works
- [ ] Offline caching (app shell + Firestore reads)
- [ ] Service worker updates
- [ ] Manifest valid

## Accessibility
- [ ] Keyboard navigation all pages
- [ ] ARIA labels on interactive elements
- [ ] Color contrast WCAG AA
- [ ] Screen reader labels
- [ ] Focus indicators visible

## Responsive Design
- [ ] 375px (mobile)
- [ ] 768px (tablet)
- [ ] 1024px (desktop)
- [ ] 1440px (wide)

## Dark Mode
- [ ] Toggle persists in localStorage
- [ ] All pages render correctly
- [ ] No flash of wrong theme on load

## Multi-Language
- [ ] English (default)
- [ ] Assamese (as)
- [ ] Hindi (hi)
- [ ] Bengali (bn)
- [ ] Language persists