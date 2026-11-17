"""C7 rebuild probe: how tall is the empty hero band, and does it follow the viewport height (vh units)?"""
from rc_lib import *
import re
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
SENT = "We are not there yet, and recursive self-improvement is not inevitable."
HERO = r"""()=>{
  const h1=document.querySelector('h1'); if(!h1) return null;
  const out=[]; let e=h1;
  while(e && e!==document.body){ const r=e.getBoundingClientRect(); const cs=getComputedStyle(e);
    out.push({tag:e.tagName,cls:(e.className||'').toString().slice(0,60),y:Math.round(r.y+scrollY),h:Math.round(r.height),minH:cs.minHeight,pad:cs.paddingTop+'/'+cs.paddingBottom}); e=e.parentElement; }
  return out; }"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    for H in (1080, 760, 560):
        ctx = b.new_context(viewport={"width": 1920, "height": H}, device_scale_factor=1, user_agent=UA, locale="en-US")
        pg = ctx.new_page()
        pg.goto(URL, wait_until="domcontentloaded", timeout=90000); time.sleep(6)
        for label in CONSENT:
            try:
                bt = pg.get_by_role("button", name=label, exact=True).first
                if bt.is_visible(timeout=300): bt.click(timeout=1500); time.sleep(1); break
            except Exception: pass
        h1 = rect_of_text(pg, "When AI builds itself"); sub = rect_of_text(pg, "Our progress toward recursive self-improvement")
        sn = rect_of_text(pg, SENT); intro = rect_of_text(pg, "For most of AI")
        print(f"--- viewport 1920x{H}: h1 y={h1 and round(h1['y'])} h={h1 and round(h1['h'])} | sub y={sub and round(sub['y'])} h={sub and round(sub['h'])} | intro y={intro and round(intro['y'])} h={intro and round(intro['h'])} | sentence-para y={sn and round(sn['y'])} h={sn and round(sn['h'])} x={sn and round(sn['x'])} w={sn and round(sn['w'])}")
        if H == 1080:
            for row in pg.evaluate(HERO)[:8]: print("   ", row)
        ctx.close()
    b.close()
