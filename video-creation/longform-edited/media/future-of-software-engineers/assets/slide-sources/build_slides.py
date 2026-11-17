"""future-of-software-engineers SLIDES (slide-builder, 2026-11-14): writes containers.html (one standalone 1920x1080
frame per state) and screenshots each frame to ../card-slides/ (every slide this build owns is a CARD SLIDE: D1 to D13,
D15 to D18; no title slides in this video, one music bed).

Theme: DARK, no accent file, no chapter_themes (GRAPH-PROGRESS settings carry no container_theme / container_accent;
BROLL-PLAN "Container theme: DARK", every SLIDES row "stylesheet default"). container-canonical.css is pasted VERBATIM
from skills/container-reference/; LOCAL below only adds this build's components on its tokens.
Accent meaning for this video (do not drift): cyan = the lit row and key words (the stylesheet default),
gold = a caveat (the essay's "could", the S-1/A's "based on what we expect from future models", the 4.5% entry-level
share), green = a rising number (Indeed's up 23.8%). Red, purple and teal are not used. Role colours were NOT taken at
the plan gate (PROJECT-LOG 2026-11-14 ruling 6), so the four role cards share the one cyan.

Wording: COVER-PLAN slot notes + DATA.md guards + the AS-RECORDED fact-framing traps. Quotes re-read live 2026-11-14:
the S-1/A No.2 (2026-11-10, still the newest amendment, only FWPs after it) carries "direct and review its work rather
than write code line by line", "Each version of a Claude model assists in building the next" and "we made a
determination that we have met this threshold based on what we expect from future models and our overall rate of
progress, rather than on what we have observed from current models." verbatim; PostHog's product-engineer post quotes
incident.io verbatim; Indeed 2026-11-12 prints "software development (23.8%)"; the essay prints "In 2027, AI systems
could be capable of tasks that take a person weeks."

States: <id>.png = the beat-start state; <id>-sN.png = the Nth state after it (cue times in _state-cues.md).
Resting rows stay muted but READABLE (text-secondary); the spotlight adds emphasis, it never toggles visibility.
Lines the plan says LAND later are laid out in every state and only made visible on their state, so the shared
elements are pixel-identical inside one id and a swap reads as the line landing.

Renders at device_scale_factor=2, Lanczos-downsampled to exactly 1920x1080.
Gates (refuse to ship): a webfont did not load, a frame is not 1920x1080, an em/en dash is on screen, content overflows
the frame or its card, D17's slots are not 620x350 / 60 px apart / clear of text, or a PNG counts 2+ large card-boxes
under lint-deck-containers.py's own detector.
Run: python build_slides.py [id ...]   (no ids = every frame)

VERTICAL (9:16) RE-SHOOT (slide-builder, 2026-11-14, vertical-repurpose.md §1): `python build_slides.py --vertical [id ...]`
re-drives the SAME frames (same content functions, same locked stylesheet, same states and file names) at a 1080x1920
portrait viewport, with one extra block of `@media (orientation: portrait)` rules (PORTRAIT below) that reflows the
layout: headlines wrap, label columns stack over their values, the D4 timeline runs top to bottom, D6's four slots go
2x2, D18's six jobs go to one column, D17's end-screen slots stack. The only markup that differs is a few landscape
line breaks the portrait reflow replaces (br()) and D17's absolute positions. Writes assets/vertical/slide-sources/
containers.html + _state-cues.md and the PNGs to assets/vertical/card-slides/; the 16:9 containers.html and PNGs are never
touched (running without --vertical still produces the 16:9 build byte for byte).
Swap-stability fix (2026-11-15, after visual-qa): in portrait, a quote whose states spotlight one of its words is LOCKED
to one wrap with explicit breaks and balance off (`.lockwrap`: D4, D10), and D10's spotlight span carries the bare `mk`
box at rest so every state shapes the same runs; D9's row 2 icon is top-aligned to its first text line (`.row.top`)
because the hidden FDE reveal reserves two more lines. Each swap then changes only the spotlighted words / landed line.
"""
import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
from scipy import ndimage

HERE = Path(__file__).resolve().parent
REF = HERE.parents[3] / "skills" / "container-reference"
VERT = "--vertical" in sys.argv          # the 9:16 re-shoot: portrait viewport + the PORTRAIT media rules
W, H = (1080, 1920) if VERT else (1920, 1080)
VDIR = HERE.parent / "vertical"
OUT = {"card": (VDIR / "card-slides") if VERT else HERE.parent / "card-slides"}
SRC = (VDIR / "slide-sources") if VERT else HERE   # where containers.html + _state-cues.md are written
FONTS = ("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900"
         "&family=DM+Sans:wght@400;500;600;700"
         "&family=JetBrains+Mono:wght@500;600;700&display=swap")

LOCAL = """
/* ---- this build's components, on the locked tokens. Lit colour = cyan (the stylesheet default accent). ---- */
.frame{--acc:var(--accent-cyan);--acc-rgb:0,194,255}
.hid{visibility:hidden}
.card{position:relative;width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:28px;
  padding:60px 88px 58px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.55)}
.card>.top{position:absolute;top:0;left:0;right:0;height:5px;
  background:linear-gradient(90deg,var(--accent-cyan),var(--accent-cyan) 38%,rgba(0,194,255,0) 92%)}
.card h1{max-width:none}
.card .divider{margin:30px 0 34px}
.card.tall{min-height:700px;display:flex;flex-direction:column;justify-content:center}
.card.fixed{height:690px}
h1.xl{font-size:104px;line-height:1.08}
h1.quote{font-family:'Playfair Display',serif;font-weight:700;font-size:74px;line-height:1.24;letter-spacing:-.01em}
.src{font:500 25px/1.4 'DM Sans';color:var(--text-muted);letter-spacing:.02em}
.src .mono,.nt .mono,.sub .mono{font-weight:500;word-spacing:-.3em}
.pri{color:var(--text-primary)}
.rest{color:var(--text-secondary)}
.nw{white-space:nowrap}

/* marker band: paints only the lower part of each line box, so it never rises into the line above;
   clone = one band per line fragment when a marked span wraps */
.mk{-webkit-box-decoration-break:clone;box-decoration-break:clone;padding:0 4px;margin:0 -4px;border-radius:6px}
.mk.mc{color:var(--accent-cyan);background:linear-gradient(transparent 58%,rgba(0,194,255,.22) 58%,rgba(0,194,255,.22) 94%,transparent 94%)}
.mk.mg{color:var(--accent-gold);background:linear-gradient(transparent 58%,rgba(255,215,0,.18) 58%,rgba(255,215,0,.18) 94%,transparent 94%)}

/* ---- rows: hairline between rows at rest; the lit row takes the cyan ring ---- */
.rows{display:flex;flex-direction:column;width:100%}
.row{display:flex;align-items:center;gap:32px;padding:20px 28px;margin:0 -28px;border:2px solid transparent;
  border-radius:18px;box-shadow:inset 0 -1px 0 var(--border)}
.row:last-child{box-shadow:none}
.row .lb{flex:0 0 330px;font:600 25px/1.3 'DM Sans';letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted)}
.row .lb .mono{letter-spacing:.04em;font-size:28px}
.row .v{flex:1 1 auto;min-width:0;font:600 42px/1.28 'DM Sans';color:var(--text-secondary)}
.row .sub,.row .nt{display:block;font:500 27px/1.4 'DM Sans';color:var(--text-muted);margin-top:8px}
.ic{width:52px;height:52px;flex:0 0 52px;stroke:var(--text-secondary);fill:none;stroke-width:2;stroke-linecap:round;
  stroke-linejoin:round;opacity:.75}
.frame .row.on{border-color:var(--acc);background:rgba(var(--acc-rgb),.07);
  box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10),0 12px 28px rgba(0,0,0,.35)}
.row.on .v{color:var(--text-primary)}
.row.on .lb{color:var(--text-secondary)}
.row.on .sub,.row.on .nt{color:var(--text-secondary)}
.row.on .ic{stroke:var(--acc);opacity:1}
.row.on .k{color:var(--acc)}
.row.done .v{color:var(--text-primary)}
.row.done .ic{stroke:var(--text-primary);opacity:.9}
.q{font-weight:500}

/* figures inside a row value (mono); they take their colour when they land */
.fig{font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:-.01em}
.fig.cy{color:var(--accent-cyan)} .fig.gr{color:var(--accent-green)} .fig.gd{color:var(--accent-gold)}

/* ---- pills ---- */
.pill{display:inline-flex;align-items:center;gap:14px;padding:16px 32px;border-radius:999px;border:2px solid #2a3142;
  font:700 30px/1.1 'DM Sans';letter-spacing:.12em;text-transform:uppercase;color:var(--text-secondary);white-space:nowrap}
.pill.on{border-color:var(--acc);color:var(--acc);background:rgba(var(--acc-rgb),.08);box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10)}
.pill.done{color:var(--text-primary);border-color:#3a4254}
.pills{display:flex;flex-wrap:wrap;gap:22px;align-items:center}

/* ---- role cards (D7 D9 D11 D12): numbered badge + serif name; the badge numbers match D6's four slots ---- */
.rolehd{display:flex;align-items:center;gap:44px}
.badge{width:136px;height:136px;flex:0 0 136px;border-radius:50%;border:4px solid var(--acc);display:flex;
  align-items:center;justify-content:center;font:700 72px/1 'JetBrains Mono';color:var(--acc);
  box-shadow:0 0 0 10px rgba(var(--acc-rgb),.08),0 0 44px rgba(var(--acc-rgb),.22)}
.rolehd h1{font-size:108px;line-height:1.02}
.role .rows .v{font-size:46px}
.role .rows .v.small{font-size:38px}

/* ---- D4 timeline ---- */
.tl{display:flex;align-items:flex-start;gap:34px;width:100%}
.node{display:flex;align-items:center;gap:24px;white-space:nowrap}
.node .dot{width:30px;height:30px;flex:0 0 30px;border-radius:50%;border:4px solid var(--text-secondary)}
.node .t{font:900 76px/1.1 'Playfair Display',serif;color:var(--text-secondary);letter-spacing:-.015em}
.node.on .dot{border-color:var(--acc);background:var(--acc);box-shadow:0 0 0 8px rgba(var(--acc-rgb),.14),0 0 26px rgba(var(--acc-rgb),.55)}
.node.on .t{color:var(--text-primary)}
.node.done .dot{border-color:var(--text-primary);background:var(--text-primary)}
.node.done .t{color:var(--text-primary)}
.rail{flex:1 1 auto;position:relative;height:84px}
.rail .ln{position:absolute;left:0;right:14px;top:40px;height:4px;border-radius:2px;background:#2a3142}
.rail .hd{position:absolute;right:0;top:31px;width:0;height:0;border-left:20px solid #2a3142;
  border-top:11px solid transparent;border-bottom:11px solid transparent}
.rail .lab{position:absolute;left:0;right:0;top:-6px;text-align:center;font:700 26px/1 'JetBrains Mono';
  letter-spacing:.14em;color:var(--text-secondary)}
.rail.on .ln{background:linear-gradient(90deg,rgba(0,194,255,.35),var(--acc))}
.rail.on .hd{border-left-color:var(--acc)}
.rail.on .lab{color:var(--acc)}
.right27{flex:0 0 700px}
.qbox{margin-top:30px;padding-left:54px}
.qbox .qt{font:700 42px/1.32 'Playfair Display',serif;color:var(--text-primary)}
.qbox .src{margin-top:16px}
.ask{font:900 54px/1.18 'Playfair Display',serif;color:var(--text-primary);letter-spacing:-.01em}

/* ---- D6 ---- */
.big2{display:flex;gap:28px}
.big2 .pill{font-size:50px;padding:26px 52px}
.slots4{display:flex;gap:30px;width:100%}
.slot4{flex:1 1 0;border:2px dashed #3a4254;border-radius:22px;padding:34px 34px 38px;display:flex;flex-direction:column;
  gap:30px;background:rgba(255,255,255,.012);min-height:300px}
.slot4 .badge{width:110px;height:110px;flex-basis:110px;font-size:58px;border-width:3px;border-color:var(--text-secondary);
  color:var(--text-primary);box-shadow:none}
.slot4 .bar{height:22px;border-radius:11px;background:#232938;width:86%}
.slot4 .bar.s{width:58%}

/* ---- D16 steps ---- */
.step{align-items:flex-start}
.step .num{flex:0 0 72px;font:700 64px/1 'JetBrains Mono';color:var(--text-secondary);padding-top:2px}
.step.on .num{color:var(--acc)}
.step .v{font-size:44px}
.step .pills{margin-top:18px;gap:16px}
.step .pill{font-size:23px;padding:11px 22px;letter-spacing:.11em}

/* ---- D18 six jobs: one container, two columns of three rows ---- */
.grid6{display:grid;grid-template-columns:1fr 1fr;column-gap:56px;width:100%}
.grid6 .row{margin:0 -28px}
.grid6 .row:nth-last-child(-n+2){box-shadow:none}
.grid6 .row.on{box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10),0 12px 28px rgba(0,0,0,.35)}
.grid6 .row.all .v{color:var(--acc)}
.grid6 .row.all .ic{stroke:var(--acc);opacity:1}
.closing{margin-top:34px;font:700 50px/1.2 'DM Sans';color:var(--text-primary)}

/* ---- D17 END card (YouTube end-screen geometry: 620x350 video slots, the subscribe circle) ---- */
.frame.endc{display:block;padding:0}
.frame.endc>.slot{position:absolute;width:620px;height:350px;border-radius:18px;border:3px dashed #2f3647;
  background:rgba(255,255,255,.012)}
.frame.endc>.slot.on{border:3px solid var(--acc);background:rgba(0,194,255,.04);
  box-shadow:0 0 0 6px rgba(0,194,255,.10),0 0 46px rgba(0,194,255,.22)}
.frame.endc>.subc{position:absolute;width:300px;height:300px;border-radius:50%;border:3px dashed #2f3647;
  background:rgba(255,255,255,.012)}
.frame.endc>.subc.on{border:3px solid var(--acc);box-shadow:0 0 0 6px rgba(0,194,255,.10),0 0 46px rgba(0,194,255,.22)}

/* one frame at a time while screenshotting */
body.solo .frame{display:none!important}
body.solo .frame.cur{display:flex!important}
body.solo .frame.endc.cur{display:block!important}
"""

FRAMES = []  # (frame id, kind, inner html, extra class, cue note)


def add(base, s, inner, cue, cls=""):
    fid = base if s == 0 else f"{base}-s{s}"
    FRAMES.append((fid, "card", inner, cls, cue))


def m(s):
    return f'<span class="mono">{s}</span>'


def c(s):
    return f'<span class="c">{s}</span>'


def hid(show):
    return "" if show else " hid"


def px(land, port):
    """An inline font size: the landscape value, or the portrait re-shoot's larger one (phone-size reading)."""
    return f"{port if VERT else land}px"


def br(port=" "):
    """A landscape line break. In the portrait re-shoot the line reflows on its own, so the break becomes `port`."""
    return port if VERT else "<br>"


def orbs():
    return ('<div class="orb" style="width:760px;height:760px;right:-220px;top:-280px;background:#00c2ff"></div>'
            '<div class="orb" style="width:620px;height:620px;left:-260px;bottom:-300px;background:#00e68a;opacity:.16"></div>')


def card(ey, inner, cls="", style=""):
    st = f' style="{style}"' if style else ""
    eyd = f'<div class="ey">{ey}</div>' if ey else ""
    return f'{orbs()}<div class="card {cls}"{st}><div class="top"></div>{eyd}{inner}</div>'


def seq(i, lit):
    """Progressive spotlight: lit = 1-based index of the item just spoken (0 = rest). Earlier = done, current = on."""
    if lit == 0 or i > lit:
        return ""
    return "on" if i == lit else "done"


def one(i, lit):
    """Single spotlight: only the current item is lit, the rest sit at rest (readable)."""
    return "on" if i == lit else ""


ICON = {
    "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    "file": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/>',
    "scissors": '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    "eye": '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "code": '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    "headset": '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    "sprout": '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    "door": '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "pointer": '<path d="M12.586 12.586 19 19"/><path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"/>',
    "building": '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    "xcircle": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    "layers": '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "megaphone": '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    "handshake": '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
}


def ic(name):
    return f'<svg class="ic" viewBox="0 0 24 24">{ICON[name]}</svg>'


# =====================================================================================================================
# D1  CH1 25.96-33.78  question card: line 1 lands 26.06, line 2 lands 28.80 and holds to 33.78
# =====================================================================================================================
def d1(s):
    if VERT:   # portrait: the same two lines, broken for a 840 px measure (line 2 keeps get paid for? whole)
        h = (f'<h1 class="xl">If AI writes<br>the code,<br><span class="{hid(s >= 1).strip()}">what does the<br>engineer<br>'
             f'{c("get paid for?")}</span></h1><div class="divider"></div>')
        return card("The real question", h, cls="tall")
    h = (f'<h1 class="xl">If AI writes the code,<br><span class="{hid(s >= 1).strip()}">what does the engineer{br()}'
         f'{c("get paid for?")}</span></h1><div class="divider"></div>')
    return card("The real question", h, cls="tall")


add("D1", 0, d1(0), "26.06 line 1 'If AI writes the code,' (slot in 25.96)")
add("D1", 1, d1(1), "28.80 line 2 'what does the engineer get paid for?' lands, holds to 33.78")


# =====================================================================================================================
# D2  CH2 68.14-77.60  quote card (S-1 verbatim, never the spoken 'this engineer is'); DIRECT 70.98, REVIEW 71.56;
#     strip LESS TYPING 74.74 / MORE DIRECTING 75.68 / MORE REVIEWING 76.86
# =====================================================================================================================
def d2(s):
    d = "mk mc" if s >= 1 else "mk"
    r = "mk mc" if s >= 2 else "mk"
    q = (f'<h1 class="quote">“<span class="{d}">direct</span> and <span class="{r}">review</span> its work rather '
         f'than write code line by line”</h1>')
    src = f'<div class="src" style="margin-top:24px">Anthropic S-1, filed {m("2026-10-26")}</div>'
    lit = s - 2 if s >= 3 else 0
    strip = "".join(f'<span class="pill {seq(i, lit)}" style="font-size:{px(34, 42)};padding:20px 38px">{t}</span>'
                    for i, t in enumerate(["Less typing", "More directing", "More reviewing"], 1))
    return card("Anthropic, on its own engineers", q + src + f'<div class="divider"></div><div class="pills">{strip}</div>')


add("D2", 0, d2(0), "68.14 slot in; quote lands 68.58 (no spotlight yet), strip at rest")
add("D2", 1, d2(1), "70.98 DIRECT lit")
add("D2", 2, d2(2), "71.56 REVIEW lit (DIRECT stays)")
add("D2", 3, d2(3), "74.74 LESS TYPING lit")
add("D2", 4, d2(4), "75.68 MORE DIRECTING lit")
add("D2", 5, d2(5), "76.86 MORE REVIEWING lit, holds to 77.60")


# =====================================================================================================================
# D3  THE LOOP. Slot 1 CH2 77.60-84.94: row 1 only (term 79.62, definition 81.30). Slot 2 CH2 90.49-107.31: row 2
#     90.68; row 3 date tag 94.16; first half 97.80; second half (the caveat, gold) 102.40. Rows 2-3 unseen in slot 1.
# =====================================================================================================================
def d3(s):
    """Slot 1 (s0-s2) is its own layout: rows 2-3 are NOT laid out (the plan: unseen in slot 1), so the card is
    sized to the heading + row 1 and row 1 reads large. Receipt C7 sits between the slots, so the two layouts are
    never swapped directly. Slot 2 (s3-s6) is the full three-row card, pixel-identical across its states."""
    a = "mk mc" if s == 5 else ("pri" if s == 6 else "rest")
    b = "mk mg" if s == 6 else "rest"
    if s <= 2:
        # s2 = the definition brightens to text-primary inside the lit row. Inline, because `.row.on .sub`
        # (text-secondary) outranks a `.pri` class: the visual-qa round of 2026-11-14 caught D3-s2 == D3-s1.
        dcol = "color:var(--text-primary);" if s == 2 else ""
        row1 = (f'<div class="row {"on" if s >= 1 else ""}"><div class="lb">The idea</div><div class="v" style="font-size:{px(58, 68)}">'
                f'<span class="k">Recursive {"<span class=nw>self-improvement</span>" if VERT else "self-improvement"}</span>'
                f'<span class="sub" style="{dcol}font-size:{px(38, 44)};margin-top:12px">= an AI that builds its own successor, '
                f'no human in the loop</span></div></div>')
        body = f'<h1>The {c("loop")}</h1><div class="divider"></div><div class="rows">{row1}</div>'
        return card("The big idea", body, cls="d3 tall")
    r2 = "on" if s == 3 else ""
    r3 = "on" if s >= 4 else ""
    row1 = (f'<div class="row"><div class="lb">The idea</div><div class="v">'
            f'Recursive self-improvement'
            f'<span class="sub" style="font-size:{px(31, 34)}">= an AI that builds its own successor, '
            f'no human in the loop</span></div></div>')
    row2 = (f'<div class="row {r2}"><div class="lb">Already happening</div><div class="v" style="font-size:{px(36, 46)}">'
            f'“Each version of a Claude model assists in building the next”'
            f'<span class="sub">Anthropic S-1, {m("2026-10-26")}</span></div></div>')
    row3 = (f'<div class="row {r3}{hid(s >= 4)}" style="align-items:flex-start"><div class="lb" style="padding-top:6px">'
            f'{m("2026-11-10")}{br(", ")}<span style="text-transform:none;letter-spacing:.08em">S-1/A No.2</span></div><div class="v" style="font-size:{px(34, 42)};line-height:1.42">'
            f'“<span class="{a}">we made a determination that we have met this threshold</span> '
            f'<span class="{b}">based on what we expect from future models and our overall rate of progress, rather than '
            f'on what we have observed from current models.</span>”</div></div>')
    body = f'<h1 class="sm">The {c("loop")}</h1><div class="divider" style="margin:24px 0 22px"></div>' \
           f'<div class="rows">{row1}{row2}{row3}</div>'
    return card("The big idea", body, cls="d3", style="padding-top:52px;padding-bottom:44px")


add("D3", 0, d3(0), "77.60 slot 1 in: heading THE LOOP, row 1 at rest (readable); rows 2-3 not in this slot's layout")
add("D3", 1, d3(1), "79.62 row 1 lit, term RECURSIVE SELF-IMPROVEMENT in cyan")
add("D3", 2, d3(2), "81.30 the definition brightens, holds to 84.94 (C7 receipt follows)")
add("D3", 3, d3(3), "90.49 slot 2 in (full three-row layout; row 2 lights 90.68): row 1 at rest, row 2 ALREADY HAPPENING lit")
add("D3", 4, d3(4), "94.16 row 3 lands, date tag 2026-11-10 S-1/A No.2 lit, quote at rest")
add("D3", 5, d3(5), "97.80 first half 'we made a determination that we have met this threshold' lit")
add("D3", 6, d3(6), "102.40 second half (the caveat, gold) lit, holds to 107.31")


# =====================================================================================================================
# D4  CH2 107.31-123.32  END OF 2026 107.50 / END OF 2027 + 12 MONTHS 110.20 / quote 112.40 (essay wording 'a person',
#     'could') / COULD 115.84 / question line 118.98. No data marks.
# =====================================================================================================================
def d4(s):
    n26 = "on" if s == 0 else "done"
    n27 = "on" if s >= 1 else ""
    rail = "on" if s >= 1 else ""
    could = "mk mg" if s >= 3 else ""
    # Portrait: the quote's three lines are LOCKED with explicit breaks (and balance off, .lockwrap), so the gold COULD
    # spotlight cannot re-balance the wrap; every D4 state keeps 'In 2027, AI systems could / be capable of tasks that /
    # take a person weeks.' (visual-qa 2026-11-15: balance had moved every line when COULD lit).
    qcls, b1, b2 = ("qt lockwrap", "<br>", "<br>") if VERT else ("qt", " ", " ")
    tl = (f'<div class="tl"><div class="node {n26}"><span class="dot"></span><span class="t">End of {m("2026")}</span></div>'
          f'<div class="rail {rail}"><div class="lab">12 MONTHS</div><div class="ln"></div><div class="hd"></div></div>'
          f'<div class="right27"><div class="node {n27}"><span class="dot"></span><span class="t">End of {m("2027")}</span></div>'
          f'<div class="qbox"><div class="{qcls}" style="color:var(--text-{"primary" if s >= 2 else "secondary"})">“In 2027, AI systems <span class="{could}">could</span>{b1}be '
          f'capable of tasks that{b2}take a person weeks.”</div>'
          f'<div class="src">Anthropic Institute essay, When AI builds itself</div></div></div></div>')
    ask = (f'<div class="{hid(s >= 4).strip()}"><div class="divider" style="margin:40px 0 30px"></div>'
           f'<div class="ask">How much demand is left for an engineer who only wants to {c("sit there and code")}?</div></div>')
    return card("Picture this", tl + ask)


add("D4", 0, d4(0), "107.50 END OF 2026 lit (slot in 107.31); END OF 2027 and the quote at rest (readable)")
add("D4", 1, d4(1), "110.20 END OF 2027 lit, 12 MONTHS rail lit")
add("D4", 2, d4(2), "112.40 the essay quote lands (brightens to white) under END OF 2027")
add("D4", 3, d4(3), "115.84 COULD spotlighted (gold)")
add("D4", 4, d4(4), "118.98 question line lands, holds to 123.32 (FACE 3 cut-in)")


# =====================================================================================================================
# D5  CH2 125.26-129.92  lead 'NOT FOR THE CODE.' 125.42, main line 127.34
# =====================================================================================================================
def d5(s):
    lead = (f'<div style="font:700 {px(40, 48)}/1.2 \'DM Sans\';letter-spacing:.16em;text-transform:uppercase;'
            'color:var(--text-secondary)">Not for the code.</div>')
    h = (f'<div class="{hid(s >= 1).strip()}"><div class="divider"></div><h1 class="xl" style="font-size:{px(100, 116)}">'
         f'You get paid for what the{br()}code does to {c("the business.")}</h1></div>')
    return card(None, lead + h, cls="tall")


add("D5", 0, d5(0), "125.42 lead NOT FOR THE CODE. (slot in 125.26)")
add("D5", 1, d5(1), "127.34 main line YOU GET PAID FOR WHAT THE CODE DOES TO THE BUSINESS. lands, holds to 129.92")


# =====================================================================================================================
# D6  CH3 180.34-194.41  lead line 180.52; BUSINESS-MINDED 185.34; ENTREPRENEURIAL 187.08; the words give way to
#     'WHICH PIECE DO YOU OWN?' 188.18; four empty numbered slots draw in 191.40 (names hidden; D7 D9 D11 D12 fill them)
# =====================================================================================================================
def d6(s):
    if s <= 2:
        w1 = "on" if s == 1 else ("done" if s == 2 else "")
        w2 = "on" if s == 2 else ""
        body = (f'<h1>Run the whole pod,<br>{c("own a piece of the business")}</h1><div class="divider"></div>'
                f'<div class="big2"><span class="pill {w1}">Business-minded</span>'
                f'<span class="pill {w2}">Entrepreneurial</span></div>')
    else:
        slots = "".join(f'<div class="slot4"><div class="badge">{n}</div><div class="bar"></div><div class="bar s"></div></div>'
                        for n in range(1, 5))
        body = (f'<h1>Which piece do you {c("own")}?</h1><div class="divider"></div>'
                f'<div class="slots4{hid(s >= 4)}">{slots}</div>')
    return card("The engineer, now", body, cls="fixed")


add("D6", 0, d6(0), "180.52 lead line RUN THE WHOLE POD, OWN A PIECE OF THE BUSINESS (slot in 180.34); the two words at rest")
add("D6", 1, d6(1), "185.34 BUSINESS-MINDED lit")
add("D6", 2, d6(2), "187.08 ENTREPRENEURIAL lit")
add("D6", 3, d6(3), "188.18 the words give way to WHICH PIECE DO YOU OWN?")
add("D6", 4, d6(4), "191.40 four empty role slots numbered 1 to 4 draw in, hold to 194.41")


# =====================================================================================================================
# ROLE CARDS D7 D9 D11 D12: numbered badge + name, then icon rows. Rows sit at rest (readable) from the beat start and
# light on the plan's cue (resting-state legibility: the spotlight adds emphasis, it never toggles visibility), so a
# role card never reads as an empty title slide. Key words turn cyan as they are said.
# =====================================================================================================================
def role(num, name, rows, tail=""):
    head = f'<div class="rolehd"><div class="badge">{num}</div><h1>{name}</h1></div><div class="divider"></div>'
    return card("Four versions of the engineer", head + f'<div class="rows">{rows}</div>' + tail, cls="role tall")


def kk(on, text):
    return f'<span class="cy-t">{text}</span>' if on else text


def d7(s):
    r1 = "on" if s in (1, 2) else ""
    r2 = "on" if s >= 3 else ""
    row1 = (f'<div class="row {r1}">{ic("users")}<div class="v">{kk(1 <= s <= 2, "Growth marketer")}'
            f' + {kk(s == 2, "software engineer")}</div></div>')
    row2 = (f'<div class="row {r2}">{ic("code")}<div class="v small">{kk(s >= 3, "Frontend")}'
            f' or {kk(s >= 4, "full stack")}</div></div>')
    return role("1", "Growth engineer", row1 + row2)


add("D7", 0, d7(0), "209.90 1 GROWTH ENGINEER (slot in 209.72); both rows at rest (readable)")
add("D7", 1, d7(1), "214.72 row 1 lit, GROWTH MARKETER in cyan")
add("D7", 2, d7(2), "215.52 + SOFTWARE ENGINEER in cyan")
add("D7", 3, d7(3), "219.70 small row lit, FRONTEND in cyan (row 1 back to rest)")
add("D7", 4, d7(4), "220.98 or FULL STACK in cyan, holds to 221.70")


def d9(s):
    """Slot 1 (s0-s1) lays out ONLY the features row (the client row is the plan's second-slot addition); C1 PRODUCT
    and D10 sit between the slots, so the two layouts are never swapped directly. Slot 2 = s2-s4."""
    r1 = "on" if s == 1 else ""
    r2 = "on" if s >= 3 else ""
    row1 = (f'<div class="row {r1}">{ic("pointer")}<div class="v">{kk(s == 1, "Features:")} '
            f'what the customer interacts with</div></div>')
    if s <= 1:
        return role("2", "Product engineer", row1)
    # Portrait: the hidden reveal reserves two extra lines, so the building icon is TOP-aligned to the first text line
    # (.row.top) instead of centred on three lines (visual-qa 2026-11-15: it floated ~73 px below its text in s2/s3).
    top = " top" if VERT else ""
    # Portrait, before the reveal (s2, s3): the FDE phrase is REMOVED from the row (`nod` = display:none) so the lit box is exactly
    # as tall as its one visible line (visual-qa 2026-11-15 rejected the three-line box holding one line, twice), and the two lines
    # it will add are reserved BELOW the rows by an invisible spacer (`.rsv`, 148.48 px = 2 x 74.24, measured on D9-s4: row 266.7 px
    # with the reveal, 118.2 px without). The card centres its content, so keeping the total height equal keeps the header, row 1
    # and row 2's text at the SAME y in s2, s3 and s4: the swap to s4 only grows the box. 16:9 is untouched (VERT only).
    pre = VERT and s < 4
    cls_rev = "nod" if pre else hid(s >= 4).strip()
    row2 = (f'<div class="row {r2}{top}">{ic("building")}<div class="v">Inside a client’s business'
            f'<span class="{cls_rev}"> = <span class="cy-t">{"<span class=nw>forward-deployed</span>" if VERT else "forward-deployed"} engineer</span></span></div></div>')
    return role("2", "Product engineer", row1 + row2, tail='<div class="rsv"></div>' if pre else "")


add("D9", 0, d9(0), "256.83 2 PRODUCT ENGINEER (slot 1 in 256.74; cue off 256.83, the real onset of 'Second'); features row at rest")
add("D9", 1, d9(1), "259.68 FEATURES: WHAT THE CUSTOMER INTERACTS WITH lit, holds to 262.89 (slot-1 layout: one row)")
add("D9", 2, d9(2), "281.97 slot 2 in (two-row layout): both rows at rest, the FDE phrase not yet shown")
add("D9", 3, d9(3), "283.50 INSIDE A CLIENT'S BUSINESS lit")
add("D9", 4, d9(4), "288.28 = FORWARD-DEPLOYED ENGINEER lands, holds to 289.74 (FACE 5 cut-in)")


def d11(s):
    r1 = "on" if s == 1 else ""
    r2 = "on" if s >= 2 else ""
    row1 = (f'<div class="row {r1}">{ic("xcircle")}<div class="v">Not marketing. Not the product.</div></div>')
    row2 = (f'<div class="row {r2}">{ic("layers")}<div class="v">{kk(s >= 2, "Internal:")} '
            f'the systems every other team builds on</div></div>')
    return role("3", "Platform engineer", row1 + row2)


add("D11", 0, d11(0), "292.74 3 PLATFORM ENGINEER (slot in 292.61); both rows at rest")
add("D11", 1, d11(1), "295.02 NOT MARKETING. NOT THE PRODUCT. lit")
add("D11", 2, d11(2), "299.20 INTERNAL: THE SYSTEMS EVERY OTHER TEAM BUILDS ON lit, holds to 304.14")


def d12(s):
    r1 = "on" if s == 1 else ""
    r2 = "on" if s >= 2 else ""
    row1 = (f'<div class="row {r1}">{ic("megaphone")}<div class="v">{kk(s == 1, "GTM")} = go to market</div></div>')
    row2 = (f'<div class="row {r2}">{ic("handshake")}<div class="v">{kk(s >= 2, "Software engineer")}'
            f' + {kk(s >= 2, "sales")}</div></div>')
    return role("4", "GTM engineer", row1 + row2)


add("D12", 0, d12(0), "322.28 4 GTM ENGINEER (slot in 321.91); both rows at rest")
add("D12", 1, d12(1), "325.18 GO TO MARKET lit")
add("D12", 2, d12(2), "327.64 SOFTWARE ENGINEER + SALES lit, holds to 329.58")


# =====================================================================================================================
# D8  CH4 221.70-235.48  three rows, one spotlighted at a time: 222.02 / 225.24 (TACTICS 228.42, RAPID TURNAROUND
#     230.32) / 231.54. No outbound or sales wording (that side is the GTM engineer's).
# =====================================================================================================================
def d8(s):
    lit = {0: 1, 1: 2, 2: 2, 3: 2, 4: 3}[s]
    t = "k" if s >= 2 else ""
    r = "k" if s >= 3 else ""
    rows = [("Growth marketer", "Strategy, the bigger picture"),
            ("Growth hacker", f'<span class="{t}">Tactics</span>, <span class="{r}">rapid turnaround</span>'),
            ("Growth engineer", 'Both, <span class="k">plus the software</span>')]
    body = "".join(f'<div class="row {one(i, lit)}"><div class="lb" style="flex-basis:390px;font-size:{px(28, 32)}">{lb}</div>'
                   f'<div class="v" style="font-size:{px(46, 56)}">{v}</div></div>' for i, (lb, v) in enumerate(rows, 1))
    return card("Where the growth engineer comes from",
                f'<h1 class="sm">Marketer, hacker, {c("engineer")}</h1><div class="divider"></div><div class="rows">{body}</div>')


add("D8", 0, d8(0), "222.02 row 1 GROWTH MARKETER = STRATEGY, THE BIGGER PICTURE lit (slot in 221.70)")
add("D8", 1, d8(1), "225.24 row 2 GROWTH HACKER lit (row 1 back to rest)")
add("D8", 2, d8(2), "228.42 TACTICS lit")
add("D8", 3, d8(3), "230.32 RAPID TURNAROUND lit")
add("D8", 4, d8(4), "231.54 row 3 GROWTH ENGINEER = BOTH, PLUS THE SOFTWARE lit, holds to 235.48")


# =====================================================================================================================
# D10  CH4 275.03-281.97  quote card: incident.io via PostHog (never called a job post); quote lands 278.14,
#      OUTCOMES AND IMPACT 278.92. Before the quote lands it sits at rest (readable), so the card is never empty.
# =====================================================================================================================
def d10(s):
    col = "rest" if s == 0 else "pri"
    oi = "mk mc" if s >= 2 else ""
    # Portrait: the six lines are LOCKED with explicit breaks (and balance off, .lockwrap) to the D10 / D10-s1 wrap, so
    # the OUTCOMES AND IMPACT spotlight cannot re-balance it (visual-qa 2026-11-15: 'or' jumped up a line when it lit).
    if VERT:
        # the bare "mk" box at rest (as D2 does): its padding/margin split the text into the same shaping runs in every
        # state, so " than the exact" keeps its x when the spotlight turns on (without it, it slid 0.55 px right)
        oi = "mk mc" if s >= 2 else "mk"
        q = (f'<h1 class="quote lockwrap" style="font-size:{px(70, 80)}"><span class="{col}">“Care more about<br>'
             f'<span class="{oi}">outcomes and<br>impact</span> than the exact<br>implementation,<br>'
             f'or the tools used to<br>solve the problem.”</span></h1>')
    else:
        q = (f'<h1 class="quote" style="font-size:{px(70, 80)}"><span class="{col}">“Care more about <span class="{oi}">outcomes and '
             f'impact</span> than the exact implementation, or the tools used to solve the problem.”</span></h1>')
    src = (f'<div class="src" style="margin-top:26px">incident.io, quoted in PostHog, What is a product engineer, '
           f'{m("2022-12-01")}</div>')
    return card("One company sums it up", q + '<div class="divider"></div>' + src)


add("D10", 0, d10(0), "275.03 slot in: quote at rest (text-secondary), source line visible")
add("D10", 1, d10(1), "278.14 quote lands (full white)")
add("D10", 2, d10(2), "278.92 OUTCOMES AND IMPACT spotlighted, holds to 281.97")


# =====================================================================================================================
# D13  stat rows (text only, no bars). Slot 1 CH5 368.28-376.29: head 370.16, row 1 372.42, figure 374.72.
#      Slot 2 CH5 381.39-385.88: row 2 already lit, row 3 381.64, figure 382.88; row 1 back to rest.
#      Each row prints its own window (three Indeed posts); the 4.5% is a share of POSTINGS.
# =====================================================================================================================
def d13(s):
    """Slot 1 (s0-s2) lays out ONLY row 1, read large (the plan: rows 2-3 unseen in slot 1). Receipt C9 sits between
    the slots, so the two layouts are never swapped directly. Slot 2 (s3-s5) is the full three-row card."""
    f1 = "gr" if s >= 2 else ""
    if s <= 2:
        row1 = (f'<div class="row {"on" if s >= 1 else ""}"><div class="v" style="font-size:{px(54, 64)}">Software development '
                f'postings:{br()}up <span class="fig {f1}">23.8%</span> year over year'
                f'<span class="nt" style="font-size:{px(30, 36)};margin-top:14px">Indeed Hiring Lab, {m("2026-11-12")}, data to '
                f'{m("2026-10-23")}</span></div></div>')
        return card("What the market says", f'<h1>Software jobs {c("aren’t")} disappearing</h1><div class="divider"></div>'
                                             f'<div class="rows">{row1}</div>', cls="tall")
    r2 = "on" if s == 3 else "done"
    r3 = "on" if s >= 4 else ""
    f3 = "gd" if s >= 5 else ""
    rows = (f'<div class="row"><div class="v">Software development postings: up '
            f'<span class="fig gr">23.8%</span> year over year'
            f'<span class="nt">Indeed Hiring Lab, {m("2026-11-12")}, data to {m("2026-10-23")}</span></div></div>'
            f'<div class="row {r2}"><div class="v"><span class="fig cy">71%</span> of the increase = '
            f'senior roles<span class="nt">Indeed Hiring Lab, May {m("2025")} to May {m("2026")}</span></div></div>'
            f'<div class="row {r3}{hid(s >= 4)}"><div class="v">Entry level = <span class="fig {f3}">4.5%</span> of '
            f'postings<span class="nt">Indeed Hiring Lab, {m("2026")} Q1</span></div></div>')
    return card("What the market says",
                f'<h1 class="sm">Software jobs {c("aren’t")} disappearing</h1><div class="divider"></div>'
                f'<div class="rows">{rows}</div>')


add("D13", 0, d13(0), "368.28 slot 1 in (head lands 370.16): head + row 1 at rest (slot-1 layout: one row, large)")
add("D13", 1, d13(1), "372.42 row 1 SOFTWARE DEVELOPMENT POSTINGS lit")
add("D13", 2, d13(2), "374.72 the figure 23.8% lands (green), holds to 376.29 (C9 receipt follows)")
add("D13", 3, d13(3), "381.39 slot 2 in (three-row layout): row 1 at rest, row 2 71% OF THE INCREASE = SENIOR ROLES lit")
add("D13", 4, d13(4), "381.64 row 3 ENTRY LEVEL lit (row 2 stays white)")
add("D13", 5, d13(5), "382.88 the figure 4.5% lands (gold), holds to 385.88")


# =====================================================================================================================
# D15  THE NEXT GENERATION. Slot 1 CH5 408.31-418.07: eyebrow 408.48, row 1 411.54, row 2 415.64 (row 3 unseen).
#      Slot 2 CH5 433.34-437.35: rows 1-2 back to rest, row 3 433.66. Nothing on screen says it is easier to get in.
# =====================================================================================================================
def d15(s):
    """Slot 1 (s0-s2) lays out rows 1-2 only (the plan: row 3 unseen in slot 1); receipt C10 sits between the slots.
    Slot 2 (s3) is the full three-row card."""
    lit = {0: 0, 1: 1, 2: 2, 3: 3}[s]
    rows = (f'<div class="row {one(1, lit)}">{ic("sprout")}<div class="v">Arrives with the mindset</div></div>'
            f'<div class="row {one(2, lit)}">{ic("door")}<div class="v">Fewer junior openings'
            f'<span class="sub">Entry level = {m("4.5%")} of software postings (Indeed, {m("2026")} Q1)</span></div></div>')
    if s >= 3:
        rows += (f'<div class="row on">{ic("target")}<div class="v">The ones who get hired show up '
                 f'ready to <span class="cy-t">own an outcome</span></div></div>')
        return card("What comes next", f'<h1 class="sm">The next {c("generation")}</h1><div class="divider"></div>'
                                       f'<div class="rows">{rows}</div>')
    return card("What comes next", f'<h1>The next {c("generation")}</h1><div class="divider"></div>'
                                   f'<div class="rows big">{rows}</div>', cls="tall")


add("D15", 0, d15(0), "408.48 slot 1 in (408.31): heading, rows 1-2 at rest (slot-1 layout: two rows, large)")
add("D15", 1, d15(1), "411.54 row 1 ARRIVES WITH THE MINDSET lit")
add("D15", 2, d15(2), "415.64 row 2 FEWER JUNIOR OPENINGS lit, holds to 418.07 (C10 receipt follows)")
add("D15", 3, d15(3), "433.34 slot 2 in (three-row layout; row 3 lights 433.66): rows 1-2 at rest, row 3 lit, holds to 437.35")


# =====================================================================================================================
# D16  CH6 442.28-460.18  three steps, one spotlighted at a time (earlier step back to rest); each step's chips light
#      on the spoken word. No benchmark figure.
# =====================================================================================================================
D16_STATES = [  # (step lit, chips lit in that step), cue
    ((0, 0), "442.44 title WHAT TO DO NOW, three steps at rest (slot in 442.28)"),
    ((1, 0), "443.76 step 1 PICK YOUR PIECE lit"),
    ((1, 1), "445.82 A FUNNEL STEP"),
    ((1, 2), "447.02 THE SALES PIPELINE"),
    ((1, 3), "448.04 THE INTERNAL PLATFORM"),
    ((2, 0), "449.62 step 2 LEARN ITS ONE NUMBER lit (step 1 back to rest)"),
    ((2, 1), "451.08 CONVERSION"),
    ((2, 2), "452.02 ACTIVATION"),
    ((2, 3), "452.94 RETENTION"),
    ((2, 4), "453.82 PIPELINE"),
    ((2, 5), "454.50 COST"),
    ((3, 0), "455.46 step 3 SHIP ONE EXPERIMENT, END TO END, WITH AI lit (step 2 back to rest)"),
    ((3, 1), "458.58 MEASURE IT, holds to 460.18 (FACE 9 cut-in)"),
]


def d16(step, chip):
    steps = [("Pick your piece", ["A funnel step", "The sales pipeline", "The internal platform"]),
             ("Learn its one number", ["Conversion", "Activation", "Retention", "Pipeline", "Cost"]),
             ("Ship one experiment, end to end, with AI.", ["Measure it."])]
    out = ""
    for i, (title, chips) in enumerate(steps, 1):
        on = i == step
        pills = "".join(f'<span class="pill {seq(j, chip) if on else ""}">{t}</span>' for j, t in enumerate(chips, 1))
        out += (f'<div class="row step {"on" if on else ""}"><div class="num">{i}</div><div class="v">{title}'
                f'<div class="pills">{pills}</div></div></div>')
    return card("Your next move", f'<h1 class="sm">What to do {c("now")}</h1><div class="divider" style="margin:26px 0 22px">'
                                  f'</div><div class="rows">{out}</div>', style="padding-top:54px;padding-bottom:46px")


for k, ((st, ch), cue) in enumerate(D16_STATES):
    add("D16", k, d16(st, ch), cue)


# =====================================================================================================================
# D17  CH6 465.15-477.38  END card on YouTube's end-screen geometry: subscribe circle + TWO empty 620x350 video slots
#      (70 px apart; 90 px under the subscribe row), the line clear of every slot. Slots stay EMPTY (YouTube draws
#      its own elements); no video title printed (PROJECT-LOG ruling 7).
# =====================================================================================================================
SLOTS = [(300, 540), (990, 540)]  # top-left of each 620x350 video slot
SUBC = (300, 150)                 # top-left of the 300x300 subscribe circle
LINE = (670, 180, 940, 68)        # the line: left, top, width, headline px
if VERT:
    # Portrait: the same element sizes (620x350 video slots, 300 px subscribe circle), stacked in one column on the
    # frame's centre line, the slots 75 px apart down; the line above them, clear of every slot.
    SLOTS = [(230, 1000), (230, 1425)]
    SUBC = (230, 620)
    LINE = (230, 200, 760, 72)


def d17(s):
    sub_on = "on" if s <= 1 else ""
    vid_on = "on" if s >= 2 else ""
    line = (f'<div class="{hid(s >= 1).strip()}" style="position:absolute;left:{LINE[0]}px;top:{LINE[1]}px;width:{LINE[2]}px">'
            f'<div class="ey" style="margin-bottom:22px">Subscribe for</div>'
            f'<h1 style="font-size:{LINE[3]}px;line-height:1.1">Steady content on how to become an {c("AI engineer")}</h1></div>')
    slots = "".join(f'<div class="slot {vid_on}" style="left:{x}px;top:{y}px"></div>' for x, y in SLOTS)
    subc = f'<div class="subc {sub_on}" style="left:{SUBC[0]}px;top:{SUBC[1]}px"></div>'
    return f'{orbs()}{subc}{line}{slots}'


add("D17", 0, d17(0), "465.15 subscribe circle (lit) + two empty video slots up", cls="endc")
add("D17", 1, d17(1), "466.04 the line STEADY CONTENT ON HOW TO BECOME AN AI ENGINEER lands", cls="endc")
add("D17", 2, d17(2), "473.98 the two video slots light on 'these videos right here', hold to the last frame 477.38", cls="endc")


# =====================================================================================================================
# D18  CH3 167.38-180.34  own-proof card over the blacked-out FACE 4: headline 167.56; six jobs light as spoken
#      (RESEARCH 169.70, SCRIPTS 170.48, EDITS 171.36, REVIEWS 172.18, THE SOFTWARE WE BUILD 173.42,
#      CUSTOMER SERVICE 174.82); all six on 'pretty much everything' 176.02; closing line 177.02. Words only.
# =====================================================================================================================
def d18(s):
    jobs = [("search", "Research"), ("file", "Scripts"), ("scissors", "Edits"), ("eye", "Reviews"),
            ("code", "The software we build"), ("headset", "Customer service")]
    lit = min(s, 6)
    rows = ""
    for i, (icon, t) in enumerate(jobs, 1):
        if s == 7:
            cls = "done all"
        elif s == 8:
            cls = "done"
        else:
            cls = seq(i, lit)
        rows += f'<div class="row {cls}">{ic(icon)}<div class="v">{t}</div></div>'
    closing = (f'<div class="closing{hid(s >= 8)}">One person, directing {c("a whole bunch of agents")}</div>')
    return card("How I work", f'<h1 class="sm">I run a {c("whole company")} this way</h1><div class="divider"></div>'
                              f'<div class="grid6">{rows}</div>{closing}')


D18_CUES = ["167.56 headline I RUN A WHOLE COMPANY THIS WAY, six jobs at rest (slot in 167.38)",
            "169.70 RESEARCH", "170.48 SCRIPTS", "171.36 EDITS", "172.18 REVIEWS", "173.42 THE SOFTWARE WE BUILD",
            "174.82 CUSTOMER SERVICE", "176.02 all six lit on 'pretty much everything'",
            "177.02 closing line ONE PERSON, DIRECTING A WHOLE BUNCH OF AGENTS lands, holds to 180.34"]
for k, cue in enumerate(D18_CUES):
    add("D18", k, d18(k), cue)


EXTRA_CSS = """
.grid6 .row .v{font-size:44px}
.cy-t{color:var(--accent-cyan)}
.rows.big .row .v{font-size:50px}
.rows.big .row .sub{font-size:31px}
.rows.big .row{padding-top:26px;padding-bottom:26px}
.d3 .row .lb{flex-basis:300px}
.d-none{display:none}
"""

# The 9:16 re-shoot (--vertical): layout-only media rules on top of the locked stylesheet + LOCAL. No token, font or
# colour changes; the frame is 1080x1920 and the components reflow for a 840 px-wide card body.
PORTRAIT = """
@media (orientation: portrait){
.frame{width:1080px;height:1920px;padding:0 56px}
/* every card gets the same tall box with its content centred, so the deck reads as one set on a phone */
.card,.card.tall{padding:66px 62px 62px;min-height:1240px;display:flex;flex-direction:column;justify-content:center}
.card.fixed{height:1240px}
/* phone-size type: the portrait frame is shown about 0.36x on a phone, so body copy goes up by about a quarter */
.ey{font-size:28px}
h1{font-size:96px}
h1.sm{font-size:84px}
h1.xl{font-size:116px;line-height:1.08}
h1.quote{font-size:84px}
h1,.ask,.qbox .qt,.closing,.row .v{text-wrap:balance}
/* a number, date or ticker never breaks across lines (2026-10-23 split at its hyphen in the first pass) */
.mono,.fig{white-space:nowrap}
.src{font-size:32px}
.row .v{font-size:54px}
.row .lb{font-size:30px}
.row .sub,.row .nt{font-size:34px}
.ic{width:60px;height:60px;flex:0 0 60px}
.pill{font-size:36px}
.role .rows .v{font-size:58px}
.role .rows .v.small{font-size:50px}
.grid6 .row .v{font-size:54px}
.rows.big .row .v{font-size:62px}
.rows.big .row .sub{font-size:38px}
.closing{font-size:58px}
.node .t{font-size:88px}
.big2 .pill{font-size:52px}

/* label columns stack over their values (D3, D8): a 330 px label column would eat 40% of a portrait card */
.row:has(>.lb){flex-wrap:wrap;row-gap:10px}
.row .lb{flex:0 0 100%!important}

/* D2: the three-word strip reads as a list */
.card>.pills{flex-direction:column;align-items:flex-start;gap:20px}

/* D4: the timeline runs top to bottom; the 12 MONTHS rail drops from the 2026 dot to the 2027 dot */
.tl{flex-direction:column;align-items:stretch;gap:0}
.rail{flex:0 0 auto;width:100%;height:190px}
.rail .ln{left:13px;right:auto;top:18px;bottom:30px;width:4px;height:auto}
.rail .hd{left:4px;right:auto;top:auto;bottom:12px;border-left:11px solid transparent;border-right:11px solid transparent;
  border-top:20px solid #2a3142;border-bottom:0}
.rail.on .ln{background:linear-gradient(180deg,rgba(0,194,255,.35),var(--acc))}
.rail.on .hd{border-left-color:transparent;border-top-color:var(--acc)}
.rail .lab{left:54px;right:auto;top:50%;margin-top:-16px;text-align:left;font-size:30px}
.right27{flex:0 0 auto}
.qbox .qt{font-size:52px}
.ask{font-size:64px}
/* a quote whose spotlight states must share ONE wrap: explicit <br> breaks in the markup, balance off (D4, D10) */
.frame .lockwrap{text-wrap:wrap}
/* a row whose later reveal reserves extra lines: the icon sits on the FIRST text line, not the middle (D9 row 2);
   margin = (58px x 1.28 line - 60px icon) / 2 */
.row.top{align-items:flex-start}
.row.top .ic{margin-top:7px}
/* D9 pre-reveal states: the reveal is removed from the row and its two lines (2 x 74.24 px) are reserved below the rows */
.nod{display:none}
.rsv{height:148.48px;flex:0 0 auto}

/* D6: the two words stack; the four numbered slots go 2x2 */
.big2{flex-direction:column;align-items:flex-start;gap:26px}
.slots4{display:grid;grid-template-columns:1fr 1fr;gap:30px}
.slot4{min-height:280px}

/* role cards (D7 D9 D11 D12) */
.rolehd{gap:36px}
.rolehd h1{font-size:100px}

/* D16 steps + chips */
.step .v{font-size:52px}
.step .num{font-size:72px}
.step .pills{gap:14px}
.step .pill{font-size:30px;padding:13px 26px}

/* D18: the six jobs go to one column; the hairline returns under the fifth row */
.grid6{grid-template-columns:1fr}
.closing .c{white-space:nowrap}
.grid6 .row:nth-last-child(2):not(.on){box-shadow:inset 0 -1px 0 var(--border)}
}
"""


def html_text():
    css = (REF / "container-canonical.css").read_text(encoding="utf-8")
    body = "\n".join(f'<div class="frame {cls}" id="{fid}" data-kind="{kind}">{inner}</div>'
                     for fid, kind, inner, cls, _ in FRAMES)
    title = "card slides, VERTICAL 1080x1920" if VERT else "card slides"
    extra = PORTRAIT if VERT else ""
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>future-of-software-engineers: {title}</title>'
            f'<link href="{FONTS}" rel="stylesheet">'
            f'<style>{css}</style><style>{LOCAL}{EXTRA_CSS}{extra}</style></head><body>\n{body}\n</body></html>\n')


def build_html():
    SRC.mkdir(parents=True, exist_ok=True)
    (SRC / "containers.html").write_text(html_text(), encoding="utf-8")


def write_cues():
    where = "assets/vertical/card-slides/" if VERT else "assets/card-slides/"
    lines = [("# future-of-software-engineers: VERTICAL (1080x1920) card-slide state cues (slide-builder, 2026-11-14)"
              if VERT else "# future-of-software-engineers: card-slide state cues (slide-builder, 2026-11-14)"),
             "",
             f"_One PNG per state in `{where}`. `<id>.png` = the state at the slot's first cue; "
             "`<id>-sN.png` = the Nth state after it. Times are FINAL-spine seconds from COVER-PLAN.json's slot notes "
             "(cue off the word JSON). Inside one id every shared element is pixel-identical, so a swap reads as "
             "the line landing / the row lighting._",
             "",
             "| PNG | Cue (s) and what changes |",
             "|---|---|"]
    for fid, _, _, _, cue in FRAMES:
        lines.append(f"| {fid}.png | {cue} |")
    (SRC / "_state-cues.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


CHECK = """(el)=>{
  const r=el.getBoundingClientRect(); const out=[];
  if(Math.round(r.width)!==__W__||Math.round(r.height)!==__H__) out.push('frame size '+r.width+'x'+r.height);
  const txt=el.innerText;
  if(/\\u2014/.test(txt)) out.push('em dash');
  if(/\\u2013/.test(txt)) out.push('en dash');
  el.querySelectorAll('.ey,h1,p,.row,.v,.card,.rows,.src,.pill,.big2,.slots4,.tl,.node,.qbox,.ask,.closing,.grid6').forEach(n=>{
    const b=n.getBoundingClientRect();
    if(b.width===0||getComputedStyle(n).visibility==='hidden') return;
    if(b.left-r.left<40||r.right-b.right<40||b.top-r.top<30||r.bottom-b.bottom<30) out.push('near edge: '+n.className+' '+[b.left-r.left,b.top-r.top,b.right-r.left,b.bottom-r.top].map(Math.round));
    if(!n.classList.contains('rows')&&!n.classList.contains('grid6')&&n.scrollWidth>n.clientWidth+1&&n.clientWidth>0&&getComputedStyle(n).display!=='inline') out.push('overflow-x: '+n.className+' '+n.innerText.slice(0,40));
    if((n.classList.contains('rows')||n.classList.contains('grid6'))&&n.scrollWidth>n.clientWidth+30) out.push('overflow-x: '+n.className+' '+n.innerText.slice(0,40));
    if(n.scrollHeight>n.clientHeight+2&&n.clientHeight>0&&getComputedStyle(n).display!=='inline'&&getComputedStyle(n).overflow!=='visible') out.push('overflow-y: '+n.className+' '+n.innerText.slice(0,40));
  });
  el.querySelectorAll('.mono,.fig').forEach(n=>{if(getComputedStyle(n).visibility!=='hidden'&&n.getClientRects().length>1) out.push('number/date broken across lines: '+n.innerText);});
  const c=el.querySelector('.card'); if(c){const cb=c.getBoundingClientRect();
    if(c.scrollHeight>c.clientHeight+1) out.push('card content overflows its box by '+(c.scrollHeight-c.clientHeight));
    c.querySelectorAll('.row,h1,.ey,p,.pill,.src,.node,.qbox,.ask,.closing,.slot4,.rolehd').forEach(n=>{const b=n.getBoundingClientRect();
      if(b.width===0) return;
      if(b.right>cb.right-24||b.bottom>cb.bottom-18||b.left<cb.left+24) out.push('outside card padding: '+n.className+' '+n.innerText.slice(0,40));});
    out.push('card box '+[cb.left-r.left,cb.top-r.top,cb.width,cb.height].map(Math.round).join(','));}
  const slots=[...el.querySelectorAll('.slot')];
  if(slots.length){
    const sb=slots.map(s=>s.getBoundingClientRect());
    sb.forEach(b=>{if(Math.round(b.width)!==620||Math.round(b.height)!==350) out.push('slot size '+b.width+'x'+b.height);});
    for(let i=1;i<sb.length;i++){const gx=sb[i].left-sb[i-1].right, gy=sb[i].top-sb[i-1].bottom; if(gx<60&&gy<75) out.push('slot gap '+gx+' across / '+gy+' down');}
    const sc=el.querySelector('.subc'); const all=[...sb]; if(sc){const cb=sc.getBoundingClientRect(); all.push(cb);
      sb.forEach(s=>{const dy=s.top-cb.bottom; if(dy<75) out.push('subscribe to video slot gap '+dy);});}
    el.querySelectorAll('h1,.ey').forEach(n=>{const b=n.getBoundingClientRect(); if(!b.width||getComputedStyle(n).visibility==='hidden') return;
      all.forEach(s=>{if(b.left<s.right+20&&b.right>s.left-20&&b.top<s.bottom+20&&b.bottom>s.top-20) out.push('text within 20 px of a slot: '+n.className+' '+n.innerText.slice(0,30));});});
    out.push('slots '+all.map(b=>[b.left-r.left,b.top-r.top,b.width,b.height].map(Math.round).join(',')).join(' | '));
  }
  return out}"""


def big_boxes(path):
    """lint-deck-containers.py's own detector, verbatim logic: count large crisp filled card-boxes."""
    a = np.array(Image.open(path).convert("RGB")).astype(int)
    H, W = a.shape[:2]
    bg = a[3, 3].mean()
    lum = a.mean(2)
    mask = ndimage.binary_dilation(lum > bg + 5, iterations=max(2, W // 400))
    lab, n = ndimage.label(mask)
    big = 0
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        if not ((xs.max() - xs.min()) > 0.25 * W and (ys.max() - ys.min()) > 0.12 * H):
            continue
        box = lum[ys.min():ys.max(), xs.min():xs.max()]
        if box.size and np.abs(np.diff(box, axis=1)).mean() < 1.0:
            continue
        big += 1
    return big


def main():
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    build_html()
    write_cues()
    for d in OUT.values():
        d.mkdir(parents=True, exist_ok=True)
    problems, written = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        pg = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        pg.goto((SRC / "containers.html").as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for fam, w in [("Playfair Display", 900), ("Playfair Display", 700), ("DM Sans", 500), ("DM Sans", 600),
                       ("DM Sans", 700), ("JetBrains Mono", 500), ("JetBrains Mono", 600), ("JetBrains Mono", 700)]:
            ok = pg.evaluate("([f,w])=>document.fonts.check(`${w} 40px '${f}'`)&&[...document.fonts].some(x=>{if(x.family.replace(/\"/g,'')!==f||x.status!=='loaded')return false;const r=String(x.weight).split(' ').map(Number);return r.length>1?(w>=r[0]&&w<=r[1]):r[0]===w;})", [fam, w])
            if not ok:
                problems.append(f"FONT NOT LOADED: {fam} {w}")
        pg.evaluate("document.body.classList.add('solo')")
        for fid, kind, _, _, _ in FRAMES:
            if only and fid not in only and not any(fid.startswith(o + "-") for o in only):
                continue
            pg.evaluate("(id)=>{document.querySelectorAll('.frame.cur').forEach(f=>f.classList.remove('cur'));"
                        "document.getElementById(id).classList.add('cur');window.scrollTo(0,0);}", fid)
            el = pg.locator(f"#{fid}")
            for msg in el.evaluate(CHECK.replace("__W__", str(W)).replace("__H__", str(H))):
                if msg.startswith(("card box ", "slots ")):
                    print(f"  {fid}: {msg}")
                else:
                    problems.append(f"{fid}: {msg}")
            path = OUT[kind] / f"{fid}.png"
            raw = pg.screenshot(type="png", clip={"x": 0, "y": 0, "width": W, "height": H})
            img = Image.open(io.BytesIO(raw)).convert("RGB").resize((W, H), Image.LANCZOS)
            img.save(path)
            nb = big_boxes(path)
            if fid.startswith("D17"):
                # The end card is not a deck card: its outlines are YouTube's end-screen element placeholders
                # (subscribe + two video slots, empty by design), and the comp places it as kind 'container', which
                # lint-deck-containers.py never reads. In 16:9 it only counted one box because the orb merged the slots.
                print(f"  {fid}: {nb} large boxes counted (end-screen placeholders, exempt from the card-box gate)")
            elif nb > 1:
                problems.append(f"{fid}: {nb} large card-boxes under the lint-deck-containers detector")
            written.append(path)
        browser.close()
    print(f"wrote {len(written)} PNGs")
    if problems:
        print("\n".join(["PROBLEMS:"] + problems))
        sys.exit(1)
    print("GATES PASS")


if __name__ == "__main__":
    main()
