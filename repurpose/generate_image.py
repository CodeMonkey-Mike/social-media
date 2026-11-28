# generate_image.py — generate ONE image from the command line and save it under
# schedule-tweets/images/ as <prefix>-<image_id>-<slug>.png (Python port of
# generate-image.js, 2026-11-27; the JS was deleted the same day).
#
# It is a thin front end on the canonical stack: the item goes through
# gen_images.Generator (reload-based capture, ref-upload guards, byte-dup rejection,
# pool registration, retired-chat sweep), so nothing capture-related lives here.
#
# What changed from the JS, on purpose:
#   - The chat is POOL-MANAGED (chat_pool, purpose = --prefix): the active chat for the
#     purpose is reused until its cap, then rotated. The JS reused two hard-coded
#     "persistent" chats, one of which was retired as overloaded on 2026-06-05.
#     --chat-url still pins one specific /c/ chat when you need that.
#   - --reference-image may be given more than once (the JS took one).
#   - An existing output file is SKIPPED, like every tool on the stack. Move the old
#     file aside to regenerate under the same name.
#   - ig-single saves to images/ig/ (the stack's routing); the JS wrote it to images/.
#
# Usage:
#   python repurpose/generate_image.py --image-id <8hex> --slug <kebab-slug> --prompt "..."
#   python repurpose/generate_image.py --image-id <8hex> --slug <kebab-slug> --prompt-file <path>
#     opt: --prefix yt-posts            (default: x-tweets)
#     opt: --subdir version2            save into images/<subdir>/ instead of the prefix's folder
#     opt: --reference-image <path>     upload as a reference (repeatable)
#     opt: --chat-url <https://chatgpt.com/c/...>   pin one chat instead of the pool's
#
# For 2+ images write an items list and run gen_images.py (one browser session, the same
# pool). Prereq: chatgpt-profile is logged in (python repurpose/setup_chatgpt.py, once).
#
# ⚠ Callers that can overlap another ChatGPT run MUST hold the `chatgpt` stage lock,
#   exactly as for gen_images.py / gen_batch.py.

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gen_images  # noqa: E402
from gen_batch import BatchGenerator  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def read_prompt(args, ap) -> str:
    """--prompt, or the trimmed contents of --prompt-file (exactly one is required)."""
    if bool(args.prompt) == bool(args.prompt_file):
        ap.error("give exactly one of --prompt / --prompt-file")
    if args.prompt:
        return args.prompt
    f = Path(args.prompt_file)
    if not f.is_file():
        ap.error(f"prompt file not found: {f}")
    return f.read_text(encoding="utf-8-sig").strip()


def check_refs(refs, ap):
    for r in refs or []:
        if not Path(r).is_file():
            ap.error(f"reference image not found: {r}")
    return list(refs or [])


def main():
    ap = argparse.ArgumentParser(
        description="Generate ONE ChatGPT image into schedule-tweets/images/ "
                    "(Python port of generate-image.js, on the gen_images stack).")
    ap.add_argument("--image-id", required=True, help="8 hex chars")
    ap.add_argument("--slug", required=True, help="lowercase kebab-case")
    ap.add_argument("--prompt", default=None)
    ap.add_argument("--prompt-file", default=None)
    ap.add_argument("--prefix", default="x-tweets",
                    help="filename prefix and pool purpose (default: x-tweets)")
    ap.add_argument("--subdir", default=None,
                    help="save into images/<subdir>/ instead of the prefix's folder")
    ap.add_argument("--reference-image", action="append", default=[],
                    help="reference image to upload (repeatable)")
    ap.add_argument("--chat-url", default=None,
                    help="pin one /c/ chat instead of the pool's chat for the purpose")
    ap.add_argument("--images-base", default=None,
                    help="override schedule-tweets/images (sandbox)")
    ap.add_argument("--registry", default=None, help="registry override (sandbox)")
    ap.add_argument("--fake", action="store_true",
                    help="SANDBOX/TEST ONLY: placeholder render, no browser")
    args = ap.parse_args()

    if not re.fullmatch(r"[a-fA-F0-9]{8}", args.image_id):
        ap.error(f"--image-id must be 8 hex chars, got: {args.image_id}")
    for name, val in (("--slug", args.slug), ("--prefix", args.prefix)):
        if not re.fullmatch(r"[a-z0-9-]+", val):
            ap.error(f"{name} must be lowercase kebab-case, got: {val}")
    if args.chat_url and not re.search(r"chatgpt\.com/c/", args.chat_url):
        ap.error("--chat-url must be a /c/<id> chat, never a fresh chatgpt.com/ page "
                 "(leave it out and the pool picks the chat)")
    prompt = read_prompt(args, ap)
    refs = check_refs(args.reference_image, ap)

    base = Path(args.images_base) if args.images_base else gen_images.IMG_BASE_DEFAULT
    outdir = base / (args.subdir or gen_images.subdir_for(args.prefix))
    item = {
        "image_id": args.image_id, "slug": args.slug, "prompt": prompt,
        "ref": refs or None,
        "_out": outdir / f"{args.prefix}-{args.image_id}-{args.slug}.png",
    }
    print(f"Target: {item['_out']}")
    print(f"Prompt length: {len(prompt)} chars")

    g = BatchGenerator(args.prefix, outdir, purpose=args.prefix, chat_url=args.chat_url,
                       registry=args.registry, fake=args.fake)
    res = g.run([item])
    sys.exit(1 if res["fail"] else 0)


if __name__ == "__main__":
    main()
