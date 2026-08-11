# post_yt_poll.py — CANONICAL Python port of post-yt-poll.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
# Status: PORTED, BLESS-PENDING — invoke the JS twin for production posts until
# this port is live-blessed with one real post.
#
# YouTube text-poll poster.
# Working approach (2026-05-21):
#   - Use #poll-button button (NOT [aria-label="Poll"] — that matches feed elements).
#   - After clicking, the poll attachment becomes visible and host inputs have real dimensions.
#   - Real CDP keystrokes (page.keyboard.type) so Polymer's two-way binding AND YouTube's
#     submission state both update (insert_text does not update submission state).
#   - The DOM has two button[aria-label="Post"]: a hidden placeholder (0x0, disabled) and the
#     real visible Post button (61x36, lower-right of composer). Pick the one with non-zero rect.
#
# Timing mirrors scripts/post-thread.js — character-by-character typing for question AND options,
# 30-90s pre-composer / pre-post pauses (halved 2026-06-14), 2-3.5s between UI actions.
#
# 1:1 port on playwright.sync_api. Same #poll-button dispatch-click, same real-input targeting
# (not host-coordinate clicks) for option fields with the add-option-as-needed sub-loop, same
# robustClick (Playwright click -> JS-click fallback) used for every composer interaction after
# the 2026-06-10/2026-06-14 fixes, same two-button Post trap (hidden 0x0 placeholder + real
# visible button) resolved by waiting for an enabled non-zero-rect button, same post-check URL
# diff (no body/image verification — that's the community poster only). Documented divergences
# ONLY: final machine line (POST OK/FAIL platform=yt-poll) for the graph.
import json
import math
import os
import random
import socket
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

YT_JSON = Path(__file__).resolve().parent.parent / "data" / "yt-text-polls.json"
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile"
CDP_PORT = 9223
CHANNEL_HANDLE = "CodeMonkeyMike"
POSTS_URL = f"https://www.youtube.com/@{CHANNEL_HANDLE}/posts"
HOST_SEL = "tp-yt-paper-input.poll-option-input"

# Timing constants — mirrored from scripts/post-thread.js
CHAR_DELAY_MIN = 60  # ms per keystroke
CHAR_DELAY_MAX = 150
ACTION_MIN = int(os.environ.get("YTP_ACTION_MIN", 2000))  # ms between UI actions (halved 2026-06-14)
ACTION_MAX = int(os.environ.get("YTP_ACTION_MAX", 3500))
PRE_COMPOSE_MIN = int(os.environ.get("YTP_PRE_COMPOSE_MIN", 30000))  # ms before opening composer (30-90s)
PRE_COMPOSE_MAX = int(os.environ.get("YTP_PRE_COMPOSE_MAX", 90000))
PRE_POST_MIN = int(os.environ.get("YTP_PRE_POST_MIN", 30000))  # ms before clicking Post (30-90s)
PRE_POST_MAX = int(os.environ.get("YTP_PRE_POST_MAX", 90000))


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


def type_human(page, text):
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(random_between(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


# Click that survives composer overlays / custom Polymer handlers: try Playwright's
# actionability-checked click, fall back to a native JS click dispatched on the element.
def robust_click(locator, label=""):
    try:
        locator.click(timeout=5000)
    except Exception:
        print(f"  {label}: normal click blocked — using JS click")
        locator.evaluate("el => el.click()")


def is_cdp_ready():
    try:
        with socket.create_connection(("127.0.0.1", CDP_PORT), timeout=0.6):
            return True
    except OSError:
        return False


def start_chrome():
    if is_cdp_ready():
        print(f"Chrome already on port {CDP_PORT} \u2713")
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

    for _ in range(24):
        time.sleep(0.5)
        if is_cdp_ready():
            print(f"Chrome ready on port {CDP_PORT} \u2713")
            return proc
    raise RuntimeError(f"Chrome did not open port {CDP_PORT} within 12s. Close all Chrome windows and re-run.")


def get_recent_post_urls(page, count=5):
    page.goto(POSTS_URL)
    try:
        page.wait_for_load_state("domcontentloaded", timeout=30000)
    except Exception:
        pass
    page.wait_for_timeout(random_between(2500, 4000))
    return page.evaluate(
        """(n) => {
            const seen = new Set();
            const urls = [];
            for (const a of document.querySelectorAll('a[href*="/post/"]')) {
                const url = a.href.replace(/[?#].*$/, '');
                if (!seen.has(url)) { seen.add(url); urls.push(url); if (urls.length >= n) break; }
            }
            return urls;
        }""",
        count,
    )


# -- Main --------------------------------------------------------------------------

def main():
    data = json.loads(YT_JSON.read_text(encoding="utf-8"))
    poll = next((p for p in data["polls"] if p["status"] == "pending"), None)
    if not poll:
        print("No pending YouTube polls. Exiting.")
        return

    print(f'Poll: "{poll["hook"][:80]}..."')
    print(f"Question: {len(poll['question_text'])} chars")
    print(f"Options ({len(poll['options'])}): {json.dumps(poll['options'], separators=(',', ':'))}")

    for opt in poll["options"]:
        if len(opt) > 65:
            print(f'FATAL: option too long: "{opt}"', file=sys.stderr)
            sys.exit(1)

    chrome_proc = start_chrome()

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{CDP_PORT}")
        ctx = browser.contexts[0]
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        try:
            # Login check
            print("\nNavigating to YouTube...", flush=True)
            page.goto("https://www.youtube.com/")
            try:
                page.wait_for_load_state("domcontentloaded", timeout=30000)
            except Exception:
                pass
            action_pause(page, "after YouTube load")
            avatar = page.locator("#avatar-btn, button#avatar-btn, ytd-topbar-menu-button-renderer").count()
            if avatar == 0:
                raise RuntimeError("Not logged in to YouTube in ytbot-profile.")
            print("Logged in \u2713")

            # Capture pre-state for post-check
            pre_urls = get_recent_post_urls(page, 5)

            # Mark mid-flight
            poll["status"] = "posting"
            save(data)

            # Pre-composer human pause (60–180s)
            print("Pre-composer wait (60–180s)...")
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            # Navigate to composer
            print("\nOpening composer...", flush=True)
            page.goto(POSTS_URL)
            try:
                page.wait_for_load_state("domcontentloaded", timeout=30000)
            except Exception:
                pass
            action_pause(page, "posts page settled")

            # Expand composer
            print("Expanding composer...")
            try:
                page.locator("#placeholder-area").first.click(timeout=5000)
            except Exception:
                pass
            action_pause(page, "composer expanded")

            ta = page.locator('#contenteditable-root[contenteditable="true"]').first
            ta.wait_for(state="visible", timeout=10000)
            ta.click()
            page.wait_for_timeout(random_between(400, 800))

            # Type question character-by-character with human delays
            print(f"Typing question ({len(poll['question_text'])} chars)...")
            type_human(page, poll["question_text"])
            action_pause(page, "after question")

            # Click the correct poll button
            print("Clicking #poll-button button...")
            poll_btn = page.locator("#poll-button button").first
            poll_btn.wait_for(state="attached", timeout=8000)
            poll_btn.dispatch_event("click")
            action_pause(page, "after poll button")

            attach_visible = page.evaluate(
                """() => {
                    const el = document.querySelector('ytd-poll-attachment');
                    return el ? window.getComputedStyle(el).display : 'not found';
                }"""
            )
            print(f"Poll attachment display: {attach_visible}")
            if attach_visible == "none":
                raise RuntimeError("Poll attachment hidden after clicking #poll-button button")

            # Scroll to top
            page.evaluate("() => window.scrollTo({ top: 0, behavior: 'instant' })")
            page.wait_for_timeout(random_between(700, 1100))

            # Fill option fields — target the INNER <input> directly (NOT raw host coords).
            # The old approach computed the host's bounding-box center and did page.mouse.click(x,y)
            # to focus — that coordinate click missed the input (each row is [remove-X][input]),
            # so text never entered (host.value=null) and the widget degraded, which then made the
            # coordinate-based add-option click miss too (30s hang). Fix (2026-06-10): click the
            # actual <input> element (Playwright actionability-checked) + robustClick for add-option.
            opt_input_sel = f"{HOST_SEL} input"  # tp-yt-paper-input.poll-option-input input
            print(f"Filling {len(poll['options'])} poll options...")
            page.locator(opt_input_sel).first.wait_for(state="attached", timeout=10000)

            for i in range(len(poll["options"])):
                # Ensure enough option fields exist (composer starts with 2)
                current_inputs = page.locator(opt_input_sel).count()
                while current_inputs <= i:
                    print(f"  Adding option field (have {current_inputs}, need {i + 1})...")
                    add_btn = page.locator("#add-option button").first
                    try:
                        add_btn.scroll_into_view_if_needed()
                    except Exception:
                        pass
                    robust_click(add_btn, "#add-option")
                    page.wait_for_function(
                        "({ sel, n }) => document.querySelectorAll(sel).length > n",
                        {"sel": opt_input_sel, "n": current_inputs},
                        timeout=8000,
                    )
                    current_inputs = page.locator(opt_input_sel).count()
                    action_pause(page, f"field {i + 1} added")

                inp = page.locator(opt_input_sel).nth(i)
                try:
                    inp.scroll_into_view_if_needed()
                except Exception:
                    pass

                # Focus the real input element (actionability-checked), then type real keystrokes —
                # real CDP keystrokes update Polymer's two-way binding AND YouTube's submission state.
                print(f'  Typing option {i + 1}: "{poll["options"][i]}"')
                robust_click(inp, f"option {i + 1} input")
                page.wait_for_timeout(random_between(300, 600))
                page.keyboard.press("Control+A")
                page.keyboard.press("Delete")
                type_human(page, poll["options"][i])

                try:
                    actual = inp.input_value()
                except Exception:
                    actual = None
                mark = "\u2713" if actual == poll["options"][i] else "\u26a0"
                print(f'  Option {i + 1}: value="{actual}" {mark}')
                if actual != poll["options"][i]:
                    # Last-resort: native value set + input event (Polymer listens to bubbling 'input')
                    inp.fill(poll["options"][i])
                    try:
                        retry = inp.input_value()
                    except Exception:
                        retry = None
                    mark = "\u2713" if retry == poll["options"][i] else "\u26a0"
                    print(f'  Option {i + 1} (fill retry): value="{retry}" {mark}')
                    if retry != poll["options"][i]:
                        raise RuntimeError(f'Option {i + 1} text did not register ("{retry}")')

                action_pause(page, f"after option {i + 1}")

            # Wait for the VISIBLE Post button to enable.
            # DOM contains a hidden placeholder button[aria-label="Post"] (0x0) and the real one.
            print("\nWaiting for visible Post button to enable...", flush=True)
            try:
                handle = page.wait_for_function(
                    """() => {
                        const btns = [...document.querySelectorAll('button[aria-label="Post"]')];
                        for (const btn of btns) {
                            const r = btn.getBoundingClientRect();
                            const enabled = !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
                            if (r.width > 0 && r.height > 0 && enabled) {
                                return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
                            }
                        }
                        return false;
                    }""",
                    timeout=10000,
                )
                post_coords = handle.json_value()
            except Exception:
                info = page.evaluate(
                    """() => {
                        const btns = [...document.querySelectorAll('button[aria-label="Post"]')];
                        return btns.map(b => {
                            const r = b.getBoundingClientRect();
                            return { x: r.left + r.width / 2, y: r.top + r.height / 2,
                                     w: Math.round(r.width), h: Math.round(r.height),
                                     ad: b.getAttribute('aria-disabled'), d: b.disabled };
                        });
                    }"""
                )
                print(f"  Post button candidates: {json.dumps(info, separators=(',', ':'))}")
                raise RuntimeError("No enabled visible Post button found within 10s")
            print(f"  Visible Post button at ({js_round(post_coords['x'])},{js_round(post_coords['y'])}) "
                  f"{js_round(post_coords['w'])}x{js_round(post_coords['h'])} \u2713")

            # Pre-post human pause (60–180s)
            print("Pre-post wait (60–180s)...")
            long_wait(page, PRE_POST_MIN, PRE_POST_MAX, "before Post")

            # Click the VISIBLE Post button as an ELEMENT via robustClick (trusted Playwright
            # click, then JS-click fallback) — NOT page.mouse.click(x,y). A coordinate click
            # misses YouTube's Polymer Post button and never fires its submit handler, so the
            # poll types in fully but never posts: composer never clears, no new post URL, the
            # poll is not live. This was the LAST click still on raw coordinates after the
            # 2026-06-10 option-field fix switched everything else to robustClick. (Reproduced
            # twice on 2026-06-14 — fix: target the element, not a point.)
            print("Clicking Post...")
            post_btn = page.locator('button[aria-label="Post"]:visible').first
            post_btn.wait_for(state="visible", timeout=10000)
            robust_click(post_btn, "Post button")
            print("Post clicked \u2713")

            # Wait for composer to clear
            print("Waiting for composer to clear...")
            try:
                page.wait_for_function(
                    """() => {
                        const el = document.querySelector('#contenteditable-root');
                        return !el || el.innerText.trim().length === 0;
                    }""",
                    timeout=20000,
                )
                print("Composer cleared \u2713")
            except Exception:
                print("Composer-cleared signal not detected; proceeding to post-check.")
            action_pause(page, "composer settled")

            # Find new post URL
            print("\nFinding new post URL...")
            new_url = None
            for attempt in range(1, 6):
                new_urls = get_recent_post_urls(page, 5)
                new_url = next((u for u in new_urls if u not in pre_urls), None)
                if new_url:
                    break
                print(f"  Attempt {attempt}/5: new post URL not yet visible...")
                page.wait_for_timeout(5000)
            if not new_url:
                raise RuntimeError("Could not find new post URL after posting")
            print(f"New post URL: {new_url}")

            poll["status"] = "posted"
            poll["posted_at"] = now_iso_z()
            poll["post_url"] = new_url
            poll.pop("error", None)
            save(data)
            print(f"\nDone \u2713  URL: {new_url}")
            print(f"POST OK platform=yt-poll url={new_url}", flush=True)

        except Exception as err:
            poll["status"] = "failed"
            poll["error"] = str(err)
            save(data)
            print(f"\nPosting failed: {err}", file=sys.stderr)
            print(f"POST FAIL platform=yt-poll reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
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
