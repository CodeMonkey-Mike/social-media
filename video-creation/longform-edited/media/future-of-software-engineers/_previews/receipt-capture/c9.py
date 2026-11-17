from rc_lib import *
import re
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
CHART = """()=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes('The Software Development Rebound Is Concentrated in Senior and AI Roles'));
  if(!i)return null;const r=i.getBoundingClientRect();return {y:r.y+scrollY,x:r.x,w:r.width,h:r.height,ok:i.complete&&i.naturalWidth>0,nat:[i.naturalWidth,i.naturalHeight],src:i.currentSrc}}"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=2, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto(URL, wait_until="domcontentloaded", timeout=90000); time.sleep(5)
    for y in range(4400, 6200, 400):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(1.0)
    c = pg.evaluate(CHART); print("chart:", c)
    ts = now()
    top = c["y"] + c["h"]/2 - 540
    top = nice_top(pg, top, search=250); print("C9 chosen top", top, "(chart y", c["y"], "to", c["y"]+c["h"], ")")
    pg.evaluate("(y)=>window.scrollTo(0,y)", top); time.sleep(3)
    c = pg.evaluate(CHART); assert c["ok"], "chart image not loaded"
    sy = pg.evaluate("window.scrollY")
    pg.screenshot(path=str(OUT/"C9-chart.png"))
    save_geo("C9-chart", {"captured": ts, "scrollY": sy, "chart_rect_in_image_css_px": {"x": c["x"], "y": c["y"]-sy, "w": c["w"], "h": c["h"]}, "source_png": c["src"], "native_px": c["nat"]})
    print("captured at", ts, "scrollY", sy, "chart rect in image:", c["x"], c["y"]-sy, c["w"], c["h"])
    b.close()
