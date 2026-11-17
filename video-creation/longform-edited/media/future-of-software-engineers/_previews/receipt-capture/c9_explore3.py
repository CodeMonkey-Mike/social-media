from rc_lib import *
import re
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
LIST = """()=>[...document.querySelectorAll('img')].map(i=>{const r=i.getBoundingClientRect();return {y:Math.round(r.y+scrollY),x:Math.round(r.x),w:Math.round(r.width),h:Math.round(r.height),nat:[i.naturalWidth,i.naturalHeight],ok:i.complete,lazy:i.loading,alt:i.alt.slice(0,110),src:(i.currentSrc||i.src||i.dataset.src||'').slice(-75)}}).filter(o=>o.y>4500)"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto(URL, wait_until="domcontentloaded", timeout=90000); time.sleep(5)
    print("before scroll:"); [print("  ", o) for o in pg.evaluate(LIST)]
    for y in range(4400, 6600, 400):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(1.2)
    time.sleep(3)
    print("after scroll:"); [print("  ", o) for o in pg.evaluate(LIST)]
    r = rect_of_text(pg, "Bar graph titled"); print("caption/desc rect:", r and {k:r[k] for k in ("x","y","w","h","tag")}, "| text:", r and r["text"][:200])
    b.close()
