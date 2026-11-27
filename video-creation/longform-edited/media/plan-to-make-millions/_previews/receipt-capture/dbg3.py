from capture_receipts import CG_KILL_SALE_JS
from kit import *
import time
with sync_playwright() as p:
    br = launch(p)
    page = new_page(br, w=1920, h=1080, dsf=1)
    goto(page, "https://www.coingecko.com/en/new-cryptocurrencies", 10)
    page.evaluate(CG_KILL_SALE_JS)
    for i in range(6):
        res = page.evaluate("""() => {
          const seen = []; 
          const walk = (root, depth) => { root.querySelectorAll('*').forEach(e => {
              if (e.shadowRoot) walk(e.shadowRoot, depth + 1);
              const own = Array.from(e.childNodes).filter(n => n.nodeType === 3).map(n => n.nodeValue).join(' ');
              if (/Opt-out for personal|Reject all/i.test(own)) { const r = e.getBoundingClientRect();
                seen.push(e.tagName + '#' + (e.id || '') + '.' + String(e.className).slice(0, 40) + ' @' + Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) + ' depth' + depth); } }); };
          walk(document, 0); return seen.slice(0, 6); }""")
        print(i, res)
        time.sleep(2)
    br.close()
