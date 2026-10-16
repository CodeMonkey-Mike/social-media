"""Build a contact sheet per slot: each candidate's preview video -> 4 frames (5/35/65/95 %), labelled.
usage: python -I sheet.py <root re/> <id> [<id> ...]   (results/<id>.json -> prev/<id>/cK.mp4 -> sheets/<id>.jpg)"""
import json, subprocess, sys, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(sys.argv[1])
W, H = 320, 180
try:
    font = ImageFont.truetype("arial.ttf", 15)
except Exception:
    font = ImageFont.load_default()

def probe(p):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height:format=duration", "-of", "json", str(p)], capture_output=True, text=True).stdout
    j = json.loads(o or "{}")
    s = (j.get("streams") or [{}])[0]
    return s.get("width"), s.get("height"), float(j.get("format", {}).get("duration", 0) or 0)

for sid in sys.argv[2:]:
    res = json.load(open(root / "results" / f"{sid}.json", encoding="utf-8"))
    pdir = root / "prev" / sid
    pdir.mkdir(parents=True, exist_ok=True)
    rows = []
    for k, c in enumerate(res):
        mp4 = pdir / f"c{k}.mp4"
        if c.get("previewVideo") and not mp4.exists():
            try:
                req = urllib.request.Request(c["previewVideo"], headers={"User-Agent": "Mozilla/5.0"})
                mp4.write_bytes(urllib.request.urlopen(req, timeout=60).read())
            except Exception as e:
                print(sid, k, "preview fetch failed", e)
        frames = []
        w = h = None; dur = 0
        if mp4.exists():
            w, h, dur = probe(mp4)
            for pct in (0.05, 0.35, 0.65, 0.95):
                fp = pdir / f"c{k}_{int(pct*100)}.jpg"
                if not fp.exists():
                    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{dur*pct:.2f}", "-i", str(mp4),
                                    "-frames:v", "1", "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2", str(fp)])
                frames.append(fp)
        rows.append((k, c, frames, w, h, dur))
    sheet = Image.new("RGB", (W * 4, len(rows) * (H + 24)), (30, 30, 30))
    d = ImageDraw.Draw(sheet)
    for r, (k, c, frames, w, h, dur) in enumerate(rows):
        y = r * (H + 24)
        d.text((4, y + 3), f"c{k}  {c['duration']}  {w}x{h}  {c['title'][:95]}", fill=(255, 255, 0), font=font)
        for i, fp in enumerate(frames):
            if fp.exists():
                sheet.paste(Image.open(fp), (i * W, y + 24))
    out = root / "sheets" / f"{sid}.jpg"
    sheet.save(out, quality=82)
    print(sid, "->", out, len(rows), "candidates")
