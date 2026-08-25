import { runWatchBatch } from '../api/_lib/watcher.js'
import { SOURCES } from '../api/_lib/sources.js'

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=')
  return [k, v]
}))

const ids = args.sources ? args.sources.split(',') : null
let batch
if (ids) {
  // test specific sources by temporarily filtering
  const orig = SOURCES.slice()
  SOURCES.length = 0
  for (const id of ids) {
    const s = orig.find((x) => x.id === id)
    if (s) SOURCES.push(s)
  }
}
const max = Number(args.max || (ids ? ids.length : 3))

console.log(`watching ${SOURCES.map((s) => s.id).join(', ')}\n`)
const report = await runWatchBatch({ max, cursor: 0, budgetMs: Number(args.budget || 45000) })
console.log('\n=== REPORT ===')
console.log(JSON.stringify({ ...report, processed: report.processed.map((p) => ({ ...p, newLinks: p.newLinks?.slice(0, 5) })) }, null, 2))
