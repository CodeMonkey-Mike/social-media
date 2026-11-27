"""QA contact sheets for chart-builder: every state PNG of one id on one sheet (labelled), so each still is opened and checked."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

PROJ = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
ids = sys.argv[1:]
font = ImageFont.truetype("arial.ttf", 22)
for cid in ids:
    files = []
    for folder in ("charts", "diagrams"):
        files += sorted((PROJ / "assets" / folder).glob(f"{cid}-*.png"))
    files = [f for f in files if f.stem[len(cid) + 1:] and not (cid == "C16" and f.stem.startswith("C16-ZOOM"))]
    if not files:
        continue
    w, h = 960, 540
    cols = 2
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w, rows * (h + 30)), "white")
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        im = Image.open(f).convert("RGB").resize((w, h), Image.LANCZOS)
        x, y = (i % cols) * w, (i // cols) * (h + 30)
        sheet.paste(im, (x, y + 30))
        d.text((x + 8, y + 4), f.name, fill="black", font=font)
    sheet.save(OUT / f"sheet-{cid}.png")
    print(OUT / f"sheet-{cid}.png", len(files))
