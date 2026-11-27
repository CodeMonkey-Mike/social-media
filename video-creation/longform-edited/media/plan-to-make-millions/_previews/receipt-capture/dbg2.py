from capture_receipts import *
with sync_playwright() as p:
    br = launch(p)
    page = new_page(br, h=1080)
    goto(page, "https://www.coingecko.com/en/coins/pieverse", 9)
    cg_clear(page)
    chain = page.evaluate("""() => { let el = document.elementFromPoint(1371, 320); const out=[];
      while (el && el !== document.body) { out.push(el.tagName+'.'+(typeof el.className==='string'?el.className.slice(0,60):'')+' txt='+(el.innerText||'').slice(0,20)); el = el.parentElement; } return out; }""")
    print("\n".join(chain))
    for sel in ['button:text-is("Max")', '[data-view-component] >> text="Max"', 'text="Max"']:
        loc = page.locator(sel)
        print(sel, loc.count())
    loc = page.locator('button:text-is("Max")')
    for i in range(loc.count()):
        print(i, loc.nth(i).bounding_box(), loc.nth(i).is_visible())
    br.close()
