#!/usr/bin/env python3
"""
Instagram uploader using instagrapi (Instagram private API).
Extracts the session cookie from the saved Chrome profile via Playwright,
then uploads the video as a Reel (vertical) or post.

Usage:
    python instagram_api_upload.py <video_path> <metadata_path> [thumbnail_path]

Final stdout line is a single JSON object:
    {"platform": "instagram", "status": "...", "url": "...", "error": "..."}
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
import urllib.parse
from pathlib import Path

PROFILE_DIR = Path.home() / ".chrome_instagram_profile"


def emit(result: dict) -> int:
    print(json.dumps(result))
    return 0 if result.get("status") in ("published", "processing") else 1


def build_caption(metadata: dict) -> str:
    title = (metadata.get("title") or "").strip()
    tags = [t.replace(" ", "") for t in (metadata.get("tags") or [])[:5]]
    hashtags = " ".join(f"#{t}" for t in tags if t)
    return f"{title}\n\n{hashtags}".strip() if hashtags else title


async def get_session_id() -> str:
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            channel="chrome",
            headless=True,
        )
        page = context.pages[0] if context.pages else await context.new_page()
        await page.goto("https://www.instagram.com/", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        cookies = await context.cookies(["https://www.instagram.com"])
        await context.close()
    for c in cookies:
        if c["name"] == "sessionid":
            return urllib.parse.unquote(c["value"])
    return ""


def generate_thumbnail(video: Path) -> Path | None:
    import shutil, subprocess, tempfile
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        return None
    thumb = Path(tempfile.mktemp(suffix=".jpg"))
    try:
        subprocess.run(
            [ffmpeg, "-y", "-i", str(video), "-ss", "00:00:01", "-vframes", "1", str(thumb)],
            check=True, capture_output=True,
        )
        return thumb if thumb.exists() else None
    except Exception:
        return None


def upload(video: Path, metadata: dict, thumbnail: Path | None) -> dict:
    from instagrapi import Client
    from instagrapi.exceptions import LoginRequired, ClientError

    caption = build_caption(metadata)
    visibility = (metadata.get("visibility") or "public").lower()
    if visibility == "private":
        return {"platform": "instagram", "status": "skipped", "error": "Instagram has no per-post privacy"}

    # Get session from browser profile
    print("[info] extracting session from Chrome profile...", file=sys.stderr)
    session_id = asyncio.run(get_session_id())
    if not session_id:
        return {"platform": "instagram", "status": "skipped", "error": "no Instagram session found — run instagram_login_setup.py first"}

    print("[info] logging in via session id...", file=sys.stderr)
    cl = Client()
    cl.delay_range = [1, 3]
    try:
        cl.login_by_sessionid(session_id)
    except (LoginRequired, ClientError) as e:
        return {"platform": "instagram", "status": "failed", "error": f"login failed: {e}"}

    # Ensure we have a thumbnail (instagrapi requires one)
    thumb = thumbnail if (thumbnail and thumbnail.exists()) else generate_thumbnail(video)
    if thumb:
        print(f"[info] using thumbnail: {thumb}", file=sys.stderr)

    print(f"[info] uploading {video.name} as Reel...", file=sys.stderr)
    try:
        kwargs = {"caption": caption}
        if thumb:
            kwargs["thumbnail"] = thumb
        media = cl.clip_upload(video, **kwargs)
        url = f"https://www.instagram.com/reel/{media.code}/"
        print(f"[info] published: {url}", file=sys.stderr)
        return {"platform": "instagram", "status": "published", "url": url}
    except Exception as e:
        print(f"[warn] clip_upload failed ({e}), trying video_upload...", file=sys.stderr)
        try:
            kwargs2 = {"caption": caption}
            if thumb:
                kwargs2["thumbnail"] = thumb
            media = cl.video_upload(video, **kwargs2)
            url = f"https://www.instagram.com/p/{media.code}/"
            return {"platform": "instagram", "status": "published", "url": url}
        except Exception as e2:
            return {"platform": "instagram", "status": "failed", "error": f"{type(e2).__name__}: {e2}"}


def main() -> int:
    parser = argparse.ArgumentParser()
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

    result = upload(args.video.resolve(), metadata, thumbnail.resolve() if thumbnail else None)
    return emit(result)


if __name__ == "__main__":
    sys.exit(main())
