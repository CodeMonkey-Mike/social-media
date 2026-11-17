import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from mcap import *
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, user_agent=UA, has_touch=True, locale="en-US")
    pg = ctx.new_page(); pg.goto("https://weldingworkforcedata.com", wait_until="domcontentloaded", timeout=70000); time.sleep(6)
    info = prep(pg); print(info, pg.evaluate("document.documentElement.scrollHeight"))
    for t in ["320,500","157,000","needed by 2029","approaching retirement","Explore the latest"]:
        try: print(t, find(pg,t))
        except Exception as e: print(t,"NF")
    dump(pg, 0, 6000)
    b.close()
