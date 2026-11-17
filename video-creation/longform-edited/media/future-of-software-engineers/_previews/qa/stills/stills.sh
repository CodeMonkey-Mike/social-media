#!/bin/bash
# usage: stills.sh <frame> [<frame> ...]   renders QA stills from the prebuilt bundle, 4 at a time
cd /c/Users/mnede/Documents/Claude/social-media/video-creation/remotion
B="$TEMP/remotion-fose-qa-bundle"
OUT=/c/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/future-of-software-engineers/_previews/qa/stills
n=0
for f in "$@"; do
  ( npx remotion still "$B" FutureOfSoftwareEngineers "$OUT/f$(printf %05d $f).png" --frame=$f --log=error >"$OUT/f$f.log" 2>&1 && rm -f "$OUT/f$f.log" || echo "FAIL frame $f" ) &
  n=$((n+1)); if [ $((n % 4)) -eq 0 ]; then wait; fi
done
wait
