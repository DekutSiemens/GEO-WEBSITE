"""
github_ingestion.py
=============================================================================
LARGER-Africa — GitHub → Website auto-ingestion service.

This service watches a GitHub repository folder for new JSON project files,
fetches them, and POSTs them to the website's /api/data/auto-create endpoint.
A new project automatically appears in the dashboard.

SECRETS LIVE IN A SEPARATE FILE (secrets.json) so this script is safe to commit
to GitHub as a backup. To run:

  1. Copy secrets.example.json to secrets.json (in the same folder as this script)
  2. Fill in secrets.json with your real values
  3. Run:  python github_ingestion.py

If you lose your PC, you can recover by:
  - Cloning the repo (which contains this script)
  - Generating fresh tokens from GitHub and a fresh API key
  - Creating a new secrets.json with the values
  - Running the script

PREREQUISITES:
  pip install requests
=============================================================================
"""

import json
import sys
import time
from datetime import datetime
from pathlib import Path

import requests

SCRIPT_DIR = Path(__file__).resolve().parent
SECRETS_FILE = SCRIPT_DIR / "secrets.json"
STATE_FILE = SCRIPT_DIR / "ingested_files.json"


# =============================================================================
# LOAD SECRETS
# =============================================================================
def load_config():
    """Load secrets/config from secrets.json (next to this script)."""
    if not SECRETS_FILE.exists():
        print(f"ERROR: {SECRETS_FILE} does not exist.")
        print(f"  Copy secrets.example.json to secrets.json and fill it in.")
        sys.exit(1)
    try:
        cfg = json.loads(SECRETS_FILE.read_text())
    except json.JSONDecodeError as e:
        print(f"ERROR: secrets.json is not valid JSON: {e}")
        sys.exit(1)

    # Sanity check required fields
    required = ["github_repo", "github_folder", "github_branch", "github_token",
                "website_url", "api_key", "user_id"]
    missing = [k for k in required if not cfg.get(k)]
    if missing:
        print(f"ERROR: secrets.json is missing required fields: {missing}")
        print("  See secrets.example.json for the expected format.")
        sys.exit(1)

    # Optional with default
    cfg.setdefault("poll_interval_seconds", 60)
    return cfg


CFG = load_config()


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
    if CFG["github_token"]:
        h["Authorization"] = f"token {CFG['github_token']}"
    return h


def github_list_files():
    """List JSON files currently in the watched folder of the repo."""
    url = (f"https://api.github.com/repos/{CFG['github_repo']}/contents/"
           f"{CFG['github_folder']}?ref={CFG['github_branch']}")
    try:
        r = requests.get(url, headers=github_headers(), timeout=30)
    except Exception as e:
        print(f"  [error] cannot reach GitHub: {e}")
        return []
    if r.status_code == 404:
        print(f"  [error] folder '{CFG['github_folder']}' not found in repo "
              f"'{CFG['github_repo']}' on branch '{CFG['github_branch']}'.")
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


def is_from_today(filename):
    """Return True if the ESP32 timestamp in the filename is from today.

    Expects filenames like 'esp32_2026-06-26T11-32-04.json'. Falls back to True
    for any filename that doesn't match (so non-ESP32 files still ingest).
    """
    import re
    m = re.search(r'(\d{4}-\d{2}-\d{2})', filename)
    if not m:
        return True  # no date in filename → can't filter, let it through
    file_date = m.group(1)
    today = datetime.now().strftime('%Y-%m-%d')
    return file_date == today


def post_to_website(payload, source_label):
    """POST one project to the website auto-create endpoint."""
    payload["author"] = source_label
    payload["userId"] = CFG["user_id"]

    try:
        r = requests.post(
            CFG["website_url"],
            json=payload,
            headers={
                "Content-Type": "application/json",
                "x-api-key": CFG["api_key"],
            },
            timeout=30,
        )
    except Exception as e:
        print(f"    [error] website unreachable at {CFG['website_url']}: {e}")
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


def post_to_monitor(payload, filename):
    """POST one sensor reading to the live-monitor append endpoint.

    Extracts the sensor values from the ESP32 JSON and sends just those.
    The day's project is created automatically on the first reading of the day.
    """
    # Extract sensor values from the ESP32 payload (which uses our project schema).
    # The ESP32 sketch puts humidity in the comment text — parse it out.
    import re

    device_id = payload.get("title", "").split("-")[0] if payload.get("title") else "ESP32"
    # Better: try to recover the device ID embedded in the title or filename
    # Filenames look like: esp32_2026-06-29T11-32-04.json
    # Titles look like:    ESP32-01-2026-06-29T11-32-04
    title = payload.get("title", "")
    m = re.match(r'(ESP32-\d+)', title)
    if m:
        device_id = m.group(1)

    humidity = None
    comment = payload.get("geochemistryComment", "")
    m = re.search(r'H=([\d.]+)\s*%', comment)
    if m:
        try:
            humidity = float(m.group(1))
        except ValueError:
            pass

    monitor_payload = {
        "userId":      CFG["user_id"],
        "device_id":   device_id,
        "location":    payload.get("location", ""),
        "temperature": payload.get("temperature"),
        "humidity":    humidity,
        "timestamp":   payload.get("collectionDate"),  # ESP32 sets this
    }

    monitor_url = CFG.get("monitor_url")
    if not monitor_url:
        # derive from website_url: replace /data/auto-create with /monitor/append
        monitor_url = CFG["website_url"].replace(
            "/data/auto-create", "/monitor/append")

    try:
        r = requests.post(
            monitor_url,
            json=monitor_payload,
            headers={
                "Content-Type": "application/json",
                "x-api-key": CFG["api_key"],
            },
            timeout=30,
        )
    except Exception as e:
        print(f"    [error] monitor unreachable at {monitor_url}: {e}")
        return False

    if r.status_code == 200:
        try:
            body = r.json()
            n_total = body.get("n_readings_for_device", "?")
            day_key = body.get("dayKey", "?")
            print(f"    [ok] {filename} -> day={day_key} device={device_id} "
                  f"(now {n_total} readings)")
            return True
        except Exception:
            print(f"    [ok] HTTP 200 (no JSON body)")
            return True

    print(f"    [error] monitor returned HTTP {r.status_code}: {r.text[:200]}")
    return False


# =============================================================================
# MAIN POLLING LOOP
# =============================================================================
def poll_once(seen, today_only=False, live_monitor_mode=False):
    print(f"[{now_str()}] checking github...")
    files = github_list_files()
    new_files = [f for f in files if f["sha"] not in seen]

    # Filter to today's files only (if enabled)
    if today_only:
        before = len(new_files)
        new_files = [f for f in new_files if is_from_today(f["name"])]
        skipped = before - len(new_files)
        if skipped > 0:
            # Mark the old files as "seen" so we don't keep checking them
            for f in files:
                if not is_from_today(f["name"]):
                    seen.add(f["sha"])
            save_state(seen)
            print(f"  found {len(files)} JSON files "
                  f"({len(new_files)} new today, {skipped} older skipped)")
        else:
            print(f"  found {len(files)} JSON files ({len(new_files)} new today)")
    else:
        print(f"  found {len(files)} JSON files ({len(new_files)} new)")

    for f in new_files:
        name = f["name"]
        sha = f["sha"]
        print(f"  processing {name}")
        data = fetch_json(f["download_url"])
        if data is None:
            continue

        if live_monitor_mode:
            # Append a sensor reading to the day's live-monitor project
            ok = post_to_monitor(data, name)
        else:
            # Create a new project per file (original behavior)
            source_label = f"GitHub: {name}"
            ok = post_to_website(data, source_label)

        if ok:
            seen.add(sha)
            save_state(seen)


def main():
    print("=" * 70)
    print("LARGER-Africa GitHub → Website ingestion service")
    print("=" * 70)
    print(f"  Repo:        {CFG['github_repo']}")
    print(f"  Branch:      {CFG['github_branch']}")
    print(f"  Folder:      {CFG['github_folder']}/")
    print(f"  Website:     {CFG['website_url']}")
    print(f"  User ID:     {CFG['user_id']}")
    print(f"  API key:     {'set' if CFG['api_key'] else 'MISSING'}")
    print(f"  Poll every:  {CFG['poll_interval_seconds']}s")
    print(f"  Secrets:     {SECRETS_FILE}")
    print(f"  State file:  {STATE_FILE}")

    # ------------------------------------------------------------------------
    # Behavior options (set in secrets.json — both default to False):
    #
    # "skip_existing_on_first_run" (default false)
    #   - First run only: mark every file currently in the repo as "already
    #     seen", so only files added FROM NOW ON get ingested. Prevents the
    #     "spam dashboard with all historical readings" problem when starting
    #     on a new machine or after deleting ingested_files.json.
    #
    # "today_only" (default false)
    #   - Every poll, ignore any file whose filename's date is not today's
    #     date. Useful if you only ever care about the current day's sensor
    #     readings. Older files get marked seen so they don't waste a check
    #     on each poll.
    # ------------------------------------------------------------------------
    skip_existing      = bool(CFG.get('skip_existing_on_first_run', False))
    today_only         = bool(CFG.get('today_only', False))
    live_monitor_mode  = bool(CFG.get('live_monitor_mode', False))
    print(f"  Mode flags:  skip_existing_on_first_run={skip_existing}, "
          f"today_only={today_only}, live_monitor_mode={live_monitor_mode}")
    if live_monitor_mode:
        print(f"  Monitor URL: {CFG.get('monitor_url') or '(derived from website_url)'}")
    print()

    seen = load_state()

    # First-run backfill skip: if state file is empty AND user opted in,
    # mark all current files as already seen so we only pick up new ones.
    if skip_existing and len(seen) == 0:
        print("First run detected (no state file) and skip_existing_on_first_run=true.")
        print("Marking all current files in the repo as already-seen...")
        current_files = github_list_files()
        for f in current_files:
            seen.add(f["sha"])
        save_state(seen)
        print(f"  Marked {len(seen)} existing file(s) as seen. "
              f"Only new files from now on will be ingested.\n")

    print(f"Loaded state: {len(seen)} already-ingested file(s)\n")

    while True:
        try:
            poll_once(seen, today_only=today_only,
                      live_monitor_mode=live_monitor_mode)
        except Exception as e:
            print(f"  [poll error] {e}")
        print()
        time.sleep(CFG["poll_interval_seconds"])


if __name__ == "__main__":
    main()
