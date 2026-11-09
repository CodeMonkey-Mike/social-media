"""bullish-on-kaspa: chart-builder source. Writes every standalone <id>.html (one .frame per state) and shoots
<id>-<state>.png at 1920x1080. Run: python build_charts.py [id ...]  Every number traces to DATA.md (see the specs)."""
import json
import math
import pathlib
import re
import sys

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
PROJ = HERE.parents[1]
REF = PROJ.parents[1] / "skills" / "container-reference"
CHARTS, DIAGRAMS = PROJ / "assets" / "charts", PROJ / "assets" / "diagrams"

KAS, KI = "#49EACB", "#0E7A6C"          # Kaspa greenish cyan (fills) + the light token's darkened teal (text, lit wires)
KPALE = "rgba(73,234,203,.20)"
INK, SEC, MUTED = "#14161A", "#4A5263", "#5E6676"
WIRE, GRID, AXIS, BORDER = "#8A877E", "#D6D2C7", "#7A808B", "#DDD9CF"
GREY = "#ECE9E1"
GHOST = "#B9B6AC"
CSS = re.sub(r"/\*.*?\*/", "", (REF / "container-canonical.css").read_text(encoding="utf-8") + (REF / "container-canonical-light.css").read_text(encoding="utf-8"), flags=re.S)
LOCAL = """
.frame{--acc-rgb:14,122,108;display:block;padding:0;margin:0 0 24px}
.frame>svg.stage{position:absolute!important;left:0;top:0;width:1920px;height:1080px;z-index:1}
.head{position:absolute!important;left:140px;top:62px;z-index:2}
.head .ey{margin-bottom:14px}
.head h1{font-size:70px;white-space:nowrap}
.head .divider{margin:22px 0 0;background:linear-gradient(90deg,#0E7A6C,#49EACB)}
.k{color:#0E7A6C}
h1 .mono{font-weight:600;letter-spacing:-.03em}
.src{position:absolute!important;left:140px;bottom:30px;font-family:'JetBrains Mono',monospace;font-size:20px;color:#5E6676;z-index:2}
.tagp{position:absolute!important;right:136px;top:72px;z-index:2;padding:9px 22px;border:1.5px dashed #8A877E;border-radius:100px;
  font:700 22px 'DM Sans';letter-spacing:.12em;color:#4A5263;background:#F6F4EE}
"""
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;700'
         '&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">')
DEFS = ('<defs><filter id="sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="8" stdDeviation="12" '
        'flood-color="#14161A" flood-opacity=".09"/></filter>'
        '<pattern id="hatch" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)">'
        '<rect width="14" height="14" fill="#F6F4EE"/><rect width="5" height="14" fill="#DDD9CF"/></pattern></defs>')


def t(x, y, s, size=28, fill=INK, w=600, a="start", f="DM Sans", ls=None, extra=""):
    sp = f' letter-spacing="{ls}"' if ls else ""
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{f}" font-size="{size}" font-weight="{w}" fill="{fill}" '
            f'text-anchor="{a}"{sp} {extra}>{s}</text>')


def m(x, y, s, size=28, fill=INK, a="start", w=600):
    return t(x, y, s, size, fill, w, a, "JetBrains Mono")


def caps(x, y, s, size=24, fill=SEC, a="start", w=700, ls="0.1em"):
    return t(x, y, s, size, fill, w, a, ls=ls)


def line(x1, y1, x2, y2, c=WIRE, w=3, dash=None, cap="round"):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{c}" stroke-width="{w}" stroke-linecap="{cap}"{d}/>'


def head_at(x, y, ang, c=INK, s=20):
    a1, a2 = ang + math.radians(152), ang - math.radians(152)
    return (f'<polygon points="{x:.1f},{y:.1f} {x + s * math.cos(a1):.1f},{y + s * math.sin(a1):.1f} '
            f'{x + s * math.cos(a2):.1f},{y + s * math.sin(a2):.1f}" fill="{c}"/>')


def arrow(x1, y1, x2, y2, c=WIRE, w=4, s=20, dash=None, both=False):
    ang = math.atan2(y2 - y1, x2 - x1)
    gap = s * .75
    xe, ye = x2 - gap * math.cos(ang), y2 - gap * math.sin(ang)
    xs, ys = (x1 + gap * math.cos(ang), y1 + gap * math.sin(ang)) if both else (x1, y1)
    o = line(xs, ys, xe, ye, c, w, dash, "butt") + head_at(x2, y2, ang, c, s)
    if both:
        o += head_at(x1, y1, ang + math.pi, c, s)
    return o


def rect(x, y, w, h, r=16, fill="#FFFFFF", stroke=BORDER, sw=1.5, dash=None, shadow=False, extra=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    sh = ' filter="url(#sh)"' if shadow else ""
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}{sh} {extra}/>'


def chip(x, y, s, on=True, size=26, pad=24, h=56, w=None, mono_=False, fill=None):
    w = w or (len(s) * size * .68 + pad * 2)
    bg = fill or (KPALE if on else "#FFFFFF")
    st = KI if on else GHOST
    fg = KI if on else "#8B8E94"
    r = rect(x, y, w, h, h / 2, bg, st, 2.5 if on else 1.5)
    return r + t(x + w / 2, y + h / 2 + size * .36, s, size, fg, 700, "middle", "JetBrains Mono" if mono_ else "DM Sans", ls=None if mono_ else "0.06em"), w


def frame(sid, ey, h1, body, src="", tag=None, orb=True):
    o = f'<div class="orb" style="width:900px;height:900px;right:-300px;top:-420px;background:{KAS}"></div>' if orb else ""
    tg = f'<div class="tagp">{tag}</div>' if tag else ""
    s = f'<div class="src">{src}</div>' if src else ""
    return (f'<div class="frame" id="{sid}">{o}<svg class="stage" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">{body}</svg>'
            f'<div class="head"><div class="ey">{ey}</div><h1>{h1}</h1><div class="divider"></div></div>{tg}{s}</div>')


REG = {}


def chart(cid, folder):
    def deco(fn):
        REG[cid] = (folder, fn)
        return fn
    return deco


# ---------------------------------------------------------------- C1
CX = [210, 450, 690, 930, 1170, 1410, 1650]
ROWS = {1: [600], 2: [510, 690], 3: [420, 600, 780]}
COUNTS = [1, 2, 3, 2, 3, 2, 3]
BS = 96


def block(x, y, fill="#FFFFFF", stroke=INK, sw=3, dash=None, rot=0, s=BS):
    tr = f'transform="rotate({rot} {x} {y})"' if rot else ""
    return rect(x - s / 2, y - s / 2, s, s, 16, fill, stroke, sw, dash, False, tr)


def rail():
    return arrow(140, 905, 1785, 905, AXIS, 3, 18) + caps(1780, 948, "TIME", 22, MUTED, "end")


def c1_chain(st):
    y, y2 = 520, 720
    b = rail() + caps(162, 415, "BITCOIN: ONE CHAIN", 26, SEC)
    n = {"chain": 3, "fork": 4, "drop": 7}[st]
    for i in range(min(n, 3) - 1):
        b += line(CX[i], y, CX[i + 1], y, INK, 4)
    if n >= 4:
        b += line(CX[2], y, CX[3], y, INK, 4)
        if st == "fork":
            b += line(CX[2], y, CX[3], y2, INK, 4)
    if st == "drop":
        for i in range(3, 6):
            b += line(CX[i], y, CX[i + 1], y, INK, 4)
        b += line(CX[2] + 48, y + 30, CX[3] - 62, 720, WIRE, 3, "6 10")
    for i in range(n):
        b += block(CX[i], y)
    if st == "fork":
        b += block(CX[3], y2)
        b += f'<path d="M{CX[3] + 74},{y - 48} q26,0 26,26 V{y2 + 22} q0,26 -26,26" fill="none" stroke="{KI}" stroke-width="3.5"/>'
        b += caps(CX[3] + 124, 610, "FOUND AT THE", 28, KI) + caps(CX[3] + 124, 650, "SAME MOMENT", 28, KI)
    if st == "drop":
        b += block(CX[3], 770, GREY, WIRE, 3.5, "9 7", 13)
        b += arrow(CX[3] + 96, 640, CX[3] + 96, 770, WIRE, 4, 18)
    return b


def dag_edges():
    pos = [[(CX[c], y) for y in ROWS[COUNTS[c]]] for c in range(7)]
    o = ""
    for c in range(1, 7):
        for x, y in pos[c]:
            for px, py in sorted(pos[c - 1], key=lambda p: abs(p[1] - y))[:2]:
                o += line(px, py, x, y, WIRE, 2.5)
    return o


ORDER = [(0, 600)]
for _c in range(1, 7):
    _ys = ROWS[COUNTS[_c]]
    ORDER += [(_c, y) for y in (_ys if _c % 2 else _ys)]


def order_pts():
    pts, down = [], True
    for c in range(7):
        ys = ROWS[COUNTS[c]]
        ys = ys if down else list(reversed(ys))
        if COUNTS[c] == 3:
            ys = [780, 600, 420]
        elif COUNTS[c] == 2:
            ys = [510, 690]
        pts += [(CX[c], y) for y in ys]
    return pts


def thread():
    p = order_pts() + [(1800, 362)]
    d = f"M{p[0][0]},{p[0][1]}"
    for i in range(len(p) - 1):
        p0, p1, p2, p3 = p[max(i - 1, 0)], p[i], p[i + 1], p[min(i + 2, len(p) - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 7, p1[1] + (p2[1] - p0[1]) / 7)
        c2 = (p2[0] - (p3[0] - p1[0]) / 7, p2[1] - (p3[1] - p1[1]) / 7)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]},{p2[1]}"
    return f'<path d="{d}" fill="none" stroke="{KI}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' + head_at(1812, 352, math.atan2(-58, 150), KI, 24)


def dag(lit=False, deep=0, bracket=False):
    b = rail() + dag_edges()
    if lit:
        b += thread()
    window = []
    for c in (2, 3, 4, 5):
        window += [(CX[c], y) for y in ([780, 600, 420] if COUNTS[c] == 3 else [510, 690])]
    dk = set(window[:deep])
    for c in range(7):
        for y in ROWS[COUNTS[c]]:
            on = (CX[c], y) in dk
            b += block(CX[c], y, KI if on else KAS, KI, 3)
    if lit:
        c_, _ = chip(1480, 274, "GHOSTDAG: ONE ORDER", True, 24, 18, 52)
        b += c_
    if bracket:
        x1, x2 = CX[2] - 62, CX[5] + 62
        b += f'<path d="M{x1},352 V332 H{x2} V352" fill="none" stroke="{KI}" stroke-width="3.5"/>'
        b += caps(x1, 318, "ONE SECOND", 26, KI)
        if deep == 10:
            b += m(x1 + 214, 320, "10", 54, KI) + caps(x1 + 288, 318, "BLOCKS", 26, KI)
    return b


@chart("C1", DIAGRAMS)
def c1():
    ey, src = "BLOCKCHAIN VS BLOCKDAG", "Sources: kaspa.org/lore, eprint 2018/104"
    hA = 'Bitcoin runs <span class="k">one block</span> at a time.'
    hB = 'Kaspa keeps <span class="k">every block.</span>'
    hC = 'A fully implemented <span class="k">GhostDAG.</span>'
    return [
        ("A-chain", frame("A-chain", ey, hA, c1_chain("chain"), src)),
        ("A-fork", frame("A-fork", ey, hA, c1_chain("fork"), src)),
        ("A", frame("A", ey, hA, c1_chain("drop"), src)),
        ("B", frame("B", ey, hB, dag(), src)),
        ("B-lit", frame("B-lit", ey, hB, dag(True), src)),
        ("C-start", frame("C-start", ey, hC, dag(True, 0, True), src)),
        ("C-mid", frame("C-mid", ey, hC, dag(True, 5, True), src)),
        ("C", frame("C", ey, hC, dag(True, 10, True), src)),
    ]


# ---------------------------------------------------------------- C2
def c2_a(stage):
    L = (140, 300, 620, 650)
    R = (800, 300, 980, 650)
    b = rect(*L, 20, "#FFFFFF", BORDER, 1.5, None, True) + rect(*R, 20, "#FFFFFF", BORDER, 1.5, None, True)
    b += caps(176, 356, "A 4-YEAR HALVING", 28, SEC) + caps(836, 356, "KASPA: A SMOOTH HALVING", 28, KI)
    # left: staircase, shape only
    x0, x1, yb, yt = 190, 720, 860, 420
    b += line(x0, yb, x1, yb, AXIS, 2.5) + line(R[0] + 50, yb, R[0] + R[2] - 40, yb, AXIS, 2.5)
    b += caps(x1, 902, "EVERY 4 YEARS", 22, MUTED, "end") + caps(R[0] + R[2] - 40, 902, "EVERY SINGLE MONTH", 22, KI, "end")
    if stage == "start":
        return b
    step = (x1 - x0) / 4
    d, lv = f"M{x0},{yt}", yb - yt
    for i in range(4):
        y = yb - lv * .5 ** i
        d += f" L{x0 + (i + 1) * step:.1f},{y:.1f}"
        if i < 3:
            d += f" L{x0 + (i + 1) * step:.1f},{yb - lv * .5 ** (i + 1):.1f}"
    b += f'<path d="{d}" fill="none" stroke="{WIRE}" stroke-width="7" stroke-linejoin="miter"/>'
    # right: real schedule. reward = 440 * 2^(-m/12) (DATA Pillar 1), 10-year window; supply = running sum, scaled to the cap
    rx0, rx1 = R[0] + 50, R[0] + R[2] - 40
    months = 120
    frac = 1.0 if stage != "mid" else .42
    n = int(months * frac)
    rate = [500 if k < 6 else 440 * 2 ** (-(k - 6) / 12) for k in range(months)]
    top = 440
    ry = lambda v: yb - (yb - 482) * v / top
    d = f"M{rx0},{ry(rate[6]):.1f}"
    w = (rx1 - rx0) / months
    for k in range(n):
        v = 440 * 2 ** (-k / 12)
        d += f" L{rx0 + k * w:.1f},{ry(v):.1f} L{rx0 + (k + 1) * w:.1f},{ry(v):.1f}"
    b += f'<path d="{d}" fill="none" stroke="{KI}" stroke-width="7" stroke-linejoin="round"/>'
    b += caps(rx0 + 196, 742, "THE BLOCK REWARD", 24, KI)
    if stage == "payoff":
        total = sum(500 if k < 6 else 440 * 2 ** (-(k - 6) / 12) for k in range(36 * 12))
        cap_y = 440
        s, d = 0, f"M{rx0},{yb}"
        for k in range(months):
            s += rate[k]
            d += f" L{rx0 + (k + 1) * w:.1f},{yb - (yb - cap_y) * s / total:.1f}"
        b += f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linejoin="round"/>'
        b += caps(rx1 - 8, 490, "TOTAL SUPPLY", 24, INK, "end")
        b += line(rx0, cap_y, rx1, cap_y, INK, 3, "12 9")
        b += t(rx1, 420, 'HARD CAP <tspan font-family="JetBrains Mono">28.7B</tspan> KAS', 28, INK, 700, "end")
    return b


def donut(fr, big=True, callout=True):
    cx, cy, r, sw = 1230, 605, 262, 92
    c = 2 * math.pi * r
    b = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{INK if callout else GREY}" stroke-width="{sw}"/>'
    b += (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{KAS}" stroke-width="{sw}" stroke-dasharray="{c * fr:.2f} {c:.2f}" '
          f'transform="rotate(185.76 {cx} {cy})"/>')
    b += m(cx, cy + 16, f"{fr * 100:.1f}%" if fr else "0%", 104, INK, "middle") + caps(cx, cy + 74, "MINED", 36, KI, "middle")
    if callout:
        b += line(cx - r - 44, cy, 690, cy, INK, 3)
        b += m(140, cy + 32, "912M", 96, INK) + caps(400, cy + 30, "KAS LEFT", 44, INK)
    return b


def c2_b(stage):
    fr = {"start": 0, "mid": .5, "payoff": .968}[stage]
    b = donut(fr, callout=stage == "payoff")
    return b


def c2_c(stage):
    x0, xm, x1, yb = 200, 960, 1720, 900
    y0, y1 = 520, 680
    b = line(x0, yb, x1, yb, AXIS, 2.5) + line(x0, 360, x0, yb - 46, AXIS, 2.5)
    b += f'<path d="M{x0 - 16},{yb - 46} l32,-12 M{x0 - 16},{yb - 30} l32,-12" stroke="{AXIS}" stroke-width="2.5"/>'
    b += line(x0, yb - 30 + 0, x0, yb, AXIS, 2.5)
    b += caps(x0 + 18, 372, "KAS / BLOCK", 28, SEC)
    if stage == "start":
        xe, y_end = xm, None
    elif stage == "mid":
        xe, y_end = xm, (y0 + y1) / 2
    else:
        xe, y_end = x1, y1
    area = f"M{x0},{yb} L{x0},{y0} L{xm},{y0}"
    path = f"M{x0},{y0} L{xm},{y0}"
    if y_end:
        path += f" L{xm},{y_end}"
        area += f" L{xm},{y_end}"
    if stage == "payoff":
        path += f" L{x1},{y1}"
        area += f" L{x1},{y1} L{x1},{yb}"
    else:
        area += f" L{xm},{yb}"
    area += " Z"
    b += f'<path d="{area}" fill="{KPALE}"/><path d="{path}" fill="none" stroke="{KI}" stroke-width="8" stroke-linejoin="miter"/>'
    b += m(x0 + 40, y0 - 34, "2.06", 120, INK)
    if stage != "start":
        b += line(xm, 340, xm, yb, INK, 2.5, "8 8")
        b += caps(xm, 322, "NOVEMBER 4, 2026 CUT", 32, INK, "middle")
    if stage == "payoff":
        b += m(xm + 60, y1 - 34, "1.94", 120, KI)
    return b


def c2_d(stage):
    x0, W = 140, 1640
    frac = 52100 / 20043483  # DATA Pillar 4: after-cut value at 0.0310 dollars vs the 24 h volume, drawn to true ratio
    b = ""
    y1, y2, h = 400, 670, 120
    b += t(x0, y1 - 22, '<tspan font-family="JetBrains Mono">1.68M</tspan> KAS A DAY', 44, KI, 700) + caps(x0 + 400, y1 - 24, "NEW SUPPLY", 28, SEC)
    b += rect(x0, y1, W, h, 10, GREY, BORDER, 1)
    w1 = max(W * frac, 4)
    b += f'<rect x="{x0}" y="{y1}" width="{w1:.2f}" height="{h}" fill="{KI}"/>'
    if stage in ("mid", "payoff"):
        b += t(x0, y2 - 22, '<tspan font-family="JetBrains Mono">$20M</tspan> A DAY TRADED', 44, INK, 700)
        ww = W if stage == "payoff" else W * .5
        b += rect(x0, y2, W, h, 10, GREY, BORDER, 1)
        b += f'<rect x="{x0}" y="{y2}" width="{ww:.1f}" height="{h}" rx="10" fill="{INK}"/>'
    if stage == "payoff":
        b += rect(x0 - 8, y1 - 8, 22, h + 16, 6, "none", KAS, 5)
        b += arrow(x0 + 130, y1 + h / 2, x0 + 22, y1 + h / 2, KI, 5, 22)
        c_, cw = chip(x0 + 130, y1 + 27, "WELL UNDER 1%", True, 38, 26, 66, 400, fill="#FFFFFF")
        b += c_
        b += caps(x0, y2 + h + 62, "BARS DRAWN BY VALUE, AT THESE PRICES", 26, SEC)
    return b


@chart("C2", CHARTS)
def c2():
    ey = "THE EMISSION"
    s1 = "Sources: wiki.kaspa.org tokenomics, rusty-kaspa coinbase.rs, api.kaspa.org/info/coinsupply · curves show shape, not scale"
    s2 = "Source: api.kaspa.org/info/coinsupply, read 2026-11-03"
    s3 = "Source: api.kaspa.org/info/halving, blockreward · 1 step shown, axis broken"
    s4 = "Sources: api.kaspa.org/info/halving, CoinGecko 24 h volume, read 2026-11-03 · KAS at 0.031 dollars"
    hA = 'It shrinks a little <span class="k">every single month.</span>'
    hB = 'Almost all of it is <span class="k">already mined.</span>'
    hC = 'The November cut took the <span class="k">reward down.</span>'
    hD = 'New supply is <span class="k">well under <span class="mono">1%</span></span> of what trades.'
    out = []
    for st in ("start", "mid", "payoff"):
        out.append((f"A-{st}", frame(f"A-{st}", ey, hA, c2_a(st), s1)))
    for st in ("start", "mid", "payoff"):
        out.append((f"B-{st}", frame(f"B-{st}", ey, hB, c2_b(st), s2)))
    for st in ("start", "mid", "payoff"):
        out.append((f"C-{st}", frame(f"C-{st}", ey, hC, c2_c(st), s3)))
    for st in ("start", "mid", "payoff"):
        out.append((f"D-{st}", frame(f"D-{st}", ey, hD, c2_d(st), s4)))
    return out


# ---------------------------------------------------------------- C5
RUNGS = [("MAY 5 2025", ["CRESCENDO"]), ("MAR 19 2026", ["IGRA"]), ("JUN 30 2026", ["TOCCATA"]), ("JUL 2", ["FIRST SMART", "COINS"]),
         ("SEP 9", ["SILVERSCRIPT 1.0"]), ("SEP 20", ["OUTSIDE INDEXER", "EXPLOIT"]), ("OCT 21", ["KCC-20 FINAL"]),
         ("OCT 30", ["NACHO MIGRATION", "OPENS"]), ("NOV 4", ["REWARD CUT"]), ("JAN 1 2027", ["STABLECOIN", "FUNDRAISER CLOSES"]),
         ("JAN 31 2027", ["NACHO CLOSES"]), ("2027", ["100 BPS TARGET"])]


def c5_body(lit=(), chips=0):
    ry, x0, st = 640, 235, 131.8
    b = line(x0 - 70, ry, x0 + 11 * st + 70, ry, GHOST, 5)
    labels = ("COVENANTS", "INTROSPECTION", "ZK VERIFICATION")
    cx = 140
    txp = x0 + 2 * st
    b += line(txp, 412, txp, 468, KI if 2 in lit else GHOST, 3) + line(140, 412, 962, 412, KI if 2 in lit else GHOST, 3)
    for i, s in enumerate(labels):
        c_, w = chip(cx, 340, s, i < chips, 26, 22, 60)
        b += c_
        cx += w + 18
    for i, (d, ls) in enumerate(RUNGS):
        x = x0 + i * st
        on = i in lit
        top = i % 2 == 0
        fut = i >= 9
        b += line(x, ry, x, ry + (-58 if top else 58), KI if on else GHOST, 3)
        if top:
            ys = [ry - 72 - 36 * (len(ls) - 1 - k) for k in range(len(ls))]
            yd = ys[0] - 42
        else:
            yd = ry + 98
            ys = [yd + 40 + 36 * k for k in range(len(ls))]
        b += m(x, yd, d, 27, KI if on else "#7B808A", "middle")
        for yy, l_ in zip(ys, ls):
            b += t(x, yy, l_, 25, INK if on else "#7B808A", 700, "middle")
        if on:
            b += f'<circle cx="{x}" cy="{ry}" r="30" fill="{KPALE}"/><circle cx="{x}" cy="{ry}" r="17" fill="{KAS}" stroke="{KI}" stroke-width="4"/>'
        elif fut:
            b += f'<circle cx="{x}" cy="{ry}" r="12" fill="#F6F4EE" stroke="{GHOST}" stroke-width="4"/>'
        else:
            b += f'<circle cx="{x}" cy="{ry}" r="12" fill="{GHOST}"/>'
    b += f'<circle cx="1490" cy="938" r="10" fill="{GHOST}"/>' + caps(1510, 946, "SHIPPED", 22, MUTED)
    b += f'<circle cx="1644" cy="938" r="10" fill="#F6F4EE" stroke="{GHOST}" stroke-width="3.5"/>' + caps(1664, 946, "AHEAD", 22, MUTED)
    return b


@chart("C5", DIAGRAMS)
def c5():
    ey, h = "THE RECEIPTS", 'Native, on the <span class="k">base layer.</span>'
    src = "Sources: kaspa.org/lore, rusty-kaspa releases, kascov.io, kaspanet/kccs, nachothekat.xyz"
    return [("overview", frame("overview", ey, h, c5_body(), src)),
            ("toccata", frame("toccata", ey, h, c5_body((2,), 1), src)),
            ("intro", frame("intro", ey, h, c5_body((2,), 2), src)),
            ("zk", frame("zk", ey, h, c5_body((2,), 3), src)),
            ("jul2", frame("jul2", ey, h, c5_body((2, 3), 3), src))]


# ---------------------------------------------------------------- indexer-vs-l1
def shield(x, y, s=1.0, on=True):
    f, st = (KAS, KI) if on else (GREY, GHOST)
    return (f'<g transform="translate({x} {y}) scale({s})"><path d="M0,-92 L78,-62 V10 C78,60 36,88 0,104 C-36,88 -78,60 -78,10 V-62 Z" fill="{f}" stroke="{st}" stroke-width="6"/>'
            f'<path d="M-36,4 L-8,34 L40,-28" fill="none" stroke="{INK}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></g>')


def ix_body(flaw):
    b = rect(140, 300, 960, 640, 24, "#FFFFFF", KI, 3.5, None, True)
    b += caps(186, 372, "KASPA LAYER 1", 40, KI)
    xs = [240, 395, 550, 705, 860, 1015]
    for i in range(5):
        b += line(xs[i], 815, xs[i + 1], 815, INK, 4)
    for x in xs:
        b += block(x, 815, KAS, KI, 3, s=84)
    b += shield(620, 505, 1.15)
    b += caps(620, 682, "UNTOUCHED", 40, INK, "middle")
    b += line(1180, 280, 1180, 960, AXIS, 3, "12 10")
    b += caps(1180, 1000 - 22, "THE CHAIN BOUNDARY", 22, MUTED, "middle")
    b += arrow(1100, 620, 1262, 620, WIRE, 3.5, 18, "8 8")
    b += rect(1262, 430, 520, 380, 22, "#FBFAF6", INK if flaw else GHOST, 3 if flaw else 2, "12 8", True)
    b += caps(1302, 500, "OUTSIDE INDEXER", 34, INK)
    b += t(1302, 546, "bookkeeping, off chain", 30, SEC, 500)
    for i, y in enumerate((610, 656, 702, 748)):
        b += line(1302, y, 1500 - (i % 2) * 50, y, GHOST, 7, None, "round")
    if flaw:
        b += f'<path d="M1610,590 l-34,44 l44,16 l-44,48 l36,14 l-26,44" fill="none" stroke="{INK}" stroke-width="7" stroke-linejoin="miter"/>'
        b += caps(1654, 660, "THE", 26, INK) + caps(1654, 692, "FLAW", 26, INK)
    return b


@chart("indexer-vs-l1", DIAGRAMS)
def ix():
    ey, h = "THE SEPTEMBER EXPLOIT", 'Layer <span class="mono">1</span> was <span class="k">never touched.</span>'
    src = "Sources: @KASPAglobal 2026-10-31, coverage: Kaspa's base chain was not compromised"
    return [("l1", frame("l1", ey, h, ix_body(False), src)), ("flaw", frame("flaw", ey, h, ix_body(True), src))]


# ---------------------------------------------------------------- consensus-validates
def icon_node(x, y):
    o = ""
    for dy in (-23, -7, 9):
        o += rect(x - 22, y + dy - 6, 44, 12, 3, "#FFFFFF", INK, 3) + f'<circle cx="{x + 14}" cy="{y + dy}" r="2" fill="{INK}"/>'
    return o


def icon_miner(x, y):
    return (f'<g transform="translate({x} {y - 8}) scale(.74)"><path d="M-27,-18 Q2,-40 30,-6" fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>'
            f'<line x1="-10" y1="30" x2="10" y2="-26" stroke="{INK}" stroke-width="7" stroke-linecap="round"/></g>')


def cv_body(checks, out):
    cx, cy, r = 610, 610, 205
    b = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#FFFFFF" stroke="{KAS}" stroke-width="30" filter="url(#sh)"/>'
    b += f'<circle cx="{cx}" cy="{cy}" r="{r - 15}" fill="none" stroke="{KI}" stroke-width="2.5"/><circle cx="{cx}" cy="{cy}" r="{r + 15}" fill="none" stroke="{KI}" stroke-width="2.5"/>'
    b += caps(cx, cy - 98, "L1 CONSENSUS", 30, KI, "middle")
    b += rect(cx - 152, cy - 72, 304, 142, 16, KPALE, KI, 3)
    b += caps(cx, cy - 10, "TOKEN RULES", 34, INK, "middle") + t(cx, cy + 36, "a KCC-20 covenant", 27, SEC, 500, "middle")
    R = 292
    for i in range(6):
        a = math.radians(-90 + 60 * i)
        x, y = cx + R * math.cos(a), cy + R * math.sin(a) * .98
        node = i % 2 == 0
        b += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="56" fill="#FFFFFF" stroke="{KI if checks else GHOST}" stroke-width="3.5"/>'
        b += icon_node(x, y - 8) if node else icon_miner(x, y - 8)
        b += caps(x, y + 38, "NODE" if node else "MINER", 18, INK, "middle")
        if checks:
            b += f'<circle cx="{x + 44:.1f}" cy="{y - 42:.1f}" r="21" fill="{KAS}" stroke="{KI}" stroke-width="3"/>'
            b += f'<path d="M{x + 34:.1f},{y - 42:.1f} l7,9 l14,-17" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    bx, by, bw, bh = 1290, 480, 490, 260
    b += line(1130, 280, 1130, 960, AXIS, 3, "12 10") + caps(1130, 990, "THE CHAIN BOUNDARY", 22, MUTED, "middle")
    b += rect(bx, by, bw, bh, 22, "#FBFAF6", GHOST, 2, "12 8")
    if out:
        b += line(bx + 16, by + 16, bx + bw - 16, by + bh - 16, WIRE, 7) + line(bx + bw - 16, by + 16, bx + 16, by + bh - 16, WIRE, 7)
        b += f'<rect x="{bx + 70}" y="{by + 78}" width="{bw - 140}" height="104" fill="#FBFAF6"/>'
    halo = 'style="paint-order:stroke;stroke:#FBFAF6;stroke-width:12px;stroke-linejoin:round"'
    b += t(bx + bw / 2, by + 118, "OUTSIDE INDEXER", 34, INK, 700, "middle", ls="0.1em", extra=halo)
    b += t(bx + bw / 2, by + 164, "off chain", 28, SEC, 500, "middle", extra=halo)
    return b


@chart("consensus-validates", DIAGRAMS)
def cv():
    ey, h = "KCC-20", "Enforced by Kaspa's <span class=\"k\">own consensus.</span>"
    src = "Sources: @KASPAglobal 2026-10-31, kaspanet/kccs"
    return [("rules", frame("rules", ey, h, cv_body(False, False), src)),
            ("validators", frame("validators", ey, h, cv_body(True, False), src)),
            ("indexer-out", frame("indexer-out", ey, h, cv_body(True, True), src))]


# ---------------------------------------------------------------- kasplex-based-rollup
def kp_body(gas):
    b = rect(140, 296, 1040, 210, 22, "#FFFFFF", BORDER, 2, None, True)
    b += caps(186, 386, "KASPLEX", 54, INK) + m(490, 386, "L2", 54, MUTED)
    b += t(186, 446, "an EVM-compatible based rollup", 32, SEC, 500)
    for x, s in ((470, "ORDERING"), (850, "DATA")):
        b += arrow(x, 506, x, 700, KI, 7, 28)
        b += caps(x + 30, 612, s, 26, KI)
    b += rect(140, 700, 1640, 250, 24, KPALE, KI, 3.5)
    b += caps(186, 780, "KASPA", 54, INK) + m(410, 780, "L1", 54, KI)
    b += rect(186, 820, 680, 90, 14, "#FFFFFF", KI, 2.5) + caps(526, 878, "SEQUENCING", 34, INK, "middle")
    b += caps(920, 880, "+", 48, KI, "middle")
    b += rect(974, 820, 760, 90, 14, "#FFFFFF", KI, 2.5) + caps(1354, 878, "DATA AVAILABILITY", 34, INK, "middle")
    if gas:
        c_, _ = chip(1250, 372, "KAS = THE ONLY GAS", True, 34, 20, 84, 530)
        b += c_
    return b


@chart("kasplex-based-rollup", DIAGRAMS)
def kp():
    ey, h = "THE BASED ROLLUP", 'Kaspa itself <span class="k">orders</span> its transactions.'
    src = "Sources: docs-kasplex.gitbook.io/l2-network, crypto.news 2026-04-20"
    return [("base", frame("base", ey, h, kp_body(False), src)), ("gas", frame("gas", ey, h, kp_body(True), src))]


# ---------------------------------------------------------------- D1
def d1_body(lit, norollup=False, tag=False):
    b = rect(140, 280, 1640, 680, 26, KPALE, KI, 3.5)
    b += caps(186, 348, "KASPA LAYER 1", 40, KI)
    N = [(330, 630), (810, 370), (1290, 630)]
    nw, nh = 300, 150
    ctr = [(x + nw / 2, y + nh / 2) for x, y in N]
    def lk(a, b_):
        (x1, y1), (x2, y2) = ctr[a], ctr[b_]
        ang = math.atan2(y2 - y1, x2 - x1)
        tx = (nw / 2 + 28) / abs(math.cos(ang)) if abs(math.cos(ang)) > 1e-3 else 1e9
        ty = (nh / 2 + 28) / abs(math.sin(ang)) if abs(math.sin(ang)) > 1e-3 else 1e9
        dd = min(tx, ty)
        return arrow(x1 + dd * math.cos(ang), y1 + dd * math.sin(ang), x2 - dd * math.cos(ang), y2 - dd * math.sin(ang),
                     KI if lit else WIRE, 8 if lit else 3.5, 30 if lit else 20, None, True)
    b += lk(0, 1) + lk(1, 2) + lk(0, 2)
    for (x, y), nm in zip(N, ("APP", "APP", "APP")):
        b += rect(x, y, nw, nh, 18, "#FFFFFF", KI if lit else BORDER, 3.5 if lit else 2, None, True)
        b += caps(x + nw / 2, y + nh / 2 + 16, nm, 46, INK, "middle")
    if lit:
        b += caps(960, 618, "TALK TO EACH OTHER", 32, KI, "middle")
    if norollup:
        b += caps(960, 900, "NO ROLLUP IN BETWEEN", 32, INK, "middle")
    if tag:
        b += rect(1364, 300, 392, 66, 12, "url(#hatch)", AXIS, 2)
        b += rect(1390, 314, 340, 38, 6, "#F6F4EE", "none", 0)
        b += caps(1560, 343, "UNDER CONSTRUCTION", 24, INK, "middle")
    return b


@chart("D1", DIAGRAMS)
def d1():
    ey, h = "VPROGS", 'Apps on <span class="k">Kaspa\'s own Layer <span class="mono">1</span>.</span>'
    src = "Sources: kaspa.org/build, Michael Sutton 2025-09-12"
    return [("A", frame("A", ey, h, d1_body(False), src)), ("A-lit", frame("A-lit", ey, h, d1_body(True), src)),
            ("A-norollup", frame("A-norollup", ey, h, d1_body(True, True), src)),
            ("B", frame("B", ey, h, d1_body(True, True, True), src))]


# ---------------------------------------------------------------- C3
HR = [1055, 955, 829, 690, 689, 655, 612, 516, 452, 425, 411, 411, 391, 391, 314, 317, 335, 357, 361]   # DATA Pillar 2, 2025-05 .. 2026-11 (1st to 3rd)
HM = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV"]


def c3_body(stage):
    x0, x1, yb, yt = 250, 1760, 900, 330
    sx = lambda i: x0 + (x1 - x0) * i / 18
    sy = lambda v: yb - (yb - yt) * v / 1200
    b = ""
    for v in (400, 800, 1200):
        b += line(x0, sy(v), x1, sy(v), GRID, 1.5, "4 8") + m(x0 - 22, sy(v) + 9, f"{v:,}", 26, MUTED, "end")
    b += m(x0 - 22, yb + 9, "0", 26, MUTED, "end") + line(x0, yb, x1, yb, AXIS, 2.5)
    b += caps(140, 306, "PH/S", 24, MUTED)
    for i in (0, 3, 6, 8, 11, 14, 17):
        b += m(sx(i), yb + 40, HM[i], 24, MUTED, "middle")
    b += m(sx(0), yb + 72, "2025", 24, MUTED, "middle") + m(sx(8), yb + 72, "2026", 24, MUTED, "middle")
    if stage == "start":
        return b
    pts = [(sx(i), sy(HR[i])) for i in range(19)]
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts[:15])
    b += f'<path d="{d}" fill="none" stroke="{WIRE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    b += f'<circle cx="{pts[0][0]}" cy="{pts[0][1]}" r="9" fill="#FFFFFF" stroke="{WIRE}" stroke-width="4"/>' + m(pts[0][0] + 22, pts[0][1] - 8, "1,055", 34, SEC)
    b += f'<circle cx="{pts[14][0]}" cy="{pts[14][1]}" r="9" fill="#FFFFFF" stroke="{WIRE}" stroke-width="4"/>'
    b += t(560, sy(1000), 'FELL AROUND <tspan font-family="JetBrains Mono">70%</tspan>', 34, SEC, 700)
    b += caps(560, sy(1000) + 40, "MAY 2025 TO JULY 2026", 24, MUTED)
    if stage == "mid":
        return b
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts[14:18])
    b += f'<path d="{d}" fill="none" stroke="{KI}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
    b += line(pts[17][0], pts[17][1], pts[18][0], pts[18][1], WIRE, 4, "4 8")
    # zoom inset: the rise is 43 PH/s, around 20 px on the full axis, so the payoff reads in a labelled zoom
    ix, iy, iw, ih = 960, 296, 820, 340
    b += rect(ix, iy, iw, ih, 18, "#FFFFFF", KI, 2.5, None, True)
    b += t(ix + 30, iy + 54, 'AROUND <tspan font-family="JetBrains Mono">+14%</tspan>', 40, KI, 700)
    b += caps(ix + 326, iy + 52, "JULY AVG TO OCTOBER AVG", 22, SEC)
    gx0, gx1, gyb, gyt = ix + 80, ix + iw - 110, iy + ih - 62, iy + 96
    zx = lambda i: gx0 + (gx1 - gx0) * i / 3
    zy = lambda v: gyb - (gyb - gyt) * (v - 300) / 70
    zv = [314.1, 317.1, 335.4, 357.3]
    zn = ["JUL", "AUG", "SEP", "OCT"]
    b += line(gx0 - 30, gyb, gx1 + 30, gyb, AXIS, 2)
    for i in range(1, 4):
        b += line(zx(i), gyb - 12, zx(i), gyb + 12, KI, 4) + caps(zx(i), gyb + 40, zn[i] + " CUT", 22, KI, "middle")
    b += caps(zx(0), gyb + 40, "JUL", 22, MUTED, "middle")
    d = "M" + " L".join(f"{zx(i):.1f},{zy(zv[i]):.1f}" for i in range(4))
    b += f'<path d="{d} L{zx(3):.1f},{gyb} L{zx(0):.1f},{gyb} Z" fill="{KPALE}"/><path d="{d}" fill="none" stroke="{KI}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
    for i in range(4):
        b += f'<circle cx="{zx(i):.1f}" cy="{zy(zv[i]):.1f}" r="9" fill="#FFFFFF" stroke="{KI}" stroke-width="4"/>'
        b += m(zx(i), zy(zv[i]) - 22, str(round(zv[i])), 28, KI if i == 3 else INK, "middle")
    b += caps(ix + iw - 28, iy + 52, "ZOOMED", 18, MUTED, "end")
    # a hairline from the full-axis segment up to the inset
    b += line(pts[15][0], pts[15][1] - 16, pts[15][0], iy + ih, KI, 2, "3 7")
    return b


@chart("C3", CHARTS)
def c3():
    ey = "HASH RATE · MONTHLY AVERAGE"
    h = 'It fell, then <span class="k">rose through the cuts.</span>'
    src = "Source: api.kaspa.org/info/hashrate/history, monthly averages, read 2026-11-03 · dotted NOV = 1st to 3rd only"
    return [(s, frame(s, ey, h, c3_body(s), src)) for s in ("start", "mid", "payoff")]


# ---------------------------------------------------------------- C4
def c4_body(stage):
    daily = json.loads((HERE / "c4-daily-regular.json").read_text())
    days = [(k, v["regular"]) for k, v in daily.items() if v["hours"] == 24]
    x0, x1, yb, yt = 270, 1770, 900, 300
    n = len(days) - 1
    sx = lambda i: x0 + (x1 - x0) * i / n
    sy = lambda v: yb - (yb - yt) * v / 280000
    b = ""
    for v in (100000, 200000):
        b += line(x0, sy(v), x1, sy(v), GRID, 1.5, "4 8") + m(x0 - 22, sy(v) + 9, f"{v // 1000}K", 26, MUTED, "end")
    b += m(x0 - 22, yb + 9, "0", 26, MUTED, "end") + line(x0, yb, x1, yb, AXIS, 2.5)
    for i, (k, _) in enumerate(days):
        if k.endswith("-01"):
            b += line(sx(i), yb, sx(i), yb + 10, AXIS, 2.5)
            b += m(sx(i) + 6, yb + 40, {"07": "JUL", "08": "AUG", "09": "SEP", "10": "OCT", "11": "NOV"}[k[5:7]], 26, MUTED)
    if stage == "start":
        return b
    if stage == "payoff":
        b += f'<rect x="{x0}" y="{sy(80000):.1f}" width="{x1 - x0}" height="{sy(70000) - sy(80000):.1f}" fill="{KAS}" fill-opacity=".55"/>'
        b += line(x0, sy(80000), x1, sy(80000), KI, 2.5) + line(x0, sy(70000), x1, sy(70000), KI, 2.5)
    cut = len(days) if stage == "payoff" else int(len(days) * .5)
    d = "M" + " L".join(f"{sx(i):.1f},{sy(days[i][1]):.1f}" for i in range(cut))
    b += f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>'
    if stage == "payoff":
        b += rect(x0 + 20, sy(75000) + 62, 450, 58, 12, "#FFFFFF", KI, 2.5)
        b += t(x0 + 245, sy(75000) + 102, '<tspan font-family="JetBrains Mono">70K</tspan> TO <tspan font-family="JetBrains Mono">80K</tspan> A DAY', 32, KI, 700, "middle")
        peak = max(range(len(days)), key=lambda i: days[i][1])
        b += caps(sx(peak) - 22, sy(days[peak][1]) + 22, "SPIKE DAYS", 26, SEC, "end")
        b += caps(sx(peak) - 22, sy(days[peak][1]) + 58, "MOST AUGUST AND SEPTEMBER DAYS RAN ABOVE THE BAND", 22, MUTED, "end")
    return b


@chart("C4", CHARTS)
def c4():
    ey = "USER TRANSACTIONS A DAY · NON-COINBASE"
    h = 'User transactions, <span class="k">flat.</span>'
    src = "Source: api.kaspa.org/transactions/count, regular transactions summed by UTC day, July 1 to November 3, 2026"
    return [(s, frame(s, ey, h, c4_body(s), src)) for s in ("start", "mid", "payoff")]


# ---------------------------------------------------------------- C17
def c17_body(stage):
    cols, rows, cell = 27, 17, 27.5
    x0, y0 = 140, 366
    b = ""
    shown = {"start": 459, "mid": 459, "payoff": 459}[stage]
    for i in range(shown):
        c, r = i // rows, i % rows
        x, y = x0 + c * cell + cell / 2, y0 + r * cell + cell / 2
        if i < 276:
            f = "#CFCBC0" if stage == "start" else "#8A877E"
            sk = ""
        elif i < 450:
            f = "#CFCBC0" if stage != "start" else "#CFCBC0"
            sk = ""
        else:
            f = KAS if stage == "payoff" else "#CFCBC0"
            sk = f' stroke="{KI}" stroke-width="2.5"' if stage == "payoff" else ""
        b += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="10.5" fill="{f}"{sk}/>'
    gw = cols * cell
    gb = y0 + rows * cell
    b += caps(x0, y0 - 24, "EVERY DOT IS ONE TOKEN", 24, MUTED)
    if stage != "start":
        split = x0 + (276 // rows) * cell + cell * .0
        b += f'<path d="M{x0},{gb + 10} V{gb + 24} H{split + cell * .9:.1f} V{gb + 10}" fill="none" stroke="{SEC}" stroke-width="2.5"/>'
        b += t(x0, gb + 70, '<tspan font-family="JetBrains Mono" font-size="44">276</tspan> AT <tspan font-family="JetBrains Mono" font-size="34">2</tspan> OR FEWER', 30, INK, 700)
        rx = x0 + gw
        if stage == "payoff":
            b += f'<path d="M{rx - cell},{gb + 10} V{gb + 24} H{rx} V{gb + 10}" fill="none" stroke="{KI}" stroke-width="3"/>'
            b += t(rx, gb + 70, '<tspan font-family="JetBrains Mono" font-size="44">9</tspan> ABOVE <tspan font-family="JetBrains Mono" font-size="34">100</tspan>', 30, KI, 700, "end")
    # holder bars, one linear scale
    bx, bw = 1000, 620
    scale = bw / 437
    rowsb = [("MEDIAN TOKEN", 2, SEC, "2"), ("NACHO", 355, KI, "355"), ("TOP TOKEN", 437, WIRE, "437")]
    b += caps(bx, y0 - 24, "HOLDERS PER TOKEN", 24, MUTED)
    for i, (lab, v, col, s) in enumerate(rowsb):
        y = y0 + 8 + i * 158
        on = (stage == "payoff") or (stage == "mid" and i == 0)
        b += caps(bx, y + 22, lab, 30, INK if on else MUTED)
        b += f'<rect x="{bx}" y="{y + 42}" width="{bw}" height="64" rx="6" fill="{GREY}"/>'
        if on:
            b += f'<rect x="{bx}" y="{y + 42}" width="{max(v * scale, 3):.1f}" height="64" rx="3" fill="{col}"/>'
            xl = bx + max(v * scale, 3) + 16
            b += m(xl, y + 92, s, 50, col if i != 2 else SEC)
    return b


@chart("C17", CHARTS)
def c17():
    ey = "AROUND 460 TOKENS ON LAYER 1"
    h = 'The typical token has <span class="k"><span class="mono">2</span> holders.</span>'
    src = "Source: kascov.io tokens.json, 459 tokens, read 2026-11-03 22:44 UTC"
    return [(s, frame(s, ey, h, c17_body(s), src)) for s in ("start", "mid", "payoff")]


# ---------------------------------------------------------------- cascade
def casc_body(w):
    lx, rx, tw = 140, 1310, 470
    ly, ry, lh, rh = 300, 500, 640, 440
    b = rect(lx, ly, tw, lh, 24, "#FFFFFF", AXIS, 3, None, True)
    b += f'<rect x="{lx + 3}" y="{ly + 130}" width="{tw - 6}" height="{lh - 133}" rx="20" fill="#CFCBC0"/>'
    b += caps(lx + tw / 2, ly + 78, "BITCOIN HOLDERS", 36, INK, "middle")
    b += rect(rx, ry, tw, rh, 24, "#FFFFFF", KI, 3.5, None, True)
    lvl = [.08, .28, .52, .76][w]
    fill = (rh - 6) * lvl
    b += f'<rect x="{rx + 3}" y="{ry + rh - 3 - fill:.1f}" width="{tw - 6}" height="{fill:.1f}" rx="20" fill="{KAS}"/>'
    b += caps(rx + tw / 2, ry + 76, "KASPA", 44, KI, "middle")
    labs = [["SOME MOVE"], ["A YEAR LATER,", "MORE"], ["AND SO ON"]]
    xb, yl = [lx + tw, 850, 1080, rx], [480, 598, 716]
    for i in range(3):
        on = i < w
        c_, wd = (KI, 9) if on else (GHOST, 4)
        if i < 2:
            b += f'<path d="M{xb[i]},{yl[i]} H{xb[i + 1]} V{yl[i + 1] - 16}" fill="none" stroke="{c_}" stroke-width="{wd}" stroke-linejoin="round"/>'
            b += head_at(xb[i + 1], yl[i + 1], math.pi / 2, c_, 28 if on else 20)
        else:
            b += line(xb[2], yl[2], rx - 16, yl[2], c_, wd, None, "butt") + head_at(rx, yl[2], 0, c_, 28 if on else 20)
        for k, l_ in enumerate(labs[i]):
            yy = yl[i] - 24 - 36 * (len(labs[i]) - 1 - k)
            b += caps(xb[i] + 26, yy, l_, 28, KI if on else MUTED, ls="0.04em")
    return b


@chart("cascade", DIAGRAMS)
def casc():
    ey = "THE LONG-TERM THEORY"
    h = 'A <span class="k">cascade,</span> over time.'
    src = ""
    return [(n, frame(n, ey, h, casc_body(i), src, tag="MY THEORY")) for i, n in enumerate(("base", "wave1", "wave2", "wave3"))]


# ---------------------------------------------------------------- run
def main():
    want = sys.argv[1:] or list(REG)
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        for cid in want:
            folder, fn = REG[cid]
            frames = fn()
            html = (f'<!doctype html><html><head><meta charset="utf-8"><title>{cid}</title>{FONTS}<style>{CSS}{LOCAL}</style></head><body><svg width="0" height="0" style="position:absolute">{DEFS}</svg>'
                    + "".join(f for _, f in frames) + "</body></html>")
            path = folder / f"{cid}.html"
            path.write_text(html, encoding="utf-8")
            pg.goto(path.as_uri(), wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(300)
            for sid, _ in [frames[-1]] + frames:   # a throwaway first shot: the first raster after load differs in the soft shadows
                out = folder / f"{cid}-{sid}.png"
                # shoot each state alone at the page origin: stacked frames rasterize the blur and grain differently per offset
                pg.evaluate("(id)=>document.querySelectorAll('.frame').forEach(f=>f.style.display=f.id===id?'block':'none')", sid)
                pg.evaluate("window.scrollTo(0,0)")
                pg.wait_for_timeout(60)
                pg.locator(f"#{sid}").screenshot(path=str(out))
                print(out.name)
        br.close()


if __name__ == "__main__":
    main()
