"""kaspa-vprogs slide driver: screenshots every standalone .frame in containers.html.

Renders at device_scale_factor=2 for crisp text, then Lanczos-downsamples to exactly 1920x1080.
Slides split by TYPE (comp-build.md section 10): title-card-* -> ../title-slides/, the rest -> ../card-slides/.
State variants are <id>-s<N>.png; a card with no timed states is a single <id>.png.
Run: python _shot.py [frame-id ...]   (no args = every frame)
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
os.makedirs(OUT_TITLE, exist_ok=True)
os.makedirs(OUT_CARD, exist_ok=True)

ON = "on"
# (png_name, frame_id, [(selector, action), ...])  action: add-class name, or "show" / "hide"
JOBS = [
    ("ten-bps-card", "ten-bps-card", []),

    ("execute-verify-flip-s1", "execute-verify-flip", []),
    ("execute-verify-flip-s2", "execute-verify-flip", [(".w-exec", "hide"), (".w-verify", "show")]),
    ("execute-verify-flip-s3", "execute-verify-flip", [(".w-exec", "hide"), (".w-verify", "show"), ("#evf-r1", ON)]),
    ("execute-verify-flip-s4", "execute-verify-flip", [(".w-exec", "hide"), (".w-verify", "show"), ("#evf-r1", ON), ("#evf-r2", ON)]),
    ("execute-verify-flip-s5", "execute-verify-flip", [(".w-exec", "hide"), (".w-verify", "show"), ("#evf-r1", ON), ("#evf-r2", ON), ("#evf-r3", ON)]),

    ("title-card-ch2", "title-card-ch2", []),

    ("sompolinsky-name-card-s1", "sompolinsky-name-card", []),
    ("sompolinsky-name-card-s2", "sompolinsky-name-card", [("#som-stamp", "show")]),

    ("zk-math-receipt-s1", "zk-math-receipt", []),
    ("zk-math-receipt-s2", "zk-math-receipt", [("#zk-r1", ON)]),
    ("zk-math-receipt-s3", "zk-math-receipt", [("#zk-r1", ON), ("#zk-stamp", "show")]),
    ("zk-math-receipt-s4", "zk-math-receipt", [("#zk-r1", ON), ("#zk-stamp", "show"), ("#zk-r2", "struck")]),

    ("sovereignty-card-s1", "sovereignty-card", []),
    ("sovereignty-card-s2", "sovereignty-card", [("#sov-b", "broke"), ("#sov-b .pill", "text:BROKEN")]),
    ("sovereignty-card-s3", "sovereignty-card", [("#sov-b", "broke"), ("#sov-b .pill", "text:BROKEN"), ("#sov-a", "live")]),

    ("title-card-ch3", "title-card-ch3", []),

    ("pow-money-hammer-s1", "pow-money-hammer", [("#pm-1", ON)]),
    ("pow-money-hammer-s2", "pow-money-hammer", [("#pm-1", ON), ("#pm-2", ON)]),
    ("pow-money-hammer-s3", "pow-money-hammer", [("#pm-1", ON), ("#pm-2", ON), ("#pm-3", ON)]),

    ("cta-engage-s1", "cta-engage", [("#cta-like", ON)]),
    ("cta-engage-s2", "cta-engage", [("#cta-like", ON), ("#cta-comment", ON)]),
    ("cta-engage-s3", "cta-engage", [("#cta-like", ON), ("#cta-comment", ON), ("#cta-prompt", ON)]),

    ("end-card-community-s1", "end-card-community", [("#end-1", ON)]),
    ("end-card-community-s2", "end-card-community", [("#end-1", ON), ("#end-2", ON)]),
]

RESET_JS = """() => {
  document.querySelectorAll('.on,.struck,.broke,.live').forEach(e => e.classList.remove('on','struck','broke','live'));
  document.querySelectorAll('.w-exec').forEach(e => e.classList.remove('hide'));
  document.querySelectorAll('.w-verify,#som-stamp,#zk-stamp').forEach(e => e.classList.add('hide'));
  document.querySelectorAll('.vnode .pill').forEach(e => e.textContent = 'RUNNING');
}"""

FONT_CHECK = """() => [
  document.fonts.check('900 84px "Playfair Display"'),
  document.fonts.check('600 27px "DM Sans"'),
  document.fonts.check('600 30px "JetBrains Mono"')]"""


def out_dir(name):
    return OUT_TITLE if name.startswith("title-card") else OUT_CARD


def apply(page, sel, action):
    if action == "show":
        page.eval_on_selector(sel, "e => e.classList.remove('hide')")
    elif action == "hide":
        page.eval_on_selector(sel, "e => e.classList.add('hide')")
    elif action.startswith("text:"):
        page.eval_on_selector(sel, "(e, t) => { e.textContent = t; }", action[5:])
    else:
        page.eval_on_selector(sel, "(e, c) => e.classList.add(c)", action)


with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True, channel="chrome")
    page = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
    page.goto(HTML, wait_until="networkidle", timeout=60000)
    page.evaluate("() => document.fonts.ready")
    page.wait_for_timeout(1500)
    fonts = page.evaluate(FONT_CHECK)
    print("fonts loaded (Playfair, DM Sans, JetBrains Mono):", fonts)
    if not all(fonts):
        raise SystemExit("webfonts did not load; refusing to ship fallback-font slides")
    only = sys.argv[1:]  # optional: frame ids to (re)shoot, e.g. `python _shot.py pow-money-hammer`
    for name, fid, mods in JOBS:
        if only and fid not in only:
            continue
        page.evaluate(RESET_JS)
        for sel, action in mods:
            apply(page, "#" + fid + " " + sel, action)
        png = page.query_selector("#" + fid).screenshot()
        im = Image.open(io.BytesIO(png)).convert("RGB").resize((1920, 1080), Image.LANCZOS)
        path = os.path.join(out_dir(name), name + ".png")
        im.save(path, optimize=True)
        print("OK", path)
    b.close()
print("DONE ->", OUT_TITLE, "+", OUT_CARD)
