import { GoogleGenerativeAI } from '@google/generative-ai'
import { validatePublicUrl } from './_lib/ssrfGuard.js'
import { fetchPageContent } from './_lib/crawl.js'

const SCHEMAS = {
  syllabus: {
    university_board: 'university or board name, null if not found',
    course: 'course/programme name, null if not found',
    subject: 'subject name, null if not found',
    code: 'subject/paper code, null if not found',
    semester_or_year: 'semester or year, null if not found',
    units: 'array of unit objects {title, topics[]} — only units actually listed',
    marks: 'mark distribution info if stated, else null',
    dates: 'relevant dates if stated, else null',
    notes: 'any other important instructions, else null'
  },
  pyq: {
    exam: 'exam name, null if not found',
    university_board: 'university or board name, null if not found',
    year: 'exam year, null if not found',
    semester: 'semester, null if not found',
    subject: 'subject name, null if not found',
    code: 'subject code, null if not found',
    paper_code: 'paper code, null if not found',
    sections: 'array of section objects {name, questions[], marks} — only sections actually present; omit questions array if not recoverable',
    total_marks: 'total marks if stated, else null',
    instructions: 'array of instruction strings actually printed on the paper, else null'
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { url, type = 'syllabus', language = 'en' } = req.body || {}
    const schema = SCHEMAS[type]
    if (!schema) return res.status(400).json({ error: 'invalid_type' })

    const check = await validatePublicUrl(url)
    if (!check.ok) return res.status(400).json({ error: check.error })

    let page
    try {
      page = await fetchPageContent(check.url.href)
    } catch {
      return res.status(422).json({ error: 'fetch_failed' })
    }
    if (!page.content || page.content.length < 80) {
      return res.status(422).json({ error: 'no_content' })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash', generationConfig: { temperature: 0 } })
    const prompt = `You extract structured exam data. From the page content below, extract ONLY the "${type}" information.
Return strict JSON with exactly these keys (use null for anything not explicitly present in the content — never invent values):
${JSON.stringify(schema, null, 2)}

Page URL: ${page.url}
Page title: ${page.title || ''}
Language preference for text values: ${language}

PAGE CONTENT:
"""
${page.content.slice(0, 30000)}
"""

Respond with the JSON object only.`

    const result = await model.generateContent(prompt)
    let raw = result.response.text().trim()
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      const m = raw.match(/\{[\s\S]*\}/)
      if (!m) throw new Error('gemini_bad_output')
      data = JSON.parse(m[0])
    }
    res.status(200).json({ type, sourceUrl: page.url, title: page.title, data, fallback: !!page.fallback })
  } catch (err) {
    console.error('scrape error:', err)
    res.status(500).json({ error: 'scrape_failed' })
  }
}
