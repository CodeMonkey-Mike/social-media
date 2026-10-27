"""only-18-months-left slide driver (adapted from the evals driver): screenshots every standalone .frame in containers.html (slide-builder).

Renders at device_scale_factor=2 for crisp text, then Lanczos-downsamples to exactly 1920x1080.
Slides split by TYPE (comp-build.md section 10): TITLE SLIDES -> ../title-slides/, CARD SLIDES -> ../card-slides/.
A card with timed spotlight states renders one PNG per state, <id>-s<N>.png; a card with no states is <id>.png.
State s<N> = the first N-1 keys DONE (said, lit) + key N ON (current spotlight); unlit rows stay muted-but-readable.
Run: python _shot.py [frame-id ...] [--portrait]   (no args = every frame; --portrait = 1080x1920 into ../vertical/<type>/)
Gates (refuses to ship): a webfont did not load, a frame is not 1920x1080, an em dash is on screen.
Content closer than the safe margin to the frame edge, or spilling out of its card, prints WARN (must be cleared).
After rendering, each PNG is box-counted with lint-deck-containers' method (must be <= 1 large card box).
OVERLAY frames (the ALPHA set, e.g. the end card) are shot omit_background with the page bg cleared (html.alpha) and saved
RGBA: a transparent PNG the comp lays OVER the shot below it.
"""
import io
import os
import sys

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = "file:///" + os.path.join(HERE, "containers.html").replace("\\", "/")
ONLY = [a for a in sys.argv[1:] if not a.startswith("--")]
PORTRAIT = "--portrait" in sys.argv  # vertical-repurpose.md §1: same source re-shot at 1080x1920 (portrait @media reflow)
W, H = (1080, 1920) if PORTRAIT else (1920, 1080)
_ROOT = os.path.join(HERE, "..", "vertical") if PORTRAIT else os.path.join(HERE, "..")
OUT = {"title": os.path.abspath(os.path.join(_ROOT, "title-slides")),
       "card": os.path.abspath(os.path.join(_ROOT, "card-slides"))}
for _d in OUT.values():
    os.makedirs(_d, exist_ok=True)

T, C = "title", "card"
ON, DONE = "on", "done"
JOBS = []  # (png_name, frame_id, type, [(selector, class), ...])


def k(key):
    return f'[data-k="{key}"]'


def one(fid, typ=C):
    JOBS.append((fid, fid, typ, []))


def seq(fid, keys, extra=None):
    """s1..sN: key i ON, keys before it DONE. extra = {state_index: [(sel, cls)]} added mods."""
    for i, key in enumerate(keys):
        mods = [(k(p), DONE) for p in keys[:i]] + [(k(key), ON)]
        mods += (extra or {}).get(i + 1, [])
        JOBS.append((f"{fid}-s{i + 1}", fid, C, mods))


def raw(fid, seqmods):
    for i, mods in enumerate(seqmods, 1):
        JOBS.append((f"{fid}-s{i}", fid, C, mods))


# ---- CH1 (red #ff4060)
one("h0-next-wave-card")
one("rl-skeleton")
# ---- CH2 (gold #ffd700)
one("title-CH2", T)
one("RL-1-copywriters")
seq("C8-price-card", ["r1", "r2"])            # s1 $50 struck (112.23) · s2 ONE SMALL SUBSCRIPTION lands
one("RL-2-graphic-designers")
# ---- CH3 / CH4 (purple #a855f7)
one("title-CH3", T)
one("RL-3-video-editors")
seq("human-touch-card", ["r1", "r2"])         # s1 might not entirely disappear · s2 so rare (212.23)
one("RL-4-actors-models")
# ---- CH5 / CH6 (cyan #00c2ff)
one("arg-1-information")
seq("C19-university-card", ["r1", "r2", "r3"])  # 298.09 / 304.33 / 307.93
one("RL-5-university-jobs")
one("ch6-four-skeletons")
one("RL-6-bookkeepers")
one("RL-7-accountants")
one("RL-8-paralegals")
one("RL-9-lawyers")
# ---- CH7 (green #00e68a)
one("title-CH7", T)
# C27 = one progressive list over its 6 beats: s1 opens (dates only) · s2..s5 items 1-4 land · s6 all four held + WATERLOO 2025
raw("C27-last-30-days", [
    [],
    [(k("r1"), ON)],
    [(k("r1"), DONE), (k("r2"), ON)],
    [(k("r1"), DONE), (k("r2"), DONE), (k("r3"), ON)],
    [(k("r1"), DONE), (k("r2"), DONE), (k("r3"), DONE), (k("r4"), ON)],
    [(k("r1"), DONE), (k("r2"), DONE), (k("r3"), DONE), (k("r4"), DONE), (k("r5"), ON)],
])
seq("weeks-to-a-day-card", ["r1", "r2"])      # s1 4 TO 6 WEEKS · s2 A SINGLE DAY
# ---- CH8 (red #ff4060)
one("title-CH8", T)
seq("coin-marks", ["m1", "m2", "m3"])         # BITCOIN 564.09 · KASPA 565.25 · TAO 565.83
# ladder: s1 all resting (579.73) · s2 ALREADY GONE (583.27) · s3 NEXT (585.03) · s4 ON THE CLOCK (587.67) · s5 THE TURN (590.73)
raw("risk-ladder-overview", [
    [],
    [(k("g1"), ON)],
    [(k("g1"), DONE), (k("g2"), ON)],
    [(k("g1"), DONE), (k("g2"), DONE), (k("g3"), ON)],
    [(k("g1"), DONE), (k("g2"), DONE), (k("g3"), DONE), (k("g4"), ON)],
])
one("cryptorich-card")
one("comment-card")
one("end-card")                               # OVERLAY: corner logo bug + lower-third band, transparent
ALPHA = {"end-card"}                          # frame ids shot as transparent RGBA overlays (omit_background)

FONT_CHECK = """() => [
  document.fonts.check('900 84px "Playfair Display"'),
  document.fonts.check('600 27px "DM Sans"'), document.fonts.check('700 30px "JetBrains Mono"')]"""

EDGE_JS = """(fid) => {
  const f = document.getElementById(fid), fr = f.getBoundingClientRect(), bad = [];
  f.querySelectorAll('*').forEach(e => {
    if (e.closest('svg') || e.closest('.deco') || e.classList.contains('orb')) return;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > fr.right - 60 || r.bottom > fr.bottom - 40 || r.left < fr.left + 60 || r.top < fr.top + 40))
      bad.push('edge:' + (typeof e.className === 'string' && e.className ? e.className : e.tagName));
  });
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
  // text overflowing its own box (wrapped chips, clipped words)
  f.querySelectorAll('.chip,.rw,.lbl,.nm,.box,.tag').forEach(e => {
    if (e.scrollWidth > e.clientWidth + 2) bad.push('overflow:' + e.className + ':' + e.textContent.trim().slice(0, 30));
  });
  return bad;
}"""

APPLY = """([fid, sel, cls, add]) => {
  const root = document.getElementById(fid); const els = sel ? root.querySelectorAll(sel) : [root];
  if (!els.length) throw new Error('no match ' + fid + ' ' + sel);
  els.forEach(e => add ? e.classList.add(cls) : e.classList.remove(cls)); }"""


def box_count(im):
    """lint-deck-containers.py's large-card-box count (same thresholds)."""
    a = np.array(im).astype(int)
    bg = a[3, 3].mean(); lum = a.mean(2)
    mask = ndimage.binary_dilation(lum > bg + 5, iterations=max(2, W // 400))
    lab, n = ndimage.label(mask)
    big = 0
    for sl in ndimage.find_objects(lab):  # same bbox per component as np.where(lab == i), without the O(n*px) scan
        if sl is None:
            continue
        ys0, ys1, xs0, xs1 = sl[0].start, sl[0].stop - 1, sl[1].start, sl[1].stop - 1
        if not ((xs1 - xs0) > 0.25 * W and (ys1 - ys0) > 0.12 * H):
            continue
        box = lum[ys0:ys1, xs0:xs1]
        if box.size and np.abs(np.diff(box, axis=1)).mean() < 1.0:
            continue
        big += 1
    return big


if __name__ == "__main__":
    warns = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True, channel="chrome")
        page = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        page.goto(HTML, wait_until="networkidle", timeout=90000)
        page.evaluate("() => document.fonts.ready")
        page.wait_for_timeout(1500)
        fonts = page.evaluate(FONT_CHECK)
        print("fonts loaded (Playfair 900, DM Sans, JetBrains Mono):", fonts)
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
            if bad:
                warns.append(name)
                print("WARN", name, sorted(set(bad))[:8])
            alpha = fid in ALPHA
            if alpha:
                page.evaluate("() => document.documentElement.classList.add('alpha')")
            png = el.screenshot(omit_background=alpha)
            if alpha:
                page.evaluate("() => document.documentElement.classList.remove('alpha')")
            im = Image.open(io.BytesIO(png)).convert("RGBA" if alpha else "RGB").resize((W, H), Image.LANCZOS)
            path = os.path.join(OUT[typ], name + ".png")
            im.save(path, optimize=True)
            nb = box_count(im.convert("RGB"))
            if nb > 1:
                warns.append(name)
                print("WARN boxes", name, nb)
            n += 1
            print("OK", typ, path, "boxes=%d" % nb)
            for sel, cls in mods:
                page.evaluate(APPLY, [fid, sel, cls, False])
        b.close()
    print("DONE", n, "png ->", OUT["title"], "+", OUT["card"], "| warns:", sorted(set(warns)) or "none")
