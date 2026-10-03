# post_ig_single.py — CANONICAL Python port of post-ig-single.js (2026-08-11,
# posting-tail migration; the JS twin is FROZEN rollback). Status: PORTED,
# BLESS-PENDING — invoke the JS twin for production posts until this port is
# live-blessed with one real post.
#
# 1:1 port on playwright.sync_api: same igbot-profile Chrome, same duplicate
# pre-check (scans the last 5 profile posts for a matching hook snippet before
# ever opening the composer), same click-driven 4:5 crop-menu handling (mouse
# moved into the menu region via steps=10 before clicking so it doesn't close
# on mouseup), same Next-wizard stepping (Crop -> Filter/Edit), same
# human-typing caption entry with a non-empty verification before Share, same
# post-check (freshness < 15min, caption hook match, single-image slide-count
# check), same pending -> posting -> posted/failed write-back to
# ig-single-image.json. Documented divergences ONLY: the final machine line
# (POST OK/FAIL) + this header comment.
import json
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).resolve().parent
IG_JSON = SCRIPT_DIR.parent / "data" / "ig-single-image.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile"
WORKSPACE_ROOT = Path(r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets")
IG_USERNAME = "realcodemonkeymike"
PLATFORM = "ig_single"

ACTION_MIN = int(os.environ.get("IGS_ACTION_MIN") or 1000)
ACTION_MAX = int(os.environ.get("IGS_ACTION_MAX") or 5000)
CHAR_DELAY_MIN = 5
CHAR_DELAY_MAX = 40
PRE_COMPOSE_MIN = int(os.environ.get("IGS_PRE_COMPOSE_MIN") or 1000)
PRE_COMPOSE_MAX = int(os.environ.get("IGS_PRE_COMPOSE_MAX") or 15000)


def random_between(min_ms, max_ms):
    return random.randint(min_ms, max_ms)


def long_wait(page, min_ms, max_ms, label=""):
    ms = random_between(min_ms, max_ms)
    print(f"  waiting {round(ms / 1000)}s{f' ({label})' if label else ''}...")
    page.wait_for_timeout(ms)


def type_human(page, text):
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(random_between(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def resolve_image_path(post):
    image_path = post.get("image_path")
    if image_path:
        rel = re.sub(r"^schedule-tweets[\\/]", "", image_path)
        abs_path = WORKSPACE_ROOT / rel
        if abs_path.exists():
            return str(abs_path)
        print(f"  image_path field doesn't resolve ({abs_path}) — falling back to glob")
    image_id = post.get("image_id")
    if image_id:
        for d in ("images/x", "images/ig", "images/yt"):
            full_dir = WORKSPACE_ROOT / d
            if not full_dir.exists():
                continue
            match = next((f.name for f in full_dir.iterdir() if image_id in f.name), None)
            if match:
                return str(full_dir / match)
    return None


# IG pops a "Turn on Notifications" (and sometimes "Save your login info?") modal
# on load. It traps focus and intercepts clicks, so the Create sidebar never
# expands and input[type=file] never appears. Dismiss up to 2 with "Not Now".
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


def mouse_click(page, locator):
    bbox = locator.bounding_box()
    if bbox and bbox["width"] > 0:
        page.mouse.click(bbox["x"] + bbox["width"] / 2, bbox["y"] + bbox["height"] / 2)
    else:
        locator.click()


def click_next(page, step_label):
    print(f"  Clicking Next ({step_label})...")
    btn = page.get_by_role("button", name="Next")
    if btn.count() == 0:
        btn = page.locator('button:has-text("Next")').first
    btn.wait_for(timeout=10000)
    mouse_click(page, btn)
    page.wait_for_timeout(2000)


# Returns the most recent post URLs from the profile grid (up to `count`)
def get_recent_post_urls(page, count=5):
    page.goto(f"https://www.instagram.com/{IG_USERNAME}/")
    try:
        page.wait_for_load_state("domcontentloaded", timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(2500)
    return page.evaluate(
        """(n) => [...document.querySelectorAll('a[href*="/p/"]')].slice(0, n).map(a => a.href)""",
        count,
    )


# Fetches caption, timestamp, and slide count from a post's og:description and DOM
def inspect_post(page, url):
    page.goto(url)
    try:
        page.wait_for_load_state("domcontentloaded", timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(2000)
    return page.evaluate(
        """() => {
        const og  = document.querySelector('meta[property="og:description"]');
        const t   = document.querySelector('time');
        // Carousel dots use aria-label like "Go to slide 2"
        const dots = document.querySelectorAll('button[aria-label*="Go to slide"]').length
                  || document.querySelectorAll('button[aria-label*="Go to"]').length;
        return {
            caption:    og  ? og.getAttribute('content') : '',
            timestamp:  t   ? t.getAttribute('datetime')  : null,
            slideCount: dots,
        };
    }"""
    )


# PRE-CHECK: scan last 5 posts on profile for a matching hook -> returns url or None
def check_already_posted(page, hook):
    print("\nPre-check: scanning recent profile posts for duplicates...")
    hook_snippet = hook[:40]
    urls = get_recent_post_urls(page, 5)
    print(f'  Checking {len(urls)} recent posts against hook: "{hook_snippet}"')

    for url in urls:
        info = inspect_post(page, url)
        if info.get("caption") and hook_snippet in info["caption"]:
            print(f"  DUPLICATE FOUND at {url}")
            return url
        print(f"  Not a match: {url}")
    print("  No duplicate found. Safe to post.\n")
    return None


def _now_ms():
    return time.time() * 1000


def _parse_iso_ms(iso_str):
    s = iso_str.strip()
    if s.endswith("Z"):
        s = s[:-1] + "+00:00"
    return datetime.fromisoformat(s).timestamp() * 1000


# POST-CHECK: after posting, find the new post URL, verify caption + freshness
# expectedSlides: 1 for single image
def verify_posted(page, pre_urls, post, expected_slides):
    print("\nPost-check: verifying post on profile...")

    new_urls = get_recent_post_urls(page, 5)
    found = next((u for u in new_urls if u not in pre_urls), None)
    new_url = found or (new_urls[0] if new_urls else None)

    if not new_url:
        return {"ok": False, "reason": "No posts found on profile after posting"}

    print(f"  Inspecting: {new_url}")
    info = inspect_post(page, new_url)

    # Freshness: post should be less than 15 minutes old
    timestamp = info.get("timestamp")
    age_ms = (_now_ms() - _parse_iso_ms(timestamp)) if timestamp else float("inf")
    if age_ms > 15 * 60 * 1000:
        age_min = "inf" if age_ms == float("inf") else round(age_ms / 60000)
        return {
            "ok": False,
            "url": new_url,
            "reason": f"Most recent post is {age_min}m old — likely not ours",
            "info": info,
        }

    # Caption check: hook must appear
    hook_snippet = post["hook"][:40]
    caption = info.get("caption")
    if caption and hook_snippet not in caption:
        return {
            "ok": False,
            "url": new_url,
            "reason": f'Hook "{hook_snippet}" not found in caption',
            "info": info,
        }

    # Slide count: single image should have 0 dots
    slide_count = info.get("slideCount") or 0
    if expected_slides == 1 and slide_count > 1:
        return {
            "ok": False,
            "url": new_url,
            "reason": f"Expected single image but got {slide_count} slides",
            "info": info,
        }

    print(f"  Verified \u2713  (age: {round(age_ms / 1000)}s, caption match: yes, slides: {slide_count})")
    return {"ok": True, "url": new_url, "info": info}


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def main():
    data = json.loads(IG_JSON.read_text(encoding="utf-8"))
    post = next((p for p in data["posts"] if p.get("status") == "pending"), None)

    if not post:
        print("No pending Instagram single-image posts. Exiting.")
        return

    print(f'Post: "{post["hook"]}"')

    image_path = resolve_image_path(post)
    if not image_path:
        print(f'FATAL: image not found for post {post.get("id")} (image_id: {post.get("image_id")})',
              file=sys.stderr)
        sys.exit(1)
    print(f"Image: {image_path}")

    top3 = " ".join(post["hashtags"][:3])
    full_caption = post["caption"] + "\n\n" + top3
    print(f"Caption: {len(full_caption)} chars")

    print("Launching Chrome...")
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
            # -- Login check ------------------------------------------------------
            print("Navigating to Instagram...")
            page.goto("https://www.instagram.com/")
            try:
                page.wait_for_load_state("domcontentloaded", timeout=30000)
            except Exception:
                pass
            page.wait_for_timeout(1500)
            if page.locator('input[name="username"], input[autocomplete="username"]').count() > 0:
                raise RuntimeError("Instagram login form detected — not logged in.")
            print("Instagram home loaded \u2713")
            dismiss_blocking_dialogs(page)

            # -- PRE-CHECK ----------------------------------------------------------
            duplicate_url = check_already_posted(page, post["hook"])
            if duplicate_url:
                print(f"Post already exists at {duplicate_url}. Marking as posted and exiting.")
                post["status"] = "posted"
                post["posted_at"] = post.get("posted_at") or _now_iso()
                post["post_url"] = duplicate_url
                IG_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
                print(f"POST OK platform={PLATFORM} url={duplicate_url}", flush=True)
                browser.close()
                return

            # Save pre-posting URL list for post-check comparison
            pre_urls = get_recent_post_urls(page, 5)

            # Navigate back to home for the Create flow
            page.goto("https://www.instagram.com/")
            page.wait_for_timeout(1500)
            dismiss_blocking_dialogs(page)

            # Mark mid-flight
            post["status"] = "posting"
            IG_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before composer")

            # -- Open Create -> Post --------------------------------------------------
            print("Looking for Create button...")
            create_btn = None
            for sel in ['a[href="/create/select-type/"]', '[aria-label="New post"]', '[aria-label="Create"]']:
                el = page.locator(sel).first
                if el.count() > 0:
                    create_btn = el
                    print(f"  Found via: {sel}")
                    break
            if not create_btn:
                create_btn = page.locator('text="Create"').first
            mouse_click(page, create_btn)
            page.wait_for_timeout(2000)

            print("  Clicking Post from expanded sidebar...")
            post_link = page.get_by_role("link", name=re.compile(r"^Post$")).or_(
                page.get_by_role("button", name=re.compile(r"^Post$"))
            ).first
            if post_link.count() == 0:
                post_link = page.locator("a, button, span, div").filter(has_text=re.compile(r"^Post$")).first
            if post_link.count() > 0:
                mouse_click(page, post_link)
                print("  Clicked Post \u2713")
            page.wait_for_timeout(1500)

            # -- Upload image -----------------------------------------------------------
            print("Uploading image...")
            file_input = page.locator('input[type="file"]').first
            file_input.wait_for(state="attached", timeout=10000)
            file_input.set_input_files(image_path)
            print("  setInputFiles called — waiting for preview...")
            page.wait_for_timeout(3000)

            # -- Select 4:5 (portrait) crop ----------------------------------------------
            # IG defaults image uploads to 1:1; we want 4:5 portrait. The crop menu
            # is hover-driven (a Playwright click opens then closes it as the cursor
            # moves on mouseup). See [[scheduled-posters]] / SKILL.md PART 1I.3 for
            # the discovery that this is hover-not-click.
            crop_trigger = page.locator('button:has(svg[aria-label="Select crop"])').first
            if crop_trigger.count() > 0:
                try:
                    crop_trigger.scroll_into_view_if_needed(timeout=5000)
                except Exception:
                    pass
                try:
                    # Image flow's crop menu opens on click (unlike Reel's which opens on hover).
                    # Menu structure is identical: 4 <div role="button"> options each with a
                    # <span> text label. After click, find 4:5 fast and click it while cursor
                    # is still in the menu region (steps:10 keeps it continuously inside).
                    crop_trigger.click(timeout=5000)
                    page.wait_for_timeout(400)
                    coords = page.evaluate(
                        """() => {
                        for (const el of document.querySelectorAll('[role="button"]')) {
                            const span = el.querySelector('span');
                            if (span && span.textContent.trim() === '4:5') {
                                const r = el.getBoundingClientRect();
                                if (r.width > 0 && r.height > 0) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
                            }
                        }
                        return null;
                    }"""
                    )
                    if coords:
                        print(f"  found 4:5 at ({round(coords['x'])}, {round(coords['y'])})")
                        page.mouse.move(coords["x"], coords["y"], steps=10)
                        page.wait_for_timeout(120)
                        page.mouse.click(coords["x"], coords["y"])
                        print("  \u2713 Clicked 4:5")
                        page.wait_for_timeout(800)
                    else:
                        print("  WARN: 4:5 not in menu after click — proceeding with default crop")
                except Exception as e:
                    msg = str(e).splitlines()[0] if str(e) else ""
                    print(f"  4:5 selection failed: {msg}")
            else:
                print("  WARN: crop trigger not found")

            # -- Next (Crop) -> Next (Filter) ---------------------------------------------
            click_next(page, "Crop")
            page.wait_for_timeout(1000)
            click_next(page, "Filter/Edit")
            page.wait_for_timeout(1000)

            # -- Caption -------------------------------------------------------------------
            print("Typing caption...")
            caption_area = page.locator(
                '[aria-label="Write a caption..."], [aria-label="Add a caption..."], textarea[placeholder*="caption"], '
                '[contenteditable][placeholder*="caption"]'
            ).first
            caption_area.wait_for(timeout=10000)
            caption_area.click()
            page.wait_for_timeout(300)
            type_human(page, full_caption)
            print("Caption typed \u2713")
            page.wait_for_timeout(500)

            caption_content = caption_area.evaluate("el => el.value || el.innerText || ''")
            if not caption_content.strip():
                raise RuntimeError("Caption field is empty before sharing — aborting.")
            print(f"Caption verified in composer ({len(caption_content)} chars) \u2713")

            # -- Share -----------------------------------------------------------------------
            long_wait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, "before Share")
            print("Clicking Share...")
            share_btn = page.get_by_role("button", name="Share").first
            share_btn.wait_for(timeout=10000)
            mouse_click(page, share_btn)

            print("Waiting for share confirmation...")
            try:
                page.wait_for_selector('text="Your post has been shared.", text="Post shared"', timeout=25000)
                print("Instagram confirmation dialog seen \u2713")
            except Exception:
                print("Confirmation dialog not detected — proceeding to post-check.")
                page.wait_for_timeout(3000)

            # -- POST-CHECK ----------------------------------------------------------------
            result = verify_posted(page, pre_urls, post, 1)

            if not result["ok"]:
                raise RuntimeError(f"Post-check FAILED: {result['reason']}")

            post["status"] = "posted"
            post["posted_at"] = _now_iso()
            post["post_url"] = result["url"]
            post.pop("error", None)
            IG_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"\nDone \u2713  Post URL: {result['url']}")
            print(f"POST OK platform={PLATFORM} url={result['url']}", flush=True)

        except Exception as err:
            post["status"] = "failed"
            post["error"] = str(err)
            IG_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"\nPosting failed: {err}", file=sys.stderr)
            reason = str(err).splitlines()[0][:120] if str(err) else "unknown"
            print(f"POST FAIL platform={PLATFORM} reason={reason}", flush=True)
            sys.exit(1)
        finally:
            browser.close()


if __name__ == "__main__":
    main()
