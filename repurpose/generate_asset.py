# generate_asset.py — generate ONE image to any output path (a video asset, a test
# image). Python port of generate-asset.js, 2026-11-27; the JS was deleted the same day.
#
# Same idea as generate_image.py, but the destination is a path you name instead of the
# schedule-tweets/images/ folder. It is a thin front end on the canonical stack
# (gen_images.Generator through gen_batch.BatchGenerator), so the capture hardening,
# the byte-dup gate and the chat registration all come from there.
#
# What changed from the JS, on purpose:
#   - The run's chat is REGISTERED in the chat registry (purpose `broll-asset`, title
#     "b-roll: broll-asset") and the previous asset chat is retired and deleted. The JS
#     opened a fresh chat nobody tracked, so each run left one in the sidebar.
#   - An existing output file is SKIPPED. Move it aside to regenerate.
#   - --reference-image is accepted (repeatable); the JS had no reference upload.
#
# Usage:
#   python repurpose/generate_asset.py --output <path.png> --prompt "..."
#   python repurpose/generate_asset.py --output <path.png> --prompt-file <path>
#     opt: --reference-image <path>   upload as a reference (repeatable)
#     opt: --chat-url <https://chatgpt.com/c/...>   continue in one specific chat
#     opt: --purpose <name>           registry purpose (default: broll-asset)
#
# For a list of images use gen_batch.py ([{file, prompt}] items, one browser session).
#
# ⚠ Callers that can overlap another ChatGPT run MUST hold the `chatgpt` stage lock.

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gen_batch import BatchGenerator  # noqa: E402
from generate_image import check_refs, read_prompt  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PREFIX = "asset"


def main():
    ap = argparse.ArgumentParser(
        description="Generate ONE ChatGPT image to any path "
                    "(Python port of generate-asset.js, on the gen_images stack).")
    ap.add_argument("--output", required=True, help="where to save the PNG")
    ap.add_argument("--prompt", default=None)
    ap.add_argument("--prompt-file", default=None)
    ap.add_argument("--reference-image", action="append", default=[],
                    help="reference image to upload (repeatable)")
    ap.add_argument("--chat-url", default=None,
                    help="continue in one specific /c/ chat instead of a fresh one")
    ap.add_argument("--purpose", default="broll-asset",
                    help="chat registry purpose (default: broll-asset)")
    ap.add_argument("--registry", default=None, help="registry override (sandbox)")
    ap.add_argument("--fake", action="store_true",
                    help="SANDBOX/TEST ONLY: placeholder render, no browser")
    args = ap.parse_args()

    if args.chat_url and not re.search(r"chatgpt\.com/c/", args.chat_url):
        ap.error("--chat-url must be a /c/<id> chat (leave it out for a fresh chat)")
    prompt = read_prompt(args, ap)
    refs = check_refs(args.reference_image, ap)

    out = Path(args.output).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    item = {"image_id": PREFIX, "slug": out.stem, "prompt": prompt,
            "ref": refs or None, "_out": out}
    print(f"Output : {out}")
    print(f"Prompt : {prompt[:120]}...")

    # fresh=True: one brand-new chat for this run, like the JS; --chat-url pins instead.
    g = BatchGenerator(PREFIX, out.parent, purpose=args.purpose, fresh=True,
                       chat_url=args.chat_url, registry=args.registry, fake=args.fake)
    res = g.run([item])
    sys.exit(1 if res["fail"] else 0)


if __name__ == "__main__":
    main()
