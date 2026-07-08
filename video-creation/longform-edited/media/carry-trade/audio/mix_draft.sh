#!/bin/bash
# carry-trade — draft post-mix: bed + 4 SFX hits onto the rendered draft (comp-build.md §9).
# Run from anywhere:  bash media/carry-trade/audio/mix_draft.sh
set -e
CT="/c/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/carry-trade"
SFX="/c/Users/mnede/Documents/Claude/social-media/video-creation/assets/sfx"
# VERSION discipline (Mike, 2026-07-06): every delivered draft gets a NEW -vN filename — never
# overwrite the file Mike is reviewing. Bump V per delivery.
V="${V:-v2}"
IN="${IN:-$CT/renders/carry-trade-draft-video-$V.mp4}"
OUT="${OUT:-$CT/renders/carry-trade-draft-$V.mp4}"

# Hits (final coords):
#  14.42  Impact_Hit_01-2      — hook payoff "That era is ending" (heaviest hit)
#  79.04  Soundjay_Impact_Main — the FLIP chapter card
# 271.52  Tension_Rise_3 (5.76s, swell) → 277.28 Impact_3 — BTC-drop reveal (riser ENDS on the hit)
# 426.92  Tension_Rise_2 (7.62s, swell) → 434.54 Kick_Impact_01 — 40yr-low reveal
ffmpeg -y -i "$IN" -i "$CT/audio/bed_draft.wav" \
  -i "$SFX/Impacts/Impact_Hit_01-2.wav" \
  -i "$SFX/Impacts/Soundjay_Impact_Main_01.wav" \
  -i "$SFX/risers/Tension_Rise_Logo_Reveal_3.wav" \
  -i "$SFX/Impacts/Impact_3.wav" \
  -i "$SFX/risers/Tension_Rise_Logo_Reveal_2.wav" \
  -i "$SFX/Impacts/Kick_Impact_01.wav" \
  -filter_complex "
[2:a]adelay=14420|14420,volume=-11dB[s1];
[3:a]adelay=79040|79040,volume=-12dB[s2];
[4:a]adelay=271520|271520,volume=-13dB[s3];
[5:a]adelay=277280|277280,volume=-11dB[s4];
[6:a]adelay=426920|426920,volume=-13dB[s5];
[7:a]adelay=434540|434540,volume=-11dB[s6];
[0:a][1:a][s1][s2][s3][s4][s5][s6]amix=inputs=8:normalize=0:duration=first[mix]" \
  -map 0:v -map "[mix]" -c:v copy -c:a aac -b:a 192k "$OUT"
echo "mixed -> $OUT"
