#!/usr/bin/env bash
# python EP01 — mix the five music beds onto a finished render.
# Music is NOT in the comp (comp-build.md §0), so an audio change never needs a re-render.
#
# Usage:  bash mix-music.sh <video-in.mp4> <video-out.mp4>
#
# LEVELS ARE MEASURED, NOT GUESSED (2026-08-05):
#   VO spine integrated loudness = -17.0 LUFS.  Beds sit 17 dB under it -> target -34.0 LUFS.
#   Per-bed gain = -34.0 - (the LUFS of the SECTION USED, not of the whole track).
#   ^ This distinction is load-bearing: Slow Rise and Lightheart are build->resolve tracks whose
#     opening minutes sit 5-11 dB under their track average. Measuring whole-track LUFS under-drove
#     bed D by 7 dB and bed E by 14 dB in the v1 mix (caught by QA 2026-08-05). Always measure the trim.
#   Section LUFS: A -9.5  B -12.5  C -9.2  D -15.9  E -23.2
#   MIKE ADJUST 2026-08-05: beds C, D and E pulled a further -5 dB by ear (he flagged the music as
#   too present at 2:45, 3:55 and 4:50). A and B unchanged. Effective targets now A/B -34, C/D/E -39 LUFS.
#
# BED MAP (final-video seconds; no card pauses are baked, so these are spine coords):
#   A  Old Moon         0.0   -> 33.9    CH1 hook
#   B  Accomplishments  34.4  -> 152.4   CH2 + CH3   (Mike-designated non-hype bed)
#   C  Lightbeams       152.9 -> 215.7   CH4
#   D  Slow Rise        216.2 -> 263.0   CH5
#   E  Lightheart       263.5 -> 305.2   CH6 + close, resolves on the final frame
# ~0.5 s of silence (the inter-bed breath) sits at each of the four changes. No bed loops:
# every source file is longer than its span. No ducking windows: the comp has no clip inserts
# and no screen-recording audio to duck under.
set -euo pipefail
IN="${1:?usage: mix-music.sh <in.mp4> <out.mp4>}"
OUT="${2:?usage: mix-music.sh <in.mp4> <out.mp4>}"
M="$(cd "$(dirname "$0")" && pwd)/music"

ffmpeg -y -hide_banner \
  -i "$IN" \
  -i "$M/bedA-old-moon.mp3" \
  -i "$M/bedB-accomplishments.mp3" \
  -i "$M/bedC-lightbeams.mp3" \
  -i "$M/bedD-slow-rise.wav" \
  -i "$M/bedE-lightheart.wav" \
  -filter_complex "\
[1:a]volume=0.0596,atrim=0:33.9,afade=t=in:st=0:d=1.8,afade=t=out:st=32.7:d=1.2,adelay=0|0[a]; \
[2:a]volume=0.0841,atrim=0:118.0,afade=t=in:st=0:d=1.2,afade=t=out:st=116.8:d=1.2,adelay=34400|34400[b]; \
[3:a]volume=0.0323,atrim=0:62.8,afade=t=in:st=0:d=1.2,afade=t=out:st=61.6:d=1.2,adelay=152900|152900[c]; \
[4:a]volume=0.0700,atrim=0:46.8,afade=t=in:st=0:d=1.2,afade=t=out:st=45.6:d=1.2,adelay=216200|216200[d]; \
[5:a]volume=0.1622,atrim=0:41.7,afade=t=in:st=0:d=1.2,afade=t=out:st=39.2:d=2.5,adelay=263500|263500[e]; \
[a][b][c][d][e]amix=inputs=5:duration=longest:normalize=0[bed]; \
[0:a][bed]amix=inputs=2:duration=first:normalize=0[aout]" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest "$OUT"

echo "mixed -> $OUT"
