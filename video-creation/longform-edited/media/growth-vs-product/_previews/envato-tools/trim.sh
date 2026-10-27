#!/bin/sh
# trim.sh <src> <start> <end> <out> : 1920x1080 H.264, audio stripped, native fps
src="$1"; a="$2"; b="$3"; out="$4"
d=$(python -c "print(round($b-$a,3))")
ffmpeg -y -v error -ss "$a" -i "$src" -t "$d" -vf "scale=1920:1080:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 18 -an -movflags +faststart "$out" && \
echo "$out $(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames:format=duration,size -of csv=p=0 "$out" | tr '\n' ' ') audio_streams=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$out" | wc -l)"
