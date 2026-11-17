import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from mcap import *
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, user_agent=UA, has_touch=True, locale="en-US")
    pg = ctx.new_page(); pg.goto("https://weldingworkforcedata.com", wait_until="domcontentloaded", timeout=70000); time.sleep(6)
    prep(pg)
    pg.add_style_tag(content=".et_pb_scroll_top,.et-pb-icon{display:none !important}")
    for y in range(900, 5200, 350):
        pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.35)
    time.sleep(3)
    im = grab(pg, 3700, 4680); im.save(Path(__file__).parent/"_c13pie.png"); print(im.size)
    b.close()
