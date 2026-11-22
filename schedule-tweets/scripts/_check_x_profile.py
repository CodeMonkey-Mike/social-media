# _check_x_profile.py — READ-ONLY. Lists the most recent tweets on Mike's profile
# so we can check whether a specific short already posted before retrying.
# (Python port of _check-x-profile.js, 2026-11-22; the JS file is deleted.)
#
# Usage:  python scripts/_check_x_profile.py
import json
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"

TWEETS_JS = r"""
() => {
  const arts = [...document.querySelectorAll('article')].slice(0, 8);
  return arts.map(a => {
    const text = (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160);
    const timeEl = a.querySelector('time');
    const time = timeEl ? timeEl.getAttribute('datetime') : null;
    const linkEl = a.querySelector('a[href*="/status/"]');
    const href = linkEl ? linkEl.href : null;
    const hasVideo = !!a.querySelector('video');
    return { time, href, hasVideo, text };
  });
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
            page.goto("https://x.com/mikeneder", wait_until="domcontentloaded")
            page.wait_for_timeout(6000)
            print(json.dumps(page.evaluate(TWEETS_JS), indent=2, ensure_ascii=False))
        except Exception as e:
            print(f"check error: {e}", file=sys.stderr)
        finally:
            browser.close()


if __name__ == "__main__":
    main()
