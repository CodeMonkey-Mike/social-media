#!/usr/bin/env bash
# finish-cta.sh — drop the spoken CTA into the finished short. AUDIO ONLY, no re-render.
#
# PREREQUISITE (the one thing this script cannot do): the hfbot-profile Chrome must be logged in
# to Higgsfield. Launch it and sign in once:
#   chrome.exe --user-data-dir="C:\Users\mnede\AppData\Local\Google\Chrome\hfbot-profile" \
#              --remote-debugging-port=9333 https://higgsfield.ai/
# then open Audio -> model "Seed Speech" -> Voice Preset "MIKE-CLONE" and leave it on that screen.
# The batch driver aborts before spending a credit if the selected voice is not MIKE-CLONE.
set -euo pipefail

REPO="C:/Users/mnede/Documents/Claude/social-media"
PROJ="$REPO/video-creation/longform-edited/media/kaspa 30bps"
HFV="$REPO/video-creation/skills/higgsfield-voice"
WORK="$PROJ/_short"
VO="$REPO/video-creation/assets/vo"   # SHARED across projects, not project-local
BED="$REPO/video-creation/assets/music/Hold The Line/Wicked_Cinema_Hold_The_Line_instrumental_3_09.mp3"

echo "== 1. generate (SCRIPT gate + VOICE gate both run before any credit is spent)"
cd "$HFV"
node _batch-generate.js "$VO/tts-chunks.json" "$VO" "$VO/CTA-SCRIPT.md"

echo "== 2. download the take"
URL=$(python -c "import json;print(json.load(open(r'$VO/_manifest.json'))[0]['url'])")
curl -sSL "$URL" -o "$VO/cta-watch-full.mp3"
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$VO/cta-watch-full.mp3"

echo "== 3. QA the take against the script (a garbled CTA is the one line every viewer hears)"
whisper "$VO/cta-watch-full.mp3" --model small.en --output_dir "$VO" --output_format txt
echo "   heard: $(cat "$VO/cta-watch-full.txt")"
echo "   script: Click below to WATCH the full video!"
echo "   ^ if those do not match, re-roll before continuing."

echo "== 4. re-mix: VO spans + the CTA at VO level + the continuous bed"
cd "$WORK"
# CTA sits in the outro, which starts at 36.633s. Pad it into a full-length track so it lands there,
# then sum it with the span VO; the bed keeps its +4 dB outro lift underneath.
ffmpeg -y -v error -i "$VO/cta-watch-full.mp3" \
  -af "adelay=36800|36800,apad" -t 40.0 -c:a pcm_s16le cta-40s.wav
ffmpeg -y -v error -i short-video.mp4 -i vo-40s.wav -i cta-40s.wav -i "$BED" -filter_complex "\
[3:a]atrim=0:40,asetpts=N/SR/TB,\
volume='0.0902*(1+0.585*min(1,max(0,(t-36.4)/0.6)))':eval=frame,\
afade=t=in:st=0:d=0.8,afade=t=out:st=38.7:d=1.3[bed];\
[1:a][2:a][bed]amix=inputs=3:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k short-mixed-cta.mp4

cp short-mixed-cta.mp4 "$PROJ/kaspa-40bps-SHORT-40s.mp4"
echo "== done -> $PROJ/kaspa-40bps-SHORT-40s.mp4"
ffmpeg -hide_banner -nostats -i "$PROJ/kaspa-40bps-SHORT-40s.mp4" -af ebur128=peak=true -f null - 2>&1 \
  | grep -E "^\s+I:|Peak:" | head -3
