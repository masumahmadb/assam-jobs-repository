# Assam Jobs Repository — Master Project Guide

## 🚀 LIVE & WORKING
✅ Government job scraping (Gemini API, daily via Termux local cron)
✅ Govt jobs UI (vacancies, employment type, exam pattern, deadline badges)
✅ Employer email OTP login (passwordless)
✅ Private job posting form (company name, role, location, salary, contact, deadline)
✅ Employer dashboard (my jobs, edit, delete)
✅ Jobs page (Govt section + Private section with disclaimer)
✅ Firestore collections: job_listings (govt), private_jobs (employer)

## 🔑 CRITICAL SECRETS (in ~/.assam-jobs-env on Termux)
## 📱 SCRAPER SETUP (Termux)
- Runs daily: `bash ~/assam-jobs-repository/scripts/run-scrape-local.sh`
- Extracts: title, department, deadline, vacancies, employmentType, examPattern, syllabus
- Saves to: Firestore `job_listings` collection (status: "active", auto-approved)
- Sites: Assam Govt Portal (working), Employment Assam (SSL error - skip for now)

## 👔 EMPLOYER SYSTEM (Live)
- Login: `/employer/login` (email link, no password)
- Verify: `/employer/verify` (completes sign-in from email link)
- Dashboard: `/employer/dashboard` (my jobs)
- Post job: Form with fields (company, title, category, location, description, salary, contact, deadline, apply method)
- Status: "pending" (needs admin approval in Firestore console before showing to users)

## 📊 JOBS PAGE DISPLAY
- **Govt section**: District filter, auto-approved jobs from scraper
- **Private section**: Disclaimer banner (yellow) + approved-only jobs
- Both show: vacancies, employment type, deadline badges

## 🔐 FIRESTORE COLLECTIONS
- `job_listings`: Government jobs (status: active)
- `private_jobs`: Employer-posted jobs (status: pending/approved/rejected)
- `employers`: Employer profiles (email, company name, contact info)
- `user_profiles`: Job-seeker profiles (existing)

## ❌ ADMIN APPROVAL WORKFLOW (Manual for now)
1. Employer posts job → saved as "pending" in private_jobs
2. You manually go to: Firebase Console → Firestore → private_jobs → select job → edit status to "approved"
3. Job instantly appears in `/jobs` page Private section

## ⏭️ NEXT PRIORITY TASKS
1. **Test private job system end-to-end** (login → post → check Firestore → approve → verify on app)
2. **Check AI Assistant** (Gemini integration with Firebase Functions)
3. **Firestore Security Rules** (lock down from open test mode)
4. **Play Store publishing** (developer account, signing, APK)
5. **AdMob integration** (ads for revenue)

## 🌐 LIVE URLS
- App: https://...ository.vercel.app
- Employer login: https://...ository.vercel.app/employer/login
- Jobs page: https://...ository.vercel.app/jobs

## 📝 GIT COMMITS (Recent)
- "Add private jobs section with disclaimer to Jobs page" (2a84065)
- "Add employer authentication and private job posting system" (3fc00a11)
- "Add exam pattern field..." (6e5d9dc)

## ⚙️ TECH STACK
- Frontend: React + Vite + Tailwind + React Router
- Backend: Firebase (Auth, Firestore, Cloud Functions)
- Scraper: Node.js (fetch + cheerio + Gemini API)
- Hosting: Vercel (frontend), Firebase (backend/functions)
- Automation: GitHub Actions (cron), Termux local (Indian IP bypass)

## 📞 KEY CONTACTS
- Firebase Project: assamjobs-masum98
- GitHub Repo: masumahmadb/assam-jobs-repository
- Gemini API Key: From Google AI Studio (free tier)

---
**Last Updated:** 5 Aug 2026
