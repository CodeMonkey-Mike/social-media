"""bullish-on-kaspa: VERTICAL (1080x1920) twin of build_charts.py (vertical-repurpose.md section 1).
Same ids, same state names, same words, same numbers, same palette; the meshes are RESTACKED tall, never letterboxed.
Writes assets/vertical/{diagrams,charts}/<id>.html + <id>-<state>.png, and <chart>.vertical.spec.md for the animated charts.
Run: python build_charts_vertical.py [id ...]  Every number traces to DATA.md through the 16:9 specs."""
import json
import math
import pathlib
import re
import sys

from playwright.sync_api import sync_playwright

import build_charts as B
from build_charts import (AXIS, BORDER, GHOST, GREY, GRID, INK, KAS, KI, KPALE, MUTED, SEC, WIRE, arrow, caps, chip, head_at, icon_miner,
                          icon_node, line, m, rect, shield, t)

HERE = pathlib.Path(__file__).resolve().parent
PROJ = HERE.parents[1]
CHARTS, DIAGRAMS = PROJ / "assets" / "vertical" / "charts", PROJ / "assets" / "vertical" / "diagrams"
W, H = 1080, 1920
L, Rt = 70, 1010            # the content column, 940 wide
LOCAL = """
.frame{width:1080px!important;height:1920px!important}
.frame>svg.stage{width:1080px;height:1920px}
.head{left:70px;top:120px}
.head .ey{font-size:30px;margin-bottom:14px}
.head h1{font-size:88px;white-space:nowrap;max-width:none}
.head .divider{margin:22px 0 0}
.src{left:70px;right:70px;bottom:60px;font-size:22px;line-height:1.4;text-wrap:balance}
.tagp{right:70px;top:112px;font-size:24px}
"""
REG = {}


def chart(cid, folder):
    def deco(fn):
        REG[cid] = (folder, fn)
        return fn
    return deco


def frame(sid, ey, h1, body, src="", tag=None):
    o = f'<div class="orb" style="width:700px;height:700px;right:-260px;top:-340px;background:{KAS}"></div>'
    tg = f'<div class="tagp">{tag}</div>' if tag else ""
    src = re.sub(r"(\d{4}-\d{2}-\d{2})", lambda d: f'<span style="white-space:nowrap">{d.group(1)}</span>', src)
    s = f'<div class="src">{src}</div>' if src else ""
    return (f'<div class="frame" id="{sid}">{o}<svg class="stage" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">{body}</svg>'
            f'<div class="head"><div class="ey">{ey}</div><h1>{h1}</h1><div class="divider"></div></div>{tg}{s}</div>')


def k(s):
    return f'<span class="k">{s}</span>'


# ---------------------------------------------------------------- C1: time runs DOWN the frame, a block column of the 16:9 is a block row here
CY = [520 + 180 * i for i in range(7)]
XMAP = {780: 230, 600: 480, 420: 730, 690: 355, 510: 605}     # the 16:9 row y -> the portrait column x, mirrored so the thread exits lower right
BS = 108
CHAIN_X, FORK_X = 355, 605


def block(x, y, fill="#FFFFFF", stroke=INK, sw=3, dash=None, rot=0, s=BS):
    tr = f'transform="rotate({rot} {x} {y})"' if rot else ""
    return rect(x - s / 2, y - s / 2, s, s, 18, fill, stroke, sw, dash, False, tr)


def rail():
    return arrow(70, 430, 70, 1700, AXIS, 3, 18) + caps(70, 1746, "TIME", 26, MUTED)


def c1_chain(st):
    b = rail() + caps(120, 440, "BITCOIN: ONE CHAIN", 32, SEC)
    n = {"chain": 3, "fork": 4, "drop": 7}[st]
    for i in range(n - 1):
        b += line(CHAIN_X, CY[i], CHAIN_X, CY[i + 1], INK, 4)
    if st == "fork":
        b += line(CHAIN_X, CY[2], FORK_X, CY[3], INK, 4)
    if st == "drop":
        b += line(CHAIN_X + 54, CY[3] + 22, 572, CY[3] + 62, WIRE, 3, "6 10")
    for i in range(n):
        b += block(CHAIN_X, CY[i])
    if st == "fork":
        b += block(FORK_X, CY[3])
        y = CY[3] + 72
        b += f'<path d="M{CHAIN_X - 54},{y} q0,24 24,24 H{FORK_X + 30} q24,0 24,-24" fill="none" stroke="{KI}" stroke-width="3.5"/>'
        b += caps(480, y + 74, "FOUND AT THE", 36, KI, "middle") + caps(480, y + 120, "SAME MOMENT", 36, KI, "middle")
    if st == "drop":
        b += block(640, CY[3] + 70, GREY, WIRE, 3.5, "9 7", 13)
        b += arrow(770, CY[3] - 20, 770, CY[3] + 130, WIRE, 4, 18)
    return b


def dag_nodes():
    rows = {1: [600], 2: [510, 690], 3: [420, 600, 780]}
    return [[(XMAP.get(y, 480), CY[r], y) for y in rows[B.COUNTS[r]]] for r in range(7)]


def dag_edges():
    pos, o = dag_nodes(), ""
    for r in range(1, 7):
        for x, y, oy in pos[r]:
            for px, py, _ in sorted(pos[r - 1], key=lambda p: abs(p[2] - oy))[:2]:
                o += line(px, py, x, y, WIRE, 2.5)
    return o


def thread():
    p = []
    for r in range(7):
        c = B.COUNTS[r]
        ys = [780, 600, 420] if c == 3 else ([510, 690] if c == 2 else [600])
        p += [(XMAP.get(y, 480), CY[r]) for y in ys]
    p.append((816, 1688))
    d = f"M{p[0][0]},{p[0][1]}"
    for i in range(len(p) - 1):
        p0, p1, p2, p3 = p[max(i - 1, 0)], p[i], p[i + 1], p[min(i + 2, len(p) - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 7, p1[1] + (p2[1] - p0[1]) / 7)
        c2 = (p2[0] - (p3[0] - p1[0]) / 7, p2[1] - (p3[1] - p1[1]) / 7)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]},{p2[1]}"
    return f'<path d="{d}" fill="none" stroke="{KI}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' + head_at(826, 1700, math.atan2(88, 86), KI, 24)


def dag(lit=False, deep=0, bracket=False):
    b = rail() + dag_edges()
    if lit:
        b += thread()
    window = []
    for r in (2, 3, 4, 5):
        window += [(XMAP[y], CY[r]) for y in ([780, 600, 420] if B.COUNTS[r] == 3 else [510, 690])]
    dk = set(window[:deep])
    for row in dag_nodes():
        for x, y, _ in row:
            b += block(x, y, KI if (x, y) in dk else KAS, KI, 3)
    if lit:
        c_, _ = chip(628, 1704, "GHOSTDAG: ONE ORDER", True, 26, 18, 60)
        b += c_
    if bracket:
        y1, y2 = CY[2] - 66, CY[5] + 66
        b += f'<path d="M804,{y1} H826 V{y2} H804" fill="none" stroke="{KI}" stroke-width="3.5"/>'
        b += caps(934, 1036, "ONE", 32, KI, "middle") + caps(934, 1078, "SECOND", 32, KI, "middle")
        if deep == 10:
            b += m(934, 1196, "10", 120, KI, "middle") + caps(934, 1250, "BLOCKS", 32, KI, "middle")
    return b


@chart("C1", DIAGRAMS)
def c1():
    ey, src = "BLOCKCHAIN VS BLOCKDAG", "Sources: kaspa.org/lore, eprint 2018/104"
    hA = f'Bitcoin runs {k("one block")}<br>at a time.'
    hB = f'Kaspa keeps<br>{k("every block.")}'
    hC = f'A fully implemented<br>{k("GhostDAG.")}'
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
C2A = dict(card1=(L, 420, 940, 480), card2=(L, 930, 940, 790), sx0=130, sx1=950, syb=830, syt=520, rx0=130, rx1=950, yb=1630, cap_y=1090, top=1130)


def c2_a(stage):
    g = C2A
    b = rect(*g["card1"], 22, "#FFFFFF", BORDER, 1.5, None, True) + rect(*g["card2"], 22, "#FFFFFF", BORDER, 1.5, None, True)
    b += caps(110, 482, "A 4-YEAR HALVING", 34, SEC) + caps(110, 994, "KASPA: A SMOOTH HALVING", 34, KI)
    x0, x1, yb, yt = g["sx0"], g["sx1"], g["syb"], g["syt"]
    rx0, rx1, ryb = g["rx0"], g["rx1"], g["yb"]
    b += line(x0, yb, x1, yb, AXIS, 2.5) + line(rx0, ryb, rx1, ryb, AXIS, 2.5)
    b += caps(x1, 876, "EVERY 4 YEARS", 28, MUTED, "end") + caps(rx1, 1680, "EVERY SINGLE MONTH", 28, KI, "end")
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
    months = 120
    n = int(months * (1.0 if stage != "mid" else .42))
    rate = [500 if q < 6 else 440 * 2 ** (-(q - 6) / 12) for q in range(months)]
    ry = lambda v: ryb - (ryb - g["top"]) * v / 440
    w = (rx1 - rx0) / months
    d = f"M{rx0},{ry(rate[6]):.1f}"
    for q in range(n):
        v = 440 * 2 ** (-q / 12)
        d += f" L{rx0 + q * w:.1f},{ry(v):.1f} L{rx0 + (q + 1) * w:.1f},{ry(v):.1f}"
    b += f'<path d="{d}" fill="none" stroke="{KI}" stroke-width="7" stroke-linejoin="round"/>'
    b += caps(rx0 + 230, 1470, "THE BLOCK REWARD", 30, KI)
    if stage == "payoff":
        total = sum(500 if q < 6 else 440 * 2 ** (-(q - 6) / 12) for q in range(36 * 12))
        s, d = 0, f"M{rx0},{ryb}"
        for q in range(months):
            s += rate[q]
            d += f" L{rx0 + (q + 1) * w:.1f},{ryb - (ryb - g['cap_y']) * s / total:.1f}"
        b += f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linejoin="round"/>'
        b += caps(rx1 - 8, g["cap_y"] + 56, "TOTAL SUPPLY", 30, INK, "end")
        b += line(rx0, g["cap_y"], rx1, g["cap_y"], INK, 3, "12 9")
        b += t(rx1, g["cap_y"] - 22, 'HARD CAP <tspan font-family="JetBrains Mono">28.7B</tspan> KAS', 34, INK, 700, "end")
    return b


DONUT = dict(cx=540, cy=880, r=340, sw=112, rot=95.76, leader_y=1450, num_y=1600)


def c2_b(stage):
    g = DONUT
    fr = {"start": 0, "mid": .5, "payoff": .968}[stage]
    callout = stage == "payoff"
    cx, cy, r, sw = g["cx"], g["cy"], g["r"], g["sw"]
    c = 2 * math.pi * r
    b = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{INK if callout else GREY}" stroke-width="{sw}"/>'
    b += (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{KAS}" stroke-width="{sw}" stroke-dasharray="{c * fr:.2f} {c:.2f}" '
          f'transform="rotate({g["rot"]} {cx} {cy})"/>')
    b += m(cx, cy + 22, f"{fr * 100:.1f}%" if fr else "0%", 136, INK, "middle") + caps(cx, cy + 96, "MINED", 48, KI, "middle")
    if callout:
        b += line(cx, cy + r + sw / 2, cx, g["leader_y"], INK, 3)
        b += t(cx, g["num_y"], '<tspan font-family="JetBrains Mono" font-size="124">912M</tspan> KAS LEFT', 56, INK, 700, "middle", ls="0.06em")
    return b


C2C = dict(x0=100, xm=540, x1=1010, yb=1640, y0=900, y1=1211, axis_top=640, cut_label_y=566, dash_top=590, num_size=150)


def c2_c(stage):
    g = C2C
    x0, xm, x1, yb, y0, y1 = g["x0"], g["xm"], g["x1"], g["yb"], g["y0"], g["y1"]
    b = line(x0, yb, x1, yb, AXIS, 2.5) + line(x0, g["axis_top"], x0, yb - 46, AXIS, 2.5)
    b += f'<path d="M{x0 - 16},{yb - 46} l32,-12 M{x0 - 16},{yb - 30} l32,-12" stroke="{AXIS}" stroke-width="2.5"/>'
    b += line(x0, yb - 30, x0, yb, AXIS, 2.5)
    b += caps(x0 + 18, g["axis_top"] + 22, "KAS / BLOCK", 34, SEC)
    y_end = None if stage == "start" else ((y0 + y1) / 2 if stage == "mid" else y1)
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
    b += m(x0 + 28, y0 - 40, "2.06", g["num_size"], INK)
    if stage != "start":
        b += line(xm, g["dash_top"], xm, yb, INK, 2.5, "8 8")
        b += caps(xm, g["cut_label_y"], "NOVEMBER 4, 2026 CUT", 40, INK, "middle")
    if stage == "payoff":
        b += m(xm + 40, y1 - 40, "1.94", g["num_size"], KI)
    return b


# DATA Pillar 4: after-cut value at 0.0310 dollars vs the 24 h volume, drawn to true ratio. In portrait the bars stand UP so the true-scale height is the tall axis.
C2D = dict(x1=L, x2=570, bw=440, ytop=610, ybot=1660, frac=52100 / 20043483)


def c2_d(stage):
    g = C2D
    x1, x2, bw, yt, yb = g["x1"], g["x2"], g["bw"], g["ytop"], g["ybot"]
    h = yb - yt
    b = t(x1, yt - 66, '<tspan font-family="JetBrains Mono">1.68M</tspan> KAS A DAY', 44, KI, 700) + caps(x1, yt - 22, "NEW SUPPLY", 30, SEC)
    b += rect(x1, yt, bw, h, 12, GREY, BORDER, 1)
    sl = h * g["frac"]
    b += f'<rect x="{x1}" y="{yb - sl:.2f}" width="{bw}" height="{sl:.2f}" fill="{KI}"/>'
    if stage in ("mid", "payoff"):
        b += t(x2, yt - 22, '<tspan font-family="JetBrains Mono">$20M</tspan> A DAY TRADED', 42, INK, 700)
        hh = h if stage == "payoff" else h * .5
        b += rect(x2, yt, bw, h, 12, GREY, BORDER, 1)
        b += f'<rect x="{x2}" y="{yb - hh:.1f}" width="{bw}" height="{hh:.1f}" rx="12" fill="{INK}"/>'
    if stage == "payoff":
        b += rect(x1 - 8, yb - 16, bw + 16, 24, 6, "none", KAS, 5)
        b += arrow(x1 + bw / 2, yb - 150, x1 + bw / 2, yb - 26, KI, 5, 24)
        c_, _ = chip(x1 + 20, yb - 226, "WELL UNDER 1%", True, 40, 24, 76, 400, fill="#FFFFFF")
        b += c_
        b += caps(L, yb + 62, "BARS DRAWN BY VALUE, AT THESE PRICES", 28, SEC)
    return b


@chart("C2", CHARTS)
def c2():
    ey = "THE EMISSION"
    s1 = "Sources: wiki.kaspa.org tokenomics, rusty-kaspa coinbase.rs, api.kaspa.org/info/coinsupply · curves show shape, not scale"
    s2 = "Source: api.kaspa.org/info/coinsupply, read 2026-11-03"
    s3 = "Source: api.kaspa.org/info/halving, blockreward · 1 step shown, axis broken"
    s4 = "Sources: api.kaspa.org/info/halving, CoinGecko 24&nbsp;h volume, read 2026-11-03 · KAS at 0.031 dollars"
    hA = f'It shrinks a little<br>{k("every single month.")}'
    hB = f'Almost all of it is<br>{k("already mined.")}'
    hC = f'The November cut took<br>the {k("reward down.")}'
    hD = f'<span style="font-size:84px">New supply is {k("well under")}<br>{k(chr(60) + "span class=" + chr(34) + "mono" + chr(34) + ">1%</span>")} of what trades.</span>'
    out = []
    for key, h, fn, src in (("A", hA, c2_a, s1), ("B", hB, c2_b, s2), ("C", hC, c2_c, s3), ("D", hD, c2_d, s4)):
        for st in ("start", "mid", "payoff"):
            out.append((f"{key}-{st}", frame(f"{key}-{st}", ey, h, fn(st), src)))
    return out


# ---------------------------------------------------------------- C5: the rail runs down, date left of it, label right of it
def c5_body(lit=(), chips=0):
    rx, y0, st = 310, 610, 96
    b = line(rx, y0 - 44, rx, y0 + 11 * st + 44, GHOST, 5)
    on2 = 2 in lit
    cx = L
    for i, (s, cw) in enumerate((("COVENANTS", 250), ("INTROSPECTION", 320), ("ZK VERIFICATION", 350))):
        c_, w = chip(cx, 430, s, i < chips, 29, 20, 68, cw)
        b += c_
        cx += w + 10
    tocc_y = y0 + 2 * st
    wire = KI if on2 else GHOST
    b += line(L, 524, Rt, 524, wire, 3) + line(Rt, 524, Rt, tocc_y, wire, 3) + line(Rt, tocc_y, 530, tocc_y, wire, 3)
    for i, (d, ls) in enumerate(B.RUNGS):
        y = y0 + i * st
        on = i in lit
        fut = i >= 9
        b += m(rx - 40, y + 11, d, 30, KI if on else "#7B808A", "end")
        b += t(rx + 40, y + 11, " ".join(ls), 30, INK if on else "#7B808A", 700)
        if on:
            b += f'<circle cx="{rx}" cy="{y}" r="30" fill="{KPALE}"/><circle cx="{rx}" cy="{y}" r="18" fill="{KAS}" stroke="{KI}" stroke-width="4"/>'
        elif fut:
            b += f'<circle cx="{rx}" cy="{y}" r="13" fill="#F6F4EE" stroke="{GHOST}" stroke-width="4"/>'
        else:
            b += f'<circle cx="{rx}" cy="{y}" r="13" fill="{GHOST}"/>'
    b += f'<circle cx="690" cy="1752" r="11" fill="{GHOST}"/>' + caps(712, 1761, "SHIPPED", 26, MUTED)
    b += f'<circle cx="876" cy="1752" r="11" fill="#F6F4EE" stroke="{GHOST}" stroke-width="3.5"/>' + caps(898, 1761, "AHEAD", 26, MUTED)
    return b


@chart("C5", DIAGRAMS)
def c5():
    ey, h = "THE RECEIPTS", f'Native, on the<br>{k("base layer.")}'
    src = "Sources: kaspa.org/lore, rusty-kaspa releases, kascov.io, kaspanet/kccs, nachothekat.xyz"
    return [("overview", frame("overview", ey, h, c5_body(), src)),
            ("toccata", frame("toccata", ey, h, c5_body((2,), 1), src)),
            ("intro", frame("intro", ey, h, c5_body((2,), 2), src)),
            ("zk", frame("zk", ey, h, c5_body((2,), 3), src)),
            ("jul2", frame("jul2", ey, h, c5_body((2, 3), 3), src))]


# ---------------------------------------------------------------- indexer-vs-l1: L1 above the boundary, the indexer below it
def ix_body(flaw):
    b = rect(L, 425, 940, 690, 26, "#FFFFFF", KI, 3.5, None, True)
    b += caps(116, 502, "KASPA LAYER 1", 46, KI)
    xs = [150 + 156 * i for i in range(6)]
    for i in range(5):
        b += line(xs[i], 1020, xs[i + 1], 1020, INK, 4)
    for x in xs:
        b += block(x, 1020, KAS, KI, 3, s=88)
    b += shield(540, 690, 1.35)
    b += caps(540, 902, "UNTOUCHED", 48, INK, "middle")
    b += line(30, 1185, 1050, 1185, AXIS, 3, "12 10")
    b += caps(Rt, 1232, "THE CHAIN BOUNDARY", 26, MUTED, "end")
    b += arrow(300, 1115, 300, 1262, WIRE, 3.5, 18, "8 8")
    b += rect(L, 1262, 940, 450, 24, "#FBFAF6", INK if flaw else GHOST, 3 if flaw else 2, "12 8", True)
    b += caps(116, 1342, "OUTSIDE INDEXER", 44, INK)
    b += t(116, 1398, "bookkeeping, off chain", 38, SEC, 500)
    for i, y in enumerate((1470, 1526, 1582, 1638)):
        b += line(116, y, 560 - (i % 2) * 60, y, GHOST, 8)
    if flaw:
        b += f'<path d="M720,1442 l-44,57 l57,21 l-57,62 l47,18 l-34,57" fill="none" stroke="{INK}" stroke-width="8" stroke-linejoin="miter"/>'
        b += caps(776, 1540, "THE", 38, INK) + caps(776, 1588, "FLAW", 38, INK)
    return b


@chart("indexer-vs-l1", DIAGRAMS)
def ix():
    ey, h = "THE SEPTEMBER EXPLOIT", f'Layer <span class="mono">1</span> was<br>{k("never touched.")}'
    src = "Sources: @KASPAglobal 2026-10-31, coverage: Kaspa's base chain was not compromised"
    return [("l1", frame("l1", ey, h, ix_body(False), src)), ("flaw", frame("flaw", ey, h, ix_body(True), src))]


# ---------------------------------------------------------------- consensus-validates: the ring on top, the crossed-out indexer under the boundary
def cv_body(checks, out):
    cx, cy, r = 540, 880, 262
    b = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#FFFFFF" stroke="{KAS}" stroke-width="36" filter="url(#sh)"/>'
    b += f'<circle cx="{cx}" cy="{cy}" r="{r - 18}" fill="none" stroke="{KI}" stroke-width="2.5"/><circle cx="{cx}" cy="{cy}" r="{r + 18}" fill="none" stroke="{KI}" stroke-width="2.5"/>'
    b += caps(cx, cy - 128, "L1 CONSENSUS", 36, KI, "middle")
    b += rect(cx - 196, cy - 96, 392, 180, 18, KPALE, KI, 3)
    b += caps(cx, cy - 16, "TOKEN RULES", 40, INK, "middle") + t(cx, cy + 44, "a KCC-20 covenant", 33, SEC, 500, "middle")
    R = 392
    for i in range(6):
        a = math.radians(-90 + 60 * i)
        x, y = cx + R * math.cos(a), cy + R * math.sin(a) * .98
        node = i % 2 == 0
        b += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="72" fill="#FFFFFF" stroke="{KI if checks else GHOST}" stroke-width="3.5"/>'
        ic = icon_node(0, 0) if node else icon_miner(0, 0)
        b += f'<g transform="translate({x:.1f} {y - 12:.1f}) scale(1.28)">{ic}</g>'
        b += caps(x, y + 50, "NODE" if node else "MINER", 23, INK, "middle")
        if checks:
            b += f'<circle cx="{x + 56:.1f}" cy="{y - 54:.1f}" r="27" fill="{KAS}" stroke="{KI}" stroke-width="3"/>'
            b += f'<path d="M{x + 43:.1f},{y - 54:.1f} l9,12 l18,-22" fill="none" stroke="{INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    bx, by, bw, bh = 120, 1456, 840, 262
    b += line(30, 1385, 1050, 1385, AXIS, 3, "12 10") + caps(Rt, 1430, "THE CHAIN BOUNDARY", 26, MUTED, "end")
    b += rect(bx, by, bw, bh, 24, "#FBFAF6", GHOST, 2, "12 8")
    halo = 'style="paint-order:stroke;stroke:#FBFAF6;stroke-width:12px;stroke-linejoin:round"'
    if out:   # visual-qa 2026-11-05: one continuous heavy X in accent red through the box and the words (the 16:9 masked stubs read as an envelope flap).
        # Painted UNDER the label with no halo so the letters stay whole on the strike. No blend mode: mix-blend-mode re-rasterises the whole stage and breaks state pixel identity.
        b += line(bx + 16, by + 16, bx + bw - 16, by + bh - 16, "#C41E3A", 14) + line(bx + bw - 16, by + 16, bx + 16, by + bh - 16, "#C41E3A", 14)
        halo = ""
    b += t(bx + bw / 2, by + 120, "OUTSIDE INDEXER", 44, INK, 700, "middle", ls="0.1em", extra=halo)
    b += t(bx + bw / 2, by + 178, "off chain", 36, SEC, 500, "middle", extra=halo)
    return b


@chart("consensus-validates", DIAGRAMS)
def cv():
    ey, h = "KCC-20", f"Enforced by Kaspa's<br>{k('own consensus.')}"
    src = "Sources: @KASPAglobal 2026-10-31, kaspanet/kccs"
    return [("rules", frame("rules", ey, h, cv_body(False, False), src)),
            ("validators", frame("validators", ey, h, cv_body(True, False), src)),
            ("indexer-out", frame("indexer-out", ey, h, cv_body(True, True), src))]


# ---------------------------------------------------------------- kasplex-based-rollup: L2 on top, arrows down, the L1 pair stacked
def kp_body(gas):
    b = rect(L, 440, 940, 270, 24, "#FFFFFF", BORDER, 2, None, True)
    b += caps(116, 552, "KASPLEX", 68, INK) + m(516, 552, "L2", 68, MUTED)
    b += t(116, 632, "an EVM-compatible based rollup", 42, SEC, 500)
    for x, s in ((300, "ORDERING"), (720, "DATA")):
        b += arrow(x, 710, x, 960, KI, 7, 28)
        b += caps(x + 30, 846, s, 34, KI)
    b += rect(L, 960, 940, 560, 26, KPALE, KI, 3.5)
    b += caps(116, 1062, "KASPA", 68, INK) + m(400, 1062, "L1", 68, KI)
    b += rect(116, 1110, 848, 130, 16, "#FFFFFF", KI, 2.5) + caps(540, 1190, "SEQUENCING", 44, INK, "middle")
    b += caps(540, 1298, "+", 56, KI, "middle")
    b += rect(116, 1340, 848, 130, 16, "#FFFFFF", KI, 2.5) + caps(540, 1420, "DATA AVAILABILITY", 44, INK, "middle")
    if gas:
        c_, _ = chip(L, 1584, "KAS = THE ONLY GAS", True, 44, 20, 110, 940)
        b += c_
    return b


@chart("kasplex-based-rollup", DIAGRAMS)
def kp():
    ey, h = "THE BASED ROLLUP", f'Kaspa itself {k("orders")}<br>its transactions.'
    src = "Sources: docs-kasplex.gitbook.io/l2-network, crypto.news 2026-04-20"
    return [("base", frame("base", ey, h, kp_body(False), src)), ("gas", frame("gas", ey, h, kp_body(True), src))]


# ---------------------------------------------------------------- D1: the same triangle, drawn tall
def d1_body(lit, norollup=False, tag=False):
    b = rect(L, 430, 940, 1270, 28, KPALE, KI, 3.5)
    b += caps(116, 510, "KASPA LAYER 1", 46, KI)
    nw, nh = 300, 170
    ctr = [(260, 1250), (540, 660), (820, 1250)]
    def lk(a, b_):
        (x1, y1), (x2, y2) = ctr[a], ctr[b_]
        ang = math.atan2(y2 - y1, x2 - x1)
        tx = (nw / 2 + 26) / abs(math.cos(ang)) if abs(math.cos(ang)) > 1e-3 else 1e9
        ty = (nh / 2 + 26) / abs(math.sin(ang)) if abs(math.sin(ang)) > 1e-3 else 1e9
        dd = min(tx, ty)
        return arrow(x1 + dd * math.cos(ang), y1 + dd * math.sin(ang), x2 - dd * math.cos(ang), y2 - dd * math.sin(ang),
                     KI if lit else WIRE, 8 if lit else 3.5, 30 if lit else 20, None, True)
    b += lk(0, 1) + lk(1, 2) + lk(0, 2)
    for (x, y) in ctr:
        b += rect(x - nw / 2, y - nh / 2, nw, nh, 20, "#FFFFFF", KI if lit else BORDER, 3.5 if lit else 2, None, True)
        b += caps(x, y + 19, "APP", 54, INK, "middle")
    if lit:
        b += caps(540, 1000, "TALK TO", 40, KI, "middle") + caps(540, 1052, "EACH OTHER", 40, KI, "middle")
    if norollup:
        b += caps(540, 1520, "NO ROLLUP IN BETWEEN", 44, INK, "middle")
    if tag:
        b += rect(590, 1580, 392, 76, 12, "url(#hatch)", AXIS, 2)
        b += rect(614, 1598, 344, 40, 6, "#F6F4EE", "none", 0)
        b += caps(786, 1628, "UNDER CONSTRUCTION", 25, INK, "middle")
    return b


@chart("D1", DIAGRAMS)
def d1():
    ey = "VPROGS"
    h = f'Apps on <span class="k">Kaspa\'s<br>own Layer <span class="mono">1</span>.</span>'
    src = "Sources: kaspa.org/build, Michael Sutton 2025-09-12"
    return [("A", frame("A", ey, h, d1_body(False), src)), ("A-lit", frame("A-lit", ey, h, d1_body(True), src)),
            ("A-norollup", frame("A-norollup", ey, h, d1_body(True, True), src)),
            ("B", frame("B", ey, h, d1_body(True, True, True), src))]


# ---------------------------------------------------------------- C3: the full axis on top, the zoom card under it
C3G = dict(x0=170, x1=1010, yb=1040, yt=480, ix=L, iy=1140, iw=940, ih=560, rest_dy=270)


def c3_geom():
    g = C3G
    sx = lambda i: g["x0"] + (g["x1"] - g["x0"]) * i / 18
    sy = lambda v: g["yb"] - (g["yb"] - g["yt"]) * v / 1200
    return sx, sy


def c3_body(stage):
    g = C3G
    x0, x1, yb = g["x0"], g["x1"], g["yb"]
    sx, sy = c3_geom()
    b = ""
    for v in (400, 800, 1200):
        b += line(x0, sy(v), x1, sy(v), GRID, 1.5, "4 8") + m(x0 - 18, sy(v) + 10, f"{v:,}", 28, MUTED, "end")
    b += m(x0 - 18, yb + 10, "0", 28, MUTED, "end") + line(x0, yb, x1, yb, AXIS, 2.5)
    b += caps(L, sy(1200) - 28, "PH/S", 28, MUTED)
    for i in (0, 3, 6, 8, 11, 14, 17):
        b += m(sx(i), yb + 42, B.HM[i], 26, MUTED, "middle")
    b += m(sx(0), yb + 76, "2025", 26, MUTED, "middle") + m(sx(8), yb + 76, "2026", 26, MUTED, "middle")
    if stage != "start":
        pts = [(sx(i), sy(B.HR[i])) for i in range(19)]
        d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts[:15])
        b += f'<path d="{d}" fill="none" stroke="{WIRE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
        b += f'<circle cx="{pts[0][0]}" cy="{pts[0][1]}" r="10" fill="#FFFFFF" stroke="{WIRE}" stroke-width="4"/>' + m(pts[0][0] + 22, pts[0][1] - 12, "1,055", 38, SEC)
        b += f'<circle cx="{pts[14][0]}" cy="{pts[14][1]}" r="10" fill="#FFFFFF" stroke="{WIRE}" stroke-width="4"/>'
        b += t(x1, sy(1030), 'FELL AROUND <tspan font-family="JetBrains Mono">70%</tspan>', 42, SEC, 700, "end")
        b += caps(x1, sy(1030) + 46, "MAY 2025 TO JULY 2026", 28, MUTED, "end")
    if stage != "payoff":
        return f'<g transform="translate(0 {g["rest_dy"]})">{b}</g>'
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts[14:18])
    b += f'<path d="{d}" fill="none" stroke="{KI}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
    b += line(pts[17][0], pts[17][1], pts[18][0], pts[18][1], WIRE, 4, "4 8")
    ix, iy, iw, ih = g["ix"], g["iy"], g["iw"], g["ih"]
    b += line(pts[15][0], pts[15][1] + 16, pts[15][0], iy, KI, 2, "3 7")
    b += rect(ix, iy, iw, ih, 22, "#FFFFFF", KI, 2.5, None, True)
    b += t(ix + 36, iy + 76, 'AROUND <tspan font-family="JetBrains Mono">+14%</tspan>', 58, KI, 700)
    b += caps(ix + 36, iy + 126, "JULY AVG TO OCTOBER AVG", 30, SEC)
    b += caps(ix + iw - 32, iy + 58, "ZOOMED", 24, MUTED, "end")
    gx0, gx1, gyb, gyt = ix + 100, ix + iw - 100, iy + ih - 84, iy + 214
    zx = lambda i: gx0 + (gx1 - gx0) * i / 3
    zy = lambda v: gyb - (gyb - gyt) * (v - 300) / 70
    zv, zn = [314.1, 317.1, 335.4, 357.3], ["JUL", "AUG", "SEP", "OCT"]
    b += line(gx0 - 40, gyb, gx1 + 40, gyb, AXIS, 2)
    for i in range(1, 4):
        b += line(zx(i), gyb - 12, zx(i), gyb + 12, KI, 4) + caps(zx(i), gyb + 50, zn[i] + " CUT", 28, KI, "middle")
    b += caps(zx(0), gyb + 50, "JUL", 28, MUTED, "middle")
    d = "M" + " L".join(f"{zx(i):.1f},{zy(zv[i]):.1f}" for i in range(4))
    b += f'<path d="{d} L{zx(3):.1f},{gyb} L{zx(0):.1f},{gyb} Z" fill="{KPALE}"/><path d="{d}" fill="none" stroke="{KI}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
    for i in range(4):
        b += f'<circle cx="{zx(i):.1f}" cy="{zy(zv[i]):.1f}" r="10" fill="#FFFFFF" stroke="{KI}" stroke-width="4"/>'
        b += m(zx(i), zy(zv[i]) - 26, str(round(zv[i])), 38, KI if i == 3 else INK, "middle")
    return b


@chart("C3", CHARTS)
def c3():
    ey = "HASH RATE · MONTHLY AVERAGE"
    h = f'It fell, then<br>{k("rose through the cuts.")}'
    src = "Source: api.kaspa.org/info/hashrate/history, monthly averages, read 2026-11-03 · dotted NOV = 1st to 3rd only"
    return [(s, frame(s, ey, h, c3_body(s), src)) for s in ("start", "mid", "payoff")]


# ---------------------------------------------------------------- C4: same plot, stretched tall (the spikes are the portrait axis)
C4G = dict(x0=150, x1=1010, yb=1610, yt=470)


def c4_days():
    daily = json.loads((HERE / "c4-daily-regular.json").read_text())
    return [(q, v["regular"]) for q, v in daily.items() if v["hours"] == 24]


def c4_body(stage):
    g = C4G
    days = c4_days()
    x0, x1, yb, yt = g["x0"], g["x1"], g["yb"], g["yt"]
    n = len(days) - 1
    sx = lambda i: x0 + (x1 - x0) * i / n
    sy = lambda v: yb - (yb - yt) * v / 280000
    b = ""
    for v in (100000, 200000):
        b += line(x0, sy(v), x1, sy(v), GRID, 1.5, "4 8") + m(x0 - 14, sy(v) + 10, f"{v // 1000}K", 28, MUTED, "end")
    b += m(x0 - 14, yb + 10, "0", 28, MUTED, "end") + line(x0, yb, x1, yb, AXIS, 2.5)
    for i, (q, _) in enumerate(days):
        if q.endswith("-01"):
            nov = q[5:7] == "11"
            b += line(sx(i), yb, sx(i), yb + 12, AXIS, 2.5)
            b += m(sx(i) + (0 if nov else 6), yb + 46, {"07": "JUL", "08": "AUG", "09": "SEP", "10": "OCT", "11": "NOV"}[q[5:7]], 28, MUTED, "end" if nov else "start")
    if stage == "start":
        return b
    if stage == "payoff":
        b += f'<rect x="{x0}" y="{sy(80000):.1f}" width="{x1 - x0}" height="{sy(70000) - sy(80000):.1f}" fill="{KAS}" fill-opacity=".55"/>'
        b += line(x0, sy(80000), x1, sy(80000), KI, 2.5) + line(x0, sy(70000), x1, sy(70000), KI, 2.5)
    cut = len(days) if stage == "payoff" else int(len(days) * .5)
    d = "M" + " L".join(f"{sx(i):.1f},{sy(days[i][1]):.1f}" for i in range(cut))
    b += f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>'
    if stage == "payoff":
        b += rect(x0 + 24, 1470, 560, 76, 14, "#FFFFFF", KI, 2.5)
        b += t(x0 + 304, 1522, '<tspan font-family="JetBrains Mono">70K</tspan> TO <tspan font-family="JetBrains Mono">80K</tspan> A DAY', 42, KI, 700, "middle")
        peak = max(range(len(days)), key=lambda i: days[i][1])
        xp, yp = sx(peak) - 24, sy(days[peak][1])
        b += caps(xp, yp + 28, "SPIKE DAYS", 34, SEC, "end")
        for j, s in enumerate(("MOST AUGUST AND", "SEPTEMBER DAYS RAN", "ABOVE THE BAND")):
            b += caps(xp, yp + 72 + 36 * j, s, 26, MUTED, "end")
    return b


@chart("C4", CHARTS)
def c4():
    ey = "USER TRANSACTIONS A DAY · NON-COINBASE"
    h = f'User transactions,<br>{k("flat.")}'
    src = "Source: api.kaspa.org/transactions/count, regular transactions summed by UTC day, July 1 to November 3, 2026"
    return [(s, frame(s, ey, h, c4_body(s), src)) for s in ("start", "mid", "payoff")]


# ---------------------------------------------------------------- C17: the dot grid on top at full width, the holder bars under it
C17G = dict(cols=27, rows=17, cell=34.8, r=13.2, x0=L, y0=486, bx=L, bw=800, by0=1228, bstep=168)


def c17_body(stage):
    g = C17G
    cols, rows, cell, x0, y0 = g["cols"], g["rows"], g["cell"], g["x0"], g["y0"]
    b = ""
    for i in range(459):
        c, r = i // rows, i % rows
        x, y = x0 + c * cell + cell / 2, y0 + r * cell + cell / 2
        sk = ""
        if i < 276:
            f = "#CFCBC0" if stage == "start" else "#8A877E"
        elif i < 450:
            f = "#CFCBC0"
        else:
            f = KAS if stage == "payoff" else "#CFCBC0"
            sk = f' stroke="{KI}" stroke-width="2.5"' if stage == "payoff" else ""
        b += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{g["r"]}" fill="{f}"{sk}/>'
    gw, gb = cols * cell, y0 + rows * cell
    b += caps(x0, y0 - 22, "EVERY DOT IS ONE TOKEN", 28, MUTED)
    if stage != "start":
        split = x0 + (276 // rows) * cell
        b += f'<path d="M{x0},{gb + 10} V{gb + 26} H{split + cell * .9:.1f} V{gb + 10}" fill="none" stroke="{SEC}" stroke-width="2.5"/>'
        b += t(x0, gb + 84, '<tspan font-family="JetBrains Mono" font-size="56">276</tspan> AT <tspan font-family="JetBrains Mono" font-size="40">2</tspan> OR FEWER', 34, INK, 700)
        rx = x0 + gw
        if stage == "payoff":
            b += f'<path d="M{rx - cell},{gb + 10} V{gb + 26} H{rx} V{gb + 10}" fill="none" stroke="{KI}" stroke-width="3"/>'
            b += t(rx, gb + 84, '<tspan font-family="JetBrains Mono" font-size="56">9</tspan> ABOVE <tspan font-family="JetBrains Mono" font-size="40">100</tspan>', 34, KI, 700, "end")
    bx, bw, scale = g["bx"], g["bw"], g["bw"] / 437
    b += caps(bx, g["by0"] - 8, "HOLDERS PER TOKEN", 28, MUTED)
    for i, (lab, v, col, s) in enumerate((("MEDIAN TOKEN", 2, SEC, "2"), ("NACHO", 355, KI, "355"), ("TOP TOKEN", 437, WIRE, "437"))):
        y = g["by0"] + 16 + i * g["bstep"]
        on = (stage == "payoff") or (stage == "mid" and i == 0)
        b += caps(bx, y + 28, lab, 34, INK if on else MUTED)
        b += f'<rect x="{bx}" y="{y + 44}" width="{bw}" height="72" rx="6" fill="{GREY}"/>'
        if on:
            b += f'<rect x="{bx}" y="{y + 44}" width="{max(v * scale, 3):.1f}" height="72" rx="3" fill="{col}"/>'
            b += m(bx + max(v * scale, 3) + 16, y + 100, s, 54, col if i != 2 else SEC)
    return b


@chart("C17", CHARTS)
def c17():
    ey = "AROUND 460 TOKENS ON LAYER 1"
    h = f'The typical token<br>has {k(chr(60) + "span class=" + chr(34) + "mono" + chr(34) + ">2</span> holders.")}'
    src = "Source: kascov.io tokens.json, 459 tokens, read 2026-11-03 22:44 UTC"
    return [(s, frame(s, ey, h, c17_body(s), src)) for s in ("start", "mid", "payoff")]


# ---------------------------------------------------------------- cascade: Bitcoin pool up top, the stairs run down and right into the Kaspa pool
def casc_body(w):
    lx, ly, lw, lh = L, 430, 640, 430
    rx, ry, rw, rh = 370, 1290, 640, 440
    b = rect(lx, ly, lw, lh, 26, "#FFFFFF", AXIS, 3, None, True)
    b += f'<rect x="{lx + 3}" y="{ly + 120}" width="{lw - 6}" height="{lh - 123}" rx="22" fill="#CFCBC0"/>'
    b += caps(lx + lw / 2, ly + 78, "BITCOIN HOLDERS", 44, INK, "middle")
    b += rect(rx, ry, rw, rh, 26, "#FFFFFF", KI, 3.5, None, True)
    fill = (rh - 6) * [.08, .28, .52, .76][w]
    b += f'<rect x="{rx + 3}" y="{ry + rh - 3 - fill:.1f}" width="{rw - 6}" height="{fill:.1f}" rx="22" fill="{KAS}"/>'
    b += caps(rx + rw / 2, ry + 72, "KASPA", 54, KI, "middle")
    # three stepped arrows: down, then right; the last drops into the pool
    a1, a2, a3 = (210, 860, 1000, 470), (470, 1000, 1140, 730), (730, 1140, 1290, None)
    for i, (x, y0, y1, xe) in enumerate((a1, a2, a3)):
        on = i < w
        c_, wd, hs = (KI, 10, 30) if on else (GHOST, 4, 20)
        if xe:
            b += f'<path d="M{x},{y0} V{y1} H{xe - 16}" fill="none" stroke="{c_}" stroke-width="{wd}" stroke-linejoin="round"/>' + head_at(xe, y1, 0, c_, hs)
        else:
            b += line(x, y0, x, y1 - 16, c_, wd, None, "butt") + head_at(x, y1, math.pi / 2, c_, hs)
        col = KI if on else MUTED
        if i == 0:
            b += caps(240, 960, "SOME MOVE", 36, col, ls="0.04em")
        elif i == 1:
            b += caps(500, 1100, "A YEAR LATER, MORE", 36, col, ls="0.04em")
        else:
            b += caps(764, 1232, "AND SO ON", 36, col, ls="0.04em")
    return b


@chart("cascade", DIAGRAMS)
def casc():
    ey, h = "THE LONG-TERM THEORY", f'A {k("cascade,")}<br>over time.'
    return [(n, frame(n, ey, h, casc_body(i), "", tag="MY THEORY")) for i, n in enumerate(("base", "wave1", "wave2", "wave3"))]


# ---------------------------------------------------------------- the portrait specs (the 16:9 spec's cue tables + the portrait geometry)
def c3_paths():
    sx, sy = c3_geom()
    pts = [(sx(i), sy(B.HR[i])) for i in range(19)]
    g = C3G
    gx0, gx1, gyb, gyt = g["ix"] + 100, g["ix"] + g["iw"] - 100, g["iy"] + g["ih"] - 84, g["iy"] + 214
    zx = lambda i: gx0 + (gx1 - gx0) * i / 3
    zy = lambda v: gyb - (gyb - gyt) * (v - 300) / 70
    zv = [314.1, 317.1, 335.4, 357.3]
    fmt = lambda p: "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in p)
    return fmt(pts[:15]), fmt(pts[14:18]), fmt([(zx(i), zy(zv[i])) for i in range(4)]), pts


def c4_path():
    g, days = C4G, c4_days()
    n = len(days) - 1
    return "M" + " L".join(f"{g['x0'] + (g['x1'] - g['x0']) * i / n:.1f},{g['yb'] - (g['yb'] - g['yt']) * days[i][1] / 280000:.1f}" for i in range(len(days)))


def page_geom():
    return """Page (every chart here): 1080x1920, background #F6F4EE. Orb 700x700 at right -260, top -340, same blur 120, opacity .18. SVG viewBox 0 0 1080 1920.
Eyebrow left 70, top 120, DM Sans 30/600, letter-spacing .18em. Headline Playfair 900, 88 px, line-height 1.07, on the TWO explicit lines the states print, marginTop 14. Divider 66x4, marginTop 22. Source line left 70, right 70, bottom 60, JetBrains Mono 22, line-height 1.4, text-wrap balance, dates kept whole. State D's headline is 84 px (the first line would overrun the margin at 88). Push-in the same (1.025 to 1 over 0.6 s), transform-origin the frame centre."""


def spec_geometry(cid):
    if cid == "C2":
        a, d, c, dn = C2A, C2D, C2C, DONUT
        sl = (d["ybot"] - d["ytop"]) * d["frac"]
        return f"""### State A
Two cards STACKED (16:9: side by side): 4-YEAR card x {a['card1'][0]} y {a['card1'][1]} w {a['card1'][2]} h {a['card1'][3]}, KASPA card x {a['card2'][0]} y {a['card2'][1]} w {a['card2'][2]} h {a['card2'][3]}, r 22.
Staircase x {a['sx0']} to {a['sx1']}, baseline y {a['syb']}, top y {a['syt']}, stroke 7. Reward x {a['rx0']} to {a['rx1']}, baseline y {a['yb']}, top y {a['top']}, ry(v) = {a['yb']} - {a['yb'] - a['top']} * v / 440, stroke 7. Supply scaled to cap y {a['cap_y']}, stroke 4.5. Cap line y {a['cap_y']}, dash 12 9. HARD CAP right-anchored at x {a['rx1']}, y {a['cap_y'] - 22}, 34 px. Same maths and same draw order as the 16:9; read every label position from `C2.html`.

### State B
Ring centre ({dn['cx']}, {dn['cy']}), r {dn['r']}, stroke {dn['sw']}, `rotate({dn['rot']})`, so the 3.2% remainder sits at the BOTTOM of the ring (16:9: at the left) and the leader drops straight down from it to y {dn['leader_y']}. Centre figure mono 136 at cy + 22, MINED 48 at cy + 96. `912M KAS LEFT` centred at y {dn['num_y']}, 912M mono 124, KAS LEFT 56. Leader draws DOWN, not left.

### State C
x0 {c['x0']}, xm {c['xm']}, x1 {c['x1']}, baseline y {c['yb']}, y0 (2.06) {c['y0']}, y1 (1.94) {c['y1']}, axis top {c['axis_top']}. Plateau-to-floor ratio kept at the 16:9's (y1 height / y0 height = 0.58), so the drop reads the same; the axis is still broken. Figures mono {c['num_size']}: 2.06 at x0 + 28, baseline y0 - 40; 1.94 at xm + 40, baseline y1 - 40. Cut marker x = xm, dashes from y {c['dash_top']}; label centred at y {c['cut_label_y']}, 40 px.

### State D (bars stand UP in portrait)
Two columns growing from the floor: NEW SUPPLY x {d['x1']}, TRADED x {d['x2']}, each w {d['bw']}, track y {d['ytop']} to {d['ybot']} ({d['ybot'] - d['ytop']} tall). True scale: sliver HEIGHT = {d['ybot'] - d['ytop']} x 52,100 / 20,043,483 = {sl:.2f} px. Do not raise it; the sliver is the point. Highlight box around it y {d['ybot'] - 16}, h 24, 5 px #49EACB; arrow drops onto it from y {d['ybot'] - 150}; chip WELL UNDER 1% w 400 h 76 at x {d['x1'] + 20}, y {d['ybot'] - 226}. $20M bar grows UP. Footnote y {d['ybot'] + 62}."""
    if cid == "C3":
        grey, acc, zoom, pts = c3_paths()
        g = C3G
        return f"""Full axis on top, zoom card BELOW it (16:9: card over the top right). x0 {g['x0']}, x1 {g['x1']}, baseline y {g['yb']}, y for 1,200 = {g['yt']}. Stroke weights as the stills.
**Rest offset:** before the rise there is no card, so the whole axis group sits {g['rest_dy']} px lower (`translate(0 {g['rest_dy']})`, the `start` and `mid` stills). At 381.78 ("then it rose") it slides up to 0 with an ease-out over 0.5 s as the card scales in from below. Rigid translate only, no re-layout.
Zoom card x {g['ix']}, y {g['iy']}, w {g['iw']}, h {g['ih']}, r 22. Hairline from the August point down to the card top, x {pts[15][0]:.1f}.

Paths (in the axis group's coordinates):
- Grey fall: `{grey}`
- Accent rise: `{acc}`
- Dotted NOV: from {pts[17][0]:.1f},{pts[17][1]:.1f} to {pts[18][0]:.1f},{pts[18][1]:.1f}
- Zoom line: `{zoom}`
FELL AROUND 70% is right-anchored at x {g['x1']} in the free upper right of the axis, not at the 16:9's left-centre."""
    if cid == "C4":
        g = C4G
        return f"""Same plot stretched tall: x0 {g['x0']}, x1 {g['x1']}, baseline y {g['yb']}, y for 280K = {g['yt']}. y(v) = {g['yb']} - {g['yb'] - g['yt']} * v / 280000. Band 70K to 80K between y(80000) and y(70000), fill #49EACB .55, edges #0E7A6C 2.5. Line stroke 3.5, drawn with stroke-dashoffset as before.
Chip 70K TO 80K A DAY: rect x {g['x0'] + 24}, y 1470, w 560, h 76, text centred at x {g['x0'] + 304}, y 1522, 42 px. SPIKE DAYS right-anchored 24 px left of the peak, 34 px; its note wraps to three lines, 26 px, same words.

Line path: `{c4_path()}`"""
    if cid == "C17":
        g = C17G
        return f"""Dot grid on top at full width, holder bars BELOW it (16:9: side by side). Grid kept at {g['cols']} columns x {g['rows']} rows = 459 dots, filled by column as before: cell {g['cell']}, r {g['r']}, x0 {g['x0']}, y0 {g['y0']}.
Bars: x {g['bx']}, full track w {g['bw']}, one linear scale {g['bw']} px = 437 holders, so the median bar is {2 * g['bw'] / 437:.1f} px (16:9: 2.8 px). Rows every {g['bstep']} px from y {g['by0'] + 16}: label at row + 28 (34 px), bar at row + 44, h 72, value mono 54 at bar end + 16, baseline row + 100."""
    return ""


def write_spec(cid):
    src = (PROJ / "assets" / "charts" / f"{cid}.spec.md").read_text(encoding="utf-8")
    src = src.replace(": animation spec (Type 1, animates for real with useCurrentFrame)", ": PORTRAIT animation spec (1080x1920, Type 1, useCurrentFrame)", 1)
    src = src.replace("Source: `", "Source: `assets/vertical/charts/", 1)
    if cid == "C2":   # the 16:9's width maths and landing-left wording are replaced by the portrait geometry below
        src = re.sub(r"The bars are to true scale: sliver width.*?\n", "The bars are to true scale, in height here: see the portrait geometry. Do not raise the sliver; it is the point.\n", src)
        src = src.replace("$20M bar grows across the frame and dwarfs it", "$20M bar grows up the frame and dwarfs it")
        src = src.replace("Remainder turns ink, leader draws left", "Remainder turns ink, leader draws down")
        src = src.replace("Label counts up to 1.68M, sliver grows to its true width", "Label counts up to 1.68M, sliver grows to its true height")
    if cid == "C17":
        src = src.replace("All three bars share one linear scale (620 px = 437 holders)", f"All three bars share one linear scale ({C17G['bw']} px = 437 holders)")
        src = src.replace("grows to its 2.9 px", f"grows to its {2 * C17G['bw'] / 437:.1f} px")
    head = ("\n\n_Same words, numbers and beat times as the 16:9 `assets/charts/" + cid + ".spec.md`, which this file copies; only the layout changes. "
            "Same `t` contract: the comp's clock, FINAL spine seconds._\n")
    first, _, rest = src.partition("\n\n")
    (CHARTS / f"{cid}.vertical.spec.md").write_text(first + head + "\n" + rest.rstrip() + "\n\n## Portrait geometry\n\n" + page_geom() + "\n\n" + spec_geometry(cid) + "\n", encoding="utf-8")


def main():
    want = sys.argv[1:] or list(REG)
    CHARTS.mkdir(parents=True, exist_ok=True)
    DIAGRAMS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for cid in want:
            folder, fn = REG[cid]
            frames = fn()
            html = (f'<!doctype html><html><head><meta charset="utf-8"><title>{cid} vertical</title>{B.FONTS}<style>{B.CSS}{B.LOCAL}{LOCAL}</style></head><body><svg width="0" height="0" style="position:absolute">{B.DEFS}</svg>'
                    + "".join(f for _, f in frames) + "</body></html>")
            path = folder / f"{cid}.html"
            path.write_text(html, encoding="utf-8")
            pg.goto(path.as_uri(), wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(300)
            for sid, _ in [frames[-1]] + frames:   # a throwaway first shot, same reason as the 16:9 generator
                out = folder / f"{cid}-{sid}.png"
                pg.evaluate("(id)=>document.querySelectorAll('.frame').forEach(f=>f.style.display=f.id===id?'block':'none')", sid)
                pg.evaluate("window.scrollTo(0,0)")
                pg.wait_for_timeout(60)
                pg.locator(f"#{sid}").screenshot(path=str(out))
                print(out.name)
            if folder == CHARTS:
                write_spec(cid)
        br.close()


if __name__ == "__main__":
    main()
