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
    for y0,y1,n in [(1100,1420,'a'),(3960,4760,'b')]:
        for yy in range(max(0,y0-600), y1, 300): pg.evaluate(f"window.scrollTo(0,{yy})"); time.sleep(0.4)
        time.sleep(3)
        im=grab(pg,y0,y1); im.resize((im.width//2,im.height//2)).save(f"_p13{n}.png")
    b.close()
