#!/usr/bin/env python
"""
_shot.py: quick "where am I" probe. Attach to the CDP Chrome, print URL + title, dump the nav links,
screenshot. Python port of _shot.js (2026-11-23).

    python _shot.py
"""
from _cdp import connect, run, shot, uniq


def main():
    with connect() as (_browser, _ctx, page):
        page.wait_for_timeout(1500)
        print("URL:", page.url)
        print("TITLE:", page.title())
        # dump top-level nav / link text to find the Audio section
        links = page.eval_on_selector_all(
            "a,button",
            "els => els.map(e => (e.innerText||e.getAttribute('aria-label')||'').trim()).filter(t => t && t.length<40)")
        print("NAV/LINKS:", " | ".join(uniq(links)[:60]))
        shot(page, "_shot.png", full_page=False)
        print("saved _shot.png")


if __name__ == "__main__":
    run(main)
