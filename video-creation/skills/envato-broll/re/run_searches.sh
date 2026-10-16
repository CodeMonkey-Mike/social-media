#!/bin/bash
# usage: run_searches.sh <tsv of id\tquery>  (sequential, one browser at a time on envato-profile)
cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while IFS=$'\t' read -r id q; do
  [ -z "$id" ] && continue
  python search_envato.py "$q" --max 14 --out "re/results/$id.json" > /dev/null 2> "re/results/$id.log"
  n=$(python -c "import json;print(len(json.load(open('re/results/$id.json',encoding='utf-8'))))" 2>/dev/null)
  echo "$id -> ${n:-ERR} results  ($q)"
done < "$1"
