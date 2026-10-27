"""finish.py <src> <start_s> <dur_s> <out>: trim, fill 1080x1920 (scale-to-cover + centre crop), H.264 crf18, video only."""
import subprocess, sys
src, ss, dur, out = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
import json
fr = subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=r_frame_rate","-of","csv=p=0",src],capture_output=True,text=True).stdout.strip().split("/")
hi = float(fr[0])/float(fr[1] if len(fr)>1 else 1) > 31
vf = ("fps=30000/1001," if hi else "") + "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,setsar=1"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", ss, "-i", src, "-t", dur, "-map", "0:v:0", "-an", "-dn", "-sn",
                "-map_metadata", "-1", "-vf", vf, "-c:v", "libx264", "-crf", "18", "-preset", "slow",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], check=True)
