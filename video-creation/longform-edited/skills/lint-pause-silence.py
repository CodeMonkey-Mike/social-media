#!/usr/bin/env python3
"""
lint-pause-silence.py — gate: every spine INSERT point must sit in a SILENCE trough, never mid-word.

Mike, 2026-06-30: the CH4 title-card pause was baked at Whisper's word-boundary (245.26s), but the real
silence was at 245.47 — so the freeze split "ago" and the word got clipped ("the pause goes in the silence
BETWEEN the words", longform-edited.md:393, same principle as the burst-removal skill). This verifies it in
code: a card-pause or clip-splice point that isn't in true silence FAILS, before you bake the spine.

It reads the comp's INSERTS [{at, dur}] and, for each `at` (a source-time insert point), measures the audio
RMS in a +-50ms window on the SOURCE spine. Silence trough is < -50 dB; a spoken word is louder -> FAIL.

  python lint-pause-silence.py <comp.tsx> <source-spine.mp4>

Run on the SOURCE spine (e.g. *.f.final.mp4) BEFORE baking the pauses/clips in.
"""
import sys, re, subprocess
if len(sys.argv) < 3:
    print('usage: lint-pause-silence.py <comp.tsx> <source-spine.mp4>'); sys.exit(2)
comp, spine = sys.argv[1], sys.argv[2]
src = open(comp, encoding='utf-8').read()
blk = (re.search(r'INSERTS\s*=\s*\[(.*?)\];', src, re.S) or [None, ''])[1]
inserts = [(float(a), float(d)) for a, d in re.findall(r'at:\s*([\d.]+)\s*,\s*dur:\s*([\d.]+)', blk)]
if not inserts:
    print('lint-pause-silence: no INSERTS found in ' + comp); sys.exit(2)

# A valid insert sits INSIDE a silence dip, not merely NEAR one. Two checks per insert:
#   1. CONTAINMENT (the load-bearing one): the RMS at the insert point ITSELF (its 10ms bin, plus one
#      neighbor each side = a ~30ms guard) must be below THRESH. A dip existing somewhere within
#      +-150ms is NOT enough - that exact hole let tao-render-virtuals' CH2 pause land ON the word
#      "Now" at 76.8 while a -98 dB trough sat 140ms earlier (Mike, 2026-07-19: same bug as the
#      carry-trade "ago" split this lint was built for; the old proximity check passed it).
#   2. A dip below THRESH within +-150ms (the original check) - and its center is PRINTED as the
#      suggested snap point whenever containment fails.
THRESH = -45.0
fails, oks = [], []
for at, dur in inserts:
    a = max(0, at - 0.15)
    p = subprocess.run(['ffmpeg', '-hide_banner', '-ss', f'{a}', '-t', '0.30', '-i', spine, '-af',
                        'asetnsamples=n=441:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level',
                        '-f', 'null', '-'], capture_output=True, text=True)
    vals = [(-99.0 if 'inf' in v else float(v)) for v in re.findall(r'RMS_level=(-?inf|-?[\d.]+)', p.stderr)]
    if not vals:
        fails.append(f'insert @{at}s: could not measure RMS'); continue
    times = [a + i * 0.01 for i in range(len(vals))]
    dip = min(vals)
    dip_t = times[vals.index(dip)] + 0.005
    mid = min(range(len(vals)), key=lambda i: abs(times[i] - (at - 0.005)))  # the bin containing `at`
    guard = vals[max(0, mid - 1):mid + 2]
    at_level = max(guard) if guard else 0.0
    label = f'insert @{at}s (dur {dur}s): at-point {at_level:.1f} dB, deepest dip {dip:.1f} dB @{dip_t:.2f}s'
    if at_level > THRESH:
        fails.append(label + f' -> INSERT POINT IS IN SPEECH (>{THRESH} dB at the cut itself). '
                     + (f'Snap it to the trough @{dip_t:.2f}s.' if dip <= THRESH else
                        'No usable dip within +-150ms either - find the real word gap (RMS-scan, like burst-removal).'))
    elif dip > THRESH:
        fails.append(label + f' -> MID-WORD (no silence dip within +-150ms). Move it to a real word-boundary gap.')
    else:
        oks.append(label + ' -> inside the silence')

for o in oks: print('  ok  ' + o)
if fails:
    print(f'\nlint-pause-silence: {len(fails)} VIOLATION(S):')
    for f in fails: print('  FAIL  ' + f)
    sys.exit(1)
print(f'lint-pause-silence: OK — all {len(inserts)} insert points in silence.')
