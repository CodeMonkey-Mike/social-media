from vlib import *
URL = "https://www.clay.com/blog/gtm-engineering"
TAG = "Your GTM motion"


def dismiss_banner(pg):
    for attempt in range(1, 7):
        pg.mouse.click(195, 752)
        time.sleep(2.5)
        top = pg.evaluate("(()=>{const e=document.elementFromPoint(195,700);return e?e.tagName+'#'+(e.id||''):null})()")
        gone = not (top or "").lower().startswith("div#transcend")
        print("banner attempt", attempt, ": element at (195,700) =", top)
        if gone:
            return True
        time.sleep(2)
    return False


with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=8, consent=False)
    assert dismiss_banner(pg), "consent banner would not clear"
    ts = now()
    flat = norm(pg.inner_text("body"))
    print("title present:", "GTM Engineering: What It Is, How It Works, and How to Hire" in flat, "| date present:", "Apr 21, 2026" in flat)
    # the tagline holds a real em dash ("under-staffed" + em dash + "it's"): remove that line (it is not part of the title + date proof)
    n = pg.evaluate("""(t)=>{const els=[...document.querySelectorAll('body *')].filter(e=>e.innerText&&e.innerText.trim().startsWith(t)&&![...e.children].some(c=>c.innerText&&c.innerText.trim().startsWith(t)));
        els.forEach(e=>{e.style.display='none'}); return els.map(e=>e.tagName+':'+e.innerText.slice(0,60))}""", TAG)
    print("tagline removed:", n)
    # hero image would be sliced by the bottom edge: hide it so the frame ends blank
    h = pg.evaluate("""(()=>{const i=[...document.querySelectorAll('img')].filter(i=>{const r=i.getBoundingClientRect();return r.y+scrollY>300&&r.y+scrollY<700&&r.width>250}); i.forEach(e=>e.style.visibility='hidden'); return i.length})()""")
    print("hero image hidden:", h)
    time.sleep(1)
    # scan every visible text node in the frame for an em dash
    bad = pg.evaluate("""()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const pe=n.parentElement;if(!pe)continue;const cs=getComputedStyle(pe);if(cs.display==='none'||cs.visibility==='hidden')continue;
        if(n.textContent.includes(String.fromCharCode(8212))){const r=pe.getBoundingClientRect();if(r.y+scrollY<700&&r.height>0)out.push(n.textContent.slice(0,60))}}return out}""")
    print("em dashes visible in the frame:", bad)
    date = rect_of_text(pg, "Apr 21, 2026")
    sy, path = shoot(pg, 0, "C12-title-date.png", settle=1.5)
    print("title-date", sy, path, margin_check(path), "| date rect css", round(date["y"]), round(date["h"]))
    save_geo("C12-title-date", {"captured": ts, "scrollY": sy, "date_rect_css": date, "note": "tagline line removed (contains a real em dash), hero image hidden (would be sliced by the bottom edge); consent banner accepted"})
    b.close()
