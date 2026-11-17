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
    print(pg.evaluate("""()=>{const out=[]; for(const t of ['320,500','MORE THAN 157,000']){ for(const e of document.querySelectorAll('p,h4')){ if((e.innerText||'').trim().startsWith(t)){ let c=e; const ch=[]; for(let i=0;i<7&&c&&c!==document.body;i++){const r=c.getBoundingClientRect(); const cs=getComputedStyle(c); ch.push([c.tagName,(c.className||'').toString().slice(0,30),Math.round(r.top+scrollY),Math.round(r.height),cs.backgroundColor.slice(0,22),cs.backgroundImage.slice(0,25)]); c=c.parentElement} out.push(ch); break}}} return out}"""))
    b.close()
