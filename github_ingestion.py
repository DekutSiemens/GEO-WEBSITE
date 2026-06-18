"""
github_ingestion.py
=============================================================================
LARGER-Africa — GitHub → Website auto-ingestion service.

This service watches a GitHub repository folder for new JSON project files.
When it sees a new file, it fetches the JSON, tags it with the source filename,
and POSTs it to the website's /api/data/auto-create endpoint. A new project
automatically appears in the dashboard.

WORKFLOW:
  1. Drop a JSON file (matching the sample schema) into the watched GitHub folder
  2. This service detects it on the next poll (default: every 60 seconds)
  3. The file's content is POSTed to the website
  4. The project shows up on the dashboard, tagged with the filename

PREREQUISITES:
  pip install requests

CONFIGURATION:
  Edit the CONFIG section below, OR set environment variables of the same name.

  Required (always):
    GITHUB_REPO    e.g. "kabbyJB/larger-africa-data"
    GITHUB_FOLDER  e.g. "ingest"
    WEBSITE_URL    e.g. "http://localhost:5101/api/data/auto-create"
    API_KEY        same value as AUTOMATION_API_KEY in the backend .env
    USER_ID        MongoDB _id of the user that should own auto-projects
                   (log into MongoDB Atlas, find your user document, copy _id)

  Optional:
    GITHUB_TOKEN   personal access token (raises rate limit from 60 to 5000/hr)
    GITHUB_BRANCH  defaults to "main"
    POLL_INTERVAL  seconds between polls (default 60)

RUNNING:
  python github_ingestion.py
=============================================================================
"""

import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

import requests

# =============================================================================
# CONFIG — edit these or set as environment variables
# =============================================================================
GITHUB_REPO   = "DekutSiemens/GEO-WEBSITE"
GITHUB_FOLDER = "ingest"
GITHUB_BRANCH = "main"
GITHUB_TOKEN  = ""

WEBSITE_URL = "http://localhost:5101/api/data/auto-create"
API_KEY     = "fe25318d-07a8-4a2c-8e59-3e87723311a790d323b2-ad36-4984-8d29-6aa0dbf2f6ee"
USER_ID     = "6a100bb2a0c094e8d826fc43"

POLL_INTERVAL_SECONDS = int(os.environ.get("POLL_INTERVAL", "60"))

# Local file that remembers which GitHub file SHAs have already been ingested,
# so the same file isn't created over and over on every poll.
STATE_FILE = Path(__file__).resolve().parent / "ingested_files.json"


# =============================================================================
# HELPERS
# =============================================================================
def now_str():
    return datetime.now().isoformat(timespec="seconds")


def load_state():
    """Return the set of GitHub file SHAs we've already created projects for."""
    if STATE_FILE.exists():
        try:
            return set(json.loads(STATE_FILE.read_text()))
        except Exception:
            return set()
    return set()


def save_state(seen_shas):
    STATE_FILE.write_text(json.dumps(sorted(list(seen_shas)), indent=2))


def github_headers():
    h = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        h["Authorization"] = f"token {GITHUB_TOKEN}"
    return h


def github_list_files():
    """List JSON files currently in the watched folder of the repo."""
    url = (f"https://api.github.com/repos/{GITHUB_REPO}/contents/"
           f"{GITHUB_FOLDER}?ref={GITHUB_BRANCH}")
    try:
        r = requests.get(url, headers=github_headers(), timeout=30)
    except Exception as e:
        print(f"  [error] cannot reach GitHub: {e}")
        return []
    if r.status_code == 404:
        print(f"  [error] folder '{GITHUB_FOLDER}' not found in repo "
              f"'{GITHUB_REPO}' on branch '{GITHUB_BRANCH}'. "
              f"Create it and add a .gitkeep or your first JSON file.")
        return []
    if r.status_code != 200:
        print(f"  [error] GitHub API {r.status_code}: {r.text[:200]}")
        return []
    items = r.json()
    return [f for f in items if f.get("name", "").lower().endswith(".json")]


def fetch_json(download_url):
    """Fetch the raw JSON content of one file."""
    try:
        r = requests.get(download_url, timeout=30)
        if r.status_code != 200:
            print(f"    [error] HTTP {r.status_code} fetching content")
            return None
        return r.json()
    except Exception as e:
        print(f"    [error] could not parse file: {e}")
        return None


def post_to_website(payload, source_label):
    """POST one project to the website auto-create endpoint."""
    # Tag the project with the source filename — visible in the dashboard
    payload["author"] = source_label
    # Required field — the user the project belongs to
    payload["userId"] = USER_ID

    try:
        r = requests.post(
            WEBSITE_URL,
            json=payload,
            headers={
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
            },
            timeout=30,
        )
    except Exception as e:
        print(f"    [error] website unreachable at {WEBSITE_URL}: {e}")
        return False

    if r.status_code in (200, 201):
        try:
            body = r.json()
            title = body.get("title", "?")
            data_id = body.get("dataId", "?")
            print(f"    [ok] created project #{data_id}: \"{title}\"")
            return True
        except Exception:
            print(f"    [ok] HTTP {r.status_code} (no JSON body)")
            return True

    print(f"    [error] website returned HTTP {r.status_code}: {r.text[:200]}")
    return False


# =============================================================================
# MAIN POLLING LOOP
# =============================================================================
def poll_once(seen):
    print(f"[{now_str()}] checking github...")
    files = github_list_files()
    new_files = [f for f in files if f["sha"] not in seen]
    print(f"  found {len(files)} JSON files ({len(new_files)} new)")

    for f in new_files:
        name = f["name"]
        sha = f["sha"]
        print(f"  processing {name}")
        data = fetch_json(f["download_url"])
        if data is None:
            continue

        source_label = f"GitHub: {name}"
        ok = post_to_website(data, source_label)
        if ok:
            seen.add(sha)
            save_state(seen)


def main():
    print("=" * 70)
    print("LARGER-Africa GitHub → Website ingestion service")
    print("=" * 70)
    print(f"  Repo:       {GITHUB_REPO}")
    print(f"  Branch:     {GITHUB_BRANCH}")
    print(f"  Folder:     {GITHUB_FOLDER}/")
    print(f"  Website:    {WEBSITE_URL}")
    print(f"  User ID:    {USER_ID or '(not set!)'}")
    print(f"  API key:    {'set' if API_KEY and API_KEY != 'CHANGE_ME' else '(NOT SET)'}")
    print(f"  Poll:       every {POLL_INTERVAL_SECONDS}s")
    print(f"  State file: {STATE_FILE}")
    print()

    # Sanity check the required values
    missing = []
    if GITHUB_REPO == "YOUR_USER/YOUR_REPO":
        missing.append("GITHUB_REPO")
    if not USER_ID:
        missing.append("USER_ID")
    if not API_KEY or API_KEY == "CHANGE_ME":
        missing.append("API_KEY")
    if missing:
        print(f"ERROR: configure these first: {', '.join(missing)}")
        sys.exit(1)

    seen = load_state()
    print(f"Loaded state: {len(seen)} already-ingested file(s)\n")

    while True:
        try:
            poll_once(seen)
        except Exception as e:
            print(f"  [poll error] {e}")
        print()
        time.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()
