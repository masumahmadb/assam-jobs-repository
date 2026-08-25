import fetch from 'node-fetch'
import https from 'https'

const UA = 'Mozilla/5.0 (compatible; AssamJobsRisingBot/1.0)'
const MAX_PDF_BYTES = 30 * 1024 * 1024
const MAX_LINKS_PER_PAGE = 800

function staticFetch(url, timeoutMs, agent) {
  return fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(Math.max(3000, timeoutMs)),
    ...(agent ? { agent } : {})
  })
}

// Fetch cleaned page content for scraping commands.
// Tiered chain (auto-escalating):
//   1. /static  — Crawl4AI service's trafilatura endpoint: no browser, cheapest.
//   2. /scrape  — real-browser rendering, only when tier 1 is thin/missing
//                 (JS shells, bot-guarded pages).
//   3. Local strip — plain fetch + naive HTML-to-text, last resort.
// allowInsecureTls: retry once with relaxed cert verification on TLS chain errors
// (many NIC/gov sites ship incomplete cert chains). Only enable for curated sources.
export async function fetchPageContent(url, { timeoutMs = 30000, serviceTimeoutMs, allowInsecureTls = false } = {}) {
  const serviceUrl = process.env.SCRAPER_SERVICE_URL

  if (serviceUrl) {
    // Tier 1: static trafilatura extraction — cheap, fast, good enough for
    // server-rendered pages (all *.assam.gov.in Drupal portals).
    const svcWait = Math.max(3000, Math.min(serviceTimeoutMs ?? timeoutMs, timeoutMs))
    try {
      const res = await fetch(`${serviceUrl}/static`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(svcWait)
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && !data.thin && data.content) {
          return { ...data, fallback: false, links: data.links || [] }
        }
        if (data.thin) console.log(`[crawl] static tier thin for ${url}, escalating to browser`)
      }
    } catch {
      // fall through to browser tier
    }

    // Tier 2: real-browser rendering.
    try {
      const res = await fetch(`${serviceUrl.replace(/\/$/, '')}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(Math.max(3000, timeoutMs))
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.content) {
          return {
            ...data,
            fallback: false,
            links: extractLinksFromMarkdown(data.content, url)
          }
        }
      }
    } catch {
      // fall through to local static fetch
    }
  }

  let res
  try {
    res = await staticFetch(url, timeoutMs)
  } catch (err) {
    const isCertErr = /certificate|CERT|self[- ]signed|unable to verify/i.test(String(err?.message || err?.cause?.message || ''))
    if (!allowInsecureTls || !isCertErr) throw err
    console.log(`[crawl] TLS chain error, retrying insecure (curated source): ${url}`)
    res = await staticFetch(url, timeoutMs, new https.Agent({ rejectUnauthorized: false, keepAlive: false }))
  }
  if (!res.ok) throw new Error('fetch_failed')
  const html = (await res.text()).slice(0, 2_000_000)
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\/(?:p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return {
    success: true,
    url,
    title: titleMatch ? decodeEntities(titleMatch[1]).trim() : null,
    content: text.slice(0, 60000),
    truncated: text.length > 60000,
    fallback: true,
    links: extractLinksFromHtml(html, url)
  }
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
}

function resolveHref(href, baseUrl) {
  try {
    const abs = new URL(href, baseUrl)
    if (abs.protocol !== 'http:' && abs.protocol !== 'https:') return null
    return abs.href
  } catch {
    return null
  }
}

function extractLinksFromHtml(html, baseUrl) {
  const out = []
  const re = /<a\b[^>]*href\s*=\s*["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi
  let m
  while ((m = re.exec(html)) && out.length < MAX_LINKS_PER_PAGE) {
    const href = resolveHref(m[1].trim(), baseUrl)
    if (!href) continue
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)
    out.push({ href, text })
  }
  return out
}

function extractLinksFromMarkdown(md, baseUrl) {
  const out = []
  const re = /\[([^\]\n]{0,300})\]\(([^)\s]+)/g
  let m
  while ((m = re.exec(md)) && out.length < MAX_LINKS_PER_PAGE) {
    const href = resolveHref(m[2], baseUrl)
    if (!href) continue
    out.push({ href, text: m[1].replace(/\s+/g, ' ').trim().slice(0, 200) })
  }
  return out
}

function looksLikePdf(buf) {
  if (!buf || buf.length < 5) return false
  const head = buf.subarray(0, 1024).toString('latin1')
  return head.startsWith('%PDF-') || /%PDF-\d/.test(head)
}

export { looksLikePdf }

// Download a PDF and validate it by magic bytes. Returns { ok, buf } or { ok:false, error }.
export async function fetchPdfBuffer(url, { timeoutMs = 25000 } = {}) {
  let res
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(Math.max(3000, timeoutMs))
    })
  } catch {
    return { ok: false, error: 'fetch_failed' }
  }
  if (!res.ok) return { ok: false, error: 'upstream_error', status: res.status }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length > MAX_PDF_BYTES) return { ok: false, error: 'file_too_large' }
  if (!looksLikePdf(buf)) return { ok: false, error: 'not_a_pdf' }
  return { ok: true, buf }
}

// Cheap check that a URL really serves a PDF: read only the first bytes then abort.
export async function probePdf(url, { timeoutMs = 10000, maxBytes = 2048 } = {}) {
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), Math.max(2000, timeoutMs))
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      redirect: 'follow',
      signal: ac.signal
    })
    if (!res.ok || !res.body) return false
    const reader = res.body.getReader()
    let received = 0
    let head = ''
    while (received < maxBytes) {
      const { done, value } = await reader.read()
      if (done) break
      head += Buffer.from(value).toString('latin1')
      received += value.length
    }
    reader.cancel().catch(() => {})
    return /%PDF-\d/.test(head.slice(0, 1024))
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}
