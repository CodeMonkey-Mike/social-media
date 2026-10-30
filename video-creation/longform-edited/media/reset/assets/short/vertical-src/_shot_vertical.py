"""Native-vertical re-shoot driver (reset short): H4-s1 + C4 payoff at 1080x1920, @2x then Lanczos (same method as
../../slide-sources/_shot.py). Gates: webfonts loaded, frame 1080x1920, no em dash. Prints content bounds per frame."""
import io, os
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, "..", "vertical-cards"))
W, H = 1080, 1920
JOBS = [("H4-vertical.html", "H4", "H4-s1-v.png"), ("C4-vertical.html", "payoff", "C4-payoff-v.png")]
FONTS = """() => [document.fonts.check('900 84px "Playfair Display"'), document.fonts.check('700 52px "Playfair Display"'),
 document.fonts.check('600 27px "DM Sans"'), document.fonts.check('600 30px "JetBrains Mono"')]"""
BOUNDS = """(fid) => { const f=document.getElementById(fid).getBoundingClientRect(); let t=1e9,b=0,l=1e9,r=0;
 document.getElementById(fid).querySelectorAll('*').forEach(e=>{ if(e.classList.contains('orb')||e.closest('svg'))return;
 const q=e.getBoundingClientRect(); if(!q.width)return; t=Math.min(t,q.top-f.top); b=Math.max(b,q.bottom-f.top);
 l=Math.min(l,q.left-f.left); r=Math.max(r,q.right-f.left)}); return [l,t,r,b].map(Math.round); }"""
with sync_playwright() as pw:
    br = pw.chromium.launch(headless=True)
    for html, fid, name in JOBS:
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        pg.goto("file:///" + os.path.join(HERE, html).replace("\\", "/"), wait_until="networkidle", timeout=90000)
        pg.evaluate("() => document.fonts.ready"); pg.wait_for_timeout(1500)
        f = pg.evaluate(FONTS)
        need = [0, 2, 3] if fid == "payoff" else [0, 1, 2]
        if not all(f[i] for i in need): raise SystemExit(f"{html}: webfonts not loaded {f}")
        el = pg.query_selector(f'[id="{fid}"]'); bx = el.bounding_box()
        if (round(bx["width"]), round(bx["height"])) != (W, H): raise SystemExit(f"{fid}: {bx}")
        if "\u2014" in el.inner_text(): raise SystemExit("em dash")
        print(name, "content bounds l,t,r,b =", pg.evaluate(BOUNDS, fid))
        im = Image.open(io.BytesIO(el.screenshot())).convert("RGB").resize((W, H), Image.LANCZOS)
        im.save(os.path.join(OUT, name)); print("OK", os.path.join(OUT, name), im.size)
        pg.close()
    br.close()
