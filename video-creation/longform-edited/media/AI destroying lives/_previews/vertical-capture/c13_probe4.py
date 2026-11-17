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
    for y in range(900, 5200, 350):
        pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.35)
    time.sleep(2)
    print(pg.evaluate("""()=>{const c=document.querySelector('.preview-cell'); const o=[]; c.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); o.push([e.tagName,(e.className||'').toString().slice(0,25),Math.round(r.top+scrollY),Math.round(r.bottom+scrollY),cs.fontSize,cs.lineHeight,cs.marginTop,cs.marginBottom,cs.paddingTop,cs.display, (e.children.length?'':(e.innerText||'').slice(0,30))])}); return o}"""))
    print(pg.evaluate("""()=>{const e=document.querySelector('.preview-cell'); const r=e.getBoundingClientRect(); return [r.top+scrollY,r.bottom+scrollY, e.outerHTML.slice(0,1500)]}"""))
    b.close()
