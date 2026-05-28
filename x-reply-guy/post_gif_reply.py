#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
post_gif_reply.py — Post GIF-only replies to X tweets via the native GIF picker.

The text reply poster (post_replies.py) can only TYPE reply_text. A reaction
entry whose intent is a GIF must be posted through X's GIF picker instead — this
script does that. It mirrors post_replies.py's launch / navigation / human-pacing,
but replaces the type-text step with: GIF button -> search gif_search -> click the
first result tile -> Post.

Queue file: data/gif_replies_to_post.json — an array of:
    { "tweet_url": "...", "gif_search": "standing ovation", "author": "@handle" }
(reply_text/caption is NOT used — these are GIF-only reactions.)

Usage:
    python post_gif_reply.py --dry-run   # attach GIF + screenshot, DO NOT post
    python post_gif_reply.py             # attach GIF and post for real

--dry-run stops right before the final Post click and saves a screenshot of the
composer (tmp-gif-debug/) so you can confirm a GIF actually attached before firing.
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

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
ACTION_MIN, ACTION_MAX = 4, 7          # seconds between UI actions
POST_DELAY_MIN, POST_DELAY_MAX = 2, 6  # minutes between multiple GIF replies

HERE               = Path(__file__).parent
QUEUE_FILE         = HERE / "data" / "gif_replies_to_post.json"
POSTED_FILE        = HERE / "data" / "posted_replies.json"
OPPORTUNITIES_FILE = HERE / "data" / "reply_opportunities.json"
DEBUG_DIR          = HERE / "tmp-gif-debug"


def remove_posted_opportunities(posted: list[dict]):
    if not posted or not OPPORTUNITIES_FILE.exists():
        return
    posted_urls = {e.get("tweet_url") for e in posted if e.get("tweet_url")}
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


def human_pause(label=""):
    delay = random.randint(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {delay}s pause {f'({label})' if label else ''}")
    time.sleep(delay)


def mouse_click(page, locator):
    bbox = locator.bounding_box()
    if bbox and bbox["width"] > 0:
        page.mouse.click(bbox["x"] + bbox["width"] / 2, bbox["y"] + bbox["height"] / 2)
    else:
        locator.click()


def shot(page, name):
    DEBUG_DIR.mkdir(exist_ok=True)
    path = DEBUG_DIR / f"{name}.png"
    try:
        page.screenshot(path=str(path))
        print(f"  [screenshot] {path}")
    except Exception as e:
        print(f"  [screenshot failed] {e}")


def open_gif_picker(page) -> bool:
    """Click the GIF button in the reply composer toolbar."""
    selectors = [
        '[data-testid="gifSearchButton"]',
        'button[aria-label="GIF"]',
        '[aria-label="Add a GIF"]',
    ]
    for sel in selectors:
        btn = page.locator(sel).first
        if btn.count() > 0:
            try:
                mouse_click(page, btn)
                print(f"  GIF button clicked via: {sel}")
                page.wait_for_timeout(2500)
                return True
            except Exception:
                continue
    print("  GIF button NOT found")
    return False


def search_and_pick_gif(page, query: str) -> bool:
    """Type the search query in the GIF picker and click the first result tile."""
    # Search input — try known testids, then any visible text input in the dialog.
    search = None
    for sel in ['[data-testid="gifSearchTextInput"]',
                '[data-testid="searchSelectorTextfield"]',
                'input[placeholder*="Search for GIFs"]',
                '[role="dialog"] input[type="text"]']:
        cand = page.locator(sel).first
        if cand.count() > 0:
            search = cand
            print(f"  GIF search input via: {sel}")
            break
    if search is None:
        print("  GIF search input NOT found")
        shot(page, "ERR_no_search_input")
        return False

    search.click()
    page.wait_for_timeout(500)
    search.fill("")
    page.keyboard.type(query, delay=80)
    print(f"  searched: {query}")
    page.wait_for_timeout(5000)  # let results load

    # Screenshot the picker BEFORE clicking so dry-runs can verify results appeared.
    shot(page, f"picker_{query.replace(' ', '_')[:20]}")

    # First result tile — try testids, then first <img> inside the results dialog.
    tile_selectors = [
        '[data-testid="gifSearchGifImage"]',
        '[data-testid="gifSearchGif"] img',
        '[data-testid="gifSearchGif"]',
        '[role="dialog"] [role="button"] img',
        '[role="dialog"] img[src*="tweet_video"]',
        '[role="dialog"] img',
    ]
    for sel in tile_selectors:
        tiles = page.locator(sel)
        n = tiles.count()
        if n > 0:
            tile = tiles.first
            try:
                tile.scroll_into_view_if_needed(timeout=4000)
            except Exception:
                pass
            mouse_click(page, tile)
            print(f"  clicked first GIF tile via: {sel} (count at click={n})")
            page.wait_for_timeout(3000)
            return True
    print("  No GIF result tile found")
    shot(page, "ERR_no_gif_tiles")
    return False


def composer_has_media(page) -> bool:
    """True if a GIF is actually attached to the reply composer (not just tweet media)."""
    return page.evaluate("""
        () => {
            // These only appear when something is attached to the composer itself.
            if (document.querySelector('[aria-label="Remove media"]')) return true;
            if (document.querySelector('[data-testid="attachments"]')) return true;
            return false;
        }
    """)


def click_post(page) -> str | None:
    return page.evaluate("""
        () => {
            for (const tid of ['tweetButtonInline','tweetButton']) {
                const btns = Array.from(document.querySelectorAll('[data-testid="'+tid+'"]'));
                const v = btns.find(b => b.offsetParent !== null
                    && b.getBoundingClientRect().width > 0 && !b.disabled);
                if (v) { v.click(); return tid; }
            }
            return null;
        }
    """)


def post_gif_reply(page, entry: dict, dry_run: bool) -> str:
    tweet_url = entry["tweet_url"]
    query     = entry["gif_search"]
    try:
        print(f"  Loading tweet...")
        page.goto(tweet_url, wait_until="domcontentloaded", timeout=30_000)
        page.wait_for_timeout(2500)

        reply_btn = page.locator('[data-testid="reply"]').first
        try:
            reply_btn.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            print("  Reply button not found"); return "error"
        human_pause("before Reply")
        mouse_click(page, reply_btn)
        page.wait_for_timeout(1500)

        # composer must be open (reply textarea present)
        try:
            page.locator('[data-testid="tweetTextarea_0"]').first.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            print("  Reply composer did not open"); shot(page, "ERR_no_composer"); return "error"

        human_pause("before GIF picker")
        if not open_gif_picker(page):
            shot(page, "ERR_no_gif_button"); return "error"
        if not search_and_pick_gif(page, query):
            return "error"

        page.wait_for_timeout(1500)
        attached = composer_has_media(page)
        print(f"  composer has media: {attached}")
        shot(page, f"composer_{query.replace(' ','_')[:20]}")

        if not attached:
            print("  WARNING: no media detected in composer after picking GIF")

        if dry_run:
            print("  [DRY RUN] stopping before Post — review the screenshot above")
            return "dry_run"

        human_pause("before Post")
        tid = click_post(page)
        if not tid:
            print("  No visible Post button found"); return "error"
        print(f"  Clicked Post ({tid})")
        page.wait_for_timeout(4000)

        # Success signal: composer closed (textarea detached/hidden).
        try:
            page.locator('[data-testid="tweetTextarea_0"]').first.wait_for(state="hidden", timeout=8000)
            print("  Composer closed ✓ (submission signal)")
            return "posted"
        except PWTimeout:
            print("  Composer still open after Post — uncertain")
            shot(page, "ERR_after_post")
            return "uncertain"

    except Exception as e:
        print(f"  Error: {e}")
        return "error"


def main():
    dry_run = "--dry-run" in sys.argv
    if not QUEUE_FILE.exists():
        print(f"No GIF queue at {QUEUE_FILE}"); sys.exit(1)
    queue = json.loads(QUEUE_FILE.read_text(encoding="utf-8"))
    if not queue:
        print("GIF queue empty — nothing to post."); return

    print("=" * 55)
    print(f"{'DRY RUN — ' if dry_run else ''}Posting {len(queue)} GIF repl{'y' if len(queue)==1 else 'ies'}")
    print("=" * 55)
    for i, e in enumerate(queue):
        print(f"[{i+1}/{len(queue)}] {e.get('author','?')} -> GIF '{e['gif_search']}' on {e['tweet_url']}")

    jitter = random.randint(10, 30)
    print(f"\nStarting in {jitter}s...")
    time.sleep(jitter)

    posted_log = json.loads(POSTED_FILE.read_text(encoding="utf-8")) if POSTED_FILE.exists() else []
    results = []

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            user_data_dir=CHROME_PROFILE, channel="chrome", headless=False, slow_mo=50,
            args=["--disable-blink-features=AutomationControlled"],
            ignore_default_args=["--enable-automation"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        for i, e in enumerate(queue):
            print(f"\n--- [{i+1}/{len(queue)}] {e.get('author','?')} ---")
            result = post_gif_reply(page, e, dry_run)
            print(f"  result: {result}")
            results.append(result)

            if not dry_run and result in ("posted", "uncertain"):
                rec = dict(e)
                rec["result"] = "posted_gif" if result == "posted" else "uncertain_gif"
                rec["posted_at"] = datetime.now().isoformat()
                posted_log.append(rec)
                POSTED_FILE.write_text(json.dumps(posted_log, indent=2, ensure_ascii=False), encoding="utf-8")

            if i < len(queue) - 1 and not dry_run:
                delay_s = random.randint(POST_DELAY_MIN*60, POST_DELAY_MAX*60)
                print(f"\n  Next GIF reply in {delay_s//60}m {delay_s%60}s...")
                time.sleep(delay_s)

        print("\nBrowser closing in 30s so you can verify...")
        time.sleep(30)
        ctx.close()

    # On a real run, drop posted entries from the queue (keep failures for manual review).
    if not dry_run:
        # Keep only hard errors in the queue — uncertain very likely posted (same
        # X false-negative pattern as text replies), so remove those too.
        remaining = [e for e, r in zip(queue, results) if r == "error"]
        QUEUE_FILE.write_text(json.dumps(remaining, indent=2, ensure_ascii=False), encoding="utf-8")
        posted_entries = [e for e, r in zip(queue, results) if r in ("posted", "uncertain")]
        remove_posted_opportunities(posted_entries)
        n_posted = results.count("posted")
        n_uncertain = results.count("uncertain")
        print(f"\nDone. {n_posted} posted, {n_uncertain} uncertain (likely posted — check manually), {len(remaining)} errors left in queue.")
    else:
        print("\nDry run complete — queue untouched. Review tmp-gif-debug/ screenshots.")


if __name__ == "__main__":
    main()
