"""Mobile-view helpers for the future-of-software-engineers VERTICAL receipt captures (Playwright Python).
Viewport 390x844, device scale 3, mobile UA. A frame = a 390 x 693.33 css window (1170x2080 px) resized to exactly 1080x1920.
capture.py (skills/receipt-capture) hard-codes a desktop UA + scale 2, so it cannot do mobile: this is the project-local mobile twin."""
import sys, time, json, datetime, re, io
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
PROJ = HERE.parents[1]
OUT = PROJ / "assets" / "vertical" / "receipts"
UA_M = ("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/17.5 Mobile/15E148 Safari/604.1")
VW, VH, DSF = 390, 844, 3
FRAME_H = 1920 * VW / 1080          # 693.333 css px: a 390 css px wide window that is exactly 9:16
CLIP_H = 694                        # integer css rows to clip; the last 2 px rows are dropped when cropping to 1170x2080
CONSENT = ["Accept all", "Accept All", "I Accept", "I agree", "Agree", "Accept", "Got it", "Allow all", "Accept Cookies", "Reject all", "Reject All", "OK"]
KILL = ["#onetrust-banner-sdk", ".fc-consent-root", '[id*="sp_message_container"]', '[class*="cookie-banner"]', '[class*="cookieBanner"]',
        '[class*="consent-banner"]', '[aria-label*="cookie" i]', '#CybotCookiebotDialog', '.osano-cm-window', '[id*="cookie-notice"]']

def now():
    return datetime.datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")

def norm(s): return re.sub(r"\s+", " ", s)

def open_mobile(p, url, wait=6, mobile=True, ua=UA_M, dsf=DSF, wait_until="domcontentloaded", consent=True):
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=dsf, is_mobile=mobile, has_touch=mobile,
                        user_agent=ua, locale="en-US")
    pg = ctx.new_page()
    resp = pg.goto(url, wait_until=wait_until, timeout=120000)
    print("status", resp.status if resp else None, "|", pg.url, "| title:", pg.title())
    time.sleep(wait)
    if consent:
        for label in CONSENT:
            try:
                bt = pg.get_by_role("button", name=label, exact=True).first
                if bt.is_visible(timeout=400):
                    bt.click(timeout=1500); print("consent clicked:", label); time.sleep(1); break
            except Exception:
                pass
        pg.evaluate("(sels)=>{for(const s of sels)document.querySelectorAll(s).forEach(e=>{try{e.remove()}catch(x){}})}", KILL)
    return b, ctx, pg

RECT_JS = """([t,nth])=>{
  const els=[...document.querySelectorAll('body *')].filter(e=>{
    if(!e.innerText||!e.innerText.includes(t))return false;
    return ![...e.children].some(c=>c.innerText&&c.innerText.includes(t));});
  const e=els[nth]; if(!e)return null;
  const r=e.getBoundingClientRect();
  return {x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,tag:e.tagName,text:e.innerText.slice(0,300)};}"""
def rect_of_text(pg, text, nth=0): return pg.evaluate(RECT_JS, [text, nth])

LINES_JS = r"""()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){ if(!n.textContent.trim())continue; const pe=n.parentElement; if(!pe||getComputedStyle(pe).visibility==='hidden'||getComputedStyle(pe).display==='none')continue;
    const r=document.createRange(); r.selectNodeContents(n);
    for(const q of r.getClientRects()){ if(q.width<2||q.height<2)continue; out.push([q.top+scrollY,q.bottom+scrollY,q.left,q.right]); } }
  return out;}"""

def shoot(pg, top, name, outdir=None, settle=1.2, final=True):
    """Scroll so page-y `top` is the viewport top, clip the top 390x694 css of the viewport, crop to 1170x2080, resize to 1080x1920."""
    outdir = Path(outdir or OUT); outdir.mkdir(parents=True, exist_ok=True)
    pg.evaluate("(y)=>window.scrollTo(0,y)", top); time.sleep(settle)
    sy = pg.evaluate("window.scrollY")
    png = pg.screenshot(clip={"x": 0, "y": 0, "width": VW, "height": CLIP_H})
    im = Image.open(io.BytesIO(png)).convert("RGB")
    W = im.width; Ht = round(W * 16 / 9)
    im = im.crop((0, 0, W, Ht))
    if final:
        im = im.resize((1080, 1920), Image.LANCZOS)
    path = outdir / name
    im.save(path)
    return sy, path

def cuts(pg, T, band=0, h=FRAME_H):
    """Text lines sliced by the frame top/bottom edge (or by a sticky band of `band` css px at the top)."""
    L = pg.evaluate(LINES_JS)
    return [l for l in L if (l[0] < T < l[1] - 1) or (l[0] < T + h < l[1] - 1) or
            (band and l[1] > T and l[0] < T + band and not (l[0] >= T and l[1] <= T + band))]

def save_geo(key, data):
    g = HERE / "vertical-receipts-geometry.json"
    d = json.loads(g.read_text(encoding="utf-8")) if g.exists() else {}
    d[key] = data
    g.write_text(json.dumps(d, indent=1, ensure_ascii=False), encoding="utf-8")

def window_candidates(pg, lo, hi, band=0, min_blank=14, h=FRAME_H, lines=None):
    """All integer window tops T in [lo,hi] where no text line is sliced by the frame top/bottom (or the sticky band) and the
    frame ENDS on a blank row: the nearest text line bottom above T+h is >= min_blank css px away (and the next line starts >= min_blank below).
    Returns [(T, bottom_blank_css, top_gap_css)]."""
    L = lines or pg.evaluate(LINES_JS)
    out = []
    for T in range(int(lo), int(hi) + 1):
        B = T + h
        if any((l[0] < T < l[1] - 1) or (l[0] < B < l[1] - 1) or
               (band and l[1] > T and l[0] < T + band and not (l[0] >= T and l[1] <= T + band)) for l in L):
            continue
        above = [l[1] for l in L if l[1] <= B]
        below = [l[0] for l in L if l[0] >= B]
        bb = B - (max(above) if above else T)
        nb = (min(below) - B) if below else 999
        if bb >= min_blank and nb >= 0:
            first = [l[0] for l in L if l[0] >= T + band]
            out.append((T, round(bb, 1), round((min(first) - T - band) if first else 0, 1)))
    return out

def margin_check(path, rows=30, side=6, bg_tol=10):
    """Pixel QA on a finished 1080x1920 file: the last `rows` rows are one flat page-background colour, the right/left `side` px columns
    carry no ink that runs the whole height (a side border), and the size is exact."""
    im = Image.open(path).convert("RGB"); W, H = im.size
    px = im.load()
    bot = [px[x, y] for y in range(H - rows, H) for x in range(0, W, 3)]
    ref = px[W // 2, H - 1]
    flat = all(max(abs(a - b) for a, b in zip(c, ref)) <= bg_tol for c in bot)
    # last non-background row (ink) from the bottom, to report the true bottom margin in px
    last = None
    for y in range(H - 1, -1, -1):
        if any(max(abs(a - b) for a, b in zip(px[x, y], ref)) > bg_tol for x in range(0, W, 2)):
            last = y; break
    return {"size": im.size, "bottom_ref_rgb": ref, "bottom_flat": flat, "bottom_margin_px": (H - 1 - last) if last is not None else None}

def shoot_page(pg, top, name, outdir=None, settle=1.2, final=True):
    """Page-coordinate clip (full_page): the 390 x 694 css region at page-y `top`, so a fixed header never overlays text; crop 1170x2080, resize 1080x1920."""
    outdir = Path(outdir or OUT); outdir.mkdir(parents=True, exist_ok=True)
    time.sleep(settle)
    png = pg.screenshot(full_page=True, clip={"x": 0, "y": top, "width": VW, "height": CLIP_H})
    im = Image.open(io.BytesIO(png)).convert("RGB")
    W = im.width; Ht = round(W * 16 / 9)
    im = im.crop((0, 0, W, Ht))
    if final:
        im = im.resize((1080, 1920), Image.LANCZOS)
    path = outdir / name
    im.save(path)
    return path
