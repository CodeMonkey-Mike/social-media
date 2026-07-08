#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
post_image_reply.py — image-attach helper for the unified reply poster.

NOT a standalone runner. Image replies live in the single queue
(data/replies_to_post.json) with text, emoji and GIF replies, and
post_replies.py posts all four types — it imports post_image_reply() from this
module to handle entries carrying an image_path.

An image queue entry is a normal reply object with image fields:
    { "author": "@handle", "tweet_url": "...", "reply_text": "",
      "image_style": "iceberg-cutaway", "image_prompt": "...",
      "image_path": "C:\\...\\data\\reply-images\\reply-ab12cd34-iceberg-cutaway.png" }

image_path is filled by generate_reply_images.js. Entries with image_prompt
but no image_path are NOT ready — post_replies.py leaves them in the queue.

Flow on an already-open page: Reply -> type optional reply_text -> attach the
file via the composer's hidden file input -> wait for the media preview ->
Post. Verification mirrors the GIF path: composer-closed is the success
signal; "uncertain" almost always means it posted (do not blind-retry).
"""

import random
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import time
from pathlib import Path

try:
    from playwright.sync_api import TimeoutError as PWTimeout
except ImportError:
    print("ERROR: playwright not installed.")
    sys.exit(1)

ACTION_MIN, ACTION_MAX = 4, 7          # seconds between UI actions
CHAR_DELAY_MIN, CHAR_DELAY_MAX = 60, 150

HERE      = Path(__file__).parent
DEBUG_DIR = HERE / "tmp-image-debug"   # dry-run composer screenshots


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


def composer_has_media(page) -> bool:
    """True if media is attached to the reply composer."""
    return page.evaluate("""
        () => {
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


def post_image_reply(page, entry: dict, dry_run: bool) -> str:
    tweet_url  = entry["tweet_url"]
    image_path = entry["image_path"]
    reply_text = (entry.get("reply_text") or "").strip()
    tag        = Path(image_path).stem[:24]

    if not Path(image_path).is_file():
        print(f"  Image file missing: {image_path}")
        return "error"

    try:
        print("  Loading tweet...")
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

        textarea = page.locator('[data-testid="tweetTextarea_0"]').first
        try:
            textarea.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            print("  Reply composer did not open"); shot(page, "ERR_no_composer"); return "error"

        # ALWAYS focus the composer, even for image-only replies: on tweet
        # pages the inline reply box stays collapsed until clicked, and a
        # collapsed composer does not mount its hidden file input (found in
        # the 2026-07-07 dry-run: text entries attached fine, the no-text
        # entry hit "file input not found").
        textarea.click()
        page.wait_for_timeout(800)

        if reply_text:
            human_pause("before typing")
            print(f"  Typing {len(reply_text)} chars...")
            for char in reply_text:
                page.keyboard.type(char)
                page.wait_for_timeout(random.randint(CHAR_DELAY_MIN, CHAR_DELAY_MAX))
            page.wait_for_timeout(800)

        # ── Attach via the composer's hidden file input ─────────────────────
        human_pause("before attach")
        file_input = page.locator('input[data-testid="fileInput"]').first
        try:
            file_input.wait_for(state="attached", timeout=8_000)
        except PWTimeout:
            print("  Composer file input not found"); shot(page, "ERR_no_file_input"); return "error"
        file_input.set_input_files(image_path)
        print(f"  Attached: {Path(image_path).name}")

        # Wait for the media preview, then let the upload finish processing.
        try:
            page.locator('[data-testid="attachments"]').first.wait_for(state="visible", timeout=20_000)
        except PWTimeout:
            print("  No attachment preview appeared"); shot(page, f"ERR_no_preview_{tag}"); return "error"
        page.wait_for_timeout(5000)

        attached = composer_has_media(page)
        print(f"  composer has media: {attached}")
        shot(page, f"composer_{tag}")
        if not attached:
            print("  WARNING: no media detected in composer after attach")

        if dry_run:
            print("  [DRY RUN] stopping before Post — review the screenshot above")
            return "dry_run"

        human_pause("before Post")
        tid = click_post(page)
        if not tid:
            print("  No visible Post button found"); return "error"
        print(f"  Clicked Post ({tid})")
        page.wait_for_timeout(5000)

        # Success signals, strongest first:
        #   (a) X's "Your post was sent" toast — explicit confirmation that
        #       works for image-only replies, where there is no text to
        #       fingerprint on the tweet page;
        #   (b) composer closed — the original signal. X sometimes keeps the
        #       composer mounted after a successful post, which is what caused
        #       the 2026-07-07 uncertain_image false-negatives.
        toast_seen = False
        composer_closed = False
        deadline = time.time() + 12
        while time.time() < deadline:
            try:
                state = page.evaluate("""
                    () => {
                        const toasts = Array.from(document.querySelectorAll('[data-testid="toast"]'));
                        const toast = toasts.some(t => /post was sent|reply was sent/i.test(t.textContent || ''));
                        const ta = document.querySelector('[data-testid="tweetTextarea_0"]');
                        const open = !!ta && ta.offsetParent !== null;
                        return { toast, open };
                    }
                """)
                toast_seen = toast_seen or state["toast"]
                composer_closed = composer_closed or not state["open"]
                if toast_seen or composer_closed:
                    break
            except Exception:
                pass
            page.wait_for_timeout(400)
        if toast_seen:
            print("  Toast confirmed: post was sent")
        if composer_closed:
            print("  Composer closed (submission signal)")
        if not (toast_seen or composer_closed):
            print("  No toast and composer still open after Post — uncertain")
            shot(page, f"ERR_after_post_{tag}")

        if reply_text and (toast_seen or composer_closed):
            snippet = reply_text[:40].lower()
            try:
                page.goto(tweet_url, wait_until="domcontentloaded", timeout=20_000)
                page.wait_for_timeout(3000)
                if snippet in page.content().lower():
                    print("  CONFIRMED: reply visible on tweet page")
                    return "posted"
                print("  Reply text not visible under shadow-filter — treating as posted (composer closed)")
                return "posted"
            except Exception:
                return "posted"

        return "posted" if composer_closed else "uncertain"

    except Exception as e:
        print(f"  Error: {e}")
        return "error"


if __name__ == "__main__":
    print("=" * 60)
    print("post_image_reply.py is not a standalone runner.")
    print("Image replies are part of the single queue: data/replies_to_post.json")
    print()
    print("  1. node generate_reply_images.js        # fills image_path")
    print("  2. QA every image in data/reply-images/")
    print("  3. python post_replies.py --dry-run     # attaches + screenshots")
    print("  4. python post_replies.py               # posts")
    print("=" * 60)
