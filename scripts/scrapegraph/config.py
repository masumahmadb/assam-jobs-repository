"""Configuration and OpenRouter model auto-selection for the scraper test."""

import os
import sys

import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

OPENROUTER_BASE = "https://openrouter.ai/api/v1"

# Preference order for free OpenRouter models that handle JSON extraction well.
# The first available ones are picked automatically; diverse providers are
# listed so upstream rate limits on one provider don't block the run.
PREFERRED_FREE_MODELS = [
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "z-ai/glm-5.2:free",
    "thinkingmachines/inkling:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
]

FIRESTORE_TEST_COLLECTION = "new_jobs_news_scrapegraph_test"


def get_openrouter_key():
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print(
            "ERROR: OPENROUTER_API_KEY not set.\n"
            "Create scripts/scrapegraph/.env with:\n"
            "  OPENROUTER_API_KEY=sk-or-v1-..."
        )
        sys.exit(1)
    return key


def select_openrouter_model(api_key):
    """Query OpenRouter's catalog; return the first available preferred model."""
    models = select_openrouter_models(api_key, limit=1)
    return models[0]


def select_openrouter_models(api_key, limit=3):
    """Return up to `limit` available preferred free models (ordered by preference).

    Used both to pick the primary model and to provide automatic
    fallbacks when a free model is rate-limited.
    """
    try:
        resp = requests.get(
            f"{OPENROUTER_BASE}/models",
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=30,
        )
        resp.raise_for_status()
        available = {m["id"] for m in resp.json().get("data", [])}
    except Exception as exc:
        print(f"WARN: could not list OpenRouter models ({exc}); using fallback.")
        return PREFERRED_FREE_MODELS[:limit]

    picks = [m for m in PREFERRED_FREE_MODELS if m in available][:limit]
    if not picks:
        free_text = sorted(
            m
            for m in available
            if m.endswith(":free") and ("instruct" in m or "-it" in m or "chat" in m)
        )
        picks = free_text[:limit] or PREFERRED_FREE_MODELS[:1]
    return picks


def build_graph_config(model):
    """ScrapeGraphAI graph config wired to OpenRouter via its OpenAI-compatible API."""
    api_key = get_openrouter_key()
    return {
        "llm": {
            "api_key": api_key,
            "model": f"openai/{model}",
            "base_url": OPENROUTER_BASE,
            "temperature": 0,
            "model_tokens": 8192,
        },
        "verbose": False,
        "headless": True,
    }
