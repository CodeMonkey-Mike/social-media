# diag_chatgpt.py — diagnose why image capture failed. Sends ONE prompt in a fresh chat,
# logs every image-ish response URL with its content type, prints the assistant's last
# message and takes a screenshot. Python port of diag-chatgpt.js (2026-11-27; the JS was
# deleted the same day).
#
# It runs inside chat_pool.probe_session, so the chat it creates is registered, retired
# and deleted when it exits (the JS left an untitled chat behind on every run). The
# screenshot goes to %TEMP%\chatgpt-diag\, never into the repo.
#
# Usage: python repurpose/diag_chatgpt.py [--wait 120] [--prompt "..."]
# Needs the chatgpt profile free: do not run while an image run holds it.

import argparse
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool  # noqa: E402
import gen_images  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

DEFAULT_PROMPT = ("Generate an image: a simple glowing teal crypto coin on a dark "
                  "background, vertical 9:16, cinematic. No text.")
IMAGEISH_RE = re.compile(r"oaiusercontent|estuary|sandbox|files\.|image|\.png|\.webp|\.jpg", re.I)


def main():
    ap = argparse.ArgumentParser(description="Send one image prompt and log what comes back.")
    ap.add_argument("--wait", type=int, default=120,
                    help="seconds to wait after the prompt is sent (default 120)")
    ap.add_argument("--prompt", default=DEFAULT_PROMPT)
    args = ap.parse_args()

    hits = []

    def on_response(r):
        try:
            ct = r.headers.get("content-type", "")
            if ct.startswith("image/") or IMAGEISH_RE.search(r.url):
                hits.append(f"{ct:<14} {r.url[:160]}")
        except Exception:
            pass

    with pool.probe_session("diag") as page:
        page.on("response", on_response)
        print("URL after load:", page.url)
        composer_ok = gen_images.composer_loaded(page, 20000)
        print("composer found:", composer_ok)
        if composer_ok:
            page.locator(gen_images.COMPOSER_SEL).first.click()
            page.keyboard.type(args.prompt, delay=8)
            page.keyboard.press("Enter")
            print(f"prompt sent; waiting {args.wait}s...")
            page.wait_for_timeout(args.wait * 1000)

        try:
            texts = page.evaluate(gen_images._ASSISTANT_TEXTS_JS)
            last_msg = texts[-1][:400] if texts else "(no assistant message)"
        except Exception as e:
            last_msg = "eval err: " + str(e).splitlines()[0]

        gen_images.DIAG_DIR.mkdir(parents=True, exist_ok=True)
        shot = gen_images.DIAG_DIR / f"{time.strftime('%Y%m%d-%H%M%S')}-diag.png"
        try:
            page.screenshot(path=str(shot), full_page=False)
        except Exception as e:
            shot = "screenshot failed: " + str(e).splitlines()[0]

        unique = list(dict.fromkeys(hits))
        print("\n=== assistant last message ===\n" + last_msg)
        print(f"\n=== image-ish response URLs ({len(hits)}) ===")
        print("\n".join(unique[:40]))
        print("\nscreenshot:", shot)


if __name__ == "__main__":
    main()
