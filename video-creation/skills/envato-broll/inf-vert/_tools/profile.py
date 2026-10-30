#!/usr/bin/env python
"""profile.py <video> -> dims/fps/dur + per-0.5s mean abs frame diff and luma (motion + black-lead check)."""
import json, subprocess, sys
import numpy as np
p = sys.argv[1]
j = json.loads(subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=width,height,r_frame_rate,codec_name","-show_entries","format=duration","-of","json",p],capture_output=True,text=True).stdout)
s = j["streams"][0]; W, H = s["width"], s["height"]
print(p, f'{s["codec_name"]} {W}x{H} fps={s["r_frame_rate"]} dur={float(j["format"]["duration"]):.2f}')
h = int(round(64*H/W/2))*2
r = subprocess.run(["ffmpeg","-v","error","-i",p,"-vf",f"fps=10,scale=64:{h},format=gray","-f","rawvideo","-"],capture_output=True)
a = np.frombuffer(r.stdout,np.uint8); n = a.size//(64*h); fr = a[:n*64*h].reshape(n,h,64).astype(float)
d = np.abs(np.diff(fr,axis=0)).mean(axis=(1,2)); L = fr.mean(axis=(1,2))
out=[]
for k in range(0, n-1, 5):
    out.append(f'{k/10:.1f}s d={d[k:k+5].mean():.1f} L={L[k]:.0f}')
print('  '.join(out))
