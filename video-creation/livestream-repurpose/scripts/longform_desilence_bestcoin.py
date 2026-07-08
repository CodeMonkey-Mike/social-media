"""Lane 1 long-form desilence for "best coin to buy" (modeled on longform_desilence_fast.py).
silencedetect -> keep intervals -> ONE NVENC pass via concat demuxer, output ~0.7 Mbps directly
to the staged longform/ subfolder. No crf-18 intermediate (single pass already lands ~0.7 Mbps)."""
import subprocess, re, os, sys

SRC = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose\media\best coin to buy\best coin to buy LOW BPS.mp4"
OUT = r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\longform\best-coin-to-buy\best-coin-to-buy.mp4"
NOISE = "-50dB"
MIN_SIL = 0.5
PAD = 0.06
os.makedirs(os.path.dirname(OUT), exist_ok=True)

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration",
        "-of","csv=p=0",p]).decode().strip())

D = dur(SRC)
print(f"source duration {D:.1f}s; detecting silences...")
r = subprocess.run(["ffmpeg","-i",SRC,"-af",f"silencedetect=noise={NOISE}:d={MIN_SIL}","-f","null","-"],
                   capture_output=True, text=True)
starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", r.stderr)]
ends   = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", r.stderr)]
sils = []
for s in starts:
    e = next((e for e in ends if e > s), D)
    sils.append((s + PAD, max(s + PAD, e - PAD)))
sils = [(a,b) for a,b in sils if b - a > 0.05]
print(f"{len(sils)} silence spans to drop")

keeps = []; cur = 0.0
for a,b in sils:
    if a > cur: keeps.append((cur, a))
    cur = max(cur, b)
if cur < D: keeps.append((cur, D))
print(f"{len(keeps)} keep spans; building single-pass filter")

src_fwd = SRC.replace("\\", "/")
list_path = OUT + ".concat.txt"
with open(list_path, "w", encoding="utf-8") as f:
    for a, b in keeps:
        f.write(f"file '{src_fwd}'\ninpoint {a:.3f}\noutpoint {b:.3f}\n")
r2 = subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",list_path,
    "-c:v","h264_nvenc","-rc","vbr","-b:v","700k","-maxrate","1000k","-bufsize","1400k","-preset","p5",
    "-c:a","aac","-b:a","96k","-fflags","+genpts",OUT], capture_output=True, text=True)
try: os.remove(list_path)
except OSError: pass
if r2.returncode != 0:
    print("FFMPEG FAIL:\n", r2.stderr[-1500:]); sys.exit(1)
nd = dur(OUT)
print(f"DONE  {D:.1f}s -> {nd:.1f}s  (-{D-nd:.1f}s)  out={OUT}")
print(f"OUT_DURATION={nd:.2f}")
