"""Trim one staged Envato source into the project slot file + QA it.
usage: python -I trim_qa.py <src> <start_s> <dur_s> <out.mp4> <qa_sheet.jpg>
 - 1920x1080 H.264 (scale to cover + center crop to 16:9), crf 18, yuv420p, NO AUDIO (-an), video stream only
 - QA: probe (codec/size/dur/audio count), 8 frames across the trimmed file, black-lead check (first-frame luma),
   motion check (mean abs diff between consecutive sampled frames)."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageStat
src, ss, dur, out, sheet_p = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), Path(sys.argv[4]), Path(sys.argv[5])
vf = "scale=1920:1080:force_original_aspect_ratio=increase:out_range=tv,crop=1920:1080,setsar=1,format=yuv420p"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{ss:.3f}", "-i", src, "-t", f"{dur:.3f}", "-map", "0:v:0",
                "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-color_range", "tv", "-an", "-sn", "-dn",
                "-map_metadata", "-1", "-movflags", "+faststart", str(out)], check=True)
j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate:format=duration,size",
                               "-of", "json", str(out)], capture_output=True, text=True).stdout)
v = [s for s in j["streams"] if s["codec_type"] == "video"][0]
na = sum(1 for s in j["streams"] if s["codec_type"] == "audio")
D = float(j["format"]["duration"])
W, H, n = 480, 270, 8
frames = []
tmp = sheet_p.with_suffix(".f.png")
for i in range(n):
    t = min(D - 0.05, D * i / (n - 1)) if i else 0.0
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", str(out), "-frames:v", "1", "-vf", f"scale={W}:{H}", str(tmp)])
    frames.append((t, Image.open(tmp).convert("RGB").copy()))
tmp.unlink(missing_ok=True)
lum0 = ImageStat.Stat(frames[0][1].convert("L")).mean[0]
lums = [ImageStat.Stat(f.convert("L")).mean[0] for _, f in frames]
diffs = [ImageStat.Stat(ImageChops.difference(frames[i][1], frames[i + 1][1]).convert("L")).mean[0] for i in range(n - 1)]
sheet = Image.new("RGB", (W * 4, (H + 18) * 2), (20, 20, 20)); d = ImageDraw.Draw(sheet)
for i, (t, f) in enumerate(frames):
    r, c = divmod(i, 4); sheet.paste(f, (c * W, r * (H + 18) + 18)); d.text((c * W + 4, r * (H + 18) + 3), f"t={t:.2f}s luma={lums[i]:.0f}", fill=(255, 255, 0))
sheet.save(sheet_p, quality=85)
rep = {"file": str(out), "codec": v["codec_name"], "size": f'{v["width"]}x{v["height"]}', "fps": v["r_frame_rate"], "dur": round(D, 3),
       "bytes": int(j["format"]["size"]), "audio_streams": na, "first_frame_luma": round(lum0, 1), "min_luma": round(min(lums), 1),
       "motion_mean_absdiff": round(sum(diffs) / len(diffs), 2), "motion_min": round(min(diffs), 2), "src_window": [ss, ss + dur]}
print(json.dumps(rep))
