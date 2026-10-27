"""kcc20 slide driver (adapted from the evals driver): screenshots every standalone .frame in containers.html (slide-builder).

Renders at device_scale_factor=2 for crisp text, then Lanczos-downsamples to exactly 1920x1080.
Slides split by TYPE (comp-build.md section 10): TITLE SLIDES -> ../title-slides/, CARD SLIDES -> ../card-slides/.
A card with timed spotlight states renders one PNG per state, <id>-s<N>.png; a card with no states is <id>.png.
State s<N> = the first N-1 keys DONE (said, lit) + key N ON (current spotlight); unlit rows stay muted-but-readable.
Run: python _shot.py [frame-id ...] [--portrait]   (no args = every frame; --portrait = 1080x1920 into ../vertical/<type>/)
Gates (refuses to ship): a webfont did not load, a frame is not 1920x1080, an em dash is on screen.
Content closer than the safe margin to the frame edge, or spilling out of its card, prints WARN (must be cleared).
After rendering, each PNG is box-counted with lint-deck-containers' method (must be <= 1 large card box).
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


# ---- CH2 (cyan #00c2ff)
one("title-card-ch2", T)
one("card-rulebook")
# ---- CH4 (gold #ffd700)
one("title-card-ch4", T)
# ---- CH5 (Kaspa greenish cyan #70c7ba)
one("title-card-ch5", T)
# rows land on the words: s1 'Tokens exist today' (281.12), s2 'That shared standard does not, yet.' (282.90, held
# through the braam pause; the comp's slow push onto NOT YET runs on s2)
seq("card-not-yet", ["r1", "r2"])

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
            png = el.screenshot()
            im = Image.open(io.BytesIO(png)).convert("RGB").resize((W, H), Image.LANCZOS)
            path = os.path.join(OUT[typ], name + ".png")
            im.save(path, optimize=True)
            nb = box_count(im)
            if nb > 1:
                warns.append(name)
                print("WARN boxes", name, nb)
            n += 1
            print("OK", typ, path, "boxes=%d" % nb)
            for sel, cls in mods:
                page.evaluate(APPLY, [fid, sel, cls, False])
        b.close()
    print("DONE", n, "png ->", OUT["title"], "+", OUT["card"], "| warns:", sorted(set(warns)) or "none")
