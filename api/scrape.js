import { validatePublicUrl } from './_lib/ssrfGuard.js'
import { runSyllabusFinder, SCHEMAS } from './_lib/finder.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { url, type = 'syllabus', language = 'en' } = req.body || {}
    if (!SCHEMAS[type]) return res.status(400).json({ error: 'invalid_type' })
    if (!url) return res.status(400).json({ error: 'invalid_url' })

    const check = await validatePublicUrl(url)
    if (!check.ok) return res.status(400).json({ error: check.error })

    const result = await runSyllabusFinder({
      startUrl: check.url.href,
      type,
      language
    })

    if (result.status === 'unreachable') {
      return res.status(422).json({ error: 'no_content' })
    }

    console.log(`[scrape] resolved status=${result.status} stage=${result.stage} pages=${result.meta.pagesCrawled} elapsed=${result.meta.elapsedMs}ms url=${url}`)

    res.status(200).json({
      type,
      sourceUrl: result.sourceUrl || check.url.href,
      title: result.title ?? null,
      data: result.data ?? null,
      fallback: !!result.fallback,
      status: result.status,
      stage: result.stage,
      notice: result.notice ?? null,
      reason: result.reason ?? null,
      message: result.message ?? null,
      contactEmail: result.contactEmail ?? null,
      pdfUrl: result.pdfUrl ?? null,
      meta: {
        elapsedMs: result.meta.elapsedMs,
        pagesCrawled: result.meta.pagesCrawled,
        trace: result.meta.trace
      }
    })
  } catch (err) {
    console.error('scrape error:', err)
    res.status(500).json({ error: 'scrape_failed' })
  }
}
