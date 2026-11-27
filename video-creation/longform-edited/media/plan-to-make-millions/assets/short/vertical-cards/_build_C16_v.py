"""plan-to-make-millions SHORT: C16 HOOK rebuilt NATIVE 1080x1920 (chart-builder, 16:9-sourced short).

Same chart as assets/charts/C16.html HOOK run: same series (pieverse_series() from assets/charts/_build.py), same log price
axis 0.08 to 8, same light tokens + gold CH1 accent, same states and words. Only the LAYOUT reflows for portrait:
header -> market-cap badge stacked under it -> a tall plot -> x labels, all ABOVE the short's caption band (y ~1420-1600);
the source line sits below the band. No number is introduced here: every value is the 16:9 chart's.

Writes:
  vertical-cards/C16-hook-v.html                         (one standalone 1080x1920 file, the three states as frames)
  vertical-cards/C16-hook-payoff-v.png                   (THE overlay still for the s_vertical_cards slot)
  vertical-cards/C16-states/C16-hook-{start,mid,payoff}-v.png  (all three states, for a state-swap overlay if wanted)

Run:  python assets/short/vertical-cards/_build_C16_v.py
"""
import importlib.util
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJ = HERE.parents[2]
spec = importlib.util.spec_from_file_location("charts_build", PROJ / "assets" / "charts" / "_build.py")
B = importlib.util.module_from_spec(spec)
spec.loader.exec_module(B)

W, H = 1080, 1920
VCSS = """
/* ---- portrait reflow of the chart layer (layout + sizes only; every token is the locked light stylesheet's) ---- */
.frame.ch.v{width:1080px;height:1920px}
.v .hdr{left:80px;top:150px;max-width:920px}
.v .hdr .ey{font-size:27px;margin-bottom:16px}
.v .hdr h1{font-size:84px;line-height:1.06}
.v .hdr .divider{margin:26px 0 0 0}
.v .src{left:80px;bottom:150px;max-width:920px;font-size:20px;line-height:1.45}
.v svg.plot{width:1080px;height:1920px}
.v svg .tk{font-size:24px}
.v svg .axl{font-size:21px}
.v .co{padding:14px 22px 15px 20px;border-radius:14px}
.v .co .d{font-size:21px}
.v .co .e{font-size:30px}
.v .co .t{font-size:23px}
"""


def vclip(cid, P, head_x, pad_left=6):
    w = max(0.0, head_x - P.x0 + pad_left - 2.5)
    return f'<clipPath id="{cid}"><rect x="{P.x0 - pad_left}" y="0" width="{round(w, 2)}" height="{H}"/></clipPath>'


def vframe(fid, acc, inner):
    hexv, rgb = B.ACC[acc]
    o = (f'<div class="orb" style="width:760px;height:760px;right:-360px;top:-400px;background:rgba({rgb},.55)"></div>'
         f'<div class="orb" style="width:620px;height:620px;left:-320px;bottom:-320px;background:#c9cfd8;opacity:.22"></div>')
    return f'<div class="frame ch v" id="{fid}" style="--acc:{hexv};--acc-rgb:{rgb}">{o}{inner}</div>'


def build():
    D = B.D
    s = B.pieverse_series()
    read_d, read_v = s[-1]
    P = B.Plot(150, 990, 650, 1320, D("2025-11-14"), D("2026-11-23"), 0.08, 8.0, log=True)
    pPull = P.pt(D("2025-11-30"), 0.3376)
    pRead = P.pt(read_d, read_v)
    xt = [(D("2025-11-14"), "NOV 14, 2025"), (D("2026-02-01"), "FEB 2026"), (D("2026-05-01"), "MAY"), (D("2026-08-01"), "AUG"),
          (D("2026-11-01"), "NOV 2026")]
    rgb = B.ACC["gold"][1]

    def fr(sid, head, show):
        hx = P.X(head) if head else P.x0 - 40
        a = "var(--acc)"
        svg = [f'<svg class="plot" viewBox="0 0 {W} {H}"><defs>{vclip("pvv-" + sid, P, hx)}</defs>',
               B.grid_y(P, [0.1, 0.25, 0.5, 1, 2.5, 5], B.log_ticks_fmt, x_label_pad=16),
               B.axis_x(P, xt).replace(f'y="{P.y1 + 40}"', f'y="{P.y1 + 46}"'),
               f'<text class="axl" x="80" y="{P.y0 - 44}">USD, LOG SCALE</text>',
               f'<path d="{P.area(s)}" fill="rgba({rgb},.12)" clip-path="url(#pvv-{sid})"/>',
               f'<path d="{P.path(s)}" fill="none" stroke="{a}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#pvv-{sid})"/>',
               B.dot(*pPull, a, r=12, fill=a, halo=True, on="call" in show),
               B.dot(*pRead, a, r=11, fill=a, halo=True, on="read" in show),
               f'<path d="M{pPull[0]},{pPull[1] + 16} L{pPull[0]},{pPull[1] + 56} L{pPull[0] + 64},{pPull[1] + 56}" fill="none" '
               f'stroke="{B.WIRE}" stroke-width="2"{B.op("call" in show)}/>',
               '</svg>']
        inner = B.header("Pieverse, daily price", 'Pieverse: <span class="acc">called early</span>', top=150)
        inner += "".join(svg)
        inner += B.box(pPull[0] + 68, pPull[1] + 56,
                       '<div class="d">0.338, NOV 30, 2025, THE PULLBACK</div><div class="e">MY CALL, AROUND A 65M CAP</div>',
                       cls="co" + (" on" if show.get("call") == "on" else " dim"), on="call" in show, anchor="mid-left")
        inner += B.box(80, 384, '<div class="t" style="margin-top:0">MARKET CAP</div>'
                       + f'<div class="e" style="font-size:68px;font-family:JetBrains Mono,monospace;font-weight:600;margin-top:4px;line-height:1.1">'
                       + f'{show.get("cap", "")}</div>',
                       cls="co on", on="cap" in show, anchor="left", extra="min-width:500px;padding:18px 30px 20px 26px")
        inner += B.src("Pieverse price: CoinGecko daily prints (00:00 UTC) + its all-time low (0.119, 2025-11-14) and high (5.33, 2026-11-22) · "
                       "first 9 days from the saved Nov 2025 pull · read 2026-11-22 23:57 UTC · multiples on price, never market cap")
        return vframe(f"C16-hook-{sid}-v", "gold", inner)

    frames = [
        fr("start", None, {}),
        fr("mid", D("2025-12-02"), {"call": "on", "cap": "AROUND 65M"}),
        fr("payoff", read_d, {"call": "dim", "read": "dim", "cap": "OVER 1B"}),
    ]
    spec_txt = """C16 HOOK, NATIVE VERTICAL 1080x1920 for the SHORT (span 3, final 46.80-52.50 = short 13.535-19.235). Same chart, same states,
same words and numbers as assets/charts/C16.html HOOK; only the layout reflows (header, badge stacked under it, tall plot above the caption band).
Overlay still for the slot = C16-hook-payoff-v.png (the s_vertical_cards contract is ONE still per asset).
If the short comp swaps states instead (C16-states/), cue them in SHORT seconds off the longform cues (final -> short = minus 33.265):
  13.535 hook-start (frame in, opacity 8 frames); 13.585-15.635 draw to DEC 2, 2025;
  15.755 'MY CALL, AROUND A 65M CAP' card + call dot + MARKET CAP badge AROUND 65M land on '65 million' = hook-mid;
  15.935-18.535 draw on to the read, badge counts 65M -> 1B (integer M, then OVER 1B);
  18.755 badge locks OVER 1B on 'billion', call card dims, read dot lands = hook-payoff; hold to 19.235.
Entry: opacity + 10 px rise only. No multiple anywhere in the hook."""
    data = {"id": "C16-hook-v", "log": True, "series": [(d.strftime("%Y-%m-%d %H:%M"), round(v, 6)) for d, v in s],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2025-11-14", "dmax": "2026-11-23", "vmin": 0.08, "vmax": 8.0}}
    html = B.shell("C16 HOOK vertical (plan-to-make-millions short)", frames, data, spec_txt, extra_css=VCSS)
    out_html = HERE / "C16-hook-v.html"
    out_html.write_text(html, encoding="utf-8")

    from playwright.sync_api import sync_playwright
    states = HERE / "C16-states"
    states.mkdir(exist_ok=True)
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        pg.goto(out_html.as_uri())
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(600)
        for sid in ("start", "mid", "payoff"):
            fid = f"C16-hook-{sid}-v"
            out = states / f"{fid}.png"
            pg.locator(f"#{fid}").screenshot(path=str(out))
            print("wrote", out.relative_to(PROJ))
            if sid == "payoff":
                main = HERE / "C16-hook-payoff-v.png"
                pg.locator(f"#{fid}").screenshot(path=str(main))
                print("wrote", main.relative_to(PROJ))
        br.close()


if __name__ == "__main__":
    build()
