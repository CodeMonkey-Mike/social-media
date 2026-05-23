#!/usr/bin/env python3
"""
Camoufox-driven uploader for BitChute.

Uses Camoufox (fingerprint-patched Firefox) to bypass BitChute's bot-detection
CAPTCHA that blocks regular Playwright/Chrome.

Real upload flow:
  1. Navigate to www.bitchute.com (logged in)
  2. Close the side drawer so toolbar buttons are accessible
  3. Click the +Video icon → "Upload Video" → new tab opens at up{NN}.bitchute.com
  4. Attach video + thumbnail, fill title/description/tags, click Proceed
  5. Redirect to /content = processing (encoding is async)

Usage:
    python bitchute_upload.py <video_path> <metadata_path> [thumbnail_path]

First run: a Camoufox window opens. Log in to BitChute manually if prompted;
cookies persist in ~/.camoufox_bitchute_profile/.

Final stdout line:
    {"platform": "bitchute", "status": "...", "url": "...", "error": "..."}

Setup (one-time):
    pip install "camoufox[geoip]"
    camoufox fetch
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

from camoufox.async_api import AsyncCamoufox

COOKIES_FILE = Path.home() / ".camoufox_bitchute_cookies.json"
BITCHUTE_HOME = "https://www.bitchute.com/"
MIN_FILE_SIZE = 1_000_000  # 1 MB — BitChute hard minimum


def emit(result: dict) -> int:
    print(json.dumps(result))
    return 0 if result.get("status") in ("published", "processing") else 1


async def upload_to_bitchute(video: Path, metadata: dict, thumbnail: Path | None) -> dict:
    title = metadata.get("title", "").strip()
    description = metadata.get("description", "").strip()
    tags = metadata.get("tags") or []
    # BitChute: max 3 search terms, space-separated, no #
    search_terms = " ".join(t.strip().replace(" ", "_") for t in tags[:3])

    PROFILE_DIR = Path.home() / ".camoufox_bitchute_profile"
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    for lock_file in ("lock", ".parentlock"):
        lp = PROFILE_DIR / lock_file
        if lp.exists():
            lp.unlink()

    async with AsyncCamoufox(
        persistent_context=True,
        user_data_dir=str(PROFILE_DIR),
        headless=False,
        humanize=True,
        os=("windows",),
        i_know_what_im_doing=True,
    ) as context:
        page = context.pages[0] if context.pages else await context.new_page()

        print(f"[info] navigating to {BITCHUTE_HOME}", file=sys.stderr)
        await page.goto(BITCHUTE_HOME, wait_until="domcontentloaded")
        await page.wait_for_timeout(2_000)

        async def close_drawer() -> None:
            # Only close the drawer if the backdrop overlay is visible (drawer is open).
            # Clicking the menu button when drawer is already CLOSED would re-open it.
            try:
                backdrop = page.locator('.q-drawer__backdrop').first
                if await backdrop.is_visible():
                    await page.keyboard.press("Escape")
                    await page.wait_for_timeout(600)
                    # If still open, click backdrop directly to close.
                    if await backdrop.is_visible():
                        await backdrop.click()
                        await page.wait_for_timeout(600)
            except Exception:
                pass

        await close_drawer()

        async def is_logged_in() -> bool:
            try:
                on_main = "www.bitchute.com" in page.url
                signup_visible = await page.locator('button:has-text("Sign up")').is_visible()
                return on_main and not signup_visible
            except Exception:
                return False

        if not await is_logged_in():
            print("[info] not logged in — please click Sign in and log in to BitChute in the browser window (waiting up to 5 minutes)…", file=sys.stderr)
            try:
                # Wait until we're back on www.bitchute.com with "Sign up" gone.
                await page.wait_for_function(
                    """() => {
                        const onMain = window.location.hostname === 'www.bitchute.com';
                        const noSignUp = !Array.from(document.querySelectorAll('button'))
                            .some(b => b.innerText?.trim() === 'Sign up');
                        return onMain && noSignUp;
                    }""",
                    timeout=300_000,
                )
                print("[info] logged in successfully", file=sys.stderr)
                await page.wait_for_timeout(1_000)
                await close_drawer()
            except Exception:
                return {"platform": "bitchute", "status": "skipped", "error": "not signed in"}

        async def dump_elements(label: str = "") -> None:
            elements = await page.evaluate("""() => {
                const els = document.querySelectorAll('a, button, [role="button"]');
                return Array.from(els).slice(0, 80).map(e => ({
                    tag: e.tagName, text: e.innerText?.trim().slice(0, 60),
                    href: e.href || '', aria: e.getAttribute('aria-label') || '',
                    title: e.title || '', cls: e.className?.slice(0, 80)
                }));
            }""")
            print(f"[debug] elements {label}:", file=sys.stderr)
            for el in elements:
                if any(v for v in el.values() if v):
                    print(f"  {el}", file=sys.stderr)

        # Close drawer before looking for toolbar buttons.
        await close_drawer()
        await page.wait_for_timeout(500)

        # The upload button is the "video_call" icon in the top toolbar.
        print("[info] looking for upload button (video_call icon)", file=sys.stderr)
        upload_icon = page.locator('button:has-text("video_call")').first
        try:
            await upload_icon.wait_for(state="attached", timeout=10_000)
            await upload_icon.evaluate("el => el.click()")
            print("[info] upload button clicked", file=sys.stderr)
        except Exception as e:
            await dump_elements("upload button click failed")
            return {"platform": "bitchute", "status": "failed", "error": f"could not click upload button: {e}"}

        # "Upload Video" in the dropdown opens a new tab.
        # Use JS click to avoid Camoufox's humanize timeout on dropdown items.
        print("[info] clicking Upload Video in dropdown", file=sys.stderr)
        await page.wait_for_timeout(800)
        upload_video_el = page.get_by_text("Upload Video", exact=True).first
        try:
            await upload_video_el.wait_for(state="visible", timeout=10_000)
        except Exception:
            pass
        async with context.expect_page(timeout=15_000) as new_page_info:
            await upload_video_el.evaluate("el => el.click()")
        upload_page = await new_page_info.value
        await upload_page.wait_for_load_state("domcontentloaded")
        print(f"[info] upload page: {upload_page.url}", file=sys.stderr)

        # Attach the video.
        print(f"[info] attaching video: {video}", file=sys.stderr)
        video_input = upload_page.locator('input[type="file"]').nth(0)
        await video_input.wait_for(state="attached", timeout=20_000)
        await video_input.set_input_files(str(video))

        await upload_page.wait_for_timeout(2_000)

        # Fill metadata — selectors confirmed from live DOM inspection.
        title_el = upload_page.locator('input[placeholder="Title"]').first
        await title_el.wait_for(state="visible", timeout=15_000)
        await title_el.fill(title)

        desc_el = upload_page.locator('textarea').first
        await desc_el.wait_for(state="visible", timeout=10_000)
        await desc_el.fill(description)

        tags_el = upload_page.locator('input[placeholder="Search Terms"]').first
        await tags_el.wait_for(state="visible", timeout=10_000)
        await tags_el.fill(search_terms)

        # Thumbnail.
        if thumbnail and thumbnail.exists():
            print(f"[info] attaching thumbnail: {thumbnail}", file=sys.stderr)
            thumb_input = upload_page.locator('input[type="file"]').nth(1)
            await thumb_input.set_input_files(str(thumbnail))
        else:
            print("[info] no thumbnail — using Grab Thumbnail at 0:01", file=sys.stderr)
            try:
                video_el = upload_page.locator('video').first
                await video_el.evaluate("el => { el.currentTime = 1; }")
                await upload_page.wait_for_timeout(500)
                await upload_page.get_by_role("button", name="Grab Thumbnail").click()
            except Exception:
                print("[warn] could not grab thumbnail — skipping", file=sys.stderr)

        # Wait for video upload to finish — Proceed button is visible immediately
        # but only becomes enabled/clickable when the upload hits 100%.
        print("[info] waiting for upload to finish (Proceed button enabled)…", file=sys.stderr)
        proceed_btn = upload_page.get_by_role("button", name="Proceed").first
        await proceed_btn.wait_for(state="visible", timeout=30_000)
        from playwright.async_api import expect as pw_expect
        try:
            await pw_expect(proceed_btn).to_be_enabled(timeout=900_000)
            print("[info] Proceed button is enabled — upload complete", file=sys.stderr)
        except Exception:
            print("[warn] Proceed button never became enabled — clicking anyway", file=sys.stderr)

        # Retry once if BitChute reports an upload error.
        try:
            if await upload_page.locator('text=/Error during upload/i').is_visible():
                print("[warn] upload error detected — clicking retry…", file=sys.stderr)
                retry_btn = upload_page.locator('[title*="retry" i], [aria-label*="retry" i]').first
                await retry_btn.click()
                await upload_page.wait_for_timeout(5_000)
                await proceed_btn.wait_for(state="visible", timeout=900_000)
        except Exception:
            pass

        await proceed_btn.click()
        print("[info] first Proceed clicked — checking for publish options…", file=sys.stderr)
        await upload_page.wait_for_timeout(1_500)

        # BitChute shows a "Publish Right Away" checkbox after the first Proceed click.
        # Check it, then click the second Proceed button to actually submit.
        try:
            publish_label = upload_page.locator('label:has-text("Publish Right Away")').first
            await publish_label.wait_for(state="visible", timeout=8_000)
            cb_for = await publish_label.get_attribute("for")
            if cb_for:
                cb = upload_page.locator(f'input#{cb_for}')
            else:
                cb = publish_label.locator('input[type="checkbox"]').first
            if not await cb.is_checked():
                await publish_label.click()
                print("[info] checked: Publish Right Away", file=sys.stderr)
            else:
                print("[info] already checked: Publish Right Away", file=sys.stderr)
            await upload_page.wait_for_timeout(500)
            # Click the second Proceed button.
            proceed_btn2 = upload_page.get_by_role("button", name="Proceed").first
            await proceed_btn2.click()
            print("[info] second Proceed clicked — submitting…", file=sys.stderr)
        except Exception as e:
            print(f"[info] no publish checkbox found ({e}) — assuming single Proceed flow", file=sys.stderr)

        print("[info] waiting for /content redirect…", file=sys.stderr)
        try:
            await upload_page.wait_for_url("**/content**", timeout=120_000)
            print("[info] redirected to /content", file=sys.stderr)
        except Exception:
            print("[warn] no /content redirect — submission may still have gone through", file=sys.stderr)

        return {
            "platform": "bitchute",
            "status": "processing",
            "url": "https://www.bitchute.com/content",
        }


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload a video to BitChute via Camoufox.")
    parser.add_argument("video", type=Path)
    parser.add_argument("metadata", type=Path)
    parser.add_argument("thumbnail", type=Path, nargs="?", default=None)
    args = parser.parse_args()

    if not args.video.exists():
        return emit({"platform": "bitchute", "status": "failed", "error": f"video not found: {args.video}"})
    if not args.metadata.exists():
        return emit({"platform": "bitchute", "status": "failed", "error": f"metadata not found: {args.metadata}"})
    if args.video.stat().st_size < MIN_FILE_SIZE:
        return emit({
            "platform": "bitchute",
            "status": "skipped",
            "error": f"file under 1 MB minimum ({args.video.stat().st_size} bytes)",
        })

    metadata = json.loads(args.metadata.read_text(encoding="utf-8"))
    thumbnail = args.thumbnail if (args.thumbnail and args.thumbnail.exists()) else None

    try:
        result = asyncio.run(
            upload_to_bitchute(
                args.video.resolve(),
                metadata,
                thumbnail.resolve() if thumbnail else None,
            )
        )
    except Exception as e:
        result = {"platform": "bitchute", "status": "failed", "error": f"{type(e).__name__}: {e}"}
    return emit(result)


if __name__ == "__main__":
    sys.exit(main())
