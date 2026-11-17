import time, base64, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
import rc, rec_det
SRC = Path("../../assets/receipts/C24-footage-atlas-demo.mp4").resolve()      # the Atlas demo video of the release (10.0 s, 1920x1080, no audio needed)
OUT = Path("../../assets/vertical/receipts/C24-footage-atlas-demo.mp4").resolve()
SECONDS = 10.0
URL = "https://pressroom.toyota.com/ai-powered-robot-by-boston-dynamics-and-toyota-research-institute-takes-a-key-step-towards-general-purpose-humanoids/"
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, URL, wait=7000, scroll_through=False, viewport={"width": 390, "height": 693}, dsf=rec_det.DSF)
    for y in range(900, 2400, 250): pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.25)
    # serve the footage same-origin (with Range support, so frame seeks work), then swap the YouTube iframe for a <video> in the same box
    data = SRC.read_bytes()
    def handler(route):
        rng = route.request.headers.get("range")
        if rng:
            a, bnd = rng.replace("bytes=", "").split("-"); a = int(a); bnd = int(bnd) if bnd else len(data) - 1
            route.fulfill(status=206, body=data[a:bnd + 1], headers={"Content-Type": "video/mp4", "Accept-Ranges": "bytes",
                          "Content-Range": f"bytes {a}-{bnd}/{len(data)}", "Content-Length": str(bnd - a + 1)})
        else:
            route.fulfill(status=200, body=data, headers={"Content-Type": "video/mp4", "Accept-Ranges": "bytes", "Content-Length": str(len(data))})
    pg.route("**/__atlas_demo.mp4", handler)
    ok = pg.evaluate("""async () => {
        const f = document.querySelector('iframe[src*="youtube"]'); if (!f) return 'no iframe';
        const v = document.createElement('video'); v.src = '/__atlas_demo.mp4'; v.muted = true; v.playsInline = true; v.preload = 'auto';
        v.setAttribute('id', 'atlas-demo');
        const r = f.getBoundingClientRect(); v.style.cssText = `display:block;width:${r.width}px;height:${r.height}px;background:#000;object-fit:cover;`;
        f.replaceWith(v); await new Promise(res => { v.onloadeddata = res; v.onerror = res; setTimeout(res, 8000); }); return 'ok dur=' + v.duration + ' ready=' + v.readyState + ' err=' + (v.error && v.error.message); }""")
    print(ok); time.sleep(1.0)
    vy = pg.evaluate("document.getElementById('atlas-demo').getBoundingClientRect().top + scrollY")
    print("video y", vy)
    w = rc.choose_window(pg, vy - 250, min_frac=0.85, search=400)
    print("window", w)
    if not w: sys.exit("no clean window")
    y0, h = w
    if h < rec_det.WIN_H - 1:   # pad the rest of the frame with the page background (white), as a short capture window
        pg.add_style_tag(content=f'body::after{{content:"";position:fixed;left:0;right:0;bottom:0;height:{rec_det.WIN_H - h + 1:.1f}px;background:#fff;z-index:2147483647}}')
    n = rec_det.render(pg, ctx, OUT, SECONDS, lambda t: y0, "rec/c24f", video_fn=lambda t: [t], video_sel="#atlas-demo")
    print("frames", n, "y0", y0)
    b.close()
