"""Re-cut BR-1 from its master with the phone's real stock name + price row softly blurred. Static feathered polygon on a full-frame boxblur copy (the row drifts ~15 px), everything else untouched."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
root, out = Path(sys.argv[1]), Path(sys.argv[2])
v = json.loads((root / "tools" / "picks.json").read_text(encoding="utf-8"))["BR-1"]
mask = Image.new("L", (1080, 1920), 0)
ImageDraw.Draw(mask).polygon([(318, 604), (596, 536), (596, 610), (318, 676)], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(6))
m = root / "tools" / "br1_mask.png"; mask.save(m)
fc = ("[0:v]scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,setsar=1,format=yuv420p,split[a][b];"
      "[b]boxblur=14:2[bl];[1:v]format=gray[m];[bl][m]alphamerge[blm];[a][blm]overlay=0:0:shortest=1,format=yuv420p[o]")
cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(v["start"]), "-t", str(v["dur"]), "-i", str(sorted((root / "dl" / "BR-1").glob("*.mov"))[0]),
       "-loop", "1", "-i", str(m), "-filter_complex", fc, "-map", "[o]", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-an", "-movflags", "+faststart", "-t", str(v["dur"]), str(out / f"{v['name']}.mp4")]
subprocess.run(cmd, check=True)
print("ok", v["name"])
