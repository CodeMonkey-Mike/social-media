#!/usr/bin/env bash
# Vertical (9:16) render for SaveTokensVertical — segmented fresh-Chrome video-only @2M, then
# REUSE the 16:9 final's mixed audio verbatim (VO + bed are framing-independent → audio parity).
set -euo pipefail

COMP_ID="SaveTokensVertical"
PROJECT_DIR="C:/Users/mnede/Documents/Claude/social-media/video-creation/ai-engineering/media/Save tokens by using sub agents"
DURATION_FRAMES=10688
SRC16="$PROJECT_DIR/Save tokens by using sub agents-final-2mbps.mp4"   # audio source (parity)
BITRATE="2M"
REMOTION_DIR="C:/Users/mnede/Documents/Claude/social-media/video-creation/remotion"
PUBLIC_DIR="../ai-engineering/media/Save tokens by using sub agents"
SEG_DIR="$REMOTION_DIR/out/seg-$COMP_ID"
LAST=$((DURATION_FRAMES - 1))
cd "$REMOTION_DIR"; mkdir -p "$SEG_DIR"

RANGES=(); a=0
while [ "$a" -le "$LAST" ]; do b=$((a+2999)); [ "$b" -gt "$LAST" ] && b="$LAST"; RANGES+=("$a-$b"); a=$((b+1)); done

echo "=== VERTICAL RENDER $COMP_ID @$BITRATE frames=0-$LAST segs=${#RANGES[@]} ==="
: > "$SEG_DIR/list.txt"; i=1
for r in "${RANGES[@]}"; do
  seg=$(printf "s%02d" "$i")
  echo "--- $seg frames=$r ---"
  npx remotion render src/index.ts "$COMP_ID" "$SEG_DIR/$seg.mp4" \
    --codec=h264 --muted --frames="$r" --video-bitrate="$BITRATE" --concurrency=8 --public-dir="$PUBLIC_DIR"
  sz=$(stat -c %s "$SEG_DIR/$seg.mp4"); [ "$sz" -lt 1000000 ] && { echo "ERROR: $seg too small ($sz)"; exit 1; }
  echo "file '$seg.mp4'" >> "$SEG_DIR/list.txt"; i=$((i+1))
done

cd "$SEG_DIR"
ffmpeg -y -f concat -safe 0 -i list.txt -c copy _video.mp4
OUT="$PROJECT_DIR/Save tokens by using sub agents-VERTICAL-v1.mp4"
ffmpeg -y -i _video.mp4 -i "$SRC16" -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest "$OUT"
echo "=== DONE -> $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s) ==="
