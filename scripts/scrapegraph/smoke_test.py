"""Smoke test: verify OpenRouter key works and ScrapeGraphAI can extract via it."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import config
from extract import extract_article
import fetcher

models = config.select_openrouter_models(config.get_openrouter_key(), limit=3)
print("Models (primary + fallbacks):", models)

graph_configs = [config.build_graph_config(m) for m in models]
print("LLM config:", {**graph_configs[0]["llm"], "api_key": "***"})

html = fetcher.fetch("https://nhm.assam.gov.in/")
assert html, "NHM page fetch failed"
print(f"Fetched NHM listing: {len(html)} bytes")

item = extract_article(graph_configs, "https://nhm.assam.gov.in/", html)
print("Extraction result:")
import json
print(json.dumps(item, indent=2, ensure_ascii=False)[:1500] if item else "(not relevant / failed)")
