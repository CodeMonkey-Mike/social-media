"""reset thumbnail: modeled on dKwFdQMXv-c (dark bg, Mike right, round glowing badge top-center, 2-line text left).
python build.py  -> thumb-A.png (engraved Franklin) + thumb-B.png (red-tinted Franklin, cracked red ring)"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageChops
HERE = Path(__file__).parent
W, H = 1280, 720
FONT = "C:/Windows/Fonts/segoeuib.ttf"
LINE1, LINE2 = "Everything is", "crashing"


def background():
    bg = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(bg)
    for y in range(H):   # charcoal, a touch lighter at the bottom like the reference
        v = int(30 + 22 * (y / H) ** 1.6)
        d.line([(0, y), (W, y)], fill=(v, v - 1, v - 2))
    return bg


def portrait(src="portrait2.png", hgt=900):
    p = Image.open(HERE / src).convert("RGB")
    if src == "ref-thumb.jpg":   # fallback: Mike's own photo from the reference thumbnail, right side
        p = p.crop((740, 0, 1280, 720))
    s = hgt / p.height
    p = p.resize((int(p.width * s), hgt), Image.LANCZOS)
    mask = Image.new("L", p.size, 255)
    md = ImageDraw.Draw(mask)
    fade = int(p.width * 0.32)
    for x in range(fade):   # soften the left edge into the background
        md.line([(x, 0), (x, p.height)], fill=int(255 * (x / fade) ** 1.3))
    return p, mask


def badge(variant):
    D = 230
    fr = Image.open(HERE / "franklin.jpg").convert("L")
    w, h = fr.size
    side = int(w * 0.72)
    fr = fr.crop(((w - side) // 2, int(h * 0.08), (w + side) // 2, int(h * 0.08) + side)).resize((D, D), Image.LANCZOS)
    fr = ImageOps.autocontrast(fr, cutoff=1)
    if variant == "A":   # banknote green-gray engraving
        col = ImageOps.colorize(fr, black=(18, 34, 28), white=(214, 226, 214))
        ring = (255, 255, 255)
    else:                # red-tinted, the crash
        col = ImageOps.colorize(fr, black=(40, 6, 8), white=(255, 196, 190))
        ring = (235, 40, 50)
    m = Image.new("L", (D, D), 0)
    ImageDraw.Draw(m).ellipse([0, 0, D - 1, D - 1], fill=255)
    pad = 40
    out = Image.new("RGBA", (D + 2 * pad, D + 2 * pad), (0, 0, 0, 0))
    glow = Image.new("L", out.size, 0)
    ImageDraw.Draw(glow).ellipse([pad - 10, pad - 10, pad + D + 9, pad + D + 9], fill=255)
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    out.paste(Image.new("RGBA", out.size, ring + (255,)), (0, 0), glow.point(lambda v: int(v * 0.85)))
    out.paste(col.convert("RGBA"), (pad, pad), m)
    d = ImageDraw.Draw(out)
    d.ellipse([pad - 4, pad - 4, pad + D + 3, pad + D + 3], outline=ring, width=8)
    if variant == "B":   # a jagged crack through the ring
        c = [(pad + D * 0.62, pad - 6), (pad + D * 0.55, pad + D * 0.22), (pad + D * 0.68, pad + D * 0.38),
             (pad + D * 0.52, pad + D * 0.62), (pad + D * 0.64, pad + D * 0.8), (pad + D * 0.56, pad + D + 6)]
        d.line(c, fill=(20, 0, 0), width=7, joint="curve")
        d.line(c, fill=ring, width=3, joint="curve")
    return out


def build(variant, src="portrait2.png", name=None):
    img = background()
    if src == "ref-thumb.jpg":
        p, mask = portrait(src, 720)
        img.paste(p, (W - p.width, 0), mask)
    else:
        p, mask = portrait(src, 900)
        img.paste(p, (W - p.width + 110, -40), mask)
    b = badge(variant)
    img.paste(b, (520 - b.width // 2, 40), b)
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, 92)
    x, y1 = 62, 318
    d.text((x, y1), LINE1, font=f, fill=(255, 255, 255))
    y2 = y1 + 118
    bb = d.textbbox((x + 14, y2), LINE2, font=f)
    d.rectangle([x - 6, bb[1] - 18, bb[2] + 22, bb[3] + 24], fill=(255, 255, 255))
    d.text((x + 14, y2), LINE2, font=f, fill=(10, 10, 10))
    out = HERE / (name or f"thumb-{variant}.png")
    img.save(out)
    print(out)


if __name__ == "__main__":
    build("B", "portrait2.png", "thumb-B-new-portrait.png")
    build("B", "ref-thumb.jpg", "thumb-B-reference-photo.png")
