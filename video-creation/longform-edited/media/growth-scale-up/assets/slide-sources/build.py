"""growth-scale-up slide builder: writes containers.html (all frames) and screenshots each frame."""
import pathlib
import sys
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
ASSETS = HERE.parent
REF = HERE.parents[3] / "skills" / "container-reference"
CSS = (REF / "container-canonical.css").read_text(encoding="utf-8")
LIGHT = (REF / "container-canonical-light.css").read_text(encoding="utf-8")
A, B = "var(--accent-cyan)", "var(--accent-gold)"
CYAN, GOLD = "0,106,158", "143,101,0"

ONE = ('<svg viewBox="0 0 40 40" class="ic" fill="currentColor"><circle cx="20" cy="12" r="7"/>'
       '<path d="M6 37c0-8 6-14 14-14s14 6 14 14z"/></svg>')


def _five():
    parts = []
    for x, y, r in [(12, 12, 4), (28, 12, 4), (44, 12, 4), (20, 25, 4.4), (36, 25, 4.4)]:
        parts.append(f'<circle cx="{x}" cy="{y}" r="{r}"/>'
                     f'<path d="M{x - r * 1.9} {y + r * 3.6}c0-{r * 1.7} {r * 0.9}-{r * 2.5} {r * 1.9}-{r * 2.5}'
                     f's{r * 1.9} {r * 0.8} {r * 1.9} {r * 2.5}z"/>')
    return f'<svg viewBox="0 0 56 44" class="ic wide" fill="currentColor">{"".join(parts)}</svg>'


FIVE = _five()
BUOY = ('<svg viewBox="0 0 40 40" style="width:84px;height:84px">'
        '<circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="8"/>'
        '<g stroke="#FFFFFF" stroke-width="5"><path d="M20 1v10M20 29v10M1 20h10M29 20h10"/></g></svg>')

EXTRA = """
.ic{width:46px;height:46px;flex:none}.ic.wide{width:64px}
.seat{display:inline-flex;align-items:center;gap:16px;font:700 26px 'DM Sans';letter-spacing:.16em;background:var(--bg-card);
  text-transform:uppercase;padding:12px 26px 12px 18px;border-radius:999px;border:2px solid currentColor;margin-bottom:34px;align-self:flex-start}
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:70px 84px 76px;
  width:1560px;max-width:1560px;position:relative;overflow:hidden;align-self:flex-start}
.card p{font-size:42px;max-width:1380px}
.card::before,.sheet::before,.seatcard::before{content:"";position:absolute;left:0;right:0;top:0;height:6px;background:var(--acc)}
.k{color:var(--acc)}
.paper{background:#E1DFE1 url(paper.jpg) center/cover}
.paper .orb{display:none}
.sheet{background:rgba(255,255,255,.82);border-radius:28px;padding:60px 80px 70px;max-width:1640px;align-self:flex-start;
  box-shadow:0 1px 2px rgba(20,22,26,.05),0 14px 34px rgba(20,22,26,.10);position:relative;overflow:hidden}
.items{display:grid;gap:22px 48px;margin-top:6px}
.sheet[style*="1640"] .it .t{font-size:64px}.sheet[style*="1640"] .it{min-height:140px}
.it{display:flex;align-items:center;gap:26px;padding:22px 30px;border-radius:18px;border:2px solid var(--border);background:#fff;min-height:118px}
.it .n{font:600 30px 'JetBrains Mono';color:var(--text-muted);flex:none}
.it .t{font:800 50px/1.1 'DM Sans';text-transform:uppercase;letter-spacing:.01em;color:var(--text-secondary)}
.it .s{display:block;font:700 22px 'DM Sans';letter-spacing:.18em;color:var(--text-muted);margin-top:8px}
.it.on{border-color:var(--acc);box-shadow:0 0 0 4px rgba(var(--acc-rgb),.12),0 12px 28px rgba(20,22,26,.12)}
.it.on .t{color:var(--text-primary)} .it.on .n,.it.on .s{color:var(--acc)}
.it.empty{border-style:dashed;background:rgba(255,255,255,.35)} .it.empty .t,.it.empty .s{visibility:hidden}
.owner{margin-left:auto;color:var(--accent-gold);display:flex}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:40px;width:100%}
.seatcard{background:var(--bg-card);border:2px solid var(--border);border-radius:28px;padding:60px 56px 64px;position:relative;overflow:hidden;
  display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(20,22,26,.05),0 14px 34px rgba(20,22,26,.08)}
.seatcard.rest{opacity:.6}
.seatcard.lit{border-color:var(--acc);box-shadow:0 0 0 4px rgba(var(--acc-rgb),.12),0 12px 28px rgba(20,22,26,.12)}
.strip{display:flex;gap:18px;margin-bottom:30px;opacity:.7}
.strip span{font:700 24px 'DM Sans';letter-spacing:.18em;color:var(--text-muted);border:1px solid var(--border);border-radius:999px;padding:8px 22px;background:var(--bg-card)}
.lines{display:flex;flex-direction:column;gap:12px}
.ln{font:800 54px 'DM Sans';letter-spacing:.05em;color:var(--text-secondary)}
.ln.on{color:var(--acc)} .ln.on,.bold.on{box-shadow:none}
.bold{margin-top:34px;padding-top:30px;border-top:2px solid var(--border);font:800 40px 'DM Sans';letter-spacing:.03em;color:var(--text-secondary)}
.bold.on{color:var(--text-primary)} .bold.on .k2{color:var(--acc)}
"""


def frame(fid, body, acc=A, rgb=CYAN, cls=""):
    return (f'<div class="frame {cls}" id="{fid}" style="--acc:{acc};--acc-rgb:{rgb}">'
            f'<div class="orb" style="width:700px;height:700px;right:-160px;top:-200px;background:{acc}"></div>{body}</div>')


def seat(color, icon, label):
    return f'<div class="seat" style="color:{color}">{icon}{label}</div>'


def items(lst, k, cols, owners=False):
    """k = number of items shown; item k is the lit one (k > len = all shown, none lit)."""
    out = []
    for i, (t, s) in enumerate(lst):
        cls = "on" if i == k - 1 else ("" if i < k else "empty")
        sub = f'<span class="s">{s}</span>' if s else ""
        own = f'<span class="owner">{ONE}</span>' if owners else ""
        out.append(f'<div class="it {cls}"><span class="n">{i + 1:02d}</span><span class="t">{t}{sub}</span>{own}</div>')
    rows = (len(lst) + cols - 1) // cols
    return (f'<div class="items" style="grid-template-columns:repeat({cols},1fr);grid-template-rows:repeat({rows},auto);'
            f'grid-auto-flow:column">' + "".join(out) + "</div>")


F = {}
F["K1-better-move-card"] = frame("K1-better-move-card",
    '<div class="card"><div class="ey">The better move</div>'
    '<h1>List the <span class="k nob">highest-impact</span> work</h1><div class="divider"></div>'
    '<p>the work that moves the business toward its growth goals,</p>'
    '<p>then figure out how someone could spend their time on <b>exactly that</b>.</p></div>')
F["K2-hire-into-impact-card"] = frame("K2-hire-into-impact-card",
    seat(B, FIVE, "Team of five") +
    '<div class="card"><h1><span class="k">Hire into</span> the <span class="nob">highest-impact</span> work</h1><div class="divider"></div>'
    '<p style="font-size:40px">not the leftovers.</p></div>', B, GOLD)
F["K3-anti-pattern-card"] = frame("K3-anti-pattern-card",
    seat(B, FIVE, "Team of five") +
    '<div class="card"><div class="ey">The anti-pattern</div>'
    '<h1>A report prompts <span class="k">Claude</span> or <span class="k">ChatGPT</span> for a growth strategy</h1></div>',
    B, GOLD)

C2 = [("Variant copy", "Acquisition"), ("Onboarding variants", "Activation"), ("Weekly funnel readout", "All"),
      ("Session recording review", "Activation"), ("Churn flags", "Retention"), ("Failed payment retries", "Revenue")]
for k in range(1, 7):
    fid = f"C2-agents-take-list-s{k}"
    F[fid] = frame(fid, f'<div class="sheet">{seat(A, ONE, "Team of one")}<div class="ey">What the agents take</div>'
                        f'{items(C2, k, 2)}</div>', cls="paper")

L1 = [("Speed or rigor", ""), ("Polish or rough draft", ""), ("Spend or protect the budget", "")]
for k in range(1, 4):
    fid = f"L1-principles-list-s{k}"
    F[fid] = frame(fid, '<div class="sheet" style="width:1640px"><div class="ey">Operating principles, in writing</div>'
                        f'{items(L1, k, 1)}</div>', cls="paper")

L2 = [("Experiment loop", ""), ("Churn agent", ""), ("Monday digest", ""), ("Programmatic SEO", "")]
for k in range(1, 5):
    fid = f"L2-plays-list-s{k}"
    F[fid] = frame(fid, f'<div class="sheet" style="width:1640px"><div class="ey">The plays</div>{items(L2, k, 1)}</div>',
                   cls="paper")
F["L2-plays-list-s5"] = frame("L2-plays-list-s5",
    f'<div class="sheet" style="width:1640px">{seat(A, ONE, "Team of one")}<div class="ey">The plays</div>'
    f'{items(L2, 5, 1)}</div>', cls="paper")
F["L2-plays-list-s6"] = frame("L2-plays-list-s6",
    f'<div class="sheet" style="width:1640px"><div style="display:flex;gap:18px">{seat(A, ONE, "Team of one")}'
    f'{seat(B, FIVE, "Team of five")}</div><div class="ey">The plays</div>{items(L2, 5, 1, owners=True)}</div>',
    cls="paper")


def seats(state):
    a = "lit" if state >= 1 else "rest"
    b = "lit" if state >= 2 else "rest"
    return ('<div class="strip"><span>STRATEGY</span><span>EXECUTION</span><span>ANALYSIS</span></div><div class="row2">'
            f'<div class="seatcard {a}" style="--acc:{A};--acc-rgb:{CYAN}">{seat(A, ONE, "Team of one")}'
            f'<h1 class="sm">You hold the <span style="color:{A}">strategy</span></h1></div>'
            f'<div class="seatcard {b}" style="--acc:{B};--acc-rgb:{GOLD}">{seat(B, FIVE, "Team of five")}'
            f'<h1 class="sm">You write the <span style="color:{B}">guardrails</span></h1>'
            '<p style="margin-top:24px;font-weight:700;letter-spacing:.06em">STRATEGY? EXECUTION? ANALYSIS?</p></div></div>')


for s in (1, 2):
    F[f"C1-seats-row-s{s}"] = frame(f"C1-seats-row-s{s}", seats(s))


def churn(s):
    d = "on" if s >= 1 else ""
    bl = "on" if s >= 2 else ""
    return (f'<div class="card" style="width:1400px"><div class="ey">Play 2</div>'
            f'<h1 style="display:flex;align-items:center;gap:28px"><span class="k" style="display:flex">{BUOY}</span>Churn agent</h1>'
            '<div class="divider"></div>'
            f'<div class="lines"><div class="ln">FLAGS</div><div class="ln">RETRIES</div><div class="ln {d}">DRAFTS</div></div>'
            f'<div class="bold {bl}">YOU OWN THE <span class="k2">TEMPLATE AND THE OFFER</span></div></div>')


for s in (1, 2):
    F[f"CHURN-agent-panel-s{s}"] = frame(f"CHURN-agent-panel-s{s}", churn(s))

VERT = "--vertical" in sys.argv
# PORTRAIT (9:16) reflow, vertical-repurpose.md section 1: same locked tokens, frame resized, rows stack.
VCSS = """
.frame{width:1080px;height:1920px;padding:0 72px}
h1{font-size:76px;max-width:none}h1.sm{font-size:60px}
.card,.sheet{width:auto!important;max-width:none!important;align-self:stretch;padding:60px 56px 66px}
.card p{font-size:40px;max-width:none}
.items{grid-template-columns:1fr!important;grid-template-rows:none!important;grid-auto-flow:row!important;gap:22px}
.it .t{font-size:46px}.sheet[style*="1640"] .it .t{font-size:56px}
.row2{grid-template-columns:1fr;gap:36px}
.strip{flex-wrap:wrap}
.seat{font-size:24px}
/* FILL-THE-FRAME pass (visual-qa 2026-10-28): phone-size type, card body 70-80% of frame height */
#K1-better-move-card .card,#K2-hire-into-impact-card .card,#K3-anti-pattern-card .card,[id^=CHURN-agent-panel] .card{
  min-height:1440px;display:flex;flex-direction:column;justify-content:center;padding:90px 70px}
#K1-better-move-card h1,#K2-hire-into-impact-card h1,#K3-anti-pattern-card h1{font-size:108px;line-height:1.08}
#K1-better-move-card .ey,#K2-hire-into-impact-card .ey,#K3-anti-pattern-card .ey,[id^=CHURN-agent-panel] .ey{font-size:34px}
#K1-better-move-card .card p{font-size:60px;line-height:1.3;margin-top:18px}
#K2-hire-into-impact-card .card p{font-size:72px!important}
.nob{white-space:nowrap}
[id^=K2-] .seat,[id^=K3-] .seat{font-size:36px;padding:16px 34px 16px 24px;margin-bottom:40px}
[id^=K2-] .card,[id^=K3-] .card{min-height:1300px}
[id^=K2-] .seat .ic.wide,[id^=K3-] .seat .ic.wide{width:92px;height:70px}
[id^=CHURN-agent-panel] h1{font-size:120px}
[id^=CHURN-agent-panel] h1 svg{width:130px!important;height:130px!important}
[id^=CHURN-agent-panel] .lines{gap:30px}
[id^=CHURN-agent-panel] .ln{font-size:96px}
[id^=CHURN-agent-panel] .bold{font-size:62px;line-height:1.2;margin-top:56px;padding-top:50px}
[id^=C1-seats-row] .strip{gap:20px;margin-bottom:40px;opacity:.85}
[id^=C1-seats-row] .strip span{font-size:34px;padding:12px 30px}
[id^=C1-seats-row] .row2{gap:44px}
[id^=C1-seats-row] .seatcard{min-height:620px;justify-content:center;padding:64px 60px}
[id^=C1-seats-row] .seat{font-size:34px;padding:14px 32px 14px 22px}
[id^=C1-seats-row] .seat .ic{width:60px;height:60px}[id^=C1-seats-row] .seat .ic.wide{width:84px}
[id^=C1-seats-row] h1.sm{font-size:100px;line-height:1.08}
[id^=C1-seats-row] .seatcard p{font-size:40px!important}
"""
html = ('<!doctype html><html><head><meta charset="utf-8">'
        '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600;700;800'
        '&family=JetBrains+Mono:wght@600&display=block" rel="stylesheet">'
        f'<style>{CSS}</style><style>{LIGHT}</style><style>{EXTRA}</style>' + (f'<style>{VCSS}</style>' if VERT else '') + '</head><body>'
        + "\n".join(F.values()) + "</body></html>")
SRC = (ASSETS / "vertical" / "slide-sources" / "containers.html") if VERT else (HERE / "containers.html")
if VERT:
    import shutil; shutil.copy(HERE / "paper.jpg", SRC.parent / "paper.jpg")
SRC.write_text(html, encoding="utf-8")

out = ASSETS / ("vertical/card-slides" if VERT else "card-slides")
with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 1080, "height": 1920} if VERT else {"width": 1920, "height": 1080}, device_scale_factor=1)
    pg.goto(SRC.as_uri())
    pg.wait_for_load_state("networkidle")
    pg.evaluate("document.fonts.ready.then(() => true)")
    only = [a.split("=",1)[1] for a in sys.argv if a.startswith("--only=")]
    for fid in F:
        if only and not any(fid.startswith(o) for o in only[0].split(",")): continue
        pg.locator(f"#{fid}").screenshot(path=str(out / f"{fid}.png"))
        print(out / f"{fid}.png")
    br.close()
