"""Thumbnail for the "30x" TAO livestream (2026-10-26).

Template = ../2026-10-23-best-time-to-buy. Headline "30x" with a curved arrow from the text into
the TAO coin, so TAO moved from the bottom row to the top row's right end (Kaspa took its old
spot). Litecoin and Arbitrum replaced the hamster and pill coins, both drawn in code.
Mike = assets/mike-photo.png, cut out and set on the right.
source.png = the earlier Higgsfield take; still the source of the TAO glyph.
Run:  python build.py   ->  thumbnail.jpg
"""
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.dirname(HERE)
sys.path.insert(0, KIT)
from thumb_kit import (arrow, badge, cut_person, export, headline, icon_arbitrum, icon_glyph,  # noqa: E402
                       icon_kaspa, icon_litecoin, icon_text, place, place_person, rows_layout)

src = Image.open(os.path.join(HERE, 'source.png')).convert('RGB')   # 1376x768
asset = lambda name: Image.open(os.path.join(HERE, 'assets', name)).convert('RGBA')

canvas = Image.open(os.path.join(KIT, 'plates', 'blue.png')).convert('RGBA')
place_person(canvas, cut_person(asset('mike-photo.png')), scale=.95, dx=180)

D = 234
tao = badge(D, (44, 44, 48), (14, 14, 16), icon_glyph(src, (512, 500, 618, 614), 'm', 110, 190), .54)
coins = [
    badge(D, (70, 110, 180), (40, 72, 140), icon_litecoin(), .56),            # Litecoin
    badge(D, (70, 160, 240), (24, 98, 200), icon_text('?'), .56),             # unknown coin
    tao,                                                                       # TAO: the arrow's target
    badge(D, (40, 52, 74), (16, 24, 38), icon_arbitrum(), .74),               # Arbitrum
    badge(D, (122, 208, 195), (84, 176, 163), icon_kaspa(), .56, 4),          # Kaspa
]
pos = rows_layout(D, counts=(3, 2), y0=560)
place(canvas, coins, pos)
bottom = headline(canvas, ['30x'], max_w=700, max_h=470)
tx, ty = pos[2]
arrow(canvas, (760, 300), (1010, 330), (tx + D * .80, ty + 6))
export(canvas, os.path.join(HERE, 'thumbnail.jpg'))
