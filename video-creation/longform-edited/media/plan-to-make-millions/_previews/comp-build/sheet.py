"""2x2 contact sheet of QA stills: python sheet.py out.jpg a.jpg b.jpg c.jpg d.jpg"""
import os
import sys

from PIL import Image, ImageDraw

out, files = sys.argv[1], sys.argv[2:]
S = Image.new('RGB', (1920, 1080), 'gray')
for i, f in enumerate(files[:4]):
    im = Image.open(f).convert('RGB').resize((958, 538))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 260, 22], fill='black')
    d.text((4, 4), os.path.basename(f), fill='yellow')
    S.paste(im, ((i % 2) * 962, (i // 2) * 542))
S.save(out, quality=85)
