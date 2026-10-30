"""reset thumbnail, FINAL approach (Mike 2026-10-30): the reference thumbnail itself (dKwFdQMXv-c: his photo + its
charcoal gradient) with ONLY the text and the badge replaced. Old text + robot badge are painted out with the
background sampled row-by-row from the clean left edge.  python build_ref.py -> thumb-FINAL.png"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import build   # reuses badge() + FONT + text lines

HERE = Path(__file__).parent
img = Image.open(HERE / "ref-thumb.jpg").convert("RGB").resize((1280, 720))
px = img.load()
d = ImageDraw.Draw(img)
# the portrait's left silhouette, measured on the reference (y, x): hair, then the shoulder curve. The old "than"
# ends ~x 755 at rows 318-400, so those rows erase a little further (the hair starts ~x 760 there).
SIL = [(0, 742), (312, 742), (318, 764), (400, 764), (405, 742), (440, 700), (480, 650), (520, 622), (550, 607),
       (600, 598), (720, 587)]


def edge_at(y):
    for (y0, x0), (y1, x1) in zip(SIL, SIL[1:]):
        if y0 <= y <= y1:
            return int(x0 + (x1 - x0) * (y - y0) / max(1, y1 - y0)) - 4
    return SIL[-1][1] - 4


for y in range(720):   # erase x 0..PORTRAIT_EDGE with each row's own background colour
    cols = [px[x, y] for x in range(4, 30)]
    c = tuple(sum(v[i] for v in cols) // len(cols) for i in range(3))
    d.line([(0, y), (edge_at(y), y)], fill=c)

b = build.badge("B")
img.paste(b, (520 - b.width // 2, 40), b)
f = ImageFont.truetype(build.FONT, 92)
x, y1 = 62, 318
d.text((x, y1), build.LINE1, font=f, fill=(255, 255, 255))
y2 = y1 + 118
bb = d.textbbox((x + 14, y2), build.LINE2, font=f)
d.rectangle([x - 6, bb[1] - 18, bb[2] + 22, bb[3] + 24], fill=(255, 255, 255))
d.text((x + 14, y2), build.LINE2, font=f, fill=(10, 10, 10))
img.save(HERE / "thumb-FINAL.png")
print(HERE / "thumb-FINAL.png")
