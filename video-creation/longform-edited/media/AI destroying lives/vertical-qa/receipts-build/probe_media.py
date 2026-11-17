import sys, time, json
from playwright.sync_api import sync_playwright
import rc
url = sys.argv[1]
with sync_playwright() as p:
    b, ctx, pg = rc.open_page(p, url, wait=6000, scroll_through=False)
    print(pg.title(), "H=", pg.evaluate("document.documentElement.scrollHeight"))
    info = pg.evaluate("""() => [...document.querySelectorAll('video,iframe,source')].map(e => { const r = e.getBoundingClientRect(); return [e.tagName, (e.currentSrc||e.src||'').slice(0,160), e.getAttribute('data-src')||'', Math.round(r.x), Math.round(r.y+scrollY), Math.round(r.width), Math.round(r.height), e.duration||'', e.paused, e.muted, e.loop, e.readyState]; })""")
    for i in info: print(i)
    b.close()
