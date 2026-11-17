"""_shot_portrait.py: screenshot the PORTRAIT (1080x1920) chart / diagram sources of this video's vertical cut.

    python _shot_portrait.py <source.html> [frame-id ...]

Writes <frame-id>.png (exactly 1080x1920, RGB) next to the source, plus <chart>-geometry.json exported from the page's
own window.GEOMETRY (the comp reads that, never re-measures). Renders at device_scale_factor=2 and Lanczos-downsamples,
like the 16:9 driver (assets/slide-sources/build_slides.py).

GATES (a failure writes nothing for that frame and exits 1):
  - every webfont on screen is loaded (Playfair Display 900, DM Sans 400/600/700, JetBrains Mono 400/600, + Montserrat
    italic 800 when the page carries the review-only payoff mock)
  - every text element / node / SVG text sits inside the frame with a 44 px margin (the comp's 105 % camera wobble
    crops 27 px a side and 48 px top/bottom), and no node label or sub-label overflows its node box
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
  const inside = (r, name) => {
    if (r.l < M || r.t < M || r.r > W - M || r.b > H - M) bad.push(`${name} outside the ${M}px safe margin: ${JSON.stringify(r)}`);
  };
  f.querySelectorAll('.hdr, .src, .lane-hd, .node, .lane').forEach((el, i) => inside(rel(el.getBoundingClientRect()), el.className + '#' + i));
  f.querySelectorAll('svg text').forEach((el, i) => {
    const r = rel(el.getBoundingClientRect());
    if (r.r - r.l > 0) inside(r, 'svg text "' + el.textContent + '"');
  });
  f.querySelectorAll('.node').forEach((n) => {
    const nr = n.getBoundingClientRect();
    n.querySelectorAll('.lb, .sb').forEach((t) => {
      const tr = t.getBoundingClientRect();
      if (tr.left < nr.left + 4 || tr.right > nr.right - 4 || tr.top < nr.top + 4 || tr.bottom > nr.bottom - 4)
        bad.push(`text "${t.textContent}" overflows node ${n.dataset.node}`);
    });
  });
  return bad;
}
"""

FONTS = ["900 82px 'Playfair Display'", "600 28px 'DM Sans'", "700 34px 'DM Sans'", "400 25px 'DM Sans'",
         "400 19px 'JetBrains Mono'", "600 56px 'JetBrains Mono'", "600 84px 'JetBrains Mono'", "700 24px 'DM Sans'"]


def main(src: Path, only):
    out_dir = src.parent
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=DSF)
        pg.goto(src.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        fonts = list(FONTS)
        if pg.evaluate("!!document.querySelector('.kt-preview')"):
            fonts.append("italic 800 180px Montserrat")
        for spec in fonts:
            pg.evaluate(f'document.fonts.load("{spec}")')
        pg.wait_for_timeout(400)
        for spec in fonts:
            if not pg.evaluate(f'document.fonts.check("{spec}")'):
                raise SystemExit(f"GATE: webfont not loaded: {spec}")
        pg.evaluate("window.fitPlates ? window.fitPlates() : null")  # size any label plate off the loaded fonts
        geo = pg.evaluate("window.GEOMETRY")
        gpath = out_dir / f"{geo['chart']}-geometry.json"
        gpath.write_text(json.dumps(geo, indent=1, ensure_ascii=False), encoding="utf-8")
        print("wrote", gpath)
        ids = pg.evaluate("[...document.querySelectorAll('.frame')].map(f => f.id)")
        failed = False
        for fid in ids:
            if only and fid not in only:
                continue
            bad = pg.evaluate(GATE_JS, [fid, W, H, MARGIN])
            if bad:
                failed = True
                print(f"GATE {fid}:\n  " + "\n  ".join(bad))
                continue
            png = pg.locator(f"#{fid}").screenshot(type="png")
            im = Image.open(io.BytesIO(png)).convert("RGB")
            if im.size != (W * DSF, H * DSF):
                raise SystemExit(f"GATE {fid}: capture {im.size}")
            im = im.resize((W, H), Image.LANCZOS)
            out = out_dir / f"{fid}.png"
            im.save(out, optimize=True)
            print("wrote", out, im.size)
        br.close()
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main(Path(sys.argv[1]).resolve(), set(sys.argv[2:]))
