# _diag_yt_quiz_correct.py — READ-ONLY probe for the quiz "mark correct answer" control.
#
# Companion to _diag_yt_quiz_viewmodel.py. That probe showed a 2-row editor where row 1 was
# marked correct by default (aria-pressed="true"). But a real 4-option run reported NO row
# marked (aria-pressed absent/false on every selector button) even after clicking one, so the
# state signal on a grown (Add answer x2) editor differs from the fresh 2-row editor.
# This probe reproduces the real shape: open quiz -> add 2 answers -> dump every selector
# button (aria-label / aria-pressed / classes) -> click row 2's button -> dump again.
#
# NEVER clicks Post. Abandons the composer by navigating away.
#   python scripts/_diag_yt_quiz_correct.py
import json
import socket
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile"
CDP_PORT = 9223
POSTS_URL = "https://www.youtube.com/@CodeMonkeyMike/posts"

SELECTOR_BTN = ".ytPostsCreationOptionViewModelOptionSelectorButton"
ADD_ANSWER = "button.ytPostsCreationOptionsViewModelAddOptionButton"
OPT_TEXTAREA = ".ytPostsCreationOptionViewModelTextFieldContainer textarea"

DUMP = """
() => {
  const out = { selectorButtons: [], rows: [] };
  for (const b of document.querySelectorAll('.ytPostsCreationOptionViewModelOptionSelectorButton')) {
    const r = b.getBoundingClientRect();
    out.selectorButtons.push({
      tag: b.tagName.toLowerCase(),
      aria: b.getAttribute('aria-label'),
      pressed: b.getAttribute('aria-pressed'),
      checked: b.getAttribute('aria-checked'),
      role: b.getAttribute('role'),
      cls: (b.className || '').toString(),
      w: Math.round(r.width), h: Math.round(r.height),
    });
  }
  for (const el of document.querySelectorAll('.ytPostsCreationOptionViewModelQuizOption')) {
    out.rows.push({ cls: (el.className || '').toString() });
  }
  return out;
}
"""


def is_cdp_ready():
    try:
        with socket.create_connection(("127.0.0.1", CDP_PORT), timeout=0.6):
            return True
    except OSError:
        return False


def start_chrome():
    if is_cdp_ready():
        print(f"Chrome already on port {CDP_PORT}")
        return None
    print("Launching Chrome...")
    proc = subprocess.Popen(
        [CHROME_EXE, f"--user-data-dir={CHROME_PROFILE}", f"--remote-debugging-port={CDP_PORT}",
         "--no-first-run", "--disable-blink-features=AutomationControlled", "--disable-sync", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, stdin=subprocess.DEVNULL,
    )
    for _ in range(24):
        time.sleep(0.5)
        if is_cdp_ready():
            print("Chrome ready")
            return proc
    raise RuntimeError("Chrome did not open CDP port within 12s.")


def main():
    chrome_proc = start_chrome()
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{CDP_PORT}")
        ctx = browser.contexts[0]
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            page.goto(POSTS_URL)
            page.wait_for_load_state("domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)
            try:
                page.locator("#placeholder-area").first.click(timeout=5000)
            except Exception:
                pass
            page.wait_for_timeout(1500)
            ta = page.locator('#contenteditable-root[contenteditable="true"]').first
            ta.wait_for(state="visible", timeout=10000)
            ta.click()
            page.keyboard.type("probe")
            page.wait_for_timeout(800)

            page.locator('button[aria-label="Add a quiz"]:visible').first.click()
            page.locator(OPT_TEXTAREA).first.wait_for(state="visible", timeout=15000)
            page.wait_for_timeout(1200)

            print("\n=== FRESH 2-ROW EDITOR ===")
            print(json.dumps(page.evaluate(DUMP), indent=2))

            # Grow to 4 rows the way the poster does.
            for _ in range(2):
                page.locator(ADD_ANSWER).first.click()
                page.wait_for_timeout(1200)
            print(f"\n=== AFTER Add answer x2 ({page.locator(OPT_TEXTAREA).count()} rows) ===")
            print(json.dumps(page.evaluate(DUMP), indent=2))

            # Click row 2's selector button (index 1), as the poster does.
            btns = page.locator(SELECTOR_BTN)
            print(f"\nselector button count = {btns.count()}; clicking nth(1)...")
            btns.nth(1).click()
            page.wait_for_timeout(1500)
            print("\n=== AFTER CLICKING nth(1) ===")
            print(json.dumps(page.evaluate(DUMP), indent=2))

            print("\nDONE — abandoning composer (NOT posted).")
            page.goto("https://www.youtube.com/")
        except Exception as err:
            print(f"Probe error: {err}", file=sys.stderr)
        finally:
            try:
                browser.close()
            except Exception:
                pass
            try:
                if chrome_proc:
                    chrome_proc.kill()
            except Exception:
                pass


if __name__ == "__main__":
    main()
