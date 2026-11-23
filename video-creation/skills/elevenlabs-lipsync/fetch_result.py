#!/usr/bin/env python
"""
fetch_result.py: open History, scope to the most-recent lip-sync card for a given MODEL, poll until it
is done, and download ITS video by direct URL. Verifies it is a video (mp4 `ftyp`), not an image.
Python port of fetch-result.js (2026-11-23).

    python fetch_result.py --out "...\\result.mp4" [--model "Creatify Aurora"] [--minutes 8]

This saves the History card's inline preview. It had NO audio stream in 2026-06 (a muted, video-only
preview); on 2026-11-23 it carried one. For the full export use fetch_download.py. Always
content-verify the download (SKILL.md, the duplicate-render trap).
"""
import argparse
import base64
import time
from pathlib import Path

from _el import FETCH_B64_JS, TOP_CARD_JS, URL, launch, open_history, rnd, run, shot


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="Creatify Aurora")
    ap.add_argument("--minutes", type=float, default=8)
    a = ap.parse_args()
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    with launch() as (_ctx, page):
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(4000)

        # Switch to History sub-tab (exact name).
        open_history(page)
        shot(page, "el-history2.png")

        # Poll the FIRST card for the model: read its % (rendering) or video src (done). If it has no
        # video yet it is still rendering, so we WAIT for IT (never grab a lower / older finished card).
        deadline = time.time() + a.minutes * 60
        src = ""
        while time.time() < deadline:
            info = page.evaluate(TOP_CARD_JS, a.model)
            if not info:
                print(f"  (no {a.model} card yet)")
            elif info["src"] and info["src"].startswith("http"):
                src = info["src"]
                print("  done. video src:", src[:80])
                break
            else:
                print("  rendering...", info["pct"] + "%" if info["pct"] else "")
            page.wait_for_timeout(rnd(8000, 13000))

        if not src:
            print("  no finished video found in time.")
            return

        # Download the video URL using the page session (handles cookies / signed URLs).
        out.write_bytes(base64.b64decode(page.evaluate(FETCH_B64_JS, src)))
        # sniff: mp4 has 'ftyp' near the start
        head = out.read_bytes()[:16]
        print(f"  saved {out} ({out.stat().st_size} bytes); header has ftyp: {'true' if b'ftyp' in head else 'false'}")


if __name__ == "__main__":
    run(main, "fetch-result")
