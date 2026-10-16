"""Offline SFX mix onto the bare spine (zero renders) + encode-matched control.
Parses SFX_DT1 from the constants file so the test mixes EXACTLY what the comp will render.
usage: python mix_offline.py <constants.ts> <spine.mp4> <out_dir> [--override idx:vol:dur ...]"""
import re, sys, subprocess, numpy as np, os
const, spine, out = sys.argv[1], sys.argv[2], sys.argv[3]
DELAY = 2048
over = {}
for a in sys.argv[4:]:
    i, v, d = a.split(':'); over[int(i)] = (float(v), float(d))
SR = 48000
SFX = os.path.join(os.path.dirname(spine), '..', '..', '..', 'assets')  # staticFile root fallback
ASSETS = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\assets"
src = open(const, encoding='utf-8').read()
body = re.search(r"SFX_DT1: Sfx\[\] = \[(.*?)\];", src, re.S).group(1)
evs = []
for m in re.finditer(r"\{\s*t:\s*([\d.]+),\s*src:\s*staticFile\('([^']+)'\),\s*vol:\s*([\d.]+),\s*dur:\s*([\d.]+)\s*\}", body):
    evs.append([float(m.group(1)), m.group(2), float(m.group(3)), float(m.group(4))])
for i, (v, d) in over.items():
    evs[i][2], evs[i][3] = v, d
def load(p):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", p, "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()
base = load(spine)
mix = base.copy()
FPS = 30
for t, f, vol, dur in evs:
    s = load(os.path.join(ASSETS, f))
    start = int(round(round(t * FPS) / FPS * SR))           # Sequence from = round(t*fps)
    n = min(len(s), int(round(max(1, round(dur * FPS)) / FPS * SR)), len(mix) - start)
    mix[start:start + n] += s[:n] * vol
    print(f"  cue t={t:6.3f} vol={vol:.2f} dur={dur:.2f} {f}")
os.makedirs(out, exist_ok=True)
def enc(arr, name):
    raw = os.path.join(out, name + '.f32')
    arr.astype(np.float32).tofile(raw)
    dst = os.path.join(out, name + '.m4a')
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw, "-c:a", "aac", "-b:a", "320k", dst], check=True)
    os.remove(raw); return dst
pad = np.zeros((DELAY, 2), dtype=mix.dtype)
print(enc(np.concatenate([pad, base]), "control"), enc(np.concatenate([pad, mix]), "mix"))
