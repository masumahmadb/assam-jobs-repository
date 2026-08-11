import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config.js'

const EMPLOYER_REDIRECT_URL = `${window.location.origin}/employer/verify`

export async function sendEmployerLoginLink(email) {
  const actionCodeSettings = {
    url: EMPLOYER_REDIRECT_URL,
    handleCodeInApp: true
  }
  await sendSignInLinkToEmail(auth, email, actionCodeSettings)
  window.localStorage.setItem('employerEmailForSignIn', email)
}

export async function completeEmployerLoginIfLink() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null
  let email = window.localStorage.getItem('employerEmailForSignIn')
  if (!email) {
    email = window.prompt('Please confirm your email to complete sign-in')
  }
  const cred = await signInWithEmailLink(auth, email, window.location.href)
  window.localStorage.removeItem('employerEmailForSignIn')

  window.localStorage.setItem('employerUser', JSON.stringify({ uid: cred.user.uid, email: cred.user.email }))
  await ensureEmployerProfileDoc(cred.user)
  return cred.user
}

export function watchEmployerAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}

export function employerLogOut() {
  window.localStorage.removeItem('employerUser')
  return signOut(auth)
}

async function ensureEmployerProfileDoc(user) {
  const ref = doc(db, 'employers', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      companyName: '',
      contactName: '',
      contactPhone: '',
      website: '',
      createdAt: serverTimestamp()
    })
  }
}

export async function getEmployerProfile(uid) {
  const snap = await getDoc(doc(db, 'employers', uid))
  return snap.exists() ? snap.data() : null
}

export async function updateEmployerProfile(uid, data) {
  await setDoc(doc(db, 'employers', uid), data, { merge: true })
}
