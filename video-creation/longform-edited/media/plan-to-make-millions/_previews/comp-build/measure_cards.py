"""Measure the boxes of the first build item of the cards whose first item the comp holds back (EDIT-PLAN 'held back in the comp')."""
import json, os
from playwright.sync_api import sync_playwright
HTML = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'slide-sources', 'containers.html'))
want = {"D-TELL": ["r1", "r2", "r3", "r4"]}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file:///" + HTML.replace("\\", "/")); pg.wait_for_timeout(800)
    out = {}
    for fid, keys in want.items():
        pg.evaluate(f"applyState({fid!r}, 0)")
        r = pg.evaluate("""([fid, keys]) => { const f = document.getElementById(fid); const fr = f.getBoundingClientRect();
          return keys.map(k => { const el = f.querySelector(`[data-k='${k}']`); const r = el.getBoundingClientRect();
            const bg = getComputedStyle(el.parentElement).backgroundColor; const own = getComputedStyle(el).backgroundColor;
            return {k, x: r.left - fr.left, y: r.top - fr.top, w: r.width, h: r.height, bg, own, cls: el.className}; }); }""", [fid, keys])
        out[fid] = r
    b.close()
print(json.dumps(out, indent=1))
