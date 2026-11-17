from rc_lib import *
import re
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto(URL, wait_until="domcontentloaded", timeout=90000); time.sleep(6)
    imgs = pg.evaluate("""()=>[...document.querySelectorAll('img')].filter(i=>i.naturalWidth>300).map(i=>{const r=i.getBoundingClientRect();return {y:Math.round(r.y+scrollY),x:Math.round(r.x),w:Math.round(r.width),h:Math.round(r.height),nat:[i.naturalWidth,i.naturalHeight],loaded:i.complete,alt:i.alt.slice(0,170),src:i.currentSrc.slice(-70)}})""")
    for i in imgs: print(i)
    for n in ["71% of the increase in software development job postings", "Bar graph titled"]:
        r = rect_of_text(pg, n); print(n, "->", r and {k:r[k] for k in ("x","y","w","h","tag")})
    b.close()
