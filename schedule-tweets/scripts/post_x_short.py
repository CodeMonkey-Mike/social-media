# post_x_short.py — CANONICAL Python port of post-x-short.js (2026-08-11,
# posting-tail migration; the JS twin is FROZEN rollback). Status: PORTED,
# BLESS-PENDING — invoke the JS twin for production posts until this port is
# live-blessed with one real post.
# Uploads one pending short to X from data/shorts.json. Same pattern as
# post_tweet.py: launch_persistent_context with xbot-profile. Videos are attached
# via the hidden fileInput; X processes them before posting.
#
# 1:1 port on playwright.sync_api: same xbot-profile Chrome, same video-attach +
# processing-bar wait (with the thumbnail-visible fallback for small files that skip
# the progress bar), same caption built via lib/strip_hashtags.build_caption (hashtags
# stripped, short.tags re-appended per the platform's limit), same shorts.json
# write-back semantics under platforms.x. NOTE (preserved, not "fixed"): unlike its
# 3 siblings this script has no caption-typed verification step, and its "pre-post
# wait" reuses PRE_COMPOSE_MIN/MAX — there is no separate PRE_POST_MIN/MAX constant
# in the JS twin, so none is added here either. Its toast wait is 30000ms (the other
# 3 scripts use 15000ms) — also preserved exactly.
#
# Divergences from the JS twin (allowed by the porting spec — nothing else diverges):
#   - a final machine line: `POST OK platform=x url=...` on success / `POST FAIL
#     platform=x reason=...` on failure (flush=True), for a LangGraph wrapper to
#     parse. Printed only where the JS itself resolves to a terminal platforms.x
#     status of 'posted' or 'failed' — NOT on the early "no pending X shorts" exit
#     or the pre-launch "video file not found" exit, neither of which touch
#     platforms.x.status in the JS.

import json
import math
import os
import random
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from strip_hashtags import strip_hashtags, build_caption  # noqa: E402,F401

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).resolve().parent
SHORTS_JSON = SCRIPT_DIR.parent / "data" / "shorts.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
WORKSPACE_ROOT = r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets"
PLATFORM = "x"


def env_int(name, default):
    v = os.environ.get(name)
    return int(v) if v else default


CHAR_DELAY_MIN = 60
CHAR_DELAY_MAX = 150
ACTION_MIN = env_int("XS_ACTION_MIN", 4000)
ACTION_MAX = env_int("XS_ACTION_MAX", 7000)
PRE_COMPOSE_MIN = env_int("XS_PRE_COMPOSE_MIN", 60000)
PRE_COMPOSE_MAX = env_int("XS_PRE_COMPOSE_MAX", 180000)


def js_round(x):
    return math.floor(x + 0.5)


def now_iso_z():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def rnd(a, b):
    return random.randint(a, b)


def action_pause(page, label=""):
    ms = rnd(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {ms / 1000:.1f}s{f' ({label})' if label else ''}", flush=True)
    page.wait_for_timeout(ms)


def long_wait(page, min_ms, max_ms, label=""):
    ms = rnd(min_ms, max_ms)
    print(f"  waiting {js_round(ms / 1000)}s{f' ({label})' if label else ''}...", flush=True)
    page.wait_for_timeout(ms)


def mouse_click(page, locator):
    bbox = locator.bounding_box()
    if bbox and bbox["width"] > 0:
        page.mouse.click(bbox["x"] + bbox["width"] / 2, bbox["y"] + bbox["height"] / 2)
    else:
        locator.click()


def type_human(page, text):
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def wait_for_home_or_login(page, timeout_ms=30000):
    # Sync-API stand-in for the JS `Promise.race` between two waitForSelector calls:
    # polls both selectors for visibility (matching waitForSelector's default
    # 'visible' state) until one appears or timeout_ms elapses.
    deadline = time.monotonic() + timeout_ms / 1000
    while True:
        if page.locator('[data-testid="primaryColumn"]').first.is_visible():
            return "home"
        if page.locator('input[autocomplete="username"]').first.is_visible():
            return "login"
        if time.monotonic() >= deadline:
            return "unknown"
        page.wait_for_timeout(250)


def main():
    # --- Pick next pending short for X ---
    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))
    short = next((s for s in data["shorts"]
                  if (s.get("platforms") or {}).get(PLATFORM, {}).get("status") == "pending"), None)

    if not short:
        print("No pending X shorts. Exiting.")
        sys.exit(0)

    video_path = Path(WORKSPACE_ROOT) / short["video_path"]
    if not video_path.exists():
        print(f"Video file not found: {video_path}", file=sys.stderr)
        sys.exit(1)

    caption = build_caption(short["caption"], short.get("tags"), PLATFORM)

    # X has a 280 char limit — warn if caption is over
    if len(caption) > 280:
        print(f"Warning: caption is {len(caption)} chars (> 280). X may truncate or reject.", file=sys.stderr)

    print(f'\nShort: "{short["title"]}"')
    print(f"File:  {video_path} ({short['duration_seconds']}s)")
    print(f"Caption: {len(caption)} chars (hashtags stripped)")

    short["platforms"][PLATFORM]["status"] = "posting"
    SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # --- Launch Chrome ---
    print("\nLaunching Chrome...")

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=50,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"],
            no_viewport=True,
        )
        browser.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        page = browser.pages[0] if browser.pages else browser.new_page()

        try:
            # --- Load home feed ---
            page.goto("https://x.com/home")
            page.wait_for_load_state("load")

            state = wait_for_home_or_login(page, 30000)

            if state != "home":
                raise RuntimeError(f"X home feed not loaded (state: {state}). Check xbot-profile.")
            print("Home feed loaded.")

            # --- Pre-compose wait ---
            print("Pre-compose wait (60\u2013180s)...")
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            # --- Open composer ---
            compose_btn = page.locator('[data-testid="SideNav_NewTweet_Button"]')
            mouse_click(page, compose_btn)
            page.wait_for_selector('[data-testid="tweetTextarea_0"]', timeout=10000)
            action_pause(page, "composer open")

            # --- Attach video ---
            print("Attaching video...")
            file_input = page.locator('input[data-testid="fileInput"]').first
            if file_input.count() == 0:
                raise RuntimeError("fileInput not found in composer.")
            file_input.set_input_files(str(video_path))
            print("  Video set \u2014 waiting for processing...")

            # Wait for X to process the video (progress bar appears then disappears)
            # X shows [data-testid="progressBar"] while processing
            try:
                page.wait_for_selector('[data-testid="progressBar"], [role="progressbar"]', timeout=15000)
                print("  Processing started...")
                page.wait_for_function(
                    """() => {
  const bar = document.querySelector('[data-testid="progressBar"], [role="progressbar"]');
  return !bar || bar.getAttribute('aria-valuenow') === '100' ||
         getComputedStyle(bar).display === 'none';
}""",
                    timeout=5 * 60 * 1000)
                print("  Video processed \u2713")
            except Exception:
                # Progress bar may not appear for small files — check for thumbnail instead
                try:
                    page.wait_for_selector(
                        '[data-testid="attachments"] video, [data-testid="attachments"] [role="img"]',
                        timeout=30000)
                    print("  Video attached (thumbnail visible) \u2713")
                except Exception:
                    print("  Warning: could not confirm video processing \u2014 continuing")
            action_pause(page, "after video attach")

            # --- Type caption ---
            textarea = page.locator('[data-testid="tweetTextarea_0"]').first
            textarea.click()
            page.keyboard.press("Control+Home")
            page.wait_for_timeout(500)

            print(f"Typing caption ({len(caption)} chars)...")
            type_human(page, caption)
            page.wait_for_timeout(1000)
            print("Caption typed \u2713")
            action_pause(page, "after caption")

            # --- Pre-post wait ---
            print("Pre-post wait...")
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before Post")

            # --- Post ---
            clicked = page.evaluate("""() => {
  const btns = [...document.querySelectorAll('[data-testid="tweetButton"]')];
  const btn  = btns.find(b => b.offsetParent !== null &&
                              b.getBoundingClientRect().width > 0 && !b.disabled);
  if (btn) { btn.click(); return true; }
  return false;
}""")
            if not clicked:
                raise RuntimeError("Post button not found or disabled.")
            print("Post clicked. Waiting for confirmation...")

            # --- Grab URL from toast ---
            toast = page.locator('[data-testid="toast"]')
            toast.wait_for(timeout=30000)

            url = toast.evaluate("""el => {
  const a = el.querySelector('a[href*="/status/"]');
  return a ? 'https://x.com' + a.getAttribute('href') : null;
}""")

            if url:
                print(f"\nPosted: {url}")
            else:
                print("\nPosted \u2014 URL not captured from toast.")

            # --- Update JSON ---
            short["platforms"][PLATFORM]["status"] = "posted"
            short["platforms"][PLATFORM]["posted_at"] = now_iso_z()
            short["platforms"][PLATFORM]["url"] = url
            SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print("shorts.json updated. Done \u2713")
            print(f"POST OK platform=x url={url or ''}", flush=True)

        except Exception as err:
            short["platforms"][PLATFORM]["status"] = "failed"
            short["platforms"][PLATFORM]["error"] = str(err)
            SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"\nFailed: {err}", file=sys.stderr)
            print(f"POST FAIL platform=x reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
