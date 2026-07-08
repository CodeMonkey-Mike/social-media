"""Build a labeled contact sheet of Envato candidate preview covers for one slot, so picks are
made by SEEING the clips (skill rule), not just keywords. Usage: python make_contact.py <slot.json>"""
import json, sys, os, urllib.request
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

js = sys.argv[1]
cand = json.load(open(js, encoding="utf-8"))
slot = os.path.splitext(os.path.basename(js))[0]
cell_w, cell_h, pad, cols = 480, 270, 8, 3
rows = (len(cand) + cols - 1) // cols
sheet = Image.new("RGB", (cols*(cell_w+pad)+pad, rows*(cell_h+pad)+pad), (12, 14, 20))
draw = ImageDraw.Draw(sheet)
try: font = ImageFont.truetype("arialbd.ttf", 22)
except Exception: font = ImageFont.load_default()
for i, c in enumerate(cand):
    r, col = divmod(i, cols)
    x, y = pad + col*(cell_w+pad), pad + r*(cell_h+pad)
    try:
        raw = urllib.request.urlopen(c["previewImage"], timeout=20).read()
        im = Image.open(BytesIO(raw)).convert("RGB")
        im.thumbnail((cell_w, cell_h))
        sheet.paste(im, (x+(cell_w-im.width)//2, y+(cell_h-im.height)//2))
    except Exception:
        draw.rectangle([x, y, x+cell_w, y+cell_h], fill=(40, 20, 20))
        draw.text((x+10, y+10), f"[{i}] load fail", fill=(255,160,160), font=font)
        continue
    lab = f"[{i}] {c.get('duration','')}"
    draw.rectangle([x, y, x+len(lab)*13+16, y+30], fill=(0,0,0))
    draw.text((x+8, y+4), lab, fill=(95, 224, 238), font=font)
out = os.path.join(os.path.dirname(js), f"_sheet-{slot}.png")
sheet.save(out)
print(out)
