# Assam Jobs Repository - AI Agent Handoff Document

## Project Overview
A comprehensive job portal for Assam government and private jobs built with React + Vite. The project features a complete UI redesign using 21st.dev design system components with modern student-friendly dashboards.

## Tech Stack
- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS + Custom Design Tokens
- **UI Components**: 21st.dev component library (13 custom components)
- **Icons**: react-icons (Fi icons)
- **Routing**: React Router DOM v6
- **State**: React Context (Auth, Language, Theme)
- **Backend**: Firebase (Auth, Firestore)
- **PWA**: vite-plugin-pwa with Workbox
- **Build**: Vite + Rollup

## Completed Work (✅ = Done, ⏳ = In Progress, ❌ = Not Started)

### Design System & Components
- [✅] Create comprehensive design system with 21st.dev components (13 components: Accordion, Avatar, Badge, Button, Card, DropdownMenu, Input, JobCard, Modal, Pagination, Table, Tabs)
- [✅] Update global styles and design tokens (tea/muga/sand colors, dark mode, animations)

### Page Redesigns
- [✅] **Home page** - Student-friendly dashboard with hero, stats, quick actions, features, testimonials, CTA
- [✅] **Jobs page** - SectorExplorer + JobList with filtering, pagination
- [✅] **Profile page** - Modern UI with tabs (Profile/Applications/Saved/Settings)
- [✅] **Login/Signup pages** - Modern auth UI with Google OAuth, multi-step signup
- [✅] **NewJobsNews** - Modern news feed with grid/list views, categories, bookmarks
- [✅] **Utilities page** - Modern tools UI (CV Builder, Photo Resizer, Doc Scanner, etc.)
- [✅] **Assistant page** - AI chat interface with tabs (chat/syllabus/tools)
- [✅] **ProfileSetup** - 4-step onboarding flow (education, birth year, category, district)
- [✅] **Employer pages** - Login + Dashboard with tabs (Jobs/Applications/Analytics/Profile)
- [✅] **AdminPanel** - Overview, Users, Jobs, Analytics, System Status

### Architecture
- [✅] Firebase integration (auth, firestore)
- [✅] Multi-language support (EN/AS/HI/BN)
- [✅] Dark/Light theme with persistence
- [✅] Offline-first with service worker
- [✅] Route protection (PrivateRoute, EmployerRoute, AdminRoute)

## Current Status
**Build Status**: ❌ **FAILING** - Multiple syntax errors blocking production build

### Known Build Errors (as of last attempt):
1. **NewJobsNews.jsx** - Map callback return syntax issues (line ~216)
2. **EmployerLogin.jsx** - Duplicate export default / extra closing braces
3. **Utilities.jsx** - Div count mismatch (31 opening vs 29 closing)
4. **AdminPanel.jsx** - Card/Tab nesting mismatches
5. **Home.jsx** - Map callback parentheses issues
6. **Login.jsx** - Duplicate Fi icon imports, CardContent/CardFooter nesting

### Files Requiring Fixes (Priority Order):
| File | Issue Type | Est. Fix Time |
|------|-----------|---------------|
| `src/pages/NewJobsNews.jsx` | Map callback syntax | 10 min |
| `src/pages/EmployerLogin.jsx` | Extra braces, exports | 5 min |
| `src/pages/Utilities.jsx` | Missing closing divs | 10 min |
| `src/pages/AdminPanel.jsx` | Component nesting | 10 min |
| `src/pages/Home.jsx` | Map callback returns | 5 min |
| `src/components/auth/Login.jsx` | Import deduping | 5 min |

## Important Files Changed

### New Components (21st.dev Design System)
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

### Redesigned Pages
```
src/pages/
├── Home.jsx              ✅ Complete
├── Jobs.jsx              ✅ Complete
├── Profile.jsx           ✅ Complete
├── NewJobsNews.jsx       ⚠️ Syntax errors
├── Utilities.jsx         ⚠️ Div mismatch
├── Assistant.jsx         ✅ Complete
├── ProfileSetup.jsx      ✅ Complete
├── EmployerLogin.jsx     ⚠️ Extra braces
├── EmployerDashboard.jsx ✅ Complete
├── AdminPanel.jsx        ⚠️ Nesting issues
└── Login.jsx             ⚠️ Import issues
```

### Configuration
- `tailwind.config.js` - Custom colors, animations, dark mode
- `src/index.css` - Design tokens, global styles
- `.mcp.json` - MCP server configuration
- `vite.config.js` - PWA, aliases, build config

## Routes to Verify After Build Fixes
| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Home | ✅ PrivateRoute |
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/profile-setup` | Onboarding | ✅ PrivateRoute |
| `/jobs` | Jobs | ✅ PrivateRoute |
| `/newjobsnews` | News | ✅ PrivateRoute |
| `/utilities` | Tools | ✅ PrivateRoute |
| `/assistant` | AI Assistant | ✅ PrivateRoute |
| `/profile` | Profile | ✅ PrivateRoute |
| `/employer/login` | Employer Login | Public |
| `/employer/dashboard` | Employer Dashboard | ✅ EmployerRoute |
| `/admin` | Admin Panel | ✅ AdminRoute |

## Build & Test Commands
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Lint
npm run lint

# Type Check
npm run typecheck
```

## Next Steps for Continuing Agent

### Immediate (Blocking Build):
1. **Fix NewJobsNews.jsx** - Change all `.map(item => (` to `.map(item => { return (` with proper closing
2. **Fix EmployerLogin.jsx** - Remove extra `})` at line 179, fix duplicate export
3. **Fix Utilities.jsx** - Add 2 missing closing `</div>` tags
4. **Fix AdminPanel.jsx** - Fix CardContent/Card nesting, remove extra `)}`
5. **Fix Home.jsx** - Ensure all map callbacks use implicit return `(`
6. **Fix Login.jsx** - Remove duplicate FiBuilding2/FiUsers/FiBriefcase imports

### After Build Passes:
1. Run `npm run dev` and manually verify all 12 routes
2. Check responsive breakpoints (375px, 768px, 1024px, 1440px)
3. Test dark/light theme toggle
4. Test language switching (EN/AS/HI/BN)
5. Verify Firebase auth flows (email/password, Google OAuth)
6. Test PWA installation and offline behavior

## Constraints for Next Agent
- **DO NOT** redesign any completed pages - the UI/UX is finalized
- **DO NOT** change design tokens or color system
- **DO NOT** replace 21st.dev components with alternatives
- **PRESERVE** all completed page structures and component hierarchies
- **FOCUS ONLY** on fixing syntax errors to achieve successful build
- After build passes, only do verification/testing - no redesign

## Fable-5 Patterns Skill (NEW)
The project includes a reusable **opencode skill** with Fable-5 (Claude 5) coding agent patterns:

```
.opencode/skill/fable5-patterns/
├── skill.json          # Skill manifest
├── SKILL.md            # Detailed patterns (read before coding)
└── index.md            # Quick reference
```

**Reference document:** `docs/ai-prompts/CLAUDE-FABLE-5.md` (full Fable-5 system prompt)

### How Next Agent Should Use It:
```bash
# Load the skill (recommended first step)
/skill fable5-patterns

# Or read directly
cat .opencode/skill/fable5-patterns/SKILL.md
```

### Key Patterns to Apply:
- **File-first:** Create actual files, not chat text
- **Skill reading:** Read SKILL.md before ANY coding task
- **Batch operations:** Group related edits/searches/storage
- **Explicit tools:** Call tools naturally when helpful
- **Verify builds:** `npm run build && npm run lint` after changes

---

## MCP Configuration
The project includes `.mcp.json` for 21st.dev component access. Use `21st-dev` MCP server for any additional UI components needed.

## Git Status
Run `git status` to see all modified files. Key changes are in `src/pages/`, `src/components/ui/21st/`, `src/index.css`, `tailwind.config.js`.

---
**Last Updated**: $(date)
**Build Status**: ❌ FAILING - Fix syntax errors first
**Next Agent Priority**: Fix 6 files listed above → Verify all 12 routes → Report status