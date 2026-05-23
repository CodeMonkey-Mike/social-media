#!/usr/bin/env python3
"""
Playwright uploader for Instagram — uses real Chrome (channel="chrome").

Uses the web Create flow. For vertical 9:16 short videos, Instagram
auto-routes to the Reel flow.

Usage:
    python instagram_upload.py <video_path> <metadata_path> [thumbnail_path]

Final stdout line is a single JSON object:
    {"platform": "instagram", "status": "...", "url": "...", "error": "..."}

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

from playwright.async_api import async_playwright

PROFILE_DIR = Path.home() / ".chrome_instagram_profile"
INSTAGRAM_HOME = "https://www.instagram.com/"


def emit(result: dict) -> int:
    print(json.dumps(result))
    return 0 if result.get("status") in ("published", "processing") else 1


def build_caption(metadata: dict) -> str:
    title = (metadata.get("title") or "").strip()
    tags = [t.replace(" ", "") for t in (metadata.get("tags") or [])[:3]]
    hashtags = " ".join(f"#{t}" for t in tags if t)
    return f"{title}\n\n{hashtags}".strip() if hashtags else title


async def upload_to_instagram(video: Path, metadata: dict, thumbnail: Path | None) -> dict:
    caption = build_caption(metadata)
    visibility = (metadata.get("visibility") or "public").lower()
    if visibility == "private":
        return {
            "platform": "instagram",
            "status": "skipped",
            "error": "Instagram has no per-post privacy",
        }

    PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            channel="chrome",
            headless=False,
            viewport={"width": 1440, "height": 900},
        )
        page = context.pages[0] if context.pages else await context.new_page()

        print(f"[info] navigating to {INSTAGRAM_HOME}", file=sys.stderr)
        await page.goto(INSTAGRAM_HOME, wait_until="domcontentloaded")

        # Detect not-logged-in state: Instagram may keep you on /
        # but show the login form. Check for the Create/New post nav link.
        logged_in = await page.locator('a[href="/create/select/"]').count() > 0
        if not logged_in:
            logged_in = await page.locator('[aria-label="New post"]').count() > 0
        if not logged_in:
            print("[info] not logged in — please log in to Instagram in the browser window. Waiting up to 5 minutes…", file=sys.stderr)
            try:
                # Wait until the create/nav element appears
                await page.locator('a[href="/create/select/"], [aria-label="New post"], svg[aria-label="New post"]').first.wait_for(timeout=300_000)
            except Exception:
                await context.close()
                return {"platform": "instagram", "status": "skipped", "error": "not signed in"}

        # Click Create (plus icon) in sidebar.
        print("[info] opening Create menu", file=sys.stderr)
        create_btn = page.locator(
            'a[href="/create/select/"], [aria-label="New post"], svg[aria-label="New post"]'
        ).first
        await create_btn.wait_for(state="visible", timeout=30_000)
        await create_btn.click()

        # Submenu may show Post + Reel. Click the Post link (not the <title> tag).
        try:
            post_link = page.get_by_role("link", name="Post").first
            await post_link.wait_for(timeout=5_000)
            await post_link.click()
        except Exception:
            pass  # No submenu — already on file picker

        # File input may be hidden; wait for attached state then set files.
        print(f"[info] attaching video: {video}", file=sys.stderr)
        # Instagram embeds a hidden file input in the upload dialog
        file_input = page.locator('input[type="file"]').first
        await file_input.wait_for(state="attached", timeout=30_000)
        await file_input.set_input_files(str(video))

        # Crop step. Click Next.
        print("[info] crop step → Next", file=sys.stderr)
        next_btn = page.get_by_role("button", name="Next").first
        await next_btn.wait_for(state="visible", timeout=60_000)
        await next_btn.click()

        # Edit step. If thumbnail provided, attach it via "Select from computer"
        # in the Cover photo section. Otherwise leave default.
        if thumbnail and thumbnail.exists():
            print(f"[info] attaching custom cover: {thumbnail}", file=sys.stderr)
            cover_input = page.locator('input[type="file"][accept*="image"]').first
            try:
                await cover_input.set_input_files(str(thumbnail))
            except Exception:
                print("[warn] couldn't attach custom cover, leaving default", file=sys.stderr)
        # Click Next on edit step.
        next_btn2 = page.get_by_role("button", name="Next").first
        await next_btn2.wait_for(state="visible", timeout=30_000)
        await next_btn2.click()

        # Caption step.
        print("[info] filling caption", file=sys.stderr)
        caption_field = page.get_by_role("textbox", name="Write a caption...").first
        await caption_field.wait_for(state="visible", timeout=30_000)
        await caption_field.click()
        await page.keyboard.type(caption, delay=20)

        # Share.
        print("[info] clicking Share…", file=sys.stderr)
        share_btn = page.get_by_role("button", name="Share").first
        await share_btn.click()

        # Wait for "Reel shared" / "Post shared" confirmation.
        print("[info] waiting for share confirmation…", file=sys.stderr)
        try:
            await page.locator('text=/Reel shared|Post shared|has been shared/i').first.wait_for(timeout=180_000)
        except Exception:
            await context.close()
            return {"platform": "instagram", "status": "failed", "error": "no share confirmation seen"}

        # Capture URL by visiting the profile page and grabbing the most recent post.
        # First need the handle. Read it from the avatar / sidebar.
        try:
            handle_el = page.locator('a[href^="/"][role="link"]').first
            handle = (await handle_el.get_attribute("href") or "").strip("/").split("/")[0]
            await page.goto(f"{INSTAGRAM_HOME}{handle}/", wait_until="domcontentloaded")
            await page.wait_for_timeout(3_000)
            # First post in the grid.
            first_post = page.locator('a[href^="/p/"], a[href^="/reel/"]').first
            href = await first_post.get_attribute("href")
            url = f"https://www.instagram.com{href}" if href else ""
        except Exception:
            url = ""

        await context.close()
        return {
            "platform": "instagram",
            "status": "published",
            "url": url or "https://www.instagram.com/",
        }


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload a video to Instagram via Playwright Chromium.")
    parser.add_argument("video", type=Path)
    parser.add_argument("metadata", type=Path)
    parser.add_argument("thumbnail", type=Path, nargs="?", default=None)
    args = parser.parse_args()

    if not args.video.exists():
        return emit({"platform": "instagram", "status": "failed", "error": f"video not found: {args.video}"})
    if not args.metadata.exists():
        return emit({"platform": "instagram", "status": "failed", "error": f"metadata not found: {args.metadata}"})

    metadata = json.loads(args.metadata.read_text(encoding="utf-8"))
    thumbnail = args.thumbnail if (args.thumbnail and args.thumbnail.exists()) else None

    try:
        result = asyncio.run(upload_to_instagram(args.video.resolve(), metadata, thumbnail.resolve() if thumbnail else None))
    except Exception as e:
        result = {"platform": "instagram", "status": "failed", "error": f"{type(e).__name__}: {e}"}
    return emit(result)


if __name__ == "__main__":
    sys.exit(main())
