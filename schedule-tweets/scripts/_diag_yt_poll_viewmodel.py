# _diag_yt_poll_viewmodel.py — READ-ONLY probe for the YouTube community TEXT POLL composer.
#
# Sibling of _diag_yt_quiz_viewmodel.py. The quiz composer moved to the ViewModel components on
# 2026-08-30; this answers the same question for text polls: is `ytd-poll-attachment` still the
# live widget, or is it a dead node like the quiz's `#quiz-attachment` now is?
#
# Opens the composer -> clicks the visible "Add a text poll" button -> reports the legacy
# containers' display state alongside any ViewModel components, the option fields and the
# add-option control. NEVER clicks Post; abandons the composer by navigating away.
#   python scripts/_diag_yt_poll_viewmodel.py
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

DUMP = """
() => {
  const root = document.querySelector('ytd-backstage-post-dialog-renderer')
            || document.querySelector('ytd-commentbox');
  if (!root) return { error: 'composer root not found' };
  const box = el => { const r = el.getBoundingClientRect();
                      return { w: Math.round(r.width), h: Math.round(r.height) }; };
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  // Legacy Polymer widget the poster currently drives.
  const legacy = {};
  for (const sel of ['ytd-poll-attachment',
                     'tp-yt-paper-input.poll-option-input',
                     'tp-yt-paper-input.poll-option-input input',
                     '#add-option',
                     '#add-option button']) {
    const els = [...root.querySelectorAll(sel)];
    legacy[sel] = els.length
      ? els.map(el => ({ display: getComputedStyle(el).display, ...box(el) }))
      : 'absent';
  }

  // New ViewModel components, if the poll migrated too.
  const vmClasses = {};
  for (const el of root.querySelectorAll('*')) {
    for (const c of (el.className || '').toString().split(/\\s+/)) {
      if (/^ytPostsCreation/.test(c)) vmClasses[c] = (vmClasses[c] || 0) + 1;
    }
  }

  const fields = [];
  for (const el of root.querySelectorAll('input, textarea')) {
    if (!vis(el)) continue;
    fields.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || '').toString().slice(0, 70),
      ph: el.getAttribute('placeholder') || el.getAttribute('aria-label') || '',
      ...box(el),
    });
  }

  const buttons = [];
  for (const el of root.querySelectorAll('button')) {
    if (!vis(el)) continue;
    buttons.push({
      aria: el.getAttribute('aria-label') || '',
      text: (el.innerText || '').trim().slice(0, 20),
      cls: (el.className || '').toString().slice(0, 70),
      ...box(el),
    });
  }
  return { legacy, vmClasses, fields, buttons };
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

            page.locator('button[aria-label="Add a text poll"]:visible').first.click()
            print("Clicked visible button[aria-label='Add a text poll']")
            page.wait_for_timeout(2500)

            dump = page.evaluate(DUMP)
            print("\n=== LEGACY POLL WIDGET (what post_yt_poll.py drives) ===")
            print(json.dumps(dump["legacy"], indent=2))
            print("\n=== ytPostsCreation* ViewModel CLASSES (empty => poll did NOT migrate) ===")
            print(json.dumps(dump["vmClasses"], indent=2))
            print("\n=== VISIBLE FIELDS ===")
            print(json.dumps(dump["fields"], indent=2))
            print("\n=== VISIBLE BUTTONS ===")
            print(json.dumps(dump["buttons"], indent=2))

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
