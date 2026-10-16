"""Export thumbnail takes upload-ready: centre-crop to exact 16:9, 1920x1080, JPG q94 4:4:4 (YouTube's cap is 2 MB).

  python export_thumb.py takes/take-a.png takes/take-b.png ...   -> takes/take-a.jpg, takes/take-b.jpg, ...
"""
import os
import sys

from PIL import Image

for path in sys.argv[1:]:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    if w / h > 16 / 9:
        nw = round(h * 16 / 9)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = round(w * 9 / 16)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    out = os.path.splitext(path)[0] + ".jpg"
    im.resize((1920, 1080), Image.LANCZOS).save(out, quality=94, subsampling=0)
    kb = os.path.getsize(out) // 1024
    print(f"{out}  {kb} KB" + ("  OVER YouTube's 2 MB cap" if kb > 2000 else ""))
