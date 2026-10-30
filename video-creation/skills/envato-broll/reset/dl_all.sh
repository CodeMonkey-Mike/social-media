cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while IFS=$'\t' read -r id slug url dur title; do
  if [ -f reset/dl/$id/$id-lean.mp4 ]; then echo "=== $id already lean, skip"; continue; fi
  mkdir -p reset/dl/$id
  echo "=== $id $url"
  python -u download_envato.py "$url" --dir reset/dl/$id --name $id-orig > reset/dl-$id.log 2>&1; rc=$?
  echo "download exit $rc"
  if [ $rc -eq 0 ]; then python -I reset/lean.py reset/dl/$id $id >> reset/dl-$id.log 2>&1; echo "lean exit $?"; tail -2 reset/dl-$id.log; fi
done < "${1:-reset/picks.tsv}"
echo ALLDONE
