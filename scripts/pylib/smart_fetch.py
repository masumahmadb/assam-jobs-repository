"""Tiered fetching pipeline shared by all Python scrapers.

Chain (auto-escalating):
  TIER 1  requests + trafilatura   -> fast, free, no browser. Accepted when the
                                      page yields substantial text and enough links.
  TIER 2  Crawl4AI service (/scrape) -> real-browser rendering for JS-heavy or
                                      bot-guarded pages. Used ONLY when tier 1
                                      looks thin/broken.
  (Tier 3 = Gemini structuring happens later, on the extracted content.)

Usage:
    from smart_fetch import smart_fetch
    page = smart_fetch("https://nhm.assam.gov.in/")
    # page.engine -> 'trafilatura' | 'crawl4ai' | None
    # page.content, page.links ([{href,text}]), page.html (tier-1 only)
"""

import os
import re
import time
import urllib.robotparser
from dataclasses import dataclass, field
from urllib.parse import urljoin, urlparse

import requests

try:
    import trafilatura
except ImportError:  # pragma: no cover
    trafilatura = None

try:
    from bs4 import BeautifulSoup
except ImportError:  # pragma: no cover
    BeautifulSoup = None

SCRAPER_SERVICE_URL = (os.getenv("SCRAPER_SERVICE_URL") or "").rstrip("/")

# Politeness: shared rate-limit state + robots.txt compliance.
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AssamJobsResearchBot/1.0 "
    "(+https://github.com/masumahmadb/assam-jobs-repository)"
)
DELAY_SECONDS = 2.0
_last_hit = {}


def _robots_allowed(url):
    try:
        parser = urllib.robotparser.RobotFileParser()
        parser.set_url(url)
        parser.read()
        return parser.can_fetch(USER_AGENT, url)
    except Exception:
        return True


def _rate_limit(url):
    domain = urlparse(url).netloc
    elapsed = time.time() - _last_hit.get(domain, 0)
    if elapsed < DELAY_SECONDS:
        time.sleep(DELAY_SECONDS - elapsed)
    _last_hit[domain] = time.time()

MIN_TEXT_CHARS = 150   # hard floor below which even link-harvesting is useless
MIN_LINKS = 15         # nav-only/captcha pages rarely expose this many links


@dataclass
class FetchedPage:
    url: str
    engine: str                 # 'trafilatura' | 'crawl4ai' | 'failed'
    content: str = ""
    title: str | None = None
    html: str | None = None     # raw HTML (tier 1 only)
    links: list = field(default_factory=list)

    @property
    def ok(self):
        return bool(self.content)


# ---------------------------------------------------------------- tier 1 ----

_JUNK_HREF_RE = re.compile(
    r"(?:javascript:|mailto:|tel:|data:|facebook\.com/(?:sharer|tr)|twitter\.com/intent|"
    r"x\.com/intent|api\.whatsapp\.com|wa\.me|t\.me/share|\.(?:jpg|jpeg|png|gif|webp|"
    r"svg|ico|css|js|m3u8|mp4)(?:[?#]|$))",
    re.I,
)


def _extract_links(html, base_url, cap=300):
    """Pull absolute http(s) links with anchor text out of raw HTML."""
    links = []
    if not html or BeautifulSoup is None:
        return links
    soup = BeautifulSoup(html, "html.parser")
    seen = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith("#") or _JUNK_HREF_RE.search(href):
            continue
        absu = urljoin(base_url, href.split("#")[0])
        if not absu.startswith(("http://", "https://")) or absu in seen:
            continue
        seen.add(absu)
        text = re.sub(r"\s+", " ", a.get_text(" ", strip=True))[:200]
        links.append({"href": absu, "text": text})
        if len(links) >= cap:
            break
    return links


def _static_fetch(url, timeout=25):
    """Tier 1: polite GET + trafilatura extraction. Returns FetchedPage."""
    if not _robots_allowed(url):
        print(f"  [smart-fetch] robots.txt disallows: {url}")
        return FetchedPage(url=url, engine="failed")

    _rate_limit(url)
    headers = {"User-Agent": USER_AGENT, "Accept-Language": "en"}
    try:
        resp = requests.get(url, headers=headers, timeout=timeout)
        resp.raise_for_status()
        html = resp.text
    except requests.exceptions.SSLError:
        print(f"  [smart-fetch] SSL chain error, retrying unverified: {url}")
        try:
            import urllib3

            urllib3.disable_warnings()
            resp = requests.get(url, headers=headers, timeout=timeout, verify=False)
            resp.raise_for_status()
            html = resp.text
        except Exception as exc:
            print(f"  [smart-fetch] failed: {url} ({str(exc)[:80]})")
            return FetchedPage(url=url, engine="failed")
    except Exception as exc:
        print(f"  [smart-fetch] failed: {url} ({str(exc)[:80]})")
        return FetchedPage(url=url, engine="failed")

    if trafilatura is None:
        print("  [smart-fetch] trafilatura not installed — pip install trafilatura")
        return FetchedPage(url=url, engine="failed", html=html)

    # Precision mode first (best for articles); listings/homepages often get
    # rejected as non-articles, so fall back to recall mode before escalating.
    text = (trafilatura.extract(html, url=url, include_comments=False,
                                favor_precision=True)
            or trafilatura.extract(html, url=url, include_comments=False,
                                   include_tables=True, favor_recall=True)
            or "")
    meta = trafilatura.bare_extraction(html, url=url, with_metadata=True) or {}
    title = (meta.get("title") if isinstance(meta, dict) else None) or None
    links = _extract_links(html, url)

    # Quality gate: rich article text OR a well-linked listing page passes.
    # JS shells / captcha walls fail both and escalate to the browser tier.
    good = (len(text.strip()) >= 600) or (len(links) >= MIN_LINKS and len(text.strip()) >= MIN_TEXT_CHARS)
    print(f"  [smart-fetch][static] {url} -> text={len(text)} links={len(links)} "
          f"quality={'OK' if good else 'THIN'}")
    return FetchedPage(
        url=url,
        engine="trafilatura" if good else "escalate",
        content=text.strip() if good else "",
        title=title if good else None,
        html=html,
        links=links,
    )


# ---------------------------------------------------------------- tier 2 ----

def _crawl4ai_fetch(url, timeout=40):
    """Tier 2: real-browser rendering via the Crawl4AI microservice."""
    if not SCRAPER_SERVICE_URL:
        print("  [smart-fetch][crawl4ai] SCRAPER_SERVICE_URL not set, skipping tier 2")
        return None
    try:
        resp = requests.post(
            f"{SCRAPER_SERVICE_URL}/scrape",
            json={"url": url},
            timeout=timeout,
        )
        if not resp.ok:
            print(f"  [smart-fetch][crawl4ai] HTTP {resp.status_code} for {url}")
            return None
        data = resp.json()
        if not data.get("success"):
            return None
        md = data.get("content") or ""
        links = []
        for m in re.finditer(r"\[([^\]\n]{0,200})\]\((https?://[^)\s]+)", md):
            links.append({"href": m.group(2), "text": m.group(1).strip()})
        print(f"  [smart-fetch][crawl4ai] {url} -> text={len(md)} links={len(links)}")
        return FetchedPage(url=url, engine="crawl4ai", content=md.strip(),
                           title=data.get("title"), links=links[:300])
    except Exception as exc:
        print(f"  [smart-fetch][crawl4ai] failed for {url}: {str(exc)[:80]}")
        return None


# ---------------------------------------------------------------- public ----

def smart_fetch(url, allow_browser=True):
    """Fetch a page through the tiered chain. Returns a FetchedPage (check .ok)."""
    page = _static_fetch(url)
    if page.engine == "trafilatura" and page.ok:
        return page
    if not allow_browser:
        return FetchedPage(url=url, engine="failed", html=getattr(page, "html", None))
    tier2 = _crawl4ai_fetch(url)
    if tier2 and tier2.ok:
        return tier2
    return FetchedPage(url=url, engine="failed", html=getattr(page, "html", None))
