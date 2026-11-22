# _diag_x_poll.py — READ-ONLY diagnostic: find the "Add a choice" button in X's poll
# widget. Opens the composer, types a dummy word, opens the poll widget and dumps every
# button (testid / aria-label / text). NEVER clicks Post.
# (Python port of _diag-x-poll.js, 2026-11-22; the JS file is deleted.)
#
# Usage:  python scripts/_diag_x_poll.py
import json
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"

# Click the poll button via JS to bypass any overlay.
CLICK_POLL_JS = r"""
() => {
  const btns = document.querySelectorAll('[data-testid="createPollButton"]');
  (btns[btns.length - 1] || btns[0]).dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true })
  );
}
"""

BUTTONS_JS = r"""
() => [...document.querySelectorAll('button')].map(b => ({
  testid: b.getAttribute('data-testid'),
  label: b.getAttribute('aria-label'),
  text: b.innerText.trim().slice(0, 60),
})).filter(b => b.label || b.testid || b.text)
"""


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=50,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"],
            no_viewport=True,
        )
        try:
            page = browser.pages[0] if browser.pages else browser.new_page()
            page.goto("https://x.com/home")
            page.wait_for_selector('[data-testid="primaryColumn"]', timeout=20000)
            page.wait_for_timeout(2000)

            # Open composer
            page.locator('[data-testid="SideNav_NewTweet_Button"]').click()
            page.wait_for_selector('[data-testid="tweetTextarea_0"]', timeout=10000)
            page.wait_for_timeout(2000)

            # Type something first (modal intercepts clicks on a clean empty textarea)
            page.locator('[data-testid="tweetTextarea_0"]').first.click()
            page.keyboard.type("test")
            page.wait_for_timeout(500)

            page.evaluate(CLICK_POLL_JS)
            page.wait_for_selector('[data-testid="selectPollDays"]', timeout=10000)
            page.wait_for_timeout(2000)

            print("\n=== Buttons AFTER poll widget opens ===")
            btns = page.evaluate(BUTTONS_JS)
            print(json.dumps(btns, indent=2, ensure_ascii=False))

            # Look for anything that might be "add choice"
            def has(b, key, word):
                return word in (b.get(key) or "").lower()

            add_like = [b for b in btns if
                        has(b, "text", "add") or has(b, "label", "add") or has(b, "testid", "add")
                        or has(b, "testid", "choice") or has(b, "testid", "option")]
            print("\n=== Add-like buttons ===")
            print(json.dumps(add_like, indent=2, ensure_ascii=False))

            page.wait_for_timeout(3000)
        finally:
            browser.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print(f"Diagnostic failed: {err}", file=sys.stderr)
        sys.exit(1)
