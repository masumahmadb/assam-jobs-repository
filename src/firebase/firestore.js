import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, limit, onSnapshot, serverTimestamp
} from 'firebase/firestore'
import { db } from './config.js'

// ---- job_listings ----
export function subscribeToJobs({ district, onlyActive = true }, callback) {
  const constraints = []
  if (district && district !== 'all') constraints.push(where('assam_district', '==', district))
  if (onlyActive) constraints.push(where('status', '==', 'active'))
  constraints.push(orderBy('postedAt', 'desc'), limit(100))
  const q = query(collection(db, 'job_listings'), ...constraints)
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export async function getJob(jobId) {
  const snap = await getDoc(doc(db, 'job_listings', jobId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// ---- user_profiles ----
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'user_profiles', uid))
  return snap.exists() ? snap.data() : null
}

export async function updateUserProfile(uid, data) {
  return updateDoc(doc(db, 'user_profiles', uid), data)
}

// ---- vault_documents ----
export async function addVaultDocument(uid, { name, url, type, sizeKB }) {
  return addDoc(collection(db, 'vault_documents'), {
    uid, name, url, type, sizeKB, createdAt: serverTimestamp()
  })
}

export async function updateVaultDocument(docId, data) {
  return updateDoc(doc(db, 'vault_documents', docId), data)
}

export async function getVaultDocuments(uid) {
  const q = query(collection(db, 'vault_documents'), where('uid', '==', uid), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function deleteVaultDocument(docId) {
  return deleteDoc(doc(db, 'vault_documents', docId))
}

// ---- chat_history ----
export async function saveChatMessage(uid, { role, text, language }) {
  return addDoc(collection(db, 'chat_history'), {
    uid, role, text, language, createdAt: serverTimestamp()
  })
}

export async function getChatHistory(uid) {
  const q = query(collection(db, 'chat_history'), where('uid', '==', uid), orderBy('createdAt', 'asc'), limit(200))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function subscribeToPrivateJobs(callback) {
  const q = query(
    collection(db, 'private_jobs'),
    where('status', '==', 'approved'),
    orderBy('postedAt', 'desc'),
    limit(100)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  })
}

// ---- updates (interview/admit card/verification/results) ----
export function subscribeToUpdates(callback) {
  const q = query(
    collection(db, 'updates'),
    orderBy('postedAt', 'desc'),
    limit(30)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}
