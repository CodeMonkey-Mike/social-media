"""glow-on-black -> alpha-from-luminance (video-creation/SKILL.md 'Transparent overlays' working method)."""
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
lum = im.convert('L')
alpha = lum.point(lambda v: 0 if v < 12 else min(255, int(v * 1.8)))
out = im.copy(); out.putalpha(alpha)  # then un-premultiplied (rgb *= 255/alpha) so the glow keeps its hue
bbox = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
if bbox:                                   # crop to the subject + a margin so `width` sizes the arrow itself
    m = 40
    bbox = (max(0, bbox[0]-m), max(0, bbox[1]-m), min(im.width, bbox[2]+m), min(im.height, bbox[3]+m))
    out = out.crop(bbox)
out.save(dst)
print('alpha overlay', dst, out.size, 'mode', out.mode, 'bbox', bbox)
