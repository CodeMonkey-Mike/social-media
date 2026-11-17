from rc_lib import *
import re
URL = "https://www.clay.com/blog/gtm-engineering"
DEF = "GTM engineering is the practice of building automated revenue systems using AI, data enrichment, and workflow automation."
LINES = r"""()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){ if(!n.textContent.trim())continue; const pe=n.parentElement; if(!pe||getComputedStyle(pe).visibility==='hidden')continue;
    const r=document.createRange(); r.selectNodeContents(n);
    for(const q of r.getClientRects()){ if(q.width<2||q.height<2)continue; out.push([q.top+scrollY,q.bottom+scrollY]); } }
  return out;}"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width":1920,"height":1080}, device_scale_factor=2, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    pg.goto(URL, wait_until="domcontentloaded", timeout=90000); time.sleep(8)
    under = None
    for attempt in range(1, 7):
        pg.mouse.click(1187, 960); time.sleep(2.5)     # the real 'Accept all' button of the Transcend banner
        under = pg.evaluate("(()=>{const e=document.elementFromPoint(960,1000);return e?e.tagName+'#'+e.id:null})()")
        print(f"attempt {attempt}: element at the old banner position:", under)
        if not (under or "").startswith("DIV#transcend"):
            break
        time.sleep(3)
    assert not (under or "").startswith("DIV#transcend"), "banner still up after 6 clicks"
    ts = now()
    # view 1: top of the post: title + author + date
    meta = rect_of_text(pg, "Apr 21, 2026")
    sy = shoot_at(pg, 0, OUT / "C12-title-date.png")
    save_geo("C12-title-date", {"captured": ts, "scrollY": sy, "date_rect": meta})
    # view 2: TL;DR definition; choose a scroll so no text line is cut by the sticky nav band (0..~60px)
    tl = rect_of_text(pg, "TL;DR"); lines = pg.evaluate(LINES)
    NAV = 62; best = None
    for T in range(int(tl["y"]) - 320, int(tl["y"]) - 90):
        bad = [l for l in lines if l[1] > T and l[0] < T + NAV and not (l[0] >= T and l[1] <= T + NAV)]
        if not bad:
            best = T; break
    print("chosen scroll top:", best, "(TL;DR at", tl["y"], ")")
    sy = shoot_at(pg, best, OUT / "C12-definition.png")
    r2 = rect_of_text(pg, DEF)
    save_geo("C12-definition", {"captured": ts, "scrollY": sy, "definition_rect_in_image_css_px": {"x": r2["x"], "y": r2["y"]-sy, "w": r2["w"], "h": r2["h"]}})
    print("captured at", ts)
    b.close()
