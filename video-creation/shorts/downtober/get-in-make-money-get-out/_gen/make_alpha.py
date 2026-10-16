"""glow-on-black -> RGBA. Background = border-connected near-black region (so dark pixels INSIDE the subject, e.g. burlap
shadows, stay opaque); inside that region alpha follows the max channel (glow feathers out), elsewhere alpha 255."""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.float32)
mx = a.max(axis=2)
dark = mx < 42
lab, n = ndimage.label(dark)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(border))
glow = np.clip((mx - 10) * 3.0, 0, 255)
alpha = np.where(bg, glow, 255.0)
alpha = np.asarray(Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
alpha[mx < 8] = 0
out = np.dstack([a, alpha]).clip(0, 255).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(dst)
print(dst, 'bg %.1f%%' % (100 * bg.mean()), 'opaque %.1f%%' % (100 * (alpha > 250).mean()))
