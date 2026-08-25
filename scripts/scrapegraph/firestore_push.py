"""Optional Firestore writer for the isolated test collection.

Writes ONLY to new_jobs_news_scrapegraph_test - never touches
job_listings, updates or any production collection.
"""

import json
import os

from config import FIRESTORE_TEST_COLLECTION


def push_articles(articles):
    """Push articles to the test collection. Requires Firebase Admin credentials.

    Credentials are read from env vars (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY) exactly like scripts/pushToFirestore.js, so nothing is
    hardcoded. Returns number of documents written.
    """
    try:
        from firebase_admin import credentials, firestore, initializeApp
    except ImportError:
        print("firebase-admin not installed; skipping Firestore push.")
        return 0

    import firebase_admin

    project_id = None
    try:
        cred = credentials.ApplicationDefault()
        project_id = os.environ.get("FIREBASE_PROJECT_ID")
        initializeApp(cred, {"projectId": project_id} if project_id else None)
    except Exception as exc:
        print(f"Could not initialize Firebase Admin ({exc}); skipping Firestore push.")
        return 0

    db = firestore.client()
    batch = db.batch()
    written = 0

    for item in articles:
        doc_id = item.get("doc_id")
        if not doc_id:
            continue
        data = {k: v for k, v in item.items() if v is not None}
        data["engine"] = "trafilatura+crawl4ai"
        data["test"] = True
        batch.set(db.collection(FIRESTORE_TEST_COLLECTION).document(doc_id), data)
        written += 1
        if written % 400 == 0:
            batch.commit()
            batch = db.batch()

    if written:
        batch.commit()
    print(f"Firestore: wrote {written} docs to '{FIRESTORE_TEST_COLLECTION}' (test only).")
    return written


def save_local(articles, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(articles)} articles to {path}")
