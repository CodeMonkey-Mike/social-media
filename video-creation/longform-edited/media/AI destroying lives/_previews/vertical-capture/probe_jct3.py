import sys, time
sys.path.insert(0, r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\AI destroying lives\vertical-qa\receipts-build")
import rc
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://www.coingecko.com/en/coins/janction", wait=8000, scroll_through=False)
    y = rc.y_of(pg, "Janction Price Chart (JCT)")[0]
    pg.evaluate(f"window.scrollTo(0,{y-100})"); time.sleep(1.5)
    pg.get_by_role("button", name="1M", exact=True).first.click(); time.sleep(4)
    rc.unfix(pg)
    print(pg.evaluate("""()=>{const out=[]; document.querySelectorAll('canvas,svg').forEach(e=>{const r=e.getBoundingClientRect(); if(r.width>250&&r.height>150){let c=e;const ch=[];for(let i=0;i<6&&c&&c!==document.body;i++){const rr=c.getBoundingClientRect();const cs=getComputedStyle(c);ch.push([c.tagName,(c.className||'').toString().slice(0,35),Math.round(rr.top+scrollY),Math.round(rr.width),Math.round(rr.height),cs.height,cs.aspectRatio]);c=c.parentElement} out.push(ch)}}); return out}"""))
    b.close()
