# post_x_poll.py — CANONICAL Python port of post-x-poll.js (2026-08-11, posting-tail
# migration; the JS twin is FROZEN rollback). Status: PORTED, BLESS-PENDING — invoke
# the JS twin for production posts until this port is live-blessed with one real post.
# Posts one pending X poll from data/x-polls.json. Same human-timing pattern as
# post_tweet.py (char delays, action pauses, pre-compose wait).
#
# 1:1 port on playwright.sync_api: same xbot-profile Chrome, same stuck-in-'posting'
# manual-review bail, same profile-page duplicate pre-check (startsWith, not includes
# — a substring cross-match once false-marked a poll posted without ever sending it),
# same composer-overlay-proof robust click (plain click, JS-click fallback) for the
# poll button / add-choice button, same overlay-proof fill() (not click+type) for
# choice inputs, same el.disabled DOM-property check (not the disabled attribute) for
# the hours/minutes selects, same hardcoded 7-day duration regardless of poll.duration,
# same x-polls.json write-back semantics.
#
# Divergences from the JS twin (allowed by the porting spec — nothing else diverges):
#   - a final machine line: `POST OK platform=x url=...` on success / `POST FAIL
#     platform=x reason=...` on failure (flush=True), for a LangGraph wrapper to
#     parse. Printed at every point the JS itself writes a terminal poll.status of
#     'posted' or 'failed' (duplicate-detected-posted, full-flow success, outer
#     catch) — NOT on the early "no pending polls" / stuck-in-'posting' exits, which
#     the JS treats as distinct non-error exits that never touch poll.status.

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
POLLS_JSON = SCRIPT_DIR.parent / "data" / "x-polls.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
PROFILE_URL = "https://x.com/mikeneder"

CHAR_DELAY_MIN = 60
CHAR_DELAY_MAX = 150


def env_int(name, default):
    v = os.environ.get(name)
    return int(v) if v else default


ACTION_MIN = env_int("XP_ACTION_MIN", 4000)
ACTION_MAX = env_int("XP_ACTION_MAX", 7000)
PRE_COMPOSE_MIN = env_int("XP_PRE_COMPOSE_MIN", 60000)
PRE_COMPOSE_MAX = env_int("XP_PRE_COMPOSE_MAX", 180000)
PRE_POST_MIN = env_int("XP_PRE_POST_MIN", 5000)
PRE_POST_MAX = env_int("XP_PRE_POST_MAX", 180000)

# [days, hours, minutes]
DURATION_MAP = {
    "5m": [0, 0, 5],
    "1h": [0, 1, 0],
    "1d": [1, 0, 0],
    "7d": [7, 0, 0],
}


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


# Robust click for the composer toolbar. X overlays a transparent full-cover
# drag-drop dropzone (div[class*="r-1xcajam"], position:absolute inset:0) on top of
# the composer, which intercepts ALL coordinate-based clicks (raw mouse.click AND
# Playwright's hit-tested .click()) — this is what broke the poll button on
# 2026-06-07/08. So: try a normal click briefly, then fall back to the element's
# native .click() via JS, which dispatches straight to the button (React's delegated
# onClick still fires) and bypasses the overlay entirely.
def robust_click(locator, label="element"):
    try:
        locator.click(timeout=5000)
    except Exception as err:
        print(f"  {label}: normal click blocked ({str(err).splitlines()[0]}); using JS click")
        locator.evaluate("el => el.click()")


def type_human(page, text):
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(random_between(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def texts_match(a, b):
    def normalize(s):
        s = re.sub(r"\n{3,}", "\n\n", s)
        s = re.sub(r"\n+$", "", s)
        return s.strip()
    return normalize(a) == normalize(b)


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


def check_already_posted(page, poll):
    print("Pre-check: scanning profile for duplicate...")
    try:
        page.goto(PROFILE_URL)
        try:
            page.wait_for_load_state("load", timeout=20000)
        except Exception:
            pass
        page.wait_for_timeout(random_between(3000, 5000))

        # Scroll down to trigger lazy-loading of posts below the fold
        page.evaluate("() => window.scrollBy(0, 1500)")
        page.wait_for_timeout(2000)
        page.evaluate("() => window.scrollBy(0, 1500)")
        page.wait_for_timeout(2000)

        recent_texts = page.evaluate("""() => {
  const els = document.querySelectorAll('[data-testid="tweetText"]');
  return [...els].slice(0, 30).map(el => el.innerText.trim().toLowerCase());
}""")

        hook = (poll.get("hook") or poll["tweet_text"].split("\n")[0]).strip().lower()[:60]

        # Use startswith, NOT "in": a genuine duplicate poll's profile text
        # begins with its own hook (first line). A substring match cross-matched a
        # poll against an unrelated TWEET that merely quoted the same sentence mid-body
        # (2026-06-20: poll "The Kaspa hard fork is almost here." false-matched a
        # tweet whose body contained that sentence -> poll marked posted, never sent).
        for text in recent_texts:
            if hook and text.startswith(hook):
                print(f'  Duplicate found: "{text[:80]}"')
                return True
        print(f"  Not found in {len(recent_texts)} recent posts \u2713")
        return False
    except Exception as err:
        print(f"  Pre-check error (ignoring): {err}")
        return False


def set_poll_duration(page, duration):
    days, hours, minutes = DURATION_MAP.get(duration, DURATION_MAP["1d"])
    print(f"  Setting duration: {duration} \u2192 {days}d {hours}h {minutes}m")

    # Confirmed data-testid values from live DOM inspection (2026-05-20)
    d_sel = '[data-testid="selectPollDays"]'
    h_sel = '[data-testid="selectPollHours"]'
    m_sel = '[data-testid="selectPollMinutes"]'

    d_el = page.locator(d_sel).first
    if d_el.count() > 0:
        d_el.select_option(value=str(days))
        page.wait_for_timeout(random_between(700, 1200))

        # When days = 7, X disables Hours and Minutes (max duration is 7d 0h 0m).
        # Skip setting them when disabled.
        h_loc = page.locator(h_sel).first
        try:
            h_disabled = h_loc.evaluate("el => el.disabled")
        except Exception:
            h_disabled = True
        if not h_disabled:
            h_loc.select_option(value=str(hours))
            page.wait_for_timeout(random_between(700, 1200))
        else:
            print("  Hours select disabled (max duration reached) \u2014 skipping")

        m_loc = page.locator(m_sel).first
        try:
            m_disabled = m_loc.evaluate("el => el.disabled")
        except Exception:
            m_disabled = True
        if not m_disabled:
            m_loc.select_option(value=str(minutes))
        else:
            print("  Minutes select disabled \u2014 skipping")
        print("  Duration set \u2713")
        return

    print("  Warning: duration selects not found \u2014 using default (1d)")


def main():
    data = json.loads(POLLS_JSON.read_text(encoding="utf-8"))

    # Bail if anything is stuck in 'posting' — those need manual review. The
    # prior auto-reset caused duplicates by re-queueing polls whose previous
    # run succeeded on X but died before flipping the JSON status.
    stuck = [p for p in data["polls"] if p.get("status") == "posting"]
    if stuck:
        print(f"{len(stuck)} poll(s) stuck in 'posting' \u2014 manual review required:", file=sys.stderr)
        for p in stuck:
            snippet = (p.get("hook") or p.get("tweet_text") or "")[:60]
            print(f"  - {p.get('id')}: \"{snippet}\"", file=sys.stderr)
        print("Check x.com to see if any actually published, then update data/x-polls.json before retrying.",
              file=sys.stderr)
        sys.exit(2)

    poll = next((p for p in data["polls"] if p.get("status") == "pending"), None)
    if not poll:
        print("No pending polls. Exiting.")
        return

    # Validate option lengths (X cap: 25 chars)
    for i, opt in enumerate(poll["options"]):
        if len(opt) > 25:
            print(f'  Warning: option {i + 1} is {len(opt)} chars (> 25): "{opt}"', file=sys.stderr)

    print(f'\nPoll: "{poll["hook"]}"')
    print(f"Text: {len(poll['tweet_text'])} chars")
    print(f"Options ({len(poll['options'])}): [{' | '.join(poll['options'])}]")
    print(f"Duration: {poll['duration']}")

    poll["status"] = "posting"
    POLLS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

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
            # Confirm logged in
            page.goto("https://x.com/home")
            page.wait_for_load_state("load")

            state = wait_for_home_or_login(page, 30000)

            if state != "home":
                raise RuntimeError(f"X home feed not loaded (state: {state}). Check xbot-profile is logged in.")
            print("Home feed loaded.")

            # Pre-check on profile page
            duplicate = check_already_posted(page, poll)
            if duplicate:
                poll["status"] = "posted"
                poll["posted_at"] = now_iso_z()
                poll["note"] = "Already posted: detected in pre-check"
                POLLS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
                print("Marked as posted (duplicate). Done.")
                print("POST OK platform=x url= note=duplicate-already-live", flush=True)
                return

            # Back to home before composing
            page.goto("https://x.com/home")
            page.wait_for_load_state("load")
            page.wait_for_selector('[data-testid="primaryColumn"]', timeout=15000)

            # Pre-compose wait
            print("\nPre-composer wait (60\u2013180s)...")
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            # Open composer
            compose_btn = page.locator('[data-testid="SideNav_NewTweet_Button"]')
            mouse_click(page, compose_btn)
            page.wait_for_selector('[data-testid="tweetTextarea_0"]', timeout=10000)
            action_pause(page, "composer open")

            # Type tweet text
            textarea = page.locator('[data-testid="tweetTextarea_0"]').first
            textarea.click()
            page.keyboard.press("Control+Home")
            page.wait_for_timeout(500)

            print(f"Typing tweet text ({len(poll['tweet_text'])} chars)...")
            type_human(page, poll["tweet_text"])
            page.wait_for_timeout(1000)

            typed = textarea.evaluate("el => el.innerText")
            if not texts_match(typed, poll["tweet_text"]):
                raise RuntimeError(
                    f"Text verification failed.\n"
                    f"Expected: {json.dumps(poll['tweet_text'])}\nGot:      {json.dumps(typed)}")
            print("Tweet text verified \u2713")
            action_pause(page, "after typing")

            # Click the poll button in the composer toolbar.
            # testid "createPollButton" confirmed unchanged (DOM recapture 2026-06-08).
            # IMPORTANT: use Playwright's locator.click(), NOT a raw mouse.click() at
            # coordinates. The toolbar buttons are 36px wide and packed together (poll sits
            # beside GIF/Grok/location); raw-coordinate clicks land on an adjacent button when
            # the layout shifts, so the poll widget never opens (caused the 2026-06-07/08
            # selectPollDays timeouts — nothing was wrong with the selector). Target a :visible
            # instance because a hidden duplicate createPollButton can exist in the DOM.
            print("Opening poll widget...")
            poll_btn = page.locator('[data-testid="createPollButton"]:visible').first
            if poll_btn.count() == 0:
                raise RuntimeError("Poll button (createPollButton) not found in composer.")
            robust_click(poll_btn, "poll button")

            # Wait for poll duration select — confirms widget is fully open
            page.wait_for_selector('[data-testid="selectPollDays"]', timeout=10000)
            action_pause(page, "poll widget open")

            # Choice inputs have NO placeholder and NO data-testid (confirmed from DOM inspection).
            # They're the only text inputs matching this pattern in the composer.
            choice_sel = 'input[type="text"]:not([data-testid]):not([placeholder])'

            # Fill each option
            print("Filling poll options...")
            for i, opt in enumerate(poll["options"]):
                # Options 3 and 4 need "Add a choice" clicked first
                # Confirmed data-testid from live DOM inspection (2026-05-20): "addPollChoice"
                if i >= 2:
                    add_btn = page.locator('[data-testid="addPollChoice"]:visible').first
                    if add_btn.count() == 0:
                        raise RuntimeError(f'"Add a choice" button not found for option {i + 1}')
                    robust_click(add_btn, "add choice")
                    page.wait_for_timeout(random_between(1000, 2000))
                    page.wait_for_function(
                        "({ sel, count }) => document.querySelectorAll(sel).length >= count",
                        arg={"sel": choice_sel, "count": i + 1},
                        timeout=6000)
                    print(f"  Added choice {i + 1}")

                input_loc = page.locator(choice_sel).nth(i)
                # Use fill(), NOT click()+type. The composer dropzone overlay intercepts pointer
                # events, so click-to-focus is unreliable (left option 2 empty on a JS-click focus
                # race 2026-06-08). fill() focuses + sets the value + fires React's input event
                # without a pointer hit-test — overlay-proof and deterministic.
                print(f'  Filling option {i + 1}: "{opt}"')
                input_loc.fill(opt)
                page.wait_for_timeout(random_between(400, 900))

                val = input_loc.input_value()
                if val.strip() != opt.strip():
                    raise RuntimeError(f'Option {i + 1} verification failed: expected "{opt}" got "{val}"')
                print(f'  Option {i + 1} confirmed: "{val}" \u2713')
                page.wait_for_timeout(random_between(400, 900))

            # Always post with 7-day duration regardless of what's in the JSON
            set_poll_duration(page, "7d")
            action_pause(page, "after poll config")

            # Pre-post wait
            print("\nPre-post wait...")
            long_wait(page, PRE_POST_MIN, PRE_POST_MAX, "before Post")

            # Click Post
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
                raise RuntimeError("Post button not found or still disabled.")
            print("Clicked Post. Waiting for toast...")

            # Grab URL from confirmation toast
            toast = page.locator('[data-testid="toast"]')
            toast.wait_for(timeout=15000)

            poll_url = toast.evaluate("""el => {
  const a = el.querySelector('a[href*="/status/"]');
  return a ? 'https://x.com' + a.getAttribute('href') : null;
}""")

            if poll_url:
                print(f"\nPoll live at: {poll_url}")
            else:
                print("\nPoll live \u2014 could not extract URL from toast.")

            poll["status"] = "posted"
            poll["posted_at"] = now_iso_z()
            poll["poll_url"] = poll_url
            poll.pop("error", None)
            POLLS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print("x-polls.json updated. Done \u2713")
            print(f"POST OK platform=x url={poll_url or ''}", flush=True)

        except Exception as err:
            poll["status"] = "failed"
            poll["error"] = str(err)
            POLLS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"\nFailed: {err}", file=sys.stderr)
            print(f"POST FAIL platform=x reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
            browser.close()


if __name__ == "__main__":
    main()
