"""bullish-on-kaspa thumbnail: the words STILL EARLY in code over a generated take. python build_thumb.py"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
FONT = "D:/video-work/bullish-on-kaspa/fonts/Montserrat-Italic-VF.ttf"  # Google Fonts, OFL; the Black weight of the variable font
def font(size):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_axes([900])
    return f, "Montserrat Black Italic"
W, H = 1920, 1080
LINES = [("STILL", (255, 255, 255)), ("EARLY", (94, 234, 196))]
import sys
for n in sys.argv[1:] or ("1", "2", "3"):
    im = Image.open(f"takes/take{n}.png").convert("RGB").resize((W, H), Image.LANCZOS)
    f, used = font(222)
    x0, y = 44, 572
    pitch = 224
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    for i, (t, _) in enumerate(LINES):
        sd.text((x0 + 6, y + i * pitch + 10), t, font=f, fill=(0, 0, 0, 235), stroke_width=20, stroke_fill=(0, 0, 0, 235))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    im.paste(shadow, (0, 0), shadow)
    d = ImageDraw.Draw(im)
    for i, (t, c) in enumerate(LINES):
        d.text((x0, y + i * pitch), t, font=f, fill=c, stroke_width=9, stroke_fill=(5, 16, 26))
    out = Path(f"takes/take{n}-still-early.png")
    im.save(out, optimize=True)
    print(out.name, used, round(out.stat().st_size / 2**20, 2), "MB")
