#!/usr/bin/env python
"""Thumbnail takes for the langgraph-updates video (AI Engineering Simplified). Mike, 2026-11-19:
"use this thumbnail as the theme" = his own "Do You Actually Need LangGraph?" thumbnail (youtu.be/Am7Z_CwtioY), and
"add my picture as it is shown here" = his "Python over JavaScript" thumbnail (youtu.be/h6aUzaCab2I).

Composed in code, no image model:
  - the THEME is rebuilt from numbers measured off the LangGraph thumbnail's own pixels (reference/): the near-black
    plate with a teal glow in two corners, the white + emerald headline (Roboto Bold, all caps, top left), grey
    "before" shapes with a soft white glow, emerald "after" nodes, and the thick emerald arrow between them;
  - MIKE is his exact picture from the Python thumbnail, cut out by cut_mike.py (assets/mike-cut.png), in the same
    place and at the same size, moved PERSON_DX px to the right so the headline has room.

Every diagram shows what the video says: the step that builds a short went from one agent to three (the builder, the
image agent, the checker), with a retry arrow from the check back to the images; the graph went from 6 agents to 7.

Run:  python build.py            -> takes/take-<x>.jpg (1920x1080) + _qa/contact.jpg + _qa/small.jpg
      python build.py --only a   -> one take
"""
import argparse
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[4]
FONT = REPO / "video-creation" / "cache" / "thumbnail" / "fonts" / "Roboto-var.ttf"
W, H, SS = 1920, 1080, 2

# measured off reference/need-langgraph-original-2752.png (scaled to 1920x1080)
BASE = (15, 14, 20)              # the plate
CORNER = (8, 28, 38)             # its teal corners (top left, right side)
GREEN = (22, 221, 133)           # the emerald of LANGGRAPH, the arrow and the node borders
WHITE = (254, 254, 254)
NODE_FILL = (236, 255, 246)      # the near-white inside an outlined node
GREY = (150, 152, 158)           # the "before" shapes
GREY_DARK = (58, 60, 66)
HEAD_X, HEAD_Y = 84, 84          # headline's top-left ink corner (the reference: 103, 85)
LINE_GAP = 0.33                  # gap between lines, in cap heights (the reference: 34 px on a 106 px cap)

PERSON_DX = 80                   # Mike moved right of his place in the Python thumbnail
HAIR_LEFT = 1014 + PERSON_DX     # his hair's left edge, y 250 to 600
TEXT_RIGHT = HAIR_LEFT - 54      # nothing of the headline goes past here


# ---------------------------------------------------------------- plate

def plate():
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    img = np.ones((H, W, 3), np.float32) * np.array(BASE, np.float32)

    def glow(cx, cy, rx, ry, col, k=1.0):
        d2 = ((xs - cx) / rx) ** 2 + ((ys - cy) / ry) ** 2
        img[...] += (np.exp(-d2) * k)[..., None] * (np.array(col, np.float32) - np.array(BASE, np.float32))

    glow(0, 0, 720, 520, CORNER)                    # the reference's top-left teal
    glow(W, H, 900, 620, CORNER)                    # and its right side
    glow(1500, 560, 560, 620, (10, 74, 96), 1.0)    # a lift behind Mike so his navy shirt reads against the dark
    glow(1500, 1080, 760, 380, (8, 60, 84), 0.9)
    img += np.random.default_rng(11).normal(0, 0.9, img.shape)     # a little grain, so the glows do not band
    return img


# ---------------------------------------------------------------- drawing layer (supersampled)

class Layer:
    def __init__(self):
        self.im = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)

    @staticmethod
    def _s(pts):
        return [(x * SS, y * SS) for x, y in pts]

    def dot(self, p, r, col):
        x, y = p[0] * SS, p[1] * SS
        self.d.ellipse([x - r * SS, y - r * SS, x + r * SS, y + r * SS], fill=col)

    def line(self, pts, width, col):
        self.d.line(self._s(pts), fill=col, width=round(width * SS), joint="curve")
        for p in (pts[0], pts[-1]):
            self.dot(p, width / 2, col)

    def arrow(self, pts, width, col, head=None):
        """A stroke along pts with a filled triangular head at the last point."""
        hl, hw = head or (width * 3.4, width * 3.4)
        (x1, y1), (x0, y0) = pts[-1], pts[-2]
        # direction at the tip, taken a head-length back along the path so a curve's head points along the curve
        acc, i = 0.0, len(pts) - 1
        while i > 0 and acc < hl:
            acc += math.dist(pts[i], pts[i - 1])
            i -= 1
        bx, by = pts[i]
        n = math.hypot(x1 - bx, y1 - by) or 1.0
        ux, uy = (x1 - bx) / n, (y1 - by) / n
        base = (x1 - ux * hl, y1 - uy * hl)
        shaft = [p for p in pts if math.dist(p, pts[-1]) > hl * 0.85] + [base]
        if len(shaft) >= 2:
            self.d.line(self._s(shaft), fill=col, width=round(width * SS), joint="curve")
            self.dot(shaft[0], width / 2, col)
        tri = [(x1, y1), (base[0] - uy * hw / 2, base[1] + ux * hw / 2), (base[0] + uy * hw / 2, base[1] - ux * hw / 2)]
        self.d.polygon(self._s(tri), fill=col)

    def rrect(self, c, size, fill, outline=None, ow=0, radius=0.24):
        x, y, h = c[0] * SS, c[1] * SS, size * SS / 2
        self.d.rounded_rectangle([x - h, y - h, x + h, y + h], radius=size * SS * radius, fill=fill, outline=outline, width=round(ow * SS))

    def check(self, c, size, width, col):
        x, y = c
        self.line([(x - size * 0.46, y + size * 0.04), (x - size * 0.12, y + size * 0.36), (x + size * 0.5, y - size * 0.36)], width, col)

    def flat(self):
        return np.asarray(self.im.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255.0


def bezier(p0, p1, p2, p3, n=80):
    out = []
    for i in range(n + 1):
        t = i / n
        a, b, c, d = (1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t ** 2, t ** 3
        out.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return out


def polar(c, r, deg):
    return (c[0] + r * math.cos(math.radians(deg)), c[1] + r * math.sin(math.radians(deg)))


def put(canvas, layer, glow_r=0, glow_k=0.0, glow_col=None):
    """Composite a layer onto the float canvas. Its glow (the layer blurred) is ADDED first, like light."""
    rgba = layer.flat() if isinstance(layer, Layer) else layer
    a = rgba[..., 3:]
    if glow_r:
        g = Image.fromarray((rgba[..., 3] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(glow_r))
        ga = np.asarray(g).astype(np.float32)[..., None] / 255.0
        if glow_col is None:
            pm = Image.fromarray((rgba[..., :3] * a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(glow_r))
            canvas += np.asarray(pm).astype(np.float32) * glow_k
        else:
            canvas += ga * np.array(glow_col, np.float32) * glow_k
    canvas[...] = canvas * (1 - a) + rgba[..., :3] * 255.0 * a


# ---------------------------------------------------------------- headline

def font_at(size, wght=700, wdth=100):
    f = ImageFont.truetype(str(FONT), size)
    f.set_variation_by_axes([wght, wdth])
    return f


def headline(canvas, lines, max_w, cap_max=160, wght=700, x=HEAD_X, y=HEAD_Y):
    """lines = [[(text, colour), ...], ...]. One size for every line: the largest whose widest line fits max_w and
    whose capitals are no taller than cap_max. Returns the bottom of the last line."""
    size = 400
    while True:
        f = font_at(size, wght)
        cap = f.getbbox("H")[3] - f.getbbox("H")[1]
        widest = max(f.getlength("".join(t for t, _ in ln)) for ln in lines)
        if widest <= max_w and cap <= cap_max:
            break
        size -= 2
    top = f.getbbox("H")[1]
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for ln in lines:
        cx = x - f.getbbox(ln[0][0])[0]        # the first letter's ink starts exactly at x
        for text, col in ln:
            d.text((cx, y - top), text, font=f, fill=col + (255,))
            cx += f.getlength(text)
        y += cap * (1 + LINE_GAP)
    put(canvas, np.asarray(im).astype(np.float32) / 255.0, glow_r=22, glow_k=0.10)
    bottom = y - cap * LINE_GAP
    print(f"   headline: size {size}, capitals {cap} px, widest line {widest:.0f} of {max_w} px, bottom y {bottom:.0f}")
    return bottom


# ---------------------------------------------------------------- diagram pieces

def green_node(L, c, size=112, solid=False):
    if solid:
        L.rrect(c, size, GREEN)
    else:
        L.rrect(c, size, NODE_FILL, outline=GREEN, ow=9)


def big_arrow(L, x0, x1, y, width=22):
    """The reference's thick emerald arrow: a shaft and an open chevron, round ends."""
    hl = width * 2.6
    L.line([(x0, y), (x1, y)], width, GREEN)
    L.line([(x1 - hl, y - hl), (x1, y), (x1 - hl, y + hl)], width, GREEN)


def draw_groups(canvas, grey=None, green=None):
    if grey is not None:
        put(canvas, grey, glow_r=20, glow_k=0.55, glow_col=(255, 255, 255))
    if green is not None:
        put(canvas, green, glow_r=26, glow_k=0.60, glow_col=GREEN)


def diagram_split(canvas, cy, after=3, check=False, x_before=236, x_arrow=(440, 590), x_after=740):
    """One overloaded grey node  ->  thick arrow  ->  `after` clean emerald nodes with a retry arrow."""
    grey, green = Layer(), Layer()
    c = (x_before, cy)
    size = 150
    if check:      # it grades itself: ONE arrow out of the node's top and back into its side (a loop on the corner;
        #            a loop centred on the top read as a padlock)
        corner = (c[0] + size / 2 - 6, c[1] - size / 2 + 6)
        grey.arrow([polar(corner, 86, a) for a in range(188, 437, 3)], 12, GREY, head=(46, 46))
    else:          # it does everything: several arrows out and back in
        for deg, r, spread in ((-62, 250, 40), (8, 215, 46), (78, 245, 38), (152, 225, 44), (-140, 240, 42)):
            loop = bezier(polar(c, size * 0.5, deg - 16), polar(c, r, deg - spread), polar(c, r, deg + spread), polar(c, size * 0.62, deg + 16))
            grey.arrow(loop, 7, GREY, head=(30, 28))
    grey.rrect(c, size, GREY)
    if check:
        grey.check(c, size * 0.5, 15, GREY_DARK)
    big_arrow(green, x_arrow[0], x_arrow[1], cy)
    size_n = 112
    pitch = 168
    ys = [cy + (i - (after - 1) / 2) * pitch for i in range(after)]
    for i, y in enumerate(ys):
        green_node(green, (x_after, y), size_n, solid=(i == 0))
        if i:
            green.arrow([(x_after, ys[i - 1] + size_n / 2 + 6), (x_after, y - size_n / 2 - 8)], 8, GREEN, head=(26, 28))
    if check:
        green.check((x_after, ys[-1]), size_n * 0.46, 13, (10, 150, 88))
    # the retry: from the last node back up to the one before it, around the right side
    a, b = ys[-1], ys[-2]
    edge = x_after + size_n / 2
    green.arrow(bezier((edge + 8, a + 8), (edge + 118, a + 8), (edge + 118, b - 8), (edge + 12, b - 8)), 8, GREEN, head=(26, 28))
    draw_groups(canvas, grey, green)


def diagram_pipeline(canvas, cy, xs=(146, 380, 614, 848), size=124):
    """Plan -> images -> check -> build, with the retry from the check back to the images."""
    green = Layer()
    for i, x in enumerate(xs):
        green_node(green, (x, cy), size, solid=(i == 0))
        if i:
            green.arrow([(xs[i - 1] + size / 2 + 8, cy), (x - size / 2 - 10, cy)], 9, GREEN, head=(30, 32))
    top = cy - size / 2
    green.arrow(bezier((xs[2], top - 8), (xs[2], top - 150), (xs[1], top - 150), (xs[1], top - 12)), 9, GREEN, head=(30, 32))
    green.check((xs[2], cy), size * 0.44, 14, (10, 150, 88))
    draw_groups(canvas, None, green)


def diagram_numbers(canvas, cy, a="6", b="7", x0=HEAD_X, cap=330):
    f = font_at(100, 900)
    f = font_at(round(100 * cap / (f.getbbox("H")[3] - f.getbbox("H")[1])), 900)
    top = f.getbbox("H")[1]
    grey = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    green_t = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wa, wb = f.getlength(a), f.getlength(b)
    ImageDraw.Draw(grey).text((x0 - f.getbbox(a)[0], cy - cap / 2 - top), a, font=f, fill=GREY + (255,))
    ax0 = x0 + wa + 64
    ax1 = ax0 + 190
    ImageDraw.Draw(green_t).text((ax1 + 70 - f.getbbox(b)[0], cy - cap / 2 - top), b, font=f, fill=GREEN + (255,))
    arrow = Layer()
    big_arrow(arrow, ax0, ax1, cy, width=26)
    put(canvas, np.asarray(grey).astype(np.float32) / 255.0, glow_r=24, glow_k=0.35, glow_col=(255, 255, 255))
    put(canvas, np.asarray(green_t).astype(np.float32) / 255.0, glow_r=30, glow_k=0.55, glow_col=GREEN)
    put(canvas, arrow, glow_r=26, glow_k=0.60, glow_col=GREEN)
    print(f"   numbers: right edge x {ax1 + 70 + wb:.0f}")


# ---------------------------------------------------------------- Mike

def place_mike(canvas):
    cut = np.asarray(Image.open(HERE / "assets" / "mike-cut.png")).astype(np.float32) / 255.0
    moved = np.zeros_like(cut)
    moved[:, PERSON_DX:] = cut[:, :W - PERSON_DX]
    put(canvas, moved, glow_r=34, glow_k=0.16, glow_col=(60, 190, 200))     # a faint rim of light around him


# ---------------------------------------------------------------- takes

def take_a(c):
    """1 AGENT BECAME 3: the one overloaded agent -> three agents."""
    bottom = headline(c, [[("1 AGENT", WHITE)], [("BECAME ", WHITE), ("3", GREEN)]], TEXT_RIGHT - HEAD_X, cap_max=150)
    diagram_split(c, cy=(bottom + 1040) / 2 + 8, after=3)


def take_b(c):
    """6 -> 7: the agent count of the whole graph."""
    bottom = headline(c, [[("AGENTS IN MY", WHITE)], [("LANGGRAPH", GREEN)]], TEXT_RIGHT - HEAD_X, cap_max=112)
    diagram_numbers(c, cy=(bottom + 1040) / 2 + 20)


def take_c(c):
    """ONE AGENT PER DECISION: the four steps in a row, with the retry."""
    bottom = headline(c, [[("ONE AGENT", WHITE)], [("PER ", WHITE), ("DECISION", GREEN)]], TEXT_RIGHT - HEAD_X, cap_max=112)
    diagram_pipeline(c, cy=(bottom + 1040) / 2 + 70)


def take_d(c):
    """IT CHECKED ITS OWN WORK: the agent that graded itself -> a maker and a separate checker."""
    bottom = headline(c, [[("IT CHECKED", WHITE)], [("ITS ", WHITE), ("OWN WORK", GREEN)]], TEXT_RIGHT - HEAD_X, cap_max=112)
    diagram_split(c, cy=(bottom + 1040) / 2 + 40, after=2, check=True)


TAKES = {"a": take_a, "b": take_b, "c": take_c, "d": take_d}


def build(key):
    print(f"take {key}: {TAKES[key].__doc__}")
    canvas = plate()
    TAKES[key](canvas)
    place_mike(canvas)
    im = Image.fromarray(np.clip(canvas + 0.5, 0, 255).astype(np.uint8))
    out = HERE / "takes" / f"take-{key}.jpg"
    out.parent.mkdir(exist_ok=True)
    im.save(out, quality=94, subsampling=0)
    print("   wrote", out, f"({out.stat().st_size // 1024} KB)")
    return im


def sheets(ims):
    """_qa/contact.jpg = the takes side by side; _qa/small.jpg = each at 320x180, the size YouTube shows in a list."""
    qa = HERE / "_qa"
    qa.mkdir(exist_ok=True)
    keys = list(ims)
    cols = 2
    rows = math.ceil(len(keys) / cols)
    sheet = Image.new("RGB", (cols * 960, rows * 540), (0, 0, 0))
    small = Image.new("RGB", (len(keys) * 330 + 10, 200), (40, 40, 40))
    for i, k in enumerate(keys):
        sheet.paste(ims[k].resize((960, 540), Image.LANCZOS), ((i % cols) * 960, (i // cols) * 540))
        small.paste(ims[k].resize((320, 180), Image.LANCZOS), (10 + i * 330, 10))
    sheet.save(qa / "contact.jpg", quality=90)
    small.save(qa / "small.jpg", quality=92)
    print("wrote", qa / "contact.jpg", "and", qa / "small.jpg")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", choices=sorted(TAKES))
    args = ap.parse_args()
    done = {k: build(k) for k in ([args.only] if args.only else sorted(TAKES))}
    if not args.only:
        sheets(done)
