# gen_images.py — CANONICAL pool-managed ChatGPT image generator (Python port of
# gen-images.js, Wave 6 Lane 3 migration 2026-08-09; the JS twin is FROZEN rollback).
#
# Drives the SHARED chatgpt-profile Chrome via Playwright. Callers that can overlap a
# remotion-builder MUST hold the `chatgpt` stage lock around the run (lane3_batch.py
# does; the lock stays at the caller like it did for the JS).
#
# Usage: python gen_images.py --list <items.json> --prefix x-tweets|yt-posts|ig-single|ig-carousel
#   items.json: [{ "image_id":"ab12cd34", "slug":"my-slug", "prompt":"...",
#                  "ref": "C:\\...png" | ["...png", ...] (optional) }]
#   out: <images-base>/<x|yt|ig>/<prefix>-<image_id>-<slug>.png   (skips existing)
#
# Machine lines for the graph (per item + final):
#   IMG OK purpose=<p> id=<id> slug=<slug> bytes=<n> out=<path>
#   IMG SKIP purpose=<p> id=<id> slug=<slug> (exists)
#   IMG FAIL purpose=<p> id=<id> slug=<slug> reason=<...>
#   PROGRESS <n>%  ·  GEN DONE ok=N skip=N fail=N
# Exit 1 if any item failed (the graph HALTS; zero-retry doctrine lives above us —
# within a run each item gets the JS twin's single in-run retry, which is
# side-effect-safe for image gen, unlike posters).
#
# Ported hardening (2026-07-11 -> 2026-07-30, byte-faithful in behavior):
#   - RELOAD-based capture: send ONCE, poll the live DOM up to 80s, then RELOAD to
#     surface the server-side-finished image (automation-detected DOM can spin forever).
#     NEVER re-send on a hung DOM (a re-send = duplicate generation).
#   - Capture keys on the STABLE estuary file_id (id=file_...), which survives reloads.
#   - Ref upload BEFORE the baseline snapshot + POST-SEND RE-BASELINE at +3s: an
#     uploaded reference re-appears as an "unseen" file_id right after send and a naive
#     pick captures OUR OWN UPLOAD as the result (shipped a byte-identical kaspa-logo
#     as a finished image once, and cascaded filenames by one).
#   - Prefer estuary/content urls (generated) over oaiusercontent (uploads).
#   - MECHANICAL GATE: reject a capture byte-identical to any uploaded ref, and any
#     byte-dup of an existing sibling PNG (every image is unique).
#   - Modal dismissal for the full-screen "Compare responses" A/B overlay.
#   - Fresh-chat registration via chat_pool.confirm_and_register (API-confirmed id,
#     gated rename) AT BIRTH — right after the first send lands (2026-09-17; it used to
#     wait for the first successful image, which stranded an auto-titled chat on every
#     post-send failure: 68 piled up between 2026-08-04 and 09-13). Count via
#     record_image on success only.
#   - End of run, in a `finally` (crash/kill-proof): a chat born this run that holds
#     zero images is retired; chat_delete.sweep_retired runs (a sweep failure never
#     blocks the run); the run's journal window closes (reconcile_chats reads it).

import argparse
import json
import random
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool  # noqa: E402
import chat_delete  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PROFILE_DIR = pool.PROFILE_DIR           # one profile, defined once in chat_pool
REPO_ROOT = Path(__file__).resolve().parents[1]
IMG_BASE_DEFAULT = REPO_ROOT / "schedule-tweets" / "images"
IMAGE_URL_PATTERN = "estuary/content"
# The 2026-09-27 ChatGPT UI (Chat/Work toggle) dropped #prompt-textarea: the composer is now a bare
# ProseMirror div (role=textbox, aria-label "Ask ChatGPT", no id/data-id). Old selectors kept first.
COMPOSER_SEL = ('#prompt-textarea, div[contenteditable="true"][data-id], '
                'div.ProseMirror[contenteditable="true"][role="textbox"]')
FILE_ID_RE = re.compile(r"id=(file_[A-Za-z0-9]+)")

_GET_GEN_IMGS_JS = """
() => Array.from(document.querySelectorAll('img')).map(i => i.src)
  .filter(s => s.includes('estuary/content') || s.includes('oaiusercontent'))
"""


def subdir_for(prefix: str) -> str:
    return {"x-tweets": "x", "yt-posts": "yt",
            "ig-carousel": "ig", "ig-single": "ig"}.get(prefix, "x")


def ref_list(ref):
    """`ref` may be one path or a list (multi-coin lineups upload several)."""
    if not ref:
        return []
    return list(ref) if isinstance(ref, (list, tuple)) else [ref]


def file_id(src: str) -> str:
    m = FILE_ID_RE.search(src)
    return m.group(1) if m else src


def get_gen_imgs(page):
    return page.evaluate(_GET_GEN_IMGS_JS)


def composer_loaded(page, ms=12000) -> bool:
    try:
        page.locator(COMPOSER_SEL).first.wait_for(timeout=ms)
        return True
    except Exception:
        return False


def upload_ref(page, ref) -> bool:
    refs = ref_list(ref)
    if not refs:
        return False
    try:
        fi = page.locator('input[type="file"]').first
        fi.wait_for(state="attached", timeout=8000)
        fi.set_input_files(refs, timeout=8000)
        page.wait_for_timeout(4000 * len(refs))
        return True
    except Exception as e:
        print("   ref upload failed:", str(e).splitlines()[0])
        return False


_NEWEST_CONV_JS = r"""
async () => {
  const s = await fetch('/api/auth/session', { credentials: 'include' })
    .then(x => (x.ok ? x.json() : null)).catch(() => null);
  const tok = s && s.accessToken;
  if (!tok) return { error: 'no access token' };
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
  const l = await fetch('/backend-api/conversations?offset=0&limit=1&order=updated',
    { credentials: 'include', headers: H });
  if (!l.ok) return { error: 'conversations list HTTP ' + l.status };
  const j = await l.json();
  if (!j.items || !j.items.length) return { error: 'conversations list empty' };
  const it = j.items[0];
  const ageMin = (Date.now() - new Date(it.create_time).getTime()) / 60000;
  if (!(ageMin >= -5 && ageMin <= 10)) return { error: 'newest conversation is ' + Math.round(ageMin) + 'm old, not this run' };
  return { id: it.id };
}
"""


_CONV_IMAGES_JS = r"""
async (convId) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' }).then(x => x.ok ? x.json() : null).catch(() => null);
  const tok = s && s.accessToken; if (!tok) return { error: 'no token' };
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
  const g = await fetch('/backend-api/conversation/' + convId, { credentials: 'include', headers: H });
  if (!g.ok) return { error: 'conversation HTTP ' + g.status };
  const c = await g.json();
  const msgs = Object.values(c.mapping || {}).map(n => n.message).filter(Boolean).sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
  const out = [];
  for (const m of msgs) {
    const role = m.author && m.author.role;
    if (role !== 'tool' && role !== 'assistant') continue;
    for (const part of ((m.content && m.content.parts) || [])) {
      if (part && typeof part === 'object' && part.content_type === 'image_asset_pointer' && part.asset_pointer) {
        const id = part.asset_pointer.split('://')[1] || part.asset_pointer;
        out.push({ id, size: part.size_bytes || 0, w: part.width, h: part.height, t: m.create_time || 0 });
      }
    }
  }
  return { images: out };
}
"""

_FILE_URL_JS = r"""
async (fileId) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' }).then(x => x.ok ? x.json() : null).catch(() => null);
  const tok = s && s.accessToken; if (!tok) return { error: 'no token' };
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
  const d = await fetch('/backend-api/files/' + fileId + '/download', { credentials: 'include', headers: H });
  if (!d.ok) return { error: 'download HTTP ' + d.status };
  const j = await d.json();
  return { url: j.download_url || j.url || null, name: j.file_name || null };
}
"""


def conv_id_of(conv_url):
    if conv_url and "/c/" in conv_url:
        return conv_url.split("/c/")[1].split("?")[0].strip("/")
    return None


def api_new_image_url(page, conv_url, after_ts):
    """The signed download URL of the newest image the conversation holds that was created
    AFTER `after_ts` (the send), read through the backend API. None if not there yet."""
    conv_id = conv_id_of(conv_url)
    if not conv_id:
        return None
    try:
        r = page.evaluate(_CONV_IMAGES_JS, conv_id)
    except Exception as e:
        print(f"   api-capture: conversation read failed ({str(e).splitlines()[0][:80]})")
        return None
    if not isinstance(r, dict) or r.get("error"):
        print(f"   api-capture: {(r or {}).get('error')}")
        return None
    fresh = [im for im in r.get("images", []) if (im.get("t") or 0) >= after_ts - 5]
    if not fresh:
        return None
    im = sorted(fresh, key=lambda x: x.get("t") or 0)[-1]
    try:
        u = page.evaluate(_FILE_URL_JS, im["id"])
    except Exception as e:
        print(f"   api-capture: download-url failed ({str(e).splitlines()[0][:80]})")
        return None
    if not isinstance(u, dict) or not u.get("url"):
        print(f"   api-capture: no download url ({(u or {}).get('error')})")
        return None
    print(f"   api-capture: render {im['id']} ({im.get('w')}x{im.get('h')}, {im.get('size')} bytes) "
          "found via the backend API")
    return u["url"]


def api_fresh_ids(page, conv_url, after_ts):
    """file_ids of the images THIS conversation created after `after_ts`, per the
    backend API; None if it cannot be read. The reload path accepts only these: a
    reloaded page surfaces images the baseline never saw (older renders of a long pool
    chat, other chats' images), and a hung send that never generated anything used to
    capture one of those strays as the result (golden-kitty-dominance, 2026-09-25: a
    carousel slide captured another chat's tweet image, then an old carousel's slide)."""
    conv_id = conv_id_of(conv_url)
    if not conv_id:
        return None
    try:
        r = page.evaluate(_CONV_IMAGES_JS, conv_id)
    except Exception:
        return None
    if not isinstance(r, dict) or r.get("error"):
        return None
    return {im["id"] for im in r.get("images", []) if (im.get("t") or 0) >= after_ts - 5}


def resolve_conv_url(page, conv_url):
    """The /c/<id> URL of the conversation that is generating. A reload that lands
    anywhere else abandons the render, so never guess: current URL, else the backend
    API's newest just-created conversation, else None (caller must NOT navigate)."""
    if conv_url and "/c/" in conv_url:
        return conv_url
    if "/c/" in page.url:
        return page.url
    try:
        r = page.evaluate(_NEWEST_CONV_JS)
    except Exception as e:
        r = {"error": str(e).splitlines()[0]}
    if isinstance(r, dict) and r.get("id"):
        url = "https://chatgpt.com/c/" + r["id"]
        print(f"   conversation id resolved via backend API: {url}")
        return url
    print(f"   could not resolve the conversation URL ({(r or {}).get('error')}); "
          "staying on the page instead of reloading")
    return None


def goto_chat(page, url):
    page.goto(url)
    page.wait_for_load_state("domcontentloaded")
    composer_loaded(page, 30000)
    page.wait_for_timeout(3000)
    try:
        page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
    except Exception:
        pass
    page.wait_for_timeout(500)


def dismiss_dialog(page) -> bool:
    """ChatGPT occasionally throws a full-screen modal ("Compare responses" A/B eval)
    that overlays the composer and hangs the next prompt."""
    try:
        def is_open():
            return page.locator(
                'div[role="dialog"][data-state="open"], div[role="dialog"]').count() > 0
        if not is_open():
            return False
        print("   modal dialog present -> dismissing")
        for _ in range(3):
            page.keyboard.press("Escape")
            page.wait_for_timeout(700)
            if not is_open():
                return True
        for pat in (r"skip", r"no thanks", r"close", r"dismiss", r"done", r"prefer"):
            b = page.locator('div[role="dialog"] button',
                             has_text=re.compile(pat, re.IGNORECASE)).first
            if b.count():
                try:
                    b.click(timeout=4000)
                except Exception:
                    pass
                page.wait_for_timeout(700)
                if not is_open():
                    return True
        b0 = page.locator('div[role="dialog"] button').first
        if b0.count():
            try:
                b0.click(timeout=4000)
            except Exception:
                pass
            page.wait_for_timeout(700)
        if is_open():
            try:
                page.reload()
                page.wait_for_load_state("domcontentloaded")
            except Exception:
                pass
            page.wait_for_timeout(3000)
        return not is_open()
    except Exception:
        return False


class Generator:
    def __init__(self, prefix, images_base=None, registry=None, batch=None,
                 fake=False):
        self.prefix = prefix
        self.purpose = prefix                    # purpose == prefix, like the JS
        self.reg = registry                      # None = production registry
        self.batch = batch
        self.fake = fake
        base = Path(images_base) if images_base else IMG_BASE_DEFAULT
        self.outdir = base / subdir_for(prefix)
        self.outdir.mkdir(parents=True, exist_ok=True)
        self.page = None
        self.navigated_url = None    # the /c/ chat we're on (None = fresh chatgpt.com/)
        self.pending_fresh = False   # fresh chat awaiting registration (at its first send)
        self.born_url = None         # chat registered by THIS run (zero-image rule)
        self.run_id = None           # journal window id (chat_pool.journal_start)
        self._route = f"**/*{IMAGE_URL_PATTERN}*"

    def out_path(self, item) -> Path:
        return self.outdir / f"{self.prefix}-{item['image_id']}-{item['slug']}.png"

    # ── chat management (pool-managed, port of ensureChat/openFresh) ──────────

    def open_fresh(self):
        page = self.page
        page.route(self._route, lambda r: r.abort())
        page.goto("https://chatgpt.com/")
        page.wait_for_load_state("domcontentloaded")
        composer_loaded(page, 30000)
        page.wait_for_timeout(2500)
        page.unroute(self._route)
        self.navigated_url, self.pending_fresh = None, True
        print("  opened a FRESH chat (registers at its first send)")

    def ensure_chat(self):
        active = pool.get_active_url(self.purpose, self.reg)
        if not active:
            if not (self.navigated_url is None and self.pending_fresh):
                self.open_fresh()
            return
        if active == self.navigated_url:
            return                                   # already on it, has room
        page = self.page
        page.route(self._route, lambda r: r.abort())  # block history images during load
        page.goto(active)
        page.wait_for_load_state("domcontentloaded")
        ok = composer_loaded(page, 12000)
        page.wait_for_timeout(2500)
        page.unroute(self._route)
        if not ok:
            print("  stored chat unreachable/deleted -> markDead + fresh")
            pool.mark_dead(self.purpose, self.reg)
            self.open_fresh()
            return
        self.navigated_url, self.pending_fresh = active, False
        print(f"  reusing pool chat ({pool.count_for(self.purpose, self.reg)}"
              f"/{pool.cap(self.reg)}): {active}")

    # ── one image (port of genOne, all gates intact) ──────────────────────────

    def gen_one(self, item):
        page = self.page
        out_path = self.out_path(item)
        if out_path.exists():
            print(f"SKIP (exists) {item['slug']}")
            return "skip"
        dismiss_dialog(page)
        composer = page.locator(COMPOSER_SEL).first
        composer.click()
        page.wait_for_timeout(600)
        # Upload the ref FIRST, THEN snapshot: the ref must be part of the `before`
        # baseline or it looks like a brand-new file_id and gets captured as the result.
        if item.get("ref"):
            upload_ref(page, item["ref"])
            # let the editor finish re-rendering the attachment chip before typing: a
            # re-render mid-typing swallows the rest of the keystrokes (seen live 2026-09-10)
            page.wait_for_timeout(5000)
        before = {file_id(s) for s in get_gen_imgs(page)}
        want = " ".join(item["prompt"].split())
        typed_ok = False
        for attempt in range(1, 4):
            composer = page.locator(COMPOSER_SEL).first      # re-locate: the node can be replaced
            composer.click()
            page.wait_for_timeout(400)
            # ChatGPT restores an unsent DRAFT (an interrupted run leaves a half-typed
            # prompt behind) and a click lands mid-text; clear it first, every time.
            page.keyboard.press("Control+A")
            page.keyboard.press("Delete")
            page.wait_for_timeout(400)
            composer.click()
            page.keyboard.press("End")
            for ch in item["prompt"]:
                page.keyboard.type(ch)
                page.wait_for_timeout(random.randint(45, 69))
            page.wait_for_timeout(1000)
            try:
                got = " ".join(page.locator(COMPOSER_SEL).first.inner_text().split())
            except Exception:
                got = ""
            if got == want:
                typed_ok = True
                break
            print(f"   composer text != prompt after typing (attempt {attempt}: got {len(got)} "
                  f"chars, want {len(want)}); clearing and retyping")
        if not typed_ok:
            print(f"FAIL (composer never held the full prompt) {item['slug']}")
            return False
        page.wait_for_timeout(random.randint(6000, 9999))
        send_time = time.time()
        page.keyboard.press("Enter")
        # VERIFY THE SEND (2026-09-10 probe: in a fresh chat with an attachment, Enter no
        # longer submits; the prompt just sits in the composer). If the composer still holds
        # the prompt after 2 s, click the send button; if it still does, fail loudly.
        def composer_has_prompt():
            try:
                return len(" ".join(page.locator(COMPOSER_SEL).first.inner_text().split())) > 40
            except Exception:
                return False
        page.wait_for_timeout(2000)
        if composer_has_prompt():
            print("   Enter did not submit; clicking the send button")
            btn = page.locator('button[data-testid="send-button"], button[aria-label*="Send"]').first
            try:
                btn.click(timeout=5000)
            except Exception as e:
                print(f"   send button click failed: {str(e).splitlines()[0][:80]}")
            page.wait_for_timeout(2500)
            if composer_has_prompt():
                print(f"FAIL (message never submitted) {item['slug']}")
                return False
            send_time = time.time()
        # A fresh chat navigates chatgpt.com/ -> /c/<id> shortly AFTER the first send;
        # capture that url so a reload targets the generating chat.
        conv_url = page.url
        for _ in range(45):
            if "/c/" in conv_url:
                break
            page.wait_for_timeout(1000)
            conv_url = page.url
        if "/c/" not in conv_url:
            print("   fresh chat has not published its /c/ URL yet; will resolve via the "
                  "backend API before any reload")

        # POST-SEND RE-BASELINE: the attachment is not in the DOM as an estuary <img>
        # until the message is POSTED, so it re-appears as "unseen" right after send.
        # Nothing real completes in ~3s; fold everything present now into `before`.
        page.wait_for_timeout(3000)
        for s in get_gen_imgs(page):
            before.add(file_id(s))

        # BIRTH REGISTRATION (2026-09-17): the conversation exists server-side from this
        # send on, so register it NOW (API-confirmed id + gated rename), not after the
        # first successful image. Every post-send failure path (capture timeout, dup
        # reject, exception, kill) used to strand an auto-titled chat the sweep could not
        # see. Runs AFTER the re-baseline above on purpose: the rename routine can wait
        # up to ~1 min on ChatGPT's auto-title, and a baseline taken after that would
        # swallow a finished render. If it fails, pending_fresh stays set and the
        # post-success path in run() retries.
        if self.pending_fresh:
            self._register_born_chat()

        def pick_new():
            imgs = get_gen_imgs(page)
            news = [s for s in imgs if file_id(s) not in before]
            est = [s for s in news if "estuary/content" in s]
            cand = est if est else news
            return cand[-1] if cand else None       # newest unseen generated image

        def finish(src) -> bool:
            buf = None
            try:
                r = page.request.get(src)
                if r.ok:
                    buf = r.body()
            except Exception:
                pass
            if not buf or len(buf) < 5000:
                return False
            # Never accept our own uploaded reference as the output: identical bytes
            # prove a mis-capture (a model cannot reproduce an input byte-for-byte).
            # ...and not ANY reference this pipeline ever uploads: a sibling item's exemplar
            # was captured as a "render" on kaspa (2026-09-10, md5 == version4/slide.png).
            ref_paths = [Path(r) for r in ref_list(item.get("ref"))]
            for d in (IMG_BASE_DEFAULT / "reference", IMG_BASE_DEFAULT / "reference" / "carousels"):
                if d.is_dir():
                    ref_paths += [f for f in d.rglob("*") if f.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")]
            for rp in ref_paths:
                if not rp.exists() or rp.stat().st_size != len(buf):
                    continue
                if rp.read_bytes() == buf:
                    print(f"   REJECT: captured a reference file ({rp.name}), not a render "
                          f"({item['slug']}) - still waiting")
                    return False
            for sib in self.outdir.glob("*.png"):
                sb = sib.read_bytes()
                if len(sb) == len(buf) and sb == buf:
                    print(f"FAIL (dup of {sib.name}) {item['slug']}")
                    return False
            out_path.write_bytes(buf)
            print(f"OK {item['slug']} ({len(buf) // 1024} KB)")
            return True

        # PHASE 1: poll the LIVE DOM up to 80s (fast path).
        t0 = time.monotonic()
        while time.monotonic() - t0 < 80:
            page.wait_for_timeout(5000)
            src = pick_new()
            if src:
                page.wait_for_timeout(3000)
                src = pick_new() or src
                if finish(src):
                    page.wait_for_timeout(2000)
                    return True
        # PHASE 2: hung past 80s -> RELOAD to surface the server-side-finished image.
        print(f"   >80s no new image in live DOM (hung) -> reloading to capture "
              f"{item['slug']}")
        reload_url = resolve_conv_url(page, conv_url)
        if reload_url and "/c/" in reload_url:
            conv_url = reload_url
        # PHASE 2a (2026-09-10): the render exists server-side even when the DOM never
        # shows it. Read it through the backend API first (up to ~3 min), no reload.
        t_api = time.monotonic()
        while time.monotonic() - t_api < 180:
            url = api_new_image_url(page, conv_url, send_time)
            if url:
                if finish(url):
                    page.wait_for_timeout(1000)
                    return True
                break          # found but rejected (ref/dup): fall through to the reload path
            page.wait_for_timeout(15000)
        t1 = time.monotonic()
        while time.monotonic() - t1 < 240:
            if reload_url:
                goto_chat(page, reload_url)
                if "/c/" not in page.url:
                    print(f"   reload LEFT the conversation ({page.url}); going back to {reload_url}")
                    goto_chat(page, reload_url)
                dismiss_dialog(page)
            else:
                reload_url = resolve_conv_url(page, conv_url)   # keep trying to find it
            src = pick_new()
            if src:
                fresh = api_fresh_ids(page, reload_url, send_time)
                if fresh is None or file_id(src) not in fresh:
                    print(f"   REJECT: reloaded-page image {file_id(src)[:24]} is not a render this "
                          f"conversation made after the send ({item['slug']}) - still waiting")
                    src = None
            if src and finish(src):
                page.wait_for_timeout(2000)
                return True
            page.wait_for_timeout(15000)
        print(f"FAIL (timeout) {item['slug']}")
        return False

    # ── registry hygiene (2026-09-17) ─────────────────────────────────────────

    def _register_born_chat(self):
        """Register the fresh chat this run just created (see the BIRTH REGISTRATION
        note in gen_one). Never raises; a failure leaves pending_fresh set."""
        reg = pool.confirm_and_register(self.page, self.purpose, self.batch, self.reg)
        if reg:
            self.navigated_url = reg["url"]
            self.pending_fresh = False
            self.born_url = reg["url"]
        else:
            print("   birth registration failed; will retry after the first "
                  "successful image (reconcile_chats lists it for review if both fail)")

    def _end_of_run(self, ok, fail):
        """End-of-run hygiene, called from a `finally` so a crash, a timeout or a kill
        cannot skip it:
        1. ZERO-IMAGE RULE: a chat born this run that holds no image is retired (a
           fresh chat is free; a stranded one is sidebar sprawl).
        2. Sweep the retired queue (rotated / dead / zero-image chats) while the
           browser is open. A sweep failure never blocks the run — anything missed
           stays queued for repurpose/delete_chats.py (cleanup).
        3. Close the run's journal window (reconcile_chats' REVIEW class reads it)."""
        try:
            if self.born_url and pool.count_for_url(self.born_url, self.reg) == 0:
                pool.retire_url(self.born_url,
                                "zero images: born this run, produced nothing", self.reg)
        except Exception as e:
            print("  [chat-pool] zero-image retire error: " + str(e).splitlines()[0])
        try:
            chat_delete.sweep_retired(self.page, self.reg)
        except Exception as e:
            print("  [chat-delete] sweep error: " + str(e).splitlines()[0])
        try:
            pool.journal_end(self.run_id, self.reg, ok=ok, fail=fail, born=self.born_url)
        except Exception as e:
            print("  [chat-pool] journal error: " + str(e).splitlines()[0])

    # ── fake mode (SANDBOX ONLY — the graph passes it under --test-sandbox) ───

    def gen_one_fake(self, item):
        out_path = self.out_path(item)
        if out_path.exists():
            print(f"SKIP (exists) {item['slug']}")
            return "skip"
        from PIL import Image, ImageDraw
        dims = {"ig-single": (1024, 1280)}.get(self.prefix, (1024, 1024))
        img = Image.new("RGB", dims, (10, 14, 30))
        dr = ImageDraw.Draw(img)
        dr.text((40, 40), f"FAKE SANDBOX {self.prefix}\n{item['image_id']}\n"
                          f"{item['slug']}", fill=(58, 244, 66))
        img.save(out_path)
        print(f"OK {item['slug']} (FAKE sandbox render)")
        return True

    # ── run a list ────────────────────────────────────────────────────────────

    def run(self, items) -> dict:
        ok = skip = fail = 0
        results = []
        if self.fake:
            print(f"gen_images: {len(items)} images | purpose=\"{self.purpose}\" | "
                  "** FAKE SANDBOX MODE — no browser, placeholder renders **")
            for i, item in enumerate(items):
                r = self.gen_one_fake(item)
                ok, skip = ok + (r is True), skip + (r == "skip")
                results.append((item, r))
                self._emit(item, r)
                print(f"PROGRESS {int((i + 1) * 100 / len(items))}%")
            print(f"GEN DONE ok={ok} skip={skip} fail={fail}")
            return {"ok": ok, "skip": skip, "fail": fail}

        from playwright.sync_api import sync_playwright
        print(f"gen_images: {len(items)} images | purpose=\"{self.purpose}\" | "
              f"cap={pool.cap(self.reg)} | current count="
              f"{pool.count_for(self.purpose, self.reg)}")
        with sync_playwright() as p:
            browser = pool.launch_profile(p)
            self.page = browser.new_page()
            self.run_id = pool.journal_start(self.purpose, self.batch, self.reg)
            try:
                for i, item in enumerate(items):
                    if self.out_path(item).exists():
                        print(f"SKIP (exists) {item['slug']}")
                        skip += 1
                        self._emit(item, "skip")
                        continue
                    self.ensure_chat()
                    r = self.gen_one(item)
                    if r is False:
                        print("   retry once...")   # side-effect-safe for image gen
                        r = self.gen_one(item)
                    if r is True:
                        if self.pending_fresh:
                            reg = pool.confirm_and_register(
                                self.page, self.purpose, self.batch, self.reg)
                            if reg:
                                self.navigated_url = reg["url"]
                                self.pending_fresh = False
                        pool.record_image(self.purpose, self.reg)
                        ok += 1
                    elif r == "skip":
                        skip += 1
                    else:
                        fail += 1
                    self._emit(item, r)
                    print(f"PROGRESS {int((i + 1) * 100 / len(items))}%")
                print(f"\nDone: {ok + skip}/{len(items)} | {self.purpose} chat now "
                      f"{pool.count_for(self.purpose, self.reg)}/{pool.cap(self.reg)}")
            finally:
                # Success, exception and Ctrl-C alike: nothing born this run may outlive
                # it unregistered or, if it holds no image, at all.
                self._end_of_run(ok, fail)
                browser.close()
        print(f"GEN DONE ok={ok} skip={skip} fail={fail}")
        return {"ok": ok, "skip": skip, "fail": fail}

    def _emit(self, item, r):
        out = self.out_path(item)
        if r is True:
            print(f"IMG OK purpose={self.prefix} id={item['image_id']} "
                  f"slug={item['slug']} bytes={out.stat().st_size} out={out}")
        elif r == "skip":
            print(f"IMG SKIP purpose={self.prefix} id={item['image_id']} "
                  f"slug={item['slug']} (exists)")
        else:
            print(f"IMG FAIL purpose={self.prefix} id={item['image_id']} "
                  f"slug={item['slug']} reason=no-capture")


def main():
    ap = argparse.ArgumentParser(
        description="Pool-managed ChatGPT image generator (canonical Python port).")
    ap.add_argument("--list", required=True, help="items JSON path")
    ap.add_argument("--prefix", default="x-tweets",
                    choices=["x-tweets", "yt-posts", "ig-single", "ig-carousel"])
    ap.add_argument("--images-base", default=None,
                    help="override schedule-tweets/images (sandbox)")
    ap.add_argument("--registry", default=None,
                    help="override the chat registry path (sandbox)")
    ap.add_argument("--batch", default=None,
                    help="batches.json id to tie a fresh chat to (cleanup deletes it "
                         "when the batch completes)")
    ap.add_argument("--fake", action="store_true",
                    help="SANDBOX ONLY: placeholder renders, no browser")
    args = ap.parse_args()

    items = json.loads(Path(args.list).read_text(encoding="utf-8"))
    g = Generator(args.prefix, images_base=args.images_base, registry=args.registry,
                  batch=args.batch, fake=args.fake)
    res = g.run(items)
    sys.exit(1 if res["fail"] else 0)


if __name__ == "__main__":
    main()
