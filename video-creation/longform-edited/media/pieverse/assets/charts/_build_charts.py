"""pieverse chart-builder driver: geometry for the two ANIMATED charts + the state stills for C1, C2, C3.

    python _build_charts.py            # geometry -> C2/C3.geometry.json (+ inlined into C2.html / C3.html), then shoot all
    python _build_charts.py --shoot    # shoot only (HTML unchanged)
    python _build_charts.py --geo      # geometry only

WHY a geometry file: the PNG stills here are the DESIGN SPEC; the comp animates C2 / C3 for real (useCurrentFrame).
Both read the SAME `<id>.geometry.json` (plot box, scales, every plotted point already in px, marker and label
anchors), so the animated component is pixel-identical to the approved stills and no number is re-typed.

Every plotted value comes from DATA.md's record-day files, read here and never edited:
  C2: research/coingecko-market-chart-daily-merged-2026-11-14.json  (daily 00:00 UTC prints + the ATL, ATH and the
      14:15 UTC recording-time print 1.7764 it carries)
  C3: research/supply-schedule-tracker-2026-11-14.json              (the tracker's own monthly events, by bucket)
"""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent                       # assets/charts
PROJ = HERE.parents[1]                                        # media/pieverse
RES = PROJ / "research"
DIAG = PROJ / "assets" / "diagrams"


def ts(s: str) -> float:
    return datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp()


def iso(t: float) -> str:
    return datetime.fromtimestamp(t, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ------------------------------------------------------------------------------------------------ C2: price line
def c2_geometry() -> dict:
    src = json.loads((RES / "coingecko-market-chart-daily-merged-2026-11-14.json").read_text(encoding="utf-8"))
    pts = [(ts(d["time_utc"]), float(d["price_usd"]), "daily") for d in src["daily"]]
    atl = src["all_time_low"]
    ath = src["all_time_high"]
    rec = [p for p in src["recording_window_points"]["points"] if p["time_utc"] == "2026-11-14T14:15:00Z"][0]
    pts.append((ts(atl["time_utc"]), float(atl["price_usd"]), "atl"))
    pts.append((ts(ath["time_utc"]), float(ath["price_usd"]), "ath"))
    pts.append((ts(rec["time_utc"]), float(rec["price_usd"]), "recording"))
    pts.sort(key=lambda p: p[0])

    plot = {"x0": 260, "x1": 1530, "yTop": 320, "yBot": 900}
    t0, t1 = pts[0][0], pts[-1][0]
    v0, v1 = 0.0, 2.5
    X = lambda t: plot["x0"] + (t - t0) / (t1 - t0) * (plot["x1"] - plot["x0"])
    Y = lambda v: plot["yBot"] - (v - v0) / (v1 - v0) * (plot["yBot"] - plot["yTop"])
    upbit_t = ts("2026-04-20T00:00:00Z")
    upbit = [p for p in pts if p[0] == upbit_t][0]
    first = pts[0]

    def mk(p, key, label, value, date):
        return {"key": key, "t_utc": iso(p[0]), "value": p[1], "x": round(X(p[0]), 2), "y": round(Y(p[1]), 2),
                "label": label, "value_text": value, "date_text": date}

    markers = [
        mk([p for p in pts if p[2] == "atl"][0], "atl", "All-time low", "0.119", "14 Nov 2025"),
        mk(upbit, "upbit", "Upbit listing", "1.184", "20 Apr 2026"),
        mk([p for p in pts if p[2] == "ath"][0], "ath", "All-time high", "2.23", "9 Nov 2026"),
    ]
    end = mk(pts[-1], "end", "At recording", "1.78", "14 Nov 2026")
    # callout boxes (px, top-left + size) placed where the line never goes; leader from the marker dot
    mk_ = {m["key"]: m for m in markers}
    W, H = 300, 82
    callouts = {
        # ATL: in the empty sky above the winter range (the line stays under 1.0 until April); the leader runs up the
        # gutter between the y labels and the plot (x = x0 - 10) so it never crosses the launch-week spikes
        "atl":   {"x": plot["x0"] + 14, "y": round(Y(1.47)), "w": W - 14, "h": H, "gutter_x": plot["x0"] - 10},
        # Upbit: centred over its dot, leader straight up (the sky before April is empty)
        "upbit": {"x": round(mk_["upbit"]["x"] - W / 2), "y": round(mk_["upbit"]["y"] - 150 - H), "w": W, "h": H},
        # ATH: left of its dot, leader straight left (sits above the September peak)
        "ath":   {"x": round(mk_["ath"]["x"] - 36 - W), "y": round(mk_["ath"]["y"] - H / 2), "w": W, "h": H},
    }
    # clearance gate: no plotted point may fall inside a callout box (+10 px margin)
    for k, c in callouts.items():
        hits = [p for p in pts if c["x"] - 10 <= X(p[0]) <= c["x"] + c["w"] + 10 and c["y"] - 10 <= Y(p[1]) <= c["y"] + c["h"] + 10]
        if hits:
            sys.exit(f"C2 callout {k} overlaps the line at {[iso(h[0]) for h in hits][:5]}")

    months = [("2025-11-14", "NOV 2025"), ("2026-01-01", "JAN"), ("2026-03-01", "MAR"), ("2026-05-01", "MAY"),
              ("2026-07-01", "JUL"), ("2026-09-01", "SEP"), ("2026-11-01", "NOV 2026")]
    xticks = [{"x": round(X(ts(d + "T00:00:00Z")), 2), "label": lab} for d, lab in months]
    yticks = [{"y": round(Y(v), 2), "label": f"{v:.2f}" if v else "0"} for v in (0, 0.5, 1.0, 1.5, 2.0, 2.5)]
    return {
        "id": "C2", "canvas": [1920, 1080], "plot": plot,
        "domain": {"t0_utc": iso(t0), "t1_utc": iso(t1), "v0": v0, "v1": v1},
        "scale_note": "x = x0 + (t - t0)/(t1 - t0) * (x1 - x0) on UTC seconds; y = yBot - v/2.5 * (yBot - yTop)",
        "points": [{"t_utc": iso(t), "v": v, "kind": k, "x": round(X(t), 2), "y": round(Y(v), 2)} for t, v, k in pts],
        "first_point": {"x": round(X(first[0]), 2), "y": round(Y(first[1]), 2), "t_utc": iso(first[0])},
        "markers": markers, "end": end, "callouts": callouts, "xticks": xticks, "yticks": yticks,
        "states": {   # the draw head per state (inclusive): the line is every point with t <= head
            "axes": None, "start": markers[0]["t_utc"], "mid": markers[1]["t_utc"], "payoff": end["t_utc"]},
        "source": src["sources"],
    }


# ------------------------------------------------------------------------------------------------ C3: stacked unlock area
def c3_geometry() -> dict:
    src = json.loads((RES / "supply-schedule-tracker-2026-11-14.json").read_text(encoding="utf-8"))
    rows = src["rows"]
    file_order = src["bucket_order"]
    # stack order bottom -> top: the two buckets live since launch at the base, then the foundation (from month 6),
    # then team and investors ON TOP, so the layers that switch on at the 14 Nov 2026 marker ride the visible slope
    buckets = ["Community Growth", "Ecosystem & Marketing", "Foundation Reserve", "Team & Advisors", "Investors"]
    assert sorted(buckets) == sorted(file_order), file_order
    idx = [file_order.index(b) for b in buckets]
    by = [[r["by_bucket_m"][i] for i in idx] for r in rows]
    for r, b in zip(rows, by):                       # every month's buckets must sum to the tracker's own running total
        assert abs(sum(b) - r["tracker_cumulative_tokens"] / 1e6) < 0.05, (r["date"], sum(b))
    plot = {"x0": 260, "x1": 1440, "yTop": 340, "yBot": 900}
    n = len(rows) - 1                                # 36 months
    X = lambda m: plot["x0"] + m / n * (plot["x1"] - plot["x0"])
    Y = lambda v: plot["yBot"] - v / 1000.0 * (plot["yBot"] - plot["yTop"])
    # per-bucket band (lower, upper) per month, in M tokens, step-after: month m holds [x_m, x_m+1)
    bands = []
    for bi, name in enumerate(buckets):
        lo = [sum(b[:bi]) for b in by]
        hi = [sum(b[:bi + 1]) for b in by]
        bands.append({"bucket": name, "lower_m": [round(v, 3) for v in lo], "upper_m": [round(v, 3) for v in hi],
                      "lower_y": [round(Y(v), 2) for v in lo], "upper_y": [round(Y(v), 2) for v in hi]})
    totals = [r["tracker_cumulative_tokens"] / 1e6 for r in rows]
    m_marker = [i for i, r in enumerate(rows) if r["date"] == "2026-11-14"][0]
    rate_ev = rows[m_marker]["event_tokens"]
    m_rate_end = m_marker + sum(1 for r in rows[m_marker:] if r["event_tokens"] == rate_ev)   # first month after the run
    top_y = lambda xa, xb: min(Y(totals[m]) for m in range(n + 1) if X(m) <= xb and X(min(m + 1, n)) >= xa)
    # label anchors (px). Each box must clear the stack's top edge under it by >= 12 px (asserted below).
    bracket_y = round(top_y(X(m_marker), X(m_rate_end)) - 18)
    labels = {
        "launch": {"x": plot["x0"] + 14, "w": 236, "h": 112},
        "marker": {"w": 330, "h": 158},
        "rate":   {"x": round(X(m_marker)) + 16, "w": 420, "h": 66},
        "end":    {"x": plot["x1"] + 30, "y": round(Y(1000)) - 36},
        "legend": {"x": plot["x1"] + 28, "y": 548, "w": 312},
        "bracket": {"x1": round(X(m_marker), 2), "x2": round(X(m_rate_end), 2), "y": bracket_y},
    }
    L = labels
    L["launch"]["y"] = round(top_y(L["launch"]["x"], L["launch"]["x"] + L["launch"]["w"]) - 14 - L["launch"]["h"])
    L["marker"]["x"] = round(X(m_marker)) - 16 - L["marker"]["w"]
    L["marker"]["y"] = 352
    L["rate"]["y"] = bracket_y - 14 - L["rate"]["h"]
    for k in ("launch", "marker", "rate"):
        b = L[k]
        clear = top_y(b["x"], b["x"] + b["w"]) - (b["y"] + b["h"])
        if clear < 12:
            sys.exit(f"C3 label {k} sits {clear:.0f}px from the stack (needs >= 12)")
        if b["y"] < plot["yTop"] - 30:
            sys.exit(f"C3 label {k} rides into the header ({b['y']})")
    final = by[-1]
    shares = {b: round(v / 1000 * 100, 1) for b, v in zip(buckets, final)}   # = whitepaper 5.3 split (DATA.md T4)
    ticks = [(0, "NOV 2025"), (6, "MAY 2026"), (12, "NOV 2026"), (18, "MAY 2027"), (24, "NOV 2027"), (30, "MAY 2028"),
             (36, "NOV 2028")]
    return {
        "id": "C3", "canvas": [1920, 1080], "plot": plot,
        "scale_note": "x = x0 + month/36 * (x1 - x0); y = yBot - M/1000 * (yBot - yTop); step-after: month m's value spans x_m..x_m+1",
        "months": [{"m": i, "date": r["date"], "x": round(X(i), 2), "total_m": round(totals[i], 3),
                    "total_y": round(Y(totals[i]), 2), "event_tokens": r["event_tokens"],
                    "tracker_cumulative_tokens": r["tracker_cumulative_tokens"]} for i, r in enumerate(rows)],
        "buckets_bottom_to_top": buckets, "bands": bands,
        "marker": {"m": m_marker, "x": round(X(m_marker), 2), "date_text": "14 Nov 2026",
                   "before_m": round(totals[m_marker - 1], 1), "after_m": round(totals[m_marker], 1),
                   "before_text": f"{totals[m_marker - 1]:.1f}M", "after_text": f"{totals[m_marker]:.1f}M",
                   "event_text": f"{rows[m_marker]['event_tokens'] / 1e6:.1f}M"},
        "launch": {"x": round(X(0), 2), "y": round(Y(totals[0]), 2), "text": f"{totals[0]:.1f}M", "date_text": "14 Nov 2025"},
        "end": {"x": round(X(n), 2), "y": round(Y(totals[n]), 2), "text": f"{totals[n]:,.0f}M", "date_text": "14 Nov 2028"},
        "rate": {"text": f"+{rate_ev / 1e6:.1f}M", "months_at_rate": m_rate_end - m_marker,
                 "then": [f"{e / 1e6:.1f}M" for e in dict.fromkeys(r["event_tokens"] for r in rows[m_rate_end:])]},
        "labels": labels, "shares_pct": shares,
        "shares_note": "each bucket's final size / 1,000M from the same tracker file (276 / 274 / 100 / 200 / 150 M) = the whitepaper 5.3 split, DATA.md T4",
        "xticks": [{"x": round(X(m), 2), "label": lab} for m, lab in ticks],
        "yticks": [{"y": round(Y(v), 2), "label": ("0" if v == 0 else f"{v:,}M")} for v in (0, 250, 500, 750, 1000)],
        "states": {"start": 0, "marker": m_marker - 1, "switch": m_marker, "payoff": n},   # last month revealed (inclusive)
        "source": src["source"],
    }


def inline(html: Path, geo: dict) -> None:
    txt = html.read_text(encoding="utf-8")
    block = "/*GEOMETRY-BEGIN*/const GEO = " + json.dumps(geo, ensure_ascii=False) + ";/*GEOMETRY-END*/"
    new, k = re.subn(r"/\*GEOMETRY-BEGIN\*/.*?/\*GEOMETRY-END\*/", lambda _m: block, txt, flags=re.S)
    if k != 1:
        sys.exit(f"{html.name}: GEOMETRY markers not found exactly once")
    html.write_text(new, encoding="utf-8")


def build_geometry() -> None:
    for gid, fn in (("C2", c2_geometry), ("C3", c3_geometry)):
        geo = fn()
        (HERE / f"{gid}.geometry.json").write_text(json.dumps(geo, ensure_ascii=False, indent=1), encoding="utf-8")
        inline(HERE / f"{gid}.html", geo)
        print(f"{gid}: geometry written + inlined")


# ------------------------------------------------------------------------------------------------ shooting
def shoot(only: list[str] | None = None) -> None:
    from playwright.sync_api import sync_playwright
    jobs = [(DIAG / "C1.html", DIAG), (HERE / "C2.html", HERE), (HERE / "C3.html", HERE)]
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        for html, out_dir in jobs:
            if only and html.stem not in only:
                continue
            pg.goto(html.as_uri(), wait_until="networkidle")
            pg.evaluate("document.fonts.ready.then(() => true)")
            ok = pg.evaluate("""() => ['900 66px "Playfair Display"', '700 31px "DM Sans"', '600 20px "JetBrains Mono"']
                                   .every(f => document.fonts.check(f))""")
            if not ok:
                sys.exit(f"{html.name}: web fonts did not load (Playfair / DM Sans / JetBrains Mono); refusing to shoot")
            # every state is shot SOLO at the page origin, so the compositor tiles it identically each time: the shared
            # elements (header, orbs, axes, unlit nodes) come out byte-stable across states (no scroll-dependent blur)
            pg.add_style_tag(content="body{padding:0!important;gap:0!important;display:block!important}"
                                     ".frame{display:none!important}.frame.solo{display:flex!important}")
            pg.wait_for_timeout(300)
            ids = pg.evaluate("window.FRAME_IDS")
            for fid in ids:
                pg.evaluate("""fid => { document.querySelectorAll('.frame').forEach(f => f.classList.toggle('solo', f.id === fid));
                                        window.scrollTo(0, 0); }""", fid)
                pg.wait_for_timeout(150)
                pg.screenshot(path=str(out_dir / f"{fid}.png"), clip={"x": 0, "y": 0, "width": 1920, "height": 1080})
                print("shot", (out_dir / f"{fid}.png").relative_to(PROJ))
        br.close()


if __name__ == "__main__":
    args = sys.argv[1:]
    only = [a for a in args if not a.startswith("--")] or None
    if "--shoot" not in args:
        if (HERE / "C2.html").is_file() and (HERE / "C3.html").is_file():
            build_geometry()
    if "--geo" not in args:
        shoot(only)
