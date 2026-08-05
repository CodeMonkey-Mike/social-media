#!/usr/bin/env bash
# ethereum-rwa — MUSIC BED MIX. Run from media/ethereum-rwa/.
#   ./mix-music.sh _previews/ethereum-rwa-FULL-v9.mp4 _previews/ethereum-rwa-FINAL-v9-music.mp4
#
# The bed is a PRE-MIXED FILE, not a filtergraph: `_tmp/mix/bed-extracted.flac` already contains all
# 4 beds at Mike's approved gains with every breath, duck and fade baked in
#   BED A Down To The Wire        0.0668   BED B Fortitude   0.0211 (Mike -5 dB)
#   BED C Edgerunner              0.0251 (Mike -5 dB)   BED D Searching For Signs Of Life  0.0531
#   BED D source_in 34.88 = END-ALIGNED so the file's last sample lands on the final frame.
# It was RECOVERED by subtracting FULL-v5 from FINAL-v5-music after the original mix command was lost
# with its session (see skills/music.md "PERSIST THE MIX"). Verified: -36.0 LUFS = 17.9 dB under the
# -18.1 LUFS VO; per-chapter levels track the per-bed gains; comp->source maps s = t - 169.10.
#
# Because the bed is baked, this survives a re-cut of the picture: any later vN only needs THIS.
# -c:v copy = video untouched, runs in ~40s. duration=first keeps the video's length authoritative
# (the bed is ~20 ms shorter, which is inside the track's own decay tail).
set -euo pipefail

IN="${1:?usage: mix-music.sh <video-in.mp4> <video-out.mp4>}"
OUT="${2:?usage: mix-music.sh <video-in.mp4> <video-out.mp4>}"
BED="${BED:-music/bed-final.flac}"   # a PROJECT artifact, never a temp file: _previews/_tmp get recycled at COMPLETE

[ -f "$BED" ] || { echo "MISSING BED: $BED — recover it per skills/music.md, do NOT rebuild by hand"; exit 1; }

ffmpeg -v error -y -i "$IN" -i "$BED" \
  -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0:duration=first[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k "$OUT"

echo "wrote $OUT"
echo "VERIFY: isolate the bed by subtracting \$IN from \$OUT and confirm ~17-18 dB under the VO:"
echo "  target: mixed ~-18.1 LUFS, isolated bed ~-36.0 LUFS"
