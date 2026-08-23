"""
ScrapeGraphAI experiment: scrape job/recruitment news into structured records.

Isolated from the production scraper (scripts/scrapeGovtJobs.js).
Writes to a local JSON file and, only with --push AND valid Firebase Admin
credentials, to the dedicated test collection new_jobs_news_scrapegraph_test.

Usage:
  python run_scraper.py [--limit 3] [--max-per-source 4] [--sources apsc,nhm_assam] [--push]
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from urllib.parse import urljoin

from bs4 import BeautifulSoup

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import config
import extract
import fetcher
from firestore_push import push_articles, save_local
from pipeline import dedupe, doc_id_for, validate
from sources import LINK_KEYWORDS, NEGATIVE_KEYWORDS, SOURCES

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")


def find_article_links(listing_html, listing_url, max_links):
    """Shortlist candidate article URLs from a listing page."""
    soup = BeautifulSoup(listing_html, "html.parser")
    candidates = []
    seen = set()

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"]
        text = anchor.get_text(" ", strip=True)
        if not text or len(text) < 10:
            continue
        low = text.lower()
        if any(neg in low or neg in href.lower() for neg in NEGATIVE_KEYWORDS):
            continue
        if not any(kw in low for kw in LINK_KEYWORDS):
            continue

        absolute = urljoin(listing_url, href)
        if not absolute.startswith("http"):
            continue
        key = absolute.split("#")[0]
        if key in seen:
            continue
        seen.add(key)
        candidates.append({"url": key, "text": text})

    return candidates[:max_links]


def main():
    parser = argparse.ArgumentParser(description="ScrapeGraphAI NewJobsNews test scraper")
    parser.add_argument("--limit", type=int, default=6,
                        help="max articles processed in total")
    parser.add_argument("--max-per-source", type=int, default=2,
                        help="max candidate links harvested per source")
    parser.add_argument("--sources", type=str, default=None,
                        help="comma separated source ids (default: all enabled)")
    parser.add_argument("--push", action="store_true",
                        help="push results to the Firestore TEST collection")
    parser.add_argument("--skip-extract", action="store_true",
                        help="harvest candidate links only (no LLM calls)")
    args = parser.parse_args()

    selected = [s for s in SOURCES if s["enabled"]]
    if args.sources:
        ids = {x.strip() for x in args.sources.split(",")}
        selected = [s for s in selected if s["id"] in ids]

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    models = config.select_openrouter_models(config.get_openrouter_key(), limit=3)
    graph_configs = [config.build_graph_config(m) for m in models]
    print(f"OpenRouter models (primary + fallbacks): {', '.join(models)}")

    stats = {"sources_ok": [], "sources_failed": [], "candidates": 0,
             "accepted": 0, "rejected": 0, "duplicates": 0}
    articles = []

    for source in selected:
        if len(articles) >= args.limit:
            break
        print(f"\n=== Source: {source['name']} ({source['url']}) ===")
        try:
            html = fetcher.fetch(source["url"])
        except Exception as exc:
            html = None
            print(f"  [source] error: {exc}")
        if not html:
            stats["sources_failed"].append(source["id"])
            continue

        links = find_article_links(html, source["url"], args.max_per_source)
        print(f"  Candidate links: {len(links)}")
        stats["sources_ok"].append(source["id"])

        for link in links:
            if len(articles) >= args.limit:
                break
            stats["candidates"] += 1
            if args.skip_extract:
                print(f"   - {link['text'][:70]} -> {link['url']}")
                continue

            article_html = fetcher.fetch(link["url"])
            if not article_html:
                stats["rejected"] += 1
                continue

            item = extract.extract_article(graph_configs, link["url"], article_html)
            clean, reason = validate(item, source)
            if not clean:
                print(f"   x Rejected ({reason}): {link['text'][:60]}")
                stats["rejected"] += 1
                continue

            clean["found_via"] = link["text"][:120]
            articles.append(clean)
            print(f"   + Accepted: {clean['title'][:70]}")

    unique, dup_count = dedupe(articles)
    stats["duplicates"] = dup_count
    stats["accepted"] = len(unique)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    out_path = os.path.join(OUTPUT_DIR, f"scrapegraph_{timestamp}.json")
    payload = {
        "run_at": datetime.now(timezone.utc).isoformat(),
        "model": models[0],
        "stats": stats,
        "articles": [
            {**a, "doc_id": doc_id_for(a.get("article_url", ""), a.get("title") or "")}
            for a in unique
        ],
    }
    save_local(payload, out_path)

    print("\n=== SUMMARY ===")
    print(json.dumps(stats, indent=2))

    if args.push and unique and not args.skip_extract:
        push_articles(payload["articles"])
    elif args.push:
        print("Firestore push skipped (no accepted articles).")

    print(f"\nOutput file: {out_path}")


if __name__ == "__main__":
    main()
