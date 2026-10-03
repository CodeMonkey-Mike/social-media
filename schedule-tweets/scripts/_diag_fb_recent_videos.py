#!/usr/bin/env python3
"""_diag_fb_recent_videos.py — READ-ONLY. List recent videos/reels on Mike's FB page
so a 'posting'-stuck shorts.json entry can be resolved by eye.

Posts nothing, uploads nothing, writes nothing to any queue file.

Usage:
    python scripts/_diag_fb_recent_videos.py
"""

import re
import sys
from playwright.sync_api import sync_playwright

PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\fbbot-profile"
VIDEOS_URL = "https://www.facebook.com/profile.php?id=100083165777399&sk=videos"


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
            page.goto(VIDEOS_URL, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(10000)
            hrefs = page.eval_on_selector_all(
                'a[href*="/videos/"], a[href*="/reel/"]',
                "els => els.map(e => e.getAttribute('href'))",
            )
            seen, out = set(), []
            for h in hrefs or []:
                if not h:
                    continue
                m = re.search(r"/(?:videos|reel)/(\d+)", h)
                if m and m.group(1) not in seen:
                    seen.add(m.group(1))
                    out.append(h.split("?")[0])
            print(f"Recent FB video/reel links ({len(out)}):")
            for h in out[:10]:
                print("  ", h if h.startswith("http") else "https://www.facebook.com" + h)
            body = page.inner_text("body")[:4000]
            print("\n--- page text sample (titles) ---")
            for line in body.splitlines():
                s = line.strip()
                if len(s) > 25 and not s.startswith("http"):
                    print("  -", s[:120])
        finally:
            ctx.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
