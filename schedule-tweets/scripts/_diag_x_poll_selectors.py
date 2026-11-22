# _diag_x_poll_selectors.py — READ-ONLY diagnostic: recapture X poll-widget selectors
# (written after the selectPollDays break of 2026-06-08). Opens the composer, types a
# dummy line, then does a REAL Playwright click and a real mouse click on the Add poll
# button, screenshots each step and dumps the dialog's poll-ish nodes + innerText, so we
# can see whether the widget opens, moves, or shows an upsell. NEVER clicks Post.
# (Python port of _diag-x-poll-selectors.js, 2026-11-22; the JS file is deleted.
#  Screenshots now go to schedule-tweets/tmp/x-poll-diag/ instead of the schedule-tweets root.)
#
# Usage:  python scripts/_diag_x_poll_selectors.py
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"
DEBUG_DIR = Path(__file__).resolve().parents[1] / "tmp" / "x-poll-diag"

DUMP_JS = r"""
() => {
  const scope = document.querySelector('[role="dialog"]') ||
    document.querySelector('[data-testid="primaryColumn"]') || document.body;
  const desc = el => ({
    tag: el.tagName.toLowerCase(), testid: el.getAttribute('data-testid'),
    role: el.getAttribute('role'), label: el.getAttribute('aria-label'),
    placeholder: el.getAttribute('placeholder'), name: el.getAttribute('name'),
    type: el.getAttribute('type'), text: (el.innerText || '').trim().slice(0, 40),
  });
  const testids = {};
  scope.querySelectorAll('[data-testid]').forEach(el => {
    const t = el.getAttribute('data-testid'); testids[t] = (testids[t] || 0) + 1;
  });
  return {
    selectPollDaysExists: !!scope.querySelector('[data-testid="selectPollDays"]'),
    pollish: Object.keys(testids).filter(t => /poll|choice|option|select|duration|day|hour|minute/i.test(t)),
    selects: [...scope.querySelectorAll('select')].map(s => ({ ...desc(s), options: [...s.options].map(o => ({ value: o.value, text: o.text })) })),
    inputs: [...scope.querySelectorAll('input')].map(desc),
    roleNodes: [...scope.querySelectorAll('[role="listbox"],[role="combobox"],[role="menu"],[role="spinbutton"],[role="radiogroup"]')].map(desc),
  };
}
"""


def dump_poll(page, label):
    d = page.evaluate(DUMP_JS)
    j = lambda v: json.dumps(v, ensure_ascii=False)  # noqa: E731
    print(f"\n=== [{label}] selectPollDays? {str(d['selectPollDaysExists']).lower()} "
          f"| poll-ish: {j(d['pollish'])} ===")
    print(f"  selects: {j(d['selects'])}")
    print(f"  inputs: {j(d['inputs'])}")
    print(f"  roleNodes: {j(d['roleNodes'])}")


def shot(page, name):
    page.screenshot(path=str(DEBUG_DIR / name))


def main():
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
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
            page.wait_for_selector('[data-testid="primaryColumn"]', timeout=30000)
            page.wait_for_timeout(2000)

            page.locator('[data-testid="SideNav_NewTweet_Button"]').click()
            page.wait_for_selector('[data-testid="tweetTextarea_0"]', timeout=10000)
            page.wait_for_timeout(1500)
            page.locator('[data-testid="tweetTextarea_0"]').first.click()
            page.keyboard.type("selector recapture test")
            page.wait_for_timeout(800)

            dump_poll(page, "before click")
            shot(page, "diag-poll-1-before.png")

            # REAL Playwright click on the Add poll button.
            poll_btn = page.locator('[data-testid="createPollButton"]').first
            box = poll_btn.bounding_box()
            print("\ncreatePollButton boundingBox:", json.dumps(box))
            try:
                poll_btn.click(timeout=5000)
                print("Playwright .click() done")
            except Exception as e:
                print("Playwright .click() error:", e)
            page.wait_for_timeout(3000)
            shot(page, "diag-poll-2-after-click.png")
            dump_poll(page, "after Playwright click")

            # Try a real mouse click at coordinates too (in case .click was intercepted).
            if box:
                page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
                print("\nReal mouse click at center done")
                page.wait_for_timeout(3000)
                shot(page, "diag-poll-3-after-mouseclick.png")
                dump_poll(page, "after real mouse click")

            # Full dialog innerText (catch any upsell / "not available" message).
            dialog_text = page.evaluate(
                "() => { const d = document.querySelector('[role=\"dialog\"]'); "
                "return d ? d.innerText.slice(0, 1500) : '(no dialog)'; }")
            print("\n=== DIALOG innerText ===\n" + dialog_text)
            print(f"\nScreenshots: {DEBUG_DIR}")

            print("\nLeaving browser open 60s for manual inspection...", flush=True)
            page.wait_for_timeout(60000)
        finally:
            browser.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print(f"Diagnostic failed: {err}", file=sys.stderr)
        sys.exit(1)
