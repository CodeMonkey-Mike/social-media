# post_thread.py — CANONICAL Python port of post-thread.js (2026-08-11, posting-tail
# migration; the JS twin is FROZEN rollback). Status: PORTED, BLESS-PENDING — invoke
# the JS twin for production posts until this port is live-blessed with one real post.
#
# 1:1 port on playwright.sync_api: same xbot-profile Chrome, same selectors, same
# stuck-in-'posting' manual-review bail, same char_count pre-flight validation, same
# duplicate-thread pre-check against the home feed, same tweet-1..N reply-chain typing
# + per-tweet verification, same post-publish root-page walk that re-matches every
# tweet by text snippet before gating status on `verified`, same x-threads.json
# write-back semantics (thread_root_url / posted_at / per-tweet posted_url / status).
#
# Divergences from the JS twin (allowed by the porting spec — nothing else diverges):
#   - a final machine line: `POST OK platform=x url=...` on success / `POST FAIL
#     platform=x reason=...` on failure (flush=True), for a LangGraph wrapper to
#     parse. Printed at every point the JS itself writes a terminal thread.status of
#     'posted' or 'failed' (char_count validation fail, duplicate-detected-posted,
#     verified/unverified gate, and the outer catch) — NOT on the early "no eligible
#     threads" / stuck-in-'posting' exits, which the JS treats as distinct non-error
#     exits that never touch thread.status.

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
THREADS_JSON = SCRIPT_DIR.parent / "data" / "x-threads.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"

# Timing constants — mirrored from reply-guy post_replies.py
CHAR_DELAY_MIN = 60    # ms per keystroke
CHAR_DELAY_MAX = 150


def env_int(name, default):
    v = os.environ.get(name)
    return int(v) if v else default


ACTION_MIN = env_int("XTH_ACTION_MIN", 4000)          # ms between UI actions
ACTION_MAX = env_int("XTH_ACTION_MAX", 7000)
PRE_COMPOSE_MIN = env_int("XTH_PRE_COMPOSE_MIN", 60000)  # ms before opening composer (60-180s)
PRE_COMPOSE_MAX = env_int("XTH_PRE_COMPOSE_MAX", 180000)
PRE_POST_MIN = env_int("XTH_PRE_POST_MIN", 60000)     # ms before clicking Post all
PRE_POST_MAX = env_int("XTH_PRE_POST_MAX", 180000)


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


def click_post_button(page):
    return page.evaluate("""() => {
  const testids = ['tweetButton'];
  for (const tid of testids) {
    const btns = Array.from(document.querySelectorAll(`[data-testid="${tid}"]`));
    const visible = btns.find(b =>
      b.offsetParent !== null &&
      b.getBoundingClientRect().width > 0 &&
      !b.disabled
    );
    if (visible) { visible.click(); return tid; }
  }
  return null;
}""")


def main():
    data = json.loads(THREADS_JSON.read_text(encoding="utf-8"))

    # Bail if anything is stuck in 'posting' — those need manual review. The
    # prior behavior auto-picked up 'posting' threads, which would re-post any
    # thread whose prior run died after submission but before status flipped.
    stuck = [t for t in data["threads"] if t.get("status") == "posting"]
    if stuck:
        print(f"{len(stuck)} thread(s) stuck in 'posting' \u2014 manual review required:", file=sys.stderr)
        for t in stuck:
            snippet = ((t.get("tweets") or [{}])[0].get("text") or "")[:60]
            print(f"  - {t.get('id')}: \"{snippet}\"", file=sys.stderr)
        print("Check x.com to see if any actually published, then update data/x-threads.json before retrying.",
              file=sys.stderr)
        sys.exit(2)

    thread = next((t for t in data["threads"] if t.get("status") == "pending"), None)

    if not thread:
        print("No eligible threads. Exiting.")
        return

    print(f"Processing: {thread['id']} (status: {thread['status']})")
    tweets = thread["tweets"]

    for t in tweets:
        if t["char_count"] > 25000:
            thread["status"] = "failed"
            thread["validation_error"] = f"Tweet {t['position']} exceeds 25,000 chars"
            THREADS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(thread["validation_error"], file=sys.stderr)
            print(f"POST FAIL platform=x reason={thread['validation_error'][:120]}", flush=True)
            sys.exit(1)

    thread["status"] = "posting"
    THREADS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

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

            # Duplicate check — scan visible tweet texts for the first ~40 chars of tweet 1
            hook = tweets[0]["text"][:40]
            tweet_texts = page.locator('[data-testid="tweetText"]').all_text_contents()
            if any(t.startswith(hook) for t in tweet_texts):
                print("Duplicate detected \u2014 thread already live. Marking posted, exiting.")
                thread["status"] = "posted"
                THREADS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
                print("POST OK platform=x url= note=duplicate-already-live", flush=True)
                return

            # Open composer
            print("Pre-composer wait (60\u2013180s)...")
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            compose_btn = page.locator('[data-testid="SideNav_NewTweet_Button"]')
            mouse_click(page, compose_btn)
            page.wait_for_selector('[data-testid="tweetTextarea_0"]', timeout=10000)
            action_pause(page, "composer open")

            # Tweet 1 — .first because the home feed has an inline tweetTextarea_0 too
            print(f"Typing tweet 1/{len(tweets)} ({tweets[0]['char_count']} chars)...")
            first = page.locator('[data-testid="tweetTextarea_0"]').first
            first.click()
            page.keyboard.press("Control+Home")
            page.wait_for_timeout(500)
            type_human(page, tweets[0]["text"])
            page.wait_for_timeout(1000)

            got0 = first.evaluate("el => el.innerText")
            if not texts_match(got0, tweets[0]["text"]):
                raise RuntimeError(
                    f"Tweet 1 verification failed.\n"
                    f"Expected: {json.dumps(tweets[0]['text'])}\nGot:      {json.dumps(got0)}")
            print("Tweet 1 verified \u2713")

            # Tweets 2-N
            for i in range(1, len(tweets)):
                action_pause(page, "before addButton")

                # Target only the <BUTTON> with addButton testid — the nav link is an <A>, so
                # the `button` tag selector naturally excludes it without needing ancestor scoping.
                add_btn = page.locator('button[data-testid="addButton"]')
                mouse_click(page, add_btn)

                page.wait_for_selector(f'[data-testid="tweetTextarea_{i}"]', timeout=10000)
                action_pause(page, f"textarea {i} ready")

                ta = page.locator(f'[data-testid="tweetTextarea_{i}"]')
                ta.click()
                page.keyboard.press("Control+Home")
                page.wait_for_timeout(500)
                print(f"Typing tweet {i + 1}/{len(tweets)} ({tweets[i]['char_count']} chars)...")
                type_human(page, tweets[i]["text"])
                page.wait_for_timeout(1000)

                got = ta.evaluate("el => el.innerText")
                if not texts_match(got, tweets[i]["text"]):
                    raise RuntimeError(
                        f"Tweet {i + 1} verification failed.\n"
                        f"Expected: {json.dumps(tweets[i]['text'])}\nGot:      {json.dumps(got)}")
                print(f"Tweet {i + 1} verified \u2713")

            # Post
            print("Pre-post wait (60\u2013180s)...")
            long_wait(page, PRE_POST_MIN, PRE_POST_MAX, "before Post all")

            clicked = click_post_button(page)
            if not clicked:
                raise RuntimeError("Post button not found via JS evaluate")
            print(f"Clicked Post button ({clicked}). Waiting for confirmation toast...")

            toast = page.locator('[data-testid="toast"]')
            toast.wait_for(timeout=15000)

            # Extract the tweet URL from the "View" anchor inside the toast before clicking anything.
            # Clicking the toast itself navigates to /home on some X versions — the href is more reliable.
            root_url = toast.evaluate("""el => {
  const a = el.querySelector('a[href*="/status/"]');
  return a ? 'https://x.com' + a.getAttribute('href') : null;
}""")

            if root_url:
                print(f"Thread live at: {root_url}")
            else:
                print("Thread live \u2014 could not extract URL from toast.")

            # --- Post-publish verification: walk the thread root page -----------------
            # Confirms every tweet in the thread actually rendered live AND captures
            # individual posted_url for each. Without this, a partial-thread silent
            # failure (first tweet posted, replies dropped) still produces a valid root
            # URL and marks all N tweets as posted. End-of-flow goto is acceptable
            # here — the post is already submitted and the browser closes after.
            verified = False
            per_tweet_urls = [None] * len(tweets)

            if root_url:
                print(f"\nVerifying thread on root page: {root_url}")
                try:
                    resp = page.goto(root_url, wait_until="domcontentloaded", timeout=30000)
                    http_status = resp.status if resp else 0
                    print(f"  HTTP {http_status}")
                    page.wait_for_timeout(random_between(3500, 5500))

                    # Snapshot articles + their text + their status URL
                    on_page = page.evaluate("""() => {
  const articles = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
  return articles.map(a => {
    const textEl = a.querySelector('[data-testid="tweetText"]');
    const linkEl = a.querySelector('a[href*="/status/"][role="link"]');
    return {
      text: textEl ? textEl.innerText : '',
      href: linkEl ? linkEl.getAttribute('href') : null,
    };
  });
}""")
                    print(f"  Found {len(on_page)} tweet articles on page (expected {len(tweets)})")

                    def norm(s):
                        return re.sub(r"\s+", " ", s).strip()

                    matched = 0
                    for i in range(len(tweets)):
                        expected = norm(tweets[i]["text"][:40])
                        hit = next((o for o in on_page if expected in norm(o["text"])), None)
                        if hit and hit.get("href"):
                            per_tweet_urls[i] = "https://x.com" + hit["href"]
                            matched += 1
                    print(f"  Matched {matched}/{len(tweets)} tweets by text snippet")

                    if 200 <= http_status < 400 and matched == len(tweets):
                        verified = True
                        print("  Verified \u2713 \u2014 every thread tweet is live")
                    else:
                        print(f"  Verification failed \u2014 {len(tweets) - matched} tweet(s) missing on the page")
                except Exception as e:
                    print(f"  Verification error: {e}")
            else:
                print("  Skipping verification \u2014 no root URL captured")

            # Gate status on verification
            thread["thread_root_url"] = root_url
            thread["posted_at"] = now_iso_z()
            for i in range(len(tweets)):
                if per_tweet_urls[i]:
                    tweets[i]["posted_url"] = per_tweet_urls[i]

            if root_url and verified:
                thread["status"] = "posted"
                thread.pop("error", None)
                print("threads.json updated (verified posted). Done.")
            else:
                thread["status"] = "failed"
                thread["error"] = (
                    f"Root captured but verification failed \u2014 possible partial thread: {root_url}"
                    if root_url else "No root URL captured")
                print(f"threads.json marked failed: {thread['error']}")
            THREADS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

            if thread["status"] == "posted":
                print(f"POST OK platform=x url={root_url or ''}", flush=True)
            else:
                print(f"POST FAIL platform=x reason={thread['error'].splitlines()[0][:120]}", flush=True)

        except Exception as err:
            thread["status"] = "failed"
            thread["error"] = str(err)
            THREADS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"\nPosting failed: {err}", file=sys.stderr)
            print(f"POST FAIL platform=x reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
            browser.close()


if __name__ == "__main__":
    main()
