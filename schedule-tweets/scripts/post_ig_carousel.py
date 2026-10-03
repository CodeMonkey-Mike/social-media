# post_ig_carousel.py — CANONICAL Python port of post-ig-carousel.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback). Status:
# PORTED, BLESS-PENDING — invoke the JS twin for production posts until this
# port is live-blessed with one real post.
#
# 1:1 port on playwright.sync_api: same igbot-profile Chrome, same
# slides-vs-images field fallback + hook-from-caption fallback, same
# seq-sorted multi-image resolution (images/ig, images/x, images/yt search
# order — note this order is INTENTIONALLY different from post-ig-single's
# images/x-first order, preserved as-is), same duplicate pre-check, same
# single setInputFiles() call carrying the whole slide array, same "Select
# multiple" toggle + re-upload fallback when IG defaults to single-image mode,
# same absence of any crop-ratio step (the carousel composer never gets one —
# only single-image does), same full (not top-3) hashtag array appended to
# the caption, same carousel post-check (the "Next" arrow's aria-label is the
# reliable multi-image signal; slide dots are a secondary signal since they
# don't render until the viewer interacts), same pending -> posting ->
# posted/failed write-back to ig-carousel.json. Documented divergences ONLY:
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

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).resolve().parent
IG_JSON = SCRIPT_DIR.parent / "data" / "ig-carousel.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile"
WORKSPACE_ROOT = Path(r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets")
IG_USERNAME = "realcodemonkeymike"
PLATFORM = "ig_carousel"

ACTION_MIN = int(os.environ.get("IGC_ACTION_MIN") or 1000)
ACTION_MAX = int(os.environ.get("IGC_ACTION_MAX") or 5000)
CHAR_DELAY_MIN = 5
CHAR_DELAY_MAX = 40
PRE_COMPOSE_MIN = int(os.environ.get("IGC_PRE_COMPOSE_MIN") or 1000)
PRE_COMPOSE_MAX = int(os.environ.get("IGC_PRE_COMPOSE_MAX") or 15000)


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


def resolve_image_path(slide):
    image_path = slide.get("image_path")
    if image_path:
        rel = re.sub(r"^schedule-tweets[\\/]", "", image_path)
        abs_path = WORKSPACE_ROOT / rel
        if abs_path.exists():
            return str(abs_path)
        print(f"  image_path doesn't resolve ({abs_path}) — falling back to glob")
    image_id = slide.get("image_id")
    if image_id:
        for d in ("images/ig", "images/x", "images/yt"):
            full_dir = WORKSPACE_ROOT / d
            if not full_dir.exists():
                continue
            match = next((f.name for f in full_dir.iterdir() if image_id in f.name), None)
            if match:
                return str(full_dir / match)
    return None


# IG pops a "Turn on Notifications" (and sometimes "Save your login info?") modal
# on load that traps focus and blocks the Create flow. Dismiss up to 2 with "Not Now".
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


# Fetches caption (via og:description), timestamp, and carousel signals from a post page.
#
# IG carousel detection: the slide-dot buttons (aria-label="Go to slide N") do NOT
# render until the user interacts with the post, so they're useless as a post-check
# signal on a freshly opened URL. The reliable signal is the "Next" arrow button —
# it only exists on multi-image posts and renders immediately on page load.
def inspect_post(page, url):
    page.goto(url)
    try:
        page.wait_for_load_state("domcontentloaded", timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(2000)
    return page.evaluate(
        """() => {
        const og   = document.querySelector('meta[property="og:description"]');
        const t    = document.querySelector('time');
        const dots = document.querySelectorAll('button[aria-label*="Go to slide"]').length
                  || document.querySelectorAll('button[aria-label*="Go to"]').length;
        // Carousel arrow: only present on multi-image posts; renders immediately.
        const hasNext = !!document.querySelector('button[aria-label="Next"]');
        return {
            caption:    og ? og.getAttribute('content') : '',
            timestamp:  t  ? t.getAttribute('datetime')  : null,
            slideCount: dots,
            isCarousel: hasNext || dots >= 2,
        };
    }"""
    )


# PRE-CHECK: scan last 5 posts for a matching hook -> returns existing url or None
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


# POST-CHECK: find new post URL, verify timestamp freshness, caption, and slide count
def verify_posted(page, pre_urls, post, expected_slides):
    print("\nPost-check: verifying post on profile...")

    new_urls = get_recent_post_urls(page, 5)
    found = next((u for u in new_urls if u not in pre_urls), None)
    new_url = found or (new_urls[0] if new_urls else None)

    if not new_url:
        return {"ok": False, "reason": "No posts found on profile after posting"}

    print(f"  Inspecting: {new_url}")
    info = inspect_post(page, new_url)

    # Must be less than 15 minutes old
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

    # Hook must appear in caption (fall back to first line of caption if no hook field)
    hook_src = post.get("hook") or (post.get("caption") or "").split("\n")[0]
    hook_snippet = hook_src[:40]
    caption = info.get("caption")
    if caption and hook_snippet not in caption:
        return {
            "ok": False,
            "url": new_url,
            "reason": f'Hook "{hook_snippet}" not found in caption',
            "info": info,
        }

    # Carousel: must have the "Next" arrow OR >=2 slide dots. The dots don't render
    # until the user interacts with the post, so isCarousel (via aria-label="Next")
    # is the reliable signal; slideCount is kept as a secondary signal for older
    # IG layouts where dots happen to be in the initial DOM.
    if expected_slides > 1 and not info.get("isCarousel"):
        return {
            "ok": False,
            "url": new_url,
            "reason": f'Expected carousel ({expected_slides} slides) but no "Next" arrow or '
                      f"slide dots found — possible single-image upload",
            "info": info,
        }

    print(f"  Verified \u2713  (age: {round(age_ms / 1000)}s, caption match: yes, "
          f"carousel: {info.get('isCarousel')}, dots: {info.get('slideCount')})")
    return {"ok": True, "url": new_url, "info": info}


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def main():
    data = json.loads(IG_JSON.read_text(encoding="utf-8"))
    post = next((p for p in data["posts"] if p.get("status") == "pending"), None)

    if not post:
        print("No pending Instagram carousel posts. Exiting.")
        return

    # Handle both `slides` and `images` field names — data file uses `images`.
    # NOTE: mirrors JS `post.slides || post.images || []` exactly — JS `||` only
    # falls through on null/undefined, NOT on an empty array (empty arrays are
    # truthy in JS, unlike Python), so a present-but-empty `slides` must NOT
    # fall back to `images` here.
    slides = post.get("slides")
    if slides is None:
        slides = post.get("images")
    post["slides"] = slides if slides is not None else []
    hook = post.get("hook") or (post.get("caption") or "").split("\n")[0][:60]
    print(f'Post: "{hook}"')
    print(f"Slides: {len(post['slides'])}")

    # Resolve all slide image paths up front
    image_paths = []
    post["slides"].sort(key=lambda s: s["seq"])
    for slide in post["slides"]:
        abs_path = resolve_image_path(slide)
        if not abs_path:
            print(f'FATAL: image not found for slide seq={slide.get("seq")} (image_id: {slide.get("image_id")})',
                  file=sys.stderr)
            sys.exit(1)
        print(f"  Slide {slide.get('seq')}: {Path(abs_path).name}")
        image_paths.append(abs_path)

    hashtags = " ".join(post.get("hashtags") or [])
    full_caption = post["caption"] + (("\n\n" + hashtags) if hashtags else "")
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
            duplicate_url = check_already_posted(page, hook)
            if duplicate_url:
                print(f"Post already exists at {duplicate_url}. Marking as posted and exiting.")
                post["status"] = "posted"
                post["posted_at"] = post.get("posted_at") or _now_iso()
                post["post_url"] = duplicate_url
                IG_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
                print(f"POST OK platform={PLATFORM} url={duplicate_url}", flush=True)
                browser.close()
                return

            # Save pre-posting URL list for post-check diff
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

            # -- Upload all slides at once ---------------------------------------------
            print(f"Uploading {len(image_paths)} images...")
            file_input = page.locator('input[type="file"]').first
            file_input.wait_for(state="attached", timeout=10000)
            file_input.set_input_files(image_paths)
            print("  setInputFiles called — waiting for preview...")
            page.wait_for_timeout(4000)

            # If IG shows "Select multiple" toggle (single-image default), enable it and re-upload
            multi_btn = page.locator(
                '[aria-label="Select multiple"], button:has-text("Select multiple")'
            ).first
            if multi_btn.count() > 0:
                print('  "Select multiple" found — enabling carousel mode...')
                mouse_click(page, multi_btn)
                page.wait_for_timeout(2000)
                file_input2 = page.locator('input[type="file"]').first
                file_input2.wait_for(state="attached", timeout=10000)
                file_input2.set_input_files(image_paths)
                print("  Re-uploaded all slides \u2713")
                page.wait_for_timeout(4000)

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
                page.wait_for_selector('text="Your post has been shared.", text="Post shared"', timeout=30000)
                print("Instagram confirmation dialog seen \u2713")
            except Exception:
                print("Confirmation dialog not detected — proceeding to post-check.")
                page.wait_for_timeout(4000)

            # -- POST-CHECK ----------------------------------------------------------------
            result = verify_posted(page, pre_urls, post, len(post["slides"]))

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
