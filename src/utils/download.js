// Save a blob/file to the user's device storage.
// Uses the File System Access API when available (Chromium desktop),
// otherwise falls back to a hidden <a download> click which works on
// iOS Safari, Android Chrome and mobile PWAs.
export async function saveToDevice(blob, filename) {
  try {
    if ('showSaveFilePicker' in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'File',
          accept: { 'application/octet-stream': ['.jpg', '.jpeg', '.png', '.pdf'] }
        }]
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return true
    }
  } catch (err) {
    if (err?.name === 'AbortError') return false
  }

  // Fallback: anchor download — works on mobile/iOS/Android
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 4000)
  return true
}