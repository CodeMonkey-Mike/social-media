"""render_carousel_v2.py - code-render the Version 2 (analytical / editorial) carousel slides.

Why this exists (Mike, 2026-11-11): the YT promo carousel for the longform lane is already built in code
(HTML + Playwright, never an image model), and Version 2 is a fixed template: a teal "N OF TOTAL" label,
a huge white condensed title, a teal accent line, and a dark rounded box with a teal label and white body.
Nothing in it needs a generated picture, so a Version 2 slide is now RENDERED, not generated: no ChatGPT, no
`--reference-image`, no exemplar, no chat pool, no capture bugs, and every word on it is exactly the text in the
spec (a model never re-spells a number). The old exemplar folder `schedule-tweets/images/reference/carousels/version2/`
is the LOOK this template matches; it is no longer an input.

A lane 3 plan asks for it with an `images[]` item that carries `render: "code-v2"` and a `spec` instead of a
`prompt` / `ref`:

    {"purpose": "yt-posts", "image_id": "1a2b3c4d", "slug": "01-hook", "render": "code-v2",
     "spec": {"label": "1 OF 6",
              "title": "Bitcoin: 7 TPS.\\nKaspa: 5,700.",        # \\n = a forced line break; otherwise it wraps
              "accent": "The payment gap is 800x, and it is not closing.",
              "box_label": "THE STAT",
              "box": ["Bitcoin was built to be global cash.", "It processes 7 transactions per second."]}}

`repurpose/lane3_batch.py --stage generate` renders those items (and only those) with `render_item`; everything
else still goes to ChatGPT. `queue_writer.validate_lane3_plan` gates the spec (`validate_spec`).

CLI:
    python repurpose/render_carousel_v2.py --spec spec.json --out slide.png       # one slide
    python repurpose/render_carousel_v2.py --plan repurpose/output/<batch>-lane3-plan.json [--images-base DIR]
                                                                                  # every code-v2 item of a plan

Size 1254x1254, the size the exemplars (and every shipped V2 slide) have; the 1:1 verify gate in lane3_batch passes.
Fonts: Anton (title) + Inter (everything else) from Google Fonts, the same loader the other code-rendered slides use;
the render FAILS if a font did not load, if text overflows the frame, if the title cannot fit at a legible size, or if
the accent line runs into the box.
"""
import argparse
import html
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SIZE = 1254
TEAL = "#19c9c0"

LABEL_RE = re.compile(r"^\d{1,2} OF \d{1,2}$")
DASHES = ("—", "–")
FIELDS = ("label", "title", "accent", "box_label", "box")

FONTS = ("https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap")


def validate_spec(spec: dict, where: str = "spec") -> list:
    """Return a list of problem strings (empty = clean). Mirrors the persona hard rules the plan gate also enforces."""
    bad = []
    if not isinstance(spec, dict):
        return [f"{where}: not an object"]
    for k in FIELDS:
        if not spec.get(k):
            bad.append(f"{where}: missing {k!r}")
    if bad:
        return bad
    if not LABEL_RE.match(str(spec["label"])):
        bad.append(f"{where}: label {spec['label']!r} must look like '1 OF 6' (all caps, the exemplar counter)")
    else:
        n, tot = (int(x) for x in re.findall(r"\d+", spec["label"]))
        if not 1 <= n <= tot:
            bad.append(f"{where}: label {spec['label']!r} counts past its own total")
    if not isinstance(spec["box"], list) or not 1 <= len(spec["box"]) <= 5 or not all(isinstance(x, str) and x.strip() for x in spec["box"]):
        bad.append(f"{where}: box must be 1 to 5 non-empty text lines (a list of strings)")
    if len(str(spec["title"]).replace("\n", " ")) > 60:
        bad.append(f"{where}: title is {len(str(spec['title']))} chars (max 60: it is 2 to 4 huge lines)")
    if str(spec["title"]).count("\n") > 3:
        bad.append(f"{where}: title has more than 4 lines")
    if len(str(spec["accent"])) > 90:
        bad.append(f"{where}: accent line is over 90 chars")
    if len(str(spec["box_label"])) > 28:
        bad.append(f"{where}: box_label is over 28 chars")
    for k in FIELDS:
        vals = spec[k] if isinstance(spec[k], list) else [spec[k]]
        for v in vals:
            for d in DASHES:
                if d in str(v):
                    bad.append(f"{where}: {k} carries a dash {d!r} (persona: no em/en dashes; use a comma, colon or period)")
    return bad


def _page_html(spec: dict) -> str:
    esc = lambda s: html.escape(str(s))
    title = "<br>".join(esc(x) for x in str(spec["title"]).split("\n"))
    box = "<br>".join(esc(x) for x in spec["box"])
    return f"""<!doctype html><html><head><meta charset="utf-8"><link href="{FONTS}" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:{SIZE}px;height:{SIZE}px;background:#050505;overflow:hidden}}
#c{{position:relative;width:{SIZE}px;height:{SIZE}px;overflow:hidden;
  background:radial-gradient(1100px 900px at 72% 18%,#0d0d0d 0%,#050505 60%,#030303 100%)}}
#c:before{{content:"";position:absolute;inset:0;opacity:.04;mix-blend-mode:screen;
  background-image:repeating-linear-gradient(115deg,rgba(255,255,255,.5) 0 1px,transparent 1px 7px),
  repeating-linear-gradient(25deg,rgba(255,255,255,.35) 0 1px,transparent 1px 11px)}}
#lab{{position:absolute;left:62px;top:56px;font:800 44px/1 Inter,sans-serif;letter-spacing:.14em;color:{TEAL}}}
#title{{position:absolute;left:62px;right:50px;font-family:Anton,'Arial Black',Impact,sans-serif;font-weight:400;
  color:#fff;line-height:1.0;letter-spacing:.005em;word-spacing:.09em}}
#acc{{position:absolute;left:66px;right:60px;font:500 64px/1.2 Inter,sans-serif;color:{TEAL};letter-spacing:-.01em}}
#box{{position:absolute;left:58px;right:58px;bottom:36px;border-radius:30px;border:2px solid #2a2a2a;
  background:linear-gradient(180deg,#171717,#111);padding:34px 56px 38px}}
#bl{{font:800 38px/1 Inter,sans-serif;letter-spacing:.17em;color:{TEAL};margin-bottom:22px;text-transform:uppercase}}
#bb{{font:400 41px/1.28 Inter,sans-serif;color:#f1f1f1;text-wrap:pretty}}
</style></head><body><div id="c">
<div id="lab">{esc(spec["label"])}</div>
<div id="title">{title}</div>
<div id="acc">{esc(spec["accent"])}</div>
<div id="box"><div id="bl">{esc(spec["box_label"])}</div><div id="bb">{box}</div></div>
</div></body></html>"""


# Fit: the title takes the largest size (capped, like the exemplars' ~215 px) at which it clears the label above and the
# accent line + box below, with no line wider than the frame. The accent sits right under the title (exemplar rhythm).
_FIT_JS = """
() => {
  const $ = id => document.getElementById(id);
  const t = $('title'), a = $('acc'), b = $('box'), lab = $('lab');
  const top0 = lab.getBoundingClientRect().bottom + 26;
  const boxTop = b.getBoundingClientRect().top;
  let fs = 230, fit = null;
  for (; fs >= 110; fs -= 2) {
    t.style.fontSize = fs + 'px';
    t.style.top = top0 + 'px';
    a.style.top = (t.getBoundingClientRect().bottom + 14) + 'px';
    const ok = a.getBoundingClientRect().bottom <= boxTop - 22 && t.scrollWidth <= t.clientWidth + 1;
    if (ok) { fit = fs; break; }
  }
  // spread the slack: a short title leaves a dead band above the box, so push the block down by 40% of it
  if (fit !== null) {
    const slack = boxTop - 22 - a.getBoundingClientRect().bottom;
    if (slack > 20) {
      const shift = Math.round(slack * 0.4);
      t.style.top = (top0 + shift) + 'px';
      a.style.top = (t.getBoundingClientRect().bottom + 14) + 'px';
    }
  }
  const r = e => { const x = e.getBoundingClientRect(); return [Math.round(x.left), Math.round(x.top), Math.round(x.right), Math.round(x.bottom)]; };
  return { fit, fs, title: r(t), acc: r(a), box: r(b), lab: r(lab),
           accLines: Math.round(a.getBoundingClientRect().height / parseFloat(getComputedStyle(a).lineHeight)),
           boxInside: b.scrollHeight <= b.clientHeight + 1 };
}
"""


def render_slides(items, headless=True):
    """items: [(spec, out_path)]. One browser for the lot. Returns [(out_path, report_or_None, [problems])]."""
    from playwright.sync_api import sync_playwright
    out = []
    with sync_playwright() as p:
        br = p.chromium.launch(headless=headless)
        for spec, out_path in items:
            probs = validate_spec(spec, str(out_path.name))
            if probs:
                out.append((out_path, None, probs))
                continue
            pg = br.new_page(viewport={"width": SIZE, "height": SIZE}, device_scale_factor=1)
            pg.set_content(_page_html(spec), wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            problems = []
            for fam, w in (("Anton", 400), ("Inter", 800), ("Inter", 500), ("Inter", 400)):
                if not pg.evaluate("([f,w])=>document.fonts.check(`${w} 40px '${f}'`)", [fam, w]):
                    problems.append(f"FONT NOT LOADED: {fam} {w} (offline? Google Fonts unreachable)")
            rep = pg.evaluate(_FIT_JS)
            if rep["fit"] is None:
                problems.append("title cannot fit: even at 110 px it collides with the box or runs wide (shorten title/accent/box)")
            elif rep["fit"] < 150:
                problems.append(f"title fit only {rep['fit']} px (under 150 reads small next to the exemplars): shorten the title or the box")
            if rep["accLines"] > 2:
                problems.append(f"accent line wraps to {rep['accLines']} lines (max 2)")
            if not rep["boxInside"]:
                problems.append("box text overflows the box")
            if rep["lab"][3] > rep["title"][1]:
                problems.append("title overlaps the counter label")
            if not problems:
                out_path.parent.mkdir(parents=True, exist_ok=True)
                pg.screenshot(path=str(out_path), clip={"x": 0, "y": 0, "width": SIZE, "height": SIZE})
            pg.close()
            out.append((out_path, rep, problems))
        br.close()
    return out


def render_item(item: dict, out_path: Path):
    """The lane3_batch hook: render ONE plan image item. Returns (ok, message)."""
    (path, rep, problems), = render_slides([(item["spec"], Path(out_path))])
    if problems:
        return False, "; ".join(problems)
    return True, f"{path.name} {SIZE}x{SIZE} title {rep['fit']}px"


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--spec")
    ap.add_argument("--out")
    ap.add_argument("--plan")
    ap.add_argument("--images-base")
    a = ap.parse_args()
    if a.spec:
        spec = json.loads(Path(a.spec).read_text(encoding="utf-8"))
        res = render_slides([(spec, Path(a.out or "slide.png"))])
        ok = True
        for path, rep, probs in res:
            print(("OK  " if not probs else "FAIL") + f" {path} " + (f"title {rep['fit']}px" if rep else "") + ("; ".join(probs)))
            ok = ok and not probs
        sys.exit(0 if ok else 1)
    if a.plan:
        sys.path.insert(0, str(HERE))
        import queue_writer as qw
        from gen_images import subdir_for
        plan = json.loads(Path(a.plan).read_text(encoding="utf-8"))
        base = Path(a.images_base) if a.images_base else qw.IMAGES_BASE_DEFAULT
        items = []
        for im in plan.get("images") or []:
            if im.get("render") != "code-v2":
                continue
            p = base / subdir_for(im["purpose"]) / f"{im['purpose']}-{im['image_id']}-{im['slug']}.png"
            if p.is_file() and p.stat().st_size >= 5000:
                print(f"SKIP {p.name} (exists)")
                continue
            items.append((im["spec"], p))
        if not items:
            print("nothing to render")
            return
        ok = True
        for path, rep, probs in render_slides(items):
            print(("OK  " if not probs else "FAIL") + f" {path.name} " + (f"title {rep['fit']}px" if rep else "") + ("; ".join(probs)))
            ok = ok and not probs
        sys.exit(0 if ok else 1)
    ap.error("give --spec/--out or --plan")


if __name__ == "__main__":
    main()
