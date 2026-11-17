"""C10 rebuild probe: the six facts, the heading, what follows fact 6 (the Headcount chart)."""
from rc_lib import *
import re
URL = "https://digitaleconomy.stanford.edu/news/canariesaug26/"
with sync_playwright() as p:
    b, pg = open_page(p, URL, wait=7, dsf=1)
    print("title:", pg.title())
    h2 = rect_of_text(pg, "Our six main facts"); print("facts heading", h2 and {k: round(h2[k]) if isinstance(h2[k], float) else h2[k] for k in ("x", "y", "w", "h", "tag")})
    items = pg.evaluate("""(hy)=>{const out=[];for(const e of document.querySelectorAll('li, p, h2, h3, h4, figure, img, svg, canvas, iframe')){const r=e.getBoundingClientRect();const y=r.y+scrollY; if(y<hy-100||y>hy+1500||r.width<100)continue;
        out.push({tag:e.tagName,x:Math.round(r.x),y:Math.round(y),w:Math.round(r.width),h:Math.round(r.height),t:(e.innerText||e.getAttribute('alt')||'').slice(0,80).replace(/\\n/g,' ')});}return out}""", h2["y"])
    for q in items: print("  ", q, "| dy", q["y"] - round(h2["y"]))
    b.close()
