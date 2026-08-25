import { runWatchBatch } from './_lib/watcher.js'

const CRON_SECRET = process.env.CRON_SECRET

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically when
  // CRON_SECRET is set. External schedulers can pass ?token= instead.
  if (CRON_SECRET) {
    const header = req.headers.authorization || ''
    const token = (req.query?.token || '').toString()
    const provided = header.replace(/^Bearer\s+/i, '') || token
    if (provided !== CRON_SECRET) return res.status(401).json({ error: 'unauthorized' })
  }

  try {
    const max = Number(req.query?.max) || 5
    const cursor = Number(req.query?.cursor) || 0
    const report = await runWatchBatch({
      max,
      cursor,
      budgetMs: Number(process.env.WATCH_BUDGET_MS || 45000)
    })
    return res.status(200).json(report)
  } catch (err) {
    console.error('watch error:', err)
    return res.status(500).json({ error: 'watch_failed', message: err.message })
  }
}
