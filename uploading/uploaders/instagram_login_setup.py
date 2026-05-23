#!/usr/bin/env python3
"""
One-time Instagram login helper.
Opens Chrome to Instagram. Log in, then the script auto-detects success and saves the session.
"""
import asyncio
from playwright.async_api import async_playwright
from pathlib import Path
import sys

PROFILE_DIR = Path.home() / ".chrome_instagram_profile"
LOGGED_IN_SELECTOR = 'a[href="/direct/inbox/"], [aria-label="New post"], svg[aria-label="New post"]'

async def main():
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Profile dir: {PROFILE_DIR}")
    print("Opening Chrome to Instagram...")
    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            channel="chrome",
            headless=False,
            viewport={"width": 1440, "height": 900},
        )
        page = context.pages[0] if context.pages else await context.new_page()
        await page.goto("https://www.instagram.com/", wait_until="domcontentloaded")

        print()
        print("="*60)
        print("  Log in to Instagram in the Chrome window.")
        print("  This script will auto-detect when you are logged in")
        print("  and save the session. Waiting up to 10 minutes...")
        print("="*60)

        # Poll every 3 seconds for up to 10 minutes
        for i in range(200):
            await asyncio.sleep(3)
            try:
                count = await page.locator(LOGGED_IN_SELECTOR).count()
                if count > 0:
                    print(f"\nLogged in detected after {i*3}s! Session saved to {PROFILE_DIR}")
                    await asyncio.sleep(2)
                    await context.close()
                    return
            except Exception:
                pass
            if i % 10 == 0:
                print(f"  [{i*3}s] still waiting for login...", flush=True)

        print("Timed out. Close Chrome and try again.")
        await context.close()

asyncio.run(main())
