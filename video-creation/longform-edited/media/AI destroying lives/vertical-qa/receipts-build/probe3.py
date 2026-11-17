import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    pg = b.new_page(viewport={"width":1920,"height":1080})
    pg.goto("https://cryptorich.vip/showcase", wait_until="networkidle", timeout=60000)
    time.sleep(4)
    t = pg.inner_text("body")
    print("JCT" in t, "anction" in t, len(t))
    import re
    print([l for l in t.split("\n") if re.search(r"JCT|anction|JUNC", l, re.I)])
    html = pg.content()
    print("JCT" in html, "anction" in html)
    b.close()
