# upload_longform_bitchute.py — CANONICAL Python port of upload-longform-bitchute.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
#
# 1:1 port on playwright.sync_api: same bitchutebot-profile Chrome, same selectors,
# same mandatory-thumbnail rule (a missing thumbnail turns Proceed into a permanent
# silent no-op — grab a frame off the video), same .webp refusal, same letters-only
# search-terms filter, same three click strategies + 30s retry loop, same
# upload_code URL capture, same title-keyed longs.json write-back.
# Documented divergences ONLY: machine lines (POST OK/FAIL) + 60s post-run hold.
import random
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from longform_queue import pick_next_longform, record_longform_post, strip_music_credits  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

REJECTED_THUMBNAIL_EXTS = {".webp"}
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\bitchutebot-profile"
BITCHUTE_HOME = "https://www.bitchute.com/"
MIN_FILE_SIZE = 1_000_000

CHAR_DELAY_MIN, CHAR_DELAY_MAX = 40, 120
ACTION_MIN, ACTION_MAX = 3000, 6000


def rnd(a, b):
    return random.randint(a, b)


def action_pause(page, label=""):
    ms = rnd(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {ms / 1000:.1f}s{' (' + label + ')' if label else ''}", flush=True)
    page.wait_for_timeout(ms)


def type_human(page, locator, text):
    locator.click()
    page.wait_for_timeout(rnd(200, 500))
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def grab_thumbnail(page):
    """BitChute REQUIRES a thumbnail (see the JS twin's 2026-08-07 verification)."""
    try:
        video_el = page.locator("video").first
        video_el.wait_for(state="attached", timeout=30000)
        video_el.evaluate("el => { el.currentTime = 1; }")
        page.wait_for_timeout(1000)
        page.get_by_role("button", name="Grab Thumbnail").click(timeout=10000)
        print("  Grab Thumbnail clicked ✓")
        page.wait_for_timeout(1500)
        return True
    except Exception as e:
        print(f"  WARNING: Grab Thumbnail failed ({str(e).splitlines()[0]})")
        print("  Proceed will no-op without a thumbnail — expect the 15-min retry loop to time out.")
        return False


def close_drawer(page):
    try:
        backdrop = page.locator(".q-drawer__backdrop").first
        if backdrop.is_visible():
            page.keyboard.press("Escape")
            page.wait_for_timeout(600)
            if backdrop.is_visible():
                backdrop.click()
                page.wait_for_timeout(600)
    except Exception:
        pass


def main():
    job = pick_next_longform("bitchute")
    if not job:
        print("No pending BitChute longform in longs.json (every entry already posted/skipped).",
              file=sys.stderr)
        sys.exit(1)
    metadata, video_path, thumb_path = job["metadata"], job["video_path"], job["thumb_path"]
    if not video_path or not video_path.exists():
        print(f"video_path missing on disk: {video_path}", file=sys.stderr)
        sys.exit(1)
    if thumb_path and thumb_path.suffix.lower() in REJECTED_THUMBNAIL_EXTS:
        print(f'Thumbnail "{thumb_path.name}" is .webp — BitChute silently rejects .webp thumbnails.',
              file=sys.stderr)
        print("Convert it to PNG or JPG and re-run (a .webp causes a no-op Proceed -> 15-min retry loop).",
              file=sys.stderr)
        sys.exit(1)

    file_size = video_path.stat().st_size
    if file_size < MIN_FILE_SIZE:
        print(f"Video below 1MB minimum ({file_size} bytes)", file=sys.stderr)
        sys.exit(1)
    has_thumb = bool(thumb_path)
    title = (metadata.get("title") or "").strip()
    description = strip_music_credits((metadata.get("description") or "").strip())
    tags = metadata.get("tags") or []
    # Max 3 search terms, letters A-Z only (digits throw a validation popup that
    # blocks publish AND is misread as the missing-thumbnail modal).
    search_terms = " ".join([t for t in tags if re.fullmatch(r"[A-Za-z]+", t)][:3])

    print(f'\nLongform: "{title}"')
    print(f"File:  {video_path}")
    print(f"Size:  {file_size / 1024 / 1024:.1f} MB")
    print(f"Thumb: {thumb_path if has_thumb else '(none)'}")
    print(f"Description: {len(description)} chars")
    print(f"Search terms: {search_terms}", flush=True)

    from playwright.sync_api import sync_playwright

    print("\nLaunching Chrome...", flush=True)
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            CHROME_PROFILE, channel="chrome", headless=False, slow_mo=50,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
        context.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = context.pages[0] if context.pages else context.new_page()
        video_url = None
        try:
            print(f"Navigating to {BITCHUTE_HOME}...", flush=True)
            page.goto(BITCHUTE_HOME, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            print(f"  Landed: {page.url}")

            close_drawer(page)

            print("Waiting for upload icon (video_call) to confirm logged-in state...", flush=True)
            try:
                page.wait_for_function(
                    "() => !![...document.querySelectorAll('button')].find("
                    "b => b.innerText && b.innerText.trim().includes('video_call'))",
                    timeout=600000)
                print("  Logged in ✓")
                page.wait_for_timeout(1500)
                close_drawer(page)
            except Exception:
                raise RuntimeError("Timed out waiting for upload icon — sign in to BitChute and retry.")

            close_drawer(page)
            page.wait_for_timeout(500)

            print("Clicking upload button (video_call icon)...", flush=True)
            upload_icon = page.locator('button:has-text("video_call")').first
            upload_icon.wait_for(state="attached", timeout=10000)
            upload_icon.evaluate("el => el.click()")
            print("  Upload icon clicked ✓")
            page.wait_for_timeout(800)

            print('Clicking "Upload Video" dropdown item...', flush=True)
            upload_video_el = page.get_by_text("Upload Video", exact=True).first
            try:
                upload_video_el.wait_for(state="visible", timeout=10000)
            except Exception:
                pass

            with context.expect_page(timeout=15000) as page_info:
                upload_video_el.evaluate("el => el.click()")
            upload_page = page_info.value
            upload_page.wait_for_load_state("domcontentloaded")
            print(f"  Upload page: {upload_page.url}")
            action_pause(upload_page, "upload page loaded")

            print(f"Attaching video ({file_size / 1024 / 1024:.1f} MB)...", flush=True)
            video_input = upload_page.locator('input[type="file"]').nth(0)
            video_input.wait_for(state="attached", timeout=20000)
            video_input.set_input_files(str(video_path))
            print("  Video attached ✓")
            upload_page.wait_for_timeout(2000)

            print(f"Typing title ({len(title)} chars)...", flush=True)
            title_el = upload_page.locator('input[placeholder="Title"]').first
            title_el.wait_for(state="visible", timeout=15000)
            type_human(upload_page, title_el, title)
            print("  Title typed ✓")
            action_pause(upload_page, "after title")

            print(f"Typing description ({len(description)} chars)...", flush=True)
            desc_el = upload_page.locator("textarea").first
            desc_el.wait_for(state="visible", timeout=10000)
            type_human(upload_page, desc_el, description)
            print("  Description typed ✓")
            action_pause(upload_page, "after description")

            print(f"Typing search terms: {search_terms}", flush=True)
            tags_el = upload_page.locator('input[placeholder="Search Terms"]').first
            tags_el.wait_for(state="visible", timeout=10000)
            type_human(upload_page, tags_el, search_terms)
            print("  Search terms typed ✓")
            action_pause(upload_page, "after tags")

            # Thumbnail — MANDATORY (Proceed silently no-ops without one).
            if has_thumb:
                print(f"Attaching custom thumbnail: {thumb_path}", flush=True)
                try:
                    thumb_input = upload_page.locator('input[type="file"]').nth(1)
                    thumb_input.wait_for(state="attached", timeout=10000)
                    thumb_input.set_input_files(str(thumb_path))
                    print("  Thumbnail attached ✓")
                except Exception as e:
                    print(f"  Warning: thumbnail attach failed ({str(e).splitlines()[0]}) — "
                          "falling back to Grab Thumbnail")
                    grab_thumbnail(upload_page)
            else:
                print("No thumbnail supplied — grabbing a frame off the video (BitChute requires one)...",
                      flush=True)
                grab_thumbnail(upload_page)
            action_pause(upload_page, "after thumbnail")

            print("Waiting for upload to finish (Proceed enabled)...", flush=True)
            proceed_btn = upload_page.get_by_role("button", name="Proceed").first
            proceed_btn.wait_for(state="visible", timeout=30000)
            for _ in range(1800):  # up to 15 min
                disabled = proceed_btn.get_attribute("disabled")
                aria_disabled = proceed_btn.get_attribute("aria-disabled")
                if disabled is None and aria_disabled != "true":
                    break
                upload_page.wait_for_timeout(500)
            print("  Proceed button enabled ✓")

            try:
                err_msg = upload_page.locator("text=/Error during upload/i").first
                if err_msg.is_visible():
                    print("  Upload error detected — clicking retry...")
                    retry_btn = upload_page.locator(
                        '[title*="retry" i], [aria-label*="retry" i]').first
                    retry_btn.click()
                    upload_page.wait_for_timeout(5000)
                    proceed_btn.wait_for(state="visible", timeout=900000)
            except Exception:
                pass

            # "Publish right away" (usually checked by default)
            try:
                publish_cb = upload_page.locator("input#publish").first
                publish_cb.wait_for(state="attached", timeout=5000)
                if not publish_cb.is_checked():
                    upload_page.locator('label[for="publish"]').click()
                    print("  Publish right away — toggled ON ✓")
                else:
                    print("  Publish right away — already checked ✓")
            except Exception:
                print("  Warning: publish checkbox not found via #publish — proceeding")
            upload_page.wait_for_timeout(800)

            url_before = upload_page.url
            print(f"  URL before Proceed: {url_before}")

            submit_sel = 'button.btn.btn-primary[type="submit"]'
            url_after = url_before

            # Strategy 1: Playwright .click() — real mouse event, same as the shorts script
            print("  Trying Playwright .click()...", flush=True)
            try:
                btn = upload_page.locator(submit_sel).first
                btn.wait_for(state="visible", timeout=5000)
                btn.click(timeout=10000)
                print("  Playwright .click() ✓")
            except Exception as e:
                print(f"  Playwright .click() failed: {str(e).splitlines()[0]}")
            upload_page.wait_for_timeout(3000)
            url_after = upload_page.url
            print(f"  URL after Playwright click: {'(changed)' if url_after != url_before else '(unchanged)'}")

            # Strategy 2: force click
            if url_after == url_before:
                print("  Trying Playwright .click(force=True)...", flush=True)
                try:
                    upload_page.locator(submit_sel).first.click(force=True, timeout=5000)
                    print("  Force-click ✓")
                except Exception as e:
                    print(f"  Force-click failed: {str(e).splitlines()[0]}")
                upload_page.wait_for_timeout(3000)
                url_after = upload_page.url
                print(f"  URL after force-click: {'(changed)' if url_after != url_before else '(unchanged)'}")

            # Strategy 3: mouse.click at coords
            if url_after == url_before:
                print("  Trying mouse.click() at button coords...", flush=True)
                try:
                    box = upload_page.locator(submit_sel).first.bounding_box()
                    if box:
                        upload_page.mouse.click(box["x"] + box["width"] / 2,
                                                box["y"] + box["height"] / 2)
                        print(f"  mouse.click() at ({box['x'] + box['width']/2}, "
                              f"{box['y'] + box['height']/2}) ✓")
                    else:
                        print("  No bounding box — cannot mouse-click")
                except Exception as e:
                    print(f"  mouse.click() failed: {str(e).splitlines()[0]}")
                upload_page.wait_for_timeout(3000)
                url_after = upload_page.url
                print(f"  URL after mouse.click(): {'(changed)' if url_after != url_before else '(unchanged)'}")

            if url_after == url_before:
                print("  WARNING: URL did not change on first attempt — entering retry-click loop.")
                print("  (Proceed is enabled but BitChute ignores clicks until the file upload finishes.)")
                print("  Will re-click every 30s until URL changes or 15-min timeout.", flush=True)

            import time as _time
            retry_start = _time.monotonic()
            retry_max_s = 15 * 60
            while url_after == url_before and _time.monotonic() - retry_start < retry_max_s:
                upload_page.wait_for_timeout(30000)
                try:
                    upload_page.locator(submit_sel).first.click(timeout=5000)
                    print(f"  [retry] Proceed re-clicked at +{round(_time.monotonic() - retry_start)}s",
                          flush=True)
                except Exception as e:
                    print(f"  [retry] Click failed: {str(e).splitlines()[0]}")
                upload_page.wait_for_timeout(2000)
                url_after = upload_page.url
                if url_after != url_before:
                    print(f"  [retry] URL CHANGED -> {url_after}")
                    break

            print("Waiting for /content redirect (up to 15 min for large files)...", flush=True)
            try:
                upload_page.wait_for_url("**/content**", timeout=15 * 60 * 1000)
                print("  Redirected to /content ✓")
            except Exception:
                print("  Warning: no /content redirect — submission may still have gone through")
            print("Waiting 30s for any final page transition...", flush=True)
            upload_page.wait_for_timeout(30000)

            # The upload_code in the upload-page URL IS the final video ID (verified
            # 2/2 on 2026-08-07) — deterministic, beats scraping /content.
            code_match = re.search(r"[?&]upload_code=([A-Za-z0-9]+)", url_before)
            if code_match:
                video_url = f"https://www.bitchute.com/video/{code_match.group(1)}/"
            else:
                print("  URL capture: no upload_code in the upload URL — falling back to /content scrape.")
                try:
                    upload_page.goto("https://www.bitchute.com/content",
                                     wait_until="domcontentloaded")
                    upload_page.wait_for_timeout(8000)
                    video_url = upload_page.evaluate(
                        "(wantTitle) => { const norm = s => (s || '').replace(/\\s+/g, ' ')"
                        ".trim().toLowerCase(); const want = norm(wantTitle).slice(0, 40);"
                        " for (const a of document.querySelectorAll('a[href*=\"/video/\"]')) {"
                        " const card = a.closest('div, li, article') || a;"
                        " if (norm(card.innerText).includes(want)) {"
                        " return new URL(a.getAttribute('href'), location.origin).href; } }"
                        " return null; }", title)
                except Exception as e:
                    print(f"  URL capture failed: {str(e).splitlines()[0]}")

            if video_url:
                print(f"\nPosted: {video_url}")
                record_longform_post("bitchute", metadata.get("title"), video_url)
                print(f"POST OK platform=bitchute url={video_url}", flush=True)
            else:
                print("\nPosted (processing) — video URL not captured.")
                print("WARNING: longs.json still says pending. Run scripts/_list-bitchute-content.js "
                      "and record the URL, otherwise the next run will re-upload this same video.")
                print("POST FAIL platform=bitchute reason=no-url-captured", flush=True)
            print("Done ✓")
            print("\nLeaving browser open 60s for settle/inspection.", flush=True)
            upload_page.wait_for_timeout(60000)
            sys.exit(0 if video_url else 1)
        except SystemExit:
            raise
        except Exception as err:
            print(f"\nFailed: {err}", file=sys.stderr, flush=True)
            print(f"POST FAIL platform=bitchute reason={str(err).splitlines()[0][:120]}", flush=True)
            try:
                page.wait_for_timeout(60000)
            except Exception:
                pass
            sys.exit(1)
        finally:
            try:
                context.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
