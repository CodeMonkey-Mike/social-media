"""R-NEWCOINS: a slow scroll of CoinGecko's New Cryptocurrencies list as a 1920x1080, 30 fps, silent MP4.
Built from REAL page frames, one screenshot per scroll position (a headless screencast tears and repeats rows mid-scroll)."""
import datetime
import math
import shutil
import subprocess
import sys
import time

from capture_receipts import CG_KILL_SALE_JS, HIDE_CONTAINER_OF_TEXT_JS, cg_clear
from kit import *

FRAMES = HERE / "rec_frames"
OUT = RECEIPTS / "R-NEWCOINS-coingecko-new-listings-scroll.mp4"
SCROLL_PX = int(sys.argv[1]) if len(sys.argv) > 1 else 760
SECS = 8.0
FPS = 30

HIDE_SMALL_FIXED_JS = """() => { let n = 0;
  document.querySelectorAll('body *').forEach(e => { const st = getComputedStyle(e);
    if (st.position !== 'fixed') return; const r = e.getBoundingClientRect();
    if (r.width < 90 && r.height < 90 && r.width > 0) { e.style.display = 'none'; n++; } });
  return n; }"""

KILL_BAR_JS = """() => { let n = 0;
  document.querySelectorAll('#cmpwrapper, .cmpwrapper, [id*="cmpwrapper"]').forEach(e => { e.remove(); n++; });
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
  while ((t = w.nextNode())) { if (!/Black Friday Sale/i.test(t.nodeValue)) continue;
    let e = t.parentElement, best = e;
    while (e && e !== document.body && e.getBoundingClientRect().height <= 70) { best = e; e = e.parentElement; }
    if (best.style.display !== 'none') { best.style.display = 'none'; n++; } }
  return n; }"""

if FRAMES.exists():
    shutil.rmtree(FRAMES)
FRAMES.mkdir()
with sync_playwright() as p:
    br = launch(p)
    page = new_page(br, w=1920, h=1080, dsf=1)
    goto(page, "https://www.coingecko.com/en/new-cryptocurrencies", 9)
    time.sleep(2.0)
    for _ in range(4):
        cg_clear(page)
        try:
            page.get_by_text("Reject all", exact=True).first.click(timeout=1500)
        except Exception:
            pass
        page.evaluate(CG_KILL_SALE_JS)
        print("   consent bar hidden:", page.evaluate(HIDE_CONTAINER_OF_TEXT_JS, ["Opt-out\\sfor\\spersonal\\sinformation", 2200, 420]),
              "small fixed hidden:", page.evaluate(HIDE_SMALL_FIXED_JS))
        time.sleep(1.0)
    # the consent wrapper (#cmpwrapper) appears after the first scroll: reject, then remove it
    page.mouse.wheel(0, 300)
    for i in range(20):
        if page.evaluate("!!document.querySelector('#cmpwrapper')"):
            print("   #cmpwrapper appeared after", i, "x1.5 s")
            try:
                page.locator('#cmpwrapper').get_by_text("Reject all", exact=True).first.click(timeout=3000)
                print("   Reject all clicked")
            except Exception as e:
                print("   reject click failed:", str(e).splitlines()[0])
            time.sleep(7.0)   # the click reloads the page
            break
        time.sleep(1.5)
    for k in range(4):
        try:
            page.wait_for_load_state("domcontentloaded", timeout=15000)
            page.evaluate(CG_KILL_SALE_JS)
            page.evaluate(HIDE_SMALL_FIXED_JS)
            print("   cmpwrapper removed:", page.evaluate(KILL_BAR_JS), " (pass", k, ")")
        except Exception as e:
            print("   settle pass", k, "retry:", str(e).splitlines()[0][:90])
        time.sleep(2.0)
    page.evaluate("window.scrollTo(0, 0)")
    page.mouse.move(1700, 700)
    time.sleep(1.5)
    stamp = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
    n_lead, n_scroll, n_tail = int(0.8 * FPS), int(SECS * FPS), int(0.6 * FPS)
    total = n_lead + n_scroll + n_tail
    ease = lambda t: 2 * t * t if t < 0.5 else 1 - math.pow(-2 * t + 2, 2) / 2
    for i in range(total):
        k = min(max(i - n_lead, 0), n_scroll - 1) / (n_scroll - 1)
        y = SCROLL_PX * ease(k)
        page.evaluate("(y) => window.scrollTo(0, y)", y)
        page.evaluate(KILL_BAR_JS)
        page.screenshot(path=str(FRAMES / f"f{i:04d}.jpg"), type="jpeg", quality=95)
        if i % 60 == 0:
            print("   frame", i, "/", total, flush=True)
    br.close()

cmd = ["ffmpeg", "-y", "-v", "error", "-framerate", str(FPS), "-i", str(FRAMES / "f%04d.jpg"), "-an",
       "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-r", str(FPS),
       "-movflags", "+faststart", str(OUT)]
subprocess.run(cmd, check=True)
print("OUT", OUT, "stamp", stamp)
(HERE / "newcoins.stamp").write_text(stamp)
