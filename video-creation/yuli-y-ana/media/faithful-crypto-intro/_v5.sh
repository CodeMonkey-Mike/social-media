#!/usr/bin/env bash
# v5: Ana's voice = ElevenLabs v3 takes (no atempo), welcome face re-done with a smile prompt. Chain: promote -> timeline -> captions -> pads -> Aurora 02/04 -> data -> render -> checks.
set -u
cd "C:/Users/mnede/Documents/Claude/social-media/video-creation/yuli-y-ana/media/faithful-crypto-intro"
for n in 02 04 06 08 10; do cp -f "audio/chunk-$n-raw.mp3" "audio/_seedspeech-chunk-$n-raw.mp3" 2>/dev/null; cp -f "audio/_cand/el3-chunk-$n.mp3" "audio/chunk-$n-raw.mp3"; cp -f "audio/_cand/el3-chunk-$n.mp3" "audio/chunk-$n.mp3"; done
echo "=== promoted el3 takes"
python build_timeline.py && python make_captions.py 2>&1 | grep -v "^\[" | head -8
for n in 02 04; do ffmpeg -y -loglevel error -i "audio/chunk-$n.mp3" -af "adelay=250|250,apad=pad_dur=0.4" -ar 48000 -ac 2 "audio/_aurora/chunk-$n.wav"; done
bash _aurora.sh 02
AURORA_PROMPT="She smiles big and bright with genuine excitement, warm welcoming energy, eyebrows lifted, joyful expression throughout" bash _aurora.sh 04
python build_data.py | tail -1
cd ../../../remotion
npx remotion render src/index.ts FaithfulCryptoIntro "../yuli-y-ana/media/faithful-crypto-intro/faithful-crypto-intro-FINAL-v5.mp4" --public-dir="../yuli-y-ana/media/faithful-crypto-intro/render-assets" --codec=h264 --crf=18 2>&1 | grep -E "Rendered 1[0-9]{3}/|Error|error" | tail -1
F="../yuli-y-ana/media/faithful-crypto-intro/faithful-crypto-intro-FINAL-v5.mp4"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$F"
echo "=== black gaps"; (ffmpeg -i "$F" -vf "blackdetect=d=0.08:pic_th=0.98" -f null - 2>&1 | grep -o "black_start:[0-9.]* black_end:[0-9.]*" || echo none)
ffmpeg -i "$F" -af volumedetect -f null - 2>&1 | grep -E "max_volume"
echo "=== V5 DONE"
