import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config.js'

const googleProvider = new GoogleAuthProvider()

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}

export async function signUpWithEmail({ name, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })
  await createUserProfileDoc(cred.user, { name })
  return cred.user
}

export async function signInWithEmail({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider)
  await createUserProfileDoc(cred.user, { name: cred.user.displayName })
  return cred.user
}

export function logOut() {
  return signOut(auth)
}

async function createUserProfileDoc(user, { name }) {
  await setDoc(
    doc(db, 'user_profiles', user.uid),
    {
      name: name || '',
      email: user.email,
      education_level: null,
      birth_year: null,
      caste_status: null,
      assam_district: null,
      preferred_language: 'en',
      createdAt: serverTimestamp()
    },
    { merge: true }
  )
}
