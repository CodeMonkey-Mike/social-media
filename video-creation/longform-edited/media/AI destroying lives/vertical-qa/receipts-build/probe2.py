import time, json
from playwright.sync_api import sync_playwright
UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":390,"height":844}, device_scale_factor=3, is_mobile=True, has_touch=True, user_agent=UA)
    pg = ctx.new_page()
    pg.goto("https://cryptorich.vip/showcase", wait_until="networkidle", timeout=60000)
    time.sleep(4)
    t = pg.inner_text("body")
    print(len(t)); print(t[:2500])
    print("JCT" in t, "Janction" in t.title())
    b.close()
