import { runWatchBatch } from '../api/_lib/watcher.js'
import { isStoreConfigured } from '../api/_lib/watchStore.js'

// Local scheduled watcher: runs the full source list in batches from India,
// persisting new notification candidates to Firestore.
//
// Usage:
//   node scripts/watchCron.mjs                     # full sweep, persists if creds configured
//   node scripts/watchCron.mjs --dry               # no writes even if creds exist
//   node scripts/watchCron.mjs --total-budget=300000 --batch-size=5
//
// Firebase admin creds (any one of):
//   FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccount.json
//   FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=')
    return [k, v]
  })
)

if (args.sa) process.env.FIREBASE_SERVICE_ACCOUNT_PATH = args.sa

const TOTAL_BUDGET_MS = Number(args['total-budget'] || 4 * 60_000)
const BATCH_SIZE = Number(args['batch-size'] || 5)
const started = Date.now()

console.log(`[watch-cron] start ${new Date().toISOString()} persisted=${isStoreConfigured() && !args.dry}`)

let cursor = 0
let totalNew = 0
const failures = []

while (cursor !== null && Date.now() - started < TOTAL_BUDGET_MS) {
  const report = await runWatchBatch({
    max: BATCH_SIZE,
    cursor,
    budgetMs: Math.min(45_000, TOTAL_BUDGET_MS - (Date.now() - started))
  })
  for (const p of report.processed) {
    if (p.error) failures.push(`${p.id}: ${p.error}`)
    console.log(`  ${p.id.padEnd(18)} links=${String(p.totalLinks).padStart(3)} new=${p.newCount}${p.error ? ' ERR=' + p.error : ''}`)
  }
  totalNew += report.queuedCount
  cursor = report.nextCursor
}

console.log(`[watch-cron] done new=${totalNew} elapsed=${Date.now() - started}ms failedSources=${failures.length}`)
if (!isStoreConfigured()) {
  console.log('[watch-cron] NOTE: ran in DRY-RUN (no Firestore creds). Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_* env vars to persist.')
}
if (failures.length) console.log('[watch-cron] failures:\n  ' + failures.join('\n  '))
