cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
q=(
"7b|vertical terminal command line text scrolling dark screen"
"7c|vertical server log data scrolling monitor close up"
)
for e in "${q[@]}"; do n=${e%%|*}; t=${e#*|}
  echo "=== BR-$n: $t"
  python -u search_envato.py "$t" --portrait --max 16 --out inf-vert/r$n.json > inf-vert/s$n.log 2>&1; echo "exit $?"
done
echo ALLDONE
