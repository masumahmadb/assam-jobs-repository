"""Private job sources (Indeed, LinkedIn, Apna, etc.) for Assam-focused search.

STRATEGY NOTES — read before enabling:
  These boards are JS-rendered and bot-guarded, so they map to the Crawl4AI
  tier (or a dedicated API where one exists). Real scraping is DEFERRED until
  the browser service lives on an Indian host; this module only defines the
  source registry + strategy so the pipeline can be switched on later.

  Source-specific reality check:
    indeed     - heavy anti-bot (Cloudflare), JS-only listing -> tier 2
    linkedin   - guest API exists but ToS-restricted; public jobs page is
                 JS-rendered -> tier 2 (prefer official APIs/partnerships later)
    apna       - app-first; web is a JS SPA -> tier 2
    foundit    - server-rendered search results exist -> may work at tier 1
    workindia  - partial SSR -> try tier 1, escalate if thin

Each entry: id, name, search_url template ({query}, {location}), strategy.
"""

SOURCES = [
    {
        "id": "foundit",
        "name": "Foundit (formerly Monster India)",
        "search_url": "https://www.foundit.in/srp/results?query={query}&locations={location}",
        "strategy": "static_first",
        "enabled": False,
    },
    {
        "id": "workindia",
        "name": "WorkIndia",
        "search_url": "https://workindia.in/search-jobs?q={query}&city={location}",
        "strategy": "static_first",
        "enabled": False,
    },
    {
        "id": "indeed",
        "name": "Indeed",
        "search_url": "https://in.indeed.com/jobs?q={query}&l={location}",
        "strategy": "js_required",   # Cloudflare-guarded
        "enabled": False,
    },
    {
        "id": "linkedin",
        "name": "LinkedIn",
        "search_url": "https://www.linkedin.com/jobs/search?keywords={query}&location={location}",
        "strategy": "js_required",   # ToS-sensitive; consider partner/API route
        "enabled": False,
    },
    {
        "id": "apna",
        "name": "Apna Jobs",
        "search_url": "https://apna.co/jobs?query={query}&city={location}",
        "strategy": "js_required",
        "enabled": False,
    },
]

# What employers in Assam typically post on these boards.
DEFAULT_QUERIES = [
    ("delivery", "Guwahati"),
    ("sales", "Guwahati"),
    ("customer service", "Guwahati"),
    ("teacher", "Jorhat"),
    ("nurse", "Silchar"),
    ("technician", "Dibrugarh"),
]
