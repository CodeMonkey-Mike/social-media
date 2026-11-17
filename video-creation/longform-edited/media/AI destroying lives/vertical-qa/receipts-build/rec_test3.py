import time, sys, base64
from playwright.sync_api import sync_playwright
from PIL import Image
import io
import rc, cdp_rec
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 693}, device_scale_factor=1, is_mobile=True, has_touch=True, user_agent=rc.UA)
    pg = ctx.new_page()
    pg.goto("https://www.figure.ai/news/production-at-bmw", wait_until="domcontentloaded", timeout=90000); time.sleep(5)
    cdp = ctx.new_cdp_session(pg)
    # variant A: device scale factor via CDP + screencast
    for label, params in [("A_dsf", dict(width=390, height=693, deviceScaleFactor=1080/390, mobile=True)),
                          ("B_scale", dict(width=390, height=693, deviceScaleFactor=1, mobile=True, scale=1080/390))]:
        try:
            cdp.send("Emulation.setDeviceMetricsOverride", params); time.sleep(1.0)
            got = []
            cdp.on("Page.screencastFrame", lambda ev: (got.append(ev), cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})))
            cdp.send("Page.startScreencast", {"format": "png", "maxWidth": 1080, "maxHeight": 1920, "everyNthFrame": 1})
            for _ in range(60): pg.wait_for_timeout(25)
            cdp.send("Page.stopScreencast")
            if got:
                im = Image.open(io.BytesIO(base64.b64decode(got[-1]["data"]))); print(label, "screencast frame", im.size, "n", len(got), got[-1]["metadata"])
                im.save(f"rec/t3-{label}.png")
            shot = cdp.send("Page.captureScreenshot", {"format": "png"})
            im2 = Image.open(io.BytesIO(base64.b64decode(shot["data"]))); print(label, "captureScreenshot", im2.size)
        except Exception as e:
            print(label, "ERR", str(e)[:200])
    b.close()
