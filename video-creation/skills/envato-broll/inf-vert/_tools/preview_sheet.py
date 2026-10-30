#!/usr/bin/env python
"""preview_sheet.py <results.json> <pv_dir> <sheet_prefix> [--start N]
Fetch every candidate's previewVideo into pv_dir, ffprobe its dimensions (portrait previews are
taller than wide), and write labelled contact sheets (4 frames per PORTRAIT candidate) so the pick
is made by LOOKING. Prints one line per candidate: idx WxH orient dur title | url.
"""
import json
import subprocess
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

res_path, pv_dir, prefix = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
pv_dir.mkdir(parents=True, exist_ok=True)
items = json.loads(res_path.read_text(encoding="utf-8"))
font = ImageFont.load_default(size=16) if hasattr(ImageFont, "load_default") else None

tiles = []
for i, it in enumerate(items):
    pv = it.get("previewVideo") or ""
    f = pv_dir / f"{i:02d}.mp4"
    if pv and not f.exists():
        try:
            req = urllib.request.Request(pv, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as r:
                f.write_bytes(r.read())
        except Exception as e:
            print(f"{i:02d} FETCH-FAIL {e} | {it['title']}")
            continue
    if not f.exists():
        print(f"{i:02d} NO-PREVIEW | {it['title']}")
        continue
    p = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height", "-show_entries", "format=duration", "-of", "json", str(f)],
                       capture_output=True, text=True)
    j = json.loads(p.stdout or "{}")
    try:
        w, h = j["streams"][0]["width"], j["streams"][0]["height"]
        d = float(j["format"]["duration"])
    except Exception:
        print(f"{i:02d} PROBE-FAIL | {it['title']}")
        continue
    orient = "PORTRAIT" if h > w else ("square" if h == w else "landscape")
    print(f"{i:02d} {w}x{h} {orient} {it.get('duration')} {it['title']} | {it['author']} | {it['url'].split('?')[0]}")
    if orient != "PORTRAIT":
        continue
    frames = []
    for k, frac in enumerate((0.05, 0.35, 0.65, 0.95)):
        png = pv_dir / f"{i:02d}_f{k}.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{d * frac:.2f}", "-i", str(f), "-frames:v", "1",
                        "-vf", "scale=180:320", str(png)], capture_output=True)
        if png.exists():
            frames.append(Image.open(png).convert("RGB"))
    if not frames:
        continue
    tile = Image.new("RGB", (180 * 4 + 6, 320 + 24), (30, 30, 30))
    for k, fr in enumerate(frames):
        tile.paste(fr, (k * 182, 24))
    ImageDraw.Draw(tile).text((4, 2), f"#{i:02d} {it.get('duration')} {it['title'][:60]}", fill=(255, 255, 0), font=font)
    tiles.append(tile)

# 2 tiles per row, up to 6 tiles per sheet
for s in range(0, len(tiles), 6):
    chunk = tiles[s:s + 6]
    rows = (len(chunk) + 1) // 2
    tw, th = chunk[0].size
    sheet = Image.new("RGB", (tw * 2 + 10, th * rows + 5 * rows), (0, 0, 0))
    for n, t in enumerate(chunk):
        sheet.paste(t, ((n % 2) * (tw + 10), (n // 2) * (th + 5)))
    out = f"{prefix}_{s // 6}.jpg"
    sheet.save(out, quality=85)
    print("SHEET", out)
