// Client-side helper for the Smart Multilingual AI Assistant.
// IMPORTANT: GEMINI_API_KEY must never be bundled into the client. This
// function calls a Cloud Function (functions/index.js -> chatWithAssistant)
// which holds the key server-side and proxies to Gemini 2.5 Flash.

const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || '/api'

export async function askAssistant({ message, language, history = [] }) {
  const res = await fetch(`${FUNCTIONS_BASE_URL}/chatWithAssistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, history })
  })
  if (!res.ok) throw new Error('Assistant is temporarily unavailable.')
  return res.json() // { reply: string }
}

export async function summarizeNotification({ text, language }) {
  const res = await fetch(`${FUNCTIONS_BASE_URL}/summarizeNotification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language })
  })
  if (!res.ok) throw new Error('Could not summarize this document.')
  return res.json() // { ageLimit, qualification, deadline }
}
