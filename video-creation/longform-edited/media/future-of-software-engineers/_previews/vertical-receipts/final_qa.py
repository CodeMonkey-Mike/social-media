from vlib import *
from PIL import ImageDraw, ImageFont
TWINS = sorted(p.name for p in (PROJ / "assets" / "receipts").glob("*.png"))
OUTS = sorted(p.name for p in OUT.iterdir())
print("16:9 twins :", TWINS)
print("vertical   :", OUTS)
print("names match exactly:", TWINS == OUTS, "| extra/missing:", sorted(set(OUTS) ^ set(TWINS)))
ok_all = True
rows = []
for name in OUTS:
    im = Image.open(OUT / name).convert("RGB")
    W, H = im.size
    px = im.load()
    ref = px[W // 2, H - 1]
    tol = 10
    far = lambda c: max(abs(a - b) for a, b in zip(c, ref)) > tol
    mc = margin_check(OUT / name)
    # side-edge ink: fraction of rows with non-background ink in the outer 5 px columns (a border would be ~1.0)
    def edge_frac(xs):
        n = 0
        for y in range(0, H, 2):
            if any(far(px[x, y]) for x in xs):
                n += 1
        return n / (H / 2)
    left, right = edge_frac(range(0, 5)), edge_frac(range(W - 5, W))
    # bottom must end on >= 30 px blank
    ok = (im.size == (1080, 1920)) and mc["bottom_flat"] and (mc["bottom_margin_px"] or 0) >= 30 and left < 0.5 and right < 0.5
    ok_all &= ok
    rows.append((name, im.size, mc["bottom_margin_px"], round(left, 2), round(right, 2), "PASS" if ok else "FAIL"))
for r in rows:
    print("%-26s size=%s bottom_blank=%4spx left_ink=%s right_ink=%s  %s" % r)
print("ALL PASS" if ok_all else "SOME FAIL")
# contact sheet
cols, tw, th = 4, 270, 480
sheet = Image.new("RGB", (cols * (tw + 12) + 12, 3 * (th + 34) + 12), (60, 60, 60))
d = ImageDraw.Draw(sheet)
for i, name in enumerate(OUTS):
    im = Image.open(OUT / name).convert("RGB").resize((tw, th), Image.LANCZOS)
    x = 12 + (i % cols) * (tw + 12); y = 12 + (i // cols) * (th + 34)
    sheet.paste(im, (x, y + 22)); d.text((x, y + 4), name, fill=(255, 255, 255))
sheet.save(HERE / "qa-contact-sheet.png")
print("contact sheet:", HERE / "qa-contact-sheet.png")
