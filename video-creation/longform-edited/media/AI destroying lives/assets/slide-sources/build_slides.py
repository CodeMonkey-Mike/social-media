"""AI destroying lives SLIDES (slide-builder, 2026-11-10): writes containers.html (one standalone 1920x1080 frame per
state) and screenshots each frame to ../card-slides/ (every slide in this build is a CARD SLIDE).

Theme: DARK, no accent file, no chapter_themes (GRAPH-PROGRESS settings carry no container_theme / container_accent;
BROLL-PLAN "Container theme: DARK", every row "stylesheet default"). container-canonical.css is pasted VERBATIM from
container-reference/; LOCAL below only adds this build's components on its tokens.
Accent meaning for this video (do not drift): cyan = the lit row / neutral key word (the stylesheet default accent),
green = real / in production / positive, gold = prototype / special, red = loss / risk, teal = the CodeMonkey Mike
brand mark only.

C19-1/2/3 are the ELEGANT PROMO fact cards the plan names (effects theme elegant-promo-2022, devices ep-iris-open,
ep-circle-burst, ep-disc-sweep, ep-label-title): built to the theme's MEASURED settled state (library.json devices,
themes/elegant-promo-2022/CUE-SHEET.md), in the theme's own fonts and colours (Roboto Black / Regular, the teal-to-blue
bar, the magenta discs), which the theme rule says an Elegant promo keeps. Two files each:
  C19-n.png          the settled full frame over its IMG plate (QA reference / fallback still)
  C19-n-overlay.png  the same discs + bar + title + sub-line on a TRANSPARENT ground, for the comp to lay over its own
                     pushing-in IMG plate and run the device motion (discs scale, bar wipes, title tracks in).
A composite whose IMG plate is not on disk yet is skipped with a warning (re-run: python build_slides.py C19-3).

Renders at device_scale_factor=2, Lanczos-downsampled to exactly 1920x1080 (alpha resized premultiplied).
Gates (refuse to ship): a webfont did not load, a frame is not 1920x1080, an em dash or a dollar sign is on screen
(persona money_format: no dollar sign, "300 dollars"), content overflows the frame or its card, an image did not load.
Run: python build_slides.py [frame-id ...]   (no ids = every frame)
"""
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
REF = HERE.parents[3] / "skills" / "container-reference"
OUT = HERE.parent / "card-slides"
IMG = HERE.parent / "img"
FONTS = ("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900"
         "&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700"
         "&family=Roboto:wght@400;900&display=swap")

THUMB1 = "thumb-dKwFdQMXv-c.jpg"   # 2026-10-08 "Literally Every Job Is at Risk. Here's How to Protect Yourself"
THUMB2 = "thumb-Ccriu5vuxf8.jpg"   # 2026-10-27 "🚨 AI Will Wipe These Jobs Out Next" (emoji left off on screen)
TITLE1 = "Literally Every Job Is at Risk. Here's How to Protect Yourself"
TITLE2 = "AI Will Wipe These Jobs Out Next"
LOGO = (HERE.parents[5] / "schedule-tweets" / "images" / "reference" / "mike-profile-logo.jpg").as_uri()

LOCAL = """
/* ---- this build's components, on the locked tokens. Lit colour = cyan (the stylesheet default accent). ---- */
.frame{--acc:var(--accent-cyan);--acc-rgb:0,194,255}
.frame>.orb{z-index:0}
.ey .mono{font-weight:600;color:inherit}
.card{position:relative;width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:28px;
  padding:60px 84px 58px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.55)}
.card>.top{position:absolute;top:0;left:0;right:0;height:5px;
  background:linear-gradient(90deg,var(--accent-cyan),var(--accent-cyan) 38%,rgba(0,194,255,0) 92%)}
.frame .card h1{max-width:none}
h1.lg{font-size:96px;line-height:1.08}
/* rows: hairline between rows at rest; the lit row takes the cyan ring. RESTING rows stay readable
   (text-secondary): the spotlight adds emphasis, it never toggles visibility. */
.rows{display:flex;flex-direction:column;width:100%}
.row{display:flex;align-items:center;gap:34px;padding:20px 30px;border:2px solid transparent;
  box-shadow:inset 0 -1px 0 var(--border)}
.row:last-child{box-shadow:none}
.row .v{font:600 48px/1.2 'DM Sans';color:var(--text-secondary)}
.row .lb{flex:0 0 250px;font:600 26px/1.2 'DM Sans';letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.row svg{width:46px;height:46px;flex:0 0 46px;stroke:var(--text-secondary);fill:none;stroke-width:2.2;
  stroke-linecap:round;stroke-linejoin:round;opacity:.75}
.row.done .v{color:var(--text-primary)}
.row.done svg{stroke:var(--text-primary);opacity:.9}
.frame .row.on{border-radius:16px;border-color:var(--acc);background:rgba(var(--acc-rgb),.07);
  box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10),0 12px 28px rgba(0,0,0,.35)}
.row.on .v{color:var(--text-primary);font-weight:700}
.row.on svg{stroke:var(--acc);opacity:1}
.rows.sm .row .v{font-size:42px}
.rows.sm .row{padding:16px 28px}
/* status line (the banks card's accent mono line): resting = readable grey with a hollow dot, lit = its colour */
.st{display:flex;align-items:center;gap:22px;font:600 40px/1.2 'JetBrains Mono';letter-spacing:.04em;
  color:var(--text-secondary);margin-bottom:30px}
.st i{width:22px;height:22px;border-radius:50%;border:3px solid var(--text-secondary);flex:0 0 22px}
.st.g{color:var(--accent-green)} .st.g i{border-color:var(--accent-green);background:var(--accent-green);
  box-shadow:0 0 0 6px rgba(0,230,138,.14),0 0 22px rgba(0,230,138,.55)}
.st.go{color:var(--accent-gold)} .st.go i{border-color:var(--accent-gold);background:var(--accent-gold);
  box-shadow:0 0 0 6px rgba(255,215,0,.12),0 0 22px rgba(255,215,0,.45)}
.who{font:600 46px/1.25 'DM Sans';color:var(--text-secondary);padding:18px 30px;margin:0 -30px;border:2px solid transparent}
.who.on{color:var(--text-primary);border-radius:16px;border-color:var(--acc);background:rgba(var(--acc-rgb),.07);
  box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10),0 12px 28px rgba(0,0,0,.35)}
.who .lb{display:block;font:600 24px/1.2 'DM Sans';letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted);
  margin-bottom:8px}
.card p{max-width:none}
/* thumbnail tiles (the two earlier videos) */
.tiles{display:flex;gap:56px;width:100%}
.tile{flex:1 1 0;min-width:0}
.tile .th{position:relative;width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;border:2px solid var(--border);
  background:#000}
.tile .th img{width:100%;height:100%;object-fit:cover;display:block}
.tile .tt{font:600 30px/1.32 'DM Sans';color:var(--text-primary);margin-top:20px}
.tile .dt{font:500 24px/1.3 'DM Sans';color:var(--text-muted);margin-top:8px;letter-spacing:.02em}
.tile .dt .mono{font-weight:500}
/* resting / lit / done tiles (end-tiles, end-card-cta): resting stays readable, a little dimmer */
.tiles.spot .tile .th img{filter:brightness(.72) saturate(.85)}
.tiles.spot .tile .tt{color:var(--text-secondary)}
.tiles.spot .tile.done .th img{filter:none}
.tiles.spot .tile.done .tt{color:var(--text-primary)}
.tiles.spot .tile.on .th{border-color:var(--acc);box-shadow:0 0 0 5px rgba(var(--acc-rgb),.16),0 16px 40px rgba(0,0,0,.5)}
.tiles.spot .tile.on .th img{filter:none}
.tiles.spot .tile.on .tt{color:var(--text-primary);font-weight:700}
.play{position:absolute;left:22px;bottom:22px;width:76px;height:76px;border-radius:50%;
  background:rgba(10,12,16,.62);border:2px solid rgba(232,234,240,.55);display:flex;align-items:center;justify-content:center}
.play svg{width:32px;height:32px;fill:#e8eaf0;margin-left:5px}
.tile.on .play{background:rgba(0,194,255,.85);border-color:var(--accent-cyan)}
/* logo */
.logo{border-radius:50%;object-fit:cover;display:block;border:2px solid rgba(73,224,200,.45);
  box-shadow:0 0 0 6px rgba(73,224,200,.07),0 18px 40px rgba(0,0,0,.5)}
.namerow{display:flex;align-items:center;gap:44px}
/* two-column card bodies */
.cols{display:flex;gap:72px;width:100%;align-items:flex-start}
.cols>.l{flex:0 0 620px} .cols>.r{flex:1 1 0;min-width:0}
/* A-vs-B comparison inside ONE card (declared comparison) */
.vs{display:flex;align-items:stretch;width:100%;margin-top:6px}
.vs .side{flex:1 1 0;padding:38px 44px 40px;border-radius:20px;border:2px solid transparent}
.vs .side .lb{font:600 30px/1.2 'DM Sans';letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:22px}
.vs .side .ph{font:900 92px/1.05 'Playfair Display',serif;letter-spacing:-.02em;color:var(--text-secondary)}
.vs .mid{flex:0 0 120px;display:flex;align-items:center;justify-content:center;position:relative}
.vs .mid:before{content:"";position:absolute;top:8px;bottom:8px;left:50%;width:1px;background:var(--border)}
.vs .mid span{position:relative;font:600 28px/1 'JetBrains Mono';color:var(--text-muted);background:var(--bg-card);padding:14px 0}
.vs .side.done .ph{color:var(--text-primary)}
.vs .side.on{border-color:var(--acc);background:rgba(var(--acc-rgb),.06);
  box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10),0 12px 28px rgba(0,0,0,.35)}
.vs .side.on .lb{color:var(--text-secondary)}
.vs .side.on.c .ph{color:var(--accent-cyan)} .vs .side.on.re .ph{color:var(--accent-red)}
.vs .side.re.on{border-color:var(--accent-red);background:rgba(255,64,96,.06);
  box-shadow:0 0 0 4px rgba(255,64,96,.10),0 12px 28px rgba(0,0,0,.35)}
/* quote card */
h1.q{font-size:76px;line-height:1.12}
.attr{font:500 28px/1.4 'DM Sans';color:var(--text-muted);margin-top:30px}
.attr b{color:var(--text-secondary);font-weight:600}
.roi{font:600 46px/1.3 'DM Sans';color:var(--text-primary)}
/* lower-third: the community link (cryptorich.vip), borderless band bottom-left, logo = the logo bug */
.frame>.l3{position:absolute;left:140px;bottom:64px;display:flex;align-items:center;gap:26px;z-index:2}
.l3 .bar{width:5px;height:84px;border-radius:3px;background:linear-gradient(180deg,var(--accent-teal),var(--accent-cyan))}
.l3 .logo{width:84px;height:84px}
.l3 .k{font:600 22px/1.2 'DM Sans';letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted)}
.l3 .u{font:700 44px/1.15 'DM Sans';color:var(--text-primary);letter-spacing:-.005em}
.l3 .u span{color:var(--accent-teal)}

/* ================= ELEGANT PROMO (C19): the theme's own look, not the canonical anatomy ================= */
.frame.ep{padding:0;background:#04090F;display:block}
.frame.ep::after{opacity:0}
.frame.ep.ov{background:transparent}
.ep .plate{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.ep svg.discs{position:absolute;inset:0;z-index:1}
.ep .bar{position:absolute;z-index:2;height:91px;background:linear-gradient(90deg,#38C1A9,#135FB5);
  box-shadow:0 2px 10px rgba(0,0,0,.18)}
.ep .tt{position:absolute;z-index:3;font:900 90px/91px 'Roboto',sans-serif;color:#fff;text-transform:uppercase;
  letter-spacing:.01em;white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.22)}
.ep .sub{position:absolute;z-index:3;font:400 36px/45px 'Roboto',sans-serif;color:#fff;text-transform:uppercase;
  white-space:nowrap;letter-spacing:.005em;text-shadow:0 1px 4px rgba(0,0,0,.35)}
.ep .sub.s{font-size:30px}
.ep .src{position:absolute;z-index:3;font:400 22px/30px 'Roboto',sans-serif;color:rgba(255,255,255,.78);
  text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;text-shadow:0 1px 4px rgba(0,0,0,.35)}
"""

# ---- icons (stroke SVGs, 24 px grid) ----
ARROW = '<svg viewBox="0 0 24 24"><path d="M4 12h15"/><path d="m13 5.5 6.5 6.5-6.5 6.5"/></svg>'
DOT = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/></svg>'
BUBBLE = ('<svg viewBox="0 0 24 24"><path d="M20.5 12a8 8 0 0 1-11.6 7.1L3.5 20.5l1.4-4.9A8 8 0 1 1 20.5 12z"/>'
          '<path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg>')
THUMB = ('<svg viewBox="0 0 24 24"><path d="M7 10v11H3.5V10z"/><path d="M7 10l4.2-7.2c1.4 0 2.6 1.2 2.4 2.7L13 9.5h5.6'
         'a2 2 0 0 1 2 2.4l-1.5 7.3a2 2 0 0 1-2 1.8H7"/></svg>')
BELL = ('<svg viewBox="0 0 24 24"><path d="M18 9.5a6 6 0 0 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 16 18 9.5"/>'
        '<path d="M10 21a2.2 2.2 0 0 0 4 0"/></svg>')
USERS = ('<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/>'
         '<path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.7.8 2.8 2.5 3.1 5.2"/></svg>')
CODE = '<svg viewBox="0 0 24 24"><path d="m8 7-5 5 5 5"/><path d="m16 7 5 5-5 5"/><path d="m13.5 4-3 16"/></svg>'
BOOK = ('<svg viewBox="0 0 24 24"><path d="M3 5.5c3-1.5 6-1.5 9 .5 3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z"/>'
        '<path d="M12 6v13.5"/></svg>')
PLAY = '<svg viewBox="0 0 24 24"><path d="M6 3.8v16.4L20 12z"/></svg>'

FRAMES = []  # (frame id, kind, inner html, extra class)


def add(fid, inner, kind="card", cls=""):
    FRAMES.append((fid, kind, inner, cls))


def mono(s):
    return f'<span class="mono">{s}</span>'


def orbs():
    return ('<div class="orb" style="width:760px;height:760px;right:-200px;top:-260px;background:#00c2ff"></div>'
            '<div class="orb" style="width:620px;height:620px;left:-240px;bottom:-280px;background:#00e68a;opacity:.18"></div>')


def card(ey, h1, body, h1cls="sm", divider=True):
    h = f'<h1 class="{h1cls}">{h1}</h1>' if h1 else ""
    d = '<div class="divider"></div>' if divider else ""
    return f'{orbs()}<div class="card"><div class="top"></div><div class="ey">{ey}</div>{h}{d}{body}</div>'


def state(i, lit):
    """lit = 1-based index of the item just spoken (0 = resting): earlier items done, the current one on, later rest."""
    if lit == 0 or i > lit:
        return ""
    return "on" if i == lit else "done"


def rows(items, lit, cls=""):
    out = ""
    for i, (icon, label, v) in enumerate(items, 1):
        lb = f'<div class="lb">{label}</div>' if label else ""
        out += f'<div class="row {state(i, lit)}">{icon or ""}{lb}<div class="v">{v}</div></div>'
    return f'<div class="rows {cls}">{out}</div>'


def tile(img, title, date=None, st="", play=False):
    dt = f'<div class="dt">{date}</div>' if date else ""
    pl = f'<div class="play">{PLAY}</div>' if play else ""
    return (f'<div class="tile {st}"><div class="th"><img src="{img}">{pl}</div>'
            f'<div class="tt">{title}</div>{dt}</div>')


def date(month, day, year):
    return f'{month} {mono(day)}, {mono(year)}'


def lower_third(label="The community"):
    return (f'<div class="l3"><div class="bar"></div><img class="logo" src="{LOGO}">'
            f'<div><div class="k">{label}</div>'
            f'<div class="u">cryptorich<span>.vip</span></div></div></div>')


# ============================ CH2 ============================
# prior-videos-pair (CH2@20.63-26.45): declared A-and-B comparison, the two earlier videos, exact titles + dates.
add("prior-videos-pair", card(
    "My last two videos", 'I covered the <span class="c">first wave</span>',
    '<div class="tiles">' + tile(THUMB1, TITLE1, date("October", 8, 2026)) + tile(THUMB2, TITLE2, date("October", 27, 2026))
    + '</div>'))

# ---- C19 Elegant Promo fact cards (settled state of ep-disc-sweep + ep-label-title, measured px at 1920x1080) ----
# scene layouts from library.json: corner_tl (card 1), corner_br (card 2), top_centre (card 3).
EP = {
    "C19-1": dict(plate="IMG-1-empty-office-floor.png", layout="tl", title="121,401",
                  sub=["Job cuts blamed on AI", "2026 through October"]),
    "C19-2": dict(plate="IMG-2-desk-belongings-box.png", layout="br", title="193,226", sub=["Since 2023"]),
    "C19-3": dict(plate="IMG-3-revolving-door-dusk.png", layout="top", title="1,265",
                  sub=["October 2026, the lowest month of the year"]),
}
EP_SRC = "Source: Challenger, Gray &amp; Christmas"


def discs(layout):
    # centre + settled radii (outer ~1457 / ~1435 top, inner ~0.78x) and a gradient running bright -> plum across the
    # visible part of the disc the way the 2022 render reads (scene 1 bright lower-left, scene 2 the point mirror).
    c = {"tl": (-333, -447, 1457), "br": (2253, 1528, 1457), "top": (961, -925, 1435)}[layout]
    g = {"tl": (0, 980, 1060, 0), "br": (1920, 120, 860, 1080), "top": (420, 0, 1700, 520)}[layout]
    cx, cy, r = c
    ri = round(r * 0.78)
    return f'''<svg class="discs" width="1920" height="1080" viewBox="0 0 1920 1080">
<defs>
 <linearGradient id="o{layout}" gradientUnits="userSpaceOnUse" x1="{g[0]}" y1="{g[1]}" x2="{g[2]}" y2="{g[3]}">
  <stop offset="0" stop-color="#C3264B"/><stop offset="1" stop-color="#3A0F2E"/></linearGradient>
 <linearGradient id="i{layout}" gradientUnits="userSpaceOnUse" x1="{g[0]}" y1="{g[1]}" x2="{g[2]}" y2="{g[3]}">
  <stop offset="0" stop-color="#D2385C"/><stop offset="1" stop-color="#7A1F46"/></linearGradient>
 <filter id="sh{layout}" x="-20%" y="-20%" width="140%" height="140%">
  <feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="#14040E" flood-opacity=".55"/></filter>
</defs>
<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#o{layout})" opacity=".80"/>
<circle cx="{cx}" cy="{cy}" r="{ri}" fill="url(#i{layout})" opacity=".55" filter="url(#sh{layout})"/>
</svg>'''


def ep_frame(fid, spec, overlay):
    lay = spec["layout"]
    plate = "" if overlay else f'<img class="plate" src="{(IMG / spec["plate"]).as_uri()}">'
    # bar + title + sub-line positions (settled), per the measured scenes; bar width fitted to the title in JS below
    if lay == "tl":
        bar = '<div class="bar" data-anchor="left" style="left:96px;top:169px"></div>'
        tt = f'<div class="tt" data-pad="26" style="left:122px;top:169px">{spec["title"]}</div>'
        sub = "".join(f'<div class="sub" style="left:98px;top:{318 + 45 * i}px">{s}</div>' for i, s in enumerate(spec["sub"]))
        src = f'<div class="src" style="left:98px;top:{318 + 45 * len(spec["sub"]) + 22}px">{EP_SRC}</div>'
    elif lay == "br":
        bar = '<div class="bar" data-anchor="right" style="right:99px;top:692px"></div>'
        tt = f'<div class="tt" data-center="1" style="top:692px">{spec["title"]}</div>'
        sub = "".join(f'<div class="sub s" style="right:99px;top:{838 + 45 * i}px;text-align:right">{s}</div>'
                      for i, s in enumerate(spec["sub"]))
        src = f'<div class="src" style="right:99px;top:{838 + 45 * len(spec["sub"]) + 18}px;text-align:right">{EP_SRC}</div>'
    else:
        bar = '<div class="bar" data-anchor="center" style="top:136px"></div>'
        tt = f'<div class="tt" data-center="1" style="top:136px">{spec["title"]}</div>'
        sub = "".join(f'<div class="sub s" data-hcenter="1" style="top:{264 + 45 * i}px">{s}</div>'
                      for i, s in enumerate(spec["sub"]))
        src = f'<div class="src" data-hcenter="1" style="top:{264 + 45 * len(spec["sub"]) + 18}px">{EP_SRC}</div>'
    add(fid, plate + discs(lay) + bar + tt + sub + src, kind="ep-ov" if overlay else "ep", cls="ep ov" if overlay else "ep")


for fid, spec in EP.items():
    ep_frame(fid, spec, overlay=False)
    ep_frame(f"{fid}-overlay", spec, overlay=True)

# ============================ CH3 ============================
# C11-lane1 (CH3@151.55-160.40): break-up spotlight of C11 lane 1; status lights on "Robots already weld" (155.2).
def lane1(lit):
    st = "g" if lit else ""
    return card("Who actually welds today", 'Fixed arms and <span class="c">cobots</span>',
                f'<div class="st {st}"><i></i>IN PRODUCTION</div>'
                '<p>Robots already weld in production every day. They just don&#39;t look like people.</p>', h1cls="")


add("C11-lane1", lane1(0))
add("C11-lane1-s1", lane1(1))

# plug-intro (CH3@189.25-197.80): logo + CodeMonkey Mike; items on "crypto (community)" 193.3, "software" 194.6,
# "courses" 196.3.
PLUG_ROWS = [(USERS, None, "Crypto community"), (CODE, None, "Software for members"), (BOOK, None, "Courses")]


def plug_intro(lit):
    head = (f'<div class="namerow"><img class="logo" src="{LOGO}" style="width:150px;height:150px">'
            f'<h1 class="sm" style="margin:0">I&#39;m <span class="tl">CodeMonkey Mike</span></h1></div>')
    return card("If you&#39;re new here", None, head + '<div class="divider"></div>' + rows(PLUG_ROWS, lit), divider=False)


add("plug-intro", plug_intro(0))
for s in range(1, 4):
    add(f"plug-intro-s{s}", plug_intro(s))

# plug-goal (CH3@197.80-203.80): one point.
add("plug-goal", card("The goal", 'Invested into <span class="g">assets</span>, before the paychecks run out.',
                      '<div style="height:0"></div>', h1cls="lg"))


# plug-300 (CH3@214.65-220.40): "300 dollars at the call", then "more than a lifetime membership" (on "more than paid").
def plug300(lit):
    return card("The math", f'<span class="g mono">300</span> dollars at the call',
                rows([(ARROW, None, "More than a lifetime membership")], lit), h1cls="lg")


add("plug-300", plug300(0))
add("plug-300-s1", plug300(1))


# plug-cta (CH3@220.40-225.00): "Link in the description"; the community lower-third in on "click the link" (-s1).
def plug_cta(l3):
    body = (f'<div class="namerow" style="justify-content:space-between"><div>'
            f'<div class="ey">Join the community</div><h1 class="lg" style="margin:0">Link in the <span class="c">description</span></h1>'
            f'<div class="divider" style="margin-bottom:0"></div></div>'
            f'<img class="logo" src="{LOGO}" style="width:230px;height:230px;flex:0 0 230px"></div>')
    inner = f'{orbs()}<div class="card"><div class="top"></div>{body}</div>'
    return inner + (lower_third() if l3 else "")


add("plug-cta", plug_cta(False))
add("plug-cta-s1", plug_cta(True))

# C20 (CH3@240.10-245.25): GXO CEO quote card; exact words per DATA.md (GXO Q2 2026 call, 2026-08-05).
add("C20", card(
    "The warehouse operator&#39;s CEO",
    '&#8220;Humanoids will <span class="c">absolutely</span><br><span class="c">feature</span> in our solutions.&#8221;',
    '<div class="roi">Return on humanoids: <span class="c">&#8220;a couple of years away&#8221;</span></div>'
    f'<div class="attr"><b>Patrick Kelleher</b>, CEO, GXO Logistics, earnings call, {date("August", 5, 2026)}</div>',
    h1cls="q"))


# C11-lane3 (CH3@245.25-251.25): status from the start; "Persona AI with HD Hyundai" lights at 248.5 (-s1).
def lane3(lit):
    on = " on" if lit else ""
    return card("Who actually welds today", 'Humanoid <span class="go">welder</span>',
                f'<div class="st go"><i></i>PROTOTYPE, FIELD TESTS {mono(2027)}</div>'
                f'<div class="who{on}"><span class="lb">Building it</span>Persona AI with HD Hyundai</div>', h1cls="")


add("C11-lane3", lane3(0))
add("C11-lane3-s1", lane3(1))

# callback-every-job (CH3@298.20-310.75): the 2026-10-08 tile; "a plumber" 305.3, "an electrician" 307.3, "a roofer" 309.4.
CALL_ROWS = [(ARROW, None, "a plumber"), (ARROW, None, "an electrician"), (ARROW, None, "a roofer")]


def callback(lit):
    # anatomy (visual-qa 2026-11-10 rebuild): eyebrow -> Playfair headline -> gradient divider -> rows; the divider sits
    # under the headline in the right column (the eyebrow labels the tile + the card).
    body = ('<div class="cols"><div class="l">' + tile(THUMB1, TITLE1) + '</div><div class="r">'
            '<h1 class="sm">You don&#39;t need to <span class="re">call</span></h1><div class="divider"></div>'
            + rows(CALL_ROWS, lit) + '</div></div>')
    return card(f'From my video, {date("October", 8, 2026)}', None, body, divider=False)


add("callback-every-job", callback(0))
for s in range(1, 4):
    add(f"callback-every-job-s{s}", callback(s))


# apprenticeship-vs-download (CH3@310.75-314.42): declared comparison, ONE card; trade on 310.9, robot on 312.7 (-s1).
def vs(lit):
    a = "on" if lit == 0 else "done"
    b = "on" if lit == 1 else ""
    body = (f'<div class="vs"><div class="side c {a}"><div class="lb">The trade</div><div class="ph">an<br>apprenticeship</div></div>'
            f'<div class="mid"><span>VS</span></div>'
            f'<div class="side re {b}"><div class="lb">The robot</div><div class="ph">a<br>download</div></div></div>')
    # anatomy (visual-qa 2026-11-10 rebuild): eyebrow -> short Playfair headline -> gradient divider -> the two sides.
    # The headline echoes the spoken verb ("needs an apprenticeship ... needs a download"): no new claim, no years,
    # no "humanoid electrician".
    return card("Learning the job", 'What each one <span class="c">needs</span>', body, h1cls="sm")


add("apprenticeship-vs-download", vs(0))
add("apprenticeship-vs-download-s1", vs(1))

# ============================ CH5 ============================
# quiet-damage (CH5@443.47-450.73): words only; rows on 443.6, 446.2, 448.3.
QUIET = [(DOT, None, "The entry-level job that never gets posted"), (DOT, None, "The freelance work that stops coming"),
         (DOT, None, "The office job already expected to shrink")]


def quiet(lit):
    return card("So what does this mean for you", 'The damage so far is <span class="re">quiet</span>', rows(QUIET, lit))


add("quiet-damage", quiet(0))
for s in range(1, 4):
    add(f"quiet-damage-s{s}", quiet(s))


# end-tiles (CH5@454.66-466.97): both neutral; tile 1 on 459.8; tile 2 on 462.8; "Watch those next" 465.8 = both lit.
def end_tiles(lit):
    s1 = {0: "", 1: "on", 2: "done", 3: "on"}[lit]
    s2 = {0: "", 1: "", 2: "on", 3: "on"}[lit]
    return card("Which jobs are next, and how to protect yourself", 'Watch those <span class="c">next</span>',
                '<div class="tiles spot">' + tile(THUMB1, TITLE1, st=s1, play=True) + tile(THUMB2, TITLE2, st=s2, play=True)
                + '</div>')


add("end-tiles", end_tiles(0))
for s in range(1, 4):
    add(f"end-tiles-s{s}", end_tiles(s))

# end-card-cta (CH5@466.97-475.30, held ~3 s past "this." 475.27): tiles small in end-screen positions (right),
# prompts on "comment" 467.4, "like" 471.5, "subscribe" 473.0; the community lower-third (Mike, plan gate) with the logo bug.
CTA = [(BUBBLE, None, "Comment: what does the job market look like for you?"), (THUMB, None, "Like"),
       (BELL, None, "Subscribe")]


def end_card(lit):
    left = ('<div class="ey">Before you go</div><h1>Over to <span class="c">you</span></h1>'
            '<div class="divider"></div>' + rows(CTA, lit))
    right = ('<div class="tiles spot" style="flex-direction:column;gap:26px">'
             + tile(THUMB1, TITLE1, st="done") + tile(THUMB2, TITLE2, st="done") + '</div>')
    inner = (f'{orbs()}<div class="card" style="padding:52px 64px 50px"><div class="top"></div>'
             f'<div class="cols" style="gap:64px;align-items:center"><div class="r">{left}</div>'
             f'<div class="l" style="flex-basis:520px">{right}</div></div></div>')
    return inner + lower_third("The community · link in the description")


add("end-card-cta", end_card(0), cls="endc")
for s in range(1, 4):
    add(f"end-card-cta-s{s}", end_card(s), cls="endc")

ENDC_CSS = """
.frame.endc{justify-content:flex-start;padding-top:56px}
.endc .tile .tt{font-size:22px;line-height:1.28;margin-top:10px}
.endc .rows .row .v{font-size:46px}
"""


def build_html():
    css = (REF / "container-canonical.css").read_text(encoding="utf-8")
    body = "\n".join(f'<div class="frame {cls}" id="{fid}" data-kind="{kind}">{inner}</div>'
                     for fid, kind, inner, cls in FRAMES)
    html = (f'<!doctype html><html><head><meta charset="utf-8"><link href="{FONTS}" rel="stylesheet">'
            f'<style>{css}</style><style>{LOCAL}{ENDC_CSS}</style></head><body>\n{body}\n</body></html>\n')
    (HERE / "containers.html").write_text(html, encoding="utf-8")


# Fit the Elegant Promo bars to their titles (the 2022 bars were not fitted to the text; scene 1's sits 26 px left of the
# title with a few px right; here: 26 px left pad, 46 px right pad, min 420 px) and centre the centred pieces.
FIT_EP = """(el)=>{
  const bar=el.querySelector('.bar'), tt=el.querySelector('.tt'); if(!bar) return;
  const w=Math.max(420, Math.ceil(tt.getBoundingClientRect().width)+72);
  bar.style.width=w+'px';
  const a=bar.dataset.anchor;
  if(a==='center'){bar.style.left=Math.round((1920-w)/2)+'px';}
  const b=bar.getBoundingClientRect(), f=el.getBoundingClientRect();
  if(tt.dataset.center){tt.style.left=Math.round(b.left-f.left+(w-tt.getBoundingClientRect().width)/2)+'px';}
  el.querySelectorAll('[data-hcenter]').forEach(n=>{n.style.left=Math.round((1920-n.getBoundingClientRect().width)/2)+'px';});
}"""

CHECK = """(el)=>{
  const r=el.getBoundingClientRect(); const out=[];
  if(Math.round(r.width)!==1920||Math.round(r.height)!==1080) out.push('frame size '+r.width+'x'+r.height);
  if(/\\u2014/.test(el.innerText)) out.push('em dash');
  if(/\\$/.test(el.innerText)) out.push('dollar sign');
  el.querySelectorAll('img').forEach(i=>{if(!i.complete||i.naturalWidth===0) out.push('image not loaded: '+i.src.slice(-60));});
  el.querySelectorAll('.ey,h1,p,.row,.v,.card,.rows,.tile,.tt,.sub,.src,.bar,.l3,.st,.who,.vs').forEach(n=>{
    const b=n.getBoundingClientRect();
    if(b.width===0) return;
    if(b.left-r.left<40||r.right-b.right<40||b.top-r.top<30||r.bottom-b.bottom<30) out.push('near edge: '+n.className+' '+[b.left-r.left,b.top-r.top,b.right-r.left,b.bottom-r.top].map(Math.round));
    if(n.scrollWidth>n.clientWidth+1&&n.clientWidth>0&&getComputedStyle(n).display!=='inline'&&!n.classList.contains('tt')) out.push('overflow: '+n.className+' '+n.innerText.slice(0,30));
  });
  const c=el.querySelector('.card'); if(c){const cb=c.getBoundingClientRect();
    c.querySelectorAll('.row,.tile,h1,.ey,p,.st,.who,.vs,.roi,.attr').forEach(n=>{const b=n.getBoundingClientRect();
      if(b.right>cb.right-30||b.bottom>cb.bottom-20||b.left<cb.left+30) out.push('outside card padding: '+n.className+' '+n.innerText.slice(0,30));});
    const l3=el.querySelector('.l3'); if(l3){const lb=l3.getBoundingClientRect(); if(lb.top<cb.bottom+24) out.push('lower-third overlaps card');}
    out.push('card box '+[cb.left-r.left,cb.top-r.top,cb.width,cb.height].map(Math.round).join(','));}
  const tt=el.querySelector('.ep .tt'), bar=el.querySelector('.ep .bar');
  if(tt&&bar){const a=tt.getBoundingClientRect(), b=bar.getBoundingClientRect();
    if(a.left<b.left+10||a.right>b.right-10) out.push('ep title outside its bar');
    out.push('ep bar '+[b.left-r.left,b.top-r.top,b.width,b.height].map(Math.round).join(','));}
  return out}"""


def main():
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    build_html()
    OUT.mkdir(parents=True, exist_ok=True)
    problems, skipped = [], []
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
        pg.goto((HERE / "containers.html").as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for fam, w in [("Playfair Display", 900), ("DM Sans", 600), ("JetBrains Mono", 600), ("Roboto", 900), ("Roboto", 400)]:
            ok = pg.evaluate("([f,w])=>document.fonts.check(`${w} 40px '${f}'`)&&[...document.fonts].some(x=>{if(x.family.replace(/\"/g,'')!==f||x.status!=='loaded')return false;const r=String(x.weight).split(' ').map(Number);return r.length>1?(w>=r[0]&&w<=r[1]):r[0]===w;})", [fam, w])
            if not ok:
                problems.append(f"FONT NOT LOADED: {fam} {w}")
        print("fonts:", pg.evaluate("[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight))]"))
        for fid, kind, _, _ in FRAMES:
            if only and fid not in only and not any(fid.startswith(o + "-") for o in only):
                continue
            el = pg.locator(f"#{fid}")
            if kind.startswith("ep"):
                el.evaluate(FIT_EP)
                if kind == "ep":
                    plate = EP[fid]["plate"]
                    if not (IMG / plate).exists():
                        skipped.append(f"{fid}: plate {plate} not on disk yet")
                        continue
            for msg in el.evaluate(CHECK):
                if msg.startswith(("card box ", "ep bar ")):
                    print(f"  {fid}: {msg}")
                else:
                    problems.append(f"{fid}: {msg}")
            path = OUT / f"{fid}.png"
            if kind == "ep-ov":
                pg.evaluate("document.body.style.background='transparent'")
                raw = el.screenshot(type="png", omit_background=True)
                pg.evaluate("document.body.style.background=''")
                img = Image.open(io.BytesIO(raw)).convert("RGBA").convert("RGBa").resize((1920, 1080), Image.LANCZOS).convert("RGBA")
            else:
                img = Image.open(io.BytesIO(el.screenshot(type="png"))).convert("RGB").resize((1920, 1080), Image.LANCZOS)
            img.save(path)
            print("wrote", path)
        br.close()
    for s in skipped:
        print("SKIPPED", s)
    if problems:
        print("\n".join(["PROBLEMS:"] + problems))
        sys.exit(1)
    print("GATES PASS")


if __name__ == "__main__":
    main()
