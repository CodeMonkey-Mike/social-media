"""glow-on-black -> alpha (video-creation/SKILL.md 'Transparent overlays' working method), VALUE variant:
alpha = max(R,G,B) (boosted) instead of luminance, so a saturated red/gold glow stays opaque (luminance makes a
pure red ~54% transparent). RGB is un-premultiplied (rgb *= 255/alpha) so the glow keeps its hue."""
import sys
import numpy as np
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(float)
v = im.max(axis=2)
a = np.where(v < 14, 0, np.clip((v - 14) * 1.6, 0, 255))
rgb = np.where(a[..., None] > 0, np.clip(im * 255.0 / np.maximum(v, 1)[..., None], 0, 255), 0)
out = np.dstack([rgb, a]).astype(np.uint8)
img = Image.fromarray(out, 'RGBA')
bbox = Image.fromarray((a > 24).astype(np.uint8) * 255).getbbox()
if bbox:
    m = 40
    bbox = (max(0, bbox[0]-m), max(0, bbox[1]-m), min(img.width, bbox[2]+m), min(img.height, bbox[3]+m))
    img = img.crop(bbox)
img.save(dst)
print('alpha overlay', dst, img.size, img.mode, 'bbox', bbox)
