"""_charts_portrait.py: the VERTICAL (1080x1920) re-lay of the chart-builder's 16:9 charts + diagrams of "AI destroying lives".

    python _charts_portrait.py [id ...]          # writes charts/<id>.html or diagrams/<id>.html (this folder) + <id>.vertical.spec.md
    python _shot_portrait.py <that .html>        # shoots <id>-<state>.png + <id>-geometry.json next to it, with the layout gates

Same design as the 16:9 sources (assets/charts/<id>.html, assets/diagrams/<id>.html): the locked stylesheet is copied
VERBATIM out of the 16:9 file, every string, number, colour role, state id and cue time is the 16:9's; only the geometry
and type sizes change (a portrait block appended after the stylesheet, LAYOUT ONLY). Every state is one .frame built from
ONE function per chart, so shared elements are pixel-identical between states (the comp's state swaps read as transforms).
No number is new: each comes off the 16:9 source, which traces to DATA.md.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent            # assets/vertical
A16 = HERE.parent                                 # assets
W, H = 1080, 1920
L, R = 72, 1008                                    # content x range (72 px side margins)
MINUS = "−"

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">')

PORTRAIT_CSS = """
/* ---- portrait additions (VERTICAL cut, chart-builder 2026-11-11): LAYOUT ONLY, every token above untouched ----
   1080x1920 canvas, content x 72-1008, header at top 110, source line bottom 110. Every text sits >= 44 px inside the
   frame (the comp's 105% camera wobble crops 27 px a side and 48 px top/bottom). */
.frame{width:1080px;height:1920px}
.frame .hdr{left:72px;top:110px;width:936px}
.hdr .ey{font-size:28px;line-height:1.45;margin-bottom:18px}
.hdr h1{font-size:82px;line-height:1.08;max-width:936px}
.hdr .divider{margin:26px 0 0}
.frame .src{left:72px;right:72px;bottom:110px;font-size:21px;line-height:1.5}
.frame svg.layer{width:1080px;height:1920px}
.frame .take{left:72px;right:72px;bottom:auto;padding:26px 36px;font-size:40px;line-height:1.3}
.frame .callout{font-size:44px}
"""


def locked_stylesheet():
    s = (A16 / "charts" / "C10.html").read_text(encoding="utf-8")
    a, b = s.index("<style>") + len("<style>"), s.index("</style>")
    return s[a:b]


def n1(x):
    return f"{x:.1f}"


def ga(g):
    return f' data-g="{g}"' if g else ""


def A(style, inner="", cls="", g=None):
    c = ("a " + cls).strip()
    return f'<div class="{c}" style="{style}"{ga(g)}>{inner}</div>'


def orb(l, t, size, bg):
    return f'<div class="orb" style="left:{l}px;top:{t}px;width:{size}px;height:{size}px;background:{bg}"></div>'


def HDR(ey, h1):
    return f'<div class="hdr" data-g="header"><div class="ey">{ey}</div><h1>{h1}</h1><div class="divider"></div></div>'


def SRC(t):
    return f'<div class="src" data-g="source">{t}</div>'


def off(cond):
    return " off" if cond else ""


# =====================================================================================================================
# C10 · 2.0 million long-term unemployed
def c10():
    FILL = round(936 * 0.276, 1)                    # 27.6% of the 936 px track (16:9: of 1100 = 303.6)

    def fr(s):
        mid, pay = s != "start", s == "payoff"
        h = orb(420, 1180, 900, "#0b3a66")
        h += A("left:72px;top:470px;margin:0", "United States &middot; October 2026", "ey", "eyebrow")
        h += A("left:58px;top:520px;white-space:nowrap",
               '<div class="val" style="font-size:340px;color:var(--text-primary);letter-spacing:-.02em">2.0</div>'
               '<div class="val" style="font-size:120px;font-weight:400;color:var(--text-secondary);letter-spacing:.06em;margin:8px 0 0 14px">MILLION</div>',
               "", "number")
        h += A("left:72px;top:1040px;font-family:'Playfair Display',serif;font-weight:700;font-size:72px;line-height:1.1;color:var(--text-primary);white-space:nowrap",
               'out of work <span class="mono">27</span><br>weeks or more', off(not mid).strip(), "line")
        h += A("left:72px;top:1222px;margin:0", "", "divider" + off(not mid), "divider")
        h += A("left:72px;top:1282px;width:936px;height:20px;border-radius:10px;background:#161a23;border:1px solid var(--border)", "", off(not mid).strip(), "track")
        h += A(f"left:72px;top:1282px;width:{FILL}px;height:20px;border-radius:10px;box-shadow:0 0 26px rgba(255,64,96,.35)", "", "bar hred" + off(not pay), "fill")
        h += A("left:72px;top:1336px;white-space:nowrap;font-size:36px", '<span class="mono re">27.6%</span> of all unemployed people in the US', "lbl" + off(not pay), "label")
        h += SRC("Source: U.S. Bureau of Labor Statistics,<br>The Employment Situation, October 2026 &middot;<br>long-term = jobless 27 weeks or more")
        return h

    return dict(
        id="C10", kind="charts", type="Type 1 ANIMATED", title="2.0 million long-term unemployed", states=["start", "mid", "payoff"], frame=fr,
        beat="CH1@6.49-13.45 (cover)", spoken="This is not a warning about the future. It's already happening in jobs that felt safe just two years ago.",
        geo=dict(track=dict(x=72, y=1282, w=936, h=20), fill=dict(pct=27.6, w=FILL), number=dict(x=58, y=520, size=340, million_size=120)),
        state_rows=[("C10-start.png", "6.49", "eyebrow + '2.0 / MILLION' (the comp fades the number in from 6.54); line, divider, track, fill, label held back"),
                    ("C10-mid.png", "8.38", "+ 'out of work 27 / weeks or more' (2 lines), divider, empty track"),
                    ("C10-payoff.png", "9.42", "+ red fill 258.3 px (27.6% of 936) + '27.6% of all unemployed people in the US' (label on landing ~11.42)")],
        geo_rows=[("Eyebrow", "x140 y236, 27 px", "**x72 y470**, 28 px, one line"),
                  ("Number", "'2.0' 250 px + 'MILLION' 112 px on ONE line, x132 y300", "**STACKED: '2.0' 340 px over 'MILLION' 120 px** (one wrapper div x58 y520, so the fade + blur still hits ONE element)"),
                  ("Line", "Playfair 700 66 px, one line, y584", "**Playfair 700 72 px, two lines** 'out of work 27' / 'weeks or more', x72 y1040"),
                  ("Divider", "y694", "**y1222**"),
                  ("Track", "x140 y758 1100x16", "**x72 y1282 936x20**, r10"),
                  ("Fill", "303.6 px", "**258.3 px** (27.6% of 936)"),
                  ("Label", "DM Sans 32 px, y796", "**36 px, y1336**"),
                  ("Source", "one line, bottom 40", "**three lines, bottom 110**, JetBrains Mono 21 px, line-height 1.5"),
                  ("Orb", "x1250 y420 900", "**x420 y1180 900** (bottom right glow)")],
        moves="The number stacks (2.0 over MILLION) so it fills the 936 px width instead of shrinking; the Playfair line wraps to two lines; the whole card centres on y ~930.",
        cues=[("6.49", "(cover in)", "house container entry (cross-fade + scale-in), state start; slow push-in 1.00 to 1.03 across the whole beat"),
              ("6.54", "This", "the number wrapper ('2.0' + 'MILLION') fades 0 to 1 with blur 8px to 0 over 30f. NO count-up (Mike: quiet, no flourish)"),
              ("8.38", "future.", "line fades up 12px over 18f; divider width 0 to 66 over 18f; track fades in"),
              ("9.42", "already", "red fill grows 0 to 258.3 px over 60f easeOutCubic (lands ~11.42, 'safe' 11.46); label fades in on landing (10f)"),
              ("13.45", "(cover out)", "next cover BR-1")],
        guards="the card never says AI (BLS does not attribute it). No em dashes on screen.")


# =====================================================================================================================
# C7 · entry-level vs senior postings
def c7():
    Z, SC = 1090, 34.0                              # zero line y, px per percentage point (16:9: 17)
    EH, SH = 7.5 * SC, 14.7 * SC                   # 255.0 down, 499.8 up
    EX, SX, BW = 240, 640, 300                      # bar lefts (centres 390 / 790), width

    def fr(s):
        h = orb(560, -380, 760, "rgba(255,64,96,.55)")
        h += HDR("Job postings &middot; year over year,<br>as of May 2026", 'The bottom rung<br>is <span class="re">shrinking</span>')
        h += f'<svg class="layer"><line x1="176" y1="{Z}" x2="{R}" y2="{Z}" stroke="#3a4357" stroke-width="3"/></svg>'
        h += A(f"left:{L}px;top:{Z - 14}px;width:88px;text-align:right;font-size:26px;color:var(--text-muted)", "0%", "val", "zero-label")
        h += A(f"left:{EX}px;top:{Z - 52}px;width:{BW}px;text-align:center;font-size:28px;color:var(--text-secondary)", "Entry-level", "cat", "entry-cat")
        if s != "start":
            h += A(f"left:{EX}px;top:{Z}px;width:{BW}px;height:{n1(EH)}px;border-radius:0 0 10px 10px", "",
                   "bar red " + ("dim" if s == "hiring" else "glow-red"), "entry-bar")
        ecls = "val" + (" off" if s == "start" else " dim" if s == "hiring" else "")
        h += A(f"left:{EX + BW // 2 - 220}px;top:{n1(Z + EH + 22)}px;width:440px;text-align:center;font-size:100px;color:var(--accent-red)", f"{MINUS}7.5%", ecls, "entry-val")
        h += A(f"left:{SX}px;top:{Z + 24}px;width:{BW}px;text-align:center;font-size:28px;color:var(--text-secondary)", "Senior", "cat", "senior-cat")
        if s in ("both", "hiring", "payoff"):
            h += A(f"left:{SX}px;top:{n1(Z - SH)}px;width:{BW}px;height:{n1(SH)}px;border-radius:10px 10px 0 0", "",
                   "bar green " + ("dim" if s == "payoff" else "glow-green"), "senior-bar")
        scls = "val" + (" off" if s in ("start", "mid") else " dim" if s == "payoff" else "")
        h += A(f"left:{SX + BW // 2 - 220}px;top:{n1(Z - SH - 22 - 100)}px;width:440px;text-align:center;font-size:100px;color:var(--accent-green)", "+14.7%", scls, "senior-val")
        take = ('Companies are <span class="g">still hiring</span>.<br>They’re not hiring the beginners.' if s == "hiring"
                else 'Companies are still hiring.<br>They’re not hiring the <span class="re">beginners</span>.')
        h += f'<div class="take{off(s in ("start", "mid", "both"))}" style="top:1528px" data-g="take">{take}</div>'
        h += SRC("Source: Indeed Hiring Lab, &ldquo;The Labor Market Is Tilting Toward Seniority&rdquo;,<br>July 23, 2026 &middot; postings, year over year")
        return h

    return dict(
        id="C7", kind="charts", type="Type 1 ANIMATED", title="entry-level vs senior postings", states=["start", "mid", "both", "hiring", "payoff"], frame=fr,
        beat="CH2@52.30-64.45 (cover)", spoken="Entry level job postings are down 7.5% in a year while senior postings are up 14.7%. Companies are still hiring. They're not hiring the beginners.",
        geo=dict(baseline=dict(y=Z, x1=176, x2=R), scale_px_per_point=SC, entry=dict(x=EX, w=BW, down=EH), senior=dict(x=SX, w=BW, up=SH),
                 values=dict(size=100, entry_top=Z + EH + 22, senior_top=Z - SH - 122), take_top=1528),
        state_rows=[("C7-start.png", "52.30", "zero line + both category labels, no bars, values off"),
                    ("C7-mid.png", "54.14", "+ entry bar down 255 px (glow), '-7.5%' below it"),
                    ("C7-both.png", "58.58", "+ senior bar up 499.8 px (glow), '+14.7%' above it"),
                    ("C7-hiring.png", "60.74", "takeaway in with 'still hiring' green; entry dims to .3"),
                    ("C7-payoff.png", "63.54", "entry relit, senior dims to .3, 'beginners' red")],
        geo_rows=[("Header", "x140 y78, h1 74 px one line", "**x72 y110**, eyebrow 2 lines, h1 82 px **2 lines** 'The bottom rung' / 'is **shrinking**'"),
                  ("Zero line", "y630, x500-1420", "**y1090, x176-1008**; '0%' right-aligned x72 w88, 26 px"),
                  ("Scale", "17 px / point", "**34 px / point** (twice as tall: the frame is tall)"),
                  ("Entry bar", "x640 w240, down 127.5", "**x240 w300, down 255.0** (centre 390)"),
                  ("Senior bar", "x1040 w240, up 249.9", "**x640 w300, up 499.8** (top 590.2, centre 790)"),
                  ("Values", "72 px", "**100 px**, w440 centred on the bar; entry top 1367, senior top 468.2 (bar top - 22 - 100)"),
                  ("Category labels", "24 px", "**28 px**; Entry-level above the line (y1038), Senior below (y1114)"),
                  ("Takeaway", "one line, bottom 92", "**two lines, top 1528**, 40 px, x72-1008"),
                  ("Source", "one line", "**two lines**, bottom 110")],
        moves="Bars stack taller (the scale doubles to 34 px per point); the takeaway wraps to two lines under the chart.",
        cues=[("52.30", "(cover in)", "state start: zero line + both category labels, no bars"),
              ("54.14", "down", "entry bar grows DOWN 0 to 255.0 px over 27f easeOutCubic; value counts 0.0 to 7.5 (one decimal, '-7.5%', the U+2212 minus) and rides 22 px under the bar end, landing 55.04"),
              ("58.58", "up", "senior bar grows UP 0 to 499.8 px over 27f; value rides 22 px above the bar top, counts to '+14.7%' landing 59.46"),
              ("60.74", "Companies", "takeaway rises 16px + fades in (15f) with 'still hiring' green; senior keeps its glow, entry dims to .3 (15f)"),
              ("63.54", "the beginners", "swap: entry relit with glow, senior dims to .3, 'beginners' turns red, 'still hiring' back to white (12f)"),
              ("64.45", "(cover out)", "next cover R-INDEED")],
        guards="the minus is U+2212 as on the 16:9; values one decimal while counting. No em dashes on screen.")


# =====================================================================================================================
# C6 · minus 752,100 office and administrative support
def c6():
    def fr(s):
        h = orb(380, 1150, 900, "rgba(255,64,96,.45)")
        h += A("left:72px;top:560px;margin:0;line-height:1.45", "BLS Employment Projections &middot;<br>2025 to 2035", "ey", "eyebrow")
        h += A("left:72px;top:666px", "Projected", "pill gold", "pill")
        h += A(f"left:62px;top:740px;font-size:184px;color:var(--accent-red);letter-spacing:-.02em;text-shadow:0 0 60px rgba(255,64,96,.28)",
               f"{MINUS}752,100", "val" + off(s == "start"), "number")
        h += A("left:72px;top:972px;font-family:'Playfair Display',serif;font-weight:700;font-size:72px;line-height:1.1;color:var(--text-primary);white-space:nowrap",
               "office and administrative<br>support jobs", "", "line")
        h += A("left:72px;top:1160px;margin:0", "", "divider", "divider")
        h += A("left:72px;top:1210px", "the most of any group", "callout" + off(s != "payoff"), "callout")
        h += SRC("Source: U.S. Bureau of Labor Statistics, Employment Projections<br>2025 to 2035 (Aug 27, 2026) &middot; a projection, not jobs already lost")
        return h

    return dict(
        id="C6", kind="charts", type="Type 1 ANIMATED", title="minus 752,100 office and administrative support", states=["start", "mid", "payoff"], frame=fr,
        beat="CH2@78.20-85.90 (cover)", spoken="...office and administrative support will lose 752,000 jobs by 2035. The most of any group.",
        geo=dict(number=dict(x=62, y=740, size=184, anchor="left"), callout=dict(x=72, y=1210)),
        state_rows=[("C6-start.png", "78.20", "eyebrow, PROJECTED pill, 'office and administrative / support jobs', number slot empty"),
                    ("C6-mid.png", "80.00", "+ '-752,100' (counter lands 82.32)"),
                    ("C6-payoff.png", "84.46", "+ callout 'the most of any group'")],
        geo_rows=[("Eyebrow", "one line y226", "**two lines y560** (break after the middot)"),
                  ("Pill", "y290", "**y666**"),
                  ("Number", "210 px, x128 y356", "**184 px, x62 y740**, LEFT-anchored (8 mono glyphs = 854 px)"),
                  ("Line", "Playfair 700 64 px one line y600", "**72 px, two lines** 'office and administrative' / 'support jobs', y972"),
                  ("Divider", "y706", "**y1160**"),
                  ("Callout", "40 px y756", "**44 px y1210**"),
                  ("Source", "one line", "**two lines**, bottom 110"),
                  ("Orb", "x1300 y380 900", "**x380 y1150 900**")],
        moves="The card stacks down the centre of the frame (y 560 to 1300); the number shrinks only as far as the width needs and stays left-anchored.",
        cues=[("78.20", "(cover in)", "state start: eyebrow, PROJECTED pill, 'office and administrative support jobs' (he is saying it), number slot empty"),
              ("80.00", "lose", "counter '-0' to '-752,100' over 70f easeOutQuart, tabular mono, LEFT-anchored at x62 (no jitter), lands 82.32 'jobs'. The card shows 752,100, never the VO's 752,000"),
              ("84.46", "The most of any group", "callout slides in 24px from the left + fades (12f), red rule draws top to bottom"),
              ("85.90", "(cover out)", "next cover C5 receipt")],
        guards="752,100 exactly (never the VO's 752,000); PROJECTED pill + 'a projection, not jobs already lost' stay on. No em dashes on screen.")


# =====================================================================================================================
# C3 · fastest declining occupations ladder
def c3():
    FULL = 936.0
    ROWS = [("Word processors and typists", "40.4", "26.5", FULL * 26.5 / 40.4, "34.4"),
            ("Data entry keyers", "131.8", "98.2", FULL * 98.2 / 131.8, "25.5"),
            ("Telemarketers", "60.9", "47.8", FULL * 47.8 / 60.9, "21.4")]
    TOPS = [540, 900, 1260]
    HATCH = "repeating-linear-gradient(45deg,rgba(255,64,96,.30) 0 6px,rgba(255,64,96,.07) 6px 14px)"
    ARROW = ('<svg width="34" height="20" viewBox="0 0 34 20" style="vertical-align:middle;margin:0 2px"><path d="M2 10 H29 M20 3 L30 10 L20 17" '
             'stroke="#8892a4" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')

    def fr(s):
        h = orb(600, -380, 760, "rgba(255,64,96,.50)")
        h += HDR("BLS &middot; fastest declining occupations &middot;<br>2025 to 2035", 'Projected to <span class="re">shrink</span>')
        h += A("left:72px;top:446px;display:flex;align-items:center;gap:14px;font-family:'DM Sans';font-size:24px;color:var(--text-secondary);white-space:nowrap",
               '<span style="display:inline-block;width:28px;height:18px;border-radius:4px;background:repeating-linear-gradient(45deg,rgba(255,64,96,.34) 0 5px,rgba(255,64,96,.08) 5px 11px);border:2px solid rgba(136,146,164,.30)"></span>'
               '<span>full bar = <span class="mono">2025</span> jobs</span>'
               '<span style="display:inline-block;width:28px;height:18px;border-radius:4px;background:#ff4060;margin-left:22px"></span>'
               '<span>left in <span class="mono">2035</span>, projected</span>', "", "legend")
        for i, (name, a, b, fill, pct) in enumerate(ROWS):
            y = TOPS[i]
            shown = i == 0 or (i == 1 and s != "start") or (i == 2 and s == "payoff")
            cut = (i == 0 and s != "start") or (i == 1 and s != "start") or (i == 2 and s == "payoff")
            h += A(f"left:72px;top:{y}px;width:640px",
                   f'<div style="font-family:\'DM Sans\';font-size:42px;font-weight:700;color:var(--text-primary);line-height:1.15;white-space:nowrap">{name}</div>'
                   f'<div class="val" style="font-size:32px;color:var(--text-secondary);margin-top:14px">{a} {ARROW} {b}<span style="font-family:\'DM Sans\';font-weight:500;font-size:26px;color:var(--text-muted);margin-left:14px">thousand jobs</span></div>',
                   off(not shown).strip(), f"row{i + 1}-label")
            h += A(f"left:72px;top:{y + 122}px;width:{FULL:.0f}px;height:84px;border-radius:12px;background:{HATCH};border:2px solid rgba(136,146,164,.30)", "",
                   off(not shown).strip(), f"row{i + 1}-track")
            h += A(f"left:72px;top:{y + 122}px;width:{n1(fill if cut else FULL)}px;height:84px;border-radius:12px;box-shadow:0 0 30px rgba(255,64,96,.30)", "",
                   "bar hred" + off(not shown), f"row{i + 1}-fill")
            h += A(f"left:668px;top:{y + 4}px;width:340px;text-align:right;font-size:76px;color:var(--accent-red)", f"{MINUS}{pct}%",
                   "val" + off(not cut), f"row{i + 1}-pct")
        h += SRC("Source: U.S. Bureau of Labor Statistics, Table 1.5, Fastest declining<br>occupations, 2025 and projected 2035 &middot; jobs in thousands")
        return h

    fills = [round(r[3], 1) for r in ROWS]
    return dict(
        id="C3", kind="charts", type="Type 1 ANIMATED", title="fastest declining occupations ladder", states=["start", "mid", "payoff"], frame=fr,
        beat="CH2@91.90-99.30 (cover)", spoken="typists down 34% data entry down 25% telemarketers down 21%.",
        geo=dict(rows=[dict(top=t, label_top=t, track=dict(x=72, y=t + 122, w=FULL, h=84), fill_end=f, pct=dict(x=668, y=t + 4, w=340, size=76, anchor="right"))
                       for t, f in zip(TOPS, fills)], full_bar="936 px = each row's own 2025 total", legend_top=446),
        state_rows=[("C3-start.png", "91.90", "row 1 'Word processors and typists' with a FULL red bar (= 2025), no percent; rows 2-3 off"),
                    ("C3-mid.png", "95.94", "rows 1 and 2 cut, '-34.4%' and '-25.5%' showing; row 3 off"),
                    ("C3-payoff.png", "98.58", "all three rows cut, '-21.4%' in")],
        geo_rows=[("Header", "h1 74 px one line", "eyebrow **2 lines**, h1 82 px one line 'Projected to **shrink**'"),
                  ("Legend", "right-anchored x right 140 y268, 22 px", "**left-anchored x72 y446, 24 px**"),
                  ("Row layout", "label left (x140) | bar middle (x760 w740) | pct right (x1530)", "**label ON TOP (x72), pct right-aligned on the label line (x668 w340, 76 px), bar FULL WIDTH under them (x72 w936 h84)**"),
                  ("Row tops", "350 / 538 / 726", "**540 / 900 / 1260**; bar top = row top + 122"),
                  ("Fills (2035/2025)", "485.4 / 551.4 / 580.8 of 740", f"**{fills[0]} / {fills[1]} / {fills[2]} of 936**"),
                  ("Row type", "title 38 px, counts 28 px", "**title 42 px, counts 32 px**, 'thousand jobs' 26 px"),
                  ("Source", "one line", "**two lines**")],
        moves="Each row restacks from a horizontal strip into a block: label + counts on top with the percent on the same line at the right, the bar full width beneath. The bars get 936 px instead of 740.",
        cues=[("91.90", "(cover in)", "state start: row 1 with a FULL red bar (= 2025), no percent"),
              ("92.76", "down", f"row 1 red fill shrinks 936 to {fills[0]} px over 20f easeInOutCubic, revealing the hatched loss; '-34.4%' fades in at 93.10 ('34')"),
              ("94.84", "data", f"row 2 rises 20px + fades in (10f) with a full bar; 95.60 'down' shrinks to {fills[1]} px; '-25.5%' at 95.94"),
              ("97.14", "telemarketers", f"row 3 in (10f); 98.18 'down' shrinks to {fills[2]} px; '-21.4%' at 98.58"),
              ("99.30", "(cover out)", "next cover C4 receipt")],
        guards="exact decimals on screen, never the VO's rounded 34 / 25 / 21. 'Projected' stays in the header. No em dashes on screen.")


# =====================================================================================================================
# C8 · translation and writing work fell
def c8():
    Z, SC = 576, 18.0                               # zero line y, px per point (16:9: 9)
    CX, BW = [352, 636, 912], 190
    COLS = [("Translation,<br>Western languages", 30, f"{MINUS}30%"), ("Translation,<br>other languages", 20, f"{MINUS}20%"),
            ("&ldquo;About Us&rdquo;<br>page writing", 50, f"{MINUS}50%")]

    def fr(s):
        h = orb(640, -360, 720, "rgba(255,64,96,.50)")
        h += HDR("Freelance job postings &middot;<br>first year after ChatGPT", 'Translation and<br>writing work <span class="re">fell</span>')
        h += f'<svg class="layer"><line x1="236" y1="{Z}" x2="{R}" y2="{Z}" stroke="#3a4357" stroke-width="3"/></svg>'
        h += A(f"left:72px;top:{Z - 14}px;width:148px;text-align:right;font-family:'DM Sans';font-size:22px;color:var(--text-muted);line-height:1.2",
               '<span class="mono">0</span> = the<br>market trend', "", "zero-label")
        for i, (lab, v, txt) in enumerate(COLS):
            on = (s == "mid" and i < 2) or s == "payoff"
            cx, hh = CX[i], v * SC
            h += A(f"left:{cx - 150}px;top:{Z - 104}px;width:300px;text-align:center;font-family:'DM Sans';font-size:28px;font-weight:700;line-height:1.2;color:var(--text-{'primary' if on else 'secondary'})",
                   lab, "", f"col{i + 1}-label")
            if on:
                h += A(f"left:{cx - BW // 2}px;top:{Z}px;width:{BW}px;height:{n1(hh)}px;border-radius:0 0 10px 10px", "", "bar red" + (" glow-red" if i == 2 else ""), f"col{i + 1}-bar")
            inner = (f'<span style="font-family:\'DM Sans\';font-weight:500;font-size:30px;color:var(--text-secondary);margin-right:12px">about</span>{txt}' if i == 1 else txt)
            h += A(f"left:{cx - 150}px;top:{n1(Z + hh + 22)}px;width:300px;text-align:center;font-size:72px;color:var(--accent-red)", inner, "val" + off(not on), f"col{i + 1}-val")
        h += SRC("Source: Teutloff et al., Journal of Economic Behavior<br>&amp; Organization, 2025 &middot; over 3 million freelance postings &middot;<br>vs. the market trend")
        return h

    return dict(
        id="C8", kind="charts", type="Type 1 ANIMATED", title="translation and writing work fell", states=["start", "mid", "payoff"], frame=fr,
        beat="CH2@114.50-124.25 (cover)", spoken="...in the first year after ChatGPT translation work in Western languages fell 30% and one of a kind routine writing fell by 50%.",
        geo=dict(baseline=dict(y=Z, x1=236, x2=R), scale_px_per_point=SC, columns=dict(centres=CX, w=BW), drops=[540.0, 360.0, 900.0],
                 values=dict(size=72, top="Z + drop + 22")),
        state_rows=[("C8-start.png", "114.50", "zero line ('0 = the market trend') + three column labels in secondary grey, no bars"),
                    ("C8-mid.png", "120.74", "labels 1-2 white, bars 1 and 2 down (540 / 360 px), '-30%' and 'about -20%'"),
                    ("C8-payoff.png", "123.36", "label 3 white, bar 3 down 900 px with the red glow, '-50%'")],
        geo_rows=[("Header", "h1 one line", "eyebrow 2 lines, h1 82 px **2 lines** 'Translation and' / 'writing work **fell**'"),
                  ("Zero line", "y392, x420-1580", "**y576, x236-1008**; '0 = the / market trend' right-aligned in the gutter x72 w148, 22 px"),
                  ("Scale", "9 px / point", "**18 px / point**: drops **540 / 360 / 900**"),
                  ("Columns", "centres 620 / 1000 / 1380, w260", "**centres 352 / 636 / 912, w190**"),
                  ("Column labels", "28 px, y300", "**28 px, two lines, w300 centred, top 472** (zero - 104)"),
                  ("Values", "64 px", "**72 px**, w300 centred, top = zero + drop + 22 (1138 / 958 / 1498)"),
                  ("Source", "one line", "**three lines**")],
        moves="Same three columns, narrower and twice as deep; the '0 = the market trend' key stays in a left gutter on the zero line.",
        cues=[("114.50", "(cover in)", "state start: zero line + three column labels in secondary grey, no bars"),
              ("117.16", "translation", "column 1 label brightens to white"),
              ("119.16", "fell", "bar 1 drops 0 to 540 px over 18f easeOutCubic; '-30%' fades in at 119.54"),
              ("120.24", "(unspoken, follows)", "column 2 label brightens; bar 2 drops 0 to 360 px over 15f; 'about -20%' at landing ~120.74"),
              ("121.86", "routine writing", "column 3 label brightens"),
              ("122.70", "fell", "bar 3 drops 0 to 900 px over 22f, gets the red glow; '-50%' at 123.36"),
              ("124.25", "(cover out)", "next cover BR-8")],
        guards="'one of a kind' never on screen; the label stays “About Us” page writing; 'about' stays on -20%. No em dashes on screen.")


# =====================================================================================================================
# C8-shift · total freelance demand went up
def c8shift():
    Z, SC = 1040, 9.0                               # ONE shared zero line, px per point (16:9: 6.4)
    FX, FW = [150, 322, 494], 120                   # FELL bar centres, width
    FELL = [("Translation<br>(Western)", 30, f"{MINUS}30%"), ("Translation<br>(other)", 20, f"{MINUS}20%"), ("&ldquo;About Us&rdquo;<br>writing", 50, f"{MINUS}50%")]
    MLX, MLW, MLH = 818, 220, 24 * SC

    def fr(s):
        h = orb(640, -360, 760, "rgba(0,230,138,.42)")
        h += HDR("Same study &middot; same year", 'Total freelance<br>demand went <span class="g">up</span>')
        h += (f'<svg class="layer"><line x1="{L}" y1="{Z}" x2="{R}" y2="{Z}" stroke="#3a4357" stroke-width="3"/>'
              f'<line x1="588" y1="430" x2="588" y2="1590" stroke="#1e2330" stroke-width="2" stroke-dasharray="4 8"/></svg>')
        h += A("left:72px;top:432px;font-size:24px;color:var(--accent-red)", "Fell", "cat", "fell-cat")
        h += A("left:628px;top:432px;font-size:24px;color:var(--accent-green)", "Grew", "cat", "grew-cat")
        for i, (lab, v, txt) in enumerate(FELL):
            cx, hh = FX[i], v * SC
            h += A(f"left:{cx - 86}px;top:{Z - 82}px;width:172px;text-align:center;font-family:'DM Sans';font-size:26px;font-weight:700;line-height:1.2;color:var(--text-secondary)",
                   lab, "half", f"fell{i + 1}-label")
            h += A(f"left:{cx - FW // 2}px;top:{Z}px;width:{FW}px;height:{n1(hh)}px;border-radius:0 0 8px 8px", "", "bar red half", f"fell{i + 1}-bar")
            inner = (f'<span style="font-family:\'DM Sans\';font-weight:500;font-size:24px;color:var(--text-secondary);margin-right:8px">about</span>{txt}' if i == 1 else txt)
            h += A(f"left:{cx - 100}px;top:{n1(Z + hh + 14)}px;width:200px;text-align:center;font-size:44px;color:var(--accent-red)", inner, "val half", f"fell{i + 1}-val")
        badge_cls = "card2" + (" off" if s == "start" else " glow-green" if s == "mid" else "")
        h += A("left:628px;top:500px;width:380px;height:190px;border-color:rgba(0,230,138,.45);text-align:center",
               '<div class="cat" style="margin-top:30px;font-size:19px;color:var(--text-secondary)">Total freelance demand</div>'
               '<div style="margin-top:22px;display:flex;align-items:center;justify-content:center;gap:20px"><svg width="62" height="54" viewBox="0 0 62 54"><polygon points="31,2 60,52 2,52" fill="#00e68a"/></svg>'
               '<span class="val" style="font-size:84px;color:var(--accent-green)">UP</span></div>', badge_cls, "badge")
        if s == "payoff":
            h += A(f"left:{MLX - MLW // 2}px;top:{n1(Z - MLH)}px;width:{MLW}px;height:{n1(MLH)}px;border-radius:8px 8px 0 0", "", "bar green glow-green", "ml-bar")
        h += A(f"left:{MLX - 180}px;top:{n1(Z - MLH - 20 - 80)}px;width:360px;text-align:center;font-size:80px;color:var(--accent-green)", "+24%", "val" + off(s != "payoff"), "ml-val")
        h += A(f"left:{MLX - 180}px;top:{Z + 22}px;width:360px;text-align:center;font-family:'DM Sans';font-size:30px;font-weight:700;line-height:1.2;color:var(--text-{'primary' if s == 'payoff' else 'secondary'})",
               "Machine-learning<br>work", "", "ml-label")
        h += SRC("Source: Teutloff et al., Journal of Economic Behavior<br>&amp; Organization, 2025 &middot; first year after ChatGPT &middot;<br>vs. the market trend")
        return h

    return dict(
        id="C8-shift", kind="charts", type="Type 1 ANIMATED", title="total freelance demand went up", states=["start", "mid", "payoff"], frame=fr,
        beat="CH2@132.40-139.56 (cover)", spoken="Here's the thing. Total freelance demand went up over that same year. It just moves away from them.",
        geo=dict(baseline=dict(y=Z, x1=L, x2=R, shared=True), scale_px_per_point=SC, separator=dict(x=588, y1=430, y2=1590),
                 fell=dict(centres=FX, w=FW, drops=[270.0, 180.0, 450.0], opacity=0.55), badge=dict(x=628, y=500, w=380, h=190),
                 ml=dict(x=MLX - MLW // 2, w=MLW, up=MLH, top=Z - MLH)),
        state_rows=[("C8-shift-start.png", "132.40", "FELL group (three red bars at their C8 values, 55% opacity) + empty GREW side"),
                    ("C8-shift-mid.png", "133.98", "+ TOTAL FREELANCE DEMAND badge with ▲ UP, green glow"),
                    ("C8-shift-payoff.png", "137.54", "+ machine-learning bar up 216 px, '+24%'; badge glow eased off")],
        geo_rows=[("Header", "h1 one line", "h1 82 px **2 lines** 'Total freelance' / 'demand went **up**'"),
                  ("Split", "FELL left of a vertical dashed rule x850, GREW right", "**same split, narrower: rule x588 (y430-1590); FELL x72-572, GREW x628-1008**"),
                  ("Zero line", "y572, x160-1780, shared", "**y1040, x72-1008, still ONE shared line** (one scale for fell and grew)"),
                  ("Scale", "6.4 px / point", "**9 px / point**: FELL 270 / 180 / 450, ML +216"),
                  ("FELL bars", "centres 300/500/700 w150", "**centres 150 / 322 / 494, w120**; labels 26 px 2 lines above the line, values 44 px under each bar"),
                  ("Badge", "x900 y372 400x168", "**x628 y500 380x190**; cat 19 px, ▲ 62x54, UP 84 px"),
                  ("ML bar", "x1410 w220 up 153.6", "**x708 w220 up 216 (top 824)**; '+24%' 80 px at top 724; label 30 px under the line (y1062)"),
                  ("Source", "one line", "**three lines**")],
        moves="The fell/grew split keeps its left/right logic and its single shared zero line; the line drops to y1040 so the GREW side stacks badge over bar in the tall right column, and the FELL bars hang below the line on the left.",
        cues=[("132.40", "(cover in)", "state start: FELL group (three red bars at their C8 values, 55% opacity) + empty GREW side"),
              ("133.98", "Total", "the TOTAL FREELANCE DEMAND badge fades + rises 16px (12f)"),
              ("135.72", "up", "triangle + 'UP' pop (scale .8 to 1, 10f), badge gets the green glow"),
              ("137.54", "It just moves away", "machine-learning bar rises 0 to 216 px over 20f; '+24%' rides 20 px above the bar top and counts 0 to 24 landing ~138.2; label brightens; badge glow eases off; FELL bars stay down"),
              ("139.56", "(cover out)", "FACE-3")],
        guards="total demand is a direction badge, never a bar: DATA.md has no figure for it. No em dashes on screen.")


# =====================================================================================================================
# C11-count · 129 to 211 robots
def c11count():
    COLS, SQ, P = 16, 46, 56
    GW = COLS * P - (P - SQ)                        # 886
    X0, Y0 = L + (936 - GW) // 2, 702               # 97, 702
    N0, N1 = 129, 211
    rows = (N1 + COLS - 1) // COLS                  # 14

    def sq(i):
        return X0 + (i % COLS) * P, Y0 + (i // COLS) * P

    def fr(s):
        h = orb(600, -360, 760, "rgba(0,194,255,.50)")
        h += HDR("HD Hyundai shipyards &middot;<br>industrial and collaborative robots", 'The robot count<br>is <span class="c">climbing</span>')
        h += A("left:72px;top:452px;width:300px", '<div class="val" style="font-size:150px;color:var(--text-secondary)">129</div><div class="lbl" style="margin-top:6px">robots</div>', "", "count-129")
        h += A("left:376px;top:500px", '<svg width="124" height="44" viewBox="0 0 124 44"><path d="M4 22 H116 M100 7 L118 22 L100 37" stroke="#00c2ff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
               off(s == "start").strip(), "arrow")
        h += A("left:534px;top:452px;width:300px", '<div class="val" style="font-size:150px;color:var(--accent-cyan);text-shadow:0 0 50px rgba(0,194,255,.35)">211</div><div class="lbl" style="margin-top:6px">robots</div>',
               off(s != "payoff").strip(), "count-211")
        g = ['<svg class="layer"><defs><filter id="gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/>'
             '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>']
        for i in range(N0):
            x, y = sq(i)
            g.append(f'<rect x="{x}" y="{y}" width="{SQ}" height="{SQ}" rx="9" fill="#c9cfdb" fill-opacity=".62"/>')
        for i in range(N0, N1):
            x, y = sq(i)
            if s == "mid":
                g.append(f'<rect x="{x + 1.5}" y="{y + 1.5}" width="{SQ - 3}" height="{SQ - 3}" rx="8" fill="none" stroke="#00c2ff" stroke-opacity=".55" stroke-width="2" stroke-dasharray="5 4"/>')
            elif s == "payoff":
                g.append(f'<rect x="{x}" y="{y}" width="{SQ}" height="{SQ}" rx="9" fill="#00c2ff" filter="url(#gl)"/>')
        g.append("</svg>")
        h += "".join(g)
        h += A(f"left:{X0}px;top:1512px;font-family:'DM Sans';font-size:40px;font-weight:700;color:var(--text-primary);white-space:nowrap",
               "mostly for cutting and welding steel", off(s != "payoff").strip(), "caption")
        h += A(f"left:{X0}px;top:1584px;font-family:'DM Sans';font-size:26px;color:var(--text-muted);white-space:nowrap",
               '<span style="display:inline-block;width:20px;height:20px;border-radius:5px;background:#c9cfdb;opacity:.62;vertical-align:-2px;margin-right:12px"></span>one square = one robot',
               "", "legend")
        h += SRC("Source: BusinessKorea via Cyprus Shipping News, Feb 27, 2026 &middot;<br>HD Hyundai shipbuilding affiliates &middot; arms and cobots, not humanoids")
        return h

    return dict(
        id="C11-count", kind="charts", type="Type 1 ANIMATED", title="129 to 211 robots", states=["start", "mid", "payoff"], frame=fr,
        beat="CH3@168.90-173.95 (cover)", spoken="went from 129 of these robots to 211, mostly for cutting and welding steel.",
        geo=dict(grid=dict(columns=COLS, rows=rows, square=SQ, rx=9, pitch=P, x0=X0, y0=Y0, order="reading order, index i -> col i%16, row i//16",
                           grey="robots 1-129 = rows 0-7 + the first square of row 8", cyan="robots 130-211 = row 8 col 1 to row 13 col 2"),
                 slot=dict(inset=1.5, size=SQ - 3, rx=8), counters=dict(c129=dict(x=72, y=452), arrow=dict(x=376, y=500), c211=dict(x=534, y=452))),
        state_rows=[("C11-count-start.png", "168.90", "'129 robots' + 129 grey squares; arrow, '211' and the caption held back"),
                    ("C11-count-mid.png", "170.28", "+ the right-pointing arrow + 82 dashed cyan slots"),
                    ("C11-count-payoff.png", "171.08", "slots filled cyan with glow, '211 robots', caption 'mostly for cutting and welding steel'")],
        geo_rows=[("Header", "eyebrow 1 line, h1 one line", "eyebrow **2 lines**, h1 82 px **2 lines** 'The robot count' / 'is **climbing**'"),
                  ("Counters", "129 over 211 in a left column, DOWN arrow between", "**129 -> 211 side by side in one row (y452)**, a RIGHT arrow (124x44 at x376 y500) between; 150 px numbers, 'robots' 32 px under each"),
                  ("Grid", "25 columns x 9 rows, square 31, pitch 43, origin x690 y350", f"**16 columns x {rows} rows, square 46 (rx 9), pitch 56, origin x{X0} y{Y0}** (886 x 774)"),
                  ("Grey / cyan split", "rows 0-4 + 4", "**rows 0-7 + 1 grey (129), cyan from row 8 col 1 through row 13 col 2 (82)**"),
                  ("Slot", "28x28 inset 1.5", "**43x43 inset 1.5, rx 8**, dash 5 4, cyan .55"),
                  ("Caption", "40 px? (38) right of grid x690 y763", f"**40 px under the grid, x{X0} y1512**"),
                  ("Legend", "right-aligned on the caption line", f"**under the caption, x{X0} y1584, 26 px**"),
                  ("Source", "one line", "**two lines**")],
        moves="The waffle goes from a wide 25 x 9 block to a tall 16 x 14 block; the two counters move from a stacked column to a row above it (so the down arrow becomes a right arrow).",
        cues=[("168.90", "(cover in)", "129 grey squares pop in row by row over 14f (8 full rows + 1; lands by 169.34 '129'); '129' shown"),
              ("170.28", "these robots to", "82 dashed cyan slots outline in (10f) + the right arrow draws left to right"),
              ("171.08", "211", "slots fill cyan in reading order over 24f; counter '211' (integers 129 to 211) lands ~171.88"),
              ("172.02", "mostly", "'mostly for cutting and welding steel' fades in"),
              ("173.95", "(cover out)", "next cover BR-14")],
        guards="no period on screen (DATA.md states none); no 'in a year'; arms and cobots, not humanoids. No em dashes on screen.")


# =====================================================================================================================
# C12 · welding workforce gap
def c12():
    FULL = 936.0
    G = round(FULL * 320500 / 350000, 1)            # 857.1 (shared scale 350,000)
    Rr = round(FULL * 157000 / 350000, 1)           # 419.9
    T1, T2 = 590, 1046

    def row(y, num, color, label, sub, fill_cls, fill_w, on, bar_on, g):
        h = A(f"left:66px;top:{y}px;white-space:nowrap", f'<span class="val" style="font-size:144px;color:{color}">{num}</span>', off(not on).strip(), f"{g}-num")
        h += A(f"left:72px;top:{y + 166}px;white-space:nowrap",
               f'<div style="font-family:\'DM Sans\';font-size:36px;font-weight:700;color:var(--text-primary);line-height:1.2">{label}</div>'
               f'<div style="font-family:\'DM Sans\';font-size:28px;color:var(--text-muted);margin-top:6px">{sub}</div>', off(not on).strip(), f"{g}-label")
        h += A(f"left:72px;top:{y + 278}px;width:{FULL:.0f}px;height:72px;border-radius:12px;background:#141821;border:1px solid var(--border)", "", "", f"{g}-track")
        if bar_on:
            h += A(f"left:72px;top:{y + 278}px;width:{fill_w}px;height:72px;border-radius:12px", "", fill_cls, f"{g}-fill")
        return h

    def fr(s):
        h = orb(620, -360, 760, "rgba(255,215,0,.32)")
        h += HDR("US welding workforce", 'The industry cannot<br>find <span class="go">the people</span>')
        h += row(T1, "320,500", "var(--accent-gold)", 'new welding professionals needed by <span class="mono">2029</span>', "projected",
                 "bar gold glow-gold", G, s != "start", s != "start", "row1")
        h += row(T2, "157,000+", "var(--accent-red)", "welding professionals approaching retirement", 'more than <span class="mono">157,000</span>',
                 "bar hred glow-red", Rr, s == "payoff", s == "payoff", "row2")
        h += SRC("Source: weldingworkforcedata.com (Lightcast data, endorsed by<br>the American Welding Society) &middot; both bars on one scale")
        return h

    return dict(
        id="C12", kind="charts", type="Type 1 ANIMATED", title="welding workforce gap", states=["start", "mid", "payoff"], frame=fr,
        beat="CH3@177.95-187.20 (cover)", spoken="The US is projected to need over 320,000 new welding professionals by 2029 and more than 157,000 [are getting close to retirement]",
        geo=dict(scale="936 px = 350,000 (shared)", bar1=dict(x=72, y=T1 + 278, w=G, h=72, color="gold"), bar2=dict(x=72, y=T2 + 278, w=Rr, h=72, color="red"),
                 numbers=dict(size=144, row1=dict(x=66, y=T1), row2=dict(x=66, y=T2), anchor="left")),
        state_rows=[("C12-start.png", "177.95", "header + two faint empty tracks"),
                    ("C12-mid.png", "182.04", "row 1: '320,500' / 'new welding professionals needed by 2029' / 'projected' + gold bar 857.1 px"),
                    ("C12-payoff.png", "186.72", "row 2: '157,000+' / 'welding professionals approaching retirement' / 'more than 157,000' + red bar 419.9 px")],
        geo_rows=[("Header", "h1 one line", "h1 82 px **2 lines** 'The industry cannot' / 'find **the people**'"),
                  ("Row layout", "number left (112 px) with the label to its right, bar under", "**number on its own line (144 px, x66), label + sub under it (36 / 28 px), bar under that**"),
                  ("Row tops", "326 / 646", f"**{T1} / {T2}** (label = top + 166, bar = top + 278)"),
                  ("Track", "x140 w1300 h56", "**x72 w936 h72**, r12"),
                  ("Fills", "1190.4 / 583.1 of 1300", f"**{G} / {Rr} of 936** (shared 350,000 scale)"),
                  ("Source", "one line", "**two lines**")],
        moves="Each row restacks: the number gets its own line, the label wraps under it, the bar runs the full 936 px width.",
        cues=[("177.95", "(cover in)", "state start: header + two faint empty tracks"),
              ("179.02", "projected", "row 1 label 'new welding professionals needed by 2029 / projected' fades in"),
              ("180.62", "320", f"gold bar grows 0 to {G} px over 42f with the counter 0 to 320,500 (easeOutQuart, left-anchored), landing 182.02 ('new' 182.04)"),
              ("184.70", "and", "row 2 label fades in"),
              ("185.58", "157", f"red bar grows 0 to {Rr} px over 34f, counter to 157,000 landing 186.72; the '+' fades in on landing"),
              ("187.20", "(cover out)", "next cover C13 receipt")],
        guards="never on one card with BLS 437,700; two separate rows, no part-of-whole nesting; 'projected' stays on 320,500. No em dashes on screen.")


# =====================================================================================================================
# C21 · 1.6 million maintenance workers
def c21():
    def fr(s):
        h = orb(380, 1150, 880, "rgba(0,194,255,.42)")
        h += A("left:72px;top:440px;margin:0;line-height:1.45", "BLS Occupational<br>Outlook Handbook &middot; 2025", "ey", "eyebrow")
        h += A("left:58px;top:540px;white-space:nowrap",
               '<div class="val" style="font-size:340px;color:var(--accent-cyan);letter-spacing:-.02em;text-shadow:0 0 60px rgba(0,194,255,.28)">1.6</div>'
               '<div class="val" style="font-size:120px;font-weight:400;color:var(--text-secondary);letter-spacing:.06em;margin:8px 0 0 14px">MILLION</div>',
               off(s == "start").strip(), "number")
        h += A("left:72px;top:1060px;font-family:'Playfair Display',serif;font-weight:700;font-size:64px;line-height:1.1;color:var(--text-primary);white-space:nowrap",
               "general maintenance and<br>repair workers, US", "", "line")
        h += A("left:72px;top:1220px;font-size:32px;font-weight:400;color:var(--text-muted)", "1,621,800 jobs in 2025", "val" + off(s == "start"), "jobs-2025")
        h += A("left:72px;top:1282px;margin:0", "", "divider", "divider")
        h += A("left:72px;top:1330px;white-space:normal;line-height:1.25;font-size:40px",
               'about <span class="mono c">148,700</span> openings a year<div style="font-weight:500;font-size:28px;color:var(--text-muted);margin-top:8px">projected, <span class="mono">2025</span> to <span class="mono">2035</span></div>',
               "chip" + off(s != "payoff"), "chip")
        h += SRC("Source: U.S. Bureau of Labor Statistics, Occupational Outlook Handbook,<br>General Maintenance and Repair Workers (Oct 29, 2026)")
        return h

    return dict(
        id="C21", kind="charts", type="Type 1 ANIMATED", title="1.6 million maintenance workers", states=["start", "mid", "payoff"], frame=fr,
        beat="CH3@275.75-281.10 (cover)", spoken="Now the maintenance worker in the US around 1.6 million people do this job",
        geo=dict(number=dict(x=58, y=540, size=340, million_size=120), chip=dict(x=72, y=1330)),
        state_rows=[("C21-start.png", "275.75", "eyebrow + 'general maintenance and / repair workers, US', number slot empty"),
                    ("C21-mid.png", "279.68", "+ '1.6 / MILLION' + '1,621,800 jobs in 2025'"),
                    ("C21-payoff.png", "279.92", "+ chip 'about 148,700 openings a year / projected, 2025 to 2035'")],
        geo_rows=[("Eyebrow", "one line y236", "**two lines y440**"),
                  ("Number", "'1.6' 250 px + 'MILLION' 112 px on one line", "**STACKED: '1.6' 340 px over 'MILLION' 120 px**, one wrapper x58 y540"),
                  ("Line", "Playfair 700 62 px one line y584", "**64 px, two lines** 'general maintenance and' / 'repair workers, US', y1060"),
                  ("Jobs line", "30 px y672", "**32 px y1220**"),
                  ("Divider", "y728", "**y1282**"),
                  ("Chip", "one line y774, 38 px + 26 px tail", "**two lines y1330**: 'about 148,700 openings a year' 40 px / 'projected, 2025 to 2035' 28 px"),
                  ("Source", "one line", "**two lines**")],
        moves="Same stacked-number move as C10 (its twin card); the chip's 'projected' tail drops to a second line.",
        cues=[("275.75", "(cover in)", "state start: eyebrow + 'general maintenance and repair workers, US', number slot empty"),
              ("278.20", "around", "counter 0.0 to 1.6 (one decimal) + 'MILLION' over 44f easeOutQuart, landing 279.68 ('million'); '1,621,800 jobs in 2025' fades on landing"),
              ("279.92", "people do this job", "chip slides in 24px from the left + fades (10f)"),
              ("281.10", "(cover out)", "next cover C22 receipt")],
        guards="'around' 1.6 million on screen as 1.6 MILLION with the exact 1,621,800 under it; the chip says 'about' and 'projected'. No em dashes on screen.")


# =====================================================================================================================
# C32 · 70% say AI will cut jobs, 30% worry about their own
def c32():
    Z0, Z100 = 1360, 560
    SC = (Z0 - Z100) / 100                          # 8 px per point
    BARS = [("red", 380, 70, "var(--accent-red)", "say AI will<br>cut jobs", "US adults"),
            ("cyan", 800, 30, "var(--accent-cyan)", "worry about<br>their own job", "adults with a job")]
    BW = 300

    def fr(s):
        h = orb(600, -360, 760, "rgba(0,194,255,.45)")
        h += HDR("One poll &middot; March 2026", 'It will happen to<br><span class="c">somebody else</span>')
        h += (f'<svg class="layer"><line x1="176" y1="{Z100}" x2="{R}" y2="{Z100}" stroke="#1e2330" stroke-width="2" stroke-dasharray="4 8"/>'
              f'<line x1="176" y1="{Z0}" x2="{R}" y2="{Z0}" stroke="#3a4357" stroke-width="3"/></svg>')
        h += A(f"left:72px;top:{Z100 - 13}px;width:92px;text-align:right;font-size:26px;color:var(--text-muted)", "100%", "val", "tick-100")
        h += A(f"left:72px;top:{Z0 - 13}px;width:92px;text-align:right;font-size:26px;color:var(--text-muted)", "0%", "val", "tick-0")
        for k, (c, cx, v, col, lab, sub) in enumerate(BARS):
            on = s != "start" if k == 0 else s == "payoff"
            hh = v * SC
            if on:
                glow = (k == 0 and s == "mid") or (k == 1 and s == "payoff")
                h += A(f"left:{cx - BW // 2}px;top:{n1(Z0 - hh)}px;width:{BW}px;height:{n1(hh)}px;border-radius:10px 10px 0 0", "",
                       f"bar {c}" + (f" glow-{c}" if glow else ""), f"bar-{c}")
            h += A(f"left:{cx - 220}px;top:{n1(Z0 - hh - 22 - 112)}px;width:440px;text-align:center;font-size:112px;color:{col}", f"{v}%", "val" + off(not on), f"val-{c}")
            h += A(f"left:{cx - 210}px;top:{Z0 + 24}px;width:420px;text-align:center;line-height:1.15",
                   f'<div style="font-family:\'DM Sans\';font-size:38px;font-weight:700;color:var(--text-primary)">{lab}</div>'
                   f'<div style="font-family:\'DM Sans\';font-size:27px;color:var(--text-muted);margin-top:8px">{sub}</div>', off(not on).strip(), f"label-{c}")
        h += SRC("Source: Quinnipiac University Poll, March 30, 2026 &middot;<br>1,397 US adults; own-job question: 800 employed adults,<br>very or somewhat concerned")
        return h

    return dict(
        id="C32", kind="charts", type="Type 1 ANIMATED", title="70% say AI will cut jobs, 30% worry about their own", states=["start", "mid", "payoff"], frame=fr,
        beat="CH4@385.72-394.47 (cover, the chapter's centerpiece)", spoken="In one poll in March, 70% of Americans said AI will cut jobs. But only 30% of these people with a job were worried about their own.",
        geo=dict(axis=dict(y0=Z0, y100=Z100, px_per_point=SC, x1=176, x2=R), bars=dict(w=BW, red=dict(centre=380, h=560.0), cyan=dict(centre=800, h=240.0)),
                 values=dict(size=112, top="Z0 - h - 134")),
        state_rows=[("C32-start.png", "385.72", "0% and 100% lines, two empty slots"),
                    ("C32-mid.png", "388.41", "+ red bar 560 px (glow), '70%', 'say AI will / cut jobs' + 'US adults'"),
                    ("C32-payoff.png", "391.79", "+ cyan bar 240 px, '30%', 'worry about / their own job' + 'adults with a job'; the glow moved to cyan")],
        geo_rows=[("Header", "h1 one line", "h1 82 px **2 lines** 'It will happen to' / '**somebody else**'"),
                  ("Axis", "0% y862, 100% y362 (5 px / point), x560-1420", "**0% y1360, 100% y560 (8 px / point), x176-1008**; tick labels 26 px right-aligned x72 w92"),
                  ("Bars", "w280, centres 770 / 1230", "**w300, centres 380 / 800**; heights **560 / 240**"),
                  ("Values", "88 px", "**112 px**, w440 centred, top = bar top - 22 - 112 (666 / 986)"),
                  ("Labels", "33 px one line + 24 px", "**38 px two lines + 27 px**, w420 centred, top 1384"),
                  ("Source", "one line", "**three lines**")],
        moves="The plot simply goes taller (8 px per point); the two bar labels wrap to two lines each so they never touch.",
        cues=[("385.72", "(cover in)", "state start: 0% and 100% lines, two empty slots"),
              ("387.61", "70", "red bar grows 0 to 560 px over 24f easeOutCubic, '70%' counts with it and rides 22 px above the bar top, landing 388.41; label fades in at 388.73"),
              ("391.19", "30", "cyan bar grows 0 to 240 px over 18f, '30%' lands 391.79; label at 391.95; red glow eases off, cyan takes the glow at 393.27 ('worried')"),
              ("394.47", "(cover out)", "C33 (same family: a quick cross-fade reads as the chart narrowing to blue-collar)")],
        guards="'worry', never 'think their job is safe'; the two bars are two questions to two samples (the source line says so). No em dashes on screen.")


# =====================================================================================================================
# C33 · blue-collar about 3 in 4 / about 3 in 4
def c33():
    PT, PH = [452, 1000], 506
    FX = [180, 380, 580, 780]                       # figure lefts (120 wide, pitch 200)
    FIG_Y = 44
    PATH = "M6 196 L6 144 C6 106 30 84 60 84 C90 84 114 106 114 144 L114 196 Z"
    PANELS = [("#ff4060", "255,64,96", "gr", "say AI will cut jobs"), ("#00c2ff", "0,194,255", "gc", "are not worried about theirs")]

    def fr(s):
        h = orb(600, -360, 760, "rgba(0,194,255,.42)")
        h += HDR("Blue-collar workers &middot; same poll", 'Blue-collar workers<br>show it <span class="c">the most</span>')
        lit = [s != "start", s == "payoff"]
        for k, (hexc, rgb, fid, stmt) in enumerate(PANELS):
            y = PT[k]
            border = f"border-color:rgba({rgb},.55);box-shadow:0 0 50px rgba({rgb},.14);" if lit[k] else "border-color:var(--border);"
            h += A(f"left:72px;top:{y}px;width:936px;height:{PH}px;{border}", "", "card2", f"panel{k + 1}")
            h += A(f"left:72px;top:{y + 268}px;width:936px;text-align:center;white-space:nowrap",
                   f'<span style="font-family:\'DM Sans\';font-size:36px;font-weight:500;color:var(--text-secondary);margin-right:16px">about</span>'
                   f'<span class="val" style="font-size:104px;color:{hexc}">3</span><span style="font-family:DM Sans;font-size:60px;font-weight:700;color:{hexc};margin:0 18px">in</span>'
                   f'<span class="val" style="font-size:104px;color:{hexc}">4</span>', off(not lit[k]).strip(), f"ratio{k + 1}")
            h += A(f"left:72px;top:{y + 404}px;width:936px;text-align:center;font-family:'DM Sans';font-size:42px;font-weight:700;color:var(--text-primary);white-space:nowrap",
                   stmt, off(not lit[k]).strip(), f"statement{k + 1}")
        g = ['<svg class="layer"><defs>'
             '<filter id="gr" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
             '<filter id="gc" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>']
        for k, (hexc, rgb, fid, stmt) in enumerate(PANELS):
            for j, x in enumerate(FX):
                y = PT[k] + FIG_Y
                if lit[k] and j < 3:
                    g.append(f'<g transform="translate({x},{y})" filter="url(#{fid})"><circle cx="60.0" cy="38" r="34" fill="{hexc}"/><path d="{PATH}" fill="{hexc}"/></g>')
                else:
                    g.append(f'<g transform="translate({x},{y})"><circle cx="60.0" cy="38" r="34" fill="#161a23" stroke="#2a3142" stroke-width="2.5"/>'
                             f'<path d="{PATH}" fill="#161a23" stroke="#2a3142" stroke-width="2.5"/></g>')
        g.append("</svg>")
        h += "".join(g)
        h += SRC("Source: Quinnipiac University Poll, March 2026, crosstab:<br>blue-collar workers (about 270 people) &middot; rounded on purpose")
        return h

    return dict(
        id="C33", kind="charts", type="Type 1 ANIMATED", title="blue-collar about 3 in 4 / about 3 in 4", states=["start", "mid", "payoff"], frame=fr,
        beat="CH4@394.47-403.41 (cover; C33 holds to 402.23, then CLIP-42's first frame as the lead-in still)",
        spoken="Blue collar workers show it the most. Around three in four expect AI to cut jobs and three in four are not worried about theirs. Here's what it sounds like.",
        geo=dict(panels=[dict(x=72, y=PT[0], w=936, h=PH, colour="red"), dict(x=72, y=PT[1], w=936, h=PH, colour="cyan")],
                 figures=dict(size=[120, 196], lefts=FX, top="panel top + 44", path=PATH), ratio_top="panel top + 268", statement_top="panel top + 404"),
        state_rows=[("C33-start.png", "394.47", "two panels, eight dim figures, no labels"),
                    ("C33-mid.png", "397.83", "top panel: figures 1-3 red with glow, border red, 'about 3 in 4' + 'say AI will cut jobs'"),
                    ("C33-payoff.png", "400.69", "bottom panel: figures 1-3 cyan, border cyan, 'about 3 in 4' + 'are not worried about theirs'")],
        geo_rows=[("Header", "h1 one line", "h1 82 px **2 lines** 'Blue-collar workers' / 'show it **the most**'"),
                  ("Panels", "side by side: x140 / x1000, y300, 780x600", f"**STACKED: x72 w936 h{PH}, tops {PT[0]} / {PT[1]}** (red on top, cyan below: the reading order of the VO)"),
                  ("Figures", "4 per panel, 120x196, pitch 164, top y350", "**4 per panel, 120x196 (same path), pitch 200, lefts 180 / 380 / 580 / 780, top = panel + 44**"),
                  ("'about 3 in 4'", "34 / 96 / 56 px, panel + 304", "**36 / 104 / 60 px, panel + 268**"),
                  ("Statement", "38 px, panel + 442", "**42 px, panel + 404**"),
                  ("Source", "one line", "**two lines**")],
        moves="The A-vs-B pair goes from side by side to stacked, top then bottom, which is also the order he says them in.",
        cues=[("394.47", "(cover in)", "state start: two panels, eight dim figures, no labels"),
              ("396.95", "three in four", "top-panel figures 1 to 3 light red one by one, 5f apart (pop scale .9 to 1); panel border goes red"),
              ("397.83", "expect", "'about 3 in 4' + 'say AI will cut jobs' fade up 12px (12f)"),
              ("399.99", "three in four", "bottom-panel figures 1 to 3 light cyan one by one; panel border cyan"),
              ("400.69", "are not worried", "'about 3 in 4' + 'are not worried about theirs' fade up"),
              ("402.23", "Here's what it sounds like.", "out: CLIP-42's first frame (S-still) takes over")],
        guards="never a decimal (73, 76): 'about 3 in 4' only. Two separate groups of four, not the same four people (the data is not per person). No em dashes on screen.")


# =====================================================================================================================
# C36 · guessed 30% vs measured 75%
def c36():
    TX, Y0, Y100 = 330, 1420, 580
    SC = (Y0 - Y100) / 100                          # 8.4 px per point
    yv = lambda v: Y0 - SC * v
    YG, YM = yv(30), yv(75)                         # 1168, 790
    VX = 430

    def fr(s):
        h = orb(600, -360, 760, "rgba(255,64,96,.46)")
        h += HDR("One study &middot; Germany, 2022", 'Workers in the most<br><span class="re">automatable</span> jobs')
        g = [f'<svg class="layer"><defs><linearGradient id="gap" gradientUnits="userSpaceOnUse" x1="0" y1="{n1(YG)}" x2="0" y2="{n1(YM)}">'
             '<stop offset="0" stop-color="#00c2ff" stop-opacity=".85"/><stop offset="1" stop-color="#ff4060" stop-opacity=".85"/></linearGradient>'
             '<filter id="g36" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>',
             f'<line x1="{TX}" y1="{Y100}" x2="{TX}" y2="{Y0}" stroke="#1e2330" stroke-width="14" stroke-linecap="round"/>']
        for v in (0, 25, 50, 75, 100):
            g.append(f'<line x1="{TX - 68}" y1="{n1(yv(v))}" x2="{TX - 56}" y2="{n1(yv(v))}" stroke="#3a4357" stroke-width="2"/>')
        if s == "payoff":
            g.append(f'<line x1="{TX}" y1="{n1(YG)}" x2="{TX}" y2="{n1(YM)}" stroke="url(#gap)" stroke-width="14"/>')
        if s != "start":
            g.append(f'<circle cx="{TX}" cy="{n1(YG)}" r="44" fill="rgba(0,194,255,.18)"/><circle cx="{TX}" cy="{n1(YG)}" r="24" fill="#00c2ff" filter="url(#g36)"/>')
        if s == "payoff":
            g.append(f'<circle cx="{TX}" cy="{n1(YM)}" r="44" fill="rgba(255,64,96,.18)"/><circle cx="{TX}" cy="{n1(YM)}" r="24" fill="#ff4060" filter="url(#g36)"/>')
        g.append("</svg>")
        h += "".join(g)
        for v in (0, 25, 50, 75, 100):
            h += A(f"left:72px;top:{n1(yv(v) - 13)}px;width:172px;text-align:right;font-size:26px;color:var(--text-muted)", f"{v}%", "val", f"tick-{v}")
        h += A(f"left:{VX}px;top:{n1(YM - 66)}px;width:560px",
               '<div class="val" style="font-size:124px;color:var(--accent-red)">75%</div>'
               '<div style="font-family:\'DM Sans\';font-size:42px;font-weight:700;color:var(--text-primary);margin-top:12px;white-space:nowrap">what was measured</div>',
               off(s != "payoff").strip(), "measured")
        h += A(f"left:{VX}px;top:{n1(YG - 66)}px;width:560px",
               '<div class="val" style="font-size:124px;color:var(--accent-cyan)">30%</div>'
               '<div style="font-family:\'DM Sans\';font-size:42px;font-weight:700;color:var(--text-primary);margin-top:12px;white-space:nowrap">what they guessed</div>',
               off(s == "start").strip(), "guessed")
        h += A(f"left:{VX}px;top:{n1((YG + YM) / 2 - 2)}px;font-size:32px;color:var(--text-primary)", "45-point gap", "val" + off(s != "payoff"), "gap")
        h += A(f"left:72px;top:1478px;width:936px;font-family:'DM Sans';font-size:30px;line-height:1.35;color:var(--text-secondary)",
               'share of their job’s core tasks a machine could do,<br>with the technology of <span class="mono">2019</span>', "", "axis-caption")
        h += SRC("Source: Lergetporer, Wedel, Werner, IZA DP 16687 &middot;<br>3,012 employed people, May/June 2022 &middot; medians &middot;<br>tasks, not job loss")
        return h

    return dict(
        id="C36", kind="charts", type="Type 1 ANIMATED", title="guessed 30% vs measured 75%", states=["start", "mid", "payoff"], frame=fr,
        beat="CH4@419.47-428.27 (cover)",
        spoken="Workers in the jobs most exposed to automation guessed that about 30% of their work could be done by a machine. The measured figure was 75.",
        geo=dict(axis=dict(x=TX, y0=Y0, y100=Y100, px_per_point=SC, orientation="vertical, 0% at the bottom"), guessed=dict(y=YG), measured=dict(y=YM),
                 markers=dict(halo_r=44, core_r=24), labels=dict(x=VX, value_size=124, statement_size=42, top="marker y - 66"), gap_label_top=(YG + YM) / 2 - 2),
        state_rows=[("C36-start.png", "419.47", "the vertical 0-100% gauge, ticks, axis caption"),
                    ("C36-mid.png", "423.03", "+ cyan marker on 30% (y1168), '30%' + 'what they guessed'"),
                    ("C36-payoff.png", "427.49", "+ gradient segment 30 -> 75 (cyan to red), red marker on 75% (y790), '75%' + 'what was measured', '45-point gap'")],
        geo_rows=[("Header", "h1 one line", "h1 82 px **2 lines** 'Workers in the most' / '**automatable** jobs'"),
                  ("Track", "HORIZONTAL x260 (0%) to x1660 (100%), y676, 14 px per point", f"**VERTICAL x{TX}, y{Y0} (0%) up to y{Y100} (100%), {SC:.1f} px per point**, 14 px wide, round caps"),
                  ("Ticks", "under the track, labels below", f"**left of the track (x{TX - 68}-{TX - 56}), labels right-aligned x72 w172, 26 px, centred on each tick**"),
                  ("Markers", "x680 / x1310, halo r44 + core r24", f"**y{YG:.0f} (30%) / y{YM:.0f} (75%), halo r44 + core r24** (as the 16:9)"),
                  ("Value blocks", "centred above the markers, 100 px + 34 px", f"**right of the track at x{VX}, vertically centred on each marker: value 124 px + statement 42 px**"),
                  ("Gap label", "centred above the segment, 28 px", f"**x{VX}, y{(YG + YM) / 2 - 2:.0f}, 32 px**, between the two value blocks, level with the segment's middle"),
                  ("Axis caption", "one line under the track, 27 px", "**two lines, x72 y1478, 30 px**"),
                  ("Source", "one line", "**three lines**")],
        moves="The 0-100% race lane turns into a vertical gauge (a column), 0% at the bottom; guessed and measured read upward, and the gap is the climb between them.",
        cues=[("419.47", "(cover in)", "state start: the vertical 0-100% gauge, ticks, axis caption"),
              ("422.17", "guessed", "cyan marker drops onto 30% (scale 1.4 to 1 + fade, 12f); '30%' + 'what they guessed' fade up at 423.03 ('30')"),
              ("426.51", "The measured figure", f"the gradient segment extends UP from 30% (y{YG:.0f}) toward 75% (y{YM:.0f}) over 30f easeInOutCubic, with the red marker riding its tip"),
              ("427.49", "75.", "red marker lands at 75%, '75%' + 'what was measured' + '45-point gap' fade in (8f)"),
              ("428.27", "(cover out)", "S5 (translator still)")],
        guards="tasks, never job loss; 'Germany, 2022' on screen; payoff holds only 0.78 s before the cut, so the segment starts at 'measured'. No em dashes on screen.")


# =====================================================================================================================
# C11 (diagram) · who actually welds today
def c11():
    SX = [260, 560, 860]                            # PROTOTYPE / PILOTS / IN PRODUCTION
    CT, CH = [508, 856, 1204], 150
    RAIL = [t + CH + 84 for t in CT]                # 742 / 1090 / 1438
    RX0, RX1 = 100, 980
    LANES = [("Fixed arms and cobots", "already welding in shipyards and factories", "green", "0,230,138", 2, "IN PRODUCTION"),
             ("Humanoid, moving parts and totes", 'Figure 02 at BMW (<span class="mono">11</span> months, ended) &middot; Digit at GXO', "gold", "255,215,0", 1, "PILOTS: BMW, GXO"),
             ("Humanoid welder", "Persona AI with HD Hyundai, learning to weld", "cyan", "0,194,255", 0, "PROTOTYPE")]
    FILTER = ('<defs><filter id="g11" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><feGaussianBlur stdDeviation="5" result="b"/>'
              '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>')

    def fr(s):
        nlit = {"start": 0, "lane1": 1, "lane2": 2, "lane3": 3, "payoff": 3}[s]
        h = orb(640, -360, 760, "rgba(0,230,138,.40)")
        h += HDR("Welding &middot; where it actually stands", 'Who actually<br><span class="g">welds</span> today')
        for i, nm in enumerate(["PROTOTYPE", "PILOTS", "IN PRODUCTION"]):
            h += A(f"left:{SX[i] - 150}px;top:432px;width:300px;text-align:center;color:var(--text-secondary)", nm, "cat", f"stage-{i + 1}")
        # stage guides: drawn only in the gaps between cards, so dim (.3) cards never show them through
        segs = [(470, CT[0] - 10)] + [(CT[i] + CH + 10, CT[i + 1] - 10) for i in range(2)] + [(CT[2] + CH + 10, RAIL[2] + 76)]
        gl = "".join(f'<line x1="{x}" y1="{a}" x2="{x}" y2="{b}" stroke="#1e2330" stroke-width="2" stroke-dasharray="4 8"/>' for x in SX for a, b in segs)
        h += f'<svg class="layer">{gl}</svg>'
        for i, (title, sub, c, rgb, stage, mlabel) in enumerate(LANES):
            lit = i < nlit
            y, ry = CT[i], RAIL[i]
            border = f"border-color:rgba({rgb},.75);box-shadow:0 0 46px rgba({rgb},.20);" if lit else "border-color:var(--border);"
            h += A(f"left:72px;top:{y}px;width:936px;height:{CH}px;{border}",
                   f'<div style="position:absolute;left:34px;top:28px;font-family:\'DM Sans\';font-size:36px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--{"accent-" + c if lit else "text-primary"});white-space:nowrap">{title}</div>'
                   f'<div style="position:absolute;left:34px;top:88px;font-family:\'DM Sans\';font-size:29px;color:var(--text-secondary);white-space:nowrap">{sub}</div>',
                   "card2" + ("" if lit else " dim"), f"lane{i + 1}-card")
            flt = ' filter="url(#g11)"' if lit else " "
            sv = (f'<svg class="layer{"" if lit else " dim"}">' + (FILTER if i == 0 else "") +
                  f'<line x1="{RX0}" y1="{ry}" x2="{RX1}" y2="{ry}" stroke="#1e2330" stroke-width="4" stroke-linecap="round"/>' +
                  "".join(f'<circle cx="{x}" cy="{ry}" r="7" fill="#2a3142"/>' for x in SX) +
                  f'<line x1="{RX0}" y1="{ry}" x2="{SX[stage]}" y2="{ry}" stroke="var(--accent-{c})" stroke-width="5" stroke-linecap="round"{flt}/>'
                  f'<circle cx="{SX[stage]}" cy="{ry}" r="32" fill="rgba({rgb},.20)"/><circle cx="{SX[stage]}" cy="{ry}" r="17" fill="var(--accent-{c})"{flt}/>')
            if i == 2:
                sv += (f'<line x1="{SX[0] + 44}" y1="{ry}" x2="{SX[1] - 46}" y2="{ry}" stroke="var(--accent-cyan)" stroke-width="4" stroke-dasharray="10 9" stroke-linecap="round"/>'
                       f'<path d="M{SX[1] - 54} {ry - 11} L{SX[1] - 40} {ry} L{SX[1] - 54} {ry + 11}" stroke="var(--accent-cyan)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
            sv += "</svg>"
            h += sv
            h += A(f"left:{SX[stage] - 180}px;top:{ry + 36}px;width:360px;text-align:center;font-family:'DM Sans';font-size:25px;font-weight:700;letter-spacing:.06em;color:var(--accent-{c});white-space:nowrap",
                   mlabel, "" if lit else "dim", f"lane{i + 1}-marker-label")
            if i == 2:
                h += A(f"left:{(SX[0] + SX[1]) // 2 - 150}px;top:{ry - 56}px;width:300px;text-align:center;font-family:'DM Sans';font-size:22px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-cyan);white-space:nowrap",
                       'field tests <span class="mono">2027</span>', "" if lit else "dim", "lane3-field-tests")
        h += f'<div class="take{off(s != "payoff")}" style="top:1556px" data-g="take">It’s early, but it <span class="g">has started</span>.</div>'
        h += SRC("Sources: Figure AI, BMW Group, Agility Robotics, IEEE Spectrum,<br>Korea Herald (Nov 2025 to Sep 2026) &middot; status as read Nov 9, 2026")
        return h

    return dict(
        id="C11", kind="diagrams", type="Type 2 SYSTEM-DESIGN", title="who actually welds today", states=["start", "lane1", "lane2", "lane3", "payoff"], frame=fr,
        beat="CH3@265.155-275.75 (diagram, shown ONCE, held)",
        spoken="but the arms already are the humanoid is in training and the industry just cannot hire welders fast enough. So it's early, but it has started.",
        geo=dict(layout="three lanes STACKED, each = a full-width card with its stage rail under it", stages=dict(PROTOTYPE=SX[0], PILOTS=SX[1], IN_PRODUCTION=SX[2], label_top=432),
                 cards=[dict(x=72, y=t, w=936, h=CH) for t in CT], rails=dict(x0=RX0, x1=RX1, y=RAIL, fill_to=[SX[2], SX[1], SX[0]]),
                 field_tests_arrow=dict(x1=SX[0] + 44, x2=SX[1] - 46, head_tip=SX[1] - 40, y=RAIL[2]), take_top=1556),
        state_rows=[("C11-start.png", "265.16", "all three lanes dim (.3): cards, rails, markers, labels"),
                    ("C11-lane1.png", "265.84", "lane 1 lit: green border/glow, rail to IN PRODUCTION, marker glow"),
                    ("C11-lane2.png", "267.22", "+ lane 2 lit (gold), rail to PILOTS"),
                    ("C11-lane3.png", "267.58", "+ lane 3 lit (cyan), rail to PROTOTYPE, dashed 'FIELD TESTS 2027' arrow"),
                    ("C11-payoff.png", "272.32", "+ takeaway 'It's early, but it has started.'")],
        geo_rows=[("Header", "h1 one line", "h1 82 px **2 lines** 'Who actually' / '**welds** today'"),
                  ("Lane layout", "card LEFT (x140 w780) | rail RIGHT (x950-1730) on the same row", f"**card full width (x72 w936 h150) with its rail UNDER it (x{RX0}-{RX1}, card bottom + 84)**"),
                  ("Lane tops", "342 / 520 / 698", f"**cards {CT[0]} / {CT[1]} / {CT[2]}, rails {RAIL[0]} / {RAIL[1]} / {RAIL[2]}**"),
                  ("Stage columns", "x1090 / 1370 / 1650, labels y292", f"**x{SX[0]} / {SX[1]} / {SX[2]}, labels y432**; dashed guides only in the gaps between cards"),
                  ("Card type", "title 33 px, sub 27 px", "**title 36 px, sub 29 px**"),
                  ("Marker labels", "23 px, rail + 40", "**25 px, rail + 36**"),
                  ("Field tests arrow", "x1134-1324 + head, label above", f"**x{SX[0] + 44}-{SX[1] - 46} + head (tip {SX[1] - 40}), label above at rail - 56**"),
                  ("Takeaway", "bottom 86", "**top 1556**, 40 px"),
                  ("Source", "one line", "**two lines**")],
        moves="The wide lane table (card | rail) becomes a tall stack: each lane is its card with its maturity rail directly beneath, the three stage columns run down through all three rails.",
        cues=[("265.16", "(cover in)", "diagram in at state start (lanes dim); cross-fade + scale-in"),
              ("265.84", "arms", "lane 1 lights: card to opacity 1 + green border/glow (12f), rail draws 100 to IN PRODUCTION x860 (15f), marker pops"),
              ("267.22", "the humanoid", "lane 2 lights (gold), rail draws to PILOTS x560"),
              ("267.58", "humanoid is in training", "lane 3 lights (cyan), rail to PROTOTYPE x260; the dashed 'field tests 2027' arrow draws at 268.46 ('training')"),
              ("272.32", "So it's early", "takeaway rises 16px + fades (15f); 'has started' gets its green at 273.60 ('but it has started')"),
              ("275.75", "(cover out)", "next cover C21")],
        guards="labels word for word from DATA.md pillar 3 (timeline + shipped-vs-planned ledger); BMW in the past tense (a pilot that ended); no robot count for BMW. Movement is comp-level only; shared elements pixel-identical across the five PNGs. No em dashes on screen.")


# =====================================================================================================================
# C23 (diagram) · three pieces have to meet inside a house
def c23():
    CT, CW, CH = [440, 640, 840], 780, 176
    NX, NY, NW, NH = 72, 1090, 780, 490
    LANE = [980, 940, 900]                          # card 1 -> outermost lane
    ENTRY = [1455, 1335, 1215]                      # card 1 -> lowest entry (no crossings)
    RAD = 26
    CARDS = [("Body", "on sale, delivery not confirmed", "gold", "home robot", '1X NEO, US deliveries promised for <span class="mono">2026</span>'),
             ("Skills", "lab demo", "gold", "learned from demonstrations", "Boston Dynamics and Toyota Research Institute, Atlas"),
             ("Ordering", "live", "green", "AI completes the purchase", "Amazon Buy for Me: you press confirm")]
    ORDER = ["s1-body", "s2-skills", "s3-ordering", "s4-arrows", "s5-notfound", "s6-prediction"]

    def path(i):
        y, x, e = CT[i] + CH // 2, LANE[i], ENTRY[i]
        return f"M{NX + CW} {y} H{x - RAD} Q{x} {y} {x} {y + RAD} V{e - RAD} Q{x} {e} {x - RAD} {e} H{NX + NW + 6}"

    def head(i):
        e = ENTRY[i]
        return f"M{NX + NW + 22} {e - 12} L{NX + NW + 4} {e} L{NX + NW + 22} {e + 12}"

    def fr(s):
        k = ORDER.index(s)
        h = orb(640, -360, 760, "rgba(0,194,255,.48)")
        h += HDR("The maintenance job &middot; three pieces", 'Three pieces have to<br>meet <span class="c">inside a house</span>')
        for i, (cat, pill, pc, main, sub) in enumerate(CARDS):
            lit = k >= i
            border = "border-color:rgba(0,194,255,.75);box-shadow:0 0 46px rgba(0,194,255,.18);" if lit else "border-color:var(--border);"
            h += A(f"left:72px;top:{CT[i]}px;width:{CW}px;height:{CH}px;{border}",
                   f'<div class="cat" style="position:absolute;left:32px;top:30px;font-size:24px;color:var(--{"accent-cyan" if lit else "text-muted"})">{cat}</div>'
                   f'<div class="pill {pc}" style="position:absolute;right:26px;top:22px">{pill}</div>'
                   f'<div style="position:absolute;left:32px;top:72px;font-family:\'DM Sans\';font-size:44px;font-weight:700;color:var(--text-primary);white-space:nowrap">{main}</div>'
                   f'<div style="position:absolute;left:32px;top:130px;font-family:\'DM Sans\';font-size:26px;color:var(--text-muted);white-space:nowrap">{sub}</div>',
                   "card2" + ("" if lit else " dim"), f"card-{cat.lower()}")
        on = k >= 3
        sv = ['<svg class="layer"><defs><filter id="g23" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><feGaussianBlur stdDeviation="4" result="b"/>'
              '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>']
        for i in range(3):
            if on:
                sv.append(f'<path d="{path(i)}" stroke="#00c2ff" stroke-width="4" fill="none" stroke-linejoin="round" filter="url(#g23)"/>'
                          f'<path d="{head(i)}" stroke="#00c2ff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
            else:
                sv.append(f'<path d="{path(i)}" stroke="#2a3142" stroke-width="3" fill="none" stroke-linejoin="round" />'
                          f'<path d="{head(i)}" stroke="#2a3142" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
        sv.append("</svg>")
        h += "".join(sv)
        box = f"left:{NX}px;top:{NY}px;width:{NW}px;height:{NH}px;border-radius:22px;background:rgba(18,21,28,.85);"
        title = ('<div style="position:absolute;left:0;right:0;top:52px;text-align:center;font-family:\'Playfair Display\',serif;font-weight:900;font-size:66px;'
                 'line-height:1.08;color:var(--text-primary)">All three,<br>in a house</div>')
        if k <= 2:
            h += A(box + "border:3px dashed #2a3142;", "", "", "node")
        elif k == 3:
            h += A(box + "border:3px dashed rgba(0,194,255,.80);box-shadow:0 0 50px rgba(0,194,255,.18);",
                   '<div style="position:absolute;left:0;right:0;top:100px;text-align:center;font-family:\'Playfair Display\',serif;font-weight:900;font-size:240px;line-height:1;color:var(--text-muted)">?</div>',
                   "", "node")
        elif k == 4:
            h += A(box + "border:3px solid rgba(255,64,96,.70);box-shadow:0 0 50px rgba(255,64,96,.18);",
                   title + '<div style="position:absolute;left:0;right:0;top:262px;text-align:center"><span class="pill red" style="font-size:48px;padding:20px 44px 18px;letter-spacing:.14em;box-shadow:0 0 40px rgba(255,64,96,.30)">not found</span></div>',
                   "", "node")
        else:
            h += A(box + "border:3px solid rgba(255,215,0,.70);box-shadow:0 0 56px rgba(255,215,0,.18);",
                   title + '<div style="position:absolute;left:0;right:0;top:222px;text-align:center;font-family:\'DM Sans\';font-size:24px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)">today: not found</div>'
                   '<div style="position:absolute;left:0;right:0;top:280px;text-align:center"><span class="cat" style="color:var(--accent-gold);font-size:27px">Mike’s prediction</span></div>'
                   '<div class="val" data-g="c23-2029" style="position:absolute;left:0;right:0;top:326px;text-align:center;font-size:132px;color:var(--accent-gold);text-shadow:0 0 50px rgba(255,215,0,.30)"><span data-g="c23-2029-glyphs">2029</span></div>',
                   "", "node")
        h += SRC("Sources: 1X order page (Nov 10, 2026) &middot;<br>Toyota Research Institute (Aug 20, 2025) &middot;<br>Amazon (Mar 11, 2026) &middot; 2029 = a prediction")
        return h

    return dict(
        id="C23", kind="diagrams", type="Type 2 SYSTEM-DESIGN", title="three pieces have to meet inside a house", states=ORDER, frame=fr,
        beat="CH3@342.97-349.97 (s1-s4), then BR-18, then CH3@353.97-364.42 (s4-s6)",
        spoken="The robot already in your house loads the skill of an expert electrician, orders the wire and the parts it needs and does the repair. ... Can it do that today? In 2026? No. Nobody's put those pieces together inside a house yet. But my prediction is that by 2029, it will.",
        geo=dict(layout="three source cards STACKED (x72 w780), the centre node BELOW them in the same column; three arrows leave each card's right edge, run DOWN a 3-lane cable run on the right (card 1 outermost) and re-enter the node's right edge, card 1 lowest: no crossings",
                 cards=[dict(x=72, y=t, w=CW, h=CH) for t in CT], node=dict(x=NX, y=NY, w=NW, h=NH, r=22), lanes_x=LANE, entries_y=ENTRY, corner_r=RAD,
                 arrow_paths=[path(i) for i in range(3)], arrow_heads=[head(i) for i in range(3)],
                 hold_2029_note="the comp's 360.85 step shows s6 with '2029' held back: patch rect x 290 y 1397 w 345 h 179 (the glyph box measured['s6-prediction']['c23-2029-glyphs'] + 14 px a side, clamped above the node's bottom border y 1577) with the node fill #13161c and a soft edge, then reveal the s6 crop of that rect rising 20 px + fading in over 12f from 362.27 (as the 16:9 DeckView does with its 1344,664 302x112 patch)"),
        state_rows=[("C23-s1-body.png", "342.97", "BODY lit (cyan border/glow), SKILLS and ORDERING dim, arrows dim, node an empty dashed outline"),
                    ("C23-s2-skills.png", "344.55", "+ SKILLS lit"),
                    ("C23-s3-ordering.png", "346.81", "+ ORDERING lit"),
                    ("C23-s4-arrows.png", "348.93 (and the return at 353.97)", "three arrows cyan with glow, node outline cyan dashed, '?'"),
                    ("C23-s5-notfound.png", "357.07", "'All three, in a house' + red NOT FOUND stamp, red solid border"),
                    ("C23-s6-prediction.png", "360.85 ('2029' held back to 362.27: patch rect x290 y1397 345x179, see the geometry JSON)", "'TODAY: NOT FOUND', MIKE'S PREDICTION, gold '2029', gold border")],
        geo_rows=[("Header", "h1 one line", "h1 82 px **2 lines** 'Three pieces have to' / 'meet **inside a house**'"),
                  ("Source cards", "x140 w760 h166, tops 304 / 494 / 684", f"**x72 w{CW} h{CH}, tops {CT[0]} / {CT[1]} / {CT[2]}**; cat 24 px, pill 20 px, main 44 px, sub 26 px"),
                  ("Centre node", "RIGHT of the cards: x1210 y372 570x430", f"**BELOW the cards: x{NX} y{NY} {NW}x{NH}**, r22"),
                  ("Arrows", "three S-curves left -> right into the node's left edge (y492 / 587 / 682)", f"**three cable runs: right from each card edge (x852), down lanes x{LANE[0]} / {LANE[1]} / {LANE[2]}, back LEFT into the node's right edge at y{ENTRY[0]} / {ENTRY[1]} / {ENTRY[2]}** (corner r{RAD}); exact paths in the geometry JSON"),
                  ("Node type", "Playfair 56 px, ? 210 px, NOT FOUND 44 px, 2029 104 px", "**Playfair 66 px, ? 240 px, NOT FOUND 48 px, 2029 132 px**"),
                  ("Source", "one line", "**three lines**")],
        moves="The left-to-right mesh turns top-to-bottom: the three pieces stack, and their arrows run down the right side like cabling into the one place they have to meet. Arrow 1 is the outermost lane and enters lowest, so the three runs never cross.",
        cues=[("342.97", "(cover in)", "diagram in at s1: BODY lit, SKILLS and ORDERING dim, arrows dim, node an empty dashed outline"),
              ("344.55", "loads", "SKILLS lights (12f)"),
              ("346.81", "orders", "ORDERING lights (12f)"),
              ("348.93", "does the repair", "the three arrows draw from each card to the node (stroke-dashoffset along the path, 18f, staggered 3f, card 1 first) and turn cyan; node outline turns cyan; '?' fades in"),
              ("349.97", "(cover out)", "BR-18 roof leak (4.0 s)"),
              ("353.97", "Can it do that today?", "diagram RETURNS at s4 (same diagram continuing, not a second diagram)"),
              ("357.07", "No.", "'?' out; 'ALL THREE, IN A HOUSE' + red 'NOT FOUND' stamp in (scale 1.12 to 1, 8f); border turns solid red"),
              ("360.85", "my prediction", "'NOT FOUND' shrinks into the small 'TODAY: NOT FOUND' line; 'MIKE'S PREDICTION' fades in; border to gold"),
              ("362.27", "2029", "'2029' rises 20px + fades in, gold glow"),
              ("364.42", "(cover out)", "S3 / CLIP-61 lead-in")],
        guards="DATA.md 7A rows A3-A7 and A13; 'you press confirm' per the do-not-air row; 2029 labelled as Mike's prediction. Movement comp-level only; box positions, cards, arrows, header and source pixel-identical across all six PNGs. No em dashes on screen.")


CHARTS = [c10, c7, c6, c3, c8, c8shift, c11count, c12, c11, c21, c23, c32, c33, c36]


def spec_comment(c):
    lines = [f"ANIMATION SPEC  {c['id']} VERTICAL  ({c['type']})  beat {c['beat']}  ·  chapter accent: stylesheet default",
             f"spoken: {c['spoken']}",
             f"each .frame below = one state PNG (<id>-<state>.png), 1080x1920 PORTRAIT; comp animates between them with useCurrentFrame() at 30 fps:"]
    lines += [f"  {t:>7}  [{w}]  {d}" for t, w, d in c["cues"]]
    lines.append(f"never: {c['guards']}")
    return "<!--\n" + "\n".join(lines) + "\n-->"


def build(c):
    style = locked_stylesheet() + PORTRAIT_CSS
    spec = dict(id=c["id"], orientation="portrait", canvas=[W, H], type=c["type"], beat=c["beat"], chapter_accent="stylesheet default",
                spoken=c["spoken"], twin=f"assets/{c['kind']}/{c['id']}.html (1920x1080)",
                states={r[0].replace(c["id"] + "-", "").replace(".png", ""): f"from {r[1]}" for r in c["state_rows"]},
                cues=[dict(t=float(t), word=w, do=d) for t, w, d in c["cues"]], never=c["guards"])
    geo = dict(chart=c["id"], orientation="portrait", canvas=[W, H], beat=c["beat"], twin=spec["twin"], **c["geo"])
    out = [f'<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n<title>{c["id"]} VERTICAL · {c["title"]}</title>\n{FONTS}\n<style>{style}</style>\n</head><body>',
           spec_comment(c),
           f'<script type="application/json" id="anim-spec">\n{json.dumps(spec, indent=1, ensure_ascii=False)}\n</script>',
           f"<script>window.GEOMETRY = {json.dumps(geo, ensure_ascii=False)};</script>"]
    for st in c["states"]:
        out.append(f'<!-- {c["id"]} state "{st}" -> {c["id"]}-{st}.png -->')
        out.append(f'<div class="frame ch" id="{st}" data-state="{st}">{c["frame"](st)}</div>')
    out.append("</body></html>\n")
    html = "\n".join(out)
    body = re.sub(r"<style>.*?</style>", "", html, flags=re.S)    # the locked stylesheet's own comments are copied verbatim
    if "—" in body or "–" in body:
        raise SystemExit(f"{c['id']}: em/en dash in the page")
    d = HERE / c["kind"]
    d.mkdir(parents=True, exist_ok=True)
    p = d / f"{c['id']}.html"
    p.write_text(html, encoding="utf-8")
    write_md(c, d)
    return p


def write_md(c, d):
    cid = c["id"]
    folder = c["kind"]
    anim = c["type"].startswith("Type 1")
    lines = [f"# {cid} VERTICAL · {c['title']} ({c['type']}) · 1080x1920 · {c['beat']}", "",
             f"Portrait twin of `assets/{folder}/{cid}.html` (1920x1080). "
             + ("**Same build mode:** a `useCurrentFrame()` Remotion component (the 16:9 one is the `" + cid + "` template in "
                "`remotion/src/AIDestroyingLivesCharts.tsx`), never a PNG with a wipe: `lint_animated_charts.py` still applies. "
                if anim else "**Same build mode:** static state stills; movement comes only from comp-level spotlights / transitions "
                "(the 16:9 comp's `DeckView`, `DECK_STATES`). ")
             + "Same data, strings, colours, state ids, cue times and choreography; **only the geometry and type sizes change** "
               "(plus the layout moves in section 2). Source: `" + cid + ".html` (this folder; every state is one `.frame` from ONE "
               "function in `../_charts_portrait.py`, the stylesheet is the 16:9 one VERBATIM plus a layout-only portrait block). "
               "Machine-readable geometry: `" + cid + "-geometry.json` (the generator's constants + the measured box of every "
               "`data-g` element, per state). The PNGs are the design spec: the component lands pixel-for-pixel on each.", "",
             ("**Porting note for the comp:** the 16:9 template is this chart's HTML with `.aidl` scoping; the vertical template is "
              "the markup of `" + cid + ".html` the same way, with the portrait CSS block (bottom of its `<style>`) appended to the "
              "scoped sheet. Every moving value below is the 16:9's motion with the portrait number swapped in." if anim else
              "**Porting note for the comp:** the vertical comp's deck view reads `diagrams/" + cid + "-<state>.png` from the vertical "
              "public dir with the SAME state times as the 16:9 `DECK_STATES['" + cid + "']` (cross-fade 12f between states, the slow "
              "1.00 to 1.03 push); every shared element sits at the same pixel in every state, so a state swap reads as a light-up, "
              "not a redraw."), "",
             "## 1. States (design stills, 1080x1920)", "", "| PNG | Holds from | What is on screen |", "|---|---|---|"]
    lines += [f"| `{a}` | {b} | {cc} |" for a, b, cc in c["state_rows"]]
    lines += ["", "## 2. Portrait geometry (px on the 1080x1920 canvas)", "", "| Element | 16:9 | **Portrait** |", "|---|---|---|"]
    lines += [f"| {a} | {b} | {cc} |" for a, b, cc in c["geo_rows"]]
    lines += ["", f"**Layout move (design call):** {c['moves']}", "",
              "## 3. What animates when (cued to the words, IDENTICAL times to the 16:9)", "",
              "| Spine s | Word | Animation (portrait px) |", "|---|---|---|"]
    lines += [f"| {t} | {w} | {dd} |" for t, w, dd in c["cues"]]
    lines += ["", f"**Guards held (unchanged wording):** {c['guards']}", "",
              "**Edge safety:** every text element sits at least 44 px inside the frame (gate in `../_shot_portrait.py`): the comp's "
              "105% camera wobble crops 27 px a side and 48 px top and bottom. Main content stays above y ~1700; only the small "
              "source line sits lower (bottom 110). No visible text overlaps another (also gated).", ""]
    (d / f"{cid}.vertical.spec.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    want = set(sys.argv[1:])
    for fn in CHARTS:
        c = fn()
        if want and c["id"] not in want:
            continue
        print("wrote", build(c))
