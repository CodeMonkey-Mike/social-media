# post_yt_quiz.py — CANONICAL Python port of post-yt-quiz.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
# Status: PORTED, BLESS-PENDING — invoke the JS twin for production posts until
# this port is live-blessed with one real post.
#
# YouTube community QUIZ poster.
# A quiz is a poll where exactly ONE option is marked correct, plus an optional
# explanation shown after the viewer answers. Composer widget = ytd-backstage-quiz-editor-renderer.
#
# Discovered composer DOM (probe scripts/_diag-yt-quiz-selectors.js, 2026-07-07):
#   - Open widget:   #quiz-button button (dispatch click)  -> #quiz-attachment becomes display:flex
#   - Option fields: ytd-backstage-quiz-editor-renderer .quiz-option-input-input textarea
#                    (real <textarea> in tp-yt-iron-autogrow-textarea; starts with 2, placeholders "Answer N")
#   - Add option:    button[aria-label="Add answer"]
#   - Mark correct:  yt-icon-button.option-selector-button[aria-label="Mark as correct answer"] (one per row)
#   - Explanation:   ytd-backstage-quiz-editor-renderer .quiz-explanation-input-input textarea (optional)
#   - Post:          shared toolbar #submit-button -> button[aria-label="Post"] (visible, non-zero rect)
#
# Mirrors scripts/post-yt-poll.js exactly for: real CDP keystrokes (Polymer two-way binding +
# YouTube submission state), robustClick (Playwright click -> JS-click fallback), the two-button
# Post trap (hidden 0x0 placeholder + real visible button), and human timing. The ONE quiz-specific
# gate: the correct answer MUST be marked or the Post button never enables.
#
# 1:1 port on playwright.sync_api. THE critical quirk preserved exactly: the explanation field is
# PER-OPTION (every option has its own "Explain why this is correct" textarea) but only the
# CORRECT option's field is visible/editable (the rest are 0x0 hidden) — so the explanation
# locator targets EXPL_TEXTAREA.nth(correct_option_index), never .first(). Its fill sequence is:
# wait attached -> scrollIntoView({block:'center'}) via evaluate -> evaluate el.focus() -> verify
# document.activeElement === el -> Ctrl+A -> Delete -> type_human -> verify input_value() matches,
# fall back to .fill() once, and if STILL mismatched, ABORT (raise) BEFORE Post so a quiz is never
# published missing its intended explanation. Documented divergences ONLY: final machine line
# (POST OK/FAIL platform=yt-quiz) for the graph.
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

YT_JSON = Path(__file__).resolve().parent.parent / "data" / "yt-quizzes.json"
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile"
CDP_PORT = 9223
CHANNEL_HANDLE = "CodeMonkeyMike"
POSTS_URL = f"https://www.youtube.com/@{CHANNEL_HANDLE}/posts"

QUIZ_ROOT = "ytd-backstage-quiz-editor-renderer"
QUIZ_ATTACH = f"{QUIZ_ROOT}#quiz-attachment"
OPT_TEXTAREA = f"{QUIZ_ROOT} .quiz-option-input-input textarea"
ADD_ANSWER = 'button[aria-label="Add answer"]'
CORRECT_BTN = f"{QUIZ_ROOT} .option-selector-button"
EXPL_TEXTAREA = f"{QUIZ_ROOT} .quiz-explanation-input-input textarea"

# Timing constants — mirrored from scripts/post-yt-poll.js
CHAR_DELAY_MIN = 60
CHAR_DELAY_MAX = 150
ACTION_MIN = int(os.environ.get("YTQ_ACTION_MIN", 2000))
ACTION_MAX = int(os.environ.get("YTQ_ACTION_MAX", 3500))
PRE_COMPOSE_MIN = int(os.environ.get("YTQ_PRE_COMPOSE_MIN", 30000))
PRE_COMPOSE_MAX = int(os.environ.get("YTQ_PRE_COMPOSE_MAX", 90000))
PRE_POST_MIN = int(os.environ.get("YTQ_PRE_POST_MIN", 30000))
PRE_POST_MAX = int(os.environ.get("YTQ_PRE_POST_MAX", 90000))


def js_round(x):
    """Match JS Math.round (half rounds up) instead of Python's round-half-to-even."""
    return math.floor(x + 0.5)


def random_between(a, b):
    return random.randint(a, b)


def now_iso_z():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def save(data):
    YT_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def js_str(v):
    """Render a value the way a JS template literal would (true/false/null)."""
    if v is None:
        return "null"
    if v is True:
        return "true"
    if v is False:
        return "false"
    return v


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


# Click that survives composer overlays / custom Polymer handlers.
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
    quiz = next((q for q in data["quizzes"] if q["status"] == "pending"), None)
    if not quiz:
        print("No pending YouTube quizzes. Exiting.")
        return

    preview = quiz.get("hook") or quiz.get("topic") or quiz["id"]
    print(f'Quiz: "{preview[:80]}..."')
    print(f"Question: {len(quiz['question_text'])} chars")
    print(f"Options ({len(quiz['options'])}): {json.dumps(quiz['options'], separators=(',', ':'))}")

    opts_preview = quiz["options"]
    ci_preview = quiz.get("correct_option_index")
    if isinstance(ci_preview, int) and not isinstance(ci_preview, bool) and 0 <= ci_preview < len(opts_preview):
        ci_preview_text = opts_preview[ci_preview]
    else:
        ci_preview_text = "undefined"
    print(f'Correct index: {ci_preview} -> "{ci_preview_text}"')

    # Validation gates (fail BEFORE opening a browser)
    if len(quiz["options"]) < 2 or len(quiz["options"]) > 4:
        print(f"FATAL: quiz must have 2-4 options (has {len(quiz['options'])})", file=sys.stderr)
        sys.exit(1)
    for opt in quiz["options"]:
        if len(opt) > 65:
            print(f'FATAL: option too long: "{opt}"', file=sys.stderr)
            sys.exit(1)
    ci = quiz.get("correct_option_index")
    if (not isinstance(ci, int) or isinstance(ci, bool) or ci < 0 or ci >= len(quiz["options"])):
        print(f"FATAL: correct_option_index {ci} out of range", file=sys.stderr)
        sys.exit(1)

    chrome_proc = start_chrome()

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{CDP_PORT}")
        ctx = browser.contexts[0]
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        try:
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

            pre_urls = get_recent_post_urls(page, 5)

            quiz["status"] = "posting"
            save(data)

            print("Pre-composer wait (30–90s)...")
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            print("\nOpening composer...", flush=True)
            page.goto(POSTS_URL)
            try:
                page.wait_for_load_state("domcontentloaded", timeout=30000)
            except Exception:
                pass
            action_pause(page, "posts page settled")

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

            print(f"Typing question ({len(quiz['question_text'])} chars)...")
            type_human(page, quiz["question_text"])
            action_pause(page, "after question")

            # Open the quiz widget — dispatch click on #quiz-button button (probe confirmed dispatch works).
            print("Clicking #quiz-button button...")
            quiz_btn = page.locator("#quiz-button button").first
            quiz_btn.wait_for(state="attached", timeout=8000)
            quiz_btn.dispatch_event("click")
            action_pause(page, "after quiz button")

            attach_display = page.evaluate(
                """(sel) => {
                    const el = document.querySelector(sel);
                    return el ? window.getComputedStyle(el).display : 'not found';
                }""",
                QUIZ_ATTACH,
            )
            print(f"Quiz attachment display: {attach_display}")
            if attach_display == "none" or attach_display == "not found":
                raise RuntimeError(f"Quiz editor did not open (display={attach_display})")

            page.evaluate("() => window.scrollTo({ top: 0, behavior: 'instant' })")
            page.wait_for_timeout(random_between(700, 1100))

            # Fill option textareas — add rows via "Add answer" as needed (starts with 2).
            print(f"Filling {len(quiz['options'])} quiz options...")
            page.locator(OPT_TEXTAREA).first.wait_for(state="attached", timeout=10000)

            for i in range(len(quiz["options"])):
                current_inputs = page.locator(OPT_TEXTAREA).count()
                while current_inputs <= i:
                    print(f"  Adding answer field (have {current_inputs}, need {i + 1})...")
                    add_btn = page.locator(ADD_ANSWER).first
                    try:
                        add_btn.scroll_into_view_if_needed()
                    except Exception:
                        pass
                    robust_click(add_btn, "Add answer")
                    page.wait_for_function(
                        "({ sel, n }) => document.querySelectorAll(sel).length > n",
                        {"sel": OPT_TEXTAREA, "n": current_inputs},
                        timeout=8000,
                    )
                    current_inputs = page.locator(OPT_TEXTAREA).count()
                    action_pause(page, f"field {i + 1} added")

                inp = page.locator(OPT_TEXTAREA).nth(i)
                try:
                    inp.scroll_into_view_if_needed()
                except Exception:
                    pass

                print(f'  Typing option {i + 1}: "{quiz["options"][i]}"')
                robust_click(inp, f"option {i + 1} textarea")
                page.wait_for_timeout(random_between(300, 600))
                page.keyboard.press("Control+A")
                page.keyboard.press("Delete")
                type_human(page, quiz["options"][i])

                try:
                    actual = inp.input_value()
                except Exception:
                    actual = None
                mark = "\u2713" if actual == quiz["options"][i] else "\u26a0"
                print(f'  Option {i + 1}: value="{actual}" {mark}')
                if actual != quiz["options"][i]:
                    inp.fill(quiz["options"][i])
                    try:
                        retry = inp.input_value()
                    except Exception:
                        retry = None
                    mark = "\u2713" if retry == quiz["options"][i] else "\u26a0"
                    print(f'  Option {i + 1} (fill retry): value="{retry}" {mark}')
                    if retry != quiz["options"][i]:
                        raise RuntimeError(f'Option {i + 1} text did not register ("{retry}")')
                action_pause(page, f"after option {i + 1}")

            # Mark the correct answer (quiz-specific — Post won't enable without it).
            ci = quiz["correct_option_index"]
            print(f'Marking option {ci + 1} correct ("{quiz["options"][ci]}")...')
            correct_btns = page.locator(CORRECT_BTN)
            btn_count = correct_btns.count()
            if btn_count <= ci:
                raise RuntimeError(f"Only {btn_count} correct-answer buttons for index {ci}")
            correct_btn = correct_btns.nth(ci)
            try:
                correct_btn.scroll_into_view_if_needed()
            except Exception:
                pass
            robust_click(correct_btn, f"mark correct #{ci + 1}")
            action_pause(page, "after mark correct")
            try:
                pressed = correct_btn.get_attribute("aria-pressed")
            except Exception:
                pressed = None
            print(f"  Correct-answer button aria-pressed={js_str(pressed)}")

            # Optional explanation (shown to the viewer AFTER they answer, alongside the correct answer).
            # KEY (probe scripts/_diag-yt-quiz-explanation.js): EVERY option has its own explanation field
            # ("Explain why this is correct"), but ONLY the correct option's field is visible/editable — the
            # rest are 0x0 hidden. So target the correct_option_index-th field, NOT .first(). The first two
            # Kaspa quizzes posted with an EMPTY explanation because .first() grabbed option 0's hidden field
            # (option 0 was not the correct answer). The field is revealed once the correct answer is marked
            # (done above); native el.focus() + real keystrokes registers it. If an explanation is SET but
            # will not register, ABORT before Post so we never publish a quiz missing its intended explanation.
            if quiz.get("explanation") and quiz["explanation"].strip():
                expl_loc = page.locator(EXPL_TEXTAREA).nth(ci)  # ci = correct_option_index (set above)
                expl_loc.wait_for(state="attached", timeout=8000)
                print(f"Typing explanation ({len(quiz['explanation'])} chars) into option {ci + 1}'s field...")
                expl_loc.evaluate("el => el.scrollIntoView({ block: 'center' })")
                page.wait_for_timeout(random_between(400, 700))
                expl_loc.evaluate("el => el.focus()")
                focused = expl_loc.evaluate("el => document.activeElement === el")
                print(f"  Explanation focused: {js_str(focused)}")
                page.keyboard.press("Control+A")
                page.keyboard.press("Delete")
                type_human(page, quiz["explanation"])
                try:
                    av = expl_loc.input_value()
                except Exception:
                    av = None
                if av != quiz["explanation"]:
                    try:
                        expl_loc.fill(quiz["explanation"])  # native value+input fallback
                    except Exception:
                        pass
                    try:
                        av = expl_loc.input_value()
                    except Exception:
                        av = None
                if av != quiz["explanation"]:
                    preview_av = (av or "")[:40]
                    raise RuntimeError(
                        f'Explanation did not register (got "{preview_av}"). '
                        "Aborting BEFORE Post so the quiz is not published without its explanation."
                    )
                print("  Explanation \u2713")
                action_pause(page, "after explanation")

            # Wait for the VISIBLE Post button to enable (two-button trap: hidden 0x0 placeholder + real one).
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
                            return { w: Math.round(r.width), h: Math.round(r.height),
                                     ad: b.getAttribute('aria-disabled'), d: b.disabled };
                        });
                    }"""
                )
                print(f"  Post button candidates: {json.dumps(info, separators=(',', ':'))}")
                raise RuntimeError("No enabled visible Post button found within 10s (is the correct answer marked?)")
            print(f"  Visible Post button at ({js_round(post_coords['x'])},{js_round(post_coords['y'])}) "
                  f"{js_round(post_coords['w'])}x{js_round(post_coords['h'])} \u2713")

            print("Pre-post wait (30–90s)...")
            long_wait(page, PRE_POST_MIN, PRE_POST_MAX, "before Post")

            # Click the VISIBLE Post button as an ELEMENT via robustClick (NOT raw coordinates).
            print("Clicking Post...")
            post_btn = page.locator('button[aria-label="Post"]:visible').first
            post_btn.wait_for(state="visible", timeout=10000)
            robust_click(post_btn, "Post button")
            print("Post clicked \u2713")

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

            quiz["status"] = "posted"
            quiz["posted_at"] = now_iso_z()
            quiz["post_url"] = new_url
            quiz.pop("error", None)
            save(data)
            print(f"\nDone \u2713  URL: {new_url}")
            print(f"POST OK platform=yt-quiz url={new_url}", flush=True)

        except Exception as err:
            quiz["status"] = "failed"
            quiz["error"] = str(err)
            save(data)
            print(f"\nPosting failed: {err}", file=sys.stderr)
            print(f"POST FAIL platform=yt-quiz reason={str(err).splitlines()[0][:120]}", flush=True)
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
