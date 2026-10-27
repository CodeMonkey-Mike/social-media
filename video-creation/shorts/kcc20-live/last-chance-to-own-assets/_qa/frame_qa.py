"""Frame QA for kcc20-live clip 2: pull frames INSIDE every overlay window + at every handoff, tile into contact sheets."""
import subprocess, sys, os
from PIL import Image, ImageDraw
R = sys.argv[1]; OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
FR = [0, 1, 27, 75, 77, 79, 100, 148, 153, 208, 230, 305, 345, 354, 357, 435, 492, 496, 570, 640, 646, 672, 676, 735, 818, 864, 866, 868, 900, 944]
tiles = []
for f in FR:
    p = os.path.join(OUT, f'f{f:04d}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', R, '-vf', f'select=eq(n\,{f})', '-vsync', '0', '-frames:v', '1', p], check=True)
    im = Image.open(p).convert('RGB').resize((216, 384)); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 120, 22), fill=(0, 0, 0)); d.text((4, 4), f'f{f} {f/30:.2f}s', fill=(255, 255, 0))
    tiles.append(im)
for k in range(0, len(tiles), 10):
    chunk = tiles[k:k+10]; sheet = Image.new('RGB', (216 * 5, 384 * 2))
    for i, t in enumerate(chunk): sheet.paste(t, ((i % 5) * 216, (i // 5) * 384))
    sheet.save(os.path.join(OUT, f'sheet{k//10}.png'))
print('ok', len(FR))
