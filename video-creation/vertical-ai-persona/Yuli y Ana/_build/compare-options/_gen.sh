#!/usr/bin/env bash
set -u
cd "$(dirname "$0")/../.."   # -> "Yuli y Ana" (script lives in _build/compare-options/)
REF="source-photos/Messenger_creation_E0B602F6-7C70-4353-B4C6-58C04ACAB18F.jpeg"

FAITHFUL='Reproduce the EXACT face and identity of the woman in the reference photo: same soft slightly-full youthful face shape, same full cheeks, same soft jawline, same warm rounded brown eyes, same full natural eyebrows, same nose, same full lips, same warm fair skin, same dark curly hair. Do NOT slim, narrow or thin her face. Her signature soft natural glam makeup: dewy glowing skin, warm peachy-pink blush, warm coral-rose lip, soft mascara. Natural realistic skin texture with visible pores, photorealistic, clean softly-blurred neutral warm studio background, vertical portrait, looking at the camera, no text, no watermark.'

gen() { # name aspect prompt
  local url
  url=$(higgsfield generate create nano_banana_2 --image "$REF" --aspect_ratio "$2" --resolution 2k --wait --prompt "$3" 2>&1 | grep -oE 'https://[^ ]+\.png' | tail -1)
  echo "$1 -> $url"
  [ -n "$url" ] && curl -s -o "_build/compare-options/$1.png" "$url" && echo "saved _build/compare-options/$1.png"
}

# OPTION 1 - Fully faithful (real age, real body)
gen "opt1-face" "3:4" "$FAITHFUL She is her real age (early thirties), relaxed gentle genuine soft smile. Tight head-and-shoulders portrait."
gen "opt1-body" "3:4" "$FAITHFUL She is her real age (early thirties). Keep her REAL natural fuller curvy body exactly, do not slim her body. Petite, about 4 feet 11 inches tall. Standing relaxed half-body waist-up shot, casual fitted top."

# OPTION 2 - Faithful face, trimmed body
gen "opt2-face" "3:4" "$FAITHFUL She is her real age (early thirties), relaxed gentle genuine soft smile. Tight head-and-shoulders portrait."
gen "opt2-body" "3:4" "$FAITHFUL She is her real age (early thirties). Keep her face exactly faithful, but her body is trimmed about 18 percent slimmer in the torso, waist and arms while still curvy and natural (not skinny). Petite, about 4 feet 11 inches tall. Standing relaxed half-body waist-up shot, casual fitted top."

# OPTION 3 - Light glow-up (youthened ~28, trimmed body)
gen "opt3-face" "3:4" "$FAITHFUL Keep her real face SHAPE faithful but make her look about 28 years old, fresh and youthful, relaxed gentle genuine soft smile. Tight head-and-shoulders portrait."
gen "opt3-body" "3:4" "$FAITHFUL Make her look about 28 years old, youthful. Keep her face shape faithful; her body is trimmed about 18 percent slimmer in the torso, waist and arms while still curvy and natural (not skinny). Petite, about 4 feet 11 inches tall. Standing relaxed half-body waist-up shot, casual fitted top."

echo "=== DONE ==="
