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
#     gated rename) after the FIRST successful image; count via record_image.
#   - End of run: chat_delete.sweep_retired (a sweep failure never blocks the run).

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

PROFILE_DIR = r"C:\Users\mnede\AppData\Local\Google\Chrome\chatgpt-profile"
REPO_ROOT = Path(__file__).resolve().parents[1]
IMG_BASE_DEFAULT = REPO_ROOT / "schedule-tweets" / "images"
IMAGE_URL_PATTERN = "estuary/content"
COMPOSER_SEL = '#prompt-textarea, div[contenteditable="true"][data-id]'
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
        self.pending_fresh = False   # register its /c/ url after the first success
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
        print("  opened a FRESH chat (will register its URL after first image)")

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
        before = {file_id(s) for s in get_gen_imgs(page)}
        composer.click()
        for ch in item["prompt"]:
            page.keyboard.type(ch)
            page.wait_for_timeout(random.randint(45, 69))
        page.wait_for_timeout(random.randint(6000, 9999))
        page.keyboard.press("Enter")
        # A fresh chat navigates chatgpt.com/ -> /c/<id> shortly AFTER the first send;
        # capture that url so a reload targets the generating chat.
        conv_url = page.url
        for _ in range(20):
            if "/c/" in conv_url:
                break
            page.wait_for_timeout(1000)
            conv_url = page.url

        # POST-SEND RE-BASELINE: the attachment is not in the DOM as an estuary <img>
        # until the message is POSTED, so it re-appears as "unseen" right after send.
        # Nothing real completes in ~3s; fold everything present now into `before`.
        page.wait_for_timeout(3000)
        for s in get_gen_imgs(page):
            before.add(file_id(s))

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
            for rp in ref_list(item.get("ref")):
                rp = Path(rp)
                if not rp.exists():
                    continue
                rb = rp.read_bytes()
                if len(rb) == len(buf) and rb == buf:
                    print(f"   REJECT: captured the uploaded reference, not a render "
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
        reload_url = conv_url if "/c/" in conv_url else page.url
        t1 = time.monotonic()
        while time.monotonic() - t1 < 240:
            goto_chat(page, reload_url)
            dismiss_dialog(page)
            src = pick_new()
            if src and finish(src):
                page.wait_for_timeout(2000)
                return True
            page.wait_for_timeout(15000)
        print(f"FAIL (timeout) {item['slug']}")
        return False

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
            browser = p.chromium.launch_persistent_context(
                PROFILE_DIR, channel="chrome", headless=False,
                ignore_default_args=["--enable-automation"],
                args=["--disable-blink-features=AutomationControlled"],
                no_viewport=True)
            browser.add_init_script(
                "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            self.page = browser.new_page()
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
                # Delete rotated-out/dead chats while the browser is open. A sweep
                # failure never blocks the run — chats stay queued for the next sweep.
                try:
                    chat_delete.sweep_retired(self.page, self.reg)
                except Exception as e:
                    print("  [chat-delete] sweep error: " + str(e).splitlines()[0])
            finally:
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
