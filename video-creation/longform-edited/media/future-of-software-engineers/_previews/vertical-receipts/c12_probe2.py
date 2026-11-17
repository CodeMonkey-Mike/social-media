from vlib import *
URL = "https://www.clay.com/blog/gtm-engineering"
DEF = "GTM engineering is the practice of building automated revenue systems using AI, data enrichment, and workflow automation."
EX = HERE / "explore"

def dismiss_banner(pg):
    for attempt in range(1, 7):
        pg.mouse.click(195, 752); time.sleep(2.5)
        top = pg.evaluate("(()=>{const e=document.elementFromPoint(195,700);return e?e.tagName+'#'+(e.id||''):null})()")
        gone = not (top or "").lower().startswith("div#transcend")
        print(f"banner attempt {attempt}: element at (195,700) = {top}")
        if gone: return True
        time.sleep(2)
    return False

with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=8, consent=False)
    print("banner dismissed:", dismiss_banner(pg))
    sy, path = shoot(pg, 0, "c12-top-nobanner.png", outdir=EX, settle=1); print(path)
    print("hero image:", pg.evaluate("""()=>{const i=[...document.querySelectorAll('img')].filter(i=>{const r=i.getBoundingClientRect();return r.y+scrollY>400&&r.y+scrollY<700&&r.width>250}).map(i=>{const r=i.getBoundingClientRect();return [i.alt.slice(0,40),Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height)]});return JSON.stringify(i)}"""))
    print("sticky:", pg.evaluate("""()=>JSON.stringify([...document.querySelectorAll('*')].filter(e=>['fixed','sticky'].includes(getComputedStyle(e).position)).map(e=>{const r=e.getBoundingClientRect();return [e.tagName,(e.className||'').toString().slice(0,40),Math.round(r.y),Math.round(r.height),Math.round(r.width)]}).slice(0,8))"""))
    d = rect_of_text(pg, DEF); tl = rect_of_text(pg, "TL;DR"); print("TL;DR", tl, "| def", d)
    print("LI list near TL;DR:", pg.evaluate("""(y)=>JSON.stringify([...document.querySelectorAll('li')].map(l=>{const r=l.getBoundingClientRect();return [Math.round(r.y+scrollY),Math.round(r.height),l.innerText.slice(0,40)]}).filter(a=>a[0]>y-10&&a[0]<y+900))""", tl["y"]))
    print("after-list element:", pg.evaluate("""(y)=>{const els=[...document.querySelectorAll('img,figure,h2,h3')].map(e=>{const r=e.getBoundingClientRect();return [e.tagName,Math.round(r.y+scrollY),Math.round(r.height),(e.alt||e.innerText||'').slice(0,30)]}).filter(a=>a[1]>y);return JSON.stringify(els.slice(0,4))}""", tl["y"]))
    lines = pg.evaluate(LINES_JS)
    c = window_candidates(pg, int(tl["y"]) - 330, int(tl["y"]) - 60, band=60, min_blank=20, lines=lines)
    print("candidates:", c[:30])
    b.close()
