"""After a download: unpack (zip), probe, make a lean full-length 1920x1080 H.264 copy with NO audio, drop the original.
Usage: python lean.py <dl-dir> <id>   -> <dl-dir>/<id>-lean.mp4 + prints probe info.
The lean copy is the re-trim source (no re-licensing needed); originals are not kept (disk rule; C: is tight)."""
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

VID = {".mp4", ".mov", ".m4v", ".mxf", ".avi", ".mkv", ".webm"}


def probe(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height,r_frame_rate,codec_name:format=duration,size", "-of", "json", str(p)],
                       capture_output=True, text=True)
    return json.loads(r.stdout or "{}")


def main():
    d, bid = Path(sys.argv[1]), sys.argv[2]
    srcs = [p for p in d.iterdir() if p.is_file() and not p.name.endswith("-lean.mp4")]
    for z in [p for p in srcs if p.suffix.lower() == ".zip"]:
        x = d / "x"
        x.mkdir(exist_ok=True)
        with zipfile.ZipFile(z) as zf:
            names = [n for n in zf.namelist() if Path(n).suffix.lower() in VID and "alpha" not in n.lower()]
            print("zip members:", names)
            for n in names:
                tgt = x / Path(n).name
                with zf.open(n) as s, open(tgt, "wb") as o:
                    shutil.copyfileobj(s, o)
        z.unlink()
        srcs = [p for p in x.iterdir() if p.suffix.lower() in VID]
    vids = sorted([p for p in srcs if p.suffix.lower() in VID], key=lambda p: p.stat().st_size, reverse=True)
    if not vids:
        sys.exit(f"{bid}: no video file in {d}")
    src = vids[0]
    info = probe(src)
    st = info["streams"][0]
    print(f"{bid}: src={src.name} {st['width']}x{st['height']} {st['r_frame_rate']} {st['codec_name']} "
          f"dur={float(info['format']['duration']):.2f}s size={int(info['format']['size']) / 1e6:.0f}MB")
    out = d / f"{bid}-lean.mp4"
    vf = "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,setsar=1"
    cmd = lambda f: ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-vf", f, "-c:v", "libx264", "-preset", "fast",
                     "-crf", "18", "-pix_fmt", "yuv420p", "-an", str(out)]
    if subprocess.run(cmd(vf)).returncode:
        # some ProRes masters carry an invalid ('reserved') transfer tag the scaler rejects: tag as bt709 and retry
        print(f"{bid}: retrying with bt709 colour tags (source colour metadata invalid)")
        subprocess.run(cmd("setparams=color_trc=bt709:color_primaries=bt709:colorspace=bt709," + vf), check=True)
    import time
    for p in list(d.iterdir()):
        if p == out:
            continue
        for attempt in range(12):  # Windows: a scanner may hold the fresh original for a few seconds
            try:
                shutil.rmtree(p) if p.is_dir() else p.unlink()
                break
            except PermissionError:
                time.sleep(5)
        else:
            print(f"{bid}: WARNING could not delete {p.name} (locked); remove by hand")
    i2 = probe(out)
    print(f"{bid}: lean {out.name} dur={float(i2['format']['duration']):.2f}s size={int(i2['format']['size']) / 1e6:.1f}MB")


if __name__ == "__main__":
    main()
