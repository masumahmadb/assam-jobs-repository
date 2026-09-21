# Next Steps (Priority Order)

## Immediate (Next 1-2 hours)
1. **Fix PDFEditor.jsx duplicate tool categories** - Remove lines 36-45 (exact duplicates of 21-35)
2. **Add ESLint config** - Create eslint.config.js or .eslintrc.cjs
3. **Verify build still passes** after fixes

## Short Term (Next 1-2 days)

### AdminPanel - Complete All Tabs
4. **Users tab** - Connect to Firestore `user_profiles` collection with search, filter, pagination
5. **Jobs tab** - Connect to Firestore `job_listings` + `private_jobs` with approve/reject actions
6. **Content tab** - Manage news/updates (Firestore `updates` collection)
7. **Analytics tab** - Real metrics from Firestore aggregations
8. **Settings tab** - App configuration (feature flags, limits)
9. **Security tab** - Audit logs, failed login attempts, suspicious activity
10. **Logs tab** - System logs, scraper runs, function invocations

### Employer System - Real Integration
11. **EmployerLogin.jsx** - Implement email-link/passwordless auth via Firebase Functions
12. **EmployerVerify.jsx** - Complete email link verification flow
13. **EmployerDashboard.jsx** - Replace mock data with Firestore `private_jobs` queries
14. **PostJobForm.jsx** - Connect to Firestore with proper validation
15. **Employer profile** - Save to `employers` collection

### Security Hardening
16. **Firestore rules** - Add rules for `private_jobs`, `employers`, `notices` collections
17. **Storage rules** - Restrict `/notices` to admin UIDs only
18. **Backend auth** - Add Firebase Admin SDK token verification to all `/api/*` endpoints
19. **Rate limiting** - Add express-rate-limit to backend
20. **Input validation** - Add Zod/Joi schemas for all endpoints
21. **CORS** - Configure production frontend URL

### Firebase Functions (Gemini AI Agents)
22. **Create `functions/` directory** with package.json
23. **extractJobFromUpload** - Storage trigger for `notices/` PDFs
24. **synthesizeAndNotify** - Firestore trigger for new jobs → FCM push
25. **cleanupExpiredJobs** - Daily scheduled function
26. **chatWithAssistant** - HTTPS endpoint for AI Assistant page
27. **summarizeNotification** - HTTPS endpoint for PDF summarizer
28. **Deploy functions** with `GEMINI_API_KEY` secret

## Medium Term (Next Week)

### Backend Deployment
29. **Test Docker build** locally with all workers
30. **Verify Redis connection** - Local vs managed
31. **Install system deps** in Docker: LibreOffice, OCRmyPDF, Tesseract, Docling, Poppler, Ghostscript
32. **Health checks** - Verify all 7 queues process jobs
33. **Deploy to Cloud Run / Render / Railway** with Redis

### Testing & Verification
34. **E2E test all 12 routes** - Auth flows, data persistence, offline
35. **Playwright tests** for critical paths (login → job apply, employer post → approve → view)
36. **Load test** PDF backend with concurrent uploads
37. **Accessibility audit** - WCAG 2.1 AA
38. **Performance audit** - Lighthouse CI

### Code Quality
39. **Remove dead code** - Unused imports, commented blocks
40. **Consolidate duplicate logic** - PDF operations, auth checks
41. **Add TypeScript** (optional) or JSDoc types
42. **Bundle analysis** - Reduce main chunk below 500 kB

## Long Term (Before Launch)
43. **Play Store publishing** - Capacitor build, signing, store listing
44. **AdMob integration** - Ad units, consent management
45. **Analytics** - Firebase Analytics + custom events
46. **Monitoring** - Sentry for errors, UptimeRobot for uptime
47. **Backup strategy** - Firestore export, Storage backup
48. **Documentation** - API docs, deployment guide, contributor guide