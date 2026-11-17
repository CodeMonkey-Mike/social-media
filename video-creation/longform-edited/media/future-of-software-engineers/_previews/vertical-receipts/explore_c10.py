from vlib import *
URL = "https://digitaleconomy.stanford.edu/news/canariesaug26/"
HIRING = "The adjustment appears to operate primarily through reduced hiring of young workers rather than increased separations."
GAP = "now stands about 19% below where it would be"
HEADLINE = "No Widespread Displacement, but the AI Employment Gap for Young Workers Has Widened to 19%"
EX = HERE / "explore"
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=7)
    flat = norm(pg.inner_text("body"))
    print("title:", pg.title()); print("headline present:", HEADLINE in flat); print("reduced-hiring present:", HIRING in flat); print("19% line present:", GAP in flat)
    print("docH", pg.evaluate("document.documentElement.scrollHeight"), "scrollW", pg.evaluate("document.documentElement.scrollWidth"))
    for t in ["August 12, 2026", "Stanford Digital Economy Lab", "Our six main facts", "by Erik Brynjolfsson"]:
        print(t, "->", rect_of_text(pg, t))
    print("LIs:", pg.evaluate("""()=>JSON.stringify([...document.querySelectorAll('li')].map(l=>{const r=l.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height),l.innerText.slice(0,40)]}).filter(a=>a[2]>250&&a[2]<400).slice(0,12))"""))
    print("figures:", pg.evaluate("""()=>JSON.stringify([...document.querySelectorAll('figure')].map(f=>{const r=f.getBoundingClientRect();return [Math.round(r.y+scrollY),Math.round(r.height),f.innerText.slice(0,40)]}).slice(0,6))"""))
    print("fixed/sticky:", pg.evaluate("""()=>JSON.stringify([...document.querySelectorAll('*')].filter(e=>['fixed','sticky'].includes(getComputedStyle(e).position)).map(e=>{const r=e.getBoundingClientRect();return [e.tagName,(e.className||'').toString().slice(0,40),Math.round(r.y),Math.round(r.height),Math.round(r.width)]}).slice(0,8))"""))
    sy, path = shoot(pg, 0, "c10-top.png", outdir=EX, settle=2); print(path)
    b.close()
