#!/usr/bin/env python
"""
Builds same-qt-opposite-result.html: ONE slide for one browser tab (Mike, 2026-11-06: "I just want to have a tab open to a single
slide. I don't want a slide show with many slides"). Style: the yt-presentation skill's look. No scrolling, no animation to wait
for. Every number comes from FRED at build time.
"""
import sys
from datetime import date, timedelta
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2] / "scripts"))
import market_data as md  # noqa: E402

for sid in ("WSHOSHO", "TOTBKCR"):
    md.SERIES.setdefault(sid, ("fred", sid, sid))
FED, CREDIT, M2 = md.load("WSHOSHO"), md.load("TOTBKCR"), md.load("M2SL")
SERIES = {"fed": (FED, 1000), "credit": (CREDIT, 1), "m2": (M2, 1)}
READ = "Nov 6, 2026"


def bn(key, day):
    rows, unit = SERIES[key]
    return [r for r in rows if r[0] <= day][-1][1] / unit


def money(v):
    return f"{'+' if v >= 0 else '-'}${abs(v):,.0f}B"


WINDOWS = [("2017-10-04", "2019-08-28", "Oct 2017 to Aug 2019"), ("2022-06-01", "2023-10-31", "Jun 2022 to Oct 2023"), ("2023-10-31", "2025-11-26", "Oct 2023 to Nov 2025")]
rows_html = ""
for i, (a, b, label) in enumerate(WINDOWS):
    cells = ""
    for key in ("fed", "credit", "m2"):
        v = bn(key, b) - bn(key, a)
        cells += f'<td class="num {"pos" if v >= 0 else "neg"}">{money(v)}</td>'
    rows_html += f'<tr{" class=hl" if i else ""}><td>{label}</td>{cells}</tr>'
    print(label, cells)
if M2[-1][1] != max(v for _, v in M2):
    raise SystemExit("M2 is not at a record, so the record line is wrong")
last = date.fromisoformat(M2[-1][0])
then = [r for r in M2 if r[0] <= (last - timedelta(days=365)).isoformat()][-1][1]
yoy = (M2[-1][1] / then - 1) * 100
print(f"M2 {M2[-1]} yoy {yoy:.1f}")

HTML = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Same QT, Opposite Result</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@600&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
:root{{--bg:#0a0c10;--card:#12151c;--green:#00e68a;--cyan:#00c2ff;--gold:#ffd700;--red:#ff4060;--text:#e8eaf0;--muted:#8892a4;--border:#1e2330}}
html{{font-size:min(2.1vh,1.19vw);background:var(--bg)}}
*{{box-sizing:border-box}}
body{{margin:0;height:100vh;overflow:hidden;background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;justify-content:center;padding:3rem 4.5rem;position:relative}}
body>*{{position:relative;z-index:1}}
.orb{{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(100px);opacity:.22;background:var(--cyan);bottom:-240px;left:-140px;z-index:0}}
.label{{font-size:.8rem;text-transform:uppercase;letter-spacing:.18em;color:#6b7588;font-weight:500}}
h1{{font-family:'Playfair Display',serif;font-weight:900;font-variant-numeric:lining-nums;font-size:3.9rem;line-height:1.1;margin:.5rem 0 0}}
.divider{{width:60px;height:3px;background:linear-gradient(90deg,var(--green),var(--cyan));border-radius:2px;margin:1.1rem 0 1.5rem}}
.card{{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:.6rem 1.2rem .4rem;position:relative;overflow:hidden}}
.card::before{{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),transparent)}}
table{{border-collapse:collapse;width:100%}}
th{{font-size:.78rem;text-transform:uppercase;letter-spacing:.14em;color:#6b7588;font-weight:500;text-align:right;padding:.8rem 1.2rem;border-bottom:1px solid var(--border)}}
th:first-child,td:first-child{{text-align:left}}
td{{padding:1.2rem 1.2rem;border-bottom:1px solid var(--border);font-size:1.25rem}}
td.num{{text-align:right;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:1.65rem}}
.pos{{color:var(--green)}}.neg{{color:var(--red)}}
tr.hl td{{background:rgba(255,215,0,.035)}}
.box{{background:linear-gradient(135deg,rgba(0,230,138,.08),rgba(0,194,255,.06));border:1px solid rgba(0,230,138,.2);border-radius:12px;padding:1.05rem 1.5rem;font-size:1.25rem;line-height:1.5;margin-top:1.4rem}}
.mono{{font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--green)}}
.source{{font-size:.74rem;color:#5d6678;margin-top:.9rem}}
</style></head><body>
<div class="orb"></div>
<div class="label">The Fed vs the money supply</div>
<h1>Same QT. Opposite Result.</h1><div class="divider"></div>
<div class="card"><table><thead><tr><th>Period of QT</th><th>Fed securities</th><th>Bank credit</th><th>M2</th></tr></thead><tbody>{rows_html}</tbody></table></div>
<div class="box">The last two rows have almost the same amount of QT, yet M2 went opposite ways. What changed was bank credit. M2 is now at a record <span class="mono">${M2[-1][1] / 1000:.1f}T</span>, up <span class="mono">{yoy:.1f}%</span> in a year.</div>
<div class="source">Not a full accounting: government deficits and rate hikes move M2 too. Source: FRED (WSHOSHO, TOTBKCR, M2SL), read {READ}.</div>
</body></html>
"""
if "—" in HTML:
    raise SystemExit("em dash on the slide")
out = HERE / "same-qt-opposite-result.html"
out.write_text(HTML, encoding="utf-8")
print("WROTE", out)
