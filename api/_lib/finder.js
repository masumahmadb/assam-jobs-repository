import { GoogleGenerativeAI } from '@google/generative-ai'
import { validatePublicUrl } from './ssrfGuard.js'
import { fetchPageContent, fetchPdfBuffer, probePdf } from './crawl.js'

const MODEL_NAME = 'gemini-3.6-flash'
const TOTAL_BUDGET_MS = Number(process.env.FINDER_BUDGET_MS || 38000)
const FETCH_TIMEOUT_MS = 15000
const GEMINI_TIMEOUT_MS = 14000
const LEVEL_WIDTH = 6
const SEARCH_WIDTH = 6
const STAGE1_MAX_DEPTH = 4
const STAGE2_MAX_DEPTH = 2
const MAX_TOTAL_PAGES = 26
const PER_DOMAIN_CAP = 14
const MAX_PDF_BYTES_FOR_GEMINI = 18 * 1024 * 1024

export const SCHEMAS = {
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

// --- keyword sniffing (en / hi / as / bn) ----------------------------------

const STRONG_KEYWORDS = [
  'syllabus', 'question paper', 'previous year', 'last year question',
  'old question paper', 'exam pattern', 'scheme of examination', 'scheme of exam',
  'course structure', 'curriculum',
  'पाठ्यक्रम', 'सिलेबास', 'प्रश्न पत्र', 'प्रश्नपत्र', 'पिछले वर्ष', 'परीक्षा योजना',
  'সিলেবাচ', 'সিলেবাস', 'পাঠ্যক্ৰম', 'প্ৰশ্নপত্ৰ', 'প্রশ্নপত্র', 'আগৰ বছৰৰ প্ৰশ্ন',
  'গত বছৰৰ',
  'প্রশ্ন পত্র', 'পূর্ববর্তী বছরের', 'গত বছরের'
]

const WEAK_KEYWORDS_RE = /\b(units?|topics?|marks?|distribution of marks|model question|sample paper|question bank|written examination|written test|objective type|mcqs?)\b/gi

function keywordCheck(content) {
  const text = String(content || '').slice(0, 20000).toLowerCase()
  const strongHits = STRONG_KEYWORDS.filter((k) => text.includes(k.toLowerCase()))
  const weakHits = text.match(WEAK_KEYWORDS_RE) || []
  const score = strongHits.length * 2 + weakHits.length
  return { strongHits, weakCount: weakHits.length, score, pass: strongHits.length >= 1 && score >= 3 }
}

// --- link filtering / ranking ----------------------------------------------

const JUNK_URL_RE = /(?:facebook\.com\/sharer|twitter\.com\/intent|x\.com\/intent|api\.whatsapp\.com|wa\.me|t\.me\/share|pinterest\.com|linkedin\.com\/shareA|mailto:|tel:|javascript:|data:|doubleclick|googlesyndication|google-analytics|googletagmanager|facebook\.com\/tr|\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|m3u8|mp4|zip|rar)(?:[?#]|$))/i

const NAV_TEXT_RE = /^(?:home|main|about(?: us)?|contact(?: us)?|disclaimer|privacy(?: policy)?|terms(?: & conditions| of use)?|faq|faqs|sitemap|login|sign ?in|sign ?up|register|feedback|help|careers|advertisement|archive|tenders|rti|accessibility|hyperlink ?policy|copyright|screen reader|skip to (?:main )?content|website policies?|helpdesk|grievance)$/i

const SOCIAL_PROFILE_RE = /^https?:\/\/(?:www\.)?(?:facebook|fb)\.com\/(?!sharer|share\.php|tr$|dialog)[A-Za-z0-9_.\-]+|^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/(?!intent|share|search|hashtag)[A-Za-z0-9_]+/i

const LINK_STRONG = ['syllabus', 'question paper', 'question-paper', 'questionpaper', 'previous year', 'prev year', 'old question', 'pyq', 'curriculum', 'course structure', 'exam pattern', 'exam-pattern', 'scheme of exam', 'पाठ्यक्रम', 'सिलेबास', 'प्रश्न पत्र', 'প্রশ्नपত্র', 'প্রশ্ন পত্র', 'সিলেবাচ', 'সিলেবাস', 'পাঠ্যক্ৰম']
const LINK_WEAK = ['bulletin', 'notification', 'prospectus', 'guideline', 'examination', 'exam', 'unit', 'topic', 'marks', 'pdf', 'download']

function safeLower(s) {
  try { return decodeURIComponent(s).toLowerCase() } catch { return s.toLowerCase() }
}

function scoreCandidate(text, href) {
  const t = String(text || '').toLowerCase()
  const h = safeLower(href)
  let s = 0
  for (const k of LINK_STRONG) if (t.includes(k) || h.includes(k)) s += 6
  for (const k of LINK_WEAK) if (t.includes(k) || h.includes(k)) s += 1
  if (/\.pdf(?:[?#]|$)/i.test(href)) s += 3
  if (NAV_TEXT_RE.test(t.trim())) s -= 25
  if (/(login|register|signup|apply-online|payment)/.test(h)) s -= 10
  return s
}

function isSocialProfile(href) {
  return SOCIAL_PROFILE_RE.test(href)
}

// --- misc helpers -----------------------------------------------------------

function normalizeUrl(rawUrl) {
  let url
  try {
    url = new URL(String(rawUrl))
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  url.hash = ''
  for (const k of [...url.searchParams.keys()]) {
    if (/^(utm_|gclid|fbclid|msclkid|ref_src|ref_url|igshid|spm|_ga)/i.test(k)) url.searchParams.delete(k)
  }
  let s = url.toString()
  if (s.endsWith('?')) s = s.slice(0, -1)
  while (s.endsWith('/') && new URL(s).pathname !== '/') s = s.slice(0, -1)
  return s
}

function hostOf(u) {
  try { return new URL(u).hostname.toLowerCase() } catch { return '' }
}

function withTimeout(promise, ms, tag) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${tag}_timeout`)), ms))
  ])
}

function parseJsonLoose(raw) {
  let text = String(raw || '').trim()
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  try {
    return JSON.parse(text)
  } catch {
    const m = text.match(/\{[\s\S]*\}/)
    if (!m) throw new Error('gemini_bad_output')
    return JSON.parse(m[0])
  }
}

function extractYearFromText(text) {
  const years = {}
  for (const m of String(text || '').matchAll(/\b20[0-9]{2}\b/g)) {
    const y = Number(m[0])
    if (y >= 2015 && y <= 2040) years[y] = (years[y] || 0) + 1
  }
  const entries = Object.entries(years)
  if (!entries.length) return null
  entries.sort((a, b) => b[1] - a[1] || b[0] - a[0])
  return Number(entries[0][0])
}

function bestSnippet(content, keywords) {
  const text = String(content || '')
  let idx = -1
  for (const k of keywords) {
    const i = text.toLowerCase().indexOf(k.toLowerCase())
    if (i !== -1 && (idx === -1 || i < idx)) idx = i
  }
  if (idx === -1) idx = 0
  const start = Math.max(0, idx - 120)
  return text.slice(start, start + 320).replace(/\s+/g, ' ').trim()
}

function hasMeaningfulData(data, type) {
  if (!data || typeof data !== 'object') return false
  const vals = Object.values(data)
  const filled = vals.filter((v) =>
    v != null && !(Array.isArray(v) && v.length === 0) &&
    !(typeof v === 'object' && !Array.isArray(v) && Object.values(v).every((x) => x == null))
  ).length
  if (filled < 2) return false
  if (type === 'syllabus') {
    const core = (Array.isArray(data.units) && data.units.length > 0) || data.course || data.subject || data.marks
    return !!core && filled >= 2
  }
  if (type === 'pyq') {
    const core = (Array.isArray(data.sections) && data.sections.length > 0) || data.exam || data.year || data.subject
    return !!core && filled >= 2
  }
  return filled >= 3
}

// --- Gemini helpers ---------------------------------------------------------

let _genAI = null
function getGenAI() {
  if (!_genAI) _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return _genAI
}

function extractionPrompt(type, schema, language) {
  return `You extract structured exam data. From the provided content, extract ONLY the "${type}" information.
Return strict JSON with exactly these keys (use null for anything not explicitly present in the content — never invent values):
${JSON.stringify(schema, null, 2)}

If this page does NOT genuinely contain ${type} information, return every key as null.
Language preference for text values: ${language}

Respond with the JSON object only.`
}

async function geminiExtractPage(type, language, page) {
  const model = getGenAI().getGenerativeModel({ model: MODEL_NAME, generationConfig: { temperature: 0 } })
  const prompt = `${extractionPrompt(type, SCHEMAS[type], language)}

Page URL: ${page.url}
Page title: ${page.title || ''}

PAGE CONTENT:
"""
${String(page.content).slice(0, 30000)}
"""`
  const result = await withTimeout(model.generateContent(prompt), GEMINI_TIMEOUT_MS, 'extract')
  return parseJsonLoose(result.response.text())
}

async function geminiExtractPdf(type, language, buf) {
  const model = getGenAI().getGenerativeModel({ model: MODEL_NAME, generationConfig: { temperature: 0 } })
  const payload = [
    { text: `${extractionPrompt(type, SCHEMAS[type], language)}\n\nThis is a PDF document.` },
    { inlineData: { mimeType: 'application/pdf', data: buf.subarray(0, MAX_PDF_BYTES_FOR_GEMINI).toString('base64') } }
  ]
  const result = await withTimeout(model.generateContent(payload), GEMINI_TIMEOUT_MS + 6000, 'extract_pdf')
  return parseJsonLoose(result.response.text())
}

async function geminiJobName(pageDigest, title) {
  const model = getGenAI().getGenerativeModel({ model: MODEL_NAME, generationConfig: { temperature: 0 } })
  const prompt = `Identify the official recruitment/exam name and organisation from this job notification excerpt.
Respond strictly as JSON: {"name": "...", "org": "..."} using only what is stated (null if unclear).

Page title: ${title || ''}
EXCERPT:
"""
${pageDigest.slice(0, 6000)}
"""`
  try {
    const result = await withTimeout(model.generateContent(prompt), GEMINI_TIMEOUT_MS, 'jobname')
    const data = parseJsonLoose(result.response.text())
    return [data.org, data.name].filter(Boolean).join(' ') || title || null
  } catch {
    return title || null
  }
}

async function geminiSearchUrls(queries) {
  const model = getGenAI().getGenerativeModel({
    model: MODEL_NAME,
    tools: [{ googleSearch: {} }]
  })
  const prompt = `Run these web searches and give me the URLs of the most relevant results (official websites, official PDFs, or reputable exam portals):
${queries.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
  const result = await withTimeout(model.generateContent(prompt), GEMINI_TIMEOUT_MS + 4000, 'web_search')
  const uris = new Map()
  const chunks = result?.response?.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  for (const c of chunks) {
    if (c.web?.uri) uris.set(c.web.uri, c.web.title || '')
  }
  let text = ''
  try { text = result.response.text() } catch { /* grounding-only response */ }
  for (const m of text.matchAll(/https?:\/\/[^\s)"'<>\]]+/g)) {
    if (!uris.has(m[0])) uris.set(m[0], '')
  }
  return [...uris.entries()].map(([href, text]) => ({ href, text }))
}

async function geminiReason(type, evidence) {
  const model = getGenAI().getGenerativeModel({ model: MODEL_NAME, generationConfig: { temperature: 0 } })
  const prompt = `We searched several pages (listed below) trying to find a "${type}" for a recruitment/exam, but found none.
Based ONLY on the evidence below, state briefly (1-2 sentences) why no ${type} could be found — e.g. "selection appears to be interview-based with no written exam" or "no syllabus has been published yet".
Only give an explanation the evidence actually supports. If nothing in the evidence supports any explanation, set supported to false.
Respond strictly as JSON: {"supported": true|false, "reason": "..."}

EVIDENCE:
${evidence}`
  const result = await withTimeout(model.generateContent(prompt), GEMINI_TIMEOUT_MS, 'reason')
  return parseJsonLoose(result.response.text())
}

// --- main cascade engine ----------------------------------------------------

export async function runSyllabusFinder({ startUrl, type, language = 'en' }) {
  const t0 = Date.now()
  const deadline = t0 + TOTAL_BUDGET_MS
  const trace = []
  const log = (stage, msg) => {
    const line = `[finder][${stage}] ${msg}`
    trace.push(line)
    console.log(line)
  }
  const remaining = () => deadline - Date.now()

  const visited = new Set()
  const domainCounts = new Map()
  const crawledPages = [] // { url, title, content }
  const socialLinks = new Set()
  const emails = []
  let pagesCrawled = 0
  const schema = SCHEMAS[type]
  if (!schema) return { status: 'invalid_type' }

  async function processPdfUrl(pdfUrl) {
    log('crawl', `PDF candidate: ${pdfUrl}`)
    const dl = await fetchPdfBuffer(pdfUrl, { timeoutMs: Math.min(FETCH_TIMEOUT_MS + 10000, Math.max(3000, remaining())) })
    if (!dl.ok) {
      log('crawl', `PDF rejected (${dl.error}): ${pdfUrl}`)
      return null
    }
    if (remaining() < 5000) {
      log('crawl', 'budget too low for PDF extraction')
      return null
    }
    try {
      const data = await geminiExtractPdf(type, language, dl.buf)
      if (hasMeaningfulData(data, type)) return { data, url: pdfUrl }
      log('crawl', `PDF extracted but no meaningful ${type} data: ${pdfUrl}`)
    } catch (err) {
      log('crawl', `PDF extraction failed: ${err.message}`)
    }
    return null
  }

  // Fetches one URL (SSRF-guarded, deduped), sniffs it for syllabus/PYQ content,
  // extracts structured data on a hit, and returns its outgoing candidates.
  async function processPage(rawUrl, stageLabel, allowExternal) {
    const normalized = normalizeUrl(rawUrl)
    if (!normalized) return { skipped: true }
    const guard = await validatePublicUrl(normalized)
    if (!guard.ok) {
      log(stageLabel, `SSRF guard blocked: ${normalized} (${guard.error})`)
      return { skipped: true }
    }
    const href = guard.url.href
    if (visited.has(href)) return { skipped: true }
    if (!allowExternal && hostOf(href) !== originHost) return { skipped: true }
    const host = hostOf(href)
    if ((domainCounts.get(host) || 0) >= PER_DOMAIN_CAP) return { skipped: true }
    visited.add(href)
    domainCounts.set(host, (domainCounts.get(host) || 0) + 1)
    if (pagesCrawled >= MAX_TOTAL_PAGES || remaining() < 3500) {
      log(stageLabel, `budget/page-cap reached, skipping ${href}`)
      return { skipped: true, budgetStop: true }
    }

    if (/\.pdf(?:[?#]|$)/i.test(guard.url.pathname)) {
      const hit = await processPdfUrl(href)
      return hit ? { pdfHit: hit } : { skipped: true }
    }

    // Flaky gov servers (e.g. NIC sites) often time out intermittently — retry the
    // origin page a couple of times before declaring the site unreachable.
    const isOrigin = href === normalizeUrl(startUrl)
    const attempts = isOrigin ? 3 : 1
    let page
    for (let i = 0; ; i++) {
      try {
        page = await fetchPageContent(href, { timeoutMs: Math.min(FETCH_TIMEOUT_MS, Math.max(3000, remaining())) })
        break
      } catch {
        if (i >= attempts - 1 || remaining() < 7000) {
          log(stageLabel, `fetch failed after ${i + 1} attempt(s): ${href}`)
          return { skipped: true }
        }
        log(stageLabel, `fetch failed (attempt ${i + 1}/${attempts}), retrying: ${href}`)
        await new Promise((r) => setTimeout(r, 600))
      }
    }
    pagesCrawled++
    log(stageLabel, `fetched (${pagesCrawled}) fallback=${!!page.fallback}: ${href}`)

    for (const link of page.links || []) {
      if (/^mailto:/i.test(link.href)) {
        const addr = link.href.replace(/^mailto:/i, '').split('?')[0].trim()
        if (addr && !emails.includes(addr)) emails.push(addr)
      }
    }
    for (const m of String(page.content || '').matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
      const addr = m[0]
      if (/\.(png|jpe?g|gif|webp)$/i.test(addr) || /example\.com|sentry|wixpress/i.test(addr)) continue
      if (!emails.includes(addr)) emails.push(addr)
    }
    for (const link of page.links || []) {
      if (JUNK_URL_RE.test(link.href)) continue
      if (isSocialProfile(link.href)) socialLinks.add(link.href.split('?')[0])
    }

    if (!page.content || page.content.length < 80) {
      log(stageLabel, `thin/no content: ${href}`)
      return { skipped: true }
    }
    crawledPages.push({ url: page.url || href, title: page.title || '', content: page.content })

    const kw = keywordCheck(page.content)
    if (!kw.pass) return { page, links: page.links || [], kw }

    log(stageLabel, `keyword hit (score=${kw.score}, strong=[${kw.strongHits.slice(0, 5).join(',')}]): ${href}`)
    if (remaining() < 6000) {
      log(stageLabel, 'budget too low for extraction here')
      return { page, links: page.links || [], kw, budgetStop: true }
    }
    try {
      const data = await geminiExtractPage(type, language, page)
      if (hasMeaningfulData(data, type)) {
        return { page, links: page.links || [], kw, extraction: { ok: true, data } }
      }
      log(stageLabel, `keyword hit but extraction empty (false positive): ${href}`)
    } catch (err) {
      log(stageLabel, `extraction error: ${err.message}`)
    }
    return { page, links: page.links || [], kw }
  }

  function rankAndDedupe(results, originHost, allowExternal, limit) {
    const seen = new Set()
    const out = []
    for (const r of results) {
      if (!r || !r.links) continue
      const scored = []
      for (const link of r.links) {
        if (!link.href || JUNK_URL_RE.test(link.href)) continue
        if (isSocialProfile(link.href)) continue
        const n = normalizeUrl(link.href)
        if (!n || seen.has(n) || visited.has(n)) continue
        if (!allowExternal && hostOf(n) !== originHost) continue
        scored.push({ url: n, score: scoreCandidate(link.text, n) })
        seen.add(n)
      }
      scored.sort((a, b) => b.score - a.score)
      out.push(...scored.filter((c) => c.score > 0))
    }
    out.sort((a, b) => b.score - a.score)
    return out.slice(0, limit).map((c) => c.url)
  }

  function detectStaleness(data, sourceUrl) {
    const startDigest = crawledPages[0]
    if (!startDigest) return null
    const requestedYear =
      extractYearFromText(`${startDigest.content.slice(0, 4000)} ${startDigest.title}`) ||
      extractYearFromText(startUrl)
    const explicit =
      (data && typeof data === 'object' &&
        (data.year || data.semester_or_year || (data.dates && extractYearFromText(JSON.stringify(data.dates)))))
    const foundYear = typeof explicit === 'number' ? explicit : extractYearFromText(typeof explicit === 'string' ? explicit : '') ||
      (data ? extractYearFromText(JSON.stringify(data).slice(0, 2000)) : null)
    if (requestedYear && foundYear && requestedYear > foundYear) {
      return { requestedYear, foundYear }
    }
    return null
  }

  function buildFound(hit, stageLabel) {
    const staleness = detectStaleness(hit.data, hit.url)
    const base = {
      status: staleness ? 'stale' : 'found',
      stage: stageLabel,
      data: hit.data,
      sourceUrl: hit.url,
      pdfUrl: hit.pdfUrl || null,
      title: hit.title || null,
      fallback: !!hit.fallback
    }
    if (staleness) {
      base.notice = `This is the last available ${type} (${staleness.foundYear}) — the ${staleness.requestedYear} version doesn't appear to be published yet.`
      log(stageLabel, `stale match: found ${staleness.foundYear}, requested ~${staleness.requestedYear}`)
    }
    log(stageLabel, `SUCCESS via ${hit.url}${hit.pdfUrl ? ' (+pdf attached)' : ''}`)
    return finish(base)
  }

  function finish(partial) {
    return {
      ...partial,
      meta: {
        elapsedMs: Date.now() - t0,
        pagesCrawled,
        trace
      }
    }
  }

  async function crawlBFS(seedUrls, stageLabel, { maxDepth, width, allowExternal }) {
    let frontier = seedUrls
    for (let depth = 0; frontier.length && depth <= maxDepth; depth++) {
      if (remaining() < 4000) {
        log(stageLabel, 'time budget exhausted, stopping crawl')
        return null
      }
      const batch = frontier.slice(0, width)
      log(stageLabel, `depth ${depth}: fetching ${batch.length} page(s) in parallel`)
      const results = await Promise.all(
        batch.map(async (u) => {
          try {
            return await processPage(u, stageLabel, allowExternal)
          } catch (err) {
            log(stageLabel, `page processing error: ${err.message}`)
            return { skipped: true }
          }
        })
      )
      for (const r of results) {
        if (!r || r.skipped) continue
        if (r.pdfHit) return { kind: 'pdf', hit: { ...r.pdfHit, pdfUrl: r.pdfHit.url } }
        if (r.extraction?.ok) {
          return { kind: 'page', hit: { data: r.extraction.data, url: r.page.url, title: r.page.title, fallback: r.page.fallback } }
        }
      }
      frontier = rankAndDedupe(results, originHost, allowExternal, LEVEL_WIDTH * 3)
      log(stageLabel, `depth ${depth}: next frontier size ${frontier.length}: ${frontier.slice(0, width).join(', ').slice(0, 300)}`)
    }
    return null
  }

  // ---- Stage 1: deep-link cascade on the given site ----
  const originHost = hostOf(startUrl)
  log('stage1', `start: ${startUrl}`)
  const stage1Result = await crawlBFS([startUrl], 'stage1', {
    maxDepth: STAGE1_MAX_DEPTH,
    width: LEVEL_WIDTH,
    allowExternal: false
  })
  if (stage1Result) {
    return buildFound(stage1Result.hit, 'stage1')
  }
  if (pagesCrawled === 0) {
    log('stage1', 'origin page unreachable — aborting cascade')
    return { status: 'unreachable' }
  }

  // ---- Stage 2: web search + social ----
  log('stage2', `stage1 exhausted site (${pagesCrawled} pages). Starting web search.`)
  if (remaining() > 9000) {
    const startPage = crawledPages[0]
    const jobName = await geminiJobName(
      `${startPage.title || ''}\n${bestSnippet(startPage.content, [])}\n${startPage.content.slice(0, 2500)}`,
      startPage.title
    )
    log('stage2', `identified job/exam name: ${jobName}`)
    let searchCandidates = []
    try {
      const results = await geminiSearchUrls([
        `${jobName} syllabus`,
        `${jobName} previous year question paper`
      ])
      searchCandidates = results.map((r) => ({ url: normalizeUrl(r.href), score: scoreCandidate(r.text, r.href) }))
        .filter((c) => c.url && c.score >= 0)
      log('stage2', `search returned ${results.length} urls -> ${searchCandidates.length} usable`)
    } catch (err) {
      log('stage2', `web search failed: ${err.message}`)
    }
    for (const s of socialLinks) {
      searchCandidates.push({ url: normalizeUrl(s), score: 4 })
    }
    const seeds = [...new Set(searchCandidates.sort((a, b) => b.score - a.score).map((c) => c.url))]
      .filter((u) => u && u !== startUrl)
      .slice(0, SEARCH_WIDTH * 3)

    const stage2Result = await crawlBFS(seeds, 'stage2', {
      maxDepth: STAGE2_MAX_DEPTH,
      width: SEARCH_WIDTH,
      allowExternal: true
    })
    if (stage2Result) {
      return buildFound(stage2Result.hit, 'stage2')
    }
    log('stage2', 'nothing found from web search / social either')
  } else {
    log('stage2', 'skipped: time budget nearly exhausted')
  }

  // ---- Stage 4: reasoned explanation ----
  if (remaining() > 6000) {
    try {
      const evidence = crawledPages.slice(0, 12).map((p) =>
        `- ${p.url} | ${p.title || 'untitled'} | ${bestSnippet(p.content, STRONG_KEYWORDS)}`
      ).join('\n')
      const verdict = await geminiReason(type, evidence)
      if (verdict && verdict.supported && verdict.reason) {
        log('stage4', `reason accepted: ${verdict.reason}`)
        return finish({
          status: 'reasoned',
          stage: 'stage4',
          reason: verdict.reason,
          data: null,
          sourceUrl: startUrl,
          title: crawledPages[0]?.title || null
        })
      }
      log('stage4', 'gemini declined to give a reason (insufficient basis)')
    } catch (err) {
      log('stage4', `reason attempt failed: ${err.message}`)
    }
  }

  // ---- Stage 5: contact email last resort ----
  const originEmails = emails.filter((e) => {
    const dom = e.split('@')[1] || ''
    return originHost.endsWith(dom.split('.').slice(-2).join('.')) || originHost.endsWith(dom)
  })
  const pool = originEmails.length ? originEmails : emails
  const good = pool.find((e) => !/noreply|no-reply|donotreply/i.test(e)) || pool[0]
  if (good) {
    log('stage5', `contact email found: ${good}`)
    return finish({
      status: 'contact',
      stage: 'stage5',
      contactEmail: good,
      message: `Couldn't find a ${type}. For details, contact: ${good}`,
      data: null,
      sourceUrl: startUrl,
      title: crawledPages[0]?.title || null
    })
  }

  log('stage5', 'nothing found anywhere, no reason, no email')
  return finish({
    status: 'not_found',
    stage: 'stage5',
    message: `Couldn't find a ${type} for this link after searching the site and the web. Please contact the organisation directly.`,
    data: null,
    sourceUrl: startUrl,
    title: crawledPages[0]?.title || null
  })
}
