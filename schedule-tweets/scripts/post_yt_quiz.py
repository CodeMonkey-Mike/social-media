# post_yt_quiz.py — CANONICAL Python port of post-yt-quiz.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
# Status: PRODUCTION POSTER for YT quizzes (bless-pending). Do NOT fall back to the JS twin —
# it still carries the dead legacy selectors below and CANNOT post (see 2026-08-30).
#
# YouTube community QUIZ poster.
# A quiz is a poll where exactly ONE option is marked correct, plus an optional
# explanation shown after the viewer answers.
#
# ── 2026-08-30: YouTube migrated the quiz composer to its ViewModel components ────────────
# Symptom: two clean pre-post failures, `Quiz editor did not open (display=none)`. Nothing was
# ever published (the throw lands before any Post click), so there was no duplicate risk.
# Root cause (probe scripts/_diag_yt_quiz_viewmodel.py): the whole legacy Polymer widget
# `ytd-backstage-quiz-editor-renderer#quiz-attachment` is now a VESTIGIAL element that is
# permanently display:none / 0x0. The real editor renders as new `ytPostsCreation*ViewModel*`
# components. The old "is it open?" probe therefore reads a dead node and always says "no", and
# every downstream legacy selector points at 0x0 ghosts. Selector map, old -> new:
#   - Open widget:   #quiz-button button  ->  button[aria-label="Add a quiz"] **:visible**
#                    (TWO #quiz-button exist: a 0x0 span in ytd-backstage-post-dialog-renderer and
#                     the real 90x40 ytd-button-renderer in ytd-commentbox — the same two-button
#                     trap already documented for the Post button, so never take .first())
#   - Is open:       #quiz-attachment display != none  ->  .ytPostsCreationOptionsEditorViewModelHost
#                    plus the answer textareas rendering with a real box
#   - Answer fields: .quiz-option-input-input textarea (ph "Option N")
#                    ->  .ytPostsCreationOptionViewModelTextFieldContainer textarea (ph "Answer N").
#                    Scope by that container: a BARE .ytStandardsTextareaShapeTextarea also matches
#                    the explanation field, which would make the answer count off by one.
#   - Add answer:    button[aria-label="Add answer"]  ->  button.ytPostsCreationOptionsViewModelAddOptionButton
#                    (the new button has NO aria-label; its text is "Add answer")
#   - Mark correct:  .option-selector-button  ->  .ytPostsCreationOptionViewModelOptionSelectorButton
#                    NOTE this matches a <button-view-model> WRAPPER with NO aria attributes. The
#                    marked state is the CLASS `...OptionSelectorButtonCorrect` on that wrapper
#                    (mirrored as `...QuizOptionCorrect` on the row); aria-pressed lives on the
#                    wrapper's INNER <button>. Reading aria-pressed off the wrapper yields None for
#                    every row, i.e. a false "nothing is marked".
#   - Explanation:   per-option .quiz-explanation-input-input textarea
#                    ->  ONE shared field: .ytPostsCreationOptionsEditorViewModelExplanationContainer
#                    textarea (ph "Add an explanation (optional)")
#   - Post:          button[aria-label="Post"] (visible, non-zero rect) — UNCHANGED
#
# Two behaviour changes that the flow now handles explicitly:
#  1. **Option 1 is marked correct by DEFAULT.** The selector buttons behave like radios, so when
#     correct_option_index == 0 we must NOT click (a click on the already-marked row risks toggling
#     it off); we verify instead. Only a different index gets clicked.
#  2. **aria-pressed is now real** ("true"/"false", was null on the Polymer control). That closes the
#     long-running `aria-pressed=null` escalation logged 2026-07-15/07-21/07-22/07-30: the correct
#     answer is no longer logged-and-shrugged, it is GATED — we re-read every selector button and
#     abort before Post unless exactly one is pressed AND it is the intended index. A quiz with the
#     wrong answer marked is worse than one not posted.
#
# Mirrors scripts/post-yt-poll.js for: real CDP keystrokes (the ViewModel textareas are real
# <textarea>s, so keyboard input registers and input_value() reads back), robust_click (Playwright
# click -> JS-click fallback), the two-button Post trap, and human timing.
#
# The explanation fill sequence is unchanged apart from its locator: scrollIntoView({block:'center'})
# -> el.focus() -> verify document.activeElement === el -> Ctrl+A -> Delete -> type_human -> verify
# input_value() matches, fall back to .fill() once, and if STILL mismatched, ABORT (raise) BEFORE
# Post so a quiz is never published missing its intended explanation.
# Documented divergence from the JS twin ONLY: final machine line (POST OK/FAIL platform=yt-quiz).
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

# ViewModel composer selectors (2026-08-30 migration — see header for the old->new map).
QUIZ_OPEN_BTN = 'button[aria-label="Add a quiz"]:visible'
QUIZ_EDITOR = ".ytPostsCreationOptionsEditorViewModelHost"
OPT_TEXTAREA = ".ytPostsCreationOptionViewModelTextFieldContainer textarea"
ADD_ANSWER = "button.ytPostsCreationOptionsViewModelAddOptionButton"
CORRECT_BTN = ".ytPostsCreationOptionViewModelOptionSelectorButton"
EXPL_TEXTAREA = ".ytPostsCreationOptionsEditorViewModelExplanationContainer textarea"

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

            # Open the quiz widget. Click the VISIBLE "Add a quiz" button as an element (never
            # .first() on #quiz-button — that is the 0x0 ghost twin; see header).
            print("Clicking the visible 'Add a quiz' button...")
            quiz_btn = page.locator(QUIZ_OPEN_BTN).first
            quiz_btn.wait_for(state="visible", timeout=8000)
            robust_click(quiz_btn, "Add a quiz")
            action_pause(page, "after quiz button")

            # The editor renders asynchronously, so WAIT for it rather than sampling once.
            # Signal = the ViewModel editor host plus real answer textareas (a rendered box).
            try:
                page.locator(QUIZ_EDITOR).first.wait_for(state="visible", timeout=15000)
                page.locator(OPT_TEXTAREA).first.wait_for(state="visible", timeout=15000)
            except Exception:
                raise RuntimeError(
                    "Quiz editor did not open (no visible ytPostsCreationOptionsEditorViewModel host / "
                    "answer textarea). If YouTube changed the composer again, re-probe with "
                    "scripts/_diag_yt_quiz_viewmodel.py before touching selectors."
                )
            print(f"Quiz editor open ✓ ({page.locator(OPT_TEXTAREA).count()} answer fields)")

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
                    # `arg` is KEYWORD-ONLY on playwright.sync_api (unlike the JS twin's positional
                    # second parameter). Passing it positionally raises "takes 2 positional arguments
                    # but 3 were given" — a latent port defect that only fires on a 3rd/4th option,
                    # which no quiz had reached while the composer bug blocked the run entirely.
                    page.wait_for_function(
                        "({ sel, n }) => document.querySelectorAll(sel).length > n",
                        arg={"sel": OPT_TEXTAREA, "n": current_inputs},
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

            # Mark the correct answer (quiz-specific — Post won't enable without one).
            # The ViewModel selector buttons are radios and option 1 starts marked, so clicking a row
            # that is ALREADY marked risks toggling it off: click only when the mark has to move.
            ci = quiz["correct_option_index"]
            correct_btns = page.locator(CORRECT_BTN)
            btn_count = correct_btns.count()
            if btn_count <= ci:
                raise RuntimeError(f"Only {btn_count} correct-answer buttons for index {ci}")

            # Reading the mark: CORRECT_BTN matches a <button-view-model> WRAPPER that carries no
            # aria at all — the state is the class `...OptionSelectorButtonCorrect` on that wrapper
            # (mirrored by `...QuizOptionCorrect` on the row). aria-pressed lives one level down, on
            # the wrapper's inner <button> ("Marked as correct" / "Mark as correct answer"). Reading
            # aria-pressed off the wrapper returns None for every row, which reads as "nothing is
            # marked" and would abort every run. Gate on the class; log the inner aria for humans.
            def selector_state():
                return page.evaluate(
                    """(sel) => [...document.querySelectorAll(sel)].map((el, i) => {
                        const inner = el.querySelector('button');
                        return {
                            i,
                            correct: /OptionSelectorButtonCorrect/.test((el.className || '').toString()),
                            aria: inner ? inner.getAttribute('aria-label') : null,
                            pressed: inner ? inner.getAttribute('aria-pressed') : null,
                        };
                    })""",
                    CORRECT_BTN,
                )

            def marked_indices():
                return [s["i"] for s in selector_state() if s["correct"]]

            before = marked_indices()
            print(f'Marking option {ci + 1} correct ("{quiz["options"][ci]}") — currently marked: {before}')
            if before == [ci]:
                print("  Already marked correct (default) — not clicking, would toggle it off")
            else:
                correct_btn = correct_btns.nth(ci)
                try:
                    correct_btn.scroll_into_view_if_needed()
                except Exception:
                    pass
                robust_click(correct_btn, f"mark correct #{ci + 1}")
                action_pause(page, "after mark correct")

            # GATE (not a log line): exactly one option marked, and it is the intended one.
            state = selector_state()
            after = [s["i"] for s in state if s["correct"]]
            print(f"  Correct-answer state: marked={after}, expected=[{ci}]")
            for s in state:
                print(f"    option {s['i'] + 1}: correct={s['correct']} aria={js_str(s['aria'])} "
                      f"aria-pressed={js_str(s['pressed'])}")
            if after != [ci]:
                raise RuntimeError(
                    f"Correct answer is not set as intended (marked={after}, expected=[{ci}]). "
                    "Aborting BEFORE Post so a quiz is never published with the wrong answer marked."
                )

            # Optional explanation (shown to the viewer AFTER they answer, alongside the correct answer).
            # 2026-08-30: the ViewModel composer has ONE shared explanation field ("Add an explanation
            # (optional)"), so this is now .first(), not .nth(correct_option_index). The old per-option
            # quirk is gone: the Polymer editor gave every option its own "Explain why this is correct"
            # textarea with only the correct one visible, which is why the first two Kaspa quizzes shipped
            # with an EMPTY explanation (.first() had grabbed option 0's hidden field). Keeping .nth(ci)
            # against the new DOM would now select nothing at all for any ci > 0.
            # If an explanation is SET but will not register, ABORT before Post so we never publish a quiz
            # missing its intended explanation.
            if quiz.get("explanation") and quiz["explanation"].strip():
                expl_loc = page.locator(EXPL_TEXTAREA).first
                expl_loc.wait_for(state="visible", timeout=8000)
                print(f"Typing explanation ({len(quiz['explanation'])} chars)...")
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
