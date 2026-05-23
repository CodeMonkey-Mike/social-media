#!/usr/bin/env python3
"""
scrape_feed.py — Scrape the Reply Guy list feed and surface top posts.
Outputs a numbered list for Claude to present to the user.

Usage:
    python scrape_feed.py
"""

import io
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

# Force UTF-8 output on Windows so emoji/special chars don't crash
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
except ImportError:
    print("ERROR: playwright not installed.")
    sys.exit(1)

LIST_URL        = "https://x.com/i/lists/2051819466921533779"
HOME_URL        = "https://x.com/home"
CHROME_PROFILE  = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
MAX_SCROLLS     = 12
SCROLL_PAUSE    = 2000
TOP_N           = 20   # top N per source

HERE               = Path(__file__).parent
FEED_FILE           = HERE / "data" / "feed.json"
FOLLOWING_FEED_FILE = HERE / "data" / "following_feed.json"
FORYOU_FEED_FILE    = HERE / "data" / "foryou_feed.json"


def parse_count(text: str) -> int:
    """Convert '1.2K', '43', etc. to int."""
    if not text:
        return 0
    text = text.strip().upper().replace(",", "")
    m = re.search(r"([\d.]+)\s*([KM]?)", text)
    if not m:
        return 0
    num = float(m.group(1))
    suffix = m.group(2)
    if suffix == "K":
        num *= 1000
    elif suffix == "M":
        num *= 1_000_000
    return int(num)


def minutes_ago(iso_ts: str) -> int:
    """Return how many minutes ago an ISO timestamp was."""
    try:
        dt = datetime.fromisoformat(iso_ts.replace("Z", "+00:00"))
        delta = datetime.now(timezone.utc) - dt
        return int(delta.total_seconds() / 60)
    except Exception:
        return 99999


def scrape_following_feed(page) -> list[dict]:
    """Navigate to X home and click the Following tab before scraping."""
    print(f"Navigating to {HOME_URL} ...")
    page.goto(HOME_URL, wait_until="domcontentloaded", timeout=30_000)
    page.wait_for_timeout(3000)
    try:
        following_tab = page.locator('[role="tab"]', has_text="Following").first
        if following_tab.count() == 0:
            following_tab = page.get_by_role("tab", name="Following")
        following_tab.wait_for(state="visible", timeout=8_000)
        following_tab.click()
        page.wait_for_timeout(2000)
        print("  Clicked Following tab")
    except Exception as e:
        print(f"  Could not click Following tab: {e} - scraping whatever is loaded")
    return _collect_scrolled(page)


def scrape_foryou_feed(page) -> list[dict]:
    """Navigate to X home and click the For you tab before scraping."""
    print(f"Navigating to {HOME_URL} ...")
    page.goto(HOME_URL, wait_until="domcontentloaded", timeout=30_000)
    page.wait_for_timeout(3000)
    try:
        foryou_tab = page.locator('[role="tab"]', has_text="For you").first
        if foryou_tab.count() == 0:
            foryou_tab = page.get_by_role("tab", name="For you")
        foryou_tab.wait_for(state="visible", timeout=8_000)
        foryou_tab.click()
        page.wait_for_timeout(2000)
        print("  Clicked For you tab")
    except Exception as e:
        print(f"  Could not click For you tab: {e} - scraping whatever is loaded")
    return _collect_scrolled(page)


def scrape_feed(page, url: str) -> list[dict]:
    print(f"Navigating to {url} ...")
    page.goto(url, wait_until="domcontentloaded", timeout=30_000)
    page.wait_for_timeout(3000)
    return _collect_scrolled(page)


def _collect_scrolled(page) -> list[dict]:

    posts = []
    seen = set()

    def collect():
        articles = page.locator("article[data-testid='tweet']")
        for i in range(articles.count()):
            try:
                art = articles.nth(i)

                # Skip retweets
                social_context = art.locator('[data-testid="socialContext"]')
                if social_context.count() > 0 and "reposted" in social_context.inner_text().lower():
                    continue

                text_el = art.locator("[data-testid='tweetText']")
                if text_el.count() == 0:
                    continue
                text = text_el.inner_text(timeout=2000).strip()
                if not text or text in seen:
                    continue

                # Author
                author_el = art.locator('[data-testid="User-Name"]')
                author = author_el.inner_text(timeout=2000).strip() if author_el.count() > 0 else ""

                # Timestamp
                time_el = art.locator("time")
                ts = time_el.get_attribute("datetime") if time_el.count() > 0 else ""

                # Engagement stats
                def get_stat(testid):
                    el = art.locator(f'[data-testid="{testid}"]')
                    if el.count() == 0:
                        return 0
                    label = el.get_attribute("aria-label") or ""
                    return parse_count(label)

                likes    = get_stat("like")
                replies  = get_stat("reply")
                reposts  = get_stat("retweet")
                engagement = likes + replies * 2 + reposts * 3

                # Post URL
                link_el = art.locator("a[href*='/status/']").first
                url = ""
                if link_el.count() > 0:
                    href = link_el.get_attribute("href") or ""
                    url = f"https://x.com{href}" if href.startswith("/") else href

                seen.add(text)
                posts.append({
                    "text": text,
                    "author": author,
                    "timestamp": ts,
                    "minutes_ago": minutes_ago(ts),
                    "likes": likes,
                    "replies": replies,
                    "reposts": reposts,
                    "engagement": engagement,
                    "url": url,
                })
            except Exception:
                continue

    for s in range(MAX_SCROLLS):
        collect()
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(SCROLL_PAUSE)
        print(f"  scroll {s+1} — {len(posts)} posts collected")

    return posts


def score(post: dict) -> float:
    age_min = max(post["minutes_ago"], 1)
    recency  = 1 / (age_min ** 0.4)   # decay with age
    eng      = post["engagement"] ** 0.5
    return recency * 10 + eng


def top_posts(posts: list[dict], n: int) -> list[dict]:
    posts.sort(key=score, reverse=True)
    seen_authors = set()
    top = []
    for p in posts:
        author_key = p["author"].split("\n")[0].strip().lower()
        if author_key not in seen_authors:
            seen_authors.add(author_key)
            top.append(p)
        if len(top) >= n:
            break
    return top


def print_feed(label: str, posts: list[dict]):
    print("\n" + "=" * 60)
    print(f"TOP {len(posts)} POSTS — {label}")
    print("=" * 60)
    for i, p in enumerate(posts, 1):
        age = p["minutes_ago"]
        age_str = f"{age}m ago" if age < 60 else f"{age//60}h ago"
        author_line = p["author"].split("\n")[0].strip()
        print(f"\n[{i}] {author_line}  •  {age_str}  •  {p['likes']} likes")
        print(f"    {p['text'][:200]}")


def main():
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
            print("\n--- Scraping For You feed ---")
            foryou_posts = scrape_foryou_feed(page)

            print("\n--- Scraping Following feed ---")
            following_posts = scrape_following_feed(page)

            print("\n--- Scraping Reply Guy list ---")
            list_posts = scrape_feed(page, LIST_URL)
        finally:
            ctx.close()

    if not list_posts and not following_posts and not foryou_posts:
        print("No posts collected.")
        sys.exit(1)

    top_foryou    = top_posts(foryou_posts, TOP_N)
    top_following = top_posts(following_posts, TOP_N)
    top_list      = top_posts(list_posts, TOP_N)

    FORYOU_FEED_FILE.write_text(json.dumps(top_foryou, indent=2, ensure_ascii=False), encoding="utf-8")
    FOLLOWING_FEED_FILE.write_text(json.dumps(top_following, indent=2, ensure_ascii=False), encoding="utf-8")
    FEED_FILE.write_text(json.dumps(top_list, indent=2, ensure_ascii=False), encoding="utf-8")

    print_feed("FOR YOU FEED", top_foryou)
    print_feed("FOLLOWING FEED", top_following)
    print_feed("REPLY GUY LIST", top_list)

    print(f"\nSaved: {FORYOU_FEED_FILE}  ({len(top_foryou)} posts)")
    print(f"Saved: {FOLLOWING_FEED_FILE}  ({len(top_following)} posts)")
    print(f"Saved: {FEED_FILE}  ({len(top_list)} posts)")


if __name__ == "__main__":
    main()
