export TEMP=D:/video-work/bullish-on-kaspa/tmp TMP=D:/video-work/bullish-on-kaspa/tmp TMPDIR=D:/video-work/bullish-on-kaspa/tmp
for r in "790-830 whip" "13780-14260 wall" "15990-16310 end"; do set -- $r; python ../../scripts/render_comp.py . --mode draft --frames $1 --out "$PWD/_previews/qa/chunk-$2.mp4" 2>&1 | grep -aE "RENDER-DONE|FAIL" | cut -c1-90; done
echo CHUNKS-ALL-DONE
