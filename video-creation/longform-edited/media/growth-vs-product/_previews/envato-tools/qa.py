"""QA a b-roll clip: first/mid/last frames + full-res center crop sheet, motion (mean abs frame diff), black lead, frozen frames."""
import subprocess, sys, re, statistics
src, sheet = sys.argv[1], sys.argv[2]
d = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",src],capture_output=True,text=True).stdout)
ts = [0.04, d/2, max(d-0.08, 0)]
inp = []
for t in ts: inp += ["-ss", f"{t:.2f}", "-i", src]
fc = "".join(f"[{k}:v]scale=640:360[v{k}];" for k in range(3)) + "[v0][v1][v2]hstack=3"
subprocess.run(["ffmpeg","-y","-v","error",*inp,"-filter_complex",fc,"-frames:v","1",sheet], check=True)
r = subprocess.run(["ffmpeg","-v","info","-i",src,"-vf","scale=480:270,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG","-f","null","-"],capture_output=True,text=True).stderr
ys = [float(x) for x in re.findall(r"YAVG=([\d.]+)", r)]
frozen = sum(1 for y in ys if y < 0.05)
b = subprocess.run(["ffmpeg","-v","info","-i",src,"-vf","blackdetect=d=0.05:pix_th=0.10","-an","-f","null","-"],capture_output=True,text=True).stderr
blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", b)
print(f"dur {d:.2f}s  motion mean {statistics.mean(ys):.2f} min {min(ys):.3f}  frozen-frames {frozen}/{len(ys)}  black {blacks or 'none'}")
