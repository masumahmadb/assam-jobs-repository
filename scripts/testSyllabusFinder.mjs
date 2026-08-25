import { readFileSync } from 'node:fs'

// Load prod env (GEMINI_API_KEY, SCRAPER_SERVICE_URL) without clobbering existing env
for (const line of readFileSync(new URL('../.env.finder-prod', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/s)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

const { runSyllabusFinder } = await import('../api/_lib/finder.js')

const cases = [
  {
    name: 'CTET (should auto-find real syllabus from site)',
    url: process.env.CASE1_URL || 'https://ctet.nic.in/',
    type: 'syllabus'
  },
  {
    name: 'Interview-only post (should give reasoned explanation)',
    url: process.env.CASE2_URL,
    type: 'syllabus'
  },
  {
    name: 'Random unrelated page (should find nothing, not hallucinate)',
    url: process.env.CASE3_URL || 'https://en.wikipedia.org/wiki/Cricket',
    type: 'syllabus'
  }
]

for (const c of cases) {
  if (!c.url) { console.log(`\n=== ${c.name}: SKIPPED (no CASE URL provided)\n`); continue }
  console.log(`\n=== ${c.name}\nURL: ${c.url}`)
  const t0 = Date.now()
  try {
    const r = await runSyllabusFinder({ startUrl: c.url, type: c.type, language: 'en' })
    console.log('--- RESULT ---')
    console.log(JSON.stringify({
      status: r.status,
      stage: r.stage,
      elapsedMs: Date.now() - t0,
      pagesCrawled: r.meta?.pagesCrawled,
      sourceUrl: r.sourceUrl,
      title: r.title,
      pdfUrl: r.pdfUrl,
      notice: r.notice,
      reason: r.reason,
      message: r.message,
      contactEmail: r.contactEmail
    }, null, 2))
    if (r.data) {
      const filled = Object.entries(r.data).filter(([, v]) => v != null && !(Array.isArray(v) && !v.length))
      console.log('data fields filled:', filled.map(([k]) => k).join(', '))
      console.log('data sample:', JSON.stringify(filled.slice(0, 4), null, 1).slice(0, 1200))
    }
    console.log('--- TRACE ---')
    for (const line of r.meta?.trace || []) console.log(line)
  } catch (err) {
    console.error('CASE FAILED:', err)
  }
}
