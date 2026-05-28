"""
Video 5 (eth-flips-btc): reduce length ~10% by eliminating the most irrelevant/filler
SPOKEN words. Does NOT run the silence-removal pass — all natural pauses are preserved
(cuts cover spoken-word spans only). Re-encode + select filter. Overwrites preview.mp4.
"""
import subprocess, os, shutil

CLIP = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\bulls-are-sleeping-clips\eth-flips-btc\preview.mp4"

# Spoken-word spans to remove (start, end) in clip seconds. Pauses around them are kept.
CUTS = [
    (11.00, 12.40),  # "ETH is gonna flip Bitcoin" — 3rd verbatim repeat
    (24.40, 26.20),  # "you know, because they're gonna hate" — filler + false start
    (29.60, 31.80),  # "You know, maybe like 10 years from now, whatever it may be" — hedge tangent
    (32.80, 35.80),  # "And they're gonna look in the mirror... I have to really think" — redundant restatement
    (37.10, 37.50),  # "Yeah," — filler interjection
    (42.50, 43.70),  # "right? Right, they're gonna be like that." — filler
    (62.30, 62.90),  # "significantly" — doubled
    (93.90, 94.40),  # "total" — doubled
]

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())

total = dur(CLIP)
removed = sum(e - s for s, e in CUTS)

# Build KEEP spans = complement of CUTS over [0, total]
keep = []
prev = 0.0
for s, e in sorted(CUTS):
    if s > prev:
        keep.append((prev, s))
    prev = max(prev, e)
if prev < total:
    keep.append((prev, total))

sel = "+".join(f"between(t,{s:.3f},{e:.3f})" for s, e in keep)
vf = f"select='{sel}',setpts=N/FRAME_RATE/TB"
af = f"aselect='{sel}',asetpts=N/SR/TB"

tmp = CLIP + ".tmp.mp4"
subprocess.run(["ffmpeg","-y","-i",CLIP,"-vf",vf,"-af",af,
                "-c:v","libx264","-preset","fast","-crf","18","-c:a","aac","-b:a","192k",tmp],
               check=True, capture_output=True)
shutil.move(tmp, CLIP)
new = dur(CLIP)
print(f"eth-flips-btc: {total:.1f}s -> {new:.1f}s  (removed {total-new:.1f}s spoken, "
      f"{(total-new)/total*100:.1f}%; planned {removed:.1f}s across {len(CUTS)} cuts)")
print("Silences/pauses preserved (no silence-removal pass).")
