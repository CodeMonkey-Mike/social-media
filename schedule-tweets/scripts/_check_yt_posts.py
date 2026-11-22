# _check_yt_posts.py — READ-ONLY. Lists the most recent community posts on
# @CodeMonkeyMike/posts (their URLs), to check whether a post already went out
# before anything is re-run. Real Chrome on ytbot-profile over CDP 9223, the same
# launch the YouTube posters use.
# (Python port of _check-yt-posts.js, 2026-11-22; the JS file is deleted.)
#
# Usage:  python scripts/_check_yt_posts.py
import socket
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CDP_PORT = 9223
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile"
POSTS_URL = "https://www.youtube.com/@CodeMonkeyMike/posts"

URLS_JS = r"""
() => [...new Set([...document.querySelectorAll('a[href*="/post/"]')]
        .map(a => a.href.replace(/[?#].*$/, '')))]
        .slice(0, 8)
"""


def is_cdp_ready():
    try:
        with socket.create_connection(("127.0.0.1", CDP_PORT), timeout=0.5):
            return True
    except OSError:
        return False


def start_chrome():
    if is_cdp_ready():
        return None
    proc = subprocess.Popen(
        [CHROME_EXE,
         f"--user-data-dir={PROFILE}",
         f"--remote-debugging-port={CDP_PORT}",
         "--no-first-run", "about:blank"],
        stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(20):
        time.sleep(0.5)
        if is_cdp_ready():
            return proc
    raise RuntimeError(f"Chrome did not open CDP port {CDP_PORT} within 10s.")


def main():
    # A Chrome this script launched is closed again on every path (the Python posters' rule);
    # one that was already on the port is left alone. The JS left its Chrome open.
    chrome_proc = start_chrome()
    try:
        with sync_playwright() as p:
            browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{CDP_PORT}")
            try:
                ctx = browser.contexts[0]
                page = ctx.pages[0] if ctx.pages else ctx.new_page()
                page.goto(POSTS_URL)
                page.wait_for_timeout(4000)
                urls = page.evaluate(URLS_JS)
                print("Most recent posts on @CodeMonkeyMike/posts:")
                for i, u in enumerate(urls):
                    print(f"  {i + 1}. {u}")
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
    main()
