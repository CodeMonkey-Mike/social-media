from capture_receipts import CG_KILL_SALE_JS
from kit import *
import time
with sync_playwright() as p:
    br = launch(p)
    page = new_page(br, w=1920, h=1080, dsf=1)
    goto(page, "https://www.coingecko.com/en/new-cryptocurrencies", 10)
    page.evaluate(CG_KILL_SALE_JS)
    page.mouse.wheel(0, 300)
    for i in range(4):
        time.sleep(3)
        big = []
        for fr in page.frames:
            try:
                fe = fr.frame_element(); bb = fe.bounding_box()
                if bb and bb["width"] > 800 and bb["height"] > 80:
                    big.append((fr.url[:70], [round(v) for v in (bb["x"], bb["y"], bb["width"], bb["height"])]))
            except Exception as e:
                pass
        top = page.evaluate("""() => { const out = []; document.elementsFromPoint(900, 1010).slice(0, 5).forEach(e => {
              let h = e.getRootNode && e.getRootNode().host; out.push(e.tagName + '#' + (e.id || '') + '.' + String(e.className).slice(0, 30) + (h ? ' host=' + h.tagName + '#' + h.id : '')); }); return out; }""")
        print(i, "bigframes", big, "| top@900,1010", top, flush=True)
    br.close()
