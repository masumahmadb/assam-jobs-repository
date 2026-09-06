# Fable-5 Coding Agent Patterns - Skill Definition

## Overview
This skill teaches the core workflow patterns from Anthropic's **Claude Fable 5** (Mythos-class coding agent) adapted for use by any AI agent in the opencode environment.

## Mandatory Pre-Task Checklist

Before ANY coding task, the agent MUST:

1. **Scan for relevant skills**
   ```bash
   ls .opencode/skill/
   ```

2. **Read each relevant SKILL.md**
   - For frontend work: `.opencode/skill/frontend-design/SKILL.md`
   - For this project: `.opencode/skill/fable5-patterns/SKILL.md`

3. **Verify tool availability**
   - Check `package.json` for libraries
   - Check neighboring files for import patterns

---

## File Creation Rules

### When to Create Files
| Trigger | Extension | Location |
|---------|-----------|----------|
| "write a component/script/module" | `.jsx` / `.tsx` | `src/components/` |
| "create a document/report/post" | `.md` | `/docs/` or root |
| "make a presentation" | `.pptx` | `/docs/` |
| "save/download/file I can view" | Any | `/mnt/user-data/outputs/` |
| >10 lines of code | Appropriate | Project structure |

### File Creation Strategy
- **SHORT (<100 lines):** Single tool call, save directly to outputs
- **LONG (>100 lines):** Iterative - outline → sections → review → copy to outputs

### Critical: Actually CREATE Files
- Not just output text
- Use `create_file` / `str_replace` / `bash` tools
- Files must be accessible to user

---

## Batch Operations Pattern

### Storage Batching
```javascript
// Single key for related data
await window.storage.set('cards-and-benefits', {cards, benefits, completion});

// Hierarchical keys
await window.storage.set('todos:todo_1', data);
await window.storage.list('todos:');
```

### Edit Batching
```bash
# Multiple edits in single file → single str_replace with replaceAll
# Multiple files → parallel tool calls
```

### Search Batching
```bash
# Single broad query first, then narrow
web_search "React 18 hooks"
web_search "Tailwind CSS dark mode"
```

---

## Tool Usage Philosophy

### Natural Tool Usage
- **Don't:** "I could help with X if you connect Y"
- **Do:** "I can actually do that" → call tool immediately

### Tool Priority
1. Internal tools (google drive, slack) for company/personal data
2. Web search/fetch for external info
3. Combined for comparative queries

### MCP Apps
- Search registry first for unnamed connectors
- Only call directly when user names specific connector
- E-commerce never suggested proactively

---

## Search Guidelines

### When to Search (MANDATORY)
- Current role/position/status queries
- Unrecognized entities (games, products, releases)
- Version-specific details
- Fast-changing info (stocks, breaking news)
- Government positions, job roles, laws

### When NOT to Search
- Timeless facts, definitions, established technical facts
- Historical biographical facts about known people
- "Help me code a for loop in Python"

### Search Query Format
- 1-6 words, concise
- No `-` operator, `site:` operator, or quotes
- Start broad, narrow if needed
- Current date: 2026 (use actual year)

---

## Computer Use Rules

### File Locations
| Path | Purpose | Visibility |
|------|---------|------------|
| `/mnt/user-data/uploads` | User uploads | In context + disk |
| `/home/claude` | Scratchpad | Agent only |
| `/mnt/user-data/outputs` | Final deliverables | User sees |

### File Handling
- Uploaded images/text: use context directly if visible
- Non-text uploads: read via `view` or `bash`
- Temp work in `/home/claude`, copy final to outputs

---

## Artifact Usage Criteria

### Use Artifacts For:
- Custom code solving specific problems
- Data visualizations, algorithms
- Technical reference content
- Content for outside conversation
- Long-form creative writing
- Structured reference content
- Modifying/iterating existing artifacts
- >20 lines code OR >1500 chars

### Don't Use Artifacts For:
- Short code (≤20 lines)
- Short creative writing
- Lists/tables/enumerated content
- Brief structured content
- Conversational responses

### Artifact File Types
| Type | Use Case |
|------|----------|
| `.md` | Standalone written content, reports |
| `.html` | HTML+JS+CSS in one file |
| `.jsx` | React components (functional, hooks) |
| `.mermaid` | Diagrams |
| `.svg` | Vector graphics |
| `.pdf` | Professional documents |

### React Artifact Constraints
- Single file, CSS+JS together
- Tailwind core utilities only (no compiler)
- Available libs: lucide-react, recharts, mathjs, lodash, d3, plotly, three, papaparse, SheetJS, shadcn/ui, chart.js, tone, mammoth, tensorflow
- **NO localStorage/sessionStorage** - use React state

---

## Package Management
```bash
# npm works normally
npm install <pkg>

# pip requires --break-system-packages
pip install pandas --break-system-packages

# Verify before use
which <tool> || npm ls <pkg>
```

---

## Project-Specific Additions

### This Project's Conventions
```javascript
// Import pattern
import { Button, Card, Input } from '../components/ui/21st';
import { FiMail, FiLock } from 'react-icons/fi';

// Design tokens (tailwind.config.js)
tea-50 through tea-950
muga-50 through muga-950
sand-50 through sand-950

// Dark mode
dark:bg-tea-900 dark:text-tea-100

// Contexts
useAuth(), useLanguage(), useTheme()
```

### Component Structure
```
src/components/ui/21st/
├── Accordion.jsx
├── Avatar.jsx
├── Badge.jsx
├── Button.jsx
├── Card.jsx
├── DropdownMenu.jsx
├── Input.jsx
├── JobCard.jsx
├── Modal.jsx
├── Pagination.jsx
├── Table.jsx
├── Tabs.jsx
└── index.js
```

---

## Verification Requirements

After ANY code change:
```bash
npm run build      # Must pass
npm run lint       # Must pass
npm run typecheck  # Must pass
```

---

## Anti-Patterns (Enforced)

| Anti-Pattern | Correction |
|--------------|------------|
| Output code as chat text | Create actual file |
| Skip skill reading | Read SKILL.md first |
| Single sequential operations | Batch related ops |
| Guess library availability | Check package.json + imports |
| Redesign completed pages | Fix syntax only |
| Assume browser storage | Use React state |
| Mock tool outputs | Call real tools |

---

## Quick Reference Card

```
FABLE Workflow:
F - File-first (create actual files)
A - Actual artifacts (not chat text)
B - Batch operations (storage, edits, searches)
L - Load skills first (read SKILL.md)
E - Explicit tool usage (call tools naturally)

Pre-task: ls .opencode/skill/ → cat relevant SKILL.md
Post-edit: npm run build && npm run lint
```

---

*Adapted from Anthropic's Claude Fable 5 system prompt via CL4R1T4S repository*
*Modified for opencode + assam-jobs-repository environment*