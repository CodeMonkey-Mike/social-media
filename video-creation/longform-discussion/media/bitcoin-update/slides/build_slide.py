#!/usr/bin/env python
"""
Builds every-bear-market-since-2014.html: ONE slide for one browser tab (Mike, 2026-11-06: a single slide, never a slideshow).
Style: the yt-presentation look, as in media/2026-11-05-qnt-kaspa/slides/. No scrolling, no animation to wait for.

Every number is computed here at build time:
  history  research/btc-long/blockchain-market-price.json (blockchain.com average daily price since 2010; Yahoo starts 2014,
           too late for a 200-week SMA before 2018)
  now      Yahoo daily closes via scripts/market_data.py (the same feed as the session's other facts)
A bear market is "confirmed" on the 2nd weekly close in a row under the 50-week SMA (Mike's definition, Nov 2 2026 stream).
"Then fell" is the lowest weekly close from the confirmation until the next bull market (2 weekly closes over the 50-week).
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
SESSION = HERE.parent
sys.path.insert(0, str(HERE.parents[2] / "scripts"))
import market_data as md  # noqa: E402

READ = "Nov 13, 2026"
HISTORY = SESSION / "research" / "btc-long" / "blockchain-market-price.json"


def weekly(rows):
    """Sunday closes, the way a weekly bar closes."""
    return [(d, v) for d, v in rows if datetime.strptime(d, "%Y-%m-%d").weekday() == 6]


def sma(closes, n, i):
    return None if i + 1 < n else sum(closes[i + 1 - n:i + 1]) / n


raw = json.loads(HISTORY.read_text(encoding="utf-8"))["values"]
daily = [(datetime.fromtimestamp(v["x"], tz=timezone.utc).date().isoformat(), float(v["y"])) for v in raw if v["y"] > 0]
wk = weekly(daily)
D, C = [d for d, _ in wk], [v for _, v in wk]

events, state, below, above = [], None, 0, 0
for i in range(50, len(C)):
    if C[i] < sma(C, 50, i):
        below, above = below + 1, 0
    else:
        above, below = above + 1, 0
    if below == 2 and state != "bear":
        state = "bear"
        events.append(("bear", i))
    if above == 2 and state != "bull":
        state = "bull"
        events.append(("bull", i))

rows = []
for k, (kind, i) in enumerate(events):
    if kind != "bear" or D[i] < "2014-01-01":
        continue
    nxt = next((j for t, j in events[k + 1:] if t == "bull"), None)
    if nxt is None:
        continue   # the bear market still running is the "now" row, from Yahoo
    lo = min(range(i, nxt), key=lambda j: C[j])
    drop = (C[lo] / C[i] - 1) * 100
    s200 = sma(C, 200, i)
    if s200 is None:
        raise SystemExit(f"no 200-week SMA at {D[i]}")
    r52 = (C[i + 52] / C[i] - 1) * 100 if i + 52 < len(C) else None
    rows.append({"when": datetime.strptime(D[i], "%Y-%m-%d").strftime("%b %Y"), "above": (C[i] / s200 - 1) * 100,
                 "drop": drop, "bottom": lo == i, "bull": datetime.strptime(D[nxt], "%Y-%m-%d").strftime("%b %Y"), "r52": r52})
    print(D[i], f"above200 {rows[-1]['above']:+.0f}%", f"drop {drop:+.0f}%", "bull", D[nxt], f"52w {r52:+.0f}%" if r52 is not None else "")

# now: Yahoo, latest close against the 200-week SMA as of the last completed Sunday
y = md.load("BTC")
ywk = weekly(y)
yc = [v for _, v in ywk]
s200_now = sma(yc, 200, len(yc) - 1)
now_d, now_v = y[-1]
now_above = (now_v / s200_now - 1) * 100
print("now", now_d, round(now_v), "200w", round(s200_now), f"{now_above:+.1f}%")

closest = min(rows, key=lambda r: r["above"])
if not closest["bottom"] or any(r["above"] <= now_above for r in rows):
    raise SystemExit("the slide's claim no longer holds: re-read the table before using it")


def pct(v):
    return f"{'+' if v >= 0 else '-'}{abs(v):.0f}%"


body = ""
for r in rows:
    hl = " class=hl" if r is closest else ""
    fell = '<span class="pos">That week was the low</span>' if r["bottom"] else f'<span class="neg">{pct(r["drop"])}</span>'
    body += f'<tr{hl}><td>{r["when"]}</td><td class="num">{pct(r["above"])}</td><td class="num">{fell}</td><td class="num muted">{r["bull"]}</td></tr>'
body += (f'<tr class="now"><td>Nov 2026, if Sunday closes under</td><td class="num gold">{now_above:+.1f}%</td>'
         f'<td class="num muted">?</td><td class="num muted">?</td></tr>')

HTML = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Every Bear Market Since 2014</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@600&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
:root{{--bg:#0a0c10;--card:#12151c;--green:#00e68a;--cyan:#00c2ff;--gold:#ffd700;--red:#ff4060;--text:#e8eaf0;--muted:#8892a4;--border:#1e2330}}
html{{font-size:min(2.1vh,1.19vw);background:var(--bg)}}
*{{box-sizing:border-box}}
body{{margin:0;height:100vh;overflow:hidden;background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;justify-content:center;padding:2.6rem 4.5rem;position:relative}}
body>*{{position:relative;z-index:1}}
.orb{{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(100px);opacity:.22;background:var(--cyan);bottom:-240px;left:-140px;z-index:0}}
.label{{font-size:.8rem;text-transform:uppercase;letter-spacing:.18em;color:#6b7588;font-weight:500}}
h1{{font-family:'Playfair Display',serif;font-weight:900;font-variant-numeric:lining-nums;font-size:3.6rem;line-height:1.1;margin:.5rem 0 0}}
.divider{{width:60px;height:3px;background:linear-gradient(90deg,var(--green),var(--cyan));border-radius:2px;margin:1rem 0 1.3rem}}
.card{{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:.5rem 1.2rem 1rem;position:relative;overflow:hidden}}
.card::before{{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),transparent)}}
table{{border-collapse:collapse;width:100%}}
th{{font-size:.78rem;text-transform:uppercase;letter-spacing:.14em;color:#6b7588;font-weight:500;text-align:right;padding:.7rem 1.2rem;border-bottom:1px solid var(--border)}}
th:first-child,td:first-child{{text-align:left}}
td{{padding:.78rem 1.2rem;border-bottom:1px solid var(--border);font-size:1.25rem}}
td.num{{text-align:right;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:1.45rem}}
.pos{{color:var(--green)}}.neg{{color:var(--red)}}.gold{{color:var(--gold)}}.muted{{color:var(--muted)}}
tr.hl td{{background:rgba(0,230,138,.06)}}
tr.now td{{background:rgba(255,215,0,.06);border-bottom:none;font-weight:700}}
.box{{background:linear-gradient(135deg,rgba(0,230,138,.08),rgba(0,194,255,.06));border:1px solid rgba(0,230,138,.2);border-radius:12px;padding:1rem 1.5rem;font-size:1.22rem;line-height:1.5;margin-top:1.2rem}}
.mono{{font-family:'JetBrains Mono',monospace;font-weight:600;color:var(--green)}}
.source{{font-size:.74rem;color:#5d6678;margin-top:.8rem}}
</style></head><body>
<div class="orb"></div>
<div class="label">Bitcoin bear markets and the 200-week SMA</div>
<h1>Every Bear Market Since 2014</h1><div class="divider"></div>
<div class="card"><table><thead><tr><th>Bear market confirmed</th><th>Above the 200-week</th><th>Then fell</th><th>Bull market again</th></tr></thead><tbody>{body}</tbody></table></div>
<div class="box">Every one started far above the 200-week and had to fall to get there. The closest, {closest["when"]}, started <span class="mono">{pct(closest["above"])}</span> above it, and that week was the bottom: <span class="mono">{pct(closest["r52"])}</span> a year later. This one is starting right on it.</div>
<div class="source">Confirmed = the 2nd weekly close in a row under the 50-week SMA. Then fell = the lowest weekly close before the next bull market. History: blockchain.com average daily price, Sunday closes. Nov 2026: Yahoo close {datetime.strptime(now_d, "%Y-%m-%d").strftime("%b %d")} against the 200-week SMA. Read {READ}.</div>
</body></html>
"""
if "—" in HTML:
    raise SystemExit("em dash on the slide")
out = HERE / "every-bear-market-since-2014.html"
out.write_text(HTML, encoding="utf-8")
print("WROTE", out)
