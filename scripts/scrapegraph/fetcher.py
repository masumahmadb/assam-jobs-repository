"""Polite fetching: robots.txt checks, timeouts, rate limiting."""

import time
import urllib.robotparser

import requests

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AssamJobsResearchBot/1.0 "
    "(+https://github.com/masumahmadb/assam-jobs-repository)"
)
DELAY_SECONDS = 2.0
_last_hit = {}


def robots_allowed(url):
    try:
        parser = urllib.robotparser.RobotFileParser()
        parser.set_url(url)
        parser.read()
        return parser.can_fetch(USER_AGENT, url)
    except Exception:
        return True


def fetch(url, timeout=25):
    """GET a URL with robots.txt check and per-domain rate limiting.

    Returns response text or None on failure.
    """
    if not robots_allowed(url):
        print(f"  [robots] Skipping (disallowed by robots.txt): {url}")
        return None

    from urllib.parse import urlparse

    domain = urlparse(url).netloc
    elapsed = time.time() - _last_hit.get(domain, 0)
    if elapsed < DELAY_SECONDS:
        time.sleep(DELAY_SECONDS - elapsed)

    try:
        resp = requests.get(
            url,
            headers={"User-Agent": USER_AGENT, "Accept-Language": "en"},
            timeout=timeout,
        )
        _last_hit[domain] = time.time()
        resp.raise_for_status()
        return resp.text
    except requests.exceptions.SSLError:
        # Several Assam govt sites ship incomplete cert chains; retry unverified.
        print(f"  [fetch] SSL verify failed, retrying unverified: {url}")
        try:
            import urllib3

            urllib3.disable_warnings()
            resp = requests.get(
                url,
                headers={"User-Agent": USER_AGENT},
                timeout=timeout,
                verify=False,
            )
            _last_hit[domain] = time.time()
            resp.raise_for_status()
            return resp.text
        except Exception as exc:
            print(f"  [fetch] Failed {url}: {exc}")
            return None
    except Exception as exc:
        print(f"  [fetch] Failed {url}: {exc}")
        return None
