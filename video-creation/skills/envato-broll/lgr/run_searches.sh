cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while IFS='|' read -r id q; do
  [ -f lgr/$id.json ] && continue
  timeout 300 python search_envato.py "$q" --max 12 --out lgr/$id.json > lgr/$id.log 2>&1
  echo "$id done $(tail -1 lgr/$id.log)" >> lgr/progress.txt
  (cd lgr && python -I /c/Users/mnede/Documents/Claude/lgr-tools/sheet.py $id.json prev/$id >> sheets.log 2>&1) &
done < lgr/queries.txt
wait
echo ALLDONE >> lgr/progress.txt
