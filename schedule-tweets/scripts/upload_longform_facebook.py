# upload_longform_facebook.py — CANONICAL Python port of upload-longform-facebook.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
#
# 1:1 port on playwright.sync_api: same fbbot-profile Chrome, same feed-composer ->
# Photo/video -> wizard -> Post flow, same BASELINE-DIFF verification (never trust
# "most recent video" — a large upload is still processing after Post), same upsell
# dismissal (case-insensitive labels), same hashtag stripping, same 25-min poll,
# same title-keyed longs.json write-back with posted vs posted_unverified.
# Documented divergences ONLY: machine lines (POST OK/FAIL); no interactive hold
# (the JS closed immediately after verify too).
import random
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from longform_queue import pick_next_longform, record_longform_post, strip_music_credits  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

MIN_FILE_SIZE = 1_000_000
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\fbbot-profile"
WORKSPACE_ROOT = Path(r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets")
DEBUG_DIR = WORKSPACE_ROOT / "tmp" / "fb-longform-debug"
FB_PAGE = "realCodeMonkeyMike"
PAGE_URL = f"https://www.facebook.com/{FB_PAGE}/"

CHAR_DELAY_MIN, CHAR_DELAY_MAX = 60, 150
ACTION_MIN, ACTION_MAX = 4000, 7000
PRE_COMPOSE_MIN, PRE_COMPOSE_MAX = 60000, 180000
PRE_POST_MIN, PRE_POST_MAX = 60000, 180000
VIDEOS_TAB_WAIT_MIN, VIDEOS_TAB_WAIT_MAX = 5000, 9000

UPSELL_LABELS = [r"^not now$", r"^no thanks$", r"^maybe later$", r"^skip$",
                 r"^close$", r"^dismiss$"]

DEBUG_DIR.mkdir(parents=True, exist_ok=True)


def rnd(a, b):
    return random.randint(a, b)


def action_pause(page, label=""):
    ms = rnd(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {ms / 1000:.1f}s pause{' (' + label + ')' if label else ''}", flush=True)
    page.wait_for_timeout(ms)


def long_wait(page, a, b, label=""):
    ms = rnd(a, b)
    print(f"  waiting {round(ms / 1000)}s{' (' + label + ')' if label else ''}...", flush=True)
    page.wait_for_timeout(ms)


def type_human(page, text):
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def dismiss_upsells(page, quiet=False):
    any_dismissed = False
    for _ in range(3):
        dismissed = False
        for label in UPSELL_LABELS:
            try:
                btn = page.get_by_role("button", name=re.compile(label, re.I)).first
                if btn.is_visible(timeout=500):
                    print(f"  Dismissing upsell: {label}")
                    btn.click(timeout=5000)
                    page.wait_for_timeout(rnd(1200, 2200))
                    dismissed = True
                    any_dismissed = True
                    break
            except Exception:
                pass
        if not dismissed:
            break
    if not any_dismissed and not quiet:
        print("  (no upsell modal present)")
    return any_dismissed


def dismiss_shortcuts_nag(page):
    """Facebook occasionally stacks a 'Keep single-character shortcuts turned on?'
    dialog on top of the composer, which becomes the last [role="dialog"] in DOM
    order and blocks snapshot()/click_by_label_in_dialog() from seeing the real
    composer buttons. Dismiss it (keep existing behavior) so the wizard loop can
    see the composer dialog again."""
    try:
        btn = page.get_by_role("button", name=re.compile(r"^Keep Turned On$", re.I)).first
        if btn.is_visible(timeout=500):
            print("  Dismissing 'keep shortcuts on?' nag (Keep Turned On)")
            btn.click(timeout=5000)
            page.wait_for_timeout(rnd(1200, 2200))
            return True
    except Exception:
        pass
    return False


def mouse_click(page, locator):
    b = locator.bounding_box()
    if b and b["width"] > 0:
        page.mouse.click(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
    else:
        locator.click()


def snapshot(page, label):
    state = page.evaluate(
        "() => { const big = [...document.querySelectorAll('[role=\"dialog\"]')]"
        ".filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });"
        " const top = big[big.length - 1] || document.body;"
        " const buttons = [...top.querySelectorAll('[role=\"button\"], button')]"
        ".filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })"
        ".map(el => ({ text: (el.innerText || '').trim().slice(0, 40),"
        " aria: el.getAttribute('aria-label'),"
        " disabled: el.getAttribute('aria-disabled') === 'true' || el.disabled }))"
        ".filter(b => b.text || b.aria);"
        " return { dialogs: big.map(d => ({ aria: d.getAttribute('aria-label') })), buttons }; }")
    print(f"\n[{label}] dialogs: {state['dialogs']}")
    for b in state["buttons"]:
        print(f"  {b}")
    try:
        page.screenshot(path=str(DEBUG_DIR / f"{label}.png"))
    except Exception:
        pass
    return state


def click_by_label_in_dialog(page, label):
    return page.evaluate(
        "(lbl) => { const ds = [...document.querySelectorAll('[role=\"dialog\"]')]"
        ".filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });"
        " const root = ds[ds.length - 1]; if (!root) return { ok: false, reason: 'no dialog' };"
        " const vw = window.innerWidth, vh = window.innerHeight, matches = [];"
        " for (const el of root.querySelectorAll('[role=\"button\"], button, [role=\"menuitem\"]')) {"
        " const r = el.getBoundingClientRect();"
        " if (r.width <= 0 || r.height <= 0) continue;"
        " if (r.x + r.width <= 0 || r.x >= vw || r.y + r.height <= 0 || r.y >= vh) continue;"
        " const aria = el.getAttribute('aria-label') || '',"
        " txt = (el.innerText || el.textContent || '').trim();"
        " if (aria === lbl || txt === lbl) {"
        " const dis = el.getAttribute('aria-disabled') === 'true' || el.disabled;"
        " if (!dis) matches.push({ el, area: r.width * r.height }); } }"
        " if (!matches.length) return { ok: false, reason: 'no match' };"
        " matches.sort((a, b) => b.area - a.area); matches[0].el.click();"
        " return { ok: true, matches: matches.length }; }", label)


def wait_for_upload_complete(page, timeout_ms=1_200_000, min_wait_ms=45_000):
    start = time.monotonic()
    stable, last_log = 0, -999
    while (time.monotonic() - start) * 1000 < timeout_ms:
        s = page.evaluate(
            "() => { const ds = [...document.querySelectorAll('[role=\"dialog\"]')]"
            ".filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });"
            " const root = ds[ds.length - 1] || document.body;"
            " const txt = root.innerText || '';"
            " const bars = [...root.querySelectorAll('[role=\"progressbar\"]')];"
            " let barVal = null;"
            " for (const b of bars) { const v = parseFloat(b.getAttribute('aria-valuenow'));"
            " if (!isNaN(v)) barVal = (barVal === null) ? v : Math.min(barVal, v); }"
            " const pm = txt.match(/(\\d{1,3})\\s*%/g);"
            " const pct = pm ? Math.min(...pm.map(x => parseInt(x, 10))) : null;"
            " return { barVal, pct, uploading: /uploading/i.test(txt),"
            " hasVideo: !!root.querySelector('video'), hasBar: bars.length > 0 }; }")
        still_uploading = (s["uploading"]
                          or (s["hasBar"] and (s["barVal"] is None or s["barVal"] < 100))
                          or (s["pct"] is not None and s["pct"] < 100))
        elapsed = round(time.monotonic() - start)
        if elapsed - last_log >= 15:
            print(f"  [upload] {elapsed}s — bar={s['barVal']} pct={s['pct']} "
                  f"uploading={s['uploading']} video={s['hasVideo']}", flush=True)
            last_log = elapsed
        if not still_uploading and s["hasVideo"]:
            stable += 1
        else:
            stable = 0
        if stable >= 4 and (time.monotonic() - start) * 1000 >= min_wait_ms:
            print(f"  [upload] complete (stable {stable}x, {elapsed}s)")
            return True
        page.wait_for_timeout(3000)
    print("  [upload] WARNING — completion not confirmed before timeout")
    return False


def get_video_ids(page):
    return page.evaluate(
        "() => { const ids = new Set();"
        " for (const a of document.querySelectorAll('a[href*=\"/videos/\"], a[href*=\"/reel/\"]')) {"
        " const m = a.href.split('?')[0].match(/\\/(?:videos|reel)\\/(\\d+)/);"
        " if (m) ids.add(m[1]); } return [...ids]; }")


def poll_for_new_video(page, baseline_set, timeout_ms=720_000, interval_ms=30_000):
    start = time.monotonic()
    while (time.monotonic() - start) * 1000 < timeout_ms:
        try:
            page.goto(f"https://www.facebook.com/{FB_PAGE}/videos",
                      wait_until="domcontentloaded")
            page.wait_for_timeout(rnd(VIDEOS_TAB_WAIT_MIN, VIDEOS_TAB_WAIT_MAX))
            hrefs = page.evaluate(
                "() => [...document.querySelectorAll('a[href*=\"/videos/\"], "
                "a[href*=\"/reel/\"]')].map(a => a.href.split('?')[0])")
            for href in hrefs:
                m = re.search(r"/(?:videos|reel)/(\d+)", href)
                if m and m.group(1) not in baseline_set:
                    print(f"  [poll] NEW video: {href}")
                    return href
            print(f"  [poll] {round(time.monotonic() - start)}s — no new video yet (processing)...",
                  flush=True)
        except Exception as e:
            print(f"  [poll] error: {e}")
        page.wait_for_timeout(interval_ms)
    return None


def main():
    job = pick_next_longform("facebook")
    if not job:
        print("No pending Facebook longform in longs.json (every entry already posted/skipped).",
              file=sys.stderr)
        sys.exit(1)
    meta, video_path = job["metadata"], job["video_path"]
    if not video_path or not video_path.exists():
        print(f"video_path missing on disk: {video_path}", file=sys.stderr)
        sys.exit(1)
    if video_path.stat().st_size < MIN_FILE_SIZE:
        print("Video below 1MB minimum", file=sys.stderr)
        sys.exit(1)
    title_line = (meta.get("title") or "").strip()
    descr = strip_music_credits((meta.get("description") or "").strip())
    caption = "\n\n".join(x for x in [title_line, descr] if x)
    caption = re.sub(r"#[\w]+", "", caption)
    caption = re.sub(r"\n{3,}", "\n\n", caption).strip()

    print(f"Video:   {video_path} ({video_path.stat().st_size / 1048576:.0f} MB)")
    print(f"Title:   {title_line}")
    print(f"Caption: {len(caption)} chars (hashtags stripped)", flush=True)

    from playwright.sync_api import sync_playwright

    print("\nLaunching Chrome...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            CHROME_PROFILE, channel="chrome", headless=False, slow_mo=50,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
        browser.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = browser.pages[0] if browser.pages else browser.new_page()
        try:
            print(f"\nNavigating to {PAGE_URL}...", flush=True)
            # 60s (not the 30s default): FB's first load on a cold fbbot-profile
            # blew the default on the 2026-08-11 bless run — pre-action nav flake,
            # nothing had been posted.
            page.goto(PAGE_URL, wait_until="domcontentloaded", timeout=60000)
            action_pause(page, "page settled")

            def is_logged_out():
                url = page.url
                if any(x in url for x in ["/login", "two_step", "checkpoint",
                                          "verification", "recover"]):
                    return True
                return page.locator('input[name="email"], input[name="pass"]').count() > 0

            if is_logged_out():
                raise RuntimeError("Not logged in — sign in to fbbot-profile manually")

            print("Capturing baseline video IDs...", flush=True)
            baseline_ids = set()
            try:
                page.goto(f"https://www.facebook.com/{FB_PAGE}/videos",
                          wait_until="domcontentloaded")
                long_wait(page, VIDEOS_TAB_WAIT_MIN, VIDEOS_TAB_WAIT_MAX, "baseline videos settle")
                baseline_ids = set(get_video_ids(page))
                print(f"  baseline: {len(baseline_ids)} existing video/reel IDs")
            except Exception as e:
                print(f"  baseline capture failed: {e}")
            page.goto(PAGE_URL, wait_until="domcontentloaded")
            action_pause(page, "back to page")

            page.keyboard.press("Escape")
            page.wait_for_timeout(500)
            page.evaluate("() => window.scrollTo(0, 0)")
            page.wait_for_timeout(1000)
            try:
                sw = page.get_by_role("button", name="Switch Now")
                sw.wait_for(state="visible", timeout=5000)
                print("Switching into Page context...")
                sw.click()
                page.wait_for_load_state("domcontentloaded")
                action_pause(page, "after Switch Now")
            except Exception:
                pass

            print("Pre-composer wait (60-180s)...", flush=True)
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            print("\nOpening composer...", flush=True)
            opened = False
            for sel in ['[aria-label*="mind" i]', 'div[role="button"]:has-text("What")']:
                el = page.locator(sel).first
                try:
                    el.wait_for(state="visible", timeout=5000)
                    mouse_click(page, el)
                    opened = True
                    print(f"  opened via: {sel}")
                    break
                except Exception:
                    pass
            if not opened:
                raise RuntimeError("Could not open composer")
            action_pause(page, "composer opened")

            print("Clicking Photo/video...", flush=True)
            pv_btn = None
            for sel in ['[role="dialog"] [aria-label*="Photo" i]',
                        '[role="dialog"] button:has-text("Photo/video")',
                        '[aria-label="Photo/video"]']:
                el = page.locator(sel).first
                if el.count() > 0:
                    pv_btn = el
                    break
            if not pv_btn:
                raise RuntimeError("Photo/video button not found")
            mouse_click(page, pv_btn)
            action_pause(page, "Photo/video clicked")

            print(f"Attaching video: {video_path}", flush=True)
            attached = False
            for sel in ['input[type="file"][accept*="video"]',
                        'input[type="file"][accept*="mp4"]', 'input[type="file"]']:
                fi = page.locator(sel).first
                if fi.count() > 0:
                    try:
                        fi.set_input_files(str(video_path))
                        print(f"  attached via: {sel}")
                        attached = True
                        break
                    except Exception as e:
                        print(f"  {sel} failed: {e}")
            if not attached:
                raise RuntimeError("Could not attach video")

            print("Waiting for the byte upload to fully complete (large file — up to 20 min)...",
                  flush=True)
            upload_ok = wait_for_upload_complete(page, timeout_ms=1_200_000, min_wait_ms=45_000)
            if not upload_ok:
                print("  WARNING: upload completion not confirmed — post may fail; "
                      "will verify via baseline diff after.")

            print("Waiting for copyright check to clear...", flush=True)
            for _ in range(60):
                txt = page.evaluate("() => document.body.innerText.toLowerCase()")
                if "checking for copyrighted" not in txt:
                    break
                page.wait_for_timeout(2000)
            action_pause(page, "after upload")

            print(f"Typing caption ({len(caption)} chars)...", flush=True)
            try:
                body = page.locator('div[contenteditable="true"][role="textbox"]').first
                body.wait_for(state="visible", timeout=10000)
                body.evaluate("el => el.click()")
                page.wait_for_timeout(rnd(500, 1200))
                type_human(page, caption)
                print("  caption typed ✓")
            except Exception as e:
                print(f"  caption skipped: {e}")
            action_pause(page, "after caption")

            print("Pre-post wait (60-180s)...", flush=True)
            long_wait(page, PRE_POST_MIN, PRE_POST_MAX, "before wizard")

            final_labels = ["Share now", "Post", "Publish", "Share", "Done"]
            posted = False
            for step in range(1, 13):
                dismiss_shortcuts_nag(page)
                state = snapshot(page, f"step{step}_state")
                final_label = None
                for lbl in final_labels:
                    if any((not b["disabled"]) and (b["aria"] == lbl or b["text"] == lbl)
                           for b in state["buttons"]):
                        final_label = lbl
                        break
                if final_label:
                    print(f'\n-> Final button "{final_label}" found on step {step} — clicking')
                    r = click_by_label_in_dialog(page, final_label)
                    print(f"  click result: {r}")
                    if r.get("ok"):
                        action_pause(page, "after final click")
                        posted = True
                        snapshot(page, f"step{step}_after_final")
                        break
                next_enabled = any((not b["disabled"]) and (b["aria"] == "Next" or b["text"] == "Next")
                                   for b in state["buttons"])
                if not next_enabled:
                    if dismiss_shortcuts_nag(page):
                        print(f"  Retrying step {step} after dismissing nag...")
                        state = snapshot(page, f"step{step}_state_retry")
                        final_label = None
                        for lbl in final_labels:
                            if any((not b["disabled"]) and (b["aria"] == lbl or b["text"] == lbl)
                                   for b in state["buttons"]):
                                final_label = lbl
                                break
                        if final_label:
                            print(f'\n-> Final button "{final_label}" found on step {step} — clicking')
                            r = click_by_label_in_dialog(page, final_label)
                            print(f"  click result: {r}")
                            if r.get("ok"):
                                action_pause(page, "after final click")
                                posted = True
                                snapshot(page, f"step{step}_after_final")
                                break
                        next_enabled = any((not b["disabled"]) and (b["aria"] == "Next" or b["text"] == "Next")
                                           for b in state["buttons"])
                    if not next_enabled:
                        print(f"\n-> No Next and no final button at step {step}. Stopping.")
                        break
                print(f"\n-> Clicking Next (step {step})")
                r = click_by_label_in_dialog(page, "Next")
                print(f"  click result: {r}")
                action_pause(page, f"after Next {step}")
            if not posted:
                snapshot(page, "FAILED_final_state")
                raise RuntimeError("Wizard did not reach final submit button")

            print("Checking for post-submit upsell modals...", flush=True)
            dismiss_upsells(page)

            print("\nWaiting for composer to close (submit finalizing — up to 10 min)...",
                  flush=True)
            submitted = False
            for i in range(300):
                open_ = page.evaluate(
                    "() => [...document.querySelectorAll('[role=\"dialog\"]')]"
                    ".some(d => d.getAttribute('aria-label') === 'Create post' && "
                    "d.getBoundingClientRect().width > 100)")
                if not open_:
                    submitted = True
                    print(f"  Composer closed ✓ (after ~{i * 2}s)")
                    break
                if i and i % 15 == 0:
                    print(f"  ...composer still open after {i * 2}s")
                    dismiss_upsells(page, quiet=True)
                page.wait_for_timeout(2000)
            if not submitted:
                print("  WARNING: composer never closed — submit may have failed.")

            print("\nPolling for the new video (baseline diff; up to 25 min)...", flush=True)
            video_url = poll_for_new_video(page, baseline_ids,
                                           timeout_ms=1_500_000, interval_ms=30_000)

            verified = False
            if video_url:
                print(f"\nVerifying live post: {video_url}", flush=True)
                try:
                    resp = page.goto(video_url, wait_until="domcontentloaded", timeout=30000)
                    status = resp.status if resp else 0
                    print(f"  HTTP {status}")
                    page.wait_for_timeout(rnd(3500, 5500))
                    has_player = page.evaluate(
                        "() => { if (document.querySelector('video')) return 'video';"
                        " if (document.querySelector('[data-video-id], [data-pagelet*=\"video\" i]'))"
                        " return 'player-container';"
                        " const og = document.querySelector('meta[property=\"og:video\"], "
                        "meta[property=\"og:video:url\"]'); if (og) return 'og:video';"
                        " return null; }")
                    print(f"  Player signal: {has_player or 'none'}")
                    if 200 <= status < 400 and has_player:
                        verified = True
                        print("  Verified live ✓")
                    else:
                        print("  Could not verify — post may not be live")
                except Exception as e:
                    print(f"  Verification error: {e}")
            else:
                print("  No NEW video appeared within the poll window — upload likely did not complete.")

            if video_url:
                record_longform_post("facebook", meta.get("title"), video_url,
                                     "posted" if verified else "posted_unverified")
            else:
                print("\nWARNING: longs.json still says pending (no URL captured).")
                print("Check the page with scripts/check-fb-longform.js before re-running, "
                      "or you will duplicate.")

            if verified:
                print(f"\nDone ✓  URL: {video_url}")
                print(f"POST OK platform=facebook url={video_url}", flush=True)
            else:
                print(f"\nUncertain — verify manually. URL: {video_url or '(no new video detected)'}")
                print(f"POST {'OK' if video_url else 'FAIL'} platform=facebook "
                      f"{'url=' + video_url + ' status=posted_unverified' if video_url else 'reason=no-new-video'}",
                      flush=True)
            sys.exit(0 if video_url else 1)
        except SystemExit:
            raise
        except Exception as err:
            print(f"\nFailed: {err}", file=sys.stderr, flush=True)
            print(f"POST FAIL platform=facebook reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
