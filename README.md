# Assam Jobs Repository

A high-performance, offline-friendly PWA for Sarkari and private job discovery across Assam — with an AI eligibility engine, an interactive district map, an in-app CV builder, and document utilities (resizer, scanner, vault).

**Android package name:** `com.assamjobs.repository`

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS 3, PWA via `vite-plugin-pwa` |
| Routing | React Router v6 |
| Backend | Firebase (Auth, Firestore, Storage, Cloud Functions, FCM) |
| AI | Google Gemini 2.5 Flash, called only from Cloud Functions |
| Map | Leaflet + React-Leaflet + OpenStreetMap tiles (no API key needed; swap for Google Maps JS API if preferred) |
| PDF | jsPDF (CV generation), pdf-parse (server-side notice parsing) |

## 2. Project Structure

```
assam-jobs-repository/
├─ src/
│  ├─ firebase/        # config.js, auth.js, firestore.js, storage.js, messaging.js
│  ├─ contexts/        # AuthContext, LanguageContext
│  ├─ components/
│  │  ├─ common/        BottomNav, TopBar, Toast, SkeletonLoader
│  │  ├─ auth/           Login, Signup, ProfileSetup
│  │  ├─ jobs/           JobList, JobCard, JobDetailModal
│  │  ├─ map/            EligibilityMap, MapPin3D
│  │  ├─ cv/             CVBuilder
│  │  ├─ vault/          PhotoResizer, DocumentScanner, DocumentVault
│  │  └─ assistant/      AIAssistant
│  ├─ pages/            Home, Jobs, MapPage, Utilities, Assistant, Profile
│  ├─ hooks/            useEligibility, useOffline
│  ├─ utils/            eligibility.js, imageResize.js, i18n.js, districts.js, share.js
│  └─ services/         geminiAgent.js, pushNotifications.js
├─ functions/           Cloud Functions: Gemini AI agent suite
├─ firestore.rules
├─ storage.rules
├─ firebase.json
└─ .env.example
```

## 3. Firestore Collections

- `user_profiles/{uid}` — education_level, birth_year, caste_status, assam_district, fcmToken
- `job_listings/{id}` — role, department, salary, minAge, maxAge, requiredEducation, assam_district, lat/lng, deadline, applyUrl, status
- `vault_documents/{id}` — uid, name, url, type, sizeKB
- `chat_history/{id}` — uid, role, text, language

## 4. Setup

```bash
git clone <your-repo-url> assam-jobs-repository
cd assam-jobs-repository
npm install
cp .env.example .env      # fill in Firebase web config
npm run dev                # http://localhost:5173
```

### 4.1 Firebase project setup

1. Create a project at console.firebase.google.com.
2. Enable **Authentication** → Email/Password and Google providers.
3. Enable **Cloud Firestore** (production mode) and **Storage**.
4. Enable **Cloud Messaging**, generate a Web Push certificate (VAPID key) under Project Settings → Cloud Messaging.
5. Copy the web app config into `.env` (all `VITE_FIREBASE_*` keys).
6. Deploy security rules and functions:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add            # select your project
   firebase deploy --only firestore:rules,storage:rules
   cd functions && npm install && cd ..
   firebase functions:secrets:set GEMINI_API_KEY
   firebase deploy --only functions
   ```
7. Deploy the web app:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### 4.2 Environment variables

All client keys live in `.env` and are loaded via `import.meta.env` — never commit this file. `GEMINI_API_KEY` is a **Cloud Functions secret only**; it is never bundled into client JS, per the security requirement in the brief.

## 5. Android Packaging (.aab / .apk)

The app is web-first and PWA-ready out of the box. Two supported paths to Android:

**Option A — Capacitor (recommended, native shell + native plugins):**
```bash
npm install @capacitor/core @capacitor/android
npx cap init "Assam Jobs Repository" "com.assamjobs.repository"
npm run build
npx cap add android
npx cap sync android
npx cap open android      # build .aab/.apk in Android Studio
```

**Option B — Bubblewrap (TWA, lightweight PWA wrapper):**
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-deployed-url/manifest.webmanifest
bubblewrap build
```
Set the package name to `com.assamjobs.repository` when prompted in either tool.

## 6. Key Feature Notes

- **Eligibility Engine** (`src/utils/eligibility.js`): compares `user_profiles` against `job_listings` on age (with category relaxation), education level, and district restriction; used by both the Jobs list and the 3D floating pins on the map.
- **Exam Photo Resizer** (`src/utils/imageResize.js`): canvas-based resize + binary-search JPEG compression to hit the exact KB ceilings specified for Passport (200×260, 50KB), Stamp (150×180, 30KB), Standard (240×360, 50KB), and Signature (20KB/50KB) presets.
- **"Added to Vault" alert**: triggered via the shared `Toast` context (`src/components/common/Toast.jsx`) from both the Resizer and Scanner after a successful Storage + Firestore write.
- **Offline support**: Firestore IndexedDB persistence is enabled in `src/firebase/config.js`; `vite-plugin-pwa` caches the app shell and does network-first caching of Firestore reads for weak 2G/3G connectivity.
- **Gemini AI Agent Suite** (`functions/index.js`):
  - `extractJobFromUpload` — Storage trigger, parses uploaded notice PDFs into structured `job_listings`.
  - `synthesizeAndNotify` — Firestore trigger, writes a short push copy and fans it out via FCM to users in the matching district.
  - `cleanupExpiredJobs` — daily scheduled function that archives jobs past their deadline.
  - `chatWithAssistant` / `summarizeNotification` — HTTPS endpoints backing the in-app multilingual assistant and PDF summarizer.

## 7. Seeding sample data

A ready-made seed script is included at `scripts/seedFirestore.js` — 6 realistic Assam job listings (Sarkari + private) with district coordinates for the map:

```bash
cd scripts && npm install && cd ..

# Option A: local emulator (no real credentials needed)
firebase emulators:start --only firestore
FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/seedFirestore.js

# Option B: real project (requires a service account key)
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/seedFirestore.js
```

## 8. Security Rules Summary

- `job_listings` — public read, writes restricted to the Admin SDK (Cloud Functions only).
- `user_profiles`, `vault_documents`, `chat_history` — a user may only read/write their own documents (`request.auth.uid` match).
- Storage `vault/{uid}/*` — owner-only read/write, 10MB cap per file.

## 9. Suggested Next Steps

- Add an admin web panel (or Firebase console workflow) for staff to upload notice PDFs into `notices/` and trigger the extraction agent.
- Add Firestore composite indexes for `job_listings` (`assam_district` + `status` + `postedAt`) — Firebase will prompt with a direct console link on first query.
- Wire real district GPS coordinates into `job_listings.lat/lng` for the map (e.g., district HQ centroids) so pins render correctly.
