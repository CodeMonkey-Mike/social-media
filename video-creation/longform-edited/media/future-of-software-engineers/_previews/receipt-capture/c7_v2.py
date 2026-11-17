"""C7 rebuild (visual-qa FAIL fix):
 C7-title-sentence.png = the essay title + the intro paragraphs, bottom edge in the paragraph gap (no text sliced),
   rendered by the REAL page in a short browser window (the hero is 100vh-based, so the empty band shrinks; no DOM edit),
   then a 1920x1080 css region clipped from the page (device scale 2 -> 3840x2160).
 C7-sentence.png = the tight second crop: the whole intro column (4 paragraphs), 1024x576 css region at device scale 3.75 -> 3840x2160."""
from rc_lib import *
import re, sys
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
SENT = "We are not there yet, and recursive self-improvement is not inevitable."
VH = int(sys.argv[1]) if len(sys.argv) > 1 else 560     # browser window height used for the combined view
MARGIN_BELOW = 22

PARAS = r"""()=>{const col=[...document.querySelectorAll('main p')].filter(p=>{const r=p.getBoundingClientRect();return r.width>560&&r.width<700&&p.innerText.length>60});
  return col.slice(0,7).map(p=>{const r=p.getBoundingClientRect();return {y:r.y+scrollY,h:r.height,x:r.x,w:r.width,t:p.innerText.slice(0,48)}});}"""

def lines_cut(pg, edge_top, edge_bottom):
    L = pg.evaluate(LINES_JS)
    return [l for l in L if (l[0] < edge_top < l[1] - 1) or (l[0] < edge_bottom < l[1] - 1)]

def load(p, vh, dsf):
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 1920, "height": vh}, device_scale_factor=dsf, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    resp = pg.goto(URL, wait_until="domcontentloaded", timeout=90000); print("status", resp.status)
    time.sleep(7)
    for label in CONSENT:
        try:
            bt = pg.get_by_role("button", name=label, exact=True).first
            if bt.is_visible(timeout=400): bt.click(timeout=1500); print("consent clicked:", label); time.sleep(1); break
        except Exception: pass
    pg.evaluate("(sels)=>{for(const s of sels)document.querySelectorAll(s).forEach(e=>{try{e.remove()}catch(x){}})}", KILL)
    return b, pg

with sync_playwright() as p:
    # ---- combined view
    b, pg = load(p, VH, 2)
    ts = now()
    flat = re.sub(r"\s+", " ", pg.inner_text("body"))
    print("sentence present:", SENT in flat)
    for n in ["more than 80%", "We are not there yet"]:
        m = re.search(re.escape(n), flat)
        print(f"  [{n}] ...{flat[max(0,m.start()-120):m.end()+120]}..." if m else f"  [{n}] NOT FOUND")
    h1 = rect_of_text(pg, "When AI builds itself"); paras = pg.evaluate(PARAS)
    for q in paras: print("  para", round(q["y"]), round(q["h"]), q["t"])
    sp = [q for q in paras if SENT in re.sub(r"\s+", " ", q["t"]) or q["t"].startswith("Taken far enough")][0]
    p3 = [q for q in paras if q["t"].startswith("Using public")][0]
    p4_ = [q for q in paras if q["t"].startswith("The technical trends")][0]
    bottom = (p3["y"] + p3["h"] + p4_["y"]) / 2          # middle of the paragraph gap after P3
    T = int(round(bottom - 1080))
    print("h1", round(h1["y"]), "| chosen clip top", T, "bottom", T + 1080, "| cut lines:", lines_cut(pg, T, T + 1080))
    pg.evaluate("(y)=>window.scrollTo(0,y)", T); time.sleep(1.5)
    sy = pg.evaluate("window.scrollY"); print("scrollY now", sy)
    pg.screenshot(path=str(OUT / "C7-title-sentence.png"), full_page=True, clip={"x": 0, "y": T, "width": 1920, "height": 1080})
    sp2 = rect_of_text(pg, SENT)
    save_geo("C7-title-sentence", {"captured": ts, "layout_window": f"1920x{VH}", "clip_top_page_y": T,
        "sentence_rect_in_image_css_px": {"x": sp["x"], "y": sp["y"] - T, "w": sp["w"], "h": sp["h"],
            "note": "rect is the whole 2nd intro paragraph (starts 'Taken far enough'); the sentence is its lines 3 to 4"},
        "title_rect_in_image_css_px": {"x": h1["x"], "y": h1["y"] - T, "w": h1["w"], "h": h1["h"]}})
    b.close()
    # ---- tight crop of the intro column, native desktop layout
    b, pg = load(p, 1080, 3840 / 1088)
    paras = pg.evaluate(PARAS)
    p1 = [q for q in paras if q["t"].startswith("For most of")][0]
    sp = [q for q in paras if q["t"].startswith("Taken far enough")][0]
    p4 = [q for q in paras if q["t"].startswith("The technical trends")][0]
    cx = p1["x"] + p1["w"] / 2
    top = p1["y"] - 30; CW, CH = 1088, 612; x0 = cx - CW / 2
    print("crop: top", round(top), "bottom", round(top + CH), "| P4 ends", round(p4["y"] + p4["h"]), "| cut lines:", lines_cut(pg, top, top + CH))
    pg.evaluate("(y)=>window.scrollTo(0,y)", top); time.sleep(1.5)
    pg.screenshot(path=str(OUT / "C7-sentence.png"), full_page=True, clip={"x": x0, "y": top, "width": CW, "height": CH})
    sp2 = rect_of_text(pg, SENT)
    S = 1920 / CW
    save_geo("C7-sentence", {"captured": ts, "framing": "intro column, css region 1088x612 at device scale 3.529 (PNG 3840x2160)",
        "sentence_rect_in_image_css_px": {"x": (sp["x"] - x0) * S, "y": (sp["y"] - top) * S, "w": sp["w"] * S, "h": sp["h"] * S,
            "note": "1920x1080 frame coordinates (PNG px / 2); rect is the whole 2nd intro paragraph, the sentence is its lines 3 to 4"}})
    print("captured at", ts)
    b.close()
