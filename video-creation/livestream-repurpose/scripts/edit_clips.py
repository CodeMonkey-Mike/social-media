"""
Fix A/V sync on meme-holds clip by re-encoding each segment before concatenating.
Same segments as before, just switching from -c copy to re-encode per segment.
"""
import subprocess, os

SRC     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose\media\market update VERTICAL.mp4"
OUT_DIR = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\market-update-clips\meme-holds"
os.makedirs(OUT_DIR, exist_ok=True)

def cut_reencode(src, start, end, out):
    r = subprocess.run([
        "ffmpeg", "-y",
        "-ss", str(start), "-i", src,
        "-t", str(end - start),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-avoid_negative_ts", "make_zero",
        out
    ], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ERROR: {r.stderr[-300:]}")
    return r.returncode == 0

def concat_copy(parts, out):
    list_file = out + ".list.txt"
    with open(list_file, "w") as f:
        for p in parts:
            f.write(f"file '{p}'\n")
    r = subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", list_file,
        "-c", "copy", out
    ], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  CONCAT ERROR: {r.stderr[-300:]}")
    for p in parts:
        if os.path.exists(p): os.remove(p)
    os.remove(list_file)
    return r.returncode == 0

segments = [
    (1358.20, 1393.60, "Seg1: buy the good ones... housecoin uranus"),
    (2176.40, 2185.08, "Seg2a: house coin sticking around"),
    (2190.56, 2215.38, "Seg2b: 600k market cap... thousand x next play"),
    (2235.94, 2346.30, "Seg2c: tried and tested... MOTHER URANUS beyond a billion"),
]

total = sum(e - s for s, e, _ in segments)
print(f"Building meme-holds clip: {len(segments)} segments, {total:.1f}s (~{total/60:.1f}min)")

tmp_files = []
for i, (start, end, label) in enumerate(segments):
    tmp = os.path.join(OUT_DIR, f"_seg{i}.mp4")
    tmp_files.append(tmp)
    print(f"  [{i+1}] {start:.2f}-{end:.2f}s ({end-start:.1f}s): {label}", end=" ... ", flush=True)
    ok = cut_reencode(SRC, start, end, tmp)
    print("OK" if ok else "FAILED")

out_path = os.path.join(OUT_DIR, "preview.mp4")
print("Concatenating ...", end=" ", flush=True)
ok = concat_copy(tmp_files, out_path)
print("OK" if ok else "FAILED")

if ok:
    print(f"\nDone. {total:.1f}s. Refresh dashboard.")
