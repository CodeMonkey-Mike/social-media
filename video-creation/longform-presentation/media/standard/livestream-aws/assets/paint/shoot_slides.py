"""Shoot the deck slides that paint the empty deck area of the livestream-aws screen-share scenes.

Mike recorded the screen-share lines over an empty (black) deck area. The OBS layout is the AI channel's standard one:
webcam at x 1371..1919, y 400..1079, everything left of it is the deck area. Each slide (an HTML file beside this one,
in the langgraph-updates session-slide look, `slides.css`) is shot at the DECK size 1371x1080 (the slides size
everything from `min(2.1vh, 1.19vw)`, so they lay themselves out for that width) and placed at (0,0) on a 1920x1080
page of the slides' own background #0a0c10. The webcam is laid back on top later.

ec2.html is shot twice: the question as is, the answer with `body.ans` (the answers are always laid out, only their
visibility changes, so the two PNGs are pixel-stable outside the answers).

    python shoot_slides.py      -> slide-ec2-question.png, slide-ec2-answer.png, slide-the-gate.png,
                                   slide-langgraph-playlist.png (all 1920x1080) beside this file

Machine line: SHOOT-SLIDES PASS|FAIL files=N
"""
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
DECK_W, W, H, BG = 1371, 1920, 1080, (10, 12, 16)
FONTS = ("Playfair Display", "DM Sans", "JetBrains Mono")
# (output name, html file, body class to add)
SHOTS = [("ec2-question", "ec2.html", None),
         ("ec2-answer", "ec2.html", "ans"),
         ("the-gate", "the-gate.html", None),
         ("langgraph-playlist", "langgraph-playlist.html", None)]


def place(src_png, out_png):
    page = Image.new("RGB", (W, H), BG)
    page.paste(Image.open(src_png).convert("RGB"), (0, 0))
    page.save(out_png)


def main():
    fails, n = [], 0
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": DECK_W, "height": H}, device_scale_factor=1)
        for name, src, cls in SHOTS:
            pg.goto((HERE / src).as_uri(), wait_until="networkidle")
            # force every weight the slides use to load before the shot (a face loads lazily, on first paint)
            pg.evaluate("""() => Promise.all(['900 16px "Playfair Display"', '700 16px "Playfair Display"',
                '400 16px "DM Sans"', '500 16px "DM Sans"', '700 16px "DM Sans"',
                '600 16px "JetBrains Mono"', '700 16px "JetBrains Mono"'].map(f => document.fonts.load(f, '0123456789AaBb?')))""")
            pg.evaluate("document.fonts.ready")
            if cls:
                pg.evaluate("c => document.body.classList.add(c)", cls)
                pg.evaluate("document.fonts.ready")
            # every family the page RENDERS must have a loaded face (a fallback font is the drift this project forbids)
            loaded = set(pg.evaluate("Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family.replace(/[\"']/g, ''))"))
            used = set(pg.evaluate("""() => { const s = new Set(); for (const e of document.body.querySelectorAll('*')) {
                if (!e.childNodes.length || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
                s.add(getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()); } return [...s]; }"""))
            for fam in sorted(used):
                if fam in FONTS and fam not in loaded:
                    fails.append(f"{name}: font not loaded: {fam}")
            # overflow check: nothing may run past the deck area
            over = pg.evaluate("""() => { const W = innerWidth, H = innerHeight; const bad = [];
                for (const e of document.body.querySelectorAll('*')) { if (e.classList.contains('orb')) continue;
                  const r = e.getBoundingClientRect(); if (r.width && (r.right > W + 0.5 || r.bottom > H + 0.5 || r.left < -0.5 || r.top < -0.5))
                    bad.push(e.className || e.tagName); } return bad; }""")
            if over:
                fails.append(f"{name}: elements outside the deck area: {over[:5]}")
            pg.wait_for_timeout(300)
            raw = HERE / f"_deck-{name}.png"
            pg.screenshot(path=str(raw))
            place(raw, HERE / f"slide-{name}.png")
            raw.unlink()
            n += 1
            print(f"  slide-{name}.png")
        b.close()
    for f in fails:
        print(f"  FAIL  {f}")
    print(f"SHOOT-SLIDES {'FAIL' if fails else 'PASS'} files={n}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
