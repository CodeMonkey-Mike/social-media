import subprocess, sys, numpy as np
src, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
step = float(sys.argv[4]) if len(sys.argv) > 4 else 0.02
raw = subprocess.run(["ffmpeg","-v","error","-i",src,"-vn","-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32)/32768
sr = 16000; n = int(step*sr)
out = []
for t in np.arange(a, b, step):
    s = x[int(t*sr):int(t*sr)+n]
    if len(s)==0: break
    out.append((t, 20*np.log10(np.sqrt(np.mean(s**2))+1e-9)))
for t, d in out:
    print(f"{t:7.2f} {d:6.1f} " + "#"*int(max(0,(d+60)/2)))
