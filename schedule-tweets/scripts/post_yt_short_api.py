# post_yt_short_api.py — CANONICAL Python port of post-yt-short-api.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
# Status: PORTED, BLESS-PENDING — invoke the JS twin for production posts until
# this port is live-blessed with one real post.
#
# Uploads one pending vertical short to YouTube via the Data API v3, bypassing
# the web UI entirely. THE HARD RULE STANDS: YouTube Shorts are posted via the
# API ONLY — there is NO browser fallback; on failure (e.g. invalid_grant =
# expired OAuth token needing Mike's re-auth) mark failed and REPORT, never
# work around. Quota: 1600 units/upload, 10k/day default (~6 uploads).
#
# 1:1 port: same config files (yt-oauth.json / yt-api-token.json /
# yt-channel.json), same stuck-'posting' bail (exit 2), same RSS duplicate
# check (refuses to upload if RSS is unreachable), same snippet/status body
# (title 100 cap, tags 10 cap, categoryId 22, public, not madeForKids), same
# write-back semantics, same related-longform manual-step warning.
# Documented divergences ONLY:
#   - Google REST endpoints called directly via `requests` (token refresh at
#     oauth2.googleapis.com/token; resumable upload at
#     /upload/youtube/v3/videos?uploadType=resumable) instead of the googleapis
#     SDK — no new dependency; identical request semantics, and an
#     invalid_grant refresh error surfaces with the same wording.
#   - Final machine line: POST OK/FAIL platform=yt_shorts.
import http.server
import json
import os
import re
import subprocess
import sys
import threading
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from strip_hashtags import build_caption  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
SHORTS_JSON = HERE.parent / "data" / "shorts.json"
OAUTH_FILE = HERE.parent / "config" / "yt-oauth.json"
TOKEN_FILE = HERE.parent / "config" / "yt-api-token.json"
CHANNEL_FILE = HERE.parent / "config" / "yt-channel.json"
WORKSPACE = HERE.parent
PLATFORM = "yt_shorts"
UPLOAD_SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

TOKEN_URL = "https://oauth2.googleapis.com/token"
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
UPLOAD_URL = ("https://www.googleapis.com/upload/youtube/v3/videos"
              "?uploadType=resumable&part=snippet,status")


def save(data):
    SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False),
                           encoding="utf-8")


def now_iso_z():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def load_oauth_client():
    if not OAUTH_FILE.exists():
        print(f"OAuth credentials not found at {OAUTH_FILE}.", file=sys.stderr)
        print("Download the JSON from Google Cloud Console → Credentials → your "
              "OAuth client.", file=sys.stderr)
        sys.exit(1)
    raw = json.loads(OAUTH_FILE.read_text(encoding="utf-8"))
    creds = raw.get("installed") or raw.get("web") or raw
    client_id, client_secret = creds.get("client_id"), creds.get("client_secret")
    if not client_id or not client_secret:
        print("OAuth JSON missing client_id/client_secret", file=sys.stderr)
        sys.exit(1)
    return client_id, client_secret


def do_initial_auth(client_id, client_secret):
    """One-time consent: open browser, capture code via localhost redirect,
    exchange for a refresh token, write TOKEN_FILE."""
    result = {}
    done = threading.Event()

    class Handler(http.server.BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def do_GET(self):
            u = urllib.parse.urlparse(self.path)
            if u.path != "/oauth2callback":
                self.send_response(404)
                self.end_headers()
                return
            q = urllib.parse.parse_qs(u.query)
            err = (q.get("error") or [None])[0]
            result["code"], result["error"] = (q.get("code") or [None])[0], err
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write((f"<h2>Auth failed: {err}</h2>" if err
                              else "<h2>Authorized ✓</h2>").encode()
                             + b"<p>You can close this tab.</p>")
            done.set()

    server = http.server.HTTPServer(("127.0.0.1", 0), Handler)
    port = server.server_address[1]
    redirect_uri = f"http://127.0.0.1:{port}/oauth2callback"
    threading.Thread(target=server.serve_forever, daemon=True).start()

    auth_url = AUTH_URL + "?" + urllib.parse.urlencode({
        "client_id": client_id, "redirect_uri": redirect_uri,
        "response_type": "code", "access_type": "offline",
        "prompt": "consent",   # forces refresh_token even on re-auth
        "scope": " ".join(UPLOAD_SCOPES),
    })
    print("\nOpen this URL in your browser to authorize (will auto-redirect back):")
    print(f"  {auth_url}\n", flush=True)
    try:
        subprocess.Popen(["cmd", "/c", "start", "", auth_url],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass

    done.wait(timeout=600)
    server.shutdown()
    if result.get("error") or not result.get("code"):
        raise RuntimeError(result.get("error") or "no auth code received")
    resp = requests.post(TOKEN_URL, data={
        "code": result["code"], "client_id": client_id,
        "client_secret": client_secret, "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"}, timeout=30)
    tokens = resp.json()
    if resp.status_code != 200:
        raise RuntimeError(f"token exchange failed: {tokens}")
    if not tokens.get("refresh_token"):
        raise RuntimeError("No refresh_token returned — revoke prior access at "
                           "https://myaccount.google.com/permissions and re-run")
    TOKEN_FILE.write_text(json.dumps(tokens, indent=2), encoding="utf-8")
    print(f"Refresh token saved → {TOKEN_FILE}")
    return tokens


def get_access_token():
    """Refresh-token → access-token. An expired/revoked token surfaces as
    invalid_grant — that is Mike's re-auth signal, never worked around."""
    client_id, client_secret = load_oauth_client()
    if TOKEN_FILE.exists():
        tokens = json.loads(TOKEN_FILE.read_text(encoding="utf-8"))
        print(f"Reusing saved refresh token ({TOKEN_FILE.name})")
    else:
        print("No saved token — running initial OAuth consent.")
        tokens = do_initial_auth(client_id, client_secret)
    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        raise RuntimeError(f"{TOKEN_FILE} has no refresh_token")
    resp = requests.post(TOKEN_URL, data={
        "client_id": client_id, "client_secret": client_secret,
        "refresh_token": refresh_token, "grant_type": "refresh_token"}, timeout=30)
    body = resp.json()
    if resp.status_code != 200 or not body.get("access_token"):
        raise RuntimeError(
            f"token refresh failed: {body.get('error', resp.status_code)} "
            f"({body.get('error_description', '')})".strip())
    return body["access_token"]


def get_channel_id():
    if not CHANNEL_FILE.exists():
        raise RuntimeError(
            f'Missing {CHANNEL_FILE}. Create it with {{"channelId":"UC..."}} — fetch '
            "your channel id from https://www.youtube.com/<handle> page source.")
    cached = json.loads(CHANNEL_FILE.read_text(encoding="utf-8"))
    if not cached.get("channelId"):
        raise RuntimeError(f"{CHANNEL_FILE} missing channelId field")
    return cached["channelId"]


def find_existing_upload(channel_id, target_title):
    """Duplicate check via the channel's public RSS feed (last ~15 entries, no
    auth) — enough to catch a recent re-upload of the same short."""
    rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    resp = requests.get(rss_url, timeout=30,
                        headers={"User-Agent": "social-media-script/1.0"})
    if resp.status_code != 200:
        raise RuntimeError(f"HTTP {resp.status_code} from {rss_url}")
    xml = resp.text

    def norm(s):
        return re.sub(r"\s+", " ", (s or "").strip().lower())

    target = norm(target_title[:100])
    for entry in xml.split("<entry>")[1:]:
        entry = entry.split("</entry>")[0]
        tm = re.search(r"<title>([\s\S]*?)</title>", entry)
        title = (tm.group(1) if tm else "").strip()
        if norm(title) != target:
            continue
        vm = re.search(r"<yt:videoId>([\w-]+)</yt:videoId>", entry)
        pm = re.search(r"<published>([\w\-:.+]+)</published>", entry)
        if not vm:
            continue
        return {"videoId": vm.group(1),
                "url": f"https://www.youtube.com/shorts/{vm.group(1)}",
                "title": title,
                "publishedAt": pm.group(1) if pm else None}
    return None


def upload_video(access_token, video_path, title, description, tags):
    size = Path(video_path).stat().st_size
    print(f"Uploading {Path(video_path).name} ({size / 1024 / 1024:.2f} MB)...",
          flush=True)
    body = {
        "snippet": {
            "title": title[:100],          # YT title limit is 100 chars
            "description": description,
            "tags": tags[:10],             # sane cap; full limit is 500 chars total
            "categoryId": "22",            # People & Blogs
        },
        "status": {"privacyStatus": "public", "madeForKids": False},
    }
    start = requests.post(
        UPLOAD_URL, timeout=60,
        headers={"Authorization": f"Bearer {access_token}",
                 "Content-Type": "application/json; charset=UTF-8",
                 "X-Upload-Content-Type": "video/mp4",
                 "X-Upload-Content-Length": str(size)},
        data=json.dumps(body))
    if start.status_code != 200 or "Location" not in start.headers:
        raise RuntimeError(f"resumable-session start failed: HTTP "
                           f"{start.status_code} {start.text[:300]}")
    session_url = start.headers["Location"]

    sent = 0
    chunk = 8 * 1024 * 1024

    def gen():
        nonlocal sent
        with open(video_path, "rb") as f:
            while True:
                b = f.read(chunk)
                if not b:
                    break
                sent += len(b)
                sys.stdout.write(f"\r  uploaded {sent / 1024 / 1024:.1f} MB")
                sys.stdout.flush()
                yield b

    put = requests.put(session_url, data=gen(), timeout=None,
                       headers={"Content-Length": str(size),
                                "Content-Type": "video/mp4"})
    sys.stdout.write("\n")
    if put.status_code not in (200, 201):
        raise RuntimeError(f"upload failed: HTTP {put.status_code} {put.text[:300]}")
    return put.json()   # { id, snippet: {...}, ... }


def main():
    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))

    # Bail if anything is stuck in 'posting' — those need manual review (the old
    # auto-reset caused duplicate uploads when a prior run succeeded but died
    # before flipping the JSON to 'posted').
    stuck = [s for s in data["shorts"]
             if (s["platforms"].get(PLATFORM) or {}).get("status") == "posting"]
    if stuck:
        print(f"{len(stuck)} short(s) stuck in 'posting' — manual review required:",
              file=sys.stderr)
        for s in stuck:
            print(f"  - {s['id']}: {s['title']}", file=sys.stderr)
        print("Check YouTube to see if any actually published, then update "
              "data/shorts.json before retrying.", file=sys.stderr)
        sys.exit(2)

    short = next((s for s in data["shorts"]
                  if (s["platforms"].get(PLATFORM) or {}).get("status") == "pending"),
                 None)
    if not short:
        print("No pending YT shorts. Exiting.")
        sys.exit(0)

    video_path = str(WORKSPACE / short["video_path"])
    if not Path(video_path).exists():
        print(f"Video not found: {video_path}", file=sys.stderr)
        sys.exit(1)

    caption = build_caption(
        short["platforms"][PLATFORM].get("caption_override") or short.get("caption") or "",
        short.get("tags"), PLATFORM)
    title = (short.get("title") or caption.split("\n")[0] or "Short")[:100]
    tags = short.get("tags") or ["kaspa", "crypto"]
    # Teaser shorts: the Studio "Related video" chip is NOT settable via the Data
    # API v3 — the description link is the API-supported equivalent.
    description = caption
    if short.get("related_longform_url"):
        description += f"\n\nWatch the full video: {short['related_longform_url']}"
    if "#Shorts" not in description:
        description = f"{description}\n\n#Shorts"

    print(f'Short: "{short.get("title")}"')
    print(f"File:  {video_path}")
    print(f"Title: {title}", flush=True)

    # Pre-upload duplicate check against the channel's recent uploads (RSS).
    print("Checking channel RSS feed for existing copy...")
    try:
        channel_id = get_channel_id()
    except Exception as err:
        print(f"channelId lookup failed: {err}", file=sys.stderr)
        sys.exit(1)
    try:
        existing = find_existing_upload(channel_id, title)
    except Exception as err:
        print(f"RSS lookup failed: {err}", file=sys.stderr)
        print("Refusing to upload without a working duplicate check. Fix the "
              "channel RSS access and retry.", file=sys.stderr)
        sys.exit(1)

    try:
        access_token = get_access_token()
    except Exception as err:
        print(f"\nFailed: {err}", file=sys.stderr, flush=True)
        print(f"POST FAIL platform=yt_shorts reason={str(err).splitlines()[0][:120]}",
              flush=True)
        sys.exit(1)

    if existing:
        print(f"Already on YouTube: {existing['url']}")
        print(f'  Matched title: "{existing["title"]}"')
        print(f"  Published:     {existing['publishedAt']}")
        short["platforms"][PLATFORM]["status"] = "posted"
        short["platforms"][PLATFORM]["posted_at"] = existing["publishedAt"]
        short["platforms"][PLATFORM]["url"] = existing["url"]
        save(data)
        print("Marked as posted with real URL. Skipping upload.")
        print(f"POST OK platform=yt_shorts url={existing['url']} "
              "status=already-posted", flush=True)
        sys.exit(0)
    print("  No matching title in recent uploads — proceeding with upload.")

    short["platforms"][PLATFORM]["status"] = "posting"
    save(data)

    try:
        result = upload_video(access_token, video_path, title, description, tags)
        video_url = f"https://www.youtube.com/shorts/{result['id']}"
        print(f"\nPosted ✓  {video_url}")
        short["platforms"][PLATFORM]["status"] = "posted"
        short["platforms"][PLATFORM]["posted_at"] = now_iso_z()
        short["platforms"][PLATFORM]["url"] = video_url
        save(data)
        if short.get("related_longform_url"):
            print("\n⚠ MANUAL STEP REQUIRED (YouTube Studio):")
            print('   Set the "Related video" on this Short to the long-form. '
                  "The API cannot do this.")
            print(f"   Short:     {video_url}")
            print(f"   Long-form: {short['related_longform_url']}")
            print("   YT Studio -> Content -> Shorts -> this Short -> Related video "
                  "-> pick the long-form.")
        print(f"POST OK platform=yt_shorts url={video_url}", flush=True)
    except Exception as err:
        short["platforms"][PLATFORM]["status"] = "failed"
        short["platforms"][PLATFORM]["error"] = str(err)
        save(data)
        print(f"\nFailed: {err}", file=sys.stderr, flush=True)
        print(f"POST FAIL platform=yt_shorts reason={str(err).splitlines()[0][:120]}",
              flush=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
