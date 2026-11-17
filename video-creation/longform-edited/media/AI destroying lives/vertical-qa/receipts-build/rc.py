"""rc.py: mobile-view (390x844 @3x) capture helpers for the 'AI destroying lives' vertical receipts.
Window = 390 x 693.33 CSS px (exactly 9:16) -> 1170x2080 device px -> Lanczos to 1080x1920."""
import io, time, json
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

VW, VH, DSF = 390, 844, 3
WIN_H = 1920 * VW / 1080          # 693.33 css px
UA = ("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/128.0.0.0 Mobile Safari/537.36")
CONSENT = ["Accept all", "Accept All", "I Accept", "I agree", "Agree", "Accept", "Got it", "Okay, got it", "Allow all",
           "Yes, I agree", "AGREE", "Accept Cookies", "Reject all", "Reject All", "Continue to site", "Close"]
KILL = ["#onetrust-banner-sdk", ".fc-consent-root", '[id*="sp_message_container"]', '[class*="cookie"]', '[class*="consent"]',
        '[class*="Cookie"]', '[aria-label*="cookie"]', '[id*="cookie"]', '[class*="CookieBanner"]', '[class*="gdpr"]']

RECTS_JS = """() => {
  const out = [];
  const sy = window.scrollY, sx = window.scrollX;
  const vis = (el) => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05; };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    if (!n.textContent.trim() || !n.parentElement || !vis(n.parentElement)) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const c of r.getClientRects()) if (c.width > 1 && c.height > 1) out.push(['t', c.top + sy, c.bottom + sy, c.left + sx, c.right + sx, n.textContent.trim().slice(0, 30)]);
  }
  document.querySelectorAll('img,svg,video,canvas,iframe,picture').forEach(e => {
    if (!vis(e)) return; const c = e.getBoundingClientRect();
    if (c.width > 4 && c.height > 4) out.push(['m', c.top + sy, c.bottom + sy, c.left + sx, c.right + sx, e.tagName]);
  });
  return out;
}"""


def open_page(p, url, wait=5000, extra_css="", hide=(), scroll_through=True, recorder=None, viewport=None, dsf=None, do_unfix=True, **ctx_kw):
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport=viewport or {"width": VW, "height": VH}, device_scale_factor=dsf or DSF, is_mobile=True, has_touch=True,
                        user_agent=UA, **ctx_kw)
    pg = ctx.new_page()
    pg.goto(url, wait_until="domcontentloaded", timeout=90000)
    time.sleep(wait / 1000)
    for label in CONSENT:
        try:
            bt = pg.get_by_role("button", name=label, exact=False).first
            if bt.is_visible(timeout=400):
                bt.click(timeout=1500); time.sleep(0.6); break
        except Exception:
            pass
    pg.evaluate("(s) => s.forEach(q => document.querySelectorAll(q).forEach(e => { try { e.remove() } catch (x) {} }))", KILL + list(hide))
    if do_unfix: unfix(pg)
    if extra_css:
        pg.add_style_tag(content=extra_css)
    if scroll_through:  # trigger lazy images, then back to the top
        h = pg.evaluate("document.documentElement.scrollHeight")
        y = 0
        while y < h:
            pg.evaluate(f"window.scrollTo(0,{y})"); time.sleep(0.15); y += 600
        pg.evaluate("window.scrollTo(0,0)"); time.sleep(1.0)
    return b, ctx, pg


def unfix(pg):
    """remove position:fixed overlays (feedback tabs, cookie bars, chat), de-stick sticky headers."""
    pg.evaluate("""() => { document.querySelectorAll('body *').forEach(e => { const p = getComputedStyle(e).position;
        if (p === 'fixed') { try { e.remove() } catch (x) {} } else if (p === 'sticky') e.style.position = 'static'; }); }""")


def hide_card(pg, text):
    """display:none the bordered, rounded card that contains `text` (walks up from the text node)."""
    return pg.evaluate("""(t) => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { if (n.textContent.includes(t)) { let e = n.parentElement;
        for (let i = 0; i < 8 && e; i++, e = e.parentElement) { const cs = getComputedStyle(e);
          if (parseFloat(cs.borderTopWidth) >= 1 && parseFloat(cs.borderTopLeftRadius) >= 10) { e.style.display = 'none'; return e.className.toString().slice(0,50); } } } } return null; }""", text)


def y_of(pg, text, nth=0):
    """document-y (css px) of the top of the nth text node containing `text`."""
    return pg.evaluate("""([t, k]) => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, i = 0;
      while ((n = w.nextNode())) { if (n.textContent.includes(t)) { if (i++ === k) { const r = document.createRange(); r.selectNodeContents(n);
        const cl = [...r.getClientRects()].filter(c => c.width > 1 && c.height > 1); if (!cl.length) { i--; continue; }
        const c = cl[0], e = n.parentElement.getBoundingClientRect(); if (getComputedStyle(n.parentElement).visibility === 'hidden') { i--; continue; } return [c.top + scrollY, cl[cl.length-1].bottom + scrollY, c.left]; } } } return null; }""", [text, nth])


def overflow_report(pg, y0=None, y1=None):
    rects = pg.evaluate(RECTS_JS)
    return [r for r in rects if (r[4] > VW + 0.5 or r[3] < -0.5) and (y0 is None or (r[2] > y0 and r[1] < y1))]


def choose_window(pg, target, bottom_margin=24, top_margin=6, search=300, min_frac=0.80, max_end=None):
    """-> (y0, h): closest y0 to `target` where no text/media rect straddles or hugs the top edge, with the LARGEST h <= WIN_H
    (>= min_frac of it) whose bottom edge has >= bottom_margin css px of blank rows above it. The frame below h is padded with
    the page background (a capture ends on blank page, never on a sliced line)."""
    rects = pg.evaluate(RECTS_JS)
    cands = sorted(range(-search, search + 1, 2), key=lambda d: abs(d))
    for bm in (bottom_margin, 16, 12):
        for d in cands:
            y0 = max(0, target + d)
            if any(t < y0 + top_margin and bt > y0 - 1 for _, t, bt, l, r, _s in rects): continue
            h = WIN_H if max_end is None else min(WIN_H, max_end - y0)
            while h >= WIN_H * min_frac:
                ye = y0 + h
                if not any(t < ye and bt > ye - bm for _, t, bt, l, r, _s in rects):
                    print(f"   window y0={y0:.1f} h={h:.1f}/{WIN_H:.1f} bottom blank >= {bm} css px ({bm*1080/390:.0f} output px) + {WIN_H-h:.0f} css px pad")
                    return y0, h
                h -= 1
    return None


def shoot_window(pg, y0, h, out, bg=None):
    png = pg.screenshot(clip={"x": 0, "y": y0, "width": VW, "height": h}, full_page=True, timeout=120000)
    im = Image.open(io.BytesIO(png)).convert("RGB")
    im = im.resize((1080, round(im.height * 1080 / im.width)), Image.LANCZOS)
    if bg is None:
        bg = im.getpixel((3, im.height - 3))
    if im.height < 1920:
        c = Image.new("RGB", (1080, 1920), bg); c.paste(im, (0, 0)); im = c
    else:
        im = im.crop((0, 0, 1080, 1920))
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    im.save(out)
    return im
