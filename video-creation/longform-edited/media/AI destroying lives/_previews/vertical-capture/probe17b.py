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
    print(pg.evaluate("""()=>{const out=[]; let e=document.elementFromPoint(195,150); while(e&&e!==document.body){const r=e.getBoundingClientRect(); out.push([e.tagName,(e.className||'').toString().slice(0,50),e.id,Math.round(r.top+scrollY),Math.round(r.height)]); e=e.parentElement} return out}"""))
    print(pg.evaluate("""()=>{const out=[];document.querySelectorAll('body *').forEach(e=>{if(e.children.length===0&&/^advertisement$/i.test((e.innerText||'').trim())){let c=e;const ch=[];while(c&&c!==document.body){const r=c.getBoundingClientRect();ch.push([c.tagName,(c.className||'').toString().slice(0,40),Math.round(r.top+scrollY),Math.round(r.height)]);c=c.parentElement} out.push(ch)}}); return out}"""))
    b.close()
