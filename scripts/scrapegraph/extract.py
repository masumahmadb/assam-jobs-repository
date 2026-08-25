"""Tiered extraction for job-news articles.

Primary:  trafilatura content extraction + deterministic keyword/regex rules
          (free, no LLM, no browser).
Optional: Gemini structuring hook — enable later with USE_GEMINI_EXTRACT=1
          once the real-extraction phase begins. Kept behind a flag so the
          pipeline never burns quota by accident.
"""

import json
import os
import re

try:
    import trafilatura
except ImportError:  # pragma: no cover
    trafilatura = None

# ---------------------------------------------------------------- keywords --

RELEVANT_KEYWORDS = [
    "recruitment", "vacancy", "vacancies", "notification", "advertisement",
    "apply online", "application", "admit card", "result", "merit list",
    "exam", "walk-in", "engagement", "appointment", "posts", "selection",
]

CATEGORY_RULES = [
    ("result", ["result declared", "results", "merit list", "score card", "cut off", "cut-off"]),
    ("admit_card", ["admit card", "hall ticket", "call letter", "e-call letter"]),
    ("exam", ["exam date", "examination schedule", "written test", "pet ", "pst ", "exam pattern", "syllabus"]),
    ("announcement", ["extension", "corrigendum", "re-opened", "reopened", "notice", "guidelines"]),
    ("recruitment", ["recruitment", "vacancy", "vacancies", "notification", "advertisement",
                     "apply online", "posts", "engagement", "appointment", "walk-in"]),
]

VACANCY_RE = re.compile(
    r"(\d{1,5}(?:,\d{3})*)\s*(?:\+)?\s*(?:nos?\.?|posts?|vacanc\w+|openings?)", re.I
)
QUALIFICATION_RE = re.compile(
    r"(?:educational\s+qualification|qualification)\s*(?:[:\-–]|is)?\s*([^.;\n]{10,140})", re.I
)
DATE_RE = re.compile(
    r"(?:(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august"
    r"|september|october|november|december)\s+(\d{4}))",
    re.I,
)
DEADLINE_HINTS = ["last date", "deadline", "on or before", "closing date", "submit on or before"]
START_HINTS = ["starts from", "application start", "opens on", "commences from"]
EXAM_HINTS = ["exam date", "exam will be held", "examination date", "scheduled on"]

MONTHS = {m: i + 1 for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june", "july",
     "august", "september", "october", "november", "december"])}


def _classify(text):
    low = text.lower()
    best_cat, best_hits = None, 0
    for cat, kws in CATEGORY_RULES:
        hits = sum(1 for k in kws if k in low)
        if hits > best_hits:
            best_cat, best_hits = cat, hits
    return best_cat


def _find_dates(text):
    """Map hinted dates into application_start / application_deadline / exam_date."""
    out = {}
    for hint, key in ((START_HINTS, "application_start"),
                      (DEADLINE_HINTS, "application_deadline"),
                      (EXAM_HINTS, "exam_date")):
        for h in hint:
            idx = text.lower().find(h)
            if idx == -1:
                continue
            window = text[idx: idx + 160]
            m = DATE_RE.search(window)
            if m:
                day, mon, year = int(m.group(1)), MONTHS[m.group(2).lower()], int(m.group(3))
                out[key] = f"{day:02d}-{mon:02d}-{year}"
                break
    return out


def _guess_org(title, text, source=None):
    """Cheap org guess: look for known Assam org acronyms in title/text."""
    known = [
        "APSC", "SLPRB", "NHM", "DME", "DHSFW", "SSA", "APDCL", "APGCL", "AEGCL",
        "IOCL", "OIL India", "NTPC", "PGCIL", "CSIR", "SSC", "RRB", "IBPS", "SBI",
        "SCERT", "Gauhati High Court", "Assam Police", "KAAC", "Dima Hasao",
        "FREMAA", "ASTC", "PHED", "PWD", "WRD",
    ]
    hay = f"{title} {text[:600]}"
    for org in known:
        if re.search(rf"\b{re.escape(org)}\b", hay, re.I):
            return org.upper() if len(org) <= 6 else org
    return None


def _gemini_enrich(url, text):
    """Reserved for the real-extraction phase (USE_GEMINI_EXTRACT=1).
    Will call Gemini directly with the JobNews schema — NOT wired yet."""
    if os.getenv("USE_GEMINI_EXTRACT") != "1":
        return None
    # TODO(phase-2): direct Gemini call here; keep trafilatura output as fallback.
    return None


def _meta(meta, key):
    """trafilatura 2.x returns a Document object; older versions a dict."""
    if meta is None:
        return None
    if isinstance(meta, dict):
        return meta.get(key)
    return getattr(meta, key, None)


def extract_article(graph_configs, url, html, fallback_title=None):
    """Extract structured job-news data from raw article HTML (or markdown text
    from browser-rendered pages).

    Keeps the old signature (graph_configs ignored) so callers stay compatible.
    Returns a normalized dict or None when irrelevant/failed.
    """
    if trafilatura is None:
        print("    [extract] trafilatura not installed")
        return None

    looks_html = bool(html) and ("<div" in html or "<html" in html or "<p>" in html)
    if looks_html:
        text = trafilatura.extract(html, url=url, include_comments=False) or ""
        meta = trafilatura.bare_extraction(html, url=url, with_metadata=True)
        title = (_meta(meta, "title") or "").strip()
        image = _meta(meta, "image")
        image_urls = image if isinstance(image, list) else ([image] if image else [])
    else:
        # Markdown/plain text from the Crawl4AI tier — use it as-is.
        text = html or ""
        title = (fallback_title or "").strip()
        image_urls = []

    low = (title + " " + text[:4000]).lower()
    relevant = any(k in low for k in RELEVANT_KEYWORDS)
    if not relevant or len(text) < 200:
        return None

    gemini = _gemini_enrich(url, text)

    category = _classify(title + " " + text[:3000]) or "announcement"
    vacancies = None
    m = VACANCY_RE.search(text)
    if m:
        vacancies = f"{m.group(1)} posts"

    qual = None
    qm = QUALIFICATION_RE.search(text)
    if qm:
        qual = qm.group(1).strip()[:140]

    item = {
        "is_relevant": True,
        "title": title or None,
        "summary": _summary(text),
        "category": category,
        "organization": _guess_org(title, text),
        "location": "Assam",
        "vacancies": vacancies,
        "qualification": qual,
        "important_dates": _find_dates(text) or None,
        "official_notification_url": None,   # phase-2: PDF link detection
        "apply_url": None,                   # phase-2: apply-link detection
        "thumbnail_url": (image_urls[0] if image_urls else None),
        "image_urls": image_urls[:5],
        "article_url": url,
    }

    # Phase-2 hook: Gemini fills gaps only where rules found nothing.
    if gemini:
        for k, v in gemini.items():
            if item.get(k) in (None, "", [], {}) and v:
                item[k] = v

    return normalize(item)


def _summary(text, max_sentences=4):
    """Deterministic lead-summary: first few sentences of the cleaned article."""
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    keep = []
    length = 0
    for s in sentences:
        s = s.strip()
        if len(s) < 25:
            continue
        keep.append(s)
        length += len(s)
        if length > 420 or len(keep) >= max_sentences:
            break
    return " ".join(keep)[:800] or None


def normalize(item):
    """Ensure consistent types; drop empties."""
    dates = item.get("important_dates") or {}
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
