from vlib import *
import urllib.request
URL = "https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/"
ALT = "The Software Development Rebound Is Concentrated in Senior and AI Roles"
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=6)
    for y in range(0, 9000, 500):
        pg.evaluate("(y)=>window.scrollTo(0,y)", y); time.sleep(0.35)
    time.sleep(2)
    c = pg.evaluate("""(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); const r=i.getBoundingClientRect();
        return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height,nat:[i.naturalWidth,i.naturalHeight],src:i.currentSrc,srcset:i.srcset,sizes:i.sizes,ok:i.complete}}""", ALT)
    print(json.dumps(c, indent=1))
    # structural context: ancestors of the img
    print(pg.evaluate("""(alt)=>{const i=[...document.querySelectorAll('img')].find(i=>i.alt.includes(alt)); const out=[]; let e=i; while(e&&e.tagName!=='BODY'){const r=e.getBoundingClientRect();const cs=getComputedStyle(e);out.push([e.tagName,(e.className||'').toString().slice(0,40),Math.round(r.x),Math.round(r.width),cs.paddingLeft,cs.paddingRight,cs.borderLeftWidth,cs.overflow].join(' | '));e=e.parentElement} return out.join('\n')}""", ALT))
    # fetch the raw image bytes the page serves
    try:
        req = urllib.request.Request(c["src"], headers={"User-Agent": UA_M})
        data = urllib.request.urlopen(req, timeout=60).read()
        Path("explore2/c9-chart-native.bin").write_bytes(data)
        im = Image.open(io.BytesIO(data)).convert("RGB"); print("native image", im.size)
        im.save("explore2/c9-chart-native.png")
    except Exception as e:
        print("download failed", e)
    b.close()
