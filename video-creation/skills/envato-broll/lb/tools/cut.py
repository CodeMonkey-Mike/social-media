"""Cut the final slot clip from the lean copy + QA it.
Usage: python cut.py <lean.mp4> <out.mp4> <in_s> <len_s> <qa_dir>
Final = 1920x1080 H.264 (crf 18, yuv420p, faststart), NO audio stream. QA prints: dims/fps/dur/audio streams,
first/mid/last frame luma, blackdetect over the first 0.5 s and whole clip, motion score; writes a 3-frame QA strip."""
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def main():
    lean, out, a, ln, qa = Path(sys.argv[1]), Path(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), Path(sys.argv[5])
    out.parent.mkdir(parents=True, exist_ok=True)
    qa.mkdir(parents=True, exist_ok=True)
    r = run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{a:.3f}", "-i", str(lean), "-t", f"{ln:.3f}", "-map", "0:v:0",
             "-vf", "scale=1920:1080:flags=lanczos:out_range=tv,format=yuv420p,setsar=1", "-color_range", "tv", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
             "-pix_fmt", "yuv420p", "-an", "-sn", "-dn", "-map_metadata", "-1", "-write_tmcd", "0", "-movflags", "+faststart", str(out)])
    if r.returncode:
        sys.exit(r.stderr)
    p = json.loads(run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate:format=duration,size",
                        "-of", "json", str(out)]).stdout)
    streams = p["streams"]
    v = [s for s in streams if s["codec_type"] == "video"][0]
    na = sum(1 for s in streams if s["codec_type"] == "audio")
    d = float(p["format"]["duration"])
    frames = []
    for k, t in enumerate((0.0, d / 2, max(0.0, d - 0.1))):
        f = qa / f"{out.stem}-{k}.jpg"
        run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", str(out), "-frames:v", "1", "-vf", "scale=640:360", str(f)])
        frames.append(Image.open(f).convert("RGB"))
    luma = [sum(ImageStat.Stat(im).mean) / 3 for im in frames]
    # motion: mean abs diff between frames 0.5 s apart across the clip
    samples = []
    t = 0.0
    while t < d - 0.05:
        f = qa / f"_m{len(samples)}.jpg"
        run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", str(out), "-frames:v", "1", "-vf", "scale=320:180", str(f)])
        samples.append(Image.open(f).convert("RGB"))
        f.unlink()
        t += 0.5
    mot = [sum(ImageStat.Stat(ImageChops.difference(samples[i], samples[i + 1])).mean) / 3 for i in range(len(samples) - 1)]
    bd = run(["ffmpeg", "-hide_banner", "-i", str(out), "-vf", "blackdetect=d=0.1:pix_th=0.10", "-an", "-f", "null", "-"]).stderr
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", bd)
    strip = Image.new("RGB", (1920, 360))
    for k, im in enumerate(frames):
        strip.paste(im, (k * 640, 0))
    strip.save(qa / f"{out.stem}-qa.jpg", quality=85)
    for k in range(3):
        (qa / f"{out.stem}-{k}.jpg").unlink()
    print(json.dumps({"file": out.name, "w": v["width"], "h": v["height"], "fps": v["r_frame_rate"], "codec": v["codec_name"],
                      "dur": round(d, 2), "MB": round(int(p["format"]["size"]) / 1e6, 1), "audio_streams": na,
                      "luma_first_mid_last": [round(x) for x in luma], "motion_min_mean": [round(min(mot), 1), round(sum(mot) / len(mot), 1)] if mot else None,
                      "black": blacks}))


if __name__ == "__main__":
    main()
