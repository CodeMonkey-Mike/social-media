#!/usr/bin/env bash
# Generate Toccata voice lines B-E via ANA-2 (already selected), then atempo 1.2x.
# Also finalizes A (the validated test clip) at 1.2x. Raw clips kept as toccata-<X>-raw.mp3.
set -u
cd "$(dirname "$0")"
AUDIO="/c/Users/mnede/Documents/Claude/social-media/video-creation/vertical-ai-persona/Yuli y Ana/media/kaspa-toccata/audio"

speed() { ffmpeg -y -i "$1" -filter:a "atempo=1.20" -b:a 192k "$2" 2>/dev/null; }

# --- finalize A from the validated test clip + clean test versions ---
[ -f "$AUDIO/toccata-A.mp3" ] && cp -f "$AUDIO/toccata-A.mp3" "$AUDIO/toccata-A-raw.mp3"
cp -f "$AUDIO/toccata-A-fast120.mp3" "$AUDIO/toccata-A.mp3" 2>/dev/null
rm -f "$AUDIO/toccata-A-fast115.mp3" "$AUDIO/toccata-A-fast125.mp3" "$AUDIO/toccata-A-fast120.mp3" "$AUDIO/toccata-A.txt"
echo "A finalized (1.2x)"

gen() { # letter  text
  local k="$1" text="$2" url
  echo "--- $k"
  url=$(node _gen-line.js "$text" 2>/dev/null | grep -oE 'https://[^ ]+\.mp3' | tail -1)
  if [ -z "$url" ]; then echo "FAIL $k (no url)"; return; fi
  curl -s -o "$AUDIO/toccata-$k-raw.mp3" "$url" && speed "$AUDIO/toccata-$k-raw.mp3" "$AUDIO/toccata-$k.mp3" && echo "OK $k -> toccata-$k.mp3"
}

gen B "It's the FASTEST proof-of-work network in crypto, and in just TEN DAYS it gets the BIGGEST upgrade in its history, the Toccata hardfork."
gen C "This is the moment Kaspa stops being only a payment network and becomes a programmable LAYER ONE. REAL smart contracts, built on the most decentralized base there is."
gen D "That puts it right up against ETHEREUM."
gen E "TEN DAYS. You do NOT want to miss this one."
echo "=== TOCCATA B-E DONE ==="
