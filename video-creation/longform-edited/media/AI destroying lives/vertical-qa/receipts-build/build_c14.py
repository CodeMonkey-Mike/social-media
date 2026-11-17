import time
from pathlib import Path
from playwright.sync_api import sync_playwright
import rc, rec_det
OUT = Path("../../assets/vertical/receipts/C14-figure-bmw.mp4").resolve()
SECONDS = 10.0
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://www.figure.ai/news/production-at-bmw", wait=7000, scroll_through=False, do_unfix=False,
                              viewport={"width": 390, "height": 693}, dsf=rec_det.DSF)
    # make sure every <video> is muted, loaded and not auto-advancing (frames are seeked, never played)
    pg.evaluate("document.querySelectorAll('video').forEach(v => { v.muted = true; v.pause(); v.preload = 'auto'; })")
    for y in range(0, 2000, 250): pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.25)
    pg.evaluate("window.scrollTo(0,0)"); time.sleep(1.0)
    vids = pg.evaluate("[...document.querySelectorAll('video')].map(v => { const r = v.getBoundingClientRect(); return [Math.round(r.y + scrollY), v.duration, v.readyState]; })")
    print(vids)
    delivery_y = vids[1][0]                              # the "First robot delivered to BMW" clip
    y_end = delivery_y - 220                             # the paragraph above it + the clip fully in frame
    T0, T1 = 1.5, 8.0
    f = lambda t: y_end * rec_det.ease((t - T0) / (T1 - T0))
    vf = lambda t: [t, max(0.0, t - 5.5), None, None]
    n = rec_det.render(pg, ctx, OUT, SECONDS, f, "rec/c14", video_fn=vf)
    print("frames", n, "y_end", round(y_end))
    b.close()
