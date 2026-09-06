# Fable-5 Patterns Skill

Adapted from Anthropic's **Claude Fable 5** system prompt for use by any AI agent working on this project.

---

## Core Principles

### 1. **Read Skills First** (Mandatory)
Before writing ANY code, creating files, or running commands:
```bash
# Scan available skills
ls .opencode/skill/
ls .opencode/skill/*/SKILL.md 2>/dev/null

# Read relevant skill(s) for your task
cat .opencode/skill/frontend-design/SKILL.md
cat .opencode/skill/fable5-patterns/SKILL.md
```

**Why:** Skills encode environment-specific constraints (libraries, paths, conventions) that aren't in training data.

---

### 2. **Create Actual Files, Not Just Text**
| Task Type | Action |
|-----------|--------|
| "write a component" | Create `.jsx` file in `/src/components/` |
| "fix a bug" | Edit the actual file, don't just describe |
| "create a document" | Create `.md` file in `/docs/` or project root |
| >10 lines of code | Always create a file |

**Rule:** Standalone artifact = file. Conversational answer = inline.

---

### 3. **Batch Related Operations**
```javascript
// ❌ BAD: Multiple sequential calls
await storage.set('cards', data);
await storage.set('benefits', data);
await storage.set('completion', data);

// ✅ GOOD: Single batched call
await storage.set('cards-and-benefits', {cards, benefits, completion});
```

**Apply to:** File edits, searches, storage, API calls.

---

### 4. **Explicit Tool Usage**
- Use tools naturally, not like a salesperson
- "I can actually do that for you" → call the tool
- Check available tools before reaching for browser

---

### 5. **File Creation Strategy**
```
SHORT (<100 lines):  Create whole file in one call → save to outputs
LONG (>100 lines):   Build iteratively: outline → sections → review → copy to outputs
```

**Always:** Actually CREATE files when requested.

---

### 6. **Search When Needed**
- Current roles/positions/status → **search**
- Historical facts/definitions → **answer directly**
- Unrecognized entities → **search immediately**
- Version-specific details → **search**

---

### 7. **Computer Use Rules**
| Location | Purpose |
|----------|---------|
| `/mnt/user-data/uploads` | User uploaded files |
| `/home/claude` | Scratchpad for new files |
| `/mnt/user-data/outputs` | Final deliverables only |

---

### 8. **Artifact Criteria**
**Use artifacts for:**
- Custom code solving specific problems
- Data visualizations, algorithms
- Content for outside use (reports, presentations)
- Long-form creative writing
- Content that will be edited/reused
- >20 lines code OR >1500 chars text

**Don't use artifacts for:**
- Short code (≤20 lines)
- Short creative writing
- Lists/tables regardless of length
- Brief reference content

---

## Project-Specific Patterns

### This Project's Stack
```javascript
// Frontend
React 18 + Vite 5 + Tailwind CSS
// UI Components
21st.dev design system (13 components in src/components/ui/21st/)
// State
React Context (Auth, Language, Theme)
// Backend
Firebase Auth + Firestore
// PWA
vite-plugin-pwa + Workbox
```

### Key Conventions
- **Design tokens:** `tea-600`, `muga-500`, `sand-500` (see `tailwind.config.js`)
- **Dark mode:** `dark:` prefix, CSS variables in `src/index.css`
- **Components:** Import from `../components/ui/21st`
- **Icons:** `react-icons/fi` (FiMail, FiLock, FiEye, etc.)
- **Routes:** Protected via `<PrivateRoute>`, `<EmployerRoute>`, `<AdminRoute>`

### Component Pattern
```jsx
// Always use forwardRef for UI components
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} className={cn(baseStyles, className)} {...props}>
      {children}
    </button>
  )
);
Button.displayName = "Button";
```

---

## Quick Reference Commands

```bash
# Development
npm run dev

# Build (must pass before commit)
npm run build

# Preview production
npm run preview

# Lint
npm run lint

# Type check
npm run typecheck
```

---

## How to Load This Skill

```bash
# In opencode:
/skill fable5-patterns

# Or reference directly:
cat .opencode/skill/fable5-patterns/SKILL.md
```

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| Output code as text | Create actual files |
| Skip skill reading | Read SKILL.md first |
| Single sequential ops | Batch related operations |
| Guess library usage | Check imports in neighboring files |
| Redesign completed pages | Preserve existing UI, fix syntax only |
| Assume model capabilities | Use tools explicitly |

---

## Memory Aid

**FABLE** = **F**ile-first, **A**ctual-files, **B**atch-ops, **L**oad-skills, **E**xplicit-tools

---

*Source: Adapted from Anthropic's Claude Fable 5 system prompt (CL4R1T4S repo)*
*Modified for opencode/assam-jobs-repository environment*