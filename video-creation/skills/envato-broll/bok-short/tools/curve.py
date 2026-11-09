"""curve.py <preview> ...: per-half-second motion so the trim avoids jumps and dead spots."""
import subprocess, sys
import numpy as np
for f in sys.argv[1:]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", "fps=8,scale=64:114,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.uint8); n = a.size // (64 * 114); a = a[:n * 64 * 114].reshape(n, 114, 64).astype(np.float32)
    d = np.abs(np.diff(a, axis=0)).mean(axis=(1, 2))
    print(f, " ".join(f"{d[i:i+4].mean():.1f}" for i in range(0, len(d), 4)))
