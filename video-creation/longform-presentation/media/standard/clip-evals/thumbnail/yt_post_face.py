"""clip-evals YT post face still (2026-11-17): Mike's picture from the Python video's thumbnail (reference-QRxh7VIjeMs.jpg,
the picture the clip-evals thumbnail uses), FULL WIDTH, with that video's title words and icons cleared from the plain
blue backdrop to the left of him, so the carousel builder can frame his face as designed (a 572 px crop of just him was
too narrow: visual-qa failed slides 1 and 10 for a 35% oversize face with the forehead off the top edge).

- The 3 black letterbox rows at the top and bottom of the YouTube thumbnail are trimmed (1280x714).
- The fill is thumb_kit.make_plate's (Telea inpaint at 1/8 scale, a wide blur, grain measured on the clean backdrop),
  WITHOUT its person removal. A person mask (rembg u2net_human_seg, as thumb_kit uses) only PROTECTS Mike: the fill is
  computed from the backdrop alone and never blended onto him. He is never cut out, never composited, never changed:
  the script asserts every pixel inside his (grown) person mask equals the source.
Usage: python yt_post_face.py  ->  yt-post-face-full.png (then run.py ytpost ... --face thumbnail/yt-post-face-full.png)
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
SRC, OUT = HERE / "reference-QRxh7VIjeMs.jpg", HERE / "yt-post-face-full.png"
TRIM = (3, 717)    # source rows kept: 0-2 and 717-719 are the thumbnail's black letterbox lines
TEXT_END_X = 712   # the title words and icons end by x ~700 of the 1280-wide source
KEEP_X = 736       # his hair starts at x ~745: no column from here right is ever changed

src = Image.open(SRC).convert("RGB").crop((0, TRIM[0], 1280, TRIM[1]))
a = np.array(src).astype(np.float32)
h, w = a.shape[:2]

from rembg import new_session, remove   # noqa: E402  (protect mask only)
alpha = np.array(remove(src, session=new_session("u2net_human_seg")).split()[3])
person = (alpha > 10).astype(np.uint8) * 255
guard = cv2.dilate(person, np.ones((51, 51), np.uint8))          # a wide margin around his curls and shoulders

r, g, b = a[..., 0], a[..., 1], a[..., 2]
notblue = ((r > 60) | (b < g)).astype(np.uint8) * 255                         # white / yellow / light-blue words, icons
edges = (np.abs(a - cv2.GaussianBlur(a, (0, 0), 12)).sum(2) > 45).astype(np.uint8) * 255   # the blue half of the logo
seed = cv2.max(notblue, edges)
seed[:, TEXT_END_X:] = 0
seed[guard > 0] = 0
apply = cv2.dilate(seed, np.ones((45, 45), np.uint8))
apply[:, KEEP_X:] = 0
apply[guard > 0] = 0

unknown = cv2.max(apply, guard)          # the fill is estimated from the backdrop only, never from him
low = cv2.GaussianBlur(a, (0, 0), 6)
small = cv2.resize(low, (w // 8, h // 8), interpolation=cv2.INTER_AREA)
ms = (cv2.resize(unknown, (w // 8, h // 8), interpolation=cv2.INTER_AREA) > 0).astype(np.uint8) * 255
fill = cv2.inpaint(np.clip(small, 0, 255).astype(np.uint8), ms, 6, cv2.INPAINT_TELEA).astype(np.float32)
fill = cv2.GaussianBlur(cv2.resize(fill, (w, h), interpolation=cv2.INTER_CUBIC), (0, 0), 25)

clean = cv2.erode((unknown == 0).astype(np.uint8), np.ones((15, 15), np.uint8)) > 0   # grain measured on the backdrop
bands = ((a - cv2.GaussianBlur(a, (0, 0), 1.5), 0.7), (cv2.GaussianBlur(a, (0, 0), 1.5) - low, 3.0))
rng = np.random.default_rng(3)
grain = np.zeros_like(a)
for band, sig in bands:
    n = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), sig)
    grain += (n / n.std())[..., None] * band[clean].std(0)[None, None, :]

m = cv2.GaussianBlur((apply > 0).astype(np.float32), (0, 0), 4)
m[guard > 0] = 0
m[:, KEEP_X:] = 0
out = np.clip(a * (1 - m[..., None]) + (fill + grain) * m[..., None], 0, 255).astype(np.uint8)
mine = a.astype(np.uint8)
assert np.array_equal(out[guard > 0], mine[guard > 0]), "a pixel of Mike (or his margin) changed"
assert np.array_equal(out[:, KEEP_X:], mine[:, KEEP_X:]), "a column right of the title changed"
Image.fromarray(out).save(OUT)
print(f"wrote {OUT} {w}x{h}; {int((m > 0).sum())} backdrop px refilled; Mike + a 25 px margin byte-identical to the source")
