#!/usr/bin/env bash
# TEMPLATE — segmented fresh-Chrome render for an ai-engineering explainer comp.
# WHY segments: a straight-through Remotion render dies partway (headless-Chrome memory buildup);
# rendering VIDEO-ONLY in ~3000-frame --muted chunks (fresh Chrome each) + concat -c copy + separate
# audio mux is the reliable method. CPU h264 only on Windows; concurrency 8.
#
# Edit the vars, then:  MODE=draft bash render.sh    (VO-only @300k, for review)
#                       MODE=final bash render.sh    (2 Mbps + music bed)
set -euo pipefail

# ── per-video ────────────────────────────────────────────────────────────────
COMP_ID="SaveTokens"                                   # Root.tsx composition id
PROJECT_DIR="C:/Users/mnede/Documents/Claude/social-media/video-creation/ai-engineering/media/Save tokens by using sub agents"
DURATION_FRAMES=10688                                    # = <PREFIX>_DURATION_FRAMES from the timeline module
MUSIC_REL="render-assets/music-corporate.mp3"        # relative to PROJECT_DIR (final only; source first)
MUSIC_VOL="0.056"                                    # ~19 dB under VO; re-measure LUFS per bed
# ────────────────────────────────────────────────────────────────────────────
MODE="${MODE:-draft}"
REMOTION_DIR="C:/Users/mnede/Documents/Claude/social-media/video-creation/remotion"
PROJ_NAME="$(basename "$PROJECT_DIR")"
PUBLIC_DIR="../ai-engineering/media/$PROJ_NAME"      # relative to REMOTION_DIR
SEG_DIR="$REMOTION_DIR/out/seg-$COMP_ID"
if [ "$MODE" = "final" ]; then BITRATE="2M"; else BITRATE="300k"; fi
LAST=$((DURATION_FRAMES - 1))
cd "$REMOTION_DIR"; mkdir -p "$SEG_DIR"

# build ~3000-frame inclusive ranges 0..LAST
RANGES=(); a=0
while [ "$a" -le "$LAST" ]; do b=$((a+2999)); [ "$b" -gt "$LAST" ] && b="$LAST"; RANGES+=("$a-$b"); a=$((b+1)); done

echo "=== RENDER $COMP_ID mode=$MODE bitrate=$BITRATE frames=0-$LAST segs=${#RANGES[@]} ==="
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
TOTAL_S=$(python -c "print($DURATION_FRAMES/30)")

if [ "$MODE" = "final" ]; then
  FADE_OUT_ST=$(python -c "print(max(0,$TOTAL_S-1.8))")
  ffmpeg -y -i "$PROJECT_DIR/audio/full-narration.mp3" -stream_loop -1 -i "$PROJECT_DIR/$MUSIC_REL" \
    -filter_complex "[1:a]volume=$MUSIC_VOL,afade=t=in:st=0:d=1,afade=t=out:st=$FADE_OUT_ST:d=1.8,atrim=0:$TOTAL_S[m];[0:a][m]amix=inputs=2:duration=longest:normalize=0[a]" \
    -map "[a]" -t "$TOTAL_S" -c:a aac -b:a 256k -ar 48000 _audio.m4a
  OUT="$PROJECT_DIR/$PROJ_NAME-final-2mbps.mp4"
else
  ffmpeg -y -i "$PROJECT_DIR/audio/full-narration.mp3" -t "$TOTAL_S" -c:a aac -b:a 192k -ar 48000 _audio.m4a
  OUT="$PROJECT_DIR/$PROJ_NAME-draft-300k.mp4"
fi
ffmpeg -y -i _video.mp4 -i _audio.m4a -c:v copy -c:a copy -shortest "$OUT"
echo "=== DONE -> $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s) ==="
