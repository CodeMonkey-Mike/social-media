#!/usr/bin/env python
"""
fetch_download.py: download the REAL export (WITH AUDIO) from a History render card by clicking its
"Download" button. The History inline <video> is a MUTED, video-only preview (what fetch_result.py
scrapes); the Download button gives the full muxed mp4. Use this when you need the audio.
Python port of fetch-download.js (2026-11-23).

    python fetch_download.py --out "...\\result.mp4" [--model "Sync 3"] [--minutes 6]
"""
import argparse
import sys
import time
from pathlib import Path

from _el import TOP_CARD_JS, URL, launch, open_history, rnd, run, shot, vis


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="Creatify Aurora")
    ap.add_argument("--minutes", type=float, default=6)
    a = ap.parse_args()
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    with launch() as (_ctx, page):
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(4000)
        open_history(page)  # History sub-tab (same as fetch_result.py)

        # poll until the TOPMOST card of the model has finished (has a video), then take its Download
        # button. A card still rendering is waited for, never skipped (the duplicate-render trap).
        pos = None
        deadline = time.time() + a.minutes * 60
        wait = page.wait_for_timeout
        while time.time() < deadline and not pos:
            info = page.evaluate(TOP_CARD_JS, a.model)
            if not info:
                print(f"  (no {a.model} card yet)")
                wait(rnd(7000, 11000))
                continue
            if not info["hasVideo"]:
                print("  top render still cooking...")
                wait(rnd(8000, 12000))
                continue
            page.mouse.move(info["card"]["x"], info["card"]["y"])
            wait(1200)  # hover reveals controls
            info2 = page.evaluate(TOP_CARD_JS, a.model)
            if info2 and info2["dl"]:
                pos = info2["dl"]
                break
            wait(1500)
        if not pos:
            print("no finished Download button for", a.model, "in time", file=sys.stderr)
            shot(page, "el-dl-fail.png")
            sys.exit(2)

        page.mouse.move(pos["x"], pos["y"])
        page.wait_for_timeout(rnd(400, 900))
        try:
            with page.expect_download(timeout=9000) as dl_info:
                page.mouse.click(pos["x"], pos["y"])
            download = dl_info.value
        except Exception:
            # The click opened a menu instead of downloading: pick its download / video entry.
            # (The JS version's selector for this step also listed a `text=/\.mp4|MP4/i` part, which is
            # not valid inside a CSS list, so that whole step never matched anything. Dropped.)
            opt = page.locator(
                '[role="menuitem"]:has-text("Download"), [role="menuitem"]:has-text("Video"), '
                'button:has-text("Download video")').first
            with page.expect_download(timeout=30000) as dl_info:
                if vis(opt):
                    try:
                        opt.click()
                    except Exception:
                        pass
            download = dl_info.value
        download.save_as(str(out))
        print("saved", out)
        page.wait_for_timeout(1500)


if __name__ == "__main__":
    run(main, "fetch-download")
