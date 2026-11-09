#!/usr/bin/env python
"""
market_data.py - the longform-discussion track's daily market series, pulled from primary data and cached as CSV.

Every number in circumstances.json is computed from these files, never typed from memory or copied from an
article (a claim made in someone else's video gets CHECKED against them first).

Sources:
  yahoo: the Yahoo Finance chart API (index and futures closes, BTC-USD from 2014-09-17)
  fred:  the St. Louis Fed CSV endpoint (Fed target rate, M2, yields, Brent spot, unemployment)

Usage:
  python market_data.py                  refresh every series
  python market_data.py SPX BTC          refresh only these
  python market_data.py --list           print the registry + what is cached

Import: from market_data import load, SERIES   (load refreshes a series when its cache is older than max_age_h)
Machine line per series: DATA <id> rows=<n> first=<date> last=<date> value=<last> | DATA-FAIL <id> <why>
Exit: 0 = every requested series refreshed, 1 = at least one failed (a stale cache is reported, never used silently).
"""
import argparse
import csv
import json
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
CACHE = HERE.parent / "circumstances" / "data"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}
EPOCH = datetime(1970, 1, 1, tzinfo=timezone.utc)

SERIES = {
    # id: (source, symbol, description)
    "SPX": ("yahoo", "^GSPC", "S&P 500 close"),
    "NDQ": ("yahoo", "^IXIC", "Nasdaq Composite close"),
    "NDX": ("yahoo", "^NDX", "Nasdaq 100 close"),
    "VIX": ("yahoo", "^VIX", "CBOE VIX close"),
    "BTC": ("yahoo", "BTC-USD", "Bitcoin close (UTC day), from 2014-09-17"),
    "TAO": ("yahoo", "TAO22974-USD", "Bittensor close (UTC day)"),
    "QNT": ("yahoo", "QNT-USD", "Quant close (UTC day)"),
    "KAS": ("yahoo", "KAS-USD", "Kaspa close (UTC day)"),
    "WTI": ("yahoo", "CL=F", "WTI crude front-month close"),
    "BRENT": ("yahoo", "BZ=F", "Brent crude front-month close"),
    "GOLD": ("yahoo", "GC=F", "Gold front-month close"),
    "DXY": ("yahoo", "DX-Y.NYB", "US Dollar Index close"),
    "FEDUP": ("fred", "DFEDTARU", "Fed funds target range, upper bound (from 2008-12)"),
    "M2": ("fred", "WM2NS", "US M2, weekly, not seasonally adjusted: noisy, quote M2SL instead"),
    "M2SL": ("fred", "M2SL", "US M2, monthly, seasonally adjusted"),
    "T10": ("fred", "DGS10", "10-year Treasury yield"),
    "T10Y2Y": ("fred", "T10Y2Y", "10-year minus 2-year Treasury spread"),
    "UNRATE": ("fred", "UNRATE", "US unemployment rate, monthly"),
}


def _get(url: str, timeout: int = 45, headers=None) -> bytes:
    req = urllib.request.Request(url, headers=headers or UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def _pull_yahoo(symbol: str):
    """Whole history, one close per exchange-local date."""
    now = int(time.time()) + 86400
    url = ("https://query1.finance.yahoo.com/v8/finance/chart/" + urllib.parse.quote(symbol, safe="")
           + f"?period1=-1325635200&period2={now}&interval=1d&includePrePost=false")
    res = json.loads(_get(url))["chart"]["result"][0]
    offset = res["meta"].get("gmtoffset", 0)
    closes = res["indicators"]["quote"][0]["close"]
    rows = []
    for ts, c in zip(res["timestamp"], closes):
        if c is None:
            continue
        # not datetime.fromtimestamp: Windows raises OSError 22 on a pre-1970 timestamp (the S&P history starts in 1927)
        day = (EPOCH + timedelta(seconds=ts + offset)).strftime("%Y-%m-%d")
        rows.append((day, round(float(c), 4)))
    # a re-stated partial bar can repeat a date: the last print wins
    return sorted(dict(rows).items())


def _pull_fred(symbol: str):
    # FRED drops the connection on a browser User-Agent and answers a plain client (measured 2026-11-05)
    text = _get(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={symbol}", headers={"User-Agent": "curl/8.0"}).decode("utf-8")
    rows = []
    for row in list(csv.reader(text.splitlines()))[1:]:
        if len(row) >= 2 and row[1] not in ("", "."):
            rows.append((row[0], float(row[1])))
    return rows


def refresh(sid: str):
    source, symbol, _ = SERIES[sid]
    rows = _pull_yahoo(symbol) if source == "yahoo" else _pull_fred(symbol)
    if not rows:
        raise RuntimeError("the source returned no rows")
    CACHE.mkdir(parents=True, exist_ok=True)
    with (CACHE / f"{sid}.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["date", "value"])
        w.writerows(rows)
    return rows


def load(sid: str, max_age_h: float = 6.0):
    """[(YYYY-MM-DD, float), ...] ascending. Refreshes a stale cache; a failed refresh with an old cache RAISES."""
    p = CACHE / f"{sid}.csv"
    fresh = p.is_file() and (time.time() - p.stat().st_mtime) < max_age_h * 3600
    if fresh:
        with p.open(encoding="utf-8") as f:
            return [(r["date"], float(r["value"])) for r in csv.DictReader(f)]
    return refresh(sid)


def on_or_before(rows, day: str):
    """The last (date, value) at or before day, or None."""
    found = None
    for d, v in rows:
        if d > day:
            break
        found = (d, v)
    return found


def nth_after(rows, day: str, n: int = 1):
    """The nth session strictly after day, or None."""
    later = [(d, v) for d, v in rows if d > day]
    return later[n - 1] if len(later) >= n else None


def add_days(day: str, n: int) -> str:
    return (datetime.strptime(day, "%Y-%m-%d") + timedelta(days=n)).strftime("%Y-%m-%d")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*", help="series ids (default: all)")
    ap.add_argument("--list", action="store_true")
    a = ap.parse_args()
    if a.list:
        for sid, (src, sym, desc) in SERIES.items():
            p = CACHE / f"{sid}.csv"
            age = f"cached {(time.time() - p.stat().st_mtime) / 3600:.1f} h ago" if p.is_file() else "not cached"
            print(f"{sid:8} {src:6} {sym:10} {desc} [{age}]")
        return 0
    bad = 0
    for sid in a.ids or SERIES:
        if sid not in SERIES:
            print(f"DATA-FAIL {sid} unknown series")
            bad += 1
            continue
        try:
            rows = refresh(sid)
            print(f"DATA {sid} rows={len(rows)} first={rows[0][0]} last={rows[-1][0]} value={rows[-1][1]}")
        except Exception as e:  # a failed feed is reported, the run keeps going
            print(f"DATA-FAIL {sid} {type(e).__name__}: {e}")
            bad += 1
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
