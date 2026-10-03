"""golden-kitty slide driver: screenshots every standalone .frame in containers.html.

Renders at device_scale_factor=2 for crisp text, then Lanczos-downsamples to exactly 1920x1080.
Slides split by TYPE (comp-build.md section 10): title-card-* -> ../title-slides/, the rest -> ../card-slides/.
State variants are <id>-s<N>.png; a card with no timed states is a single <id>.png.
Run: python _shot.py [frame-id ...]   (no args = every frame)
     python _shot.py --portrait [frame-id ...]   -> 1080x1920 VERTICAL re-shoot (vertical-repurpose.md s1):
       same HTML, the @media (max-aspect-ratio:1/1) block reflows it; PNGs go to
       ../vertical/title-slides + ../vertical/card-slides with the SAME names (16:9 PNGs untouched).
"""
import io
import os
import sys

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = "file:///" + os.path.join(HERE, "containers.html").replace("\\", "/")
ONLY = [a for a in sys.argv[1:] if not a.startswith("--")]
PORTRAIT = "--portrait" in sys.argv
W, H = (1080, 1920) if PORTRAIT else (1920, 1080)
_BASE = os.path.join(HERE, "..", "vertical") if PORTRAIT else os.path.join(HERE, "..")
OUT_TITLE = os.path.abspath(os.path.join(_BASE, "title-slides"))
OUT_CARD = os.path.abspath(os.path.join(_BASE, "card-slides"))
os.makedirs(OUT_TITLE, exist_ok=True)
os.makedirs(OUT_CARD, exist_ok=True)

ON = "on"
W_ROWS = ["#w1", "#w2", "#w3", "#w4", "#w5", "#w6", "#w7"]
SP_ROWS = ["#sp1", "#sp2", "#sp3", "#sp4"]

# (png_name, frame_id, [(selector, class-to-add), ...]); selector "" = the frame itself
JOBS = [
    ("H1-s1", "H1", []),
    ("H1-s2", "H1", [("", "lit")]),
]
# winners-card: ONE row spotlit per spoken name (spotlight moves, earlier rows return to resting)
JOBS += [(f"winners-card-s{i + 1}", "winners-card", [(r, ON)]) for i, r in enumerate(W_ROWS)]
# spdr-card: resting, then letters light cumulatively as the words are spoken
JOBS += [("spdr-card-s1", "spdr-card", [])]
JOBS += [(f"spdr-card-s{i + 2}", "spdr-card", [(r, ON) for r in SP_ROWS[: i + 1]]) for i in range(4)]
JOBS += [
    ("contrast-priced-s1", "contrast-priced", [("#cp-b", ON)]),
    ("contrast-priced-s2", "contrast-priced", [("#cp-a", ON)]),
    ("both-tags-s1", "both-tags", []),
    ("both-tags-s2", "both-tags", [("#bt-meme", ON)]),
    ("both-tags-s3", "both-tags", [("#bt-meme", ON), ("#bt-rwa", ON)]),
    ("end-card-s1", "end-card", []),
    ("end-card-s2", "end-card", [("#ec-like", ON)]),
    ("end-card-s3", "end-card", [("#ec-like", ON), ("#ec-prompt", ON)]),
    ("cap-holders-s1", "cap-holders", [("#ch1", ON)]),
    ("cap-holders-s2", "cap-holders", [("#ch2", ON)]),
    ("ph-card-s1", "ph-card", [("#ph1", ON)]),
    ("ph-card-s2", "ph-card", [("#ph2", ON)]),
    ("title-card-ch2", "title-card-ch2", []),
    ("title-card-ch4", "title-card-ch4", []),
    ("title-card-ch5", "title-card-ch5", []),
    ("title-card-ch6", "title-card-ch6", []),
]

RESET_JS = "() => document.querySelectorAll('.on,.lit').forEach(e => e.classList.remove('on','lit'))"

FONT_CHECK = """() => [
  document.fonts.check('900 84px "Playfair Display"'),
  document.fonts.check('600 27px "DM Sans"'),
  document.fonts.check('600 30px "JetBrains Mono"')]"""

OVERFLOW_JS = """(fid) => {
  const f = document.getElementById(fid), fr = f.getBoundingClientRect(), bad = [];
  f.querySelectorAll('*').forEach(e => {
    if (e.classList.contains('orb') || e.classList.contains('field')) return;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > fr.right + 1 || r.bottom > fr.bottom + 1 || r.left < fr.left - 1 || r.top < fr.top - 1))
      bad.push(e.className || e.tagName);
    if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden') bad.push('clip:' + (e.className || e.tagName));
  });
  return bad;
}"""


def out_dir(name):
    return OUT_TITLE if name.startswith("title-card") else OUT_CARD


with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True, channel="chrome")
    page = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
    page.goto(HTML, wait_until="networkidle", timeout=60000)
    page.evaluate("() => document.fonts.ready")
    page.wait_for_timeout(1500)
    fonts = page.evaluate(FONT_CHECK)
    print("fonts loaded (Playfair, DM Sans, JetBrains Mono):", fonts)
    if not all(fonts):
        raise SystemExit("webfonts did not load; refusing to ship fallback-font slides")
    for name, fid, mods in JOBS:
        if ONLY and fid not in ONLY:
            continue
        page.evaluate(RESET_JS)
        for sel, cls in mods:
            page.eval_on_selector(("#" + fid + " " + sel).strip(), "(e, c) => e.classList.add(c)", cls)
        el = page.query_selector("#" + fid)
        box = el.bounding_box()
        if (round(box["width"]), round(box["height"])) != (W, H):
            raise SystemExit(f"{fid}: frame is {box['width']}x{box['height']}, expected {W}x{H}")
        bad = page.evaluate(OVERFLOW_JS, fid)
        if bad:
            print("WARN overflow", fid, sorted(set(bad))[:8])
        png = el.screenshot()
        im = Image.open(io.BytesIO(png)).convert("RGB").resize((W, H), Image.LANCZOS)
        path = os.path.join(out_dir(name), name + ".png")
        im.save(path, optimize=True)
        print("OK", path)
    b.close()
print("DONE (portrait)" if PORTRAIT else "DONE", "->", OUT_TITLE, "+", OUT_CARD)
