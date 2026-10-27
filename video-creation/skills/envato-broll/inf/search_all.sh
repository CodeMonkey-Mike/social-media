cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
q=(
"1|data center server aisle dolly blue lights"
"2|server rack blinking lights dark"
"3|typing prompt chatbot laptop close up"
"4|graphics card fans spinning close up"
"5|RAM memory module macro circuit board"
"6|server room rack push in lights"
"7|scrolling server log terminal screen"
"8|video editing timeline screen"
"9|abstract neural network data streams glowing lines"
"10|silicon wafer chips macro clean room"
)
for e in "${q[@]}"; do n=${e%%|*}; t=${e#*|}
  echo "=== BR-$n: $t"
  python -u search_envato.py "$t" --max 16 --out inf/r$n.json > inf/s$n.log 2>&1; echo "exit $?"
done
echo ALLDONE
