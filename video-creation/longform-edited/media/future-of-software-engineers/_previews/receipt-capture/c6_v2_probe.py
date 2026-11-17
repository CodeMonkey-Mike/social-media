"""C6 rebuild probe: locate the 'Operating Efficiency' heading, the paragraph, the page break and the next page's chart on the S-1."""
from rc_lib import *
import re
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
SENT = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
FIND = r"""(needle)=>{
  const norm=s=>s.replace(/\s+/g,' ');
  const out=[];
  for(const e of document.body.getElementsByTagName('*')){
    if(!norm(e.textContent).includes(needle))continue;
    let deeper=false; for(const c of e.children){ if(norm(c.textContent).includes(needle)){deeper=true;break;} }
    if(deeper)continue;
    const r=e.getBoundingClientRect();
    out.push({tag:e.tagName,x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,text:norm(e.textContent).slice(0,160)});
  } return out; }"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=2, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    r = pg.goto(U, wait_until="load", timeout=240000)
    print("status", r.status, "| title:", pg.title())
    time.sleep(8)
    s = pg.evaluate(FIND, SENT)[0]; print("sentence", s)
    for needle in ["Operating Efficiency", "Operating efficiency drives margin expansion", "Table of Contents"]:
        res = pg.evaluate(FIND, needle)
        near = [q for q in res if abs(q["y"] - s["y"]) < 1500]
        for q in near[:6]:
            print(needle, "->", {k: (round(v,1) if isinstance(v,float) else v) for k,v in q.items()}, "dy_from_sentence", round(q["y"]-s["y"],1))
    # horizontal rules / page breaks near the sentence
    hrs = pg.evaluate("""(sy)=>[...document.querySelectorAll('hr, div[style*="page-break"], [style*="break-after"], [style*="break-before"]')].map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,y:r.y+scrollY,h:r.height,x:r.x,w:r.width}}).filter(o=>Math.abs(o.y-sy)<1500)""", s["y"])
    print("breaks near:", hrs)
    b.close()
