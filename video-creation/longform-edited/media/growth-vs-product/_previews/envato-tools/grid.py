"""8-frame 2x4 grid (480x270 each) of a video, evenly spaced, optional window start/end. Also prints mean frame-diff (motion)."""
import subprocess, sys
src, out = sys.argv[1], sys.argv[2]
d = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",src],capture_output=True,text=True).stdout)
a = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
b = float(sys.argv[4]) if len(sys.argv) > 4 else d
ts = [a + (b - a) * (k + 0.5) / 8 for k in range(8)]
inp = []
for t in ts: inp += ["-ss", f"{t:.2f}", "-i", src]
fc = "".join(f"[{k}:v]scale=480:270:force_original_aspect_ratio=decrease,pad=480:270:-1:-1[v{k}];" for k in range(8))
fc += "[v0][v1][v2][v3]hstack=4[r0];[v4][v5][v6][v7]hstack=4[r1];[r0][r1]vstack=2"
subprocess.run(["ffmpeg","-y","-v","error",*inp,"-filter_complex",fc,"-frames:v","1",out], check=True)
print(f"dur {d:.2f}  frames at " + " ".join(f"{t:.1f}" for t in ts))
