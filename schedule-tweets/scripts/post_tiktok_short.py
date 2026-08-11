# post_tiktok_short.py — CANONICAL Python port of post-tiktok-short.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback). Status:
# PORTED, BLESS-PENDING — invoke the JS twin for production posts until this
# port is live-blessed with one real post.
#
# Uploads one pending TikTok video from data/shorts.json.
#
# TikTok aggressively detects automation, so we DON'T use launch_persistent_context
# with a Playwright-managed profile. Instead we spawn the user's REAL Chrome
# (the same chrome.exe they use daily) with --remote-debugging-port=9224 and
# --user-data-dir pointed at their main "User Data" directory (where their
# existing TikTok login lives). We then attach Playwright via connect_over_cdp —
# TikTok never sees Playwright's launch flags because they don't exist on this
# Chrome instance. Same trick that fixed YouTube polls.
#
# REQUIREMENT: All Chrome windows must be FULLY CLOSED before running. Chrome
# can't open a second instance against the same User Data dir, and it can't
# add --remote-debugging-port to an already-running instance.
#
# 1:1 port on playwright.sync_api: same tiktokbot-profile user-data-dir, same
# CDP spawn/attach dance, same selectors in the same fallback order, same
# CDP-based file attach (bypasses connect_over_cdp's upload size limit), same
# login wait (up to 10 min), same human pacing, same confirmation detection,
# same write-back semantics, same exit codes.
# Documented divergences ONLY: (a) final machine line (POST OK/FAIL) for the
# LangGraph wrapper to parse; (b) this header/status block.
import json
import os
import random
import socket
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from strip_hashtags import strip_hashtags, build_caption  # noqa: E402,F401

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
SHORTS_JSON = HERE.parent / "data" / "shorts.json"
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAIN_USER_DATA = r"C:\Users\mnede\AppData\Local\Google\Chrome\tiktokbot-profile"
WORKSPACE_ROOT = Path(r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets")
DEBUG_DIR = WORKSPACE_ROOT / "tmp-tiktok-debug"
CDP_PORT = 9224
TIKTOK_UPLOAD_URL = "https://www.tiktok.com/tiktokstudio/upload?lang=en"
PLATFORM = "tiktok"

# Timing constants mirrored from post-fb-short.js / post-x-short.js
CHAR_DELAY_MIN = 60
CHAR_DELAY_MAX = 150
ACTION_MIN = int(os.environ.get("TT_ACTION_MIN") or 4000)
ACTION_MAX = int(os.environ.get("TT_ACTION_MAX") or 7000)
PRE_COMPOSE_MIN = int(os.environ.get("TT_PRE_COMPOSE_MIN") or 60000)
PRE_COMPOSE_MAX = int(os.environ.get("TT_PRE_COMPOSE_MAX") or 180000)
PRE_POST_MIN = int(os.environ.get("TT_PRE_POST_MIN") or 60000)
PRE_POST_MAX = int(os.environ.get("TT_PRE_POST_MAX") or 180000)

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


def is_cdp_ready():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.6)
    try:
        s.connect(("127.0.0.1", CDP_PORT))
        return True
    except Exception:
        return False
    finally:
        try:
            s.close()
        except Exception:
            pass


def start_chrome():
    if is_cdp_ready():
        print(f"Chrome already on CDP {CDP_PORT} \u2713")
        return None
    print(f"Launching real Chrome with main profile + CDP port {CDP_PORT}...")
    print("(if this hangs, you still have a Chrome window open — close it and re-run)")
    proc = subprocess.Popen(
        [CHROME_EXE,
         f"--user-data-dir={MAIN_USER_DATA}",
         f"--remote-debugging-port={CDP_PORT}",
         "--no-first-run",
         "--disable-blink-features=AutomationControlled",
         "--disable-sync",
         "--no-default-browser-check",
         "about:blank"],
        stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    for _ in range(120):
        time.sleep(0.5)
        if is_cdp_ready():
            print(f"Chrome ready on CDP {CDP_PORT} \u2713")
            return proc
    raise RuntimeError(
        f"Chrome did not open CDP {CDP_PORT} within 60s.\n"
        f"Likely cause: another Chrome window is already open against {MAIN_USER_DATA}.\n"
        "Close ALL Chrome windows (use Task Manager if needed) and re-run.")


def snapshot(page, label):
    try:
        page.screenshot(path=str(DEBUG_DIR / f"{label}.png"), full_page=False)
    except Exception:
        pass
    buttons = page.evaluate(
        "() => [...document.querySelectorAll('[role=\"button\"], button')]"
        ".filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })"
        ".map(el => ({ text: (el.innerText || '').trim().slice(0, 40), aria: el.getAttribute('aria-label'),"
        " disabled: el.getAttribute('aria-disabled') === 'true' || el.disabled }))"
        ".filter(b => b.text || b.aria)"
        ".slice(0, 40)")
    (DEBUG_DIR / f"{label}.json").write_text(json_dumps(buttons), encoding="utf-8")
    print(f"  [{label}] {len(buttons)} clickable elements \u2192 {label}.{{png,json}}")
    return buttons


def main():
    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))

    # Bail if anything is stuck in 'posting' — those need manual review. Prior
    # behavior auto-reset to 'pending' and caused duplicate uploads.
    stuck = [s for s in data["shorts"] if (s["platforms"].get(PLATFORM) or {}).get("status") == "posting"]
    if stuck:
        print(f"{len(stuck)} short(s) stuck in 'posting' — manual review required:", file=sys.stderr)
        for s in stuck:
            print(f"  - {s['id']}: {s['title']}", file=sys.stderr)
        print("Check tiktok.com user profile to see if any actually published, then update "
              "data/shorts.json before retrying.", file=sys.stderr)
        sys.exit(2)

    for s in data["shorts"]:
        if not s["platforms"].get(PLATFORM):
            s["platforms"][PLATFORM] = {
                "status": "pending", "posted_at": None, "url": None,
                "views": None, "views_captured_at": None, "caption_override": None,
            }

    short = next((s for s in data["shorts"] if (s["platforms"].get(PLATFORM) or {}).get("status") == "pending"),
                 None)
    if not short:
        print("No pending TikTok shorts. Exiting.")
        sys.exit(0)

    video_path = WORKSPACE_ROOT / short["video_path"]
    if not video_path.exists():
        print("Video not found:", video_path, file=sys.stderr)
        sys.exit(1)

    caption = build_caption(short["platforms"][PLATFORM].get("caption_override") or short.get("caption"),
                            short.get("tags"), PLATFORM)

    print(f'\nShort: "{short["title"]}"')
    print(f'File:  {video_path} ({short["duration_seconds"]}s)')
    print(f"Caption: {len(caption)} chars")

    short["platforms"][PLATFORM]["status"] = "posting"
    save(data)

    chrome_proc = start_chrome()

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{CDP_PORT}")
        ctx = browser.contexts[0]
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        try:
            print(f"\nNavigating to {TIKTOK_UPLOAD_URL}...", flush=True)
            page.goto(TIKTOK_UPLOAD_URL, wait_until="load")
            page.wait_for_timeout(4000)
            print(f"  Landed: {page.url}")
            snapshot(page, "01_landed")

            # -- Login check -----------------------------------------------------------
            # If we land on /login, wait up to 10 minutes for the user to sign in
            # manually in the open Chrome window. Real Chrome + real user fingerprint
            # is TikTok's happiest case — login should work here even when their
            # bot-detection blocked the tiktokbot-profile.
            logged_in = False
            try:
                page.wait_for_selector('input[type="file"]', state="attached", timeout=12000)
                logged_in = True
                print("Logged in \u2713")
            except Exception:
                url = page.url
                print(f"Not yet logged in (at: {url})")
                print("Please sign in to TikTok in the open Chrome window (up to 10 minutes)...")
                try:
                    page.wait_for_function(
                        "() => { const u = window.location.href;"
                        " return u.includes('tiktok.com') &&"
                        " !u.includes('/login') && !u.includes('/signup') && !u.includes('/passport'); }",
                        timeout=600000)
                    print("  Login complete \u2713 — navigating back to upload page")
                    page.wait_for_timeout(3000)
                    page.goto(TIKTOK_UPLOAD_URL, wait_until="load")
                    page.wait_for_timeout(4000)
                    page.wait_for_selector('input[type="file"]', state="attached", timeout=20000)
                    logged_in = True
                except Exception as e:
                    raise RuntimeError(f"Login wait timed out or failed: {str(e).splitlines()[0]}")
            action_pause(page, "after login check")

            # -- Pre-composer human pause -----------------------------------------------
            print("Pre-composer wait (60-180s)...", flush=True)
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before attaching video")

            # -- Attach video --------------------------------------------------------------
            # Use DOM.setFileInputFiles via CDP to bypass Playwright's 50MB connect_over_cdp limit
            print(f"Attaching video: {video_path}", flush=True)
            cdp = ctx.new_cdp_session(page)
            root = cdp.send("DOM.getDocument")["root"]
            node = cdp.send("DOM.querySelector", {"nodeId": root["nodeId"], "selector": 'input[type="file"]'})
            cdp.send("DOM.setFileInputFiles", {"files": [str(video_path)], "nodeId": node["nodeId"]})
            try:
                cdp.detach()
            except Exception:
                pass
            print("  Video attached via CDP \u2713")
            action_pause(page, "after attach")

            # -- Wait for caption composer -------------------------------------------------
            print("Waiting for caption composer (up to 90s)...", flush=True)
            caption_field = None
            for sel in ['div[contenteditable="true"][role="combobox"]',
                        'div[data-text="true"]', 'div[contenteditable="true"]']:
                loc = page.locator(sel).first
                try:
                    loc.wait_for(state="visible", timeout=30000)
                    caption_field = loc
                    print(f"  Composer found via: {sel}")
                    break
                except Exception:
                    pass
            if not caption_field:
                raise RuntimeError("TikTok caption composer never appeared — bot detection blocked the upload.")
            snapshot(page, "02_composer_ready")
            action_pause(page, "after composer ready")

            # -- Dismiss onboarding overlay if present ---------------------------------------
            try:
                overlay = page.locator('[data-test-id="overlay"]').first
                overlay.wait_for(state="visible", timeout=3000)
                print("Dismissing onboarding overlay...")
                clicked = False
                for sel in ['button[data-action="skip"]', 'button[data-action="close"]']:
                    btn = page.locator(sel).first
                    if btn.is_visible():
                        btn.click()
                        clicked = True
                        break
                if not clicked:
                    page.keyboard.press("Escape")
                overlay.wait_for(state="hidden", timeout=5000)
                page.wait_for_timeout(2000)
            except Exception:
                pass

            # -- Type caption (clear default first, then type with human delays) -------------
            print(f"Typing caption ({len(caption)} chars) at 60-150ms/char...", flush=True)
            caption_field.evaluate("el => el.click()")
            page.wait_for_timeout(rnd(500, 1200))
            # Clear any auto-populated text (TikTok pre-fills the filename)
            page.keyboard.press("Control+A")
            page.wait_for_timeout(300)
            page.keyboard.press("Delete")
            page.wait_for_timeout(500)
            type_human(page, caption)
            print("  Caption typed \u2713")
            action_pause(page, "after caption")
            snapshot(page, "03_caption_done")

            # -- Pre-post human pause -------------------------------------------------------
            print("Pre-post wait (60-180s)...", flush=True)
            long_wait(page, PRE_POST_MIN, PRE_POST_MAX, "before Post")

            # -- Click Post button ------------------------------------------------------------
            print("Looking for Post button...", flush=True)
            post_btn = None
            for btn_name in ["Post", "Publish"]:
                candidate = page.get_by_role("button", name=btn_name).first
                try:
                    candidate.wait_for(state="visible", timeout=10000)
                    post_btn = candidate
                    print(f'  Found submit button: "{btn_name}"')
                    break
                except Exception:
                    pass
            if not post_btn:
                raise RuntimeError("Post button never appeared.")

            post_btn.click()
            print("  Post clicked \u2713")
            page.wait_for_timeout(rnd(2500, 4500))
            snapshot(page, "04_after_post_click")

            # -- Optional confirmation dialog ---------------------------------------------------
            try:
                confirm_btn = page.get_by_role("button", name="Post").first
                confirm_btn.wait_for(state="visible", timeout=5000)
                print("  Confirmation dialog — confirming...")
                confirm_btn.click()
                page.wait_for_timeout(rnd(2000, 4000))
            except Exception:
                pass

            # -- Wait for success toast or redirect (up to 5 min) --------------------------------
            print("Waiting for confirmation (up to 5 min)...", flush=True)
            confirmed = False
            try:
                page.wait_for_selector(
                    "text=/your video is being uploaded|video has been posted|posted successfully/i",
                    timeout=300000)
                confirmed = True
                print("  Success toast detected \u2713")
            except Exception:
                try:
                    page.wait_for_url("**/tiktokstudio/content**", timeout=60000)
                    confirmed = True
                    print("  Redirected to content dashboard \u2713")
                except Exception:
                    pass
            if not confirmed:
                raise RuntimeError("No confirmation after posting — check the browser manually.")
            snapshot(page, "05_confirmed")

            # -- Capture latest video URL from /tiktokstudio/content -----------------------------
            print("\nCapturing TikTok URL from content dashboard...", flush=True)
            video_url = None
            try:
                page.goto("https://www.tiktok.com/tiktokstudio/content", wait_until="domcontentloaded")
                page.wait_for_timeout(rnd(5000, 9000))
                video_url = page.evaluate(
                    "() => { const links = [...document.querySelectorAll('a[href*=\"/video/\"], "
                    "a[href*=\"/@\"]')].map(a => a.href.split('?')[0])"
                    r".filter(h => /\/video\/\d+/.test(h));"
                    " return links[0] || null; }")
                print(f"  URL: {video_url or '(not found)'}")
            except Exception as e:
                print(f"  URL fetch error: {e}")

            # -- URL captured — close Chrome immediately, verify via HTTP (no browser needed) ----
            try:
                browser.close()
            except Exception:
                pass
            if chrome_proc:
                try:
                    chrome_proc.kill()
                except Exception:
                    pass
            print("  Chrome closed \u2713")

            # -- Verify the post is live via HTTP fetch (no browser needed) ------------------------
            verified = False
            if video_url:
                print(f"\nVerifying live post: {video_url}", flush=True)
                try:
                    try:
                        resp = requests.get(video_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                        status_code = resp.status_code
                    except Exception:
                        status_code = 0
                    print(f"  HTTP {status_code}")
                    if 200 <= status_code < 400:
                        verified = True
                        print("  Verified live \u2713")
                    else:
                        print("  Not yet live (still processing) — URL captured, marking posted.")
                except Exception as e:
                    print(f"  Verification error: {e}")

            short["platforms"][PLATFORM]["status"] = "posted" if confirmed else "failed"
            short["platforms"][PLATFORM]["posted_at"] = now_iso_z()
            short["platforms"][PLATFORM]["url"] = video_url or "https://www.tiktok.com/tiktokstudio/content"
            if not confirmed:
                short["platforms"][PLATFORM]["error"] = "no confirmation"
            else:
                short["platforms"][PLATFORM].pop("error", None)
            save(data)

            if confirmed:
                print(f"\nDone \u2713  URL: {video_url or '(dashboard)'}")
            else:
                print(f"\nUncertain — verify manually. URL: {video_url}")

            if confirmed:
                print(f"POST OK platform=tiktok url={short['platforms'][PLATFORM]['url']}", flush=True)
            else:
                print("POST FAIL platform=tiktok reason=no-confirmation", flush=True)

        except SystemExit:
            raise
        except Exception as err:
            short["platforms"][PLATFORM]["status"] = "failed"
            short["platforms"][PLATFORM]["error"] = str(err)
            save(data)
            print(f"\nFailed: {err}", file=sys.stderr, flush=True)
            print(f"POST FAIL platform=tiktok reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
            # Chrome is killed as soon as URL is captured (above). This is a safety
            # net for error paths.
            try:
                browser.close()
            except Exception:
                pass
            if chrome_proc:
                try:
                    chrome_proc.kill()
                except Exception:
                    pass


if __name__ == "__main__":
    main()
