// 21st.dev MCP Configuration for IDE Integration
// Add this to your IDE's MCP configuration

// For Cursor: Settings > MCP > Add new server
// For Windsurf: Settings > MCP Servers
// For VS Code with Cline: Settings > MCP Servers

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

// Alternative: Use environment variable
// TWENTYFIRST_API_KEY=21st_sk_7f4676f46fa216ecfba4fc7ef4140f5fb28146c889db364453b00c1cf435ae40

// Available tools after connecting:
// - search: Search 21st.dev components, themes, templates
// - get: Get component code by ID
// - add: Install component via shadcn
// - generate: Generate UI with 21st AI
// - bookmarks: Manage bookmarks
// - lists: Manage bookmark lists
// - theme: Get theme CSS

// Example queries you can ask your AI assistant:
// "Search for job listing card components on 21st.dev"
// "Get the code for the Records Table component"
// "Find a good data table component for a job portal"
// "Search for filter sidebar components"
// "Find pagination components"
// "Search for modal dialog components"
// "Find accordion components for FAQ sections"
// "Find tabs components for job categories"
// "Search for search input components"
// "Find pagination components for job listings"