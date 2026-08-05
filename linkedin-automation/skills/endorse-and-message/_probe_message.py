# _probe_message.py — find the REAL message entry point on a 1st-degree
# connection's profile. The 2026-07 profile UI shows NO plain "Message" button on
# some top cards (only a bell + "More" + an "Introduce myself" anchor), and the
# page also carries several "Message <OTHER person>" anchors in the "More
# profiles for you" module — so this dumps, in order:
#   1. every main-content control whose aria/text mentions Message / Introduce,
#      with hrefs (to tell the owner's control from the module anchors),
#   2. the More menu's items,
# and clicks NOTHING except opening/closing More.
#
#   python linkedin-automation/skills/endorse-and-message/_probe_message.py [profileUrl]
#
# Python port of _probe-message.js (2026-08-01), 1:1 with the JS original.

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "lib"))
import li_session as S  # noqa: E402

URL = sys.argv[1] if len(sys.argv) > 1 else "https://www.linkedin.com/in/sindhura-karnati-774349128/"

_MESSAGEISH_JS = """els => els.map(el => ({
  tag: el.tagName.toLowerCase(),
  aria: el.getAttribute('aria-label'),
  href: el.getAttribute('href'),
  text: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 50),
  visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
})).filter(x => /message|introduce|msg/i.test(`${x.aria} ${x.text} ${x.href}`))"""

_MENU_JS = """els => els.map(el => ({
  tag: el.tagName.toLowerCase(),
  aria: el.getAttribute('aria-label'),
  href: el.getAttribute('href'),
  text: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 50),
}))"""


def main():
    pw, browser, page = S.launch_session()
    try:
        page.goto(URL, wait_until="domcontentloaded")
        S.ensure_logged_in(page)
        page.wait_for_timeout(5000)
        print(f"URL: {page.url}")

        try:
            dump = page.eval_on_selector_all("main button, main a", _MESSAGEISH_JS)
        except Exception:
            dump = []
        print(f"\n--- message-ish controls in main ({len(dump)}) ---")
        for d in dump:
            print(json.dumps(d, ensure_ascii=False))

        # Open the top-card More menu and dump every item.
        more = page.locator("main button:visible", has_text=re.compile(r"^More$")).first
        try:
            count = more.count()
        except Exception:
            count = 0
        print(f"\nMore button count: {count}")
        if count:
            try:
                more.click(timeout=6000)
            except Exception as e:
                print("More click failed: " + str(e).split("\n")[0])
            page.wait_for_timeout(1800)
            try:
                menu = page.eval_on_selector_all(
                    'div[role="menu"] a, div[role="menu"] button, div[role="menu"] [role="menuitem"]',
                    _MENU_JS,
                )
            except Exception:
                menu = []
            print(f"\n--- More menu items ({len(menu)}) ---")
            for m in menu:
                print(json.dumps(m, ensure_ascii=False))
            try:
                page.keyboard.press("Escape")
            except Exception:
                pass

        print("\nProbe done (nothing clicked but More). Closing in 5s...")
        page.wait_for_timeout(5000)
    except Exception as e:
        print(f"PROBE ERROR: {e}", file=sys.stderr)
    finally:
        browser.close()
        pw.stop()


if __name__ == "__main__":
    main()
