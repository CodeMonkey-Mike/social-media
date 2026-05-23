#!/usr/bin/env python3
"""
scan_profile.py — Scrape @mikeneder's posts and replies from X.
Saves raw_tweets.json for style analysis. Close Chrome before running.

Usage:
    python scan_profile.py
"""

import json
import subprocess
import sys
import time
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
except ImportError:
    print("ERROR: playwright not installed.  Run: pip install playwright")
    sys.exit(1)

PROFILE_URL    = "https://x.com/mikeneder"
CDP_URL        = "http://localhost:9222"
CHROME_EXE     = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
MAX_SCROLLS    = 25
SCROLL_PAUSE   = 2500   # ms

HERE     = Path(__file__).parent
RAW_FILE = HERE / "data" / "raw_tweets.json"


def scrape_posts(page) -> list[dict]:
    posts = []
    seen  = set()

    def collect_visible():
        articles = page.locator("article[data-testid='tweet']")
        for i in range(articles.count()):
            try:
                art     = articles.nth(i)
                text_el = art.locator("[data-testid='tweetText']")
                if text_el.count() == 0:
                    continue
                text = text_el.inner_text(timeout=2000).strip()
                if not text or text in seen:
                    continue

                stats = {}
                for stat in ("reply", "retweet", "like"):
                    el = art.locator(f"[data-testid='{stat}']")
                    if el.count() > 0:
                        stats[stat] = el.get_attribute("aria-label") or ""

                time_el   = art.locator("time")
                timestamp = time_el.get_attribute("datetime") if time_el.count() > 0 else ""

                seen.add(text)
                posts.append({"text": text, "timestamp": timestamp, "stats": stats})
            except Exception:
                continue

    # Tweets tab
    print(f"Navigating to {PROFILE_URL} ...")
    page.goto(PROFILE_URL, wait_until="domcontentloaded", timeout=30_000)
    page.wait_for_timeout(3000)

    print("Collecting Tweets tab...")
    for s in range(MAX_SCROLLS // 2):
        collect_visible()
        page.keyboard.press("End")
        page.wait_for_timeout(SCROLL_PAUSE)
        print(f"  scroll {s+1}  •  {len(posts)} collected")

    # Replies tab
    print("\nSwitching to Replies tab...")
    try:
        tab = page.get_by_role("tab", name="Replies")
        if tab.count() == 0:
            tab = page.locator("text=Replies").first
        tab.wait_for(state="visible", timeout=8_000)
        tab.click()
        page.wait_for_timeout(2500)
    except PWTimeout:
        print("  Could not find Replies tab — skipping")

    print("Collecting Replies tab...")
    for s in range(MAX_SCROLLS):
        collect_visible()
        page.keyboard.press("End")
        page.wait_for_timeout(SCROLL_PAUSE)
        print(f"  scroll {s+1}  •  {len(posts)} collected")

    return posts


def ensure_logged_in(page):
    """Go to X home. If not logged in, wait up to 10 min for the user to log in."""
    page.goto("https://x.com/home", wait_until="domcontentloaded", timeout=30_000)
    page.wait_for_timeout(3000)

    if "login" not in page.url and page.locator("text=Sign in").count() == 0:
        print("  Already logged in.")
        return

    print("\n  Not logged in — please log in to @mikeneder in the Chrome window.")
    print("  This only needs to happen once. Session will be saved automatically.")
    print("  Waiting up to 10 minutes...")
    for i in range(120):
        page.wait_for_timeout(5000)
        if "login" not in page.url and page.locator("text=Sign in").count() == 0:
            print("  Logged in — session saved in Chrome profile. Won't ask again.")
            break
        if i % 6 == 5:
            print(f"  Still waiting... ({(i+1)*5}s elapsed)")
    else:
        print("  Timed out waiting for login. Exiting.")
        sys.exit(1)


def main():
    print("=" * 55)
    print("@mikeneder profile scanner")
    print("Launching Chrome with automation profile...")

    subprocess.Popen([
        CHROME_EXE,
        f"--remote-debugging-port=9222",
        "--remote-allow-origins=*",
        f"--user-data-dir={CHROME_PROFILE}",
        "--no-first-run",
        "--no-default-browser-check",
    ])
    print("Waiting for Chrome to start...")
    time.sleep(4)

    with sync_playwright() as pw:
        try:
            browser = pw.chromium.connect_over_cdp(CDP_URL)
        except Exception as e:
            print(f"\nERROR: Could not connect to Chrome on port 9222: {e}")
            sys.exit(1)

        ctx = browser.new_context() if not browser.contexts else browser.contexts[0]
        page = ctx.new_page()
        try:
            ensure_logged_in(page)
            posts = scrape_posts(page)
        finally:
            page.close()
            browser.close()

    print(f"\nCollected {len(posts)} posts.")

    if not posts:
        print("Nothing collected — make sure you are logged in as @mikeneder.")
        sys.exit(1)

    RAW_FILE.write_text(json.dumps(posts, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved to {RAW_FILE}")
    print("\nDone. Share raw_tweets.json with Claude to build the persona profile.")


if __name__ == "__main__":
    main()
