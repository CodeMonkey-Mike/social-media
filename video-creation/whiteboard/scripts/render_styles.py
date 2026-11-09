"""Render the whiteboard style candidates as 1920x1080 frames and build the style-picker dashboard.

THREE sample sets, all screenshotted from HTML drawn in the browser (rough.js where the look wants it):
  sample.html         PEN axis:   every styles.json pen on a deliberately simple scene
  vocab.html          PEN axis:   every pen on richer hand-authored drawings (horse, people with hair, hay, tree)
  vocabularies.html   DRAWING axis: every vocabularies.json DRAWING VOCABULARY (hand-drawn-with-hair, bean,
                      geometric flat, pictogram, isometric, pixel, line-only), each with its own natural pen

Usage (from the repo root):
    python video-creation/whiteboard/scripts/render_styles.py [--only id,id] [--template sample|vocab|vocabularies|all] [--no-dashboard]

Reads  styles/styles.json (pens) · styles/vocabularies.json (drawing vocabularies)
Writes samples/<pen>.png · samples/vocab-<pen>.png · samples/vocabulary-<vocab>.png
       style-dashboard.html (favorites + notes persist in localStorage, Export copies JSON)
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path
from urllib.parse import quote

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent                      # video-creation/whiteboard
REPO = ROOT.parent.parent               # social-media
STYLES = ROOT / "styles" / "styles.json"
VOCABULARIES = ROOT / "styles" / "vocabularies.json"
BUILD = ROOT / "styles" / "_build"
SAMPLES = ROOT / "samples"
DASHBOARD = ROOT / "style-dashboard.html"
ROUGH_JS = REPO / "video-creation" / "remotion" / "node_modules" / "roughjs" / "bundled" / "rough.js"

# template -> (file, output prefix, iterate over)
TEMPLATES = {
    "sample": (ROOT / "styles" / "sample.html", "", "pens"),
    "vocab": (ROOT / "styles" / "vocab.html", "vocab-", "pens"),
    "vocabularies": (ROOT / "styles" / "vocabularies.html", "vocabulary-", "vocabularies"),
}
# the drawing-vocabulary page carries every font its seven vocabularies use
VOCAB_FONTS = ["Gochi Hand", "Shadows Into Light", "Baloo 2", "Nunito", "Poppins", "Press Start 2P"]


def font_link(families: list[str]) -> str:
    q = "&".join("family=" + quote(f).replace("%20", "+") + ":wght@400;700;800" for f in sorted(set(families)))
    return f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{q}&display=block">'


def build_page(item: dict, template: str) -> Path:
    tpl, prefix, kind = TEMPLATES[template]
    html = tpl.read_text(encoding="utf-8")
    if kind == "pens":
        html = html.replace("<!--FONTS-->", font_link([item["fontH"], item["fontL"]]))
        html = html.replace("/*STYLE*/{}/*END*/", json.dumps(item))
    else:
        html = html.replace("<!--FONTS-->", font_link(VOCAB_FONTS))
        html = html.replace("/*VOCAB*/{}/*END*/", json.dumps(item))
    html = html.replace("file:///__ROUGH_JS__", ROUGH_JS.resolve().as_uri())
    BUILD.mkdir(parents=True, exist_ok=True)
    out = BUILD / f"{prefix}{item['id']}.html"
    out.write_text(html, encoding="utf-8")
    return out


def render(jobs: list[tuple[str, dict]]) -> None:
    """jobs = [(template, item)] rendered in one browser session."""
    from playwright.sync_api import sync_playwright

    SAMPLES.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True, channel="chrome")
        except Exception:
            browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        page.on("pageerror", lambda e: print(f"[pageerror] {e}", file=sys.stderr))
        for template, item in jobs:
            prefix = TEMPLATES[template][1]
            page_path = build_page(item, template)
            page.goto(page_path.resolve().as_uri(), wait_until="load")
            try:
                page.wait_for_selector("body[data-ready='1']", timeout=20000)
            except Exception:
                print(f"[warn] {template}/{item['id']}: page never reported ready, capturing anyway", file=sys.stderr)
            time.sleep(0.4)  # let the glow filters settle
            out = SAMPLES / f"{prefix}{item['id']}.png"
            page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": 1920, "height": 1080})
            print(f"[ok] {template}/{item['id']} -> {out}")
        browser.close()


def active(item: dict) -> bool:
    """Rejected / set-aside candidates stay in the JSON for the record but are neither rendered nor shown."""
    return True  # Mike (2026-10-30): every candidate stays visible as an option


def badge(item: dict) -> str:
    if item.get("status") == "current":
        return '<span class="badge">current pick</span>'
    if item.get("status_note"):
        return f'<span class="badge note">{item["status_note"]}</span>'
    return ""


def pen_card(st: dict) -> str:
    pal = st["palette"]
    swatches = "".join(f'<i title="{k}" style="background:{v}"></i>' for k, v in pal.items())
    swatches = f'<i title="bg" style="background:{st["bg"]};outline:1px solid #555"></i><i title="ink" style="background:{st["ink"]};outline:1px solid #555"></i>' + swatches
    vocab = SAMPLES / f"vocab-{st['id']}.png"
    vocab_html = (f'<a href="samples/vocab-{st["id"]}.png" target="_blank"><img src="samples/vocab-{st["id"]}.png" alt="{st["name"]} on richer drawings"></a>'
                  '<div class="lbl">the same pen on richer drawings (horse, people with hair, hay, tree)</div>') if vocab.exists() else ""
    return f"""
  <section class="card" data-id="pen:{st['id']}">
    <a href="samples/{st['id']}.png" target="_blank"><img src="samples/{st['id']}.png" alt="{st['name']}"></a>
    <div class="lbl">the pen on the simple scene</div>
    {vocab_html}
    <div class="meta">
      <div class="head"><h2>{st['name']} <code>{st['id']}</code>{badge(st)}</h2><button class="fav" title="favorite">☆</button></div>
      <p class="blurb">{st['blurb']}</p>
      <div class="sw">{swatches}</div>
      <table>
        <tr><td>mode</td><td>{st['mode']}</td><td>fill</td><td>{st['fillStyle']}</td></tr>
        <tr><td>roughness</td><td>{st['roughness']}</td><td>bowing</td><td>{st['bowing']}</td></tr>
        <tr><td>ink width</td><td>{st['inkWidth']}</td><td>caps</td><td>{'yes' if st['caps'] else 'no'}</td></tr>
        <tr><td>heading font</td><td>{st['fontH']}</td><td>label font</td><td>{st['fontL']}</td></tr>
      </table>
      <textarea class="notes" placeholder="notes for Claude: what to keep, what to change"></textarea>
    </div>
  </section>"""


def vocab_card(v: dict) -> str:
    return f"""
  <section class="card" data-id="vocab:{v['id']}">
    <a href="samples/vocabulary-{v['id']}.png" target="_blank"><img src="samples/vocabulary-{v['id']}.png" alt="{v['name']}"></a>
    <div class="meta">
      <div class="head"><h2>{v['name']} <code>{v['id']}</code>{badge(v)}</h2><button class="fav" title="favorite">☆</button></div>
      <p class="blurb">{v['blurb']}</p>
      <textarea class="notes" placeholder="notes for Claude: what to keep, what to change, what to mix"></textarea>
    </div>
  </section>"""


def build_dashboard(styles: list[dict], vocabs: list[dict]) -> None:
    vocab_cards = [vocab_card(v) for v in vocabs if active(v) and (SAMPLES / f"vocabulary-{v['id']}.png").exists()]
    pen_cards = [pen_card(s) for s in styles if active(s)]
    gone_v = [f"{v['name']} ({v.get('status_note', v['status'])})" for v in vocabs if not active(v)]
    gone_p = [f"{s['name']} ({s.get('status_note', s['status'])})" for s in styles if not active(s)]
    gone_v_html = ""
    gone_p_html = ""

    html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Whiteboard style picker</title>
<style>
  :root {{ color-scheme: dark; }}
  body {{ margin:0; background:#111317; color:#e6e6e6; font:15px/1.45 system-ui, Segoe UI, sans-serif; }}
  header {{ padding:22px 28px 10px; border-bottom:1px solid #2a2d33; display:flex; gap:18px; align-items:baseline; flex-wrap:wrap; }}
  header h1 {{ margin:0; font-size:22px; }}
  header p {{ margin:0; color:#9aa0a6; max-width:1200px; }}
  header button {{ margin-left:auto; background:#2b6cb0; color:#fff; border:0; padding:8px 14px; border-radius:6px; cursor:pointer; font-size:14px; }}
  h1.sec {{ font-size:20px; margin:26px 28px 0; }}
  p.sec {{ margin:6px 28px 0; color:#9aa0a6; max-width:1200px; }}
  main {{ display:grid; grid-template-columns: repeat(auto-fill, minmax(560px, 1fr)); gap:22px; padding:18px 28px 10px; }}
  .card {{ background:#191c22; border:1px solid #2a2d33; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; }}
  .card.fav {{ border-color:#f5c542; box-shadow:0 0 0 1px #f5c542 inset; }}
  .card img {{ width:100%; aspect-ratio:16/9; display:block; background:#000; }}
  .lbl {{ font-size:12px; color:#7f858c; padding:4px 16px 8px; }}
  .meta {{ padding:10px 16px 16px; display:flex; flex-direction:column; gap:10px; }}
  .head {{ display:flex; align-items:center; gap:10px; }}
  h2 {{ margin:0; font-size:18px; flex:1; }}
  h2 code {{ font-size:12px; color:#9aa0a6; margin-left:8px; }}
  .fav {{ background:none; border:1px solid #444; color:#f5c542; font-size:20px; width:38px; height:38px; border-radius:8px; cursor:pointer; }}
  .card.fav .fav {{ background:#f5c542; color:#111; }}
  .blurb {{ margin:0; color:#c9cdd2; }}
  .sw {{ display:flex; gap:6px; }}
  .sw i {{ width:26px; height:26px; border-radius:6px; display:inline-block; }}
  table {{ border-collapse:collapse; font-size:13px; color:#b8bcc2; }}
  td {{ padding:2px 10px 2px 0; }}
  td:nth-child(odd) {{ color:#7f858c; }}
  textarea {{ width:100%; min-height:64px; background:#0f1115; color:#e6e6e6; border:1px solid #2a2d33; border-radius:8px; padding:8px; font:14px system-ui; box-sizing:border-box; }}
  .badge {{ font-size:11px; background:#f5c542; color:#111; border-radius:6px; padding:2px 7px; margin-left:10px; vertical-align:middle; font-weight:600; }}
  .badge.note {{ background:#2a2d33; color:#9aa0a6; font-weight:400; }}
  p.gone {{ color:#6f7680; font-size:13px; }}
  pre#export {{ display:none; margin:0 28px 28px; padding:14px; background:#0f1115; border:1px solid #2a2d33; border-radius:8px; white-space:pre-wrap; }}
</style></head>
<body>
<header>
  <h1>Whiteboard style picker</h1>
  <p>Two separate decisions. <b>A. Drawing vocabulary</b>: HOW things are drawn (bodies, faces, objects), {len(vocab_cards)} candidates on one identical scene. <b>B. Pen</b>: ink, wobble, fills and fonts, {len(pen_cards)} candidates, each shown on a simple scene and on richer drawings. Every candidate stays as an option (a multi-chapter video may want a dark pen in one chapter and a light one in another); the badge marks the current pick. Star, leave notes, Export, paste the JSON to Claude. Frames: <code>video-creation/whiteboard/samples/</code></p>
  <button id="exp">Export picks</button>
</header>
<h1 class="sec">A. Drawing vocabularies</h1>
<p class="sec">Same scene every time: a person, a horse, a vault, three coins, a tree. Only the way of drawing changes.</p>
{gone_v_html}
<main>{''.join(vocab_cards)}
</main>
<h1 class="sec">B. Pens</h1>
<p class="sec">Ink, wobble, fill style, palette and fonts. The first frame is the pen on a simple scene; the second is the same pen on the hand-drawn-with-hair vocabulary.</p>
{gone_p_html}
<main>{''.join(pen_cards)}
</main>
<pre id="export"></pre>
<script>
const KEY = 'whiteboard-style-picks-v2';
const state = JSON.parse(localStorage.getItem(KEY) || '{{}}');
function save() {{ localStorage.setItem(KEY, JSON.stringify(state)); }}
document.querySelectorAll('.card').forEach(card => {{
  const id = card.dataset.id;
  const s = state[id] = state[id] || {{ fav: false, notes: '' }};
  const btn = card.querySelector('.fav'), ta = card.querySelector('.notes');
  const paint = () => {{ card.classList.toggle('fav', s.fav); btn.textContent = s.fav ? '★' : '☆'; }};
  ta.value = s.notes; paint();
  btn.onclick = () => {{ s.fav = !s.fav; paint(); save(); }};
  ta.oninput = () => {{ s.notes = ta.value; save(); }};
}});
document.getElementById('exp').onclick = async () => {{
  const picks = Object.entries(state).filter(([,v]) => v.fav || v.notes.trim()).map(([id, v]) => ({{ id, favorite: v.fav, notes: v.notes.trim() }}));
  const txt = JSON.stringify({{ picks }}, null, 2);
  const pre = document.getElementById('export'); pre.style.display = 'block'; pre.textContent = txt;
  try {{ await navigator.clipboard.writeText(txt); pre.textContent = '(copied to clipboard)\\n' + txt; }} catch (e) {{}}
}};
</script>
</body></html>
"""
    DASHBOARD.write_text(html, encoding="utf-8")
    print(f"[ok] dashboard -> {DASHBOARD}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated ids (pens or vocabularies) to render")
    ap.add_argument("--template", default="all", choices=["sample", "vocab", "vocabularies", "all"])
    ap.add_argument("--no-dashboard", action="store_true")
    a = ap.parse_args()
    styles = json.loads(STYLES.read_text(encoding="utf-8"))["styles"]
    vocabs = json.loads(VOCABULARIES.read_text(encoding="utf-8"))["vocabularies"]
    if not ROUGH_JS.exists():
        print(f"rough.js bundle missing: {ROUGH_JS}\n  cd video-creation/remotion && npm install roughjs", file=sys.stderr)
        return 1
    only = set(a.only.split(",")) if a.only else None
    templates = list(TEMPLATES) if a.template == "all" else [a.template]
    jobs: list[tuple[str, dict]] = []
    for t in templates:
        items = styles if TEMPLATES[t][2] == "pens" else vocabs
        jobs += [(t, it) for it in items if (only and it["id"] in only) or (not only and active(it))]
    render(jobs)
    if not a.no_dashboard:
        build_dashboard(styles, vocabs)
    return 0


if __name__ == "__main__":
    sys.exit(main())
