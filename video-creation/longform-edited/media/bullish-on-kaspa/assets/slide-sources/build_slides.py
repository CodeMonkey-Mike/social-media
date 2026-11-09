"""bullish-on-kaspa CARD SLIDES: writes containers.html (one standalone 1920x1080 frame per state) and screenshots each
to ../card-slides/<frame id>.png. Locked stylesheet + light theme are pasted verbatim from container-reference/.
Run: python build_slides.py [frame-id ...]"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "card-slides"
REF = HERE.parents[3] / "skills" / "container-reference"
FONTS = ("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700;1,900"
         "&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;600;700"
         "&family=Archivo:wdth,wght@125,900&family=Montserrat:ital,wght@1,800&display=swap")

LOCAL = """
/* per-video: the chapter accent (CH1 to CH6 = Kaspa greenish cyan #49EACB). Raw hue on strokes / rings / the orb; on TEXT
   the light file's own darkened teal #0E7A6C (5.2:1 on white, #49EACB itself is 1.5:1 and unreadable as text). */
.frame{--kas:#49EACB;--kas-ink:var(--accent-teal);--acc-rgb:73,234,203}
.k{color:var(--kas-ink)}
.orb.a{width:900px;height:900px;right:-260px;top:-380px;background:var(--kas);opacity:.26}
.orb.b{width:700px;height:700px;left:-300px;bottom:-380px;background:#c3cddd;opacity:.30}
.card{position:relative;width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:62px 88px 66px;overflow:hidden}
.card>.top{position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,var(--kas-ink),var(--kas) 42%,rgba(73,234,203,0) 92%)}
.ghost{visibility:hidden}
.rows{display:flex;flex-direction:column;gap:18px;width:100%}
.row{display:flex;align-items:center;justify-content:space-between;gap:30px;padding:24px 36px;border-radius:18px;border:1px solid var(--border);background:var(--bg-card-hover);
  font:600 44px/1.2 'DM Sans';letter-spacing:.03em;color:var(--text-secondary)}
.row .yr{font-family:'JetBrains Mono';font-weight:600;font-size:52px;letter-spacing:0;color:var(--text-secondary)}
.row.on{border:2px solid var(--kas-ink);background:rgba(73,234,203,.12);color:var(--kas-ink);padding:23px 35px}
.row.on .yr{color:var(--kas-ink)}
.chips{display:flex;gap:22px;flex-wrap:wrap}
.chip{padding:18px 36px;border-radius:999px;border:2px solid var(--wire);background:var(--bg-card-hover);font:600 34px/1.2 'DM Sans';letter-spacing:.06em;color:var(--text-secondary)}
.chip.on{border-color:var(--kas-ink);color:var(--kas-ink)}
.chip.big{font-size:52px;padding:26px 58px}
.sub{font:600 33px/1.35 'DM Sans';letter-spacing:.05em;color:var(--text-secondary);max-width:none}
.src{font:500 27px/1.2 'DM Sans';color:var(--text-muted);margin-top:34px}
/* word-by-word */
.big60{display:flex;align-items:baseline;gap:34px;margin-top:6px}
.big60 .ar{font:900 70px/1 'Playfair Display';color:var(--text-primary);letter-spacing:-.01em}
.big60 .n{font:700 230px/1 'JetBrains Mono';color:var(--kas-ink);letter-spacing:-.04em}
.big60 .l{font:900 104px/1 'Playfair Display';color:var(--kas-ink)}
.now{font:600 38px/1 'DM Sans';letter-spacing:.2em;color:var(--text-muted);margin:0 0 20px}
/* ladder */
.rung{display:flex;align-items:baseline;gap:40px;padding:14px 0}
.rung .n{font:600 76px/1.05 'JetBrains Mono';color:var(--text-secondary);min-width:400px}
.rung .t{font:600 36px/1.2 'DM Sans';letter-spacing:.06em;color:var(--text-secondary)}
.rung.pay{align-items:center;margin-top:8px}
.rung.pay .n{font-size:200px;font-weight:700;line-height:1;color:var(--kas-ink);letter-spacing:-.04em}
.rung.pay .t{font-size:44px;color:var(--kas-ink);max-width:800px}
/* roadmap strip */
.strip{display:grid;grid-template-columns:1fr 1fr 1fr 1.25fr;gap:0;position:relative;margin-top:14px}
.strip:before{content:"";position:absolute;left:12px;right:60px;top:17px;height:4px;background:var(--wire)}
.st{position:relative;padding:62px 28px 0 0}
.st:before{content:"";position:absolute;left:0;top:4px;width:30px;height:30px;border-radius:50%;background:var(--bg-card);border:4px solid var(--wire)}
.st .w{font:600 38px/1.2 'JetBrains Mono';color:var(--text-secondary)}
.st .a{font:700 56px/1.2 'DM Sans';letter-spacing:.03em;color:var(--text-secondary);margin-top:12px}
.st .x{font:600 34px/1.2 'DM Sans';letter-spacing:.08em;color:var(--text-secondary);margin-top:10px}
.frame .st.on{box-shadow:none}
.st.on:before{background:var(--kas);border-color:var(--kas-ink);box-shadow:0 0 0 8px rgba(73,234,203,.28)}
.st.on .w,.st.on .a,.st.on .x{color:var(--kas-ink)}
/* parallel line */
.line{margin-top:6px;padding:28px 40px;border-radius:18px;border:1px solid var(--border);background:var(--bg-card-hover);font:700 56px/1.2 'DM Sans';letter-spacing:.02em;color:var(--text-secondary)}
.line.on{border:2px solid var(--kas-ink);background:rgba(73,234,203,.12);color:var(--text-primary);padding:27px 39px}
/* statement */
.stmt{font:900 76px/1.2 'Playfair Display';letter-spacing:-.01em;color:var(--text-primary)}
.stmt .mono{font-size:.92em}
/* the text wall: the device's own look (black), screenplay CH6 Beat 1 + the container-theme note */
.frame.wall{background:#000;padding:0}
.frame.wall::after,.frame.alpha::after{display:none}
.frame.alpha{background:transparent}
.frame>.wallbox{position:absolute;left:-200px;right:-200px;top:-110px;bottom:-110px;display:flex;flex-direction:column;justify-content:center;gap:14px;transform:rotate(-7deg)}
.wr{white-space:nowrap;text-align:center;font-family:'Archivo';font-stretch:125%;font-weight:900;line-height:1.02;letter-spacing:.005em}
.wr.f{color:#fff}
.wr.o{color:#000;-webkit-text-stroke:2.5px #fff}
.frame>.early{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%) rotate(-1deg);text-align:center;font:italic 800 300px/1 'Montserrat';color:#E80001;
  -webkit-text-stroke:10px #fff;paint-order:stroke fill;text-shadow:0 0 70px rgba(232,0,1,.85),0 0 24px rgba(232,0,1,.6)}
"""


def frame(fid, inner, cls=""):
    return f'<div class="frame {cls}" id="{fid}"><div class="orb a"></div><div class="orb b"></div>{inner}</div>\n'


def card(ey, h1, body, h1cls=""):
    return (f'<div class="card"><div class="top"></div><div class="ey">{ey}</div><h1 class="{h1cls}">{h1}</h1>'
            f'<div class="divider"></div>{body}</div>')


def rows(items, shown, lit=None):
    """Cumulative landing: rows after `shown` keep their layout slot but are hidden, the newest is lit, the earlier ones rest READABLE."""
    lit = shown - 1 if lit is None else lit
    out = []
    for i, (t, y) in enumerate(items):
        c = "row" + (" on" if i == lit else "") + (" ghost" if i >= shown else "")
        out.append(f'<div class="{c}"><span>{t}</span>' + (f'<span class="yr">{y}</span>' if y else "") + "</div>")
    return '<div class="rows">' + "".join(out) + "</div>"


M = lambda s: f'<span class="mono">{s}</span>'
F = {}

# research-stack
R = [("GHOST", "2013"), ("GHOSTDAG", "2018"), ("DAGKNIGHT", "2022")]
for n in (1, 2, 3):
    F[f"research-stack-s{n}"] = frame(f"research-stack-s{n}", card("Yonatan Sompolinsky", 'THE <span class="k">RESEARCH</span>', rows(R, n)))


# silverscript-60-lines
def ss(n):
    g = lambda k: "" if n >= k else " ghost"
    return card("Silverscript", "THOUSANDS OF LINES",
                f'<div class="now{g(2)}">NOW</div><div class="big60{g(3)}"><span class="ar">AROUND</span><span class="n">60</span><span class="l">LINES</span></div>'
                f'<div class="src">Kaspa Commons, {M("2026-09-10")}</div>')


for n in (1, 2, 3):
    F[f"silverscript-60-lines-s{n}"] = frame(f"silverscript-60-lines-s{n}", ss(n))


# bps-ladder
def ladder(n):
    g = lambda k: "" if n >= k else " ghost"
    return card("The Path", 'BLOCKS A <span class="k">SECOND</span>',
                f'<div class="rung"><span class="n">10</span><span class="t">NOW</span></div>'
                f'<div class="rung{g(2)}"><span class="n">25 TO 40</span><span class="t">TARGETED NEXT</span></div>'
                f'<div class="rung pay{g(3)}"><span class="n">100</span><span class="t">TARGETED FOR A<br>{M("2027")} HARD FORK</span></div>', "sm")


for n in (1, 2, 3):
    F[f"bps-ladder-s{n}"] = frame(f"bps-ladder-s{n}", ladder(n))

# stablecoin-card A / B / C
H = 'A <span class="k">STABLECOIN</span>'
A = [("COMMUNITY FUNDED", ""), ("LED BY A CORE DEVELOPER, ALEXANDER SAFSTROM", ""), (f"AUTHOR OF KIP-{M('16')}", "")]
chipsA = f'<div class="chips" style="margin-bottom:30px"><span class="chip on">ISSUED AGAINST {M("KAS")}</span><span class="chip on">SETTLED ON THE BASE LAYER</span></div>'
for n in range(0, 4):
    F[f"stablecoin-card-A-s{n+1}"] = frame(f"stablecoin-card-A-s{n+1}", card("Planned", H, chipsA + rows(A, n, n - 1 if n else -1)))


def stB(n):
    g = lambda k: "" if n >= k else " ghost"
    lit = lambda k: " on" if n == k else ""
    return card("The Fundraiser", H,
                f'<div class="chips{g(1)}" style="margin-bottom:26px"><span class="chip big{lit(1)}">{M("5M KAS")} GOAL</span></div>'
                + '<div class="rows">'
                + f'<div class="row{lit(2)}{g(2)}"><span>FUNDRAISER CLOSES</span><span class="yr">JAN 1 2027</span></div>'
                + f'<div class="row{lit(3)}{g(3)}"><span>REFUNDS IF IT MISSES</span></div></div>')


for n in range(0, 4):
    F[f"stablecoin-card-B-s{n+1}"] = frame(f"stablecoin-card-B-s{n+1}", stB(n))


def stC(lit):
    return card("The Roadmap, If It Hits", H,
                '<div class="strip">'
                '<div class="st"><div class="w">JAN TO APR</div><div class="a">BUILD</div></div>'
                '<div class="st"><div class="w">MAY</div><div class="a">TESTNET</div></div>'
                '<div class="st"><div class="w">JUN TO AUG</div><div class="a">AUDIT</div></div>'
                f'<div class="st{" on" if lit else ""}"><div class="w">SEPTEMBER 2027</div><div class="a">MAINNET</div><div class="x">(TARGETED)</div></div>'
                '</div>')


F["stablecoin-card-C-s1"] = frame("stablecoin-card-C-s1", stC(False))
F["stablecoin-card-C-s2"] = frame("stablecoin-card-C-s2", stC(True))


# parallel-not-prediction A / B
def par(b):
    can = '<span class="k">CAN</span>' if b else "CAN"
    return card("Solana did this", 'A <span class="k">PARALLEL</span>, NOT A PREDICTION',
                f'<div class="line{" on" if b else ""}">WHAT A WRITTEN-OFF NETWORK {can} DO</div>')


F["parallel-not-prediction-A"] = frame("parallel-not-prediction-A", par(False))
F["parallel-not-prediction-B"] = frame("parallel-not-prediction-B", par(True))

# where-i-stand
W = [("SOUND MONEY", ""), ("MINED BY ANYONE", ""), ("OWNED BY NO ONE", ""), ("A BASE LAYER THAT JUST LEARNED TO RUN APPS", "")]
for i, n in enumerate((2, 3, 4)):
    F[f"where-i-stand-s{i+1}"] = frame(f"where-i-stand-s{i+1}", card("The Conviction", 'HERE&rsquo;S WHERE I <span class="k">STAND</span>', rows(W, n), "sm"))

# my-theory (the statement: the whole block at once, one hold)
F["my-theory"] = frame("my-theory", card("The Long Term", '<span class="k">MY THEORY:</span>',
                                         f'<div class="stmt">ETHEREUM TAKES NUMBER {M("1")}<br>BITCOIN MAXIS GO LOOKING<br>FOR A <span class="k">PROOF OF WORK HOME</span></div>'))


# community-stack
def com(n):
    items = ["HARDCORE", "PATIENT", "STILL HERE"]
    chips = "".join(f'<span class="chip big{" on" if i == n-1 else ""}{" ghost" if i >= n else ""}">{t}</span>' for i, t in enumerate(items))
    return card("The People", 'THE <span class="k">KASPA</span> COMMUNITY',
                f'<div class="sub" style="margin-bottom:40px">AS DEDICATED AS THE {M("XRP")} ARMY, THE HIGHEST COMPLIMENT</div><div class="chips">{chips}</div>')


for n in range(0, 4):
    F[f"community-stack-s{n+1}"] = frame(f"community-stack-s{n+1}", com(n))

# text-wall: filled wall, outlined wall (the comp cross-fades + tilts them for the pulse), the headline as an alpha layer, and the composite
SIZES = [60, 70, 82, 96, 112, 130, 150, 172, 196, 224]


def wallrows(style):
    out = []
    for i, s in enumerate(SIZES):
        reps = max(3, int(3400 / (s * 6.6)) + 1)
        off = ' style="font-size:%dpx;margin-left:%dpx"' % (s, -40 * (i % 3))
        out.append(f'<div class="wr {style}"{off}>' + " ".join(["TOO LATE?"] * reps) + "</div>")
    return '<div class="wallbox">' + "".join(out) + "</div>"


EARLY = '<div class="early">EARLY.</div>'
F["text-wall-filled"] = f'<div class="frame wall" id="text-wall-filled">{wallrows("f")}</div>\n'
F["text-wall-outlined"] = f'<div class="frame wall" id="text-wall-outlined">{wallrows("o")}</div>\n'
F["text-wall"] = f'<div class="frame wall" id="text-wall">{wallrows("o")}{EARLY}</div>\n'
F["text-wall-early-alpha"] = f'<div class="frame alpha" id="text-wall-early-alpha">{EARLY}</div>\n'
ALPHA = {"text-wall-early-alpha"}

canon = (REF / "container-canonical.css").read_text(encoding="utf-8")
light = (REF / "container-canonical-light.css").read_text(encoding="utf-8")
html = (f'<!doctype html><html><head><meta charset="utf-8"><link href="{FONTS}" rel="stylesheet">\n'
        f"<style>{canon}</style>\n<style>{light}</style>\n<style>{LOCAL}</style></head><body>\n" + "".join(F.values()) + "</body></html>\n")
(HERE / "containers.html").write_text(html, encoding="utf-8")

want = sys.argv[1:] or list(F)
OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
    pg.goto((HERE / "containers.html").as_uri(), wait_until="networkidle")
    pg.evaluate("document.fonts.ready")
    for fam in ("900 40px 'Playfair Display'", "600 40px 'DM Sans'", "600 40px 'JetBrains Mono'", "900 40px Archivo", "italic 800 40px Montserrat"):
        print(fam, pg.evaluate("f=>document.fonts.check(f)", fam))
    over = pg.evaluate("""()=>[...document.querySelectorAll('.card')].map(c=>{const f=c.closest('.frame');const r=c.getBoundingClientRect();
        return [f.id,Math.round(r.height),c.scrollHeight>c.clientHeight+1||c.scrollWidth>c.clientWidth+1]})""")
    for o in over:
        print("card", o)
    for fid in want:
        el = pg.locator(f"#{fid}")
        if fid in ALPHA:
            pg.evaluate("document.body.style.background='transparent';document.documentElement.style.background='transparent'")
        el.screenshot(path=str(OUT / f"{fid}.png"), omit_background=fid in ALPHA)
        if fid in ALPHA:
            pg.evaluate("document.body.style.background='';document.documentElement.style.background=''")
    b.close()
print(len(want), "frames written")
