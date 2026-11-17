from playwright.sync_api import sync_playwright
import rc, rec_det, time, json
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, "https://www.figure.ai/news/production-at-bmw", wait=6000, scroll_through=False, do_unfix=False,
                              viewport={"width": 390, "height": 693}, dsf=rec_det.DSF)
    print("H", pg.evaluate("document.documentElement.scrollHeight"))
    for k in ["Today we", "BMW Deployment Highlights", "Ran 10-hour", "Following the release", "First robot delivered", "Battle", "Retire", "ROBOT", "Contributed to the Production"]:
        print(k, rc.y_of(pg, k))
    print(pg.evaluate("""() => [...document.querySelectorAll('video')].map(v => { const r = v.getBoundingClientRect(); return [Math.round(r.y+scrollY), Math.round(r.height), v.duration, v.loop, v.autoplay, v.paused, v.readyState, getComputedStyle(v).position]; })"""))
    # fixed elements
    print(pg.evaluate("""() => [...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).position === 'fixed').map(e => [e.tagName, e.className.toString().slice(0,50), Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)])"""))
    pg.evaluate("window.scrollTo(0, 2300)"); time.sleep(1.5)
    pg.screenshot(path="probe-fig-2300.png")
    b.close()
