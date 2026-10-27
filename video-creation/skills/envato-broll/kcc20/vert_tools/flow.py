"""Per-second optical-flow summary: divergence (<0 = content contracting = pull-back/zoom-out), mean dx, dy, magnitude."""
import sys, cv2, numpy as np
p = sys.argv[1]
cap = cv2.VideoCapture(p); fps = cap.get(cv2.CAP_PROP_FPS) or 25
prev = None; i = 0; rows = {}
while True:
    ok, f = cap.read()
    if not ok: break
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    if prev is not None and i % 3 == 0:
        fl = cv2.calcOpticalFlowFarneback(prev, g, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        h, w = g.shape; ys, xs = np.mgrid[0:h, 0:w]
        rx, ry = xs - w/2, ys - h/2
        r2 = rx*rx + ry*ry + 1e-6
        div = ((fl[...,0]*rx + fl[...,1]*ry) / np.sqrt(r2)).mean()
        rows.setdefault(int(i/fps), []).append((div, fl[...,0].mean(), fl[...,1].mean(), np.hypot(fl[...,0], fl[...,1]).mean()))
    prev = g; i += 1
for s, v in sorted(rows.items()):
    a = np.array(v).mean(0)
    print(f"{s:3d}s div={a[0]:+.3f} dx={a[1]:+.2f} dy={a[2]:+.2f} mag={a[3]:.2f}")
