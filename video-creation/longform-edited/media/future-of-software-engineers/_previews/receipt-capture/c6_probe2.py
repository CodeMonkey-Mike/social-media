from rc_lib import *
import re
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
FIND = """(needle)=>{
  const norm=s=>s.replace(/\s+/g,' ');
  let best=null;
  const all=document.body.getElementsByTagName('*');
  for(const e of all){
    if(!norm(e.textContent).includes(needle))continue;
    // deepest: no child also includes it
    let deeper=false; for(const c of e.children){ if(norm(c.textContent).includes(needle)){deeper=true;break;} }
    if(!deeper){best=e;break;}
  }
  if(!best)return null;
  const r=best.getBoundingClientRect();
  return {tag:best.tagName,x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,text:norm(best.textContent).slice(0,500)};
}"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=1, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto(U, wait_until="load", timeout=240000); time.sleep(6)
    r = pg.evaluate(FIND, "over 90% of the contributions to our codebase in September 2026 were written by Claude")
    print("rect:", r)
    pg.evaluate("(y)=>window.scrollTo(0,y)", max(0, r["y"]-350)); time.sleep(4)
    print("innerText sees it after scroll:", "contributions to our codebase" in re.sub(r"\s+"," ",pg.inner_text("body")))
    pg.screenshot(path="c6-probe-sentence.png")
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(3)
    pg.screenshot(path="c6-probe-top.png")
    print("page width info:", pg.evaluate("({sw:document.documentElement.scrollWidth, bw:document.body.getBoundingClientRect().width})"))
    b.close()
