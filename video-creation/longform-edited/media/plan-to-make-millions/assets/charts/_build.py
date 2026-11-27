"""plan-to-make-millions: chart-builder driver (Type 1 ANIMATED charts + Type 2 SYSTEM-DESIGN diagrams).

Builds, for every id in the dispatch, ONE standalone 1920x1080 HTML (every state = its own <div class="frame" id=...>)
and screenshots each state to <id>-<state>.png beside it:
  Type 1 animated  -> assets/charts/<id>.html + <id>-<state>.png + <id>.spec.md
  Type 2 diagrams  -> assets/diagrams/<id>.html + <id>-<state>.png (+ one _state-cues.md for the folder)

Every number comes from DATA.md or from the raw series DATA.md cites (research/*.json, saved 2026-11-22/23).
Theme: the locked stylesheet + container-canonical-light.css (inlined from skills/container-reference so the
HTML is standalone); each chart's lit colour = its chapter accent (COVER-PLAN chapter_themes).
Geometry is computed ONCE per chart, so shared elements are pixel-identical across states; a state only
changes opacity / lit-dim classes / the draw-head clip width.

Run:  python assets/charts/_build.py [ID ...]      (no ids = all)
"""
import datetime as dt
import json
import math
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJ = HERE.parents[1]
RES = PROJ / "research"
CHARTS = PROJ / "assets" / "charts"
DIAG = PROJ / "assets" / "diagrams"
CR = PROJ.parents[1] / "skills" / "container-reference"
SEED_PIEVERSE = PROJ.parent / "pieverse" / "research" / "coingecko-market-chart-daily-merged-2026-11-14.json"

EPOCH = dt.datetime(1970, 1, 1)
ACC = {  # chapter accents (COVER-PLAN chapter_themes) = the light stylesheet's darkened accents
    "gold": ("#8F6500", "143,101,0"),
    "red": ("#C41E3A", "196,30,58"),
    "green": ("#007A55", "0,122,85"),
    "cyan": ("#006A9E", "0,106,158"),
}
RED = ACC["red"]
GREEN = ACC["green"]
INK, WIRE, GRID, AXIS, MUTED, SEC = "#14161A", "#8A877E", "#D6D2C7", "#7A808B", "#5E6676", "#4A5263"


# ------------------------------------------------------------------------------------------------ data
def D(s):
    """'2026-10-29' or '2026-10-29 20:05' -> datetime (UTC)."""
    return dt.datetime.strptime(s, "%Y-%m-%d %H:%M") if " " in s else dt.datetime.strptime(s, "%Y-%m-%d")


def yahoo(name):
    """Yahoo daily closes keyed by the UTC date of the bar timestamp (00:00 NY = 04/05 UTC for futures)."""
    r = json.load(open(RES / name, encoding="utf-8"))["chart"]["result"][0]
    out = []
    for t, v in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]):
        if v is None:
            continue
        d = (EPOCH + dt.timedelta(seconds=t)).date()
        out.append((dt.datetime(d.year, d.month, d.day), float(v)))
    return out


def cg(name):
    r = json.load(open(RES / name, encoding="utf-8"))
    return [(EPOCH + dt.timedelta(milliseconds=t), float(v)) for t, v in r["prices"]]


def window(series, a, b):
    a, b = D(a) if isinstance(a, str) else a, D(b) if isinstance(b, str) else b
    return [(d, v) for d, v in series if a <= d <= b]


def val(series, day):
    day = D(day)
    for d, v in series:
        if d == day:
            return v
    raise KeyError(day)


# ------------------------------------------------------------------------------------------------ format
def fnum(v, dec=0):
    return f"{v:,.{dec}f}"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# ------------------------------------------------------------------------------------------------ geometry
class Plot:
    def __init__(self, x0, x1, y0, y1, dmin, dmax, vmin, vmax, log=False):
        self.x0, self.x1, self.y0, self.y1 = x0, x1, y0, y1  # y0 = top px, y1 = bottom px
        self.dmin, self.dmax, self.vmin, self.vmax, self.log = dmin, dmax, vmin, vmax, log

    def X(self, d):
        t = (d - self.dmin).total_seconds() / (self.dmax - self.dmin).total_seconds()
        return self.x0 + t * (self.x1 - self.x0)

    def Y(self, v):
        if self.log:
            t = (math.log10(v) - math.log10(self.vmin)) / (math.log10(self.vmax) - math.log10(self.vmin))
        else:
            t = (v - self.vmin) / (self.vmax - self.vmin)
        return self.y1 - t * (self.y1 - self.y0)

    def pt(self, d, v):
        return (round(self.X(d), 2), round(self.Y(v), 2))

    def path(self, series):
        return "M" + " L".join(f"{x},{y}" for x, y in (self.pt(d, v) for d, v in series))

    def area(self, series):
        p = [self.pt(d, v) for d, v in series]
        return f"M{p[0][0]},{self.y1} L" + " L".join(f"{x},{y}" for x, y in p) + f" L{p[-1][0]},{self.y1} Z"

    def y_at(self, series, d):
        """the line's y px at time d (linear interpolation between neighbours, in pixel space)."""
        prev = None
        for dd, v in series:
            if dd >= d:
                if prev is None or dd == d:
                    return self.Y(v)
                (pd, pv) = prev
                t = (d - pd).total_seconds() / (dd - pd).total_seconds()
                return self.Y(pv) + t * (self.Y(v) - self.Y(pv))
            prev = (dd, v)
        return self.Y(series[-1][1])


# ------------------------------------------------------------------------------------------------ html shell
LAYER_CSS = r"""
/* ---- chart / diagram layer on top of the locked stylesheet + the LIGHT override (layout only; tokens unchanged) ---- */
.frame.ch{display:block;padding:0;margin:0 0 40px 0}
.frame.ch>*:not(.orb){position:absolute}
.hdr{left:120px;top:64px;max-width:1560px}
.hdr .ey{font-size:24px;margin-bottom:14px}
.hdr h1{font-size:64px;line-height:1.06}
.hdr .divider{margin:22px 0 0 0;background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.25))}
.acc{color:var(--acc)} .red{color:var(--accent-red)} .grn{color:var(--accent-green)}
.src{left:120px;bottom:40px;font-family:'JetBrains Mono',monospace;font-size:17px;color:var(--text-muted);max-width:1680px;line-height:1.45}
svg.plot{left:0;top:0;width:1920px;height:1080px;overflow:visible}
svg text{font-family:'JetBrains Mono',monospace}
svg .tk{font-size:19px;fill:var(--text-muted);font-weight:400}
svg .axl{font-family:'DM Sans',sans-serif;font-size:17px;letter-spacing:.18em;font-weight:600;fill:var(--text-muted)}
svg .lbl{font-size:20px;font-weight:600;fill:var(--ink)}
svg .lblm{font-size:18px;font-weight:600;fill:var(--text-muted)}
svg .cap{font-family:'DM Sans',sans-serif;font-size:19px;letter-spacing:.12em;font-weight:700;fill:var(--ink)}
.pill{font-family:'DM Sans',sans-serif;font-weight:700;font-size:19px;letter-spacing:.12em;text-transform:uppercase;
  padding:8px 18px;border-radius:100px;border:1.5px solid var(--border);background:#fff;color:var(--text-secondary);white-space:nowrap}
.pill.acc{border-color:rgba(var(--acc-rgb),.55);color:var(--acc);background:rgba(var(--acc-rgb),.06)}
.pill.redp{border-color:rgba(196,30,58,.55);color:var(--accent-red);background:rgba(196,30,58,.06)}
.pill.grnp{border-color:rgba(0,122,85,.55);color:var(--accent-green);background:rgba(0,122,85,.06)}
.pill.dash{border-style:dashed}
/* callout card: white, hairline, accent left rule when lit; dim = landed earlier, still on screen */
.co{background:#fff;border:1px solid var(--border);border-left:5px solid var(--acc);border-radius:12px;padding:11px 18px 12px 16px;
  box-shadow:0 1px 2px rgba(20,22,26,.05),0 10px 26px rgba(20,22,26,.08);white-space:nowrap}
.co .d{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:17px;color:var(--text-muted);letter-spacing:.02em}
.co .e{font-family:'DM Sans',sans-serif;font-weight:700;font-size:24px;color:var(--ink);letter-spacing:.03em;margin-top:2px}
.co .t{font-family:'DM Sans',sans-serif;font-weight:600;font-size:18px;color:var(--text-secondary);letter-spacing:.06em;margin-top:4px}
.co .t.acc{color:var(--acc)}
.co.on{box-shadow:0 0 0 5px rgba(var(--acc-rgb),.14),0 14px 30px rgba(20,22,26,.14)}
.co.dim{border-left-color:var(--wire);opacity:.62;box-shadow:0 1px 2px rgba(20,22,26,.04)}
.co.dim .e{color:var(--text-secondary)}
.endlbl{font-family:'JetBrains Mono',monospace;font-weight:600}
.big{font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--ink)}
.hide{opacity:0!important}
/* system-design nodes */
.nd{background:#fff;border:1.5px solid var(--border);border-radius:16px;display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;box-shadow:0 1px 2px rgba(20,22,26,.05),0 12px 30px rgba(20,22,26,.07)}
.nd .t{font-family:'DM Sans',sans-serif;font-weight:700;color:var(--ink);letter-spacing:.06em;text-transform:uppercase;line-height:1.22}
.nd .s{font-family:'DM Sans',sans-serif;font-weight:600;color:var(--text-muted);letter-spacing:.14em;text-transform:uppercase;font-size:17px;margin-top:8px}
.nd.lit{border:2.5px solid var(--acc);background:linear-gradient(135deg,rgba(var(--acc-rgb),.10),rgba(var(--acc-rgb),.03)),#fff}
.nd.hot{border:3px solid var(--acc);background:linear-gradient(135deg,rgba(var(--acc-rgb),.14),rgba(var(--acc-rgb),.04)),#fff;
  box-shadow:0 0 0 7px rgba(var(--acc-rgb),.16),0 16px 34px rgba(20,22,26,.16)}
.nd.hot .t,.nd.lit .t{color:var(--ink)} .nd.hot .s{color:var(--acc)}
.nd.ghost{opacity:.38;box-shadow:none}
.nd.ghost .t{color:var(--text-muted)}
"""


def shell(title, frames, data, spec, extra_css=""):
    canon = (CR / "container-canonical.css").read_text(encoding="utf-8")
    light = (CR / "container-canonical-light.css").read_text(encoding="utf-8")
    fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
             '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700'
             '&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">')
    spec_txt = spec.replace("--", "- -")
    return (f"<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\">\n<title>{esc(title)}</title>\n{fonts}\n"
            f"<!-- ANIMATION / STATE SPEC (also in the .spec.md / _state-cues.md beside this file)\n{spec_txt}\n-->\n"
            f"<style>\n{canon}\n</style>\n<style>\n/* LIGHT THEME (loaded after the canonical sheet) */\n{light}\n</style>\n"
            f"<style>{LAYER_CSS}\n{extra_css}</style>\n</head><body>\n"
            + "\n".join(frames)
            + f"\n<script type=\"application/json\" id=\"chart-data\">{json.dumps(data, default=str)}</script>\n</body></html>\n")


def frame(fid, acc, inner, orb=True):
    hexv, rgb = ACC[acc]
    o = ""
    if orb:
        o = (f'<div class="orb" style="width:760px;height:760px;right:-300px;top:-380px;background:rgba({rgb},.55)"></div>'
             f'<div class="orb" style="width:520px;height:520px;left:-260px;bottom:-300px;background:#c9cfd8;opacity:.22"></div>')
    return (f'<div class="frame ch" id="{fid}" style="--acc:{hexv};--acc-rgb:{rgb}">{o}{inner}</div>')


def header(ey, h1, top=64):
    return (f'<div class="hdr" style="top:{top}px"><div class="ey">{ey}</div><h1>{h1}</h1><div class="divider"></div></div>')


def src(text):
    return f'<div class="src">{text}</div>'


def op(on):
    return "" if on else ' style="opacity:0"'


def hid(on):
    return "" if on else " hide"


# ------------------------------------------------------------------------------------------------ svg helpers
def grid_y(P, ticks, fmt, x_label_pad=18):
    s = []
    for v in ticks:
        y = round(P.Y(v), 2)
        s.append(f'<line x1="{P.x0}" x2="{P.x1}" y1="{y}" y2="{y}" stroke="{GRID}" stroke-width="1.5" stroke-dasharray="4 7"/>')
        s.append(f'<text class="tk" x="{P.x0 - x_label_pad}" y="{y + 6}" text-anchor="end">{fmt(v)}</text>')
    return "".join(s)


def axis_x(P, ticks):
    s = [f'<line x1="{P.x0}" x2="{P.x1}" y1="{P.y1}" y2="{P.y1}" stroke="{AXIS}" stroke-width="2"/>']
    for d, lab in ticks:
        x = round(P.X(d), 2)
        s.append(f'<line x1="{x}" x2="{x}" y1="{P.y1}" y2="{P.y1 + 9}" stroke="{AXIS}" stroke-width="2"/>')
        s.append(f'<text class="tk" x="{x}" y="{P.y1 + 40}" text-anchor="middle">{lab}</text>')
    return "".join(s)


def clip(cid, P, head_x, pad_left=30):
    # right edge 2.5 px short of the head: a near-vertical NEXT segment (e.g. EVAA Oct 27 -> 28) would otherwise leak half its stroke width
    w = max(0.0, head_x - P.x0 + pad_left - 2.5)
    return f'<clipPath id="{cid}"><rect x="{P.x0 - pad_left}" y="0" width="{round(w, 2)}" height="1080"/></clipPath>'


def dot(x, y, color, r=9, fill="#fff", sw=4, halo=False, on=True):
    h = f'<circle cx="{x}" cy="{y}" r="{r + 13}" fill="{color}" opacity=".16"/>' if halo else ""
    return f'<g{op(on)}>{h}<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{color}" stroke-width="{sw}"/></g>'


def vguide(x, ya, yb, color=WIRE, on=True, dash="5 6", w=2):
    return f'<line x1="{x}" x2="{x}" y1="{ya}" y2="{yb}" stroke="{color}" stroke-width="{w}" stroke-dasharray="{dash}"{op(on)}/>'


def box(x, y, inner, cls="co", on=True, anchor="left", extra=""):
    tr = {"left": "", "right": "transform:translateX(-100%);", "center": "transform:translateX(-50%);",
          "bottom-left": "transform:translateY(-100%);", "bottom-right": "transform:translate(-100%,-100%);",
          "bottom-center": "transform:translate(-50%,-100%);", "mid-left": "transform:translateY(-50%);",
          "mid-right": "transform:translate(-100%,-50%);"}[anchor]
    return f'<div class="{cls}{hid(on)}" style="left:{round(x, 1)}px;top:{round(y, 1)}px;{tr}{extra}">{inner}</div>'


def _mk(i, fill, size):
    return (f'<marker id="{i}" viewBox="0 0 12 12" refX="10" refY="6" markerUnits="userSpaceOnUse" markerWidth="{size}" markerHeight="{size}" '
            f'orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11 Z" fill="{fill}"/></marker>')


ARROW_DEFS = ('<defs>' + _mk("ah-w", WIRE, 18) + _mk("ah-a", "var(--acc)", 20) + _mk("ah-ws", WIRE, 11) + _mk("ah-as", "var(--acc)", 12)
              + _mk("ah-g", "#007A55", 20) + '</defs>')


# ================================================================================================ C3
def build_C3():
    """COUNT-DOWN card: total crypto market cap, CMC daily prints Oct 29 -> Nov 21, 2026 (CH1, gold)."""
    q = json.load(open(RES / "cmc-global-hist.json", encoding="utf-8"))["data"]["quotes"]
    ser = [(D(x["timestamp"][:10]), x["quote"][0]["totalMarketCap"] / 1e12) for x in q]
    ser = window(ser, "2026-10-29", "2026-11-21")
    assert abs(ser[0][1] - 2.718) < 0.0006 and abs(ser[-1][1] - 2.021) < 0.0006
    P = Plot(1080, 1780, 330, 740, ser[0][0], ser[-1][0], 1.9, 2.8)
    states = [("start", ser[0][0]), ("mid", D("2026-11-10")), ("payoff", ser[-1][0])]
    frames = []
    for sid, head in states:
        v = val(ser, head.strftime("%Y-%m-%d"))
        payoff = sid == "payoff"
        hx = P.X(head)
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{clip("c3c-" + sid, P, hx, 4)}</defs>',
               grid_y(P, [2.0, 2.25, 2.5, 2.75], lambda t: f"{t:.2f}T"),
               axis_x(P, [(D("2026-10-29"), "OCT 29"), (D("2026-11-05"), "NOV 5"), (D("2026-11-12"), "NOV 12"), (D("2026-11-21"), "NOV 21")]),
               f'<path d="{P.area(ser)}" fill="rgba(143,101,0,.13)" clip-path="url(#c3c-{sid})"/>',
               f'<path d="{P.path(ser)}" fill="none" stroke="var(--acc)" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#c3c-{sid})"/>',
               dot(*P.pt(ser[0][0], ser[0][1]), "var(--acc)"),
               dot(round(hx, 2), round(P.Y(v), 2), "var(--acc)", r=10, fill="var(--acc)", halo=True),
               '</svg>']
        inner = (header("Total crypto market cap", 'Wiped out in around <span class="acc">three weeks</span>')
                 + "".join(svg)
                 + f'<div class="big" style="left:116px;top:330px;font-size:196px;line-height:1;letter-spacing:-.03em">{v:.3f}T</div>'
                 + f'<div class="big" style="left:124px;top:552px;font-size:34px;color:var(--text-muted)">{head.strftime("%b %d, %Y").upper().replace(" 0", " ")}</div>'
                 + f'<div class="pill" style="left:124px;top:262px">From <span class="mono" style="font-weight:600">2.718T</span>, Oct 29, 2026</div>'
                 + f'<div class="big{hid(payoff)}" style="left:120px;top:650px;font-size:92px;line-height:1;color:var(--acc);font-family:\'Playfair Display\',serif;font-weight:900;letter-spacing:-.01em">Around <span class="mono" style="font-size:88px">697B</span> gone</div>'
                 + f'<div class="pill acc{hid(payoff)}" style="left:124px;top:782px;font-size:26px;padding:10px 24px">Minus <span class="mono">25.6%</span></div>'
                 + f'<div class="endlbl{hid(payoff)}" style="left:{P.x1 + 22}px;top:{P.Y(2.021) - 16}px;font-size:24px;color:var(--acc)">2.021T</div>'
                 + f'<div class="endlbl" style="left:{P.x0 - 12}px;top:{P.Y(2.718) - 52}px;font-size:22px;color:var(--text-muted)">2.718T</div>'
                 + src("Total crypto market cap: CoinMarketCap daily prints (00:15 UTC), Oct 29 to Nov 21, 2026 · 697B and minus 25.6% = 2.718T to 2.021T · read 2026-11-22"))
        frames.append(frame(f"C3-{sid}", "gold", inner))
    spec = """C3 COUNT-DOWN (Type 1 animated, CH1 gold), beat CH1@16.289-23.300.
STATES: start = 2.718T OCT 29, 2026, sparkline one point; mid = a real print mid-count (2.505T NOV 10, 2026); payoff = 2.021T NOV 21, 2026 + 'AROUND 697B GONE' + 'MINUS 25.6%'.
WHAT MOVES: one draw head t runs over the CMC daily prints (Oct 29 -> Nov 21, 24 points). The big counter shows the value AT the head
(interpolated between prints, 3 decimals, JetBrains Mono, tabular), the date line under it steps day by day; the gold line + area reveal by
the clip rect at the same head; the filled head dot rides the line.
CUES: 16.289 frame fades + scales in (opacity 0->1, scale .985->1, 10 frames) holding the start state; 16.60 count + draw start,
ease-out cubic, end 18.60 on 2.021T (the plan's 'from 18.40' leaves 0.3 s before '700 billion' at 18.72: the count runs under
'Look at the size of this' instead); 18.72 'AROUND 697B GONE' lands (opacity + 12 px rise, 8 frames) on '700 billion';
18.72 the 2.021T end label fades in; 22.12 'MINUS 25.6%' pill lands on 'three weeks'; hold to 23.300.
DO NOT: wipe a PNG; print any day-relative word. [VERIFY] re-pull cmc-global-hist at render (live drift)."""
    data = {"id": "C3", "series_T": [(d.strftime("%Y-%m-%d"), round(v, 4)) for d, v in ser],
            "plot": vars(P) | {"dmin": str(P.dmin), "dmax": str(P.dmax)}}
    return "C3", CHARTS, frames, data, spec


# ================================================================================================ coin series
def pieverse_series():
    seed = json.load(open(SEED_PIEVERSE, encoding="utf-8"))["daily"]
    s = [(D(r["date"]), float(r["price_usd"])) for r in seed if r["date"] <= "2025-11-22"]
    s.append((D("2025-11-14 13:01"), 0.119363))  # CoinGecko all-time low (launch day, 13:01 UTC) = the bot alert level
    s += [(d, v) for d, v in cg("cg-pieverse-daily-365.json") if d >= D("2025-11-23")]
    s.append((D("2026-11-22 10:13"), 5.33))  # CoinGecko all-time high 5.33, 2026-11-22 10:13:50 UTC
    s.sort(key=lambda x: x[0])
    return s  # last point = the read, 3.6794 at 2026-11-22 23:57 UTC


def evaa_series():
    s = [(d, v) for d, v in cg("cg-evaa-protocol-daily-365.json")]
    s.append((D("2026-11-21 09:00"), 6.6176))  # CoinGecko hourly peak, 2026-11-21 09:00 UTC
    s.sort(key=lambda x: x[0])
    return s  # last point = the read, 2.3271 at 2026-11-22 23:57 UTC


def log_ticks_fmt(v):
    return f"{v:g}" if v >= 1 else f"{v:.2f}"


# ================================================================================================ C16
def build_C16():
    s = pieverse_series()
    read_d, read_v = s[-1]
    P = Plot(210, 1440, 300, 880, D("2025-11-14"), D("2026-11-23"), 0.08, 8.0, log=True)
    T = {k: D(v) for k, v in {"alert": "2025-11-14 13:01", "run": "2025-11-25", "pull": "2025-11-30", "nov18": "2026-11-18",
                               "high": "2026-11-22 10:13", "call": "2025-11-30"}.items()}
    pA, pRun, pPull, pHigh = P.pt(T["alert"], 0.119363), P.pt(T["run"], 0.518), P.pt(T["pull"], 0.3376), P.pt(T["high"], 5.33)
    pRead = P.pt(read_d, read_v)
    xN18 = round(P.X(T["nov18"]), 2)
    xt = [(D("2025-11-14"), "NOV 14, 2025"), (D("2026-02-01"), "FEB 2026"), (D("2026-05-01"), "MAY"), (D("2026-08-01"), "AUG"), (D("2026-11-01"), "NOV 2026")]

    def fr(sid, acc, head, show):
        hx = P.X(head) if head else P.x0 - 40
        a_hex = "var(--acc)"
        area_rgb = ACC[acc][1]
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{clip("pv-" + sid, P, hx, 6)}</defs>',
               grid_y(P, [0.1, 0.25, 0.5, 1, 2.5, 5], log_ticks_fmt),
               axis_x(P, xt),
               f'<text class="axl" x="120" y="{P.y0 - 40}">USD, LOG SCALE</text>',
               f'<path d="{P.area(s)}" fill="rgba({area_rgb},.12)" clip-path="url(#pv-{sid})"/>',
               f'<path d="{P.path(s)}" fill="none" stroke="{a_hex}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#pv-{sid})"/>',
               # Nov 18 date tick
               vguide(xN18, P.y0 + 60, P.y1, AXIS, on="nov18" in show, dash="3 6"),
               f'<text class="lblm" x="{xN18 - 12}" y="{P.y1 - 16}" text-anchor="end"{op("nov18" in show)}>NOV 18, 2026</text>',
               # markers
               dot(*pA, a_hex, on="alert" in show),
               dot(*pRun, a_hex, r=7, on="run" in show),
               dot(*pPull, a_hex, r=7, on="pull" in show),
               dot(*pPull, a_hex, r=11, fill=a_hex, halo=True, on="call" in show),
               dot(*pHigh, a_hex, r=9, on="high" in show),
               dot(*pRead, a_hex, r=10, fill=a_hex, halo=True, on="read" in show),
               # leader lines
               f'<path d="M{pA[0] + 12},{pA[1]} L{pA[0] + 62},{pA[1]}" stroke="{WIRE}" stroke-width="2"{op("alert" in show)}/>',
               f'<path d="M{pPull[0]},{pPull[1] + 14} L{pPull[0]},{pPull[1] + 44} L{pPull[0] + 76},{pPull[1] + 44}" fill="none" stroke="{WIRE}" stroke-width="2"{op("call" in show or "pull" in show)}/>',
               f'<path d="M{pRun[0]},{pRun[1] - 12} L{pRun[0]},{pRun[1] - 108}" stroke="{WIRE}" stroke-width="2"{op("run" in show)}/>',
               '</svg>']
        hook = sid.startswith("hook")
        inner = header("Pieverse, daily price", 'Pieverse: <span class="acc">called early</span>' if hook else 'Pieverse: <span class="acc">the entries</span>')
        inner += "".join(svg)
        inner += box(pA[0] + 66, pA[1], '<div class="d">0.119, NOV 14, 2025</div><div class="e">BOT ALERT, AROUND A 20M CAP</div>',
                     cls="co" + (" on" if show.get("alert") == "on" else " dim"), on="alert" in show, anchor="mid-left")
        inner += box(pRun[0] - 30, pRun[1] - 108, '<div class="d">0.518, NOV 25, 2025</div><div class="e" style="font-size:20px">ALREADY RUNNING</div>',
                     cls="co" + (" on" if show.get("run") == "on" else " dim"), on="run" in show, anchor="bottom-left")
        inner += box(pPull[0] + 80, pPull[1] + 44, '<div class="d">0.338, NOV 30, 2025, THE PULLBACK</div><div class="e">MY CALL, AROUND A 65M CAP</div>',
                     cls="co" + (" on" if show.get("call") == "on" else " dim"), on="call" in show, anchor="mid-left")
        inner += box(pPull[0] + 80, pPull[1] + 44, '<div class="d">0.338, NOV 30, 2025</div><div class="e">PULLED BACK</div>',
                     cls="co" + (" on" if show.get("pull") == "on" else " dim"), on=("pull" in show and "call" not in show), anchor="mid-left")
        inner += box(pHigh[0] - 24, pHigh[1], '<div class="d">5.33 HIGH, NOV 22, 2026</div><div class="e">MORE THAN 14X FROM THE CALL, ON PRICE</div>',
                     cls="co" + (" on" if show.get("high") == "on" else " dim"), on="high" in show, anchor="mid-right")
        inner += box(pRead[0] + 26, pRead[1] + 8, f'<div class="d">{read_v:.2f}, NOV 22, 2026 READ</div>'
                     + '<div class="e">AROUND 30X FROM<br>THE BOT ALERT, ON PRICE</div>',
                     cls="co" + (" on" if show.get("read") == "on" else " dim"), on=("read" in show and not hook), anchor="mid-left")
        # hook: market cap badge (top right, clear of the line)
        if hook:
            inner += box(P.x1, 118, '<div class="t" style="margin-top:0">MARKET CAP</div>'
                         + f'<div class="e" style="font-size:44px;font-family:JetBrains Mono,monospace;font-weight:600;margin-top:2px">{show.get("cap", "")}</div>',
                         cls="co on", on="cap" in show, anchor="right",
                         extra="text-align:right;border-left:1px solid var(--border);border-right:5px solid var(--acc);min-width:300px")
        inner += src("Pieverse price: CoinGecko daily prints (00:00 UTC) + its all-time low (0.119, 2025-11-14) and high (5.33, 2026-11-22) · "
                     "first 9 days from the saved Nov 2025 pull · read 2026-11-22 23:57 UTC · multiples on price, never market cap")
        return frame(f"C16-{sid}", acc, inner)

    frames = [
        fr("hook-start", "gold", None, {}),
        fr("hook-mid", "gold", D("2025-12-02"), {"call": "on", "cap": "AROUND 65M"}),
        fr("hook-payoff", "gold", read_d, {"call": "dim", "read": "dim", "cap": "OVER 1B"}),
        fr("walk-1-alert", "green", D("2025-11-15"), {"alert": "on"}),
        fr("walk-2-run", "green", T["run"], {"alert": "dim", "run": "on"}),
        fr("walk-3-pullback", "green", T["pull"], {"alert": "dim", "run": "dim", "pull": "on"}),
        fr("walk-4-call", "green", T["pull"], {"alert": "dim", "run": "dim", "call": "on"}),
        fr("walk-5-nov18", "green", D("2026-11-18"), {"alert": "dim", "call": "dim", "nov18": "on"}),
        fr("walk-6-high", "green", T["high"], {"alert": "dim", "call": "dim", "nov18": "dim", "high": "on"}),
        fr("walk-7-payoff", "green", read_d, {"alert": "dim", "call": "dim", "nov18": "dim", "high": "dim", "read": "on"}),
    ]
    spec = """C16 PIEVERSE ENTRIES (Type 1 animated). One component, two runs: HOOK (CH1, gold accent) and WALK (CH3, green accent).
Line = CoinGecko daily prints 2025-11-14 -> 2026-11-22 (first 9 days from the saved Nov 2025 pull), plus the all-time low 0.119 (2025-11-14 13:01 UTC)
and the all-time high 5.33 (2026-11-22 10:13 UTC) as real intraday points; last point = the read 3.68 (2026-11-22 23:57 UTC). LOG price axis
(design call: on a linear axis the 0.119 / 0.518 / 0.338 entries are a flat 40 px wiggle; on log they are 200 px apart and the multiples read honestly).
The line reveals by a clip rect from the left (draw head); geometry fixed, never re-scaled.
HOOK, CH1@33.90-39.85 (headline 'Called early. Over 1B.'):
  33.90 frame in (opacity, 8 frames) = hook-start; 33.95-36.00 fast draw to DEC 2, 2025 (ease-in-out);
  36.12 'MY CALL, AROUND A 65M CAP' card + filled call dot land on '65 million' and the MARKET CAP badge appears reading AROUND 65M = hook-mid;
  36.30-38.90 the line draws on to the read (ease-in-out); the badge counts 65M -> 1B in step with the head (integer M, then 'OVER 1B');
  39.12 badge locks on 'OVER 1B' on 'billion' = hook-payoff (the call card dims, the read dot lands). No multiple anywhere in the hook.
WALK, CH3@272.15-290.40 then CH3@294.30-300.15 (headline 'Pieverse: the entries'):
  272.15 frame in, head at NOV 15, 2025; 276.12 'BOT ALERT, AROUND A 20M CAP' (0.119) on '20 million' = walk-1-alert;
  278.36 the run draws to 0.518 NOV 25, 2025 + 'ALREADY RUNNING' card on 'already running' = walk-2-run;
  280.62 the pullback draws to 0.338 NOV 30, 2025 + 'PULLED BACK' on 'pulled back' = walk-3-pullback (dated: never '3 weeks later' on screen);
  284.16 the PULLED BACK card swaps for 'MY CALL, AROUND A 65M CAP' (same anchor) on '65 million' = walk-4-call;
  286.02-288.70 the line draws through 2026 to NOV 18, 2026; 288.78 the NOV 18, 2026 date tick fades in = walk-5-nov18; hold to 290.40 (cut to C18).
  294.30 return on walk-5; 294.40-295.90 the line draws on to the 5.33 HIGH; 296.00 the high card with 'MORE THAN 14X FROM THE CALL, ON PRICE'
  lands ON the high = walk-6-high; 296.20-298.20 the line draws to the read; 298.34 the read card 'AROUND 30X FROM THE BOT ALERT, ON PRICE'
  lands on the read price = walk-7-payoff; hold to 300.15.
Earlier cards dim (stay on screen) as the next lands. Entry: opacity + 10 px rise only (no scale on SVG text: render-session bounce).
GUARDS: never 17x, no market cap multiple, no present-tense high; the 14X sits on the 5.33 HIGH (15.2x to 15.8x), the 30X on the read (30.8x).
[VERIFY] read price + multiples re-derived at render."""
    data = {"id": "C16", "log": True, "series": [(d.strftime("%Y-%m-%d %H:%M"), round(v, 6)) for d, v in s],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2025-11-14", "dmax": "2026-11-23", "vmin": 0.08, "vmax": 8.0}}
    return "C16", CHARTS, frames, data, spec


# ================================================================================================ C14
def build_C14():
    s = evaa_series()
    read_d, read_v = s[-1]
    P = Plot(250, 1480, 300, 880, D("2025-11-23"), D("2026-11-23"), 0.2, 10.0, log=True)
    p51 = P.pt(D("2026-10-27"), 0.5101)
    pPk = P.pt(D("2026-11-21 09:00"), 6.6176)
    p00 = P.pt(D("2026-11-22"), 6.4424)
    pRead = P.pt(read_d, read_v)
    drop = [(D("2026-11-22"), 6.4424), (read_d, read_v)]
    main = [x for x in s if x[0] <= D("2026-11-22")]
    yb0, yb1 = P.Y(0.60), P.Y(0.44)
    XB = round(P.x1 + 30, 2)      # the 13x bracket's vertical, right of the plot and clear of the read dot's halo
    XC = XB + 24                  # left edge of the cards that sit right of the bracket (13X label, walk read card)
    xt = [(D("2025-11-23"), "NOV 23, 2025"), (D("2026-02-01"), "FEB 2026"), (D("2026-05-01"), "MAY"), (D("2026-08-01"), "AUG"), (D("2026-11-01"), "NOV 2026")]

    def fr(sid, acc, head, show, hook):
        hx = P.X(head) if head else P.x0 - 40
        area_rgb = ACC[acc][1]
        lit_band = show.get("band") == "on"
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{clip("ev-" + sid, P, hx, 6)}</defs>',
               grid_y(P, [0.25, 0.5, 1, 2.5, 5, 10], log_ticks_fmt),
               axis_x(P, xt),
               f'<text class="axl" x="120" y="{P.y0 - 40}">USD, LOG SCALE</text>',
               # entry band
               f'<g{op("band" in show)}><rect x="{P.x0}" y="{yb0}" width="{P.x1 - P.x0}" height="{round(yb1 - yb0, 2)}" '
               f'fill="rgba({area_rgb},{".20" if lit_band else ".10"})"/>'
               f'<line x1="{P.x0}" x2="{P.x1}" y1="{yb0}" y2="{yb0}" stroke="var(--acc)" stroke-width="1.5" stroke-dasharray="6 6" opacity="{1 if lit_band else .5}"/>'
               f'<line x1="{P.x0}" x2="{P.x1}" y1="{yb1}" y2="{yb1}" stroke="var(--acc)" stroke-width="1.5" stroke-dasharray="6 6" opacity="{1 if lit_band else .5}"/></g>',
               f'<path d="{P.area(main)}" fill="rgba({area_rgb},.11)" clip-path="url(#ev-{sid})"/>',
               f'<path d="{P.path(main)}" fill="none" stroke="var(--acc)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#ev-{sid})"/>',
               f'<path d="{P.path(drop)}" fill="none" stroke="{RED[0]}" stroke-width="5.5" stroke-linecap="round" clip-path="url(#ev-{sid})"/>',
               dot(*p51, "var(--acc)", r=8, on="m51" in show),
               dot(*pPk, "var(--acc)", r=9, on="peak" in show),
               dot(*pRead, RED[0], r=10, fill=RED[0], halo=True, on="read" in show),
               # 13x bracket: from 0.51 up to the peak level, routed to the RIGHT of the plot so it never meets the THE PEAK callout
               # (QA 2026-11-24: the old left route ran through that card). Arms stop 16 px off each dot; dims with its card in walk-7.
               f'<g{op("x13" in show)}><path d="M{p51[0] + 16},{p51[1]} L{XB},{p51[1]} L{XB},{pPk[1]} L{pPk[0] + 16},{pPk[1]}" fill="none" stroke="var(--acc)" stroke-width="2.5" stroke-dasharray="2 5" opacity="{.5 if show.get("x13") == "dim" else 1}"/></g>',
               '</svg>']
        inner = header("EVAA, daily price", 'EVAA: <span class="acc">low entries</span>' if hook else 'EVAA: <span class="acc">swing traded</span>')
        inner += "".join(svg)
        inner += box(P.x0 + 14, yb1 + 16, '<div class="e" style="font-size:21px">AROUND A 3M TO 4M CAP</div><div class="d" style="font-size:19px;margin-top:2px">0.44 TO 0.60</div>',
                     cls="co" + (" on" if lit_band else " dim"), on="band" in show, anchor="left")
        inner += box(P.x0 + 14, P.y0 + 6, '&larr;&nbsp; LAUNCHED <span class="mono">OCT 3, 2025</span>', cls="pill dash" + (" acc" if show.get("launch") == "on" else ""),
                     on="launch" in show, anchor="left", extra="font-size:18px;padding:6px 16px")
        inner += box(p51[0] - 60, p51[1] + 36, '<div class="d">0.51, OCT 27, 2026</div>',
                     cls="co" + (" on" if show.get("m51") == "on" else " dim"), on="m51" in show, anchor="right")
        inner += box(pPk[0] - 52, pPk[1] - 4, '<div class="d">6.62, NOV 21, 2026</div><div class="e" style="font-size:21px">THE PEAK</div>',
                     cls="co" + (" on" if show.get("peak") == "on" else " dim"), on="peak" in show, anchor="mid-right")
        inner += box(XC, p51[1] - 92, '<div class="e" style="font-size:22px">AROUND 13X</div><div class="t">IN UNDER 4 WEEKS</div>',
                     cls="co" + (" on" if show.get("x13") == "on" else " dim"), on="x13" in show, anchor="mid-left")
        if hook:  # CH1: the drop stays in frame, dated; the MINUS 64% label is CH3's beat (346.54)
            inner += box(pRead[0] + 26, pRead[1] - 4, f'<div class="d">{read_v:.2f}, NOV 22, 2026 READ</div>',
                         cls="co dim", on="read" in show, anchor="mid-left", extra=f"border-left-color:{RED[0]}")
        else:
            inner += box(XC, pRead[1] - 4, f'<div class="d">{read_v:.2f}, NOV 22, 2026 READ</div><div class="e" style="color:{RED[0]}">MINUS 64%</div><div class="t">IN ONE DAY, NOV 22, 2026</div>',
                         cls="co", on="read" in show, anchor="mid-left", extra=f"border-left-color:{RED[0]};" + ("box-shadow:0 0 0 5px rgba(196,30,58,.14),0 14px 30px rgba(20,22,26,.14)" if show.get("read") == "on" else ""))
        inner += src("EVAA price: CoinGecko daily prints (00:00 UTC) from 2025-11-23 (the free history window) + the hourly peak 6.62 (2026-11-21 09:00 UTC) · "
                     "band = the days CoinGecko's market cap read 2.9M to 4.0M · minus 64% = CoinGecko 24 h change at the read, 2026-11-22 23:57 UTC")
        return frame(f"C14-{sid}", acc, inner)

    frames = [
        fr("hook-start", "gold", D("2026-10-27"), {}, True),
        fr("hook-band", "gold", read_d, {"band": "on", "read": "dim"}, True),
        fr("hook-payoff", "gold", read_d, {"band": "dim", "peak": "on", "read": "dim"}, True),
        fr("walk-1-frame", "green", None, {}, False),
        fr("walk-2-launch", "green", D("2026-10-27"), {"launch": "on"}, False),
        fr("walk-3-band", "green", D("2026-10-27"), {"launch": "dim", "band": "on"}, False),
        fr("walk-4-051", "green", D("2026-10-27"), {"launch": "dim", "band": "dim", "m51": "on"}, False),
        fr("walk-5-peak", "green", D("2026-11-21 09:00"), {"launch": "dim", "band": "dim", "m51": "dim", "peak": "on"}, False),
        fr("walk-6-13x", "green", D("2026-11-21 09:00"), {"launch": "dim", "band": "dim", "m51": "dim", "peak": "dim", "x13": "on"}, False),
        fr("walk-7-drop", "green", read_d, {"launch": "dim", "band": "dim", "m51": "dim", "peak": "dim", "x13": "dim", "read": "on"}, False),
    ]
    spec = """C14 EVAA ENTRIES (Type 1 animated). HOOK in CH1 (gold accent), WALK in CH3 (green accent); the NOV 22 drop is RED in both (on purpose).
Line = CoinGecko daily prints 2025-11-23 -> 2026-11-22 00:00 + the hourly peak 6.6176 (2026-11-21 09:00 UTC) as a real point; the drop segment
6.4424 (2026-11-22 00:00) -> the read 2.33 (23:57 UTC) is its own red path. LOG price axis (same call as C16: the 0.44-0.60 band is 48 px tall, not 6).
The launch month (Oct 2025) is OUTSIDE the saved series: it is a dashed tag at the left edge, never a drawn line.
HOOK, CH1@39.850-46.789 (headline 'In low. Then the run.'): 39.85 frame in with the line already drawn to OCT 27, 2026 = hook-start;
  39.95-42.10 the line draws on to the read incl. the red drop (ease-in-out); 42.32 the entry band lights on 'three to 4 million' = hook-band;
  44.78 '6.62, NOV 21, 2026 / THE PEAK' lands = hook-payoff; hold to 46.789 (F3 edge). NO multiple: the VO says 35X, the screen never prints it.
WALK part 1, CH3@305.30-315.00 (headline 'EVAA, daily price'): 305.30 frame + axes, no line = walk-1-frame; 307.36 the dashed tag
  'LAUNCHED OCT 3, 2025' lands = walk-2-launch and the line draws from NOV 23, 2025 through the quiet months to OCT 27, 2026 (307.5-312.5).
WALK part 2, CH3@326.05-348.395 (returns on walk-2 + the line to OCT 27): 329.62 band lights 'AROUND A 3M TO 4M CAP, 0.44 TO 0.60' = walk-3-band;
  333.48 '0.51, OCT 27, 2026' = walk-4-051; 333.6-336.6 the run draws; 336.68 '6.62, NOV 21, 2026 / THE PEAK' = walk-5-peak;
  340.56 the dotted bracket (right of the plot: from the 0.51 dot out, up to the peak level, in to the peak dot; draws bottom to top, 10 frames)
  + 'AROUND 13X / IN UNDER 4 WEEKS' right of it = walk-6-13x; 344.6-346.4 the bracket + its card dim to half, the RED drop draws full size;
  346.54 'MINUS 64% / IN ONE DAY, NOV 22, 2026' + the read price card = walk-7-drop; hold to 348.395 (F5 edge).
GUARDS: never 35, never 30x, never a market cap multiple; no cause for the run or the drop on screen. [VERIFY] read price + 24 h change at render."""
    data = {"id": "C14", "log": True, "series": [(d.strftime("%Y-%m-%d %H:%M"), round(v, 6)) for d, v in main],
            "drop": [(d.strftime("%Y-%m-%d %H:%M"), round(v, 6)) for d, v in drop],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2025-11-23", "dmax": "2026-11-23", "vmin": 0.2, "vmax": 10.0}}
    return "C14", CHARTS, frames, data, spec


# ================================================================================================ C1
def build_C1():
    b = yahoo("yahoo-btc-1y.json")
    ser = window(b, "2026-10-01", "2026-11-21")
    READ = (D("2026-11-22 23:58"), 61173.0)  # CoinGecko read, DATA.md section 5
    ser = ser + [READ]
    P = Plot(230, 1440, 330, 900, D("2026-10-01"), D("2026-11-23"), 52000, 92000)
    E = {"oct28": D("2026-10-28"), "oct29": D("2026-10-29"), "oct30": D("2026-10-30"), "nov3": D("2026-11-03"), "nov5": D("2026-11-05"),
         "nov12": D("2026-11-12"), "nov19": D("2026-11-19")}
    pt = {k: P.pt(d, val(b, d.strftime("%Y-%m-%d"))) for k, d in E.items()}
    pR = P.pt(*READ)
    y28 = round(P.Y(81267.59), 2)
    # callout card anchor points (x = event, card top y); rows chosen so no card crosses the line or another card
    # (card x anchor, card top y, anchor, card bottom y used by the guide when the card sits ABOVE the point)
    CO = {
        "c1": (pt["oct29"][0] + 20, 236, "right", 372),   # above, extends left over the October plateau
        "c2": (pt["oct30"][0] - 2, 616, "left", None),     # below the line
        "c3": (pt["nov5"][0] - 2, 300, "left", 404),       # above
        "c4": (pt["nov12"][0] + 20, 762, "right", None),   # below the line, extends left
        "c5": (pt["nov19"][0] - 2, 566, "left", 642),      # above the late-November low
    }

    def card(k, state, d, e, tags):
        x, y, a, _ = CO[k]
        cls = "co" + {"on": " on", "dim": " dim", "all": " on"}.get(state, "")
        return box(x, y, f'<div class="d">{d}</div><div class="e">{e}</div>' + "".join(tags), cls=cls, on=state is not None, anchor=a,
                   extra="border-left-width:5px")

    def fr(sid, head, st):
        hx = P.X(head)
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{clip("c1-" + sid, P, hx, 4)}</defs>',
               grid_y(P, [55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000], lambda v: fnum(v)),
               axis_x(P, [(D("2026-10-01"), "OCT 1"), (D("2026-10-15"), "OCT 15"), (D("2026-11-01"), "NOV 1"), (D("2026-11-15"), "NOV 15")]),
               f'<path d="{P.area(ser)}" fill="rgba(196,30,58,.10)" clip-path="url(#c1-{sid})"/>',
               f'<path d="{P.path(ser)}" fill="none" stroke="var(--acc)" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#c1-{sid})"/>',
               # Oct 28 reference (final only)
               f'<g{op(st.get("final"))}><line x1="{pt["oct28"][0]}" x2="{P.x1 + 10}" y1="{y28}" y2="{y28}" stroke="{INK}" stroke-width="1.6" stroke-dasharray="7 6" opacity=".55"/>'
               f'<text class="lblm" x="{P.x1 + 22}" y="{y28 - 6}">OCT 28, 2026 CLOSE</text>'
               f'<text class="lblm" x="{P.x1 + 22}" y="{y28 + 18}">81,267.59</text></g>',
               # election-day tick: a short tick on the axis, label left of it
               f'<g{op(st.get("nov3"))}><line x1="{pt["nov3"][0]}" x2="{pt["nov3"][0]}" y1="{P.y1 - 46}" y2="{P.y1}" stroke="{AXIS}" stroke-width="2.5"/>'
               f'<text class="lblm" x="{pt["nov3"][0] - 10}" y="{P.y1 - 16}" text-anchor="end" style="font-size:16px">NOV 3, ELECTION DAY</text></g>',
               ]
        # guides from the event point to its card
        for k, ev in (("c1", "oct29"), ("c2", "oct30"), ("c3", "nov5"), ("c4", "nov12"), ("c5", "nov19")):
            stt = st.get(k)
            x, y, a, ybot = CO[k]
            px, py = pt[ev]
            col = "var(--acc)" if stt in ("on", "all") else WIRE
            if ybot is not None:   # card above the point
                svg.append(vguide(px, py - 12, ybot, col, on=stt is not None, dash="4 5"))
            else:                  # card below the point
                svg.append(vguide(px, py + 12, y, col, on=stt is not None, dash="4 5"))
            svg.append(dot(px, py, "var(--acc)" if stt in ("on", "all") else WIRE, r=8, on=stt is not None))
        svg.append(dot(*pR, "var(--acc)", r=10, fill="var(--acc)", halo=True, on=st.get("final")))
        svg.append(dot(round(hx, 2), round(P.y_at(ser, head), 2), "var(--acc)", r=7, fill="var(--acc)", on=not st.get("final")))
        svg.append("</svg>")
        inner = header("Bitcoin, daily close", 'Watch where it <span class="acc">breaks.</span>')
        inner += "".join(svg)
        c1t = []
        if st.get("c1_63"):
            c1t = []
        inner += card("c1", st.get("c1"), "OCT 29, 2026", "BINANCE HACK" + (", AROUND <span class='mono'>6.3B</span>" if st.get("c1_63") else ""),
                      ([f'<div class="t{hid(st.get("c1_cov"))}">BINANCE COVERED THE LOSSES</div>'] if st.get("c1_63") else [])
                      + ([f'<div class="t acc{hid(st.get("c1_43"))}">BITCOIN MINUS <span class="mono">4.3%</span> THAT DAY</div>'] if st.get("c1_63") else []))
        inner += card("c2", st.get("c2"), "OCT 30, 2026", "OIL <span class='mono'>117</span>",
                      [f'<div class="t{hid(st.get("c2_hz"))}">STRAIT OF HORMUZ</div>'])
        inner += card("c3", st.get("c3"), "NOV 5, 2026", "AFTER THE MIDTERMS",
                      [f'<div class="t acc{hid(st.get("c3_555"))}">BITCOIN MINUS <span class="mono">5.55%</span> THAT DAY</div>'])
        inner += card("c4", st.get("c4"), "NOV 12, 2026", "NVIDIA'S CEO RESIGNS", [])
        inner += card("c5", st.get("c5"), "NOV 19, 2026", "ANTHROPIC LISTS", [])
        inner += box(pR[0] + 28, pR[1] + 6, '<div class="d">NOV 22, 2026 READ</div><div class="e mono" style="font-family:\'JetBrains Mono\';font-size:34px">61,173</div>'
                     '<div class="t acc">MINUS <span class="mono">24.7%</span> FROM<br>THE OCT 28, 2026 CLOSE</div>', cls="co on", on=st.get("final"), anchor="mid-left")
        inner += src("Bitcoin daily close: Yahoo Finance BTC-USD · read price 61,173: CoinGecko, 2026-11-22 23:58 UTC · events: Binance Security Incident Update #2, "
                     "Al Jazeera (oil, Anthropic), Fox Business (midterms), Nvidia 8-K")
        return frame(f"C1-{sid}", "red", inner)

    S = []
    S.append(fr("s0", D("2026-10-28"), {}))
    S.append(fr("s1", D("2026-10-29"), {"c1": "on"}))
    S.append(fr("s1b", D("2026-10-29"), {"c1": "on", "c1_63": 1, "c1_cov": 1, "c1_43": 1}))
    S.append(fr("s2", D("2026-10-30"), {"c1": "dim", "c1_63": 1, "c1_cov": 1, "c1_43": 1, "c2": "on"}))
    S.append(fr("s3", D("2026-11-05"), {"c1": "dim", "c1_63": 1, "c1_cov": 1, "c1_43": 1, "c2": "dim", "c2_hz": 1, "nov3": 1, "c3": "on"}))
    S.append(fr("s3b", D("2026-11-05"), {"c1": "dim", "c1_63": 1, "c1_cov": 1, "c1_43": 1, "c2": "dim", "c2_hz": 1, "nov3": 1, "c3": "on", "c3_555": 1}))
    S.append(fr("s4", D("2026-11-12"), {"c1": "dim", "c1_63": 1, "c1_cov": 1, "c1_43": 1, "c2": "dim", "c2_hz": 1, "nov3": 1, "c3": "dim", "c3_555": 1, "c4": "on"}))
    S.append(fr("s5", D("2026-11-19"), {"c1": "dim", "c1_63": 1, "c1_cov": 1, "c1_43": 1, "c2": "dim", "c2_hz": 1, "nov3": 1, "c3": "dim", "c3_555": 1, "c4": "dim", "c5": "on"}))
    S.append(fr("s6", READ[0], {"c1": "all", "c1_63": 1, "c1_cov": 1, "c1_43": 1, "c2": "all", "c2_hz": 1, "nov3": 1, "c3": "all", "c3_555": 1, "c4": "all", "c5": "all", "final": 1}))
    spec = """C1 THE CENTERPIECE (Type 1 animated, CH2 red: red is the falling line and the 5 callouts). Bitcoin daily close OCT 1 -> NOV 21, 2026 (Yahoo BTC-USD)
+ the read 61,173 (CoinGecko, 2026-11-22 23:58 UTC) as the last point. Linear axis 52,000-92,000. The line reveals by a clip rect; a small filled
head dot rides the line end until the final state. Callout cards land one at a time (opacity + 10 px rise, 8 frames) and STAY: the newest is lit
(red rule + ring), earlier ones dim. Card positions are fixed in every state (pixel-identical).
s0  CH2@79.20  frame in (title card rides before it); 79.30-82.84 the line draws OCT 1 -> OCT 28 (ease-in-out), holds.
s1  ~87.6-88.1 the line steps one day to OCT 29; 88.22 callout 1 'OCT 29, 2026 / BINANCE HACK' lands on 'hacked'. Hold to 89.20 (cut to C7 receipt).
s1b CH2@97.90 return: callout 1 headline gains ', AROUND 6.3B'; 98.74 'BINANCE COVERED THE LOSSES'; 102.04 'BITCOIN MINUS 4.3% THAT DAY' on '4%'.
s2  CH2@108.60 return: 108.9-109.4 the line advances to OCT 30; 111.64 callout 2 'OCT 30, 2026 / OIL 117' on '117' (callout 1 dims).
s3  CH2@146.90 return: 'STRAIT OF HORMUZ' already under callout 2; 147.40 the line passes the 'NOV 3, ELECTION DAY' tick; draws on to NOV 5 by 150.0;
    150.20 callout 3 'NOV 5, 2026 / AFTER THE MIDTERMS' on 'two days later'. No party name anywhere.
s3b CH2@159.70 return: 161.50 'BITCOIN MINUS 5.55% THAT DAY' under callout 3 on '5%'.
s4  same hold: 162.0-165.3 the line draws to NOV 12; 165.58 callout 4 "NOV 12, 2026 / NVIDIA'S CEO RESIGNS" on 'resigns' (no reason given). Hold to 166.50.
s5  CH2@176.55 return: 176.6-178.5 the line draws to NOV 19; 178.66 callout 5 'NOV 19, 2026 / ANTHROPIC LISTS' on 'goes public'. Hold to 179.60.
s6  CH2@201.45 FINAL: 201.5-203.2 the line finishes to the read point; 203.3 the dashed OCT 28 CLOSE reference + the end card '61,173 / MINUS 24.7% FROM
    THE OCT 28, 2026 CLOSE' land; all 5 callouts light together (first time) on 'lost around a quarter' (~204.4). C1 never returns after 206.80.
DESIGN CALL: the end label uses the DATA.md read (61,173, minus 24.7%) rather than the NOV 20 close (58,798.98, minus 27.6%): the line ends at the read and
'around a quarter' is what he says. [VERIFY] re-pull the last point + label on the render day (if re-pulled, recompute vs 81,267.59)."""
    data = {"id": "C1", "series": [(d.strftime("%Y-%m-%d %H:%M"), round(v, 2)) for d, v in ser],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2026-10-01", "dmax": "2026-11-23", "vmin": 52000, "vmax": 92000},
            "callout_cards_anchor_px": {k: {"x": round(v[0], 1), "top": v[1], "anchor": v[2]} for k, v in CO.items()}}
    return "C1", CHARTS, S, data, spec


# ================================================================================================ C5
def build_C5():
    b = yahoo("yahoo-brent-1y.json")
    ser = window(b, "2026-02-27", "2026-11-20")
    assert abs(ser[0][1] - 72.48) < .006 and abs(val(b, "2026-10-30") - 117.64) < .006 and abs(ser[-1][1] - 92.57) < .006
    up = [x for x in ser if x[0] <= D("2026-10-30")]
    fall = [x for x in ser if x[0] >= D("2026-10-30")]
    P = Plot(220, 1500, 330, 880, D("2026-02-20"), D("2026-11-27"), 60, 130)
    p0, pPk, pEnd = P.pt(D("2026-02-27"), 72.48), P.pt(D("2026-10-30"), 117.64), P.pt(D("2026-11-20"), 92.57)

    def fr(sid, head, st):
        hx = P.X(head)
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{clip("c5-" + sid, P, hx, 6)}</defs>',
               grid_y(P, [70, 80, 90, 100, 110, 120], lambda v: f"{v:g}"),
               axis_x(P, [(D("2026-03-01"), "MAR 2026"), (D("2026-05-01"), "MAY"), (D("2026-07-01"), "JUL"), (D("2026-09-01"), "SEP"), (D("2026-11-01"), "NOV")]),
               f'<text class="axl" x="120" y="{P.y0 - 40}">USD A BARREL</text>',
               f'<path d="{P.area(up)}" fill="rgba(196,30,58,.10)" clip-path="url(#c5-{sid})"/>',
               f'<path d="{P.path(up)}" fill="none" stroke="var(--acc)" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#c5-{sid})"/>',
               f'<path d="{P.path(fall)}" fill="none" stroke="{WIRE}" stroke-width="3.5" stroke-linejoin="round" stroke-dasharray="2 0" opacity=".55" clip-path="url(#c5-{sid})"/>',
               f'<line x1="{p0[0]}" x2="{p0[0]}" y1="{p0[1] + 14}" y2="{P.y1}" stroke="{AXIS}" stroke-width="2" stroke-dasharray="3 5"/>',
               dot(*p0, "var(--acc)", r=8),
               dot(*pPk, "var(--acc)", r=11, fill="var(--acc)", halo=True, on=st.get("pk")),
               dot(*pEnd, WIRE, r=7, on=st.get("end")),
               '</svg>']
        inner = header("Brent crude, daily close", 'Strait of <span class="acc">Hormuz</span>')
        inner += "".join(svg)
        inner += box(p0[0] + 18, p0[1] + 18, '<div class="d">72.48, FEB 27, 2026</div><div class="e" style="font-size:21px">BEFORE THE WAR</div>',
                     cls="co" + (" dim" if st.get("pk") else " on"), anchor="left")
        inner += box(pPk[0] - 24, pPk[1] - 4, '<div class="d">OCT 30, 2026</div><div class="e mono" style="font-family:\'JetBrains Mono\';font-size:32px">117.64</div>',
                     cls="co on", on=st.get("pk"), anchor="mid-right")
        inner += box(pEnd[0] + 22, pEnd[1] + 4, '<div class="d">92.57, NOV 20, 2026</div>', cls="co dim", on=st.get("end"), anchor="mid-left")
        inner += src("Brent crude (BZ=F) daily close: Yahoo Finance, read 2026-11-22 · the war began Feb 28, 2026 (ABC News) · the fall after Oct 30 is drawn dim")
        return frame(f"C5-{sid}", "red", inner)

    frames = [fr("start", D("2026-02-27"), {}), fr("mid", D("2026-07-15"), {}), fr("payoff", D("2026-11-20"), {"pk": 1, "end": 1})]
    spec = """C5 BRENT CRUDE (Type 1 animated, CH2 red), beat CH2@117.15-122.45 (5.3 s), headline 'Strait of Hormuz'.
Line = Yahoo BZ=F daily closes FEB 27 -> NOV 20, 2026; up-leg (to OCT 30) in red with area, the fall OCT 30 -> NOV 20 in dim grey (nothing cropped).
117.15 frame in = start (the '72.48, FEB 27, 2026 / BEFORE THE WAR' card is on from the start, lit); 117.30-119.30 the line draws FEB 27 -> OCT 30
(ease-in-out) on 'building since February' (mid = mid-draw); 119.38 the 117.64 OCT 30 card + filled dot land, the before-war card dims;
119.50-120.60 the dim fall draws to 92.57 NOV 20 + its small dim label = payoff; hold to 122.45. Past tense only: the chart is dated and shows the fall."""
    data = {"id": "C5", "series": [(d.strftime("%Y-%m-%d"), round(v, 2)) for d, v in ser],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2026-02-20", "dmax": "2026-11-27", "vmin": 60, "vmax": 130}}
    return "C5", CHARTS, frames, data, spec


# ================================================================================================ C-NVDA
def build_CNVDA():
    b = yahoo("yahoo-nvda-1y.json")
    ser = window(b, "2026-09-01", "2026-11-20")
    assert abs(val(b, "2026-10-06") - 239.24) < .006 and abs(ser[-1][1] - 125.53) < .006
    P = Plot(220, 1440, 330, 880, D("2026-09-01"), D("2026-11-24"), 100, 260)
    pHi, pEnd = P.pt(D("2026-10-06"), 239.24), P.pt(D("2026-11-20"), 125.53)

    def fr(sid, head, st):
        hx = P.X(head)
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{clip("nv-" + sid, P, hx, 6)}</defs>',
               grid_y(P, [125, 150, 175, 200, 225, 250], lambda v: f"{v:g}"),
               axis_x(P, [(D("2026-09-01"), "SEP 1"), (D("2026-10-01"), "OCT 1"), (D("2026-11-01"), "NOV 1")]),
               f'<text class="axl" x="120" y="{P.y0 - 40}">USD A SHARE</text>',
               f'<path d="{P.area(ser)}" fill="rgba(196,30,58,.10)" clip-path="url(#nv-{sid})"/>',
               f'<path d="{P.path(ser)}" fill="none" stroke="var(--acc)" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#nv-{sid})"/>',
               f'<g{op(st.get("end"))}><line x1="{pHi[0]}" x2="{pEnd[0] + 60}" y1="{pHi[1]}" y2="{pHi[1]}" stroke="{INK}" stroke-width="1.6" stroke-dasharray="7 6" opacity=".5"/>'
               f'<path d="M{pEnd[0] + 60},{pHi[1] + 8} L{pEnd[0] + 60},{pEnd[1] - 16}" stroke="var(--acc)" stroke-width="3" marker-end="url(#ah-a)" fill="none"/></g>',
               dot(*pHi, "var(--acc)", r=9),
               dot(*pEnd, "var(--acc)", r=11, fill="var(--acc)", halo=True, on=st.get("end")),
               '</svg>']
        svg[0] = svg[0].replace("<defs>", "<defs>" + ARROW_DEFS[6:-7], 1)
        inner = header("Nvidia, daily close", 'Down from its <span class="acc">October high</span>')
        inner += "".join(svg)
        inner += box(pHi[0] + 20, pHi[1] - 6, '<div class="d">OCT 6, 2026, THE RECORD CLOSE</div><div class="e mono" style="font-family:\'JetBrains Mono\';font-size:32px">239.24</div>',
                     cls="co" + (" dim" if st.get("end") else " on"), anchor="bottom-left")
        inner += box(pEnd[0] - 24, pEnd[1] + 4, '<div class="d">NOV 20, 2026 CLOSE</div><div class="e mono" style="font-family:\'JetBrains Mono\';font-size:32px">125.53</div>',
                     cls="co dim", on=st.get("end"), anchor="mid-right")
        inner += box(pEnd[0] + 84, (pHi[1] + pEnd[1]) / 2, '<span class="mono" style="font-size:54px;font-weight:600">MINUS 47.5%</span>',
                     cls="endlbl", on=st.get("end"), anchor="mid-left", extra="color:var(--acc);font-family:'JetBrains Mono'")
        inner += src("Nvidia (NVDA) daily close: Yahoo Finance, read 2026-11-22 · OCT 6, 2026 record close to the NOV 20, 2026 close (dated: the stock moved after this)")
        return frame(f"C-NVDA-{sid}", "red", inner)

    frames = [fr("start", D("2026-10-06"), {}), fr("mid", D("2026-11-05"), {}), fr("payoff", D("2026-11-20"), {"end": 1})]
    spec = """C-NVDA (Type 1 animated, CH2 red), beat CH2@172.30-176.55 (4.25 s), headline 'Down from its October high'.
Line = Yahoo NVDA daily closes SEP 1 -> NOV 20, 2026. 172.30 frame in with the line drawn SEP 1 -> OCT 6 and the '239.24 / OCT 6, 2026, THE RECORD CLOSE'
card lit = start; 172.40-173.90 the line draws OCT 6 -> NOV 20 (ease-in, it falls; mid = NOV 5); 174.02 on '47%': the dashed record reference, the drop arrow,
'MINUS 47.5%' and the '125.53 / NOV 20, 2026 CLOSE' card land together = payoff; hold to 176.55. Dated, never 'now': the stock rose on 2026-11-23."""
    data = {"id": "C-NVDA", "series": [(d.strftime("%Y-%m-%d"), round(v, 2)) for d, v in ser],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2026-09-01", "dmax": "2026-11-24", "vmin": 100, "vmax": 260}}
    return "C-NVDA", CHARTS, frames, data, spec


# ================================================================================================ C-SPACEX
def build_CSPACEX():
    b = yahoo("yahoo-btc-1y.json")
    ser = window(b, "2026-06-01", "2026-09-30")
    assert abs(val(b, "2026-06-12") - 63543.2) < .01 and abs(val(b, "2026-06-30") - 58558.86) < .01 and abs(val(b, "2026-09-21") - 86602.91) < .01
    P = Plot(230, 1500, 330, 870, D("2026-06-01"), D("2026-10-01"), 50000, 95000)
    pS, pL, pU = P.pt(D("2026-06-12"), 63543.2), P.pt(D("2026-06-30"), 58558.86), P.pt(D("2026-09-21"), 86602.91)

    def fr(sid, head, st):
        hx = P.X(head)
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{ARROW_DEFS[6:-7]}{clip("sx-" + sid, P, hx, 6)}</defs>',
               grid_y(P, [50000, 60000, 70000, 80000, 90000], lambda v: fnum(v)),
               axis_x(P, [(D("2026-06-01"), "JUN 2026"), (D("2026-07-01"), "JUL"), (D("2026-08-01"), "AUG"), (D("2026-09-01"), "SEP")]),
               f'<text class="axl" x="120" y="{P.y0 - 40}">BITCOIN, USD</text>',
               f'<path d="{P.area(ser)}" fill="rgba(196,30,58,.08)" clip-path="url(#sx-{sid})"/>',
               f'<path d="{P.path(ser)}" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#sx-{sid})"/>',
               vguide(pS[0], P.y0 + 40, P.y1, "var(--acc)", on=st.get("s"), dash="5 6", w=2.5),
               dot(*pS, "var(--acc)", r=9, on=st.get("s")),
               vguide(pL[0], pL[1] - 14, 628, "var(--acc)" if st.get("l") == "on" else WIRE, on=st.get("l"), dash="4 5"),
               dot(*pL, "var(--acc)", r=11, fill="var(--acc)", halo=True, on=st.get("l")),
               f'<g{op(st.get("u"))}><line x1="{pL[0]}" x2="{pU[0]}" y1="{pL[1]}" y2="{pL[1]}" stroke="{INK}" stroke-width="1.6" stroke-dasharray="7 6" opacity=".45"/>'
               f'<path d="M{pU[0]},{pL[1] - 10} L{pU[0]},{pU[1] + 18}" stroke="{GREEN[0]}" stroke-width="3" fill="none" marker-end="url(#ah-g)"/></g>',
               dot(*pU, GREEN[0], r=10, fill=GREEN[0], halo=True, on=st.get("u")),
               '</svg>']
        inner = header("Bitcoin, daily close, June to September 2026", 'After the last <span class="acc">mega IPO</span>')
        inner += "".join(svg)
        inner += box(pS[0] + 16, P.y0 + 30, '<div class="d">JUNE 12, 2026</div><div class="e">SPACEX LISTS</div>',
                     cls="co" + (" on" if st.get("s") == "on" else " dim"), on=st.get("s"), anchor="left")
        inner += box(pL[0] - 14, 520, '<div class="d">58,558.86, JUNE 30, 2026</div><div class="e" style="font-size:21px">LOWEST DAILY CLOSE OF 2026</div><div class="t acc">18 DAYS LATER</div>',
                     cls="co" + (" on" if st.get("l") == "on" else " dim"), on=st.get("l"), anchor="left")
        inner += box(pU[0] - 24, pU[1] - 6, '<div class="d">86,602.91, SEPT 21, 2026</div><div class="e mono" style="font-family:\'JetBrains Mono\';font-size:32px;color:' + GREEN[0] + '">PLUS 48%</div>',
                     cls="co" + (" on" if st.get("u") == "on" else " dim"), on=st.get("u"), anchor="mid-right", extra=f"border-left-color:{GREEN[0]}")
        inner += box(1500, 230, "ONE TIME. NOT A RULE.", cls="pill acc dash", on=st.get("tag"), anchor="right", extra="font-size:22px;padding:10px 22px")
        inner += src("Bitcoin daily close: Yahoo Finance BTC-USD, read 2026-11-22 · SpaceX first traded June 12, 2026 (NPR, 2026-06-12, opened 2026-11-23) · plus 48% = 58,558.86 to 86,602.91")
        return frame(f"C-SPACEX-{sid}", "red", inner)

    frames = [fr("start", D("2026-06-01"), {}),
              fr("listing", D("2026-06-12"), {"s": "on"}),
              fr("low", D("2026-06-30"), {"s": "dim", "l": "on"}),
              fr("rally", D("2026-09-30"), {"s": "dim", "l": "dim", "u": "on"}),
              fr("payoff", D("2026-09-30"), {"s": "dim", "l": "dim", "u": "dim", "tag": "on"})]
    spec = """C-SPACEX (Type 1 animated, CH2 red), beat CH2@192.90-201.45 (8.55 s), headline 'After the last mega IPO'.
Line = Yahoo BTC-USD daily closes JUN 1 -> SEP 30, 2026, in ink (the markers carry the red; the +48% leg is GREEN on purpose: an up move in red would read as a fall).
192.90 frame in, axes, no line = start; 192.95-193.00 line to JUN 12; 193.02 'SPACEX LISTS / JUNE 12, 2026' card + red guide = listing
(DATE VERIFIED 2026-11-23: NPR 'SpaceX stock gains 19% on first day of trading', published 2026-06-12, 'first day of trading on Friday');
193.05-194.30 line to JUN 30; 194.38 '58,558.86, JUNE 30, 2026 / LOWEST DAILY CLOSE OF 2026 / 18 DAYS LATER' = low;
194.45-196.30 line draws on to SEP 30; 196.40 the green arrow + 'PLUS 48% / 86,602.91, SEPT 21, 2026' = rally;
198.06 the dashed tag 'ONE TIME. NOT A RULE.' = payoff; hold to 201.45."""
    data = {"id": "C-SPACEX", "series": [(d.strftime("%Y-%m-%d"), round(v, 2)) for d, v in ser],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2026-06-01", "dmax": "2026-10-01", "vmin": 50000, "vmax": 95000}}
    return "C-SPACEX", CHARTS, frames, data, spec


# ================================================================================================ C2
def build_C2():
    spx = window(yahoo("yahoo-spx-1y.json"), "2026-10-06", "2026-11-20")
    ndx = window(yahoo("yahoo-ndx-1y.json"), "2026-10-06", "2026-11-20")
    s0, n0 = spx[0][1], ndx[0][1]
    assert abs(s0 - 7818.93) < .01 and abs(n0 - 31224.47) < .01
    sp = [(d, (v / s0 - 1) * 100) for d, v in spx]
    nd = [(d, (v / n0 - 1) * 100) for d, v in ndx]
    assert abs(sp[-1][1] + 11.62) < .01 and abs(nd[-1][1] + 19.84) < .01
    P = Plot(230, 1360, 330, 880, D("2026-10-06"), D("2026-11-20"), -25, 3)
    pS, pN = P.pt(*sp[-1]), P.pt(*nd[-1])
    pI = P.pt(D("2026-11-20"), -20.2)
    y20 = round(P.Y(-20), 2)

    def fr(sid, head, st):
        hx = P.X(head)
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{clip("c2-" + sid, P, hx, 6)}</defs>',
               grid_y(P, [0, -5, -10, -15], lambda v: "0%" if v == 0 else f"MINUS {abs(v):g}%"),
               axis_x(P, [(D("2026-10-06"), "OCT 6, 2026"), (D("2026-10-20"), "OCT 20"), (D("2026-11-03"), "NOV 3"), (D("2026-11-20"), "NOV 20")]),
               f'<text class="axl" x="120" y="{P.y0 - 40}">FROM THE RECORD CLOSE</text>',
               f'<line x1="{P.x0}" x2="{P.x1}" y1="{P.Y(0)}" y2="{P.Y(0)}" stroke="{AXIS}" stroke-width="2"/>',
               # MINUS 20% line: UNDER the series and ending short of the Nasdaq-100 end dot's halo (QA 2026-11-24: it used to cross the dot)
               f'<g{op(st.get("m20"))}><line x1="{P.x0}" x2="{pN[0] - 30}" y1="{y20}" y2="{y20}" stroke="var(--acc)" stroke-width="2.5" stroke-dasharray="10 8"/>'
               f'<text class="tk" x="{P.x0 - 18}" y="{y20 + 6}" text-anchor="end" style="fill:var(--acc);font-weight:600">MINUS 20%</text></g>',
               f'<path d="{P.path(sp)}" fill="none" stroke="{INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#c2-{sid})"/>',
               f'<path d="{P.path(nd)}" fill="none" stroke="var(--acc)" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#c2-{sid})"/>',
               dot(*P.pt(D("2026-10-06"), 0), INK, r=9, fill=INK),
               dot(*pS, INK, r=9, fill=INK, on=st.get("s")),
               dot(*pN, "var(--acc)", r=10, fill="var(--acc)", halo=True, on=st.get("n")),
               '</svg>']
        inner = header("The S&amp;P 500 and the Nasdaq-100", 'Stocks <span class="acc">dumped</span> too')
        inner += "".join(svg)
        inner += box(P.x0 + 18, P.Y(0) - 14, '<div class="d">OCT 6, 2026, BOTH AT RECORD CLOSES</div>', cls="co dim", anchor="bottom-left",
                     extra="padding:6px 14px")
        inner += box(pS[0] + 26, pS[1], '<div class="d">S&amp;P 500</div><div class="e mono" style="font-family:\'JetBrains Mono\';font-size:30px">MINUS 11.6%</div>',
                     cls="co" + (" on" if st.get("s") == "on" else " dim"), on=st.get("s"), anchor="mid-left", extra=f"border-left-color:{INK}")
        inner += box(pN[0] + 26, pN[1] - 22, '<div class="d">NASDAQ-100</div><div class="e mono" style="font-family:\'JetBrains Mono\';font-size:30px;color:var(--acc)">MINUS 19.84%</div>'
                     '<div class="t">NOV 20, 2026 CLOSE</div>', cls="co" + (" on" if st.get("n") == "on" else " dim"), on=st.get("n"), anchor="mid-left")
        inner += box(pI[0] + 26, pI[1] + 58, '<div class="t" style="margin-top:0">INTRADAY LOW <span class="mono">20.2%</span> UNDER THE RECORD</div>',
                     cls="co on", on=st.get("m20"), anchor="left", extra="border-left-style:dashed")
        inner += src("S&amp;P 500 (^GSPC) and Nasdaq-100 (^NDX) daily closes: Yahoo Finance, read 2026-11-22 · from the OCT 6, 2026 record closes (7,818.93 and 31,224.47) · "
                     "the Nasdaq-100 crossed 20% only intraday on NOV 20, 2026 (low 24,910.48)")
        return frame(f"C2-{sid}", "red", inner)

    end = D("2026-11-20")
    frames = [fr("start", D("2026-10-06"), {}),
              fr("sp500", end, {"s": "on"}),
              fr("ndx", end, {"s": "dim", "n": "on"}),
              fr("payoff", end, {"s": "dim", "n": "dim", "m20": 1})]
    spec = """C2 INDEX CHART (Type 1 animated, CH2 red), beat CH2@206.80-216.528, headline 'Stocks dumped too'. Both indices plotted as % from their OCT 6, 2026
record closes (Yahoo ^GSPC, ^NDX daily closes to NOV 20, 2026). S&P 500 in ink, Nasdaq-100 in red (lit).
206.80 frame in, both at 0% with the 'OCT 6, 2026, BOTH AT RECORD CLOSES' tag = start; 206.90-208.90 both lines draw together (ease-in-out);
209.08 'S&P 500 / MINUS 11.6%' lands on '10%' = sp500; 212.86 'NASDAQ-100 / MINUS 19.84% / NOV 20, 2026 CLOSE' lands = ndx (S&P card dims);
215.92 the dashed MINUS 20% line draws left to right (8 frames) UNDER both lines, stopping short of the solid Nasdaq-100 end dot (no separate intraday marker:
  the 20.2% low sits 7 px under the close at the same x), + 'INTRADAY LOW 20.2% UNDER THE RECORD' (dashed-edge card) lands on 'bear market' = payoff.
GUARDS: no CLOSING figure of 20% or more anywhere; the S&P 500 is never called a bear market; the words 'bear market' are never printed.
Ends on the F4 picture edge (216.528). [VERIFY] if a NOV 23 close is used at render, re-derive both labels."""
    data = {"id": "C2", "spx_pct": [(d.strftime("%Y-%m-%d"), round(v, 3)) for d, v in sp], "ndx_pct": [(d.strftime("%Y-%m-%d"), round(v, 3)) for d, v in nd],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2026-10-06", "dmax": "2026-11-20", "vmin": -25, "vmax": 3}}
    return "C2", CHARTS, frames, data, spec


# ================================================================================================ C16-ZOOM
def build_C16ZOOM():
    s = [x for x in pieverse_series() if x[0] <= D("2025-11-30")]
    P = Plot(250, 1300, 330, 860, D("2025-11-13 12:00"), D("2025-12-01"), 0.0, 0.6)
    pRun, pPull = P.pt(D("2025-11-25"), 0.518), P.pt(D("2025-11-30"), 0.3376)

    def fr(sid, head, st):
        hx = P.X(head)
        svg = [f'<svg class="plot" viewBox="0 0 1920 1080"><defs>{clip("cz-" + sid, P, hx, 6)}</defs>',
               grid_y(P, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6], lambda v: f"{v:.2f}"),
               axis_x(P, [(D("2025-11-14"), "NOV 14, 2025"), (D("2025-11-18"), "NOV 18"), (D("2025-11-22"), "NOV 22"), (D("2025-11-26"), "NOV 26"), (D("2025-11-30"), "NOV 30")]),
               f'<text class="axl" x="120" y="{P.y0 - 40}">USD</text>',
               f'<path d="{P.area(s)}" fill="rgba(0,122,85,.11)" clip-path="url(#cz-{sid})"/>',
               f'<path d="{P.path(s)}" fill="none" stroke="var(--acc)" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#cz-{sid})"/>',
               dot(*pRun, "var(--acc)", r=9, on=st.get("run")),
               dot(*pPull, "var(--acc)", r=12, fill="var(--acc)" if st.get("call") else "#fff", halo=bool(st.get("call")), on=st.get("pull")),
               '</svg>']
        inner = header("Pieverse, November 2025", 'Don\'t chase it. <span class="acc">Wait.</span>')
        inner += "".join(svg)
        inner += box(pRun[0], pRun[1] - 22, '<div class="d">0.518, NOV 25, 2025</div><div class="e">ALREADY PUMPING</div>',
                     cls="co" + (" on" if st.get("run") == "on" else " dim"), on=st.get("run"), anchor="bottom-center")
        inner += box(pPull[0] + 34, pPull[1] - 12, '<div class="d">0.338, NOV 30, 2025</div><div class="e">WAIT FOR THE PULLBACK</div>',
                     cls="co" + (" on" if st.get("pull") == "on" else " dim"), on=st.get("pull"), anchor="bottom-left")
        inner += box(pPull[0] + 34, pPull[1] + 12, '<div class="e">MY CALL, AROUND A 65M CAP</div>',
                     cls="co on", on=st.get("call"), anchor="left")
        inner += src("Pieverse price: CoinGecko daily prints (00:00 UTC) + its all-time low (0.119, 2025-11-14 13:01 UTC) · first 9 days from the saved Nov 2025 pull · read 2026-11-22")
        return frame(f"C16-ZOOM-{sid}", "green", inner)

    frames = [fr("start", D("2025-11-25"), {}),
              fr("pumping", D("2025-11-25"), {"run": "on"}),
              fr("pullback", D("2025-11-30"), {"run": "dim", "pull": "on"}),
              fr("payoff", D("2025-11-30"), {"run": "dim", "pull": "dim", "call": "on"})]
    spec = """C16-ZOOM (Type 1 animated, CH4 green), beat CH4@437.55-444.58 (7.03 s), headline "Don't chase it. Wait." Pieverse NOVEMBER 2025 only, linear axis,
same series as C16 (launch-day low included) but its own frame so C16 is not shown a third time.
437.55 frame in with the line drawn NOV 14 -> NOV 25 (the run already on screen) = start; 440.42 '0.518, NOV 25, 2025 / ALREADY PUMPING' lands = pumping;
440.50-441.40 the line draws on to NOV 30; 441.48 '0.338, NOV 30, 2025 / WAIT FOR THE PULLBACK' + hollow dot = pullback;
444.00 the dot fills + 'MY CALL, AROUND A 65M CAP' lands on 'Pieverse' = payoff; hold to 444.58."""
    data = {"id": "C16-ZOOM", "series": [(d.strftime("%Y-%m-%d %H:%M"), round(v, 6)) for d, v in s],
            "plot": {"x0": P.x0, "x1": P.x1, "y0": P.y0, "y1": P.y1, "dmin": "2025-11-13 12:00", "dmax": "2025-12-01", "vmin": 0, "vmax": 0.6}}
    return "C16-ZOOM", CHARTS, frames, data, spec


# ================================================================================================ C23
def build_C23():
    years = list(range(1950, 2023, 4))
    s = yahoo("yahoo-spx-max.json") if False else None  # the max file has pre-1970 timestamps: parsed below with timedelta
    r = json.load(open(RES / "yahoo-spx-max.json", encoding="utf-8"))["chart"]["result"][0]
    ser = [((EPOCH + dt.timedelta(seconds=t)).date(), v) for t, v in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]) if v is not None]
    dates = [d for d, _ in ser]
    import bisect

    def on_or_before(d):
        return ser[bisect.bisect_right(dates, d) - 1][1]

    def eday(y):
        d = dt.date(y, 11, 1)
        while d.weekday() != 0:
            d += dt.timedelta(1)
        return d + dt.timedelta(1)

    rows = []
    for y in years:
        e = eday(y)
        a, b = on_or_before(e), on_or_before(dt.date(y + 1, e.month, e.day))
        rows.append((y, (b / a - 1) * 100))
    import statistics
    med = statistics.median(v for _, v in rows)
    assert len(rows) == 19 and all(v > 0 for _, v in rows) and abs(med - 14.49) < .02
    DIPS = {1974: -13.4, 2002: -12.5, 2018: -14.7}  # DATA.md Pillar 5
    x0, x1, yz, ytop = 250, 1460, 650, 350  # zero line at y=650, +40% at ytop; the dip panel hangs under the year labels
    k = (yz - ytop) / 40.0
    bw = (x1 - x0) / 19

    def fr(sid, nbars, st):
        svg = ['<svg class="plot" viewBox="0 0 1920 1080">']
        for t in (10, 20, 30, 40):
            y = yz - t * k
            svg.append(f'<line x1="{x0}" x2="{x1}" y1="{y}" y2="{y}" stroke="{GRID}" stroke-width="1.5" stroke-dasharray="4 7"/>'
                       f'<text class="tk" x="{x0 - 18}" y="{y + 6}" text-anchor="end">PLUS {t}%</text>')
        svg.append(f'<text class="tk" x="{x0 - 18}" y="{yz + 6}" text-anchor="end">0%</text>')
        for i, (y, v) in enumerate(rows):
            cx = x0 + bw * (i + .5)
            h = v * k
            on = i < nbars
            svg.append(f'<rect x="{cx - bw * .3:.2f}" y="{yz - h:.2f}" width="{bw * .6:.2f}" height="{h:.2f}" rx="4" fill="var(--acc)"'
                       f' opacity="{(1 if on else 0) * (.45 if st.get("dips") and y not in DIPS else 1)}"/>')
            svg.append(f'<text class="tk" x="{cx:.2f}" y="{yz + 36}" text-anchor="middle" style="font-size:17px">{str(y)[2:] if y not in (1950, 2022) else y}</text>')
            if y in DIPS:
                dh = -DIPS[y] * k
                yd = yz + 58  # the dip panel's own zero, under the year labels (same px per %)
                svg.append(f'<g{op(st.get("dips"))}><rect x="{cx - bw * .3:.2f}" y="{yd:.2f}" width="{bw * .6:.2f}" height="{dh:.2f}" rx="4" fill="{RED[0]}" opacity=".9"/>'
                           f'<text class="lbl" x="{cx:.2f}" y="{yd + dh + 30:.2f}" text-anchor="middle" style="fill:{RED[0]};font-size:18px">MINUS {abs(DIPS[y])}%</text></g>')
        svg.append(f'<line x1="{x0}" x2="{x1}" y1="{yz}" y2="{yz}" stroke="{AXIS}" stroke-width="2"/>')
        svg.append(f'<line x1="{x0}" x2="{x1}" y1="{yz + 58}" y2="{yz + 58}" stroke="{RED[0]}" stroke-width="1.5" stroke-dasharray="3 6" opacity=".6"{op(st.get("dips"))}/>')
        ym = yz - med * k
        svg.append(f'<g{op(st.get("med"))}><line x1="{x0}" x2="{x1 + 20}" y1="{ym:.2f}" y2="{ym:.2f}" stroke="{INK}" stroke-width="2" stroke-dasharray="9 7"/></g>')
        svg.append('</svg>')
        inner = header("What came after", 'The S&amp;P 500, <span class="acc">12 months after</span> each midterm')
        inner += "".join(svg)
        inner += box(x1 + 34, ym, '<div class="d">MEDIAN</div><div class="e mono" style="font-family:\'JetBrains Mono\';font-size:30px">PLUS 14.5%</div>',
                     cls="co dim" if st.get("dips") else "co on", on=st.get("med"), anchor="mid-left", extra=f"border-left-color:{INK}")
        inner += box(x0 + 10, 258, '<span class="mono" style="font-size:60px;font-weight:600;color:var(--acc)">19 OF 19</span>'
                     '<span style="font-family:\'DM Sans\';font-weight:700;font-size:30px;letter-spacing:.08em;color:var(--ink);margin-left:20px">HIGHER, 12 MONTHS LATER</span>',
                     cls="endlbl", on=st.get("med"), anchor="left")
        inner += box(x1 + 20, 262, "S&amp;P 500, A STOCK MARKET STAT", cls="pill dash", on=st.get("tag"), anchor="right", extra="font-size:20px")
        inner += box(x0 + 10, yz + 74,'<span style="font-family:\'DM Sans\';font-weight:700;font-size:21px;letter-spacing:.12em;color:' + RED[0] + '">THE WORST DIP ON THE WAY</span>',
                     cls="endlbl", on=st.get("dips"), anchor="left")
        inner += src("S&amp;P 500 (^GSPC) daily closes, Yahoo Finance (read 2026-11-22): the close on election day vs 12 months later, 19 midterms 1950 to 2022 · "
                     "median plus 14.5% · worst dips: 1974, 2002, 2018 · a stock market statistic, not a crypto one")
        return frame(f"C23-{sid}", "cyan", inner)

    frames = [fr("start", 0, {}), fr("mid", 10, {}), fr("all19", 19, {"med": 1}), fr("tag", 19, {"med": 1, "tag": 1}), fr("dips", 19, {"med": 1, "tag": 1, "dips": 1})]
    spec = """C23 MIDTERM PRECEDENT (Type 1 animated, CH5 cyan), beat CH5@474.65-489.20 (14.55 s). 19 bars = the S&P 500's change from the election-day close to the
close 12 months later, 1950 to 2022 (DATA.md Pillar 5 method on research/yahoo-spx-max.json; for 1950-1966 the market was shut on election day, so the
prior close is used, which is how the DATA.md median of 14.5% was computed). No per-bar value is printed: only 19 OF 19, the median and the 3 dips.
474.65 frame in (title card rides before it); 474.72 eyebrow 'WHAT CAME AFTER' and the axes = start;
477.54-481.20 the 19 bars GROW from the zero line one after another, left to right (each 0.45 s ease-out, staggered 0.19 s) (mid = 10 grown);
481.56 '19 OF 19 HIGHER, 12 MONTHS LATER' lands + the dashed median line draws + 'MEDIAN PLUS 14.5%' = all19;
485.52 the dashed tag 'S&P 500, A STOCK MARKET STAT' = tag;
486.80 the other 16 bars dim to 45%, three RED bars grow DOWN from zero under 1974, 2002, 2018 with 'MINUS 13.4%', 'MINUS 12.5%', 'MINUS 14.7%'
and 'THE WORST DIP ON THE WAY' = dips; hold to 489.20. GUARDS: never 'always', never applied to crypto."""
    data = {"id": "C23", "bars_pct_12m": [(y, round(v, 2)) for y, v in rows], "median": round(med, 2), "dips": DIPS,
            "geom": {"x0": x0, "x1": x1, "zero_y": yz, "px_per_pct": k}}
    return "C23", CHARTS, frames, data, spec


# ================================================================================================ C24
def build_C24():
    r = json.load(open(RES / "yahoo-btc-max.json", encoding="utf-8"))["chart"]["result"][0]
    ser = {(EPOCH + dt.timedelta(seconds=t)).date(): v for t, v in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]) if v is not None}
    m18 = ser[dt.date(2019, 12, 15)] / ser[dt.date(2018, 12, 15)]
    m22 = ser[dt.date(2023, 11, 21)] / ser[dt.date(2022, 11, 21)]
    assert round(m18, 2) == 2.21 and round(m22, 2) == 2.27
    yb, k = 860, 200  # baseline (0x) y, px per 1x
    bars = [("2018", "LOW CLOSE 3,237, DEC 15, 2018", m18, "2.21x", 660), ("2022", "LOW CLOSE 15,787, NOV 21, 2022", m22, "2.27x", 1160)]

    def fr(sid, frac, st):
        svg = ['<svg class="plot" viewBox="0 0 1920 1080">']
        for t in (1, 2):
            y = yb - t * k
            svg.append(f'<line x1="420" x2="1560" y1="{y}" y2="{y}" stroke="{GRID if t == 2 else INK}" stroke-width="{1.5 if t == 2 else 2}" stroke-dasharray="{"4 7" if t == 2 else "9 7"}" opacity="{1 if t == 2 else .55}"/>'
                       f'<text class="tk" x="400" y="{y + 6}" text-anchor="end">{t}x</text>')
        svg.append(f'<text class="lblm" x="1560" y="{yb - k - 14}" text-anchor="end">1x = THE LOW</text>')
        svg.append(f'<line x1="420" x2="1560" y1="{yb}" y2="{yb}" stroke="{AXIS}" stroke-width="2"/>')
        for yr, sub, m, lab, cx in bars:
            h = m * k * frac
            svg.append(f'<rect x="{cx - 110}" y="{yb - h:.2f}" width="220" height="{h:.2f}" rx="6" fill="var(--acc)"{op(frac > 0)}/>')
            svg.append(f'<text class="cap" x="{cx}" y="{yb + 44}" text-anchor="middle">{yr} BEAR MARKET LOW</text>')
            svg.append(f'<text class="lblm" x="{cx}" y="{yb + 74}" text-anchor="middle" style="font-size:17px">{sub}</text>')
        svg.append('</svg>')
        inner = header("Bitcoin after its last two bear market lows", 'More than <span class="acc">doubled</span> within a year')
        inner += "".join(svg)
        for yr, sub, m, lab, cx in bars:
            inner += box(cx, yb - m * k - 16, f'<span class="mono" style="font-size:60px;font-weight:600;color:var(--acc)">{lab}</span>'
                         '<div style="font-family:\'DM Sans\';font-weight:700;font-size:20px;letter-spacing:.12em;color:var(--text-secondary);text-align:center">AFTER 12 MONTHS</div>',
                         cls="endlbl", on=st.get("vals"), anchor="bottom-center")
        inner += box(1560, 236, "THE LAST TWO TIMES", cls="pill acc", on=True, anchor="right", extra="font-size:22px;padding:10px 22px")
        inner += src("Bitcoin (BTC-USD) daily closes: Yahoo Finance, read 2026-11-22 · the 2018 and 2022 bear market low closes vs the close 12 months later · two samples")
        return frame(f"C24-{sid}", "cyan", inner)

    frames = [fr("start", 0, {}), fr("mid", .55, {}), fr("payoff", 1, {"vals": 1})]
    spec = """C24 (Type 1 animated, CH5 cyan), beat CH5@489.20-495.60 (6.4 s), headline 'More than doubled within a year'. Two bars on a 0x baseline with a dashed 1x = THE LOW line:
2018 low close (3,237, DEC 15, 2018) -> 2.21x after 12 months; 2022 low close (15,787, NOV 21, 2022) -> 2.27x after 12 months (DATA.md Pillar 5, recomputed from yahoo-btc-max.json).
489.20 frame in with axes + both bar labels; 490.72 the pill 'THE LAST TWO TIMES' (already on at start in the still) fades/lifts in = start;
491.80-493.70 both bars GROW together from 0 (ease-out; mid = 55%); 493.84 '2.21x' and '2.27x' + 'AFTER 12 MONTHS' land on 'more than doubled' = payoff; hold to 495.60.
GUARD: no 24-month figure (6x) anywhere; the words 'THE LAST TWO TIMES' stay on screen throughout."""
    data = {"id": "C24", "multiples_12m": {"2018": round(m18, 3), "2022": round(m22, 3)}, "geom": {"baseline_y": yb, "px_per_x": k, "bar_cx": [660, 1160], "bar_w": 220}}
    return "C24", CHARTS, frames, data, spec


# ================================================================================================ DIAGRAMS
DIAG_CSS = ""


def dgsvg(inner):
    return f'<svg class="plot" viewBox="0 0 1920 1080">{ARROW_DEFS}{inner}</svg>'


def node(x, y, w, h, title, sub="", cls="", fs=26, on=True, pad=10, style=""):
    s = f'<div class="s">{sub}</div>' if sub else ""
    return (f'<div class="nd {cls}{hid(on)}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;padding:0 {pad}px;{style}">'
            f'<div class="t" style="font-size:{fs}px">{title}</div>{s}</div>')


def wire(x1, y1, x2, y2, lit=False, on=True, curve=None, dash=None, soft=False):
    """lit = accent (the live wire); soft = accent at half strength (landed earlier); else the resting grey wire."""
    c = "var(--acc)" if (lit or soft) else WIRE
    m = "url(#ah-a)" if (lit or soft) else "url(#ah-w)"
    d = f"M{x1},{y1} L{x2},{y2}" if curve is None else f"M{x1},{y1} Q{curve[0]},{curve[1]} {x2},{y2}"
    da = f' stroke-dasharray="{dash}"' if dash else ""
    o = ' opacity=".45"' if (soft and not lit) else ""
    vis = "" if on else ' style="opacity:0"'
    return f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{4 if lit else 3}"{da}{o} marker-end="{m}"{vis}/>'


def build_DRATES():
    labels = ["HIGHER RATES", "LESS MONEY IN THE ECONOMY", "FEWER BUSINESS LOANS", "LESS EXPANSION", "LESS JOB GROWTH", "LESS MONEY INTO CRYPTO"]
    W, H, G = 236, 236, 52
    x0 = (1920 - (6 * W + 5 * G)) // 2
    y = 450
    frames = []
    for k in range(1, 7):
        nodes, wires = [], []
        for i, lab in enumerate(labels):
            x = x0 + i * (W + G)
            cls = "hot" if i == k - 1 else ("lit" if i < k - 1 else "ghost")
            nodes.append(node(x, y, W, H, lab, cls=cls, fs=23, pad=16))
            if i < 5:
                wires.append(wire(x + W + 8, y + H / 2, x + W + G - 8, y + H / 2, lit=(i + 1 == k - 1), soft=(i + 1 < k - 1)))
        inner = header("Why it reaches crypto", 'Higher rates, <span class="acc">less money</span>')
        inner += dgsvg("".join(wires)) + "".join(nodes)
        frames.append(frame(f"D-RATES-s{k}", "red", inner))
    cues = """## D-RATES (CH2 red), beat CH2@131.10-143.65 (12.55 s)
System-design chain, 6 nodes left to right, no numbers. One node is HOT (ring) per phrase; nodes already said stay LIT; nodes not yet said are ghosted.
| state | lands at | on the words | file |
|---|---|---|---|
| s1 | 131.46 | "Higher rates" (frame in at 131.10 on s1) | D-RATES-s1.png |
| s2 | 132.08 | "less money flowing in the economy" | D-RATES-s2.png |
| s3 | 134.46 | "less businesses taking out loans" | D-RATES-s3.png |
| s4 | 136.84 | "less economic expansion" | D-RATES-s4.png |
| s5 | 138.84 | "less job growth" | D-RATES-s5.png |
| s6 | 140.06 | "less people with jobs putting their money into crypto" (hold to 143.65) | D-RATES-s6.png |
Swap = a 6-frame cross-fade between stills (shared elements are pixel-identical, so only the spotlight moves)."""
    return "D-RATES", DIAG, frames, {"id": "D-RATES", "labels": labels}, cues


def build_DROTATE():
    cx, cy = 1300, 620  # EVAA centre node
    srcs = [("LAB", 300, 340), ("GIGGLE FUND", 300, 555), ("DCA", 300, 770)]
    W, H = 400, 130
    EW, EH = 460, 280
    frames = []
    for k in range(0, 4):
        nodes = [node(cx - EW // 2, cy - EH // 2, EW, EH, '<span style="font-size:78px;letter-spacing:.04em">EVAA</span>', cls="hot" if k == 0 else "lit", fs=78)]
        wires = []
        for i, (lab, x, y) in enumerate(srcs):
            on = i < k
            hot = i == k - 1
            nodes.append(node(x, y, W, H, lab, cls=("hot" if hot else "lit"), fs=34, on=on))
            sy = y + H / 2
            ty = cy + (i - 1) * 78
            wires.append(wire(x + W + 12, sy, cx - EW // 2 - 14, ty, lit=hot, soft=not hot, on=on, curve=((x + W + cx - EW // 2) / 2 + 30, (sy + ty) / 2)))
        inner = header("Rotating the gains", 'Rotated <span class="acc">into EVAA</span>')
        inner += dgsvg("".join(wires)) + "".join(nodes)
        frames.append(frame(f"D-ROTATE-s{k}", "green", inner))
    cues = """## D-ROTATE (CH3 green), beat CH3@315.00-326.05 (11.05 s)
Centre node EVAA; three source nodes land one at a time, each with a curved arrow into EVAA. Names and arrows only: no multiple, no 'verified'.
| state | lands at | on the words | file |
|---|---|---|---|
| s0 | 315.00 | frame in, EVAA alone | D-ROTATE-s0.png |
| s1 | 317.08 | "We did the 350X on LAB, I rotated into this" (LAB + arrow) | D-ROTATE-s1.png |
| s2 | 320.60 | "We did the 30X on Giggle Fund, rotated into this" | D-ROTATE-s2.png |
| s3 | 322.98 | "DCA'd into it" (hold to 326.05) | D-ROTATE-s3.png |
Each new source node + its arrow: node opacity in, arrow draws on (stroke-dashoffset, 10 frames); the newest is HOT, earlier ones LIT.
OPEN: 'GIGGLE FUND' is printed as the plan wrote it (transcriber: 'Giggle Fund'; PROJECT-LOG: 'GiggleFun'): confirm the project's own spelling before the draft."""
    return "D-ROTATE", DIAG, frames, {"id": "D-ROTATE"}, cues


def ring_pos(n, cx, cy, rx, ry, start=-90):
    return [(cx + rx * math.cos(math.radians(start + i * 360 / n)), cy + ry * math.sin(math.radians(start + i * 360 / n))) for i in range(n)]


def arc_between(p, q, cx, cy, shrink=0.24, bulge=1.0):
    """a curved wire from node p toward node q, bowed away from the ring centre."""
    (x1, y1), (x2, y2) = p, q
    ax, ay = x1 + (x2 - x1) * shrink, y1 + (y2 - y1) * shrink
    bx, by = x2 - (x2 - x1) * shrink, y2 - (y2 - y1) * shrink
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    vx, vy = mx - cx, my - cy
    L = math.hypot(vx, vy) or 1
    qx, qy = mx + vx / L * 60 * bulge, my + vy / L * 60 * bulge
    return f"M{ax:.1f},{ay:.1f} Q{qx:.1f},{qy:.1f} {bx:.1f},{by:.1f}"


def ellipse_arc(cx, cy, rx, ry, t0, t1, boxes, margin=16, n=240):
    """the ring's own arc from angle t0 to t1 (deg, clockwise on screen), trimmed where it is inside a node box (+margin)."""
    pts = []
    for i in range(n + 1):
        t = math.radians(t0 + (t1 - t0) * i / n)
        x, y = cx + rx * math.cos(t), cy + ry * math.sin(t)
        inside = any(bx - margin <= x <= bx + bw + margin and by - margin <= y <= by + bh + margin for bx, by, bw, bh in boxes)
        if not inside:
            pts.append((x, y))
    return "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)


def build_C22():
    labels = [("SCAN", ""), ("ENTER EARLY", ""), ("BUY THE BOTTOM", "BUY ALERT"), ("SELL THE PUMP", ""), ("ROTATE INTO<br>THE NEXT ONE", "")]
    cx, cy, rx, ry = 960, 640, 520, 300
    ang = [-90 + 72 * i for i in range(5)]
    pos = [(cx + rx * math.cos(math.radians(a)), cy + ry * math.sin(math.radians(a))) for a in ang]
    W, H = 340, 128
    boxes = []
    for i, (lab, sub) in enumerate(labels):
        h = H + (30 if sub else 0)
        boxes.append((round(pos[i][0] - W / 2), round(pos[i][1] - h / 2), W, h))
    arcs = [ellipse_arc(cx, cy, rx, ry, ang[i], ang[i] + 72, boxes) for i in range(5)]
    frames = []
    # (state id, node states, arcs on (count of the first arcs), BUY ALERT sub on, the closing arc on)
    ST = [("s1", {0: "dim", 1: "dim"}, 1, False, False),
          ("s2", {0: "dim", 1: "dim", 2: "hot"}, 2, False, False),
          ("s2b", {0: "dim", 1: "dim", 2: "hot"}, 2, True, False),
          ("s3", {0: "dim", 1: "dim", 2: "lit", 3: "hot"}, 3, True, False),
          ("s4", {0: "dim", 1: "dim", 2: "lit", 3: "lit", 4: "hot"}, 4, True, False),
          ("s5", {0: "lit", 1: "lit", 2: "lit", 3: "lit", 4: "lit"}, 4, True, True)]
    for sid, ns, narcs, alert, closed in ST:
        nodes, wires = [], []
        for i, (lab, sub) in enumerate(labels):
            st = ns.get(i)
            bx, by, bw, bh = boxes[i]
            cls = {"dim": "lit", "lit": "lit", "hot": "hot"}.get(st, "")
            subhtml = f'<span class="{"" if alert else "hide"}">{sub}</span>' if sub else ""
            nodes.append(node(bx, by, bw, bh, lab, sub=subhtml, cls=cls, fs=25, on=st is not None, style="opacity:.5" if st == "dim" else ""))
        for i in range(5):
            on = (i < narcs) if i < 4 else closed
            hot = (closed and i == 4) or (not closed and i == narcs - 1 and i >= 1)
            soft = on and not hot and i >= 1 and not closed
            if i == 0 and not closed:
                c, m, o, w = WIRE, "url(#ah-w)", ' opacity=".6"', 3
            elif hot:
                c, m, o, w = "var(--acc)", "url(#ah-a)", "", 4.5
            elif soft or closed:
                c, m, o, w = "var(--acc)", "url(#ah-a)", ' opacity=".5"' if not closed else "", 3.5
            else:
                c, m, o, w = WIRE, "url(#ah-w)", "", 3
            wires.append(f'<path d="{arcs[i]}" fill="none" stroke="{c}" stroke-width="{w}"{o} stroke-linecap="round" marker-end="{m}"{op(on)}/>')
        centre = (f'<div class="nd" style="left:{cx - 200}px;top:{cy - 62}px;width:400px;height:124px;border-style:dashed;border-color:rgba(var(--acc-rgb),.45);'
                  f'background:rgba(255,255,255,.75);box-shadow:none">'
                  f'<div class="t" style="font-size:25px;color:var(--acc)">THE SWING TRADING<br>SOFTWARE</div></div>')
        inner = header("How I trade them", 'The <span class="acc">loop</span>', top=56)
        inner += dgsvg("".join(wires)) + centre + "".join(nodes)
        frames.append(frame(f"C22-{sid}", "green", inner))
    cues = """## C22 THE LOOP (CH4 green), beat CH4@444.58-459.10 (14.52 s)
5 nodes on a ring, the swing trading software at the centre. SCAN and ENTER EARLY open already on, half-strength (covered by the funnel + the zoom).
The ring runs one way, in the order of the recorded words: SCAN -> ENTER EARLY -> BUY THE BOTTOM -> SELL THE PUMP -> ROTATE, and the closing arrow ROTATE -> SCAN.
| state | lands at | on the words | file |
|---|---|---|---|
| s1 | 445.28 | "Then the swing trading software takes over" (frame in at 444.58; title + centre + SCAN, ENTER EARLY dim + their arrow) | C22-s1.png |
| s2 | 449.72 | "When a play is sitting near its bottom" (BUY THE BOTTOM hot, its arrow in) | C22-s2.png |
| s2b | 451.98 | "a buy alert goes out" (sub-label BUY ALERT) | C22-s2b.png |
| s3 | 453.18 | "When it pumps" (SELL THE PUMP hot) | C22-s3.png |
| s4 | 455.86 | "those profits rotate" (ROTATE INTO THE NEXT ONE hot) | C22-s4.png |
| s5 | 458.20 | "plays that are still at the bottom": the closing arrow ROTATE -> SCAN draws, every node lit (hold to 459.10) | C22-s5.png |
No 'do it again' text (the line was dropped). Arrows draw on with stroke-dashoffset (10 frames); nodes swap by 6-frame cross-fade."""
    return "C22", DIAG, frames, {"id": "C22", "ring_node_boxes": boxes, "ellipse": [cx, cy, rx, ry]}, cues


def loop_svg(cx, cy, r, lit, sw=4, on=True, fill=True):
    c = "var(--acc)" if lit else WIRE
    f = "rgba(var(--acc-rgb),.08)" if (lit and fill) else "#fff"
    # a ring with a gap + arrowhead = a loop glyph
    a0, a1 = math.radians(-60), math.radians(250)
    x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
    x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
    small = r < 40
    m = ("url(#ah-as)" if lit else "url(#ah-ws)") if small else ("url(#ah-a)" if lit else "url(#ah-w)")
    return (f'<g{op(on)}><circle cx="{cx}" cy="{cy}" r="{r}" fill="{f}" stroke="none"/>'
            f'<path d="M{x0:.1f},{y0:.1f} A{r},{r} 0 1 1 {x1:.1f},{y1:.1f}" fill="none" stroke="{c}" stroke-width="{sw}" marker-end="{m}"/></g>')


def build_C22B():
    big = (420, 640, 120)
    small = [(1010, 340 + i * 62) for i in range(10)]
    tiny = [(1470, 340 + i * 62) for i in range(10)]
    lit_i = 3

    def fr(sid, st):
        g = []
        g.append(loop_svg(*big, lit=st >= 1, sw=7))
        # payout arrow up out of the big loop toward the ONE PLAY MOVES card
        g.append(f'<path d="M{big[0] + 20},{big[1] - 140} L{big[0] + 20},{big[1] - 236}" stroke="var(--acc)" stroke-width="5" fill="none" marker-end="url(#ah-a)"{op(st >= 2)}/>')
        # fan into 10 small loops
        for i, (x, y) in enumerate(small):
            g.append(f'<path d="M{big[0] + 140},{big[1]} C{big[0] + 330},{big[1]} {x - 200},{y} {x - 40},{y}" fill="none" stroke="{WIRE}" stroke-width="2.2" marker-end="url(#ah-ws)"{op(st >= 4)}/>')
            g.append(loop_svg(x, y, 22, lit=(st >= 5 and i == lit_i), sw=3.5 if not (st >= 5 and i == lit_i) else 5, on=st >= 4))
        for i, (x, y) in enumerate(tiny):
            sx, sy = small[lit_i]
            g.append(f'<path d="M{sx + 30},{sy} C{sx + 180},{sy} {x - 160},{y} {x - 30},{y}" fill="none" stroke="var(--acc)" stroke-width="2" marker-end="url(#ah-as)" opacity=".85"{op(st >= 5)}/>')
            g.append(loop_svg(x, y, 16, lit=True, sw=3, on=st >= 5, fill=False))
        inner = header("The compounding view", 'The plan is <span class="acc">the loop</span>', top=56)
        inner += dgsvg("".join(g))
        inner += box(big[0], big[1] + 150, "ONE LOOP", cls="pill" + (" acc" if st >= 1 else ""), anchor="center", extra="font-size:20px")
        inner += box(big[0] - 160, big[1] - 250, '<div class="e">ONE PLAY MOVES</div>' + f'<div class="t acc{hid(st >= 3)}">TAKE PROFITS ON THE WAY UP</div>',
                     cls="co on" if st in (2, 3) else "co dim", on=st >= 2, anchor="bottom-left")
        inner += box(small[0][0], small[0][1] - 70, "SPLIT ACROSS THE NEXT 10 PLAYS", cls="pill" + (" acc" if st == 4 else ""), on=st >= 4, anchor="center", extra="font-size:19px")
        inner += box(tiny[0][0], tiny[0][1] - 70, "ONE OF THOSE MOVES", cls="pill acc", on=st >= 5, anchor="center", extra="font-size:19px")
        return frame(f"C22B-{sid}", "cyan", inner)

    frames = [fr("s1", 1), fr("s2", 2), fr("s3", 3), fr("s4", 4), fr("s5", 5)]
    cues = """## C22B THE COMPOUNDING VIEW (CH5 cyan), beat CH5@505.90-518.15 (12.25 s)
A tree of loops, left to right: one big loop -> it pays out -> the arrow fans into 10 small loops -> one small loop lights and fans out again.
Arrows and labels only: no dollar amounts, no multiples, no outcome numbers.
| state | lands at | on the words | file |
|---|---|---|---|
| s1 | 508.22 | "The plan is the loop" (frame in at 505.90; the big loop draws on, lit) | C22B-s1.png |
| s2 | 509.44 | "One play moves" (payout arrow up + card) | C22B-s2.png |
| s3 | 510.52 | "I take profits on the way up" (card sub-line) | C22B-s3.png |
| s4 | 512.40 | "I split those profits across the next 10 plays" (10 wires fan out, 10 small loops pop in top to bottom, 2 frames apart) | C22B-s4.png |
| s5 | 515.66 | "One of those moves" (loop 4 lights, 10 tiny loops fan out from it; hold to 518.15) | C22B-s5.png |"""
    return "C22B", DIAG, frames, {"id": "C22B"}, cues


def build_T2028():
    xs = [380, 960, 1540]
    yr = 590
    stops = [("NOVEMBER 2026", "LOW ENTRIES"), ("2027", "RATES COME DOWN<br>(MY VIEW)"), ("2028", "THE GOAL")]

    def fr(sid, k):
        g = [f'<line x1="{xs[0]}" x2="{xs[2]}" y1="{yr}" y2="{yr}" stroke="{GRID}" stroke-width="6" stroke-linecap="round"/>']
        if k >= 2:
            g.append(f'<line x1="{xs[0]}" x2="{xs[min(k, 3) - 1]}" y1="{yr}" y2="{yr}" stroke="var(--acc)" stroke-width="6" stroke-linecap="round"/>')
        for i, x in enumerate(xs):
            on = i < k
            hot = i == k - 1
            g.append(f'<circle cx="{x}" cy="{yr}" r="{24 if hot else 18}" fill="{"var(--acc)" if on else "#fff"}" stroke="{"var(--acc)" if on else WIRE}" stroke-width="4"/>')
            if hot:
                g.append(f'<circle cx="{x}" cy="{yr}" r="40" fill="rgba(var(--acc-rgb),.14)"/>')
        # bracket 2 FULL YEARS FOR THE LOOP (from the first stop to the last)
        g.append(f'<path d="M{xs[0]},{yr + 210} L{xs[0]},{yr + 236} L{xs[2]},{yr + 236} L{xs[2]},{yr + 210}" fill="none" stroke="var(--acc)" stroke-width="3"{op(k >= 3)}/>')
        inner = header("The timeline", 'Why <span class="acc">2028?</span>')
        inner += dgsvg("".join(g))
        for i, (when, what) in enumerate(stops):
            on = i < k
            inner += box(xs[i], yr - 62, f'<span class="mono" style="font-size:44px;font-weight:600;color:{"var(--acc)" if i == k - 1 else "var(--ink)"}">{when}</span>',
                         cls="endlbl", on=on, anchor="bottom-center", extra="text-align:center")
            inner += box(xs[i], yr + 62, f'<div style="font-family:\'DM Sans\';font-weight:700;font-size:28px;letter-spacing:.08em;color:var(--text-secondary);text-align:center;line-height:1.3">{what}</div>',
                         cls="endlbl", on=on, anchor="center")
        inner += box(960, yr + 258, '<span class="mono">2</span> FULL YEARS FOR THE LOOP', cls="pill acc", on=k >= 3, anchor="center", extra="font-size:24px;padding:10px 26px")
        return frame(f"T-2028-{sid}", "cyan", inner)

    frames = [fr("s0", 0), fr("s1", 1), fr("s2", 2), fr("s3", 3)]
    cues = """## T-2028 (CH5 cyan), beat CH5@518.15-527.86 (9.71 s)
Header WHY 2028?; a rail with 3 stops landing one at a time, the rail filling in the accent up to the newest stop. No halving marker (C25 stays dropped).
| state | lands at | on the words | file |
|---|---|---|---|
| s0 | 518.15 | "And why 2028?" (header + empty rail) | T-2028-s0.png |
| s1 | 520.18 | "Because I think" (NOVEMBER 2026, LOW ENTRIES) | T-2028-s1.png |
| s2 | 522.40 | "we're gonna start flying in 2027 once interest rates come back down" (2027, RATES COME DOWN (MY VIEW)) | T-2028-s2.png |
| s3 | 526.34 | "two full years to run" (2028, THE GOAL + the bracket 2 FULL YEARS FOR THE LOOP; hold to 527.86) | T-2028-s3.png |"""
    return "T-2028", DIAG, frames, {"id": "T-2028"}, cues


def build_DIMAGINE():
    base = 840

    def fr(sid, st):
        g = []
        # STAGE A (left): one play column + the 20 DOLLARS stake
        ax = 330
        colh = {0: 0, 1: 60, 2: 300}.get(min(st, 2), 300)
        g.append(f'<line x1="140" x2="1780" y1="{base}" y2="{base}" stroke="{AXIS}" stroke-width="2"/>')
        g.append(f'<rect x="{ax - 70}" y="{base - colh}" width="140" height="{colh}" rx="8" fill="var(--acc)" opacity="{1 if st <= 2 else .35}"/>')
        # STAGE B (middle): price hill with sell ticks; the sells drop straight down into ONE POT under them
        hx0, hx1, foot, amp = 560, 1080, base - 150, 270
        hill = []
        for i in range(0, 101):
            t = i / 100
            hill.append((hx0 + t * (hx1 - hx0), foot - amp * math.exp(-((t - .70) ** 2) / .05)))
        hp = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in hill)
        bo = 1 if st in (3, 4) else .4
        g.append(f'<path d="{hp}" fill="none" stroke="var(--acc)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="{bo}"{op(st >= 3)}/>')
        ticks = [hill[i] for i in (40, 47, 53, 59)]
        for (x, y) in ticks:
            g.append(f'<g opacity="{bo}"{op(st >= 3)}><line x1="{x:.1f}" x2="{x:.1f}" y1="{y - 12:.1f}" y2="{y - 40:.1f}" stroke="{INK}" stroke-width="3"/>'
                     f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="#fff" stroke="{INK}" stroke-width="3"/></g>')
        tx, ty = hill[70]
        g.append(f'<g opacity="{bo}"{op(st >= 3)}><text class="lblm" x="{tx:.1f}" y="{ty - 20:.1f}" text-anchor="middle">TOP</text></g>')
        px = (ticks[0][0] + ticks[-1][0]) / 2
        ptop, pbot = base - 118, base - 8
        for (x, y) in ticks:
            g.append(f'<path d="M{x:.1f},{y + 12:.1f} L{x:.1f},{ptop - 12:.1f}" fill="none" stroke="{WIRE}" stroke-width="2.2" stroke-dasharray="4 5" '
                     f'marker-end="url(#ah-ws)" opacity="{1 if st == 4 else .45}"{op(st >= 4)}/>')
        g.append(f'<g opacity="{1 if st == 4 else .5}"{op(st >= 4)}><path d="M{px - 92:.1f},{ptop} L{px + 92:.1f},{ptop} L{px + 72:.1f},{pbot} L{px - 72:.1f},{pbot} Z" '
                 f'fill="rgba(var(--acc-rgb),.14)" stroke="var(--acc)" stroke-width="3.5" stroke-linejoin="round"/></g>')
        # STAGE C (right): 10 equal stakes, 10 PLAYS; three grow
        sx0 = 1240
        grow = {6: [2], 7: [2, 6], 8: [2, 6, 8]}.get(st, [])
        heights = {2: 250, 6: 170, 8: 310}
        for i in range(10):
            x = sx0 + i * 54
            h = heights.get(i, 0) if i in grow else 0
            g.append(f'<g{op(st >= 5)}><rect x="{x}" y="{base - 26 - h}" width="38" height="{26 + h}" rx="5" fill="var(--acc)" opacity="{1 if i in grow else .5}"/></g>')
        g.append(f'<path d="M{px + 96:.1f},{base - 60} L{sx0 - 18},{base - 60}" fill="none" stroke="var(--acc)" stroke-width="3.5" marker-end="url(#ah-a)"{op(st >= 5)}/>')
        inner = (f'<div class="hdr" style="top:64px"><div class="ey">A hypothetical. How rotating works. Not a result.</div>'
                 f'<h1>Imagine <span class="acc">20 dollars</span></h1><div class="divider"></div></div>')
        inner += dgsvg("".join(g))
        # stake chip dropping on ONE PLAY
        inner += box(ax, base - colh - 18, '<span class="mono">20</span> DOLLARS', cls="pill acc", anchor="bottom-center", extra="font-size:22px;padding:8px 20px" + ("" if st <= 2 else ";opacity:.45"))
        inner += box(ax, base + 22, "ONE PLAY", cls="pill", anchor="center", extra="font-size:19px" + ("" if st <= 2 else ";opacity:.45"))
        inner += box(820, 330, "SELL ON THE WAY UP, NOT THE TOP", cls="pill acc", on=st >= 3, anchor="center", extra="font-size:20px" + ("" if st in (3, 4) else ";opacity:.45"))
        inner += box(px, base + 22, "ONE POT", cls="pill", on=st >= 4, anchor="center", extra="font-size:19px" + ("" if st == 4 else ";opacity:.45"))
        inner += box(sx0 + 4.5 * 54 + 19, base + 22, '<span class="mono">10</span> PLAYS', cls="pill acc" if st == 5 else "pill", on=st >= 5, anchor="center", extra="font-size:20px")
        return frame(f"D-IMAGINE-{sid}", "cyan", inner)

    frames = [fr("s1-stake", 1), fr("s1b-grow", 2), fr("s2-hill", 3), fr("s2b-pot", 4), fr("s3-split", 5), fr("s4a-one", 6), fr("s4b-two", 7), fr("s4c-three", 8)]
    cues = """## D-IMAGINE (CH5 cyan), beats CH5@531.75-538.50 and CH5@542.40-561.95 (IMG-8 sits between)
ILLUSTRATION: the eyebrow 'A HYPOTHETICAL. HOW ROTATING WORKS. NOT A RESULT.' is held in EVERY state. Only '20 DOLLARS' and '10 PLAYS' are printed:
no 2,000, no 200 each, no multiple, no project name. The hill has no axis and no values. Three stages left to right; a finished stage stays on at 45%.
| state | lands at | on the words | file |
|---|---|---|---|
| s1-stake | 533.52 | "You put 20 dollars down on a play" (frame in at 531.75; the 20 DOLLARS chip drops onto ONE PLAY, 8-frame ease-out drop) | D-IMAGINE-s1-stake.png |
| s1b-grow | 536.26 | "it does a 350X" (the column GROWS under the chip, chip rides up; hold to 538.50) | D-IMAGINE-s1b-grow.png |
| s2-hill | 543.92 | "selling on the way up" (return at 542.40 on s1b; the hill draws on, 4 sell ticks pop on the way up, never at the TOP; tag) | D-IMAGINE-s2-hill.png |
| s2b-pot | 545.48 | "you end up with 2,000 dollars" (the sells' dashed wires draw into ONE POT) | D-IMAGINE-s2b-pot.png |
| s3-split | 552.28 | "200 dollars into 10 different tokens" (arrow out of the pot, 10 equal stakes pop left to right, 10 PLAYS) | D-IMAGINE-s3-split.png |
| s4a-one | 557.18 | "another one of those tokens does 100X" (stake 3 grows) | D-IMAGINE-s4a-one.png |
| s4b-two | 558.80 | "another one does 50X" (stake 7 grows) | D-IMAGINE-s4b-two.png |
| s4c-three | 560.80 | "another one does 300X" (stake 9 grows; hold to 561.95) | D-IMAGINE-s4c-three.png |
The three grown heights are relative only (no values, ordered like the spoken 100X / 50X / 300X but not to scale: an illustration)."""
    return "D-IMAGINE", DIAG, frames, {"id": "D-IMAGINE"}, cues


BUILDERS = {"C3": build_C3, "C16": build_C16, "C14": build_C14, "C1": build_C1, "C5": build_C5, "C-NVDA": build_CNVDA, "C-SPACEX": build_CSPACEX,
            "C2": build_C2, "C16-ZOOM": build_C16ZOOM, "C23": build_C23, "C24": build_C24,
            "D-RATES": build_DRATES, "D-ROTATE": build_DROTATE, "C22": build_C22, "C22B": build_C22B, "T-2028": build_T2028, "D-IMAGINE": build_DIMAGINE}


def main(ids):
    from playwright.sync_api import sync_playwright
    built = []
    for cid in ids:
        cid_, folder, frames, data, spec = BUILDERS[cid]()
        html_path = folder / f"{cid_}.html"
        html_path.write_text(shell(f"{cid_} (plan-to-make-millions)", frames, data, spec), encoding="utf-8")
        if folder == CHARTS:
            (folder / f"{cid_}.spec.md").write_text(f"# {cid_} animation spec (chart-builder, plan-to-make-millions)\n\n```\n{spec}\n```\n", encoding="utf-8")
        else:
            (folder / f"_cues-{cid_}.tmp").write_text(spec, encoding="utf-8")
        built.append((cid_, folder, html_path, [f.split('id="', 1)[1].split('"', 1)[0] for f in frames]))
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        for cid_, folder, html_path, fids in built:
            pg.goto(html_path.as_uri())
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(400)
            for fid in fids:
                state = fid[len(cid_) + 1:]
                out = folder / f"{cid_}-{state}.png"
                pg.locator(f"#{fid}").screenshot(path=str(out))
                print("wrote", out.relative_to(PROJ))
        br.close()
    # diagrams: one _state-cues.md for the folder, assembled from every diagram's cue table on disk
    parts = sorted(DIAG.glob("_cues-*.tmp"))
    if parts:
        order = ["D-RATES", "D-ROTATE", "C22", "C22B", "T-2028", "D-IMAGINE"]
        body = {pp.stem[6:]: pp.read_text(encoding="utf-8") for pp in parts}
        prev = {}
        sc = DIAG / "_state-cues.md"
        if sc.exists():
            for blk in sc.read_text(encoding="utf-8").split("\n## ")[1:]:
                prev[blk.split(" ", 1)[0]] = "## " + blk.strip()
        prev.update(body)
        txt = ("# plan-to-make-millions: SYSTEM-DESIGN diagram state cues (chart-builder)\n\n"
               "Every diagram is a set of stills whose shared elements are pixel-identical; movement comes only from the comp's state swaps "
               "(6-frame cross-fade unless noted) and arrow draw-ons. LIGHT theme; the lit colour is the chapter accent. Times are the final spine (COVER-PLAN).\n\n"
               + "\n\n".join(prev[k] for k in order if k in prev) + "\n")
        sc.write_text(txt, encoding="utf-8")
        for pp in parts:
            pp.unlink()


if __name__ == "__main__":
    want = sys.argv[1:] or list(BUILDERS)
    main(want)
