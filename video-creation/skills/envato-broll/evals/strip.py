"""strip.py <mp4> <t0> <t1> <step> <out.jpg>: frames every step s, labelled, 6 per row"""
import subprocess, sys
from PIL import Image, ImageDraw, ImageFont
mp4, t0, t1, step, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
ims = []; t = t0
while t <= t1 + 1e-6:
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", mp4, "-frames:v", "1", "-vf", "scale=256:144", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True)
    if r.stdout:
        import io
        im = Image.open(io.BytesIO(r.stdout)).convert("RGB")
        ImageDraw.Draw(im).text((4, 2), f"{t:.1f}", fill=(255, 220, 0), font=font)
        ims.append(im)
    t += step
cols = 6; rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (256 * cols, 144 * rows))
for k, im in enumerate(ims): sheet.paste(im, ((k % cols) * 256, (k // cols) * 144))
sheet.save(out, quality=80); print(out, len(ims))
