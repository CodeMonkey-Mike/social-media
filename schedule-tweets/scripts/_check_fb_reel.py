# _check_fb_reel.py <url> — READ-ONLY. Opens a specific FB reel URL and dumps its
# caption text to verify identity.
# (Python port of _check-fb-reel.js, 2026-11-22; the JS file is deleted.)
#
# Usage:  python scripts/_check_fb_reel.py <reel url>
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\fbbot-profile"


def main(url):
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            CHROME_PROFILE, channel="chrome", headless=False, no_viewport=True)
        try:
            page = browser.pages[0] if browser.pages else browser.new_page()
            page.goto(url, wait_until="domcontentloaded")
            page.wait_for_timeout(6000)
            print(page.evaluate("() => document.body.innerText.slice(0, 600)"))
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python scripts/_check_fb_reel.py <reel url>", file=sys.stderr)
        sys.exit(1)
    try:
        main(sys.argv[1])
    except Exception as e:
        print(f"ERROR {e}", file=sys.stderr)
        sys.exit(1)
