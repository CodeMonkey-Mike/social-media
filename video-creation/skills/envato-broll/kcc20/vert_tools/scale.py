"""scale.py <clip> [step_s]: similarity transform between frames step_s apart (ORB + RANSAC): scale, tx, ty. scale<1 = zoom out."""
import sys, cv2, numpy as np
p = sys.argv[1]; step = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
cap = cv2.VideoCapture(p); fps = cap.get(5); fr = []
while True:
    ok, f = cap.read()
    if not ok: break
    fr.append(cv2.cvtColor(cv2.resize(f, (540, 960)), cv2.COLOR_BGR2GRAY))
orb = cv2.ORB_create(3000); bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
k = max(1, int(round(step * fps))); tot = 1.0
for i in range(0, len(fr) - k, k):
    a, b = fr[i], fr[i + k]
    ka, da = orb.detectAndCompute(a, None); kb, db = orb.detectAndCompute(b, None)
    if da is None or db is None: print(f"{i/fps:4.1f}s no features"); continue
    m = bf.match(da, db)
    if len(m) < 12: print(f"{i/fps:4.1f}s few matches {len(m)}"); continue
    pa = np.float32([ka[x.queryIdx].pt for x in m]); pb = np.float32([kb[x.trainIdx].pt for x in m])
    M, inl = cv2.estimateAffinePartial2D(pa, pb, method=cv2.RANSAC, ransacReprojThreshold=3)
    if M is None: print(f"{i/fps:4.1f}s no fit"); continue
    s = float(np.hypot(M[0, 0], M[1, 0])); tot *= s
    print(f"{i/fps:4.1f}s->{(i+k)/fps:4.1f}s scale={s:.4f} tx={M[0,2]:+6.1f} ty={M[1,2]:+6.1f} inliers={int(inl.sum())}/{len(m)}")
print(f"cumulative scale={tot:.4f}")
