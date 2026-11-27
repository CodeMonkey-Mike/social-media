"""QA of the re-timed longest-bear animated charts (chart-builder, 2026-11-25).

python qa_retime.py <charts dir> <orig dir> <out dir>

For each page: (1) scan every frame of its window (setT(f / 30), as html_clip.py renders it) and print the first frame
each label / marker shows and the frame the drawn line reaches each date, next to the cue word's measured onset;
(2) a full-size still 0.5 s after each cue word, plus a contact sheet of [the last frame before the word | 0.5 s after];
(3) pixel checks: part 1's last frame == part 2's frame 0, each page's last frame == the PRE-EDIT page's end state (the
look did not change), and the hold frames after the last move == the last frame.
"""
import io
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

FPS = 30
W, H = 1920, 1080

# (word as said, spine onset, what lands on it) per chart; page t = spine - origin (origin = round(tIn*30)/30)
CHARTS = {
    "longest-clock": {"origin": 1392 / 30, "frames": 648, "cues": [
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
    "two-legs": {"origin": 4060 / 30, "frames": 1561, "cues": [
        ("(so the) top", 135.90, "TOP dot"),
        ("October (6th 2025)", 137.08, "TOP / OCT 6, 2025"),
        ("(closed) below", 142.80, "line crosses under the gold, Nov 4"),
        ("50(-week)", 143.24, "gold line glows, legend row lights"),
        ("(November) 16th", 146.86, "line reaches Nov 16, ring"),
        ("(November) 23rd", 148.22, "line reaches Nov 23, ring, BEAR CONFIRMED"),
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

SCAN_TWO_LEGS = r"""
(args) => {
  const [n, fps, fields, dayKeys] = args;
  const first = {}, reach = {};
  const DY = TwoLegs.DAYS;
  for (let f = 0; f < n; f++) {
    const S = window.stateAt(f / fps);
    for (const k of fields) if (first[k] === undefined && S[k] > 0.005) first[k] = f;
    for (const k of dayKeys) if (reach[k] === undefined && S.cur >= DY[k] - 1e-6) reach[k] = f;
  }
  const last = window.stateAt((n - 1) / fps), end = TwoLegs.part1End();
  const diff = Object.keys(end).filter(k => Math.abs((last[k] || 0) - end[k]) > 1e-9);
  return {first, reach, lastVsPart1End: diff, lastMoveFrame: (() => {
    let lm = 0, prev = JSON.stringify(window.stateAt(0));
    for (let f = 1; f < n; f++) { const s = JSON.stringify(window.stateAt(f / fps)); if (s !== prev) lm = f; prev = s; }
    return lm; })()};
}
"""

SCAN_CLOCK = r"""
(n) => {
  const fps = 30, first = {}, out = {numFinal: {}, nowPass: {}};
  const g = (sel) => document.querySelectorAll(sel);
  const svg = document.getElementById('plot');
  const texts = Array.from(svg.querySelectorAll('text'));
  const years = ['2013-14', '2017-18', '2021-22'].map(y => texts.find(t => t.textContent === y).parentNode);
  const nums = texts.filter(t => t.getAttribute('font-size') === '64');
  const nowNum = texts.find(t => t.getAttribute('font-size') === '76');
  const nowLbl = texts.find(t => t.textContent === 'NOW').parentNode;
  const cap1 = texts.find(t => t.textContent === 'DAYS SINCE THE TOP').parentNode;
  const cap2 = texts.find(t => t.textContent === 'STILL COUNTING').parentNode;
  const refTag = texts.find(t => t.getAttribute('font-size') === '28');
  const finals = [406, 364, 378];
  const op = (e) => parseFloat(e.getAttribute('opacity') || '1');
  let lastSig = null, lastMove = 0;
  for (let f = 0; f < n; f++) {
    window.setT(f / fps);
    const items = {'year 2013-14': op(years[0]), 'year 2017-18': op(years[1]), 'year 2021-22': op(years[2]),
                   'bar 1 counter': op(nums[0]), 'bar 2 counter': op(nums[1]), 'bar 3 counter': op(nums[2]),
                   'NOW': op(nowLbl), 'DAYS SINCE THE TOP': op(cap1), 'STILL COUNTING': op(cap2), '406 tag': op(refTag),
                   'gold counter': op(nowNum)};
    for (const k in items) if (first[k] === undefined && items[k] > 0.005) first[k] = f;
    nums.forEach((t, i) => { if (out.numFinal[i] === undefined && +t.textContent === finals[i]) out.numFinal[i] = f; });
    const v = +nowNum.textContent;
    [364, 378, 406, 415].forEach(x => { if (out.nowPass[x] === undefined && v >= x + (x === 415 ? 0 : 1)) out.nowPass[x] = f; });
    const sig = svg.innerHTML + '|' + document.querySelector('.head').outerHTML + '|' + document.getElementById('orbGold').style.opacity +
                '|' + document.getElementById('src').style.opacity;
    if (sig !== lastSig) { lastMove = f; lastSig = sig; }
  }
  out.first = first; out.lastMoveFrame = lastMove;
  return out;
}
"""


def open_page(br, path):
    pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
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


def font(sz):
    for f in ("C:/Windows/Fonts/consola.ttf", "C:/Windows/Fonts/arial.ttf"):
        try:
            return ImageFont.truetype(f, sz)
        except OSError:
            pass
    return ImageFont.load_default()


def same(a, b):
    d = np.abs(a.astype(np.int16) - b.astype(np.int16))
    return int((d.max(axis=2) > 0).sum()), int(d.max())


def main():
    charts, orig, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    report = {}
    f_lbl, f_big = font(15), font(22)
    with sync_playwright() as p:
        br = p.chromium.launch()
        ends = {}
        for name, C in CHARTS.items():
            O, N = C["origin"], C["frames"]
            pg = open_page(br, charts / f"{name}.html")
            T = pg.evaluate("window.T")
            print(f"\n===== {name}: origin {O:.4f} s, {N} frames, last frame t = {(N - 1) / FPS:.3f}")
            print("T =", json.dumps(T))
            if name == "longest-clock":
                sc = pg.evaluate(SCAN_CLOCK, N)
            else:
                fields = ["top", "topLbl", "lit50", "wk1", "wk2", "conf", "bottom", "leg1", "leg1Pct", "rallyDot", "rally",
                          "rallyTo", "above", "aboveLbl", "aboveDays", "abovePulse"] if name == "two-legs" else \
                         ["lost", "end", "leg2", "leg2Pct", "payoff", "pulse2"]
                days = ["dip", "wk1", "wk2", "bottom", "rally", "aboveTo"] if name == "two-legs" else ["lost", "end"]
                sc = pg.evaluate(SCAN_TWO_LEGS, [N, FPS, fields, days])
                print("cursor reaches (frame, t, spine):", {k: (f, round(f / FPS, 3), round(O + f / FPS, 3)) for k, f in sc["reach"].items()})
                print("last frame state == TwoLegs.part1End():", "YES" if not sc["lastVsPart1End"] else f"NO, differs in {sc['lastVsPart1End']}")
            print("first visible (frame, t, spine):")
            for k, f in sorted(sc["first"].items(), key=lambda kv: kv[1]):
                print(f"   {k:22} frame {f:5d}  t {f / FPS:7.3f}  spine {O + f / FPS:8.3f}")
            if name == "longest-clock":
                print("bar counters reach their figure (frame, spine):", {[406, 364, 378][int(i)]: (f, round(O + f / FPS, 3)) for i, f in sc["numFinal"].items()})
                print("gold counter passes (frame, spine):", {k: (f, round(O + f / FPS, 3)) for k, f in sc["nowPass"].items()})
            lm = sc["lastMoveFrame"]
            print(f"last frame that changes: {lm} (t {lm / FPS:.3f}, spine {O + lm / FPS:.3f}); held for {(N - 1 - lm) / FPS:.2f} s to the end")
            report[name] = {"T": T, "scan": sc}

            # stills: one full frame 0.5 s after each cue word, and the contact sheet pairs
            d = out / name
            d.mkdir(exist_ok=True)
            tiles = []
            for i, (word, sp, what) in enumerate(C["cues"], 1):
                c = sp - O
                f_pre = max(0, math.ceil(c * FPS - 1e-6) - 1)
                f_post = min(N - 1, round((c + 0.5) * FPS))
                pre, post = shot(pg, f_pre / FPS), shot(pg, f_post / FPS)
                fn = d / f"{name}-{i:02d}-f{f_post:04d}-t{f_post / FPS:06.3f}.png"
                Image.fromarray(post).save(fn)
                tiles.append((f"{i:02d} \"{word}\" spine {sp:.2f} = t {c:.3f}: {what}", pre, f_pre, post, f_post))
            last = shot(pg, (N - 1) / FPS)
            Image.fromarray(last).save(d / f"{name}-LAST-f{N - 1:04d}-t{(N - 1) / FPS:06.3f}.png")
            ends[name] = last
            if name == "two-legs-2":
                ends["two-legs-2 f0"] = shot(pg, 0.0)
                Image.fromarray(ends["two-legs-2 f0"]).save(d / f"{name}-FIRST-f0000-t00.000.png")
            # hold checks: frames after the last move equal the last frame
            for f in sorted({lm + 1, (lm + N - 1) // 2, N - 2}):
                if lm + 1 <= f < N - 1:
                    n_px, mx = same(shot(pg, f / FPS), last)
                    print(f"   hold frame {f} (t {f / FPS:.3f}) vs last frame: {'IDENTICAL' if n_px == 0 else f'{n_px} px differ (max {mx})'}")
            # contact sheet: per cue a row [last frame before the word | 0.5 s after], 2 cues per sheet row
            tw, th, lab = 480, 270, 40
            rows = math.ceil(len(tiles) / 2)
            sheet = Image.new("RGB", (4 * tw + 30, rows * (th + lab) + 50), (24, 24, 28))
            dr = ImageDraw.Draw(sheet)
            dr.text((10, 12), f"{name}: each cue = [the last frame BEFORE the word | 0.5 s after the word]  (origin spine {O:.3f})", fill="white", font=f_big)
            for k, (label, pre, fpre, post, fpost) in enumerate(tiles):
                r, cidx = divmod(k, 2)
                x0, y0 = cidx * (2 * tw + 30), 50 + r * (th + lab)
                dr.text((x0 + 4, y0 + 2), label[:118], fill=(245, 185, 66), font=f_lbl)
                dr.text((x0 + 4, y0 + 20), f"before: frame {fpre} (t {fpre / FPS:.3f})", fill="white", font=f_lbl)
                dr.text((x0 + tw + 4, y0 + 20), f"after: frame {fpost} (t {fpost / FPS:.3f})", fill="white", font=f_lbl)
                sheet.paste(Image.fromarray(pre).resize((tw, th), Image.LANCZOS), (x0, y0 + lab))
                sheet.paste(Image.fromarray(post).resize((tw, th), Image.LANCZOS), (x0 + tw, y0 + lab))
            sheet.save(out / f"{name}-cue-sheet.png")
            pg.close()

        # pixel identities
        print("\n===== pixel checks")
        n_px, mx = same(ends["two-legs"], ends["two-legs-2 f0"])
        print(f"part 1 last frame (t 52.000) vs part 2 frame 0: {'IDENTICAL' if n_px == 0 else f'{n_px} px differ, max {mx}'}")
        seam = np.concatenate([ends["two-legs"], ends["two-legs-2 f0"]], axis=1)
        Image.fromarray(seam).resize((1920, 540), Image.LANCZOS).save(out / "two-legs-seam-part1-last-vs-part2-first.png")
        for name, t_end in (("longest-clock", 30.0), ("two-legs", 60.0), ("two-legs-2", 30.0)):
            po = open_page(br, orig / f"{name}.html")
            o = shot(po, t_end)
            po.close()
            n_px, mx = same(ends[name], o)
            print(f"{name}: new last frame vs the PRE-EDIT page's end state: {'IDENTICAL' if n_px == 0 else f'{n_px} px differ, max {mx}'}")
        br.close()
    (out / "qa-retime.json").write_text(json.dumps(report, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
