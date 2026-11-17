"""Shared helpers for the future-of-software-engineers receipt captures (Playwright Python, 1920 wide, DSF 2)."""
import sys, time, json, datetime
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
PROJ = Path(__file__).resolve().parents[2]
OUT = PROJ / "assets" / "receipts"
GEO = Path(__file__).resolve().parent / "receipts-geometry.json"
CONSENT = ["Accept all", "Accept All", "I Accept", "I agree", "Agree", "Accept", "Got it", "Allow all", "Accept Cookies", "Reject all", "Reject All", "OK"]
KILL = ["#onetrust-banner-sdk", ".fc-consent-root", '[id*="sp_message_container"]', '[class*="cookie-banner"]', '[class*="cookieBanner"]',
        '[class*="consent-banner"]', '[aria-label*="cookie" i]', '#CybotCookiebotDialog', '.osano-cm-window', '[id*="cookie-notice"]']

def now():
    return datetime.datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")

def open_page(p, url, wait=6, w=1920, h=1080, dsf=2):
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=dsf, user_agent=UA, locale="en-US")
    pg = ctx.new_page()
    resp = pg.goto(url, wait_until="domcontentloaded", timeout=90000)
    print("status", resp.status if resp else None, "|", pg.url)
    time.sleep(wait)
    for label in CONSENT:
        try:
            bt = pg.get_by_role("button", name=label, exact=True).first
            if bt.is_visible(timeout=400):
                bt.click(timeout=1500); print("consent clicked:", label); time.sleep(1); break
        except Exception:
            pass
    pg.evaluate("(sels)=>{for(const s of sels)document.querySelectorAll(s).forEach(e=>{try{e.remove()}catch(x){}})}", KILL)
    return b, pg

def rect_of_text(pg, text, nth=0):
    """Page-coordinate rect (CSS px) of the smallest element whose own text contains `text` (first match)."""
    return pg.evaluate("""([t,nth])=>{
      const els=[...document.querySelectorAll('body *')].filter(e=>{
        if(!e.innerText||!e.innerText.includes(t))return false;
        return ![...e.children].some(c=>c.innerText&&c.innerText.includes(t));});
      const e=els[nth]; if(!e)return null;
      const r=e.getBoundingClientRect();
      return {x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height,tag:e.tagName,text:e.innerText.slice(0,300)};}""", [text, nth])

def shoot_at(pg, top_y, out_path, h=1080):
    """Scroll the page so page-y `top_y` is the top of the viewport, then shoot the viewport (real browser look)."""
    pg.evaluate("(y)=>window.scrollTo(0,y)", top_y)
    time.sleep(1.2)
    sy = pg.evaluate("window.scrollY")
    out_path = Path(out_path); out_path.parent.mkdir(parents=True, exist_ok=True)
    pg.screenshot(path=str(out_path), full_page=False)
    return sy

def save_geo(key, data):
    g = json.loads(GEO.read_text(encoding="utf-8")) if GEO.exists() else {}
    g[key] = data
    GEO.write_text(json.dumps(g, indent=1, ensure_ascii=False), encoding="utf-8")

LINES_JS = r"""()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){ if(!n.textContent.trim())continue; const pe=n.parentElement; if(!pe||getComputedStyle(pe).visibility==='hidden'||getComputedStyle(pe).display==='none')continue;
    const r=document.createRange(); r.selectNodeContents(n);
    for(const q of r.getClientRects()){ if(q.width<2||q.height<2)continue; out.push([q.top+scrollY,q.bottom+scrollY]); } }
  return out;}"""

def nice_top(pg, t0, h=1080, search=150, band=0, min_top=0):
    """Scroll top closest to t0 where no text line straddles the frame's top or bottom edge (and none is cut by a sticky band of `band` px)."""
    lines = pg.evaluate(LINES_JS)
    for d in sorted(range(-search, search + 1), key=abs):
        T = int(t0 + d)
        if T < min_top: continue
        bad = [l for l in lines if (l[0] < T < l[1] - 1) or (l[0] < T + h < l[1] - 1) or
               (band and l[1] > T and l[0] < T + band and not (l[0] >= T and l[1] <= T + band))]
        if not bad:
            return T
    return int(t0)
