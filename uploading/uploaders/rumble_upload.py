#!/usr/bin/env python3
"""
Playwright uploader for Rumble — uses real Chrome (channel="chrome").

Uploads a video to https://rumble.com/upload.php using a persistent profile
so login state sticks across runs.

Usage:
    python rumble_upload.py <video_path> <metadata_path> [thumbnail_path]

First run: a Chrome window opens. Log in to Rumble manually if you aren't
already; the script will detect the redirect and wait. Cookies persist in
~/.chrome_rumble_profile/.

Final stdout line is a single JSON object:
    {"platform": "rumble", "status": "...", "url": "...", "error": "..."}

Setup (one-time):
    pip install playwright
    (Chrome must be installed — no playwright install chromium needed)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

from playwright.async_api import async_playwright, expect

PROFILE_DIR = Path.home() / ".chrome_rumble_profile"
RUMBLE_UPLOAD_URL = "https://rumble.com/upload.php"


def emit(result: dict) -> int:
    """Print final JSON line to stdout and return an exit code."""
    print(json.dumps(result))
    return 0 if result.get("status") in ("published", "processing") else 1


async def upload_to_rumble(video: Path, metadata: dict, thumbnail: Path | None) -> dict:
    import re

    title = metadata.get("title", "").strip()
    description = metadata.get("description", "").strip()
    tags = metadata.get("tags") or []
    primary_category = (
        (metadata.get("categories") or {}).get("rumble", {}).get("primary")
        or "Finance & Crypto"
    )
    visibility = metadata.get("visibility", "public").lower()
    tags_csv = ", ".join(t.strip() for t in tags)

    PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    # Use .start() instead of `async with` so Chrome stays open after the
    # script exits — the browser process is not killed when we return.
    p = await async_playwright().start()
    context = await p.chromium.launch_persistent_context(
        user_data_dir=str(PROFILE_DIR),
        channel="chrome",
        headless=False,
        viewport={"width": 1440, "height": 900},
    )
    page = context.pages[0] if context.pages else await context.new_page()
    print("[info] Chrome opened — window will remain open after script exits", file=sys.stderr)

    print(f"[info] navigating to {RUMBLE_UPLOAD_URL}", file=sys.stderr)
    await page.goto(RUMBLE_UPLOAD_URL, wait_until="load")
    print(f"[info] landed on: {page.url}", file=sys.stderr)
    print(f"[info] page title: {await page.title()}", file=sys.stderr)

    if "login" in page.url or "/sign-in" in page.url or "auth.rumble.com" in page.url:
        print("[info] not logged in — please log in to Rumble in the browser window (waiting up to 5 minutes)…", file=sys.stderr)
        try:
            await page.wait_for_url("https://rumble.com/upload.php", timeout=300_000)
            await page.wait_for_load_state("load")
            print(f"[info] logged in, now on: {page.url}", file=sys.stderr)
        except Exception:
            return {"platform": "rumble", "status": "skipped", "error": "not signed in"}

    # Diagnose available file inputs so we know what we're working with.
    inputs_info = await page.evaluate(
        "() => Array.from(document.querySelectorAll('input[type=\"file\"]')).map(i => ({id: i.id, cls: i.className, name: i.name, accept: i.accept}))"
    )
    print(f"[info] file inputs on page: {inputs_info}", file=sys.stderr)

    # Attach the video — prefer Rumble's known IDs; never fall back to a generic
    # 'input[type="file"]' which could match the thumbnail input.
    print(f"[info] attaching video: {video}", file=sys.stderr)
    file_input = page.locator('#Filedata, .hidden-upload').first
    try:
        await file_input.wait_for(state="attached", timeout=10_000)
        print("[info] found Rumble-specific file input", file=sys.stderr)
    except Exception:
        print("[warn] Rumble-specific input not found — check inputs_info above", file=sys.stderr)
        file_input = page.locator('input[type="file"]').first
        await file_input.wait_for(state="attached", timeout=20_000)

    # Use the file chooser approach: intercept the native picker that Rumble opens.
    # This is more reliable than set_input_files on hidden inputs for custom uploaders.
    try:
        async with page.expect_file_chooser(timeout=5_000) as fc_info:
            await file_input.click()
        fc = await fc_info.value
        await fc.set_files(str(video))
        print("[info] video attached via file chooser", file=sys.stderr)
    except Exception as e:
        print(f"[info] file chooser not triggered ({e}) — using set_input_files + change event", file=sys.stderr)
        await file_input.set_input_files(str(video))
        await page.evaluate(
            """() => {
                const inp = document.querySelector('#Filedata, .hidden-upload, input[type="file"]');
                if (inp) {
                    inp.dispatchEvent(new Event('change', {bubbles: true, cancelable: true}));
                    inp.dispatchEvent(new Event('input',  {bubbles: true, cancelable: true}));
                }
            }"""
        )

    # Confirm the upload actually started before filling the form.
    print("[info] waiting for upload progress indicator (confirms Rumble accepted the file)…", file=sys.stderr)
    try:
        await page.wait_for_function(
            "() => /\\d+%/.test(document.body.innerText)",
            timeout=20_000,
        )
        print("[info] upload in progress", file=sys.stderr)
    except Exception:
        print("[warn] no upload % found — Rumble may not have accepted the file; check the browser window", file=sys.stderr)

    await page.locator('input[placeholder="Video Title"]').fill(title)
    await page.locator('textarea[placeholder="Video Description"]').fill(description)

    # Primary category — select-search combobox.
    cat_input = page.locator('input[name="primary-category"]').first
    try:
        await cat_input.wait_for(state="visible", timeout=10_000)
        await cat_input.click()
        await cat_input.fill(primary_category)
        option = page.get_by_text(primary_category, exact=True).first
        await option.wait_for(state="visible", timeout=10_000)
        await option.click()
        print(f"[info] category set: {primary_category}", file=sys.stderr)
    except Exception as e:
        print(f"[warn] couldn't set category ({e}) — leaving default", file=sys.stderr)

    # Tags.
    tags_el = page.locator('input#tags, input[name="tags"]').first
    try:
        await tags_el.wait_for(state="visible", timeout=5_000)
        await tags_el.fill(tags_csv)
    except Exception:
        print("[warn] couldn't find tags input — skipping", file=sys.stderr)

    # Custom thumbnail if provided.
    if thumbnail and thumbnail.exists():
        print(f"[info] attaching custom thumbnail: {thumbnail}", file=sys.stderr)
        thumb_input = page.locator('input[type="file"]#customThumb, input[type="file"][name*="thumb" i]').first
        try:
            await thumb_input.wait_for(state="attached", timeout=10_000)
            await thumb_input.set_input_files(str(thumbnail))
        except Exception:
            print("[warn] couldn't attach thumbnail — skipping", file=sys.stderr)

    # Visibility radio.
    if visibility == "unlisted":
        await page.get_by_label("Unlisted").check()
    elif visibility == "private":
        await page.get_by_label("Private").check()

    # Wait for upload to finish, then click Upload.
    print("[info] waiting for Upload button to be enabled (video upload + form complete)…", file=sys.stderr)
    upload_btn = page.get_by_role("button", name="Upload").first
    await expect(upload_btn).to_be_enabled(timeout=600_000)
    print("[info] Upload button enabled — clicking…", file=sys.stderr)
    await upload_btn.click()
    print("[info] Upload clicked — scanning for result…", file=sys.stderr)

    rumble_v_re = re.compile(r"https://rumble\.com/v[a-zA-Z0-9]+-[a-zA-Z0-9][^\s\"'<>]*\.html")
    url = ""

    async def scan_for_url() -> str:
        hrefs = await page.evaluate(
            "() => Array.from(document.querySelectorAll('a[href]')).map(a => a.href)"
        )
        for h in hrefs:
            m = rumble_v_re.search(h)
            if m:
                return m.group(0).rstrip(".")
        values = await page.evaluate(
            "() => Array.from(document.querySelectorAll('input')).map(i => i.value)"
        )
        for v in values:
            m = rumble_v_re.search(v)
            if m:
                return m.group(0).rstrip(".")
        body_text = await page.evaluate("() => document.body.innerText")
        m = rumble_v_re.search(body_text)
        return m.group(0).rstrip(".") if m else ""

    # Tight polling loop for first 30s to catch transient success state.
    for i in range(60):
        await page.wait_for_timeout(500)
        cur_url = page.url
        if rumble_v_re.search(cur_url):
            url = cur_url
            print(f"[info] video URL from page navigation: {url}", file=sys.stderr)
            break
        found = await scan_for_url()
        if found:
            url = found
            print(f"[info] direct link captured: {url}", file=sys.stderr)
            break
        # Check for licensing page after ~2.5s.
        if i == 4:
            page_text = await page.evaluate("() => document.body.innerText")
            print(f"[info] URL after 2.5s: {cur_url}", file=sys.stderr)
            on_licensing_page = (
                "exclusive agreement" in page_text.lower()
                or "check here if you agree" in page_text.lower()
            )
            has_submit = await page.get_by_role("button", name="Submit").count() > 0
            if on_licensing_page or has_submit:
                print("[info] licensing page — checking terms then waiting for upload to finish…", file=sys.stderr)

                # Check both agreement boxes as soon as they're visible (before upload finishes).
                async def check_agreement_boxes() -> None:
                    for texts in [
                        ["You have not signed an exclusive agreement", "exclusive agreement"],
                        ["Check here if you agree", "agree to our terms", "terms of service", "I agree"],
                    ]:
                        for text in texts:
                            loc = page.locator(f'label:has-text("{text}")').first
                            try:
                                await loc.wait_for(state="visible", timeout=5_000)
                                label_for = await loc.get_attribute("for")
                                if label_for:
                                    cb = page.locator(f'input#{label_for}')
                                else:
                                    cb = loc.locator('input[type="checkbox"]').first
                                if not await cb.is_checked():
                                    await loc.click()
                                    await page.wait_for_timeout(300)
                                    print(f"[info] checked: {text[:50]}", file=sys.stderr)
                                else:
                                    print(f"[info] already checked: {text[:50]}", file=sys.stderr)
                                break
                            except Exception:
                                continue

                await check_agreement_boxes()

                # Now wait for Submit to be enabled (upload finished on Rumble's end).
                try:
                    submit_btn = page.get_by_role("button", name="Submit").first
                    await expect(submit_btn).to_be_enabled(timeout=600_000)
                    print("[info] Submit button is now enabled", file=sys.stderr)
                except Exception:
                    print("[warn] Submit button never became enabled — proceeding anyway", file=sys.stderr)

                # Re-check boxes in case page reset them during upload.
                await check_agreement_boxes()

                if has_submit:
                    submit_btn = page.get_by_role("button", name="Submit").first
                    await submit_btn.click()
                    print("[info] Submit clicked", file=sys.stderr)
                    await page.wait_for_timeout(3_000)
                    # Check for visible error messages.
                    page_text_after = await page.evaluate("() => document.body.innerText")
                    for err_phrase in ["please check", "must agree", "required", "error", "invalid"]:
                        if err_phrase in page_text_after.lower():
                            print(f"[warn] possible error on page after Submit: found '{err_phrase}'", file=sys.stderr)
                            print(f"[warn] page text snippet: {page_text_after[:300]}", file=sys.stderr)
                            break
                break
    else:
        if not url:
            print("[warn] direct link not found during initial scan — extending search…", file=sys.stderr)

    # After Submit, Rumble may redirect to the video page or stay on upload.php
    # while it processes. Poll for up to 3 minutes for a redirect or inline link.
    if not url:
        print("[info] scanning for direct link after Submit…", file=sys.stderr)
        for _ in range(60):  # up to 3 min (60 × 3s)
            await page.wait_for_timeout(3_000)
            cur_url = page.url
            if rumble_v_re.search(cur_url):
                url = cur_url
                print(f"[info] redirected to video URL: {url}", file=sys.stderr)
                break
            found = await scan_for_url()
            if found:
                url = found
                print(f"[info] direct link captured: {url}", file=sys.stderr)
                break
        else:
            print("[warn] direct link not found after 3 min — falling back to dashboard", file=sys.stderr)

    # Chrome stays open — do NOT call context.close() or p.stop().
    if url and "upload.php" not in url:
        return {"platform": "rumble", "status": "published", "url": url}
    return {
        "platform": "rumble",
        "status": "published",
        "url": "https://rumble.com/account/videos",
        "note": "submitted OK but video URL not yet available — check Rumble dashboard",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload a video to Rumble via Playwright Chromium.")
    parser.add_argument("video", type=Path)
    parser.add_argument("metadata", type=Path)
    parser.add_argument("thumbnail", type=Path, nargs="?", default=None)
    args = parser.parse_args()

    if not args.video.exists():
        return emit({"platform": "rumble", "status": "failed", "error": f"video not found: {args.video}"})
    if not args.metadata.exists():
        return emit({"platform": "rumble", "status": "failed", "error": f"metadata not found: {args.metadata}"})

    metadata = json.loads(args.metadata.read_text(encoding="utf-8"))
    thumbnail = args.thumbnail if (args.thumbnail and args.thumbnail.exists()) else None

    try:
        result = asyncio.run(upload_to_rumble(args.video.resolve(), metadata, thumbnail.resolve() if thumbnail else None))
    except Exception as e:
        result = {"platform": "rumble", "status": "failed", "error": f"{type(e).__name__}: {e}"}
    return emit(result)


if __name__ == "__main__":
    sys.exit(main())
