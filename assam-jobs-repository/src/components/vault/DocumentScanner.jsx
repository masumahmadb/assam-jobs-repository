import React, { useRef, useState } from 'react'
import { uploadFile } from '../../firebase/storage.js'
import { addVaultDocument } from '../../firebase/firestore.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useToast } from '../common/Toast.jsx'
import { saveToDevice } from '../../utils/download.js'

const FILTERS = {
  none: 'none',
  grayscale: 'grayscale(100%)',
  bw: 'grayscale(100%) contrast(200%) brightness(105%)',
}

export default function DocumentScanner() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const canvasRef = useRef(null)
  const [image, setImage] = useState(null)
  const [filter, setFilter] = useState('none')
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [busy, setBusy] = useState(false)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => { setImage(img); draw(img, filter, brightness, contrast) }
    img.src = URL.createObjectURL(file)
  }

  function draw(img, f, b, c) {
    const canvas = canvasRef.current
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.filter = f === 'none' ? `brightness(${b}%) contrast(${c}%)` : `${FILTERS[f]} brightness(${b}%) contrast(${c}%)`
    ctx.drawImage(img, 0, 0)
  }

  function applySettings(f = filter, b = brightness, c = contrast) {
    setFilter(f); setBrightness(b); setContrast(c)
    if (image) draw(image, f, b, c)
  }

  function canvasToBlob() {
    return new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/jpeg', 0.9))
  }

  async function saveToPhone() {
    if (!image) return
    setBusy(true)
    const blob = await canvasToBlob()
    await saveToDevice(blob, `scan_${Date.now()}.jpg`)
    setBusy(false)
    showToast('Saved to Phone')
  }

  async function saveToVault() {
    if (!image || !user) return
    setBusy(true)
    const blob = await canvasToBlob()
    const path = `vault/${user.uid}/scan_${Date.now()}.jpg`
    const { url } = await uploadFile(path, blob)
    await addVaultDocument(user.uid, { name: 'Scanned Document', url, type: 'scan', sizeKB: Math.round(blob.size / 1024) })
    setBusy(false)
    showToast('Added to Vault')
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-tea-800">Document Scanner</h2>

      <div className="flex gap-2">
        <label className="btn-outline flex-1 block text-center cursor-pointer">
          Take Photo
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>
        <label className="btn-outline flex-1 block text-center cursor-pointer">
          Upload from Gallery
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>

      <canvas ref={canvasRef} className="w-full border rounded-xl2" />

      {image && (
        <div className="card space-y-3">
          <div className="flex gap-2">
            {Object.keys(FILTERS).map((f) => (
              <button key={f} onClick={() => applySettings(f)}
                className={`text-xs px-3 py-2 rounded-full ${filter === f ? 'bg-tea-600 text-white' : 'bg-tea-50'}`}>
                {f === 'bw' ? 'B&W' : f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <label className="text-xs text-tea-900/60">Brightness
            <input type="range" min="50" max="150" value={brightness}
              onChange={(e) => applySettings(filter, Number(e.target.value), contrast)} className="w-full" />
          </label>
          <label className="text-xs text-tea-900/60">Contrast
            <input type="range" min="50" max="150" value={contrast}
              onChange={(e) => applySettings(filter, brightness, Number(e.target.value))} className="w-full" />
          </label>
          {busy && <p className="text-sm text-tea-900/60">Processing...</p>}
          <div className="flex gap-2">
            <button onClick={saveToPhone} className="btn-outline flex-1">Save to Phone</button>
            <button onClick={saveToVault} className="btn-primary flex-1">Save to Vault</button>
          </div>
        </div>
      )}
    </div>
  )
}