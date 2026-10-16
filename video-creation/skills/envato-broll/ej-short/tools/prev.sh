#!/bin/bash
# usage: prev.sh results.json outdir
J=$1; O=$2; mkdir -p "$O"
python -I -c "
import json,sys
for i,r in enumerate(json.load(open(sys.argv[1],encoding='utf-8'))):
    print(i, r['previewVideo'], r['duration'], r['title'].replace(' ','_')[:60], sep='\t')
" "$J" | while IFS=$'\t' read i u d t; do
  f="$O/p$i.mp4"; [ -s "$f" ] || curl -s -o "$f" "$u"
  dim=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$f")
  echo "$i $dim $d $t"
  ffmpeg -v error -y -i "$f" -vf "fps=1.2,scale=-2:270,tile=6x1" -frames:v 1 "$O/s$i.jpg"
done
