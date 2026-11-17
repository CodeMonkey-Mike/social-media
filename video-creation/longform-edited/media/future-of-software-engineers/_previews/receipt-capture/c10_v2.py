"""C10-reduced-hiring rebuild (visual-qa FAIL fix): the six facts, fact 2 (the 19% line) and fact 4 (reduced hiring) in one 16:9 element region
(css 1296x729 around the facts column, device scale 2.963 -> 3840x2160). The bottom edge falls under fact 6; the next chart ('Headcount Over Time...')
starts ~80 css px further down and is fully OUT of frame."""
from rc_lib import *
import re
URL = "https://digitaleconomy.stanford.edu/news/canariesaug26/"
HIRING = "The adjustment appears to operate primarily through reduced hiring of young workers rather than increased separations."
GAP = "now stands about 19% below where it would be"
W = 1296; H = 729
DSF = 3840 / W
LIS = """()=>[...document.querySelectorAll('li')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,t:e.innerText.replace(/\\s+/g,' ')}}).filter(o=>o.w>700&&o.w<900)"""
FIG = """(hy)=>{const f=[...document.querySelectorAll('figure')].find(f=>f.getBoundingClientRect().y+scrollY>hy); const r=f.getBoundingClientRect(); return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,t:f.innerText.slice(0,160)}}"""
with sync_playwright() as p:
    b, pg = open_page(p, URL, wait=7, dsf=DSF)
    ts = now()
    print("title:", pg.title())
    h2 = rect_of_text(pg, "Our six main facts"); lis = [q for q in pg.evaluate(LIS) if h2["y"] < q["y"] < h2["y"] + 800]
    fig = pg.evaluate(FIG, h2["y"]); assert len(lis) == 6, f"expected 6 facts, got {len(lis)}"
    for i, q in enumerate(lis): print(f"fact {i+1}: y={round(q['y'])} h={round(q['h'])} | {q['t'][:150]}")
    print("figure after the facts:", round(fig["y"]), "|", fig["t"][:100].replace("\n", " "))
    f2 = [q for q in lis if GAP in q["t"]][0]; f4 = [q for q in lis if HIRING in q["t"]][0]; f6 = lis[-1]
    print("fact 2 has the 19% line:", f2["t"][:200]); print("fact 4 has the reduced-hiring sentence verbatim:", HIRING in f4["t"])
    top = 1312 if abs(h2["y"] - 1340) < 6 else h2["y"] - 28
    bottom = top + H
    print("clip page-y", round(top), "->", round(bottom), "| fact 6 ends", round(f6["y"] + f6["h"]), "| figure starts", round(fig["y"]), "| cut lines:", pg.evaluate(LINES_JS) and [l for l in pg.evaluate(LINES_JS) if (l[0] < top < l[1] - 1) or (l[0] < bottom < l[1] - 1)])
    assert bottom < fig["y"], "region would reach the next chart"
    S = top - 100
    pg.evaluate("(y)=>window.scrollTo(0,y)", S); time.sleep(3)
    sy = pg.evaluate("window.scrollY")
    cx = f2["x"] + f2["w"] / 2; x0 = cx - W / 2
    pg.screenshot(path=str(OUT / "C10-reduced-hiring.png"), clip={"x": x0, "y": top - sy, "width": W, "height": H})
    F = 1920 / W
    r = lambda q: {"x": (q["x"] - x0) * F, "y": (q["y"] - top) * F, "w": q["w"] * F, "h": q["h"] * F}
    save_geo("C10-reduced-hiring", {"captured": ts, "scrollY": sy, "framing": f"element region {W}x{H} css (the six facts) at device scale {DSF:.3f}, PNG 3840x2160",
        "reduced_hiring_rect_in_image_css_px": r(f4), "gap_19_rect_in_image_css_px": r(f2), "facts_heading_rect_in_image_css_px": r(h2) if h2 else None,
        "note": "rects are the list items (fact 4 = reduced hiring, fact 2 = the 19% line) in the 1920x1080 frame (PNG px / 2)"})
    print("captured at", ts)
    b.close()
