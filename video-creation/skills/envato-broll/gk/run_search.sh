cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while IFS=$'\t' read -r n q; do
  [ -s gk/s$n.json ] && continue
  echo "== BR-$n: $q"
  python search_envato.py "$q" --max 10 --out gk/s$n.json > /dev/null 2>> gk/search.log
  echo "exit $? BR-$n" >> gk/search.log
done < gk/queries.tsv
echo ALLDONE >> gk/search.log
