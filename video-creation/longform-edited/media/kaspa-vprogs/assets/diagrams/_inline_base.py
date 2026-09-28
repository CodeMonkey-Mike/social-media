"""Inline the shared chart base (tokens/anatomy CSS + the state-cloning JS) from vprog-loop-mini.html
into a chart HTML that carries the placeholders @@BASE_CSS@@ and @@STATE_JS@@, so every chart file is
standalone yet shares byte-identical tokens. usage: python _inline_base.py <chart.html> [...]"""
import re, sys
from pathlib import Path
ref = Path(__file__).with_name("vprog-loop-mini.html").read_text(encoding="utf-8")
css = ref.split("<style>\n", 1)[1].split("/* ==== CHART-SPECIFIC ==== */", 1)[0]
js = ref.split("const tpl=document.getElementById('tpl');", 1)[1].split("</script>", 1)[0]
js = "const tpl=document.getElementById('tpl');" + js
for a in sys.argv[1:]:
    p = Path(a); s = p.read_text(encoding="utf-8")
    s = s.replace("@@BASE_CSS@@", css).replace("@@STATE_JS@@", js)
    p.write_text(s, encoding="utf-8"); print("inlined", p.name)
