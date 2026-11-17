from vlib import *
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
UA_D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
SENT = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
FIND = r"""(needle)=>{
  const norm=s=>s.replace(/\s+/g,' ');
  for(const e of document.body.getElementsByTagName('*')){
    if(!norm(e.textContent).includes(needle))continue;
    let deeper=false; for(const c of e.children){ if(norm(c.textContent).includes(needle)){deeper=true;break;} }
    if(deeper)continue;
    const r=e.getBoundingClientRect();
    return {tag:e.tagName,x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,text:norm(e.textContent).slice(0,160)};
  } return null; }"""
with sync_playwright() as p:
    for mobile in (False,):
        b = p.chromium.launch(headless=True, channel="chrome")
        ctx = b.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=1, is_mobile=mobile, has_touch=mobile, user_agent=UA_D, locale="en-US")
        pg = ctx.new_page()
        r = pg.goto(U, wait_until="load", timeout=240000)
        print("status", r.status, "title:", pg.title()); time.sleep(8)
        print("docW", pg.evaluate("document.documentElement.scrollWidth"), "bodyW", pg.evaluate("document.body.scrollWidth"), "docH", pg.evaluate("document.documentElement.scrollHeight"))
        s = pg.evaluate(FIND, SENT); print("sentence el", s)
        # ancestor chain widths
        print(pg.evaluate("""(needle)=>{const norm=s=>s.replace(/\s+/g,' ');let el=null;for(const e of document.body.getElementsByTagName('*')){if(!norm(e.textContent).includes(needle))continue;let d=false;for(const c of e.children){if(norm(c.textContent).includes(needle)){d=true;break}}if(!d){el=e;break}}
          const out=[];while(el&&el!==document.documentElement){const cs=getComputedStyle(el);const r=el.getBoundingClientRect();out.push([el.tagName,Math.round(r.x),Math.round(r.width),cs.width,cs.minWidth,cs.maxWidth,cs.position,cs.margin.slice(0,40),cs.padding.slice(0,30)].join(' | '));el=el.parentElement}return out.join('\n')}""", SENT))
        b.close()
