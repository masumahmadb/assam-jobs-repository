"""Private-jobs pipeline skeleton using the tiered fetch chain.

Real extraction is intentionally DEFERRED. Running this now performs a
reachability probe per source: it reports which boards respond at tier 1
(trafilatura) vs which need the browser tier, so we know what will work the
day we switch it on.

Usage:
  python probe_sources.py                 # probe all sources with default queries
  python probe_sources.py --source indeed # single source
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))

from smart_fetch import smart_fetch          # noqa: E402
from sources import DEFAULT_QUERIES, SOURCES  # noqa: E402


def probe(source):
    query, location = DEFAULT_QUERIES[0]
    url = source["search_url"].replace("{query}", query).replace("{location}", location)
    print(f"\n=== {source['name']} [{source['strategy']}] ===")
    print(f"  {url}")
    page = smart_fetch(url)
    verdict = {
        "id": source["id"],
        "engine_used": page.engine,
        "text_chars": len(page.content or ""),
        "links": len(page.links or []),
        "viable_now": page.engine == "trafilatura" and len(page.content or "") > 800,
    }
    print(f"  engine={page.engine} text={verdict['text_chars']} links={verdict['links']}"
          f" -> {'TIER-1 OK (can enable early)' if verdict['viable_now'] else 'needs browser tier / deferred'}")
    return verdict


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=str, default=None, help="probe a single source id")
    args = parser.parse_args()

    targets = [s for s in SOURCES if not args.source or s["id"] == args.source]
    results = [probe(s) for s in targets]

    print("\n=== PROBE SUMMARY ===")
    for r in results:
        tag = "ENABLE EARLY" if r["viable_now"] else "DEFER (tier-2)"
        print(f"  {r['id'].ljust(12)} {str(r['text_chars']).rjust(6)} chars  {tag}")


if __name__ == "__main__":
    main()
