from vlib import *
URL = "https://digitaleconomy.stanford.edu/news/canariesaug26/"
HIRING = "The adjustment appears to operate primarily through reduced hiring of young workers rather than increased separations."
GAP = "now stands about 19% below where it would be"
HEADLINE = "No Widespread Displacement, but the AI Employment Gap for Young Workers Has Widened to 19%"

HIDE_AFTER_EL = """(sel)=>{const el0=document.querySelector(sel); if(!el0) return -1; let el=el0, n=0;
  while(el && el.tagName!=='BODY'){ let s=el.nextElementSibling; while(s){ s.style.visibility='hidden'; n++; s=s.nextElementSibling } el=el.parentElement } return n}"""

with sync_playwright() as p:
    # ---------- view 1: headline + lab name + date (establish): T=0, byline kept, everything after the byline hidden so the frame ends blank
    b, ctx, pg = open_mobile(p, URL, wait=7)
    ts = now()
    flat = norm(pg.inner_text("body"))
    print("headline present:", HEADLINE in flat, "| lab + date present:", "Stanford Digital Economy Lab" in flat and "August 12, 2026" in flat)
    by = rect_of_text(pg, "by Erik Brynjolfsson")
    date = rect_of_text(pg, "August 12, 2026")
    n = pg.evaluate("""(()=>{const h=[...document.querySelectorAll('h5')].find(h=>h.innerText.startsWith('by Erik Brynjolfsson')); if(!h) return -1; let el=h,n=0;
        while(el && el.tagName!=='BODY'){ let s=el.nextElementSibling; while(s){ s.style.visibility='hidden'; n++; s=s.nextElementSibling } el=el.parentElement } return n})()""")
    print("hidden after byline:", n, "| byline ends", round(by["y"] + by["h"]), "| frame bottom", round(FRAME_H), "| bottom blank css", round(FRAME_H - by["y"] - by["h"]))
    sy, path = shoot(pg, 0, "C10-headline.png", settle=2)
    print("headline", sy, path, margin_check(path))
    save_geo("C10-headline", {"captured": ts, "scrollY": sy, "date_line_rect_css": date, "byline_rect_css": by, "note": "paragraphs after the byline hidden so the frame ends on a blank row"})
    b.close()

    # ---------- view 2: the six main facts: heading + facts 1-4 (fact 2 = the 19% line, fact 4 = reduced hiring); facts 5-6 and the rest hidden
    b, ctx, pg = open_mobile(p, URL, wait=7)
    flat = norm(pg.inner_text("body"))
    print("reduced-hiring sentence present verbatim:", HIRING in flat, "| 19% line present:", GAP in flat)
    h = rect_of_text(pg, "Our six main facts")
    lis = pg.evaluate("""(y)=>[...document.querySelectorAll('li')].map(l=>{const r=l.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,t:l.innerText.replace(/\\s+/g,' ')}}).filter(o=>o.y>y&&o.y<y+900&&o.w>300&&o.w<400)""", h["y"])
    assert len(lis) == 6, "expected 6 facts, got %d" % len(lis)
    f2 = [q for q in lis if GAP in q["t"]][0]
    f4 = [q for q in lis if HIRING in q["t"]][0]
    print("fact 2 (19% line) y", round(f2["y"]), round(f2["h"]), "| fact 4 (reduced hiring) y", round(f4["y"]), round(f4["h"]))
    # hide facts 5 and 6 and everything after the list
    n = pg.evaluate("""()=>{const all=[...document.querySelectorAll('li')]; const lis=all.filter(l=>l.innerText.startsWith('The declines are concentrated')||l.innerText.startsWith('So far, adjustment'));
        const last=all.find(l=>l.innerText.startsWith('So far, adjustment')); let el=last.parentElement, n=lis.length;
        lis.forEach(l=>l.style.visibility='hidden');
        while(el && el.tagName!=='BODY'){ let s=el.nextElementSibling; while(s){ s.style.visibility='hidden'; n++; s=s.nextElementSibling } el=el.parentElement } return n}""")
    print("hidden (facts 5-6 + after):", n)
    time.sleep(1)
    L = pg.evaluate(LINES_JS)
    f4_end = f4["y"] + f4["h"]
    # anchor the frame top in the blank gap above the heading: >= 16 css px below the last text line above it (line-box rects understate glyph extents)
    prev = max(l[1] for l in L if l[1] <= h["y"] - 1)
    T = int(prev + 16)
    assert T <= h["y"] - 25, "no room above the heading"
    print("chosen T", T, "| heading y", round(h["y"]), "| fact 4 ends", round(f4_end), "| frame bottom", round(T + FRAME_H), "| bottom blank css", round(T + FRAME_H - f4_end), "| cut lines", cuts(pg, T))
    path = shoot_page(pg, T, "C10-reduced-hiring.png", settle=2)
    print("reduced-hiring", path, margin_check(path))
    R = lambda q: {"x": q["x"], "y": q["y"] - T, "w": q["w"], "h": q["h"]}
    save_geo("C10-reduced-hiring", {"captured": ts, "clip_top_page_y": T, "fact2_19pct_rect_css_in_frame": R(f2), "fact4_reduced_hiring_rect_css_in_frame": R(f4), "heading_rect_css_in_frame": {"y": h["y"] - T, "h": h["h"]},
                                    "note": "facts 5 and 6 hidden so the frame ends on a blank row; px per css = 2.769"})
    b.close()
