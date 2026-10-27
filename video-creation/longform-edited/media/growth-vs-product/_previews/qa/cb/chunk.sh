#!/bin/bash
# chunk.sh NAME A B [EVERY]  -> renders frames A-B to qa/NAME.mp4 and a contact sheet qa/cb/NAME-sheet.png
set -e
QA=/c/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/growth-vs-product/_previews/qa
N=$1; A=$2; B=$3; E=${4:-6}
cd /c/Users/mnede/Documents/Claude/social-media/video-creation/remotion
npx remotion render build-gvp GrowthVsProduct "$QA/$N.mp4" --frames=$A-$B --video-bitrate=2000k --concurrency=4 --offthreadvideo-cache-size-in-bytes=1073741824 --timeout=120000 --log=error 2>&1 | grep -iv "montserrat" | grep -v "^\s*$" || true
rm -rf "$QA/cb/fr-$N"; mkdir -p "$QA/cb/fr-$N"
ffmpeg -v error -i "$QA/$N.mp4" -vf "select=not(mod(n\,$E)),scale=640:-1" -vsync 0 -start_number $A "$QA/cb/fr-$N/%05d.jpg"
# rename to absolute frame numbers
cd "$QA/cb/fr-$N"; i=0; for f in $(ls | sort); do mv $f $(printf "x%05d.jpg" $((A + i*E))); i=$((i+1)); done
cd "$QA/cb"; python sheet.py "fr-$N/*.jpg" "$N-sheet.png"
echo "done $N"
