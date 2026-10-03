cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
SRC=/c/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/golden-kitty/_envato-src
mkdir -p $SRC
python -c "import json;[print(r['br'],r['url']) for r in json.load(open('gk/picks.json',encoding='utf-8'))]" | while read br url; do
  ls $SRC/BR-$br.* >/dev/null 2>&1 && { echo "skip BR-$br" >> gk/dl.log; continue; }
  echo "== BR-$br $url" >> gk/dl.log
  python download_envato.py "$url" --dir "$SRC" --name BR-$br < /dev/null >> gk/dl.log 2>&1
  echo "exit $? BR-$br" >> gk/dl.log
done
echo DLDONE2 >> gk/dl.log
