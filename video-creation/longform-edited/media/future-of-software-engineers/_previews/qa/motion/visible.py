# Replicates remotion/src/transitions/engines/Motion3D.tsx's transform chain and prints, for engine times t, the SCENE
# coordinates (px, tile 0 = [0,1920]x[0,1080]) seen at screen points (corners, edge midpoints, centre).
import json, math, sys
W, H, PERSP, DPU = 1920, 1080, 1600, 12
lib = json.load(open('C:/Users/mnede/Documents/Claude/social-media/video-creation/assets/transitions/library.json', encoding='utf-8'))['transitions']
row = next(r for r in lib if r['id'] == sys.argv[1]); P = row['params']
def bez(a, b, c, d, s): u = 1 - s; return u*u*u*a + 3*u*u*s*b + 3*u*s*s*c + s*s*s*d
def seg(t0, t1, h0, h1, L, t):
    dt = t1 - t0; lin = (t - t0) / dt
    if (h0.get('oi') is None and h1.get('ii') is None) or L == 0: return lin
    oi = min(1, max(1e-4, h0.get('oi', 1/3))); ii = min(1, max(1e-4, h1.get('ii', 1/3)))
    c1t, c2t = t0 + oi*dt, t1 - ii*dt; c1p = h0.get('ov', 0)*oi*dt/L; c2p = 1 - h1.get('iv', 0)*ii*dt/L
    lo, hi, s = 0, 1, lin
    for _ in range(40):
        s = (lo + hi) / 2
        if bez(t0, c1t, c2t, t1, s) < t: lo = s
        else: hi = s
    return bez(0, c1p, c2p, 1, s)
def kf(k, t):
    if len(k) == 1 or t <= k[0]['t']: return k[0]['v']
    if t >= k[-1]['t']: return k[-1]['v']
    a, b = k[0], k[1]; return a['v'] + (b['v'] - a['v']) * seg(a['t'], b['t'], a, b, b['v'] - a['v'], t)
def kf2(k, t):
    if len(k) == 1 or t <= k[0]['t']: return k[0]['x'], k[0]['y']
    if t >= k[-1]['t']: return k[-1]['x'], k[-1]['y']
    a, b = k[0], k[1]; L = math.hypot(b['x']-a['x'], b['y']-a['y']); p = seg(a['t'], b['t'], a, b, L, t)
    return a['x'] + (b['x']-a['x'])*p, a['y'] + (b['y']-a['y'])*p
def fwd(x, y, t):   # scene point (tile 0 coords) -> screen
    dx, dy = kf2(P['drift'], t); gx, gy = P['geoPos']
    px = x + (dx - .5)*W + (gx - .5)*W - W/2; py = y + (dy - .5)*H + (gy - .5)*H - H/2
    r = math.radians(P['geoRot']); px, py = px*math.cos(r) - py*math.sin(r), px*math.sin(r) + py*math.cos(r)
    a = math.radians(-kf(P['tilt'], t)); y1, z1 = py*math.cos(a), py*math.sin(a)
    f = math.radians(kf(P['swivel'], t)); x2, z2 = px*math.cos(f) + z1*math.sin(f), -px*math.sin(f) + z1*math.cos(f)
    z = z2 + (-kf(P['dist'], t)*DPU); s = PERSP/(PERSP - z)
    return W/2 + x2*s, H/2 + y1*s
def inv(sx, sy, t):  # Newton on fwd
    x, y = W/2, H/2
    for _ in range(60):
        fx, fy = fwd(x, y, t); ex, ey = fx - sx, fy - sy
        if abs(ex) < .01 and abs(ey) < .01: break
        h = .5; ax = (fwd(x+h, y, t)[0]-fx)/h; bx = (fwd(x, y+h, t)[0]-fx)/h; ay = (fwd(x+h, y, t)[1]-fy)/h; by = (fwd(x, y+h, t)[1]-fy)/h
        det = ax*by - bx*ay; x -= (ex*by - ey*bx)/det; y -= (ey*ax - ex*ay)/det
    return x, y
pts = {'TL': (0, 0), 'TC': (960, 0), 'TR': (1920, 0), 'ML': (0, 540), 'C': (960, 540), 'MR': (1920, 540), 'BL': (0, 1080), 'BC': (960, 1080), 'BR': (1920, 1080)}
for t in [0, 1.0, 2.0, 3.0, 4.0, 4.96]:
    print(f"t={t:4}: " + '  '.join(f"{k}({inv(*v, t)[0]:6.0f},{inv(*v, t)[1]:5.0f})" for k, v in pts.items()))
