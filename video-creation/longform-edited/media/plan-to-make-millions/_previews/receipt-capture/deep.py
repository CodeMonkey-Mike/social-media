"""Deep reads: BLS gasoline text, CoinDesk body, showcase table recount."""
import json
import re
import time

from kit import *

with sync_playwright() as p:
    br = launch(p)

    # --- BLS: the gasoline / 9.1 sentence inside the PRE
    page = new_page(br, dsf=1)
    goto(page, "https://www.bls.gov/news.release/archives/cpi_11102026.htm", 4)
    txt = page.evaluate("Array.from(document.querySelectorAll('pre')).map(p => p.innerText).join('\\n=====PRE=====\\n')")
    for m in re.finditer(r"9\.1 percent", txt):
        s = max(0, m.start() - 900); e = min(len(txt), m.end() + 400)
        print("---- BLS context ----\n" + txt[s:e])
    # which PRE and where on page
    info = page.evaluate("""() => {
      const out = [];
      document.querySelectorAll('pre').forEach((pre, i) => {
        const t = pre.innerText; const k = t.indexOf('9.1 percent');
        if (k >= 0) { const r = pre.getBoundingClientRect(); out.push({i, top: r.top + scrollY, h: r.height, k, len: t.length}); }
      });
      return out; }""")
    print("BLS pre info", info)
    page.close()

    # --- CoinDesk body
    page = new_page(br, dsf=1)
    goto(page, "https://www.coindesk.com/markets/2026/11/13/bitcoin-slides-to-usd68k-as-nvidia-turmoil-anthropic-ipo-fuel-broader-market-sell-off", 6)
    paras = page.evaluate("""() => Array.from(document.querySelectorAll('article p, main p, article li')).map(e => {
        const r = e.getBoundingClientRect(); return {y: Math.round(r.top + scrollY), x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), t: e.innerText.trim()}; })
        .filter(o => o.t.length > 40)""")
    for o in paras[:40]:
        print(f"[CD y={o['y']} x={o['x']} w={o['w']} h={o['h']}] {o['t'][:420]}")
    page.close()

    # --- showcase table recount
    page = new_page(br, dsf=1)
    goto(page, "https://cryptorich.vip/showcase", 5)
    data = page.evaluate("""() => Array.from(document.querySelectorAll('table')).map(t => {
        const head = t.previousElementSibling ? t.previousElementSibling.innerText : '';
        const heads = Array.from(t.querySelectorAll('thead th')).map(x => x.innerText.trim());
        const rows = Array.from(t.querySelectorAll('tbody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim()));
        const r = t.getBoundingClientRect();
        return {head, heads, rows, top: Math.round(r.top + scrollY), h: Math.round(r.height)}; })""")
    total = 0
    callers = {}
    for t in data:
        print("TABLE", t["head"], t["heads"], "rows", len(t["rows"]), "top", t["top"], "h", t["h"])
        for r in t["rows"]:
            total += 1
            callers[r[-1]] = callers.get(r[-1], 0) + 1
    print("TOTAL ROWS", total, "BY CALLER", callers)
    print("heading texts:", page.evaluate("Array.from(document.querySelectorAll('h1,h2,h3')).map(h => h.innerText)"))
    page.close()
    br.close()
