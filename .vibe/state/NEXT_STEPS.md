# Next Steps (Priority Order)

## Immediate (Next 1-2 hours)
1. **Fix 12 remaining lint parsing errors** in PDF Editor tools:
   - CompareTools: Adjacent JSX elements (line 158)
   - ConvertTools: Adjacent JSX elements (line 189)
   - EditTools: Unexpected token (line 93)
   - ExtractTools: Adjacent JSX elements (line 286)
   - FormsTools: Unexpected token (line 188)
   - ImageTools: Expected JSX closing tag for <h4> (line 136)
   - OCRTools: Unexpected token `>` (line 247)
   - OrganizeTools: Duplicate FiArrowUpRight (line 3)
   - SecureTools: Adjacent JSX elements (line 140)
   - SignTools: Duplicate canvasRef (line 15)
2. **Verify build still passes** after fixes
3. **Verify lint passes** (or only warnings remain)

## Short Term (Next 1-2 days)

### AdminPanel - Complete All Tabs
3. **Users tab** - Connect to Firestore `user_profiles` collection with search, filter, pagination
4. **Jobs tab** - Connect to Firestore `job_listings` + `private_jobs` with approve/reject actions
5. **Content tab** - Manage news/updates (Firestore `updates` collection)
6. **Analytics tab** - Real metrics from Firestore aggregations
7. **Settings tab** - App configuration (feature flags, limits)
8. **Security tab** - Audit logs, failed login attempts, suspicious activity
9. **Logs tab** - System logs, scraper runs, function invocations

### Employer System - Real Integration
10. **EmployerLogin.jsx** - Implement email-link/passwordless auth via Firebase Functions
11. **EmployerVerify.jsx** - Complete email link verification flow
12. **EmployerDashboard.jsx** - Replace mock data with Firestore `private_jobs` queries
13. **PostJobForm.jsx** - Connect to Firestore with proper validation
14. **Employer profile** - Save to `employers` collection

### Security Hardening
15. **Firestore rules** - Add rules for `private_jobs`, `employers`, `notices` collections
16. **Storage rules** - Restrict `/notices` to admin UIDs only
17. **Backend auth** - Add Firebase Admin SDK token verification to all `/api/*` endpoints
18. **Rate limiting** - Add express-rate-limit to backend
19. **Input validation** - Add Zod/Joi schemas for all endpoints
20. **CORS** - Configure production frontend URL

### Firebase Functions (Gemini AI Agents)
21. **Deploy functions** with `GEMINI_API_KEY` secret:
    - `firebase functions:secrets:set GEMINI_API_KEY`
    - `firebase deploy --only functions`
22. **Verify deployed functions**:
    - extractJobFromUpload (Storage trigger for `notices/`)
    - synthesizeAndNotify (Firestore trigger for new jobs → FCM)
    - cleanupExpiredJobs (daily scheduled)
    - chatWithAssistant (HTTPS endpoint for AI Assistant)
    - summarizeNotification (HTTPS endpoint for PDF summarizer)

## Medium Term (Next Week)

### Backend Deployment
22. **Test Docker build** locally with all workers:
    - `cd backend && docker build -t pdf-suite-backend .`
23. **Configure Redis** - Upstash/Redis Cloud for production
24. **Install system deps** in Docker: LibreOffice, OCRmyPDF, Tesseract, Docling, Poppler, Ghostscript
25. **Health checks** - Verify all 7 queues process jobs
26. **Deploy to Cloud Run / Render / Railway** with Redis

### Testing & Verification
27. **E2E test all 12 routes** - Auth flows, data persistence, offline
28. **Playwright tests** for critical paths (login → job apply, employer post → approve → view)
29. **Load test** PDF backend with concurrent uploads
30. **Accessibility audit** - WCAG 2.1 AA
31. **Performance audit** - Lighthouse CI

### Code Quality
32. **Remove dead code** - Unused imports, commented blocks
33. **Consolidate duplicate logic** - PDF operations, auth checks
34. **Add TypeScript** (optional) or JSDoc types
35. **Bundle analysis** - Reduce main chunk below 500 kB with manualChunks

## Long Term (Before Launch)
36. **Play Store publishing** - Capacitor build, signing, store listing
37. **AdMob integration** - Ad units, consent management
38. **Analytics** - Firebase Analytics + custom events
39. **Monitoring** - Sentry for errors, UptimeRobot for uptime
40. **Backup strategy** - Firestore export, Storage backup
41. **Documentation** - API docs, deployment guide, contributor guide