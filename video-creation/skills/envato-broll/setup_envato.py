#!/usr/bin/env python
"""
setup_envato.py — ONE-TIME setup: opens Chrome with the dedicated envato-profile pointed at Envato
Elements so Mike can log in. The session is saved in the profile (no auth file). Re-run only if Chrome
wipes envato-profile or logs you out. Python port of setup-envato.js (2026-09-28).

Run: python video-creation/skills/envato-broll/setup_envato.py
Sign in in the window, then just CLOSE the Chrome window; the profile keeps the session.
"""
import sys

from playwright.sync_api import sync_playwright

PROFILE_DIR = r"C:\Users\mnede\AppData\Local\Google\Chrome\envato-profile"


def main():
    print("Launching Chrome with envato-profile...")
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE_DIR, channel="chrome", headless=False,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], viewport=None)
        ctx.add_init_script("Object.defineProperty(navigator, 'webdriver', { get: () => undefined });")
        page = ctx.new_page()
        page.goto("https://elements.envato.com/")
        print("\n=================================================")
        print("Sign in to Envato Elements in the browser window.")
        print("When you are logged in (avatar visible top-right), just CLOSE the Chrome window.")
        print("The session is saved in the profile.")
        print("=================================================\n")
        try:
            ctx.wait_for_event("close", timeout=0)
        except Exception:
            pass


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Setup failed: {e}", file=sys.stderr)
        sys.exit(1)
