from vlib import *
URL = "https://www.clay.com/blog/gtm-engineering"
DEF = "GTM engineering is the practice of building automated revenue systems using AI, data enrichment, and workflow automation."
EX = HERE / "explore"
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=8, consent=False)
    flat = norm(pg.inner_text("body"))
    print("definition present:", DEF in flat)
    m = re.search(r"Clay coined the term in \d{4}", flat); print("coined:", m.group(0) if m else None)
    print("docH", pg.evaluate("document.documentElement.scrollHeight"), "scrollW", pg.evaluate("document.documentElement.scrollWidth"))
    print("banner host:", pg.evaluate("""(()=>{const e=document.getElementById('transcend-consent-manager');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()"""))
    sy, path = shoot(pg, 0, "c12-top-withbanner.png", outdir=EX, settle=1); print(path)
    for name, fn in [("date", lambda: rect_of_text(pg, "Apr 21, 2026")), ("h1", lambda: rect_of_text(pg, "GTM Engineering: What It Is")), ("tldr", lambda: rect_of_text(pg, "TL;DR")), ("def", lambda: rect_of_text(pg, DEF))]:
        print(name, fn())
    b.close()
