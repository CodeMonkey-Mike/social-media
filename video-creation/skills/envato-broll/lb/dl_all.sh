cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while IFS=$'\t' read -r id slug url dur title; do
  if [ -f lb/dl/$id/$id-lean.mp4 ]; then echo "=== $id already lean, skip"; continue; fi
  mkdir -p lb/dl/$id
  echo "=== $id $url"
  python -u download_envato.py "$url" --dir lb/dl/$id --name $id-orig > lb/dl-$id.log 2>&1; rc=$?
  echo "download exit $rc"
  if [ $rc -eq 0 ]; then python -I lb/tools/lean.py lb/dl/$id $id >> lb/dl-$id.log 2>&1; echo "lean exit $?"; tail -2 lb/dl-$id.log; fi
done < "${1:-lb/picks.tsv}"
echo ALLDONE
