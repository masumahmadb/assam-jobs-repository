import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";
import fs from "fs";

let initialized = false;
let db;

function initFirebase() {
  if (initialized) return;
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Individual env vars se banao
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
  const docRef = db.collection("job_listings").doc(docId);

  await docRef.set(
    {
      role: structured.title,
      department: structured.department,
      deadline: structured.deadline,
      applyUrl: candidate.link,
      assam_district: "Entire Assam",
      salary: null,
      minAge: null,
      maxAge: null,
      requiredEducation: null,
      vacancies: structured.vacancies,
      employmentType: structured.employmentType,
      syllabus: structured.syllabus,
      examPattern: structured.examPattern,
      summary: structured.summary,
      sourceSite: candidate.siteName,
      category: candidate.category,
      jobType: "government",
      status: "active",
      postedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  console.log(`Saved: ${structured.title} (${candidate.siteName})`);
}
