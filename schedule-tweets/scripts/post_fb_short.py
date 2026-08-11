# post_fb_short.py — CANONICAL Python port of post-fb-short.js (2026-08-11,
# posting-tail migration; the JS twin is FROZEN rollback). Status: PORTED,
# BLESS-PENDING — invoke the JS twin for production posts until this port is
# live-blessed with one real post.
#
# Uploads one pending Facebook video from data/shorts.json.
#
# Approach (2026-05-21, mirrored from the JS twin):
#   - Pre-composer human pause (60-180s before opening the composer)
#   - Open composer ("What's on your mind?")
#   - Click Photo/video, then attach via the file input that accepts video/*
#   - Wait for upload 100% + copyright check to clear
#   - Type caption character-by-character with 60-150ms per-keystroke delay
#     (hashtags stripped — tag autocomplete intercepts the wizard)
#   - Pre-post human pause (60-180s) before iterating the wizard
#   - Iterate up to 6 times: snapshot state, look for final submit button
#     (Post / Share now / Publish / Share). Click it if present; otherwise
#     click Next and continue. Final submit scoped strictly to topmost dialog
#     (Page-level "Photo/video" tabs are NEVER picked up).
#   - When multiple buttons share the same aria-label (off-screen stacked
#     wizard pages do this), pick the largest visible area.
#   - Post-publish verification: navigate to the captured URL and confirm
#     the video page loads (HTTP 200 + video player element present).
#
# 1:1 port on playwright.sync_api: same fbbot-profile Chrome, same selectors in
# the same fallback order, same timeouts/randomized waits, same human-typing
# delays, same queue-pick logic, same write-back values, same console messages,
# same exit codes (implicit 0 on every non-error path — this script never calls
# an explicit success exit, matching the JS twin exactly).
# Documented divergences ONLY: (a) final machine line (POST OK/FAIL) for the
# LangGraph wrapper to parse; (b) this header/status block.
import json
import os
import random
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from strip_hashtags import strip_hashtags, build_caption  # noqa: E402,F401

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
SHORTS_JSON = HERE.parent / "data" / "shorts.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\fbbot-profile"
WORKSPACE_ROOT = Path(r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets")
DEBUG_DIR = WORKSPACE_ROOT / "tmp-fb-debug"
FB_PAGE = "realCodeMonkeyMike"
PAGE_URL = f"https://www.facebook.com/{FB_PAGE}/"
PLATFORM = "facebook"

# Timing constants — mirrored from post-x-short.js (per the JS twin's own comment)
CHAR_DELAY_MIN = 60      # ms per caption keystroke
CHAR_DELAY_MAX = 150
ACTION_MIN = int(os.environ.get("FB_ACTION_MIN") or 4000)      # ms between major UI actions
ACTION_MAX = int(os.environ.get("FB_ACTION_MAX") or 7000)
PRE_COMPOSE_MIN = int(os.environ.get("FB_PRE_COMPOSE_MIN") or 60000)   # ms before opening composer (60-180s)
PRE_COMPOSE_MAX = int(os.environ.get("FB_PRE_COMPOSE_MAX") or 180000)
PRE_POST_MIN = int(os.environ.get("FB_PRE_POST_MIN") or 60000)    # ms before entering wizard / clicking final Post
PRE_POST_MAX = int(os.environ.get("FB_PRE_POST_MAX") or 180000)
VIDEOS_TAB_WAIT_MIN = int(os.environ.get("FB_VIDEOS_TAB_WAIT_MIN") or 5000)    # ms between page load and link scrape
VIDEOS_TAB_WAIT_MAX = int(os.environ.get("FB_VIDEOS_TAB_WAIT_MAX") or 9000)

DEBUG_DIR.mkdir(parents=True, exist_ok=True)


def rnd(a, b):
    return random.randint(a, b)


def now_iso_z():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def json_dumps(data):
    return json.dumps(data, indent=2, ensure_ascii=False) + "\n"


def save(data):
    SHORTS_JSON.write_text(json_dumps(data), encoding="utf-8")


def action_pause(page, label=""):
    ms = rnd(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {ms / 1000:.1f}s pause{' (' + label + ')' if label else ''}", flush=True)
    page.wait_for_timeout(ms)


def long_wait(page, min_ms, max_ms, label=""):
    ms = rnd(min_ms, max_ms)
    print(f"  waiting {round(ms / 1000)}s{' (' + label + ')' if label else ''}...", flush=True)
    page.wait_for_timeout(ms)


def type_human(page, text):
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def mouse_click(page, locator):
    bbox = locator.bounding_box()
    if bbox and bbox["width"] > 0:
        page.mouse.click(bbox["x"] + bbox["width"] / 2, bbox["y"] + bbox["height"] / 2)
    else:
        locator.click()


def snapshot(page, label):
    """Dump dialog state + screenshot at a labeled step."""
    state = page.evaluate(
        "() => { const dialogs = [...document.querySelectorAll('[role=\"dialog\"]')]"
        ".filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; })"
        ".map(d => ({ aria: d.getAttribute('aria-label'), w: Math.round(d.getBoundingClientRect().width),"
        " h: Math.round(d.getBoundingClientRect().height) }));"
        " const topDialog = (() => { const ds = [...document.querySelectorAll('[role=\"dialog\"]')]"
        ".filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });"
        " return ds[ds.length - 1] || document.body; })();"
        " const buttons = [...topDialog.querySelectorAll('[role=\"button\"], button')]"
        ".filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })"
        ".map(el => ({ text: (el.innerText || '').trim().slice(0, 40), aria: el.getAttribute('aria-label'),"
        " disabled: el.getAttribute('aria-disabled') === 'true' || el.disabled,"
        " rect: (() => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y),"
        " w: Math.round(r.width), h: Math.round(r.height) }; })() }))"
        " .filter(b => b.text || b.aria);"
        " return { dialogs, buttons }; }")
    print(f"\n[{label}] dialogs: {json.dumps(state['dialogs'])}")
    print(f"[{label}] buttons in top dialog ({len(state['buttons'])}):")
    for b in state["buttons"]:
        print(f"  {json.dumps(b)}")
    (DEBUG_DIR / f"{label}.json").write_text(json_dumps(state["buttons"]), encoding="utf-8")
    try:
        page.screenshot(path=str(DEBUG_DIR / f"{label}.png"), full_page=False)
    except Exception:
        pass
    return state


def click_by_label_in_dialog(page, label):
    """Click a button by exact label, scoped to the topmost dialog only.
    When multiple buttons share the label (stacked wizard pages), pick the largest."""
    return page.evaluate(
        "(lbl) => { const dialogs = [...document.querySelectorAll('[role=\"dialog\"]')]"
        ".filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });"
        " const root = dialogs[dialogs.length - 1];"
        " if (!root) return { ok: false, reason: 'no dialog' };"
        " const matches = []; const vw = window.innerWidth; const vh = window.innerHeight;"
        " for (const el of root.querySelectorAll('[role=\"button\"], button, [role=\"menuitem\"]')) {"
        " const r = el.getBoundingClientRect();"
        " if (r.width <= 0 || r.height <= 0) continue;"
        " if (r.x + r.width <= 0 || r.x >= vw) continue;"
        " if (r.y + r.height <= 0 || r.y >= vh) continue;"
        " const aria = el.getAttribute('aria-label') || '';"
        " const txt = (el.innerText || el.textContent || '').trim();"
        " if (aria === lbl || txt === lbl) {"
        " const disabled = el.getAttribute('aria-disabled') === 'true' || el.disabled;"
        " if (!disabled) matches.push({ el, area: r.width * r.height }); } }"
        " if (matches.length === 0) return { ok: false, reason: 'no match' };"
        " matches.sort((a, b) => b.area - a.area); matches[0].el.click();"
        " return { ok: true, matches: matches.length }; }", label)


def main():
    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))

    # Bail if anything is stuck in 'posting' — those need manual review. Prior
    # behavior auto-reset 'posting' to 'pending', causing re-uploads of shorts
    # whose previous run died after submission but before status flipped.
    stuck = [s for s in data["shorts"] if (s["platforms"].get(PLATFORM) or {}).get("status") == "posting"]
    if stuck:
        print(f"{len(stuck)} short(s) stuck in 'posting' — manual review required:", file=sys.stderr)
        for s in stuck:
            print(f"  - {s['id']}: {s['title']}", file=sys.stderr)
        print(f"Check facebook.com/{FB_PAGE}/videos to see if any actually published, "
              "then update data/shorts.json before retrying.", file=sys.stderr)
        sys.exit(2)

    short = next((s for s in data["shorts"] if (s["platforms"].get(PLATFORM) or {}).get("status") == "pending"),
                 None)
    if not short:
        print("No pending Facebook shorts. Exiting.")
        sys.exit(0)

    video_path = WORKSPACE_ROOT / short["video_path"]
    if not video_path.exists():
        print("Video not found:", video_path, file=sys.stderr)
        sys.exit(1)

    caption = build_caption(short["platforms"][PLATFORM].get("caption_override") or short.get("caption"),
                            short.get("tags"), PLATFORM)

    print(f'Short: "{short["title"]}"')
    print(f'File:  {video_path} ({short["duration_seconds"]}s)')
    print(f"Caption: {len(caption)} chars (hashtags stripped)")

    short["platforms"][PLATFORM]["status"] = "posting"
    save(data)

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
            # -- Navigate to Page --------------------------------------------------
            print(f"\nNavigating to {PAGE_URL}...", flush=True)
            page.goto(PAGE_URL, wait_until="domcontentloaded")
            action_pause(page, "page settled")

            # Login check (uses login form presence, never footer text)
            def is_logged_out():
                url = page.url
                if any(x in url for x in ["/login", "two_step", "checkpoint", "verification", "recover"]):
                    return True
                return page.locator('input[name="email"], input[name="pass"]').count() > 0

            if is_logged_out():
                raise RuntimeError("Not logged in — sign in to fbbot-profile manually")

            # Dismiss notifications & switch to Page
            page.keyboard.press("Escape")
            page.wait_for_timeout(500)
            page.evaluate("() => window.scrollTo(0, 0)")
            page.wait_for_timeout(1000)

            try:
                switch_btn = page.get_by_role("button", name="Switch Now")
                switch_btn.wait_for(state="visible", timeout=5000)
                print("Switching into Page context...")
                switch_btn.click()
                page.wait_for_load_state("domcontentloaded")
                action_pause(page, "after Switch Now")
            except Exception:
                pass

            # -- Pre-composer human pause --------------------------------------------
            print("Pre-composer wait (60-180s)...", flush=True)
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            # -- Open composer --------------------------------------------------------
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

            # -- Click Photo/video to reveal file inputs -------------------------------
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

            # -- Attach video via second file input (the one that accepts video) -------
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

            # -- Wait for upload to reach 100% -----------------------------------------
            print("Waiting for upload 100%...", flush=True)
            try:
                page.wait_for_function("() => document.body.innerText.includes('100%')", timeout=600000)
                print("  100% \u2713")
            except Exception:
                print("  100% signal not seen — continuing")

            # -- Copyright check ---------------------------------------------------------
            print("Waiting for copyright check to clear...", flush=True)
            for _ in range(60):
                txt = page.evaluate("() => document.body.innerText.toLowerCase()")
                if "checking for copyrighted" not in txt:
                    break
                page.wait_for_timeout(2000)
            action_pause(page, "after upload")

            # -- Type caption --------------------------------------------------------------
            print(f"Typing caption ({len(caption)} chars) at 60-150ms/char...", flush=True)
            try:
                body = page.locator('div[contenteditable="true"][role="textbox"]').first
                body.wait_for(state="visible", timeout=10000)
                body.evaluate("el => el.click()")
                page.wait_for_timeout(rnd(500, 1200))
                type_human(page, caption)
                print("  caption typed \u2713")
            except Exception as e:
                print(f"  caption skipped: {e}")
            action_pause(page, "after caption")

            # -- Pre-post human pause ----------------------------------------------------
            print("Pre-post wait (60-180s)...", flush=True)
            long_wait(page, PRE_POST_MIN, PRE_POST_MAX, "before wizard")

            # -- Wizard loop: snapshot, then either click final or click Next ------------
            final_labels = ["Share now", "Post", "Publish", "Share", "Done"]

            posted = False
            for step in range(1, 13):
                state = snapshot(page, f"step{step}_state")

                final_label = None
                for lbl in final_labels:
                    found = next((b for b in state["buttons"]
                                 if not b["disabled"] and (b["aria"] == lbl or b["text"] == lbl)), None)
                    if found:
                        final_label = lbl
                        break

                if final_label:
                    print(f'\n\u2192 Final button "{final_label}" found on step {step} — clicking')
                    result = click_by_label_in_dialog(page, final_label)
                    print(f"  click result: {result}")
                    if result.get("ok"):
                        action_pause(page, "after final click")
                        posted = True
                        snapshot(page, f"step{step}_after_final")
                        break

                # No final button — try clicking Next
                next_enabled = next((b for b in state["buttons"]
                                     if not b["disabled"] and (b["aria"] == "Next" or b["text"] == "Next")), None)
                if not next_enabled:
                    print(f"\n\u2192 No Next button and no final button at step {step}. Stopping.")
                    break

                print(f"\n\u2192 Clicking Next (step {step})")
                r = click_by_label_in_dialog(page, "Next")
                print(f"  click result: {r}")
                action_pause(page, f"after Next {step}")

            if not posted:
                snapshot(page, "FAILED_final_state")
                raise RuntimeError("Wizard did not reach final submit button")

            # -- Dismiss upsell dialogs ----------------------------------------------------
            for label in ["Not now", "No thanks", "Maybe later", "Skip"]:
                try:
                    btn = page.get_by_role("button", name=label, exact=True).first
                    if btn.is_visible():
                        print(f"Dismissing upsell: {label}")
                        btn.click()
                        page.wait_for_timeout(rnd(1500, 2500))
                        break
                except Exception:
                    pass

            # -- Wait for posting to complete -----------------------------------------------
            print("\nWaiting for \"Posting\" to clear...", flush=True)
            submitted = False
            for _ in range(120):
                page.wait_for_timeout(1000)
                txt = page.evaluate("() => document.body.innerText").lower()
                if "posting" not in txt and "reel settings" not in txt and "uploading" not in txt:
                    submitted = True
                    print("  Submitted \u2713")
                    break

            # -- Capture URL from Videos tab ---------------------------------------------------
            print("\nCapturing video URL from /videos tab...", flush=True)
            video_url = None
            try:
                page.goto(f"https://www.facebook.com/{FB_PAGE}/videos", wait_until="domcontentloaded")
                long_wait(page, VIDEOS_TAB_WAIT_MIN, VIDEOS_TAB_WAIT_MAX, "videos tab settle")
                links = page.evaluate(
                    "() => [...document.querySelectorAll('a[href]')]"
                    ".map(a => a.href.split('?')[0])"
                    ".filter(h => (h.includes('/videos/') || h.includes('/reel/')) && h.includes('facebook.com')"
                    " && !h.endsWith('/videos') && !h.endsWith('/videos/') && !h.endsWith('/reel/'))"
                    ".filter((h, i, arr) => arr.indexOf(h) === i)"
                    ".slice(0, 3)")
                print(f"  Recent video URLs: {links}")
                if links:
                    video_url = links[0]
            except Exception as e:
                print(f"  URL fetch error: {e}")

            # -- Post-publish verification ------------------------------------------------------
            # Navigate to the captured URL and confirm the page loads with a video.
            # Without this check, the script can mark "posted" even when Facebook
            # queued the upload and silently dropped it.
            verified = False
            if video_url:
                print(f"\nVerifying live post: {video_url}", flush=True)
                try:
                    resp = page.goto(video_url, wait_until="domcontentloaded", timeout=30000)
                    status_code = resp.status if resp else 0
                    print(f"  HTTP {status_code}")
                    page.wait_for_timeout(rnd(3500, 5500))

                    has_player = page.evaluate(
                        "() => { if (document.querySelector('video')) return 'video';"
                        " if (document.querySelector('[data-video-id], [data-pagelet*=\"video\" i]'))"
                        " return 'player-container';"
                        " const og = document.querySelector('meta[property=\"og:video\"], "
                        "meta[property=\"og:video:url\"]'); if (og) return 'og:video';"
                        " return null; }")
                    print(f"  Player signal: {has_player or 'none'}")

                    if 200 <= status_code < 400 and has_player:
                        verified = True
                        print("  Verified live \u2713")
                    else:
                        print("  Could not verify — post may not be live")
                except Exception as e:
                    print(f"  Verification error: {e}")
            else:
                print("  Skipping verification — no URL captured")

            status = "posted" if (submitted and verified) else "failed"
            short["platforms"][PLATFORM]["status"] = status
            short["platforms"][PLATFORM]["posted_at"] = now_iso_z()
            short["platforms"][PLATFORM]["url"] = video_url
            if not submitted:
                short["platforms"][PLATFORM]["error"] = "posting spinner did not clear"
            elif not verified:
                short["platforms"][PLATFORM]["error"] = f"URL captured but verification failed: {video_url}"
            else:
                short["platforms"][PLATFORM].pop("error", None)
            save(data)

            if submitted and verified:
                print(f"\nDone \u2713  URL: {video_url}")
            else:
                print(f"\nUncertain — verify manually. URL: {video_url or '(not captured)'}")

            if status == "posted":
                print(f"POST OK platform=facebook url={video_url}", flush=True)
            else:
                reason = short["platforms"][PLATFORM].get("error") or "unknown"
                print(f"POST FAIL platform=facebook reason={reason[:120]}", flush=True)

        except SystemExit:
            raise
        except Exception as err:
            short["platforms"][PLATFORM]["status"] = "failed"
            short["platforms"][PLATFORM]["error"] = str(err)
            save(data)
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
