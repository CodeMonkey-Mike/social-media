"""Thumbnail takes for "AI destroying lives", rebuilt in CODE on Mike's template thumbnail.

Template: youtu.be/jiDXX5IyhJA ("This is Disastrous.", refs/thumbnail/jiDXX5IyhJA.jpg, 1280x720).
Mike + the dark gradient stay pixel-identical; the old XRP/HBAR badges and the words are painted out
(low-res inpaint = the backdrop's own smooth gradient, plus matched grain), then drawn new:
  badges  BUILDERS (amber) . MY JOB (blue) . TRADES (amber), the b-glow-slash renders (Mike's pick,
          2026-11-11: blue in the middle so the two ambers do not touch)
  words   "AI is" white + "Destroying Lives." black on a white box (Poppins Bold, like the template)

    python build_thumb.py   -> takes/plate.png + takes/take-<n>-<name>.png (1920x1080) + .jpg (YouTube, < 2 MB)
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
SRC = PROJECT / 'refs' / 'thumbnail' / 'jiDXX5IyhJA.jpg'
BADGES = HERE / 'badges'
OUT = HERE / 'takes'
PICKS = ['04-hammer-BUILDERS-b-glow-slash.png', '11-identification-badge-MY-JOB-b-glow-slash.png',
         '01-hard-hat-TRADES-b-glow-slash.png']

# what to paint out, in template px (1280x720): the two coins + glow, "This is", the boxed line
MASK_BOXES = [(55, 5, 650, 345), (20, 280, 500, 420), (12, 380, 800, 610)]
# the template's words + box carry a soft glow ~40 px past their edges: paint out wide, but never Mike
PERSON_PAD = 6
OLD_ELEMENTS = [(100, 45, 595, 305), (58, 300, 435, 410), (52, 415, 729, 552)]   # coins, "This is", the box


def rect_mask(h, w, boxes):
    m = np.zeros((h, w), bool)
    for x0, y0, x1, y1 in boxes:
        m[y0:y1, x0:x1] = True
    return m


def harmonic_fill(img, hole, levels=(16, 8, 4), iters=3000):
    """Boundary-anchored smooth fill (Laplace, coarse to fine): no overshoot, so no bright hump in the hole."""
    h, w = hole.shape
    blur = cv2.GaussianBlur(img, (0, 0), 3)
    u = None
    for f in levels:
        sm = cv2.resize(blur, (w // f, h // f), interpolation=cv2.INTER_AREA)
        hs = cv2.resize(hole.astype(np.uint8), (w // f, h // f), interpolation=cv2.INTER_NEAREST) > 0
        hs = cv2.dilate(hs.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
        init = sm[~hs].mean(0) if u is None else cv2.resize(u, (w // f, h // f), interpolation=cv2.INTER_LINEAR)
        u = sm.copy()
        u[hs] = init if u is None or np.ndim(init) == 1 else init[hs]
        for _ in range(iters):
            p = np.pad(u, ((1, 1), (1, 1), (0, 0)), mode='edge')
            avg = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4
            u[hs] = avg[hs]
    return cv2.GaussianBlur(cv2.resize(u, (w, h), interpolation=cv2.INTER_CUBIC), (0, 0), 4)


def grain(shape, sd, seed):
    rng = np.random.default_rng(seed)
    n = cv2.GaussianBlur(rng.normal(0, 1, shape[:2]).astype(np.float32), (0, 0), 0.8)
    return (n / n.std() * sd)[..., None]


def bezier(p0, p1, p2, n=60):
    t = np.linspace(0, 1, n)[:, None]
    return (1 - t) ** 2 * np.array(p0) + 2 * (1 - t) * t * np.array(p1) + t ** 2 * np.array(p2)


def make_plate():
    from rembg import new_session, remove
    pil = Image.open(SRC).convert('RGB')
    src = np.array(pil).astype(np.float32)
    h, w = src.shape[:2]
    OUT.mkdir(exist_ok=True)
    old = rect_mask(h, w, OLD_ELEMENTS)
    # 1. Mike's silhouette, found with the old coins + words blanked first (the model calls them foreground)
    pf = src.copy()
    pf[old] = 22
    alpha = np.array(remove(Image.fromarray(pf.astype(np.uint8)), session=new_session('isnet-general-use')).split()[3])
    n, lab, stats, _ = cv2.connectedComponentsWithStats((alpha > 40).astype(np.uint8))
    keep = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    person0 = (lab == keep) & ~old

    # 2. the shoulder the old white box hid (box x 52-729, y 415-552): a curve that meets the visible
    #    shoulder line at the box's right edge and the visible arm line under the box, tangent to both
    bx1, by1 = OLD_ELEMENTS[2][2], OLD_ELEMENTS[2][3]

    def top_at(x):
        ys = np.where(person0[430:600, x])[0]
        return 430 + int(ys[0])

    def left_at(y):
        xs = np.where(person0[y, 540:760])[0]
        return 540 + int(xs[0])

    p0 = (bx1 + 1, top_at(bx1 + 1)); pa = (bx1 + 40, top_at(bx1 + 40))
    p2 = (left_at(by1 + 2), by1 + 2); pb = (left_at(by1 + 40), by1 + 40)
    d0 = np.subtract(p0, pa).astype(float); d2 = np.subtract(p2, pb).astype(float)   # heading into the box
    A = np.array([d0, -d2]).T
    t, s = np.linalg.solve(A, np.subtract(p2, p0).astype(float))
    p1 = tuple(np.array(p0) + t * d0)
    curve = bezier(p0, p1, p2)
    poly = np.vstack([curve, [[bx1 + 1, by1 + 2]]])
    ss = 4   # supersampled so the new edge is anti-aliased like the rest of his outline
    big = np.zeros((h * ss, w * ss), np.uint8)
    cv2.fillPoly(big, [np.round(poly * ss).astype(np.int32)], 255, lineType=cv2.LINE_AA)
    shoulder_f = cv2.resize(big.astype(np.float32) / 255, (w, h), interpolation=cv2.INTER_AREA) * old
    shoulder = shoulder_f > 0.02
    print('shoulder curve p0 %s p1 (%.0f, %.0f) p2 %s, %d px' % (p0, p1[0], p1[1], p2, shoulder.sum()))
    person = person0 | shoulder

    # 3. the backdrop hole: every old element (never left half-erased) + its glow, but not Mike
    protect = cv2.dilate(person.astype(np.uint8), np.ones((2 * PERSON_PAD + 1,) * 2, np.uint8)) > 0
    hole = (rect_mask(h, w, MASK_BOXES) & ~protect) | (old & ~person)
    bg = harmonic_fill(src, hole | shoulder)
    clean = src[60:680, 8:46]
    sd_bg = float((clean - cv2.GaussianBlur(clean, (0, 0), 2)).std())
    m = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 5)
    m = np.where(old, 1, np.where(person, 0, m))[..., None]   # all of the old box -> backdrop; shoulder goes on top
    out = src * (1 - m) + (bg + grain(src.shape, sd_bg, 7)) * m

    # 4. the shoulder: shirt tone inpainted from the shirt only, with the shirt's own grain
    x0, y0, x1, y1 = 520, 380, 900, 680
    crop = np.clip(out[y0:y1, x0:x1], 0, 255).astype(np.uint8)
    cm = ((~person0[y0:y1, x0:x1]) | shoulder[y0:y1, x0:x1]).astype(np.uint8) * 255
    fill = cv2.inpaint(crop, cm, 9, cv2.INPAINT_TELEA).astype(np.float32)
    shirt = src[580:660, 640:760]
    sd_sh = float((shirt - cv2.GaussianBlur(shirt, (0, 0), 2)).std())
    sm = cv2.GaussianBlur(shoulder_f[y0:y1, x0:x1].astype(np.float32), (0, 0), 0.6)[..., None]
    out[y0:y1, x0:x1] = out[y0:y1, x0:x1] * (1 - sm) + (fill + grain(fill.shape, sd_sh, 11)) * sm

    Image.fromarray(((hole | shoulder) * 255).astype(np.uint8)).save(OUT / 'plate-mask.png')
    plate = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    plate.resize((1920, 1080), Image.LANCZOS).save(OUT / 'plate.png')
    print('plate: grain sd bg %.2f shirt %.2f' % (sd_bg, sd_sh))


CSS = '''
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=block');
html,body{margin:0;width:1280px;height:720px;overflow:hidden;}
body{background:url(plate.png) 0 0/1280px 720px no-repeat;position:relative;font-family:Poppins;font-weight:700;}
.b{position:absolute;}
.w{position:absolute;color:#fff;white-space:nowrap;letter-spacing:-1px;line-height:1;}
.box{position:absolute;background:#fff;color:#000;white-space:nowrap;letter-spacing:-1px;line-height:1;}
'''


def badge_row(disc, y_top, x_left=58, gap=26):
    canvas = disc * 720 / 560
    off = (canvas - disc) / 2
    out = ''
    for i, f in enumerate(PICKS):
        x = x_left + i * (disc + gap) - off
        out += f'<img class="b" src="../badges/{f}" style="left:{x:.1f}px;top:{y_top - off:.1f}px;width:{canvas:.1f}px">'
    return out


def box(text, fs, x, y, pad_x, pad_y):
    return (f'<div class="box" style="left:{x}px;top:{y}px;font-size:{fs}px;padding:{pad_y}px {pad_x}px '
            f'{pad_y * .55:.0f}px {pad_x}px">{text}</div>')


TAKES = {
    # the template's own shape: one white line, one boxed line (box text sized to clear Mike's hair)
    'take-1-one-box': lambda: badge_row(196, 44) +
        '<div class="w" style="left:66px;top:296px;font-size:104px">AI is</div>' +
        box('Destroying Lives.', 66, 60, 432, 16, 18),
    # bigger words: the boxed line split in two stacked boxes
    'take-2-two-boxes': lambda: badge_row(178, 34) +
        '<div class="w" style="left:66px;top:236px;font-size:100px">AI is</div>' +
        box('Destroying', 98, 60, 356, 18, 12) +
        box('Lives.', 98, 60, 486, 18, 12),
}


def main():
    make_plate()
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=1.5)
        for name, body in TAKES.items():
            page = OUT / f'_{name}.html'
            page.write_text(f'<html><head><style>{CSS}</style></head><body>{body()}</body></html>', encoding='utf-8')
            pg.goto(page.as_uri(), wait_until='networkidle')
            pg.evaluate('document.fonts.ready')
            # report the right edge of every word block, to check it clears Mike
            edges = pg.evaluate("[...document.querySelectorAll('.w,.box')].map(e=>{const r=e.getBoundingClientRect();"
                                "return [e.textContent, Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]})")
            png = OUT / f'{name}.png'
            pg.screenshot(path=str(png))
            Image.open(png).convert('RGB').save(OUT / f'{name}.jpg', quality=94, subsampling=0)
            page.unlink()
            print(name, edges)
        br.close()


if __name__ == '__main__':
    main()
