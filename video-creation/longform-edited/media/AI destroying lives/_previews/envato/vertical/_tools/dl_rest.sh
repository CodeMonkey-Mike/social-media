#!/bin/bash
# Sequential, ONE attempt per item via the canonical download_envato.py; never relaunched. Logs per item in orig/.
cd "C:/Users/mnede/Documents/Claude/social-media"
V="video-creation/longform-edited/media/AI destroying lives/_previews/envato/vertical"
python -I - "$V/picks.json" BR-20 BR-21 BR-22 BR-23 BR-24 > "$V/orig/dl-list.tsv" <<'PY'
import json,sys
p={x["id"]:x for x in json.load(open(sys.argv[1],encoding="utf-8"))}
for i in sys.argv[2:]: print(f'{i}\t{p[i]["slug"]}\t{p[i]["url"]}')
PY
while IFS=$'\t' read -r id slug url; do
  echo "=== $id $slug $(date +%T)"
  timeout 1500 python video-creation/skills/envato-broll/download_envato.py "$url" --dir "$V/orig" --name "$id-$slug" > "$V/orig/$id.out" 2> "$V/orig/$id.log"
  echo "rc=$? $(date +%T)"; tail -2 "$V/orig/$id.out"
done < "$V/orig/dl-list.tsv"
echo DL-ALL-DONE
