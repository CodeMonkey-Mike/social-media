import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from mcap import *
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, user_agent=UA, has_touch=True, locale="en-US")
    pg = ctx.new_page(); pg.goto("https://spectrum.ieee.org/persona-ai-humanoid-robot-welding", wait_until="domcontentloaded", timeout=70000); time.sleep(5)
    info = prep(pg)
    print(pg.evaluate("document.documentElement.scrollHeight"))
    print(pg.evaluate("""()=>{const r=[];document.querySelectorAll('p').forEach(e=>{const t=e.innerText; if(/centimeter/i.test(t)){const b=e.getBoundingClientRect(); r.push([Math.round(b.top+scrollY),Math.round(b.bottom+scrollY),getComputedStyle(e).display,t.slice(0,200)])}}); return r}"""))
    print(pg.evaluate("""()=>document.body.innerText.length"""))
    try: print(find(pg,"centimeter"))
    except Exception as e: print("find fail",e)
    dump(pg, 0, 4000)
    b.close()
