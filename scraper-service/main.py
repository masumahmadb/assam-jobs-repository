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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
