# _probe_endorse.py — dump the DOM we need for the endorse-and-message skill:
#   1. the profile top-card controls (find the Message button form),
#   2. the "Show all skills" link on the profile,
#   3. the Endorse buttons on the /details/skills/ page (tag + aria + text +
#      the skill name each button belongs to),
#   4. the message composer overlay (contenteditable box + Send button),
# so we can pin selectors before writing the skill. Clicks NOTHING that endorses
# or sends — the only clicks are opening the Message overlay, then Escape.
#
#   python linkedin-automation/skills/endorse-and-message/_probe_endorse.py [profileUrl]
#
# Python port of _probe-endorse.js (2026-08-01), 1:1 with the JS original.
# Single-instance: don't run while another li-bot-profile session is open.

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "lib"))
import li_session as S  # noqa: E402

URL = sys.argv[1] if len(sys.argv) > 1 else "https://www.linkedin.com/in/sindhura-karnati-774349128/"

_CONTROLS_JS = """els => els.map(el => ({
  tag: el.tagName.toLowerCase(),
  aria: el.getAttribute('aria-label'),
  cls: (el.getAttribute('class') || '').slice(0, 60),
  text: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 60),
  visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
})).filter(x => x.aria || x.text)"""


def dump_controls(page, selector, label, max_items=60):
    try:
        items = page.eval_on_selector_all(selector, _CONTROLS_JS)
    except Exception:
        items = []
    print(f"\n--- {label} ({len(items)}) ---")
    for it in items[:max_items]:
        print(json.dumps(it, ensure_ascii=False))
    return items


_ENDORSE_JS = """els => els.filter(el => /endorse/i.test((el.innerText || '') + ' ' + (el.getAttribute('aria-label') || '')))
  .map(el => {
    const li = el.closest('li');
    return {
      tag: el.tagName.toLowerCase(),
      aria: el.getAttribute('aria-label'),
      text: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40),
      skill: li ? (li.innerText || '').split('\\n').map(s => s.trim()).filter(Boolean)[0] : null,
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
    };
  })"""

_OVERLAY_JS = """els => els.map(el => ({
  tag: el.tagName.toLowerCase(),
  cls: (el.getAttribute('class') || '').slice(0, 80),
}))"""


def main():
    pw, browser, page = S.launch_session()
    try:
        # ---- 1. profile page: top-card controls + skills-section link ----
        page.goto(URL, wait_until="domcontentloaded")
        S.ensure_logged_in(page)
        page.wait_for_timeout(4000)
        print(f"URL: {page.url}")

        dump_controls(
            page,
            'main section:first-of-type button, main section:first-of-type a[aria-label]',
            "top-card controls",
        )
        dump_controls(page, 'main a[href*="details/skills"]', 'skills-section "Show all" links')

        # ---- 2. skills details page: Endorse buttons ----
        page.goto(re.sub(r"/?$", "/", URL, count=1) + "details/skills/",
                  wait_until="domcontentloaded")
        page.wait_for_timeout(5000)
        print(f"\nSkills page URL: {page.url}")

        # Every button on the page, so we see what Endorse looks like vs everything else.
        dump_controls(page, 'main button, main a[role="button"], main a[aria-label]',
                      "ALL skills-page controls")

        # Endorse buttons specifically, with the skill name they belong to (nearest li).
        try:
            endorse = page.eval_on_selector_all("main button", _ENDORSE_JS)
        except Exception:
            endorse = []
        print(f"\n--- Endorse buttons w/ skill names ({len(endorse)}) ---")
        for e in endorse:
            print(json.dumps(e, ensure_ascii=False))

        # ---- 3. message composer: open it from the profile, dump, close ----
        page.goto(URL, wait_until="domcontentloaded")
        page.wait_for_timeout(3500)
        msg_btn = page.locator(
            'main button[aria-label*="Message" i], main a[aria-label*="Message" i]'
        ).first
        try:
            count = msg_btn.count()
        except Exception:
            count = 0
        print(f"\nMessage button count: {count}")
        if count:
            try:
                msg_btn.click(timeout=6000)
            except Exception as e:
                print("Message click failed: " + str(e).split("\n")[0])
            page.wait_for_timeout(3000)

            dump_controls(page, 'div[contenteditable="true"], [role="textbox"]',
                          "composer text boxes")
            dump_controls(page, "form button, .msg-form button, footer button",
                          "composer-area buttons")
            # The overlay container itself, for scoping.
            try:
                overlays = page.eval_on_selector_all(
                    ".msg-overlay-conversation-bubble, .msg-convo-wrapper, aside", _OVERLAY_JS
                )
            except Exception:
                overlays = []
            print(f"\n--- overlay containers ({len(overlays)}) ---")
            for o in overlays:
                print(json.dumps(o, ensure_ascii=False))

            try:
                page.keyboard.press("Escape")
            except Exception:
                pass
            page.wait_for_timeout(800)

        print("\nProbe done (nothing endorsed, nothing sent). Closing in 5s...")
        page.wait_for_timeout(5000)
    except Exception as e:
        print(f"PROBE ERROR: {e}", file=sys.stderr)
    finally:
        browser.close()
        pw.stop()


if __name__ == "__main__":
    main()
