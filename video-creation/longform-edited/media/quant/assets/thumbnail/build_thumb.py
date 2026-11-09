"""quant thumbnail: DETAILED ANALYSIS in code over a Nano Banana Pro take (Mike on the white Quant-look backdrop). python build_thumb.py [1 2]"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import sys
FONT = "D:/video-work/bullish-on-kaspa/fonts/Montserrat-Italic-VF.ttf"   # Google Fonts, OFL; Black weight of the variable font
def font(size):
    f = ImageFont.truetype(FONT, size); f.set_variation_by_axes([900]); return f
W, H = 1920, 1080
INK, ORANGE = (67, 64, 62), (241, 90, 34)
LINES = [("DETAILED", INK), ("ANALYSIS", ORANGE)]
for n in sys.argv[1:] or ("1", "2"):
    im = Image.open(f"takes/take{n}.png").convert("RGB").resize((W, H), Image.LANCZOS)
    # Mike (2026-11-06): the logo doubled; the baked small one is covered by a white patch, the crop is keyed on its dark pixels
    d0 = ImageDraw.Draw(im); d0.rectangle((56, 36, 396, 236), fill=(255, 255, 255))
    logo = Image.open("src/quant_logo_crop.png").convert("RGB")
    lw = 660; lh = int(logo.height * lw / logo.width); logo = logo.resize((lw, lh), Image.LANCZOS)
    lum = logo.convert("L"); alpha = lum.point(lambda v: max(0, min(255, int((235 - v) * 255 / 160))))
    logo_rgba = logo.copy(); logo_rgba.putalpha(alpha); im.paste(logo_rgba, (64, 40), logo_rgba)
    f = font(196); x0, y0, pitch = 64, 470, 212
    # a soft white halo so the words sit clean on the faint sketch (white page: no black drop shadow)
    halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
    for i, (t, _) in enumerate(LINES):
        hd.text((x0, y0 + i * pitch), t, font=f, fill=(255, 255, 255, 255), stroke_width=26, stroke_fill=(255, 255, 255, 255))
    halo = halo.filter(ImageFilter.GaussianBlur(10)); im.paste(halo, (0, 0), halo)
    d = ImageDraw.Draw(im)
    for i, (t, c) in enumerate(LINES):
        d.text((x0, y0 + i * pitch), t, font=f, fill=c, stroke_width=3, stroke_fill=c)
    out = Path(f"takes/take{n}-detailed-analysis.png"); im.save(out, optimize=True)
    print(out.name, round(out.stat().st_size / 2**20, 2), "MB")
