#!/usr/bin/env bash
# Generate more angles of the SAME studio room, all referencing the locked hero v7.
set -u
cd "$(dirname "$0")"
mkdir -p angles
REF=studio-hero-v7-redbright.png
BASE="This is the SAME cozy crypto content-creator studio room as the reference image, with the SAME furniture, materials and lighting: bright warm room lighting with a red LED accent glow, two desks, pink and purple cat-ear gaming chairs (cat-face back, cat-ear top), a curved purple velvet channel-tufted sofa, a distressed light wood dresser, a patterned vintage rug, acoustic wall panels, monitors showing green crypto candlestick charts, a podcast boom mic, wood floor. Keep it consistent with the reference. No people, photorealistic, no text, no watermark."

gen() {  # name aspect angleprompt
  local url
  url=$(higgsfield generate create nano_banana_2 --image "$REF" --aspect_ratio "$2" --resolution 2k --wait --prompt "$BASE $3" 2>&1 | grep -oE 'https://[^ ]+\.png' | tail -1)
  echo "$1 -> $url"
  [ -n "$url" ] && curl -s -o "angles/$1.png" "$url" && echo "saved angles/$1.png"
}

gen "angle-reverse"   "16:9" "Camera placed at the BACK of the room looking toward the entrance wall (the reverse angle, 180 degrees from the reference), showing the opposite side of the room and the fronts of the desks and chairs."
gen "angle-fromright" "16:9" "Wide view from the RIGHT side of the room looking left, with the main recording desk in the foreground and the second desk and the purple velvet sofa across the room."
gen "angle-backwall"  "16:9" "View facing the BACK WALL straight on, centered on the curved purple velvet sofa with the distressed wood dresser beside it and the shelves above."
gen "angle-topdown"   "1:1"  "TOP-DOWN overhead birds-eye floor-plan view, camera looking straight down at the entire room, showing the full furniture arrangement, the two desks, the chairs, the sofa, the dresser and the rug on the floor."
gen "angle-ceiling"   "16:9" "View looking straight UP at the CEILING of the room from below, showing the ceiling surface, the light fixtures, and any LED strip lighting and beams overhead."

echo "=== ANGLES DONE ==="
