"""_shot_portrait.py: screenshot the PORTRAIT (1080x1920) chart / diagram sources of this video's vertical cut.

    python _shot_portrait.py <charts|diagrams>/<id>.html [state ...]

Writes <id>-<state>.png (exactly 1080x1920, RGB) next to the source, plus <id>-geometry.json = the page's window.GEOMETRY
(the generator's constants) + `measured`: the box [x, y, w, h] of every data-g element in every state (the comp reads that,
never re-measures). Renders at device_scale_factor=2 and Lanczos-downsamples, like the 16:9 driver.

GATES (a failure writes no PNG for that state and exits 1):
  - every webfont on screen is loaded (Playfair Display 700/900, DM Sans 400/500/600/700, JetBrains Mono 400/600)
  - every text run sits inside the frame with a 44 px margin (the comp's 105% camera wobble crops 27 px a side, 48 top/bottom)
  - no two VISIBLE text runs overlap (opacity chain > .05), and no text run spills out of the card it sits in
"""
import io
import json
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

W, H, DSF, MARGIN = 1080, 1920, 2, 44

GATE_JS = r"""
([fid, W, H, M]) => {
  const f = document.getElementById(fid);
  const fr = f.getBoundingClientRect();
  const bad = [];
  const rel = (r) => ({ l: r.left - fr.left, t: r.top - fr.top, r: r.right - fr.left, b: r.bottom - fr.top });
  const op = (el) => { let o = 1; while (el && el !== f.parentElement) { o *= parseFloat(getComputedStyle(el).opacity || '1'); el = el.parentElement; } return o; };
  const walker = document.createTreeWalker(f, NodeFilter.SHOW_TEXT);
  const runs = [];
  let n;
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const cr of rg.getClientRects()) {
      if (cr.width < 1 || cr.height < 1) continue;
      const r = rel(cr);
      // the overlap test uses the LINE BOX (line-height tall, centred on the content area): the font's content area is
      // taller than a tight line-height, so stacked lines of one paragraph would otherwise always "overlap"
      const cs = getComputedStyle(n.parentElement);
      const lh = cs.lineHeight === 'normal' ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
      const cy = (r.t + r.b) / 2;
      const lb = { l: r.l, r: r.r, t: cy - Math.min(lh, r.b - r.t) / 2, b: cy + Math.min(lh, r.b - r.t) / 2 };
      runs.push({ r, lb, txt: n.textContent.trim().slice(0, 40), el: n.parentElement, vis: op(n.parentElement) > 0.05 });
    }
  }
  for (const u of runs) {
    const r = u.r;
    if (r.l < M || r.t < M || r.r > W - M || r.b > H - M) bad.push(`text "${u.txt}" outside the ${M}px margin: ${JSON.stringify(r)}`);
    const card = u.el.closest('.card2, .take, .chip, .callout, .pill');
    if (card && card !== u.el.closest('.pill') ) {
      const c = rel(card.getBoundingClientRect());
      if (r.l < c.l + 4 || r.r > c.r - 4 || r.t < c.t + 2 || r.b > c.b - 2) bad.push(`text "${u.txt}" spills out of its ${card.className}`);
    }
  }
  const vis = runs.filter((u) => u.vis);
  for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
    const a = vis[i].lb, b = vis[j].lb;
    const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l), oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
    if (ox > 3 && oy > 3) bad.push(`visible text overlap: "${vis[i].txt}" x "${vis[j].txt}" (${ox.toFixed(0)}x${oy.toFixed(0)})`);
  }
  return bad;
}
"""

MEASURE_JS = r"""
(fid) => {
  const f = document.getElementById(fid);
  const fr = f.getBoundingClientRect();
  const out = {};
  f.querySelectorAll('[data-g]').forEach((el) => {
    const r = el.getBoundingClientRect();
    out[el.dataset.g] = [r.left - fr.left, r.top - fr.top, r.width, r.height].map((v) => Math.round(v * 10) / 10);
  });
  return out;
}
"""

FONTS = ["900 82px 'Playfair Display'", "700 72px 'Playfair Display'", "400 28px 'DM Sans'", "500 28px 'DM Sans'",
         "600 28px 'DM Sans'", "700 40px 'DM Sans'", "400 21px 'JetBrains Mono'", "600 100px 'JetBrains Mono'"]


def main(src: Path, only):
    out_dir = src.parent
    failed = False
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=DSF)
        pg.goto(src.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for spec in FONTS:
            pg.evaluate(f'document.fonts.load("{spec}")')
        pg.wait_for_timeout(500)
        for spec in FONTS:
            if not pg.evaluate(f'document.fonts.check("{spec}")'):
                raise SystemExit(f"GATE: webfont not loaded: {spec}")
        geo = pg.evaluate("window.GEOMETRY")
        cid = geo["chart"]
        ids = pg.evaluate("[...document.querySelectorAll('.frame')].map(f => f.id)")
        geo["measured"] = {fid: pg.evaluate(MEASURE_JS, fid) for fid in ids}
        gpath = out_dir / f"{cid}-geometry.json"
        gpath.write_text(json.dumps(geo, indent=1, ensure_ascii=False), encoding="utf-8")
        print("wrote", gpath)
        for fid in ids:
            if only and fid not in only:
                continue
            bad = pg.evaluate(GATE_JS, [fid, W, H, MARGIN])
            if bad:
                failed = True
                print(f"GATE {cid}-{fid}:\n  " + "\n  ".join(bad))
                continue
            png = pg.locator(f"#{fid}").screenshot(type="png")
            im = Image.open(io.BytesIO(png)).convert("RGB")
            if im.size != (W * DSF, H * DSF):
                raise SystemExit(f"GATE {fid}: capture {im.size}")
            im = im.resize((W, H), Image.LANCZOS)
            out = out_dir / f"{cid}-{fid}.png"
            im.save(out, optimize=True)
            print("wrote", out, im.size)
        br.close()
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main(Path(sys.argv[1]).resolve(), set(sys.argv[2:]))
