"""
Configurable source list for the ScrapeGraphAI NewJobsNews experiment.

This module is intentionally isolated from the production government-job
scraper (scripts/scrapeGovtJobs.js). Add, remove or disable sources here
without touching any production pipeline.

Each source:
  id        unique slug
  name      human readable name
  url       listing page to harvest article links from
  scope     "assam" | "northeast" | "india"
  enabled   toggle without deleting the entry
"""

SOURCES = [
    {
        "id": "apsc",
        "name": "Assam Public Service Commission",
        "url": "https://apsc.nic.in/",
        "scope": "assam",
        "enabled": True,
    },
    {
        "id": "slprb_assam_police",
        "name": "SLPRB Assam (Assam Police recruitment)",
        "url": "https://slprbassam.in/",
        "scope": "assam",
        "enabled": True,
    },
    {
        "id": "nhm_assam",
        "name": "National Health Mission Assam",
        "url": "https://nhm.assam.gov.in/",
        "scope": "assam",
        "enabled": True,
    },
    {
        "id": "dhs_assam",
        "name": "Directorate of Health Services Assam",
        "url": "https://dhs.assam.gov.in/",
        "scope": "assam",
        "enabled": True,
    },
    {
        "id": "dme_assam",
        "name": "Directorate of Medical Education Assam",
        "url": "https://dme.assam.gov.in/",
        "scope": "assam",
        "enabled": True,
    },
    {
        "id": "dse_assam",
        "name": "Directorate of Secondary Education Assam",
        "url": "https://madhyamik.assam.gov.in/",
        "scope": "assam",
        "enabled": True,
    },
    {
        "id": "sentinel_jobs",
        "name": "The Sentinel (Assam) Jobs section",
        "url": "https://www.sentinelassam.com/jobs",
        "scope": "northeast",
        # Disabled: robots.txt disallows crawling of this section.
        "enabled": False,
    },
    {
        "id": "employment_news_india",
        "name": "Employment News (Govt of India weekly)",
        "url": "https://employmentnews.gov.in/",
        "scope": "india",
        "enabled": True,
    },
]

# Keywords used to shortlist candidate article links on listing pages.
LINK_KEYWORDS = [
    "recruit", "vacancy", "vacancies", "job", "post", "post of",
    "advertisement", "notification", "engagement", "walk-in", "walk in",
    "interview", "admit card", "hall ticket", "result", "merit list",
    "selection", "apply", "exam", "appointment", "assistant", "teacher",
    "constable", "nurse", "officer", "deputation", "sarkari",
]

NEGATIVE_KEYWORDS = [
    "login", "signup", "sign-up", "register", "privacy", "terms",
    "contact-us", "about-us", "sitemap", "javascript:", "#", "mailto:",
    "twitter", "facebook", "youtube", "instagram", "whatsapp", "telegram",
]
