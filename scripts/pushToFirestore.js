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

// Use a stable hash of the source link as the Firestore document ID.
// This means re-running the scraper won't create duplicate jobs for the
// same notification — it will just overwrite/update the same document.
function docIdFromLink(link) {
  return crypto.createHash("sha256").update(link).digest("hex").slice(0, 24);
}

export async function pushJobToFirestore(candidate, structured) {
  initFirebase();
  const db = admin.firestore();

  const docId = docIdFromLink(candidate.link);
  const docRef = db.collection("jobs").doc(docId);

  await docRef.set(
    {
      title: structured.title,
      department: structured.department,
      deadline: structured.deadline,
      vacancies: structured.vacancies,
      employmentType: structured.employmentType,
      syllabus: structured.syllabus,
      summary: structured.summary,
      applyLink: candidate.link,
      sourceSite: candidate.siteName,
      category: candidate.category,
      jobType: "government",
      status: "approved", // govt jobs are auto-approved (trusted source)
      scrapedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  console.log(`Saved: ${structured.title} (${candidate.siteName})`);
}
