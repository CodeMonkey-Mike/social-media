"""qa.py <clip> <sheet.png>: streams, dims, per-0.25s luma + motion, first/mid/last frames sheet."""
import subprocess, sys, json, cv2, numpy as np
p, sheet = sys.argv[1], sys.argv[2]
pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt",
      "-show_entries", "format=duration,size", "-of", "json", p], capture_output=True, text=True).stdout)
st = pr["streams"]; fmt = pr["format"]
print("streams:", [(s["codec_type"], s.get("codec_name"), s.get("width"), s.get("height"), s.get("r_frame_rate")) for s in st])
print(f"duration={float(fmt['duration']):.3f}s size={int(fmt['size'])/1e6:.1f}MB")
cap = cv2.VideoCapture(p); fps = cap.get(5); n = int(cap.get(7)); prev = None; lum = []; mot = []
frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(f, (270, 480)), cv2.COLOR_BGR2GRAY).astype(float)
    lum.append(g.mean()); mot.append(0 if prev is None else np.abs(g - prev).mean()); prev = g; frames.append(f)
lum = np.array(lum); mot = np.array(mot)
step = max(1, int(round(fps / 4)))
print("luma/0.25s :", " ".join(f"{x:.0f}" for x in lum[::step]))
print("motion/0.25s:", " ".join(f"{mot[i:i+step].mean():.2f}" for i in range(0, len(mot), step)))
print(f"first-frame luma={lum[0]:.1f} min luma={lum.min():.1f} frames-with-zero-motion={(mot[1:] < 0.05).sum()}/{len(mot)-1}")
idx = [0, len(frames)//2, len(frames)-1]
tiles = [cv2.resize(frames[i], (360, 640)) for i in idx]
cv2.imwrite(sheet, np.hstack(tiles))
