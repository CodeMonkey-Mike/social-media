# check_rumble_longform.py — READ-ONLY. Lists the most recent videos on
# /account/content so we can identify a longform that was uploaded but whose
# URL-capture step got interrupted (e.g. the run was killed after "Clicked
# Upload" but before the script finished scanning for the direct link).
# (Python port of check-rumble-longform.js, 2026-11-22; the JS file is deleted.)
#
# Posts nothing, uploads nothing, writes nothing to any queue file.
#
# Usage:  python scripts/check_rumble_longform.py
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\rumblebot-profile"

VIDEOS_JS = r"""
() => {
  const out = [];
  const seen = new Set();
  for (const a of document.querySelectorAll('a[href*="/v"], a[href*="/shorts/v"]')) {
    const href = a.href.split('?')[0];
    if (!/rumble\.com\/v[a-zA-Z0-9]/.test(href)) continue;
    if (seen.has(href)) continue; seen.add(href);
    let el = a, label = '';
    for (let i = 0; i < 5 && el; i++) {
      const t = el.getAttribute && el.getAttribute('title');
      if (t) { label = t; break; }
      el = el.parentElement;
    }
    const near = (a.closest('div') || a).innerText || '';
    out.push({ href, label: label.slice(0, 100), text: near.replace(/\s+/g, ' ').trim().slice(0, 140) });
  }
  return out.slice(0, 10);
}
"""


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=30,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"],
            no_viewport=True,
        )
        page = browser.pages[0] if browser.pages else browser.new_page()
        try:
            print("=== /account/content ===")
            page.goto("https://rumble.com/account/content", wait_until="domcontentloaded")
            page.wait_for_timeout(6000)
            for i, v in enumerate(page.evaluate(VIDEOS_JS)):
                print(f"  [{i}] {v['href']}\n        label=\"{v['label']}\"\n        text=\"{v['text']}\"")
        except Exception as e:
            print(f"check error: {e}", file=sys.stderr)
        finally:
            browser.close()


if __name__ == "__main__":
    main()
