"""ScrapeGraphAI-powered extraction of structured job-news data from article HTML."""

import json
import time

from pydantic import BaseModel, Field
from scrapegraphai.graphs import SmartScraperGraph

EXTRACTION_PROMPT = """You are an extraction assistant for an Assam (India) job news app.
The following is the content of ONE web page that may contain a government job /
recruitment / exam / admit card / result news item.

Your tasks:
1. Decide if this page is a job/recruitment-related news item or official
   notification relevant to Assam, Northeast India, or India-wide government
   recruitment. General politics, sports, entertainment, tenders and unrelated
   news are NOT relevant.
2. If NOT relevant, return is_relevant=false and leave other fields null.
3. If relevant, extract ONLY information actually present on the page.
   NEVER invent values - use null when a field is genuinely absent.

Field rules:
- title: headline of the news/notification
- summary: your own concise 2-5 sentence summary in simple English describing
  what the news is about. Never copy the article verbatim.
- category: one of "recruitment", "exam", "admit_card", "result", "announcement"
- organization: recruiting organization/department (e.g. APSC, NHM Assam)
- location: place/region mentioned (e.g. "Assam", "Guwahati", "India")
- vacancies: number of posts/vacancies if stated
- qualification: required educational qualification if stated
- important_dates: object with keys like application_start, application_deadline,
  exam_date - only include dates actually present
- official_notification_url: link to the official PDF/notification on the page
- apply_url: online application link if present
- thumbnail_url: main image URL of the article if present in the content
- image_urls: list of other relevant image URLs present

Page content:
"""


class ImportantDates(BaseModel):
    application_start: str = None
    application_deadline: str = None
    exam_date: str = None


class JobNews(BaseModel):
    is_relevant: bool
    title: str = None
    summary: str = None
    category: str = None
    organization: str = None
    location: str = None
    vacancies: str = None
    qualification: str = None
    important_dates: ImportantDates = None
    official_notification_url: str = None
    apply_url: str = None
    thumbnail_url: str = None
    image_urls: list = Field(default_factory=list)


def extract_article(graph_configs, url, html):
    """Run ScrapeGraphAI SmartScraperGraph over raw article HTML.

    graph_configs: list of graph config dicts (primary + fallback models).
    Tries each in order; free OpenRouter models are often rate-limited.
    Returns a normalized dict or None if extraction failed / not relevant.
    """
    # Truncate huge pages to keep LLM input within token budget
    content = html[:60000]
    prompt = EXTRACTION_PROMPT + content[:55000]

    result = None
    last_error = None
    for cfg in graph_configs:
        model = cfg["llm"]["model"]
        # Free OpenRouter models share upstream pools; retry transient 429s.
        for attempt in range(3):
            try:
                graph = SmartScraperGraph(
                    prompt=prompt,
                    source=content,
                    config=cfg,
                    schema=JobNews,
                )
                result = graph.run()
                break
            except Exception as exc:
                last_error = exc
                if "429" in str(exc) and attempt < 2:
                    wait = 6 * (attempt + 1)
                    print(f"    [extract] {model} rate-limited, retry in {wait}s")
                    time.sleep(wait)
                else:
                    print(f"    [extract] {model} failed for {url}: {str(exc)[:100]}")
                    break
        if result is not None:
            break

    if result is None:
        if last_error:
            print(f"    [extract] All models failed for {url}")
        return None

    if isinstance(result, str):
        try:
            result = json.loads(result.replace("```json", "").replace("```", ""))
        except Exception:
            print(f"    [extract] Unparseable answer for {url}")
            return None

    if not isinstance(result, dict) or not result.get("is_relevant"):
        return None

    result["article_url"] = url
    return normalize(result)


def normalize(item):
    """Ensure consistent types; drop empties."""
    dates = item.get("important_dates") or {}
    if hasattr(dates, "model_dump"):
        dates = dates.model_dump()
    clean_dates = {k: v for k, v in (dates or {}).items() if v}

    def s(v):
        if v is None:
            return None
        text = str(v).strip()
        return text if text else None

    images = item.get("image_urls") or []
    if isinstance(images, str):
        images = [images]

    return {
        "title": s(item.get("title")),
        "summary": s(item.get("summary")),
        "category": s(item.get("category")),
        "organization": s(item.get("organization")),
        "location": s(item.get("location")),
        "vacancies": s(item.get("vacancies")),
        "qualification": s(item.get("qualification")),
        "important_dates": clean_dates or None,
        "official_notification_url": s(item.get("official_notification_url")),
        "apply_url": s(item.get("apply_url")),
        "thumbnail_url": s(item.get("thumbnail_url")),
        "image_urls": [i for i in images if i],
        "article_url": s(item.get("article_url")),
    }
