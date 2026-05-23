#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
post_replies.py — Post pre-approved replies to X tweets.

Reads replies_to_post.json, posts each one with human-like typing,
then archives to posted_replies.json and clears the queue.

Usage:
    python post_replies.py              # post everything in queue
    python post_replies.py --dry-run    # preview without posting
"""

import json
import random
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import time
from datetime import datetime
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
except ImportError:
    print("ERROR: playwright not installed.")
    sys.exit(1)

CHROME_PROFILE  = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
CHAR_DELAY_MIN  = 60    # ms per keystroke
CHAR_DELAY_MAX  = 150
ACTION_MIN      = 4     # seconds between UI actions
ACTION_MAX      = 7
POST_DELAY_MIN  = 2     # minutes between replies
POST_DELAY_MAX  = 6

HERE               = Path(__file__).parent
REPLIES_FILE       = HERE / "data" / "replies_to_post.json"
POSTED_FILE        = HERE / "data" / "posted_replies.json"
OPPORTUNITIES_FILE = HERE / "data" / "reply_opportunities.json"


def human_pause(label=""):
    delay = random.randint(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {delay}s pause {f'({label})' if label else ''}")
    time.sleep(delay)


def mouse_click(page, locator):
    """Click using mouse coordinates to hit the visible button."""
    bbox = locator.bounding_box()
    if bbox and bbox["width"] > 0:
        page.mouse.click(
            bbox["x"] + bbox["width"] / 2,
            bbox["y"] + bbox["height"] / 2,
        )
    else:
        locator.click()


def type_humanly(page, text: str):
    """Type with randomised per-character delay to mimic human typing."""
    for char in text:
        page.keyboard.type(char)
        page.wait_for_timeout(random.randint(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def already_replied(page, tweet_url: str, reply_text: str) -> bool:
    """
    Navigate to the tweet and check if our reply text is already visible.
    Uses the first 40 chars of reply text as a fingerprint.
    """
    try:
        page.goto(tweet_url, wait_until="domcontentloaded", timeout=30_000)
        page.wait_for_timeout(2000)
        snippet = reply_text[:40].lower()
        return snippet in page.content().lower()
    except Exception:
        return False


def post_reply(page, tweet_url: str, reply_text: str, author: str) -> str:
    """
    Navigate to tweet, open reply composer, type and post reply.
    Returns: "posted" | "error"
    """
    try:
        print(f"  Loading tweet...")
        page.goto(tweet_url, wait_until="domcontentloaded", timeout=30_000)
        page.wait_for_timeout(2500)

        # ── Click Reply button ──────────────────────────────────────────────
        reply_btn = page.locator('[data-testid="reply"]').first
        try:
            reply_btn.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            print("  Reply button not found")
            return "error"

        human_pause("before Reply")
        mouse_click(page, reply_btn)
        page.wait_for_timeout(1500)

        # ── Find reply textarea ─────────────────────────────────────────────
        # X renders two tweetTextarea_0 elements; target the visible one
        textarea = page.locator('[data-testid="tweetTextarea_0"]').first
        try:
            textarea.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            print("  Reply textarea not found")
            return "error"

        human_pause("before typing")
        textarea.click()
        page.wait_for_timeout(500)

        # ── Type with human-like keystroke delays ───────────────────────────
        print(f"  Typing {len(reply_text)} chars at {CHAR_DELAY_MIN}-{CHAR_DELAY_MAX}ms/char...")
        type_humanly(page, reply_text)
        page.wait_for_timeout(1000)

        human_pause("before Post")

        # Click Post via JavaScript — bypasses overlay/focus issues entirely
        posted_via_js = page.evaluate("""
            () => {
                const testids = ['tweetButtonInline', 'tweetButton'];
                for (const tid of testids) {
                    const btns = Array.from(document.querySelectorAll('[data-testid="' + tid + '"]'));
                    const visible = btns.find(b =>
                        b.offsetParent !== null &&
                        b.getBoundingClientRect().width > 0 &&
                        !b.disabled
                    );
                    if (visible) { visible.click(); return tid; }
                }
                return null;
            }
        """)
        if posted_via_js:
            print(f"  Clicked Post button via JS ({posted_via_js})")
        else:
            print("  No visible Post button found via JS")
            return "error"
        page.wait_for_timeout(4000)

        # ── Verify by navigating to the tweet and checking for our reply ───────
        snippet = reply_text[:40].lower()
        print("  Verifying reply on tweet page...")
        try:
            page.goto(tweet_url, wait_until="domcontentloaded", timeout=20_000)
            page.wait_for_timeout(3000)
            if snippet in page.content().lower():
                print("  CONFIRMED: reply visible on tweet page")
                return "posted"
            else:
                print("  Reply NOT found on tweet page")
                return "error"
        except Exception as e:
            print(f"  Could not verify: {e}")
            return "error"

    except PWTimeout:
        print("  Operation timed out")
        return "error"
    except Exception as e:
        print(f"  Error: {e}")
        return "error"


def main():
    dry_run = "--dry-run" in sys.argv

    if not REPLIES_FILE.exists():
        print(f"No queue file found at {REPLIES_FILE}")
        sys.exit(1)

    replies = json.loads(REPLIES_FILE.read_text(encoding="utf-8"))
    if not replies:
        print("Queue is empty — nothing to post.")
        return

    print("=" * 55)
    print(f"{'DRY RUN — ' if dry_run else ''}Posting {len(replies)} repl{'y' if len(replies)==1 else 'ies'}")
    print(f"Keystroke delay: {CHAR_DELAY_MIN}–{CHAR_DELAY_MAX}ms/char")
    print(f"Delay between posts: {POST_DELAY_MIN}–{POST_DELAY_MAX} min")
    print("=" * 55)

    for i, r in enumerate(replies):
        print(f"\n[{i+1}/{len(replies)}] -> {r.get('author', '?')}")
        print(f"  {r['reply_text'][:120]}")
        if dry_run:
            print("  [DRY RUN]")
    if dry_run:
        return

    # Start jitter
    jitter = random.randint(10, 45)
    print(f"\nStarting in {jitter}s...")
    time.sleep(jitter)

    posted_log = []
    if POSTED_FILE.exists():
        posted_log = json.loads(POSTED_FILE.read_text(encoding="utf-8"))

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

        for i, r in enumerate(replies):
            author     = r.get("author", "?")
            tweet_url  = r["tweet_url"]
            reply_text = r["reply_text"]

            print(f"\n--- [{i+1}/{len(replies)}] {author} ---")

            # Check if already replied before attempting
            if already_replied(page, tweet_url, reply_text):
                print("  Already replied to this tweet — skipping")
                r["result"] = "already_posted"
                posted_log.append(r)
                POSTED_FILE.write_text(
                    json.dumps(posted_log, indent=2, ensure_ascii=False), encoding="utf-8"
                )
                continue

            result = post_reply(page, tweet_url, reply_text, author)

            if result == "posted":
                print(f"  POSTED")
                r["posted_at"] = datetime.now().isoformat()
                r["result"] = "posted"
            else:
                print(f"  FAILED — left in queue for manual retry")
                r["result"] = "failed"

            posted_log.append(r)
            POSTED_FILE.write_text(
                json.dumps(posted_log, indent=2, ensure_ascii=False), encoding="utf-8"
            )

            if i < len(replies) - 1:
                delay_s = random.randint(POST_DELAY_MIN * 60, POST_DELAY_MAX * 60)
                resume = datetime.fromtimestamp(time.time() + delay_s).strftime("%H:%M:%S")
                print(f"\n  Next reply at ~{resume} ({delay_s//60}m {delay_s%60}s)")
                time.sleep(delay_s)

        print("\nBrowser closing in 30 seconds so you can verify...")
        time.sleep(30)
        ctx.close()

    # HARD RULE: clear the queue entirely after every run — even for failures.
    # A "failed" reply is very often a successful post that the verify step
    # couldn't see (X shadow-hides under throttle / page didn't settle in time).
    # Retrying creates duplicates that have to be manually deleted from X.
    # All outcomes are archived to posted_replies.json with their `result` field
    # ("posted" | "already_posted" | "failed") for audit. Manual re-queue only.
    posted_count = sum(1 for r in replies if r.get("result") in ("posted", "already_posted"))
    failed_count = sum(1 for r in replies if r.get("result") == "failed")
    REPLIES_FILE.write_text("[]", encoding="utf-8")

    # Remove successfully posted entries from reply_opportunities.json
    remove_posted_opportunities([r for r in replies if r.get("result") in ("posted", "already_posted")])

    print(f"\nDone. {posted_count} posted, {failed_count} failed (archived, NOT requeued — see posted_replies.json).")


def remove_posted_opportunities(posted: list[dict]):
    """Remove each posted reply's entry from reply_opportunities.json."""
    if not posted or not OPPORTUNITIES_FILE.exists():
        return

    posted_urls = {r.get("tweet_url") for r in posted if r.get("tweet_url")}
    if not posted_urls:
        return

    try:
        opps = json.loads(OPPORTUNITIES_FILE.read_text(encoding="utf-8"))
    except Exception:
        return

    before = len(opps)
    opps = [o for o in opps if o.get("tweet_url") not in posted_urls]
    after = len(opps)

    if after < before:
        OPPORTUNITIES_FILE.write_text(
            json.dumps(opps, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        print(f"  Removed {before - after} posted entries from reply_opportunities.json")


if __name__ == "__main__":
    main()
