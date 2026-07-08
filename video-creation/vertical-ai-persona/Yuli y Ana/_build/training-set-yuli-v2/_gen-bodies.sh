#!/usr/bin/env bash
# Phase B — Yuli RETRAIN body/dress training shots (body-2 look: faithful face, 18% torso trim, curvy, petite).
# Anchored on the NEW face master f1 (face-3 look) to prevent face-fattening drift.
set -u
cd "$(dirname "$0")/../.."   # -> "Yuli y Ana" (script lives in _build/training-set-yuli-v2/)
OUT="_build/training-set-yuli-v2"
ANCHOR="$OUT/f1-E0B602F6-front-smile.png"

FACE='Reproduce the EXACT same face and identity as the reference image: same soft slightly-full youthful face shape, full cheeks, soft jawline, warm rounded brown eyes, full natural eyebrows, full lips, warm fair skin, dark curly hair worn down, about 28 years old. Do NOT slim, narrow or thin her face. Her signature soft natural glam makeup: dewy glowing skin, warm peachy-pink blush, warm coral-rose lip. Natural realistic skin texture with visible pores, photorealistic, no text, no watermark.'
BODY='Her body is trimmed about 18 percent slimmer in the torso, waist and arms while still curvy and natural, NOT skinny. She is petite, about 4 feet 11 inches tall.'

gen() { # name aspect scene
  local url
  url=$(higgsfield generate create nano_banana_2 --image "$ANCHOR" --aspect_ratio "$2" --resolution 2k --wait \
        --prompt "$FACE $BODY $3" 2>&1 | grep -oE 'https://[^ ]+\.png' | tail -1)
  echo "$1 -> $url"
  [ -n "$url" ] && curl -s -o "$OUT/$1.png" "$url" && echo "saved $OUT/$1.png"
}

gen "yb01-front-casual"       "3:4" "Standing relaxed half-body waist-up shot, casual fitted navy t-shirt, soft natural smile, clean softly-blurred neutral warm studio background, looking at camera."
gen "yb02-threequarter-casual" "3:4" "Half-body waist-up, body turned to a three-quarter angle, casual fitted cream knit top, gentle smile, clean softly-blurred neutral background."
gen "yb03-front-dress"        "3:4" "Half-body waist-up, elegant fitted casual day dress, soft genuine smile, clean softly-blurred warm neutral background, looking at camera."
gen "yb04-gown-threequarter"  "3:4" "Three-quarter body shot, elegant fitted evening gown, standing relaxed, soft confident expression, softly-blurred upscale neutral background."
gen "yb05-side-profile"       "3:4" "Half-body waist-up side profile view, casual fitted top, calm relaxed expression, clean softly-blurred neutral background."
gen "yb06-overshoulder"       "3:4" "Half-body over-the-shoulder shot, head turned back toward camera, casual fitted top, soft smile, clean softly-blurred neutral background."

echo "=== BODIES DONE ==="
