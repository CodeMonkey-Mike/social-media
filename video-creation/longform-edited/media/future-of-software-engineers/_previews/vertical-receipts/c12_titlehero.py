from vlib import *
URL = "https://www.clay.com/blog/gtm-engineering"
TAG = "Your GTM motion"
TITLE = "GTM Engineering: What It Is, How It Works, and How to Hire"

def dismiss_banner(pg):
    for attempt in range(1, 7):
        pg.mouse.click(195, 752)
        time.sleep(2.5)
        top = pg.evaluate("(()=>{const e=document.elementFromPoint(195,700);return e?e.tagName+'#'+(e.id||''):null})()")
        print("banner attempt", attempt, top)
        if not (top or "").lower().startswith("div#transcend"):
            return True
        time.sleep(2)
    return False

with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=8, consent=False)
    assert dismiss_banner(pg), "consent banner would not clear"
    ts = now()
    # force the hero (and any lazy image) to load: scroll the page, wait for network idle, then back to the top
    H = pg.evaluate("document.documentElement.scrollHeight")
    for y in range(0, min(H, 2400), 300):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.4)
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(1)
    try: pg.wait_for_load_state("networkidle", timeout=15000)
    except Exception: print("networkidle timeout (continuing)")
    flat = norm(pg.inner_text("body"))
    print("title present:", TITLE in flat, "| date present:", "Apr 21, 2026" in flat, "| authors:", "Mishti Sharma" in flat, "Varun Anand" in flat)
    # the tagline holds a real em dash: remove that line (not part of the title + date proof)
    n = pg.evaluate("""(t)=>{const els=[...document.querySelectorAll('body *')].filter(e=>e.innerText&&e.innerText.trim().startsWith(t)&&![...e.children].some(c=>c.innerText&&c.innerText.trim().startsWith(t)));
        els.forEach(e=>{e.style.display='none'}); return els.map(e=>e.tagName+':'+e.innerText.slice(0,60))}""", TAG)
    print("tagline removed:", n)
    time.sleep(1)
    hero = pg.evaluate("""()=>[...document.querySelectorAll('img')].filter(i=>{const r=i.getBoundingClientRect();return r.y+scrollY>300&&r.y+scrollY<700&&r.width>250}).map(i=>{const r=i.getBoundingClientRect();return {complete:i.complete,nat:[i.naturalWidth,i.naturalHeight],y:r.y+scrollY,h:r.height,bottom:r.y+scrollY+r.height}})""")
    print("hero:", hero)
    bad = pg.evaluate("""()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const pe=n.parentElement;if(!pe)continue;const cs=getComputedStyle(pe);if(cs.display==='none'||cs.visibility==='hidden')continue;
        if(n.textContent.includes(String.fromCharCode(8212))){const r=pe.getBoundingClientRect();if(r.y+scrollY<700&&r.height>0)out.push(n.textContent.slice(0,60))}}return out}""")
    print("em dashes visible in the frame:", bad)
    lines = pg.evaluate(LINES_JS)
    print("text lines below hero bottom (first 4, css y):", sorted(l[0] for l in lines if l[0] > hero[0]["bottom"])[:4], "| frame bottom css", FRAME_H)
    date = rect_of_text(pg, "Apr 21, 2026")
    sy, path = shoot(pg, 0, "C12-title-date.png", settle=1.5)
    print("title-date", sy, path, margin_check(path), "| date rect css", round(date["y"]), round(date["h"]))
    save_geo("C12-title-date", {"captured": ts, "scrollY": sy, "date_rect_css": date, "hero": hero,
                                "note": "v2: hero image loaded (scrolled + networkidle) and KEPT in frame; tagline line removed (real em dash); consent banner accepted"})
    b.close()
