# For a pre-framed motion scene: sample the content rect (scene px) on a grid; every sample must land ON screen for every
# engine t (margin printed), and no sample of a wrapped copy (+-1920 / +-1080) may land on screen in front of the camera.
import sys, itertools, math
exec(open('visible.py').read().split('def inv(')[0])
def proj(x, y, t):
    dx, dy = kf2(P['drift'], t); gx, gy = P['geoPos']
    px = x + (dx - .5)*W + (gx - .5)*W - W/2; py = y + (dy - .5)*H + (gy - .5)*H - H/2
    r = math.radians(P['geoRot']); px, py = px*math.cos(r) - py*math.sin(r), px*math.sin(r) + py*math.cos(r)
    a = math.radians(-kf(P['tilt'], t)); y1, z1 = py*math.cos(a), py*math.sin(a)
    f = math.radians(kf(P['swivel'], t)); x2, z2 = px*math.cos(f) + z1*math.sin(f), -px*math.sin(f) + z1*math.cos(f)
    z = z2 + (-kf(P['dist'], t)*DPU)
    if PERSP - z <= 1: return None
    s = PERSP/(PERSP - z); return W/2 + x2*s, H/2 + y1*s
x0, y0, x1, y1 = map(float, sys.argv[2:6])
grid = [(x0 + (x1 - x0) * i / 24, y0 + (y1 - y0) * j / 12) for i in range(25) for j in range(13)]
worst_in, dups = 1e9, 0
for k in range(42):
    t = k * 4.96 / 41
    for (x, y) in grid:
        p = proj(x, y, t)
        worst_in = min(worst_in, -1e9 if p is None else min(p[0], p[1], 1920 - p[0], 1080 - p[1]))
        for dx, dy in itertools.product([-1920, 0, 1920], [-1080, 0, 1080]):
            if dx == dy == 0: continue
            q = proj(x + dx, y + dy, t)
            if q and 0 <= q[0] <= 1920 and 0 <= q[1] <= 1080: dups += 1
print(f"{sys.argv[1]} content [{x0:.0f},{y0:.0f}]-[{x1:.0f},{y1:.0f}]: min margin to the screen edge = {worst_in:.0f} px; wrapped-copy samples on screen = {dups}")
