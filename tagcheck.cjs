const fs = require('fs');
const file = process.argv[2];
const s = fs.readFileSync(file, 'utf8');
const tags = new Set();
for (const m of s.matchAll(/<\/?([A-Za-z][A-Za-z0-9]*)/g)) tags.add(m[1]);
let clean = true;
for (const tag of [...tags].sort()) {
  const o = (s.match(new RegExp('<' + tag + '(?=[\\s>/])', 'g')) || []).length;
  const c = (s.match(new RegExp('</' + tag + '>', 'g')) || []).length;
  if (o !== c) { console.log(tag + ': open=' + o + ' close=' + c); clean = false; }
}
if (clean) console.log('ALL TAGS BALANCED');
