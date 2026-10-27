"""chart-builder VERTICAL screenshot driver (growth-vs-product): every `.frame` in each HTML -> <frame-id>.png beside it.
Usage: python _shot_vertical.py <file.html> [<file.html> ...]   (headless Chromium via Playwright, 1080x1920, device scale 1)
Refuses to write if a font is missing; prints a CLIP line for any text box whose content overflows its own box
(scrollWidth/scrollHeight > client, on boxes that clip or never wrap) or any element that leaves the 1080x1920 frame."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

CLIP_JS = """fid => { const f = document.getElementById(fid), fr = f.getBoundingClientRect(), out = [];
  f.querySelectorAll('.nd, .nd .t, .nd .s, .desc, .take, .fix, .hub, .chip, .ey, h1, .role, .src, .abn, .ab').forEach(e => {
    const clips = getComputedStyle(e).overflow !== 'visible' || getComputedStyle(e).whiteSpace === 'nowrap';
    if (clips && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1)) out.push('overflow ' + (e.className || e.tagName) + ': ' + e.textContent.trim().slice(0, 50));
    const r = e.getBoundingClientRect();
    if (r.width && (r.left < fr.left - 1 || r.right > fr.right + 1 || r.top < fr.top - 1 || r.bottom > fr.bottom + 1)) out.push('off-frame ' + (e.className || e.tagName));
  });
  return out; }"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    for arg in sys.argv[1:]:
        html = Path(arg).resolve()
        page.goto(html.as_uri(), wait_until="networkidle")
        page.evaluate("""Promise.all([['900','Playfair Display'],['700','DM Sans'],['italic 700','DM Sans'],['600','JetBrains Mono'],['400','JetBrains Mono']]
                         .map(([w,f]) => document.fonts.load(w + ' 40px "' + f + '"'))).then(() => document.fonts.ready)""")
        page.wait_for_timeout(400)
        missing = page.evaluate("""[['900','Playfair Display'],['700','DM Sans'],['600','JetBrains Mono']].filter(([w,f]) => !document.fonts.check(w + ' 40px "' + f + '"')).map(x => x[1])""")
        if missing:
            raise SystemExit(f"{html.name}: fonts not loaded: {missing}")
        for fid in page.eval_on_selector_all(".frame", "els => els.map(e => e.id)"):
            page.evaluate("() => document.querySelectorAll('.frame').forEach(f => f.style.display = '')")
            for c in page.evaluate(CLIP_JS, fid):
                print(f"  CLIP {fid}: {c}")
            # one frame at a time, pinned at the viewport origin (a tall stacked-page element shot hit a Chromium raster
            # glitch: a black band over the header of loop-s2-eval-pulse), then a clipped viewport shot
            page.evaluate("""fid => { document.body.style.padding = '0'; document.body.style.gap = '0';
              document.querySelectorAll('.frame').forEach(f => f.style.display = f.id === fid ? '' : 'none'); window.scrollTo(0, 0); }""", fid)
            page.wait_for_timeout(250)
            out = html.parent / f"{fid}.png"
            page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": 1080, "height": 1920})
            print(out)
    browser.close()
