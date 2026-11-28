#!/usr/bin/env python
"""
render_containers.py: screenshot every standalone container (`section.frame#cNN`) of an ai-engineering deck
to `render-assets/container-NN.png`.

Python port of `render-containers.js` and `render-containers-vertical.js` (2026-11-27). Those two lived only
inside each video's own `scripts/` folder, so they went whenever a finished project folder was deleted and the
next video had to copy them from the last one. This is the one durable copy: the project supplies only its deck.

  16:9         <project>/deck/containers.html           -> <project>/render-assets/container-NN.png
               1920x1080 @2x = 3840x2160
  --vertical   <project>/deck/containers-vertical.html  -> <project>/render-assets/vertical/container-NN.png
               1080x1920 @2x = 2160x3840

Usage:
  python video-creation/ai-engineering/skills/deck-and-containers/render_containers.py "<media/<video> folder>"
  python .../render_containers.py "<project>" 14 7          # only c14 and c07
  python .../render_containers.py "<project>" --vertical    # the 9:16 deck
  python .../render_containers.py --deck <deck.html> --out <folder> [--vertical] [NN ...]
        any deck to any folder, e.g. a reference deck into a scratch folder to look at a component

The deck's fonts (Playfair Display, JetBrains Mono, DM Sans) come from Google Fonts, so this needs the network;
it waits for them so a fallback font is never captured. Every PNG still goes through the `visual-qa` agent
before it is used (deck-and-containers.md).
"""
import argparse
import re
import sys
from pathlib import Path

SIZES = {False: (1920, 1080), True: (1080, 1920)}   # vertical? -> viewport (rendered @2x)


def frame_number(frame_id: str) -> str:
    """'c14' -> '14', 'c14b' -> '14b' (drop the leading 'c', as the JS did)."""
    return frame_id.replace("c", "", 1)


def normalize(n: str) -> str:
    """What the caller typed -> the number in the file name: '7' -> '07', 'c7' -> '07', '14b' -> '14b'."""
    m = re.fullmatch(r"c?(\d+)(\D*)", n.strip())
    return f"{int(m.group(1)):02d}{m.group(2)}" if m else n.strip()


def resolve(args, ap):
    """-> (deck html, output folder, the set of numbers to render or an empty set for all)."""
    items = list(args.items)
    if args.deck or args.out:
        if not (args.deck and args.out):
            ap.error("--deck and --out go together")
        deck, out = Path(args.deck), Path(args.out)
    else:
        if not items:
            ap.error("give the video's project folder (or --deck with --out)")
        project = Path(items.pop(0))
        deck = project / "deck" / ("containers-vertical.html" if args.vertical else "containers.html")
        out = project / "render-assets" / "vertical" if args.vertical else project / "render-assets"
    if not deck.is_file():
        ap.error(f"deck not found: {deck}")
    return deck, out, {normalize(n) for n in items}


def main():
    ap = argparse.ArgumentParser(description="Screenshot each #cNN container of an ai-engineering deck to a PNG.")
    ap.add_argument("items", nargs="*", metavar="PROJECT [NN ...]",
                    help="the video's media/<name> folder, then the container numbers to render (default: all)")
    ap.add_argument("--vertical", action="store_true", help="the 9:16 deck (1080x1920 @2x)")
    ap.add_argument("--deck", default=None, help="render this deck file (needs --out; then every item is a number)")
    ap.add_argument("--out", default=None, help="write the PNGs to this folder (needs --deck)")
    args = ap.parse_args()
    deck, out, only = resolve(args, ap)
    width, height = SIZES[args.vertical]

    from playwright.sync_api import sync_playwright
    out.mkdir(parents=True, exist_ok=True)
    done = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        try:
            page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=2)
            page.goto(deck.resolve().as_uri(), wait_until="networkidle")
            page.evaluate("() => document.fonts.ready.then(() => true)")   # real fonts, never a fallback
            page.wait_for_timeout(400)
            ids = page.eval_on_selector_all("section.frame", "els => els.map(e => e.id)")
            for frame_id in ids:
                nn = frame_number(frame_id)
                if only and nn not in only:
                    continue
                target = out / f"container-{nn}.png"
                page.locator(f"#{frame_id}").screenshot(path=str(target))
                done.append(nn)
                print("rendered", frame_id, "->", target.name)
        finally:
            browser.close()

    kind = "vertical container(s)" if args.vertical else "container(s)"
    print(f"\nDONE: {len(done)} {kind} -> {out}")
    missing = sorted(only - set(done))
    if missing:
        print(f"NOT IN THE DECK: {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)
    if not done:
        print("the deck has no section.frame containers", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
