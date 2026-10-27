cd /c/Users/mnede/Documents/Claude/social-media
W=video-creation/skills/envato-broll/evals
while IFS=$'\t' read -r n q; do
  [ "$n" = "1" ] && continue
  echo "== BR-$n: $q"
  python video-creation/skills/envato-broll/search_envato.py "$q" --max 16 --out $W/r-br$n.json >/dev/null 2>$W/r-br$n.log; echo "exit $?"
done < $W/queries.tsv
echo ALLDONE
