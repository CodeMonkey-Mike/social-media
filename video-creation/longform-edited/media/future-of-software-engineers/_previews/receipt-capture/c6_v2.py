"""C6-sentence rebuild (visual-qa FAIL fix).
Frame = filing page 136 at browser zoom 2x (CSS viewport 960x540, device scale 4 -> a 3840x2160 PNG, same pixel size as the
other receipts): the 'Operating Efficiency' heading + the paragraph holding the sentence + the three paragraphs below it, the
revenue-per-compute chart above and the next filing page (page break, 'Table of Contents', margin chart) both OUT of frame.
The sentence rect is stored in the 1920x1080 FRAME coordinates (= viewport css px x 2), so it reads like the other receipts' rects."""
from rc_lib import *
import re
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
SENT = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
LEAD = "Revenue per dollar of compute has expanded meaningfully"
MARGIN = 28   # white margin (viewport css px) between the frame top and the first text line
FIND = r"""(needle)=>{
  const norm=s=>s.replace(/\s+/g,' ');
  for(const e of document.body.getElementsByTagName('*')){
    if(!norm(e.textContent).includes(needle))continue;
    let deeper=false; for(const c of e.children){ if(norm(c.textContent).includes(needle)){deeper=true;break;} }
    if(deeper)continue;
    const r=e.getBoundingClientRect();
    return {tag:e.tagName,x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,text:norm(e.textContent).slice(0,200)};
  } return null; }"""
Z = 2
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 1920 // Z, "height": 1080 // Z}, device_scale_factor=2 * Z, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    r = pg.goto(U, wait_until="load", timeout=240000)
    print("status", r.status, "| title:", pg.title())
    time.sleep(8)
    ts = now()
    lead = pg.evaluate(FIND, LEAD); print("lead para", lead)
    top = int(lead["y"] - MARGIN)
    pg.evaluate("(y)=>window.scrollTo(0,y)", top); time.sleep(6)
    assert "contributions to our codebase" in re.sub(r"\s+", " ", pg.inner_text("body")), "sentence not rendered"
    sy = pg.evaluate("window.scrollY")
    s = pg.evaluate(FIND, SENT)
    head = pg.evaluate(FIND, "Operating Efficiency")
    nxt = [pg.evaluate(FIND, "Table of Contents")]
    print("scrollY", sy, "| sentence in viewport:", s["x"], s["y"] - sy, s["w"], s["h"], "| heading y", head["y"] - sy)
    pg.screenshot(path=str(OUT / "C6-sentence.png"))
    # geometry in 1920x1080 FRAME coordinates (viewport css px x Z)
    save_geo("C6-sentence", {"captured": ts, "scrollY": sy, "source": U,
        "framing": f"page 136 at browser zoom {Z}x: CSS viewport {1920//Z}x{1080//Z}, device scale {2*Z}, PNG 3840x2160",
        "sentence_rect_in_image_css_px": {"x": s["x"] * Z, "y": (s["y"] - sy) * Z, "w": s["w"] * Z, "h": s["h"] * Z},
        "heading_rect_in_image_css_px": {"x": head["x"] * Z, "y": (head["y"] - sy) * Z, "w": head["w"] * Z, "h": head["h"] * Z},
        "note": "rects are in the 1920x1080 frame (PNG pixels / 2); the sentence is one full justified line (line 3 of the paragraph, filing page 136, section 'Operating Efficiency')"})
    print("captured at", ts)
    b.close()
