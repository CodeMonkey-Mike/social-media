#!/usr/bin/env bash
# Phase A — Yuli RETRAIN face training set (face-3 / body-2 look, thin-face rule DROPPED).
# Minimal-touch: ONE real photo per gen, faithful shape, youthened ~28, soft glam.
set -u
cd "$(dirname "$0")/../.."   # -> "Yuli y Ana" (script lives in _build/training-set-yuli-v2/)
OUT="_build/training-set-yuli-v2"
mkdir -p "$OUT"

FAITHFUL='Reproduce the EXACT face and identity of the woman in the reference photo: same soft slightly-full youthful face shape, same full cheeks, same soft jawline, same warm rounded brown eyes, same full natural eyebrows, same nose, same full lips, same warm fair skin, same dark curly hair. Do NOT slim, narrow or thin her face. Keep her real face SHAPE faithful but make her look about 28 years old, fresh and youthful. Her signature soft natural glam makeup: dewy glowing skin, warm peachy-pink blush, warm coral-rose lip, soft mascara. Natural realistic skin texture with visible pores, photorealistic, clean softly-blurred neutral warm studio background, vertical portrait, no text, no watermark.'

gen() { # name ref expression-angle
  local url
  url=$(higgsfield generate create nano_banana_2 --image "$2" --aspect_ratio "3:4" --resolution 2k --wait \
        --prompt "$FAITHFUL $3" 2>&1 | grep -oE 'https://[^ ]+\.png' | tail -1)
  echo "$1 -> $url"
  [ -n "$url" ] && curl -s -o "$OUT/$1.png" "$url" && echo "saved $OUT/$1.png"
}

gen "f1-E0B602F6-front-smile"   "source-photos/Messenger_creation_E0B602F6-7C70-4353-B4C6-58C04ACAB18F.jpeg" "Relaxed gentle genuine soft smile, looking straight at the camera. Tight head-and-shoulders portrait."
gen "f2-B554B086-threequarter"  "source-photos/Messenger_creation_B554B086-062B-4A7E-ACDE-77F3DEE06821.jpeg" "Soft natural closed-lip smile, head turned slightly to a three-quarter angle, eyes to camera. Head-and-shoulders portrait."
gen "f3-CA29331E-warm-smile"    "source-photos/Messenger_creation_CA29331E-0EF6-4779-A1C9-B6E2D5F6FA1F.jpeg" "Warm genuine happy smile, lively and friendly, looking at the camera. Tight head-and-shoulders portrait."
gen "f4-37D5291B-neutral"       "source-photos/Messenger_creation_37D5291B-5D20-452C-824F-CBDF62532F02.jpeg" "Calm relaxed neutral-soft expression, looking straight at the camera. Tight head-and-shoulders portrait."
gen "f5-E0B602F6-angle"         "source-photos/Messenger_creation_E0B602F6-7C70-4353-B4C6-58C04ACAB18F.jpeg" "Soft gentle smile, looking slightly off to the side, three-quarter face angle. Head-and-shoulders portrait."

echo "=== FACES DONE ==="
