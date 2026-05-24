#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
auto_reply_post.py — Fire a SINGLE on-the-fly reply (x-reply-auto skill).

Reads data/auto_reply_pending.json = {tweet_url, reply_text, author}, posts the
reply via the validated post_reply() from post_replies.py, archives the outcome to
data/posted_replies.json, and removes the pending file.

Does NOT touch reply_opportunities.json or replies_to_post.json (the curated queue).

HARD RULE — never retry a "failed" reply. X's verify step false-negatives under
throttle; a reply marked "failed" has very often already posted. Re-running this on
the same entry would duplicate-post. The pending file is consumed (deleted) at the
start of every run regardless of outcome, so an accidental re-run is a safe no-op.

Usage:  python auto_reply_post.py
Chrome (xbot-profile) must be fully closed before running.
"""

import io, json, sys, random, time
from datetime import datetime
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from playwright.sync_api import sync_playwright
from post_replies import post_reply, already_replied, CHROME_PROFILE

HERE         = Path(__file__).parent
PENDING_FILE = HERE / "data" / "auto_reply_pending.json"
POSTED_FILE  = HERE / "data" / "posted_replies.json"


def archive(entry: dict):
    log = []
    if POSTED_FILE.exists():
        try:
            log = json.loads(POSTED_FILE.read_text(encoding="utf-8"))
        except Exception:
            log = []
    log.append(entry)
    POSTED_FILE.write_text(json.dumps(log, indent=2, ensure_ascii=False), encoding="utf-8")


def main():
    if not PENDING_FILE.exists():
        print("No data/auto_reply_pending.json — nothing to post.")
        return
    try:
        pending = json.loads(PENDING_FILE.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Could not parse pending file: {e}")
        return

    # Consume the pending file immediately — never double-fire on a re-run.
    PENDING_FILE.unlink()

    tweet_url  = (pending.get("tweet_url") or "").strip()
    reply_text = (pending.get("reply_text") or "").strip()
    author     = pending.get("author", "?")

    if not tweet_url or not reply_text:
        print("Pending entry missing tweet_url or reply_text. Aborting.")
        return

    print(f"Auto-reply -> {author}")
    print(f"  tweet: {tweet_url}")
    print(f"  reply: {reply_text[:120]}")

    entry = dict(pending)
    entry["auto_reply"] = True

    jitter = random.randint(5, 20)
    print(f"Starting in {jitter}s...")
    time.sleep(jitter)

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            user_data_dir=CHROME_PROFILE, channel="chrome", headless=False, slow_mo=50,
            args=["--disable-blink-features=AutomationControlled"],
            ignore_default_args=["--enable-automation"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            if already_replied(page, tweet_url, reply_text):
                print("Already replied to this tweet — skipping (archived as already_posted).")
                entry["result"] = "already_posted"
                entry["posted_at"] = datetime.now().isoformat()
                archive(entry)
                return

            result = post_reply(page, tweet_url, reply_text, author)
            if result == "posted":
                entry["result"] = "posted"
                entry["posted_at"] = datetime.now().isoformat()
                print("POSTED ✓")
            else:
                entry["result"] = "failed"
                print("Result NOT confirmed. Archived as 'failed' — DO NOT re-run. "
                      "X verify false-negatives mean it has very likely already posted; "
                      "a retry would duplicate. Check the tweet on X manually.")
            archive(entry)

            print("\nBrowser closing in 20s so you can verify...")
            time.sleep(20)
        finally:
            ctx.close()


if __name__ == "__main__":
    main()
