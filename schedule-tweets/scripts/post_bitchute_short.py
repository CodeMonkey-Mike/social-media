# post_bitchute_short.py — CANONICAL Python port of post-bitchute-short.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
#
# Uploads one pending BitChute video from data/shorts.json via bitchutebot-profile
# (real Chrome, persistent context). 1:1 port: same stuck-'posting' bail (exit 2),
# same pre-upload /content duplicate check, same upload_code URL capture, same
# custom-thumbnail-first (FilePond processing-complete wait) with Grab-Thumbnail
# fallback, same 3-attempt missing-thumbnail self-recovery, same never-mark-posted-
# without-positive-confirmation gate, same og:title liveness check with
# posted_unverified fallback. Documented divergences ONLY: final machine line
# (POST OK/FAIL platform=bitchute).
import json
import os
import random
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SHORTS_JSON = Path(__file__).resolve().parent.parent / "data" / "shorts.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\bitchutebot-profile"
WORKSPACE_ROOT = r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets"
BITCHUTE_HOME = "https://www.bitchute.com/"
PLATFORM = "bitchute"
MIN_FILE_SIZE = 1_000_000  # 1 MB — BitChute hard minimum

CHAR_DELAY_MIN, CHAR_DELAY_MAX = 40, 120
ACTION_MIN = int(os.environ.get("BC_ACTION_MIN", 3000))
ACTION_MAX = int(os.environ.get("BC_ACTION_MAX", 6000))
PRE_COMPOSE_MIN = int(os.environ.get("BC_PRE_COMPOSE_MIN", 10000))
PRE_COMPOSE_MAX = int(os.environ.get("BC_PRE_COMPOSE_MAX", 25000))


def rnd(a, b):
    return random.randint(a, b)


def now_iso_z():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def save(data):
    SHORTS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False),
                           encoding="utf-8")


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


def scrape_content_page(page):
    """Scrape the logged-in /content (Studio) dashboard for {title, url, videoId}
    per video card. Used for both the pre-upload duplicate check and the
    post-upload publish confirmation."""
    page.goto(BITCHUTE_HOME.rstrip("/") + "/content", wait_until="domcontentloaded")
    page.wait_for_timeout(3500)
    try:
        page.wait_for_function(
            "() => document.querySelectorAll('a[href*=\"/video/\"]').length > 0"
            " || /no videos|nothing here/i.test(document.body.innerText || '')",
            timeout=20000)
    except Exception:
        pass
    return page.evaluate(
        "() => { const items = []; const seen = new Set();"
        " document.querySelectorAll('a[href*=\"/video/\"]').forEach(a => {"
        " const href = a.getAttribute('href') || '';"
        " const m = href.match(/\\/video\\/([\\w-]+)/); if (!m) return;"
        " const videoId = m[1]; if (seen.has(videoId)) return;"
        " let title = (a.innerText || '').trim(); let node = a;"
        " for (let i = 0; i < 8 && !title && node && node.parentElement; i++) {"
        " node = node.parentElement;"
        " const h = node.querySelector && node.querySelector('h1, h2, h3, h4, h5, .title, [class*=\"title\"]');"
        " if (h && h.innerText) { title = h.innerText.trim(); break; } }"
        " if (!title) title = (a.getAttribute('title') || a.getAttribute('aria-label') || '').trim();"
        " if (!title) return;"
        " const url = href.startsWith('http') ? href : `https://www.bitchute.com${href}`;"
        " items.push({ videoId, title, url }); seen.add(videoId); });"
        " return items; }")


def _norm_title(s):
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def find_by_title(items, target):
    t = _norm_title(target)
    return next((it for it in items if _norm_title(it["title"]) == t), None)


def ensure_thumb_file(short, video_path):
    """Resolve a thumbnail IMAGE file for BitChute's custom-thumbnail input.
    Grab Thumbnail is unreliable for some clips (silent no-register ->
    missing-thumbnail modal -> failed publish); a real JPG upload is the robust
    path. Prefer short.thumbnail_path; else extract frame 0 with ffmpeg."""
    try:
        if short.get("thumbnail_path"):
            p = Path(WORKSPACE_ROOT) / short["thumbnail_path"]
            if p.exists():
                return str(p)
        vp = Path(video_path)
        out = vp.parent / f"{vp.stem}-thumb.jpg"
        if not out.exists():
            subprocess.run(["ffmpeg", "-y", "-i", str(vp), "-frames:v", "1",
                            "-q:v", "2", str(out)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                           check=True)
        return str(out) if out.exists() else None
    except Exception as e:
        print(f"  ⚠ Could not prepare a custom thumbnail ({str(e).splitlines()[0]}) "
              "— will fall back to Grab Thumbnail.")
        return None


def close_drawer(page):
    """Close BitChute's side drawer if open. Don't toggle if already closed —
    clicking the menu would re-open it."""
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
    from strip_hashtags import build_caption

    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))

    # Bail if anything is stuck in 'posting' — those need manual review. The
    # previous auto-reset behavior caused duplicate uploads when a prior run
    # succeeded on BitChute but died before flipping the JSON to 'posted'.
    stuck = [s for s in data["shorts"]
             if (s["platforms"].get(PLATFORM) or {}).get("status") == "posting"]
    if stuck:
        print(f"{len(stuck)} short(s) stuck in 'posting' — manual review required:",
              file=sys.stderr)
        for s in stuck:
            print(f"  - {s['id']}: {s['title']}", file=sys.stderr)
        print("Check BitChute /content to see if any actually published, then update "
              "data/shorts.json before retrying.", file=sys.stderr)
        sys.exit(2)

    # BitChute isn't in the default schema — add it if missing
    for s in data["shorts"]:
        if not s["platforms"].get(PLATFORM):
            s["platforms"][PLATFORM] = {
                "status": "pending", "posted_at": None, "url": None,
                "views": None, "views_captured_at": None, "caption_override": None,
            }

    short = next((s for s in data["shorts"]
                  if (s["platforms"].get(PLATFORM) or {}).get("status") == "pending"),
                 None)
    if not short:
        print("No pending BitChute shorts. Exiting.")
        sys.exit(0)

    video_path = str(Path(WORKSPACE_ROOT) / short["video_path"])
    if not Path(video_path).exists():
        print(f"Video file not found: {video_path}", file=sys.stderr)
        sys.exit(1)

    file_size = Path(video_path).stat().st_size
    if file_size < MIN_FILE_SIZE:
        print(f"Video below BitChute 1MB minimum ({file_size} bytes). Skipping.",
              file=sys.stderr)
        short["platforms"][PLATFORM]["status"] = "skip"
        short["platforms"][PLATFORM]["error"] = f"Below 1MB minimum ({file_size} bytes)"
        save(data)
        sys.exit(1)

    title = (short.get("title") or "").strip()
    description = build_caption(
        short["platforms"][PLATFORM].get("caption_override") or short.get("caption"),
        short.get("tags"), PLATFORM)
    # BitChute: max 3 search terms, space-separated, no #. The Search Terms field
    # rejects anything but letters A-Z, and that validation popup is misread by our
    # publish flow as the missing-thumbnail modal (it blocks the second Proceed).
    # So DROP any tag that isn't pure letters (e.g. "ai16z") and fall through to the
    # next valid tag, rather than slicing the raw list. (Root-caused 2026-06-19.)
    search_terms = " ".join(
        [t for t in (short.get("tags") or []) if re.fullmatch(r"[A-Za-z]+", t)][:3])

    thumb_path = ensure_thumb_file(short, video_path)

    print(f'\nShort: "{title}"')
    print(f"File:  {video_path} ({file_size / 1024 / 1024:.1f} MB, "
          f"{short.get('duration_seconds')}s)")
    print(f"Description: {len(description)} chars")
    print(f"Search terms: {search_terms}")
    print(f"Thumbnail:   {thumb_path or '(none — Grab Thumbnail fallback)'}", flush=True)

    short["platforms"][PLATFORM]["status"] = "posting"
    save(data)

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

        try:
            print(f"Navigating to {BITCHUTE_HOME}...", flush=True)
            page.goto(BITCHUTE_HOME, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            print(f"  Landed: {page.url}")

            close_drawer(page)

            # The ONLY reliable "logged in" signal is the video_call upload icon.
            print("Waiting for upload icon (video_call) to confirm logged-in state...")
            print("If not signed in, sign in to BitChute in the Chrome window.", flush=True)
            try:
                page.wait_for_function(
                    "() => !![...document.querySelectorAll('button')].find("
                    "b => b.innerText && b.innerText.trim().includes('video_call'))",
                    timeout=600000)  # 10 min
                print("  Logged in ✓ (upload icon visible)")
                page.wait_for_timeout(1500)
                close_drawer(page)
            except Exception:
                raise RuntimeError(
                    "Timed out waiting for upload icon — sign in to BitChute and retry.")

            # Pre-upload duplicate check: same title already on the channel?
            print("Checking /content for an existing copy of this title...")
            try:
                pre_items = scrape_content_page(page)
            except Exception as e:
                raise RuntimeError(f"Could not scrape /content for duplicate check: {e}")
            print(f"  Scraped {len(pre_items)} item(s) from /content")
            pre_match = find_by_title(pre_items, title)
            if pre_match:
                print(f"Already on BitChute: {pre_match['url']}")
                print(f'  Matched title: "{pre_match["title"]}"')
                short["platforms"][PLATFORM]["status"] = "posted"
                short["platforms"][PLATFORM]["posted_at"] = now_iso_z()
                short["platforms"][PLATFORM]["url"] = pre_match["url"]
                save(data)
                print("Marked as posted with real URL. Skipping upload.")
                print(f"POST OK platform=bitchute url={pre_match['url']} "
                      "status=already-posted", flush=True)
                context.close()
                sys.exit(0)
            print("  No matching title — proceeding with upload.")
            close_drawer(page)

            close_drawer(page)
            page.wait_for_timeout(500)

            print("Clicking upload button (video_call icon)...")
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

            with page.context.expect_page(timeout=15000) as page_info:
                upload_video_el.evaluate("el => el.click()")
            upload_page = page_info.value
            upload_page.wait_for_load_state("domcontentloaded")
            upload_page_url = upload_page.url
            print(f"  Upload page: {upload_page_url}")
            # The published URL is deterministically
            # https://www.bitchute.com/video/<upload_code>/ — much more reliable
            # than scraping /content after publish.
            m = re.search(r"[?&]upload_code=([\w-]+)", upload_page_url)
            upload_code = m.group(1) if m else None
            if upload_code:
                print(f"  Captured upload_code: {upload_code}")
            action_pause(upload_page, "upload page loaded")

            print("Attaching video...", flush=True)
            video_input = upload_page.locator('input[type="file"]').nth(0)
            video_input.wait_for(state="attached", timeout=20000)
            video_input.set_input_files(video_path)
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

            # Thumbnail: custom image upload (reliable), Grab-Thumbnail fallback.
            def upload_custom_thumbnail():
                if not thumb_path:
                    return False
                # Key on file type + image accept: after Proceed the visible file
                # input is replaced by a hidden input[name=thumbnailInput], so a
                # bare name selector is ambiguous.
                file_input = upload_page.locator(
                    'input[type="file"][accept*="image"]').first
                try:
                    file_input.wait_for(state="attached", timeout=8000)
                    file_input.set_input_files(thumb_path)
                except Exception as e:
                    print(f"    custom-thumbnail input not settable "
                          f"({str(e).splitlines()[0]})")
                    return False
                # CRITICAL: wait for FilePond to finish UPLOADING the thumbnail to
                # the server, not just adding the file. The hidden
                # input[name=thumbnailInput] value is "undefined" until processing
                # completes — that flip is the real "thumbnail registered" signal.
                try:
                    upload_page.wait_for_function(
                        "() => { const hidden = [...document.querySelectorAll("
                        "'input[name=\"thumbnailInput\"]')].find(el => el.type === 'hidden');"
                        " const v = hidden && hidden.value;"
                        " if (v && v !== 'undefined' && v.trim() !== '') return true;"
                        " const inp = document.querySelector('input[type=\"file\"][accept*=\"image\"]');"
                        " const root = inp ? inp.closest('.filepond--root') : null;"
                        " return !!(root && root.querySelector("
                        "'.filepond--item[data-filepond-item-state*=\"complete\"]')); }",
                        timeout=60000)
                    ok = True
                except Exception:
                    ok = False
                upload_page.wait_for_timeout(1000)
                if not ok:
                    print("    ⚠ thumbnail upload did not confirm processing-complete "
                          "within 60s")
                return ok

            def grab_thumbnail():
                try:
                    video_el = upload_page.locator("video").first
                    video_el.evaluate("el => { el.currentTime = 1; }")
                    upload_page.wait_for_timeout(500)
                    upload_page.get_by_role("button", name="Grab Thumbnail").click(
                        timeout=5000)
                    upload_page.wait_for_timeout(1200)
                    return True
                except Exception:
                    return False

            def ensure_thumbnail_registered():
                if upload_custom_thumbnail():
                    return "custom-upload"
                if grab_thumbnail():
                    return "grab-fallback"
                return "none"

            print("Setting thumbnail (custom image upload, Grab-Thumbnail fallback)...",
                  flush=True)
            print(f"  Thumbnail set via: {ensure_thumbnail_registered()}")
            action_pause(upload_page, "after thumbnail")

            print("Waiting for upload to finish (Proceed button enabled)...", flush=True)
            proceed_btn = upload_page.get_by_role("button", name="Proceed").first
            proceed_btn.wait_for(state="visible", timeout=30000)

            # Poll for enabled state (up to 15 min)
            for _ in range(1800):
                disabled = proceed_btn.get_attribute("disabled")
                aria_disabled = proceed_btn.get_attribute("aria-disabled")
                if disabled is None and aria_disabled != "true":
                    break
                upload_page.wait_for_timeout(500)
            print("  Proceed button enabled ✓")

            # upload_code LATE RE-READ (sync-API timing, found on the 2026-08-11
            # bless run): the popup's URL is often still empty at domcontentloaded
            # under playwright.sync_api even though Node saw it populated — by
            # Proceed time it always carries ?upload_code=. Same recovery the
            # longform port uses; without it the write-back gets the /content
            # placeholder URL and liveness is skipped.
            if not upload_code:
                m2 = re.search(r"[?&]upload_code=([\w-]+)", upload_page.url)
                if m2:
                    upload_code = m2.group(1)
                    print(f"  Captured upload_code (late, before Proceed): {upload_code}")

            # Retry once if BitChute reports an upload error
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

            # Proceed + publish, with missing-thumbnail self-recovery. NEVER mark
            # posted without positive confirmation (a bare no-redirect timeout used
            # to silently false-mark posted, leaving an unpublished draft).
            def proceed_and_publish():
                proceed_btn.click()
                print("  First Proceed clicked ✓")
                upload_page.wait_for_timeout(1500)
                try:
                    publish_label = upload_page.locator(
                        'label:has-text("Publish Right Away")').first
                    publish_label.wait_for(state="visible", timeout=8000)
                    cb_for = publish_label.get_attribute("for")
                    cb = (upload_page.locator(f"input#{cb_for}") if cb_for
                          else publish_label.locator('input[type="checkbox"]').first)
                    if not cb.is_checked():
                        publish_label.click()
                        print("  Publish Right Away checked ✓")
                    else:
                        print("  Publish Right Away already checked ✓")
                    upload_page.wait_for_timeout(500)
                    upload_page.get_by_role("button", name="Proceed").first.click()
                    print("  Second Proceed clicked ✓")
                except Exception as e:
                    print(f"  No publish checkbox found ({str(e).splitlines()[0]}) "
                          "— assuming single Proceed flow")

            published = False
            for attempt in range(1, 4):
                proceed_and_publish()

                # Success = redirect to /content. Give it 45s per attempt.
                try:
                    upload_page.wait_for_url("**/content**", timeout=45000)
                    redirected = True
                except Exception:
                    redirected = False
                if redirected:
                    published = True
                    print("  Redirected to /content ✓")
                    break

                # No redirect: detect the missing-thumbnail modal and self-recover.
                try:
                    upload_page.locator(
                        "text=/missing thumbnail|thumbnail.*(required|missing)|try again/i"
                    ).first.wait_for(state="visible", timeout=1500)
                    thumb_err = True
                except Exception:
                    thumb_err = False
                if thumb_err:
                    print(f"  ⚠ Missing-thumbnail modal (attempt {attempt}/3) — "
                          "dismissing + re-grabbing thumbnail...")
                    try:
                        upload_page.keyboard.press("Escape")
                    except Exception:
                        pass
                    upload_page.wait_for_timeout(500)
                    for sel in ['button:has-text("Try Again")', 'button:has-text("OK")',
                                'button:has-text("Close")', ".q-dialog button"]:
                        b = upload_page.locator(sel).first
                        try:
                            if b.is_visible():
                                b.click()
                                break
                        except Exception:
                            pass
                    upload_page.wait_for_timeout(800)
                    print(f"    re-setting thumbnail via: {ensure_thumbnail_registered()}")
                    upload_page.wait_for_timeout(1000)
                    continue
                print("  No /content redirect and no thumbnail modal — will verify "
                      "via /content scrape.")
                break

            # Success gate: confirm publish before marking posted.
            if not published:
                print("Verifying publish via /content (title must be present)...")
                try:
                    items = scrape_content_page(upload_page)
                    if find_by_title(items, title):
                        published = True
                        print("  Found published video on /content ✓")
                    else:
                        print("  Title NOT found on /content ✗")
                except Exception as e:
                    print(f"  /content verify failed: {e}")

            if not published:
                raise RuntimeError(
                    "Publish not confirmed (missing-thumbnail modal or no /content "
                    "redirect). The video uploaded as a DRAFT — publish it manually "
                    "from BitChute Studio. Do NOT re-run this script (it would "
                    "re-upload and duplicate).")

            # Compose the real video URL from upload_code.
            if upload_code:
                posted_url = f"https://www.bitchute.com/video/{upload_code}/"
                print(f"  Real URL from upload_code: {posted_url}")
            else:
                posted_url = "https://www.bitchute.com/content"
                print("  Warning: no upload_code captured — using /content placeholder")

            print(f"\nPosted (processing): {posted_url}", flush=True)

            # Liveness check: the public video page must resolve with the real
            # og:title (a phantom URL returns the generic "Bitchute"). Retry while
            # processing; never FAIL on it (publish already confirmed) — mark
            # posted_unverified for a manual look instead of silently trusting.
            def verify_live(url, expected_title):
                if not upload_code:
                    print("  Liveness: skipped (no upload_code URL).")
                    return False

                def norm(s):
                    s = (s or "").lower()
                    s = re.sub(r"&#0?39;|&apos;", "'", s)
                    s = s.replace("&amp;", "&").replace("&quot;", '"')
                    return re.sub(r"\s+", " ", s).strip()

                want = norm(expected_title)[:25]
                ua = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/120 Safari/537.36")
                first_wait_ms, tries, retry_ms = 45000, 6, 25000
                print(f"  Liveness: waiting {first_wait_ms // 1000}s for processing, "
                      "then verifying public URL...", flush=True)
                upload_page.wait_for_timeout(first_wait_ms)
                for i in range(1, tries + 1):
                    try:
                        resp = context.request.get(url, timeout=20000,
                                                   headers={"User-Agent": ua})
                        html = resp.text()
                        mt = re.search(r'og:title"\s+content="([^"]*)"', html, re.I)
                        got = norm(mt.group(1) if mt else "")
                        if got and got != "bitchute" and want and want in got:
                            print(f'  Liveness ✓ (og:title = "{mt.group(1)}")')
                            return True
                        print(f"  Liveness {i}/{tries}: not live yet "
                              f"(og:title=\"{mt.group(1) if mt else 'none'}\")")
                    except Exception as e:
                        print(f"  Liveness {i}/{tries} fetch error: "
                              f"{str(e).splitlines()[0]}")
                    if i < tries:
                        upload_page.wait_for_timeout(retry_ms)
                return False

            live = verify_live(posted_url, title)

            short["platforms"][PLATFORM]["status"] = "posted" if live else "posted_unverified"
            short["platforms"][PLATFORM]["posted_at"] = now_iso_z()
            short["platforms"][PLATFORM]["url"] = posted_url
            if live:
                short["platforms"][PLATFORM].pop("error", None)
            else:
                short["platforms"][PLATFORM]["error"] = (
                    "Publish confirmed via /content but public URL did not resolve "
                    "within retry window: verify on the channel manually.")
            save(data)
            print("shorts.json updated (posted, liveness confirmed). Done ✓" if live
                  else "⚠ shorts.json updated as posted_unverified — publish was "
                       "confirmed but the public URL did not resolve in time. Check "
                       "the channel; do NOT re-run (would duplicate).")
            print(f"POST OK platform=bitchute url={posted_url}"
                  + ("" if live else " status=posted_unverified"), flush=True)

        except SystemExit:
            raise
        except Exception as err:
            short["platforms"][PLATFORM]["status"] = "failed"
            short["platforms"][PLATFORM]["error"] = str(err)
            save(data)
            print(f"\nFailed: {err}", file=sys.stderr, flush=True)
            print(f"POST FAIL platform=bitchute reason={str(err).splitlines()[0][:120]}",
                  flush=True)
            sys.exit(1)
        finally:
            try:
                context.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
