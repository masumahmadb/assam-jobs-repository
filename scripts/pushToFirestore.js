import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";
import fs from "fs";

let initialized = false;
let db;

function initFirebase() {
  if (initialized) return;

  const jsonPath = '/sdcard/Download/assamjobs-masum98-firebase-adminsdk-fbsvc-d6312d99d7.json';

  let serviceAccount;
  if (fs.existsSync(jsonPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } else {
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
  }

  initializeApp({ credential: cert(serviceAccount) });
  db = getFirestore();
  initialized = true;
}

function docIdFromLink(link) {
  return crypto.createHash("sha256").update(link).digest("hex").slice(0, 24);
}

export async function pushJobToFirestore(candidate, structured) {
  initFirebase();
  const docId = docIdFromLink(candidate.link);

  const isNewJob = structured.category === "new_recruitment";
  const collectionName = isNewJob ? "job_listings" : "updates";
  const docRef = db.collection(collectionName).doc(docId);

  const baseData = {
    role: structured.title,
    title: structured.title,
    department: structured.department,
    deadline: structured.deadline,
    applyUrl: candidate.link,
    assam_district: "Entire Assam",
    summary: structured.summary,
    sourceSite: candidate.siteName,
    category: candidate.category,
    noticeCategory: structured.category,
    jobType: "government",
    status: "active",
    postedAt: FieldValue.serverTimestamp()
  };

  if (isNewJob) {
    Object.assign(baseData, {
      salary: structured.salary || "Not specified",
      minAge: structured.minAge || "Not specified",
      maxAge: structured.maxAge || "Not specified",
      requiredEducation: structured.requiredEducation || "Not specified",
      vacancies: structured.vacancies,
      employmentType: structured.employmentType,
      syllabus: structured.syllabus,
      examPattern: structured.examPattern
    });
  }

  await docRef.set(baseData, { merge: true });

  console.log(`Saved [${collectionName}]: ${structured.title} (${candidate.siteName})`);
}
