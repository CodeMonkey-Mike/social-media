"""Bitcoin bear-market measurements for longest-bear (closes from Yahoo BTC-USD daily; 2013-14 from Bitstamp).

Run: python -W ignore btc_stats.py   (reads the two JSON files beside it, writes btc-stats.json, prints the table)
"""
import datetime
import json
from pathlib import Path

HERE = Path(__file__).parent
D = datetime.date.fromisoformat
yahoo = json.load(open(HERE / "btc-daily-yahoo.json"))
bitstamp = json.load(open(HERE / "btc-daily-bitstamp-2013-2015.json"))

cl = [r["close"] for r in yahoo]
dt = [D(r["date"]) for r in yahoo]
last = len(cl) - 1


def sma(n, i):
    return sum(cl[i - n + 1:i + 1]) / n


def weekly_sma(weeks, i):
    idx = [i - 7 * k for k in range(weeks)]
    return sum(cl[j] for j in idx) / weeks if idx[-1] >= 0 else None


def window(a, b, rows=yahoo):
    return [r for r in rows if a <= r["date"] <= b]


def bear(name, peak_from, peak_to, rows, recovery_close=None):
    w = window(peak_from, peak_to, rows)
    pk = max(w, key=lambda r: r["close"])
    after = [r for r in rows if r["date"] >= pk["date"]]
    # trough = lowest close before the price next closes above the peak
    tr = None
    rec = None
    for r in after:
        if r["close"] > pk["close"] and r["date"] > pk["date"]:
            rec = r
            break
    span = [r for r in after if rec is None or r["date"] < rec["date"]]
    tr = min(span, key=lambda r: r["close"])
    out = {
        "name": name, "peak_date": pk["date"], "peak_close": round(pk["close"]),
        "trough_date": tr["date"], "trough_close": round(tr["close"]),
        "drawdown_pct": round((tr["close"] / pk["close"] - 1) * 100, 1),
        "peak_to_trough_days": (D(tr["date"]) - D(pk["date"])).days,
        "recovery_date": rec["date"] if rec else None,
        "peak_to_recovery_days": (D(rec["date"]) - D(pk["date"])).days if rec else None,
    }
    return out


res = {
    "bears": [
        bear("2013-14", "2013-11-01", "2014-02-01", bitstamp + [r for r in yahoo if r["date"] > bitstamp[-1]["date"]]),
        bear("2017-18", "2017-12-01", "2017-12-31", yahoo),
        bear("2021-22", "2021-10-15", "2021-12-01", yahoo),
        bear("2025-26", "2025-09-15", "2025-11-01", yahoo),
    ]
}
now = {
    "as_of": str(dt[last]), "close": round(cl[last]),
    "days_since_top": (dt[last] - D("2025-10-06")).days,
    "drawdown_from_top_pct": round((cl[last] / 124752.53 - 1) * 100, 1),
    "sma200d": round(sma(200, last)), "sma50w": round(weekly_sma(50, last)),
    "sma200w": round(weekly_sma(200, last)),
}
res["now"] = now
# the first bottom, intraday
b = window("2026-06-20", "2026-07-05")
res["first_bottom_lowest_intraday"] = min((r["low"], r["date"]) for r in b)
# the rally top
rt = max((r["close"], r["date"]) for r in yahoo if r["date"] >= "2026-06-30")
res["rally_top"] = {"close": round(rt[0]), "date": rt[1],
                    "gain_from_bottom_pct": round((rt[0] / 58559 - 1) * 100, 1),
                    "drop_since_pct": round((cl[last] / rt[0] - 1) * 100, 1),
                    "days_since": (dt[last] - D(rt[1])).days}
# above both averages (daily close above 200d SMA and 50-week SMA), the stretch in Sept-Nov 2026
streak = []
for i in range(len(cl)):
    if dt[i] < D("2026-06-30"):
        continue
    w50 = weekly_sma(50, i)
    streak.append((str(dt[i]), cl[i] > sma(200, i) and cl[i] > w50))
res["above_both_days"] = sum(1 for _, ok in streak if ok)
res["first_above_both_stable"] = next((d for (d, ok) in streak if ok and all(o for (dd, o) in streak if d <= dd <= "2026-09-30")), None)
res["last_above_both"] = [d for d, ok in streak if ok][-1]
res["first_close_below_both_after"] = next((d for d, ok in streak if (not ok) and d > res["last_above_both"]), None)
json.dump(res, open(HERE / "btc-stats.json", "w"), indent=1)
print(json.dumps(res, indent=1))
