cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while IFS=$'\t' read -r id slug url dur title; do
  u=${url%%\?*}; mkdir -p inf/dl/$id
  echo "=== $id $u"
  python -u download_envato.py "$u" --dir inf/dl/$id --name $id-orig > inf/dl-$id.log 2>&1; echo "exit $?"
done < inf/picks.tsv
echo ALLDONE
