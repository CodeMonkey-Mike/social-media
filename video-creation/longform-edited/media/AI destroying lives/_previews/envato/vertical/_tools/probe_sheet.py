"""probe_sheet.py <BR-id> [max] -- fetch each candidate previewVideo, ffprobe dims, keep portrait,
extract 4 frames, write a labelled contact sheet <BR-id>-sheet.jpg + <BR-id>-probe.json.
Run with python -I. Previews land in prev/<BR-id>/ (downloaded data, never executed)."""
import json, subprocess, sys, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
bid = sys.argv[1]
mx = int(sys.argv[2]) if len(sys.argv) > 2 else 16
items = json.loads((ROOT / f"{bid}.json").read_text(encoding="utf-8"))[:mx]
pdir = ROOT / "prev" / bid
pdir.mkdir(parents=True, exist_ok=True)
font = ImageFont.load_default(size=22)
out, tiles = [], []
for i, it in enumerate(items):
    rec = {"i": i, "title": it["title"], "dur": it["duration"], "url": it["url"], "w": None, "h": None}
    pv = it.get("previewVideo") or ""
    f = pdir / f"c{i:02d}.mp4"
    if pv and not f.exists():
        try:
            req = urllib.request.Request(pv, headers={"User-Agent": "Mozilla/5.0"})
            f.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        except Exception as e:
            rec["err"] = str(e)[:100]
    if f.exists() and f.stat().st_size > 1000:
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                            "stream=width,height:format=duration", "-of", "json", str(f)], capture_output=True, text=True)
        j = json.loads(r.stdout or "{}")
        s = (j.get("streams") or [{}])[0]
        rec["w"], rec["h"] = s.get("width"), s.get("height")
        d = float(j.get("format", {}).get("duration", 0) or 0)
        rec["pdur"] = round(d, 2)
        if rec["w"] and rec["h"] and rec["h"] > rec["w"]:
            frames = []
            for k, frac in enumerate((0.05, 0.35, 0.65, 0.95)):
                fp = pdir / f"c{i:02d}_f{k}.jpg"
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{d*frac:.2f}", "-i", str(f), "-frames:v", "1",
                                "-vf", "scale=180:-2", str(fp)], capture_output=True)
                if fp.exists():
                    frames.append(Image.open(fp).convert("RGB"))
            if frames:
                fw, fh = frames[0].size
                t = Image.new("RGB", (fw * len(frames) + 6 * (len(frames) - 1), fh + 34), (30, 30, 30))
                for k, im in enumerate(frames):
                    t.paste(im.resize((fw, fh)), (k * (fw + 6), 34))
                ImageDraw.Draw(t).text((4, 4), f"#{i} {rec['dur']} {it['title'][:52]}", fill=(255, 255, 0), font=font)
                tiles.append(t)
    out.append(rec)
(ROOT / f"{bid}-probe.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
port = [r for r in out if r["h"] and r["w"] and r["h"] > r["w"]]
print(f"{bid}: {len(out)} cands, {len(port)} portrait: " + " ".join(f"#{r['i']}({r['w']}x{r['h']})" for r in port))
land = [r for r in out if r["w"] and r["h"] and r["w"] >= r["h"]]
if land: print("  landscape/rejected: " + " ".join(f"#{r['i']}" for r in land))
if tiles:
    cols = 2
    tw = max(t.size[0] for t in tiles); th = max(t.size[1] for t in tiles)
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw + 10, rows * (th + 8)), (0, 0, 0))
    for n, t in enumerate(tiles):
        sheet.paste(t, ((n % cols) * (tw + 10), (n // cols) * (th + 8)))
    sp = ROOT / f"{bid}-sheet.jpg"
    sheet.save(sp, quality=80)
    print("  sheet:", sp)
