#!/usr/bin/env bash
# Strip wall-mounted items (acoustic panels, sconces, floating shelves + their contents)
# from every wall-showing studio render, keeping all furniture/lighting. Output: <name>-BARE-WALLS.png
# Skips ceiling/topdown (no walls). One nano_banana generation per image.
set -u
cd "$(dirname "$0")"

PROMPT='Keep this studio room image EXACTLY the same in every way: same furniture, same two desks, same monitors and screens, same cat-ear gaming chairs, same sofa, same wood dresser and items on it, same boom mics, same rug, same wood floor, same plants on the floor or furniture, same deep magenta and hot-pink LED lighting, same camera angle and framing. Make ONLY these removals from the WALLS: remove ALL acoustic wall panels, remove ALL wall sconce lights, and remove ALL floating wall shelves together with every candle, figurine and small plant sitting on those shelves. Leave clean, bare, dark textured plaster walls with only the smooth magenta and pink LED accent glow, nothing mounted on them. Do NOT change, move, or remove any furniture, desks, chairs, sofa, dresser, floor plants, monitors, or the lighting. Photorealistic, seamless, consistent lighting, no text, no watermark.'

IMAGES=(
  "angles/angle-backwall.png"
  "angles/angle-backwall-pink.png"
  "angles/angle-fromright.png"
  "angles/angle-fromright-pink.png"
  "angles/angle-reverse.png"
  "angles/angle-reverse-pink.png"
  "angles/angle-topdown.png"
  "angles/angle-topdown-pink.png"
)

for f in "${IMAGES[@]}"; do
  out="${f%.png}-BARE-WALLS.png"
  if [ -f "$out" ]; then echo "SKIP (exists) $out"; continue; fi
  echo "--- $f"
  case "$f" in *topdown*) ASP="1:1";; *) ASP="16:9";; esac
  url=$(higgsfield generate create nano_banana_2 --image "$f" --aspect_ratio "$ASP" --resolution 2k --wait --prompt "$PROMPT" 2>&1 | grep -oE 'https://[^ ]+\.png' | tail -1)
  if [ -n "$url" ]; then curl -s -o "$out" "$url" && echo "OK   $out"; else echo "FAIL $f (no url)"; fi
done
echo "=== BARE-WALLS BATCH DONE ==="
