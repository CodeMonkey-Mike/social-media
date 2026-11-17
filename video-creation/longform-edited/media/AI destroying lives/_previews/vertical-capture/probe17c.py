import sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from mcap import *
from playwright.sync_api import sync_playwright
Q = """()=>{const o={H:document.documentElement.scrollHeight}; for(const e of document.querySelectorAll('h1,h2,p')){const t=e.innerText; if(/Persona AI sees near-term|easily manageable centimeter|^Is Shipyard Welding/.test(t)){const r=e.getBoundingClientRect(); if(r.height>20) o[e.tagName+t.slice(0,12)]=[Math.round(r.top+scrollY),Math.round(r.bottom+scrollY)]}} return o}"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, user_agent=UA, has_touch=True, locale="en-US")
    pg = ctx.new_page(); pg.goto("https://spectrum.ieee.org/persona-ai-humanoid-robot-welding", wait_until="domcontentloaded", timeout=70000); time.sleep(5)
    prep(pg); print("after prep", pg.evaluate(Q))
    pg.evaluate("""()=>{document.querySelectorAll('.top-leader-container').forEach(e=>e.style.setProperty('display','none','important'))}""")
    time.sleep(1); print("after hide", pg.evaluate(Q))
    pg.evaluate("window.scrollTo(0,2000)"); time.sleep(1); print("after scroll", pg.evaluate(Q))
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(1); print("back", pg.evaluate(Q))
    pg.screenshot(path="_p17.png")
    b.close()
