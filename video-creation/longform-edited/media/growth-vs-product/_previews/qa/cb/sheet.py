import sys, glob, os
from PIL import Image, ImageDraw
pat, out = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(pat))
W, H = 640, 360; cols = 3; rows = (len(fs) + cols - 1) // cols
sheet = Image.new('RGB', (W * cols, (H + 20) * rows), 'gray')
d = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB'); im.thumbnail((W, H))
    x = (i % cols) * W; y = (i // cols) * (H + 20)
    sheet.paste(im, (x, y + 20)); d.text((x + 4, y + 4), os.path.basename(f), fill='white')
sheet.save(out)
