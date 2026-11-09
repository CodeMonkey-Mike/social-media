"""Fetch Envato preview videos for a slot's search results and tile a contact sheet.
Usage: python sheets.py <results.json> <slot-id> [--start 0] [--n 12]
Writes reset/pv/<slot>/<i>.mp4 and reset/pv/<slot>-sheet.jpg (2 candidates per row, 4 frames each)."""
import json
import subprocess
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent.parent
W, H = 240, 135


def probe_dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def frames(p, outdir, i):
    d = probe_dur(p)
    outs = []
    for k, f in enumerate((0.05, 0.35, 0.65, 0.95)):
        o = outdir / f"{i}-{k}.jpg"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{d * f:.2f}", "-i", str(p), "-frames:v", "1",
                        "-vf", f"scale={W}:{H}",
                        str(o)])
        outs.append(o if o.exists() else None)
    return outs, d


def main():
    res = Path(sys.argv[1])
    slot = sys.argv[2]
    start = int(sys.argv[sys.argv.index("--start") + 1]) if "--start" in sys.argv else 0
    n = int(sys.argv[sys.argv.index("--n") + 1]) if "--n" in sys.argv else 12
    items = json.loads(res.read_text(encoding="utf-8"))[start:start + n]
    pv = HERE / "pv" / slot
    pv.mkdir(parents=True, exist_ok=True)
    rows = []
    for j, it in enumerate(items):
        i = start + j
        mp4 = pv / f"{i}.mp4"
        dims = ""
        if it.get("previewVideo") and not mp4.exists():
            try:
                req = urllib.request.Request(it["previewVideo"], headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=60) as r:
                    mp4.write_bytes(r.read())
            except Exception as e:  # noqa: BLE001
                print(f"{slot}#{i} preview fetch failed: {e}", file=sys.stderr)
        fr, d = ([None] * 4, 0.0)
        if mp4.exists():
            fr, d = frames(mp4, pv, i)
            r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                "stream=width,height", "-of", "csv=p=0", str(mp4)], capture_output=True, text=True)
            dims = r.stdout.strip()
        rows.append((i, it, fr, d, dims))
        print(f"{slot}#{i} [{it.get('duration')}] {dims} pv={d:.1f}s  {it.get('title')}")
    cols = 2
    lab = 18
    cw, ch = 4 * W + 8, H + lab + 6
    nrow = (len(rows) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cw, max(1, nrow) * ch), (30, 30, 30))
    dr = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arial.ttf", 14)
    except OSError:
        font = ImageFont.load_default()
    for k, (i, it, fr, d, dims) in enumerate(rows):
        x0, y0 = (k % cols) * cw, (k // cols) * ch
        dr.text((x0 + 4, y0 + 2), f"#{i} [{it.get('duration')}] {it.get('title', '')[:70]}", fill=(255, 220, 0), font=font)
        for m, f in enumerate(fr):
            if f:
                sheet.paste(Image.open(f), (x0 + m * W, y0 + lab))
    out = HERE / "pv" / f"{slot}-sheet{'' if start == 0 else '-' + str(start)}.jpg"
    sheet.save(out, quality=85)
    print("sheet:", out)


if __name__ == "__main__":
    main()
