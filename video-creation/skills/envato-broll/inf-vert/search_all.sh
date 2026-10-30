cd /c/Users/mnede/Documents/Claude/social-media/video-creation/skills/envato-broll
q=(
"1|vertical data center server aisle blue lights"
"2|vertical server rack blinking lights"
"3|vertical typing laptop keyboard close up dark"
"4|vertical graphics card fans spinning"
"5|vertical RAM memory circuit board macro"
"6|vertical server room rack lights"
"7|vertical code scrolling screen terminal"
"8|vertical video editing timeline screen"
"9|vertical abstract data streams glowing lines"
"10|vertical silicon wafer chips macro"
)
for e in "${q[@]}"; do n=${e%%|*}; t=${e#*|}
  echo "=== BR-$n: $t"
  python -u search_envato.py "$t" --portrait --max 16 --out inf-vert/r$n.json > inf-vert/s$n.log 2>&1; echo "exit $?"
done
echo ALLDONE
