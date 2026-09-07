const fs = require('fs');
const file = process.argv[2];
const s = fs.readFileSync(file, 'utf8');
let depth = { '{': 0, '(': 0, '[': 0 };
let line = 1;
let inStr = null;
const stack = [];
const pairs = { '}': '{', ')': '(', ']': '[' };
for (let i = 0; i < s.length; i++) {
  const ch = s[i];
  if (ch === '\n') { line++; continue; }
  if (inStr) {
    if (ch === '\\') { i++; continue; }
    if (ch === inStr) inStr = null;
    continue;
  }
  if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
  if (ch === '{' || ch === '(' || ch === '[') { stack.push({ ch, line }); continue; }
  if (ch === '}' || ch === ')' || ch === ']') {
    const want = pairs[ch];
    if (stack.length === 0) { console.log('EXTRA ' + ch + ' at line ' + line); continue; }
    const top = stack[stack.length - 1];
    if (top.ch !== want) {
      console.log('MISMATCH: ' + ch + ' at line ' + line + ' but top of stack is ' + top.ch + ' from line ' + top.line);
      continue;
    }
    stack.pop();
  }
}
for (const it of stack) console.log('UNCLOSED ' + it.ch + ' opened at line ' + it.line);
console.log('check done, remaining stack: ' + stack.length);
