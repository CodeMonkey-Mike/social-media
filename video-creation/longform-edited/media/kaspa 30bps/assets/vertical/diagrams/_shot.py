"""Screenshot the PORTRAIT (1080x1920) diagram states.

Same capture convention as the 16:9 set: headless Chrome, device_scale_factor=2 -> 2160x3840 PNGs.
State is driven by the URL hash (#left / #right / #base / #highlight), same as the source HTML.
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))

# (html file, hash state, output png name)
JOBS = [
    ("c4-vertical.html", "left", "c4-left-ghostdag.png"),
    ("c4-vertical.html", "right", "c4-right-dagknight.png"),
    ("d-dag-vertical.html", "base", "d-dag-base.png"),
    ("d-dag-vertical.html", "highlight", "d-dag-highlight.png"),
]

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True, channel="chrome")
    page = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=2)
    for html, state, out in JOBS:
        url = "file://" + os.path.join(HERE, html).replace("\\", "/") + "#" + state
        # about:blank between jobs: a bare hash change is a SAME-DOCUMENT navigation, so
        # goto() would NOT re-run the inline state script and every state would come out
        # identical to the first one captured. Force a full document load each time.
        page.goto("about:blank")
        page.goto(url, wait_until="networkidle", timeout=30000)
        assert page.evaluate("document.documentElement.dataset.state") == state, \
            f"state did not apply for {out}"
        page.wait_for_timeout(1800)  # webfont settle
        el = page.query_selector(".frame")
        el.screenshot(path=os.path.join(HERE, out))
        print("OK", out, state)
    b.close()
print("DONE ->", HERE)
