"""QA of the VERTICAL (1080 x 1920) longest-bear animated charts (chart-builder, 2026-11-25).

python qa_vertical.py [--states]      (from anywhere; paths are resolved from this file)

The vertical pages are assets/vertical/charts/{longest-clock,two-legs,two-legs-2}.html, twins of the 16:9 pages in
assets/charts/. Checks, each printed as a PASS / FAIL line and saved in qa-vertical.json:
 1. TIMELINE IDENTITY: the vertical page's T (and DUR) blocks are the 16:9 page's, character for character; and the
    page plays the SAME timeline at every frame of its window: two-legs pages, stateAt(f / 30) identical for every f;
    longest-clock, every counter, every label's opacity and rise, every bar's height (as a fraction of its full height),
    the baseline and the dashed line's progress, identical at every f (to 1e-4).
 2. STILLS: a full frame just before and 0.5 s after each cue word, the last frame, and a contact sheet per chart.
 3. SEAM: part 1's last frame (its page stepped through every frame of its window first, as html_clip.py does) against
    part 2's frame 0 (a fresh page: its load-time end state, then setT(0), as html_clip.py does): pixel identical.
 4. HOLD: frames after the last move are pixel identical to the last frame.
 5. WORDS: the visible words and figures of each end state are the 16:9 end state's, token for token.
 6. LAYOUT: no two label boxes overlap; no label touches a drawn line or a mark; every label inside the 72 px side
    margins; the lowest drawn content of every frame stays above y 1500 (the phone's lower-third interface).
 7. DATA: btc-closes.js in the vertical folder is a byte copy of the 16:9 one (sha256).
--states also writes the design-state stills next to the pages (the 16:9 set's names).
Window lengths are cover_runs.py's plan for the current cues.json (longest-clock 648, two-legs 1562, two-legs-2 759).
"""
import argparse
import hashlib
import io
import json
import math
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
PROJ = HERE.parent.parent
VDIR = PROJ / "assets" / "vertical" / "charts"
WDIR = PROJ / "assets" / "charts"
FPS = 30
VW, VH = 1080, 1920
WW, WH = 1920, 1080
LOWER_LIMIT = 1500            # px: nothing drawn below this (the phone's lower-third interface)
MARGIN = (70, 1010)           # px: the 72 px side margins, 2 px of glyph overshoot allowed

# (word as said, spine onset, what lands on it) per chart; page t = spine - origin, the origin the T block was cued to
# (the page comments: spine 46.40, 135.333, 205.167). Frames = cover_runs.py's plan (Job(...).plan) for cues.json now.
CHARTS = {
    "longest-clock": {"origin": 46.40, "frames": 648, "cues": [
        ("2013 (to 2014)", 51.44, "label 2013-14"),
        ("406", 54.11, "bar 1 lands at 406"),
        ("2018", 55.57, "label 2017-18"),
        ("364", 57.30, "bar 2 lands at 364"),
        ("(and) 2022", 59.10, "label 2021-22"),
        ("378", 60.77, "bar 3 lands at 378"),
        ("this (one)", 62.38, "NOW, DAYS SINCE THE TOP, dashed line, 406 tag"),
        ("has (already)", 63.10, "gold bar starts growing"),
        ("passed", 63.86, "gold bar passes 364"),
        ("(every) one", 64.85, "gold bar passes 406"),
        ("them", 65.13, "gold bar lands at 415"),
        ("that's (the case)", 65.70, "STILL COUNTING"),
    ]},
    "two-legs": {"origin": 4060 / 30, "frames": 1562, "cues": [
        ("(so the) top", 135.90, "TOP dot"),
        ("October (6th 2025)", 137.08, "TOP / OCT 6, 2025"),
        ("(closed) below", 142.80, "line crosses under the gold, Nov 4"),
        ("50(-week)", 143.24, "gold line glows, legend row lights"),
        ("(November) 16th", 146.86, "line reaches Nov 16, ring"),
        ("(November) 23rd", 148.22, "line reaches Nov 23, ring, BEAR CONFIRMED + leader"),
        ("it (bottomed)", 149.01, "the fall starts"),
        ("(June) 30th", 150.20, "line lands on Jun 30, bottom dot"),
        ("267 (days)", 152.86, "LEG 1 / 267 DAYS"),
        ("53 (%)", 156.02, "-53%"),
        ("Bitcoin (rally)", 157.93, "the rise starts"),
        ("48 (%)", 158.96, "rally top, +48%"),
        ("86 (,000)", 160.64, "TO 86K"),
        ("(from) September (18th)", 165.33, "gold opens on Sep 18, line draws on"),
        ("(November) 7th", 167.66, "line stops on Nov 7"),
        ("above (those averages)", 169.08, "bracket, ABOVE BOTH"),
        ("51 (days)", 171.25, "51 DAYS"),
        ("(was) over", 177.10, "ABOVE BOTH glows once"),
    ]},
    "two-legs-2": {"origin": 6155 / 30, "frames": 759, "cues": [
        ("lost (both averages)", 205.96, "line draws on from Nov 7"),
        ("(November) 12th", 209.04, "line at Nov 12, ring"),
        ("two (weeks old)", 212.26, "line at the read date, LEG 2 / 2 WEEKS OLD"),
        ("32 (%)", 214.62, "-32% FROM 86K"),
        ("Two (bear markets)", 217.33, "falls turn red, both legs glow"),
        ("200 (week)", 223.34, "nothing new: the payoff holds"),
    ]},
}
# the design-state stills, the 16:9 set's names (page t of each state)
STATES = {
    "longest-clock": [("start", 2.0), ("three-bars", 15.5), ("passing", 18.3), ("end", 647 / 30)],
    "two-legs": [("top", 2.15), ("below", 8.4), ("confirmed", 13.5), ("leg1", 21.2), ("rally", 26.0), ("end", 1561 / 30)],
    "two-legs-2": [("lost-both", 4.4), ("leg2", 10.2), ("end", 758 / 30)],
}

CLOCK_SIG = r"""
(args) => {
  const [n, fps, hmax, bx, xref] = args;
  const svg = document.getElementById('plot');
  const texts = Array.from(svg.querySelectorAll('text'));   // refTag, num1, year1, num2, year2, num3, year3, nowNum, nowLbl, cap1, cap2
  const paths = Array.from(svg.querySelectorAll('path'));   // refLine, sep, base, bar1, cap1, bar2, cap2, bar3, cap3, nowBar, nowCap
  const eff = (el) => { let o = 1, e = el; while (e && e !== svg) { const a = e.getAttribute('opacity'); if (a !== null) o *= parseFloat(a); e = e.parentNode; } return o; };
  const ty = (el) => { const m = /translate\(0,([-0-9.]+)\)/.exec(el.parentNode.getAttribute('transform') || ''); return m ? parseFloat(m[1]) : 0; };
  const ey = document.getElementById('ey'), h1 = document.getElementById('h1'), dv = document.getElementById('divider'),
        src = document.getElementById('src'), orb = document.getElementById('orbGold');
  const out = [];
  for (let f = 0; f < n; f++) {
    window.setT(f / fps);
    out.push({
      txt: texts.map(t => t.textContent), fill: texts.map(t => t.getAttribute('fill')),
      op: texts.map(t => eff(t)), rise: texts.map(t => ty(t)),
      bars: [3, 5, 7, 9].map(i => paths[i].getAttribute('d') === 'M0,0' ? 0 : paths[i].getBBox().height / hmax),
      barOp: [3, 5, 7].map(i => paths[i].getAttribute('opacity')),
      caps: [4, 6, 8].map(i => paths[i].getAttribute('stroke') + '|' + paths[i].getAttribute('stroke-opacity')),
      base: paths[2].getAttribute('opacity') === '0' ? -1 : paths[2].getBBox().width / (bx[1] - bx[0]),
      ref: paths[0].getAttribute('opacity') === '0' ? -1 : paths[0].getBBox().width / (xref[1] - xref[0]),
      sep: paths[1].getAttribute('opacity'),
      head: [ey.style.opacity, h1.style.opacity, h1.style.transform, dv.style.width, src.style.opacity, orb.style.opacity].join('|')
    });
  }
  return out;
}
"""

STATES_JS = r"""
(args) => { const [n, fps] = args; const out = []; for (let f = 0; f < n; f++) out.push(JSON.stringify(window.stateAt(f / fps))); return out; }
"""

WORDS_JS = r"""
() => {
  const svg = document.getElementById('plot');
  const eff = (el) => { let o = 1, e = el; while (e && e !== svg) { const a = e.getAttribute('opacity'); if (a !== null) o *= parseFloat(a); e = e.parentNode; } return o; };
  const words = [];
  svg.querySelectorAll('text').forEach(t => {
    if (eff(t) < 0.01) return;
    const tfo = t.getAttribute('fill-opacity');
    if (tfo !== null && parseFloat(tfo) < 0.01) return;
    const spans = t.querySelectorAll('tspan');
    if (!spans.length) { words.push(t.textContent); return; }
    spans.forEach(s => { const fo = s.getAttribute('fill-opacity'); if (fo === null || parseFloat(fo) >= 0.01) words.push(s.textContent); });
  });
  ['ey', 'h1', 'src'].forEach(id => { const e = document.getElementById(id); if (parseFloat(getComputedStyle(e).opacity) >= 0.01) words.push(e.textContent); });
  return words;
}
"""


def tokens(strings):
    out = []
    for s in strings:
        out += re.sub(r"\s+", " ", s).strip().split(" ")
    return sorted(t for t in out if t)


def open_page(br, path, w, h):
    pg = br.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
    pg.goto(Path(path).resolve().as_uri())
    pg.wait_for_load_state("networkidle")
    pg.evaluate("document.fonts.ready")
    assert pg.evaluate("typeof window.setT === 'function'"), path
    anim = pg.evaluate("document.getAnimations ? document.getAnimations().length : 0")
    assert anim == 0, f"{path}: {anim} running CSS animations"
    return pg


def shot(pg, t):
    pg.evaluate(f"window.setT({t:.6f})")
    return np.asarray(Image.open(io.BytesIO(pg.screenshot())).convert("RGB"))


def same(a, b):
    d = np.abs(a.astype(np.int16) - b.astype(np.int16))
    return int((d.max(axis=2) > 0).sum()), int(d.max())


def lowest_ink(img, thr=60):
    """The lowest row holding a drawn mark or glyph (luminance over thr; the grain and the faint orbs stay under it)."""
    lum = img.astype(np.float32) @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    rows = np.where((lum > thr).any(axis=1))[0]
    return int(rows.max()) if len(rows) else -1


def font(sz):
    for f in ("C:/Windows/Fonts/consola.ttf", "C:/Windows/Fonts/arial.ttf"):
        try:
            return ImageFont.truetype(f, sz)
        except OSError:
            pass
    return ImageFont.load_default()


def seg_box_dist(p, q, b):
    """Distance from segment pq to box b (0 when they touch or cross), sampled finely: enough for 2 px label checks."""
    best = 1e9
    n = max(2, int(math.hypot(q[0] - p[0], q[1] - p[1]) / 1.5) + 1)
    for i in range(n + 1):
        x = p[0] + (q[0] - p[0]) * i / n
        y = p[1] + (q[1] - p[1]) * i / n
        dx = max(b["x0"] - x, 0, x - b["x1"])
        dy = max(b["y0"] - y, 0, y - b["y1"])
        best = min(best, math.hypot(dx, dy))
        if best == 0:
            return 0.0
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--states", action="store_true", help="also write the design-state stills next to the vertical pages")
    a = ap.parse_args()
    out = HERE
    rep, fails = {}, []

    def check(name, ok, detail=""):
        print(f"{'PASS' if ok else 'FAIL'}  {name}" + (f": {detail}" if detail else ""))
        rep.setdefault("checks", []).append({"check": name, "ok": bool(ok), "detail": detail})
        if not ok:
            fails.append(name)

    # 7. the data copy
    h_w = hashlib.sha256((WDIR / "btc-closes.js").read_bytes()).hexdigest()
    h_v = hashlib.sha256((VDIR / "btc-closes.js").read_bytes()).hexdigest()
    check("data: vertical btc-closes.js is a byte copy of the 16:9 one", h_w == h_v, h_v[:16])

    # 1a. the T / DUR blocks, character for character (and the cursor knots and stateAt of the two-legs pages)
    def block(text, start, end_pat):
        i = text.index(start)
        j = text.index(end_pat, i) + len(end_pat)
        return text[i:j]
    for name in CHARTS:
        tw = (WDIR / f"{name}.html").read_text(encoding="utf-8").replace("\r\n", "\n")
        tv = (VDIR / f"{name}.html").read_text(encoding="utf-8").replace("\r\n", "\n")
        parts = [("var T = {", "\n};")]
        if name == "longest-clock":
            parts.append(("var DUR = {", "};"))
        else:
            parts += [("var cursor = ", ");\n"), ("function stateAt(t) {", "\n}\n")]
        for s, e in parts:
            check(f"{name}: `{s.strip()}` block identical to the 16:9 page", block(tw, s, e) == block(tv, s, e))
        check(f"{name}: no em dash in the vertical page", "\u2014" not in tv)
    for f in ("two-legs-core.js", "chart-base.css"):
        check(f"{f}: no em dash", "\u2014" not in (VDIR / f).read_text(encoding="utf-8"))

    shots = {}
    with sync_playwright() as p:
        br = p.chromium.launch()
        for name, C in CHARTS.items():
            N, O = C["frames"], C["origin"]
            print(f"\n===== {name}: {N} frames, last frame t = {(N - 1) / FPS:.3f}")
            pv = open_page(br, VDIR / f"{name}.html", VW, VH)
            pw = open_page(br, WDIR / f"{name}.html", WW, WH)
            check(f"{name}: window.T identical", pv.evaluate("JSON.stringify(window.T)") == pw.evaluate("JSON.stringify(window.T)"))

            # 1b. the same timeline at every frame
            if name == "longest-clock":
                gv = pv.evaluate("window.Clock.qa().geom")
                sv = pv.evaluate(CLOCK_SIG, [N, FPS, gv["HMAX"], [gv["CX"][0] - gv["BW"] / 2 - 24, gv["CXN"] + gv["BW"] / 2 + 24],
                                             [gv["CX"][0] - gv["BW"] / 2, gv["CXN"] + gv["BW"] / 2]])
                sw = pw.evaluate(CLOCK_SIG, [N, FPS, 520, [230, 1650], [260, 1620]])
                bad = []
                for f, (x, y) in enumerate(zip(sv, sw)):
                    for k in x:
                        u, v = x[k], y[k]
                        if isinstance(u, list) and u and isinstance(u[0], (int, float)):
                            if any(abs(i - j) > 1e-4 for i, j in zip(u, v)):
                                bad.append((f, k, u, v))
                        elif isinstance(u, (int, float)):
                            if abs(u - v) > 1e-4:
                                bad.append((f, k, u, v))
                        elif u != v:
                            bad.append((f, k, u, v))
                check(f"{name}: every frame plays the 16:9 timeline (counters, labels, bar heights, lines)", not bad,
                      f"{N} frames compared" if not bad else f"first difference frame {bad[0][0]} {bad[0][1]}: {bad[0][2]} vs {bad[0][3]}")
                last_move = max([f for f in range(1, N) if sv[f] != sv[f - 1]] or [0])
            else:
                sv = pv.evaluate(STATES_JS, [N, FPS])
                sw = pw.evaluate(STATES_JS, [N, FPS])
                diff = [f for f in range(N) if sv[f] != sw[f]]
                check(f"{name}: stateAt(f / 30) identical to the 16:9 page at every frame", not diff,
                      f"{N} frames compared" if not diff else f"{len(diff)} frames differ, first {diff[0]}")
                last_move = max([f for f in range(1, N) if sv[f] != sv[f - 1]] or [0])
            print(f"   last frame that changes: {last_move} (t {last_move / FPS:.3f}); held {(N - 1 - last_move) / FPS:.2f} s to the end")
            rep.setdefault(name, {})["last_move_frame"] = last_move

            # 5. the words of the end state
            pv.evaluate(f"window.setT({(N - 1) / FPS:.6f})")
            pw.evaluate(f"window.setT({(N - 1) / FPS:.6f})")
            wv, ww = tokens(pv.evaluate(WORDS_JS)), tokens(pw.evaluate(WORDS_JS))
            missing = sorted(set(ww) - set(wv)) if wv != ww else []
            extra = sorted(set(wv) - set(ww)) if wv != ww else []
            check(f"{name}: end state shows the 16:9 end state's words and figures, token for token", wv == ww,
                  f"{len(wv)} tokens" if wv == ww else f"missing {missing}, extra {extra}")
            rep[name]["tokens"] = wv

            # 6. layout at the end state (and at the leg-1 / leg-2 moments, where labels are still rising)
            q = pv.evaluate("(window.TwoLegs || window.Clock).qa()")
            boxes = q["boxes"]
            ov = [(b1["name"], b2["name"]) for i, b1 in enumerate(boxes) for b2 in boxes[i + 1:]
                  if b1["x0"] < b2["x1"] and b2["x0"] < b1["x1"] and b1["y0"] < b2["y1"] and b2["y0"] < b1["y1"]]
            check(f"{name}: no two label boxes overlap", not ov, str(ov) if ov else f"{len(boxes)} boxes")
            out_m = [b["name"] for b in boxes if b["x0"] < MARGIN[0] or b["x1"] > MARGIN[1]]
            check(f"{name}: every label inside the 72 px side margins", not out_m, str(out_m) if out_m else "")
            if q.get("series") and name != "longest-clock":
                close = []
                for b in boxes:
                    for s in q["series"]:
                        pts = s["pts"]
                        d = min((seg_box_dist(pts[i], pts[i + 1], b) for i in range(len(pts) - 1)), default=1e9)
                        if d < 6:
                            close.append(f"{b['name']} ~ {s['name']} {d:.1f} px")
                    for mk in q["marks"]:
                        dx = max(b["x0"] - mk["x"], 0, mk["x"] - b["x1"])
                        dy = max(b["y0"] - mk["y"], 0, mk["y"] - b["y1"])
                        if math.hypot(dx, dy) < 16:
                            close.append(f"{b['name']} ~ mark {mk['name']} {math.hypot(dx, dy):.1f} px")
                check(f"{name}: no label within 6 px of a drawn line or 16 px of a mark centre", not close, "; ".join(close))
            rep[name]["boxes"] = boxes

            # 2. stills before / after each cue word, the last frame, the contact sheet
            d = out / name
            d.mkdir(exist_ok=True)
            tiles = []
            for i, (word, sp, what) in enumerate(C["cues"], 1):
                c = sp - O
                f_pre = max(0, math.ceil(c * FPS - 1e-6) - 1)
                f_post = min(N - 1, round((c + 0.5) * FPS))
                pre, post = shot(pv, f_pre / FPS), shot(pv, f_post / FPS)
                Image.fromarray(post).save(d / f"{name}-{i:02d}-f{f_post:04d}-t{f_post / FPS:06.3f}.png")
                tiles.append((f"{i:02d} \"{word}\" t {c:.3f}: {what}", pre, f_pre, post, f_post))
                lo = max(lowest_ink(pre), lowest_ink(post))
                rep[name].setdefault("lowest_ink", []).append(lo)
            last = shot(pv, (N - 1) / FPS)
            Image.fromarray(last).save(d / f"{name}-LAST-f{N - 1:04d}-t{(N - 1) / FPS:06.3f}.png")
            lo_last = lowest_ink(last)
            lo_all = max(rep[name]["lowest_ink"] + [lo_last])
            check(f"{name}: nothing drawn below y {LOWER_LIMIT} at any cue or the last frame", lo_all < LOWER_LIMIT,
                  f"lowest drawn row y {lo_all}")
            shots[name] = last
            # 4. hold frames
            held = []
            for f in sorted({last_move + 1, (last_move + N - 1) // 2, N - 2}):
                if last_move + 1 <= f < N - 1:
                    n_px, mx = same(shot(pv, f / FPS), last)
                    held.append((f, n_px, mx))
            check(f"{name}: hold frames after the last move == the last frame", all(h[1] == 0 for h in held),
                  ", ".join(f"frame {f}: {'identical' if n == 0 else f'{n} px differ (max {m})'}" for f, n, m in held))
            # the contact sheet: per cue [before | after], 3 cues per row
            tw, th, lab = 240, 427, 46
            per = 3
            rows = math.ceil(len(tiles) / per)
            sheet = Image.new("RGB", (per * (2 * tw + 24), rows * (th + lab) + 56), (24, 24, 28))
            dr = ImageDraw.Draw(sheet)
            dr.text((10, 14), f"{name} VERTICAL: each cue = [the last frame BEFORE the word | 0.5 s after the word]", fill="white", font=font(22))
            for k, (label, pre, fpre, post, fpost) in enumerate(tiles):
                r, cidx = divmod(k, per)
                x0, y0 = cidx * (2 * tw + 24), 56 + r * (th + lab)
                dr.text((x0 + 4, y0 + 2), label[:62], fill=(245, 185, 66), font=font(15))
                dr.text((x0 + 4, y0 + 22), f"before: f{fpre} t {fpre / FPS:.3f}", fill="white", font=font(14))
                dr.text((x0 + tw + 4, y0 + 22), f"after: f{fpost} t {fpost / FPS:.3f}", fill="white", font=font(14))
                sheet.paste(Image.fromarray(pre).resize((tw, th), Image.LANCZOS), (x0, y0 + lab))
                sheet.paste(Image.fromarray(post).resize((tw, th), Image.LANCZOS), (x0 + tw, y0 + lab))
            sheet.save(out / f"{name}-cue-sheet.png")

            # the design-state stills, next to the page
            if a.states:
                for st, t in STATES[name]:
                    Image.fromarray(shot(pv, t)).save(VDIR / f"{name}-{st}.png")
                    print(f"   state still {name}-{st}.png (t {t:.3f})")
            pv.close()
            pw.close()

        # 3. THE SEAM, rendered the way html_clip.py renders each clip: part 1 stepped through every frame of its window
        # on its own page, then its last frame; part 2 on a fresh page (its load-time end state first), then frame 0
        n1 = CHARTS["two-legs"]["frames"]
        p1 = open_page(br, VDIR / "two-legs.html", VW, VH)
        p1.evaluate(f"(n) => {{ for (let f = 0; f < n; f++) window.setT(f / {FPS}); }}", n1)
        a1 = np.asarray(Image.open(io.BytesIO(p1.screenshot())).convert("RGB"))
        p1.close()
        p2 = open_page(br, VDIR / "two-legs-2.html", VW, VH)
        a2 = shot(p2, 0.0)
        p2.close()
        n_px, mx = same(a1, a2)
        check("SEAM: two-legs last frame (f 1561, t 52.033) == two-legs-2 frame 0, pixel for pixel", n_px == 0,
              "identical" if n_px == 0 else f"{n_px} px differ, max {mx}")
        n_px2, _ = same(a1, shots["two-legs"])
        check("SEAM: the stepped-through last frame == the directly set last frame", n_px2 == 0)
        Image.fromarray(np.concatenate([a1, np.full((VH, 24, 3), 40, np.uint8), a2], axis=1)).resize((1092, 960), Image.LANCZOS) \
            .save(out / "two-legs-seam-part1-last-vs-part2-first.png")
        Image.fromarray(a2).save(out / "two-legs-2" / "two-legs-2-FIRST-f0000-t00.000.png")
        br.close()

    rep["fails"] = fails
    (out / "qa-vertical.json").write_text(json.dumps(rep, indent=1), encoding="utf-8")
    print(f"\nVERTICAL-CHARTS-QA {'PASS' if not fails else 'FAIL'} checks={len(rep['checks'])} fails={len(fails)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
