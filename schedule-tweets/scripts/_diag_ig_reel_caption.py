#!/usr/bin/env python3
"""_diag_ig_reel_caption.py — READ-ONLY. Print the caption of one or more IG reels
so a 'posting'-stuck shorts.json entry can be mapped to the reel it actually became.

Posts nothing, writes nothing to any queue file.

Usage:
    python scripts/_diag_ig_reel_caption.py <reel_code> [<reel_code> ...]
"""

import sys
from playwright.sync_api import sync_playwright

PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile"


def main(codes) -> int:
    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            PROFILE,
            headless=False,
            channel="chrome",
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            for code in codes:
                url = f"https://www.instagram.com/reel/{code}/"
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(6000)
                desc = page.eval_on_selector(
                    'meta[property="og:description"]',
                    "e => e.getAttribute('content')",
                ) if page.query_selector('meta[property="og:description"]') else None
                title = page.title()
                print(f"--- {code} ---")
                print("  title:", (title or "")[:200])
                print("  og:desc:", (desc or "")[:400])
        finally:
            ctx.close()
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1:]))
