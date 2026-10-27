import numpy as np
from PIL import Image
D = 'assets/card-slides/'
def load(n):
    im = Image.open(D + n + '.png').convert('RGB')
    return np.asarray(im).astype(int), im.size
def bbox(mask):
    ys, xs = np.where(mask)
    return xs.min(), ys.min(), xs.max(), ys.max()
def diffbox(a, b, region=None):
    A, (W, H) = load(a); B, _ = load(b)
    m = np.abs(A - B).sum(2) > 40
    if region:
        x0, y0, x1, y1 = [int(v) for v in (region[0]*W, region[1]*H, region[2]*W, region[3]*H)]
        mm = np.zeros_like(m); mm[y0:y1, x0:x1] = m[y0:y1, x0:x1]; m = mm
    x0, y0, x1, y1 = bbox(m)
    return [round(x0/W*1920), round(y0/H*1080), round((x1-x0)/W*1920), round((y1-y0)/H*1080)], (W, H)
print('size', load('C2-s1-s1')[1])
for a, b, r in [('C2-s1-s1','C2-s1-s2',None), ('C2-s1-s3','C2-s1b-s1',(0.5,0,1,0.45)), ('C2-s2-s1','C2-s2-s2',None),
                ('C2-s2-s2','C2-s2-s3',None), ('become-compare-s2','become-compare-s3',(0,0.6,0.5,1)),
                ('become-compare-s4','become-compare-s5',(0.5,0.6,1,1))]:
    print(b, diffbox(a, b, r))
# C2-s4-s1: gold and green text bboxes
A, (W, H) = load('C2-s4-s1')
gold = (A[:,:,0] > 200) & (A[:,:,1] > 170) & (A[:,:,2] < 90)
green = (A[:,:,0] < 90) & (A[:,:,1] > 160) & (A[:,:,2] < 140) & (A[:,:,1] - A[:,:,2] > 60)
for nm, m in (('gold', gold), ('green', green)):
    x0, y0, x1, y1 = bbox(m)
    print('C2-s4-s1', nm, [round(x0/W*1920), round(y0/H*1080), round((x1-x0)/W*1920), round((y1-y0)/H*1080)])
# card background colour near label B
print('bg samples', A[int(0.33*H), int(0.40*W)], A[int(0.30*H), int(0.45*W)])
