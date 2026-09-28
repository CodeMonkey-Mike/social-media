#!/usr/bin/env python3
"""
bed-duck-expr.py — emit the music-bed DUCK expression derived from the comp's clip inserts.

Mike, 2026-06-30: the music bed played OVER the R-TALK talk because the duck windows were hand-typed and one
was wrong/missing (SCREENPLAY.md:259 "STOP our music bed and play the clip with ITS OWN audio up"). Prevention
by construction: the bed mix must DERIVE its duck windows from the comp's full-screen clip inserts, never type
them by hand. This reads INSERTS, replicates sh(), and prints the exact ffmpeg `volume` expression to drop the
bed under every clip. Pipe it straight into the bed-mix:

  DUCK=$(python bed-duck-expr.py <comp.tsx>)
  ffmpeg ... -filter_complex "...[bed]${DUCK}[bedd];[0:a][bedd]amix=..." ...

A clip insert = an INSERTS entry with dur > 5s (the 1s card-pause freezes are not clips).
"""
import sys, re
if len(sys.argv) < 2:
    sys.stderr.write('usage: bed-duck-expr.py <comp.tsx> [duck] [norm]\n'); sys.exit(2)
src = open(sys.argv[1], encoding='utf-8').read()
DUCK = float(sys.argv[2]) if len(sys.argv) > 2 else 0.045
NORM = float(sys.argv[3]) if len(sys.argv) > 3 else 0.15
blk = (re.search(r'INSERTS\s*=\s*\[(.*?)\];', src, re.S) or [None, ''])[1]
inserts = [(float(a), float(d)) for a, d in re.findall(r'at:\s*([\d.]+)\s*,\s*dur:\s*([\d.]+)', blk)]
if not inserts:
    sys.stderr.write('bed-duck-expr: no INSERTS found\n'); sys.exit(2)

def start_before(t):  # final-spine position of the clip's OWN start (exclude its own duration)
    return t + sum(d for a, d in inserts if a < t)

clips = [(a, d) for a, d in inserts if d > 5.0]               # full-screen clips, not the 1s card pauses
windows = [(round(start_before(a), 2), round(start_before(a) + d, 2)) for a, d in clips]
if not windows:
    print(f"volume={NORM}")                                   # no clips -> flat bed
    sys.stderr.write('bed-duck-expr: no clips; flat bed.\n'); sys.exit(0)
conds = '+'.join(f'between(t\\,{s}\\,{e})' for s, e in windows)  # escaped for use inside an ffmpeg filtergraph
print(f"volume='if({conds}\\,{DUCK}\\,{NORM})':eval=frame")
sys.stderr.write(f'bed-duck-expr: ducking bed to {DUCK} under {len(windows)} clip window(s) (final s): {windows}\n')
