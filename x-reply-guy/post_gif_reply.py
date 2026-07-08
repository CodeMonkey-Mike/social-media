#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
post_gif_reply.py — GIF-picker helper for the unified reply poster.

NOT a standalone runner. GIF replies live in the single queue
(data/replies_to_post.json) with text and emoji replies, and post_replies.py
posts all three types — it imports post_gif_reply() from this module to handle
the GIF entries (those with a "gif_search" field).

The text path can only TYPE reply_text; a GIF reaction must go through X's native
GIF picker instead. post_gif_reply() does that on an already-open page:
GIF button -> search gif_search -> click the first result tile -> Post.

To post (or dry-run) replies, run the one poster:
    python post_replies.py --dry-run    # attaches + screenshots GIFs, does NOT post
    python post_replies.py              # posts text + emoji + GIF

A GIF queue entry is just a normal reply object with a gif_search field:
    { "author": "@handle", "tweet_url": "...", "gif_search": "standing ovation",
      "reaction_only": true }
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

ACTION_MIN, ACTION_MAX = 4, 7          # seconds between UI actions

HERE      = Path(__file__).parent
DEBUG_DIR = HERE / "tmp-gif-debug"     # dry-run composer screenshots


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
    # DEPRECATED as a standalone runner. GIF replies now live in the single
    # unified queue (data/replies_to_post.json) alongside text and emoji
    # replies, and post_replies.py posts all three types (it imports
    # post_gif_reply() from this module for the GIF ones). There is no longer a
    # separate gif_replies_to_post.json queue.
    #
    # This module is kept as the GIF-picker helper library. Run the one poster:
    print("=" * 60)
    print("post_gif_reply.py is no longer a standalone runner.")
    print("GIF replies are part of the single queue: data/replies_to_post.json")
    print()
    print("  Dry-run (attaches + screenshots GIFs, does NOT post):")
    print("    python post_replies.py --dry-run")
    print()
    print("  Post everything in the queue (text + emoji + GIF):")
    print("    python post_replies.py")
    print("=" * 60)


if __name__ == "__main__":
    main()
