"""Offline SFX mix onto the bare spine (48 kHz), + encode-matched control, both through AAC 48k.
Parses SFX_VP3 from the constants file so the sweep tests exactly what will render."""
import re, subprocess, sys, numpy as np, json, os
VC = r"C:\Users\mnede\Documents\Claude\social-media\video-creation"
RA = os.path.join(VC, r"shorts\beer-and-kaspa\render-assets")
OUT = os.path.join(VC, r"shorts\beer-and-kaspa\first-vprog-live-on-kaspa\_qa\mix")
SR = 48000
def load(p):
    raw = subprocess.run(["ffmpeg","-v","error","-i",p,"-ac","1","-ar",str(SR),"-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()
def save(a, name):
    wav = os.path.join(OUT, name + ".wav"); m4a = os.path.join(OUT, name + ".m4a")
    subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","1","-i","-","-c:a","aac","-b:a","192k",m4a], input=a.astype(np.float32).tobytes(), check=True)
    return m4a
src = open(os.path.join(VC, r"remotion\src\constants-beer-and-kaspa-first-vprog-live-on-kaspa.ts"), encoding="utf-8").read()
body = src[src.index("export const SFX_VP3"):]
evs = re.findall(r"\{\s*t:\s*([\d.]+),\s*src:\s*staticFile\('([^']+)'\),\s*vol:\s*([\d.]+),\s*dur:\s*([\d.]+)", body)
overrides = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
spine = load(os.path.join(RA, "first-vprog-live-on-kaspa.mp4"))
print("control ->", save(spine, "control"))
mix = spine.copy()
for i, (t, f, v, d) in enumerate(evs):
    t, v, d = float(t), float(v), float(d)
    if str(i) in overrides: t, v, d = overrides[str(i)]
    s = load(os.path.join(RA, f))[: int(d * SR)] * v
    a = int(t * SR); b = min(len(mix), a + len(s)); mix[a:b] += s[: b - a]
    print(i, t, f, v, d)
print("mix ->", save(mix, sys.argv[2] if len(sys.argv) > 2 else "mix"))
