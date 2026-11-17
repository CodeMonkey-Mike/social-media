from rc_lib import *
import re
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    r = pg.goto(URL, wait_until="domcontentloaded", timeout=90000)
    print("status", r.status, "| title:", pg.title()); time.sleep(6)
    h = pg.evaluate("document.documentElement.scrollHeight"); print("scrollHeight", h)
    # scroll through to trigger lazy iframes
    y = 0
    while y < h:
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.6); y += 700
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(2)
    flat = re.sub(r"\s+"," ", pg.inner_text("body"))
    for n in ["The Software Development Rebound Is Concentrated in Senior and AI Roles", "71%", "senior roles", "37%", "Guillermo Gallacher", "July 8, 2026", "2026"]:
        ms = list(re.finditer(re.escape(n), flat))
        print(f"[{n}] x{len(ms)}", ("..."+flat[max(0,ms[0].start()-150):ms[0].end()+200]) if ms else "")
    print("frames:"); [print("  ", f.url[:130]) for f in pg.frames]
    print("iframes:", pg.evaluate("""()=>[...document.querySelectorAll('iframe')].map(f=>{const r=f.getBoundingClientRect();return [f.src.slice(0,100),f.title,Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height)]})"""))
    print("imgs w/ chart-ish:", pg.evaluate("""()=>[...document.querySelectorAll('img')].filter(i=>i.naturalWidth>500).map(i=>[i.src.slice(0,110),i.alt.slice(0,80),Math.round(i.getBoundingClientRect().y+scrollY),i.naturalWidth,i.naturalHeight])"""))
    pg.screenshot(path="c9-explore.png", full_page=True)
    b.close()
