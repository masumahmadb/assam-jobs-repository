import React, { useEffect, useState } from 'react'
import { getVaultDocuments, deleteVaultDocument, addVaultDocument } from '../../firebase/firestore.js'
import { uploadFile, removeFile } from '../../firebase/storage.js'
import { compressImageForUpload } from '../../utils/imageResize.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useToast } from '../common/Toast.jsx'
import { ListSkeleton } from '../common/SkeletonLoader.jsx'
import { FiTrash2, FiDownload, FiUpload } from 'react-icons/fi'
import { saveToDevice } from '../../utils/download.js'

// Allowed file types: images and PDFs only
const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'application/pdf': 'pdf'
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out — check your internet connection`)), ms))
  ])
}

export default function DocumentVault() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [docs, setDocs] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [busyLabel, setBusyLabel] = useState('')

  async function load() {
    if (!user) return
    setLoadError(null)
    try {
      const result = await getVaultDocuments(user.uid)
      setDocs(result)
    } catch (err) {
      console.error('Vault load failed:', err)
      setLoadError(err.message || 'Failed to load vault')
      setDocs([])
    }
  }

  useEffect(() => { load() }, [user])

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      showToast('Only images and PDFs are allowed')
      e.target.value = ''
      return
    }
    setBusy(true)
    try {
      let uploadBlob = file
      let sizeKB = Math.round(file.size / 1024)
      let uploadExt = ext

      if (file.type.startsWith('image/')) {
        setBusyLabel('Compressing photo...')
        const { blob, sizeKB: compressedKB } = await compressImageForUpload(file)
        uploadBlob = blob
        sizeKB = compressedKB
        uploadExt = 'jpg'
      }

      setBusyLabel('Uploading...')
      const path = `vault/${user.uid}/upload_${Date.now()}.${uploadExt}`
      const { url } = await withTimeout(uploadFile(path, uploadBlob), 45000, 'Upload')
      await withTimeout(addVaultDocument(user.uid, {
        name: file.name.replace(/\.[^.]+$/, ''),
        url,
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        sizeKB
      }), 15000, 'Save')

      showToast('Uploaded to Vault')
      await load()
    } catch (err) {
      console.error('Upload failed:', err)
      showToast(err.message || 'Upload failed')
    } finally {
      setBusy(false)
      setBusyLabel('')
      e.target.value = ''
    }
  }

  async function handleDownload(doc) {
    try {
      const res = await fetch(doc.url)
      const blob = await res.blob()
      const ext = doc.type === 'pdf' ? 'pdf' : 'jpg'
      await saveToDevice(blob, `${doc.name || 'document'}.${ext}`)
      showToast('Downloaded')
    } catch (err) {
      showToast('Download failed')
    }
  }

  async function handleDelete(doc) {
    try {
      await deleteVaultDocument(doc.id)
      const pathMatch = doc.url.match(/\/o\/([^?]+)/)
      if (pathMatch) {
        try {
          const path = decodeURIComponent(pathMatch[1])
          await removeFile(path)
        } catch { /* ignore storage cleanup errors */ }
      }
      showToast('Deleted')
      load()
    } catch (err) {
      showToast('Delete failed')
    }
  }

  return (
    <div className="p-4 pb-24 space-y-3">
      <h2 className="text-lg font-semibold text-tea-800">My Vault</h2>

      <label className="btn-primary w-full block text-center cursor-pointer">
        <FiUpload size={16} className="inline mr-1" />
        Upload Document / Photo
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleUpload} />
      </label>

      {busy && <p className="text-sm text-tea-900/60">{busyLabel || 'Uploading...'}</p>}

      {loadError && (
        <div className="card text-center space-y-2 bg-red-50 border-red-200">
          <p className="text-sm text-red-600">Couldn't load your vault: {loadError}</p>
          <button onClick={load} className="btn-outline">Retry</button>
        </div>
      )}

      {docs === null ? <ListSkeleton count={3} /> : docs.length === 0 ? (
        !loadError && <p className="text-tea-900/50 text-center py-10">No documents saved yet.</p>
      ) : (
        docs.map((d) => (
          <div key={d.id} className="card flex items-center gap-3">
            {d.type === 'pdf' ? (
              <div className="w-14 h-14 flex items-center justify-center rounded-lg border bg-red-50 text-red-600 text-xs font-semibold">PDF</div>
            ) : (
              <img src={d.url} alt={d.name} className="w-14 h-14 object-cover rounded-lg border" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{d.name}</p>
              <p className="text-xs text-tea-900/50">{d.sizeKB} KB</p>
            </div>
            <button onClick={() => handleDownload(d)} className="p-2 text-tea-600" aria-label="Download"><FiDownload /></button>
            <button onClick={() => handleDelete(d)} className="p-2 text-gamosa-500" aria-label="Delete"><FiTrash2 /></button>
          </div>
        ))
      )}
    </div>
  )
}
