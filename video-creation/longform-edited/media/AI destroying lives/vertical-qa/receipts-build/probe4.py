import time, json
from playwright.sync_api import sync_playwright
UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":390,"height":844}, device_scale_factor=3, is_mobile=True, has_touch=True, user_agent=UA)
    pg = ctx.new_page()
    pg.goto("https://cryptorich.vip/showcase", wait_until="networkidle", timeout=60000)
    time.sleep(3)
    print(pg.evaluate("""() => { const t=document.querySelector('table'); const out=[]; let e=t; while(e && e!==document.documentElement){ const cs=getComputedStyle(e); const r=e.getBoundingClientRect(); out.push([e.tagName,e.className.toString().slice(0,60),Math.round(r.x),Math.round(r.width),cs.overflowX,cs.display, cs.tableLayout]); e=e.parentElement;} return out; }"""))
    print(pg.evaluate("document.querySelectorAll('table').length"))
    print(pg.evaluate("""() => { const o=[]; document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>391 && e.children.length<3) o.push([e.tagName,e.className.toString().slice(0,40),Math.round(r.right)])}); return o.slice(0,15) }"""))
    b.close()
