import fetch from 'node-fetch'

// Fetch cleaned page content for scraping commands.
// Primary: local Crawl4AI service (SCRAPER_SERVICE_URL) — handles JS-rendered pages.
// Fallback: plain fetch + naive HTML-to-text strip (static pages only).
export async function fetchPageContent(url) {
  const serviceUrl = process.env.SCRAPER_SERVICE_URL
  if (serviceUrl) {
    try {
      const res = await fetch(`${serviceUrl.replace(/\/$/, '')}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(60000)
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.content) return data
      }
    } catch {
      // fall through to static fetch
    }
  }

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AssamJobsRisingBot/1.0)' },
    signal: AbortSignal.timeout(30000)
  })
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
    title: titleMatch ? titleMatch[1].trim() : null,
    content: text.slice(0, 60000),
    truncated: text.length > 60000,
    fallback: true
  }
}
