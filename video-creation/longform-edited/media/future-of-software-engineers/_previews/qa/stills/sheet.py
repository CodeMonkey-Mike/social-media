# usage: python sheet.py out.png f1 f2 f3 f4   -> a 2x2 contact sheet (960x540 tiles) with frame labels
import sys
from PIL import Image, ImageDraw
out, frames = sys.argv[1], sys.argv[2:]
S = Image.new('RGB', (1920, 1080), (40, 40, 40))
d = ImageDraw.Draw(S)
for i, f in enumerate(frames[:4]):
    im = Image.open(f'f{int(f):05d}.png').convert('RGB').resize((960, 540))
    x, y = (i % 2) * 960, (i // 2) * 540
    S.paste(im, (x, y))
    d.rectangle([x, y, x + 150, y + 28], fill=(0, 0, 0))
    d.text((x + 6, y + 6), f'f{f} {int(f)/30:.2f}s', fill=(255, 255, 0))
S.save(out)
