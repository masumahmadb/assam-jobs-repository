import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { message, language = 'en', history = [] } = req.body
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

    const langNames = { en: 'English', as: 'Assamese', hi: 'Hindi', bn: 'Bengali' }
    const historyText = history.map((h) => `${h.role}: ${h.text}`).join('\n')

    const prompt = `You are a helpful assistant for Assam job seekers. Reply in ${langNames[language] || 'English'}.
Explain eligibility, syllabi, or forms clearly and briefly.
Conversation so far:
${historyText}
user: ${message}
assistant:`

    const result = await model.generateContent(prompt)
    res.status(200).json({ reply: result.response.text() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'assistant_failed' })
  }
}
