import { validatePublicUrl } from './_lib/ssrfGuard.js'

const MAX_PDF_BYTES = 30 * 1024 * 1024

function looksLikePdf(buf) {
  if (!buf || buf.length < 5) return false
  const head = buf.subarray(0, 1024).toString('latin1')
  return head.startsWith('%PDF-') || /%PDF-\d/.test(head)
}

// GET /api/pdf?url=<encoded>&download=1
//   download=1 -> streams the verified PDF as an attachment (real Download PDF button target)
//   otherwise  -> JSON validation result { ok, filename, size }
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const check = await validatePublicUrl(req.query.url)
    if (!check.ok) return res.status(400).json({ error: check.error })

    let upstream
    try {
      upstream = await fetch(check.url.href, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AssamJobsRisingBot/1.0)' },
        redirect: 'follow',
        signal: AbortSignal.timeout(60000)
      })
    } catch {
      return res.status(422).json({ error: 'fetch_failed' })
    }

    if (!upstream.ok) {
      return res.status(422).json({ error: 'upstream_error', status: upstream.status })
    }

    const contentType = (upstream.headers.get('content-type') || '').toLowerCase()
    const buf = Buffer.from(await upstream.arrayBuffer())

    if (buf.length > MAX_PDF_BYTES) {
      return res.status(422).json({ error: 'file_too_large' })
    }
    // Validate it is actually a PDF — content-type alone is not trusted.
    if (!looksLikePdf(buf)) {
      return res.status(415).json({
        error: 'not_a_pdf',
        hint: contentType.includes('pdf') ? 'corrupt_pdf' : 'wrong_file_type'
      })
    }

    const dispositionHeader = upstream.headers.get('content-disposition') || ''
    let filename =
      decodeURIComponent(dispositionHeader.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)?.[1] || '') ||
      decodeURIComponent(check.url.pathname.split('/').pop() || '')
        .replace(/[^\w.\- ]+/g, '_')
        .trim() ||
      'document.pdf'
    if (!filename.toLowerCase().endsWith('.pdf')) filename += '.pdf'

    if (req.query.download === '1') {
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${filename.replace(/"/g, '')}"`)
      res.setHeader('Content-Length', buf.length)
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).send(buf)
    }

    return res.status(200).json({ ok: true, filename, size: buf.length })
  } catch (err) {
    console.error('pdf error:', err)
    return res.status(500).json({ error: 'pdf_failed' })
  }
}
