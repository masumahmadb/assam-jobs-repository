import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config.js'

export async function uploadFile(path, file) {
  const storageRef = ref(storage, path)
  const snap = await uploadBytes(storageRef, file)
  return getDownloadURL(snap.ref)
}

export async function removeFile(path) {
  return deleteObject(ref(storage, path))
}
