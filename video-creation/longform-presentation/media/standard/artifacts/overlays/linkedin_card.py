"""LinkedIn end card: 1920x1080 PNG, the thumbnail's blue gradient + yellow banner + heavy black type."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
OUT = Path(__file__).with_name("linkedin-end-card.png")
BLACK = "C:/Windows/Fonts/ariblk.ttf"

# Diagonal gradient, the same royal-to-teal blue as the thumbnail background.
y, x = np.mgrid[0:H, 0:W]
t = ((x / W) * 0.6 + (1 - y / H) * 0.4)[..., None]
grad = (np.array([10, 72, 214]) * (1 - t) + np.array([42, 128, 170]) * t).astype("uint8")
img = Image.fromarray(grad, "RGB")
d = ImageDraw.Draw(img)


def centered(text, font, cy, fill):
    b = d.textbbox((0, 0), text, font=font)
    d.text(((W - (b[2] - b[0])) / 2 - b[0], cy - (b[3] - b[1]) / 2 - b[1]), text, font=font, fill=fill)


centered("Watch the full video on YouTube", ImageFont.truetype(BLACK, 80), 400, "white")

handle = "@aiEngineeringSimplied"
font = ImageFont.truetype(BLACK, 92)
b = d.textbbox((0, 0), handle, font=font)
tw, th = b[2] - b[0], b[3] - b[1]
pad_x, pad_y = 48, 40
d.rectangle([(W - tw) / 2 - pad_x, 610 - th / 2 - pad_y, (W + tw) / 2 + pad_x, 610 + th / 2 + pad_y], fill=(255, 240, 0))
centered(handle, font, 610, "black")

img.save(OUT)
print(OUT, img.size)
