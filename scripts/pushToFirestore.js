import admin from "firebase-admin";
import crypto from "crypto";

let initialized = false;

function initFirebase() {
  if (initialized) return;
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  initialized = true;
}

function docIdFromLink(link) {
  return crypto.createHash("sha256").update(link).digest("hex").slice(0, 24);
}

export async function pushJobToFirestore(candidate, structured) {
  initFirebase();
  const db = admin.firestore();

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
      summary: structured.summary,
      sourceSite: candidate.siteName,
      category: candidate.category,
      jobType: "government",
      status: "active",
      postedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  console.log(`Saved: ${structured.title} (${candidate.siteName})`);
}
