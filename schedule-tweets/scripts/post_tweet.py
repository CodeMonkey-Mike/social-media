# post_tweet.py — CANONICAL Python port of post-tweet.js (2026-08-11, posting-tail
# migration; the JS twin is FROZEN rollback). Status: PORTED, BLESS-PENDING — invoke
# the JS twin for production posts until this port is live-blessed with one real post.
#
# 1:1 port on playwright.sync_api: same xbot-profile Chrome, same selectors, same
# human-timing pauses (char delays / action pauses / pre-compose / pre-post waits),
# same image-attach fallback (image_path field -> glob by image_id in images/x/),
# same tweet-text verification against the typed textarea, same x-tweets.json
# write-back semantics (status/posted_at/url/hook fallback).
#
# Divergences from the JS twin (allowed by the porting spec — nothing else diverges):
#   - a final machine line on completion: `POST OK platform=x url=...` on success /
#     `POST FAIL platform=x reason=...` on failure (flush=True), for a LangGraph
#     wrapper to parse. Printed only where the JS itself resolves to a terminal
#     tweet.status of 'posted' or 'failed' (not on the early "no pending tweets" /
#     "skipped-too-long" returns, which the JS itself treats as distinct non-error
#     exits with no such signal).

import json
import math
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).resolve().parent
TWEETS_JSON = SCRIPT_DIR.parent / "data" / "x-tweets.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
WORKSPACE_ROOT = r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets"

CHAR_DELAY_MIN = 60
CHAR_DELAY_MAX = 150


def env_int(name, default):
    v = os.environ.get(name)
    return int(v) if v else default


ACTION_MIN = env_int("XT_ACTION_MIN", 4000)
ACTION_MAX = env_int("XT_ACTION_MAX", 7000)
PRE_COMPOSE_MIN = env_int("XT_PRE_COMPOSE_MIN", 60000)
PRE_COMPOSE_MAX = env_int("XT_PRE_COMPOSE_MAX", 180000)
PRE_POST_MIN = env_int("XT_PRE_POST_MIN", 5000)
PRE_POST_MAX = env_int("XT_PRE_POST_MAX", 180000)


def js_round(x):
    return math.floor(x + 0.5)


def now_iso_z():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def random_between(a, b):
    return random.randint(a, b)


def action_pause(page, label=""):
    ms = random_between(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {ms / 1000:.1f}s pause{f' ({label})' if label else ''}", flush=True)
    page.wait_for_timeout(ms)


def long_wait(page, min_ms, max_ms, label=""):
    ms = random_between(min_ms, max_ms)
    print(f"  waiting {js_round(ms / 1000)}s{f' ({label})' if label else ''}...", flush=True)
    page.wait_for_timeout(ms)


def mouse_click(page, locator):
    bbox = locator.bounding_box()
    if bbox and bbox["width"] > 0:
        page.mouse.click(bbox["x"] + bbox["width"] / 2, bbox["y"] + bbox["height"] / 2)
    else:
        locator.click()


def texts_match(a, b):
    def normalize(s):
        s = re.sub(r"\n{3,}", "\n\n", s)
        s = re.sub(r"\n+$", "", s)
        return s.strip()
    return normalize(a) == normalize(b)


def type_human(page, text):
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(random_between(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def wait_for_home_or_login(page, timeout_ms=30000):
    # Sync-API stand-in for the JS `Promise.race` between two waitForSelector calls:
    # there is no direct sync-API equivalent, so this polls both selectors for
    # visibility (matching waitForSelector's default 'visible' state) until one
    # appears or timeout_ms elapses — same outcome states, same timeout.
    deadline = time.monotonic() + timeout_ms / 1000
    while True:
        if page.locator('[data-testid="primaryColumn"]').first.is_visible():
            return "home"
        if page.locator('input[autocomplete="username"]').first.is_visible():
            return "login"
        if time.monotonic() >= deadline:
            return "unknown"
        page.wait_for_timeout(250)


def resolve_image_path(tweet):
    image_id = tweet.get("image_id")
    if not image_id:
        return None

    # Try image_path field first
    image_path = tweet.get("image_path")
    if image_path:
        # image_path is relative to workspace root, e.g. "schedule-tweets/images/x/..."
        # Strip leading "schedule-tweets/" since WORKSPACE_ROOT already points there
        rel = re.sub(r"^schedule-tweets[\\/]", "", image_path)
        abs_path = Path(WORKSPACE_ROOT) / rel
        if abs_path.exists():
            return str(abs_path)

    # Fallback: glob for <image_id>-*.png in images/x/
    x_dir = Path(WORKSPACE_ROOT) / "images" / "x"
    if x_dir.exists():
        for f in os.listdir(x_dir):
            if image_id in f:
                return str(x_dir / f)

    return None


def attach_image(page, image_path):
    print(f"  Attaching image: {image_path}")

    # X's composer has a hidden file input; Playwright can target it directly
    # Use .first — the page has two fileInput elements (modal + inline home composer)
    file_input = page.locator('input[data-testid="fileInput"]').first
    count = file_input.count()

    if count == 0:
        print("  Warning: fileInput not found \u2014 posting without image.")
        return False

    file_input.set_input_files(image_path)
    # Wait for upload preview to appear
    page.wait_for_timeout(3000)

    # Verify thumbnail rendered
    preview = page.locator('[data-testid="attachments"]')
    preview_count = preview.count()
    if preview_count > 0:
        print("  Image attached \u2713")
        return True

    print("  Warning: image thumbnail did not appear \u2014 proceeding without image.")
    return False


def main():
    data = json.loads(TWEETS_JSON.read_text(encoding="utf-8"))
    tweet = next((t for t in data["tweets"] if t.get("tweet") and t.get("status") == "pending"), None)

    if not tweet:
        print("No pending tweets. Exiting.")
        return

    print(f'Tweet: "{tweet.get("hook")}"')
    print(f"Chars: {len(tweet['tweet'])}")

    if len(tweet["tweet"]) > 25000:
        tweet["status"] = "skipped-too-long"
        TWEETS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print("Skipped \u2014 exceeds 25,000 chars.")
        return

    image_path = resolve_image_path(tweet)
    if tweet.get("image_id") and not image_path:
        print(f'  Warning: image_id {tweet["image_id"]} set but file not found \u2014 will post without image.')
    elif image_path:
        print(f"  Image: {image_path}")

    tweet["status"] = "posting"
    TWEETS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print("Launching Chrome...")

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
            page.goto("https://x.com/home")
            page.wait_for_load_state("load")

            state = wait_for_home_or_login(page, 30000)

            if state != "home":
                raise RuntimeError(
                    f"X did not load the home feed (state: {state}). Check that xbot-profile is logged in.")
            print("Home feed loaded.")

            # Open composer
            print("Pre-composer wait (60\u2013180s)...")
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            compose_btn = page.locator('[data-testid="SideNav_NewTweet_Button"]')
            mouse_click(page, compose_btn)
            page.wait_for_selector('[data-testid="tweetTextarea_0"]', timeout=10000)
            action_pause(page, "composer open")

            # Type the tweet
            textarea = page.locator('[data-testid="tweetTextarea_0"]').first
            textarea.click()
            page.keyboard.press("Control+Home")
            page.wait_for_timeout(500)

            print(f"Typing tweet ({len(tweet['tweet'])} chars)...")
            type_human(page, tweet["tweet"])
            page.wait_for_timeout(1000)

            typed = textarea.evaluate("el => el.innerText")
            if not texts_match(typed, tweet["tweet"]):
                raise RuntimeError(
                    f"Verification failed.\nExpected: {json.dumps(tweet['tweet'])}\nGot:      {json.dumps(typed)}")
            print("Tweet text verified \u2713")

            # Attach image if present
            if image_path:
                attach_image(page, image_path)

            # Post
            print("Pre-post wait (60\u2013180s)...")
            long_wait(page, PRE_POST_MIN, PRE_POST_MAX, "before Post")

            clicked = page.evaluate("""() => {
  const btns = Array.from(document.querySelectorAll('[data-testid="tweetButton"]'));
  const visible = btns.find(b =>
    b.offsetParent !== null &&
    b.getBoundingClientRect().width > 0 &&
    !b.disabled
  );
  if (visible) { visible.click(); return true; }
  return false;
}""")

            if not clicked:
                raise RuntimeError("Post button not found.")
            print("Clicked Post. Waiting for confirmation toast...")

            toast = page.locator('[data-testid="toast"]')
            toast.wait_for(timeout=15000)

            tweet_url = toast.evaluate("""el => {
  const a = el.querySelector('a[href*="/status/"]');
  return a ? 'https://x.com' + a.getAttribute('href') : null;
}""")

            if tweet_url:
                print(f"Tweet live at: {tweet_url}")
            else:
                print("Tweet live \u2014 could not extract URL from toast.")

            tweet["status"] = "posted"
            tweet["posted_at"] = now_iso_z()
            tweet["url"] = tweet_url
            if not tweet.get("hook"):
                tweet["hook"] = tweet["tweet"].split("\n")[0][:100]
            TWEETS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print("x-tweets.json updated. Done.")
            print(f"POST OK platform=x url={tweet_url or ''}", flush=True)

        except Exception as err:
            tweet["status"] = "failed"
            tweet["error"] = str(err)
            TWEETS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"\nPosting failed: {err}", file=sys.stderr)
            print(f"POST FAIL platform=x reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
            browser.close()


if __name__ == "__main__":
    main()
