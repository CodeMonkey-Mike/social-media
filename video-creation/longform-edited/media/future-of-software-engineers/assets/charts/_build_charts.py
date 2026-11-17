"""future-of-software-engineers · chart-builder driver (C1, C2 diagrams + C3, C4 animated-chart design states).

Shoots every state frame of each standalone HTML source with headless Chromium (fonts awaited, em dash refused),
writes the state PNGs next to their HTML (C1/C2 -> assets/diagrams/, C3/C4 -> assets/charts/), dumps every element's
box (data-k) per state + the HTML's own GEOM block to <id>.geometry.json, and runs the PIXEL CONTRACT: for every
consecutive pair of states it reports the bounding box of the pixels that changed, so a state swap can be checked
to touch only what the cue says (shared elements pixel-identical).

Run (from anywhere):  python _build_charts.py [C1 C2 C3 C4]      (no args = all four)
"""
import io
import json
import os
import sys

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.dirname(HERE)
PROJ = os.path.dirname(ASSETS)
PREV = os.path.join(PROJ, "_previews", "chart-build")

# id -> (folder, device scale, keep native size?)  C2 is shot at 2.25x and kept native (the comp's camera pushes
# 2.2x into one panel, so its PNGs carry 4320x2430 px: every pushed frame stays sharp). Everything else is shot at
# 2x and Lanczos-downsampled to the house 1920x1080.
JOBS = {
    "C1": ("diagrams", 2, False),
    "C2": ("diagrams", 2.25, True),
    "C3": ("charts", 2, False),
    "C4": ("charts", 2, False),
}

FONTS_JS = """Promise.all([['900','Playfair Display'],['700','DM Sans'],['600','DM Sans'],['500','DM Sans'],
  ['600','JetBrains Mono'],['400','JetBrains Mono']]
  .map(([w,f]) => document.fonts.load(w + ' 40px "' + f + '"'))).then(() => document.fonts.ready)"""
FONTS_OK = """[['900','Playfair Display'],['700','DM Sans'],['600','JetBrains Mono']]
  .filter(([w,f]) => !document.fonts.check(w + ' 40px "' + f + '"')).map(x => x[1])"""
MEASURE_JS = """(fid) => {
  const fr = document.getElementById(fid); const o = fr.getBoundingClientRect(); const out = {};
  fr.querySelectorAll('[data-k]').forEach(e => {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    out[e.dataset.k] = {x: +(r.left - o.left).toFixed(1), y: +(r.top - o.top).toFixed(1),
                        w: +r.width.toFixed(1), h: +r.height.toFixed(1),
                        visible: cs.visibility !== 'hidden' && +cs.opacity > 0.02, opacity: +cs.opacity};
  });
  return out;
}"""


def shoot(pw, cid):
    folder, scale, native = JOBS[cid]
    out_dir = os.path.join(ASSETS, folder)
    html = os.path.join(out_dir, f"{cid}.html")
    b = pw.chromium.launch()
    page = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=scale)
    page.goto("file:///" + html.replace("\\", "/"), wait_until="networkidle", timeout=90000)
    page.evaluate(FONTS_JS)
    page.wait_for_timeout(900)
    missing = page.evaluate(FONTS_OK)
    if missing:
        raise SystemExit(f"{cid}: fonts not loaded {missing}")
    states = page.evaluate("window.STATES")
    geom = page.evaluate("window.GEOM || null")
    measures, files = {}, []
    for st in states:
        fid = f"{cid}-{st}"
        txt = page.evaluate("(f) => document.getElementById(f).innerText", fid)
        if "—" in txt or "–" in txt:
            raise SystemExit(f"{fid}: em/en dash on screen")
        measures[st] = page.evaluate(MEASURE_JS, fid)
        el = page.locator(f'[id="{fid}"]')
        el.scroll_into_view_if_needed()
        im = Image.open(io.BytesIO(el.screenshot(animations="disabled"))).convert("RGB")
        if not native and im.size != (1920, 1080):
            im = im.resize((1920, 1080), Image.LANCZOS)
        p = os.path.join(out_dir, f"{fid}.png")
        im.save(p, optimize=True)
        files.append(p)
        print("PNG", os.path.relpath(p, PROJ), im.size)
    b.close()
    with open(os.path.join(out_dir, f"{cid}.geometry.json"), "w", encoding="utf-8") as f:
        json.dump({"id": cid, "stage": [1920, 1080], "png_scale": scale if native else 1, "states": states,
                   "geom": geom, "elements": measures}, f, indent=1)
    return files, states


def contract(cid, files, states):
    """Bounding box (1920-space) of the pixels that change between consecutive states."""
    folder, scale, native = JOBS[cid]
    k = scale if native else 1
    rows = []
    prev = None
    for p, st in zip(files, states):
        a = np.asarray(Image.open(p).convert("RGB"), dtype=np.int16)
        if prev is not None:
            d = np.abs(a - prev[0]).max(axis=2) > 16
            if d.any():
                ys, xs = np.where(d)
                box = [round(xs.min() / k), round(ys.min() / k), round((xs.max() + 1) / k), round((ys.max() + 1) / k)]
            else:
                box = None
            rows.append({"from": prev[1], "to": st, "changed_box": box, "changed_px": int(d.sum())})
        prev = (a, st)
    os.makedirs(PREV, exist_ok=True)
    with open(os.path.join(PREV, f"{cid}-contract.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=1)
    for r in rows:
        print(f"  {r['from']:>20} -> {r['to']:<20} changed box {r['changed_box']}  ({r['changed_px']} px)")


if __name__ == "__main__":
    ids = sys.argv[1:] or list(JOBS)
    with sync_playwright() as pw:
        for cid in ids:
            files, states = shoot(pw, cid)
            contract(cid, files, states)
