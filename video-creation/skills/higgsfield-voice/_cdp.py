"""
_cdp.py: shared helpers for the Higgsfield voice skill. Python port of _cdp.js (2026-11-23).

Every script in this folder attaches to the ALREADY RUNNING hfbot-profile Chrome over CDP
(http://localhost:9333, override with HF_CDP); none of them launches a browser. See SKILL.md "Launching".

    from _cdp import connect, shot, run
    def main():
        with connect() as (browser, ctx, page):
            ...
    run(main)

Leaving the `with` block only DISCONNECTS from Chrome; the window and its tabs stay open.
"""
import os
import sys
from contextlib import contextmanager
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))  # video-creation/skills/
from cache_path import cache_path  # noqa: E402  shared tool cache: video-creation/cache/<tool>/

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

CDP = os.environ.get("HF_CDP") or "http://localhost:9333"

# A visible element, as a JS function source. The page scripts receive it as an argument and eval() it.
IS_VIS = ("(el)=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>4&&r.height>4"
          "&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity!==0&&r.bottom>0&&r.top<innerHeight;}")

# Click the composer's "Model" control (walk up from the label to the first clickable ancestor).
# Returns the tag clicked, 'leaf' when only the label itself could be clicked, null when there is none.
OPEN_MODEL_SELECTOR_JS = """(isVisSrc) => { const isVis = eval(isVisSrc);
  for (const e of document.querySelectorAll('*')) {
    if ((e.innerText||'').trim() === 'Model' && isVis(e) && e.children.length === 0) {
      let el = e;
      for (let h = 0; h < 5 && el; h++) {
        const s = getComputedStyle(el);
        if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || s.cursor === 'pointer') { el.click(); return el.tagName; }
        el = el.parentElement;
      }
      e.click(); return 'leaf';
    }
  }
  return null; }"""

# Click the GENERATE action button (a <button> whose text starts with GENERATE, e.g. "GENERATE\\n0.6";
# not the footer "Generate" nav item): the largest one that passes the size floor.
CLICK_GENERATE_JS = """(minH) => {
  const cs = [...document.querySelectorAll('button')].filter(e => /^GENERATE/i.test((e.innerText || '').trim()));
  const v = cs.map(e => ({ e, r: e.getBoundingClientRect() })).filter(o => o.r.width > 30 && o.r.height > minH)
              .sort((a, b) => (b.r.width * b.r.height) - (a.r.width * a.r.height));
  if (!v.length) return false; v[0].e.click(); return true; }"""

# History cards (2026-10-17 layout): an <li> row per generation, newest on top, each with a Play button.
_ROW = ("li => { const r = li.getBoundingClientRect(); return r.width > 300 && r.height > 50 && r.height < 130 "
        "&& li.querySelector('button[aria-label=\"Play\"]'); }")
COUNT_ROWS_JS = "() => [...document.querySelectorAll('li')].filter(" + _ROW + ").length"
TOP_PLAY_JS = ("() => { const rows = [...document.querySelectorAll('li')].filter(" + _ROW + ")"
               ".sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);"
               " const b = rows[0] && rows[0].querySelector('button[aria-label=\"Play\"]'); if (!b) return null;"
               " const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }")
DOM_AUDIO_JS = "() => [...document.querySelectorAll('audio,source')].map(a => a.src || a.currentSrc).filter(Boolean)"


@contextmanager
def connect():
    """Attach to the CDP Chrome. Yields (browser, ctx, page): the first tab that is not a chrome:// page."""
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP)
        try:
            ctx = browser.contexts[0]
            pages = ctx.pages
            page = next((pg for pg in pages if not pg.url.startswith("chrome")), None) or pages[0]
            yield browser, ctx, page
        finally:
            browser.close()  # a CDP attach: this disconnects, it does not close Chrome


def shot(page, name, **kw):
    """Screenshot into video-creation/cache/higgsfield-voice/shots/<name>."""
    path = cache_path("higgsfield-voice", "shots", name)
    page.screenshot(path=str(path), **kw)
    return path


def uniq(items):
    """De-duplicate, keeping first-seen order."""
    return list(dict.fromkeys(items))


def click_generate(page, min_height=20):
    return page.evaluate(CLICK_GENERATE_JS, min_height)


def watch_mp3s(page, pattern):
    """Record every response URL matching `pattern` (a compiled regex), in arrival order. Returns the
    dict it fills (keys = URLs), so a caller can snapshot it and later ask what is new."""
    seen = {}

    def on_response(resp):
        u = resp.url
        if pattern.search(u):
            seen.setdefault(u, True)

    page.on("response", on_response)
    return seen


def _first_new(seen, before):
    return next((u for u in seen if u not in before), None)


def wait_for_new_mp3(page, seen, before, seconds, dom_before=None, log_every=0):
    """After GENERATE was clicked: wait up to `seconds` for the new take's mp3 URL.

    Three ways it can show up, tried every second: (1) a new mp3 response on the network; (2) with
    `dom_before` given, a new <audio>/<source> src in the page (the layout before 2026-10-17); (3) the
    2026-10-17 layout mounts no <audio> for a fresh take: it appears as a NEW History card whose mp3
    only loads when its Play is clicked, so when the row count grows, click the top row's Play, take
    the mp3 it loads, and click again to pause."""
    rows_before = page.evaluate(COUNT_ROWS_JS)
    for i in range(seconds):
        page.wait_for_timeout(1000)
        url = _first_new(seen, before)
        if url:
            return url
        if dom_before is not None:
            for u in page.evaluate(DOM_AUDIO_JS):
                if u not in dom_before and ".mp3" in u.lower():
                    return u
        if page.evaluate(COUNT_ROWS_JS) > rows_before:
            page.wait_for_timeout(1500)
            top = page.evaluate(TOP_PLAY_JS)
            if top:
                page.mouse.click(top["x"], top["y"])
                for _ in range(24):
                    if url:
                        break
                    page.wait_for_timeout(250)
                    url = _first_new(seen, before)
                page.mouse.click(top["x"], top["y"])  # pause
                if url:
                    return url
        if log_every and i % log_every == 0:
            print(f"  waiting... {i}s")
    return None


def run(main):
    """Run a script's main(); any error prints `ERR <message>` and exits 1 (the JS scripts' contract)."""
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        print("ERR", str(e).split("\n")[0], file=sys.stderr)
        sys.exit(1)
