"""pieverse SHORT, native-vertical rebuild of card D5 (slide-builder, 2026-11-14, 16:9-sourced short mode).

The short shows D5's RETURN (the NOT PUBLISHED half lighting) over short seconds [13.455, 19.65]. A 608 px centre crop of
the 16:9 card is not acceptable (Mike), so this re-drives the SAME source at 1080x1920: the frame markup is the 16:9
builder's own d5(state) output (../../slide-sources/build_slides.py, imported, never copied), on the SAME locked
container-canonical.css + that build's LOCAL / EXTRA_CSS components (DARK, stylesheet-default accent, no chapter_themes).
The only addition is PORTRAIT below: the frame becomes 1080x1920 and the two halves stack (headline wraps); every token,
font, size and colour stays the 16:9's.

Placement: the card sits between the top platform UI (y < 110) and the short's caption block (y ~1420-1600, longform-to-
short.md "Short captions sit in the SAFE ZONE"; a caption never sits on card text), so its box must end by y 1400.

Outputs (assets/short/vertical-cards/):
  D5-not-published-v.png        the ONE file s_vertical_cards records for the whole window (= state s8: all three rows
                                read, footer printed; a real 16:9 state that carries every named element)
  D5-not-published-v-s4..s8.png the 16:9 spotlight states, re-shot portrait (names deliberately do NOT match the node's
                                `D5-*v.png` glob, so only the main file is picked); cue times in SHORT seconds in
  D5-not-published-v.states.json
Gates (refuse to ship): a webfont did not load, a frame is not 1080x1920, an em/en dash or a dollar sign on screen, text
inside the 44 px edge margin, overflow, card box outside y 110-1400.
Renders at device_scale_factor=2, Lanczos-downsampled to exactly 1080x1920.
Run: python build_d5_vertical.py
"""
import importlib.util
import io
import json
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parents[1]                                   # media/pieverse/assets
SRC = ASSETS / "slide-sources" / "build_slides.py"         # the 16:9 builder (source of the markup + component CSS)
OUT = ASSETS / "short" / "vertical-cards"
W, H, DSF, MARGIN = 1080, 1920, 2, 44
CARD_TOP_MIN, CARD_BOTTOM_MAX = 110, 1400

spec = importlib.util.spec_from_file_location("pieverse_build_slides", SRC)
bs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bs)                                # defines FRAMES etc.; its main() is guarded, not run

# 16:9 state cue (COVER-PLAN clock) -> SHORT seconds. Span 3 of SHORT-CUT-PLAN.snapped.json is final 146.14-154.35 and
# starts at short 11.44 (9.68 + 1.76); final = cover clock + 3.0 here (no pause inside 145.155-151.56), so
# short = cover + 3.0 - 146.14 + 11.44. _state-cues.md: s4 145.155, s5 146.74, s6 147.62, s7 148.70, s8 149.82.
CUES = {4: 145.155, 5: 146.74, 6: 147.62, 7: 148.70, 8: 149.82}
WINDOW_SHORT = (13.455, 19.65)
to_short = lambda t: round(t + 3.0 - 146.14 + 11.44, 3)

PORTRAIT = """
/* ---- PORTRAIT re-shoot (short, 1080x1920): same tokens/components, the halves stack ---- */
.frame.portrait{width:1080px;height:1920px;padding:110px 60px 520px;justify-content:center}
.portrait .card{padding:56px 60px 50px}
.portrait .card .divider{margin:26px 0 30px}
.portrait h1.sm{font-size:76px;line-height:1.07}
.portrait .halves{flex-direction:column;gap:28px}
.portrait .half{padding:30px 36px 26px}
.portrait .half .hd{margin-bottom:14px}
"""

CHECK = """([W,H,M,T,B])=>{
  const el=document.querySelector('.frame.cur'); const r=el.getBoundingClientRect(); const out=[];
  if(Math.round(r.width)!==W||Math.round(r.height)!==H) out.push('frame size '+r.width+'x'+r.height);
  const txt=el.innerText;
  if(/\\u2014/.test(txt)) out.push('em dash'); if(/\\u2013/.test(txt)) out.push('en dash'); if(/\\$/.test(txt)) out.push('dollar sign');
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); let n;
  while((n=walker.nextNode())){ if(!n.textContent.trim()) continue;
    if(getComputedStyle(n.parentElement).visibility==='hidden') continue;
    const rg=document.createRange(); rg.selectNodeContents(n);
    for(const b of rg.getClientRects()){ if(b.width<1) continue;
      if(b.left-r.left<M||r.right-b.right<M||b.top-r.top<M||r.bottom-b.bottom<M) out.push('text in edge margin: '+n.textContent.trim().slice(0,30));}}
  el.querySelectorAll('.ey,h1,.row,.v,.rows,.src,.st,.half,.big').forEach(q=>{const b=q.getBoundingClientRect();
    if(!b.width||getComputedStyle(q).visibility==='hidden') return;
    if(!q.classList.contains('rows')&&q.scrollWidth>q.clientWidth+1&&q.clientWidth>0) out.push('overflow-x: '+q.className+' '+q.innerText.slice(0,30));
    if(q.classList.contains('rows')&&q.scrollWidth>q.clientWidth+30) out.push('overflow-x rows');});
  const c=el.querySelector('.card'); const cb=c.getBoundingClientRect();
  c.querySelectorAll('.row,h1,.ey,.st,.src,.half,.big').forEach(q=>{const b=q.getBoundingClientRect(); if(!b.width) return;
    if(b.right>cb.right-24||b.bottom>cb.bottom-18||b.left<cb.left+24) out.push('outside card padding: '+q.className+' '+q.innerText.slice(0,30));});
  if(cb.top-r.top<T||cb.bottom-r.top>B) out.push('card box outside y '+T+'-'+B+': '+Math.round(cb.top-r.top)+'-'+Math.round(cb.bottom-r.top));
  const h1=el.querySelector('h1').getBoundingClientRect();
  out.push('INFO card box '+[cb.left-r.left,cb.top-r.top,cb.width,cb.height].map(Math.round).join(',')+' | h1 lines '+Math.round(h1.height/(76*1.07)));
  return out}"""


def main():
    css = (bs.REF / "container-canonical.css").read_text(encoding="utf-8")
    frames = {s: bs.d5(s) for s in (4, 5, 6, 7, 8)}
    body = "\n".join(f'<div class="frame portrait" id="D5-v-s{s}" data-kind="card">{inner}</div>' for s, inner in frames.items())
    html = (f'<!doctype html><html><head><meta charset="utf-8"><title>pieverse short: D5 native vertical</title>'
            f'<link href="{bs.FONTS}" rel="stylesheet">'
            f'<style>{css}</style><style>{bs.LOCAL}{bs.EXTRA_CSS}{PORTRAIT}</style></head><body>\n{body}\n</body></html>\n')
    src_html = HERE / "containers-vertical.html"
    src_html.write_text(html, encoding="utf-8")
    OUT.mkdir(parents=True, exist_ok=True)
    problems, written = [], []
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=DSF)
        pg.goto(src_html.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        for fam, w in [("Playfair Display", 900), ("DM Sans", 500), ("DM Sans", 600), ("DM Sans", 700),
                       ("JetBrains Mono", 500), ("JetBrains Mono", 700)]:
            ok = pg.evaluate("([f,w])=>document.fonts.check(`${w} 40px '${f}'`)&&[...document.fonts].some(x=>{if(x.family.replace(/\"/g,'')!==f||x.status!=='loaded')return false;const r=String(x.weight).split(' ').map(Number);return r.length>1?(w>=r[0]&&w<=r[1]):r[0]===w;})", [fam, w])
            if not ok:
                problems.append(f"FONT NOT LOADED: {fam} {w}")
        pg.evaluate("document.body.classList.add('solo')")
        shots = {}
        for s in frames:
            fid = f"D5-v-s{s}"
            pg.evaluate("(id)=>{document.querySelectorAll('.frame.cur').forEach(f=>f.classList.remove('cur'));"
                        "document.getElementById(id).classList.add('cur');window.scrollTo(0,0);}", fid)
            for msg in pg.evaluate(CHECK, [W, H, MARGIN, CARD_TOP_MIN, CARD_BOTTOM_MAX]):
                (print if msg.startswith("INFO") else problems.append)(f"  {fid}: {msg}" if msg.startswith("INFO") else f"{fid}: {msg}")
            raw = pg.screenshot(type="png", clip={"x": 0, "y": 0, "width": W, "height": H})
            shots[s] = Image.open(io.BytesIO(raw)).convert("RGB").resize((W, H), Image.LANCZOS)
        br.close()
    if problems:
        print("\n".join(["PROBLEMS (nothing written):"] + problems))
        sys.exit(1)
    for s, img in shots.items():
        path = OUT / f"D5-not-published-v-s{s}.png"
        img.save(path)
        written.append(path)
    main_png = OUT / "D5-not-published-v.png"
    shots[8].save(main_png)
    written.insert(0, main_png)
    cues = {"id": "D5", "window_short": list(WINDOW_SHORT), "main": main_png.name, "main_state": "s8",
            "note": "the 16:9 spotlight progression in SHORT seconds; a comp that steps through it shows each file from its "
                    "`from` to the next state's `from` (the last to the window end)",
            "states": [{"state": f"s{s}", "file": f"D5-not-published-v-s{s}.png", "from": max(WINDOW_SHORT[0], to_short(t)),
                        "cover_clock": t} for s, t in CUES.items()]}
    (OUT / "D5-not-published-v.states.json").write_text(json.dumps(cues, indent=1) + "\n", encoding="utf-8")
    print("\n".join(f"wrote {p}" for p in written))
    print("GATES PASS")


if __name__ == "__main__":
    main()
