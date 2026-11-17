import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
V = Path(__file__).resolve().parent.parent; QA = V/"qa"; font = ImageFont.load_default(size=22)
ids = sys.argv[2:]; tiles = []
for b in ids:
    ims = [Image.open(QA/f"{b}-{t}.jpg").convert("RGB") for t in "abc"]
    w, h = ims[0].size; t = Image.new("RGB", (3*(w+4), h+30), (25,25,25))
    for k, im in enumerate(ims): t.paste(im, (k*(w+4), 30))
    ImageDraw.Draw(t).text((4,4), f"{b}  first | mid | last", fill=(255,255,0), font=font); tiles.append(t)
cols = 2; tw = max(t.size[0] for t in tiles); th = max(t.size[1] for t in tiles); rows = (len(tiles)+cols-1)//cols
s = Image.new("RGB", (cols*(tw+12), rows*(th+8)))
for n, t in enumerate(tiles): s.paste(t, ((n%cols)*(tw+12), (n//cols)*(th+8)))
s.save(V/f"qa-sheet-{sys.argv[1]}.jpg", quality=82); print(V/f"qa-sheet-{sys.argv[1]}.jpg", s.size)
