from vlib import *
URL = "https://www.clay.com/blog/gtm-engineering"
exec(open("c12_titlefix.py").read().split("with sync_playwright")[0].split("TAG =")[1].join(["TAG =",""]) if False else "")
def dismiss_banner(pg):
    for attempt in range(1, 7):
        pg.mouse.click(195, 752)
        time.sleep(2.5)
        top = pg.evaluate("(()=>{const e=document.elementFromPoint(195,700);return e?e.tagName+'#'+(e.id||''):null})()")
        if not (top or "").lower().startswith("div#transcend"):
            return True
        time.sleep(2)
    return False
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=8, consent=False)
    print("banner cleared:", dismiss_banner(pg))
    # scroll through to trigger lazy loads, then back to top
    H = pg.evaluate("document.documentElement.scrollHeight")
    for y in range(0, min(H, 2400), 300):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.4)
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(1)
    try: pg.wait_for_load_state("networkidle", timeout=15000)
    except Exception as e: print("networkidle timeout")
    info = pg.evaluate("""()=>[...document.querySelectorAll('img')].filter(i=>{const r=i.getBoundingClientRect();return r.y+scrollY<1000&&r.width>150}).map(i=>{const r=i.getBoundingClientRect();return {src:(i.currentSrc||i.src).slice(0,110),complete:i.complete,nat:[i.naturalWidth,i.naturalHeight],x:r.x,y:r.y+scrollY,w:r.width,h:r.height,loading:i.loading}})""")
    for i in info: print(i)
    for t in ["GTM Engineering: What It Is","Your GTM motion","Mishti Sharma","Apr 21, 2026"]:
        r = rect_of_text(pg, t); print(t, r and [round(r[k],1) for k in 'xywh'])
    nav = pg.evaluate("""()=>{const out=[];document.querySelectorAll('header,nav,[class*=nav]').forEach(e=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();if(cs.position==='fixed'||cs.position==='sticky')out.push([e.tagName,e.className.toString().slice(0,60),cs.position,r.y,r.height])});return out}""")
    print("sticky/fixed:", nav)
    b.close()
