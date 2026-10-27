cd /c/Users/mnede/Documents/Claude/social-media
W=video-creation/skills/envato-broll/evals
D=video-creation/longform-edited/media/evals/raw/envato
while IFS=$'\t' read -r id f i slug; do
  url=$(python -c "import json;print(json.load(open('$W/r-br$f.json',encoding='utf-8'))[$i]['url'])")
  if ls $D/BR-$id-orig.* >/dev/null 2>&1; then echo "BR-$id exists, skip"; continue; fi
  echo "== BR-$id $(date +%T)"
  python video-creation/skills/envato-broll/download_envato.py "$url" --dir "$D" --name "BR-$id-orig" > $W/dl-br$id.out 2> $W/dl-br$id.log
  echo "exit $? $(date +%T)"; cat $W/dl-br$id.out
done < $W/picks.tsv
echo ALLDONE
