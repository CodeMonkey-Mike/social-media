"""every-job slide driver: screenshots every standalone .frame in containers.html (slide-builder).

Renders at device_scale_factor=2 for crisp text, then Lanczos-downsamples to exactly 1920x1080.
Slides split by TYPE (comp-build.md section 10): TITLE SLIDES -> ../title-slides/, CARD SLIDES -> ../card-slides/.
A card with timed spotlight states renders one PNG per state, <id>-s<N>.png; a card with no states is <id>.png.
Run: python _shot.py [frame-id ...]   (no args = every frame)
Gates (refuses to ship): a webfont did not load, a frame is not 1920x1080, an em dash is on screen.
Content closer than the safe margin to the frame edge is printed as WARN and must be cleared before shipping.
"""
import io
import os
import sys

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = "file:///" + os.path.join(HERE, "containers.html").replace("\\", "/")
ONLY = [a for a in sys.argv[1:] if not a.startswith("--")]
W, H = 1920, 1080
OUT = {"title": os.path.abspath(os.path.join(HERE, "..", "title-slides")),
       "card": os.path.abspath(os.path.join(HERE, "..", "card-slides"))}
for _d in OUT.values():
    os.makedirs(_d, exist_ok=True)

T, C = "title", "card"
ON, DONE = "on", "done"
JOBS = []  # (png_name, frame_id, type, [(selector, class), ...]); selector "" = the frame itself


def one(fid, typ=C):
    JOBS.append((fid, fid, typ, []))


def states(fid, seq, typ=C):
    for i, mods in enumerate(seq, 1):
        JOBS.append((f"{fid}-s{i}", fid, typ, mods))


def k(key):
    return f'[data-k="{key}"]'


# ---- CH1
one("black-lead")
one("hinton-quote-full")
# ---- CH2 (Halloween look)
one("title-CH2", T)
states("automation-before-now", [[("#abn-b", ON)], [("#abn-b", DONE), ("#abn-n", ON)]])
one("labor-substitution")
one("new-jobs-cliche")
one("new-jobs-dissect")
# ---- CH3 (Halloween look)
one("title-CH3", T)
one("body-vs-worker")
one("combined-knowledge")
one("math-is-brutal")
one("nine-to-five")
# ---- CH4
one("title-CH4", T)
states("C4-template", [[], [("#t1", ON)], [("#t1", DONE), ("#t2", ON)],
                       [("#t1", DONE), ("#t2", DONE), ("#t3", ON)]])
one("download-card")
one("huang-real-line")
one("C4-radiologists-note")
states("never-card", [[("#nv1", ON)], [("#nv1", DONE), ("#nv2", ON)],
                      [("#nv1", DONE), ("#nv2", DONE), ("#nv3", ON)]])
states("where-safer-leads", [[("#ws1", ON)], [("#ws1", DONE), ("#ws2", ON)],
                             [("#ws1", DONE), ("#ws2", DONE), ("#ws3", ON), ("#ws-lamp", ON), ("#ws-lbl", ON)]])
# ---- CH5
one("title-CH5", T)
one("price-collapse")
states("optimists-card", [[], [("#op-v", ON)]])
states("unemployment-4.2-forecast", [[("#u-stat", ON)], [("#u-stat", DONE), ("#u-arrow", ON)],
                                     [("#u-stat", DONE), ("#u-arrow", DONE), ("#u-q", ON)]])
# C15 = TWO list cards that BUILD AS SPOKEN (visual-qa 2026-10-07 spoiler fix). A row/tag with no class is INVISIBLE
# (opacity 0), so each state names only what has been said: ON = current spotlight, DONE = said + lit.
# SURVIVES card (survives-a, survives-b): s1 raw materials 752.96 · s2 chips 754.78 · s3 robotics 755.40 ·
#   tg3 pickaxes 756.50 | s4 water 758.94 · s5 farming 759.42 · s6 solar 760.02 · s7 experiences 761.28
# GOES EXTINCT card (extinct-a, extinct-b): header alone 764.50 · e1 health care 769.50 | e2 universities 771.60 ·
#   e3 insurance 772.48 · e4 Hollywood 776.30 · tg4 no actors 776.72
states("C15-survives-a", [
    [(k("s1"), ON)],
    [(k("s1"), DONE), (k("s2"), ON)],
    [(k("s1"), DONE), (k("s2"), DONE), (k("s3"), ON)],
    [(k("s1"), DONE), (k("s2"), DONE), (k("s3"), ON), (k("tg3"), ON)]])
SB = [(k("s1"), DONE), (k("s2"), DONE), (k("s3"), DONE), (k("tg3"), DONE)]
states("C15-survives-b", [
    SB + [(k("s4"), ON)],
    SB + [(k("s4"), DONE), (k("s5"), ON)],
    SB + [(k("s4"), DONE), (k("s5"), DONE), (k("s6"), ON)],
    SB + [(k("s4"), DONE), (k("s5"), DONE), (k("s6"), DONE), (k("s7"), ON)]])
states("C15-extinct-a", [[], [(k("e1"), ON)]])
states("C15-extinct-b", [
    [(k("e1"), DONE), (k("e2"), ON)],
    [(k("e1"), DONE), (k("e2"), DONE), (k("e3"), ON)],
    [(k("e1"), DONE), (k("e2"), DONE), (k("e3"), DONE), (k("e4"), ON)],
    [(k("e1"), DONE), (k("e2"), DONE), (k("e3"), DONE), (k("e4"), ON), (k("tg4"), ON)]])
states("survivors-tiles", [[("#sv1", ON)], [("#sv1", ON), ("#sv2", ON)],
                           [("#sv1", ON), ("#sv2", ON), ("#sv3", ON), ("#sv-sub", ON)]])
states("C15-jobs-fade", [[], [("#jf-jobs", "faded")], [("#jf-jobs", "faded"), ("#jf-q", ON)]])
states("land-energy-compute", [[("#le1", ON)], [("#le1", ON), ("#le2", ON)],
                               [("#le1", ON), ("#le2", ON), ("#le3", ON)]])
# ---- CH6
one("us-law-july-2025")
states("frozen-split", [[(k("L"), ON)], [(k("L"), DONE), (k("R"), ON)]])
# ---- CH7
one("title-CH7", T)
states("protect-yourself", [[("#pr-q", "s-on")], [("#pr-q", "s-on"), ("#pr-a", "s-on"), ("#pr-clock", "dim")]])
one("own-scarce")
states("three-reasons-1", [[], [("#r1", ON)], [("#r1", ON), ("#r1s", ON)]])
one("frozen-split-filled")
states("thesis-card", [[("", "ctrl")], [("", "open")]])
one("catch-card")
states("guard-then-deflation", [[("#gd-a", ON)], [("#gd-a", DONE), ("#gd-b", ON)]])
one("checks-card")
states("conviction-card", [[("#cv1", ON)], [("#cv1", DONE), ("#cv2", ON)],
                           [("#cv1", DONE), ("#cv2", DONE), ("#cv3", ON)]])
one("dyor-card")
# ---- CH8: the safe-jobs column strikes out one name per state (12 names, s2..s13)
RC = [("#rc-body", DONE), ("#rc-list", ON), ("#rc-col", ON)]
states("recap-list", [[("#rc-body", ON)]] +
       [RC + [(f"#rc-col li:nth-child({j})", "x") for j in range(1, n + 1)] for n in range(1, 13)])

FONT_CHECK = """() => [
  document.fonts.check('900 84px "Playfair Display"'), document.fonts.check('italic 700 50px "Playfair Display"'),
  document.fonts.check('600 27px "DM Sans"'), document.fonts.check('700 30px "JetBrains Mono"'),
  document.fonts.check('400 100px "Nosifer"')]"""

# safe margin: nothing within 60 px of the left/right edge or 40 px of the top/bottom edge
EDGE_JS = """(fid) => {
  const f = document.getElementById(fid), fr = f.getBoundingClientRect(), bad = [];
  f.querySelectorAll('*').forEach(e => {
    if (e.closest('svg') || e.classList.contains('orb') || e.classList.contains('vig')) return;
    // data-edge-ok: geometry copied 1:1 from an approved chart-builder frame (C4-radiologists source line, bottom 38)
    if (e.closest('[data-edge-ok]')) return;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > fr.right - 60 || r.bottom > fr.bottom - 40 || r.left < fr.left + 60 || r.top < fr.top + 40))
      bad.push((typeof e.className === 'string' && e.className ? e.className : e.tagName) + '@' +
               [r.left, r.top, r.right, r.bottom].map(v => Math.round(v - (v === r.left || v === r.right ? fr.left : fr.top))).join(','));
    if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden') bad.push('clip:' + e.className);
  });
  // nothing may spill past a card's inner padding box (4 px tolerance for rotated pieces / glow)
  f.querySelectorAll('.card').forEach(c => {
    const cr = c.getBoundingClientRect(), cs = getComputedStyle(c);
    const L = cr.left + parseFloat(cs.paddingLeft) - 4, R = cr.right - parseFloat(cs.paddingRight) + 4;
    const B = cr.bottom - parseFloat(cs.paddingBottom) / 2;
    c.querySelectorAll('*').forEach(e => {
      if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') return;
      if (e.classList.contains('top')) return;
      const r = e.getBoundingClientRect();
      if (r.width && (r.left < L || r.right > R || r.bottom > B))
        bad.push('card-spill:' + (typeof e.className === 'string' && e.className ? e.className : e.tagName) + '@' + Math.round(r.right - cr.left) + 'x' + Math.round(r.bottom - cr.top));
    });
  });
  return bad;
}"""

APPLY = """([fid, sel, cls, add]) => {
  const root = document.getElementById(fid); const els = sel ? root.querySelectorAll(sel) : [root];
  if (!els.length) throw new Error('no match ' + fid + ' ' + sel);
  els.forEach(e => add ? e.classList.add(cls) : e.classList.remove(cls)); }"""

if __name__ == "__main__":
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True, channel="chrome")
        page = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        page.goto(HTML, wait_until="networkidle", timeout=90000)
        page.evaluate("() => document.fonts.ready")
        page.wait_for_timeout(1500)
        fonts = page.evaluate(FONT_CHECK)
        print("fonts loaded (Playfair 900, Playfair italic, DM Sans, JetBrains Mono, Nosifer):", fonts)
        if not all(fonts):
            raise SystemExit("webfonts did not load; refusing to ship fallback-font slides")
        if "—" in page.evaluate("() => document.body.innerText"):
            raise SystemExit("em dash on screen; refusing to ship")
        n = 0
        for name, fid, typ, mods in JOBS:
            if ONLY and fid not in ONLY:
                continue
            for sel, cls in mods:
                page.evaluate(APPLY, [fid, sel, cls, True])
            el = page.query_selector(f'[id="{fid}"]')
            el.scroll_into_view_if_needed()
            box = el.bounding_box()
            if (round(box["width"]), round(box["height"])) != (W, H):
                raise SystemExit(f"{fid}: frame is {box['width']}x{box['height']}, expected {W}x{H}")
            bad = page.evaluate(EDGE_JS, fid)
            if bad and fid != "black-lead":
                print("WARN edge", name, sorted(set(bad))[:6])
            png = el.screenshot()
            im = Image.open(io.BytesIO(png)).convert("RGB").resize((W, H), Image.LANCZOS)
            path = os.path.join(OUT[typ], name + ".png")
            im.save(path, optimize=True)
            n += 1
            print("OK", typ, path)
            for sel, cls in mods:
                page.evaluate(APPLY, [fid, sel, cls, False])
        b.close()
    print("DONE", n, "png ->", OUT["title"], "+", OUT["card"])
