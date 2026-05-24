#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
auto_reply_scan.py — Fast scan of the Following feed + Reply Guy list for tweets
posted in the last 2 minutes that are safe to auto-reply to (x-reply-auto skill).

Top-of-feed only — NO scrolling. Both the Following tab and the Reply Guy list are
reverse-chronological, so the freshest tweets are at the very top; a tweet under 2
minutes old, if one exists, will be in the first few articles.

Guardrails applied here (so blocked tweets never reach the drafting step):
  - Skip retweets / pinned
  - Skip replies (tweets that are themselves replies — best-effort DOM check)
  - Skip scam / ragebait (BLOCKLIST substring match)
  - Skip tweets Mike already replied to (posted_replies.json)
  - Age filter: <= MAX_AGE_SECONDS

Writes qualifying candidates, freshest-first, to data/auto_reply_candidates.json.
Always exits 0. An empty array means nothing fresh — the skill no-ops.

Usage:  python auto_reply_scan.py
Chrome (xbot-profile) must be fully closed before running.
"""

import io, json, re, sys
from datetime import datetime, timezone
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("ERROR: playwright not installed.")
    sys.exit(1)

LIST_URL        = "https://x.com/i/lists/2051819466921533779"
HOME_URL        = "https://x.com/home"
CHROME_PROFILE  = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
MAX_AGE_SECONDS = 3600  # look back up to 1 hour; Claude picks the best reply-worthy tweet from the pool
TOP_N           = 25   # top-of-feed articles to inspect per source (no scroll; covers ~1h at current list activity)

HERE            = Path(__file__).parent
POSTED_FILE     = HERE / "data" / "posted_replies.json"
CANDIDATES_FILE = HERE / "data" / "auto_reply_candidates.json"

# Scam / ragebait blocklist — case-insensitive substring match. Edit freely.
BLOCKLIST = [
    "airdrop", "giveaway", "give away", "free mint", "presale", "pre-sale",
    "send eth", "send sol", "send 0.", "send me", "drop your wallet", "drop wallet",
    "claim now", "claim your", "first 100", "first 1000", "like + rt", "like and rt",
    "rt + comment", "comment '", 'comment "', "tag 3", "tag three", "dm me", "dm for",
    "1000x guaranteed", "guaranteed 100x", "next 100x gem", "claim 👇",
    "link in bio", "join my", "join our", "telegram link", "whitelist spot",
]


def seconds_ago(iso_ts: str) -> float:
    try:
        dt = datetime.fromisoformat(iso_ts.replace("Z", "+00:00"))
        return (datetime.now(timezone.utc) - dt).total_seconds()
    except Exception:
        return 9e9


def load_posted_urls() -> set:
    if not POSTED_FILE.exists():
        return set()
    try:
        data = json.loads(POSTED_FILE.read_text(encoding="utf-8"))
        return {r.get("tweet_url") for r in data if r.get("tweet_url")}
    except Exception:
        return set()


def is_blocked(text: str) -> bool:
    low = text.lower()
    return any(k in low for k in BLOCKLIST)


def wait_for_feed(page, min_articles: int = 8, settle_ms: int = 8000):
    """Wait for the timeline to actually render before collecting.

    X is an SPA — articles render after navigation with a delay. Collecting too
    early sees only the first 1-3 articles and would miss genuinely-fresh tweets.
    Wait for the first article, then poll until the feed has populated (or settle).
    """
    try:
        page.wait_for_selector("article[data-testid='tweet']", timeout=15000)
    except Exception:
        return
    waited = 0
    while waited < settle_ms:
        if page.locator("article[data-testid='tweet']").count() >= min_articles:
            break
        page.wait_for_timeout(700)
        waited += 700


def collect_top(page, source_label: str, top_n: int) -> list:
    """Collect the top-of-feed tweets without scrolling."""
    out, seen = [], set()
    articles = page.locator("article[data-testid='tweet']")
    count = min(articles.count(), top_n)
    for i in range(count):
        try:
            art = articles.nth(i)

            # Skip retweets / pinned
            sc = art.locator('[data-testid="socialContext"]')
            if sc.count() > 0:
                sctxt = sc.inner_text().lower()
                if "reposted" in sctxt or "pinned" in sctxt:
                    continue

            # Skip replies (best-effort): a reply shows a "Replying to ..." context line
            if art.locator('text=/^Replying to/').count() > 0:
                continue

            text_el = art.locator("[data-testid='tweetText']")
            if text_el.count() == 0:
                continue
            text = text_el.inner_text(timeout=2000).strip()
            if not text or text in seen:
                continue

            time_el = art.locator("time")
            ts = time_el.get_attribute("datetime") if time_el.count() > 0 else ""
            if not ts:
                continue

            author_el = art.locator('[data-testid="User-Name"]')
            author = (author_el.inner_text(timeout=2000).split("\n")[0].strip()
                      if author_el.count() > 0 else "")

            link_el = art.locator("a[href*='/status/']").first
            url = ""
            if link_el.count() > 0:
                href = link_el.get_attribute("href") or ""
                url = f"https://x.com{href}" if href.startswith("/") else href
            url = re.sub(r"[?#].*$", "", url)

            seen.add(text)
            out.append({
                "author": author,
                "tweet_url": url,
                "tweet_text": text,
                "source": source_label,
                "age_seconds": round(seconds_ago(ts)),
                "timestamp": ts,
            })
        except Exception:
            continue
    return out


def main():
    posted_urls = load_posted_urls()
    scanned = []

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            user_data_dir=CHROME_PROFILE, channel="chrome", headless=False, slow_mo=50,
            args=["--disable-blink-features=AutomationControlled"],
            ignore_default_args=["--enable-automation"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            # Following feed (reverse-chron)
            print("Loading Following feed...")
            page.goto(HOME_URL, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)
            if page.locator('input[name="text"], input[name="password"]').count() > 0:
                print("ERROR: not logged in to X on xbot-profile. Aborting.")
                CANDIDATES_FILE.write_text("[]", encoding="utf-8")
                ctx.close()
                return
            try:
                tab = page.get_by_role("tab", name="Following")
                tab.wait_for(state="visible", timeout=8000)
                tab.click()
                page.wait_for_timeout(2500)
            except Exception as e:
                print(f"  Could not click Following tab: {e} (scraping whatever loaded)")
            # Confirm which timeline tab is active — 'Following' (recent) vs 'For you' (algorithmic)
            try:
                active = page.evaluate(
                    "() => { const t = document.querySelector('[role=\"tab\"][aria-selected=\"true\"]');"
                    " return t ? t.innerText.replace(/\\s+/g,' ').trim() : '(none)'; }")
                print(f"  Active timeline tab: {active}")
            except Exception:
                pass
            wait_for_feed(page)
            scanned += collect_top(page, "Following feed", TOP_N)

            # Reply Guy list (reverse-chron)
            print("Loading Reply Guy list...")
            page.goto(LIST_URL, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)
            wait_for_feed(page)
            scanned += collect_top(page, "Reply Guy list", TOP_N)
        finally:
            ctx.close()

    # Diagnostic: show every scanned tweet with its age (freshest first) so we can
    # confirm the feeds are recent-sorted and see what the newest tweet actually is.
    print("\n--- All scanned tweets (freshest first) ---")
    for c in sorted(scanned, key=lambda x: x["age_seconds"]):
        m, s = divmod(int(c["age_seconds"]), 60)
        age_str = f"{m}m{s:02d}s" if m else f"{s}s"
        print(f"  [{age_str:>8}] {c['source']:<16} {c['author'][:22]:<22} {c['tweet_text'][:55]}")

    # Filter: age, already-replied, blocklist
    qualifying = []
    for c in scanned:
        if c["age_seconds"] > MAX_AGE_SECONDS:
            continue
        if c["tweet_url"] and c["tweet_url"] in posted_urls:
            continue
        if is_blocked(c["tweet_text"]):
            continue
        qualifying.append(c)

    # Dedup by url, sort freshest-first
    by_url = {}
    for c in qualifying:
        if c["tweet_url"] and c["tweet_url"] not in by_url:
            by_url[c["tweet_url"]] = c
    qualifying = sorted(by_url.values(), key=lambda c: c["age_seconds"])

    CANDIDATES_FILE.write_text(
        json.dumps(qualifying, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nScanned {len(scanned)} top-of-feed tweets across both sources.")
    print(f"{len(qualifying)} qualifying (<= {MAX_AGE_SECONDS}s, not blocked, not already-replied).")
    if qualifying:
        top = qualifying[0]
        print(f"Freshest: [{top['age_seconds']}s] {top['author']} ({top['source']})")
        print(f"  {top['tweet_text'][:100]}")
    else:
        print("No fresh reply-able tweets. The skill will no-op.")
    print(f"Wrote {CANDIDATES_FILE}")


if __name__ == "__main__":
    main()
