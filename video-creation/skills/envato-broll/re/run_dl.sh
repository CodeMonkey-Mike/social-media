#!/bin/bash
# usage: run_dl.sh BR-1 [BR-2 ...]  sequential, ONE download at a time on envato-profile; staged OUTSIDE the project
cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
STAGE=/c/Users/mnede/AppData/Local/Temp/re-envato
mkdir -p re/dl
for id in "$@"; do
  url=$(python -c "import json;print(json.load(open('re/picks.json',encoding='utf-8'))['$id']['url'])")
  mkdir -p "$STAGE/$id"
  s=$(date +%s)
  python download_envato.py "$url" --dir "$STAGE/$id" --name "$id-src" > "re/dl/$id.json" 2> "re/dl/$id.log"
  rc=$?
  echo "$id rc=$rc $(( $(date +%s) - s ))s :: $(tail -1 re/dl/$id.log)"
  [ $rc -ne 0 ] && { echo "STOP: $id failed, read re/dl/$id.log"; break; }
  df -h /c | tail -1 | awk '{print "   disk free:",$4}'
done
