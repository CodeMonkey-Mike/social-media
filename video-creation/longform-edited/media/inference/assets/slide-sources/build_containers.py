"""inference: slide-builder source + driver.

Writes containers.html (locked container-canonical.css + container-canonical-light.css pasted verbatim, then
project additions), then screenshots each frame to assets/card-slides/<id>.png at 1920x1080 (rendered @2x,
downsampled with Lanczos for crisp text).

Run: python build_containers.py [--html-only]
"""
import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.dirname(HERE)
REF = os.path.normpath(os.path.join(HERE, "..", "..", "..", "..", "skills", "container-reference"))

BASE = open(os.path.join(REF, "container-canonical.css"), encoding="utf-8").read()
LIGHT = open(os.path.join(REF, "container-canonical-light.css"), encoding="utf-8").read()

PROJ = r"""
/* ============ below this line: project ADDITIONS only (locked tokens untouched) ============ */
/* CHAPTER THEMES: every chapter of `inference` = cyan #00c2ff, darkened to #006A9E by the LIGHT theme */
.frame{--acc:#006A9E;--acc-rgb:0,106,158}
.a{color:var(--acc)}
.frame .divider{background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.35))}
.orb.o1{width:920px;height:920px;right:-330px;top:-380px;background:var(--acc);opacity:.12}
.orb.o2{width:660px;height:660px;left:-280px;bottom:-320px;background:#b9c3d6;opacity:.30}
h1{font-variant-numeric:lining-nums}

/* CARD SLIDE: one rounded card, top-accent line, fills the frame (banks-card-* reference), light surface */
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:66px 88px 74px;
  position:relative;overflow:hidden;width:100%;
  box-shadow:0 1px 2px rgba(20,22,26,.05),0 24px 60px rgba(20,22,26,.10)}
.card>.top{position:absolute;top:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.55) 40%,transparent 85%)}
.card .ey{margin-bottom:24px}
.card .divider{margin:28px 0 34px}

/* spotlight rows: resting = muted but READABLE; .done = spoken; .on = current (accent edge + tint) */
.rw{font-family:'DM Sans';font-size:36px;line-height:1.35;color:var(--text-secondary);
  padding:18px 28px 18px 30px;border-left:5px solid var(--border);border-radius:0 14px 14px 0;margin-bottom:16px}
.rw:last-child{margin-bottom:0}
.rw.done{color:var(--text-primary);border-left-color:rgba(var(--acc-rgb),.55)}
.rw.on{color:var(--text-primary);border-left-color:var(--acc);background:rgba(var(--acc-rgb),.08);
  box-shadow:0 0 0 4px rgba(var(--acc-rgb),.06)}
.rw .tg{display:block;font-size:24px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--text-muted);margin-bottom:6px}
.rw.done .tg,.rw.on .tg{color:var(--acc)}

/* column label (house display font) */
.role{font-family:'Playfair Display',serif;font-weight:900;text-transform:uppercase;font-size:76px;line-height:1;
  letter-spacing:.01em;color:var(--text-secondary)}
.role.hl{color:var(--text-primary)} .role.hl .a{color:var(--acc)}
.role .sub{display:block;font-family:'DM Sans';font-weight:700;font-size:26px;letter-spacing:.18em;
  color:var(--text-muted);margin-top:16px}
.role.hl .sub{color:var(--acc)}

/* A-vs-B pair inside ONE card (declared comparison, one rhetorical unit) */
.pair{display:grid;grid-template-columns:1fr 2px 1.25fr;column-gap:64px;align-items:stretch}
.pair .vsep{background:linear-gradient(180deg,transparent,var(--border) 12%,var(--border) 88%,transparent)}
.half{display:flex;flex-direction:column;min-width:0}
.half .hr{width:66px;height:4px;border-radius:2px;margin:28px 0 30px;background:var(--border)}
.half.hl .hr{background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.35))}
.half.rest .rw{font-size:32px}

/* meter */
.meter .lbl{display:flex;justify-content:space-between;align-items:baseline;font-family:'DM Sans';font-weight:700;
  font-size:28px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-primary);margin-bottom:18px}
.meter .lbl .st{color:var(--acc)}
.meter .bar{height:58px;border-radius:14px;background:var(--bg-card-hover);border:2px solid var(--border);
  overflow:hidden;position:relative}
.meter .fill{position:absolute;inset:0;border-radius:12px;
  background:repeating-linear-gradient(90deg,var(--acc) 0 52px,rgba(var(--acc-rgb),.80) 52px 58px)}
.src{font-family:'JetBrains Mono',monospace;font-size:21px;color:var(--text-muted);margin-top:44px}

/* list card grid */
.grid4{display:grid;grid-template-columns:1fr 1fr;gap:26px 30px}
.it{border:2px solid var(--border);border-radius:20px;padding:30px 36px;background:var(--bg-card);
  display:flex;gap:26px;align-items:flex-start}
.it .n{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:32px;color:var(--text-muted);line-height:1.25}
.it .t{font-family:'DM Sans';font-weight:700;font-size:38px;letter-spacing:.06em;text-transform:uppercase;
  color:var(--text-secondary);line-height:1.15}
.it .s{font-family:'DM Sans';font-size:27px;color:var(--text-secondary);margin-top:10px;line-height:1.3}
.it.on{border-color:var(--acc);background:rgba(var(--acc-rgb),.06);
  box-shadow:0 0 0 5px rgba(var(--acc-rgb),.10),0 12px 28px rgba(20,22,26,.10)}
.it.on .n,.it.on .t{color:var(--acc)} .it.on .s{color:var(--text-primary)}

/* id card */
.who{font-family:'DM Sans';font-weight:700;font-size:48px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--acc);margin-top:26px}
.chips{display:flex;gap:22px}
.chip{font-family:'DM Sans';font-size:36px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:var(--text-primary);background:var(--bg-card-hover);border:2px solid var(--border);border-radius:999px;
  padding:18px 36px}
.chip .mono{color:var(--acc);letter-spacing:.04em}

/* takeaway lines */
.take{font-family:'Playfair Display',serif;font-weight:900;font-size:104px;line-height:1.06;letter-spacing:-.02em;
  color:var(--text-secondary)}
.take.act{color:var(--text-primary)} .take.act .k{color:var(--acc)}
.tk{display:block;font-family:'DM Sans';font-weight:700;font-size:26px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--text-muted);margin-bottom:14px}
.tk.act{color:var(--acc)}
.tline{padding-left:34px;border-left:6px solid var(--border)}
.tline.act{border-left-color:var(--acc)}

body{padding:40px 0;display:flex;flex-direction:column;align-items:center;gap:40px}
"""

ORB = '<div class="orb o1"></div><div class="orb o2"></div>'


def frame(fid, inner):
    return f'<div class="frame" id="{fid}">{ORB}<div class="card"><div class="top"></div>{inner}</div></div>\n'


FRAMES = []

# 1. c2-training (CH1@9.68-11.933, spoken "and it costs millions."): C2 state 1, the TRAINING side alone
FRAMES.append(frame("c2-training", """
<div class="ey">Training vs inference</div>
<h1>Training happens <span class="a">once</span></h1>
<div class="divider"></div>
<div class="rw done"><span class="tg">Once</span>a one-time investment in compute</div>
<div class="rw done"><span class="tg">Learns the weights</span>the model learns its weights from data</div>
<div class="rw on"><span class="tg">Costs millions</span>training a big model can cost millions</div>
"""))


# 2. c2-contrast (CH1@18.6-22.45): TRAINING dimmed vs INFERENCE lit; rows light on 19.64 / 20.34 / 21.30
def contrast(fid, on):
    rows = [("The bill", "every request, billed per token"),
            ("The latency", "the wait the user actually feels"),
            ("The part you operate", "ongoing, for as long as it serves")]
    r = "".join(
        f'<div class="rw {"on" if k == on else ("done" if on and k < on else "")}"><span class="tg">{t}</span>{s}</div>'
        for k, (t, s) in enumerate(rows, 1))
    return frame(fid, f"""
<div class="ey">Training vs inference</div>
<div class="pair">
 <div class="half rest">
  <div class="role">Training<span class="sub">Once</span></div><div class="hr"></div>
  <div class="rw"><span class="tg">Learns the weights</span>from data</div>
  <div class="rw"><span class="tg">Costs millions</span>a one-time investment</div>
 </div>
 <div class="vsep"></div>
 <div class="half hl">
  <div class="role hl"><span class="a">Inference</span><span class="sub">Every request</span></div><div class="hr"></div>
  {r}
 </div>
</div>""")


FRAMES.append(contrast("c2-contrast", 0))
for s in (1, 2, 3):
    FRAMES.append(contrast(f"c2-contrast-s{s}", s))

# 3. prefill-compute-bound (CH2@46.55-48.1): vLLM's wording, never NVIDIA (do-not-air row 15)
FRAMES.append(frame("prefill-compute-bound", """
<div class="ey">One request / step <span class="mono">1</span></div>
<h1>Prefill is <span class="a">compute-bound</span></h1>
<div class="divider"></div>
<p style="margin-bottom:46px">The whole prompt is read <b>at once</b>, every token in parallel.</p>
<div class="meter"><div class="lbl"><span>GPU compute</span><span class="st">Full</span></div><div class="bar"><div class="fill"></div></div></div>
<div class="src">Source: vLLM docs</div>
"""))

# 4. C3 (CH3@70.267-72.0): the paper list card overview, item 1 lit; no speed multipliers (rows 5, 6)
FRAMES.append(frame("C3", """
<div class="ey"><span class="mono">4</span> levers</div>
<h1 class="sm">What makes inference <span class="a">fast and cheap</span></h1>
<div class="divider"></div>
<div class="grid4">
 <div class="it on"><span class="n">01</span><div><div class="t">Continuous batching</div><div class="s">requests join and leave mid-flight</div></div></div>
 <div class="it"><span class="n">02</span><div><div class="t">Caching</div><div class="s">PagedAttention · prefix caching</div></div></div>
 <div class="it"><span class="n">03</span><div><div class="t">Quantization</div><div class="s"><span class="mono">16</span>-bit → <span class="mono">8</span>-bit → <span class="mono">4</span>-bit</div></div></div>
 <div class="it"><span class="n">04</span><div><div class="t">Speculative decoding</div><div class="s">a small model drafts, the big one verifies</div></div></div>
</div>
"""))

# 5. huang-id-card (CH5@164.633-168.0): names the moment, never "stood out"
FRAMES.append(frame("huang-id-card", """
<div class="ey">The keynote</div>
<h1 style="font-size:150px">Jensen Huang</h1>
<div class="who">NVIDIA CEO</div>
<div class="divider"></div>
<div class="chips"><div class="chip">GTC keynote</div><div class="chip">March <span class="mono">2025</span></div></div>
"""))

# 6. incentive-vs-engineering (CH5@174.5-176.367): the incentive dimmed, the engineering lit on "right"
FRAMES.append(frame("incentive-vs-engineering", """
<div class="ey">Jensen Huang, GTC <span class="mono">2025</span></div>
<div class="tline" style="margin-bottom:56px"><span class="tk">The incentive</span><div class="take">He sells the chips.</div></div>
<div class="tline act"><span class="tk act">The engineering</span><div class="take act">On the engineering: <span class="k">right</span>.</div></div>
"""))

HTML = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>inference containers</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
{BASE}
</style>
<style>
{LIGHT}
</style>
<style>
{PROJ}
</style>
</head><body>
{''.join(FRAMES)}
</body></html>"""


def main():
    out_html = os.path.join(HERE, "containers.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(HTML)
    print("wrote", out_html)
    if "--html-only" in sys.argv:
        return
    from PIL import Image
    from playwright.sync_api import sync_playwright
    out_dir = os.path.join(ASSETS, "card-slides")
    os.makedirs(out_dir, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
        pg.goto("file:///" + out_html.replace("\\", "/"))
        pg.wait_for_load_state("networkidle")
        pg.evaluate("document.fonts.ready")
        fonts = pg.evaluate("""() => ['900 40px "Playfair Display"','700 40px "DM Sans"','600 40px "JetBrains Mono"']
                               .map(f => [f, document.fonts.check(f)])""")
        print("fonts:", fonts)
        if not all(ok for _, ok in fonts):
            sys.exit("FONT LOAD FAILED")
        for fid in pg.eval_on_selector_all(".frame", "els => els.map(e => e.id)"):
            png = pg.locator(f'[id="{fid}"]').screenshot()
            im = Image.open(io.BytesIO(png)).convert("RGB").resize((1920, 1080), Image.LANCZOS)
            dst = os.path.join(out_dir, f"{fid}.png")
            im.save(dst)
            print("shot", dst, im.size)
        b.close()


if __name__ == "__main__":
    main()
