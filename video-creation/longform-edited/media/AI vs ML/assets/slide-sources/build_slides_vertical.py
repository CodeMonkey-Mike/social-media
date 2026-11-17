"""AI vs ML VERTICAL (9:16) card slides (slide-builder, 2026-11-11; vertical-repurpose.md section 1).

RE-SHOOTS the 16:9 design of build_slides.py at 1080x1920 so the layout REFLOWS: headlines wrap, the A-vs-B split
stacks top/bottom, the card rows stack, the end-screen grid becomes one column. Nothing is redesigned: this driver
IMPORTS build_slides.py (the locked container-canonical.css pasted verbatim + the same ENERGETIC kinetic-text-2023
layer, the same colours, textures, type, state variants and state logic) and adds only:
  1. a PORTRAIT layer: `.frame.portrait` = 1080x1920 (the frame-size rule) + the end-screen slot/arrow size for portrait;
  2. one portrait geometry function per id (the 16:9 frames are absolutely positioned, so the reflow is per frame).

Writes  ../vertical/slide-sources/containers.html  (all portrait frames, one standalone 1080x1920 frame per state)
and     ../vertical/card-slides/<id>.png           (SAME names as the 16:9 PNGs; the 16:9 PNGs are never touched).
The wave wall is NOT here (it is a rendered template, never a still): wave-wall/wave_wall_vertical.py (ffmpeg only).

Gates (refuse to ship): a webfont or texture did not load, a frame is not 1080x1920, an em dash is on screen, text
outside the portrait wobble-safe box (kt-camera-wobble scales a held card to 105 percent and drifts it, the 16:9 box
scaled: x 54-1026, y 114-1806), text outside its own card/panel (inset 36 px). Text below y 1680 (the phone UI band)
is reported as a warning.
Run: python build_slides_vertical.py [frame-id ...]   (no ids = every portrait frame)
"""
import io
import os
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build_slides as B  # noqa: E402  (the 16:9 driver: canonical CSS path, ENERGETIC layer, frame(), TICK/CROSS)

VHERE = HERE.parent / "vertical" / "slide-sources"
OUT = HERE.parent / "vertical" / "card-slides"
W, H = 1080, 1920
SAFE = (54, 1026, 114, 1806)
UI_BAND = 1680


def vrel(p: Path) -> str:
    return os.path.relpath(p, VHERE).replace("\\", "/")


V_SUEDE = vrel(B.THEME / "textures" / "suede-turquoise.jpg")
V_ARROW = vrel(B.THEME / "graphics" / "arrow-red.png")
V_PAPER = vrel(HERE / B.PAPER)

# the SAME ENERGETIC layer, its texture URLs re-pointed from the vertical slide-sources folder
ENERGETIC_V = (B.ENERGETIC.replace(B.SUEDE, V_SUEDE).replace(B.ARROW, V_ARROW)
               .replace(f'url("{B.PAPER}")', f'url("{V_PAPER}")'))

PORTRAIT = """
/* ===== PORTRAIT layer (vertical 9:16 re-shoot, vertical-repurpose.md section 1). Frame size + end-screen slot size only;
   every token and class above is untouched. ===== */
.frame.portrait{width:1080px;height:1920px}
.kt.portrait .slot{width:480px;height:270px}
.kt.portrait .arrow{width:230px;height:152px}
"""

CX = W // 2


def f(fid, cls, inner, label):
    return B.frame(fid, ("portrait " + cls).strip(), inner, label)


# ---------------------------------------------------------------------------------------------- portrait frames
def roles_split():
    # 16:9: AI ENGINEER | VS | ML ENGINEER side by side. Portrait: the split stacks, AI ENGINEER over VS over ML ENGINEER;
    # the vertical rules either side of VS turn horizontal.
    t1, t2, big, small = 300, 1106, 340, 136
    sub = round(big * 1.04)
    inner = f"""<div class="vig"></div>
<div class="m sh ai" style="left:{CX}px;top:{t1}px;transform:translateX(-50%);font-size:{big}px">AI</div>
<div class="m sh ai" style="left:{CX}px;top:{t1 + sub}px;transform:translateX(-50%);font-size:{small}px">ENGINEER</div>
<div style="position:absolute;left:150px;top:958px;width:250px;height:4px;border-radius:2px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.55))"></div>
<div class="m sh" style="left:{CX}px;top:960px;transform:translate(-50%,-50%);font-size:150px">VS</div>
<div style="position:absolute;left:680px;top:958px;width:250px;height:4px;border-radius:2px;background:linear-gradient(90deg,rgba(255,255,255,.55),rgba(255,255,255,0))"></div>
<div class="m sh ml" style="left:{CX}px;top:{t2}px;transform:translateX(-50%);font-size:{big}px">ML</div>
<div class="m sh ml" style="left:{CX}px;top:{t2 + sub}px;transform:translateX(-50%);font-size:{small}px">ENGINEER</div>"""
    return [f("roles-split", "", inner, "roles-split: CARD SLIDE portrait, CH1@12.367-13.97, one state")]


def ai_identity():
    # the headline wraps to six lines: SHIPS / PRODUCTS / ON A MODEL / SOMEONE ELSE / ALREADY / TRAINED
    out = []
    ct, cl, cw, ch = 440, 56, 968, 986
    for fid, lit in (("ai-identity", False), ("ai-identity-s1", True)):
        se = "ai" if lit else ""
        inner = f"""<div class="vig"></div>
<div class="kcard" style="left:{cl}px;top:{ct}px;width:{cw}px;height:{ch}px"><div class="top ai"></div></div>
<div class="m ai" style="left:136px;top:{ct + 100}px;font-size:50px;letter-spacing:.14em">AI ENGINEER</div>
<div class="m" style="left:130px;top:{ct + 206}px;font-size:96px;line-height:106px">SHIPS<br>PRODUCTS<br>ON A MODEL<br><span class="{se}">SOMEONE ELSE</span><br>ALREADY<br>TRAINED</div>
<div class="kdiv ai" style="left:138px;top:{ct + 206 + 6 * 106 + 44}px"></div>"""
        out.append(f(fid, "", inner, f"{fid}: CARD SLIDE portrait, CH2@17.33-19.70, SOMEONE ELSE {'yellow' if lit else 'white (rest)'}"))
    return out


def build_train_deploy():
    # the staircase keeps its diagonal, tighter in x: BUILD / TRAIN / DEPLOY stepping down and right under the eyebrow
    words = [("BUILD", 362, 820), ("TRAIN", 497, 1040), ("DEPLOY", 630, 1260)]
    out = []
    for n, fid in enumerate(("build-train-deploy", "build-train-deploy-s1", "build-train-deploy-s2", "build-train-deploy-s3")):
        w = "\n".join(
            f'<div class="m sh ml{"" if i < n else " hide"}" style="left:{x}px;top:{y}px;transform:translate(-50%,-50%);font-size:160px">{t}</div>'
            for i, (t, x, y) in enumerate(words))
        inner = f"""<div class="vig"></div>
<div class="m sh ml" style="left:100px;top:520px;font-size:54px;letter-spacing:.14em">ML ENGINEER</div>
<div class="kdiv ml" style="left:104px;top:598px;box-shadow:var(--kt-shadow)"></div>
{w}"""
        shown = ", ".join(t for t, _, _ in words[:n]) or "eyebrow only"
        out.append(f(fid, "", inner, f"{fid}: CARD SLIDE portrait, CH2@23.60-26.24, {shown}"))
    return out


def paper_sum_up():
    # the statement wraps to eight lines (16:9 lines 1-2 = portrait lines 1-4, 16:9 lines 3-4 = portrait lines 5-8);
    # the hidden lines keep their space so the swap is a pure reveal, as in 16:9
    states = [
        ("paper-sum-up", False, False, False, "lines 1-4"),
        ("paper-sum-up-s1", True, False, False, "+ lines 5-8 black"),
        ("paper-sum-up-s2", True, True, False, "+ ADAPTING red"),
        ("paper-sum-up-s3", True, True, True, "+ EVALUATING red"),
    ]
    fs, lh, top = 88, 105, 440
    out = []
    for fid, second, adapt, evalu, lab in states:
        h = "" if second else "hide"
        a = ' class="rd"' if adapt else ""
        e = ' class="rd"' if evalu else ""
        inner = f"""<div class="m ink" style="left:{CX}px;top:{top}px;transform:translateX(-50%);font-size:{fs}px;line-height:{lh}px;text-align:center">AI ENGINEERING<br>IS LESS ABOUT<br>DEVELOPING<br>MODELS<br><span class="{h}">AND MORE ABOUT</span><br><span class="{h}"><span{a}>ADAPTING</span></span><br><span class="{h}">AND <span{e}>EVALUATING</span></span><br><span class="{h}">THEM</span></div>
<div class="kdiv ink" style="left:{CX - 45}px;top:{top + 8 * lh + 56}px;width:90px;height:6px"></div>
<div class="m" style="left:{CX}px;top:{top + 8 * lh + 100}px;transform:translateX(-50%);font-size:44px;letter-spacing:.12em;color:#3A3A3A">CHIP HUYEN, AI ENGINEERING</div>"""
        out.append(f(fid, "paper", inner, f"{fid}: CARD SLIDE portrait (paper statement), CH2@58.10-64.39, {lab}"))
    return out


def math_not_code():
    # the paper panel narrows; PRODUCTION CODE wraps to two lines beside its badge
    pt, pl, pw, ph = 470, 56, 968, 900
    bl, tl, fs = 108, 284, 92
    r1c, hair, r2c = pt + 360, pt + 500, pt + 690
    out = []
    for n, fid in enumerate(("math-not-code", "math-not-code-s1", "math-not-code-s2")):
        r1, r2 = n >= 1, n >= 2
        b1 = (f'<div class="badge tick" style="left:{bl}px;top:{r1c - 66}px">{B.TICK}</div>' if r1
              else f'<div class="badge rest" style="left:{bl}px;top:{r1c - 66}px"></div>')
        b2 = (f'<div class="badge cross" style="left:{bl}px;top:{r2c - 66}px">{B.CROSS}</div>' if r2
              else f'<div class="badge rest" style="left:{bl}px;top:{r2c - 66}px"></div>')
        inner = f"""<div class="vig"></div>
<div class="ppanel" style="left:{pl}px;top:{pt}px;width:{pw}px;height:{ph}px"><div class="top" style="background:linear-gradient(90deg,var(--kt-green),var(--kt-green) 38%,rgba(30,255,6,0) 92%)"></div></div>
<div class="m" style="left:{bl + 4}px;top:{pt + 100}px;font-size:48px;letter-spacing:.16em;color:#4A4945">IF YOU HAVE</div>
<div class="kdiv" style="left:{bl + 8}px;top:{pt + 172}px;background:#16A51C"></div>
{b1}
<div class="m {'ink' if r1 else 'rest'}" style="left:{tl}px;top:{r1c}px;transform:translateY(-50%);font-size:{fs}px">MATH</div>
<div class="hair" style="left:{bl}px;top:{hair}px;width:{pl + pw - 60 - bl}px"></div>
{b2}
<div class="m {'ink' if r2 else 'rest'}" style="left:{tl}px;top:{r2c}px;transform:translateY(-50%);font-size:{fs}px;line-height:{round(fs * 1.06)}px">PRODUCTION<br>CODE</div>"""
        lab = ["both rows at rest", "MATH tick", "+ PRODUCTION CODE cross"][n]
        out.append(f(fid, "", inner, f"{fid}: CARD SLIDE portrait (paper panel), CH3@92.02-94.58, {lab}"))
    return out


SW, SH = 480, 270
SLOTS_V = [(300, 440 + i * (SH + 44)) for i in range(4)]  # top-left of each 480x270 slot, one centred column


def end_screen():
    # the 2x2 grid becomes one centred column; the arrow keeps the 16:9 alternation (slots 1/3 from the left pointing
    # right, slots 2/4 from the right mirrored), so it zig-zags down the column on "this one, or this one"
    out = []
    aw, ah = 230, 152
    for n, fid in enumerate(("end-screen", "end-screen-s1", "end-screen-s2", "end-screen-s3", "end-screen-s4")):
        slots = "\n".join(
            f'<div class="slot{" on" if i + 1 == n else ""}" style="left:{x}px;top:{y}px"></div>' for i, (x, y) in enumerate(SLOTS_V))
        arrow = ""
        if n:
            x, y = SLOTS_V[n - 1]
            cy = y + SH / 2 - ah / 2
            if n % 2:  # slots 1 and 3: arrow left of the slot, pointing right (the source orientation)
                arrow = f'<div class="arrow" style="left:{x - aw - 2}px;top:{cy:.0f}px;transform:rotate(-8deg)"></div>'
            else:      # slots 2 and 4: mirrored, right of the slot, pointing left
                arrow = f'<div class="arrow" style="left:{x + SW + 2}px;top:{cy:.0f}px;transform:scaleX(-1) rotate(-8deg)"></div>'
        inner = f"""<div class="vig"></div>
<div class="m sh" style="left:{CX}px;top:270px;transform:translateX(-50%);font-size:100px">WATCH <span class="ai">NEXT</span></div>
{slots}
{arrow}"""
        lab = "no arrow" if not n else f"arrow on slot {n}"
        out.append(f(fid, "", inner, f"{fid}: CARD SLIDE portrait (end screen), CH4@139.533-145.20 + 2.0 s hold, {lab}"))
    return out


def all_frames():
    return roles_split() + ai_identity() + build_train_deploy() + paper_sum_up() + math_not_code() + end_screen()


def write_html(frames):
    canonical = (B.REF / "container-canonical.css").read_text(encoding="utf-8")
    html = f"""<!doctype html>
<html><head><meta charset="utf-8"><title>AI vs ML: card slides, VERTICAL 1080x1920</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{B.FONTS}" rel="stylesheet">
<style>
{canonical}
</style>
<style>
{ENERGETIC_V}
</style>
<style>
{PORTRAIT}
</style>
</head><body>
{''.join(frames)}
</body></html>
"""
    if "—" in "".join(frames) or "—" in ENERGETIC_V or "—" in PORTRAIT:
        raise SystemExit("GATE: em dash in the frame markup")
    VHERE.mkdir(parents=True, exist_ok=True)
    p = VHERE / "containers.html"
    p.write_text(html, encoding="utf-8")
    return p


GATE_JS = """([id, W, H, safe, uiBand]) => {
  const f = document.getElementById(id);
  const r = f.getBoundingClientRect();
  const bad = [], warn = [], boxes = [];
  if (Math.round(r.width) !== W || Math.round(r.height) !== H) bad.push('frame ' + r.width + 'x' + r.height);
  if (f.innerText.includes('\\u2014')) bad.push('em dash on screen');
  const card = f.querySelector('.kcard, .ppanel');
  const cb = card ? card.getBoundingClientRect() : null;
  for (const el of f.querySelectorAll('.m')) {
    if (el.classList.contains('hide')) continue;
    // measure the INK: every visible text range, including spans inside hidden-state wrappers that are shown
    const rg = document.createRange(); rg.selectNodeContents(el);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const q of rg.getClientRects()) { if (q.width < 1) continue;
      x0 = Math.min(x0, q.left); x1 = Math.max(x1, q.right); y0 = Math.min(y0, q.top); y1 = Math.max(y1, q.bottom); }
    x0 -= r.left; x1 -= r.left; y0 -= r.top; y1 -= r.top;
    const t = el.innerText.replace(/\\n/g, ' / ');
    boxes.push([t, Math.round(x0), Math.round(x1), Math.round(y0), Math.round(y1)]);
    if (x0 < safe[0] || x1 > safe[1] || y0 < safe[2] || y1 > safe[3]) bad.push('outside safe box: ' + t + ' [' + [x0,x1,y0,y1].map(Math.round).join(',') + ']');
    if (cb && (x0 < cb.left - r.left + 36 || x1 > cb.right - r.left - 36 || y0 < cb.top - r.top + 36 || y1 > cb.bottom - r.top - 36))
      bad.push('outside its card: ' + t);
    if (y1 > uiBand) warn.push('text in the phone UI band: ' + t);
  }
  return {bad, warn, boxes};
}"""


def main(ids):
    frames = all_frames()
    p = write_html(frames)
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        pg.goto(p.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for spec in ("italic 800 100px Montserrat",):
            pg.evaluate(f"document.fonts.load(\"{spec}\")")
            if not pg.evaluate(f"document.fonts.check(\"{spec}\")"):
                raise SystemExit(f"GATE: webfont not loaded: {spec}")
        imgs_ok = pg.evaluate("""async () => {
          const urls = ['%s', '%s', '%s'];
          const res = [];
          for (const u of urls) { res.push(await new Promise(ok => { const i = new Image(); i.onload = () => ok(i.naturalWidth > 0); i.onerror = () => ok(false); i.src = u; })); }
          return res; }""" % (V_SUEDE, V_PAPER, V_ARROW))
        if not all(imgs_ok):
            raise SystemExit(f"GATE: texture not loaded {imgs_ok}")
        all_ids = pg.evaluate("[...document.querySelectorAll('.frame')].map(f => f.id)")
        todo = [i for i in all_ids if not ids or i in ids]
        for fid in todo:
            g = pg.evaluate(GATE_JS, [fid, W, H, list(SAFE), UI_BAND])
            for b in g["boxes"]:
                print(f"  {fid}: {b[0]!r} x {b[1]}-{b[2]} y {b[3]}-{b[4]}")
            for w_ in g["warn"]:
                print(f"  WARN {fid}: {w_}")
            if g["bad"]:
                raise SystemExit(f"GATE {fid}: {g['bad']}")
            png = pg.locator(f"#{fid}").screenshot(type="png")
            im = Image.open(io.BytesIO(png)).convert("RGB")
            if im.size != (W * 2, H * 2):
                raise SystemExit(f"GATE {fid}: capture {im.size}")
            im = im.resize((W, H), Image.LANCZOS)
            out = OUT / f"{fid}.png"
            im.save(out, optimize=True)
            print("wrote", out)
        br.close()


if __name__ == "__main__":
    main(sys.argv[1:])
