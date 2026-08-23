"""Validation and duplicate detection for extracted job-news items."""

import hashlib
import re
from urllib.parse import urlparse

VALID_CATEGORIES = {"recruitment", "exam", "admit_card", "result", "announcement"}


def validate(item, source):
    """Return (clean_item, error_reason). Never invents data: invalid items are dropped."""
    if not item:
        return None, "empty extraction"

    if not item.get("title") or len(item["title"]) < 8:
        return None, "missing/short title"

    if not item.get("summary") or len(item["summary"]) < 40:
        return None, "missing/short summary"

    category = (item.get("category") or "").lower().strip().replace(" ", "_")
    if category in ("admit card", "admitcard"):
        category = "admit_card"
    if category not in VALID_CATEGORIES:
        return None, f"invalid category: {item.get('category')}"

    item["category"] = category
    if item.get("thumbnail_url") and not _looks_like_url(item["thumbnail_url"]):
        item["thumbnail_url"] = None
    item["image_urls"] = [u for u in (item.get("image_urls") or []) if _looks_like_url(u)]

    item["source"] = source["name"]
    item["source_id"] = source["id"]
    item["scope"] = source["scope"]
    item["article_url"] = item.get("article_url")
    item["doc_id"] = doc_id_for(item["article_url"], item["title"])
    return item, None


def _looks_like_url(value):
    return isinstance(value, str) and value.startswith(("http://", "https://"))


def doc_id_for(url, title):
    raw = f"{url}|{normalize_title(title)}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:24]


def normalize_title(title):
    return re.sub(r"\s+", " ", (title or "").lower()).strip()


def dedupe(items):
    """Drop duplicates by URL host+path and by normalized title."""
    seen_urls = set()
    seen_titles = set()
    unique = []
    dup_count = 0

    for item in items:
        url_key = _url_key(item.get("article_url", ""))
        title_key = normalize_title(item.get("title"))

        if url_key and url_key in seen_urls:
            dup_count += 1
            continue
        if title_key in seen_titles:
            dup_count += 1
            continue

        seen_urls.add(url_key)
        seen_titles.add(title_key)
        unique.append(item)

    return unique, dup_count


def _url_key(url):
    if not isinstance(url, str):
        url = str(url or "")
    try:
        parsed = urlparse(url)
        return f"{parsed.netloc}{parsed.path.rstrip('/')}".lower()
    except Exception:
        return url.lower()
