from vlib import *
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
SENT = "We are not there yet, and recursive self-improvement is not inevitable."
FIRST = "For most of"; SECOND = "Taken far enough"
PWRAP = r"""(starts)=>{const ps=[...document.querySelectorAll('article p, main p')].filter(p=>p.innerText.length>60);
  const find=(t)=>ps.find(p=>p.innerText.startsWith(t)); const r=(e)=>{const q=e.getBoundingClientRect();return {y:q.y+scrollY,h:q.height,x:q.x,w:q.width}};
  const o={}; for(const t of starts){const p=find(t); o[t]=p?r(p):null} return o}"""
HIDE_AFTER = r"""(startsOfLast)=>{const ps=[...document.querySelectorAll('article p, main p')].filter(p=>p.innerText.length>60);
  const last=ps.find(p=>p.innerText.startsWith(startsOfLast)); let el=last.parentElement; let n=0;
  // hide every following sibling of the last kept paragraph's wrapper, then climb and do the same for each ancestor up to ARTICLE
  while(el && el.tagName!=='ARTICLE'){ let s=el.nextElementSibling; while(s){ s.style.visibility='hidden'; n++; s=s.nextElementSibling } el=el.parentElement }
  if(el){ let s=el.nextElementSibling; while(s){ s.style.visibility='hidden'; n++; s=s.nextElementSibling } }
  return n}"""
with sync_playwright() as p:
    # ---------- view B first: C7-sentence (tight: P1..P3, sentence mid-frame), untouched layout except P4+ hidden
    b, ctx, pg = open_mobile(p, URL, wait=7)
    ts = now()
    flat = norm(pg.inner_text("body"))
    print("sentence present:", SENT in flat)
    for n in ["more than 80%", "low single digits", "We are not there yet"]:
        m = re.search(re.escape(n), flat); print(f"  [{n}]", "FOUND" if m else "NOT FOUND")
    pos = pg.evaluate(PWRAP, [FIRST, SECOND, "Using public", "The technical trends"]); print("paragraphs", {k: (round(v['y']), round(v['h'])) for k, v in pos.items()})
    hid = pg.evaluate(HIDE_AFTER, "Using public"); print("hidden siblings after P3:", hid)
    p3 = pos["Using public"]; p3_end = p3["y"] + p3["h"]
    T = int(round(p3_end + 44 - FRAME_H))      # frame ends 44 css px below P3
    T = max(T, 850)                            # never show the hero band (article starts at 848)
    print("T", T, "frame bottom", round(T + FRAME_H), "| P3 ends", round(p3_end), "| bottom blank", round(T + FRAME_H - p3_end), "css px | cut lines", cuts(pg, T))
    path = shoot_page(pg, T, "C7-sentence.png", settle=2)
    print(path, margin_check(path))
    sp = pg.evaluate(PWRAP, [SECOND])[SECOND]
    save_geo("C7-sentence", {"captured": ts, "clip_top_page_y": T, "frame": "390x693.33 css -> 1080x1920", "para2_rect_css_in_frame": {"x": sp["x"], "y": sp["y"] - T, "w": sp["w"], "h": sp["h"]},
                             "note": "P2 holds the sentence (lines ~5-7); P4 onward hidden so the frame ends on a blank row"})
    b.close()
