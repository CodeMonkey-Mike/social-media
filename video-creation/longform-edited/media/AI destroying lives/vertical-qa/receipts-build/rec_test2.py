import time, sys
from playwright.sync_api import sync_playwright
import rc, cdp_rec
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 693}, device_scale_factor=cdp_rec.DSF, is_mobile=True, has_touch=True, user_agent=rc.UA)
    pg = ctx.new_page()
    pg.goto("https://www.figure.ai/news/production-at-bmw", wait_until="domcontentloaded", timeout=90000); time.sleep(5)
    r = cdp_rec.Rec(pg, ctx, "rec/t2"); r.start(); r.sleep(4); r.stop()
    from PIL import Image
    im = Image.open(r.dir / r.frames[-1][1]); print("frame size", im.size, "n", len(r.frames))
    print(r.encode("rec/t2.mp4"))
    b.close()
