"""clip-evals thumbnail, composed in code (the livestream thumb_kit): the background of Mike's earlier "Evals in AI"
thumbnail (7FCBlRdekMQ) with its person and text removed, Mike's EXACT picture from "Installing Python for AI
Engineering" (QRxh7VIjeMs) cut out and placed on the right, and "Eval" / "Harness" in yellow label boxes in the style
of the evals thumbnail. Mike, 2026-11-16: "i wanted my exact picture from the python video"."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[5] / "video-creation/livestream-repurpose/thumbnail"))
import thumb_kit as K
W, H = 1920, 1080
plate = HERE / "assets/plate-evals.png"
if not plate.exists():
    K.make_plate(Image.open(HERE / "reference-7FCBlRdekMQ.jpg"), plate, text_until_x=600)
canvas = Image.open(plate).convert("RGBA")
from rembg import new_session, remove
import numpy as np
src = Image.open(HERE / "reference-QRxh7VIjeMs.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
cut = remove(src, session=new_session("u2net_human_seg"))
import cv2
a = np.array(cut.split()[3]); a[:, :900] = 0
a = cv2.erode(a, np.ones((7, 7), np.uint8), borderType=cv2.BORDER_REPLICATE)   # drop the blue fringe of the source background      # only Mike: the Python thumbnail's text and tiles sit left of x 900
cut.putalpha(Image.fromarray(a).filter(ImageFilter.GaussianBlur(1.2)))
cut.save(HERE / "assets/mike-cut.png")
K.place_person(canvas, cut, scale=1.0, dx=0)
FONT = "C:/Windows/Fonts/ariblk.ttf"
def label(text, x, y, size, angle):
    f = ImageFont.truetype(FONT, size)
    l, t, r, b = f.getbbox(text); pad_x, pad_y = int(size * .22), int(size * .16)
    box = Image.new("RGBA", (r - l + 2 * pad_x, b - t + 2 * pad_y), (255, 222, 0, 255))
    ImageDraw.Draw(box).text((pad_x - l, pad_y - t), text, font=f, fill=(10, 10, 10, 255))
    box = box.rotate(angle, resample=Image.BICUBIC, expand=True)
    sh = Image.new("RGBA", box.size, (0, 0, 0, 0)); sh.putalpha(box.split()[3].point(lambda v: int(v * .45)))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)), (x + 8, y + 12)); canvas.alpha_composite(box, (x, y))
    return box.size
label("Eval", 120, 220, 210, 3)
label("Harness", 70, 510, 210, 3)
K.export(canvas, HERE / "takes/take-d-exact.jpg")
