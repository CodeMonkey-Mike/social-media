# _diag_yt_quiz_viewmodel.py — READ-ONLY diagnostic for the YouTube community QUIZ composer.
#
# Why this exists: on 2026-08-30 post-yt-quiz.js/post_yt_quiz.py started failing with
# "Quiz editor did not open (display=none)". The legacy probe (_diag-yt-quiz-selectors.js)
# showed the legacy Polymer container `ytd-backstage-quiz-editor-renderer#quiz-attachment`
# stuck at display:none while NEW `ytPostsCreationOptionViewModel*` elements rendered with
# real dimensions — i.e. YouTube migrated the quiz composer from the Polymer `ytd-*`
# renderer to its newer ViewModel components. This probe dumps ONLY the composer subtree
# so the real ViewModel selectors can be read off directly.
#
# NEVER clicks Post — it abandons the composer by reloading. Safe to run any time.
#   python scripts/_diag_yt_quiz_viewmodel.py
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
    print("Launching Chrome with remote debugging...")
    proc = subprocess.Popen(
        [
            CHROME_EXE,
            f"--user-data-dir={CHROME_PROFILE}",
            f"--remote-debugging-port={CDP_PORT}",
            "--no-first-run",
            "--disable-blink-features=AutomationControlled",
            "--disable-sync",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, stdin=subprocess.DEVNULL,
    )
    for _ in range(24):
        time.sleep(0.5)
        if is_cdp_ready():
            print("Chrome ready")
            return proc
    raise RuntimeError("Chrome did not open CDP port within 12s.")


# Everything below runs inside the page and is scoped to the composer dialog only.
DUMP_JS = """
() => {
  const root = document.querySelector('ytd-backstage-post-dialog-renderer')
            || document.querySelector('ytd-commentbox');
  if (!root) return { error: 'composer root not found' };
  const rect = el => { const r = el.getBoundingClientRect();
                       return { w: Math.round(r.width), h: Math.round(r.height) }; };
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  const buttons = [];
  for (const el of root.querySelectorAll('button, [role="button"], yt-icon-button, yt-button-shape')) {
    const r = rect(el);
    buttons.push({
      tag: el.tagName.toLowerCase(),
      id: el.id || '',
      aria: el.getAttribute('aria-label') || '',
      pressed: el.getAttribute('aria-pressed'),
      cls: (el.className || '').toString().slice(0, 80),
      text: (el.innerText || '').trim().slice(0, 20),
      ...r, visible: vis(el),
    });
  }

  const fields = [];
  for (const el of root.querySelectorAll('input, textarea, [contenteditable="true"]')) {
    const r = rect(el);
    fields.push({
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || '',
      cls: (el.className || '').toString().slice(0, 80),
      ph: el.getAttribute('placeholder') || el.getAttribute('aria-label') || '',
      val: (el.value !== undefined ? el.value : el.innerText || '').slice(0, 30),
      ...r, visible: vis(el),
    });
  }

  // Every distinct class token that looks like a new ViewModel component, with counts.
  const vmClasses = {};
  for (const el of root.querySelectorAll('*')) {
    for (const c of (el.className || '').toString().split(/\\s+/)) {
      if (/^yt[A-Z]/.test(c)) vmClasses[c] = (vmClasses[c] || 0) + 1;
    }
  }

  // Containers that look like a quiz answer row, with their inner structure.
  const rows = [];
  for (const el of root.querySelectorAll('[class*="QuizOption"]')) {
    const r = rect(el);
    rows.push({
      cls: (el.className || '').toString(),
      ...r, visible: vis(el),
      inner: [...el.querySelectorAll('input, textarea, button, [role="button"]')].map(c => ({
        tag: c.tagName.toLowerCase(),
        cls: (c.className || '').toString().slice(0, 60),
        aria: c.getAttribute('aria-label') || '',
        ph: c.getAttribute('placeholder') || '',
        ...rect(c),
      })),
    });
  }

  const legacy = {};
  for (const sel of ['ytd-backstage-quiz-editor-renderer#quiz-attachment',
                     'ytd-poll-attachment', 'ytd-backstage-image-poll-editor-renderer']) {
    const el = root.querySelector(sel);
    legacy[sel] = el ? { display: getComputedStyle(el).display, ...rect(el) } : 'absent';
  }

  return { buttons, fields, vmClasses, rows, legacy };
}
"""


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

            # Expand the composer and type throwaway text so the attachment buttons activate.
            try:
                page.locator("#placeholder-area").first.click(timeout=5000)
            except Exception:
                pass
            page.wait_for_timeout(1500)
            ta = page.locator('#contenteditable-root[contenteditable="true"]').first
            ta.wait_for(state="visible", timeout=10000)
            ta.click()
            page.keyboard.type("probe")
            page.wait_for_timeout(1000)

            print("\n=== QUIZ BUTTON CANDIDATES (before click) ===")
            cands = page.evaluate("""() => {
              const out = [];
              for (const el of document.querySelectorAll('#quiz-button, #quiz-button button, button[aria-label="Add a quiz"]')) {
                const r = el.getBoundingClientRect();
                out.push({ tag: el.tagName.toLowerCase(), id: el.id || '',
                           aria: el.getAttribute('aria-label') || '',
                           cls: (el.className || '').toString().slice(0, 60),
                           w: Math.round(r.width), h: Math.round(r.height) });
              }
              return out;
            }""")
            print(json.dumps(cands, indent=2))

            # Click the VISIBLE quiz button (real click, actionability-checked).
            btn = page.locator('button[aria-label="Add a quiz"]:visible').first
            btn.wait_for(state="visible", timeout=8000)
            btn.click()
            print("\nClicked visible button[aria-label='Add a quiz']")
            page.wait_for_timeout(2500)

            dump = page.evaluate(DUMP_JS)

            print("\n=== LEGACY CONTAINERS ===")
            print(json.dumps(dump["legacy"], indent=2))

            print("\n=== NEW ViewModel CLASSES IN COMPOSER (name: count) ===")
            print(json.dumps(dump["vmClasses"], indent=2))

            print("\n=== QUIZ ANSWER ROWS ===")
            print(json.dumps(dump["rows"], indent=2))

            print("\n=== COMPOSER FIELDS ===")
            print(json.dumps(dump["fields"], indent=2))

            print("\n=== COMPOSER BUTTONS (visible only) ===")
            print(json.dumps([b for b in dump["buttons"] if b["visible"]], indent=2))

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
