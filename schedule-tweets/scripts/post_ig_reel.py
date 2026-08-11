# post_ig_reel.py — CANONICAL Python port of post-ig-reel.js (2026-08-11,
# posting-tail migration; the JS twin is FROZEN rollback). Status: PORTED,
# BLESS-PENDING — invoke the JS twin for production posts until this port is
# live-blessed with one real post.
#
# Uploads one pending Instagram Reel from data/shorts.json. Instagram web has
# no dedicated "Reel" creation link; uploading a video via the Post flow
# automatically creates a Reel (IG converts all video posts to Reels).
#
# 1:1 port on playwright.sync_api: same igbot-profile Chrome, same stuck-in-
# 'posting' manual-review guard (exit 2, no auto-reset), same video-preview
# wait loop (up to 120s, polling for a <video> element inside the dialog),
# same hover-to-open 9:16 crop-menu strategy (distinct from post-ig-single's
# click-to-open 4:5 strategy — Reels' menu is hover-driven), same conditional
# second wizard "Next" (some reels only have one step), same tolerant Share
# click (a human may have already clicked it), same up-to-9-minute upload-wait
# loop keyed on SUCCESS_RE/ERROR_RE/modal-closed body-text signals (an
# unresolved 9-minute "timeout" outcome still falls through to a 'posted'
# write-back, exactly as the JS does — optimistic-unless-explicitly-erred),
# same 5-minute post-share settle hold before URL capture, same unconditional
# 'posted' status write-back to shorts.json even when the URL scrape comes up
# empty. Also preserves two JS dead-code quirks verbatim: `preShareReelUrls`
# is computed and logged but never compared, and the hover-strategy's
# `tcx`/`tcy` trigger-center coords are computed but never used (the actual
# hover targets the trigger locator directly). Documented divergences ONLY:
# the final machine line (POST OK/FAIL) + this header comment.
import json
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from strip_hashtags import strip_hashtags, build_caption  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).resolve().parent
SHORTS_JSON = SCRIPT_DIR.parent / "data" / "shorts.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile"
WORKSPACE_ROOT = Path(r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets")
IG_USERNAME = "realcodemonkeymike"
PLATFORM = "ig_reels"

ACTION_MIN = int(os.environ.get("IG_ACTION_MIN") or 3000)
ACTION_MAX = int(os.environ.get("IG_ACTION_MAX") or 6000)
CHAR_DELAY_MIN = 40
CHAR_DELAY_MAX = 120
PRE_COMPOSE_MIN = int(os.environ.get("IG_PRE_COMPOSE_MIN") or 15000)
PRE_COMPOSE_MAX = int(os.environ.get("IG_PRE_COMPOSE_MAX") or 45000)


def rnd(min_ms, max_ms):
    return random.randint(min_ms, max_ms)


def action_pause(page, label=""):
    ms = rnd(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {ms / 1000:.1f}s{' (' + label + ')' if label else ''}")
    page.wait_for_timeout(ms)


def long_wait(page, min_ms, max_ms, label=""):
    ms = rnd(min_ms, max_ms)
    print(f"  waiting {round(ms / 1000)}s{' (' + label + ')' if label else ''}...")
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


# IG pops a "Turn on Notifications" (and sometimes "Save your login info?") modal
# on load that traps focus and blocks the Create flow (the Post sub-link never
# appears and input[type=file] never attaches). Dismiss up to 2 with "Not Now".
def dismiss_blocking_dialogs(page):
    for _ in range(2):
        btn = page.get_by_role("button", name=re.compile(r"^Not Now$", re.IGNORECASE)).first
        if btn.count() > 0:
            try:
                btn.click()
            except Exception:
                pass
            print("  Dismissed blocking modal (Not Now)")
            page.wait_for_timeout(1200)
        else:
            break


def click_next(page, step_label):
    print(f"  Clicking Next ({step_label})...")
    btn = page.get_by_role("button", name="Next")
    if btn.count() == 0:
        btn = page.locator('button:has-text("Next")').first
    btn.wait_for(state="visible", timeout=15000)
    mouse_click(page, btn)
    page.wait_for_timeout(2000)


def get_recent_reel_urls(page, count=3):
    page.goto(f"https://www.instagram.com/{IG_USERNAME}/reels/")
    try:
        page.wait_for_load_state("domcontentloaded", timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(2000)
    return page.evaluate(
        """(n) => [...document.querySelectorAll('a[href*="/reel/"]')].slice(0, n).map(a => a.href)""",
        count,
    )


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def main():
    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))

    # Bail if anything is stuck in 'posting' — those need manual review. Prior
    # behavior auto-reset to 'pending' and caused duplicate uploads.
    stuck = [s for s in data["shorts"] if (s.get("platforms", {}).get(PLATFORM) or {}).get("status") == "posting"]
    if stuck:
        print(f"{len(stuck)} short(s) stuck in 'posting' — manual review required:", file=sys.stderr)
        for s in stuck:
            print(f"  - {s.get('id')}: {s.get('title')}", file=sys.stderr)
        print(f"Check instagram.com/{IG_USERNAME}/reels/ to see if any actually published, "
              "then update data/shorts.json before retrying.", file=sys.stderr)
        sys.exit(2)

    short = next(
        (s for s in data["shorts"] if (s.get("platforms", {}).get(PLATFORM) or {}).get("status") == "pending"),
        None,
    )
    if not short:
        print("No pending Instagram Reels. Exiting.")
        sys.exit(0)

    video_path = WORKSPACE_ROOT / short["video_path"]
    if not video_path.exists():
        print(f"Video file not found: {video_path}", file=sys.stderr)
        sys.exit(1)

    caption = build_caption(
        short["platforms"][PLATFORM].get("caption_override") or short.get("caption"),
        short.get("tags"),
        PLATFORM,
    )

    print(f'\nReel: "{short["title"]}"')
    print(f'File: {video_path} ({short.get("duration_seconds")}s)')
    print(f"Caption: {len(caption)} chars")

    short["platforms"][PLATFORM]["status"] = "posting"
    SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print("\nLaunching Chrome...")
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
        browser.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', { get: () => undefined });"
        )
        page = browser.pages[0] if browser.pages else browser.new_page()

        try:
            print("Navigating to Instagram...")
            page.goto("https://www.instagram.com/")
            try:
                page.wait_for_load_state("domcontentloaded", timeout=30000)
            except Exception:
                pass
            page.wait_for_timeout(2000)
            if page.locator('input[name="username"], input[autocomplete="username"]').count() > 0:
                raise RuntimeError("Instagram login form detected — check igbot-profile.")
            print("Instagram home loaded \u2713")
            dismiss_blocking_dialogs(page)

            # -- Pre-compose wait -----------------------------------------------------
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")
            dismiss_blocking_dialogs(page)

            # -- Open Create menu -> Post -----------------------------------------------
            # Instagram converts video uploads to Reels automatically via the Post flow.
            print("Opening Create \u2192 Post...")
            create_btn = None
            for sel in ['a[href="/create/select-type/"]', '[aria-label="New post"]', '[aria-label="Create"]']:
                el = page.locator(sel).first
                if el.count() > 0:
                    create_btn = el
                    break
            if not create_btn:
                create_btn = page.locator('text="Create"').first
            mouse_click(page, create_btn)
            page.wait_for_timeout(1500)

            # Click "Post" from the expanded sidebar
            post_link = page.get_by_role("link", name=re.compile(r"^Post$")).or_(
                page.get_by_role("button", name=re.compile(r"^Post$"))
            ).first
            if post_link.count() == 0:
                post_link = page.locator("a, button, span, div").filter(has_text=re.compile(r"^Post$")).first
            if post_link.count() > 0:
                mouse_click(page, post_link)
                print("  Clicked Post \u2713")
            page.wait_for_timeout(1500)

            # -- Capture profile Reel URLs BEFORE share, so we can diff after ---------
            pre_share_reel_urls = page.evaluate(
                """() => [...new Set([...document.querySelectorAll('a[href*="/reel/"]')]"""
                """.map(a => a.href.split('?')[0]))]"""
            )
            print(f"  Pre-share Reel URLs captured: {len(pre_share_reel_urls)}")

            # -- Upload video file --------------------------------------------------------
            print("Uploading video...")
            file_input = page.locator('input[type="file"]').first
            file_input.wait_for(state="attached", timeout=15000)
            file_input.set_input_files(str(video_path))
            print("  Video set — waiting for preview to render (up to 120s)...")

            # Wait for the video element to appear inside the modal — confirms IG has
            # accepted the file and rendered a preview. A 5s blind wait was too short
            # for ~36s/20MB clips; Next would fire while the button was still disabled.
            preview_ready = False
            for _ in range(60):
                page.wait_for_timeout(2000)
                try:
                    video_count = page.locator('div[role="dialog"] video').count()
                except Exception:
                    video_count = 0
                if video_count > 0:
                    preview_ready = True
                    break
            if not preview_ready:
                raise RuntimeError("Video preview never rendered after setInputFiles")
            print("  Preview rendered \u2713")

            # IG may show an "OK" or "Select crop" dialog for videos — dismiss if present
            for dismiss_sel in ['button:has-text("OK")', 'button:has-text("Select")']:
                el = page.locator(dismiss_sel).first
                if el.count() > 0:
                    mouse_click(page, el)
                    page.wait_for_timeout(1000)

            # -- Select 9:16 (portrait) aspect ratio --------------------------------------
            # IG defaults to 1:1 because Mike's image posts are square; for a vertical
            # video that needs to land as a Reel we must explicitly pick 9:16 before
            # clicking Next. Trigger SVG has aria-label="Select crop"; option SVG has
            # aria-label="Crop portrait icon" (captured 2026-05-21). The option's
            # clickable parent isn't necessarily a <button> — could be div/role="button".
            print("Selecting 9:16 (portrait) crop...")
            # Trigger is a <button>; crop options are <div role="button"> elements.
            # The crop trigger sits at y~725 in a dialog that's often taller than
            # the viewport — scroll it into view first.
            crop_trigger = page.locator('button:has(svg[aria-label="Select crop"])').first
            if crop_trigger.count() > 0:
                try:
                    crop_trigger.scroll_into_view_if_needed(timeout=5000)
                except Exception:
                    pass
                page.wait_for_timeout(400)

                # Hover-to-open strategy. New theory: IG's menu is CSS hover-controlled
                # (or React opens it on mouseenter/pointerover, not click). A click moves
                # cursor on, fires mouseup, then moves away — menu closes immediately.
                # Stay on the trigger via hover, then keep mouse inside the menu region
                # while moving to the option, then click WITHOUT leaving the menu.
                trig_bbox = crop_trigger.bounding_box()
                tcx = trig_bbox["x"] + trig_bbox["width"] / 2
                tcy = trig_bbox["y"] + trig_bbox["height"] / 2
                try:
                    # Hover the trigger — opens menu if it's hover-driven
                    crop_trigger.hover()
                    # Hold the hover (don't move yet) — give menu time to render
                    page.wait_for_timeout(600)

                    # Find 9:16 coords (single evaluate, no DOM mutation)
                    coords = page.evaluate(
                        """() => {
                        const opts = [...document.querySelectorAll('[role="button"]')];
                        for (const el of opts) {
                            const span = el.querySelector('span');
                            if (span && span.textContent.trim() === '9:16') {
                                const r = el.getBoundingClientRect();
                                if (r.width > 0 && r.height > 0) {
                                    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
                                }
                            }
                        }
                        return null;
                    }"""
                    )

                    if coords:
                        print(f"  hover\u2192menu found 9:16 at ({round(coords['x'])}, {round(coords['y'])})")
                        # Move from trigger to option in small steps to keep menu region "active"
                        # (steps argument forces intermediate mousemove events)
                        page.mouse.move(coords["x"], coords["y"], steps=10)
                        page.wait_for_timeout(120)
                        page.mouse.click(coords["x"], coords["y"])
                        print("  \u2713 Clicked 9:16")
                    else:
                        print("  WARN: menu did not open on hover; 9:16 not found")
                except Exception as e:
                    msg = str(e).splitlines()[0] if str(e) else ""
                    print(f"  hover-strategy failed: {msg}")
                page.wait_for_timeout(1500)
            else:
                print("  WARN: crop trigger not found — proceeding with default")

            # -- Next through wizard steps ------------------------------------------------
            click_next(page, "Crop/Trim")
            action_pause(page, "after Trim")

            nb = page.get_by_role("button", name="Next")
            if nb.count() > 0:
                click_next(page, "Filter/Edit")
                action_pause(page, "after Edit")

            # -- Caption ---------------------------------------------------------------------
            print(f"Typing caption ({len(caption)} chars)...")
            caption_area = page.locator(
                '[aria-label="Write a caption..."], textarea[placeholder*="caption"], '
                '[contenteditable][placeholder*="caption"]'
            ).first
            caption_area.wait_for(state="visible", timeout=15000)
            caption_area.click()
            page.wait_for_timeout(500)
            type_human(page, caption)
            page.wait_for_timeout(1000)
            print("Caption typed \u2713")
            action_pause(page, "after caption")

            # -- Pre-share wait -------------------------------------------------------------
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before Share")

            # -- Share ------------------------------------------------------------------------
            # Tolerate "Share button already gone" — this happens if a human clicks
            # Share manually before Playwright reaches this step. We treat that as
            # "Share already done, proceed to confirmation/URL capture".
            print("Clicking Share...")
            try:
                share_btn = page.get_by_role("button", name="Share").first
                share_btn.wait_for(state="visible", timeout=10000)
                mouse_click(page, share_btn)
            except Exception:
                print("  Share button not visible — assuming Share already triggered "
                      "(manually or programmatically), continuing")

            # -- Wait for upload to actually complete server-side -------------------------
            # IG shows a "posting" spinner while the upload processes; the modal stays
            # open until upload completes (or an error toast appears). Watching for
            # those signals lets us not close Chrome before the server is done.
            print("Waiting up to 9 minutes for upload to finish (modal close or success/error toast)...")
            start_wait = time.monotonic()
            success_re = re.compile(
                r"your reel has been shared|reel shared|your post has been shared|"
                r"your video has been shared|posted",
                re.IGNORECASE,
            )
            error_re = re.compile(
                r"something went wrong|try again|couldn.?t upload|couldn.?t share|"
                r"failed to post|action blocked|temporarily restricted",
                re.IGNORECASE,
            )
            result = "timeout"
            while time.monotonic() - start_wait < 540:
                page.wait_for_timeout(2000)
                try:
                    body = page.evaluate("() => document.body.innerText || ''")
                except Exception:
                    body = ""
                if success_re.search(body):
                    result = "success"
                    break
                if error_re.search(body):
                    result = "error"
                    break
                # Composer dialog gone (no upload spinner visible) is also a success signal
                try:
                    composer_open = page.locator('div[role="dialog"]').count()
                except Exception:
                    composer_open = 0
                posting = bool(re.search(r"posting|uploading|sharing", body, re.IGNORECASE))
                if composer_open == 0 and not posting:
                    result = "modal-closed"
                    break
            print(f"  upload wait result: {result} (after {round(time.monotonic() - start_wait)}s)")

            if result == "error":
                # Capture the error message visible to help diagnose
                err_body = page.evaluate(
                    """() => {
                    const text = document.body.innerText || '';
                    const m = text.match(/(something went wrong|action blocked|couldn'?t (?:upload|share)"""
                    """|temporarily restricted|try again).{0,200}/i);
                    return m ? m[0] : '(no specific message)';
                }"""
                )
                raise RuntimeError(f"IG returned an error after Share: {err_body}")

            # Extra settle time (5 minutes) so the new post finishes server-side
            # processing and propagates to the profile grid before we scrape it.
            # IG appears to silently drop uploads that are interrupted by browser
            # close — better to over-wait than to lose the post.
            print("  Holding 5 minutes for IG to finish server-side processing...")
            page.wait_for_timeout(300000)

            # -- Grab URL ------------------------------------------------------------------
            print("Capturing reel URL...")
            reel_url = None
            try:
                urls = get_recent_reel_urls(page, 3)
                if urls:
                    reel_url = urls[0]
            except Exception:
                pass

            if reel_url:
                print(f"\nReel posted: {reel_url}")
            else:
                print("\nReel posted — URL not captured (check Instagram manually).")

            short["platforms"][PLATFORM]["status"] = "posted"
            short["platforms"][PLATFORM]["posted_at"] = _now_iso()
            short["platforms"][PLATFORM]["url"] = reel_url
            SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print("shorts.json updated. Done \u2713")
            print(f"POST OK platform={PLATFORM} url={reel_url or ''}", flush=True)

        except Exception as err:
            short["platforms"][PLATFORM]["status"] = "failed"
            short["platforms"][PLATFORM]["error"] = str(err)
            SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"\nFailed: {err}", file=sys.stderr)
            reason = str(err).splitlines()[0][:120] if str(err) else "unknown"
            print(f"POST FAIL platform={PLATFORM} reason={reason}", flush=True)
            sys.exit(1)
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
