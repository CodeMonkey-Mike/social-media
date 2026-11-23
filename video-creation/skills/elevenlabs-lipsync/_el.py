"""
_el.py: what every ElevenLabs lip-sync script shares (added with the Python port, 2026-11-23; the JS
scripts each carried their own copy): the dedicated Chrome profile, the anti-automation launch, the
History tab, small helpers.

    from _el import launch, open_history, rnd, vis, shot, fail
    with launch() as (ctx, page):
        ...

Real Chrome, the dedicated elevenlabs-profile (never the main profile; never kill all Chrome),
AutomationControlled disabled, navigator.webdriver masked. Run setup_elevenlabs.py once to log in.
"""
import random
import re
import sys
from contextlib import contextmanager
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))  # video-creation/skills/
from cache_path import cache_path  # noqa: E402  shared tool cache: video-creation/cache/<tool>/

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PROFILE_DIR = r"C:\Users\mnede\AppData\Local\Google\Chrome\elevenlabs-profile"
URL = "https://elevenlabs.io/app/image-video"
MODELS_RE = re.compile(r"Veed Fabric|Creatify Aurora|OmniHuman|Sync \d|Sync Lipsync|HeyGen|Veed Lipsync")
MASK_WEBDRIVER = "Object.defineProperty(navigator, 'webdriver', { get: () => undefined });"

# The TOPMOST History card naming a model, INCLUDING one that is still rendering (no <video> yet).
# History is newest-first, so that card is OUR render. Counting the rendering state is critical: the
# newest render shows "Almost done..." with NO <video>; skip it and you fall through to an OLDER
# finished render and download the WRONG clip (the duplicate-render trap, SKILL.md). `card` is null
# when no card names the model.
TOP_CARD_JS = """(model) => {
  const re = new RegExp(model.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i');
  const rendering = /\\d{1,3}%|almost done|processing|generating|rendering/i;
  let blocks = [...document.querySelectorAll('div,li,article')].filter(b =>
    re.test(b.innerText || '') && (b.querySelector('video') || rendering.test(b.innerText || '')));
  // keep only LEAF cards (drop wrapper containers that contain another candidate)
  blocks = blocks.filter(b => !blocks.some(o => o !== b && b.contains(o)));
  const card = blocks[0];
  if (!card) return null;
  const v = card.querySelector('video');
  const txt = card.innerText || '';
  const cr = card.getBoundingClientRect();
  const dl = card.querySelector('button[aria-label="Download" i]')
    || (card.parentElement && card.parentElement.querySelector('button[aria-label="Download" i]'));
  const center = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  return {
    hasVideo: !!v,
    src: v ? (v.currentSrc || v.src || '') : '',
    pct: (txt.match(/\\b(\\d{1,3})%/) || [])[1] || (/almost done/i.test(txt) ? '~99' : ''),
    card: { x: cr.left + cr.width / 2, y: cr.top + cr.height / 2 },
    dl: dl ? center(dl) : null,
  }; }"""

# Fetch a URL inside the page (its cookies / signed URLs apply) and hand the bytes back as base64.
FETCH_B64_JS = """async (u) => {
  const b = new Uint8Array(await (await fetch(u)).arrayBuffer());
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return btoa(s); }"""


def rnd(a, b):
    return random.randint(a, b)


def vis(locator):
    """locator.is_visible(), False on any error (a bad or detached target is simply 'not there')."""
    try:
        return locator.is_visible()
    except Exception:
        return False


def shot(page, name, **kw):
    """Screenshot into video-creation/cache/elevenlabs-lipsync/shots/<name>."""
    path = cache_path("elevenlabs-lipsync", "shots", name)
    page.screenshot(path=str(path), **kw)
    return path


@contextmanager
def launch():
    """Open the elevenlabs-profile Chrome with a fresh tab. Yields (ctx, page); closes Chrome on exit."""
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE_DIR, channel="chrome", headless=False,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"],
            no_viewport=True, accept_downloads=True)
        try:
            ctx.add_init_script(MASK_WEBDRIVER)
            yield ctx, ctx.new_page()
        finally:
            try:
                ctx.close()
            except Exception:
                pass


def open_history(page, roles=("tab", "link"), wait_ms=2500):
    """Switch Image & Video to its History sub-tab (exact name). True when a History control was clicked."""
    cands = [page.get_by_role(r, name="History", exact=True) for r in roles]
    cands.append(page.get_by_text("History", exact=True))
    for c in cands:
        t = c.first
        if vis(t):
            try:
                t.click()
            except Exception:
                pass
            page.wait_for_timeout(wait_ms)
            return True
    return False


def run(main, label):
    """Run a script's main(); any error prints `<label> failed: <message>` and exits 1."""
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        print(f"{label} failed: {str(e).splitlines()[0] if str(e) else type(e).__name__}", file=sys.stderr)
        sys.exit(1)
