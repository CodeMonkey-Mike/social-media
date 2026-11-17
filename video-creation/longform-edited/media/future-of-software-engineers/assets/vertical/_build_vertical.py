"""future-of-software-engineers · VERTICAL chart-builder driver (C1, C2 diagrams + C3, C4 animated-chart design states).

Portrait twin of ../charts/_build_charts.py. Shoots every state frame of each portrait HTML source (1080x1920) with headless
Chromium at device scale 2, Lanczos-downsamples to exactly 1080x1920, and writes <id>-<state>.png next to its HTML
(C1/C2 -> vertical/diagrams/, C3/C4 -> vertical/charts/), plus <id>.geometry.json (the HTML's own GEOM block + every
data-k element's box per state). Then the PIXEL CONTRACT: for every consecutive pair of states, the bounding box of the
pixels that changed (written to _previews/chart-build-vertical/<id>-contract.json).

GATES (a failing state writes no PNG; the run exits 1):
  - every webfont on screen is loaded (Playfair Display 900, DM Sans 500/600/700, JetBrains Mono 400/600)
  - no em dash or en dash on screen
  - every visible text run sits inside the frame with a 48 px margin (the comp's slow push crops up to ~3%)
  - no two VISIBLE text runs overlap (line boxes, opacity chain > .05, visibility honoured; runs inside ONE element
    marked data-kern, e.g. the tightened minus of the -7% label, are one label and exempt)

Run:  python _build_vertical.py [C1 C2 C3 C4]      (no args = all four)
"""
import io
import json
import os
import sys

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))          # assets/vertical
PROJ = os.path.dirname(os.path.dirname(HERE))
PREV = os.path.join(PROJ, "_previews", "chart-build-vertical")
W, H, DSF, MARGIN = 1080, 1920, 2, 48
JOBS = {"C1": "diagrams", "C2": "diagrams", "C3": "charts", "C4": "charts"}

FONTS_JS = """Promise.all([['900','Playfair Display'],['700','DM Sans'],['600','DM Sans'],['500','DM Sans'],
  ['600','JetBrains Mono'],['400','JetBrains Mono']]
  .map(([w,f]) => document.fonts.load(w + ' 40px "' + f + '"'))).then(() => document.fonts.ready)"""
FONTS_OK = """[['900','Playfair Display'],['700','DM Sans'],['600','DM Sans'],['500','DM Sans'],['600','JetBrains Mono'],['400','JetBrains Mono']]
  .filter(([w,f]) => !document.fonts.check(w + ' 40px "' + f + '"')).map(x => x.join(' '))"""
MEASURE_JS = """(fid) => {
  const fr = document.getElementById(fid); const o = fr.getBoundingClientRect(); const out = {};
  fr.querySelectorAll('[data-k]').forEach(e => {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    let op = 1, el = e; while (el && el !== fr) { op *= +getComputedStyle(el).opacity; el = el.parentElement; }
    out[e.dataset.k] = {x: +(r.left - o.left).toFixed(1), y: +(r.top - o.top).toFixed(1),
                        w: +r.width.toFixed(1), h: +r.height.toFixed(1),
                        visible: cs.visibility !== 'hidden' && op > 0.02, opacity: +op.toFixed(3)};
  });
  return out;
}"""
GATE_JS = r"""
([fid, W, H, M]) => {
  const f = document.getElementById(fid);
  const fr = f.getBoundingClientRect();
  const bad = [];
  const rel = (r) => ({ l: r.left - fr.left, t: r.top - fr.top, r: r.right - fr.left, b: r.bottom - fr.top });
  const op = (el) => { let o = 1; while (el && el !== f.parentElement) { o *= parseFloat(getComputedStyle(el).opacity || '1'); el = el.parentElement; } return o; };
  const runs = [];
  const seenSvg = new Set();
  const walker = document.createTreeWalker(f, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue;
    const pe = n.parentElement;
    const cs = getComputedStyle(pe);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (cs.color === 'rgba(0, 0, 0, 0)' || cs.color === 'transparent') continue;
    const o = op(pe);
    if (pe instanceof SVGElement) {
      const te = pe.closest('text');
      if (!te || seenSvg.has(te)) continue;
      seenSvg.add(te);
      if (getComputedStyle(te).visibility === 'hidden') continue;
      const r = rel(te.getBoundingClientRect());
      const fs = parseFloat(te.getAttribute('font-size') || cs.fontSize);
      const cy = (r.t + r.b) / 2, lh = Math.min(fs * 1.05, r.b - r.t);
      runs.push({ r, lb: { l: r.l, r: r.r, t: cy - lh / 2, b: cy + lh / 2 }, txt: te.textContent.trim().slice(0, 40), vis: o > 0.05 });
      continue;
    }
    const rg = document.createRange(); rg.selectNodeContents(n);
    const lhCss = cs.lineHeight === 'normal' ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
    for (const cr of rg.getClientRects()) {
      if (cr.width < 1 || cr.height < 1) continue;
      const r = rel(cr);
      const cy = (r.t + r.b) / 2, lh = Math.min(lhCss, r.b - r.t, parseFloat(cs.fontSize) * 1.05);
      runs.push({ r, lb: { l: r.l, r: r.r, t: cy - lh / 2, b: cy + lh / 2 }, txt: n.textContent.trim().slice(0, 40), vis: o > 0.05, kern: pe.closest('[data-kern]') });
    }
  }
  for (const u of runs) {
    if (!u.vis) continue;
    const r = u.r;
    if (r.l < M || r.t < M || r.r > W - M || r.b > H - M) bad.push(`text "${u.txt}" outside the ${M}px margin: ${JSON.stringify(r)}`);
  }
  const vis = runs.filter((u) => u.vis);
  for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
    if (vis[i].kern && vis[i].kern === vis[j].kern) continue;   // one label's own deliberately kerned glyphs (e.g. the tightened minus)
    const a = vis[i].lb, b = vis[j].lb;
    const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l), oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
    if (ox > 2 && oy > 2) bad.push(`visible text overlap: "${vis[i].txt}" x "${vis[j].txt}" (${ox.toFixed(0)}x${oy.toFixed(0)})`);
  }
  return bad;
}
"""


def shoot(pw, cid):
    out_dir = os.path.join(HERE, JOBS[cid])
    html = os.path.join(out_dir, f"{cid}.html")
    b = pw.chromium.launch()
    page = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=DSF)
    page.goto("file:///" + html.replace("\\", "/"), wait_until="networkidle", timeout=90000)
    page.evaluate(FONTS_JS)
    page.wait_for_timeout(900)
    missing = page.evaluate(FONTS_OK)
    if missing:
        raise SystemExit(f"{cid}: fonts not loaded {missing}")
    states = page.evaluate("window.STATES")
    geom = page.evaluate("window.GEOM || null")
    measures, files, failed = {}, [], []
    for st in states:
        fid = f"{cid}-{st}"
        txt = page.evaluate("(f) => document.getElementById(f).innerText", fid)
        if "—" in txt or "–" in txt:
            raise SystemExit(f"{fid}: em/en dash on screen")
        bad = page.evaluate(GATE_JS, [fid, W, H, MARGIN])
        if bad:
            failed.append(fid)
            print(f"GATE {fid}:\n  " + "\n  ".join(bad))
            continue
        measures[st] = page.evaluate(MEASURE_JS, fid)
        el = page.locator(f'[id="{fid}"]')
        el.scroll_into_view_if_needed()
        im = Image.open(io.BytesIO(el.screenshot(animations="disabled"))).convert("RGB")
        if im.size != (W * DSF, H * DSF):
            raise SystemExit(f"{fid}: capture {im.size}")
        im = im.resize((W, H), Image.LANCZOS)
        p = os.path.join(out_dir, f"{fid}.png")
        im.save(p, optimize=True)
        files.append(p)
        print("PNG", os.path.relpath(p, PROJ), im.size)
    b.close()
    with open(os.path.join(out_dir, f"{cid}.geometry.json"), "w", encoding="utf-8") as f:
        json.dump({"id": cid, "stage": [W, H], "png_scale": 1, "states": states, "geom": geom, "elements": measures},
                  f, indent=1)
    return files, states, failed


def contract(cid, files, states):
    """Bounding box (stage px) of the pixels that change between consecutive states."""
    rows, prev = [], None
    for p, st in zip(files, states):
        a = np.asarray(Image.open(p).convert("RGB"), dtype=np.int16)
        if prev is not None:
            d = np.abs(a - prev[0]).max(axis=2) > 16
            box = None
            if d.any():
                ys, xs = np.where(d)
                box = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
            rows.append({"from": prev[1], "to": st, "changed_box": box, "changed_px": int(d.sum())})
        prev = (a, st)
    os.makedirs(PREV, exist_ok=True)
    with open(os.path.join(PREV, f"{cid}-contract.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=1)
    for r in rows:
        print(f"  {r['from']:>20} -> {r['to']:<20} changed box {r['changed_box']}  ({r['changed_px']} px)")


if __name__ == "__main__":
    ids = sys.argv[1:] or list(JOBS)
    bad_any = False
    with sync_playwright() as pw:
        for cid in ids:
            files, states, failed = shoot(pw, cid)
            if failed:
                bad_any = True
                continue
            contract(cid, files, states)
    sys.exit(1 if bad_any else 0)
