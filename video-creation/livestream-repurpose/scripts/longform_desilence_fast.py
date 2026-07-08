"""Fast single-pass silence removal for a LONG-FORM file (built for 60+ min; delete_silences.py
is per-region and impractical at that scale). silencedetect -> keep intervals -> ONE ffmpeg
NVENC pass dropping the gaps via a select/aselect expression. Minor join artifacts are acceptable
at long-form scale (unlike a tight short). Outputs ~0.7 Mbps directly to the staged location.
"""
import subprocess, re, os, sys

SRC = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose\media\4-year cycle zombie class\4-year cycle zombie class LOW BPS.mp4"
OUT = r"C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\longform\4-year-cycle-zombie-class\4-year-cycle-zombie-class.mp4"
NOISE = "-50dB"   # below this = silence
MIN_SIL = 0.5     # only cut gaps longer than this (keeps natural cadence, fewer cuts)
PAD = 0.06        # keep this much of each silence edge so word tails/onsets aren't clipped
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
# pair into silence intervals
sils = []
for s in starts:
    e = next((e for e in ends if e > s), D)
    sils.append((s + PAD, max(s + PAD, e - PAD)))  # shrink each silence by PAD on both edges
sils = [(a,b) for a,b in sils if b - a > 0.05]
print(f"{len(sils)} silence spans to drop")

# keep intervals = complement of silences over [0, D]
keeps = []; cur = 0.0
for a,b in sils:
    if a > cur: keeps.append((cur, a))
    cur = max(cur, b)
if cur < D: keeps.append((cur, D))
print(f"{len(keeps)} keep spans; building single-pass filter")

# A 982-term select expression overflows ffmpeg's expr evaluator ("cannot allocate memory")
# AND a single argv. Use the concat demuxer: one re-encode pass over many keep-span segments.
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
