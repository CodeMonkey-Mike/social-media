from vlib import *
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
UA_D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
SENT = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
CHAIN = r"""(needle)=>{
  const norm=s=>s.replace(/\s+/g,' ');
  let el=null;
  for(const e of document.body.getElementsByTagName('*')){ if(!norm(e.textContent).includes(needle))continue;
    let d=false; for(const c of e.children){ if(norm(c.textContent).includes(needle)){d=true;break} } if(!d){el=e;break} }
  const out=[];
  while(el && el!==document.documentElement){ const cs=getComputedStyle(el); const r=el.getBoundingClientRect();
    out.push([el.tagName, 'x='+Math.round(r.x), 'w='+Math.round(r.width), 'css.w='+cs.width, 'minw='+cs.minWidth, 'maxw='+cs.maxWidth, cs.position, 'm='+cs.margin.slice(0,30), 'p='+cs.padding.slice(0,24), 'fs='+cs.fontSize, 'ta='+cs.textAlign, (el.getAttribute('style')||'').slice(0,90)].join(' | ')); el=el.parentElement; }
  return out.join('\n'); }"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=1, user_agent=UA_D, locale="en-US")
    pg = ctx.new_page()
    r = pg.goto(U, wait_until="load", timeout=240000); time.sleep(8)
    print(pg.evaluate(CHAIN, SENT))
    print("--- body style:", pg.evaluate("document.body.getAttribute('style')"), "| body children:", pg.evaluate("document.body.children.length"))
    print("--- meta viewport:", pg.evaluate("(document.querySelector('meta[name=viewport]')||{}).content"))
    b.close()
