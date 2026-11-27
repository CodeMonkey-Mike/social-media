import sys
from kit import *
url, x, y = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
with sync_playwright() as p:
    br = launch(p)
    page = new_page(br, dsf=1)
    goto(page, url, 7)
    click_buttons(page, CONSENT_BUTTONS)
    for t in (0, 3):
        time.sleep(t)
        chain = page.evaluate("""([x,y]) => { let el = document.elementFromPoint(x,y); const out=[];
          while (el && el !== document.body) { const r = el.getBoundingClientRect();
            out.push(el.tagName + '#' + (el.id||'') + '.' + (typeof el.className==='string'?el.className.slice(0,70):'') + ' [' + Math.round(r.top)+','+Math.round(r.height)+']'); el = el.parentElement; }
          return out; }""", [x, y])
        print("--- t+", t); print("\n".join(chain))
    br.close()
