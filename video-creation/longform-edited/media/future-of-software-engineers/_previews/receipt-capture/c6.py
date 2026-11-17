from rc_lib import *
import re
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
SENT = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
FIND = r"""(needle)=>{
  const norm=s=>s.replace(/\s+/g,' ');
  for(const e of document.body.getElementsByTagName('*')){
    if(!norm(e.textContent).includes(needle))continue;
    let deeper=false; for(const c of e.children){ if(norm(c.textContent).includes(needle)){deeper=true;break;} }
    if(deeper)continue;
    const r=e.getBoundingClientRect();
    return {tag:e.tagName,x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,text:norm(e.textContent).slice(0,300)};
  } return null; }"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=2, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    r = pg.goto(U, wait_until="load", timeout=240000)
    print("status", r.status, "| title:", pg.title())
    time.sleep(8)
    ts = now()
    rc = pg.evaluate(FIND, SENT); print("sentence rect:", rc)
    # view 1: sentence, with the 'Operating Efficiency' heading ~100px from the top
    top = rc["y"] - 165
    pg.evaluate("(y)=>window.scrollTo(0,y)", top); time.sleep(5)
    assert "contributions to our codebase" in re.sub(r"\s+"," ",pg.inner_text("body")), "sentence not rendered"
    sy = pg.evaluate("window.scrollY")
    rc2 = pg.evaluate(FIND, SENT)
    pg.screenshot(path=str(OUT/"C6-sentence.png"))
    save_geo("C6-sentence", {"captured": ts, "scrollY": sy, "source": U, "sentence_rect_in_image_css_px": {"x": rc2["x"], "y": rc2["y"]-sy, "w": rc2["w"], "h": rc2["h"]}, "note": "sentence runs from mid-line 3 of the paragraph; filing page 136, section 'Operating Efficiency'"})
    # view 2: the cover page (top of the document)
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(4)
    pg.screenshot(path=str(OUT/"C6-cover.png"))
    save_geo("C6-cover", {"captured": ts, "source": U})
    print("captured at", ts)
    b.close()
