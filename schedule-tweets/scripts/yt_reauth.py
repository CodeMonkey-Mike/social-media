# yt_reauth.py — Re-authorize + validate the YouTube Data API OAuth token.
# (Python port of yt-reauth.js, 2026-11-22; the JS file is deleted.)
#
# Why this exists: the OAuth token (config/yt-api-token.json) can expire or be
# revoked -> `post_yt_short_api.py` fails with `invalid_grant`. There is NO
# browser fallback for YT shorts (root CLAUDE.md), so the ONLY fix is re-auth.
# This helper does JUST the consent + validation — it never uploads anything.
#
# Flow:
#   1. Back up any existing token to config/yt-api-token.json.<ts>.bak
#   2. Open the Google consent URL (auto-opens in the browser), wait for the
#      localhost redirect, exchange the code for a refresh token, save it.
#   3. Validate: mint a fresh access token from the refresh token (a refresh
#      call — the exact thing that was failing). Success = auth is good.
#   4. Confirm the read scope landed (the call the duplicate check makes).
#
# Usage:  python scripts/yt_reauth.py
# (Complete the Google login/consent in the browser tab that opens.)
#
# The consent + token-exchange code is the poster's own (`do_initial_auth` in
# post_yt_short_api.py), so the two can never drift. One difference from the JS:
# the wait for the browser redirect gives up after 10 minutes instead of never.
import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).resolve().parent))
from post_yt_short_api import (  # noqa: E402
    CHANNEL_FILE, TOKEN_FILE, TOKEN_URL, do_initial_auth, load_oauth_client,
)

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def backup_existing_token():
    if not TOKEN_FILE.exists():
        return None
    stamp = (datetime.now(timezone.utc).isoformat(timespec="milliseconds")
             .replace("+00:00", "Z").replace(":", "-").replace(".", "-"))
    bak = TOKEN_FILE.with_name(f"{TOKEN_FILE.name}.{stamp}.bak")
    shutil.copyfile(TOKEN_FILE, bak)
    return bak


def validate(client_id, client_secret):
    tokens = json.loads(TOKEN_FILE.read_text(encoding="utf-8"))
    # Force a refresh — this is exactly what was throwing invalid_grant.
    resp = requests.post(TOKEN_URL, data={
        "client_id": client_id, "client_secret": client_secret,
        "refresh_token": tokens.get("refresh_token"),
        "grant_type": "refresh_token"}, timeout=30)
    body = resp.json()
    access_token = body.get("access_token")
    if resp.status_code != 200 or not access_token:
        raise RuntimeError(
            f"token refresh failed: {body.get('error', resp.status_code)} "
            f"({body.get('error_description', '')})".strip())
    print("Validation ✓ — refresh token mints an access token (no invalid_grant).")
    # Confirm the read scope actually landed: this is the exact call the duplicate check makes.
    try:
        channel_id = json.loads(CHANNEL_FILE.read_text(encoding="utf-8"))["channelId"]
        res = requests.get(
            "https://www.googleapis.com/youtube/v3/playlistItems",
            params={"part": "snippet", "playlistId": "UU" + channel_id[2:], "maxResults": 1},
            headers={"Authorization": f"Bearer {access_token}"}, timeout=30)
        if res.status_code != 200:
            raise RuntimeError(f"HTTP {res.status_code} from playlistItems.list: {res.text[:160]}")
        items = res.json().get("items") or []
        title = ((items[0].get("snippet") or {}).get("title")) if items else None
        print(f'Read scope ✓ — authenticated duplicate check enabled (latest upload: "{title}").')
    except Exception as err:
        print(f"Read scope ✗ — {err}. The poster will keep using the public "
              "RSS/channel-page fallbacks.")


def main():
    client_id, client_secret = load_oauth_client()
    bak = backup_existing_token()
    if bak:
        print(f"Backed up old token → {bak.name}")
    print("Starting YouTube OAuth re-consent (this will NOT upload anything)...", flush=True)
    do_initial_auth(client_id, client_secret)
    validate(client_id, client_secret)
    print("\nDone. YouTube API auth is valid. Next post_yt_short_api.py run will work.")


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print(f"\nRe-auth FAILED: {err}", file=sys.stderr)
        sys.exit(1)
