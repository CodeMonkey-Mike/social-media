#!/usr/bin/env python
"""
_probe.py: lightweight driver / probe for the Higgsfield Audio (Seed Speech) flow. No screenshot (avoids
30 s timeouts). Python port of _probe.js (2026-11-23).

    python _probe.py                  -> dump visible controls
    python _probe.py esc              -> press Escape (dismiss popover), then dump
    python _probe.py click "<text>"   -> click the first element whose visible text is exactly <text>, then dump
"""
import sys

from _cdp import connect, run, uniq

DUMP_JS = ("els => els.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim())"
           ".filter(t => t && t.length < 60)")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else None
    with connect() as (_browser, _ctx, page):
        if cmd == "esc":
            try:
                page.keyboard.press("Escape")
            except Exception:
                pass
            page.wait_for_timeout(700)
        if cmd == "click":
            text = sys.argv[2]
            el = page.locator(f'text="{text}"').first
            try:
                el.scroll_into_view_if_needed(timeout=5000)
            except Exception:
                pass
            el.click(timeout=8000)
            page.wait_for_timeout(1500)
        print("URL:", page.url)
        links = page.eval_on_selector_all(
            'a,button,[role="button"],[role="option"],[role="menuitem"],[role="dialog"] *', DUMP_JS)
        print("CTRL:", " | ".join(uniq(links)[:90]))


if __name__ == "__main__":
    run(main)
