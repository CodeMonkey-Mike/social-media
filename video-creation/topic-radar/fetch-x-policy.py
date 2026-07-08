#!/usr/bin/env python3
"""
fetch-x-policy.py — Scrape recent posts from the X policy-reporter watchlist
(x-accounts.json) into x-policy.json, which build-dashboard.js renders in the
Policy Radar tab.

Separate from build-dashboard.js on purpose: this drives the shared
xbot-profile Chrome (same as x-reply-guy), so it needs Chrome to be free and
must NEVER run while a posting script is running. The dashboard build itself
stays browser-free and just renders whatever this script last cached.

Usage:
    python fetch-x-policy.py [--days 5]
"""

import io
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("ERROR: playwright not installed.  Run: pip install playwright")
    sys.exit(1)

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
MAX_SCROLLS    = 8
SCROLL_PAUSE   = 2000  # ms

HERE     = Path(__file__).parent
ACCOUNTS = json.loads((HERE / "x-accounts.json").read_text(encoding="utf-8"))
OUT_FILE = HERE / "x-policy.json"

DAYS = 5
if "--days" in sys.argv:
    DAYS = int(sys.argv[sys.argv.index("--days") + 1])
CUTOFF = datetime.now(timezone.utc) - timedelta(days=DAYS)


def parse_count(text: str) -> int:
    m = re.search(r"([\d.,]+)\s*(thousand|million|[KM]?)", text or "", re.I)
    if not m:
        return 0
    num = float(m.group(1).replace(",", ""))
    suffix = m.group(2).lower()
    if suffix in ("k", "thousand"):
        num *= 1_000
    elif suffix in ("m", "million"):
        num *= 1_000_000
    return int(num)


def scrape_account(page, handle: str) -> list[dict]:
    posts, seen = [], set()
    page.goto(f"https://x.com/{handle}", wait_until="domcontentloaded", timeout=30_000)
    page.wait_for_timeout(3500)

    for _ in range(MAX_SCROLLS):
        articles = page.locator("article[data-testid='tweet']")
        oldest_on_screen = None
        for i in range(articles.count()):
            try:
                art = articles.nth(i)
                # Skip reposts — we want the reporter's own signal.
                sc = art.locator("[data-testid='socialContext']")
                if sc.count() > 0 and "reposted" in sc.inner_text().lower():
                    continue
                text_el = art.locator("[data-testid='tweetText']")
                if text_el.count() == 0:
                    continue
                text = text_el.first.inner_text(timeout=2000).strip()
                time_el = art.locator("time").first
                ts = time_el.get_attribute("datetime") or ""
                if not text or not ts or (text, ts) in seen:
                    continue
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                oldest_on_screen = dt if oldest_on_screen is None else min(oldest_on_screen, dt)
                if dt < CUTOFF:
                    continue  # pinned or old post

                link_el = art.locator("a:has(time)").first
                href = link_el.get_attribute("href") or ""
                likes_el = art.locator("[data-testid='like']")
                likes = parse_count(likes_el.first.get_attribute("aria-label") or "") if likes_el.count() else 0

                seen.add((text, ts))
                posts.append({
                    "text": text,
                    "timestamp": ts,
                    "likes": likes,
                    "url": ("https://x.com" + href) if href.startswith("/") else href,
                })
            except Exception:
                continue

        # Everything visible is already older than the window -> stop early.
        if oldest_on_screen is not None and oldest_on_screen < CUTOFF:
            break
        page.keyboard.press("End")
        page.wait_for_timeout(SCROLL_PAUSE)

    posts.sort(key=lambda p: p["timestamp"], reverse=True)
    return posts


def main():
    results = []
    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            user_data_dir=CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=50,
            args=["--disable-blink-features=AutomationControlled"],
            ignore_default_args=["--enable-automation"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            for acc in ACCOUNTS:
                handle = acc["handle"]
                print(f"--- @{handle} ---")
                try:
                    posts = scrape_account(page, handle)
                    print(f"    {len(posts)} post(s) in last {DAYS} days")
                    results.append({**acc, "posts": posts, "error": None})
                except Exception as e:
                    print(f"    ERROR: {e}")
                    results.append({**acc, "posts": [], "error": str(e)[:200]})
        finally:
            ctx.close()

    OUT_FILE.write_text(json.dumps({
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "days": DAYS,
        "accounts": results,
    }, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nSaved {OUT_FILE}")
    print("Now re-run: node build-dashboard.js to refresh the dashboard.")


if __name__ == "__main__":
    main()
