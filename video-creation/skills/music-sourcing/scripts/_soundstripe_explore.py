#!/usr/bin/env python
"""
_soundstripe_explore.py: RECON, for when Soundstripe changes its site and a selector or endpoint in
soundstripe.py stops working. Opens Soundstripe in the dedicated soundstripe-profile Chrome and
passively captures the network (JSON API responses with their request bodies, audio / stream URLs,
and download events) while YOU drive: log in if needed, run a search, preview a track, hit download.
Everything is dumped to video-creation/cache/music-sourcing/recon/ so the real tool can be rebuilt
around the actual endpoints instead of guessed DOM selectors.
Python port of _soundstripe-explore.js (2026-11-23).

    python video-creation/skills/music-sourcing/scripts/_soundstripe_explore.py

Then in the Chrome window: log in -> search "serene ambient" -> play a track -> click Download on one
track. Close the window when done (it also ends by itself after 20 minutes).
"""
import json
import re
import time
from urllib.parse import urlparse

from soundstripe import cache_dir, launch

RECON_DIR = cache_dir("music-sourcing", "recon")
NET_DIR = cache_dir("music-sourcing", "recon", "net")
DL_DIR = cache_dir("music-sourcing", "recon", "downloads")
MAX_MS = 20 * 60 * 1000  # auto-close after 20 min

INDEX = RECON_DIR / "network-index.jsonl"
AUDIO = RECON_DIR / "audio-urls.txt"
DLS = RECON_DIR / "downloads.jsonl"
AUDIO_RE = re.compile(r"\.(mp3|m4a|wav|aac)(\?|$)", re.IGNORECASE)
count = {"n": 0}


def sanitize(u):
    return re.sub(r"[^a-zA-Z0-9]+", "_", re.sub(r"^https?://", "", u))[:120]


def append(path, line):
    with open(path, "a", encoding="utf-8", newline="\n") as f:
        f.write(line + "\n")


def wire_page(page):
    def on_response(resp):
        try:
            url = resp.url
            ctype = (resp.headers.get("content-type") or "").lower()
            is_ss = "soundstripe" in urlparse(url).netloc.lower()

            # audio / stream URLs (preview + full)
            if "audio/" in ctype or AUDIO_RE.search(url):
                append(AUDIO, f"{resp.status} {ctype} {url}")

            # JSON API responses from soundstripe domains
            if is_ss and "json" in ctype:
                try:
                    body = resp.text()
                except Exception:
                    return
                count["n"] += 1
                file = NET_DIR / f"{count['n']:03d}_{sanitize(url)}.json"
                file.write_text(body[:300 * 1024], encoding="utf-8", newline="\n")  # cap 300KB
                req = resp.request
                try:
                    post_data = req.post_data
                except Exception:
                    post_data = None
                append(INDEX, json.dumps({
                    "n": count["n"], "status": resp.status, "method": req.method,
                    "url": url, "ctype": ctype, "bytes": len(body), "file": file.name,
                    "postData": str(post_data)[:2000] if post_data else None,
                }, ensure_ascii=False, separators=(",", ":")))
                print(f"  [json] {req.method} {resp.status} {url[:110]}", flush=True)
        except Exception:
            pass  # ignore per-response errors

    def on_download(dl):
        try:
            sf = dl.suggested_filename
            out = DL_DIR / (sf or f"download_{int(time.time() * 1000)}")
            append(DLS, json.dumps({"url": dl.url, "suggestedFilename": sf, "savedTo": str(out)},
                                   ensure_ascii=False, separators=(",", ":")))
            print(f"  [DOWNLOAD] {sf}  <-  {dl.url[:110]}", flush=True)
            dl.save_as(str(out))
        except Exception:
            pass

    page.on("response", on_response)
    page.on("download", on_download)


def main():
    print("Launching Chrome (soundstripe-profile)...")
    with launch(slow_mo=30) as (ctx, page):
        ctx.on("page", wire_page)
        for p in ctx.pages:
            wire_page(p)
        try:
            page.goto("https://www.soundstripe.com/", wait_until="domcontentloaded")
        except Exception:
            pass

        print("\n==================================================================")
        print(" RECON MODE: drive the browser yourself:")
        print("   1) Log in (first time only; the profile remembers you after).")
        print('   2) Search e.g. "serene ambient" / "calm meditation".')
        print("   3) Play a preview, open a track page.")
        print("   4) Click DOWNLOAD on ONE track so we capture the download flow.")
        print(" Capturing network -> video-creation/cache/music-sourcing/recon/  (close window when done)")
        print("==================================================================\n", flush=True)

        try:
            ctx.wait_for_event("close", timeout=MAX_MS)  # until the window is closed, or 20 min
        except Exception:
            pass
        print(f"\nDone. Captured {count['n']} JSON responses. See video-creation/cache/music-sourcing/recon/.")


if __name__ == "__main__":
    main()
