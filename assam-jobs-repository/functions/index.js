/**
 * Internal Autonomous AI Agent & Automation Suite (Gemini 2.5 Flash powered)
 * Deploy with: firebase deploy --only functions
 *
 * Set the key with:
 *   firebase functions:secrets:set GEMINI_API_KEY
 */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const { GoogleGenerativeAI } = require('@google/generative-ai')
const pdfParse = require('pdf-parse')

admin.initializeApp()
const db = admin.firestore()

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
}

// ---------------------------------------------------------------
// 1. Job Extraction & Structuring Agent
// Parses an uploaded notice PDF (Storage trigger) into structured JSON
// and writes it into job_listings.
// ---------------------------------------------------------------
exports.extractJobFromUpload = functions.storage.object().onFinalize(async (object) => {
  if (!object.name.startsWith('notices/') || !object.name.endsWith('.pdf')) return null

  const bucket = admin.storage().bucket(object.bucket)
  const [buffer] = await bucket.file(object.name).download()
  const { text } = await pdfParse(buffer)

  const model = getModel()
  const prompt = `Extract the following fields as strict JSON only (no markdown fences) from this Assam government/private job notice text.
Fields: role, department, salary, minAge, maxAge, requiredEducation (one of: 10th, 12th, diploma, graduate, postgraduate), assam_district (or "Entire Assam"), deadline (ISO date if possible), applyUrl (if present).
Text:
"""${text.slice(0, 12000)}"""`

  const result = await model.generateContent(prompt)
  const json = safeParseJSON(result.response.text())
  if (!json) return null

  await db.collection('job_listings').add({
    ...json,
    status: 'active',
    sourceFile: object.name,
    postedAt: admin.firestore.FieldValue.serverTimestamp()
  })
  return null
})

// ---------------------------------------------------------------
// 2. Smart Push Notification Synthesizer
// Firestore trigger: when a new job_listings doc is created, generate a
// short push notification and fan it out via FCM to matching districts.
// ---------------------------------------------------------------
exports.synthesizeAndNotify = functions.firestore
  .document('job_listings/{jobId}')
  .onCreate(async (snap) => {
    const job = snap.data()
    const model = getModel()

    const prompt = `Write a short, engaging push notification (max 100 characters) in English
announcing this Assam job opening: ${job.role} at ${job.department}, district: ${job.assam_district || 'Entire Assam'}.
Return plain text only, no quotes.`
    const result = await model.generateContent(prompt)
    const notifText = result.response.text().trim()

    let usersQuery = db.collection('user_profiles')
    if (job.assam_district && job.assam_district !== 'Entire Assam') {
      usersQuery = usersQuery.where('assam_district', '==', job.assam_district)
    }
    const users = await usersQuery.get()
    const tokens = users.docs.map((d) => d.data().fcmToken).filter(Boolean)
    if (tokens.length === 0) return null

    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title: 'New Job Alert', body: notifText }
    })
    return null
  })

// ---------------------------------------------------------------
// 3. Dead Link & Expired Job Cleanup (scheduled daily)
// ---------------------------------------------------------------
exports.cleanupExpiredJobs = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  const now = new Date()
  const snap = await db.collection('job_listings').where('status', '==', 'active').get()
  const batch = db.batch()
  snap.docs.forEach((doc) => {
    const deadline = doc.data().deadline ? new Date(doc.data().deadline) : null
    if (deadline && deadline < now) batch.update(doc.ref, { status: 'archived' })
  })
  await batch.commit()
  return null
})

// ---------------------------------------------------------------
// 4. HTTPS endpoints consumed by src/services/geminiAgent.js
// ---------------------------------------------------------------
exports.chatWithAssistant = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { message, language = 'en', history = [] } = req.body
      const model = getModel()
      const langNames = { en: 'English', as: 'Assamese', hi: 'Hindi', bn: 'Bengali' }
      const historyText = history.map((h) => `${h.role}: ${h.text}`).join('\n')

      const prompt = `You are a helpful assistant for Assam job seekers. Reply in ${langNames[language] || 'English'}.
Explain eligibility, syllabi, or forms clearly and briefly.
Conversation so far:
${historyText}
user: ${message}
assistant:`

      const result = await model.generateContent(prompt)
      res.json({ reply: result.response.text() })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'assistant_failed' })
    }
  })
})

exports.summarizeNotification = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { text, language = 'en' } = req.body
      const model = getModel()
      const prompt = `Summarize this job notification into exactly 3 bullet points: Age Limit, Required Qualification, Application Deadline.
Return strict JSON only: {"ageLimit": "...", "qualification": "...", "deadline": "..."}
Text: """${(text || '').slice(0, 8000)}"""`

      const result = await model.generateContent(prompt)
      const json = safeParseJSON(result.response.text())
      res.json(json || { ageLimit: '', qualification: '', deadline: '' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'summarize_failed' })
    }
  })
})

function safeParseJSON(text) {
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    return null
  }
}
