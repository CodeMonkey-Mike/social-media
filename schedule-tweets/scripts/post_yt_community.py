# post_yt_community.py — CANONICAL Python port of post-yt-community.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
# Status: PORTED, BLESS-PENDING — invoke the JS twin for production posts until
# this port is live-blessed with one real post.
#
# 1:1 port on playwright.sync_api. Posts the next pending YouTube community post
# (data/yt-posts.json) via the ytbot-profile. Chrome is spawned as a raw OS process
# with --remote-debugging-port and Playwright attaches over CDP (connect_over_cdp),
# NOT launch_persistent_context — this avoids Playwright's profile-lock singleton
# conflict on the shared ytbot-profile. Same duplicate pre-check against the last 5
# community posts (checkAlreadyPosted), same composer-expand selector fallback
# chain, same insertText body paste + 90%-length truncation guard, same Image-
# button selector fallback chain + setInputFiles + thumbnail pre-post count
# verification (with the 4s-more retry), same post-check URL diff + body-snippet /
# image-count verification (verifyPosted). Documented divergences ONLY:
#   - final machine line (POST OK/FAIL platform=yt-community) for the graph.
import json
import math
import os
import random
import re
import socket
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

YT_JSON = Path(__file__).resolve().parent.parent / "data" / "yt-posts.json"
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile"
CDP_PORT = 9223
WORKSPACE_ROOT = r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets"
CHANNEL_HANDLE = "CodeMonkeyMike"
POSTS_URL = f"https://www.youtube.com/@{CHANNEL_HANDLE}/posts"

CHAR_DELAY = 5  # unused in the JS twin too (carried over as-is)
ACTION_MIN = int(os.environ.get("YTC_ACTION_MIN", 5000))
ACTION_MAX = int(os.environ.get("YTC_ACTION_MAX", 8000))
PRE_COMPOSE_MIN = int(os.environ.get("YTC_PRE_COMPOSE_MIN", 30000))
PRE_COMPOSE_MAX = int(os.environ.get("YTC_PRE_COMPOSE_MAX", 90000))


def js_round(x):
    """Match JS Math.round (half rounds up) instead of Python's round-half-to-even."""
    return math.floor(x + 0.5)


def random_between(a, b):
    return random.randint(a, b)


def now_iso_z():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def save(data):
    YT_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def action_pause(page, label=""):
    ms = random_between(ACTION_MIN, ACTION_MAX)
    suffix = f" ({label})" if label else ""
    print(f"  ~ {ms / 1000:.1f}s pause{suffix}")
    page.wait_for_timeout(ms)


def long_wait(page, min_ms, max_ms, label=""):
    ms = random_between(min_ms, max_ms)
    suffix = f" ({label})" if label else ""
    print(f"  waiting {js_round(ms / 1000)}s{suffix}...", flush=True)
    page.wait_for_timeout(ms)


# Check if Chrome's remote debugging port is already listening
def is_cdp_ready():
    try:
        with socket.create_connection(("127.0.0.1", CDP_PORT), timeout=0.6):
            return True
    except OSError:
        return False


# Spawn Chrome with the ytbot-profile and remote debugging port.
# Returns the child process (or None if Chrome was already running on the port).
def start_chrome():
    if is_cdp_ready():
        print(f"Chrome already listening on CDP port {CDP_PORT} \u2713")
        return None

    print("Launching Chrome with remote debugging...")
    proc = subprocess.Popen(
        [
            CHROME_EXE,
            f"--user-data-dir={CHROME_PROFILE}",
            f"--remote-debugging-port={CDP_PORT}",
            "--no-first-run",
            "--disable-blink-features=AutomationControlled",
            "--disable-sync",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, stdin=subprocess.DEVNULL,
    )

    # Wait up to 12s for the port to open
    for _ in range(24):
        time.sleep(0.5)
        if is_cdp_ready():
            print(f"Chrome ready on port {CDP_PORT} \u2713")
            return proc

    raise RuntimeError(
        f"Chrome did not open remote debugging port {CDP_PORT} within 12 seconds.\n"
        "This usually means the ytbot-profile is still locked by another Chrome process.\n"
        "Close all Chrome windows (including background Chrome) and re-run."
    )


def resolve_image_path(img):
    if img.get("image_path"):
        rel = re.sub(r"^schedule-tweets[\\/]", "", img["image_path"])
        abs_path = Path(WORKSPACE_ROOT) / rel
        if abs_path.exists():
            return abs_path
        print(f"  image_path doesn't resolve ({abs_path}) — falling back to glob")
    if img.get("image_id"):
        for d in ["images/yt", "images/ig", "images/x"]:
            full_dir = Path(WORKSPACE_ROOT) / d
            if not full_dir.exists():
                continue
            match = next((f for f in os.listdir(full_dir) if img["image_id"] in f), None)
            if match:
                return full_dir / match
    return None


# Scrape the most recent post URLs from the community posts page
def get_recent_post_urls(page, count=5):
    page.goto(POSTS_URL)
    try:
        page.wait_for_load_state("domcontentloaded", timeout=30000)
    except Exception:
        pass
    page.wait_for_timeout(3000)
    return page.evaluate(
        """(n) => {
            const seen = new Set();
            const urls = [];
            for (const a of document.querySelectorAll('a[href*="/post/"]')) {
                const url = a.href.replace(/[?#].*$/, '');
                if (!seen.has(url)) {
                    seen.add(url);
                    urls.push(url);
                    if (urls.length >= n) break;
                }
            }
            return urls;
        }""",
        count,
    )


# Visit a post URL and read its body text and image count
def inspect_post(page, url):
    page.goto(url)
    try:
        page.wait_for_load_state("domcontentloaded", timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(2500)
    return page.evaluate(
        """() => {
            // Body text — try several selectors YouTube uses
            let bodyText = '';
            for (const sel of [
                '#post-text yt-formatted-string',
                '#post-text',
                'yt-formatted-string#content',
                'ytd-backstage-post-renderer #text',
            ]) {
                const el = document.querySelector(sel);
                if (el && el.innerText && el.innerText.length > 20) {
                    bodyText = el.innerText;
                    break;
                }
            }

            // Image count — count rendered image elements in the post
            const imageCount = document.querySelectorAll(
                'ytd-backstage-image-renderer img, #post-multi-image-attachment img, #post-image-attachment img'
            ).length;

            // Timestamp text (relative, e.g. "just now", "2 minutes ago")
            const timeEl = document.querySelector('#published-time-text a, a[class*="published-time"]');
            const timeText = timeEl ? timeEl.innerText.trim() : '';

            return { bodyText, imageCount, timeText };
        }"""
    )


# PRE-CHECK: scan last 5 community posts for matching body -> returns url or None
def check_already_posted(page, body):
    print("\nPre-check: scanning recent community posts for duplicates...")
    snippet = body[:50]
    urls = get_recent_post_urls(page, 5)
    print(f'  Checking {len(urls)} posts for: "{snippet[:40]}..."')

    for url in urls:
        info = inspect_post(page, url)
        if info["bodyText"] and snippet[:40] in info["bodyText"]:
            print(f"  DUPLICATE FOUND at {url}")
            return url
        print(f"  Not a match: {url}")
    print("  No duplicate found. Safe to post.\n")
    return None


# POST-CHECK: find the new post URL (not in preUrls), verify body + images
def verify_posted(page, pre_urls, post):
    print("\nPost-check: verifying post on community page...")

    # YouTube's feed can take several seconds to reflect a new post.
    # Retry up to 5 times with 5s gaps (25s total window).
    new_url = None
    for attempt in range(1, 6):
        new_urls = get_recent_post_urls(page, 5)
        new_url = next((u for u in new_urls if u not in pre_urls), None)
        if new_url:
            break
        print(f"  Attempt {attempt}/5: new post not yet visible — waiting 5s...")
        page.wait_for_timeout(5000)

    if not new_url:
        return {"ok": False, "reason": "No new post URL found after 5 attempts — feed may not have updated yet"}

    print(f"  Inspecting: {new_url}")
    info = inspect_post(page, new_url)
    print(f'  Time: "{info["timeText"]}" | body length: {len(info["bodyText"])} | images: {info["imageCount"]}')

    # Body must contain the opening snippet
    snippet = post["body"][:40]
    if info["bodyText"] and snippet not in info["bodyText"]:
        return {"ok": False, "url": new_url, "reason": f'Body snippet not found. Expected: "{snippet}"', "info": info}

    # Image count check
    expected_images = len(post.get("images") or [])
    if expected_images > 0 and info["imageCount"] == 0:
        return {"ok": False, "url": new_url,
                "reason": f"Expected {expected_images} image(s) but none visible on post", "info": info}
    if expected_images > 1 and info["imageCount"] < 2:
        return {"ok": False, "url": new_url,
                "reason": f'Expected carousel ({expected_images} images) but got {info["imageCount"]}', "info": info}

    print(f'  Verified \u2713  (body: match, images: {info["imageCount"]}/{expected_images})')
    return {"ok": True, "url": new_url, "info": info}


def main():
    data = json.loads(YT_JSON.read_text(encoding="utf-8"))
    post = next((p for p in data["posts"] if p["status"] == "pending"), None)

    if not post:
        print("No pending YouTube community posts. Exiting.")
        return

    snippet = post["body"][:80]
    print(f'Post: "{snippet}..."')
    print(f"Body: {post['char_count']} chars")

    # Resolve image paths up front
    image_paths = []
    if post.get("images") and len(post["images"]) > 0:
        post["images"].sort(key=lambda a: a["seq"])
        for img in post["images"]:
            abs_path = resolve_image_path(img)
            if not abs_path:
                print(f"FATAL: image not found for seq={img['seq']} (image_id: {img.get('image_id')})",
                      file=sys.stderr)
                sys.exit(1)
            print(f"  Image {img['seq']}: {abs_path.name}")
            image_paths.append(abs_path)
    else:
        print("  Text-only post (no images)")

    # Launch Chrome as a normal process (avoids Playwright's singleton conflict),
    # then connect to it via CDP.
    chrome_proc = start_chrome()

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{CDP_PORT}")
        context = browser.contexts[0]
        page = context.pages[0] if context.pages else context.new_page()

        try:
            # -- Login check ------------------------------------------------------
            print("Navigating to YouTube...", flush=True)
            page.goto("https://www.youtube.com/")
            try:
                page.wait_for_load_state("domcontentloaded", timeout=30000)
            except Exception:
                pass
            page.wait_for_timeout(2000)

            # Check for sign-in prompt — avatar button absence means not logged in
            avatar = page.locator("#avatar-btn, button#avatar-btn, ytd-topbar-menu-button-renderer").count()
            if avatar == 0:
                raise RuntimeError(
                    "Not logged in to YouTube in the ytbot-profile.\n"
                    "Close Chrome, open it manually with --user-data-dir=ytbot-profile, log in, then re-run."
                )
            print("YouTube loaded and logged in \u2713")

            # -- PRE-CHECK ----------------------------------------------------------
            duplicate_url = check_already_posted(page, post["body"])
            if duplicate_url:
                print("Already posted. Updating JSON with existing URL.")
                post["status"] = "posted"
                post["posted_at"] = post.get("posted_at") or now_iso_z()
                post["post_url"] = duplicate_url
                save(data)
                print(f"POST OK platform=yt-community url={duplicate_url} status=already-posted", flush=True)
                browser.close()
                return

            # Capture pre-posting URL list for post-check diff
            # (get_recent_post_urls above already navigated to POSTS_URL; grab the list again cleanly)
            pre_urls = get_recent_post_urls(page, 5)

            # Mark mid-flight before any browser interaction
            post["status"] = "posting"
            save(data)

            # -- Navigate to posts page / composer -----------------------------------
            print("Opening community posts composer...")
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")
            page.goto(POSTS_URL)
            try:
                page.wait_for_load_state("domcontentloaded", timeout=30000)
            except Exception:
                pass
            page.wait_for_timeout(2500)

            # -- Expand the composer by clicking the placeholder ---------------------
            # YouTube community post composer starts collapsed. Must click the
            # placeholder area first before the full text area becomes interactive.
            print("Expanding composer...")
            placeholder_selectors = [
                "#placeholder-area",
                '[id="placeholder-area"]',
                "ytd-backstage-post-renderer-create #placeholder-area",
                "#contenteditable-root",  # sometimes directly clickable in expanded state
            ]
            expanded = False
            for sel in placeholder_selectors:
                el = page.locator(sel).first
                if el.count() > 0:
                    try:
                        el.click(timeout=5000)
                        print(f"  Clicked placeholder via: {sel}")
                        expanded = True
                        break
                    except Exception:
                        pass  # try next
            if not expanded:
                # Last resort: click by coordinates near the top of the page where the composer lives
                print("  Placeholder selectors failed — trying JS click on placeholder-area...")
                page.evaluate(
                    "() => { const el = document.querySelector('#placeholder-area') || "
                    "document.querySelector('ytd-backstage-post-renderer-create'); if (el) el.click(); }"
                )
            page.wait_for_timeout(1500)

            # -- Find the now-visible text area --------------------------------------
            text_area = None
            ta_selectors = [
                '#contenteditable-root[contenteditable="true"]',
                '[aria-label*="mind"][contenteditable="true"]',
                '[aria-label*="audience"][contenteditable="true"]',
                'ytd-backstage-post-renderer-create [contenteditable="true"]',
            ]
            for sel in ta_selectors:
                el = page.locator(sel).first
                if el.count() > 0 and el.is_visible():
                    text_area = el
                    print(f"  Composer text area found via: {sel}")
                    break
            if not text_area:
                raise RuntimeError(
                    "Could not find a visible YouTube composer text area after expanding. "
                    "Check that the ytbot-profile is logged in and on the posts page."
                )

            # -- Paste body text ------------------------------------------------------
            print(f"Pasting body ({post['char_count']} chars)...")
            text_area.click()
            page.wait_for_timeout(300)
            # insert_text uses CDP Input.insertText — instant even for 3000+ chars
            page.keyboard.insert_text(post["body"])
            print("Body pasted \u2713")
            page.wait_for_timeout(500)

            # Scroll through to verify text is not truncated
            pasted_length = text_area.evaluate("el => el.innerText.length")
            if pasted_length < len(post["body"]) * 0.9:
                raise RuntimeError(
                    f"Pasted text appears truncated: expected ~{len(post['body'])} chars, got {pasted_length}"
                )
            print(f"Body length verified in composer: {pasted_length} chars \u2713")

            # -- Upload images (if any) ------------------------------------------------
            if image_paths:
                print(f"\nUploading {len(image_paths)} image(s)...")

                # Click the Image button in the toolbar (NOT "Image poll")
                image_btn = None
                image_btn_selectors = [
                    '[aria-label="Image"]',
                    '[aria-label="Photo"]',
                    'button[aria-label*="mage"]:not([aria-label*="poll"])',
                    "#create-image-post-button",
                    'ytd-button-renderer:not([class*="poll"]) [aria-label*="mage"]',
                ]
                for sel in image_btn_selectors:
                    el = page.locator(sel).first
                    if el.count() > 0:
                        image_btn = el
                        print(f"  Image button found via: {sel}")
                        break
                if not image_btn:
                    raise RuntimeError("Could not find the Image upload button in the YouTube composer toolbar.")

                # Scroll into view — toolbar may be below the fold after text paste
                try:
                    image_btn.scroll_into_view_if_needed()
                except Exception:
                    pass
                page.wait_for_timeout(500)
                try:
                    image_btn.click(timeout=5000)
                except Exception:
                    print("  Standard click failed — using JS click...")
                    image_btn.evaluate("el => el.click()")
                print("  Clicked Image button \u2713")
                page.wait_for_timeout(1500)

                # Use the FIRST file input (the multi-file one). The second one is "add more" and unreliable.
                file_inputs = page.locator('input[type="file"]')
                file_inputs.first.wait_for(state="attached", timeout=10000)
                file_inputs.first.set_input_files([str(p) for p in image_paths])
                upload_wait = random_between(6000, 10000)
                print(f"  setInputFiles called — waiting {js_round(upload_wait / 1000)}s "
                      "for YouTube thumbnail rendering...", flush=True)
                page.wait_for_timeout(upload_wait)

                # Verify thumbnail count — must match before we can post
                thumb_selectors = [
                    "ytd-backstage-multi-image-select-renderer img",
                    "#post-image-attachment img",
                    "#image-container img",
                    ".image-attachment-container img",
                ]
                thumb_count = 0
                for sel in thumb_selectors:
                    c = page.locator(sel).count()
                    if c > 0:
                        thumb_count = c
                        print(f'  Thumbnails via "{sel}": {thumb_count}')
                        break

                if thumb_count < len(image_paths):
                    print(f"  Only {thumb_count}/{len(image_paths)} thumbnails after 6s — waiting 4s more...")
                    page.wait_for_timeout(4000)
                    for sel in thumb_selectors:
                        c = page.locator(sel).count()
                        if c > 0:
                            thumb_count = c
                            break

                if thumb_count < len(image_paths):
                    raise RuntimeError(
                        f"Pre-post thumbnail check FAILED: expected {len(image_paths)} thumbnails, "
                        f"got {thumb_count}. Aborting — post would go live with missing images."
                    )
                print(f"  Thumbnail pre-post check \u2713 ({thumb_count}/{len(image_paths)})")

            # -- Click Post -------------------------------------------------------------
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before Post")
            print("\nClicking Post...")
            # The Post button is blue, at the bottom right of the composer
            post_btn = page.get_by_role("button", name=re.compile(r"^Post$")).first
            if post_btn.count() == 0:
                post_btn = page.locator(
                    '#submit-button, button[aria-label="Post"], ytd-button-renderer:has-text("Post")'
                ).first
            post_btn.wait_for(timeout=10000)
            post_btn.click()
            print("Post clicked \u2713")

            # Wait for the composer to reset (text area returns to empty "What's on your mind?")
            print("Waiting for composer to clear (confirms submission)...")
            try:
                page.wait_for_function(
                    """() => {
                        const el = document.querySelector('#contenteditable-root, [contenteditable="true"]');
                        return el && el.innerText.trim().length === 0;
                    }""",
                    timeout=15000,
                )
                print("Composer cleared \u2713")
            except Exception:
                print("Composer-cleared signal not detected — proceeding to post-check anyway.")
                page.wait_for_timeout(4000)

            # -- POST-CHECK ---------------------------------------------------------------
            result = verify_posted(page, pre_urls, post)

            if not result["ok"]:
                raise RuntimeError(f"Post-check FAILED: {result['reason']}")

            post["status"] = "posted"
            post["posted_at"] = now_iso_z()
            post["post_url"] = result["url"]
            post.pop("error", None)
            save(data)
            print(f"\nDone \u2713  Post URL: {result['url']}")
            print(f"POST OK platform=yt-community url={result['url']}", flush=True)

        except Exception as err:
            post["status"] = "failed"
            post["error"] = str(err)
            save(data)
            print(f"\nPosting failed: {err}", file=sys.stderr)
            print(f"POST FAIL platform=yt-community reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
            # Disconnect Playwright from Chrome; then close the Chrome window
            try:
                browser.close()
            except Exception:
                pass
            try:
                if chrome_proc:
                    chrome_proc.kill()
            except Exception:
                pass


if __name__ == "__main__":
    main()
