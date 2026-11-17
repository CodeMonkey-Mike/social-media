from rc_lib import *
import re
with sync_playwright() as p:
    b, pg = open_page(p, "https://blog.google/inside-google/message-ceo/", wait=6, dsf=1)
    print("title:", pg.title())
    for _ in range(4):
        pg.mouse.wheel(0, 1800); time.sleep(1)
    links = pg.evaluate("""()=>[...document.querySelectorAll('a[href*="/inside-google/message-ceo/"]')].map(a=>[a.href,(a.innerText||'').trim().replace(/\s+/g,' ').slice(0,110)])""")
    seen=set()
    for h,t in links:
        if h in seen: continue
        seen.add(h); print(h, "|", t)
    b.close()
