"""Smallest possible Crawl4AI scraping service.

Vercel serverless functions cannot run the Playwright/patchright browser
runtime that Crawl4AI needs, so this tiny FastAPI app runs as a separate
service (locally, or on any small host / container). It accepts a URL and
returns cleaned Markdown content rendered with a real browser.

Run locally:
    pip install -r requirements.txt
    crawl4ai-setup
    uvicorn main:app --host 127.0.0.1 --port 8787
"""
import os

import ftfy
import uvicorn
from crawl4ai import AsyncWebCrawler, CacheMode, CrawlerRunConfig
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

MAX_CONTENT_CHARS = int(os.environ.get("SCRAPER_MAX_CHARS", "60000"))


class ScrapeRequest(BaseModel):
    url: str


@app.get("/")
async def root():
    return {"ok": True, "service": "scraper", "endpoints": ["/health", "/scrape"]}


@app.get("/health")
async def health():
    return {"ok": True}


@app.post("/scrape")
async def scrape(req: ScrapeRequest):
    if not req.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="invalid_url")
    try:
        config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS, page_timeout=45000)
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(url=req.url, config=config)
    except Exception:
        raise HTTPException(status_code=502, detail="crawl_failed")
    if not result.success:
        raise HTTPException(status_code=502, detail="crawl_failed")
    content = ftfy.fix_text((result.markdown or "").strip())
    return JSONResponse(
        {
            "success": True,
            "url": req.url,
            "title": getattr(result, "metadata", None) and result.metadata.get("title"),
            "content": content[:MAX_CONTENT_CHARS],
            "truncated": len(content) > MAX_CONTENT_CHARS,
        }
    )


# ---- Tier 1.5: static extraction (trafilatura) — no browser, ~100x cheaper ---
# Callers should hit /static FIRST and only escalate to /scrape when this
# returns thin content (JS shells). See smart_fetch / crawl.js chains.

import re  # noqa: E402
from urllib.parse import urljoin  # noqa: E402

import httpx  # noqa: E402

_JUNK_HREF_RE = re.compile(
    r"(?:javascript:|mailto:|tel:|data:|facebook\.com/(?:sharer|tr)|twitter\.com/intent|"
    r"x\.com/intent|api\.whatsapp\.com|wa\.me|t\.me/share|\.(?:jpg|jpeg|png|gif|webp|"
    r"svg|ico|css|js|m3u8|mp4)(?:[?#]|$))",
    re.I,
)

STATIC_TIMEOUT = float(os.environ.get("STATIC_FETCH_TIMEOUT", "20"))
MIN_STATIC_TEXT = int(os.environ.get("MIN_STATIC_TEXT", "400"))


def _extract_links(html: str, base_url: str, cap: int = 300):
    from bs4 import BeautifulSoup

    links, seen = [], set()
    soup = BeautifulSoup(html, "html.parser")
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


@app.post("/static")
async def static_extract(req: ScrapeRequest):
    import trafilatura

    headers = {"User-Agent": "Mozilla/5.0 (compatible; AssamJobsRisingBot/1.0)"}
    async with httpx.AsyncClient(follow_redirects=True, timeout=STATIC_TIMEOUT,
                                 verify=False) as client:
        resp = await client.get(req.url, headers=headers)
    if resp.status_code >= 400:
        return JSONResponse({"success": False, "error": f"upstream_{resp.status_code}"})
    html = resp.text[:3_000_000]
    text = trafilatura.extract(html, url=req.url, include_comments=False) or ""
    meta = trafilatura.bare_extraction(html, url=req.url, with_metadata=True) or {}
    title = meta.get("title") if isinstance(meta, dict) else None
    return JSONResponse(
        {
            "success": bool(text),
            "engine": "trafilatura",
            "url": req.url,
            "title": title,
            "content": text[:MAX_CONTENT_CHARS],
            "links": _extract_links(html, req.url),
            "thin": len(text.strip()) < MIN_STATIC_TEXT,
        }
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
