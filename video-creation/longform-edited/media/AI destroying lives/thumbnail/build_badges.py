"""Render the candidate thumbnail BADGES for "AI destroying lives" (Mike browses, then picks two).

Style = the coin badges of Mike's template thumbnail (youtu.be/jiDXX5IyhJA, saved in refs/thumbnail/):
a dark gradient disc, a bright ring with an outer glow, a white icon, a short label inside the disc.
Three variants per icon:
  a-glow        template look, no slash
  b-glow-slash  template look + a red "no smoking" slash over the icon
  c-red-ban     classic prohibition sign: red ring + red slash, white icon on a dark disc

Icons: Phosphor "fill" set (MIT), downloaded to badges/_icons/. Code-rendered (Playwright), no image model.

    python build_badges.py            -> badges/<NN>-<icon>-<LABEL>-<variant>.png (transparent, 720 px)
                                         + badges/_sheet-<variant>.png contact sheets on a thumbnail-dark backdrop
"""
from pathlib import Path
import html

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / 'badges'
ICONS = OUT / '_icons'

D = 560          # disc diameter, px
CELL = 720       # transparent canvas around it, room for the glow

PALETTE = {      # ring, glow, disc centre, disc edge
    'amber':  ('#ffd77a', '#ff9a00', '#7a4300', '#251300'),
    'blue':   ('#9ee6ff', '#1ea7ff', '#164aa6', '#06173f'),
    'purple': ('#e7b3ff', '#b026ff', '#55198c', '#1b0533'),
    'teal':   ('#9ffff2', '#00d1bb', '#0c6660', '#032622'),
}
RED = '#ee2b30'

BADGES = [  # (icon file or 'TEXT:<word>', label, palette)
    ('hard-hat', 'TRADES', 'amber'),
    ('toolbox', 'TOOLS', 'amber'),
    ('wrench', 'REPAIRS', 'amber'),
    ('hammer', 'BUILDERS', 'amber'),
    ('fire', 'WELDERS', 'amber'),
    ('factory', 'FACTORY', 'amber'),
    ('laptop', 'OFFICE', 'blue'),
    ('terminal-window', 'CODERS', 'blue'),
    ('briefcase', 'CAREERS', 'blue'),
    ('calculator', 'ANALYSTS', 'blue'),
    ('identification-badge', 'MY JOB', 'blue'),
    ('pen-nib', 'DESIGN', 'purple'),
    ('palette', 'ARTISTS', 'purple'),
    ('translate', 'TRANSLATE', 'purple'),
    ('microphone', 'VOICE', 'purple'),
    ('file-text', 'RESUME', 'teal'),
    ('headset', 'SUPPORT', 'teal'),
    ('user-minus', 'LAID OFF', 'teal'),
    ('TEXT:HIRING', '', 'teal'),
]
VARIANTS = ['a-glow', 'b-glow-slash', 'c-red-ban']


def badge_html(icon, label, pal, variant):
    ring, glow, c0, c1 = PALETTE[pal]
    if variant == 'c-red-ban':
        ring, glow, c0, c1 = '#ff4a4f', RED, '#2b1416', '#0a0607'
    rw = round(D * .032)
    shadow = (f'0 0 {D*.05:.0f}px {D*.012:.0f}px {glow}, 0 0 {D*.13:.0f}px {glow}99, '
              f'inset 0 0 {D*.06:.0f}px {glow}88')
    if variant == 'c-red-ban':
        rw = round(D * .06)
        shadow = f'0 0 {D*.04:.0f}px {RED}aa, 0 {D*.02:.0f}px {D*.05:.0f}px #000c'
    labelled = bool(label)
    icon_y = .43 if labelled else .5
    if icon.startswith('TEXT:'):
        word = html.escape(icon[5:])
        icon_el = f'<div class="word">{word}</div>'
        icon_size = D * .66
    else:
        icon_el = (ICONS / f'{icon}.svg').read_text(encoding='utf-8')
        icon_size = D * (.46 if labelled else .56)
    slash = ''
    if variant != 'a-glow':
        r_in = D / 2 - rw
        sw = D * (.075 if variant == 'b-glow-slash' else .09)
        slash = f'''<svg class="slash" viewBox="0 0 {D} {D}" width="{D}" height="{D}">
  <defs><clipPath id="c"><circle cx="{D/2}" cy="{D/2}" r="{r_in - 1}"/></clipPath></defs>
  <g clip-path="url(#c)">
    <line x1="0" y1="0" x2="{D}" y2="{D}" stroke="#08080a" stroke-width="{sw + D*.035:.1f}"/>
    <line x1="0" y1="0" x2="{D}" y2="{D}" stroke="{RED}" stroke-width="{sw:.1f}"/>
  </g></svg>'''
    lab = f'<div class="label">{html.escape(label)}</div>' if labelled else ''
    return f'''<div class="cell"><div class="disc" style="
      border:{rw}px solid {ring}; box-shadow:{shadow};
      background: radial-gradient(circle at 50% 38%, {c0} 0%, {c1} 78%);">
    <div class="icon" style="width:{icon_size:.0f}px;height:{icon_size:.0f}px;top:{D*icon_y - icon_size/2 - rw:.0f}px;
         left:{D/2 - icon_size/2 - rw:.0f}px">{icon_el}</div>
  </div>{slash}{lab}</div>'''


CSS = f'''
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;800&display=block');
html,body{{margin:0;background:transparent;}}
.cell{{position:relative;width:{CELL}px;height:{CELL}px;}}
.disc{{position:absolute;box-sizing:border-box;width:{D}px;height:{D}px;left:{(CELL-D)/2}px;top:{(CELL-D)/2}px;
      border-radius:50%;}}
.icon{{position:absolute;color:#fff;display:flex;align-items:center;justify-content:center;
      filter:drop-shadow(0 {D*.012:.0f}px {D*.02:.0f}px #0008);}}
.icon svg{{width:100%;height:100%;}}
.word{{font-family:Poppins;font-weight:800;color:#fff;font-size:{D*.165:.0f}px;letter-spacing:-1px;white-space:nowrap;}}
.label{{position:absolute;left:0;right:0;top:{(CELL-D)/2 + D*.70:.0f}px;
       -webkit-text-stroke:{D*.016:.0f}px #08080a;paint-order:stroke fill;text-align:center;font-family:Poppins;font-weight:600;
       color:#fff;font-size:{D*.105:.0f}px;letter-spacing:1px;white-space:nowrap;}}
.slash{{position:absolute;left:{(CELL-D)/2}px;top:{(CELL-D)/2}px;}}
'''

FIT_LABELS = f'''() => {{
  for (const el of document.querySelectorAll('.label')) {{
    let fs = parseFloat(getComputedStyle(el).fontSize);
    const max = {D*.42:.0f};
    const span = document.createElement('span'); span.textContent = el.textContent;
    el.textContent = ''; el.appendChild(span);
    while (span.offsetWidth > max && fs > 20) {{ fs -= 1; el.style.fontSize = fs + 'px'; }}
  }}
}}'''


def main():
    OUT.mkdir(exist_ok=True)
    rows = []
    for n, (icon, label, pal) in enumerate(BADGES, 1):
        for v in VARIANTS:
            name = icon.replace('TEXT:', 'text-').lower()
            lab = label.replace(' ', '-') or 'nolabel'
            rows.append((f'{n:02d}-{name}-{lab}-{v}', badge_html(icon, label, pal, v), v, label or icon[5:]))

    page_html = f'<html><head><style>{CSS}</style></head><body>' + \
        ''.join(f'<div id="b{i}">{h}</div>' for i, (_, h, _, _) in enumerate(rows)) + '</body></html>'

    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={'width': CELL, 'height': CELL})
        pg.set_content(page_html, wait_until='networkidle')
        pg.evaluate('document.fonts.ready')
        pg.evaluate(FIT_LABELS)
        for i, (fname, _, _, _) in enumerate(rows):
            pg.locator(f'#b{i} .cell').screenshot(path=str(OUT / f'{fname}.png'), omit_background=True)

        # contact sheets: one per variant, on the template's dark backdrop
        for v in VARIANTS:
            items = [(f, cap) for (f, _, vv, cap) in rows if vv == v]
            tiles = ''.join(
                f'<figure><img src="{(OUT / (f + ".png")).as_uri()}"><figcaption>{f.split("-")[0]} {html.escape(cap)}'
                f'</figcaption></figure>' for f, cap in items)
            sheet = f'''<html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=block');
body{{margin:0;padding:40px;width:1840px;background:linear-gradient(180deg,#0b0b0c 0%,#1a1a1c 70%,#3a3a3d 100%);
     font-family:Poppins;color:#cfcfd4;}}
h1{{font-size:34px;margin:0 0 20px 10px;color:#fff;}}
.grid{{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}}
figure{{margin:0;text-align:center;}} img{{width:340px;}}
figcaption{{font-size:22px;margin-top:-28px;}}
</style></head><body><h1>Badges: {v}</h1><div class="grid">{tiles}</div></body></html>'''
            sp = HERE / f'_sheet-{v}.html'
            sp.write_text(sheet, encoding='utf-8')
            pg.set_viewport_size({'width': 1920, 'height': 1080})
            pg.goto(sp.as_uri(), wait_until='networkidle')
            pg.evaluate('document.fonts.ready')
            pg.screenshot(path=str(OUT / f'_sheet-{v}.png'), full_page=True)
            sp.unlink()
        br.close()
    print(f'{len(rows)} badges + {len(VARIANTS)} contact sheets -> {OUT}')


if __name__ == '__main__':
    main()
