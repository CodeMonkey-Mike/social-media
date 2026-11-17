import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from mcap import *
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, user_agent=UA, has_touch=True, locale="en-US")
    pg = ctx.new_page(); pg.goto("https://spectrum.ieee.org/persona-ai-humanoid-robot-welding", wait_until="domcontentloaded", timeout=70000); time.sleep(5)
    prep(pg)
    for y in range(0, 5000, 600):
        pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.2)
    time.sleep(2)
    print(pg.evaluate("""()=>{const out=[];document.querySelectorAll('body *').forEach(e=>{ if(e.children.length<3 && /Access Thousands of/i.test(e.innerText||'')){let c=e;const ch=[];while(c&&c!==document.body){const cs=getComputedStyle(c);const r=c.getBoundingClientRect();ch.push([c.tagName,(c.className||'').toString().slice(0,40),c.id,cs.position,cs.display,Math.round(r.top),Math.round(r.height)]);c=c.parentElement} out.push(ch)}}); return out}"""))
    b.close()
