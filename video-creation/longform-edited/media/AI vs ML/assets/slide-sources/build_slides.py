"""AI vs ML SLIDES (slide-builder, 2026-11-10): writes containers.html (one standalone 1920x1080 frame per state) and
screenshots each frame to ../card-slides/ (every slide of this video is a CARD SLIDE; no title slides: one music bed).

Theme: DARK (BROLL-PLAN "Container theme: DARK"; no light file, no accent file). container-canonical.css is pasted
VERBATIM from skills/container-reference/. On top of it sits ONE labelled layer, ENERGETIC (kinetic-text-2023), because
this video is a deliberate remake of Mike's 2023 005 look and its approved SCREENPLAY VISUAL-PLAN + COVER-PLAN slot notes
name that look for every card: the turquoise suede behind cards and panels, crumpled paper for the ONE statement card and
the paper-variant panel, Montserrat ExtraBold Italic ALL CAPS, the role colours AI ENGINEER = yellow #FCFE40 and
ML ENGINEER = green #1EFF06 (the kt-scatter-words green), red #E0151A key words on paper (the paper statement row), the
2023 dark drop shadow. Colours and textures are the effects library's (video-creation/assets/effects/library.json, theme
kinetic-text-2023; remotion/src/effects/kinetic-text/types.ts KT_2023), never invented. No :root token is changed.
Chapter accent: every row says "stylesheet default" (no chapter_themes in COVER-PLAN), so the role colours carry.

The wave-wall is NOT built here: library row kt-wave-wall says RENDER THE TEMPLATE, never stills (Mike, 2026-11-05).
It is rendered from Scene_22 by wave-wall/render_wave_wall.jsx (After Effects) -> ../card-slides/wave-wall.mp4.

State cues: _state-cues.md. Renders at device_scale_factor=2, Lanczos-downsampled to exactly 1920x1080.
Gates (refuse to ship): a webfont did not load, a texture did not load, a frame is not 1920x1080, an em dash is on
screen, text sits outside the wobble-safe box (kt-camera-wobble scales every held card to 105 percent and drifts it
~35 x 26 px, so text stays inside x 96-1824, y 64-1016).
Run: python build_slides.py [frame-id ...]   (no ids = every frame)
"""
import io
import os
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
REF = HERE.parents[3] / "skills" / "container-reference"
THEME = HERE.parents[4] / "assets" / "effects" / "themes" / "kinetic-text-2023"
OUT = HERE.parent / "card-slides"
FONTS = ("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900"
         "&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700"
         "&family=Montserrat:ital,wght@0,800;1,700;1,800;1,900&display=swap")


def rel(p: Path) -> str:
    return os.path.relpath(p, HERE).replace("\\", "/")


SUEDE = rel(THEME / "textures" / "suede-turquoise.jpg")
ARROW = rel(THEME / "graphics" / "arrow-red.png")
PAPER = "paper-crumpled-2s.png"  # frame at 2.0 s of textures/paper-crumpled.mp4 (1280x720), extracted by ffmpeg

ENERGETIC = """
/* ===== ENERGETIC layer (kinetic-text-2023, Mike's 005 look; SCREENPLAY VISUAL-PLAN, approved GATE 1 + GATE plan).
   Adds classes only; every :root token above is untouched. Values from library.json + KT_2023. ===== */
.frame.kt{display:block;padding:0;background:#3D948E url("%(suede)s") center/cover no-repeat;
  --kt-yellow:#FCFE40; --kt-green:#1EFF06; --kt-red:#E0151A; --kt-panel:0,52,45;
  --kt-shadow:5px 6px 10px rgba(0,0,0,.62),2px 3px 3px rgba(0,0,0,.45)}
.frame.kt.paper{background:#E1DEE0 url("%(paper)s") center/cover no-repeat}
.frame.kt.black{background:#000}
.kt .vig{position:absolute;inset:0;z-index:0;pointer-events:none;
  background:radial-gradient(ellipse 75%% 70%% at 50%% 48%%,rgba(0,0,0,0) 55%%,rgba(0,20,18,.34) 100%%)}
.kt .m{position:absolute;font-family:'Montserrat',sans-serif;font-weight:800;font-style:italic;text-transform:uppercase;
  letter-spacing:.005em;white-space:nowrap;line-height:1;color:#fff}
.kt .sh{text-shadow:var(--kt-shadow)}
.kt .ai{color:var(--kt-yellow)} .kt .ml{color:var(--kt-green)} .kt .rd{color:var(--kt-red)}
.kt .hide{visibility:hidden}

/* the CARD SLIDE anatomy on the suede: one rounded dark-teal card (the kt-side-panel / band tone), top-accent line in the
   role colour, eyebrow -> headline -> divider inside it */
.kt .kcard{position:absolute;border-radius:30px;overflow:hidden;
  background:linear-gradient(160deg,rgba(var(--kt-panel),.93),rgba(0,38,33,.95));
  border:1px solid rgba(255,255,255,.07);box-shadow:0 30px 80px rgba(0,0,0,.38)}
.kt .kcard>.top{position:absolute;top:0;left:0;right:0;height:7px}
.kt .top.ai{background:linear-gradient(90deg,var(--kt-yellow),var(--kt-yellow) 38%%,rgba(252,254,64,0) 92%%)}
.kt .top.ml{background:linear-gradient(90deg,var(--kt-green),var(--kt-green) 38%%,rgba(30,255,6,0) 92%%)}
.kt .kdiv{position:absolute;height:7px;width:110px;border-radius:4px}
.kt .kdiv.ai{background:var(--kt-yellow)} .kt .kdiv.ml{background:var(--kt-green)}
.kt .kdiv.ink{background:#111}

/* paper panel (kt-side-panel paper variant, as a full-frame card on the suede) */
.kt .ppanel{position:absolute;border-radius:28px;overflow:hidden;background:#E1DEE0 url("%(paper)s") center/cover no-repeat;
  box-shadow:0 30px 70px rgba(0,0,0,.40),0 4px 10px rgba(0,0,0,.20)}
.kt .ppanel>.top{position:absolute;top:0;left:0;right:0;height:9px}
.kt .ink{color:#0B0B0B;text-shadow:2px 3px 4px rgba(0,0,0,.16)}
.kt .rest{color:#7A7873;text-shadow:none}
.kt .badge{position:absolute;width:132px;height:132px;border-radius:50%%;display:flex;align-items:center;justify-content:center}
.kt .badge.rest{border:7px solid #A3A09A;background:rgba(255,255,255,.18)}
.kt .badge.tick{background:var(--kt-green);box-shadow:0 8px 18px rgba(0,0,0,.25),inset 0 0 0 5px rgba(0,0,0,.85)}
.kt .badge.cross{background:#E70001;box-shadow:0 8px 18px rgba(0,0,0,.25),inset 0 0 0 5px rgba(0,0,0,.85)}
.kt .hair{position:absolute;height:2px;background:rgba(0,0,0,.14)}

/* end-screen slots: empty 16:9 frames the YouTube end-screen elements sit on */
.kt .slot{position:absolute;width:560px;height:315px;border-radius:16px;background:rgba(0,22,19,.50);
  border:5px solid rgba(255,255,255,.92);box-shadow:0 18px 40px rgba(0,0,0,.30),inset 0 0 40px rgba(0,0,0,.25)}
.kt .slot.on{border-color:var(--kt-yellow);box-shadow:0 0 0 6px rgba(252,254,64,.22),0 18px 40px rgba(0,0,0,.34),inset 0 0 40px rgba(0,0,0,.25)}
.kt .arrow{position:absolute;width:260px;height:172px;background:url("%(arrow)s") center/contain no-repeat;
  filter:drop-shadow(4px 6px 6px rgba(0,0,0,.45))}
""" % {"suede": SUEDE, "paper": PAPER, "arrow": ARROW}


# ---------------------------------------------------------------------------------------------- frames
def frame(fid: str, cls: str, inner: str, label: str) -> str:
    return f'<!-- {label} -->\n<div class="frame kt {cls}" id="{fid}">\n{inner}\n</div>\n'


def roles_split():
    # CH1 12.367-13.97 "So let's break it all down." AI ENGINEER (yellow) | VS | ML ENGINEER (green), text only.
    inner = """<div class="vig"></div>
<div class="m sh ai" style="left:480px;top:300px;transform:translateX(-50%);font-size:300px">AI</div>
<div class="m sh ai" style="left:480px;top:612px;transform:translateX(-50%);font-size:112px">ENGINEER</div>
<div class="m sh ml" style="left:1440px;top:300px;transform:translateX(-50%);font-size:300px">ML</div>
<div class="m sh ml" style="left:1440px;top:612px;transform:translateX(-50%);font-size:112px">ENGINEER</div>
<div style="position:absolute;left:958px;top:150px;width:4px;height:250px;border-radius:2px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.55))"></div>
<div class="m sh" style="left:960px;top:540px;transform:translate(-50%,-50%);font-size:150px">VS</div>
<div style="position:absolute;left:958px;top:680px;width:4px;height:250px;border-radius:2px;background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0))"></div>"""
    return [frame("roles-split", "", inner, "roles-split: CARD SLIDE, CH1@12.367-13.97, one state")]


def ai_identity():
    # CH2 17.33-19.70 "On a model, someone else has already trained." SOMEONE ELSE turns yellow on "someone" 18.22.
    out = []
    for fid, lit in (("ai-identity", False), ("ai-identity-s1", True)):
        se = "ai" if lit else ""
        inner = f"""<div class="vig"></div>
<div class="kcard" style="left:110px;top:110px;width:1700px;height:860px"><div class="top ai"></div></div>
<div class="m ai" style="left:230px;top:212px;font-size:46px;letter-spacing:.14em">AI ENGINEER</div>
<div class="m" style="left:224px;top:316px;font-size:118px;line-height:128px">SHIPS PRODUCTS<br>ON A MODEL<br><span class="{se}">SOMEONE ELSE</span><br>ALREADY TRAINED</div>
<div class="kdiv ai" style="left:232px;top:870px"></div>"""
        out.append(frame(fid, "", inner, f"{fid}: CARD SLIDE, CH2@17.33-19.70, SOMEONE ELSE {'yellow' if lit else 'white (rest)'}"))
    return out


def build_train_deploy():
    # CH2 23.60-26.24, kt-scatter-words staircase: BUILD 23.90 (Whisper "billing"), TRAIN 24.70, DEPLOY 25.50.
    words = [("BUILD", 560, 395), ("TRAIN", 980, 615), ("DEPLOY", 1380, 835)]
    out = []
    for n, fid in enumerate(("build-train-deploy", "build-train-deploy-s1", "build-train-deploy-s2", "build-train-deploy-s3")):
        w = "\n".join(
            f'<div class="m sh ml{"" if i < n else " hide"}" style="left:{x}px;top:{y}px;transform:translate(-50%,-50%);font-size:178px">{t}</div>'
            for i, (t, x, y) in enumerate(words))
        inner = f"""<div class="vig"></div>
<div class="m sh ml" style="left:150px;top:118px;font-size:54px;letter-spacing:.14em">ML ENGINEER</div>
<div class="kdiv ml" style="left:154px;top:196px;box-shadow:var(--kt-shadow)"></div>
{w}"""
        shown = ", ".join(t for t, _, _ in words[:n]) or "eyebrow only"
        out.append(frame(fid, "", inner, f"{fid}: CARD SLIDE, CH2@23.60-26.24, {shown}"))
    return out


def paper_sum_up():
    # CH2 58.10-64.39, the ONE paper statement. Lines build as spoken (COVER-PLAN), ADAPTING 62.78 and EVALUATING 63.50
    # turn red. His spoken wording (GATE plan ruling 3) + the Chip Huyen credit.
    states = [
        ("paper-sum-up", False, False, False),
        ("paper-sum-up-s1", True, False, False),
        ("paper-sum-up-s2", True, True, False),
        ("paper-sum-up-s3", True, True, True),
    ]
    out = []
    for fid, second, adapt, evalu in states:
        h = "" if second else " hide"
        a = ' class="rd"' if adapt else ""
        e = ' class="rd"' if evalu else ""
        inner = f"""<div class="m ink" style="left:960px;top:452px;transform:translate(-50%,-50%);font-size:104px;line-height:124px;text-align:center">AI ENGINEERING IS LESS<br>ABOUT DEVELOPING MODELS<br><span class="{h.strip()}">AND MORE ABOUT <span{a}>ADAPTING</span></span><br><span class="{h.strip()}">AND <span{e}>EVALUATING</span> THEM</span></div>
<div class="kdiv ink" style="left:915px;top:818px;width:90px;height:6px"></div>
<div class="m" style="left:960px;top:862px;transform:translateX(-50%);font-size:40px;letter-spacing:.14em;color:#3A3A3A">CHIP HUYEN, AI ENGINEERING</div>"""
        lab = ["lines 1-2", "+ lines 3-4 black", "+ ADAPTING red", "+ EVALUATING red"][states.index((fid, second, adapt, evalu))]
        out.append(frame(fid, "paper", inner, f"{fid}: CARD SLIDE (paper statement), CH2@58.10-64.39, {lab}"))
    return out


TICK = ('<svg width="84" height="84" viewBox="0 0 84 84"><path d="M14 44 L34 64 L70 22" fill="none" stroke="#0B0B0B" '
        'stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>')
CROSS = ('<svg width="76" height="76" viewBox="0 0 76 76"><path d="M16 16 L60 60 M60 16 L16 60" fill="none" stroke="#FFFFFF" '
         'stroke-width="13" stroke-linecap="round"/></svg>')


def math_not_code():
    # CH3 92.02-94.58 "If you have the math but not the production code," MATH tick on "math" 92.76, PRODUCTION CODE
    # cross on "production" 93.58. Rows at rest stay readable (muted grey, empty badge).
    out = []
    for n, fid in enumerate(("math-not-code", "math-not-code-s1", "math-not-code-s2")):
        r1 = n >= 1
        r2 = n >= 2
        b1 = f'<div class="badge tick" style="left:250px;top:398px">{TICK}</div>' if r1 else '<div class="badge rest" style="left:250px;top:398px"></div>'
        b2 = f'<div class="badge cross" style="left:250px;top:660px">{CROSS}</div>' if r2 else '<div class="badge rest" style="left:250px;top:660px"></div>'
        inner = f"""<div class="vig"></div>
<div class="ppanel" style="left:130px;top:120px;width:1660px;height:840px"><div class="top" style="background:linear-gradient(90deg,var(--kt-green),var(--kt-green) 38%,rgba(30,255,6,0) 92%)"></div></div>
<div class="m" style="left:254px;top:222px;font-size:46px;letter-spacing:.16em;color:#4A4945">IF YOU HAVE</div>
<div class="kdiv" style="left:258px;top:296px;background:#16A51C"></div>
{b1}
<div class="m {'ink' if r1 else 'rest'}" style="left:440px;top:464px;transform:translateY(-50%);font-size:118px">MATH</div>
<div class="hair" style="left:250px;top:595px;width:1420px"></div>
{b2}
<div class="m {'ink' if r2 else 'rest'}" style="left:440px;top:726px;transform:translateY(-50%);font-size:118px">PRODUCTION CODE</div>"""
        lab = ["both rows at rest", "MATH tick", "+ PRODUCTION CODE cross"][n]
        out.append(frame(fid, "", inner, f"{fid}: CARD SLIDE (paper panel), CH3@92.02-94.58, {lab}"))
    return out


SLOTS = [(364, 236), (996, 236), (364, 607), (996, 607)]  # top-left of each 560x315 slot (16:9)


def end_screen():
    # CH4 139.533-145.20 (+2.0 s END HOLD to 147.20): four empty slots, the playlist arrow steps slot 1 to 4 on
    # "right" 140.86, "this" 142.32, "this" 143.14, "this" 144.44.
    out = []
    for n, fid in enumerate(("end-screen", "end-screen-s1", "end-screen-s2", "end-screen-s3", "end-screen-s4")):
        slots = "\n".join(
            f'<div class="slot{" on" if i + 1 == n else ""}" style="left:{x}px;top:{y}px"></div>' for i, (x, y) in enumerate(SLOTS))
        arrow = ""
        if n:
            x, y = SLOTS[n - 1]
            cy = y + 315 / 2 - 86
            if x < 960:  # left column: arrow sits left of the slot, pointing right (the source orientation)
                arrow = f'<div class="arrow" style="left:{x - 262}px;top:{cy:.0f}px;transform:rotate(-8deg)"></div>'
            else:  # right column: mirrored, pointing left
                arrow = f'<div class="arrow" style="left:{x + 560 + 2}px;top:{cy:.0f}px;transform:scaleX(-1) rotate(-8deg)"></div>'
        inner = f"""<div class="vig"></div>
<div class="m sh" style="left:960px;top:84px;transform:translateX(-50%);font-size:96px">WATCH <span class="ai">NEXT</span></div>
{slots}
{arrow}"""
        lab = "no arrow" if not n else f"arrow on slot {n}"
        out.append(frame(fid, "", inner, f"{fid}: CARD SLIDE (end screen), CH4@139.533-145.20 + 2.0 s hold, {lab}"))
    return out


def all_frames():
    return roles_split() + ai_identity() + build_train_deploy() + paper_sum_up() + math_not_code() + end_screen()


def write_html(frames):
    canonical = (REF / "container-canonical.css").read_text(encoding="utf-8")
    html = f"""<!doctype html>
<html><head><meta charset="utf-8"><title>AI vs ML: card slides</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel="stylesheet">
<style>
{canonical}
</style>
<style>
{ENERGETIC}
</style>
</head><body>
{''.join(frames)}
</body></html>
"""
    if "—" in "".join(frames) or "—" in ENERGETIC:
        raise SystemExit("GATE: em dash in the frame markup")  # the canonical CSS comments carry some; pasted verbatim
    p = HERE / "containers.html"
    p.write_text(html, encoding="utf-8")
    return p


GATE_JS = """(id) => {
  const f = document.getElementById(id);
  const r = f.getBoundingClientRect();
  const bad = [];
  if (Math.round(r.width) !== 1920 || Math.round(r.height) !== 1080) bad.push('frame ' + r.width + 'x' + r.height);
  if (f.innerText.includes('\\u2014')) bad.push('em dash on screen');
  for (const el of f.querySelectorAll('.m')) {
    if (el.classList.contains('hide')) continue;
    const b = el.getBoundingClientRect();
    const x0 = b.left - r.left, x1 = b.right - r.left, y0 = b.top - r.top, y1 = b.bottom - r.top;
    if (x0 < 96 || x1 > 1824 || y0 < 64 || y1 > 1016) bad.push('outside safe box: ' + el.innerText.replace(/\\n/g,' / ') + ' [' + [x0,x1,y0,y1].map(Math.round).join(',') + ']');
  }
  return bad;
}"""


def main(ids):
    frames = all_frames()
    p = write_html(frames)
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
        pg.goto(p.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for spec in ("italic 800 100px Montserrat",):  # the only face on screen in these frames
            pg.evaluate(f"document.fonts.load(\"{spec}\")")
            if not pg.evaluate(f"document.fonts.check(\"{spec}\")"):
                raise SystemExit(f"GATE: webfont not loaded: {spec}")
        imgs_ok = pg.evaluate("""async () => {
          const urls = ['%s', '%s', '%s'];
          const res = [];
          for (const u of urls) { res.push(await new Promise(ok => { const i = new Image(); i.onload = () => ok(i.naturalWidth > 0); i.onerror = () => ok(false); i.src = u; })); }
          return res; }""" % (SUEDE, PAPER, ARROW))
        if not all(imgs_ok):
            raise SystemExit(f"GATE: texture not loaded {imgs_ok}")
        all_ids = pg.evaluate("[...document.querySelectorAll('.frame')].map(f => f.id)")
        todo = [i for i in all_ids if not ids or i in ids]
        for fid in todo:
            bad = pg.evaluate(GATE_JS, fid)
            if bad:
                raise SystemExit(f"GATE {fid}: {bad}")
            png = pg.locator(f"#{fid}").screenshot(type="png")
            im = Image.open(io.BytesIO(png)).convert("RGB")
            if im.size != (3840, 2160):
                raise SystemExit(f"GATE {fid}: capture {im.size}")
            im = im.resize((1920, 1080), Image.LANCZOS)
            out = OUT / f"{fid}.png"
            im.save(out, optimize=True)
            print("wrote", out)
        br.close()


if __name__ == "__main__":
    main(sys.argv[1:])
