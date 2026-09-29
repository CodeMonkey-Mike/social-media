"""Inline the shared PORTRAIT chart base (tokens/anatomy CSS + the state-cloning JS) from the vertical
vprog-loop-mini.html into a chart HTML carrying the placeholders @@BASE_CSS@@ and @@STATE_JS@@, so every
vertical chart file is standalone yet shares byte-identical tokens. usage: python _inline_vbase.py <chart.html> [...]"""
import sys
from pathlib import Path
ref = Path(__file__).with_name("vprog-loop-mini.html").read_text(encoding="utf-8")
css = ref.split("<style>\n", 1)[1].split("/* ==== CHART-SPECIFIC ==== */", 1)[0]
js = ref.split("const tpl=document.getElementById('tpl');", 1)[1].split("</script>", 1)[0]
js = "const tpl=document.getElementById('tpl');" + js
for a in sys.argv[1:]:
    p = Path(a); s = p.read_text(encoding="utf-8")
    s = s.replace("@@BASE_CSS@@", css).replace("@@STATE_JS@@", js)
    p.write_text(s, encoding="utf-8"); print("inlined", p.name)
