import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

let db = null

export function isStoreConfigured() {
  return !!(
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
  )
}

function getDb() {
  if (db) return db
  if (!isStoreConfigured()) return null
  if (!getApps().length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      initializeApp({ credential: cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH) })
    } else {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      })
    }
  }
  db = getFirestore()
  return db
}

export async function loadSnapshots(sourceIds) {
  const firestore = getDb()
  if (!firestore) return {}
  const out = {}
  // Firestore `in` query caps at 30 — batches are <=10 anyway.
  const snap = await firestore.collection('watch_sources').where('__name__', 'in', sourceIds).get()
  for (const doc of snap.docs) out[doc.id] = doc.data()
  return out
}

export async function saveSnapshot(sourceId, data) {
  const firestore = getDb()
  if (!firestore) return false
  await firestore.collection('watch_sources').doc(sourceId).set(
    { ...data, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  )
  return true
}

// Queue a new notification candidate. Doc ID = sha256(link) so re-detection is idempotent.
export async function queueItems(items) {
  const firestore = getDb()
  if (!firestore) return false
  const batch = firestore.batch()
  for (const it of items) {
    batch.set(firestore.collection('watch_queue').doc(it.docId), it.data, { merge: true })
  }
  await batch.commit()
  return true
}
