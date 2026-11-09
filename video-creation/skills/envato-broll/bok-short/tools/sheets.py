"""Fetch each search result's preview, keep only true portrait (ffprobe), and build a 4-frame contact sheet per slot."""
import json, subprocess, sys, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root = Path(sys.argv[1]); font = ImageFont.load_default(size=15)
for sid in sys.argv[2:]:
    p = root / "search" / f"{sid}.json"
    items = json.loads(p.read_text(encoding="utf-8"))
    tiles = []; n_portrait = 0
    for i, it in enumerate(items):
        it["i"] = i; it["portrait"] = False
        pv = it.get("previewVideo")
        if not pv: continue
        f = root / "pv" / f"{sid}-{i}.mp4"
        try:
            if not f.exists():
                req = urllib.request.Request(pv, headers={"User-Agent": "Mozilla/5.0"})
                f.write_bytes(urllib.request.urlopen(req, timeout=60).read())
            d = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(f)], capture_output=True, text=True).stdout.strip()
            w, h = (int(x) for x in d.split(",")[:2])
        except Exception as e:
            print(sid, i, "preview failed", e); continue
        it["dims"] = d; it["portrait"] = h > w
        if not it["portrait"]: continue
        n_portrait += 1
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)], capture_output=True, text=True).stdout.strip() or 0)
        t = Image.new("RGB", (137 * 4, 262), (30, 30, 30))
        for k, frac in enumerate((0.05, 0.35, 0.65, 0.95)):
            png = root / "pv" / "_t.png"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{dur*frac:.2f}", "-i", str(f), "-frames:v", "1", "-vf", "scale=135:240", str(png)], capture_output=True)
            if png.exists(): t.paste(Image.open(png).convert("RGB"), (k * 137, 22))
        ImageDraw.Draw(t).text((3, 2), f"#{i} {it.get('duration')} {it['title'][:58]}", fill=(255, 255, 0), font=font)
        tiles.append(t)
    p.write_text(json.dumps(items, indent=1, ensure_ascii=False), encoding="utf-8")
    print(sid, f"{n_portrait}/{len(items)} portrait")
    if tiles:
        cols = 3; rows = (len(tiles) + cols - 1) // cols; tw, th = tiles[0].size
        s = Image.new("RGB", (cols * (tw + 6), rows * (th + 4)))
        for n, t in enumerate(tiles): s.paste(t, ((n % cols) * (tw + 6), (n // cols) * (th + 4)))
        s.save(root / "sheets" / f"{sid}.jpg", quality=82)
