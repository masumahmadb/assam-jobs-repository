# 21st.dev Integration for Assam Jobs Repository

## Overview
This project integrates **21st.dev** components adapted to the existing **tea-** design system for the Assam Jobs Repository. All components are built with React + Tailwind CSS and follow the existing `tea-*` color palette.

## Installed Components

### Core UI Components
| Component | File | Description |
|-----------|------|-------------|
| `Button` | `Button.jsx` | Versatile button with variants (default, destructive, outline, secondary, ghost, link) and sizes |
| `Input` | `Input.jsx` | Form input with label, error, hint, left/right icons |
| `Card` | `Card.jsx` | Card layout with Header, Title, Description, Content, Footer |
| `Badge` | `Badge.jsx` | Status badges with variants (default, secondary, destructive, success, warning, info, outline, ghost) |
| `Table` | `Table.jsx` | Data table with Header, Body, Footer, Row, Head, Cell, Caption |
| `Modal` | `Modal.jsx` | Accessible modal dialog with portal, escape/overlay close |
| `DropdownMenu` | `DropdownMenu.jsx` | Dropdown with trigger, items, checkbox items, separators, labels |
| `Pagination` | `Pagination.jsx` | Pagination with first/last, prev/next, ellipsis |
| `Tabs` | `Tabs.jsx` | Accessible tabs with keyboard navigation |
| `Accordion` | `Accordion.jsx` | Single/multiple open accordion with animations |
| `Avatar` | `Avatar.jsx` | User avatar with fallback initials, status indicators, groups |
| `JobCard` | `JobCard.jsx` | Complete job listing card with all job details |

### Design System Integration
All components use the existing **tea-** color palette:
- Primary: `tea-600` (primary), `tea-700` (hover), `tea-50` (backgrounds)
- Destructive: `muga-500` (primary), `muga-100` (backgrounds)
- Secondary: `tea-100`/`tea-200` backgrounds
- Text: `tea-900` (primary), `tea-600` (secondary), `tea-400` (muted)

## MCP Integration

### Setup MCP Client (Cursor/Windsurf/VS Code)

Add to your IDE's MCP configuration:

```json
{
  "mcpServers": {
    "21st": {
      "url": "https://21st.dev/api/mcp",
      "headers": {
        "x-api-key": "21st_sk_7f4676f46fa216ecfba4fc7ef4140f5fb28146c889db364453b00c1cf435ae40"
      }
    }
  }
}
```

Or use environment variable:
```bash
export TWENTYFIRST_TOKEN="21st_sk_7f4676f46fa216ecfba4fc7ef4140f5fb28146c889db364453b00c1cf435ae40"
```

### Available MCP Tools
| Tool | Description |
|------|-------------|
| `search` | Search components, themes, templates |
| `get` | Get component code by ID |
| `add` | Install component via shadcn |
| `generate` | Generate UI with 21st AI |
| `theme` | Get theme CSS |
| `bookmarks` | Manage bookmarks |

### Example Queries for AI Assistant
```
"Search for job listing card components on 21st.dev"
"Get the Records Table component code"
"Find data table components for job portals"
"Search for filter sidebar components"
"Find pagination components"
"Find modal dialog components"
"Search for accordion components for FAQ"
"Find tabs components for job categories"
"Find search input components"
"Find modal dialog components"
```

## Usage Examples

### Import Components
```javascript
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  Pagination,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Avatar,
  AvatarGroup,
  JobCard,
} from '@/components/ui/21st'
```

### Job Card Usage
```jsx
<JobCard
  job={{
    id: '1',
    title: 'Medical Officer',
    organization: 'NHM Assam',
    department: 'Health & Family Welfare',
    location: 'Guwahati, Assam',
    vacancies: 50,
    qualification: 'MBBS with MCI Registration',
    lastDate: '2026-09-15',
    postedDate: '2026-08-01',
    jobType: 'government',
    category: 'Health',
    salary: '₹56,100 - ₹1,77,500',
    isUrgent: true,
    isFeatured: true,
  }}
  onApply={(id) => console.log('Apply:', id)}
  onSave={(id) => console.log('Saved:', id)}
  onShare={(id) => console.log('Shared:', id)}
/>
```

### Data Table Usage
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Position</TableHead>
      <TableHead>Organization</TableHead>
      <TableHead>Location</TableHead>
      <TableHead>Last Date</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {jobs.map(job => (
      <TableRow key={job.id} onClick={() => handleRowClick(job)}>
        <TableCell>{job.title}</TableCell>
        <TableCell>{job.organization}</TableCell>
        <TableCell>{job.location}</TableCell>
        <TableCell>{job.lastDate}</TableCell>
        <TableCell>
          <Badge variant={job.isUrgent ? 'destructive' : 'default'}>
            {job.isUrgent ? 'Urgent' : 'Active'}
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Modal with Form
```jsx
<Modal
  open={isOpen}
  onClose={() => setOpen(false)}
  title="Apply for Job"
  description="Fill in your details to apply"
  size="lg"
>
  <form className="space-y-4">
    <Input label="Full Name" placeholder="Enter your name" required />
    <Input label="Email" type="email" placeholder="your@email.com" required />
    <Input label="Phone" type="tel" placeholder="+91 98765 43210" required />
    <div className="flex gap-3">
      <Button type="submit" className="flex-1">Submit Application</Button>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
    </div>
  </form>
</Modal>
```

## Component Customization

All components accept standard React props plus custom variants:
- `className` - Additional Tailwind classes
- `variant` - Visual variant (where applicable)
- `size` - Size variant (where applicable)
- `disabled` - Disabled state
- `onClick` / `onChange` - Event handlers

## MCP Server Connection

### For Cursor
1. Open Settings → MCP
2. Add new server with the config from `.mcp.json`

### For Windsurf
1. Settings → MCP Servers
2. Add the 21st server config

### For VS Code (Cline)
1. Settings → MCP Servers
2. Add the configuration

### Direct API Access
```bash
curl -X POST https://21st.dev/api/mcp \
  -H "x-api-key: 21st_sk_7f4676f46fa216ecfba4fc7ef4140f5fb28146c889db364453b00c1cf435ae40" \
  -H "Content-Type: application/json" \
  -d '{"method": "search", "params": {"query": "job card", "limit": 5}}'
```

## Available 21st.dev Components (Curated)

### Job Portal Essentials
| Component | ID | Description |
|-----------|-----|-------------|
| Records Table | 23604 | CRM-style data table with sorting, selection, tags |
| Data Table | 1050 | TanStack Table with sorting, filtering, pagination |
| Job Listing | 8725 | Job listing card component |
| Data Table | 23604 | CRM-style data table |

### Navigation & Layout
| Component | ID | Description |
|-----------|-----|-------------|
| Sidebar | 1603, 1075, 19371 | Navigation sidebars |
| Tabs | 4086, 11641 | Tab navigation |
| Accordion | 23530, 1530 | Collapsible sections |

### Form Elements
| Component | ID | Description |
|-----------|-----|-------------|
| Search Field | 1469 | React Aria search input |
| Input | 160 | Basic input |
| Search Bar | 1645 | Search bar component |
| Dropdown | 9428, 16346 | Dropdown menus |

### Data Display
| Component | ID | Description |
|-----------|-----|-------------|
| Pagination | 25117, 445, 25131 | Pagination with ellipsis |
| Badge | 3560, 514 | Status badges |
| Modal | 23539, 3888 | Modal dialogs |

### Feedback
| Component | ID | Description |
|-----------|-----|-------------|
| Toast/Alert | (search "toast") | Notification toasts |
| Tooltip | (search "tooltip") | Hover tooltips |

## CLI Usage

```bash
# Install CLI globally
npm i -g @21st-dev/cli

# Search components
npx @21st-dev/cli search "job card" --limit 5

# Get component code
npx @21st-dev/cli get 23604 --json

# Install component (requires shadcn/ui)
npx @21st-dev/cli add 23604

# Search with API key
export TWENTYFIRST_TOKEN="your-api-key"
npx @21st-dev/cli search "data table" --limit 5
```

## File Structure
```
src/components/ui/21st/
├── index.js              # Main exports
├── Button.jsx            # Button component
├── Input.jsx             # Input component
├── Card.jsx              # Card components
├── Badge.jsx             # Badge component
├── Table.jsx             # Table components
├── Modal.jsx             # Modal dialog
├── DropdownMenu.jsx      # Dropdown menu
├── Pagination.jsx        # Pagination
├── Tabs.jsx              # Tabs
├── Accordion.jsx         # Accordion
├── Avatar.jsx            # Avatar & group
├── JobCard.jsx           # Job card (custom)
└── examples/
    └── JobPortalExample.jsx  # Complete example
```

## Notes
- All components are **self-contained** (no external shadcn/ui dependencies)
- Built with **React 18** + **Tailwind CSS**
- Uses **react-icons/fi** for icons (already in dependencies)
- Fully **TypeScript-ready** (JSDoc types included)
- **Accessible** (ARIA attributes, keyboard navigation)
- **Responsive** (mobile-first design)
- **Dark mode ready** (uses CSS variables)

## Next Steps
1. Add `@radix-ui/react-*` dependencies if using shadcn components directly
2. Run `npm install` to install any missing peer dependencies
3. Configure MCP in your IDE using `.mcp.json`
3. Start building with `import { Button, Card, ... } from '@/components/ui/21st'`