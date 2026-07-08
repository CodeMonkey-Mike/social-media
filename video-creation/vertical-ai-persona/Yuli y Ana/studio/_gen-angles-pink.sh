#!/usr/bin/env bash
# Make a moody pink/magenta lighting variant of each matched angle (same room/composition).
set -u
cd "$(dirname "$0")"
RELIGHT="Keep this EXACT room, same camera angle, same furniture and layout (the cat-ear gaming chairs, curved purple velvet sofa, distressed dresser, two desks, vintage rug, acoustic panels, monitors with green crypto charts, boom mic, shelves, plants). ONLY change the lighting: make it darker, moody and dramatic with saturated PINK and MAGENTA LED accent glow (dim ambient, late-night streamer-studio mood), instead of red/bright. No people, photorealistic, no text, no watermark."

relight() {  # name aspect
  local url
  url=$(higgsfield generate create nano_banana_2 --image "angles/$1.png" --aspect_ratio "$2" --resolution 2k --wait --prompt "$RELIGHT" 2>&1 | grep -oE 'https://[^ ]+\.png' | tail -1)
  echo "$1-pink -> $url"
  [ -n "$url" ] && curl -s -o "angles/$1-pink.png" "$url" && echo "saved angles/$1-pink.png"
}

relight angle-reverse   "16:9"
relight angle-fromright "16:9"
relight angle-backwall  "16:9"
relight angle-topdown   "1:1"
relight angle-ceiling   "16:9"
echo "=== PINK ANGLES DONE ==="
