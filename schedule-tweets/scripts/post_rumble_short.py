# post_rumble_short.py — CANONICAL Python port of post-rumble-short.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback). Status:
# PORTED, BLESS-PENDING — invoke the JS twin for production posts until this
# port is live-blessed with one real post.
#
# Uploads one pending Rumble video from data/shorts.json. Uses rumblebot-profile
# via launch_persistent_context with real Chrome. Adapted (like the JS twin)
# from uploading/uploaders/rumble_upload.py.
#
# KNOWN CRITICAL QUIRK preserved exactly: Rumble SHORTS live at
# rumble.com/shorts/v<id>, a SEPARATE namespace that NEVER appears in the
# channel video grid or as a /v<id>-slug.html link. The upload-flow polling
# loop's `RUMBLE_V_RE` (/v<id>-slug.html) URL/link-scan — copied here from the
# longform uploader's lineage — will thus almost never match a short and its
# `url` result is NOT used for the final write-back; it is kept only because it
# also drives the "Submit" click on the licensing-page step. This script
# DELIBERATELY does not scan page links during that loop ("Only trust URL
# navigation — do not scan page links (sidebar has existing video URLs)") and
# has no post-Submit link-scan fallback (unlike the longform uploader) — both
# omissions are intentional in the JS twin and are preserved as-is, not fixed.
# The actual short URL is captured separately, afterward, from
# /account/content by TITLE MATCH (closest-ancestor match against every
# a[href*="/shorts/v"]), then liveness-checked against the public page. If the
# title match isn't found, or is found but doesn't verify live within the
# retry window, the row is written `posted_unverified` rather than guessing —
# never write a wrong URL. Do NOT re-run a `posted_unverified` row (would
# duplicate); use recapture_rumble_url.py instead.
#
# 1:1 port on playwright.sync_api: same rumblebot-profile Chrome, same
# selectors in the same fallback order, same timeouts/randomized waits, same
# human-typing delays, same queue-pick logic, same write-back values (posted /
# posted_unverified / failed), same console messages, same exit codes (this
# script never calls an explicit success exit on any of the 3 non-error
# outcomes, matching the JS twin exactly — only the catch-all error path exits
# non-zero, via process.exit(1) in the JS).
# Documented divergences ONLY: (a) final machine line (POST OK/FAIL) for the
# LangGraph wrapper to parse; (b) this header/status block.
import json
import os
import random
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from strip_hashtags import strip_hashtags, build_caption  # noqa: E402,F401

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
SHORTS_JSON = HERE.parent / "data" / "shorts.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\rumblebot-profile"
WORKSPACE_ROOT = Path(r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets")
RUMBLE_UPLOAD_URL = "https://rumble.com/upload.php"
PLATFORM = "rumble"

DEFAULT_CATEGORY = "Finance & Crypto"
DEFAULT_VISIBILITY = "public"

# Rumble title cap is 100 chars; description has no hard cap.
RUMBLE_TITLE_MAX = 100
RUMBLE_V_RE = re.compile(r"https://rumble\.com/v[a-zA-Z0-9]+-[a-zA-Z0-9][^\s\"'<>]*\.html")

# Human-like delays
CHAR_DELAY_MIN = 40
CHAR_DELAY_MAX = 120
ACTION_MIN = int(os.environ.get("RM_ACTION_MIN") or 2000)
ACTION_MAX = int(os.environ.get("RM_ACTION_MAX") or 5000)


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
    print(f"  ~ {ms / 1000:.1f}s{' (' + label + ')' if label else ''}", flush=True)
    page.wait_for_timeout(ms)


def type_human(page, locator, text):
    locator.click()
    page.wait_for_timeout(rnd(300, 700))
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def norm(s):
    s = (s or "").lower()
    s = re.sub(r"&#0?39;|&apos;", "'", s)
    s = re.sub(r"&amp;", "&", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def main():
    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))

    # Bail if anything is stuck in 'posting' — those need manual review. Prior
    # behavior auto-reset to 'pending' and caused duplicate uploads.
    stuck = [s for s in data["shorts"] if (s["platforms"].get(PLATFORM) or {}).get("status") == "posting"]
    if stuck:
        print(f"{len(stuck)} short(s) stuck in 'posting' — manual review required:", file=sys.stderr)
        for s in stuck:
            print(f"  - {s['id']}: {s['title']}", file=sys.stderr)
        print("Check rumble.com user profile to see if any actually published, then update "
              "data/shorts.json before retrying.", file=sys.stderr)
        sys.exit(2)

    # Rumble isn't in the default schema — add it if missing on the chosen short
    for s in data["shorts"]:
        if not s["platforms"].get(PLATFORM):
            s["platforms"][PLATFORM] = {
                "status": "pending", "posted_at": None, "url": None,
                "views": None, "views_captured_at": None, "caption_override": None,
            }

    short = next((s for s in data["shorts"] if (s["platforms"].get(PLATFORM) or {}).get("status") == "pending"),
                 None)
    if not short:
        print("No pending Rumble shorts. Exiting.")
        sys.exit(0)

    video_path = WORKSPACE_ROOT / short["video_path"]
    if not video_path.exists():
        print("Video file not found:", video_path, file=sys.stderr)
        sys.exit(1)

    # Rumble title max 100 chars
    title = (short.get("title") or "")[:RUMBLE_TITLE_MAX]
    description = build_caption(short["platforms"][PLATFORM].get("caption_override") or short.get("caption"),
                                short.get("tags"), PLATFORM)
    tags = short.get("tags") or []
    tags_csv = ", ".join(t.strip() for t in tags)

    print(f'\nShort: "{title}"')
    print(f'File:  {video_path} ({short["duration_seconds"]}s)')
    print(f"Description: {len(description)} chars")
    print(f"Tags: {tags_csv}")

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
            # -- Navigate to upload page -------------------------------------------------
            print(f"Navigating to {RUMBLE_UPLOAD_URL}...", flush=True)
            page.goto(RUMBLE_UPLOAD_URL, wait_until="load")
            print(f"  Landed on: {page.url}")

            # -- Login check --------------------------------------------------------------
            if ("login" in page.url or "/sign-in" in page.url or "auth.rumble.com" in page.url):
                print("Not logged in — log in to Rumble in the browser (waiting up to 5 min)...", flush=True)
                try:
                    page.wait_for_url(RUMBLE_UPLOAD_URL, timeout=300000)
                    page.wait_for_load_state("load")
                    print(f"  Logged in \u2713 — now on: {page.url}")
                except Exception:
                    raise RuntimeError("Login timed out — sign in to Rumble and retry.")
            else:
                print("Already logged in \u2713")

            # -- Diagnose available file inputs --------------------------------------------
            inputs_info = page.evaluate(
                "() => [...document.querySelectorAll('input[type=\"file\"]')].map(i => ({"
                " id: i.id, cls: i.className, name: i.name, accept: i.accept }))")
            print(f"  File inputs: {inputs_info}")

            # -- Attach the video — Rumble uses #Filedata or .hidden-upload ----------------
            print(f"Attaching video: {video_path}", flush=True)
            file_input = page.locator("#Filedata, .hidden-upload").first
            try:
                file_input.wait_for(state="attached", timeout=10000)
                print("  Found Rumble-specific file input \u2713")
            except Exception:
                print("  Rumble-specific input not found — falling back to first file input")
                file_input = page.locator('input[type="file"]').first
                file_input.wait_for(state="attached", timeout=20000)

            # Try file chooser approach first; fall back to setInputFiles + change event
            try:
                with page.expect_file_chooser(timeout=5000) as fc_info:
                    file_input.click()
                fc_info.value.set_files(str(video_path))
                print("  Video attached via file chooser \u2713")
            except Exception:
                print("  File chooser not triggered — using setInputFiles")
                file_input.set_input_files(str(video_path))
                page.evaluate(
                    "() => { const inp = document.querySelector('#Filedata, .hidden-upload, "
                    "input[type=\"file\"]'); if (inp) { "
                    "inp.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })); "
                    "inp.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); } }")

            # -- Confirm upload started -----------------------------------------------------
            print("Waiting for upload progress indicator...", flush=True)
            try:
                page.wait_for_function(r"() => /\d+%/.test(document.body.innerText)", timeout=20000)
                print("  Upload in progress \u2713")
            except Exception:
                print("  Warning: no upload % found — continuing anyway")
            action_pause(page, "after upload start")

            # -- Fill title (typed char-by-char) ---------------------------------------------
            print(f"Typing title ({len(title)} chars)...", flush=True)
            title_input = page.locator('input[placeholder="Video Title"]')
            title_input.wait_for(state="visible", timeout=10000)
            type_human(page, title_input, title)
            print("  Title typed \u2713")
            action_pause(page, "after title")

            # -- Fill description (typed char-by-char) ----------------------------------------
            print(f"Typing description ({len(description)} chars)...", flush=True)
            desc_input = page.locator('textarea[placeholder="Video Description"]')
            desc_input.wait_for(state="visible", timeout=10000)
            type_human(page, desc_input, description)
            print("  Description typed \u2713")
            action_pause(page, "after description")

            # -- Primary category (combobox, typed) ---------------------------------------------
            print(f"Setting category: {DEFAULT_CATEGORY}", flush=True)
            try:
                cat_input = page.locator('input[name="primary-category"]').first
                cat_input.wait_for(state="visible", timeout=10000)
                type_human(page, cat_input, DEFAULT_CATEGORY)
                page.wait_for_timeout(rnd(800, 1500))
                option = page.get_by_text(DEFAULT_CATEGORY, exact=True).first
                option.wait_for(state="visible", timeout=10000)
                option.click()
                print(f"  Category set: {DEFAULT_CATEGORY} \u2713")
            except Exception as e:
                print(f"  Warning: couldn't set category ({str(e).splitlines()[0]}) — using default")
            action_pause(page, "after category")

            # -- Tags (typed char-by-char) --------------------------------------------------------
            try:
                tags_el = page.locator("input#tags, input[name=\"tags\"]").first
                tags_el.wait_for(state="visible", timeout=5000)
                type_human(page, tags_el, tags_csv)
                print("  Tags typed \u2713")
            except Exception:
                print("  Warning: tags input not found — skipping")
            action_pause(page, "after tags")

            # -- Visibility --------------------------------------------------------------------------
            if DEFAULT_VISIBILITY == "unlisted":
                page.get_by_label("Unlisted").check()
            elif DEFAULT_VISIBILITY == "private":
                page.get_by_label("Private").check()
            # Public is the default — no action needed

            # -- Wait for Upload button to be enabled, then click ----------------------------------
            print("Waiting for Upload button to be enabled (upload + form complete)...", flush=True)
            upload_btn = page.get_by_role("button", name="Upload").first
            try:
                upload_btn.wait_for(state="visible", timeout=30000)
                # Poll for enabled state
                for _ in range(1200):  # 10 min max
                    disabled = upload_btn.get_attribute("disabled")
                    if disabled is None:
                        break
                    page.wait_for_timeout(500)
                print("  Upload button ready")
                action_pause(page, "before Upload click")
                upload_btn.click()
                print("  Clicked Upload \u2713")
            except Exception as e:
                raise RuntimeError(f"Upload button never became clickable: {e}")

            print("Upload clicked — looking for licensing page or direct URL...")

            # -- Check for licensing page (agreement checkboxes + Submit) --------------------------
            url = None

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
                            if label_for:
                                cb = page.locator(f"input#{label_for}")
                            else:
                                cb = loc.locator('input[type="checkbox"]').first
                            checked = cb.is_checked()
                            if not checked:
                                loc.click()
                                page.wait_for_timeout(300)
                                print(f"  Checked: {text[:50]}")
                            break
                        except Exception:
                            pass

            # Tight polling loop for first 30s
            for i in range(60):
                page.wait_for_timeout(500)
                cur_url = page.url
                if RUMBLE_V_RE.search(cur_url):
                    url = RUMBLE_V_RE.search(cur_url).group(0).rstrip(".")
                    print(f"  Video URL from navigation: {url}")
                    break

                # Only trust URL navigation — do not scan page links (sidebar has existing video URLs)

                # Check for licensing page after ~2.5s
                if i == 4:
                    page_text = page.evaluate("() => document.body.innerText")
                    on_licensing_page = ("exclusive agreement" in page_text.lower()
                                         or "check here if you agree" in page_text.lower())
                    has_submit = page.get_by_role("button", name="Submit").count() > 0
                    if on_licensing_page or has_submit:
                        print("Licensing page detected — checking agreement boxes...", flush=True)
                        check_agreement_boxes()

                        # Wait for Submit to become enabled (upload finishes)
                        print("Waiting for Submit button to be enabled...", flush=True)
                        submit_btn = page.get_by_role("button", name="Submit").first
                        try:
                            for _ in range(1200):  # 10 min max
                                disabled = submit_btn.get_attribute("disabled")
                                if disabled is None:
                                    break
                                page.wait_for_timeout(500)
                            print("  Submit button enabled \u2713")
                        except Exception:
                            print("  Warning: Submit never confirmed enabled — clicking anyway")

                        # Re-check boxes in case page reset them
                        check_agreement_boxes()
                        action_pause(page, "before Submit click")

                        submit_btn.click()
                        print("  Submit clicked \u2713")
                        page.wait_for_timeout(3000)
                        break

            # -- Capture the short's REAL URL from /account/content --------------------------------
            # ROOT-CAUSE FIX (2026-06-02): Rumble SHORTS live at rumble.com/shorts/v<id>,
            # a SEPARATE namespace that NEVER appears in the channel video grid or as a
            # /v<id>-slug.html link. The old channel-scrape therefore ALWAYS captured an
            # unrelated .html video for a short. The authoritative source is
            # /account/content, where each short's row links to /shorts/v<id>. We match
            # THIS short by title, then liveness-check the public page. We DELIBERATELY
            # ignore any .html `url` the redirect loop may have grabbed — it's wrong for
            # a short. Never write a wrong URL: if we can't confirm, mark posted_unverified.
            title_needle = norm(title)[:40]

            def capture_short_url_by_title():
                for attempt in range(1, 7):
                    try:
                        page.goto("https://rumble.com/account/content", wait_until="domcontentloaded",
                                 timeout=30000)
                        page.wait_for_timeout(4000)
                        # ROW-BOUNDARY FIX (2026-08-13). The previous matcher climbed up to
                        # 5 ancestors from each anchor and accepted ANY ancestor whose text
                        # contained the title. Two-plus levels up, that container spans
                        # SEVERAL rows, so an anchor matched its NEIGHBOUR's title. Result:
                        # every Rumble short id from 2026-08-07 to 2026-08-13 was shifted by
                        # one (18 rows, each holding the next-older video's id) and the
                        # liveness check dutifully reported the neighbour's title, which read
                        # as harmless "processing lag".
                        #   PASS 1 (authoritative): Rumble renders the title as its own link
                        #     inside the row, so the anchor's OWN text identifies it, with no
                        #     ancestor climbing and therefore no way to cross a row boundary.
                        #   PASS 2 (fallback): climb, but stop the moment an ancestor holds
                        #     more than one distinct /shorts/v id, i.e. it spans rows.
                        href = page.evaluate(
                            "(want) => { const n = s => (s || '').toLowerCase().replace(/\\s+/g, ' ').trim();"
                            " const idOf = a => ((a.getAttribute('href') || '').match(/\\/shorts\\/(v[\\w]+)/) || [])[1];"
                            " const anchors = [...document.querySelectorAll('a[href*=\"/shorts/v\"]')];"
                            " for (const a of anchors) { if (n(a.innerText).includes(want)) "
                            "return a.getAttribute('href'); }"
                            " for (const a of anchors) { let c = a.parentElement;"
                            " for (let lvl = 1; lvl < 5 && c; lvl++) {"
                            " const ids = new Set([...c.querySelectorAll('a[href*=\"/shorts/v\"]')]"
                            ".map(idOf).filter(Boolean));"
                            " if (ids.size > 1) break;"
                            " if (n(c.innerText).includes(want)) return a.getAttribute('href');"
                            " c = c.parentElement; } }"
                            " return null; }", title_needle)
                        if href:
                            full = (href if href.startswith("http") else "https://rumble.com" + href).split("?")[0]
                            print(f"  Matched short on /account/content: {full}")
                            return full
                        print(f"  Capture {attempt}/6: short not listed on /account/content yet — waiting...")
                    except Exception as e:
                        print(f"  Capture {attempt}/6 error: {str(e).splitlines()[0]}")
                    if attempt < 6:
                        page.wait_for_timeout(20000)
                return None

            # Liveness: fetch the public /shorts/ page and confirm its title matches.
            #
            # Returns "live" | "mismatch" | "lag".
            #   mismatch = the page resolved to a title belonging to a DIFFERENT row in
            #     shorts.json, i.e. the captured id is another video's (the 2026-08-13
            #     off-by-one class, which shifted 18 rows). Such a URL must NEVER be
            #     written: a null is honest, a wrong URL silently corrupts the record and
            #     still looks fine on the dashboard. Only a title belonging to a known
            #     OTHER short counts as mismatch, so a generic/blank page while the video
            #     is still processing stays "lag" and keeps its (probably correct) URL.
            other_titles = [norm(o.get("title") or "")
                            for o in data.get("shorts", [])
                            if o is not short and (o.get("title") or "").strip()]

            def verify_live(u):
                want = norm(title)[:25]
                ua = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/120 Safari/537.36")
                foreign = None
                for i in range(1, 6):
                    try:
                        resp = browser.request.get(u, timeout=20000, headers={"User-Agent": ua})
                        html = resp.text()
                        m = re.search(r"<title>([^<]*)</title>", html, re.I) \
                            or re.search(r'og:title"\s+content="([^"]*)"', html, re.I)
                        got = norm(m.group(1) if m else "")
                        if got and want and want in got:
                            print(f'  Liveness \u2713 (title="{m.group(1)}")')
                            return "live"
                        if got and any(t and (t in got or got in t) for t in other_titles):
                            foreign = m.group(1) if m else got
                            print(f'  Liveness {i}/5: WRONG VIDEO (title="{foreign}") '
                                  "\u2014 this id belongs to another short")
                            break
                        print(f'  Liveness {i}/5: not live yet (title="{m.group(1) if m else "none"}")')
                    except Exception as e:
                        print(f"  Liveness {i}/5 error: {str(e).splitlines()[0]}")
                    if i < 5:
                        page.wait_for_timeout(20000)
                return "mismatch" if foreign else "lag"

            print("\nCapturing short URL from /account/content (matching by title)...", flush=True)
            short_url = capture_short_url_by_title()
            live = verify_live(short_url) if short_url else "lag"

            short["platforms"][PLATFORM]["posted_at"] = now_iso_z()
            if short_url and live == "live":
                short["platforms"][PLATFORM]["status"] = "posted"
                short["platforms"][PLATFORM]["url"] = short_url
                short["platforms"][PLATFORM].pop("error", None)
                print(f"\nPosted (live, verified): {short_url}")
            elif short_url and live == "mismatch":
                # HARD RULE (2026-08-13): a title mismatch against a known other short
                # means the captured id is NOT ours. Drop it rather than record it.
                short["platforms"][PLATFORM]["status"] = "posted_unverified"
                short["platforms"][PLATFORM]["url"] = None
                short["platforms"][PLATFORM]["error"] = (
                    f"Upload submitted, but the captured id ({short_url}) resolves to a "
                    "DIFFERENT short, so it was discarded rather than recorded. Recover the "
                    "real URL with: python scripts/reconcile_short_urls.py --platform rumble "
                    "--apply. Do NOT re-run the poster (would duplicate).")
                print(f"\n\u26a0 posted_unverified: captured id {short_url} belongs to another "
                      "short \u2014 URL discarded (never record a wrong URL). Run "
                      "reconcile_short_urls.py to recover it.")
            elif short_url:
                short["platforms"][PLATFORM]["status"] = "posted_unverified"
                short["platforms"][PLATFORM]["url"] = short_url
                short["platforms"][PLATFORM]["error"] = (
                    "Short URL found on /account/content but public page did not resolve "
                    "within the retry window: verify manually, or run "
                    "scripts/reconcile_short_urls.py --platform rumble. "
                    "Do NOT re-run the poster (would duplicate).")
                print(f"\n\u26a0 posted_unverified: {short_url} (URL captured, liveness not confirmed in window)")
            else:
                short["platforms"][PLATFORM]["status"] = "posted_unverified"
                short["platforms"][PLATFORM]["url"] = None
                short["platforms"][PLATFORM]["error"] = (
                    "Upload submitted but short not found on /account/content within retry window: "
                    "recapture by title later (it lives at /shorts/v<id>, not the channel grid). "
                    "Do NOT re-run (would duplicate).")
                print("\n\u26a0 posted_unverified: short URL not captured — recapture later from "
                      "/account/content by title.")
            save(data)
            print("shorts.json updated. Done \u2713")

            status = short["platforms"][PLATFORM]["status"]
            if status == "posted":
                print(f"POST OK platform=rumble url={short_url}", flush=True)
            elif short_url:
                print(f"POST OK platform=rumble url={short_url} status=posted_unverified", flush=True)
            else:
                print("POST FAIL platform=rumble reason=no-url-captured", flush=True)

        except SystemExit:
            raise
        except Exception as err:
            short["platforms"][PLATFORM]["status"] = "failed"
            short["platforms"][PLATFORM]["error"] = str(err)
            save(data)
            print(f"\nFailed: {err}", file=sys.stderr, flush=True)
            print(f"POST FAIL platform=rumble reason={str(err).splitlines()[0][:120]}", flush=True)
            sys.exit(1)
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
