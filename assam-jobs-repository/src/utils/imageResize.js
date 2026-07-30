// Canvas-based resizer implementing the mandatory Assam Govt exam photo presets.
export const PHOTO_PRESETS = {
  passport: { label: 'Passport Photo', width: 200, height: 260, maxKB: 50 },
  stamp: { label: 'Stamp Size Photo', width: 150, height: 180, maxKB: 30 },
  standard: { label: 'Standard Photo', width: 240, height: 360, maxKB: 50 },
  signature20: { label: 'Signature (20KB)', width: 300, height: 100, maxKB: 20 },
  signature50: { label: 'Signature (50KB)', width: 300, height: 100, maxKB: 50 }
}

export async function resizeImageToPreset(file, presetKey) {
  const preset = PHOTO_PRESETS[presetKey]
  const img = await loadImage(file)

  const canvas = document.createElement('canvas')
  canvas.width = preset.width
  canvas.height = preset.height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, preset.width, preset.height)
  drawImageCover(ctx, img, preset.width, preset.height)

  return compressToTargetSize(canvas, preset.maxKB)
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function drawImageCover(ctx, img, w, h) {
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  const sx = (img.width - sw) / 2
  const sy = (img.height - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
}

// Binary-search JPEG quality until under the required KB limit.
async function compressToTargetSize(canvas, maxKB) {
  let quality = 0.92
  let blob = await canvasToBlob(canvas, quality)
  let attempts = 0
  while (blob.size / 1024 > maxKB && quality > 0.1 && attempts < 12) {
    quality -= 0.07
    blob = await canvasToBlob(canvas, quality)
    attempts += 1
  }
  return { blob, sizeKB: Math.round(blob.size / 1024), quality }
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}
