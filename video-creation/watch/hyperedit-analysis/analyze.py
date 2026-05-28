import glob, os, json
import numpy as np
from PIL import Image

frames = sorted(glob.glob('frames/f*.jpg'))
N = len(frames)
FPS = 30
print('frames:', N)

# Load downscaled grayscale arrays
W, H = 160, 90
arr = np.zeros((N, H, W), dtype=np.float32)
for i, f in enumerate(frames):
    im = Image.open(f).convert('L').resize((W, H))
    arr[i] = np.asarray(im, dtype=np.float32)

# Per-frame change score = mean abs diff vs previous frame (0..255)
diff = np.zeros(N, dtype=np.float32)
for i in range(1, N):
    diff[i] = np.mean(np.abs(arr[i] - arr[i-1]))
diff[0] = diff[1]

# Save raw scores
np.savetxt('change_scores.csv', diff, fmt='%.3f')

pcts = [50, 75, 90, 95, 97, 99]
print('change score percentiles:', {p: round(float(np.percentile(diff, p)),2) for p in pcts})
print('mean change:', round(float(diff.mean()),2), 'median:', round(float(np.median(diff)),2), 'max:', round(float(diff.max()),2))

# Cut detection: local maxima that are large relative to local neighborhood.
# A hard cut = score is a peak AND well above the rolling baseline.
def detect_cuts(diff, abs_thresh, rel_mult, win=15, min_gap=4):
    cuts = []
    last = -999
    for i in range(2, N-1):
        s = diff[i]
        lo = max(0, i-win); hi = min(N, i+win+1)
        local_med = np.median(diff[lo:hi])
        is_peak = s >= diff[i-1] and s >= diff[i+1]
        if is_peak and s > abs_thresh and s > rel_mult*local_med and (i-last) >= min_gap:
            cuts.append(i); last = i
    return cuts

# Try several thresholds to understand sensitivity
for at, rm in [(18,1.8),(22,1.9),(28,2.0),(35,2.2)]:
    c = detect_cuts(diff, at, rm)
    print(f'thresh abs>{at} rel>{rm}x  -> cuts={len(c)}  cuts/sec={len(c)/(N/FPS):.2f}')

# Choose a working threshold
CUTS = detect_cuts(diff, 22, 1.9)
cut_times = [round(c/FPS, 2) for c in CUTS]
json.dump({'cut_frames': CUTS, 'cut_times': cut_times}, open('cuts.json','w'))

# Shot lengths
bounds = [0] + CUTS + [N]
shots = [ (bounds[i+1]-bounds[i]) for i in range(len(bounds)-1) ]
shots_sec = np.array(shots)/FPS
print('\n--- SHOTS ---')
print('num shots:', len(shots))
print('avg shot len (s):', round(float(shots_sec.mean()),2))
print('median shot len (s):', round(float(np.median(shots_sec)),2))
print('shortest (s):', round(float(shots_sec.min()),2), 'longest (s):', round(float(shots_sec.max()),2))
# histogram of shot lengths in buckets
buckets = [(0,0.5),(0.5,1),(1,1.5),(1.5,2),(2,3),(3,5),(5,99)]
print('shot-length distribution:')
for a,b in buckets:
    n = int(((shots_sec>=a)&(shots_sec<b)).sum())
    print(f'  {a}-{b}s: {n}')

# Motion intensity per second (mean change score, excluding cut spikes)
print('\n--- MOTION PER 10s BLOCK (mean change, cuts excluded) ---')
mask = np.ones(N, bool)
for c in CUTS:
    mask[max(0,c-1):c+2] = False
for blk in range(0, 100, 10):
    lo, hi = blk*FPS, min(N,(blk+10)*FPS)
    seg = diff[lo:hi][mask[lo:hi]]
    print(f'  {blk:>3}-{blk+10}s: motion={seg.mean():.1f}  cuts={sum(1 for c in CUTS if lo<=c<hi)}')

# Fraction of seconds that contain at least one cut OR high motion
sec_has_event = 0
for s in range(100):
    lo, hi = s*FPS, (s+1)*FPS
    has_cut = any(lo<=c<hi for c in CUTS)
    hi_motion = diff[lo:hi].mean() > np.percentile(diff,60)
    if has_cut or hi_motion:
        sec_has_event += 1
print(f'\nseconds (of 100) with a cut or above-median motion: {sec_has_event}')
print('DONE')
