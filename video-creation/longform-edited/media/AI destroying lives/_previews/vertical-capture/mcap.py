"""
mcap.py: MOBILE-VIEW receipt capture library for the 'AI destroying lives' vertical lane.

Portrait viewport 390 CSS px wide, device scale 3 (1170 px wide captures). A 9:16 frame is 390 x 693.33 CSS px, i.e.
1170 x 2080 device px, which is resampled once to 1080x1920 at the very end. Pages reflow to one column (no is_mobile
emulation, which would lay a viewport-less page out at 980 px wide).

Crop discipline built in (every round-1 miss on kaspa-vprogs was an edge):
  * a region starts and ends on a BLANK ROW RUN (uniform rows, measured on the pixels), so no line is ever sliced;
  * the bottom keeps >= 45 device px (>= 41 px at 1080 wide) of page margin, then the frame is padded with the page
    background colour to exactly 9:16;
  * wide elements are clamped to the column, anything still overflowing the right edge is hidden and REPORTED;
  * fixed overlays / cookie bars / ads are removed before the shot;
  * several regions of ONE page (headline + the read paragraph) are stacked with a thin rule between them, and the
    report says so.
"""
import json
import re
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
VW = 390
SCALE = 3
FRAME_H = 2080          # 693.33 css px at scale 3 -> 1080x1920 after the resample
MIN_BLANK = 45          # device px of uniform rows that count as a margin
UA = ("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/128.0.0.0 Mobile Safari/537.36")
CONSENT = ["Accept all", "Accept All", "I Accept", "I agree", "Agree", "Accept", "Got it", "Okay, got it", "Allow all",
           "Continue", "Yes, I agree", "AGREE", "Accept Cookies", "Reject all", "Reject All", "Close", "No thanks"]
KILL = ["#onetrust-banner-sdk", ".fc-consent-root", '[id*="sp_message_container"]', '[class*="cookie"]', '[class*="Cookie"]',
        '[class*="consent"]', '[aria-label*="cookie"]', '[id*="cookie"]', "iframe[src*='doubleclick']", "ins.adsbygoogle"]

JS_OVERFLOW = """
() => {
  const out = [];
  const clamp = 'img,video,iframe,svg,canvas,table,pre,figure,picture,embed,object';
  document.querySelectorAll(clamp).forEach(e => { e.style.maxWidth = '100%'; if (e.tagName==='IMG'||e.tagName==='VIDEO') e.style.height='auto'; });
  document.querySelectorAll('pre').forEach(e => { e.style.whiteSpace = 'pre-wrap'; e.style.wordBreak = 'break-word'; });
  const W = %(vw)d;
  const bad = [];
  document.querySelectorAll('body *').forEach(e => {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (r.right > W + 1.5 || r.left < -1.5) {
      // contained by a scroll/clip ancestor that itself fits?
      let p = e.parentElement, contained = false;
      while (p && p !== document.body) {
        const pc = getComputedStyle(p);
        if (pc.overflowX !== 'visible') { const pr = p.getBoundingClientRect(); if (pr.right <= W + 1.5 && pr.left >= -1.5) { contained = true; break; } }
        p = p.parentElement;
      }
      if (!contained) bad.push(e);
    }
  });
  // hide only the OUTERMOST offenders
  const set = new Set(bad);
  bad.forEach(e => { let p = e.parentElement; while (p) { if (set.has(p)) { set.delete(e); break; } p = p.parentElement; } });
  set.forEach(e => { out.push((e.tagName + '.' + (e.className||'').toString().slice(0,40) + ' w=' + Math.round(e.getBoundingClientRect().width)));
                     e.style.setProperty('display','none','important'); });
  return out;
}
""".replace("%(vw)d", str(VW))

JS_FIND = """
([text, nth]) => {
  const norm = s => s.replace(/\\s+/g,' ').trim().toLowerCase();
  const want = norm(text);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  // build a flat text map so a phrase may span inline tags
  const nodes = []; let full = '';
  while (w.nextNode()) {
    const n = w.currentNode; const pe = n.parentElement;
    if (!pe) continue; const cs = getComputedStyle(pe);
    if (cs.display==='none'||cs.visibility==='hidden') continue;
    if (['SCRIPT','STYLE','NOSCRIPT'].includes(pe.tagName)) continue;
    const t = n.nodeValue.replace(/\\s+/g,' ');
    nodes.push({n, start: full.length, len: t.length, raw: n.nodeValue}); full += t;
  }
  const lf = full.toLowerCase();
  let idx = -1, from = 0;
  for (let i=0;i<=nth;i++){ idx = lf.indexOf(want, from); if (idx<0) return null; from = idx+1; }
  const end = idx + want.length;
  const first = nodes.find(o => o.start + o.len > idx);
  const last = nodes.filter(o => o.start < end).pop();
  const rg = document.createRange();
  rg.setStart(first.n, Math.min(first.raw.length, Math.max(0, idx - first.start)));
  rg.setEnd(last.n, Math.min(last.raw.length, Math.max(1, end - last.start)));
  const rects = Array.from(rg.getClientRects()).filter(r => r.width>0 && r.height>0);
  if (!rects.length) return null;
  const sy = window.scrollY;
  return {top: Math.min(...rects.map(r=>r.top))+sy, bottom: Math.max(...rects.map(r=>r.bottom))+sy};
}
"""

JS_BLOCK = """
([text, nth]) => {
  // top/bottom of the BLOCK ancestor (paragraph / li / heading) holding the phrase
  const norm = s => s.replace(/\\s+/g,' ').trim().toLowerCase();
  const want = norm(text); let hit = null, k = 0;
  const all = document.body.querySelectorAll('p,li,h1,h2,h3,h4,blockquote,td,div,span,a,pre');
  const cands = [];
  all.forEach(e => { const t = norm(e.innerText||''); if (t.includes(want)) cands.push([e, t.length]); });
  cands.sort((a,b)=>a[1]-b[1]);
  if (cands.length <= nth) return null;
  const e = cands[nth][0]; const r = e.getBoundingClientRect(); const sy = window.scrollY;
  return {top: r.top+sy, bottom: r.bottom+sy};
}
"""


def prep(page, remove=(), hide_text=(), keep_top_fixed=True, settle=1.0, scroll=True, overflow=True):
    for label in CONSENT:
        try:
            b = page.get_by_role("button", name=label, exact=False).first
            if b.is_visible(timeout=400):
                b.click(timeout=1200)
                time.sleep(0.6)
                break
        except Exception:
            pass
    page.evaluate("(sels)=>{for(const s of sels)document.querySelectorAll(s).forEach(e=>{try{e.remove()}catch(x){}})}",
                  list(KILL) + list(remove))
    # fixed overlays that are not the top header
    page.evaluate("""(keep)=>{document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e);
        if(cs.position==='fixed'){const r=e.getBoundingClientRect(); if(!(keep && r.top<=2 && r.height<140)) e.style.setProperty('display','none','important');}})}""",
                  keep_top_fixed)
    if scroll:   # trigger lazy images, then back to the top
        h = page.evaluate("document.documentElement.scrollHeight")
        y = 0
        while y < min(h, 14000):
            page.evaluate(f"window.scrollTo(0,{y})")
            time.sleep(0.12)
            y += 700
        page.evaluate("window.scrollTo(0,0)")
    time.sleep(settle)
    for t in hide_text:
        page.evaluate("""(t)=>{const w=t.toLowerCase();document.querySelectorAll('body *').forEach(e=>{
            if(e.children.length===0 && (e.innerText||'').trim().toLowerCase()===w) e.style.setProperty('display','none','important')})}""", t)
    over = page.evaluate(JS_OVERFLOW) if overflow else []
    sw = page.evaluate("document.documentElement.scrollWidth")
    return {"hidden_overflow": over, "scrollWidth": sw}


def find(page, text, nth=0):
    r = page.evaluate(JS_FIND, [text, nth])
    if not r:
        raise RuntimeError(f"text not found: {text!r}")
    return r


def block(page, text, nth=0):
    r = page.evaluate(JS_BLOCK, [text, nth])
    if not r:
        raise RuntimeError(f"block not found: {text!r}")
    return r


def grab(page, y0, y1):
    """page region [y0,y1) css px -> RGB image at device scale. Scroll-and-tile with viewport screenshots (a full-page
    clip far down a long page times out), the top fixed header hidden for any tile that is not at the page top."""
    y0 = max(0.0, y0)
    vh = page.evaluate("window.innerHeight")
    page.add_style_tag(content="html{scroll-behavior:auto !important}")
    path = Path(sys.argv[0]).parent / "_grab.png"
    tiles, y = [], y0
    first = True
    while y < y1 - 0.01:
        page.evaluate(f"window.scrollTo(0,{y})")
        time.sleep(0.35)
        sy = page.evaluate("window.scrollY")
        if sy > 4:
            page.evaluate("""()=>{document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e);
                if(cs.position==='fixed'||cs.position==='sticky'){const r=e.getBoundingClientRect(); if(r.top<=2&&r.height<200) e.style.setProperty('visibility','hidden','important');}})}""")
            time.sleep(0.1)
        page.screenshot(path=str(path), timeout=120000, animations="disabled")
        im = Image.open(path).convert("RGB")
        off = int(round((y - sy) * SCALE))               # rows of this shot above y (scroll rounding)
        take = min(y1 - y, vh - (y - sy))
        h_px = int(round(take * SCALE))
        tiles.append(im.crop((0, off, im.width, min(im.height, off + h_px))))
        y += take
        first = False
    return tiles[0] if len(tiles) == 1 else stack_v(tiles)


def stack_v(tiles):
    H = sum(t.height for t in tiles)
    c = Image.new("RGB", (tiles[0].width, H))
    yy = 0
    for t in tiles:
        c.paste(t, (0, yy)); yy += t.height
    return c


BLANK_TOL = 12
BLANK_PX = 10


def blank_rows(im, tol=None, max_px=None):
    tol = BLANK_TOL if tol is None else tol
    max_px = BLANK_PX if max_px is None else max_px
    """A row is blank when (almost) every pixel equals the row's background: up to max_px stray device px are tolerated
    (a 1-3 px column border / scrollbar line must not turn the whole page into 'no margin')."""
    a = np.asarray(im).astype(np.int16)
    med = np.median(a, axis=1, keepdims=True)
    diff = (np.abs(a - med).max(axis=2) > tol).sum(axis=1)
    return diff <= max_px


def runs(mask):
    out, s = [], None
    for i, v in enumerate(mask):
        if v and s is None:
            s = i
        if not v and s is not None:
            out.append((s, i)); s = None
    if s is not None:
        out.append((s, len(mask)))
    return out


def bg_of(im, row):
    a = np.asarray(im)[row]
    return tuple(int(v) for v in np.median(a, axis=0))


def cut_region(page, y0, y1, *, top_edge="snap", pad=70):
    """Return an image of [y0,y1] css whose first/last rows sit in blank runs (margins), plus its bg colour.
    top_edge='page' keeps y0 as is (an establish shot starting at the page top)."""
    ext0 = max(0.0, y0 - pad)
    im = grab(page, ext0, y1 + pad)
    mask = blank_rows(im)
    rs = [r for r in runs(mask) if r[1] - r[0] >= MIN_BLANK]
    H = im.height
    t0 = int(round((y0 - ext0) * SCALE))
    b0 = int(round((y1 - ext0) * SCALE))
    # top: the blank run that ends at or before t0 (nearest), keep up to 54 px of it
    if top_edge == "page":
        top = 0
    else:
        cand = [r for r in rs if r[0] <= t0]
        if cand:
            r = max(cand, key=lambda r: min(r[1], t0))
            end = min(r[1], max(t0, r[0] + MIN_BLANK))
            top = max(r[0], end - 54)
        else:
            top = 0
            print(f"   WARN: no blank row above y0={y0:.0f}; the top edge is the page/region start")
    # bottom: the blank run that starts at or after b0-ish: first run whose end > b0 and start>=b0-? (content ends before)
    candb = [r for r in rs if r[1] >= b0 and r[0] >= top + 60]
    if candb:
        r = min(candb, key=lambda r: max(r[0], b0))
        start = max(r[0], b0 - 0)
        start = min(start, r[1] - MIN_BLANK)
        bottom = min(r[1], max(start, r[0]) + 60)
        if bottom - max(start, r[0]) < MIN_BLANK:
            bottom = min(H, max(start, r[0]) + MIN_BLANK)
    else:
        bottom = H
        print(f"   WARN: no blank row below y1={y1:.0f}; extended to the grab edge (check the bottom)")
    crop = im.crop((0, top, im.width, bottom))
    return crop, bg_of(im, min(max(0, (bottom + top) // 2 if False else bottom - 4), H - 1))


def compose(parts, bg, rule=True, gap=18):
    """Stack region images (device px) with a hairline rule; pad to FRAME_H with bg; return 1170x2080 image."""
    g = gap * SCALE
    heights = [p.height for p in parts]
    total = sum(heights) + (len(parts) - 1) * g
    shrink = 1.0
    if total > FRAME_H:
        shrink = FRAME_H / total
        if shrink < 0.93:
            raise RuntimeError(f"content is {total} device px tall, the frame holds {FRAME_H} (would shrink {shrink:.2f})")
    W0 = parts[0].width
    canvas = Image.new("RGB", (W0, max(FRAME_H, total)), bg)
    y = 0
    for i, p in enumerate(parts):
        canvas.paste(p, (0, y))
        y += p.height
        if i < len(parts) - 1:
            if rule:
                line = Image.new("RGB", (canvas.width - 2 * 24 * SCALE // 3, 3), (150, 150, 150))
                canvas.paste(line, (24 * SCALE // 3, y + g // 2))
            y += g
    if shrink < 1.0:
        w2 = int(round(W0 * shrink))
        small = canvas.crop((0, 0, W0, total)).resize((w2, FRAME_H), Image.LANCZOS)
        canvas = Image.new("RGB", (W0, FRAME_H), bg)
        canvas.paste(small, ((W0 - w2) // 2, 0))
    return canvas, total


def finish(canvas, out):
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.resize((1080, 1920), Image.LANCZOS).save(out, optimize=True)
    return out


def check_edges(img, label=""):
    """report: right-edge columns / bottom rows blank?"""
    a = np.asarray(img.convert("RGB")).astype(np.int16)
    right = a[:, -6:, :]
    right_ok = (right.max(axis=1) - right.min(axis=1)).max() <= 14 if True else True
    # bottom: last 40 rows uniform
    bot = a[-40:]
    bot_ok = (bot.max(axis=(0, 1)) - bot.min(axis=(0, 1))).max() <= 14
    return {"bottom_margin_blank": bool(bot_ok), "right_edge_quiet": bool(right_ok)}


JS_DUMP = r"""
([y0,y1]) => {
  const out=[]; const sy=window.scrollY;
  document.querySelectorAll('h1,h2,h3,h4,p,li,blockquote,figure,img,tr,pre,time,button,a.btn').forEach(e=>{
    const cs=getComputedStyle(e); if(cs.display==='none'||cs.visibility==='hidden') return;
    const r=e.getBoundingClientRect(); const t=r.top+sy; const b=r.bottom+sy;
    if(b<y0||t>y1||r.height<4) return;
    out.push(e.tagName+' '+Math.round(t)+'-'+Math.round(b)+' '+((e.innerText||e.alt||'').replace(/\s+/g,' ').slice(0,70)));
  });
  return out;
}
"""


def dump(page, y0, y1):
    for l in page.evaluate(JS_DUMP, [y0, y1]):
        print("     ", l)


def cut_fill(page, y0, y_min, y_max, *, top_edge="snap", pad=60):
    """Region from y0 whose bottom is the LAST blank run that starts between y_min and y_max (as much content as the
    frame holds, never slicing a line). Falls back to y_min's nearest run."""
    ext0 = max(0.0, y0 - pad)
    im = grab(page, ext0, y_max + pad)
    mask = blank_rows(im)
    rs = [r for r in runs(mask) if r[1] - r[0] >= MIN_BLANK]
    t0 = int(round((y0 - ext0) * SCALE))
    if top_edge == "page":
        top = 0
    else:
        cand = [r for r in rs if r[0] <= t0]
        if cand:
            r = max(cand, key=lambda r: min(r[1], t0))
            end = min(r[1], max(t0, r[0] + MIN_BLANK))
            top = max(r[0], end - 54)
        else:
            top = 0
            print(f"   WARN: no blank row above y0={y0:.0f}")
    lo = int(round((y_min - ext0) * SCALE)); hi = int(round((y_max - ext0) * SCALE))
    cb = [r for r in rs if lo <= r[0] <= hi and r[0] > top + 60]
    if cb:
        r = cb[-1]
        bottom = min(r[1], r[0] + 60)
        bottom = max(bottom, r[0] + MIN_BLANK)
    else:
        cb = [r for r in rs if r[0] > top + 60 and r[0] <= hi]
        if cb:
            r = cb[-1]; bottom = min(r[1], r[0] + 60); bottom = max(bottom, r[0] + MIN_BLANK)
            print(f"   NOTE: nearest blank run below the window used")
        else:
            bottom = min(im.height, hi)
            print(f"   WARN: no blank run in [{y_min:.0f},{y_max:.0f}]")
    crop = im.crop((0, top, im.width, bottom))
    return crop, bg_of(im, min(bottom - 4, im.height - 1))


def cut_hard(page, y0, y_end, *, margin=54, top_edge="snap", bg=None, pad=60, lead=30):
    """Region ending EXACTLY at y_end (a table row boundary: tables have no blank rows) + `margin` px of page bg."""
    ext0 = max(0.0, y0 - pad)
    im = grab(page, ext0, y_end)
    t0 = int(round((y0 - ext0) * SCALE))
    mask = blank_rows(im)
    rs = [r for r in runs(mask) if r[1] - r[0] >= MIN_BLANK]
    if top_edge == "page":
        top = 0
    elif top_edge == "exact":
        top = max(0, t0 - lead)
    else:
        cand = [r for r in rs if r[0] <= t0]
        top = max(max(cand, key=lambda r: min(r[1], t0))[0], t0 - 54) if cand else t0
    crop = im.crop((0, top, im.width, im.height))
    bgc = bg or tuple(int(v) for v in np.asarray(im)[2, 2])
    c = Image.new("RGB", (crop.width, crop.height + margin), bgc)
    c.paste(crop, (0, 0))
    return c, bgc


def anc_box(page, text, min_h=200):
    """top/bottom of the smallest ancestor (>= min_h tall) of the element holding `text`."""
    return page.evaluate("""([t,minh])=>{const w=t.toLowerCase(); let best=null;
        document.querySelectorAll('body *').forEach(e=>{ if(e.children.length===0 && (e.innerText||'').trim().toLowerCase().includes(w)) best=best||e });
        if(!best) return null; let c=best; const sy=scrollY;
        while(c && c!==document.body){ const r=c.getBoundingClientRect(); if(r.height>=minh) return {top:r.top+sy,bottom:r.bottom+sy,h:r.height,tag:c.tagName+'.'+(c.className||'').toString().slice(0,30)}; c=c.parentElement }
        return null}""", [text, min_h])
