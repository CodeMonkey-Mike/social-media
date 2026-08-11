# gen_batch.py — CANONICAL builder-facing ChatGPT batch image generator (Python port
# of gen-batch-freshchat.js + generate-broll-reload.js, 2026-08-11; both JS twins are
# FROZEN rollback). This closes the last still-JS execution path in the livestream
# lanes — the Phase 7 builder b-roll pipeline.
#
# It is a thin routing/semantics wrapper over gen_images.Generator, which already
# carries every piece of blessed capture hardening (reload-after-80s, stable
# estuary file_id keying, ref-upload-before-baseline + post-send re-baseline,
# estuary preference over oaiusercontent, ref-byte + sibling-dup rejection, modal
# dismissal, draft-guard via fresh composer state, pool registration + retired-chat
# sweep). Nothing capture-related is reimplemented here.
#
# The two JS behaviors it unifies:
#   FRESH-CHAT batches (gen-batch-freshchat.js): --fresh opens a brand-new chat for
#     the whole list (one-off batches: a project's b-roll, persona images), registers
#     it in the shared registry after the first success (API-confirmed id, gated
#     rename), tied to --chat-batch/--batch for cleanup.
#   POOL b-roll (generate-broll-reload.js): default for --prefix broll without
#     --fresh — reuses the active "broll" pool chat until cap, then rotates, exactly
#     like Lane 3's queue images. --chat-url pins a specific /c/ chat instead.
#
# Item schemas (both accepted, mixed lists fine):
#   { "image_id": "ab12cd34", "slug": "my-slug", "prompt": "...",
#     "ref": "C:\\...png" | ["...", ...] }            (freshchat shape)
#   { "file": "..\\shorts\\<b>\\render-assets\\broll-x.png", "prompt": "..." }
#     (broll-reload shape; `file` resolves like the JS did — absolute wins, else
#      relative to video-creation/assets so legacy ..\shorts\ lists still land in
#      the batch's own render-assets/)
#
# Output routing (track-aware, Mike 2026-06-18 / 2026-06-25):
#   --outdir <abs>      LONGFORM/PERSONA: the project's OWN render-assets/ folder.
#   --batch <id>        SHORTS: video-creation/shorts/<id>/render-assets/.
#   (neither)           schedule-tweets/images/<x|yt|ig> per --prefix.
#   b-roll may NEVER resolve under the shared video-creation/assets tree; that
#   misroute is refused up front, same as the JS guard.
#
# Machine lines (graph-ready, same contract as gen_images.py):
#   IMG OK/SKIP/FAIL ... · PROGRESS n% · GEN DONE ok=N skip=N fail=N   exit 1 on fail
#
# ⚠ Callers that can overlap another ChatGPT run MUST hold the `chatgpt` stage lock
#   (video-creation/shorts/_tooling/stage_lock.py) around the run, exactly as the
#   remotion-shorts-build skill documents. The lock stays at the caller.

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gen_images  # noqa: E402
from gen_images import Generator, goto_chat  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parents[1]
VIDEO_CREATION = REPO_ROOT / "video-creation"
VIDEO_ASSETS = VIDEO_CREATION / "assets"
IMG_BASE = REPO_ROOT / "schedule-tweets" / "images"


def _slug_from_file(p: Path) -> str:
    return p.stem


def normalize_items(raw, outdir: Path, prefix: str):
    """Fold both item schemas into the freshchat shape + an explicit absolute out
    path (`_out`), so the Generator's gates (skip-exists, ref rejection, sibling
    byte-dup) all run against the real destination."""
    items = []
    for i, it in enumerate(raw):
        if "file" in it:
            f = Path(it["file"])
            out = f if f.is_absolute() else (VIDEO_ASSETS / f).resolve()
            item = {
                "image_id": it.get("image_id") or f"file{i + 1}",
                "slug": it.get("slug") or _slug_from_file(out),
                "prompt": it["prompt"],
                "ref": it.get("ref"),
                "_out": out,
            }
        else:
            item = dict(it)
            item["_out"] = outdir / f"{prefix}-{it['image_id']}-{it['slug']}.png"
        items.append(item)
    return items


class BatchGenerator(Generator):
    """gen_images.Generator with the two builder-facing deviations: per-item
    explicit out paths, and fresh-always / pinned-chat modes."""

    def __init__(self, prefix, outdir, purpose=None, batch=None, fresh=False,
                 chat_url=None, registry=None, fake=False):
        super().__init__(prefix, images_base=None, registry=registry, batch=batch,
                         fake=fake)
        self.outdir = Path(outdir)
        self.outdir.mkdir(parents=True, exist_ok=True)
        if purpose:
            self.purpose = purpose               # registry purpose ≠ prefix here
        self.fresh_always = fresh
        self.chat_url = chat_url                 # pinned /c/ chat (no registration)

    def out_path(self, item) -> Path:
        return Path(item["_out"])

    def ensure_chat(self):
        if self.chat_url:
            if self.navigated_url == self.chat_url:
                return
            goto_chat(self.page, self.chat_url)
            self.navigated_url, self.pending_fresh = self.chat_url, False
            print(f"  pinned chat: {self.chat_url}")
            return
        if self.fresh_always:
            # ONE fresh chat for the whole list: open it once, then stay on it
            # (after the first success it registers and navigated_url is set).
            if self.pending_fresh or self.navigated_url:
                return
            self.open_fresh()
            return
        super().ensure_chat()                    # pool-managed (broll default)


def main():
    ap = argparse.ArgumentParser(
        description="Builder-facing ChatGPT batch image generator (canonical "
                    "Python port of gen-batch-freshchat.js + generate-broll-reload.js).")
    ap.add_argument("--list", required=True, help="items JSON path (either schema)")
    ap.add_argument("--prefix", default="broll",
                    help="filename prefix / routing hint (broll, x-tweets, yt-posts, "
                         "ig-single, ig-carousel, ...)")
    ap.add_argument("--batch", default=None,
                    help="SHORTS batch id -> shorts/<id>/render-assets/")
    ap.add_argument("--outdir", default=None,
                    help="absolute output dir (LONGFORM/PERSONA project folder); "
                         "overrides --batch")
    ap.add_argument("--purpose", default=None,
                    help="chat registry purpose (default: --prefix; broll lists "
                         "default to 'broll')")
    ap.add_argument("--chat-batch", default=None,
                    help="batches.json id to tie a FRESH chat to (cleanup deletes "
                         "the chat when that batch completes); defaults to --batch")
    ap.add_argument("--fresh", action="store_true",
                    help="always open a brand-new chat for this list "
                         "(gen-batch-freshchat semantics)")
    ap.add_argument("--chat-url", default=None,
                    help="pin a specific /c/ chat (generate-broll-reload override)")
    ap.add_argument("--registry", default=None, help="registry override (sandbox)")
    ap.add_argument("--fake", action="store_true",
                    help="SANDBOX/TEST ONLY: placeholder renders, no browser")
    args = ap.parse_args()

    outdir = (Path(args.outdir) if args.outdir
              else (VIDEO_CREATION / "shorts" / args.batch / "render-assets")
              if args.batch
              else IMG_BASE / gen_images.subdir_for(args.prefix))

    raw = json.loads(Path(args.list).read_text(encoding="utf-8-sig"))
    items = normalize_items(raw, outdir, args.prefix)

    # The JS guard, kept verbatim in spirit: b-roll never writes under the shared
    # assets tree (loose b-roll there is the regression this prevents).
    if args.prefix.lower().startswith("broll"):
        if not args.batch and not args.outdir and not all(
                "file" in it for it in raw):
            sys.exit("ERROR: --prefix broll requires --batch=<id> (SHORTS -> "
                     "shorts/<id>/render-assets/) or --outdir (LONGFORM/PERSONA "
                     "-> the project folder). Refusing to mis-route b-roll.")
        root = VIDEO_ASSETS.resolve()
        for it in items:
            out = Path(it["_out"]).resolve()
            if out == root or root in out.parents:
                sys.exit(f"ERROR: refusing to write b-roll under the shared assets "
                         f"tree ({out}). Use --batch or --outdir at the project "
                         "folder.")

    for it in items:                     # the JS mkdir'd each item's parent
        Path(it["_out"]).parent.mkdir(parents=True, exist_ok=True)

    purpose = args.purpose or ("broll" if args.prefix.lower().startswith("broll")
                               else args.prefix)
    g = BatchGenerator(args.prefix, outdir, purpose=purpose,
                       batch=args.chat_batch or args.batch, fresh=args.fresh,
                       chat_url=args.chat_url, registry=args.registry,
                       fake=args.fake)
    res = g.run(items)
    sys.exit(1 if res["fail"] else 0)


if __name__ == "__main__":
    main()
