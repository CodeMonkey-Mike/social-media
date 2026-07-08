#!/usr/bin/env python3
"""
lint-deck-containers.py — ASSET-level gate: a deck cover must be ONE container, never a whole slide.

Mike, 2026-06-30: the cover linter checks the PLAN (which ref, how long) but not the PIXELS, so a deck PNG
that is actually the WHOLE SLIDE (two cards side by side, e.g. the bio slide) passed the gate and shipped —
exactly the "show the entire slide rather than a single CSS container" violation. This closes that gap.

It loads every deck/<ref>.png referenced by the comp's COVERS and counts LARGE filled card-boxes:
  0-1 big box  -> a single container or a system-design diagram (nodes are small, not counted)  -> OK
  2+ big boxes -> a WHOLE SLIDE (multiple cards on screen at once)                               -> FAIL

System-design DIAGRAMS are exempt (declare them in the comp as `// DIAGRAM_REFS: s3, s5, s6`).

  python lint-deck-containers.py <comp.tsx> <render-assets/deck>

Exits non-zero on any violation. Wire into the PRE-RENDER GATE alongside lint-covers.js.
"""
import sys, re, glob, os
import numpy as np
from PIL import Image
from scipy import ndimage

if len(sys.argv) < 3:
    print('usage: lint-deck-containers.py <comp.tsx> <deckdir>'); sys.exit(2)
comp, deckdir = sys.argv[1], sys.argv[2]
src = open(comp, encoding='utf-8').read()
block = (re.search(r'COVERS[^=]*=\s*\[(.*?)\];', src, re.S) or [None, ''])[1]
deck_refs = sorted(set(re.findall(r"kind:\s*'deck'\s*,\s*ref:\s*'([^']+)'", block)))
def _declared(tag):
    mm = re.search(tag + r':\s*([\w,\s-]+)', src)
    return set(x.strip() for x in mm.group(1).split(',')) if mm else set()
diagrams = _declared('DIAGRAM_REFS')        # system-design diagrams (nodes) — exempt
comparisons = _declared('COMPARISON_REFS')  # deliberate 2-up A-vs-B contrasts (one rhetorical unit) — exempt

fails, oks = [], []
for ref in deck_refs:
    # Exemptions FIRST: a declared DIAGRAM/COMPARISON may be a pure code-rendered component with
    # no PNG at all (Convention 4's ideal) — it must not fail the existence check. (Fixed 2026-07-06,
    # carry-trade: 'deck' covers rendered as React containers; previously NOT FOUND fired before the
    # documented DIAGRAM_REFS exemption could apply.)
    if ref in diagrams:
        oks.append(f'{ref}: exempt (declared DIAGRAM)'); continue
    if ref in comparisons:
        oks.append(f'{ref}: exempt (declared COMPARISON, A-vs-B)'); continue
    paths = glob.glob(os.path.join(deckdir, ref + '.png'))
    if not paths:
        fails.append(f'{ref}: deck/{ref}.png NOT FOUND'); continue
    a = np.array(Image.open(paths[0]).convert('RGB')).astype(int)
    H, W = a.shape[:2]
    bg = a[3, 3].mean(); lum = a.mean(2)
    mask = lum > bg + 5
    mask = ndimage.binary_dilation(mask, iterations=max(2, W // 400))  # connect text into its card fill
    lab, n = ndimage.label(mask)
    big = 0
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        if (xs.max() - xs.min()) > 0.25 * W and (ys.max() - ys.min()) > 0.12 * H:
            big += 1
    if big > 1:
        fails.append(f'{ref}: {big} large card-boxes on screen -> this is a WHOLE SLIDE, not one container. '
                     f'Crop to a single card (or split the slide into separate refs); add to DIAGRAM_REFS only if it is a system-design diagram.')
    else:
        oks.append(f'{ref}: 1 container OK')

for o in oks: print('  ok  ' + o)
if fails:
    print(f'\nlint-deck-containers: {len(fails)} VIOLATION(S):')
    for f in fails: print('  FAIL  ' + f)
    sys.exit(1)
print(f'lint-deck-containers: OK — {len(deck_refs)} deck refs, all single containers.')
