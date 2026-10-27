"""Thumbnail for the "Best Time To Buy" livestream (2026-10-23).

Background = ../plates/blue.png (Mike's blue reference with its person and text removed).
Mike = assets/mike-photo.png (the sharp growth-vs-product photo, text-free plate), cut out and
set on the right. Two-line headline, five coin badges in two staggered rows.
source.png = Mike's earlier Higgsfield take; still the source of the TAO glyph.
Run:  python build.py   ->  thumbnail.jpg
"""
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.dirname(HERE)
sys.path.insert(0, KIT)
from thumb_kit import (badge, cut_person, export, headline, icon_glyph, icon_kaspa,  # noqa: E402
                       icon_text, place, place_person, rows_layout)

src = Image.open(os.path.join(HERE, 'source.png')).convert('RGB')   # 1376x768
asset = lambda name: Image.open(os.path.join(HERE, 'assets', name)).convert('RGBA')

canvas = Image.open(os.path.join(KIT, 'plates', 'blue.png')).convert('RGBA')
# 95% and 180 px right: measured so his hair clears "Best Time" and the coins
place_person(canvas, cut_person(asset('mike-photo.png')), scale=.95, dx=180)

D = 234
coins = [
    badge(D, (40, 48, 78), (14, 18, 36), asset('coin_hamster.png'), .74, 10),   # hamster
    badge(D, (70, 160, 240), (24, 98, 200), icon_text('?'), .56),             # unknown coin
    badge(D, (122, 208, 195), (84, 176, 163), icon_kaspa(), .56, 4),          # Kaspa
    badge(D, (30, 42, 58), (10, 16, 26), asset('coin_pill.png'), .70),         # pill
    badge(D, (44, 44, 48), (14, 14, 16), icon_glyph(src, (512, 500, 618, 614), 'm', 110, 190), .54),  # TAO
]
place(canvas, coins, rows_layout(D, counts=(3, 2), y0=552))
headline(canvas, ['Best Time', 'To Buy'])
export(canvas, os.path.join(HERE, 'thumbnail.jpg'))
