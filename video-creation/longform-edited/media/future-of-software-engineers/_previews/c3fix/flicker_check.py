"""flicker_check.py <video> <t> [<t> ...]: for each start time, decode 30 consecutive frames (gray) and report the regions whose
pixels change frame to frame (temporal std > 8) at moments where the chart is meant to be STILL (axis labels jittering = the C3 bug).
Prints the flicker pixel count and the biggest regions (x, y, w, h). Works for any frame size."""
import subprocess, sys
import numpy as np
from scipy import ndimage
video = sys.argv[1]
for t in (float(x) for x in sys.argv[2:]):
    pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", video], capture_output=True, text=True)
    W, H = (int(v) for v in pr.stdout.strip().split("x"))
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", video, "-frames:v", "30", "-vf", "format=gray", "-f", "rawvideo", "-"], capture_output=True)
    a = np.frombuffer(r.stdout, np.uint8).reshape(-1, H, W).astype(np.float32)
    std = a.std(axis=0)
    mask = std > 8
    lab, n = ndimage.label(ndimage.binary_dilation(mask, iterations=5))
    regs = sorted(((int(mask[sl].sum()), sl[1].start, sl[0].start, sl[1].stop - sl[1].start, sl[0].stop - sl[0].start) for sl in ndimage.find_objects(lab)), reverse=True)
    print(f"t={t:6.2f}s  frames {a.shape[0]}  flicker px {int(mask.sum()):6d}  regions {n:3d}  top: " + "; ".join(f"{c}px@({x},{y}) {w}x{h}" for c, x, y, w, h in regs[:3]))
