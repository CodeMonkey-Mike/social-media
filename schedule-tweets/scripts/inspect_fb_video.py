# inspect_fb_video.py <url> — READ-ONLY. Opens a FB video/reel URL and reports the
# caption, video duration, and pixel dimensions so we can confirm a landscape longform
# posted correctly (vs. being mangled into a short vertical Reel), or tell two reels
# apart by duration when the poster captured the wrong URL.
# (Python port of inspect-fb-video.js, 2026-11-22; the JS file is deleted.)
#
# Posts nothing, uploads nothing, writes nothing to any queue file.
#
# Usage:  python scripts/inspect_fb_video.py <url>
import math
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\fbbot-profile"

# Try to coax the video element to load metadata, then read it + the og: tags.
INFO_JS = r"""
async () => {
  const v = document.querySelector('video');
  let vid = null;
  if (v) {
    if (isNaN(v.duration) || !v.duration) {
      // play() never settles on a <video> that has no source yet, so cap the wait at 3 s
      // (the JS awaited it bare and could hang there forever).
      const nap = ms => new Promise(r => setTimeout(r, ms));
      try { v.muted = true; await Promise.race([v.play().catch(()=>{}), nap(3000)]); await nap(1500); v.pause(); } catch {}
    }
    // NaN / Infinity do not survive the trip back to Python: send null instead.
    const num = x => (typeof x === 'number' && isFinite(x)) ? x : null;
    vid = { duration: num(v.duration), w: num(v.videoWidth), h: num(v.videoHeight) };
  }
  const metaW = document.querySelector('meta[property="og:video:width"]');
  const metaH = document.querySelector('meta[property="og:video:height"]');
  const ogDur = document.querySelector('meta[property="video:duration"], meta[property="og:video:duration"]');
  const desc  = document.querySelector('meta[property="og:description"], meta[name="description"]');
  const title = document.querySelector('meta[property="og:title"]');
  // grab visible caption-ish text from the main article
  const art = document.querySelector('[role="main"]') || document.body;
  const text = (art.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300);
  return {
    videoEl: vid,
    ogWidth: metaW && metaW.content, ogHeight: metaH && metaH.content,
    ogDuration: ogDur && ogDur.content,
    ogTitle: title && title.content,
    ogDesc: desc && desc.content,
    visibleText: text,
  };
}
"""


def _float(s):
    try:
        return float(s)
    except (TypeError, ValueError):
        return None


def _int(s):
    try:
        return int(float(s))
    except (TypeError, ValueError):
        return None


def main(url):
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=30,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"],
            no_viewport=True,
        )
        page = browser.pages[0] if browser.pages else browser.new_page()
        try:
            resp = page.goto(url, wait_until="domcontentloaded", timeout=30000)
            print(f"HTTP {resp.status if resp else '?'} — {url}")
            page.wait_for_timeout(7000)
            info = page.evaluate(INFO_JS)
            vid = info.get("videoEl") or {}
            dur = vid.get("duration") or _float(info.get("ogDuration"))
            w = vid.get("w") or _int(info.get("ogWidth"))
            h = vid.get("h") or _int(info.get("ogHeight"))
            if dur:
                # math.floor(x + 0.5) = JavaScript's Math.round (Python's round() rounds halves to even).
                secs = math.floor(dur % 60 + 0.5)
                print(f"\nDuration: {int(dur // 60)}m{secs}s ({math.floor(dur + 0.5)}s)")
            else:
                print("\nDuration: unknown")
            if w and h:
                shape = "LANDSCAPE/SQUARE" if w >= h else "VERTICAL"
                print(f"Dimensions: {w}x{h}  ({shape}, ratio {w / h:.2f})")
            else:
                print("Dimensions: unknown")
            print(f"og:title: {info.get('ogTitle') or '(none)'}")
            desc = info.get("ogDesc")
            print(f"og:desc:  {desc[:160] if desc else '(none)'}")
            print(f"\nVisible text (first 300):\n  {info.get('visibleText')}")
        except Exception as e:
            print(f"inspect error: {e}", file=sys.stderr)
        finally:
            browser.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python scripts/inspect_fb_video.py <url>", file=sys.stderr)
        sys.exit(1)
    main(sys.argv[1])
