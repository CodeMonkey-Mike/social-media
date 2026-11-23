#!/usr/bin/env python
"""
_click.py: navigate to a URL or click a control by its text, then dump the on-page controls and
screenshot. The probe used to find / operate the Audio UI. Python port of _click.js (2026-11-23).

    python _click.py "<url-or-button-text>"
"""
import sys

from _cdp import connect, run, shot, uniq


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None
    with connect() as (_browser, _ctx, page):
        if target and target.startswith("http"):
            page.goto(target, wait_until="domcontentloaded")
        elif target:
            el = page.locator(f'a:has-text("{target}"), button:has-text("{target}")').first
            el.click(timeout=8000)
        page.wait_for_timeout(2500)
        print("URL:", page.url)
        links = page.eval_on_selector_all(
            'a,button,[role="button"]',
            "els => els.map(e => (e.innerText||e.getAttribute('aria-label')||'').trim()).filter(t => t && t.length<45)")
        print("CONTROLS:", " | ".join(uniq(links)[:70]))
        shot(page, "_shot.png")
        print("saved _shot.png")


if __name__ == "__main__":
    run(main)
