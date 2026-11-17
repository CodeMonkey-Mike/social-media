"""AI destroying lives VERTICAL (9:16) card slides (slide-builder, 2026-11-11; vertical-repurpose.md section 1).

RE-SHOOTS the 16:9 design of build_slides.py at 1080x1920 so the layout REFLOWS: headlines wrap, side-by-side tiles and
columns stack, the A-vs-B comparison stacks top/bottom, rows stay rows. Nothing is redesigned: this driver IMPORTS
build_slides.py (container-canonical.css pasted verbatim + the same LOCAL components, the same wording, colours, state
variants and state logic) and adds only:
  1. a PORTRAIT layer: `.frame.portrait` = 1080x1920 + portrait sizes/flow for the same classes (media rules, no new
     components, no token changes);
  2. portrait geometry for the three Elegant Promo cards (C19-n), whose 16:9 frames are absolutely positioned:
     the same discs / bar / title / sub-lines / source line re-placed for a portrait frame (the theme's own type sizes
     kept), plus ep-geometry.json (disc centre + radius and the DOM boxes of bar / title / subs / source per card)
     for the vertical comp's device motion, the way the 16:9 comp reads its PROMOS table.

Writes  ../vertical/slide-sources/containers.html     (all portrait frames, one standalone 1080x1920 frame per state)
        ../vertical/slide-sources/ep-geometry.json
and     ../vertical/card-slides/<id>.png              (SAME names as the 16:9 PNGs; the 16:9 PNGs are never touched).

C19-n.png (the settled full frame, QA reference / fallback still) uses the PORTRAIT plate from ../vertical/img/ when it
is on disk; otherwise it falls back to the 16:9 plate cover-cropped and says so (FALLBACK line). The comp's real input
is C19-n-overlay.png (transparent), which needs no plate. Re-run `python build_slides_vertical.py C19-1` once the
portrait plate lands.

Gates (refuse to ship): a webfont did not load, a frame is not 1080x1920, an em dash or a dollar sign is on screen,
content overflows the frame or its card, an image did not load, a shared element moves between two states of one id
(state swaps must be pixel-identical apart from the lit row). Warnings: text above y 110 or below y 1700 (phone UI).
Run: python build_slides_vertical.py [frame-id ...]   (no ids = every portrait frame)
"""
import io
import json
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build_slides as B  # noqa: E402  (the 16:9 driver: canonical CSS, LOCAL components, FRAMES, EP specs)

VHERE = HERE.parent / "vertical" / "slide-sources"
OUT = HERE.parent / "vertical" / "card-slides"
VIMG = HERE.parent / "vertical" / "img"
W, H = 1080, 1920
TOP_WARN, BOTTOM_WARN = 110, 1700

PORTRAIT = """
/* ===== PORTRAIT layer (vertical 9:16 re-shoot, vertical-repurpose.md section 1): frame size + portrait flow/sizes for
   the SAME classes. Every token and class above is untouched; nothing here adds a component. ===== */
.frame.portrait{width:1080px;height:1920px;padding:0 60px 110px}
.portrait .card{padding:66px 60px 70px}
.portrait .ey{font-size:30px;line-height:1.4}
.portrait h1{font-size:96px;line-height:1.08}
.portrait h1.sm{font-size:84px}
.portrait h1.lg{font-size:112px;line-height:1.06}
.portrait h1.q{font-size:84px;line-height:1.14}
#prior-videos-pair.portrait h1.sm{font-size:80px}
.portrait .divider{margin:36px 0}
.portrait p{font-size:40px;line-height:1.5}
/* rows */
.portrait .row{gap:30px;padding:26px 28px}
.portrait .row .v{font-size:54px;line-height:1.22}
.portrait .row svg{width:54px;height:54px;flex:0 0 54px}
/* status line + builder line */
.portrait .st{font-size:44px;gap:24px}
.portrait .st i{width:24px;height:24px;flex:0 0 24px}
.portrait .who{font-size:54px}
.portrait .who .lb{font-size:28px}
/* tiles stack */
.portrait .tiles{flex-direction:column;gap:44px}
.portrait .tiles .tile{flex:0 0 auto;width:760px}
.portrait .tile .tt{font-size:36px;margin-top:22px}
.portrait .tile .dt{font-size:29px}
/* two-column bodies stack */
.portrait .cols{flex-direction:column;gap:56px}
.portrait .cols>.l,.portrait .cols>.r{flex:0 0 auto;width:100%}
/* A-vs-B stacks top/bottom, the VS rule turns horizontal */
.portrait .vs{flex-direction:column;margin-top:0}
.portrait .vs .side{padding:36px 44px 42px}
.portrait .vs .side .lb{font-size:30px}
.portrait .vs .side .ph{font-size:104px}
.portrait .vs .mid{flex:0 0 104px}
.portrait .vs .mid:before{top:50%;bottom:auto;left:0;right:0;width:auto;height:1px}
.portrait .vs .mid span{padding:0 26px}
/* quote card */
.portrait .roi{font-size:50px}
.portrait .attr{font-size:32px;margin-top:34px}
/* logo + name: the logo sits over the name */
.portrait .namerow{flex-direction:column;align-items:flex-start;gap:40px}
.portrait .namerow>.logo{width:190px!important;height:190px!important;flex:0 0 auto!important}
.portrait .namerow h1 .tl{white-space:nowrap}
.portrait[id^="plug-cta"] .namerow{flex-direction:column-reverse}
.portrait[id^="plug-cta"] .namerow>.logo{width:230px!important;height:230px!important}
/* lower-third: under the card, clear of the phone UI band */
.frame.portrait>.l3{left:60px;bottom:330px}
.portrait .l3 .k{font-size:24px}
.portrait .l3 .u{font-size:46px}
/* end card: rows over the two end-screen tiles (side by side), the community lower-third under the card */
.frame.portrait.endc{justify-content:flex-start;padding-top:250px}
.frame.portrait.endc>.l3{bottom:360px}
.portrait.endc .card{padding:62px 60px 64px!important}
.portrait.endc .cols{gap:58px!important;align-items:stretch!important}
.portrait.endc .cols>.l{flex:0 0 auto!important;width:100%}
.portrait.endc .tiles{flex-direction:row!important;gap:36px!important}
.portrait.endc .tiles .tile{flex:1 1 0;width:auto;min-width:0}
.portrait.endc .tile .tt{font-size:27px;line-height:1.3;margin-top:14px}
.portrait.endc .rows .row .v{font-size:50px}
/* Elegant Promo portrait frames: no canonical padding (absolute layout) */
.frame.ep.portrait{padding:0}
"""

# ---------------------------------------------------------------------------------------------- C19 portrait geometry
# Disc centres/radii for a 1080x1920 frame. tl/br keep the theme's settled radius (~1460) and the 16:9 coverage shape
# (the arc meets the near edges at ~60% / ~95%); br is tl's point mirror about the frame centre. top keeps the 16:9
# dome's curvature scaled to the narrower frame. Gradients run bright -> plum along the visible arc, as in 16:9.
EPV = {
    "tl": dict(disc=(-420, -260, 1471), grad=(0, 1150, 1028, 0), anchor="left", titleDir="ltr"),
    "br": dict(disc=(1500, 2180, 1471), grad=(1080, 770, 52, 1920), anchor="right", titleDir="rtl"),
    "top": dict(disc=(540, -28, 808), grad=(236, 0, 956, 795), anchor="right", titleDir="rtl"),
}


def discs_v(layout):
    cx, cy, r = EPV[layout]["disc"]
    g = EPV[layout]["grad"]
    ri = round(r * 0.78)
    return f'''<svg class="discs" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
 <linearGradient id="vo{layout}" gradientUnits="userSpaceOnUse" x1="{g[0]}" y1="{g[1]}" x2="{g[2]}" y2="{g[3]}">
  <stop offset="0" stop-color="#C3264B"/><stop offset="1" stop-color="#3A0F2E"/></linearGradient>
 <linearGradient id="vi{layout}" gradientUnits="userSpaceOnUse" x1="{g[0]}" y1="{g[1]}" x2="{g[2]}" y2="{g[3]}">
  <stop offset="0" stop-color="#D2385C"/><stop offset="1" stop-color="#7A1F46"/></linearGradient>
 <filter id="vsh{layout}" x="-20%" y="-20%" width="140%" height="140%">
  <feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="#14040E" flood-opacity=".55"/></filter>
</defs>
<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#vo{layout})" opacity=".80"/>
<circle cx="{cx}" cy="{cy}" r="{ri}" fill="url(#vi{layout})" opacity=".55" filter="url(#vsh{layout})"/>
</svg>'''


def plate_for(spec):
    """(uri, is_fallback): the portrait plate if the vertical image lane has delivered it, else the 16:9 plate."""
    v = VIMG / spec["plate"]
    if v.exists():
        return v.as_uri(), False
    return (B.IMG / spec["plate"]).as_uri(), True


def ep_frame_v(fid, spec, overlay):
    lay = spec["layout"]
    plate = ""
    if not overlay:
        uri, _ = plate_for(spec)
        plate = f'<img class="plate" src="{uri}">'
    src_txt = B.EP_SRC
    if lay == "tl":   # corner top-left: same offsets as 16:9 (title +26 in the bar, sub-line 149 below the bar top)
        L, T = 90, 330
        bar = f'<div class="bar" data-anchor="left" style="left:{L}px;top:{T}px"></div>'
        tt = f'<div class="tt" data-pad="26" style="left:{L + 26}px;top:{T}px">{spec["title"]}</div>'
        sub = "".join(f'<div class="sub" style="left:{L + 2}px;top:{T + 149 + 45 * i}px">{s}</div>'
                      for i, s in enumerate(spec["sub"]))
        src = f'<div class="src" style="left:{L + 2}px;top:{T + 149 + 45 * len(spec["sub"]) + 22}px">{src_txt}</div>'
    elif lay == "br":  # corner bottom-right: right margin clear of the platform's right-hand buttons column edge
        R, T = 110, 1160
        bar = f'<div class="bar" data-anchor="right" style="right:{R}px;top:{T}px"></div>'
        tt = f'<div class="tt" data-center="1" style="top:{T}px">{spec["title"]}</div>'
        sub = "".join(f'<div class="sub s" style="right:{R}px;top:{T + 146 + 45 * i}px;text-align:right">{s}</div>'
                      for i, s in enumerate(spec["sub"]))
        src = (f'<div class="src" style="right:{R}px;top:{T + 146 + 45 * len(spec["sub"]) + 18}px;'
               f'text-align:right">{src_txt}</div>')
    else:              # top centre
        T = 330
        bar = f'<div class="bar" data-anchor="center" style="top:{T}px"></div>'
        tt = f'<div class="tt" data-center="1" style="top:{T}px">{spec["title"]}</div>'
        sub = "".join(f'<div class="sub s" data-hcenter="1" style="top:{T + 128 + 45 * i}px">{s}</div>'
                      for i, s in enumerate(spec["sub"]))
        src = f'<div class="src" data-hcenter="1" style="top:{T + 128 + 45 * len(spec["sub"]) + 18}px">{src_txt}</div>'
    kind = "ep-ov" if overlay else "ep"
    cls = "ep ov portrait" if overlay else "ep portrait"
    return (fid, kind, plate + discs_v(lay) + bar + tt + sub + src, cls)


def frames_v():
    out = []
    ep_ids = set()
    for fid, spec in B.EP.items():
        out.append(ep_frame_v(fid, spec, overlay=False))
        out.append(ep_frame_v(f"{fid}-overlay", spec, overlay=True))
        ep_ids |= {fid, f"{fid}-overlay"}
    for fid, kind, inner, cls in B.FRAMES:
        if fid in ep_ids:
            continue
        # the 16:9 thumbnails are relative to slide-sources/; the vertical html lives two folders over
        inner = inner.replace('src="thumb-', 'src="../../slide-sources/thumb-')
        if fid == "C20":   # the 16:9 forced line break would glue "absolutely" to "feature"; portrait wraps naturally
            inner = inner.replace("</span><br><span", "</span> <span")
        out.append((fid, kind, inner, ("portrait " + cls).strip()))
    # keep the 16:9 order (C19 sits after prior-videos-pair)
    order = [f[0] for f in B.FRAMES]
    return sorted(out, key=lambda f: order.index(f[0]))


FRAMES_V = frames_v()


def build_html():
    css = (B.REF / "container-canonical.css").read_text(encoding="utf-8")
    body = "\n".join(f'<div class="frame {cls}" id="{fid}" data-kind="{kind}">{inner}</div>'
                     for fid, kind, inner, cls in FRAMES_V)
    html = (f'<!doctype html><html><head><meta charset="utf-8">'
            f'<title>AI destroying lives: card slides, VERTICAL 1080x1920</title><link href="{B.FONTS}" rel="stylesheet">'
            f'<style>{css}</style><style>{B.LOCAL}{B.ENDC_CSS}{PORTRAIT}</style></head><body>\n{body}\n</body></html>\n')
    VHERE.mkdir(parents=True, exist_ok=True)
    (VHERE / "containers.html").write_text(html, encoding="utf-8")


FIT_EP_V = """(el)=>{
  const bar=el.querySelector('.bar'), tt=el.querySelector('.tt'); if(!bar) return;
  const FW=el.getBoundingClientRect().width;
  const w=Math.max(420, Math.ceil(tt.getBoundingClientRect().width)+72);
  bar.style.width=w+'px';
  if(bar.dataset.anchor==='center'){bar.style.left=Math.round((FW-w)/2)+'px';}
  const b=bar.getBoundingClientRect(), f=el.getBoundingClientRect();
  if(tt.dataset.center){tt.style.left=Math.round(b.left-f.left+(w-tt.getBoundingClientRect().width)/2)+'px';}
  el.querySelectorAll('[data-hcenter]').forEach(n=>{n.style.left=Math.round((FW-n.getBoundingClientRect().width)/2)+'px';});
}"""

CHECK_V = B.CHECK.replace("Math.round(r.width)!==1920||Math.round(r.height)!==1080",
                          f"Math.round(r.width)!=={W}||Math.round(r.height)!=={H}")
assert CHECK_V != B.CHECK, "frame-size gate not re-pointed to portrait"

# phone-UI warnings + the per-state layout snapshot used for the cross-state gate
SNAP = """(el,[top,bot])=>{
  const f=el.getBoundingClientRect(); const warn=[]; const snap={};
  el.querySelectorAll('.ey,h1,p,.v,.tt,.dt,.st,.who,.ph,.roi,.attr,.sub,.src,.l3 .u,.l3 .k').forEach(n=>{
    const b=n.getBoundingClientRect(); if(!b.width) return;
    if(b.top-f.top<top) warn.push('text above y '+top+': '+n.className+' '+Math.round(b.top-f.top));
    if(b.bottom-f.top>bot) warn.push('text below y '+bot+': '+n.className+' '+Math.round(b.bottom-f.top));
  });
  let i=0;
  el.querySelectorAll('.card,.ey,h1,.divider,.row,.tile,.th,.tt,.st,.who,.vs .side,.vs .mid,.roi,.attr,.logo,.namerow').forEach(n=>{
    if(n.closest('.l3')) return;
    const b=n.getBoundingClientRect();
    snap[(i++)+':'+n.tagName+'.'+String(n.className).split(' ')[0]]=[b.left-f.left,b.top-f.top,b.width,b.height].map(v=>Math.round(v*2)/2);
  });
  const c=el.querySelector('.card'); const cb=c?c.getBoundingClientRect():null;
  return {warn, snap, card: cb?[cb.left-f.left,cb.top-f.top,cb.right-f.left,cb.bottom-f.top].map(Math.round):null};
}"""

EP_GEO = """(el)=>{
  const f=el.getBoundingClientRect();
  const box=n=>{const b=n.getBoundingClientRect();return [b.left-f.left,b.top-f.top,b.right-f.left,b.bottom-f.top].map(Math.round);};
  return {bar:box(el.querySelector('.bar')), title:box(el.querySelector('.tt')),
          subs:[...el.querySelectorAll('.sub')].map(box), src:box(el.querySelector('.src'))};
}"""


def family(fid):
    base = fid
    for s in ("-s1", "-s2", "-s3", "-s4"):
        if fid.endswith(s):
            base = fid[: -len(s)]
    return base


def main():
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    build_html()
    OUT.mkdir(parents=True, exist_ok=True)
    problems, warnings, fallbacks = [], [], []
    snaps = {}
    geo = {}
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        pg.goto((VHERE / "containers.html").as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for fam, w in [("Playfair Display", 900), ("DM Sans", 600), ("JetBrains Mono", 600), ("Roboto", 900), ("Roboto", 400)]:
            ok = pg.evaluate("([f,w])=>document.fonts.check(`${w} 40px '${f}'`)&&[...document.fonts].some(x=>{if(x.family.replace(/\"/g,'')!==f||x.status!=='loaded')return false;const r=String(x.weight).split(' ').map(Number);return r.length>1?(w>=r[0]&&w<=r[1]):r[0]===w;})", [fam, w])
            if not ok:
                problems.append(f"FONT NOT LOADED: {fam} {w}")
        print("fonts:", pg.evaluate("[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight))]"))
        for fid, kind, _, _ in FRAMES_V:
            if only and fid not in only and not any(fid.startswith(o + "-") for o in only):
                continue
            el = pg.locator(f"#{fid}")
            if kind.startswith("ep"):
                el.evaluate(FIT_EP_V)
                base = fid.replace("-overlay", "")
                spec = B.EP[base]
                g = el.evaluate(EP_GEO)
                lay = EPV[spec["layout"]]
                geo[base] = dict(id=base, img=spec["plate"].rsplit(".", 1)[0], disc=list(lay["disc"]),
                                 anchor=lay["anchor"], titleDir=lay["titleDir"], **g)
                if kind == "ep":
                    _, fb = plate_for(spec)
                    if fb:
                        fallbacks.append(f"{fid}.png: portrait plate assets/vertical/img/{spec['plate']} not on disk; "
                                         f"used the 16:9 plate cover-cropped (QA reference still only)")
            for msg in el.evaluate(CHECK_V):
                if msg.startswith(("card box ", "ep bar ")):
                    print(f"  {fid}: {msg}")
                else:
                    problems.append(f"{fid}: {msg}")
            s = el.evaluate(SNAP, [TOP_WARN, BOTTOM_WARN])
            warnings += [f"{fid}: {m}" for m in s["warn"]]
            fam = family(fid)
            if fam in snaps and not kind.startswith("ep"):
                ref_id, ref = snaps[fam]
                for k, v in s["snap"].items():
                    if k in ref and ref[k] != v:
                        problems.append(f"{fid}: '{k}' moved vs {ref_id}: {ref[k]} -> {v}")
                if set(ref) != set(s["snap"]):
                    problems.append(f"{fid}: element set differs from {ref_id}")
            else:
                snaps[fam] = (fid, s["snap"])
            if s["card"]:
                print(f"  {fid}: card y {s['card'][1]}-{s['card'][3]}")
            path = OUT / f"{fid}.png"
            if kind == "ep-ov":
                pg.evaluate("document.body.style.background='transparent'")
                raw = el.screenshot(type="png", omit_background=True)
                pg.evaluate("document.body.style.background=''")
                img = Image.open(io.BytesIO(raw)).convert("RGBA").convert("RGBa").resize((W, H), Image.LANCZOS).convert("RGBA")
            else:
                img = Image.open(io.BytesIO(el.screenshot(type="png"))).convert("RGB").resize((W, H), Image.LANCZOS)
            img.save(path)
            print("wrote", path)
        br.close()
    if geo:
        gp = VHERE / "ep-geometry.json"
        old = json.loads(gp.read_text(encoding="utf-8")) if gp.exists() else {}
        old.update(geo)
        gp.write_text(json.dumps(old, indent=1), encoding="utf-8")
        print("wrote", gp)
    for f in fallbacks:
        print("FALLBACK", f)
    for w_ in warnings:
        print("WARN", w_)
    if problems:
        print("\n".join(["PROBLEMS:"] + problems))
        sys.exit(1)
    print("GATES PASS")


if __name__ == "__main__":
    main()
