from vlib import *
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
SENT = "We are not there yet, and recursive self-improvement is not inevitable."
JS = """()=>{const ps=[...document.querySelectorAll('main p, article p')].filter(p=>p.innerText.length>60);
  const f=(t)=>{const p=ps.find(p=>p.innerText.startsWith(t));if(!p)return null;const r=p.getBoundingClientRect();return [Math.round(r.y+scrollY),Math.round(r.height)]};
  const h=document.querySelector('h1').getBoundingClientRect();
  return JSON.stringify({h1:[Math.round(h.y+scrollY),Math.round(h.height)], sub:f('Our progress'), p1:f('For most of'), p2:f('Taken far enough'), p3:f('Using public'), p4:f('The technical trends'), docH:document.documentElement.scrollHeight})}"""
with sync_playwright() as p:
    for vh in (300, 420, 520, 640):
        b = p.chromium.launch(headless=True, channel="chrome")
        ctx = b.new_context(viewport={"width": VW, "height": vh}, device_scale_factor=1, is_mobile=True, has_touch=True, user_agent=UA_M, locale="en-US")
        pg = ctx.new_page(); pg.goto(URL, wait_until="domcontentloaded", timeout=90000); time.sleep(6)
        print("VH", vh, pg.evaluate(JS))
        b.close()
