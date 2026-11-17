"""pieverse SLIDES (slide-builder, 2026-11-14): writes containers.html (one standalone 1920x1080 frame per state) and
screenshots each frame: TITLE SLIDES (no box) -> ../title-slides/, CARD SLIDES (rounded card) -> ../card-slides/.

Theme: DARK, no accent file, no chapter_themes (GRAPH-PROGRESS settings carry no container_theme / container_accent;
BROLL-PLAN "Container theme: DARK", every row "stylesheet default"). container-canonical.css is pasted VERBATIM from
container-reference/; LOCAL below only adds this build's components on its tokens.
Accent meaning for this video (do not drift): cyan = the lit row and neutral key words (the stylesheet default),
green = live / published / real, gold = a caveat or a gap (custody, deferred, not published, a project's claim).
Red and teal are not used (no risk framing, no brand mark).

Every number on screen is the DATA.md section 5a record-day read (2026-11-14) or a primary figure in DATA.md, per the
COVER-PLAN rulings (PROJECT-LOG 2026-11-14 plan gate). No dollar sign on screen (persona money_format), no em dash.
States: <id>.png = the beat-start state; <id>-sN.png = the Nth spotlight state (cue times in _state-cues.md).
Resting rows stay muted but READABLE (text-secondary); the spotlight adds emphasis, it never toggles visibility.
Lines that land later (a footer, a tag, a punchline) are laid out in every state and only made visible on their state,
so the shared elements are pixel-identical inside one id and a swap reads as the line landing.

Renders at device_scale_factor=2, Lanczos-downsampled to exactly 1920x1080.
Gates (refuse to ship): a webfont did not load, a frame is not 1920x1080, an em dash or a dollar sign is on screen,
content overflows the frame or its card, END end-screen slots are not 620x350 / 60 px apart / clear of text.
Run: python build_slides.py [id ...]   (no ids = every frame)
"""
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
REF = HERE.parents[3] / "skills" / "container-reference"
OUT = {"title": HERE.parent / "title-slides", "card": HERE.parent / "card-slides"}
FONTS = ("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900"
         "&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,500"
         "&family=JetBrains+Mono:wght@500;600;700&display=swap")

LOCAL = """
/* ---- this build's components, on the locked tokens. Lit colour = cyan (the stylesheet default accent). ---- */
.frame{--acc:var(--accent-cyan);--acc-rgb:0,194,255}
.ey .mono{font-weight:600;color:inherit}
.hid{visibility:hidden}
.card{position:relative;width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:28px;
  padding:60px 88px 56px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.55)}
.card>.top{position:absolute;top:0;left:0;right:0;height:5px;
  background:linear-gradient(90deg,var(--accent-cyan),var(--accent-cyan) 38%,rgba(0,194,255,0) 92%)}
.card h1{max-width:none}
.card .divider{margin:28px 0 30px}
.card p{max-width:none}
.src{font:500 24px/1.4 'DM Sans';color:var(--text-muted);letter-spacing:.02em;margin-top:28px}
.src .mono{font-weight:500}
.go-tx{color:var(--accent-gold)}

/* ---- rows: hairline between rows at rest; the lit row takes the cyan ring ---- */
.rows{display:flex;flex-direction:column;width:100%}
.row{display:flex;align-items:center;gap:30px;padding:17px 28px;margin:0 -28px;border:2px solid transparent;
  border-radius:16px;box-shadow:inset 0 -1px 0 var(--border)}
.row:last-child{box-shadow:none}
.row .lb{flex:0 0 330px;font:600 25px/1.25 'DM Sans';letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted)}
.row .v{flex:1 1 auto;min-width:0;font:600 44px/1.22 'DM Sans';color:var(--text-secondary)}
.row .nt{flex:0 0 auto;font:500 25px/1.3 'DM Sans';color:var(--text-muted);text-align:right}
.row .nt .mono{font-weight:500}
.row .big{flex:0 0 auto;font:700 50px/1.1 'JetBrains Mono';color:var(--text-secondary);text-align:right}
.ic{width:48px;height:48px;flex:0 0 48px;stroke:var(--text-secondary);fill:none;stroke-width:2;stroke-linecap:round;
  stroke-linejoin:round;opacity:.75}
.row.done .v,.row.done .big{color:var(--text-primary)}
.row.done .ic{stroke:var(--text-primary);opacity:.9}
.frame .row.on{border-color:var(--acc);background:rgba(var(--acc-rgb),.07);
  box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10),0 12px 28px rgba(0,0,0,.35)}
.row.on .v{color:var(--text-primary);font-weight:700}
.row.on .lb{color:var(--text-secondary)}
.row.on .ic{stroke:var(--acc);opacity:1}
.row.on .v .mono,.row.on .big{color:var(--acc)}
.row.lit .v,.row.lit .big{color:var(--text-primary)}
.row.lit .v .mono,.row.lit .big{color:var(--acc)}
.row.lit .lb{color:var(--text-secondary)}
.row.lit .ic{stroke:var(--acc);opacity:1}
.row.dim .v,.row.dim .big{color:var(--text-muted)}
.row.dim .ic{opacity:.45}

/* ---- the mono status / date line (the banks card's accent line): rest = readable grey + hollow dot, lit = colour ---- */
.st{display:flex;align-items:center;gap:20px;font:600 40px/1.2 'JetBrains Mono';letter-spacing:.04em;color:var(--text-secondary)}
.st i{width:20px;height:20px;border-radius:50%;border:3px solid var(--text-secondary);flex:0 0 20px}
.st.on{color:var(--acc)} .st.on i{border-color:var(--acc);background:var(--acc);box-shadow:0 0 0 6px rgba(var(--acc-rgb),.14),0 0 22px rgba(var(--acc-rgb),.5)}
.st.done{color:var(--text-primary)} .st.done i{border-color:var(--text-primary);background:var(--text-primary)}
.st.g{color:var(--accent-green)} .st.g i{border-color:var(--accent-green);background:var(--accent-green);box-shadow:0 0 0 6px rgba(0,230,138,.14),0 0 22px rgba(0,230,138,.5)}
.st.gold{color:var(--accent-gold)} .st.gold i{border-color:var(--accent-gold);background:var(--accent-gold);box-shadow:0 0 0 6px rgba(255,215,0,.12),0 0 22px rgba(255,215,0,.45)}

/* ---- pills / tags ---- */
.pill{display:inline-flex;align-items:center;gap:14px;padding:12px 26px;border-radius:999px;border:2px solid var(--border);
  font:700 26px/1.1 'DM Sans';letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary);white-space:nowrap}
.pill .ic{width:30px;height:30px;flex-basis:30px}
.pill.on{border-color:var(--acc);color:var(--acc);background:rgba(var(--acc-rgb),.08);box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10)}
.pill.on .ic{stroke:var(--acc);opacity:1}
.pill.gold{border-color:var(--accent-gold);color:var(--accent-gold);background:rgba(255,215,0,.07);box-shadow:0 0 0 4px rgba(255,215,0,.08)}
.pill.gold .ic{stroke:var(--accent-gold);opacity:1}
.pill.dim{color:var(--text-muted);border-color:var(--border)}
/* highlighted words inside a quote (a caveat = gold marker) */
.hl{transition:none;border-radius:8px;padding:0 6px;margin:0 -6px}
.hl.gold{color:var(--accent-gold);background:rgba(255,215,0,.10);box-shadow:inset 0 -6px 0 rgba(255,215,0,.35)}
/* .mk = the marker cut to the word's own ink (D4 rebuild, visual-qa 2026-11-14): the inline background above paints the
   font's whole content area (ascent 128 + descent 30 px at 118 px), which rose into line 1's 'g'. Here the tint is a
   pseudo-element band from 0.2em below the content-area top (11 px over the 'd' ascender) to 0.1em above its bottom
   (18 px under the baseline), 7 px clear of the word's ink at each side; the span's 7 px right margin keeps the closing
   period's ink about 7 px clear of the block (measured off the PNG: no touch, and only about 6 px looser than natural). The class sits on
   the span in EVERY state (rest = no tint), so the text layout is pixel-identical between D4 and D4-s1. */
.hl.mk{position:relative;z-index:0;padding:0;margin:0 7px 0 0;border-radius:0}
.hl.mk::before{content:"";position:absolute;z-index:-1;left:-3px;right:-7px;top:.2em;bottom:.1em;border-radius:10px}
.hl.mk.gold{background:none;box-shadow:none}
.hl.mk.gold::before{background:rgba(255,215,0,.10);box-shadow:inset 0 -6px 0 rgba(255,215,0,.35)}
.q{font-family:'Playfair Display',serif;font-weight:700}

/* ---- title slides (no box) ---- */
.frame.title h1{font-size:150px;line-height:1.02;letter-spacing:-.025em}
.frame.title .ey{font-size:30px;margin-bottom:34px}
.frame.title .divider{width:96px;height:5px;margin:44px 0 0}

/* ---- tiles (D1) ---- */
.tiles3{display:flex;gap:30px;width:100%}
.tile3{flex:1 1 0;display:flex;align-items:center;gap:24px;padding:30px 32px;border-radius:20px;border:2px solid var(--border);
  background:rgba(255,255,255,.012)}
.tile3 .v{font:700 34px/1.2 'DM Sans';letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary)}
.tile3.done .v{color:var(--text-primary)} .tile3.done .ic{stroke:var(--text-primary);opacity:.9}
.tile3.on{border-color:var(--acc);background:rgba(var(--acc-rgb),.07);box-shadow:0 0 0 4px rgba(var(--acc-rgb),.10),0 12px 28px rgba(0,0,0,.35)}
.tile3.on .v{color:var(--text-primary)} .tile3.on .ic{stroke:var(--acc);opacity:1}

/* ---- bars (D6, D14, D21, D23) ---- */
.barrow .bw{flex:1 1 auto;min-width:0;height:34px;display:flex;align-items:center}
.bar{height:34px;border-radius:8px;background:#2a3142}
.row.done .bar{background:#6b7486}
.row.on .bar,.row.lit .bar{background:linear-gradient(90deg,rgba(var(--acc-rgb),.75),var(--acc))}
.row.dim .bar{background:#1f2533}

/* ---- two halves (D5) ---- */
.halves{display:flex;gap:44px;width:100%;align-items:stretch}
.half{flex:1 1 0;min-width:0;border-radius:22px;border:2px solid var(--border);padding:34px 40px 30px;background:rgba(255,255,255,.012)}
.half .hd{display:flex;align-items:center;gap:16px;font:700 27px/1.2 'DM Sans';letter-spacing:.16em;text-transform:uppercase;
  color:var(--text-muted);margin-bottom:18px}
.half .hd i{width:16px;height:16px;border-radius:50%;background:var(--text-muted)}
.half .hd.g{color:var(--accent-green)} .half .hd.g i{background:var(--accent-green);box-shadow:0 0 14px rgba(0,230,138,.6)}
.half .hd.gold{color:var(--accent-gold)} .half .hd.gold i{background:var(--accent-gold);box-shadow:0 0 14px rgba(255,215,0,.5)}
.half .row{margin:0 -20px;padding:14px 20px}
.half .row .v{font-size:40px}
.half .row .big{font-size:46px}

/* ---- END card (YouTube end-screen geometry) ---- */
.frame.endc{display:block;padding:0}
.frame.endc>.slot{position:absolute;width:620px;height:350px;border-radius:18px;border:2px dashed #2a3142;
  background:rgba(255,255,255,.015)}
/* words inside a mono chip stay DM Sans; mono spaces tightened inside running text */
.w{font-family:'DM Sans';font-weight:600;letter-spacing:0}
.src .mono,.v .mono,p .mono,.ey .mono{word-spacing:-.3em}
/* sparse cards: taller box, content centred, so the card fills the frame like the reference */
.card.tall{min-height:660px;display:flex;flex-direction:column;justify-content:center}
.nw{white-space:nowrap}
/* one frame at a time while screenshotting (fast; no 100 blurred orbs painted at once) */
body.solo .frame{display:none!important}
body.solo .frame.cur{display:flex!important}
body.solo .frame.endc.cur{display:block!important}
"""

FRAMES = []  # (frame id, kind, inner html, extra class)


def add(fid, inner, kind="card", cls=""):
    FRAMES.append((fid, kind, inner, cls))


def m(s):
    return f'<span class="mono">{s}</span>'


def c(s):
    return f'<span class="c">{s}</span>'


def orbs():
    return ('<div class="orb" style="width:760px;height:760px;right:-220px;top:-280px;background:#00c2ff"></div>'
            '<div class="orb" style="width:620px;height:620px;left:-260px;bottom:-300px;background:#00e68a;opacity:.16"></div>')


def card(ey, h1, body, h1cls="sm", divider=True, style="", cls=""):
    h = f'<h1 class="{h1cls}">{h1}</h1>' if h1 else ""
    d = '<div class="divider"></div>' if divider else ""
    st = f' style="{style}"' if style else ""
    return f'{orbs()}<div class="card {cls}"{st}><div class="top"></div><div class="ey">{ey}</div>{h}{d}{body}</div>'


def seq(i, lit):
    """Progressive spotlight: lit = 1-based index of the item just spoken (0 = rest). Earlier = done, current = on."""
    if lit == 0 or i > lit:
        return ""
    return "on" if i == lit else "done"


def one(i, lit):
    """Single spotlight: only the current item is lit, the rest sit at rest."""
    return "on" if i == lit else ""


def hid(show):
    return "" if show else " hid"


# ---- icons (stroke, 24 grid) ----
ICON = {
    "bot": '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4H8"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
    "wallet": '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    "chat": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "key": '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    "landmark": '<path d="M3 22h18"/><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="M12 2 20 7H4z"/>',
    "lock": '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    "percent": '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    "ticket": '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "banknote": '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    "thumb": '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
    "bell": '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    "msg": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    "down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    "eye": '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "file": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/>',
    "check": '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
}


def ic(name, cls="ic"):
    return f'<svg class="{cls}" viewBox="0 0 24 24">{ICON[name]}</svg>'


# =====================================================================================================================
# TITLE SLIDES (no box): plain house dark, eyebrow + Playfair headline + divider, silent
# =====================================================================================================================
TITLES = [("title-CH2", "Chapter 2", f"What it {c('is')}"),
          ("title-CH3", "Chapter 3", f"What’s {c('real')}"),
          ("title-CH4", "Chapter 4", f"The {c('token')}"),
          ("title-CH5", "Chapter 5", f"Who’s {c('behind')} it")]
for fid, ey, h in TITLES:
    add(fid, f'{orbs()}<div class="ey">{ey}</div><h1>{h}</h1><div class="divider"></div>', kind="title", cls="title")


# =====================================================================================================================
# D1  CH1 9.689-19.189  THE SHORT VERSION: the home page line, then 3 pieces lit one at a time
# =====================================================================================================================
def d1(lit):
    pieces = [("bot", "AI agent"), ("wallet", "Its own wallet"), ("chat", "Inside your chat app")]
    tiles = "".join(f'<div class="tile3 {seq(i, lit)}" style="padding:40px 36px">{ic(n)}'
                    f'<div class="v" style="font-size:38px">{t}</div></div>'
                    for i, (n, t) in enumerate(pieces, 1))
    body = (f'<div class="src" style="margin-top:22px;font-size:27px">The home page, pieverse.io</div>'
            f'<div class="divider"></div><div class="tiles3">{tiles}</div>')
    return card("The short version", f'<span class="q">“Web3 AI Agent for {c("Line &amp; Kakao")}”</span>', body,
                h1cls="", divider=False, cls="tall", style="")


for s in range(0, 4):
    add("D1" if s == 0 else f"D1-s{s}", d1(s))


# =====================================================================================================================
# D9  CH1 19.189-35.20 (F2 deck area to 28.555, then full frame)  THE SNAPSHOT, record-day read
#   s1 read date lit · s2 + price lit · s3 FDV lit (price dims) · s4 all five lit
# =====================================================================================================================
def d9(st):
    date_cls = {0: "", 1: "on", 2: "done", 3: "done", 4: "done"}[st]
    rows = [("Price", f'{m("1.78")} <span style="font-size:30px;color:var(--text-muted)">USD</span>', f"at {m('14:15')} UTC"),
            ("Market cap", m("488.1M"), f"at {m('14:15')} UTC"),
            ("FDV", m("1.78B"), f"price x {m('1B')} supply (calc)"),
            ("Rank", m("#99"), f"at {m('18:27')} UTC"),
            ("All-time high", m("2.23"), m("9 Nov 2026"))]
    out = ""
    for i, (lb, v, nt) in enumerate(rows, 1):
        if st == 4:
            k = "lit"
        elif st == 2 and i == 1:
            k = "on"
        elif st == 3 and i == 3:
            k = "on"
        else:
            k = ""
        out += f'<div class="row {k}"><div class="lb">{lb}</div><div class="v">{v}</div><div class="nt">{nt}</div></div>'
    body = (f'<div class="st {date_cls}" style="margin-top:22px"><i></i>{m("14 NOV 2026")}</div>'
            f'<div class="divider"></div><div class="rows">{out}</div>'
            f'<div class="src">CoinGecko, read {m("14 Nov 2026")}</div>')
    return card("The snapshot", f"At the time of {c('recording')}", body, divider=False, cls="d9")


for s in range(0, 5):
    add("D9" if s == 0 else f"D9-s{s}", d9(s))


# =====================================================================================================================
# D2  CH2 35.20-59.64  WHAT PIEVERSE SAYS IT IS: three framings, single spotlight, then all lit + the count
#   s1 litepaper · s2 + TimeFi tag · s3 whitepaper · s4 home page · s5 all lit · s6 all lit + footer
# =====================================================================================================================
def d2(st):
    def k(i):
        if st >= 5:
            return "lit"
        return "on" if {1: 1, 2: 1, 3: 2, 4: 3}.get(st) == i else ""
    tag_cls = "pill gold" if st in (2, 5, 6) else "pill"
    rows = (f'<div class="row {k(1)}"><div class="lb">Litepaper</div><div class="v">'
            f'“The Compliance &amp; Payment Infrastructure for the Web3 Economy”'
            f'<div style="display:flex;align-items:center;gap:22px;margin-top:12px;font:500 30px/1.2 \'DM Sans\';'
            f'color:var(--text-secondary)">invoices and receipts <span class="{tag_cls}" style="font-size:22px;'
            f'padding:8px 20px;letter-spacing:.04em;text-transform:none">TimeFi</span></div></div></div>'
            f'<div class="row {k(2)}"><div class="lb">Whitepaper<br>{m("10 Nov 2025")}</div><div class="v">'
            f'“Agent-Native, Compliant Payment Stack for Web3”</div></div>'
            f'<div class="row {k(3)}"><div class="lb">Home page</div><div class="v">'
            f'“Web3 AI Agent for Line &amp; Kakao”</div></div>')
    foot = (f'<div class="st done{hid(st == 6)}" style="margin-top:26px;font:700 38px/1.2 \'DM Sans\';letter-spacing:0"><i></i>'
            f'{m("3")} framings, around {m("12")} months</div>')
    return card("What Pieverse says it is", f"It didn’t start as an {c('AI agent')} project",
                f'<div class="rows d2">{rows}</div>{foot}')


for s in range(0, 7):
    add("D2" if s == 0 else f"D2-s{s}", d2(s))


# =====================================================================================================================
# D17  CH2 77.70-83.22  ONE CAVEAT: the home page custody line; s1 'seed phrase custody' · s2 + NOT WITH YOU
# =====================================================================================================================
def d17(st):
    hl = "hl gold" if st >= 1 else "hl"
    q = (f'<span class="q">“Pieverse handles wallet creation, <span class="{hl} nw">seed phrase custody</span>, '
         f'and setup.”</span>')
    body = (f'<div class="src" style="margin-top:22px;font-size:27px">The home page, pieverse.io</div><div class="divider"></div>'
            f'<div><div class="pill gold{hid(st >= 2)}" style="font-size:34px;padding:18px 34px">{ic("key")}'
            f'The keys: not with you</div></div>')
    return card("One caveat", q, body, h1cls="", divider=False, cls="tall")


for s in range(0, 3):
    add("D17" if s == 0 else f"D17-s{s}", d17(s))


# =====================================================================================================================
# D4  CH2 98.98-104.522  THE PROJECT'S OWN WORDS: 'Live agent payments: deferred.'; s1 'deferred' highlights
# =====================================================================================================================
def d4(st):
    # line-height 1.2 (was 1.08): at 1.08 the 'g' of line 1 ended 11.5 px above the 'd' of line 2, no room for any marker
    hl = "hl mk gold" if st >= 1 else "hl mk"
    q = f'<span class="q">“Live agent payments: <span class="{hl}">deferred</span>.”</span>'
    body = (f'<div class="divider"></div><div><div class="pill" style="font-size:26px;text-transform:none;'
            f'letter-spacing:.04em">{ic("file")}llms.txt, pieverse.io</div></div>')
    return card("The project’s own words", q, body, h1cls="", divider=False, cls="tall",
                style="--h:118px").replace('<h1 class="">', '<h1 class="" style="font-size:118px;line-height:1.2">')


for s in range(0, 2):
    add("D4" if s == 0 else f"D4-s{s}", d4(s))


# =====================================================================================================================
# D18  CH2 108.722-115.56  THE TOKEN, PER THE WHITEPAPER: 3 jobs lit in order, ACCESS dim, then the USD line
# =====================================================================================================================
def d18(st):
    jobs = [("landmark", "Governance"), ("lock", "Staking"), ("percent", "Fee discounts")]
    out = "".join(f'<div class="row {seq(i, min(st, 3)) if st <= 3 else "done"}">{ic(n)}<div class="v">{t}</div></div>'
                  for i, (n, t) in enumerate(jobs, 1))
    out += f'<div class="row dim">{ic("ticket")}<div class="v">Access</div></div>'   # printed dim, never spotlit
    usd = "on" if st == 4 else ""
    body = (f'<div class="rows d18">{out}</div>'
            f'<div class="st {usd}" style="margin-top:30px;font-family:\'DM Sans\';font-weight:700;letter-spacing:0">'
            f'<i></i>Plans priced in USD</div>'
            f'<div class="src">Whitepaper section {m("5.2")} · pricing.md</div>')
    return card("The Pieverse token, per the whitepaper", f"What the token is {c('for')}", body)


for s in range(0, 5):
    add("D18" if s == 0 else f"D18-s{s}", d18(s))


# =====================================================================================================================
# D5  CH3 115.56-125.74 (left half) + 145.155-151.56 (right half)  WHAT IT PUBLISHES / NOT PUBLISHED
#   s1 ONE COUNTER · s2 skills · s3 merchants | s4 return: NOT PUBLISHED header lights gold, left back to rest · s5 agents
#   · s6 subs · s7 revenue · s8 footer
#   Rebuild (visual-qa 2026-11-14): the right half is laid out in EVERY state at D5-s4's geometry (header + three rows at
#   rest + the footer laid out hidden), so the card frame is pixel-identical across all nine states. s0-s3 show the header
#   muted and the rows at rest (never an empty panel); the half lands at s4 when its header turns gold.
# =====================================================================================================================
def d5(st):
    left_k = {1: (1, 0, 0), 2: (2, 1, 0), 3: (2, 2, 1)}.get(st)
    if st == 0:
        cnt, sk, mc = "", "", ""
    elif st <= 3:
        cnt = "on" if st == 1 else "done"
        sk = "on" if st == 2 else ("done" if st > 2 else "")
        mc = "on" if st == 3 else ""
    else:
        cnt, sk, mc = "", "", ""
    left = (f'<div class="half"><div class="hd g"><i></i>What it publishes</div>'
            f'<div class="st {cnt}" style="font-family:\'DM Sans\';font-weight:700;letter-spacing:.02em;margin:4px 0 14px">'
            f'<i></i>One counter</div>'
            f'<div class="rows"><div class="row {sk}"><div class="big">{"74,195"}</div><div class="v">skills</div></div>'
            f'<div class="row {mc}"><div class="big">{"25,233"}</div><div class="v">merchants</div></div></div>'
            f'<div class="src" style="margin-top:16px">Skill Store stats, read {m("14 Nov 2026")}</div></div>')
    items = [("bot", "Agents running"), ("users", "Paying subscribers"), ("banknote", "Revenue")]
    lit = {5: 1, 6: 2, 7: 3, 8: 3}.get(st, 0)   # s0-s4: 0 = every row at rest
    rr = "".join(f'<div class="row {("done" if st == 8 else seq(i, lit))}">{ic(n)}<div class="v">{t}</div></div>'
                 for i, (n, t) in enumerate(items, 1))
    hd = "hd gold" if st >= 4 else "hd"          # s0-s3: muted header (grey dot), the half lands gold at s4
    right = (f'<div class="half"><div class="{hd}"><i></i>Not published</div><div class="rows">{rr}</div>'
             f'<div class="src{hid(st == 8)}" style="margin-top:16px;font-size:28px;color:var(--text-secondary);'
             f'font-style:italic">At least not anywhere I checked.</div></div>')
    return card("Its own usage numbers", f"What the product {c('publishes')}",
                f'<div class="halves">{left}{right}</div>')


for s in range(0, 9):
    add("D5" if s == 0 else f"D5-s{s}", d5(s))


# =====================================================================================================================
# D6  CH3 125.74-139.222  THE SKILL STORE, BY SOURCE: a = mirrored + native (built in dim) · b = priced + paid
#   s1 mirrored · s2 native · s3 5 priced (rows above rest) · s4 1 paid install
# =====================================================================================================================
def d6(st):
    full = 920

    def w(n):
        return max(10, round(full * n / 74133))
    mir = "on" if st == 1 else ("done" if st == 2 else "")
    nat = "on" if st == 2 else ""
    src_rows = (f'<div class="row barrow {mir}"><div class="lb">Mirrored from ClawHub</div><div class="bw">'
                f'<div class="bar" style="width:{w(74133)}px"></div></div><div class="big">74,133</div></div>'
                f'<div class="row barrow dim"><div class="lb">Built in</div><div class="bw">'
                f'<div class="bar" style="width:{w(32)}px"></div></div><div class="big">32</div></div>'
                f'<div class="row barrow {nat}"><div class="lb">Native, published on Pieverse</div><div class="bw">'
                f'<div class="bar" style="width:{w(30)}px"></div></div><div class="big">30</div></div>')
    pr = "on" if st == 3 else ("done" if st == 4 else "")
    pd = "on" if st == 4 else ""
    price = (f'<div style="display:flex;gap:30px;margin-top:26px">'
             f'<div class="row {pr}" style="flex:1;margin:0;box-shadow:none;border-color:{"" if pr == "on" else "var(--border)"}">'
             f'<div class="big" style="flex:0 0 auto">5</div><div class="v">skills carry a price</div></div>'
             f'<div class="row {pd}" style="flex:1;margin:0;box-shadow:none;border-color:{"" if pd == "on" else "var(--border)"}">'
             f'<div class="big" style="flex:0 0 auto">1</div><div class="v">paid install</div></div></div>')
    body = (f'<div class="rows d6">{src_rows}</div>{price}'
            f'<div class="src">Skill Store API, {m("74,195")} skills in all, read {m("14 Nov 2026")}</div>')
    return card("The Skill Store, by source", f"Almost all of it is {c('imported')}", body)


for s in range(0, 5):
    add("D6" if s == 0 else f"D6-s{s}", d6(s))


# =====================================================================================================================
# D21  CH4 177.755-190.80  THE DAY OF THE HIGH, UPBIT ONLY: 3.0B -> 53.8B KRW, 17.8x
#   s1 8 Nov lit · s2 9 Nov lit · s3 17.8x lands
# =====================================================================================================================
def d21(st):
    full = 900
    a = "on" if st == 1 else ("done" if st >= 2 else "")
    b = "on" if st == 2 else ("lit" if st == 3 else "")
    rows = (f'<div class="row barrow {a}"><div class="lb">{m("8 Nov 2026")}</div><div class="bw">'
            f'<div class="bar" style="width:{round(full * 3.03 / 53.82)}px"></div></div>'
            f'<div class="big">3.0B <span style="font-size:28px">KRW</span></div></div>'
            f'<div class="row barrow {b}"><div class="lb">{m("9 Nov 2026")}</div><div class="bw">'
            f'<div class="bar" style="width:{full}px"></div></div>'
            f'<div class="big">53.8B <span style="font-size:28px">KRW</span></div></div>')
    x = (f'<div class="st on{hid(st == 3)}" style="margin-top:30px;font-size:64px"><i style="width:26px;height:26px;'
         f'flex-basis:26px"></i>17.8x <span style="font:600 38px/1.2 \'DM Sans\';color:var(--text-primary);'
         f'letter-spacing:0">in a single day</span></div>')
    body = (f'<div class="rows">{rows}</div>{x}'
            f'<div class="src">Upbit daily candles, value traded in KRW, read {m("14 Nov 2026")}</div>')
    return card("The day of the high · Upbit, KRW", f"Traded in Korean {c('won')}", body)


for s in range(0, 4):
    add("D21" if s == 0 else f"D21-s{s}", d21(s))


# =====================================================================================================================
# D24  CH4 190.80-212.58  IN THE COMMUNITY (Mike's own firsthand claims, text only)
#   s1 bot call · s2 my call · s3 favorites list (1, 2 back to rest) · s4 swing trading software · s5 available to members
# =====================================================================================================================
def d24(st):
    def k(i):
        if st in (1, 2):
            return seq(i, st) if i <= 2 else ""
        if st == 3:
            return "on" if i == 3 else ""
        if st >= 4:
            return {3: "done", 4: "on"}.get(i, "")
        return ""
    mem = "pill on" if st == 5 else "pill"
    rows = (f'<div class="row {k(1)}"><div class="lb">Bot call</div><div class="v">Around a {m("20M")} market cap</div></div>'
            f'<div class="row {k(2)}"><div class="lb">My call</div><div class="v">Around a {m("60M")} market cap</div></div>'
            f'<div class="row {k(3)}"><div class="lb">Since then</div><div class="v">Community favorites list, Discord</div></div>'
            f'<div class="row {k(4)}"><div class="lb">The tool</div><div class="v" style="display:flex;align-items:center;'
            f'gap:26px;flex-wrap:wrap">Swing trading software <span class="{mem}" style="font-size:22px">'
            f'Available to members</span></div></div>')
    return card("In the community", f"The part I can speak to {c('firsthand')}", f'<div class="rows">{rows}</div>')


for s in range(0, 6):
    add("D24" if s == 0 else f"D24-s{s}", d24(s))


# =====================================================================================================================
# D25  CH4 212.58-225.22  MY COMMUNITY (text only): s1 LIFETIME MEMBERSHIP lights · s2 LINK IN THE DESCRIPTION lights
# =====================================================================================================================
def d25(st):
    h = (f'<h1 style="font-size:132px;line-height:1.05;color:{"var(--text-primary)" if st >= 1 else "var(--text-secondary)"}">'
         f'Lifetime <span class="{"c" if st >= 1 else ""}">membership</span></h1>')
    pill = "pill on" if st == 2 else "pill"
    body = (f'{h}<div class="divider"></div><div><div class="{pill}" style="font-size:36px;padding:22px 40px">'
            f'Link in the description {ic("down")}</div></div>')
    return card("My community", "", body, divider=False, cls="tall")


for s in range(0, 3):
    add("D25" if s == 0 else f"D25-s{s}", d25(s))


# =====================================================================================================================
# D19  CH4 225.22-234.78  CIRCULATING SUPPLY, of 1,000M: s1 the range 27% to 40% · s2 the three counts
# =====================================================================================================================
def d19(st):
    rng = {0: "", 1: "on", 2: "done"}[st]
    k = "lit" if st == 2 else ""
    rows = (f'<div class="row {k}"><div class="lb">CoinGecko</div><div class="v">{m("274.75M")}</div><div class="big">27.5%</div></div>'
            f'<div class="row {k}"><div class="lb">CoinMarketCap</div><div class="v">{m("300.35M")}</div><div class="big">30.0%</div></div>'
            f'<div class="row {k}"><div class="lb">The project</div><div class="v">{m("395.88M")}</div><div class="big">39.6%</div></div>')
    body = (f'<div class="st {rng}" style="margin:22px 0 0;font-size:52px"><i style="width:24px;height:24px;flex-basis:24px"></i>'
            f'<span style="font:700 46px/1.2 \'DM Sans\';letter-spacing:0">Around</span> 27% <span style="font:700 46px/1.2 '
            f'\'DM Sans\';letter-spacing:0">to</span> 40%</div><div class="divider"></div>'
            f'<div class="rows">{rows}</div>'
            f'<div class="src">Depending on who’s counting. Read {m("14 Nov 2026")}.</div>')
    return card(f"Circulating supply · of {m('1,000M')} tokens", f"How much is {c('circulating')}?", body, divider=False)


for s in range(0, 3):
    add("D19" if s == 0 else f"D19-s{s}", d19(s))


# =====================================================================================================================
# D8  CH4 234.78-241.669  THE ALLOCATION: five buckets; team, investors, foundation lit in turn, then '= 45%'
# =====================================================================================================================
def d8(st):
    buckets = [("Community Growth", 27.6, "#3a4254"), ("Ecosystem &amp; Marketing", 27.4, "#2c3343"),
               ("Team &amp; Advisors", 20, None), ("Investors", 15, None), ("Foundation Reserve", 10, None)]
    insider_shades = ["#00c2ff", "#33ceff", "#7fe0ff"]
    W = 1460
    segs, rows = "", ""
    for i, (name, pct, rest_col) in enumerate(buckets):
        j = i - 2  # insider index 0..2
        lit = j >= 0 and st >= j + 1
        on = j >= 0 and (st == j + 1)
        col = insider_shades[j] if lit else (rest_col or ["#4a5263", "#3f4757", "#353c4b"][j])
        segs += (f'<div style="width:{W * pct / 100:.1f}px;height:64px;background:{col};'
                 f'{"box-shadow:0 0 24px rgba(0,194,255,.45);" if on else ""}"></div>')
        k = "on" if on else ("lit" if lit else "")
        sw = f'<span style="display:inline-block;width:26px;height:26px;border-radius:6px;background:{col};flex:0 0 26px"></span>'
        rows += (f'<div class="row {k}" style="padding:11px 28px">{sw}<div class="v" style="font-size:38px">{name}</div>'
                 f'<div class="big" style="font-size:42px">{pct:g}%</div></div>')
    bar = f'<div style="display:flex;gap:4px;width:{W}px;border-radius:12px;overflow:hidden">{segs}</div>'
    tot = (f'<div class="st on{hid(st == 4)}" style="margin-top:24px;font-size:46px"><i></i>'
           f'<span style="font:700 40px/1.2 \'DM Sans\';color:var(--text-primary);letter-spacing:0">'
           f'Team + investors + foundation</span> = 45%</div>')
    body = (f'{bar}<div class="rows" style="margin-top:22px">{rows}</div>{tot}'
            f'<div class="src" style="margin-top:20px">Whitepaper section {m("5.3")}</div>')
    return card("The allocation, per the whitepaper", f"One billion tokens, {c('five ways')}", body)


for s in range(0, 5):
    add("D8" if s == 0 else f"D8-s{s}", d8(s))


# =====================================================================================================================
# D10  CH4 248.669-256.68  14 NOV 2026: the lock ends; FIRST RELEASE around 33M to around 86M tokens; two trackers
#   s1 FIRST RELEASE · s2 around 33M · s3 around 86M + footer
# =====================================================================================================================
def d10(st):
    lab = "on" if st >= 1 else ""
    a = "pill on" if st == 2 else ("pill done" if st >= 3 else "pill")
    b = "pill on" if st == 3 else "pill"

    def chip(cls, t):
        sty = "font:700 46px/1.1 'JetBrains Mono';letter-spacing:.02em;padding:20px 34px;text-transform:none"
        if cls == "pill done":
            cls, sty = "pill", sty + ";color:var(--text-primary);border-color:#3a4254"
        return f'<span class="{cls}" style="{sty}">{t}</span>'
    rel = (f'<div class="st {lab}" style="font-family:\'DM Sans\';font-weight:700;letter-spacing:.14em;font-size:30px;'
           f'text-transform:uppercase"><i></i>First release, per the trackers</div>'
           f'<div style="display:flex;align-items:center;gap:30px;margin-top:24px">'
           f'{chip(a, "<span class=w>around</span> 33M")}<span style="font:600 38px/1 \'DM Sans\';color:var(--text-secondary)">to</span>'
           f'{chip(b, "<span class=w>around</span> 86M")}<span style="font:600 38px/1 \'DM Sans\';color:var(--text-secondary)">tokens</span></div>'
           f'<div class="src{hid(st == 3)}" style="font-size:30px;color:var(--text-secondary);font-style:italic;margin-top:26px">'
           f'Two trackers, two sizes.</div>')
    h = (f'<div style="font:700 112px/1.05 \'JetBrains Mono\';letter-spacing:-.01em;color:var(--accent-cyan)">'
         f'14 NOV 2026</div>'
         f'<p style="margin-top:14px;font-size:42px;color:var(--text-primary)">The {m("12")}-month lock on team and '
         f'investor tokens ends.</p>')
    return card("The lock", "", f'{h}<div class="divider"></div>{rel}', divider=False)


for s in range(0, 4):
    add("D10" if s == 0 else f"D10-s{s}", d10(s))


# =====================================================================================================================
# D11  CH4 262.44-275.10  WHO HOLDS IT: 4 wallets 56.6% · seven 2-of-3 multisigs 67.35% · kept by signers line
# =====================================================================================================================
def d11(st):
    rows = (f'<div class="row {seq(1, st)}">{ic("wallet")}<div class="v">{m("4")} wallets</div><div class="big">56.6%</div></div>'
            f'<div class="row {seq(2, st)}">{ic("users")}<div class="v">Seven {m("2")}-of-{m("3")} multisigs</div><div class="big">67.35%</div></div>'
            f'<div class="row {seq(3, st)}">{ic("key")}<div class="v">Kept by signers, not by a contract'
            f'<div style="font:500 28px/1.3 \'DM Sans\';color:var(--text-muted);margin-top:6px">as far as the reads show</div>'
            f'</div></div>')
    body = (f'<div class="rows">{rows}</div>'
            f'<div class="src">Share of the {m("1,000M")} supply. Ethereum, on-chain read {m("14 Nov 2026")}.</div>')
    return card("On-chain", f"Who {c('holds')} it", body)


for s in range(0, 4):
    add("D11" if s == 0 else f"D11-s{s}", d11(s))


# =====================================================================================================================
# D14  CH4 275.10-281.18  PERPS VS SPOT (bench ruling: credible-venue perps total vs spot, NO single-venue number)
#   s1 perp venues · s2 perps total · s3 spot
# =====================================================================================================================
def d14(st):
    full = 820
    rows = (f'<div class="row {seq(1, st)}"><div class="lb">Perp venues</div><div class="v">'
            f'{m("33")} listed, {m("3")} non-credible excluded <span style="color:var(--text-muted)">=</span> {m("30")}</div></div>'
            f'<div class="row barrow {seq(2, st)}"><div class="lb">Perps, 30 credible venues</div><div class="bw">'
            f'<div class="bar" style="width:{full}px"></div></div><div class="big">265.6M</div></div>'
            f'<div class="row barrow {seq(3, st)}"><div class="lb">Spot</div><div class="bw">'
            f'<div class="bar" style="width:{round(full * 21.4 / 265.6)}px"></div></div><div class="big">21.4M</div></div>')
    body = (f'<p style="margin-top:16px;font-size:34px">Perpetual futures: leveraged bets on the price.</p>'
            f'<div class="divider"></div><div class="rows">{rows}</div>'
            f'<div class="src">24h volume. CoinGecko derivatives and spot tickers, read {m("14 Nov 2026")}.</div>')
    return card("Perps vs spot", f"A lot of the trading is {c('futures')}", body, divider=False)


for s in range(0, 4):
    add("D14" if s == 0 else f"D14-s{s}", d14(s))


# =====================================================================================================================
# D22  CH4 281.18-303.42  WHAT HOLDING IT EARNS
#   s1 STAKING IS LIVE · s2 lock 90 · s3 180 · s4 365 DAYS · s5 EARNS DAILY XP (POINTS) · s6 NOT MORE TOKENS
#   s7 50 OR MORE = A BASIC AGENT · s8 XP: 'future utility will be announced' (the guide's words)
# =====================================================================================================================
def d22(st):
    def rk(i):
        cur = {1: 1, 2: 2, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 5}.get(st, 0)
        return seq(i, cur)
    live = "g" if st >= 1 else ""

    def lock(i, t):
        n = st - 1  # 1..3 lit in turn during s2..s4
        cls = "pill on" if n == i else ("pill" if n < i or st == 0 else "pill")
        sty = "font:700 34px/1.1 'JetBrains Mono';letter-spacing:.02em;text-transform:none;padding:10px 24px"
        if st >= 2 and n > i:
            sty += ";color:var(--text-primary);border-color:#3a4254"
        if st > 4:
            sty += ";color:var(--text-primary);border-color:#3a4254"
        return f'<span class="{cls}" style="{sty}">{t}</span>'
    xp1 = "color:var(--accent-cyan)" if st == 5 else ""
    xp2 = "color:var(--accent-cyan)" if st == 6 else ""
    rows = (f'<div class="row {rk(1)}"><div class="lb">Status</div><div class="v"><span class="st {live}" '
            f'style="font:700 44px/1.2 \'DM Sans\';letter-spacing:0;color:{"var(--accent-green)" if st >= 1 else "inherit"}">'
            f'<i></i>Staking is live</span></div></div>'
            f'<div class="row {rk(2)}"><div class="lb">Lock</div><div class="v" style="display:flex;align-items:center;gap:16px">'
            f'{lock(1, "90")}{lock(2, "180")}{lock(3, "365 <span class=w>days</span>")}'
            f'<span class="pill dim" style="font-size:20px;margin-left:14px">No early withdrawal</span></div></div>'
            f'<div class="row {rk(3)}"><div class="lb">Earns</div><div class="v"><span style="{xp1}">Daily XP (points)</span>, '
            f'<span style="{xp2}">not more tokens</span></div></div>'
            f'<div class="row {rk(4)}"><div class="lb">{m("50")} or more</div><div class="v">= a Basic agent for the length '
            f'of the lock</div></div>'
            f'<div class="row {rk(5)}"><div class="lb">XP</div><div class="v">“future utility will be announced”'
            f'<span style="font:500 28px/1 \'DM Sans\';color:var(--text-muted);margin-left:16px">the guide’s words</span>'
            f'</div></div>')
    body = (f'<div class="rows d22">{rows}</div>'
            f'<div class="src">Staking page and staking guide, read {m("14 Nov 2026")}</div>')
    return card("What holding it earns", f"Does holding it {c('pay')} you anything?", body)


for s in range(0, 9):
    add("D22" if s == 0 else f"D22-s{s}", d22(s))


# =====================================================================================================================
# D23  CH4 303.42-319.98  PIP-5 (never 170M): s1 Token Rewards · s2 turnout · s3 under 0.02% · s4 since the vote
# =====================================================================================================================
def d23(st):
    opts = [("Token Rewards", 138047), ("Governance Voting Power", 107312), ("Platform Revenue", 101017),
            ("Platform Perks", 97843)]
    full = 640
    rows = ""
    for i, (name, v) in enumerate(opts):
        k = ("on" if st == 1 else "done") if (i == 0 and st >= 1) else ""
        rows += (f'<div class="row barrow {k}" style="padding:10px 28px"><div class="v" style="flex:0 0 470px;font-size:36px">'
                 f'{name}</div>'
                 f'<div class="bw"><div class="bar" style="width:{round(full * v / 138047)}px;height:28px"></div></div>'
                 f'<div class="big" style="font-size:40px">{v:,}</div></div>')
    tk = "on" if st == 2 else ("done" if st >= 3 else "")
    turn = (f'<div class="row {tk}" style="margin-top:14px;box-shadow:none;border-color:{"" if tk == "on" else "var(--border)"}">'
            f'<div class="v" style="font-size:40px">{m("1,130")} votes · {m("169,871")} tokens of weight '
            f'<span style="font-weight:500;color:var(--text-muted)">(around {m("170")} thousand)</span></div></div>')
    share = (f'<div class="st gold{hid(st >= 3)}" style="margin-top:22px;font-size:44px"><i></i>'
             f'<span style="font:700 40px/1.2 \'DM Sans\';letter-spacing:0">Under</span> 0.02% '
             f'<span style="font:700 40px/1.2 \'DM Sans\';letter-spacing:0">of the supply</span></div>')
    foot = (f'<div class="src{hid(st == 4)}" style="font-size:29px;color:var(--text-secondary);margin-top:16px">'
            f'Since the vote: staking pages still pay points, no reward announcement found.</div>')
    body = (f'<div class="rows">{rows}</div>{turn}{share}{foot}'
            f'<div class="src" style="margin-top:14px">Snapshot, approval voting (options overlap). Read {m("14 Nov 2026")}.</div>')
    return card(f"The staking vote · PIP-5, closed {m('8 Oct 2026')}", f"How should staking be {c('rewarded')}?", body)


for s in range(0, 5):
    add("D23" if s == 0 else f"D23-s{s}", d23(s))


# =====================================================================================================================
# D20  CH5 319.98-327.54  THE TEAM (text only): s1 COLIN HO, Co-founder and CEO · s2 'Ex-Google/Uber engineer'
# =====================================================================================================================
def d20(st):
    name_col = "var(--text-primary)" if st >= 1 else "var(--text-secondary)"
    role_col = "var(--accent-cyan)" if st >= 1 else "var(--text-secondary)"
    q = "on" if st == 2 else ""
    body = (f'<h1 style="font-size:132px;line-height:1.05;color:{name_col}">Colin Ho</h1>'
            f'<div style="font:600 44px/1.3 \'DM Sans\';color:{role_col};margin-top:10px">Co-founder and CEO</div>'
            f'<div class="divider"></div>'
            f'<div class="rows"><div class="row {q}" style="box-shadow:none;border-color:{"" if q else "var(--border)"}">'
            f'<div class="v" style="font-size:46px">“Ex-Google/Uber engineer”</div>'
            f'<div class="nt" style="font-size:26px;letter-spacing:.12em;text-transform:uppercase">the whitepaper</div></div></div>'
            f'<div class="src">Funding release, {m("24 Oct 2025")} · whitepaper section {m("7.1")}</div>')
    return card("The team", "", body, divider=False, cls="tall")


for s in range(0, 3):
    add("D20" if s == 0 else f"D20-s{s}", d20(s))


# =====================================================================================================================
# D13  CH5 327.54-334.902  THE BACKERS (text only): s1 24 OCT 2025 · s2 Animoca Brands · s3 UOB Ventures
# =====================================================================================================================
def d13(st):
    date = "on" if st == 1 else ("done" if st >= 2 else "")
    a = "on" if st == 2 else ("done" if st >= 3 else "")
    b = "on" if st == 3 else ""
    rows = (f'<div class="row {a}"><div class="lb">Led by</div><div class="v">Animoca Brands</div></div>'
            f'<div class="row {b}"><div class="lb">And</div><div class="v">UOB Ventures</div></div>')
    body = (f'<div class="st {date}" style="margin-top:22px"><i></i>{m("24 OCT 2025")}</div><div class="divider"></div>'
            f'<div class="rows">{rows}</div>'
            f'<div class="src" style="font-size:27px">Also: Binance MVB Season {m("9")} (the project’s claim)</div>'
            f'<div class="src" style="margin-top:8px">The project’s press release, {m("24 Oct 2025")}</div>')
    return card("The backers", f'{c(m("7M"))} strategic round', body, h1cls="", divider=False)


for s in range(0, 4):
    add("D13" if s == 0 else f"D13-s{s}", d13(s))


# =====================================================================================================================
# D15  CH5 339.335-352.669 + CH6 callback 360.335-364.56  WHAT TO WATCH: 3 rows one at a time; s4 = all three lit
# =====================================================================================================================
def d15(st):
    items = [("Circulating supply after", m("14 Nov 2026")), ("Native skills and paid installs", ""),
             ("A published agent count", "")]
    out = ""
    for i, (t, extra) in enumerate(items, 1):
        k = "lit" if st == 4 else ("on" if st == i else ("done" if 0 < i < st else ""))
        num = (f'<span style="flex:0 0 72px;height:72px;border-radius:50%;border:2px solid currentColor;display:flex;'
               f'align-items:center;justify-content:center;font:700 34px/1 \'JetBrains Mono\'">{i}</span>')
        out += (f'<div class="row {k}" style="padding:22px 28px"><div class="v" style="display:flex;align-items:center;'
                f'gap:34px;font-size:48px">{num}<span>{t} {extra}</span></div></div>')
    return card("What to watch", f"Three numbers I’m {c('watching')}", f'<div class="rows d15">{out}</div>')


for s in range(0, 5):
    add("D15" if s == 0 else f"D15-s{s}", d15(s))


# =====================================================================================================================
# END  CH6 364.56-373.24  END CARD, YouTube end-screen geometry (2 video slots, 620x350, 80 px apart, text clear)
#   s1 LIKE · s2 SUBSCRIBE · s3 COMMENT · s4 the prompt
# =====================================================================================================================
SLOTS = [(300, 392), (1000, 392)]  # x, y of each 620x350 slot (gap 80 px across)


def end(st):
    def p(i, icon, t):
        cls = "pill on" if st == i else ("pill" if st < i else "pill")
        sty = "font-size:28px;padding:16px 30px"
        if st > i:
            sty += ";color:var(--text-primary);border-color:#3a4254"
        return f'<span class="{cls}" style="{sty}">{ic(icon)}{t}</span>'
    prompt_col = "var(--text-primary)" if st == 4 else "var(--text-secondary)"
    sim = "c" if st == 4 else ""
    top = (f'<div style="position:absolute;left:300px;top:96px;width:1320px">'
           f'<div class="ey" style="margin-bottom:18px">Before you go</div>'
           f'<div style="display:flex;align-items:center;justify-content:space-between;gap:30px">'
           f'<h1 style="font-size:58px;line-height:1.1;color:{prompt_col}">Into Pieverse, or holding something '
           f'<span class="{sim}">similar</span>?</h1></div></div>')
    pills = (f'<div style="position:absolute;left:300px;top:{392 + 350 + 54}px;width:1320px;display:flex;gap:22px;'
             f'align-items:center">{p(1, "thumb", "Like")}{p(2, "bell", "Subscribe")}{p(3, "msg", "Comment")}</div>')
    slots = "".join(f'<div class="slot" style="left:{x}px;top:{y}px"></div>' for x, y in SLOTS)
    foot = (f'<div class="src" style="position:absolute;left:300px;top:{392 + 350 + 160}px;margin:0;font-size:28px;'
            f'color:var(--text-secondary);display:flex;align-items:center;gap:14px">'
            f'{ic("down", "ic")}Community link in the description</div>')
    return f'{orbs()}{top}{slots}{pills}{foot}'


for s in range(0, 5):
    add("END" if s == 0 else f"END-s{s}", end(s), cls="endc")


EXTRA_CSS = """
.d9 .row .nt{font-size:28px}
.d9 .row .nt .mono{word-spacing:-.3em}
.d2 .row{align-items:flex-start;padding-top:20px;padding-bottom:20px}
.d2 .row .lb{flex-basis:300px;padding-top:10px;line-height:1.45}
.d2 .row .v{font-size:40px;font-weight:600}
.d2 .row.lit .v{color:var(--text-primary)}
.d18 .row .v{font-size:46px}
.d22 .row{padding-top:13px;padding-bottom:13px}
.d22 .row .lb{flex-basis:250px}
.d22 .row .v{font-size:40px}
.d6 .row .lb{flex-basis:300px}
.d15 .row.lit .v span:first-child{color:var(--acc)}
.d15 .row.on .v span:first-child{color:var(--acc)}
.row .ic + .v{margin-left:0}
"""


def build_html():
    css = (REF / "container-canonical.css").read_text(encoding="utf-8")
    body = "\n".join(f'<div class="frame {cls}" id="{fid}" data-kind="{kind}">{inner}</div>'
                     for fid, kind, inner, cls in FRAMES)
    html = (f'<!doctype html><html><head><meta charset="utf-8"><title>pieverse: title + card slides</title>'
            f'<link href="{FONTS}" rel="stylesheet">'
            f'<style>{css}</style><style>{LOCAL}{EXTRA_CSS}</style></head><body>\n{body}\n</body></html>\n')
    (HERE / "containers.html").write_text(html, encoding="utf-8")


CHECK = """(el)=>{
  const r=el.getBoundingClientRect(); const out=[];
  if(Math.round(r.width)!==1920||Math.round(r.height)!==1080) out.push('frame size '+r.width+'x'+r.height);
  const txt=el.innerText;
  if(/\\u2014/.test(txt)) out.push('em dash');
  if(/\\u2013/.test(txt)) out.push('en dash');
  if(/\\$/.test(txt)) out.push('dollar sign');
  el.querySelectorAll('.ey,h1,p,.row,.v,.card,.rows,.src,.st,.pill,.half,.tile3,.big,.lb,.nt').forEach(n=>{
    const b=n.getBoundingClientRect();
    if(b.width===0||getComputedStyle(n).visibility==='hidden') return;
    if(b.left-r.left<40||r.right-b.right<40||b.top-r.top<30||r.bottom-b.bottom<30) out.push('near edge: '+n.className+' '+[b.left-r.left,b.top-r.top,b.right-r.left,b.bottom-r.top].map(Math.round));
    // .rows: its rows carry a deliberate -28 px side margin (the ring sits in the card padding), checked below instead
    if(!n.classList.contains('rows')&&n.scrollWidth>n.clientWidth+1&&n.clientWidth>0&&getComputedStyle(n).display!=='inline') out.push('overflow-x: '+n.className+' '+n.innerText.slice(0,40));
    if(n.classList.contains('rows')&&n.scrollWidth>n.clientWidth+30) out.push('overflow-x: '+n.className+' '+n.innerText.slice(0,40));
    if(n.scrollHeight>n.clientHeight+2&&n.clientHeight>0&&getComputedStyle(n).display!=='inline'&&getComputedStyle(n).overflow!=='visible') out.push('overflow-y: '+n.className+' '+n.innerText.slice(0,40));
  });
  const c=el.querySelector('.card'); if(c){const cb=c.getBoundingClientRect();
    c.querySelectorAll('.row,.tile3,h1,.ey,p,.st,.pill,.src,.half,.big').forEach(n=>{const b=n.getBoundingClientRect();
      if(b.width===0) return;
      if(b.right>cb.right-24||b.bottom>cb.bottom-18||b.left<cb.left+24) out.push('outside card padding: '+n.className+' '+n.innerText.slice(0,40));});
    out.push('card box '+[cb.left-r.left,cb.top-r.top,cb.width,cb.height].map(Math.round).join(','));}
  const slots=[...el.querySelectorAll('.slot')];
  if(slots.length){
    const sb=slots.map(s=>s.getBoundingClientRect());
    sb.forEach(b=>{if(Math.round(b.width)!==620||Math.round(b.height)!==350) out.push('slot size '+b.width+'x'+b.height);});
    for(let i=1;i<sb.length;i++){const gap=sb[i].left-sb[i-1].right; if(gap<60) out.push('slot gap '+gap);}
    el.querySelectorAll('h1,.ey,.pill,.src,.ic').forEach(n=>{const b=n.getBoundingClientRect(); if(!b.width) return;
      sb.forEach(s=>{if(b.left<s.right&&b.right>s.left&&b.top<s.bottom&&b.bottom>s.top) out.push('text inside a slot: '+n.className+' '+n.innerText.slice(0,30));});});
    out.push('slots '+sb.map(b=>[b.left-r.left,b.top-r.top,b.width,b.height].map(Math.round).join(',')).join(' | '));
  }
  return out}"""


def main():
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    build_html()
    for d in OUT.values():
        d.mkdir(parents=True, exist_ok=True)
    problems, written = [], []
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
        pg.goto((HERE / "containers.html").as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for fam, w in [("Playfair Display", 900), ("Playfair Display", 700), ("DM Sans", 600), ("DM Sans", 700),
                       ("DM Sans", 500), ("JetBrains Mono", 600), ("JetBrains Mono", 700)]:
            ok = pg.evaluate("([f,w])=>document.fonts.check(`${w} 40px '${f}'`)&&[...document.fonts].some(x=>{if(x.family.replace(/\"/g,'')!==f||x.status!=='loaded')return false;const r=String(x.weight).split(' ').map(Number);return r.length>1?(w>=r[0]&&w<=r[1]):r[0]===w;})", [fam, w])
            if not ok:
                problems.append(f"FONT NOT LOADED: {fam} {w}")
        pg.evaluate("document.body.classList.add('solo')")
        for fid, kind, _, _ in FRAMES:
            if only and fid not in only and not any(fid.startswith(o + "-") for o in only):
                continue
            pg.evaluate("(id)=>{document.querySelectorAll('.frame.cur').forEach(f=>f.classList.remove('cur'));"
                        "document.getElementById(id).classList.add('cur');window.scrollTo(0,0);}", fid)
            el = pg.locator(f"#{fid}")
            for msg in el.evaluate(CHECK):
                if msg.startswith(("card box ", "slots ")):
                    print(f"  {fid}: {msg}")
                else:
                    problems.append(f"{fid}: {msg}")
            path = OUT[kind] / f"{fid}.png"
            raw = pg.screenshot(type="png", clip={"x": 0, "y": 0, "width": 1920, "height": 1080})
            img = Image.open(io.BytesIO(raw)).convert("RGB").resize((1920, 1080), Image.LANCZOS)
            img.save(path)
            written.append(path)
        br.close()
    print(f"wrote {len(written)} PNGs")
    if problems:
        print("\n".join(["PROBLEMS:"] + problems))
        sys.exit(1)
    print("GATES PASS")


if __name__ == "__main__":
    main()
