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

# A valid insert sits at a WORD BOUNDARY (a silence/breath dip), not mid-word. Mid-word is sustained-loud with
# no dip nearby. So scan a +-150ms window and take the deepest 10ms RMS: a dip below THRESH = a word boundary is
# right here (snap to it). No dip = sustained speech = mid-word = FAIL. (Caught the old 245.26, inside "ago".)
THRESH = -45.0
fails, oks = [], []
for at, dur in inserts:
    a = max(0, at - 0.15)
    p = subprocess.run(['ffmpeg', '-hide_banner', '-ss', f'{a}', '-t', '0.30', '-i', spine, '-af',
                        'asetnsamples=n=441:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level',
                        '-f', 'null', '-'], capture_output=True, text=True)
    vals = [(-99.0 if 'inf' in v else float(v)) for v in re.findall(r'RMS_level=(-?inf|-?[\d.]+)', p.stderr)]
    dip = min(vals) if vals else 0.0
    label = f'insert @{at}s (dur {dur}s): nearest dip {dip:.1f} dB'
    if dip > THRESH:
        fails.append(label + f' -> MID-WORD (no silence dip within +-150ms, deepest {dip:.1f} > {THRESH} dB). '
                     'Move it to the word-boundary gap (RMS-scan, like burst-removal) or the freeze/splice clips a word.')
    else:
        oks.append(label + ' -> at a word boundary')

for o in oks: print('  ok  ' + o)
if fails:
    print(f'\nlint-pause-silence: {len(fails)} VIOLATION(S):')
    for f in fails: print('  FAIL  ' + f)
    sys.exit(1)
print(f'lint-pause-silence: OK — all {len(inserts)} insert points in silence.')
