"""Per-slot candidate contact sheet for the AI vs ML vertical b-roll re-source.
Usage: python preview_sheet.py <search.json> <slot> [--only 0,3,5]
Downloads each candidate's previewVideo into ../prev/<slot>/, ffprobes it (portrait = h > w), pulls 3 frames
(15/50/85%), and writes ../<slot>-sheet.jpg with an index + dims + duration label per candidate."""
import json, subprocess, sys, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

src, slot = Path(sys.argv[1]), sys.argv[2]
only = None
if "--only" in sys.argv:
    only = {int(x) for x in sys.argv[sys.argv.index("--only") + 1].split(",")}
root = src.parent
pdir = root / "prev" / slot
pdir.mkdir(parents=True, exist_ok=True)
cands = json.loads(src.read_text(encoding="utf-8"))
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
tiles = []
for i, c in enumerate(cands):
    if only is not None and i not in only:
        continue
    pv = c.get("previewVideo")
    if not pv:
        print(i, "NO PREVIEW", c["title"][:70]); continue
    mp4 = pdir / f"{i:02d}.mp4"
    if not mp4.exists():
        try:
            req = urllib.request.Request(pv, headers={"User-Agent": "Mozilla/5.0"})
            mp4.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        except Exception as e:
            print(i, "DL FAIL", e); continue
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                          "-show_entries", "format=duration", "-of", "json", str(mp4)], capture_output=True, text=True).stdout
    j = json.loads(out)
    w, h = j["streams"][0]["width"], j["streams"][0]["height"]
    dur = float(j["format"]["duration"])
    portrait = h > w
    frames = []
    for k, f in enumerate((0.15, 0.5, 0.85)):
        jp = pdir / f"{i:02d}-{k}.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{dur * f:.2f}", "-i", str(mp4), "-frames:v", "1", str(jp)])
        im = Image.open(jp).convert("RGB")
        im.thumbnail((152, 270))
        frames.append(im)
    tw = sum(f.width for f in frames) + 8
    tile = Image.new("RGB", (max(tw, 300), 300), (30, 30, 30))
    x = 0
    for f in frames:
        tile.paste(f, (x, 28)); x += f.width + 4
    d = ImageDraw.Draw(tile)
    d.text((4, 4), f"#{i}  {w}x{h}  {dur:.1f}s {'PORTRAIT' if portrait else 'LANDSCAPE'}", fill=(255, 255, 0) if portrait else (255, 80, 80), font=font)
    tiles.append(tile)
    print(i, f"{w}x{h}", f"{dur:.1f}s", "PORTRAIT" if portrait else "LANDSCAPE", "|", c["title"][:80])
if tiles:
    cols = 4
    tw, th = max(t.width for t in tiles), 300
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw, rows * th), (0, 0, 0))
    for n, t in enumerate(tiles):
        sheet.paste(t, ((n % cols) * tw, (n // cols) * th))
    sp = root / f"{slot}-sheet.jpg"
    sheet.save(sp, quality=85)
    print("sheet:", sp)
