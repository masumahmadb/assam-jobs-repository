# Claude Fable 5 - System Prompt Reference

**Source:** [elder-plinius/CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S) - ANTHROPIC/CLAUDE-FABLE-5.md
**Retrieved:** 2026-09-06
**Purpose:** Reference for prompt engineering patterns used by Anthropic's Mythos-class coding agent

---

## Key Extracts for Coding Agents

### File Creation Philosophy
> "FILE CREATION STRATEGY:
> SHORT (<100 lines): create the whole file in one tool call, save directly to /mnt/user-data/outputs/.
> LONG (>100 lines): build iteratively: outline/structure, then section by section, review, refine, copy final version to /mnt/user-data/outputs/. Long content almost always has a matching skill, so read the SKILL.md before writing the outline.
> REQUIRED: actually CREATE FILES when requested, not just show content, or the user can't access it."

### Skill Reading Requirement
> "Reading the relevant SKILL.md is a required first step before writing any code, creating any file, or running any other computer tool. For any task that will produce a file or run code, first scan {available_skills} and `view` every plausibly-relevant SKILL.md. This is mandatory because skills encode environment-specific constraints (available libraries, rendering quirks, output paths) that aren't in Claude's training data, so skipping the skill read lowers output quality even on formats Claude already knows well."

### Batch Operations
> "Combine data that's updated together in the same operation into single keys to avoid multiple sequential storage calls"
> - Credit card tracker: `await set('cards-and-benefits', {cards, benefits, completion})` instead of 3 calls
> - Pixel art board: `await get('board-pixels')` instead of looping per pixel

### Tool Usage
> "Claude should use these naturally — the way a helpful person would suggest a tool they noticed sitting right there. Not like a salesperson. Not like a feature announcement. Just: 'oh, I can actually do that for you.'"

### Search Rules
> "UNRECOGNIZED ENTITY RULE — APPLIES TO EVERY QUESTION: Claude has the web_search tool. Claude MUST use it before answering about any game, film, show, book, album, product release, menu item, or sports event that Claude does not recognize. This is NON-NEGOTIABLE."

### Artifact Criteria
> "Use artifacts for: Custom code solving a specific user problem; data visualizations, algorithms, technical reference; Any code snippet >20 lines; Content for use outside the conversation (reports, articles, presentations, blog posts); Long-form creative writing; Structured reference content users will save or follow; Modifying/iterating on an existing artifact"

### Computer Use File Locations
| Location | Purpose |
|----------|---------|
| `/mnt/user-data/uploads` | User uploads (also in context) |
| `/home/claude` | Scratchpad - create all new files here first |
| `/mnt/user-data/outputs` | Final deliverables ONLY |

### Package Management
> "pip: ALWAYS use `--break-system-packages` (e.g. `pip install pandas --break-system-packages`)"

---

## Adapted Patterns for This Project

### 1. Always Read Skills First
```bash
ls .opencode/skill/
cat .opencode/skill/frontend-design/SKILL.md
cat .opencode/skill/fable5-patterns/SKILL.md
```

### 2. Create Actual Files
- Don't output code as chat text
- Use `str_replace`, `create_file`, `bash` tools
- Files must be accessible to user

### 3. Batch Operations
- Multiple file edits → parallel tool calls
- Related storage → single key
- Related searches → single broad query

### 4. Verify After Changes
```bash
npm run build && npm run lint
```

### 5. Use Tools Explicitly
- Check available tools before browser
- Call tools naturally when helpful
- Don't hold back to create pressure

---

## Full Prompt Available At
- Project copy: `docs/ai-prompts/CLAUDE-FABLE-5.md`
- Original: https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md

---

## How to Use in This Project

1. **Load the skill:** `/skill fable5-patterns`
2. **Read before coding:** `cat .opencode/skill/fable5-patterns/SKILL.md`
3. **Apply patterns:** File-first, batch ops, explicit tools, verify builds
4. **Reference original:** Check `docs/ai-prompts/CLAUDE-FABLE-5.md` for full context

---

*This is a reference document. The actual Fable-5 system prompt cannot be "installed" to change model behavior. Use these patterns manually in your prompting and workflow.*