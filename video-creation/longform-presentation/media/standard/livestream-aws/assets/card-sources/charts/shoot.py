#!/usr/bin/env python
"""shoot.py: screenshot every full-frame card of an HTML source file, one PNG per card, at an exact size.

The ONE screenshot step for this project's cards, charts and vertical cards, so every builder gets the same pixels.

  python shoot.py <source.html> --out <folder> [--size 1920x1080] [--only id,id | --prefix text]

A card is `<section class="frame" id="<name>">`: its `id` is the PNG's file name (`<name>.png`), exactly the script's
card name (`roadmap-harness`, `spawn-code-retry`, `the-job`). The frame must be exactly the requested size in CSS
pixels; the PNG is checked and a wrong size FAILS. The fonts are waited for, and a family the page asks for that did
not load is reported as a FAIL (a card in a fallback font is the drift this project forbids).

Machine line: SHOOT PASS|FAIL files=N out=<folder>
"""
import argparse
import struct
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

FONTS = ("Playfair Display", "DM Sans", "JetBrains Mono")


def png_size(path):
    with open(path, "rb") as f:
        head = f.read(24)
    return struct.unpack(">II", head[16:24])


def main():
    ap = argparse.ArgumentParser(description="Screenshot every section.frame of an HTML file to <out>/<id>.png")
    ap.add_argument("html")
    ap.add_argument("--out", required=True)
    ap.add_argument("--size", default="1920x1080", help="WIDTHxHEIGHT in pixels (1920x1080, or 1080x1920 for vertical)")
    ap.add_argument("--only", default=None, help="comma list of frame ids to shoot")
    ap.add_argument("--prefix", default=None, help="shoot only the frames whose id starts with this")
    a = ap.parse_args()
    src = Path(a.html).resolve()
    out = Path(a.out).resolve()
    w, h = (int(x) for x in a.size.lower().split("x"))
    only = set(a.only.split(",")) if a.only else None
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if not src.is_file():
        print(f"no such file: {src}")
        print(f"SHOOT FAIL files=0 out={out}")
        return 1
    out.mkdir(parents=True, exist_ok=True)
    fails, n = [], 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        page.on("pageerror", lambda e: fails.append(f"page error: {e}"))
        page.goto(src.as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        css = page.evaluate("Array.from(document.styleSheets).map(s => { try { return Array.from(s.cssRules).map(r => r.cssText).join(' ') } catch (e) { return '' } }).join(' ')")
        for fam in FONTS:
            if fam in css and not page.evaluate("f => document.fonts.check('16px \"' + f + '\"')", fam):
                fails.append(f"font not loaded: {fam} (the card would render in a fallback font)")
        ids = page.evaluate("Array.from(document.querySelectorAll('section.frame[id]')).map(e => e.id)")
        dup = sorted({i for i in ids if ids.count(i) > 1})
        if dup:
            fails.append(f"duplicate frame ids: {', '.join(dup)}")
        for fid in ids:
            if only and fid not in only:
                continue
            if a.prefix and not fid.startswith(a.prefix):
                continue
            el = page.locator(f'section.frame[id="{fid}"]')
            el.scroll_into_view_if_needed()
            dest = out / f"{fid}.png"
            el.screenshot(path=str(dest), animations="disabled")
            got = png_size(dest)
            n += 1
            if got != (w, h):
                fails.append(f"{fid}.png is {got[0]}x{got[1]}, not {w}x{h}: the frame is not exactly the requested size")
            print(f"  {dest.name}  {got[0]}x{got[1]}")
        browser.close()
    if not n:
        fails.append("no frame was shot (no section.frame[id] matched)")
    for f in fails:
        print(f"  FAIL  {f}")
    print(f"SHOOT {'FAIL' if fails else 'PASS'} files={n} out={out}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
