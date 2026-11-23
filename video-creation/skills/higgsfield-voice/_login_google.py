#!/usr/bin/env python
"""
_login_google.py: "Continue with Google" using the profile's PERSISTED Google session. It never types
anything: it only clicks the account row in Google's account chooser, and stops if a password is asked.
Python port of _login-google.js (2026-11-23).

    python _login_google.py "<account text>"

<account text> = any text that identifies the Google account's row in the chooser (the part of the
address before the @ is enough). Also read from HF_GOOGLE_ACCOUNT. It is an argument, not a constant,
so no address sits in this public repo.
"""
import os
import re
import sys

from _cdp import cache_path, connect, run, shot, uniq


def main():
    account = (sys.argv[1] if len(sys.argv) > 1 else os.environ.get("HF_GOOGLE_ACCOUNT") or "").strip()
    if not account or '"' in account:
        print('usage: python _login_google.py "<account text>"   (or set HF_GOOGLE_ACCOUNT)', file=sys.stderr)
        sys.exit(2)
    with connect() as (_browser, ctx, page):
        # Google's chooser opens as a popup, or (no popup within 15 s) in the same tab.
        pop = None
        clicked = False
        try:
            with ctx.expect_page(timeout=15000) as popup_info:
                page.locator('button:has-text("Continue with Google")').first.click(timeout=8000)
                clicked = True
            pop = popup_info.value
        except Exception:
            if not clicked:
                raise
        page.wait_for_timeout(4000)
        target = pop or page
        print("popup?", bool(pop), "url:", target.url)
        try:
            target.screenshot(path=str(cache_path("higgsfield-voice", "shots", "_login2.png")))
        except Exception:
            pass
        try:
            body = target.evaluate("() => document.body.innerText.slice(0, 1500)")
        except Exception:
            body = ""
        print("TEXT:", re.sub(r"\s+", " ", body)[:700])
        # Account chooser: click the row that mentions the account (never type anything).
        acct = target.locator(
            f'[data-identifier*="{account}"], div[role="link"]:has-text("{account}"), li:has-text("{account}")').first
        if acct.count():
            acct.click(timeout=8000)
            print("clicked account row")
            page.wait_for_timeout(8000)
            shot(page, "_login3.png")
            print("MAIN URL:", page.url)
            t = page.eval_on_selector_all(
                "a,button",
                "els => els.map(e => (e.innerText||'').trim()).filter(t => /^(Login|Sign up|Profile|Library)$/.test(t))")
            print("nav state:", " | ".join(uniq(t)))
        else:
            print("NO account row found (password or other prompt?) - stopping here")


if __name__ == "__main__":
    run(main)
