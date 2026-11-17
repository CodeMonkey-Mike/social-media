import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from mcap import *
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, user_agent=UA, has_touch=True, locale="en-US")
    pg = ctx.new_page(); pg.goto("https://weldingworkforcedata.com", wait_until="domcontentloaded", timeout=70000); time.sleep(6)
    info = prep(pg)
    pg.add_style_tag(content=".et_pb_scroll_top,.et-pb-icon{display:none !important}")
    for y in range(900, 5200, 350):
        pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.35)
    time.sleep(2.5)
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(1)
    print(info)
    print(pg.evaluate("document.body.innerText.includes('320,500')"), pg.evaluate("document.body.innerText.includes('157,000')"))
    dump(pg, 0, 3600)
    print(pg.evaluate("""()=>{const o=[];document.querySelectorAll('section,.et_pb_section,.et_pb_row,.et_pb_slide').forEach(e=>{const r=e.getBoundingClientRect(); if(r.height>40) o.push([e.tagName,(e.className||'').toString().slice(0,50),Math.round(r.top+scrollY),Math.round(r.bottom+scrollY),getComputedStyle(e).backgroundColor.slice(0,20)])}); return o}"""))
    im = grab(pg, 0, 3000); im.save(Path(__file__).parent/"_c13src.png"); print(im.size)
    b.close()
