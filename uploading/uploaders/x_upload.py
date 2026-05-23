#!/usr/bin/env python3
"""
Playwright uploader for X (formerly Twitter) — uses real Chrome (channel="chrome").

Uses the compose page. Builds the post body as title + 5 hashtags, respects
the 280-char free-tier limit, and waits for "Uploaded (100%)" before
clicking Post (clicking during upload silently no-ops).

Usage:
    python x_upload.py <video_path> <metadata_path> [thumbnail_path]

(Thumbnail is ignored — X doesn't expose a custom-thumbnail UI on web.)

Final stdout line is a single JSON object:
    {"platform": "x", "status": "...", "url": "...", "error": "..."}

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

PROFILE_DIR = Path.home() / ".chrome_x_profile"
X_COMPOSE_URL = "https://x.com/compose/post"
FREE_TIER_CHAR_LIMIT = 280


def emit(result: dict) -> int:
    print(json.dumps(result))
    return 0 if result.get("status") in ("published", "processing") else 1


def build_post_body(metadata: dict) -> tuple[str, list[str]]:
    """Build X post body, dropping tags from the end if over 280 chars.

    Returns (body, dropped_tags) — dropped_tags is the list of tags that had
    to be removed to fit the free-tier limit.
    """
    title = (metadata.get("title") or "").strip()
    tags = [t.replace(" ", "") for t in (metadata.get("tags") or [])[:5]]
    dropped: list[str] = []

    while True:
        hashtags = " ".join(f"#{t}" for t in tags if t)
        body = f"{title}\n\n{hashtags}".strip() if hashtags else title
        if len(body) <= FREE_TIER_CHAR_LIMIT or not tags:
            return body, dropped
        dropped.insert(0, tags.pop())  # drop from the end


async def upload_to_x(video: Path, metadata: dict) -> dict:
    body, dropped = build_post_body(metadata)
    visibility = (metadata.get("visibility") or "public").lower()
    if visibility != "public":
        return {"platform": "x", "status": "skipped", "error": "X has no per-post privacy"}

    PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            channel="chrome",
            headless=False,
            viewport={"width": 1440, "height": 900},
        )
        page = context.pages[0] if context.pages else await context.new_page()

        print(f"[info] navigating to {X_COMPOSE_URL}", file=sys.stderr)
        await page.goto(X_COMPOSE_URL, wait_until="domcontentloaded")

        if "/i/flow/login" in page.url or "/login" in page.url:
            print("[info] not logged in, waiting up to 5 minutes…", file=sys.stderr)
            try:
                await page.wait_for_url("**/compose/post**", timeout=300_000)
            except Exception:
                await context.close()
                return {"platform": "x", "status": "skipped", "error": "not signed in"}

        # File input is hidden inside the compose modal.
        print(f"[info] attaching video: {video}", file=sys.stderr)
        file_input = page.locator('input[type="file"][accept*="video"]').first
        await file_input.wait_for(state="attached", timeout=20_000)
        await file_input.set_input_files(str(video))

        # Type post body into the contenteditable area.
        print("[info] filling post body", file=sys.stderr)
        body_field = page.get_by_role("textbox", name="Post text").first
        await body_field.click()
        await page.keyboard.type(body, delay=15)

        # CRITICAL: wait for "Uploaded (100%)" before clicking Post — clicking
        # during upload silently fails.
        print("[info] waiting for video upload to reach 100%…", file=sys.stderr)
        try:
            await page.locator('text=/Uploaded \\(100%\\)/i').first.wait_for(timeout=600_000)
        except Exception:
            print("[warn] never saw 'Uploaded (100%)' — clicking Post anyway", file=sys.stderr)

        # Click Post.
        post_btn = page.get_by_role("button", name="Post").first
        await post_btn.click()

        # URL bar updates to x.com/<handle>/status/<id> on publish.
        print("[info] waiting for post URL…", file=sys.stderr)
        try:
            await page.wait_for_url("**/status/**", timeout=60_000)
            url = page.url
        except Exception:
            url = ""

        await context.close()

        if url:
            result = {"platform": "x", "status": "published", "url": url}
            if dropped:
                result["error"] = f"dropped tags to fit 280-char limit: {dropped}"
            return result
        return {"platform": "x", "status": "failed", "error": "no post URL captured"}


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload a video to X via Playwright Chromium.")
    parser.add_argument("video", type=Path)
    parser.add_argument("metadata", type=Path)
    parser.add_argument("thumbnail", type=Path, nargs="?", default=None)  # ignored
    args = parser.parse_args()

    if not args.video.exists():
        return emit({"platform": "x", "status": "failed", "error": f"video not found: {args.video}"})
    if not args.metadata.exists():
        return emit({"platform": "x", "status": "failed", "error": f"metadata not found: {args.metadata}"})

    metadata = json.loads(args.metadata.read_text(encoding="utf-8"))

    try:
        result = asyncio.run(upload_to_x(args.video.resolve(), metadata))
    except Exception as e:
        result = {"platform": "x", "status": "failed", "error": f"{type(e).__name__}: {e}"}
    return emit(result)


if __name__ == "__main__":
    sys.exit(main())
