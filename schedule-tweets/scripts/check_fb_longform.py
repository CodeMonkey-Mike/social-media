# check_fb_longform.py — READ-ONLY. Finds the most-recent video post on the FB
# page so we can identify the longform we just uploaded (it may have been still
# processing when the uploader captured a stale URL).
# (Python port of check-fb-longform.js, 2026-11-22; the JS file is deleted.)
#
# Posts nothing, uploads nothing, writes nothing to any queue file.
#
# Usage:  python scripts/check_fb_longform.py
import json
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\fbbot-profile"
FB_PAGE = "realCodeMonkeyMike"

# 1) Videos tab — each video link with whatever nearby title/aria text we can grab.
VIDEOS_JS = r"""
() => {
  const out = [];
  const seen = new Set();
  for (const a of document.querySelectorAll('a[href*="/videos/"], a[href*="/reel/"]')) {
    const href = a.href.split('?')[0];
    if (!/\/videos\/\d|\/reel\/\d/.test(href)) continue;
    if (seen.has(href)) continue; seen.add(href);
    // climb to a container that has visible text (title/caption)
    let el = a, label = '';
    for (let i = 0; i < 5 && el; i++) {
      const t = (el.getAttribute && el.getAttribute('aria-label')) || '';
      if (t) { label = t; break; }
      el = el.parentElement;
    }
    const near = (a.closest('[role="article"], div') || a).innerText || '';
    out.push({ href, label: label.slice(0, 80), text: near.replace(/\s+/g, ' ').trim().slice(0, 100) });
  }
  return out.slice(0, 8);
}
"""

# 2) Page feed — topmost posts (a fresh video post lands here before the /videos tab updates).
FEED_JS = r"""
() => {
  const arts = [...document.querySelectorAll('[role="article"]')].slice(0, 4);
  return arts.map(a => {
    const links = [...a.querySelectorAll('a[href]')].map(x => x.href.split('?')[0])
      .filter(h => /\/videos\/\d|\/reel\/\d|\/posts\/|story_fbid|\/permalink\//.test(h));
    const hasVideo = !!a.querySelector('video');
    return { text: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120), hasVideo,
             links: [...new Set(links)].slice(0, 4) };
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
            print("=== /videos tab ===")
            page.goto(f"https://www.facebook.com/{FB_PAGE}/videos", wait_until="domcontentloaded")
            page.wait_for_timeout(8000)
            for i, v in enumerate(page.evaluate(VIDEOS_JS)):
                print(f"  [{i}] {v['href']}\n        label=\"{v['label']}\" text=\"{v['text']}\"")

            print("\n=== page feed (top posts) ===")
            page.goto(f"https://www.facebook.com/{FB_PAGE}/", wait_until="domcontentloaded")
            page.wait_for_timeout(8000)
            for i, f in enumerate(page.evaluate(FEED_JS)):
                print(f"  [{i}] hasVideo={str(f['hasVideo']).lower()}\n        text=\"{f['text']}\"\n"
                      f"        links={json.dumps(f['links'])}")
        except Exception as e:
            print(f"check error: {e}", file=sys.stderr)
        finally:
            browser.close()


if __name__ == "__main__":
    main()
