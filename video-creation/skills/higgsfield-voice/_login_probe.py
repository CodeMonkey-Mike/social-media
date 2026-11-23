#!/usr/bin/env python
"""
_login_probe.py: open higgsfield.ai's sign-in dialog (the nav button read "Login" until 2026-11, "Get
started" since), then list its controls to find the Google button; stops before anything that needs
credentials. Python port of _login-probe.js (2026-11-23).

    python _login_probe.py
"""
from _cdp import connect, run, shot, uniq


def main():
    with connect() as (_browser, _ctx, page):
        try:
            page.keyboard.press("Escape")
        except Exception:
            pass
        page.wait_for_timeout(500)
        login = page.locator('a:has-text("Login"), button:has-text("Login"), '
                             'a:has-text("Get started"), button:has-text("Get started")').first
        login.click(timeout=8000)
        page.wait_for_timeout(3500)
        print("URL after Login click:", page.url)
        texts = page.eval_on_selector_all(
            'a,button,[role="button"]',
            "els => els.map(e => (e.innerText||e.getAttribute('aria-label')||'').trim()).filter(t => t && t.length < 60)")
        print("CONTROLS:", " | ".join(uniq(texts)[:40]))
        shot(page, "_login1.png")


if __name__ == "__main__":
    run(main)
