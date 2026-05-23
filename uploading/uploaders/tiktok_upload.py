#!/usr/bin/env python3
"""
Camoufox-driven TikTok upload script.

Session approach: saves TikTok cookies to ~/.tiktok_session.json on first login,
then injects them into a fresh (non-persistent) browser on every subsequent run.
This avoids the profile-corruption hang that plagues Camoufox persistent_context
on Windows after the browser closes.

Usage:
    # First run (or when session expires): log in manually in the window
    python tiktok_upload.py <video_path> <metadata_path>

    # Subsequent runs: cookies auto-injected, no manual login needed
    python tiktok_upload.py <video_path> <metadata_path>

Final stdout line is a single JSON object:
    {"platform": "tiktok", "status": "...", "url": "...", "error": "..."}

Setup (one-time):
    pip install "camoufox[geoip]"
    camoufox fetch
"""

from __future__ import annotations

import argparse
import asyncio
import json
import random
import sys
from pathlib import Path

from camoufox.async_api import AsyncCamoufox

SESSION_FILE = Path.home() / ".tiktok_session.json"
TIKTOK_UPLOAD_URL = "https://www.tiktok.com/tiktokstudio/upload?lang=en"


def emit(result: dict) -> int:
    print(json.dumps(result))
    return 0 if result.get("status") in ("published", "processing") else 1


def build_caption(metadata: dict) -> str:
    title = (metadata.get("title") or "").strip()
    tags = [t.strip().replace(" ", "") for t in (metadata.get("tags") or [])[:3]]
    hashtags = " ".join(f"#{t}" for t in tags if t)
    return f"{title}\n\n{hashtags}".strip() if hashtags else title


async def upload_to_tiktok(video_path: Path, metadata: dict) -> dict:
    caption = build_caption(metadata)

    import tempfile, shutil

    # Use a fresh temp profile every run — avoids the addon-install hang that
    # occurs when reusing a profile after Camoufox closes it. Cookies are
    # saved/restored separately via SESSION_FILE.
    tmp_profile = Path(tempfile.mkdtemp(prefix="camoufox_tiktok_"))
    print(f"[info] using temp profile: {tmp_profile}", file=sys.stderr)

    async with AsyncCamoufox(
        persistent_context=True,
        user_data_dir=str(tmp_profile),
        headless=False,
        humanize=True,
        os=("windows",),
        i_know_what_im_doing=True,
    ) as context:
        page = context.pages[0] if context.pages else await context.new_page()
        print("[info] Camoufox opened", file=sys.stderr)

        async def pause(lo: int = 2, hi: int = 12) -> None:
            ms = random.randint(lo * 1000, hi * 1000)
            print(f"[info] waiting {ms / 1000:.1f}s…", file=sys.stderr)
            await page.wait_for_timeout(ms)

        # Inject saved session cookies if available.
        if SESSION_FILE.exists():
            try:
                cookies = json.loads(SESSION_FILE.read_text(encoding="utf-8"))
                await context.add_cookies(cookies)
                print(f"[info] injected {len(cookies)} saved cookies", file=sys.stderr)
            except Exception as e:
                print(f"[warn] couldn't load session: {e} — will re-login", file=sys.stderr)

        print(f"[info] navigating to {TIKTOK_UPLOAD_URL}", file=sys.stderr)
        await page.goto(TIKTOK_UPLOAD_URL, wait_until="load")
        await pause(3, 8)

        # Check if we're logged in (file input visible on upload page).
        needs_login = False
        try:
            await page.wait_for_selector('input[type="file"]', state="attached", timeout=10_000)
        except Exception:
            needs_login = True

        if needs_login:
            print("[info] not logged in — log in manually in the Camoufox window (waiting up to 10 min)…", file=sys.stderr)
            try:
                await page.wait_for_function(
                    """() => {
                        const url = window.location.href;
                        return url.includes('tiktok.com') &&
                               !url.includes('/login') &&
                               !url.includes('/signup') &&
                               !url.includes('/passport');
                    }""",
                    timeout=600_000,
                )
                print("[info] logged in — navigating to upload page…", file=sys.stderr)
                await pause(2, 5)
                await page.goto(TIKTOK_UPLOAD_URL, wait_until="load")
                await pause(3, 6)
                await page.wait_for_selector('input[type="file"]', state="attached", timeout=20_000)
            except Exception as e:
                return {"platform": "tiktok", "status": "skipped", "error": f"login timeout: {e}"}

            # Save session cookies for future runs.
            try:
                cookies = await context.cookies()
                tiktok_cookies = [c for c in cookies if "tiktok.com" in c.get("domain", "")]
                SESSION_FILE.write_text(json.dumps(tiktok_cookies, indent=2), encoding="utf-8")
                print(f"[info] saved {len(tiktok_cookies)} session cookies to {SESSION_FILE}", file=sys.stderr)
            except Exception as e:
                print(f"[warn] couldn't save session: {e}", file=sys.stderr)

        await pause(2, 5)

        print(f"[info] attaching video: {video_path}", file=sys.stderr)
        file_input = page.locator('input[type="file"]').first
        await file_input.set_input_files(str(video_path))

        # Composer step — the gate Camoufox is trying to clear.
        print("[info] waiting for caption composer (up to 90s)…", file=sys.stderr)
        caption_field = None
        for sel in (
            'div[contenteditable="true"][role="combobox"]',
            'div[data-text="true"]',
            'div[contenteditable="true"]',
        ):
            loc = page.locator(sel).first
            try:
                await loc.wait_for(state="visible", timeout=30_000)
                caption_field = loc
                print(f"[info] composer found via: {sel}", file=sys.stderr)
                break
            except Exception:
                continue

        if caption_field is None:
            print("[error] composer never appeared — bot detection this run", file=sys.stderr)
            await asyncio.sleep(600)
            return {"platform": "tiktok", "status": "failed", "error": "TikTok bot detection blocked the upload"}

        await pause(2, 5)

        # Dismiss onboarding overlay if present.
        try:
            overlay = page.locator('[data-test-id="overlay"]')
            await overlay.wait_for(state="visible", timeout=3_000)
            print("[info] dismissing onboarding overlay…", file=sys.stderr)
            for sel in ('button[data-action="skip"]', 'button[data-action="close"]'):
                btn = page.locator(sel)
                if await btn.is_visible():
                    await btn.click()
                    break
            else:
                await page.keyboard.press("Escape")
            await overlay.wait_for(state="hidden", timeout=5_000)
            await pause(2, 4)
        except Exception:
            pass

        print("[info] filling caption…", file=sys.stderr)
        await caption_field.evaluate("el => el.click()")
        await pause(2, 4)
        await page.keyboard.type(caption, delay=random.randint(60, 120))
        print("[info] caption typed", file=sys.stderr)

        await pause(3, 8)

        print("[info] looking for Post button…", file=sys.stderr)
        post_btn = None
        for btn_name in ("Post", "Publish"):
            candidate = page.get_by_role("button", name=btn_name).first
            try:
                await candidate.wait_for(state="visible", timeout=10_000)
                post_btn = candidate
                print(f"[info] found submit button: '{btn_name}'", file=sys.stderr)
                break
            except Exception:
                continue

        if post_btn is None:
            return {"platform": "tiktok", "status": "failed", "error": "Post button never appeared"}

        await pause(2, 6)
        await post_btn.click()
        print("[info] Post clicked", file=sys.stderr)

        # Handle optional confirmation dialog.
        await pause(2, 4)
        try:
            confirm_btn = page.get_by_role("button", name="Post").first
            await confirm_btn.wait_for(state="visible", timeout=5_000)
            print("[info] confirmation dialog — confirming…", file=sys.stderr)
            await confirm_btn.click()
            await pause(2, 4)
        except Exception:
            pass

        # Wait for success toast or redirect.
        print("[info] waiting for confirmation (up to 5 min)…", file=sys.stderr)
        confirmed = False
        try:
            await page.wait_for_selector(
                'text=/your video is being uploaded|video has been posted|posted successfully/i',
                timeout=300_000,
            )
            confirmed = True
            print("[info] success toast detected", file=sys.stderr)
        except Exception:
            try:
                await page.wait_for_url("**/tiktokstudio/content**", timeout=60_000)
                confirmed = True
                print("[info] redirected to content dashboard", file=sys.stderr)
            except Exception:
                pass

        if confirmed:
            return {
                "platform": "tiktok",
                "status": "processing",
                "url": "https://www.tiktok.com/tiktokstudio/content",
            }
        else:
            print("[warn] no confirmation seen — check the Camoufox window manually", file=sys.stderr)
            return {"platform": "tiktok", "status": "failed", "error": "no confirmation after posting"}


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload a video to TikTok via Camoufox.")
    parser.add_argument("video", type=Path)
    parser.add_argument("metadata", type=Path)
    args = parser.parse_args()

    if not args.video.exists():
        return emit({"platform": "tiktok", "status": "failed", "error": f"video not found: {args.video}"})
    if not args.metadata.exists():
        return emit({"platform": "tiktok", "status": "failed", "error": f"metadata not found: {args.metadata}"})

    metadata = json.loads(args.metadata.read_text(encoding="utf-8"))
    try:
        result = asyncio.run(upload_to_tiktok(args.video.resolve(), metadata))
    except Exception as e:
        result = {"platform": "tiktok", "status": "failed", "error": f"{type(e).__name__}: {e}"}
    return emit(result)


if __name__ == "__main__":
    sys.exit(main())
