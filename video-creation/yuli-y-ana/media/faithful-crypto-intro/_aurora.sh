#!/usr/bin/env bash
# Face lines via ElevenLabs Creatify Aurora (image -> lip-sync), sequential, one attempt each.
# Usage: bash _aurora.sh 01 02 03   (01/03 = Yuli still, 02/04 = Ana still) -> clips/chunk-NN-aurora.mp4 (muted preview)
set -u
cd "C:/Users/mnede/Documents/Claude/social-media/video-creation/skills/elevenlabs-lipsync"
P="C:/Users/mnede/Documents/Claude/social-media/video-creation/yuli-y-ana/media/faithful-crypto-intro"
M="C:/Users/mnede/Documents/Claude/social-media/video-creation/yuli-y-ana/MASTER/studio-shots"
for n in "$@"; do
  case $n in 01|03) STILL="$M/yuli-pinkchair-webcam.png";; *) STILL="$M/ana-purplechair-webcam.png";; esac
  echo "=== $(date +%T) generate chunk-$n"
  PR=""; [ -n "${AURORA_PROMPT:-}" ] && PR="--prompt \"$AURORA_PROMPT\""   # optional expression guidance (Aurora = guided lip sync)
  eval node lipsync-create.js --image "\"$STILL\"" --audio "\"$P/audio/_aurora/chunk-$n.wav\"" --model "\"Creatify Aurora\"" $PR --generate 2>&1 | tail -4
  echo "=== $(date +%T) wait 150s then fetch"; sleep 150
  node fetch-result.js --model "Creatify Aurora" --out "$P/clips/chunk-$n-aurora.mp4" --minutes 10 2>&1 | tail -3
  ffprobe -v error -show_entries stream=width,height:format=duration -of csv=p=0 "$P/clips/chunk-$n-aurora.mp4" 2>&1 | tr '\n' ' '; echo
done
echo "=== $(date +%T) AURORA DONE"
