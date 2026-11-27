"""Chart data for the longest-bear animated charts (two-legs, two-legs-2, longest-clock).

Run:  python -W ignore build_chart_data.py   (after re-pulling research/btc-daily-yahoo.json AND re-running
      research/btc_stats.py on the recording day, script.md flow step 7)

Reads  ../../research/btc-daily-yahoo.json  (Yahoo BTC-USD daily closes, the only price source)
       ../../research/btc-stats.json        (what RESEARCH.md is written from: every figure is cross-checked)
Writes btc-closes.json  (the data: one row per day, 2025-10-06 to the last row, close + both averages, the weekly points
                         the 50-week line is drawn through, the story facts, the label strings, and longest-clock's bars)
       btc-closes.js    (the same JSON as `window.BTC_CHART = ...;`: the pages are opened from file://, where a page
                         cannot fetch() a JSON file, so they load this twin with a <script> tag)
Then touches longest-clock.html, two-legs.html and two-legs-2.html: cover_runs.py re-renders a chart clip only when
its page is newer than the clip, and the pages read this data through <script> tags.

The averages are computed EXACTLY as research/btc_stats.py does: 200-day = simple average of the last 200 daily rows,
50-week = simple average of the last 50 closes 7 rows apart (the same weekday). The story's dates are pinned below (as
written in RESEARCH.md sections 2 and 3); every one is re-proven against the data, and every printed figure must agree
with btc-stats.json, or nothing is written.
"""
import datetime
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
RESEARCH = HERE.parent.parent / "research"
D = datetime.date.fromisoformat

START = "2025-10-06"          # the top: the chart's first day
ANCHORS = {                   # RESEARCH.md section 2 (first leg) and section 3 (the two-bear-markets reading)
    "top": "2025-10-06",
    "leg1_bottom": "2026-06-30",
    "rally_top": "2026-09-21",
    "above_from": "2026-09-18",
    "above_to": "2026-11-07",
    "lost_both": "2026-11-12",
}
MONTHS = "JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split()

rows = sorted(json.load(open(RESEARCH / "btc-daily-yahoo.json")), key=lambda r: r["date"])
stats = json.load(open(RESEARCH / "btc-stats.json"))
cl = [r["close"] for r in rows]
dt = [D(r["date"]) for r in rows]
ix = {r["date"]: i for i, r in enumerate(rows)}
last = len(rows) - 1
fails, warns = [], []


def sma(n, i):
    return sum(cl[i - n + 1:i + 1]) / n


def w50(i):
    return sum(cl[i - 7 * k] for k in range(50)) / 50


def above_both(i):
    return cl[i] > sma(200, i) and cl[i] > w50(i)


def pct(a, b):
    return round((a / b - 1) * 100, 1)


def say_date(d):
    return f"{MONTHS[d.month - 1]} {d.day}, {d.year}"


for k, d in ANCHORS.items():
    if d not in ix:
        sys.exit(f"FAIL the anchor {k} = {d} is not a row of btc-daily-yahoo.json")
i0 = ix[START]
win = range(i0, last + 1)
gaps = [str(dt[i - 1] + datetime.timedelta(days=1)) for i in range(i0 - 400, last + 1) if (dt[i] - dt[i - 1]).days != 1]
if gaps:
    warns.append(f"btc-daily-yahoo.json has no row for {', '.join(gaps)}: the 50-week average steps 7 ROWS, as "
                 "btc_stats.py does, so the rows after a gap mix weekdays (re-pull the file to fill it)")

# ---- the story, re-proven on the data -------------------------------------------------------------------------------
a = {k: ix[v] for k, v in ANCHORS.items()}
if cl[a["top"]] != max(cl[i] for i in win):
    fails.append("the top is not the highest close of the chart")
if cl[a["leg1_bottom"]] != min(cl[i] for i in range(a["top"], a["rally_top"] + 1)):
    fails.append("the leg-1 bottom is not the lowest close between the top and the rally top")
if cl[a["rally_top"]] != max(cl[i] for i in range(a["leg1_bottom"], last + 1)):
    fails.append("the rally top is not the highest close since the leg-1 bottom")
streak = range(a["above_from"], a["above_to"] + 1)
if not all(above_both(i) for i in streak) or above_both(a["above_from"] - 1) or above_both(a["above_to"] + 1):
    fails.append("the close is not above both averages exactly from above_from to above_to")
lost = next((i for i in range(a["above_to"] + 1, last + 1) if cl[i] < sma(200, i) and cl[i] < w50(i)), None)
if lost != a["lost_both"]:
    fails.append(f"the first close under BOTH averages after the streak is {dt[lost] if lost else None}, not {ANCHORS['lost_both']}")
sundays = [i for i in win if dt[i].weekday() == 6]
conf = next(((p, q) for p, q in zip(sundays, sundays[1:]) if cl[p] < w50(p) and cl[q] < w50(q)), None)
if not conf:
    fails.append("no two Sunday (weekly) closes in a row under the 50-week average")

f = {
    "top": {"date": ANCHORS["top"], "close": round(cl[a["top"]])},
    "confirm": [{"date": str(dt[i]), "close": round(cl[i]), "w50": round(w50(i))} for i in (conf or ())],
    "leg1": {"date": ANCHORS["leg1_bottom"], "close": round(cl[a["leg1_bottom"]]),
             "days": (dt[a["leg1_bottom"]] - dt[a["top"]]).days, "pct": pct(cl[a["leg1_bottom"]], cl[a["top"]])},
    "rally": {"date": ANCHORS["rally_top"], "close": round(cl[a["rally_top"]]),
              "pct": pct(cl[a["rally_top"]], cl[a["leg1_bottom"]])},
    "above": {"from": ANCHORS["above_from"], "to": ANCHORS["above_to"], "days": len(streak)},
    "lost_both": ANCHORS["lost_both"],
    "now": {"date": str(dt[last]), "close": round(cl[last]), "days_since_top": (dt[last] - dt[a["top"]]).days,
            "pct_from_rally_top": pct(cl[last], cl[a["rally_top"]]),
            "weeks_since_lost_both": round((dt[last] - dt[a["lost_both"]]).days / 7),
            "sma200": round(sma(200, last)), "w50": round(w50(last))},
}

# ---- every figure against btc-stats.json (RESEARCH.md is written from it) --------------------------------------------
b = next(x for x in stats["bears"] if x["name"] == "2025-26")
n, r = stats["now"], stats["rally_top"]
for label, mine, theirs in [
    ("top date", f["top"]["date"], b["peak_date"]), ("top close", f["top"]["close"], b["peak_close"]),
    ("leg-1 bottom date", f["leg1"]["date"], b["trough_date"]), ("leg-1 bottom close", f["leg1"]["close"], b["trough_close"]),
    ("leg-1 days", f["leg1"]["days"], b["peak_to_trough_days"]), ("leg-1 fall %", f["leg1"]["pct"], b["drawdown_pct"]),
    ("rally top date", f["rally"]["date"], r["date"]), ("rally top close", f["rally"]["close"], r["close"]),
    ("rally %", f["rally"]["pct"], r["gain_from_bottom_pct"]), ("from the rally top %", f["now"]["pct_from_rally_top"], r["drop_since_pct"]),
    ("above both from", f["above"]["from"], stats["first_above_both_stable"]), ("above both to", f["above"]["to"], stats["last_above_both"]),
    ("read date", f["now"]["date"], n["as_of"]), ("last close", f["now"]["close"], n["close"]),
    ("days since the top", f["now"]["days_since_top"], n["days_since_top"]),
    ("200-day now", f["now"]["sma200"], n["sma200d"]), ("50-week now", f["now"]["w50"], n["sma50w"]),
]:
    if mine != theirs:
        fails.append(f"{label}: the data gives {mine}, btc-stats.json says {theirs} (re-run research/btc_stats.py, "
                     "update RESEARCH.md, then this script)")

# ---- what the cards print: the sourced figure, rounded as spoken (RESEARCH.md section 3c) -----------------------------
labels = {
    "top_date": say_date(dt[a["top"]]),
    "leg1_days": f"{f['leg1']['days']} DAYS",
    "leg1_pct": f"-{round(-f['leg1']['pct'])}%",
    "rally_pct": f"+{round(f['rally']['pct'])}%",
    "rally_to": f"{f['rally']['close'] // 1000}K",      # 86,603 -> 86K: RESEARCH.md 3c "around 86 thousand", never 87K
    "above_days": f"{f['above']['days']} DAYS",
    "leg2_age": f"{f['now']['weeks_since_lost_both']} WEEKS OLD",
    "leg2_pct": f"-{round(-f['now']['pct_from_rally_top'])}%",
    "days_since_top": str(f["now"]["days_since_top"]),
    "read_date": say_date(dt[last]),
}

# ---- the 50-week line as DRAWN: one point per weekly (Sunday) close, the same figure btc_stats.py gives that day ----
# (drawn daily, the 50-week average cycles through a different weekday's closes every day: a 7-day sawtooth). The read
# date's own value (the one RESEARCH.md quotes as "now") closes the line. The drawn lines must agree with the 51 days.
first_sun = next(i for i in range(i0 - 6, i0 + 1) if dt[i].weekday() == 6)
weekly = [[str(dt[i]), round(w50(i), 2)] for i in range(first_sun, last + 1) if dt[i].weekday() == 6]
if dt[last].weekday() != 6:
    weekly.append([str(dt[last]), round(w50(last), 2)])
wk_d = [(D(x[0]) - D(START)).days for x in weekly]


def w50_drawn(i):
    d = (dt[i] - D(START)).days
    k = max(j for j in range(len(wk_d)) if wk_d[j] <= d)
    if wk_d[k] == d or k == len(wk_d) - 1:
        return weekly[k][1]
    return weekly[k][1] + (weekly[k + 1][1] - weekly[k][1]) * (d - wk_d[k]) / (wk_d[k + 1] - wk_d[k])


for i in streak:
    if not cl[i] > max(sma(200, i), w50_drawn(i)):
        warns.append(f"{dt[i]} is inside the 51 days but under a DRAWN average (the gold fill pinches there)")
for i in (a["above_from"] - 1, a["above_to"] + 1):
    if cl[i] > max(sma(200, i), w50_drawn(i)):
        warns.append(f"{dt[i]} is outside the 51 days but above both DRAWN averages")

# ---- longest-clock: the three old bear markets, peak to bottom (RESEARCH.md section 2), and NOW = days since the top ---
old = [x for x in stats["bears"] if x["name"] != "2025-26"]
if [x["name"] for x in old] != ["2013-14", "2017-18", "2021-22"]:
    fails.append(f"btc-stats.json bears are {[x['name'] for x in old]}, expected 2013-14, 2017-18, 2021-22")
clock = {"bars": [{"name": x["name"], "days": x["peak_to_trough_days"]} for x in old], "now": f["now"]["days_since_top"]}

for w in warns:
    print("WARN ", w)
for x in fails:
    print("FAIL ", x)
if fails:
    sys.exit("CHART-DATA FAIL: nothing written")

data = {
    "generated_by": "assets/charts/build_chart_data.py from research/btc-daily-yahoo.json (Yahoo BTC-USD 1d)",
    "method": "200-day = average of the last 200 daily closes; 50-week = average of the last 50 closes 7 rows apart (research/btc_stats.py); "
              "weekly50 = that 50-week figure on each weekly (Sunday) close and on the read date, the points the 50-week line is drawn through",
    "start": START, "end": str(dt[last]),
    "cols": ["date", "close", "sma200", "w50"],
    "rows": [[str(dt[i]), round(cl[i], 2), round(sma(200, i), 2), round(w50(i), 2)] for i in win],
    "weekly50": weekly,
    "facts": f, "labels": labels, "clock": clock,
}
text = json.dumps(data, separators=(",", ":"))
(HERE / "btc-closes.json").write_text(text + "\n", encoding="utf-8")
(HERE / "btc-closes.js").write_text("/* generated by build_chart_data.py: the same data as btc-closes.json, for pages opened "
                                     "from file:// (no fetch there). Do not edit. */\nwindow.BTC_CHART = " + text + ";\n",
                                     encoding="utf-8")
# the pages read this data through <script> tags: touch them, or cover_runs.py keeps a chart clip rendered from old data
for page in ("longest-clock.html", "two-legs.html", "two-legs-2.html"):
    if (HERE / page).is_file():
        (HERE / page).touch()
print(json.dumps(labels, indent=1))
print("clock", json.dumps(clock))
print(f"CHART-DATA PASS rows={len(data['rows'])} {START}..{dt[last]} weekly_confirm={[x['date'] for x in f['confirm']]} "
      f"warns={len(warns)}")
