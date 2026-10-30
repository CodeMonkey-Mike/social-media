"""reset slide driver (slide-builder, 2026-10-29): screenshots every standalone .frame in containers.html.

Renders at device_scale_factor=2 for crisp text, then Lanczos-downsamples to exactly 1920x1080.
Slides split by TYPE (comp-build.md section 10): TITLE SLIDES -> ../title-slides/, CARD SLIDES -> ../card-slides/.
A card with timed spotlight states renders one PNG per state, <id>-s<N>.png; a card with no states is <id>.png.
card-9.1 (ANIMATED count-up) also renders its count frames <id>-n118 .. <id>-n137 between s1 (11.7) and s2 (13.8).
Run: python _shot.py [frame-id ...]   (no args = every frame)
Gates (refuses to ship): a webfont did not load, a frame is not 1920x1080, an em dash is on screen.
Content too close to the frame edge, spilling out of its card, or overflowing its row prints WARN (must be cleared).
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
W, H = 1920, 1080
OUT = {"title": os.path.abspath(os.path.join(HERE, "..", "title-slides")),
       "card": os.path.abspath(os.path.join(HERE, "..", "card-slides"))}
for _d in OUT.values():
    os.makedirs(_d, exist_ok=True)

T, C = "title", "card"
ON, DONE = "on", "done"
JOBS = []  # (png_name, frame_id, type, [(selector, op, value), ...])  op: 'add' class | 'text' set textContent


def k(key):
    return f'[data-k="{key}"]'


def add(key, cls):
    return (k(key), "add", cls)


def one(fid, typ=C):
    JOBS.append((fid, fid, typ, []))


def raw(fid, states):
    for i, mods in enumerate(states, 1):
        JOBS.append((f"{fid}-s{i}", fid, C, mods))


def seq(fid, keys, keep_done=True):
    """s1..sN: row i ON; rows before it DONE (keep_done) or back to resting (keep_done=False)."""
    states = []
    for i, key in enumerate(keys):
        mods = ([add(p, DONE) for p in keys[:i]] if keep_done else []) + [add(key, ON)]
        states.append(mods)
    raw(fid, states)


# ---- CH1 (red #C41E3A)
raw("H4", [[], [add("b1", "shrunk")], [add("b1", "shrunk"), add("b2", "shrunk")]])  # 33.57 · 35.66 · 38.38
one("H3")                                                       # 'ON PURPOSE?' (slams in at 62.76, comp motion)
one("H2")                                                       # 'WILL YOU BE ONE OF THEM?'
# ---- CH2 (gold #8F6500)
one("title-CH2", T)                                             # 99.44, holds to 100.43
seq("card-1.1+1.2", ["r1", "r2"], keep_done=False)              # 109.14 · 113.14 (the first dims)
seq("card-2.1", ["r1", "r2"])                                   # 150.82 · 155.14
seq("card-2.2", ["r1", "r2"])                                   # 162.30 · 166.76
# ---- CH3
seq("card-3.1", ["r1", "r2"])                                   # 224.70 · 228.68
raw("C1-breakout", [                                            # 297.30 · 298.04 · 299.74
    [add("hp", "lt"), add("hrp", "lt"), add("p1", DONE), add("p2", ON)],
    [add("hp", "lt"), add("hrp", "lt"), add("p1", DONE), add("p2", DONE), add("p3", ON)],
    [add("hp", "lt"), add("p1", DONE), add("p2", DONE), add("p3", DONE),
     add("hw", "lt"), add("hrw", "lt"), add("w1", ON)],
])
seq("card-4.5", ["r1", "r2"])                                   # 305.14 · 309.16
# ---- CH4
raw("card-5.1", [[], [add("r1", ON)], [add("r1", DONE), add("r2", ON)],
                 [add("r1", DONE), add("r2", DONE), add("r3", ON)]])  # 364.20 · 366.10 · 367.12 · 369.94
seq("card-6.2", ["r1", "r2"])                                   # 414.24 · 416.08
# ---- CH5
one("card-7.3")
seq("card-7.1", ["r1", "r2"])                                   # 442.76 · 445.38
raw("card-7.2", [[], [add("r1", ON)]])                          # 447.66 · 452.46
raw("card-8.3", [[], [add("r1", ON)], [add("r1", DONE), add("r2", ON)]])  # 501.40 · 503.90 · 509.12
# ---- CH6
JOBS.append(("card-9.1-s1", "card-9.1", C, []))                 # 617.64: 11.7% (sourced; never the VO's 11.1)
for v in range(118, 138):                                       # 625.32 to 626.44: the count frames 11.8 .. 13.7
    JOBS.append((f"card-9.1-n{v}", "card-9.1", C, [(k("fig"), "text", f"{v // 10}.{v % 10}%")]))
JOBS.append(("card-9.1-s2", "card-9.1", C, [(k("fig"), "text", "13.8%"), add("to", "lt")]))  # 626.44 landed
raw("card-9.3", [[], [add("h", "lt")]])                         # 647.20 · 650.16
one("card-10.3")                                                # Kaspa teal, single state
one("card-10.4")
# ---- CH7
seq("card-11.1", ["r1", "r2", "r3", "r4"])                      # 702.16 · 707.72 · 711.14 · 715.82

FONT_CHECK = """() => [
  document.fonts.check('900 84px "Playfair Display"'), document.fonts.check('700 66px "Playfair Display"'),
  document.fonts.check('italic 700 54px "Playfair Display"'),
  document.fonts.check('600 27px "DM Sans"'), document.fonts.check('500 36px "DM Sans"'),
  document.fonts.check('600 30px "JetBrains Mono"')]"""

EDGE_JS = """(fid) => {
  const f = document.getElementById(fid), fr = f.getBoundingClientRect(), bad = [];
  f.querySelectorAll('*').forEach(e => {
    if (e.classList.contains('orb')) return;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > fr.right - 60 || r.bottom > fr.bottom - 40 || r.left < fr.left + 60 || r.top < fr.top + 40))
      bad.push('edge:' + (e.className || e.tagName));
  });
  f.querySelectorAll('.card').forEach(c => {
    const cr = c.getBoundingClientRect(), cs = getComputedStyle(c);
    const L = cr.left + parseFloat(cs.paddingLeft) - 4, R = cr.right - parseFloat(cs.paddingRight) + 4;
    const B = cr.bottom - parseFloat(cs.paddingBottom) / 2;
    c.querySelectorAll('*').forEach(e => {
      if (e.classList.contains('top') || e.classList.contains('fill')) return;
      const r = e.getBoundingClientRect();
      if (r.width && (r.left < L || r.right > R || r.bottom > B))
        bad.push('card-spill:' + (e.className || e.tagName) + '@' + Math.round(r.right - cr.left) + 'x' + Math.round(r.bottom - cr.top));
    });
  });
  f.querySelectorAll('.rw,.hd,.mt,h1,.fig').forEach(e => {
    if (e.scrollWidth > e.clientWidth + 2) bad.push('overflow:' + e.className + ':' + e.textContent.trim().slice(0, 30));
  });
  return bad;
}"""

APPLY = """([fid, sel, op, val]) => {
  const root = document.getElementById(fid); const els = root.querySelectorAll(sel);
  if (!els.length) throw new Error('no match ' + fid + ' ' + sel);
  els.forEach(e => {
    if (op === 'add') e.classList.add(val);
    else if (op === 'rm') e.classList.remove(val);
    else if (op === 'text') { if (e.dataset.orig === undefined) e.dataset.orig = e.textContent; e.textContent = val; }
    else if (op === 'untext') { if (e.dataset.orig !== undefined) e.textContent = e.dataset.orig; }
  }); }"""


def box_count(im):
    """lint-deck-containers.py's large-card-box count (same thresholds)."""
    a = np.array(im).astype(int)
    bg = a[3, 3].mean(); lum = a.mean(2)
    mask = ndimage.binary_dilation(lum > bg + 5, iterations=max(2, W // 400))
    lab, n = ndimage.label(mask)
    big = 0
    for sl in ndimage.find_objects(lab):
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


def undo(page, fid, mods):
    for sel, op, val in mods:
        page.evaluate(APPLY, [fid, sel, "rm" if op == "add" else "untext", val])


if __name__ == "__main__":
    warns = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True)
        page = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        page.goto(HTML, wait_until="networkidle", timeout=90000)
        page.evaluate("() => document.fonts.ready")
        page.wait_for_timeout(1500)
        fonts = page.evaluate(FONT_CHECK)
        print("fonts loaded (Playfair 900/700/italic, DM Sans 600/500, JetBrains Mono 600):", fonts)
        if not all(fonts):
            raise SystemExit("webfonts did not load; refusing to ship fallback-font slides")
        if "—" in page.evaluate("() => document.body.innerText"):
            raise SystemExit("em dash on screen; refusing to ship")
        n = 0
        for name, fid, typ, mods in JOBS:
            if ONLY and fid not in ONLY:
                continue
            for sel, op, val in mods:
                page.evaluate(APPLY, [fid, sel, op, val])
            el = page.query_selector(f'[id="{fid}"]')
            el.scroll_into_view_if_needed()
            box = el.bounding_box()
            if (round(box["width"]), round(box["height"])) != (W, H):
                raise SystemExit(f"{fid}: frame is {box['width']}x{box['height']}, expected {W}x{H}")
            if "—" in el.inner_text():
                raise SystemExit(f"{name}: em dash on screen; refusing to ship")
            bad = page.evaluate(EDGE_JS, fid)
            if bad:
                warns.append(name)
                print("WARN", name, sorted(set(bad))[:8])
            png = el.screenshot()
            im = Image.open(io.BytesIO(png)).convert("RGB").resize((W, H), Image.LANCZOS)
            path = os.path.join(OUT[typ], name + ".png")
            im.save(path)
            nb = box_count(im)
            if nb > 1:
                warns.append(name)
                print("WARN boxes", name, nb)
            n += 1
            print("OK", typ, path, "boxes=%d" % nb)
            undo(page, fid, mods)
        b.close()
    print("DONE", n, "png ->", OUT["title"], "+", OUT["card"], "| warns:", sorted(set(warns)) or "none")
