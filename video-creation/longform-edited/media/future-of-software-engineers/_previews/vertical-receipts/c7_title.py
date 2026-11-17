from vlib import *
URL = "https://www.anthropic.com/institute/recursive-self-improvement"
SECOND = "Taken far enough"
exec(open("c7_final.py", encoding="utf-8").read().split("with sync_playwright()")[0].split("FIRST =")[1].join(["FIRST =", ""]) if False else "")
PWRAP = r"""(starts)=>{const ps=[...document.querySelectorAll('article p, main p')].filter(p=>p.innerText.length>60);
  const find=(t)=>ps.find(p=>p.innerText.startsWith(t)); const r=(e)=>{const q=e.getBoundingClientRect();return {y:q.y+scrollY,h:q.height,x:q.x,w:q.width}};
  const o={}; for(const t of starts){const p=find(t); o[t]=p?r(p):null} return o}"""
HIDE_AFTER = r"""(startsOfLast)=>{const ps=[...document.querySelectorAll('article p, main p')].filter(p=>p.innerText.length>60);
  const last=ps.find(p=>p.innerText.startsWith(startsOfLast)); let el=last.parentElement; let n=0;
  while(el && el.tagName!=='ARTICLE'){ let s=el.nextElementSibling; while(s){ s.style.visibility='hidden'; n++; s=s.nextElementSibling } el=el.parentElement }
  if(el){ let s=el.nextElementSibling; while(s){ s.style.visibility='hidden'; n++; s=s.nextElementSibling } }
  return n}"""
HERO_H = 141
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=7)
    ts = now()
    pre = pg.evaluate(PWRAP, ["Taken far enough"])["Taken far enough"]; print("P2 before tweak y", round(pre["y"]))
    # hide the hero background canvas (pixel art + dot grid): it is decoration, and squeezed to a short hero it would overlap the title
    print("canvas hidden:", pg.evaluate("(()=>{const c=[...document.querySelectorAll('section[class*=hero] canvas')]; c.forEach(e=>e.style.visibility='hidden'); return c.length})()"))
    # collapse the hero to its title block (the decorative art band lies below it and is clipped away)
    ok = pg.evaluate("""(h)=>{const s=document.querySelector('section[class*=hero]'); if(!s) return null; s.style.minHeight='0'; s.style.height=h+'px'; s.style.overflow='hidden'; const r=s.getBoundingClientRect(); return [Math.round(r.y), Math.round(r.height)]}""", HERO_H)
    print("hero now", ok); time.sleep(1.0)
    pos = pg.evaluate(PWRAP, ["Taken far enough", "Using public", "For most of"])
    print({k: (round(v['y']), round(v['h'])) for k, v in pos.items()})
    hid = pg.evaluate(HIDE_AFTER, "Taken far enough"); print("hidden siblings after P2:", hid)
    p2 = pos["Taken far enough"]; p2_end = p2["y"] + p2["h"]
    print("P2 ends", round(p2_end), "| frame bottom", round(FRAME_H), "| bottom blank", round(FRAME_H - p2_end), "css px | cut lines", cuts(pg, 0))
    path = shoot_page(pg, 0, "C7-title-sentence.png", settle=2)
    print(path, margin_check(path))
    save_geo("C7-title-sentence", {"captured": ts, "clip_top_page_y": 0, "hero_height_css": HERO_H, "para2_rect_css_in_frame": {"x": p2["x"], "y": p2["y"], "w": p2["w"], "h": p2["h"]},
        "note": "hero collapsed to the title block (decorative art band clipped away) so title + sentence share one 9:16 frame; P3 onward hidden so the frame ends on a blank row"})
    b.close()
