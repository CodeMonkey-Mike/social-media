"""retire-early slide driver: screenshot every frame/state of containers.html.

Each frame is a standalone 1920x1080 <div class="frame" id="<slug>">; states are applied by adding
classes (spotlight rows, landed slots), never by cropping a deck. Rendered at device scale 2 for
crisp type, then downsampled (Lanczos) to the 1920x1080 deliverable.
Outputs (comp-build §10 merged layout): ../title-slides/<id>.png and ../card-slides/<id>.png.
Run:  python _shot.py            (all jobs)
      python _shot.py C5 N4      (only jobs whose name starts with one of the given prefixes)
"""
import io
import os
import sys

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = "file:///" + os.path.join(HERE, "containers.html").replace("\\", "/")
OUT_TITLE = os.path.abspath(os.path.join(HERE, "..", "title-slides"))
OUT_CARD = os.path.abspath(os.path.join(HERE, "..", "card-slides"))
TITLE_IDS = {"title-CH2", "title-CH3", "title-CH4", "title-CH5"}  # TITLE SLIDES -> ../title-slides/

# (png_name, frame_id, frame_classes, [(selector, class_to_add), ...])
JOBS = [
    ("H0-s1", "H0", [], []),
    ("H0-s2", "H0", ["st2"], []),

    ("N2-s1", "N2", [], [("#n2-1", "on")]),
    ("N2-s2", "N2", [], [("#n2-1", "on"), ("#n2-2", "on")]),
    ("N2-s3", "N2", [], [("#n2-1", "on"), ("#n2-2", "on"), ("#n2-3", "on")]),
    ("N2-s4", "N2", [], [("#n2-1", "on"), ("#n2-2", "on"), ("#n2-3", "on"), ("#n2-4", "on")]),

    ("C5-s1", "C5", [], [("#c5-1", "on")]),
    ("C5-s2", "C5", [], [("#c5-2", "on")]),
    ("C5-s3", "C5", [], [("#c5-3", "on")]),
    ("C5-s4", "C5", [], [("#c5-4", "on")]),

    ("kas-question", "kas-question", [], []),
    ("toccata-zk", "toccata-zk", [], []),
    ("steeves-quote", "steeves-quote", [], []),

    ("N4-s1", "N4", [], [("#n4-1", "on"), ("#n4-h1", "k")]),
    ("N4-s2", "N4", [], [("#n4-2", "on"), ("#n4-h2", "k")]),
    ("N4-s2-handover", "N4", [], [("#n4-2", "on"), ("#n4-3", "on"), ("#n4-h2", "k")]),

    ("C38", "C38", [], []),
    ("C38-s1", "C38", [], [("#c38-1", "on")]),
    ("C38-s2", "C38", [], [("#c38-1", "on"), ("#c38-2", "on")]),
    ("C38-s3", "C38", [], [("#c38-1", "on"), ("#c38-2", "on"), ("#c38-3", "on")]),
    ("C38-s4", "C38", [], [("#c38-1", "on"), ("#c38-2", "on"), ("#c38-3", "on"), ("#c38-4", "on")]),

    # TITLE SLIDES (chapter title cards, no box, one state each)
    ("title-CH2", "title-CH2", [], []),
    ("title-CH3", "title-CH3", [], []),
    ("title-CH4", "title-CH4", [], []),
    ("title-CH5", "title-CH5", [], []),
]

RESET_JS = """() => {
  document.querySelectorAll('.row,.slot').forEach(e => e.classList.remove('on'));
  document.querySelectorAll('#n4-h1,#n4-h2').forEach(e => e.classList.remove('k'));
  document.querySelectorAll('.frame').forEach(e => e.classList.remove('st2'));
}"""

FONT_CHECK_JS = """() => [
  document.fonts.check('900 84px "Playfair Display"'),
  document.fonts.check('600 31px "DM Sans"'),
  document.fonts.check('600 40px "JetBrains Mono"'),
]"""


def out_dir(name: str) -> str:
    return OUT_TITLE if name in TITLE_IDS else OUT_CARD


REF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "..", "..", "schedule-tweets", "images", "reference"))


def build_tao_mark():
    """The only Bittensor reference (bittensor-tao.png) is a 139x102 white tile with a 31x34 px tau glyph.
    Shown at mark size it is either tiny or blurry, so: crop the REAL glyph, upscale it 16x (bicubic) and
    re-sharpen the anti-aliased edge with a luminance ramp. Same pixels, same shape, same colour (#292929);
    nothing redrawn. Written next to the HTML as mark-tao.png (transparent background)."""
    import numpy as np
    src = Image.open(os.path.join(REF, "bittensor-tao.png")).convert("L")
    pad = 4
    crop = src.crop((41 - pad, 37 - pad, 73 + pad, 72 + pad))  # glyph bbox measured: x 41-72, y 37-71
    big = crop.resize((crop.width * 16, crop.height * 16), Image.BICUBIC)
    lum = np.asarray(big).astype(np.float32)
    ink = np.clip((200.0 - lum) / (200.0 - 90.0), 0.0, 1.0)  # 0 = paper, 1 = ink; narrow ramp = crisp AA edge
    rgba = np.zeros((lum.shape[0], lum.shape[1], 4), dtype=np.uint8)
    rgba[..., :3] = 41
    rgba[..., 3] = (ink * 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(os.path.join(HERE, "mark-tao.png"))


def main(prefixes):
    os.makedirs(OUT_TITLE, exist_ok=True)
    os.makedirs(OUT_CARD, exist_ok=True)
    build_tao_mark()
    jobs = [j for j in JOBS if not prefixes or any(j[0].startswith(p) for p in prefixes)]
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True)
        page = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
        page.goto(HTML, wait_until="networkidle", timeout=60000)
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(1500)
        fonts = page.evaluate(FONT_CHECK_JS)
        if not all(fonts):
            raise SystemExit(f"FONTS NOT LOADED (Playfair, DM Sans, JetBrains Mono) = {fonts}")
        imgs_ok = page.evaluate("() => [...document.images].every(i => i.complete && i.naturalWidth > 0)")
        if not imgs_ok:
            raise SystemExit("A mark <img> failed to load")
        for name, fid, fclasses, mods in jobs:
            page.evaluate(RESET_JS)
            for c in fclasses:
                page.eval_on_selector("#" + fid, f"(e) => e.classList.add('{c}')")
            for sel, cls in mods:
                page.eval_on_selector(sel, f"(e) => e.classList.add('{cls}')")
            page.wait_for_timeout(120)
            png = page.query_selector("#" + fid).screenshot()
            im = Image.open(io.BytesIO(png)).convert("RGB").resize((1920, 1080), Image.LANCZOS)
            path = os.path.join(out_dir(name), name + ".png")
            im.save(path, optimize=True)
            print("OK", path)
        b.close()


if __name__ == "__main__":
    main(sys.argv[1:])
