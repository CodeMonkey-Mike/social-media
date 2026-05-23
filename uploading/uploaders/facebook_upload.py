#!/usr/bin/env python3
"""
Playwright uploader for Facebook (Page composer) — uses real Chrome (channel="chrome").

Drives Chrome through the realCodeMonkeyMike Page composer. Posts a video via the
Photo/Video button on the Page timeline.

Usage:
    python facebook_upload.py <video_path> <metadata_path> [thumbnail_path]

First run: a Chrome window opens. Log in to Facebook manually if you aren't already
signed in; the script detects the login page and waits up to 5 minutes. Cookies
persist in ~/.chrome_facebook_profile/.

Final stdout line is a single JSON object:
    {"platform": "facebook", "status": "...", "url": "...", "error": "..."}

Setup (one-time):
    pip install playwright
    (Chrome must be installed — no playwright install chromium needed)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import random
import sys
from pathlib import Path

from playwright.async_api import async_playwright

PROFILE_DIR = Path.home() / ".chrome_facebook_profile"
DEFAULT_PAGE = "realCodeMonkeyMike"


def emit(result: dict) -> int:
    print(json.dumps(result))
    return 0 if result.get("status") in ("published", "processing") else 1


def build_post_body(metadata: dict) -> str:
    title = (metadata.get("title") or "").strip()
    tags = [t.replace(" ", "") for t in (metadata.get("tags") or [])[:3]]
    hashtags = " ".join(f"#{t}" for t in tags if t)
    return f"{title}\n\n{hashtags}".strip() if hashtags else title


async def upload_to_facebook(video: Path, metadata: dict, thumbnail: Path | None) -> dict:
    body = build_post_body(metadata)
    page_handle = os.environ.get("FACEBOOK_PAGE", DEFAULT_PAGE)
    page_url = f"https://www.facebook.com/{page_handle}/"

    PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    async def pause(lo: int = 2, hi: int = 12) -> None:
        ms = random.randint(lo * 1000, hi * 1000)
        print(f"[info] waiting {ms / 1000:.1f}s…", file=sys.stderr)
        await page.wait_for_timeout(ms)

    p = await async_playwright().start()
    context = await p.chromium.launch_persistent_context(
        user_data_dir=str(PROFILE_DIR),
        channel="chrome",
        headless=False,
        viewport={"width": 1440, "height": 900},
    )
    page = context.pages[0] if context.pages else await context.new_page()
    print("[info] Chrome opened — window will remain open after script exits", file=sys.stderr)

    print(f"[info] navigating to {page_url}", file=sys.stderr)
    await page.goto(page_url, wait_until="domcontentloaded")
    await pause()
    print(f"[info] landed on: {page.url}", file=sys.stderr)

    def is_on_auth_url(url: str) -> bool:
        return any(x in url for x in ["/login", "two_step", "checkpoint", "verification", "recover"])

    async def is_logged_out() -> bool:
        # Logged out = auth URL, OR "Log In" button/link visible on the page.
        if is_on_auth_url(page.url):
            return True
        login_btns = await page.get_by_role("button", name="Log In").count()
        login_links = await page.get_by_role("link", name="Log In").count()
        return (login_btns + login_links) > 0

    if await is_logged_out():
        print("[info] not logged in — navigating to login page and waiting up to 5 minutes…", file=sys.stderr)
        await page.goto("https://www.facebook.com/login/", wait_until="domcontentloaded")
        try:
            await page.wait_for_function(
                """() => {
                    const url = window.location.href;
                    return url.includes('facebook.com') &&
                           !url.includes('/login') &&
                           !url.includes('two_step') &&
                           !url.includes('checkpoint') &&
                           !url.includes('verification') &&
                           !url.includes('recover');
                }""",
                timeout=300_000,
            )
            print("[info] login complete — navigating to page…", file=sys.stderr)
            await pause(3, 8)
            await page.goto(page_url, wait_until="domcontentloaded")
            await pause()
        except Exception:
            return {"platform": "facebook", "status": "skipped", "error": "not signed in"}

    SCREENSHOT_DIR = Path.home() / "Desktop" / "fb_upload_debug"
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

    async def screenshot(name: str) -> None:
        path = SCREENSHOT_DIR / f"{name}.png"
        await page.screenshot(path=str(path), full_page=False)
        print(f"[screenshot] {path}", file=sys.stderr)

    await screenshot("0_page_loaded")

    # Close notifications panel: press Escape, then click the bell icon to toggle it closed.
    await page.keyboard.press("Escape")
    await pause(2, 4)
    bell = page.locator('[aria-label*="Notification" i]').first
    try:
        if await bell.is_visible():
            await bell.click()
            await pause(2, 4)
            await bell.click()  # second click closes it
            await pause(2, 4)
    except Exception:
        pass
    await page.keyboard.press("Escape")
    await pause(2, 4)
    await page.evaluate("window.scrollTo(0, 0)")
    await pause()
    await screenshot("0b_after_dismiss")

    # Switch into the Page context if prompted ("Switch into CodeMonkey-Mike's Page…").
    # The create-post composer is only available when viewing as the Page, not personal profile.
    switch_btn = page.get_by_role("button", name="Switch Now")
    try:
        await switch_btn.wait_for(state="visible", timeout=5_000)
        print("[info] switching into Page context…", file=sys.stderr)
        await switch_btn.click()
        await pause(4, 8)
        await page.wait_for_load_state("domcontentloaded")
        await pause(3, 7)
        await screenshot("0c_after_switch")
        print(f"[info] now on: {page.url}", file=sys.stderr)
    except Exception:
        print("[info] no Switch Now button — already in Page context", file=sys.stderr)

    # Step 1: Click "What's on your mind?" to open the create-post composer.
    print("[info] opening create-post composer…", file=sys.stderr)
    mind_selectors = [
        '[aria-label*="mind" i]',
        '[aria-label*="Create post" i]',
        '[placeholder*="mind" i]',
        'div[role="button"]:has-text("What")',
    ]
    opened_composer = False
    for sel in mind_selectors:
        try:
            el = page.locator(sel).first
            await el.wait_for(state="visible", timeout=5_000)
            await el.click()
            print(f"[info] composer opened via: {sel}", file=sys.stderr)
            opened_composer = True
            break
        except Exception:
            continue

    if not opened_composer:
        els = await page.evaluate("""() => Array.from(document.querySelectorAll('button,[role="button"],div[role="button"]'))
            .map(e => ({text: e.innerText?.trim().slice(0, 60), aria: e.getAttribute('aria-label') || '', placeholder: e.getAttribute('placeholder') || ''}))
            .filter(e => e.text || e.aria || e.placeholder)
            .slice(0, 40)""")
        print("[debug] clickable elements on page:", file=sys.stderr)
        for el in els:
            print(f"  {el}", file=sys.stderr)
        return {"platform": "facebook", "status": "failed", "error": "couldn't open create-post composer"}

    await pause()

    # Step 2: Inside the composer modal, click Photo/video — intercept the file chooser it opens.
    print(f"[info] attaching video via file chooser: {video}", file=sys.stderr)
    pv_selectors = [
        page.get_by_role("button", name="Photo/video"),
        page.get_by_role("button", name="Photo/Video"),
        page.locator('[aria-label="Photo/video"]'),
        page.locator('[aria-label="Photo/Video"]'),
    ]
    attached = False
    for loc in pv_selectors:
        try:
            btn = loc.first
            await btn.wait_for(state="visible", timeout=5_000)
            async with page.expect_file_chooser(timeout=8_000) as fc_info:
                await btn.click()
            fc = await fc_info.value
            await fc.set_files(str(video))
            print("[info] video attached via file chooser", file=sys.stderr)
            attached = True
            break
        except Exception:
            continue

    if not attached:
        # Fallback: find the hidden file input inside the modal directly.
        try:
            file_input = page.locator('input[type="file"]').first
            await file_input.wait_for(state="attached", timeout=10_000)
            await file_input.set_input_files(str(video))
            print("[info] video attached via direct file input", file=sys.stderr)
            attached = True
        except Exception as e:
            return {"platform": "facebook", "status": "failed", "error": f"couldn't attach video: {e}"}

    # Wait for the upload to start and the caption field to appear.
    await pause(4, 10)

    # Type the post body into the modal's text area.
    try:
        body_field = page.locator('div[contenteditable="true"][role="textbox"]').first
        await body_field.wait_for(state="visible", timeout=10_000)
        # Use JS click — a React overlay div sometimes intercepts Playwright's pointer click.
        await body_field.evaluate("el => el.click()")
        await pause(2, 5)
        await page.keyboard.type(body, delay=random.randint(60, 120))
        print("[info] caption typed", file=sys.stderr)
    except Exception as e:
        print(f"[warn] couldn't fill caption ({e}) — continuing without it", file=sys.stderr)

    await pause()

    # Custom thumbnail if provided.
    if thumbnail and thumbnail.exists():
        print(f"[info] attaching custom thumbnail: {thumbnail}", file=sys.stderr)
        try:
            await page.get_by_role("tab", name="Thumbnail").click(timeout=5_000)
            await pause(2, 6)
            custom_input = page.locator('input[type="file"][accept*="image"]').first
            await custom_input.wait_for(state="attached", timeout=5_000)
            await custom_input.set_input_files(str(thumbnail))
            print("[info] thumbnail attached", file=sys.stderr)
            await pause()
        except Exception as e:
            print(f"[warn] thumbnail flow failed ({e}) — leaving auto-selected default", file=sys.stderr)

    # Wait for video to finish uploading.
    print("[info] waiting for video upload to finish (up to 15 min)…", file=sys.stderr)
    await screenshot("1_after_attach")

    # Wait for upload progress to reach 100% — Facebook shows a green progress bar.
    print("[info] waiting for upload to reach 100%…", file=sys.stderr)
    try:
        await page.wait_for_function(
            "() => document.body.innerText.includes('100%')",
            timeout=900_000,
        )
        print("[info] upload at 100%", file=sys.stderr)
    except Exception:
        print("[warn] couldn't confirm 100% — continuing anyway", file=sys.stderr)

    # Wait for "Checking for copyrighted content" to clear.
    print("[info] waiting for copyright check to clear…", file=sys.stderr)
    for _ in range(60):
        text = await page.evaluate("() => document.body.innerText")
        if "checking for copyrighted" not in text.lower():
            break
        await page.wait_for_timeout(2_000)
    print("[info] copyright check cleared", file=sys.stderr)

    # Step through the wizard: Create post → Edit reel → Post.
    # Do NOT press Escape anywhere in this loop — it closes the entire modal.
    # "Next" has no exact matches on the background page so no scoping needed.
    # "Post" uses exact=True to avoid matching "Like … post" aria-labels on the feed.
    post_btn = None
    for step in range(1, 6):
        await screenshot(f"step{step}_before_btn")

        # Check if the final Post (or Share now) button is visible.
        for btn_name in ("Post", "Share now"):
            candidate = page.get_by_role("button", name=btn_name, exact=True).first
            try:
                if await candidate.is_visible():
                    post_btn = candidate
                    print(f"[info] found final button: '{btn_name}' on step {step}", file=sys.stderr)
                    break
            except Exception:
                pass
        if post_btn:
            break

        # Advance to the next wizard step.
        next_btn = page.get_by_role("button", name="Next").first
        try:
            await next_btn.wait_for(state="visible", timeout=10_000)
            print(f"[info] clicking Next (step {step})…", file=sys.stderr)
            await next_btn.click()
            await pause(3, 7)
        except Exception as e:
            print(f"[warn] no Next button on step {step} ({e})", file=sys.stderr)
            break
    else:
        await screenshot("error_wizard")
        return {"platform": "facebook", "status": "failed", "error": "never reached Post button after 5 Next clicks"}

    if post_btn is None:
        await screenshot("error_no_post_button")
        return {"platform": "facebook", "status": "failed", "error": "Post button not found"}

    # Wait for the Post button to be enabled, then click.
    try:
        await post_btn.wait_for(state="enabled", timeout=30_000)
    except Exception:
        print("[warn] Post button didn't confirm enabled — clicking anyway", file=sys.stderr)

    await pause()
    print("[info] clicking Post…", file=sys.stderr)
    await post_btn.click()
    await pause(3, 8)
    await screenshot("final_after_post_click")

    # Dismiss any post-publish upsell dialogs (e.g. "Add WhatsApp button").
    for dismiss_label in ("Not now", "No thanks", "Maybe later", "Skip"):
        try:
            btn = page.get_by_role("button", name=dismiss_label, exact=True).first
            if await btn.is_visible():
                print(f"[info] dismissing upsell: '{dismiss_label}'", file=sys.stderr)
                await btn.click()
                await pause(2, 4)
                break
        except Exception:
            pass

    # Wait for "Posting…" spinner to finish — Reel settings stays open during upload.
    print("[info] waiting for Posting to complete…", file=sys.stderr)
    await screenshot("final_after_dismiss")
    submitted = False
    for _ in range(120):  # up to 2 min
        await page.wait_for_timeout(1_000)
        page_text = await page.evaluate("() => document.body.innerText")
        if "posting" not in page_text.lower() and "reel settings" not in page_text.lower():
            submitted = True
            print("[info] Posting complete — Reel settings closed", file=sys.stderr)
            break
        if "posting" not in page_text.lower() and "reel settings" in page_text.lower():
            # Posting finished but settings still showing — try clicking Post once more.
            try:
                pb = page.get_by_role("button", name="Post", exact=True).first
                if await pb.is_visible() and await pb.is_enabled():
                    print("[info] Post button re-enabled — clicking", file=sys.stderr)
                    await pb.click()
                    await pause(3, 6)
            except Exception:
                pass
    if not submitted:
        await screenshot("6_still_posting")
        print("[warn] still on Reel settings after 2 min", file=sys.stderr)

    # Navigate to the Page's Videos tab to find the newest upload.
    await page.wait_for_timeout(2_000)
    videos_url = f"https://www.facebook.com/{page_handle}/videos"
    print(f"[info] navigating to {videos_url} to find post URL…", file=sys.stderr)
    await page.goto(videos_url, wait_until="domcontentloaded")
    await page.wait_for_timeout(4_000)
    await screenshot("7_videos_tab")

    post_url = ""
    try:
        links = await page.evaluate(r"""
            () => Array.from(document.querySelectorAll('a[href]'))
                .map(a => a.href.split('?')[0])
                .filter(h =>
                    (h.includes('/videos/') || h.includes('/reel/')) &&
                    h.includes('facebook.com') &&
                    !h.endsWith('/videos') &&
                    !h.endsWith('/videos/') &&
                    !h.endsWith('/reel/') &&
                    !/\/reel\/\?/.test(h)
                )
                .filter((h, i, arr) => arr.indexOf(h) === i)
                .slice(0, 5)
        """)
        print(f"[info] video links on Videos tab: {links}", file=sys.stderr)
        if links:
            # Strip tracking params — take everything up to the first '?'.
            post_url = links[0].split("?")[0]
    except Exception as e:
        print(f"[warn] couldn't extract video URL: {e}", file=sys.stderr)

    if not post_url:
        post_url = page_url

    status = "published" if submitted else "failed"
    result = {"platform": "facebook", "status": status, "url": post_url if post_url else page_url}
    if not submitted:
        result["error"] = f"post may not have submitted — check screenshots in {SCREENSHOT_DIR}"

    # Chrome stays open — do NOT call context.close() or p.stop().
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload a video to a Facebook Page via Playwright Chrome.")
    parser.add_argument("video", type=Path)
    parser.add_argument("metadata", type=Path)
    parser.add_argument("thumbnail", type=Path, nargs="?", default=None)
    args = parser.parse_args()

    if not args.video.exists():
        return emit({"platform": "facebook", "status": "failed", "error": f"video not found: {args.video}"})
    if not args.metadata.exists():
        return emit({"platform": "facebook", "status": "failed", "error": f"metadata not found: {args.metadata}"})

    metadata = json.loads(args.metadata.read_text(encoding="utf-8"))
    thumbnail = args.thumbnail if (args.thumbnail and args.thumbnail.exists()) else None

    try:
        result = asyncio.run(upload_to_facebook(args.video.resolve(), metadata, thumbnail.resolve() if thumbnail else None))
    except Exception as e:
        result = {"platform": "facebook", "status": "failed", "error": f"{type(e).__name__}: {e}"}
    return emit(result)


if __name__ == "__main__":
    sys.exit(main())
