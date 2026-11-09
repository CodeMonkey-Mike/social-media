cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
while read -r bid rest; do
  url=$(echo "$rest" | grep -o 'https://app.envato.com[^ ]*' | sed 's/?.*//')
  ls "$TEMP/envato-staging/lgr/$bid".* >/dev/null 2>&1 && { echo "$bid skip (exists)" >> lgr/dl-progress.txt; continue; }
  echo "$bid start $(date +%T) $url" >> lgr/dl-progress.txt
  timeout 1500 python -u download_envato.py "$url" --dir "$TEMP/envato-staging/lgr" --name "$bid" > lgr/dl-$bid.log 2>&1
  echo "$bid exit=$? $(date +%T) $(tail -c 300 lgr/dl-$bid.log | tr '\n' ' ')" >> lgr/dl-progress.txt
done < lgr/picks-urls.txt
echo DLDONE >> lgr/dl-progress.txt
