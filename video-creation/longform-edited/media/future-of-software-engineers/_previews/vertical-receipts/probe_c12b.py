from vlib import *
URL = "https://www.clay.com/blog/gtm-engineering"
EX = HERE / "explore"
with sync_playwright() as p:
    b, ctx, pg = open_mobile(p, URL, wait=8, consent=False)
    print("frames:", [f.url[:80] for f in pg.frames])
    for sel in ["button:has-text('Accept all')", "text=Accept all", "[role=button]:has-text('Accept')", "#transcend-consent-manager"]:
        try:
            loc = pg.locator(sel)
            print(sel, "count", loc.count(), [ (loc.nth(i).bounding_box()) for i in range(min(loc.count(),3))])
        except Exception as e:
            print(sel, "err", str(e).splitlines()[0])
    # any element containing 'Accept all' (pierces open shadow roots via a manual walk)
    print(pg.evaluate("""()=>{const out=[];const walk=(root)=>{for(const e of root.querySelectorAll('*')){ if(e.shadowRoot) walk(e.shadowRoot); const t=(e.innerText||e.textContent||'').trim(); if(t==='Accept all'||t==='Reject all'||t==='Accept All'){const r=e.getBoundingClientRect(); out.push([e.tagName,(e.className||'').toString().slice(0,40),Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)])}}}; walk(document); return JSON.stringify(out)}"""))
    png = pg.screenshot()  # full viewport 390x844 at DPR3
    Image.open(io.BytesIO(png)).convert("RGB").resize((390, 844)).save(EX / "c12-viewport-banner.png")
    b.close()
