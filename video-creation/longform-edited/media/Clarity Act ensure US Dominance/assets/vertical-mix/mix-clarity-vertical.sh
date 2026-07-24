#!/usr/bin/env bash
set -e
PROJ="C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/Clarity Act ensure US Dominance"
MUS="C:/Users/mnede/Documents/Claude/social-media/video-creation/assets/music"
IN="$PROJ/_previews/clarity-VERTICAL-noaudio.mp4"
OUT="$PROJ/_previews/clarity-VERTICAL-final.mp4"
B1="$MUS/Synthwave Cinema/Mikey_Geiger_Synthwave_Cinema_instrumental_2_57.mp3"
B2="$MUS/Press Play/Elision_Press_Play_instrumental_1_33.mp3"
B3="$MUS/Common High Speeds/Common_Kid_High_Speeds_instrumental_2_28.wav"
B4="$MUS/theta-rest/Outside_The_Sky_Theta_Rest_instrumental_3_24.mp3"

# POP FIX: the two title-card freezes (CH2 pause 43.0-44.0, CH4 pause 211.3-212.3) are 1s of silence; the
# speech->silence step at each edge clicks. Ramp-mute those windows (60ms in/out) so the step is gone.
POP="volume=eval=frame:volume='if(between(t,42.94,44.06),if(lt(t,43),(43-t)/0.06,if(lt(t,44),0,(t-44)/0.06)),if(between(t,211.24,212.36),if(lt(t,211.3),(211.3-t)/0.06,if(lt(t,212.3),0,(t-212.3)/0.06)),1))'"

# bed level 0.041 linear = -10 dB from original 0.13 (Mike: soft video, drop music another 5 dB)
ffmpeg -y -i "$IN" -i "$B1" -stream_loop 2 -i "$B2" -i "$B3" -i "$B4" -filter_complex "
[0:a]${POP}[vo];
[1:a]atrim=0:44,asetpts=PTS-STARTPTS,volume=0.041,afade=t=in:st=0:d=1.5,afade=t=out:st=42.5:d=1.5[b1];
[2:a]atrim=0:167.3,asetpts=PTS-STARTPTS,volume=0.041,afade=t=in:st=0:d=1.5,afade=t=out:st=165.8:d=1.5,adelay=44000|44000[b2];
[3:a]atrim=0:138.36,asetpts=PTS-STARTPTS,volume=0.041,afade=t=in:st=0:d=1.5,afade=t=out:st=136.86:d=1.5,adelay=211300|211300[b3];
[4:a]atrim=0:71.67,asetpts=PTS-STARTPTS,volume=0.041,afade=t=in:st=0:d=1.5,afade=t=out:st=68.67:d=3,adelay=349660|349660[b4];
[vo][b1][b2][b3][b4]amix=inputs=5:normalize=0:duration=first[aout]
" -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 256k "$OUT"
echo "MIXED -> $OUT"
ffprobe -v error -show_entries format=duration:stream=codec_type,bit_rate -of default=nw=1 "$OUT"