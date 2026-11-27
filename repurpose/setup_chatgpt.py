# setup_chatgpt.py — ONE-TIME setup: opens Chrome on the shared chatgpt-profile at
# chatgpt.com so Mike can log in. The session is saved in the profile (no auth file).
# Re-run only if Chrome wipes chatgpt-profile or logs you out. Python port of
# setup-chatgpt.js (2026-11-27; the JS was deleted the same day).
#
# Run: python repurpose/setup_chatgpt.py
# Sign in in the window, then just CLOSE the Chrome window; the profile keeps the session.
#
# It sends no prompt, so it starts no conversation and there is nothing to register.
# One browser per profile: do not run it while an image run has the profile open.

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool  # noqa: E402


def main():
    from playwright.sync_api import sync_playwright
    print("Launching Chrome with chatgpt-profile...")
    with sync_playwright() as p:
        ctx = pool.launch_profile(p)
        page = ctx.new_page()
        page.goto("https://chatgpt.com/")
        print("\n=================================================")
        print("Sign in to ChatGPT in the browser window if needed.")
        print("When you can see your chat list and can chat freely,")
        print("just CLOSE the Chrome window.")
        print("=================================================")
        print("\nThe session is saved automatically in chatgpt-profile.")
        print("You will not need to run this again unless Chrome wipes the profile.\n")
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
