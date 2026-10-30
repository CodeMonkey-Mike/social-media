"""Three left-aligned yellow highlight blocks (each hugging its own line), tilted as a group, on the clean plate."""
import sys, argparse
from PIL import Image, ImageDraw, ImageFont
ap = argparse.ArgumentParser()
ap.add_argument("plate"); ap.add_argument("out"); ap.add_argument("--font", required=True)
ap.add_argument("--wdth", type=float, default=100); ap.add_argument("--size", type=int, default=125)
ap.add_argument("--x0", type=int, default=80); ap.add_argument("--ytop", type=int, default=470)
ap.add_argument("--rot", type=float, default=0.0)
ap.add_argument("--angles", default="8.8,5.0,-4.0", help="per-block tilt, CCW positive, each block pivots on its own left-middle (the Fun Fun Function example: top rises 8.8, middle 5, bottom falls 4)"); ap.add_argument("--gap", type=int, default=36)
ap.add_argument("--padx", type=int, default=40); ap.add_argument("--pady", type=int, default=30)
ap.add_argument("--lines", default="AI Product Engineer|vs|AI Growth Engineer")
a = ap.parse_args()
YELLOW = (254, 241, 3, 255); BLACK = (0, 0, 0, 255)
base = Image.open(a.plate).convert("RGBA")
W, H = base.size
font = ImageFont.truetype(a.font, a.size)
axes = font.get_variation_axes()
vals = []
for ax in axes:
    n = ax["name"]
    vals.append(900 if n == b"Weight" else (a.wdth if n == b"Width" else ax["default"]))
font.set_variation_by_axes(vals)
angles = [float(v) for v in a.angles.split(",")] if a.angles else []
lines = a.lines.split("|")
y = a.ytop
report = []
out = base
for i, line in enumerate(lines):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = font.getbbox(line)          # ink box of THIS line (a short word gets a shorter block, like the example)
    bw, bh = (x1 - x0) + 2 * a.padx, (y1 - y0) + 2 * a.pady
    d.rectangle([a.x0, y, a.x0 + bw, y + bh], fill=YELLOW)
    d.text((a.x0 + a.padx - x0, y + a.pady - y0), line, font=font, fill=BLACK)
    ang = angles[i] if i < len(angles) else 0.0
    if ang:                                       # each block pivots on its own left-middle, so the left edges stay aligned
        layer = layer.rotate(ang, resample=Image.BICUBIC, center=(a.x0, y + bh / 2), expand=False)
    out = Image.alpha_composite(out, layer)
    report.append((line, a.x0 + bw, bh, ang))
    y += bh + a.gap
if a.rot:
    raise SystemExit("--rot (group tilt) is replaced by --angles (per block)")
out = out.convert("RGB")
out.save(a.out)
out.resize((1376, 768), Image.LANCZOS).save(a.out.replace(".png", "-preview.jpg"), quality=88)
print(a.out, "blocks (line, right edge x, height, tilt):", report, "group bottom", y - a.gap)
