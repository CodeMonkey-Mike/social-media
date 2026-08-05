# _probe_send.py — pin the composer SEND button, which only renders once the box
# has content (an empty-composer dump can't see it — that's how the first live
# run failed with no_send_button). Opens the target's composer, reports any
# LEFTOVER DRAFT, types one throwaway char if empty, dumps every button in the
# overlay/messaging area, then CLEARS the box (select-all + delete) and closes.
# Sends NOTHING; ends with an empty, draft-free composer.
#
#   python linkedin-automation/skills/endorse-and-message/_probe_send.py [profileUrl]
#
# Python port of _probe-send.js (2026-08-01), 1:1 with the JS original.

import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "lib"))
import li_session as S  # noqa: E402

URL = sys.argv[1] if len(sys.argv) > 1 else "https://www.linkedin.com/in/sindhura-karnati-774349128/"

_OWNER_MSG_JS = """el => (el.innerText || '').trim() === 'Message' &&
                        !el.getAttribute('aria-label') &&
                        !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)"""

_BUTTONS_JS = """els => [...new Set(els)].map(el => ({
  tag: el.tagName.toLowerCase(),
  aria: el.getAttribute('aria-label'),
  cls: (el.getAttribute('class') || '').slice(0, 70),
  type: el.getAttribute('type'),
  disabled: el.disabled,
  text: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40),
  visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
})).filter(x => x.visible && (x.aria || x.text))"""

BOX_SEL = (
    'div.msg-form__contenteditable[contenteditable="true"], '
    'div[contenteditable="true"][aria-label*="message" i], '
    '[role="textbox"][contenteditable="true"]'
)


def main():
    pw, browser, page = S.launch_session()
    try:
        page.goto(URL, wait_until="domcontentloaded")
        S.ensure_logged_in(page)
        page.wait_for_timeout(5000)

        # The owner's Message anchor: no aria-label, exact text "Message", compose href.
        msg_btn = None
        for h in page.query_selector_all('main a[href*="/messaging/compose"], main button'):
            try:
                ok = h.evaluate(_OWNER_MSG_JS)
            except Exception:
                ok = False
            if ok:
                msg_btn = h
                break
        print(f"owner Message control found: {msg_btn is not None}")
        if msg_btn is None:
            return

        msg_btn.click()
        page.wait_for_timeout(3500)

        box = page.locator(BOX_SEL).first
        try:
            box_count = box.count()
        except Exception:
            box_count = 0
        print(f"composer box found: {bool(box_count)}")
        if not box_count:
            return

        try:
            draft = box.inner_text()
        except Exception:
            draft = ""
        draft = (draft or "").strip()
        print(f"\nLEFTOVER DRAFT ({len(draft)} chars):")
        if draft:
            print(draft[:300] + (" ...[truncated]" if len(draft) > 300 else ""))

        try:
            box.click()
        except Exception:
            pass
        page.wait_for_timeout(800)
        if not draft:
            page.keyboard.type("x")
            page.wait_for_timeout(1200)

        # NOW the Send control should exist. Dump every button anywhere near messaging.
        try:
            btns = page.eval_on_selector_all(
                "aside button, .msg-overlay-container button, .msg-convo-wrapper button, "
                'form button, footer button, div[class*="msg"] button',
                _BUTTONS_JS,
            )
        except Exception:
            btns = []
        print(f"\n--- visible buttons in messaging area, box NON-empty ({len(btns)}) ---")
        for b in btns:
            print(json.dumps(b, ensure_ascii=False))

        # Clear the box completely (removes our 'x' AND any leftover draft).
        try:
            box.click()
        except Exception:
            pass
        page.keyboard.press("Control+a")
        page.wait_for_timeout(300)
        page.keyboard.press("Delete")
        page.wait_for_timeout(800)
        try:
            after = box.inner_text()
        except Exception:
            after = ""
        after = (after or "").strip()
        print(f'\nbox after clear ({len(after)} chars): "{after[:80]}"')

        try:
            page.keyboard.press("Escape")
        except Exception:
            pass
        print("\nProbe done (nothing sent, composer cleared). Closing in 5s...")
        page.wait_for_timeout(5000)
    except Exception as e:
        print(f"PROBE ERROR: {e}", file=sys.stderr)
    finally:
        browser.close()
        pw.stop()


if __name__ == "__main__":
    main()
