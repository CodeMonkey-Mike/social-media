#!/usr/bin/env python3
"""_diag_ig_recent_reels.py — READ-ONLY. List the most recent reels on Mike's IG
profile so a 'posting'-stuck shorts.json entry can be resolved by eye.

Posts nothing, uploads nothing, writes nothing to any queue file.

Usage:
    python scripts/_diag_ig_recent_reels.py
"""

import sys
from playwright.sync_api import sync_playwright

PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile"
REELS_URL = "https://www.instagram.com/realcodemonkeymike/reels/"


def main() -> int:
    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            PROFILE,
            headless=False,
            channel="chrome",
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            page.goto(REELS_URL, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(8000)
            hrefs = page.eval_on_selector_all(
                'a[href*="/reel/"]', "els => els.map(e => e.getAttribute('href'))"
            )
            seen, out = set(), []
            for h in hrefs:
                if h and h not in seen:
                    seen.add(h)
                    out.append(h)
            print(f"Recent reels on profile ({len(out)} found, newest first):")
            for h in out[:8]:
                print("  https://www.instagram.com" + h)

            # Captions carry the title text, which is what identifies the stuck entry.
            page.wait_for_timeout(1000)
            alts = page.eval_on_selector_all(
                'a[href*="/reel/"] img', "els => els.map(e => e.getAttribute('alt') || '')"
            )
            print("\nThumbnail alt text (newest first):")
            for a in alts[:8]:
                if a:
                    print("  -", a[:160])
        finally:
            ctx.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
