# upload_longform_rumble.py — CANONICAL Python port of upload-longform-rumble.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback).
#
# 1:1 port on playwright.sync_api: same rumblebot-profile Chrome, same selectors,
# same human pacing, same licensing-page handling and URL-scan strategy, same
# title-keyed longs.json write-back. Documented divergences ONLY:
#   - stdout is unbuffered + machine lines (POST OK/POST FAIL) for the graph.
#   - the post-run inspection hold is 60s (was 5 min) — the graph wrapper, not a
#     human terminal, owns the run now.
import random
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from longform_queue import pick_next_longform, record_longform_post, strip_music_credits  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\rumblebot-profile"
RUMBLE_UPLOAD_URL = "https://rumble.com/upload.php"
RUMBLE_TITLE_MAX = 100
RUMBLE_V_RE = re.compile(r"https://rumble\.com/v[a-zA-Z0-9]+-[a-zA-Z0-9][^\s\"'<>]*\.html")
RUMBLE_V_RE_JS = r"https:\/\/rumble\.com\/v[a-zA-Z0-9]+-[a-zA-Z0-9][^\s\"'<>]*\.html"

CHAR_DELAY_MIN, CHAR_DELAY_MAX = 40, 120
ACTION_MIN, ACTION_MAX = 2000, 5000


def rnd(a, b):
    return random.randint(a, b)


def action_pause(page, label=""):
    ms = rnd(ACTION_MIN, ACTION_MAX)
    print(f"  ~ {ms / 1000:.1f}s{' (' + label + ')' if label else ''}", flush=True)
    page.wait_for_timeout(ms)


def type_human(page, locator, text):
    locator.click()
    page.wait_for_timeout(rnd(300, 700))
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def main():
    job = pick_next_longform("rumble")
    if not job:
        print("No pending Rumble longform in longs.json (every entry already posted/skipped).",
              file=sys.stderr)
        sys.exit(1)
    metadata, video_path, thumb_path = job["metadata"], job["video_path"], job["thumb_path"]
    if not video_path or not video_path.exists():
        print(f"video_path missing on disk: {video_path}", file=sys.stderr)
        sys.exit(1)
    has_thumb = bool(thumb_path)
    title = (metadata.get("title") or "")[:RUMBLE_TITLE_MAX]
    description = strip_music_credits((metadata.get("description") or "").strip())
    tags = metadata.get("tags") or []
    tags_csv = ", ".join(t.strip() for t in tags)
    category = ((metadata.get("categories") or {}).get("rumble") or {}).get("primary") \
        or "Finance & Crypto"
    visibility = (metadata.get("visibility") or "public").lower()
    size_mb = video_path.stat().st_size / 1024 / 1024

    print(f'\nLongform: "{title}"')
    print(f"File: {video_path}")
    print(f"Size: {size_mb:.1f} MB")
    print(f"Thumbnail: {thumb_path if has_thumb else '(none)'}")
    print(f"Tags: {tags_csv}")
    print(f"Category: {category}")
    print(f"Visibility: {visibility}", flush=True)

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
        url = None
        try:
            print(f"Navigating to {RUMBLE_UPLOAD_URL}...", flush=True)
            page.goto(RUMBLE_UPLOAD_URL, wait_until="load")
            print(f"  Landed: {page.url}")

            if ("login" in page.url or "/sign-in" in page.url or "auth.rumble.com" in page.url):
                print("Not logged in — sign in (waiting up to 5 min)...", flush=True)
                try:
                    page.wait_for_url(RUMBLE_UPLOAD_URL, timeout=300000)
                    page.wait_for_load_state("load")
                    print("  Logged in ✓")
                except Exception:
                    raise RuntimeError("Login timed out")
            else:
                print("Already logged in ✓")

            inputs_info = page.evaluate(
                "() => [...document.querySelectorAll('input[type=\"file\"]')]"
                ".map(i => ({id: i.id, name: i.name, accept: i.accept}))")
            print(f"  File inputs: {inputs_info}")

            print(f"Attaching video ({size_mb:.1f} MB)...", flush=True)
            file_input = page.locator("#Filedata, .hidden-upload").first
            try:
                file_input.wait_for(state="attached", timeout=10000)
            except Exception:
                file_input = page.locator('input[type="file"]').first
                file_input.wait_for(state="attached", timeout=20000)

            try:
                with page.expect_file_chooser(timeout=5000) as fc_info:
                    file_input.click()
                fc_info.value.set_files(str(video_path))
                print("  Video attached via file chooser ✓")
            except Exception:
                print("  File chooser not triggered — using set_input_files")
                file_input.set_input_files(str(video_path))
                page.evaluate(
                    "() => { const inp = document.querySelector('#Filedata, .hidden-upload, "
                    "input[type=\"file\"]'); if (inp) { "
                    "inp.dispatchEvent(new Event('change', {bubbles: true, cancelable: true})); "
                    "inp.dispatchEvent(new Event('input', {bubbles: true, cancelable: true})); } }")

            print("Waiting for upload progress...", flush=True)
            try:
                page.wait_for_function(r"() => /\d+%/.test(document.body.innerText)",
                                       timeout=30000)
                print("  Upload in progress ✓")
            except Exception:
                print("  Warning: no upload % found")
            action_pause(page, "after upload start")

            print(f"Typing title ({len(title)} chars)...", flush=True)
            title_input = page.locator('input[placeholder="Video Title"]')
            title_input.wait_for(state="visible", timeout=10000)
            type_human(page, title_input, title)
            print("  Title typed ✓")
            action_pause(page, "after title")

            print(f"Typing description ({len(description)} chars)...", flush=True)
            desc_input = page.locator('textarea[placeholder="Video Description"]')
            desc_input.wait_for(state="visible", timeout=10000)
            type_human(page, desc_input, description)
            print("  Description typed ✓")
            action_pause(page, "after description")

            print(f"Setting category: {category}", flush=True)
            try:
                cat_input = page.locator('input[name="primary-category"]').first
                cat_input.wait_for(state="visible", timeout=10000)
                type_human(page, cat_input, category)
                page.wait_for_timeout(rnd(800, 1500))
                option = page.get_by_text(category, exact=True).first
                option.wait_for(state="visible", timeout=10000)
                option.click()
                print("  Category set ✓")
            except Exception as e:
                print(f"  Warning: couldn't set category ({str(e).splitlines()[0]})")
            action_pause(page, "after category")

            try:
                tags_el = page.locator('input#tags, input[name="tags"]').first
                tags_el.wait_for(state="visible", timeout=5000)
                type_human(page, tags_el, tags_csv)
                print("  Tags typed ✓")
            except Exception:
                print("  Warning: tags input not found")
            action_pause(page, "after tags")

            if has_thumb:
                print(f"Attaching thumbnail: {thumb_path}", flush=True)
                try:
                    thumb_input = page.locator(
                        'input[type="file"]#customThumb, input[type="file"][name*="thumb" i]').first
                    thumb_input.wait_for(state="attached", timeout=10000)
                    thumb_input.set_input_files(str(thumb_path))
                    print("  Thumbnail attached ✓")
                except Exception:
                    print("  Warning: thumbnail input not found — using Rumble default")
                action_pause(page, "after thumbnail")

            if visibility == "unlisted":
                page.get_by_label("Unlisted").check()
            elif visibility == "private":
                page.get_by_label("Private").check()

            print("Waiting for Upload button to be enabled...", flush=True)
            upload_btn = page.get_by_role("button", name="Upload").first
            upload_btn.wait_for(state="visible", timeout=30000)
            for _ in range(1800):  # up to 15 min for a large upload
                if upload_btn.get_attribute("disabled") is None:
                    break
                page.wait_for_timeout(500)
            print("  Upload button ready")
            action_pause(page, "before Upload click")
            upload_btn.click()
            print("  Clicked Upload ✓", flush=True)

            def check_agreement_boxes():
                label_text_groups = [
                    ["You have not signed an exclusive agreement", "exclusive agreement"],
                    ["Check here if you agree", "agree to our terms", "terms of service", "I agree"],
                ]
                for texts in label_text_groups:
                    for text in texts:
                        loc = page.locator(f'label:has-text("{text}")').first
                        try:
                            loc.wait_for(state="visible", timeout=5000)
                            label_for = loc.get_attribute("for")
                            cb = (page.locator(f"input#{label_for}") if label_for
                                  else loc.locator('input[type="checkbox"]').first)
                            if not cb.is_checked():
                                loc.click()
                                page.wait_for_timeout(300)
                                print(f"  Checked: {text[:50]}")
                            break
                        except Exception:
                            pass

            scan_js = (
                "(reSrc) => { const re = new RegExp(reSrc);"
                " const hrefs = [...document.querySelectorAll('a[href]')].map(a => a.href);"
                " for (const h of hrefs) { const m = h.match(re); if (m) return m[0]; }"
                " const values = [...document.querySelectorAll('input')].map(i => i.value);"
                " for (const v of values) { const m = (v || '').match(re); if (m) return m[0]; }"
                " const body = document.body.innerText; const m = body.match(re);"
                " return m ? m[0] : null; }")

            for i in range(60):
                page.wait_for_timeout(500)
                cur = page.url
                m = RUMBLE_V_RE.search(cur)
                if m:
                    url = m.group(0).rstrip(".")
                    print(f"  Video URL from navigation: {url}")
                    break
                scanned = page.evaluate(scan_js, RUMBLE_V_RE_JS)
                if scanned:
                    url = scanned.rstrip(".")
                    print(f"  Direct link captured: {url}")
                    break
                if i == 4:
                    page_text = page.evaluate("() => document.body.innerText")
                    on_licensing = ("exclusive agreement" in page_text.lower()
                                    or "check here if you agree" in page_text.lower())
                    has_submit = page.get_by_role("button", name="Submit").count() > 0
                    if on_licensing or has_submit:
                        print("Licensing page detected — checking agreement boxes...", flush=True)
                        check_agreement_boxes()
                        print("Waiting for Submit button to be enabled (longform may take a while)...",
                              flush=True)
                        submit_btn = page.get_by_role("button", name="Submit").first
                        try:
                            for _ in range(1800):
                                if submit_btn.get_attribute("disabled") is None:
                                    break
                                page.wait_for_timeout(500)
                            print("  Submit button enabled ✓")
                        except Exception:
                            print("  Warning: Submit never confirmed enabled")
                        check_agreement_boxes()
                        action_pause(page, "before Submit click")
                        submit_btn.click()
                        print("  Submit clicked ✓", flush=True)
                        page.wait_for_timeout(3000)
                        # Submit triggers the ACTUAL byte upload; wait for 100% or
                        # the "Upload complete" page (up to 30 min for large files).
                        print("Waiting for upload progress to reach 100% (up to 30 min for large files)...",
                              flush=True)
                        try:
                            page.wait_for_function(
                                r"() => { const body = document.body.innerText;"
                                r" return /(^|\s)100%/.test(body) ||"
                                r" /upload\s*complete/i.test(body) ||"
                                r" /your\s+video\s+is/i.test(body); }",
                                timeout=30 * 60 * 1000)
                            print("  Upload reached 100% ✓")
                        except Exception:
                            print("  Warning: 100% never confirmed — may have timed out")
                        print('Waiting 30s for "Upload complete" page transition...', flush=True)
                        page.wait_for_timeout(30000)
                        break

            if not url:
                print("Scanning for direct link after Submit (up to 3 min)...", flush=True)
                for _ in range(60):
                    page.wait_for_timeout(3000)
                    m = RUMBLE_V_RE.search(page.url)
                    if m:
                        url = m.group(0).rstrip(".")
                        print(f"  Redirected to: {url}")
                        break
                    scanned = page.evaluate(
                        "(reSrc) => { const re = new RegExp(reSrc);"
                        " const hrefs = [...document.querySelectorAll('a[href]')].map(a => a.href);"
                        " for (const h of hrefs) { const m = h.match(re); if (m) return m[0]; }"
                        " return null; }", RUMBLE_V_RE_JS)
                    if scanned:
                        url = scanned.rstrip(".")
                        print(f"  Direct link: {url}")
                        break

            if url:
                print(f"\nPosted: {url}")
                record_longform_post("rumble", metadata.get("title"), url)
                print(f"POST OK platform=rumble url={url}", flush=True)
            else:
                print("\nPosted — URL not captured (check Rumble dashboard).")
                print("WARNING: longs.json still says pending. Confirm with scripts/check-rumble-longform.js")
                print("and record the URL, otherwise the next run will re-upload this same video.")
                print("POST FAIL platform=rumble reason=no-url-captured", flush=True)
            print("Done ✓")
            print("\nLeaving browser open 60s for settle/inspection.", flush=True)
            page.wait_for_timeout(60000)
            sys.exit(0 if url else 1)
        except SystemExit:
            raise
        except Exception as err:
            print(f"\nFailed: {err}", file=sys.stderr, flush=True)
            print(f"POST FAIL platform=rumble reason={str(err).splitlines()[0][:120]}", flush=True)
            try:
                page.wait_for_timeout(60000)
            except Exception:
                pass
            sys.exit(1)
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
