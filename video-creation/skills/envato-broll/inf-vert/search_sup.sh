cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
q=(
"2b|vertical server LED lights close up bokeh dark"
"2c|vertical AI chatbot answer typing on screen close up"
"8b|vertical video editing timeline close up screen dark"
"10b|vertical microchip wafer macro close up"
"10c|vertical semiconductor chip macro rotating"
)
for e in "${q[@]}"; do n=${e%%|*}; t=${e#*|}
  echo "=== BR-$n: $t"
  python -u search_envato.py "$t" --portrait --max 16 --out inf-vert/r$n.json > inf-vert/s$n.log 2>&1; echo "exit $?"
done
echo ALLDONE
