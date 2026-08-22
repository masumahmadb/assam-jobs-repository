const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || '/api'

export async function askAssistant({ message, language, history = [], image = null }) {
  const res = await fetch(`${FUNCTIONS_BASE_URL}/chatWithAssistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, history, image })
  })
  if (!res.ok) throw new Error('Assistant is temporarily unavailable.')
  return res.json()
}

export async function summarizeNotification({ text, language }) {
  const res = await fetch(`${FUNCTIONS_BASE_URL}/summarizeNotification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language })
  })
  if (!res.ok) throw new Error('Could not summarize this document.')
  return res.json()
}
