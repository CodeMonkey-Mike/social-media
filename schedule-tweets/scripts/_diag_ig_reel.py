# _diag_ig_reel.py — READ-ONLY diagnostic: click IG Create and dump all links/buttons
# that appear in the expanded sidebar (to find the Reel / Post / Story entries).
# Never selects a file, never posts.
# (Python port of _diag-ig-reel.js, 2026-11-22; the JS file is deleted.)
#
# Usage:  python scripts/_diag_ig_reel.py
import json
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile"

BUTTONS_JS = r"""
() => [...document.querySelectorAll('button, [role="button"]')].filter(b => {
  const r = b.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.height < 150;
}).map(b => ({
  tag: b.tagName,
  text: (b.innerText || b.textContent || '').trim().slice(0, 60),
  aria: b.getAttribute('aria-label'),
  href: b.getAttribute('href'),
}))
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

            page.goto("https://www.instagram.com/")
            try:
                page.wait_for_load_state("domcontentloaded", timeout=20000)
            except Exception:
                pass
            page.wait_for_timeout(2000)

            # Snapshot hrefs before clicking Create
            before_links = page.evaluate(
                "() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))")

            # Click Create
            page.locator('[aria-label="New post"]').first.click()
            page.wait_for_timeout(2500)

            # Snapshot after
            after_links = page.evaluate(
                "() => [...document.querySelectorAll('a[href]')].map(a => "
                "({ href: a.getAttribute('href'), text: a.innerText?.trim().slice(0, 60) }))")

            # Show new links
            new_links = [l for l in after_links if l["href"] not in before_links]
            print("\n=== New <a> links after Create click ===")
            print(json.dumps(new_links, indent=2, ensure_ascii=False))

            # Also dump all visible buttons
            buttons = page.evaluate(BUTTONS_JS)
            print("\n=== Visible buttons/roles after Create ===")
            print(json.dumps([b for b in buttons if b["text"] or b["aria"]],
                             indent=2, ensure_ascii=False))

            # Show the reel / create / story <a> hrefs after the click
            print("\n=== ALL <a> hrefs after Create click ===")
            for l in after_links:
                href = l.get("href")
                if href and ("reel" in href or "create" in href or "story" in href):
                    print(json.dumps(l, ensure_ascii=False))

            page.wait_for_timeout(15000)
        finally:
            browser.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print(err, file=sys.stderr)
        sys.exit(1)
