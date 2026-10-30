cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while IFS=$'\t' read -r id slug url dur title; do
  mkdir -p inf-vert/dl/$id
  echo "=== $id $url"
  python -u download_envato.py "$url" --dir inf-vert/dl/$id --name $id-orig > inf-vert/dl-$id.log 2>&1; echo "exit $?"
done < inf-vert/picks.tsv
echo ALLDONE
