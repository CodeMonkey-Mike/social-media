# _list_bitchute_content.py — READ-ONLY. Lists the channel's /content (studio)
# videos: title + url + the visible row text (status/date/views). No uploads.
# (Python port of _list-bitchute-content.js, 2026-11-22; the JS file is deleted.)
#
# Usage:  python scripts/_list_bitchute_content.py
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\bitchutebot-profile"

ROWS_JS = r"""
() => {
  const out = [];
  const seen = new Set();
  document.querySelectorAll('a[href*="/video/"]').forEach(a => {
    const m = (a.getAttribute('href') || '').match(/\/video\/([\w-]+)/);
    if (!m) return;
    const id = m[1];
    if (seen.has(id)) return;
    seen.add(id);
    // climb to a row-ish container and grab its text
    let node = a, rowText = '';
    for (let i = 0; i < 6 && node?.parentElement; i++) {
      node = node.parentElement;
      const t = (node.innerText || '').trim();
      if (t.length > rowText.length) rowText = t;
      if (rowText.length > 40) break;
    }
    out.push({ id, url: `https://www.bitchute.com/video/${id}/`,
               rowText: rowText.replace(/\s+/g, ' ').slice(0, 120) });
  });
  return out.slice(0, 12);
}
"""


def main():
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=30,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"],
            no_viewport=True,
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            page.goto("https://www.bitchute.com/content", wait_until="domcontentloaded")
            page.wait_for_timeout(4000)
            try:
                page.wait_for_function(
                    "() => document.querySelectorAll('a[href*=\"/video/\"]').length > 0",
                    timeout=20000)
            except Exception:
                pass
            rows = page.evaluate(ROWS_JS)
            print("Top /content videos (most recent first):\n")
            for i, r in enumerate(rows):
                print(f"{i + 1}. {r['id']}  {r['url']}\n     {r['rowText']}")
        except Exception as e:
            print(f"List error: {e}", file=sys.stderr)
        finally:
            ctx.close()


if __name__ == "__main__":
    main()
