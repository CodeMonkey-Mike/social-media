#!/usr/bin/env python
"""finish_clip.py <src> <out.mp4> --start S --dur D [--hflip]
Trim [S, S+D] from a downloaded Envato master and write a comp-ready VERTICAL clip:
1080x1920 (cover-scale then centre-crop, so a slightly-narrower/wider portrait master still fills 9:16),
H.264 yuv420p crf 18, source fps kept, audio STRIPPED (-an), faststart. --hflip un-mirrors a clip that was
published mirrored (reversed screen text)."""
import argparse
import subprocess

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--start", type=float, required=True)
ap.add_argument("--dur", type=float, required=True)
ap.add_argument("--hflip", action="store_true")
a = ap.parse_args()

vf = "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
if a.hflip:
    vf += ",hflip"
vf += ",setsar=1,format=yuv420p"
cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{a.start:.3f}", "-i", a.src, "-t", f"{a.dur:.3f}",
       "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-an", "-movflags", "+faststart", a.out]
subprocess.run(cmd, check=True)
p = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                    "stream=codec_name,width,height,r_frame_rate", "-show_entries", "format=duration,size",
                    "-of", "csv=p=0", a.out], capture_output=True, text=True)
a_streams = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index",
                            "-of", "csv=p=0", a.out], capture_output=True, text=True).stdout.strip()
print(a.out, p.stdout.strip().replace("\n", " | "), "audio=" + (a_streams or "none"))
