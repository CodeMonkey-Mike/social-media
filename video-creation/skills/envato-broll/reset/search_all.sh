cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while IFS=$'\t' read -r id q; do
  echo "=== $id $q"
  python -u search_envato.py "$q" --max 12 --out reset/r/$id.json > reset/r/$id.log 2>&1; echo "exit $?"
done < "${1:-reset/queries.tsv}"
echo ALLDONE
