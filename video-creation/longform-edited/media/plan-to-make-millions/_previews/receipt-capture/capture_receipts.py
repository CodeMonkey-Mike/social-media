"""plan-to-make-millions: the receipt captures (project-local driver on Playwright Python; shoots only,
the receipt-capturer opens and checks every file after). Usage: python capture_receipts.py <ID> [<ID> ...]"""
import datetime
import os
import json
import sys
import time

from kit import *

TS = {}  # id -> capture timestamp (written to captured.json)

DECLUTTER_JS = r"""() => {
  const re = /(^|[\s_-])(ad|ads|adv|advert|advertisement|advertising|sponsored|sponsor|taboola|outbrain|mgid|dfp|gpt|adslot|ad-slot)([\s_-]|$)/i;
  document.querySelectorAll('[id],[class]').forEach(el => {
    const s = (el.id || '') + ' ' + (typeof el.className === 'string' ? el.className : '');
    if (re.test(s)) el.style.display = 'none';
  });
  document.querySelectorAll('iframe, ins, [data-google-query-id]').forEach(el => el.style.display = 'none');
}"""

HIDE_AFTER_JS = r"""(sel) => {
  const el = document.querySelector(sel); if (!el) return 0;
  let n = el, cnt = 0;
  while (n && n !== document.body) {
    let s = n.nextElementSibling;
    while (s) { s.style.visibility = 'hidden'; s = s.nextElementSibling; cnt++; }
    n = n.parentElement;
  }
  return cnt;
}"""

HIDE_SIBLINGS_AFTER_JS = r"""(sel) => {
  const el = document.querySelector(sel); if (!el) return 0;
  let s = el.nextElementSibling, cnt = 0;
  while (s) { s.style.visibility = 'hidden'; s = s.nextElementSibling; cnt++; }
  return cnt;
}"""

HIDE_BY_TEXT_JS = r"""([text, maxH]) => {
  // hide the largest ancestor (height <= maxH) of the first element whose own text equals `text`
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, hit = 0;
  while ((n = w.nextNode())) {
    if (n.nodeValue.trim() !== text) continue;
    let el = n.parentElement, best = el;
    while (el && el !== document.body && el.getBoundingClientRect().height <= maxH) { best = el; el = el.parentElement; }
    best.style.display = 'none'; hit++;
  }
  return hit; }"""


def stamp(rid):
    TS[rid] = datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def prep(br, url, wait=6.0, consent=True, h=1080):
    page = new_page(br, h=h)
    goto(page, url, wait)
    if consent:
        click_buttons(page, CONSENT_BUTTONS)
    kill(page)
    return page


def declutter(page):
    page.evaluate(DECLUTTER_JS)


def nuke(page, sels):
    """display:none (layout reflows, like the element was never there)."""
    page.evaluate("(sels) => { for (const s of sels) document.querySelectorAll(s).forEach(e => { e.style.display = 'none'; }); }", list(sels))


def scroll_to(page, y):
    page.evaluate("(y) => window.scrollTo(0, y)", y)
    time.sleep(0.8)


def hide_after(page, sel):
    return page.evaluate(HIDE_AFTER_JS, sel)


def out(name):
    return RECEIPTS / name


# ------------------------------------------------------------------ jobs
def R_HL1(br):
    page = prep(br, "https://techcrunch.com/2026/11/01/binance-resumes-withdrawals-following-6-3-billion-breach/")
    declutter(page)
    time.sleep(0.5)
    scroll_to(page, 0)
    stamp("R-HL1")
    shot(page, out("R-HL1-techcrunch-headline.png"))


def R_HL2(br):
    page = prep(br, "https://aljazeera.com/economy/2026/10/30/oil-flows-are-up-as-iran-war-turmoil-eases-why-do-prices-keep-rising")
    declutter(page)
    scroll_to(page, 0)
    stamp("R-HL2")
    shot(page, out("R-HL2-aljazeera-headline.png"))


def R_HL3(br):
    page = prep(br, "https://www.foxbusiness.com/markets/nvidia-shares-plunge-more-7-premarket-trading-ceo-uncertainty-rattles-ai-stocks")
    declutter(page)
    nuke(page, ["#jpmasthead", '[id*="masthead"]'])
    page.evaluate(HIDE_BY_TEXT_JS, ["Recommended Videos", 400])
    hide_after(page, "h1")
    ys = [r["y"] for r in find_text(page, r"^Personal Finance", limit=3) if r["y"] > 0]
    scroll_to(page, max(0, (ys[0] - 22) if ys else 0))   # nav bar to the top of the frame
    stamp("R-HL3")
    shot(page, out("R-HL3-foxbusiness-headline.png"))


def R_HL4(br):
    page = prep(br, "https://www.fool.com/coverage/stock-market-today/2026/11/20/stock-market-today-nov-20-stocks-plunge-as-ai-trade-unwinds/")
    # the Black Friday sale modal
    for sel in ['button[aria-label="Close"]', '[aria-label="close"]', 'button:has-text("×")', '[class*="close"]']:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=500):
                el.click(timeout=1500)
                time.sleep(0.8)
                break
        except Exception:
            pass
    declutter(page)
    # the live quote ticker (shows a later day's gains) and the sale promos
    page.evaluate("""() => {
      const rows = Array.from(document.querySelectorAll('div,section,ul,nav')).filter(e => {
        const r = e.getBoundingClientRect(); const t = e.innerText || '';
        return r.top > 100 && r.top < 260 && r.height < 130 && r.width > 1000 && /S&P 500/.test(t) && /NASD/.test(t); });
      rows.forEach(e => e.style.display = 'none');
    }""")
    page.evaluate(HIDE_BY_TEXT_JS, ["70% off* Black Friday", 80])
    page.evaluate(HIDE_BY_TEXT_JS, ["Black Friday Sale", 400])
    hide_after(page, "h1")
    scroll_to(page, 0)
    stamp("R-HL4")
    shot(page, out("R-HL4-fool-headline.png"))


def C11(br):
    page = prep(br, "https://www.foxbusiness.com/markets/stocks-nov-5-2026")
    declutter(page)
    nuke(page, ["#jpmasthead", '[id*="masthead"]'])
    page.evaluate(HIDE_BY_TEXT_JS, ["Recommended Videos", 400])
    hide_after(page, "h1")
    ys = [r["y"] for r in find_text(page, r"^Personal Finance", limit=3) if r["y"] > 0]
    scroll_to(page, max(0, (ys[0] - 22) if ys else 0))
    stamp("C11")
    shot(page, out("C11-foxbusiness-headline.png"))


HIDE_FIXED_TEXT_JS = r"""(pat) => {
  const re = new RegExp(pat, 'i'); let n = 0;
  document.querySelectorAll('div,section,aside,header,footer,nav').forEach(e => {
    const st = getComputedStyle(e);
    if ((st.position === 'fixed' || st.position === 'sticky') && re.test(e.innerText || '')) { e.style.display = 'none'; n++; }
  });
  return n; }"""

RANGE_RECT_JS = r"""([sel, startText, endText]) => {
  const root = document.querySelector(sel) || document.body;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) {
    const i = n.nodeValue.indexOf(startText); if (i < 0) continue;
    const j = n.nodeValue.indexOf(endText, i); const r = document.createRange();
    r.setStart(n, i); r.setEnd(n, j >= 0 ? j + endText.length : n.nodeValue.length);
    const b = r.getBoundingClientRect();
    return {top: b.top + scrollY, left: b.left + scrollX, w: b.width, h: b.height};
  }
  return null; }"""


HIDE_BOTTOM_FIXED_JS = r"""() => {
  let n = 0; const vh = innerHeight;
  document.querySelectorAll('body *').forEach(e => {
    const st = getComputedStyle(e);
    if (st.position !== 'fixed') return;
    const r = e.getBoundingClientRect();
    if (r.height < 140 && r.top > vh - 200 && r.bottom > vh - 150) { e.style.display = 'none'; n++; }
  });
  return n; }"""


HIDE_FLOATERS_JS = r"""() => {
  let n = 0; const vh = innerHeight;
  document.querySelectorAll('body *').forEach(e => {
    const st = getComputedStyle(e);
    if (st.position !== 'fixed') return;
    const r = e.getBoundingClientRect();
    if (r.top > vh * 0.35 && r.width < 760 && r.height < 520 && r.width > 0) { e.style.display = 'none'; n++; }
  });
  return n; }"""


HIDE_CONTAINER_OF_TEXT_JS = r"""([pat, maxw, maxh]) => {
  const re = new RegExp(pat, 'i'); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, hit = 0;
  while ((n = w.nextNode())) {
    if (!re.test(n.nodeValue)) continue;
    let el = n.parentElement, best = el;
    while (el && el !== document.body) {
      const r = el.getBoundingClientRect();
      if (r.width <= maxw && r.height <= maxh) best = el; else break;
      el = el.parentElement;
    }
    best.style.display = 'none'; hit++;
  }
  return hit; }"""


def frame_on(page, y, frac=0.4):
    """scroll so page-y sits at `frac` of the viewport height"""
    vh = page.evaluate("window.innerHeight")
    scroll_to(page, max(0, y - vh * frac))


def first_y(page, pat, minw=1):
    rs = [r for r in find_text(page, pat, limit=8) if r["w"] >= minw and r["h"] > 0]
    return rs[0]["y"] if rs else None


def R_ALJ(br):
    page = prep(br, "https://aljazeera.com/news/2026/10/30/binance-says-6-3bn-stolen-in-biggest-crypto-heist-in-history-what-we-know")
    declutter(page)
    scroll_to(page, 0)
    stamp("R-ALJ")
    shot(page, out("R-ALJ-headline.png"))
    y1 = first_y(page, r"biggest crypto heist on record")
    y2 = first_y(page, r"about 20 minutes")
    print("   ALJ y heist", y1, "y 20min", y2)
    # one frame holding both read sentences when they fit; else centre on the heist sentence
    if y1 and y2 and (y2 - y1) < 760:
        scroll_to(page, y1 - 240)
    else:
        frame_on(page, y1, 0.4)
    shot(page, out("R-ALJ-sentence.png"))


def R_BLOCK(br):
    page = prep(br, "https://theblock.co/news/markets/2026-10-29-bitcoin-slides-below-77000-binance-hack-432183")
    declutter(page)
    page.evaluate(HIDE_FIXED_TEXT_JS, "We and our partners")
    page.evaluate(HIDE_CONTAINER_OF_TEXT_JS, ["Looking\sfor\sinstitutional-grade", 2200, 90])
    page.evaluate("""() => { document.querySelectorAll('div,section,nav,ul').forEach(e => {
        const r = e.getBoundingClientRect(); const t = e.innerText || '';
        if (r.height < 70 && r.width > 1000 && /BTCUSD/.test(t) && /ETHUSD/.test(t)) e.style.display = 'none'; }); }""")
    page.evaluate(HIDE_CONTAINER_OF_TEXT_JS, ["^SPONSORED$", 420, 330])
    page.evaluate(HIDE_BY_TEXT_JS, ["Looking for institutional-grade crypto trading? Discover LMAX Digital, the regulated exchange from LMAX Group \u2192", 80])
    page.evaluate(HIDE_BOTTOM_FIXED_JS)
    scroll_to(page, 0)
    stamp("R-BLOCK")
    shot(page, out("R-BLOCK-headline.png"))
    y = first_y(page, r"Crypto liquidations totaled")
    print("   BLOCK y liq", y)
    frame_on(page, y, 0.36)
    page.evaluate(HIDE_BOTTOM_FIXED_JS)
    page.evaluate(HIDE_FLOATERS_JS)
    shot(page, out("R-BLOCK-liquidations.png"))


def C9(br):
    page = prep(br, "https://www.aljazeera.com/economy/2026/11/19/anthropic-starts-trading-in-the-us-after-blockbuster-ipo")
    declutter(page)
    scroll_to(page, 0)
    stamp("C9")
    shot(page, out("C9-aljazeera-anthropic-ipo.png"))


def C12(br):
    page = prep(br, "https://www.coindesk.com/markets/2026/11/13/bitcoin-slides-to-usd68k-as-nvidia-turmoil-anthropic-ipo-fuel-broader-market-sell-off")
    page.evaluate(HIDE_FIXED_TEXT_JS, "articles remaining|free account")
    declutter(page)
    page.evaluate("""() => { document.querySelectorAll('div,aside,section').forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.left < 420 && r.width > 250 && r.width < 340 && r.height > 120 && r.height < 200 && r.top > 400) e.style.display = 'none'; }); }""")
    # the sticky live-price ticker row (it shows a later day's prices)
    page.evaluate("""() => { document.querySelectorAll('div,section,nav,ul').forEach(e => {
        const r = e.getBoundingClientRect(); const t = e.innerText || '';
        if (r.top >= 60 && r.top < 110 && r.height < 90 && r.width > 1000 && /CD20/.test(t) && /BTC/.test(t)) e.style.display = 'none'; }); }""")
    time.sleep(0.5)
    ys = [r["y"] for r in find_text(page, r"^Data & Indices", limit=3) if r["y"] > 0]
    top = max(0, (ys[0] - 22)) if ys else 0
    scroll_to(page, top)
    page.evaluate(HIDE_FLOATERS_JS)
    stamp("C12")
    shot(page, out("C12-headline.png"))
    y = first_y(page, r"Recent\smarket\sturmoil")
    print("   C12 y causes", y)
    frame_on(page, y, 0.3)
    page.evaluate(HIDE_FLOATERS_JS)
    shot(page, out("C12-causes.png"))


def C10(br):
    page = prep(br, "https://www.bls.gov/news.release/archives/cpi_11102026.htm", wait=5)
    nuke(page, ['[class*="feedback"]', '[id*="feedback"]', '[class*="survey"]', '[class*="Qualtrics"]', '[id*="qualtrics"]'])
    page.evaluate(HIDE_BY_TEXT_JS, ["Help improve this site", 600])
    scroll_to(page, 0)
    stamp("C10")
    shot(page, out("C10-header.png"))
    page.evaluate("document.body.style.zoom = '1.6'")
    time.sleep(1.0)
    r = page.evaluate(RANGE_RECT_JS, ["body", "The index for energy increased 0.7 percent in October after rising", "natural gas index decreased 0.8 percent in October."])
    print("   C10 energy paragraph rect (zoomed)", r)
    # zoom shifts page coords; the rect is read after zoom so it is already in scrolled-page px
    scroll_to(page, r["top"] - 200)
    shot(page, out("C10-gasoline.png"))


def C8(br):
    page = prep(br, "https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvidiaannouncesceotransiti.htm", wait=4)
    page.evaluate("document.body.style.zoom = '1.4'")
    time.sleep(1.0)
    scroll_to(page, 0)
    stamp("C8")
    shot(page, out("C8-nvidia-ceo-transition-release.png"))


def C7(br):
    page = prep(br, "https://www.binance.com/square/post/382966351297065", wait=8)
    scroll_to(page, 0)
    time.sleep(2.5)
    for _ in range(2):   # the join / sign-up card pops after load + scroll
        print("   C7 popup hidden:", page.evaluate(HIDE_CONTAINER_OF_TEXT_JS, ["Join\sglobal\scrypto\susers", 520, 620]))
        time.sleep(1.0)
    # fallback: the card's own close X (bottom-right card, X at about 1860, 616 css px)
    try:
        if page.evaluate("!!Array.from(document.querySelectorAll('*')).find(e => /Join\sglobal\scrypto/i.test(e.innerText||'') && e.getBoundingClientRect().height < 700 && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().left > 1500)"):
            page.mouse.click(1860, 616)
            time.sleep(1.0)
    except Exception as e:
        print("   C7 close click skipped", e)
    stamp("C7")
    shot(page, out("C7-binance-incident-update-2.png"))


def R_NVDA_NEWS(br):
    page = prep(br, "https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director")
    # guard 5: no reason on screen. The body starts right under the date line: hide the body only.
    n = page.evaluate("""() => {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t, hit = null;
      while ((t = w.nextNode())) { if (/^November 23, 2026$/.test(t.nodeValue.trim())) { hit = t.parentElement; break; } }
      if (!hit) return -1;
      let cnt = 0, el = hit;
      // hide every later sibling of the date line and of its ancestors up to the article column
      for (let k = 0; k < 3 && el; k++) { let s = el.nextElementSibling; while (s) { s.style.visibility = 'hidden'; s = s.nextElementSibling; cnt++; } el = el.parentElement; }
      return cnt; }""")
    print("   NVDA-NEWS hid", n)
    # the floating cookie-preferences button + back-to-top: hide every fixed element sitting in a bottom corner
    time.sleep(2.0)
    hidden = page.evaluate("""() => { let n = 0; const vh = innerHeight, vw = innerWidth;
      document.querySelectorAll('body *').forEach(e => { const st = getComputedStyle(e);
        if (st.position !== 'fixed') return; const r = e.getBoundingClientRect();
        if (r.width > 0 && r.width < 220 && r.height < 220 && r.bottom > vh - 260 && (r.left < 160 || r.right > vw - 160)) { e.style.display = 'none'; n++; } });
      return n; }""")
    print("   NVDA-NEWS corner widgets hidden:", hidden)
    scroll_to(page, 0)
    stamp("R-NVDA-NEWS")
    shot(page, out("R-NVDA-NEWS-headline.png"))


def C18(br):
    page = new_page(br, h=1280)
    goto(page, "https://x.com/mikeneder/status/2123379202254680088", 8)
    time.sleep(1.5)
    # no half-loaded skeletons in frame: hide the "What's happening" box, clip above the replies skeleton
    page.evaluate(HIDE_BY_TEXT_JS, ["What’s happening", 700])
    page.evaluate(HIDE_BY_TEXT_JS, ["What's happening", 700])
    page.evaluate(HIDE_CONTAINER_OF_TEXT_JS, ["Scan to get the app", 400, 400])
    # the post's action bar is the last real element: find its bottom (the date line + 70px)
    ys = [r["y"] for r in find_text(page, r"Nov 19, 2026", limit=3) if r["y"] > 0]
    y_date = ys[0]
    stamp("C18")
    print("   C18 date line y", y_date)
    shot(page, out("C18-x-post-nov-19.png"), clip={"x": 0, "y": 0, "width": 1920, "height": y_date + 66})

def tv_prepare(page, range_label, hover_x):
    """TradingView: clear the sale modal + tooltip, pick a range from the BOTTOM bar, park the crosshair."""
    for _ in range(3):
        try:
            page.keyboard.press("Escape")
            time.sleep(0.6)
        except Exception:
            pass
    for name in ("Got it", "Close", "Maybe later"):
        try:
            b = page.get_by_role("button", name=name, exact=True).first
            if b.is_visible(timeout=600):
                b.click(timeout=1500)
                time.sleep(0.6)
        except Exception:
            pass
    try:
        x = page.locator('button[data-name="close"], [data-name="close"], button[aria-label="Close"]').first
        if x.is_visible(timeout=600):
            x.click(timeout=1500)
            time.sleep(0.6)
    except Exception:
        pass
    # keep the DAILY interval (the bottom range buttons switch the candle interval): zoom with the wheel,
    # anchored at the right edge so the newest candles stay in view
    notches = int(os.environ.get("NOTCHES", "12"))
    page.mouse.move(1500, 520)
    time.sleep(0.5)
    for _ in range(notches):
        page.mouse.wheel(0, -120)
        time.sleep(0.35)
    time.sleep(2.0)
    page.evaluate(HIDE_CONTAINER_OF_TEXT_JS, ["Press\sand\shold\sCtrl", 900, 140])
    page.mouse.move(hover_x, 520)
    time.sleep(1.5)
    page.evaluate(HIDE_CONTAINER_OF_TEXT_JS, ["Press\sand\shold\sCtrl", 900, 140])


def C27(br, hover_x=1378):
    page = new_page(br, h=1080)
    goto(page, "https://www.tradingview.com/chart/?symbol=BITSTAMP%3ABTCUSD&interval=D", 9)
    tv_prepare(page, "3M", int(os.environ.get("HX", hover_x)))
    stamp("C27")
    shot(page, out(os.environ.get("OUTNAME", "C27-tradingview-btcusd-daily.png")))


def R_NVDA_CHART(br, hover_x=1378):
    page = new_page(br, h=1080)
    goto(page, "https://www.tradingview.com/chart/?symbol=NASDAQ%3ANVDA&interval=D", 9)
    tv_prepare(page, "3M", int(os.environ.get("HX", hover_x)))
    stamp("R-NVDA-CHART")
    shot(page, out(os.environ.get("OUTNAME", "R-NVDA-CHART-tradingview-nvda-daily.png")))


def cg_clear(page):
    """CoinGecko: the sale modal and the consent bar arrive late and in either order; clear both."""
    for _ in range(8):
        did = False
        try:
            rb = page.get_by_role("button", name="Reject all", exact=True).first
            if rb.is_visible(timeout=300):
                rb.click(timeout=1500)
                did = True
                time.sleep(0.8)
        except Exception:
            pass
        try:
            t = page.get_by_text("Our biggest Black Friday sale is here").first
            if t.is_visible(timeout=300):
                bb = t.bounding_box()
                page.mouse.click(bb["x"] + 8, bb["y"] - 38)
                did = True
                time.sleep(0.8)
        except Exception:
            pass
        if not did:
            time.sleep(1.0)
            # stable for one more tick = clear
            try:
                if not page.get_by_text("Our biggest Black Friday sale is here").first.is_visible(timeout=200):
                    break
            except Exception:
                break
    page.evaluate(HIDE_CONTAINER_OF_TEXT_JS, ["Black\\sFriday\\sSale:", 2200, 60])
    page.evaluate(DECLUTTER_JS)


CG_KILL_SALE_JS = r"""() => { let n = 0;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t; const hits = [];
  while ((t = w.nextNode())) { if (/Our biggest Black Friday sale/i.test(t.nodeValue)) hits.push(t.parentElement); }
  hits.forEach(el => { let top = null, e = el;
    while (e && e !== document.body) { if (getComputedStyle(e).position === 'fixed') top = e; e = e.parentElement; }
    if (top) { top.remove(); n++; } });
  // the dimming backdrop is a separate fixed full-screen sibling
  document.querySelectorAll('div').forEach(e => { const c = typeof e.className === 'string' ? e.className : '';
    if (/tw-fixed/.test(c) && /tw-inset-0/.test(c) && /bg-gray-900|bg-black/.test(c) && !e.querySelector('input,nav,table')) { e.remove(); n++; } });
  document.documentElement.style.overflow = 'auto'; document.body.style.overflow = 'auto';
  return n; }"""

CG_JSCLICK_JS = r"""(label) => { let best = null;
  document.querySelectorAll('button, a, div, span, li').forEach(e => {
    if ((e.innerText || '').trim() !== label || e.children.length > 0) return;
    const r = e.getBoundingClientRect();
    if (r.width > 0 && r.left > 1000 && r.left < 1600 && r.top > 150 && r.top < 450) best = e; });
  if (!best) return null;
  const r = best.getBoundingClientRect();
  best.click();
  (best.closest('button, a, [role=button], li') || best).click();
  return {x: r.left + r.width / 2, y: r.top + r.height / 2}; }"""


def cg_prepare(page, range_label, hover=(1446, 470)):
    time.sleep(2.0)
    chart_clip = {"x": 600, "y": 380, "width": 940, "height": 380}
    for attempt in range(1, 5):
        cg_clear(page)
        print("   sale modal removed:", page.evaluate(CG_KILL_SALE_JS))
        before = page.screenshot(clip=chart_clip)
        st = page.evaluate(CG_JSCLICK_JS, range_label)
        print("   range", range_label, "attempt", attempt, "js-click at", st)
        time.sleep(4.0)
        after = page.screenshot(clip=chart_clip)
        if before != after:
            print("   chart changed after the range click: OK")
            break
        if st:
            page.mouse.click(st["x"], st["y"])
            time.sleep(4.0)
            if page.screenshot(clip=chart_clip) != before:
                print("   chart changed after the mouse click: OK")
                break
    cg_clear(page)
    page.evaluate(CG_KILL_SALE_JS)
    scroll_to(page, 0)
    page.mouse.move(hover[0] - 120, hover[1])
    time.sleep(0.4)
    page.mouse.move(*hover, steps=12)
    time.sleep(1.8)


def C15(br):
    page = prep(br, "https://www.coingecko.com/en/coins/pieverse", wait=9, consent=False)
    cg_prepare(page, "Max")
    stamp("C15")
    shot(page, out(os.environ.get("OUTNAME", "C15-coingecko-pieverse-max.png")))


def C13(br):
    page = prep(br, "https://www.coingecko.com/en/coins/evaa-protocol", wait=9, consent=False)
    cg_prepare(page, "1Y")
    stamp("C13")
    shot(page, out(os.environ.get("OUTNAME", "C13-coingecko-evaa-1y.png")))


def C20a(br):
    page = new_page(br, w=1920, h=1080, dsf=3)
    goto(page, "https://cryptorich.vip/", 8)
    time.sleep(1.5)
    ya = [r["y"] for r in find_text(page, r"^About The Founder", limit=3) if r["h"] > 0][0]
    yb = [r["y"] for r in find_text(page, r"^New Coin Alert bot$", limit=3) if r["h"] > 0][0]
    print("   C20a anchors: About y", ya, " New Coin Alert bot y", yb)
    stamp("C20a")
    # crop 1: the About line only (text column; the floating 'Most Bought' performance card stays out)
    shot(page, out("C20a-about.png"), clip={"x": 930, "y": ya - 44, "width": 700, "height": 296}, full=True)
    # crop 2: the first row of the tools grid (New Coin Alert bot, Insider Alert, Top tier CEX Alerts); row 2 holds the rug-pull card: out
    shot(page, out("C20a-new-coin-alert-bot.png"), clip={"x": 380, "y": yb - 100, "width": 1170, "height": 340}, full=True)


def C20b(br):
    page = new_page(br, w=1920, h=1080, dsf=2)
    goto(page, "https://cryptorich.vip/showcase", 8)
    time.sleep(1.5)
    stamp("C20b")
    shot(page, out("C20b-showcase-top.png"))
    shot(page, out("C20b-showcase-full.png"), full=True)


JOBS = {k: v for k, v in globals().items() if k.replace("_", "-") in [
    "R-HL1", "R-HL2", "R-HL3", "R-HL4", "C27", "C7", "R-ALJ", "R-BLOCK", "C10", "C11", "C8", "C9", "C12",
    "R-NVDA-NEWS", "R-NVDA-CHART", "C15", "C18", "C13", "R-NEWCOINS", "C20a", "C20b"] or k in ("C27", "C7", "C10", "C8", "C9", "C12", "C15", "C18", "C13", "C20a", "C20b")}

if __name__ == "__main__":
    want = [a.replace("-", "_") for a in sys.argv[1:]]
    cap_file = HERE / "captured.json"
    caps = json.loads(cap_file.read_text(encoding="utf-8")) if cap_file.exists() else {}
    with sync_playwright() as p:
        br = launch(p)
        for name in want:
            fn = globals().get(name)
            if not fn:
                print("no job", name)
                continue
            try:
                fn(br)
                print("OK  ", name, flush=True)
            except Exception as e:
                print("FAIL", name, "::", str(e).splitlines()[0], flush=True)
        br.close()
    caps.update(TS)
    cap_file.write_text(json.dumps(caps, indent=1), encoding="utf-8")
