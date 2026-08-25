import crypto from 'crypto'
import { validatePublicUrl } from './ssrfGuard.js'
import { fetchPageContent } from './crawl.js'
import { SOURCES, scoreNoticeLink, isJunkHref } from './sources.js'
import { loadSnapshots, saveSnapshot, queueItems, isStoreConfigured } from './watchStore.js'

const PER_SOURCE_TIMEOUT_MS = 14000
const SERVICE_WAIT_MS = 6000
const MAX_LINKS_PER_SOURCE = 200
const SNAPSHOT_LINK_CAP = 400

function docIdFromLink(link) {
  return crypto.createHash('sha256').update(link).digest('hex').slice(0, 24)
}

// Extract notification-like links from a fetched page, ranked best-first.
export function pickNoticeLinks(page, originUrl) {
  const seen = new Set()
  const out = []
  for (const link of page.links || []) {
    if (!link?.href || isJunkHref(link.href)) continue
    let abs
    try {
      abs = new URL(link.href, originUrl)
      if (abs.protocol !== 'http:' && abs.protocol !== 'https:') continue
      abs.hash = ''
    } catch {
      continue
    }
    const href = abs.toString()
    if (seen.has(href)) continue
    const score = scoreNoticeLink(link.text, href)
    if (score <= 0) continue
    seen.add(href)
    out.push({ href, text: link.text || '', score })
  }
  out.sort((a, b) => b.score - a.score)
  return out.slice(0, MAX_LINKS_PER_SOURCE)
}

export async function crawlSource(source, remainingMs) {
  const guard = await validatePublicUrl(source.url)
  if (!guard.ok) throw new Error(`ssrf_blocked:${guard.error}`)
  const timeoutMs = Math.min(PER_SOURCE_TIMEOUT_MS, Math.max(3000, remainingMs))
  // Short service wait so a hung Crawl4AI call doesn't eat the static-fetch budget
  // (NIC/gov sites are slow from Vercel's US region; static fetch needs the time).
  const page = await fetchPageContent(guard.url.href, { timeoutMs, serviceTimeoutMs: SERVICE_WAIT_MS, allowInsecureTls: true })
  return page
}

/**
 * Watch one batch of sources: crawl -> extract notice links -> diff against
 * the stored snapshot -> queue new links. Returns a report; safe to call
 * repeatedly with `cursor` until it returns nextCursor == null.
 */
export async function runWatchBatch({ max = 5, cursor = 0, budgetMs = 45000 } = {}) {
  const t0 = Date.now()
  const deadline = t0 + budgetMs
  const report = {
    startedAt: new Date(t0).toISOString(),
    persisted: isStoreConfigured(),
    processed: [],
    queuedCount: 0,
    nextCursor: null,
    elapsedMs: null
  }

  const start = Math.max(0, Math.min(cursor | 0, SOURCES.length))
  const end = Math.min(SOURCES.length, start + Math.max(1, Math.min(max, SOURCES.length)))
  const batchSources = SOURCES.slice(start, end)

  let snapshots = {}
  try {
    snapshots = await loadSnapshots(batchSources.map((s) => s.id))
  } catch (err) {
    console.error('[watch] snapshot load failed:', err.message)
  }

  for (const source of batchSources) {
    const remaining = deadline - Date.now()
    if (remaining < 6000) {
      report.nextCursor = SOURCES.findIndex((s) => s.id === source.id)
      break
    }
    const entry = { id: source.id, name: source.name, newCount: 0, totalLinks: 0 }
    try {
      const page = await crawlSource(source, remaining)
      const candidates = pickNoticeLinks(page, page.url || source.url)
      entry.totalLinks = candidates.length

      const prev = snapshots[source.id]?.linkHashes || {}
      const fresh = candidates.filter((c) => !prev[docIdFromLink(c.href)])

      // Merge old + new hashes, keep the newest SNAPSHOT_LINK_CAP entries.
      const merged = { ...prev }
      for (const c of candidates) merged[docIdFromLink(c.href)] = c.text.slice(0, 200)
      const keys = Object.keys(merged)
      const trimmed = Object.fromEntries(keys.slice(-SNAPSHOT_LINK_CAP).map((k) => [k, merged[k]]))

      if (report.persisted) {
        await saveSnapshot(source.id, { url: source.url, name: source.name, linkHashes: trimmed })
        if (fresh.length) {
          const nowIso = new Date().toISOString()
          await queueItems(
            fresh.map((c) => ({
              docId: docIdFromLink(c.href),
              data: {
                sourceId: source.id,
                sourceName: source.name,
                category: source.category,
                url: c.href,
                title: c.text.slice(0, 300),
                score: c.score,
                status: 'pending',
                foundAt: nowIso,
                detectedAt: new Date().toISOString()
              }
            }))
          )
        }
      }
      entry.newCount = fresh.length
      if (fresh.length) {
        entry.newLinks = fresh.slice(0, 10).map((c) => ({ url: c.href, title: c.text.slice(0, 120), score: c.score }))
      }
      console.log(`[watch] ${source.id}: ${candidates.length} notice links, ${fresh.length} new`)
    } catch (err) {
      entry.error = err.message
      console.error(`[watch] ${source.id} failed:`, err.message)
    }
    report.processed.push(entry)
  }

  if (report.nextCursor === null && end < SOURCES.length) report.nextCursor = end
  report.elapsedMs = Date.now() - t0
  report.queuedCount = report.processed.reduce((n, e) => n + e.newCount, 0)
  console.log(`[watch] batch done: sources=${report.processed.length} new=${report.queuedCount} persisted=${report.persisted} elapsed=${report.elapsedMs}ms nextCursor=${report.nextCursor}`)
  return report
}
