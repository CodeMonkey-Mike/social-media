#!/bin/bash
cd "C:/Users/mnede/Documents/Claude/social-media"
P="video-creation/longform-edited/media/AI destroying lives/_previews/envato/vertical"
while IFS=$'\t' read -r id q; do
  [ -z "$id" ] && continue
  echo "=== $id :: $q $(date +%T)"
  timeout 150 python video-creation/skills/envato-broll/search_envato.py "$q" --portrait --max 16 --out "$P/$id.json" >/dev/null 2>"$P/$id.log"
  echo "rc=$? $(tail -1 "$P/$id.log") $(grep -i orientation "$P/$id.log")"
done < "$P/${1:-queries.tsv}"
echo ALLDONE
