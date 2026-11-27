"""plan-to-make-millions SHORT: the vertical C16 HOOK chart as a PER-FRAME draw-on (2026-11-24).

Why: the short's first build stepped through the three state stills (start -> mid -> payoff). The plot sat EMPTY for 2.2 s and
the payoff (the run to over a billion) showed for 14 frames. The longform chart DRAWS the line; this script gives the short
the same motion from the SAME vertical layout (_build_C16_v.py: same series, axis, tokens, words, numbers).

One frame per SHORT frame of span 3 (comp frames 406..576, 171 frames, local t = i / 30 s from the span start 13.5333 s):
  0.05 - 1.17   the line draws from NOV 14, 2025 to the call (head at DEC 2, 2025), cubic in-out
  1.28          the call dot lands on "called" (short 14.81)
  2.22          the wire, the card MY CALL, AROUND A 65M CAP and the MARKET CAP badge AROUND 65M land on "65" (short 15.75)
  2.40 - 5.00   the line draws on to the read; the badge counts up in step with the head (the longform's own rule:
                65M x the highest price the head has passed since the call / 0.338; OVER 1B from 1000M)
  5.22          on "billion" (short 18.75): the badge locks OVER 1B, the call card dims, the read dot lands; hold to the end
Every landing is the house one: 8 frames, opacity + 10 px rise. No multiple anywhere.

Writes  _previews/short/work/vertical-cards/C16-seq/f000.png ... f170.png  (the short comp's public dir; 136 MB, so no
second copy under assets/) and the cue table  assets/short/vertical-cards/C16-seq.json.

Run:  python assets/short/vertical-cards/_build_C16_v_seq.py
"""
import importlib.util
import json
import shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJ = HERE.parents[2]
spec = importlib.util.spec_from_file_location("c16v", HERE / "_build_C16_v.py")
V = importlib.util.module_from_spec(spec)
spec.loader.exec_module(V)
B = V.B
W, H = V.W, V.H

FPS = 30
N = 171                                  # span 3 = comp frames 406..576
A0, A1 = 0.05, 1.17                      # draw to the call
DOT = 1.28                               # the call dot lands on "called"
MID = 2.22                               # the call card + the badge land on "65"
B0, B1 = 2.40, 5.00                      # draw on to the read
PAY = 5.22                               # "billion": OVER 1B locks, the call card dims, the read dot lands
LAND = 8 / FPS
RISE = 10


def ease_io(x):
    x = min(1.0, max(0.0, x))
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def land(t, cue):
    x = min(1.0, max(0.0, (t - cue) / LAND))
    return 1 - (1 - x) ** 3                # ease-out cubic


def build():
    D = B.D
    s = B.pieverse_series()
    read_d, read_v = s[-1]
    P = B.Plot(150, 990, 650, 1320, D("2025-11-14"), D("2026-11-23"), 0.08, 8.0, log=True)
    pPull = P.pt(D("2025-11-30"), 0.3376)
    pRead = P.pt(read_d, read_v)
    x_call, x_read = P.X(D("2025-12-02")), P.X(read_d)
    pts = [(P.X(d), v) for d, v in s]
    xt = [(D("2025-11-14"), "NOV 14, 2025"), (D("2026-02-01"), "FEB 2026"), (D("2026-05-01"), "MAY"), (D("2026-08-01"), "AUG"),
          (D("2026-11-01"), "NOV 2026")]
    rgb = B.ACC["gold"][1]
    a = "var(--acc)"
    pad = 6

    def price_at(x):
        for (x0, v0), (x1, v1) in zip(pts, pts[1:]):
            if x0 <= x <= x1:
                return v0 if x1 == x0 else v0 + (v1 - v0) * (x - x0) / (x1 - x0)
        return pts[-1][1]

    def cap_text(head):
        if head <= x_call + 0.01:
            return "AROUND 65M"
        hi = max([v for x, v in pts if x_call < x <= head] + [price_at(head)])
        cap = max(65.0, 65.0 * hi / 0.338)
        return "OVER 1B" if cap >= 1000 else f"AROUND {round(cap)}M"

    svg = [f'<svg class="plot" viewBox="0 0 {W} {H}"><defs><clipPath id="pvv-seq"><rect id="clipRect" x="{P.x0 - pad}" y="0" width="0" '
           f'height="{H}"/></clipPath></defs>',
           B.grid_y(P, [0.1, 0.25, 0.5, 1, 2.5, 5], B.log_ticks_fmt, x_label_pad=16),
           B.axis_x(P, xt).replace(f'y="{P.y1 + 40}"', f'y="{P.y1 + 46}"'),
           f'<text class="axl" x="80" y="{P.y0 - 44}">USD, LOG SCALE</text>',
           f'<path d="{P.area(s)}" fill="rgba({rgb},.12)" clip-path="url(#pvv-seq)"/>',
           f'<path d="{P.path(s)}" fill="none" stroke="{a}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#pvv-seq)"/>',
           '<g id="dotCall" opacity="0">' + B.dot(*pPull, a, r=12, fill=a, halo=True, on=True) + '</g>',
           '<g id="dotRead" opacity="0">' + B.dot(*pRead, a, r=11, fill=a, halo=True, on=True) + '</g>',
           f'<path id="wire" opacity="0" d="M{pPull[0]},{pPull[1] + 16} L{pPull[0]},{pPull[1] + 56} L{pPull[0] + 64},{pPull[1] + 56}" fill="none" '
           f'stroke="{B.WIRE}" stroke-width="2"/>',
           '</svg>']
    call_inner = '<div class="d">0.338, NOV 30, 2025, THE PULLBACK</div><div class="e">MY CALL, AROUND A 65M CAP</div>'
    inner = B.header("Pieverse, daily price", 'Pieverse: <span class="acc">called early</span>', top=150)
    inner += "".join(svg)
    for bid, cls in (("callOn", "co on"), ("callDim", "co dim")):
        inner += B.box(pPull[0] + 68, pPull[1] + 56, call_inner, cls=cls, on=True, anchor="mid-left").replace("<div class=", f'<div id="{bid}" class=', 1)
    inner += B.box(80, 384, '<div class="t" style="margin-top:0">MARKET CAP</div>'
                   '<div id="capVal" class="e" style="font-size:68px;font-family:JetBrains Mono,monospace;font-weight:600;margin-top:4px;line-height:1.1"></div>',
                   cls="co on", on=True, anchor="left", extra="min-width:500px;padding:18px 30px 20px 26px").replace("<div class=", '<div id="capBox" class=', 1)
    inner += B.src("Pieverse price: CoinGecko daily prints (00:00 UTC) + its all-time low (0.119, 2025-11-14) and high (5.33, 2026-11-22) · "
                   "first 9 days from the saved Nov 2025 pull · read 2026-11-22 23:57 UTC · multiples on price, never market cap")
    fid = "C16-hook-seq-v"
    html = B.shell("C16 HOOK vertical, per-frame draw-on (plan-to-make-millions short)", [V.vframe(fid, "gold", inner)], {},
                   "per-frame draw-on of C16-hook-v.html; see _build_C16_v_seq.py", extra_css=V.VCSS)
    out_html = HERE / "C16-hook-seq-v.html"
    out_html.write_text(html, encoding="utf-8")

    def params(i):
        t = i / FPS
        if t < A0:
            head = None
        elif t <= B0:
            head = P.x0 + (x_call - P.x0) * ease_io((t - A0) / (A1 - A0))
        else:
            head = x_call + (x_read - x_call) * ease_io((t - B0) / (B1 - B0))
        clip_w = 0.0 if head is None else max(0.0, head - P.x0 + pad - 2.5)
        k_mid, k_pay = land(t, MID), land(t, PAY)
        return {"clipW": round(clip_w, 2), "dotCall": round(land(t, DOT), 4), "wire": round(k_mid, 4),
                "callOn": round(k_mid * (1 - k_pay), 4), "callDim": round(0.62 * k_pay, 4), "rise": round(RISE * (1 - k_mid), 2),
                "cap": round(k_mid, 4), "capText": "" if t < MID else ("OVER 1B" if t >= PAY else cap_text(head)),
                "dotRead": round(k_pay, 4)}

    js = """(p) => {
      const g = (i) => document.getElementById(i);
      g('clipRect').setAttribute('width', p.clipW);
      g('dotCall').setAttribute('opacity', p.dotCall);
      g('dotRead').setAttribute('opacity', p.dotRead);
      g('wire').setAttribute('opacity', p.wire);
      g('callOn').style.opacity = p.callOn;
      g('callDim').style.opacity = p.callDim;
      g('callOn').style.transform = g('callDim').style.transform = `translateY(-50%) translateY(${p.rise}px)`;
      g('capBox').style.opacity = p.cap;
      g('capBox').style.transform = `translateY(${p.rise}px)`;
      g('capVal').textContent = p.capText;
    }"""
    # the frames go STRAIGHT into the short comp's public dir (136 MB of PNGs; no second copy kept under assets/)
    seq = PROJ / "_previews" / "short" / "work" / "vertical-cards" / "C16-seq"
    if seq.is_dir():
        shutil.rmtree(seq)
    seq.mkdir(parents=True)
    table = []
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        pg.goto(out_html.as_uri())
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(800)
        loc = pg.locator(f"#{fid}")
        for i in range(N):
            pr = params(i)
            pg.evaluate(js, pr)
            loc.screenshot(path=str(seq / f"f{i:03d}.png"))
            table.append({"i": i, "t": round(i / FPS, 4), **pr})
        br.close()
    (HERE / "C16-seq.json").write_text(json.dumps({"frames": N, "fps": FPS, "comp_from": 406, "series_max": max(v for _, v in s),
                                              "cues": {"draw_a": [A0, A1], "dot": DOT, "mid": MID, "draw_b": [B0, B1], "payoff": PAY},
                                              "table": table}, indent=1), encoding="utf-8")
    caps = []
    for r in table:
        if not caps or caps[-1][1] != r["capText"]:
            caps.append((r["i"], r["capText"]))
    print(f"C16-SEQ wrote {N} frames -> {seq.relative_to(PROJ)}; cue table -> {(HERE / 'C16-seq.json').relative_to(PROJ)}; series max {max(v for _, v in s):.3f}")
    print("badge steps (frame, text):", caps[:6], "...", caps[-4:], f"({len(caps)} steps)")


if __name__ == "__main__":
    build()
