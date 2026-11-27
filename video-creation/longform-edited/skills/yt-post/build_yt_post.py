#!/usr/bin/env python
"""
build_yt_post.py: render a delivered video's YouTube PROMO CAROUSEL (yt-post.md) from its spec
`media/<project>/yt-post/YT-POST.json` into square 1080x1080 PNGs `media/<project>/yt-post/slides/NN.png`.

The slides are CODE-RENDERED in the video's OWN locked look (container-canonical.css + the project's accent stylesheet
from GRAPH-PROGRESS settings.container_accent: Playfair Display 900 headlines with highlighted words, DM Sans body,
JetBrains Mono numbers), never an image model: every word and number is pixel-exact. Mike's picture is a REAL frame
(the thumbnail still), finished in code only (local contrast, warmth, sharpen; the thumbnail's "natural" level), and
cropped as a rectangle or a circle: never matted, never generated.

Spec (YT-POST.json, authored by the yt-post-author agent; field rules in yt-post.md):
  label, logo, face, channel, author, video_url, video_title, slides[ {kind, ...} ], post{headline, points[], hashtags[]}
  kinds: hook (slide 1) · stat · text · rows · image · cta (last slide).  `[word]` = highlighted (accent) text,
  `{7.5 trillion}` = a number in the mono face.
Usage:  python build_yt_post.py <media/<project>/yt-post/YT-POST.json> [--only 3,4]
Machine line: YT-POST-BUILD PASS|FAIL slides=N problems=N
"""
import argparse
import base64
import html
import io
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

HERE = Path(__file__).resolve().parent
REF = HERE.parent / "container-reference"
FONTS = ("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900"
         "&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap")
S = 1080
KINDS = ("hook", "stat", "text", "rows", "image", "cta")
# Mike's face on the picture slides: (Haar face-box width px, centre x, centre y as fractions of the slide). The Haar box
# runs ~1.3x the cheek-to-cheek width; 520 px = a big face like the thumbnail (canton B4), above the hook headline. The
# room around it is darkened by a face-centred vignette (no matte: the picture stays one rectangle).
HOOK_FACE = (520, 0.64, 0.33)
CTA_FACE = (470, 0.5, 0.31)


# ── Mike's picture: a REAL frame, code-only finishing (the thumbnail's "natural" level, canton B4) ──────────────

def finish_natural(img: Image.Image) -> Image.Image:
    """Pixel-wise finishing only, no geometry, no generation: blended 4x4 CLAHE -> a little warmth + saturation ->
    two unsharp passes. Same numbers as the canton thumbnail Mike picked (B4, 2026-11-10); no denoise (it went painterly)."""
    import cv2
    bgr = cv2.cvtColor(np.asarray(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    L, A, B = cv2.split(cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB))
    L = cv2.addWeighted(L, 0.5, cv2.createCLAHE(clipLimit=1.3, tileGridSize=(4, 4)).apply(L), 0.5, 0)
    bgr = cv2.cvtColor(cv2.merge((L, cv2.add(A, 2), cv2.add(B, 3))), cv2.COLOR_LAB2BGR)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.12, 0, 255)
    out = Image.fromarray(cv2.cvtColor(cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR), cv2.COLOR_BGR2RGB))
    out = out.filter(ImageFilter.UnsharpMask(radius=1.8, percent=95, threshold=2))
    return out.filter(ImageFilter.UnsharpMask(radius=0.7, percent=45, threshold=1))


def find_face(img: Image.Image):
    """(cx, cy, w) of the biggest frontal face in pixels (OpenCV Haar), or None."""
    import cv2
    g = cv2.cvtColor(np.asarray(img.convert("RGB")), cv2.COLOR_RGB2GRAY)
    cas = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = cas.detectMultiScale(g, 1.1, 5, minSize=(80, 80))
    if not len(faces):
        return None
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    return x + w / 2, y + h / 2, w


def face_crop(img: Image.Image, face, out_w: int, out_h: int, face_w: int, at_x: float, at_y: float) -> Image.Image:
    """Scale `img` so the face is `face_w` px wide and its centre lands at (at_x, at_y) of an out_w x out_h box; the box
    is always fully covered (the scale grows and the face slides if the frame would run out). A rectangle, never a matte."""
    cx, cy, fw = face
    sc = max(face_w / fw, out_w / img.width, out_h / img.height)
    big = img.resize((round(img.width * sc), round(img.height * sc)), Image.LANCZOS)
    x0 = min(max(cx * sc - at_x * out_w, 0), big.width - out_w)
    y0 = min(max(cy * sc - at_y * out_h, 0), big.height - out_h)
    return big.crop((round(x0), round(y0), round(x0) + out_w, round(y0) + out_h))


def data_uri(img: Image.Image, fmt="JPEG") -> str:
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format=fmt, quality=93)
    return f"data:image/{fmt.lower()};base64," + base64.b64encode(buf.getvalue()).decode()


def file_uri(path: Path, crop=None, max_w=1900) -> str:
    im = Image.open(path).convert("RGB")
    if crop:
        x0, y0, x1, y1 = crop
        im = im.crop((round(x0 * im.width), round(y0 * im.height), round(x1 * im.width), round(y1 * im.height)))
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    return data_uri(im, "PNG")


# ── markup ───────────────────────────────────────────────────────────────────────────────────────────────

def rich(text: str) -> str:
    """Escape, then `[word]` -> accent highlight, `{number}` -> mono number."""
    t = html.escape(str(text or ""))
    t = re.sub(r"\[([^\]]+)\]", r'<span class="hl">\1</span>', t)
    return re.sub(r"\{([^}]+)\}", r'<span class="mono">\1</span>', t)


# the yt-post TOKENS, loaded after container-canonical.css and BEFORE the accent stylesheet: a project with no
# container_accent gets the canonical cyan key word (the videos' own `.c` highlight) and the canonical card / rule /
# number colours; an accent sheet (canton, quant) re-maps --accent-text, --accent-cyan, --border, .mono itself.
DEFAULTS = """
:root{--accent-text:var(--accent-cyan);--yt-line:var(--border);--yt-card:var(--bg-card);
  --yt-track:color-mix(in srgb,var(--text-muted) 55%,var(--bg-deep))}
.mono{color:var(--text-primary)}
"""

LOCAL = """
.frame.sq{width:1080px;height:1080px;position:relative;overflow:hidden;padding:0}
.sq h1{text-wrap:balance}
.sq .hdr{position:absolute;left:64px;right:64px;top:52px;height:72px;display:flex;align-items:center;justify-content:space-between}
.sq .tag{display:flex;align-items:center;gap:18px}
.sq .logo{width:68px;height:68px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 2px color-mix(in srgb,var(--accent-text) 35%,transparent)}
.sq .lab{font:700 28px 'DM Sans';letter-spacing:.14em;color:var(--accent-text)}
.sq .pg{font:600 22px 'JetBrains Mono';color:var(--text-muted);letter-spacing:.06em}
.sq .who{display:flex;align-items:center;gap:16px;text-align:right}
.sq .who b{display:block;font:700 23px 'DM Sans';color:var(--text-primary)}
.sq .who i{display:block;font:500 19px 'DM Sans';font-style:normal;color:var(--text-secondary)}
.sq .av{width:68px;height:68px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 2px var(--accent-cyan)}
.sq h1.t{position:absolute;left:64px;right:64px;top:160px;font-family:'Playfair Display',serif;font-weight:900;
  font-size:76px;line-height:1.08;color:var(--text-primary);margin:0;max-width:none}
.sq .divider.d{position:absolute;left:64px;width:96px;height:4px;border-radius:2px}
.sq .body{position:absolute;left:64px;right:64px;font:500 47px/1.42 'DM Sans';color:var(--text-primary);max-width:none}
/* the highlight words: the accent colour on every slide (a .mono inside a highlight keeps it) */
.sq .hl{color:var(--accent-text);font-style:normal}
.sq .hl .mono{color:inherit}
.sq .stat{position:absolute;left:64px;right:64px;text-align:center}
.sq .stat .n{font:700 200px/1 'JetBrains Mono';color:var(--accent-text);letter-spacing:-.07em;text-shadow:0 0 60px color-mix(in srgb,var(--accent-text) 25%,transparent)}
.sq .stat .u{font:600 38px 'DM Sans';color:var(--text-secondary);margin-top:22px}
.sq .note{position:absolute;left:64px;right:64px;font:500 34px/1.45 'DM Sans';color:var(--text-secondary)}
.sq .rows{position:absolute;left:64px;right:64px;border-radius:22px;padding:18px 40px;border:1px solid var(--yt-line);background:var(--yt-card)}
.sq .r{display:flex;align-items:baseline;gap:28px;padding:26px 0;border-bottom:1px solid var(--yt-line)}
.sq .r:last-child{border-bottom:none}
.sq .r .k{flex:0 0 230px;font:600 23px 'DM Sans';letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)}
.sq .r .v{flex:1;font:600 42px/1.3 'DM Sans';color:var(--text-primary)}
.sq .r.on{margin:0 -22px;padding:26px 22px;border:2px solid var(--accent-text);border-radius:14px}
.sq .shot{position:absolute;left:64px;right:64px;border-radius:18px;overflow:hidden;border:1px solid var(--yt-line);
  box-shadow:0 0 0 1px color-mix(in srgb,var(--accent-cyan) 18%,transparent),0 18px 40px rgba(0,0,0,.45);background:#000;display:flex;align-items:center;justify-content:center}
.sq .shot img{width:100%;height:100%;object-fit:contain;display:block}
.sq .cap{position:absolute;left:64px;right:64px;font:500 33px/1.4 'DM Sans';color:var(--text-secondary)}
.sq .bar{position:absolute;left:64px;right:64px;bottom:118px;display:flex;gap:8px}
.sq .bar span{flex:1;height:5px;border-radius:3px;background:var(--yt-track)}
.sq .bar span.on{background:var(--accent-text)}
.sq .ftr{position:absolute;left:64px;right:64px;bottom:52px;height:44px;display:flex;align-items:center;justify-content:space-between}
.sq .yt{font:600 24px 'DM Sans';color:var(--text-primary);display:flex;align-items:center;gap:12px}
.sq .yt:before{content:'';width:0;height:0;border-left:17px solid #FF2D2D;border-top:10px solid transparent;border-bottom:10px solid transparent}
.sq .sw{font:700 28px 'DM Sans';color:var(--accent-text)}
.sq .pic{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sq .ramp{position:absolute;inset:0}
.sq .hk-tag{position:absolute;left:64px;top:64px;display:flex;flex-direction:column;align-items:center;gap:16px}
.sq .hk-logo{width:150px;height:150px;border-radius:50%;object-fit:cover;
  box-shadow:0 0 0 3px color-mix(in srgb,var(--accent-text) 45%,transparent),0 0 60px color-mix(in srgb,var(--accent-cyan) 45%,transparent)}
.sq .hk-lab{font:700 34px 'DM Sans';letter-spacing:.12em;color:var(--accent-text);white-space:nowrap}
.sq h1.hk{position:absolute;left:64px;right:64px;bottom:150px;font-family:'Playfair Display',serif;font-weight:900;
  font-size:88px;line-height:1.04;color:var(--text-primary);margin:0;max-width:none;text-shadow:0 4px 30px rgba(0,0,0,.6)}
.sq .play{position:absolute;left:64px;top:64px;width:132px;height:92px;border-radius:24px;background:#FF2D2D;
  display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,.5)}
.sq .play:after{content:'';margin-left:8px;border-left:38px solid #fff;border-top:23px solid transparent;border-bottom:23px solid transparent}
.sq .cta-logo{position:absolute;right:64px;top:64px;width:120px;height:120px;border-radius:50%;object-fit:cover;
  box-shadow:0 0 0 3px color-mix(in srgb,var(--accent-text) 45%,transparent)}
.sq h1.ct{position:absolute;left:64px;right:64px;bottom:262px;font-family:'Playfair Display',serif;font-weight:900;
  font-size:92px;line-height:1.02;color:var(--text-primary);margin:0;text-align:center;max-width:none;text-shadow:0 4px 30px rgba(0,0,0,.6)}
/* Playfair Display draws old-style figures by default ('1' reads as a dotless i, the '2' in EC2 as a subscript): lining figures in every headline */
.sq h1.t,.sq h1.hk,.sq h1.ct{font-variant-numeric:lining-nums;font-feature-settings:'lnum' 1}
.sq .ct-sub{position:absolute;left:64px;right:64px;bottom:196px;text-align:center;font:600 34px 'DM Sans';color:var(--text-primary)}
.sq .pill{position:absolute;left:50%;transform:translateX(-50%);bottom:112px;padding:14px 34px;border-radius:999px;
  background:var(--accent-text);color:var(--bg-deep);font:700 30px 'DM Sans';white-space:nowrap}
.sq .ct-url{position:absolute;left:64px;right:64px;bottom:52px;justify-content:center}
"""

# LIGHT THEME only, appended after LOCAL (plan-to-make-millions, 2026-11-24: the first light video with a dark portrait).
# The two PICTURE slides (hook, cta: class `onpic`) sit on a photo the ramps DARKEN in every theme, so their words take the
# dark sheet's ink: under the light sheet 'Where I plan to' and the channel link were near black on black. An image
# slide's letterbox takes the paper colour (it was black bars around a light diagram) and a soft paper shadow.
LIGHT_LOCAL = """
.frame.sq.onpic{--text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--bg-deep:#0a0c10;
  --yt-track:rgba(232,234,240,.26);background:#0a0c10;color:#e8eaf0}
.frame.sq.onpic::after{mix-blend-mode:normal;opacity:.03}
.sq .shot{background:var(--bg-deep);box-shadow:0 1px 2px rgba(20,22,26,.05),0 14px 34px rgba(20,22,26,.10)}
.sq .stat .n{text-shadow:none}
.sq .bar span.on{box-shadow:none}
"""
# ... and, when the project has no accent sheet, the dark sheet's BRIGHT accent (the light sheet's accent is a deep print
# colour, dim on a dark photo). A project with an accent sheet keeps that sheet's own --accent-text.
LIGHT_ONPIC_ACCENT = """
.frame.sq.onpic{--accent-green:#00e68a;--accent-cyan:#00c2ff;--accent-text:var(--accent-cyan)}
"""


def header(spec, i, n, imgs):
    logo = f'<img class="logo" src="{imgs["logo"]}">' if imgs.get("logo") else ""
    return (f'<div class="hdr"><div class="tag">{logo}<span class="lab">{html.escape(spec["label"])}</span>'
            f'<span class="pg">{i}/{n}</span></div><div class="who"><div><b>{html.escape(spec["author"])}</b>'
            f'<i>{html.escape(spec.get("channel_name") or spec["channel"].lstrip("@"))}</i></div>'
            f'<img class="av" src="{imgs["avatar"]}"></div></div>')


def footer(spec, i, n, swipe=True):
    bar = "".join(f'<span class="{"on" if k < i else ""}"></span>' for k in range(n))
    return (f'<div class="bar">{bar}</div><div class="ftr"><span class="yt">youtube.com/{html.escape(spec["channel"])}</span>'
            + ('<span class="sw">Swipe &rarr;</span>' if swipe else "") + "</div>")


def slide_html(spec, s, i, n, imgs, proj: Path) -> str:
    k = s["kind"]
    if k == "hook":
        return (f'<img class="pic" src="{imgs["hook"]}"><div class="ramp" style="background:'
                f'radial-gradient(ellipse 46% 54% at {HOOK_FACE[1] * 100:.0f}% {HOOK_FACE[2] * 100 + 4:.0f}%,rgba(3,2,6,0) 0%,rgba(3,2,6,0) 52%,rgba(3,2,6,.5) 82%,rgba(3,2,6,.78) 100%),'
                'linear-gradient(90deg,rgba(3,2,6,.9) 0%,rgba(3,2,6,.5) 26%,rgba(3,2,6,0) 46%),'
                'linear-gradient(0deg,rgba(3,2,6,.97) 0%,rgba(3,2,6,.88) 30%,rgba(3,2,6,0) 62%)"></div>'
                f'<div class="hk-tag">' + (f'<img class="hk-logo" src="{imgs["logo"]}">' if imgs.get("logo") else "") + f'<div class="hk-lab">{html.escape(spec["label"])}</div></div>'
                f'<h1 class="hk">{rich(s["headline"])}</h1>' + footer(spec, i, n))
    if k == "cta":
        return (f'<img class="pic" src="{imgs["cta"]}"><div class="ramp" style="background:'
                f'radial-gradient(ellipse 46% 54% at {CTA_FACE[1] * 100:.0f}% {CTA_FACE[2] * 100 + 4:.0f}%,rgba(3,2,6,0) 0%,rgba(3,2,6,0) 52%,rgba(3,2,6,.55) 82%,rgba(3,2,6,.82) 100%),'
                'linear-gradient(0deg,rgba(3,2,6,.98) 0%,rgba(3,2,6,.92) 34%,rgba(3,2,6,0) 66%),'
                'linear-gradient(180deg,rgba(3,2,6,.55) 0%,rgba(3,2,6,0) 25%)"></div>'
                '<div class="play"></div>' + (f'<img class="cta-logo" src="{imgs["logo"]}">' if imgs.get("logo") else "") +
                f'<h1 class="ct">{rich(s.get("headline") or "Watch the [full video]")}</h1>'
                f'<div class="ct-sub">{rich(s.get("sub") or spec["video_title"])}</div>'
                f'<div class="pill">{html.escape(s.get("button") or "Link in the post")}</div>'
                f'<div class="ftr ct-url"><span class="yt">youtube.com/{html.escape(spec["channel"])}</span></div>')
    out = header(spec, i, n, imgs) + f'<h1 class="t" id="t{i}">{rich(s["headline"])}</h1>'
    # everything below the headline is placed from the headline's measured bottom (see place() in the page script)
    if k == "stat":
        out += f'<div class="stat flow"><div class="n">{html.escape(s["stat"])}</div><div class="u">{rich(s.get("stat_sub", ""))}</div></div>'
        if s.get("body"):
            out += f'<div class="note foot">{rich(s["body"])}</div>'
    elif k == "text":
        out += f'<div class="body flow">{rich(s["body"])}</div>'
    elif k == "rows":
        rows = "".join(f'<div class="r{" on" if j == s.get("highlight") else ""}"><span class="k">{html.escape(a)}</span>'
                       f'<span class="v">{rich(b)}</span></div>' for j, (a, b) in enumerate(s["rows"]))
        out += f'<div class="rows flow">{rows}</div>'
    elif k == "image":
        out += f'<div class="shot fill"><img src="{file_uri(proj / s["image"], s.get("crop"))}"></div>'
        if s.get("caption"):
            out += f'<div class="cap foot">{rich(s["caption"])}</div>'
    return out + footer(spec, i, n)


# the page lays the content out from the MEASURED headline bottom: `.flow` sits 56 px under it (a stat / rows block is
# vertically centred in the space above a `.foot` / the bar when there is room; a text body stays anchored under the
# headline), `.fill` takes all the space down to the caption / bar
PLACE = """() => {
  for (const f of document.querySelectorAll('.frame.sq')) {
    const h = f.querySelector('h1.t'); if (!h) continue;
    const fr = f.getBoundingClientRect(), top = h.getBoundingClientRect().bottom - fr.top + 56;
    const foot = f.querySelector('.foot'); let bottom = 1080 - 150;
    if (foot) { foot.style.bottom = '160px'; bottom = 1080 - 160 - foot.getBoundingClientRect().height - 36; }
    const flow = f.querySelector('.flow'), fill = f.querySelector('.fill');
    if (flow) { const fh = flow.getBoundingClientRect().height;
      flow.style.top = (flow.classList.contains('body') ? top : Math.max(top, top + (bottom - top - fh) / 2)) + 'px'; }
    if (fill) { fill.style.top = top + 'px'; fill.style.height = (bottom - top) + 'px'; }
  }
}"""

CHECK = """(el) => {
  const r = el.getBoundingClientRect(), out = [];
  if (Math.round(r.width) !== 1080 || Math.round(r.height) !== 1080) out.push('frame size ' + r.width + 'x' + r.height);
  if (/\\u2014/.test(el.innerText)) out.push('em dash');
  const boxes = [...el.querySelectorAll('h1,.body,.stat,.note,.rows,.shot,.cap,.hk-tag,.ct-sub,.pill,.hdr,.ftr')];
  for (const n of boxes) {
    const b = n.getBoundingClientRect();
    if (b.left - r.left < 40 || r.right - b.right < 40 || b.top - r.top < 30 || r.bottom - b.bottom < 30) out.push('near edge: ' + n.className);
    if (n.scrollWidth > n.clientWidth + 2 && n.clientWidth > 0) out.push('overflow: ' + n.className + ' ' + n.innerText.slice(0, 30));
  }
  const bar = el.querySelector('.bar'); const lim = bar ? bar.getBoundingClientRect().top - 12 : r.bottom - 150;
  for (const n of el.querySelectorAll('.body,.stat,.note,.rows,.shot,.cap,h1.t')) {
    if (n.getBoundingClientRect().bottom > lim) out.push('runs into the footer: ' + n.className);
  }
  const t = el.querySelector('h1.t');
  if (t) { const lh = parseFloat(getComputedStyle(t).lineHeight); const lines = Math.round(t.getBoundingClientRect().height / lh);
    if (lines > 3) out.push('headline is ' + lines + ' lines (max 3)'); }
  if (!getComputedStyle(el).getPropertyValue('--accent-text').trim()) out.push('--accent-text is empty (no accent colour)');
  for (const s of el.querySelectorAll('h1 .hl')) {
    if (getComputedStyle(s).color === getComputedStyle(s.closest('h1')).color) out.push('highlight not accent-coloured: ' + s.innerText.slice(0, 30));
  }
  const hk = el.querySelector('h1.hk,h1.ct');
  if (hk) { const lh = parseFloat(getComputedStyle(hk).lineHeight); const lines = Math.round(hk.getBoundingClientRect().height / lh);
    if (lines > 4) out.push('headline is ' + lines + ' lines (max 4)'); }
  return out;
}"""


def validate(spec, proj: Path):
    probs = []
    for k in ("label", "face", "channel", "author", "video_url", "video_title", "slides", "post"):   # logo is optional
        if not spec.get(k):
            probs.append(f"spec lacks `{k}`")
    sl = spec.get("slides") or []
    if not 4 <= len(sl) <= 10:
        probs.append(f"{len(sl)} slides (4 to 10; a YouTube post holds at most 10 images)")
    if sl and sl[0].get("kind") != "hook":
        probs.append("slide 1 must be kind `hook` (Mike's picture + the headline)")
    if sl and sl[-1].get("kind") != "cta":
        probs.append("the last slide must be kind `cta` (watch the full video)")
    for i, s in enumerate(sl, 1):
        if s.get("kind") not in KINDS:
            probs.append(f"slide {i}: unknown kind {s.get('kind')!r}")
        if s.get("kind") in ("stat", "text", "rows", "image", "hook") and not s.get("headline"):
            probs.append(f"slide {i}: no headline")
        if s.get("kind") == "image" and not (proj / str(s.get("image", ""))).is_file():
            probs.append(f"slide {i}: image {s.get('image')} not found under the project folder")
    for k in ("logo", "face"):
        if spec.get(k) and not (proj / spec[k]).is_file():
            probs.append(f"{k} {spec[k]} not found under the project folder")
    if "—" in json.dumps(spec, ensure_ascii=False):
        probs.append("em dash in the spec")
    return probs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--only", default="", help="slide numbers to re-render, e.g. 3,4")
    a = ap.parse_args()
    spec_p = Path(a.spec).resolve()
    spec = json.loads(spec_p.read_text(encoding="utf-8"))
    proj = spec_p.parent.parent
    probs = validate(spec, proj)
    if probs:
        print("\n".join("SPEC: " + p for p in probs))
        print(f"YT-POST-BUILD FAIL slides=0 problems={len(probs)}")
        sys.exit(1)
    only = {int(x) for x in a.only.split(",") if x.strip()}
    out_dir = spec_p.parent / "slides"
    out_dir.mkdir(parents=True, exist_ok=True)

    # the pictures: one real frame, finished once, cropped three ways (hook, cta, avatar)
    face_img = finish_natural(Image.open(proj / spec["face"]))
    face = find_face(face_img)
    if not face:
        print("FACE: no face found in", spec["face"])
        print("YT-POST-BUILD FAIL slides=0 problems=1")
        sys.exit(1)
    logo = Image.open(proj / spec["logo"]).convert("RGB") if spec.get("logo") else None
    imgs = {
        "logo": data_uri(logo.resize((300, 300), Image.LANCZOS), "PNG") if logo else None,
        "avatar": data_uri(face_crop(face_img, face, 220, 220, 120, 0.5, 0.48)),
        "hook": data_uri(face_crop(face_img, face, S, S, HOOK_FACE[0], HOOK_FACE[1], HOOK_FACE[2])),
        "cta": data_uri(face_crop(face_img, face, S, S, CTA_FACE[0], CTA_FACE[1], CTA_FACE[2])),
    }
    settings = {}
    try:
        settings = json.loads((proj / "GRAPH-PROGRESS.json").read_text(encoding="utf-8")).get("settings") or {}
    except (OSError, ValueError):
        pass
    sheets = ["container-canonical.css"]
    light = settings.get("container_theme") == "light" and (REF / "container-canonical-light.css").is_file()
    if light:
        sheets.append("container-canonical-light.css")
    sheets.append(None)   # the yt-post token defaults (DEFAULTS) sit here, under any accent sheet
    acc = settings.get("container_accent")
    has_acc = bool(acc and (REF / "accents" / f"{acc}.css").is_file())
    if has_acc:
        sheets.append(f"accents/{acc}.css")
    css = "\n".join(DEFAULTS if f is None else (REF / f).read_text(encoding="utf-8") for f in sheets)
    local = LOCAL + ((LIGHT_LOCAL + ("" if has_acc else LIGHT_ONPIC_ACCENT)) if light else "")

    n = len(spec["slides"])
    # `onpic` marks the two picture slides (hook, cta); only the light theme styles it (LIGHT_LOCAL)
    frames = "\n".join(f'<div class="frame sq{" onpic" if s["kind"] in ("hook", "cta") else ""}" id="s{i}">'
                       f'{slide_html(spec, s, i, n, imgs, proj)}</div>' for i, s in enumerate(spec["slides"], 1))
    page = (f'<!doctype html><html><head><meta charset="utf-8"><link href="{FONTS}" rel="stylesheet">'
            f'<style>{css}</style><style>{local}</style></head><body>\n{frames}\n</body></html>\n')
    page_p = spec_p.parent / "yt-post.html"
    page_p.write_text(page, encoding="utf-8")

    from playwright.sync_api import sync_playwright
    problems, wrote = [], 0
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": S, "height": S}, device_scale_factor=2)
        pg.goto(page_p.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for fam, w in [("Playfair Display", 900), ("DM Sans", 600), ("JetBrains Mono", 600)]:
            if not pg.evaluate("([f,w])=>document.fonts.check(`${w} 40px '${f}'`)&&[...document.fonts].some(x=>x.family.replace(/\"/g,'')===f&&x.status==='loaded')", [fam, w]):
                problems.append(f"FONT NOT LOADED: {fam} {w}")
        pg.evaluate(PLACE)
        for i in range(1, n + 1):
            if only and i not in only:
                continue
            el = pg.locator(f"#s{i}")
            problems += [f"slide {i}: {m}" for m in el.evaluate(CHECK)]
            img = Image.open(io.BytesIO(el.screenshot(type="png"))).convert("RGB").resize((S, S), Image.LANCZOS)
            dest = out_dir / f"{i:02d}.png"
            img.save(dest)
            wrote += 1
            print("wrote", dest)
        br.close()
    for f in sorted(out_dir.glob("*.png")):
        if f.stem.isdigit() and int(f.stem) > n:
            f.unlink()   # a shorter re-plan leaves no stale slide behind
    if problems:
        print("\n".join(["PROBLEMS:"] + problems))
    print(f"YT-POST-BUILD {'FAIL' if problems else 'PASS'} slides={wrote} problems={len(problems)}")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
