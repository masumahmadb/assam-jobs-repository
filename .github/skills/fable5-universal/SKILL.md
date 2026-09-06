# Fable-5 Universal Skill - Assam Jobs Repository

**Platform-agnostic** Fable-5 patterns with **project-specific** configuration. Works on: opencode, Cursor, Claude Code, VS Code, Windsurf, any AI agent.

---

## Quick Start (Any Platform)

### opencode
```bash
/skill fable5-universal
```

### Cursor
```
@.github/skills/fable5-universal/SKILL.md
```

### Claude Code / Windsurf / Generic
```
Read .github/skills/fable5-universal/SKILL.md
```

### VS Code (with Copilot)
Add `.github/skills/fable5-universal/` to workspace skills

---

## Project Detection (Auto-Config)

This skill auto-detects **assam-jobs-repository** and loads:

| Config | Value |
|--------|-------|
| **Stack** | React 18 + Vite 5 + Tailwind + Firebase |
| **UI Library** | 21st.dev (13 components in `src/components/ui/21st/`) |
| **Design Tokens** | `tea`, `muga`, `sand` (50-950) |
| **Dark Mode** | `dark:` prefix + CSS variables in `src/index.css` |
| **Icons** | `react-icons/fi` (FiMail, FiLock, FiEye, etc.) |
| **State** | React Context: `useAuth()`, `useLanguage()`, `useTheme()` |
| **Routes** | Protected: `PrivateRoute`, `EmployerRoute`, `AdminRoute` |
| **Build** | `npm run build` (Vite + Rollup + PWA) |

---

## Mandatory Workflow (All Platforms)

### 1. PRE-TASK: Read Skills First
```bash
# Scan available skills
ls .github/skills/
ls .opencode/skill/ 2>/dev/null

# Read THIS skill + any relevant ones
cat .github/skills/fable5-universal/SKILL.md
cat .github/skills/frontend-design/SKILL.md 2>/dev/null
```

### 2. CREATE ACTUAL FILES (Not Chat Text)
| Trigger | Action |
|---------|--------|
| "write component" | Create `.jsx` in `src/components/` |
| "fix bug" | Edit the actual file |
| "create doc" | Create `.md` in `/docs/` |
| >10 lines code | Always create file |

**Rule:** Standalone artifact = file. Conversational = inline.

### 3. BATCH OPERATIONS
```javascript
// ❌ Sequential
await set('cards'); await set('benefits'); await set('completion');

// ✅ Batched
await set('cards-and-benefits', {cards, benefits, completion});

// Edits: parallel tool calls for multiple files
```

### 4. EXPLICIT TOOL USAGE
- Call tools naturally when helpful
- Don't say "I could help if..." → just do it
- Check available tools before browser

### 5. VERIFY AFTER CHANGES
```bash
npm run build && npm run lint
# Must pass before commit
```

---

## Project-Specific Patterns

### Import Conventions
```javascript
// UI Components
import { Button, Card, Input } from '@/components/ui/21st';

// Icons
import { FiMail, FiLock, FiEye } from 'react-icons/fi';

// Contexts
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
```

### Component Template
```jsx
import React from 'react';

const ComponentName = React.forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(baseStyles, className)} {...props}>
      {children}
    </div>
  )
);
ComponentName.displayName = "ComponentName";

export { ComponentName };
```

### Dark Mode
```jsx
<div className="bg-white dark:bg-tea-900 text-tea-900 dark:text-tea-100">
  <span className="text-tea-600 dark:text-tea-400">Text</span>
</div>
```

### Protected Routes
```jsx
<Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
<Route path="/employer/dashboard" element={<EmployerRoute><EmployerDashboard /></EmployerRoute>} />
<Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
```

---

## Anti-Patterns (Enforced)

| ❌ Don't | ✅ Do |
|----------|-------|
| Output code as chat | Create actual file |
| Skip skill reading | Read SKILL.md first |
| Single sequential ops | Batch related ops |
| Guess imports | Check neighboring files |
| Redesign done pages | Fix syntax only |
| Assume browser storage | Use React state |

---

## Verification Commands
```bash
npm run build      # Must pass
npm run lint       # Must pass
npm run typecheck  # Must pass
npm run preview    # Test production build
```

---

## Platform-Specific Notes

### opencode
- Native skill loading: `/skill fable5-universal`
- Hooks: `pre_task`, `post_edit`, `pre_commit`

### Cursor
- Reference in chat: `@.github/skills/fable5-universal/SKILL.md`
- Add to `.cursorrules` for auto-include

### Claude Code
- `cat .github/skills/fable5-universal/SKILL.md` at start
- Use `bash` tool for commands

### Windsurf
- Same as Cursor - reference skill file

### Generic AI (ChatGPT, Claude Web)
- Copy SKILL.md content into prompt
- Or upload as context file

---

## FABLE Quick Reference

```
F - File-first (create actual files)
A - Actual artifacts (not chat text)
B - Batch operations (storage, edits, searches)
L - Load skills first (read SKILL.md)
E - Explicit tool usage (call tools naturally)
```

**Pre-task:** Scan skills → Read relevant SKILL.md
**Post-edit:** `npm run build && npm run lint`

---

*Universal skill for assam-jobs-repository | Works on any AI platform*
*Adapted from Anthropic's Claude Fable 5 via CL4R1T4S*