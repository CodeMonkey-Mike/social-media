# _check_tiktok_content.py — READ-ONLY check: does the TikTok content dashboard show
# a fresh upload? Never uploads anything. Same CDP launch as post_tiktok_short.py
# (real Chrome on tiktokbot-profile, port 9224).
# (Python port of _check-tiktok-content.js, 2026-11-22; the JS file is deleted.)
#
# Usage:  python scripts/_check_tiktok_content.py
import json
import socket
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

MAIN_USER_DATA = r"C:\Users\mnede\AppData\Local\Google\Chrome\tiktokbot-profile"
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CDP_PORT = 9224

ITEMS_JS = r"""
() => {
  const out = [];
  document.querySelectorAll('[data-e2e*="video-item"], .content-item, a[href*="/video/"]').forEach(el => {
    const href = el.href || el.querySelector?.('a')?.href;
    const text = el.innerText?.slice(0, 120);
    if (href) out.push({ href, text });
  });
  return out.slice(0, 10);
}
"""


def is_cdp_ready():
    try:
        with socket.create_connection(("127.0.0.1", CDP_PORT), timeout=0.6):
            return True
    except OSError:
        return False


def ensure_chrome():
    if is_cdp_ready():
        print(f"Chrome already on CDP {CDP_PORT}")
        return None
    print("Launching Chrome...")
    proc = subprocess.Popen(
        [CHROME_EXE,
         f"--user-data-dir={MAIN_USER_DATA}",
         f"--remote-debugging-port={CDP_PORT}",
         "--no-first-run"],
        stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        time.sleep(1)
        if is_cdp_ready():
            print("Chrome ready ✓")
            return proc
    raise RuntimeError("Chrome did not open CDP in time")


def main():
    # A Chrome this script launched is closed again on every path (the Python posters' rule:
    # an orphaned bot-profile Chrome collides with the next run). One that was already on the
    # port is left alone. The JS left its Chrome open.
    chrome_proc = ensure_chrome()
    try:
        with sync_playwright() as p:
            browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{CDP_PORT}")
            try:
                ctx = browser.contexts[0] if browser.contexts else browser.new_context()
                page = ctx.pages[0] if ctx.pages else ctx.new_page()
                page.goto("https://www.tiktok.com/tiktokstudio/content",
                          wait_until="domcontentloaded")
                page.wait_for_timeout(6000)
                print(json.dumps(page.evaluate(ITEMS_JS), indent=2, ensure_ascii=False))
            finally:
                try:
                    browser.close()
                except Exception:
                    pass
    finally:
        if chrome_proc:
            try:
                chrome_proc.kill()
            except Exception:
                pass


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"ERROR {e}", file=sys.stderr)
        sys.exit(1)
