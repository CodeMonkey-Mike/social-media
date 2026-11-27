"""Frame strip from a chunk: python strip.py <chunk.mp4> <out.jpg> f1 f2 ... (chunk-relative frame numbers), 4 per row."""
import subprocess, sys
from PIL import Image, ImageDraw
src, out, fr = sys.argv[1], sys.argv[2], [int(x) for x in sys.argv[3:]]
tiles = []
for f in fr:
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'select=eq(n\,{f}),scale=480:270', '-vframes', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True)
    from io import BytesIO
    im = Image.open(BytesIO(p.stdout)).convert('RGB') if p.stdout else Image.new('RGB', (480, 270), 'red')
    ImageDraw.Draw(im).text((4, 4), str(f), fill='yellow')
    tiles.append(im)
rows = (len(tiles) + 3) // 4
S = Image.new('RGB', (1920, 270 * rows), 'gray')
for i, t in enumerate(tiles):
    S.paste(t, ((i % 4) * 480, (i // 4) * 270))
S.save(out, quality=85)
