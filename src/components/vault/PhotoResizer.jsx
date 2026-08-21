import React, { useState } from 'react'
import { PHOTO_PRESETS, resizeImageToPreset } from '../../utils/imageResize.js'
import { uploadFile } from '../../firebase/storage.js'
import { addVaultDocument } from '../../firebase/firestore.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useToast } from '../common/Toast.jsx'
import { saveToDevice } from '../../utils/download.js'

export default function PhotoResizer() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [preset, setPreset] = useState('passport')
  const [preview, setPreview] = useState(null)
  const [resultBlob, setResultBlob] = useState(null)
  const [resultKB, setResultKB] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    const { blob, sizeKB } = await resizeImageToPreset(file, preset)
    setResultBlob(blob)
    setResultKB(sizeKB)
    setPreview(URL.createObjectURL(blob))
    setBusy(false)
  }

  async function saveToPhone() {
    if (!resultBlob) return
    setBusy(true)
    await saveToDevice(resultBlob, `${preset}_${Date.now()}.jpg`)
    setBusy(false)
    showToast('Saved to Phone')
  }

  async function saveToVault() {
    if (!resultBlob || !user) return
    setBusy(true)
    const path = `vault/${user.uid}/${preset}_${Date.now()}.jpg`
    const { url } = await uploadFile(path, resultBlob)
    await addVaultDocument(user.uid, { name: `${PHOTO_PRESETS[preset].label}`, url, type: 'image', sizeKB: resultKB })
    setBusy(false)
    showToast('Added to Vault')
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-tea-800">Exam Photo Resizer</h2>

      <select value={preset} onChange={(e) => { setPreset(e.target.value); setPreview(null) }}
        className="w-full border rounded-xl2 px-4 py-3">
        {Object.entries(PHOTO_PRESETS).map(([key, p]) => (
          <option key={key} value={key}>{p.label} — {p.width}x{p.height}px, max {p.maxKB}KB</option>
        ))}
      </select>

      <div className="flex gap-2">
        <label className="btn-outline flex-1 block text-center cursor-pointer">
          📷 Camera
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>
        <label className="btn-outline flex-1 block text-center cursor-pointer">
          🖼️ Gallery
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>

      {busy && <p className="text-sm text-tea-900/60">Processing...</p>}

      {preview && (
        <div className="card text-center space-y-3">
          <img src={preview} alt="Resized preview" className="mx-auto border" />
          <p className="text-sm text-tea-900/60">Final size: {resultKB} KB (limit {PHOTO_PRESETS[preset].maxKB} KB)</p>
          <div className="flex gap-2">
            <button onClick={saveToPhone} className="btn-outline flex-1">Save to Phone</button>
            <button onClick={saveToVault} className="btn-primary flex-1">Save to Vault</button>
          </div>
        </div>
      )}
    </div>
  )
}