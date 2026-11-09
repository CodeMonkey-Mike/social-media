#!/usr/bin/env python
"""
discussion.py - the longform-discussion track's one CLI (canonical doc: ../longform-discussion.md).

The track researches what Mike can TALK about on camera, freeform, over browser tabs he shares. It never edits video.
Two data files drive it, both validated here so the rules live in code:
  circumstances/circumstances.json   the ONGOING dataset: things to point out + the market conditions that make them relevant
  media/<session>/TOPICS.json        one session's candidates, Mike's rulings, the running order

Commands:
  scan                         which dataset entries are live right now, from real market data
  lint                         validate the dataset and regenerate circumstances/CIRCUMSTANCES.md
  render <session>             validate TOPICS.json, write TOPICS.docx for Mike (+ RUNDOWN.md once topics are approved)
  approve <session> --from-doc read Mike's ruling out of the TOPICS.docx he narrowed: what is left is what he approved
  approve <session> --order 3,1,5 [--reject 2,4] [--drop-clip CLIP-2,CLIP-5]
                               the same ruling when he gives it in words. --order is the running order
  clips <session> [--only CLIP-1]
                               download ONLY the approved clips, ONLY the approved seconds (capture_clip_insert.py)
  tabs <session> [--check] [--open]
                               the ordered tab list. --check loads each in a throwaway browser. --open opens a new Chrome window
  status <session>             where the session stands

The HITL gate is enforced here: clips, tabs and RUNDOWN.md refuse to run until Mike has approved topics.
Exit: 0 = OK, 1 = a check failed, 2 = waiting on Mike's gate or a usage error.
"""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date, datetime, timedelta
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, str(Path(__file__).resolve().parent))
from market_data import load, on_or_before  # noqa: E402
from topics_doc import apply_ruling, build_doc, clock_s, length_line, open_in, rule_from_doc, timestamp_link  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
DATASET = ROOT / "circumstances" / "circumstances.json"
DATASET_MD = ROOT / "circumstances" / "CIRCUMSTANCES.md"
LAST_SCAN = ROOT / "circumstances" / "last-scan.json"
MEDIA = ROOT / "media"
CAPTURE = ROOT.parent / "longform-edited" / "skills" / "clip-inserts" / "capture_clip_insert.py"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

ENTRY_KINDS = {"precedent", "pattern", "recurring-chart", "claim-check", "inspiration"}
ENTRY_STATUS = {"verified", "partly-verified", "unverified"}
TAB_KINDS = {"article", "chart", "clip", "x-post", "odds", "local"}
CHECK_TYPES = {"always", "manual", "midterm_window", "fed_hike_within", "drawdown", "day_drop", "day_jump",
               "level_above", "level_below", "near_sma", "near_low"}
TOPIC_STATUS = {"PROPOSED", "APPROVED", "REJECTED"}
LONG_CLIP_S = 30.0   # a window longer than this is flagged: Mike asked for "that 15 seconds", not a segment
# A "plan" is a session he named himself: its doc is close to the video. A "menu" is a broad list he narrows.
TAB_BUDGET = 12          # Money and I: around 12 sources in 15 minutes. Mike stops and talks at every tab (2026-11-05)
FACTS_PER_TAB = 3        # one fact and one take is the format; more than this is a tab he never leaves
CAREFUL_PER_TAB = 2      # fans are watching: a caution is a private note where a line would be false, not a list
PRIMARY_COIN = "KAS"
OTHER_COIN_SHARE = 1 / 3 # his words: "It's almost like 80% of the video is going to be about quant"
# Mike never says another creator was wrong, on any channel (2026-11-05). Their failed claims stay out of his mouth entirely.
CALLOUT_RE = re.compile(r"\b(was|is|were|are) wrong\b|\bcorrect(s|ed|ing)? (him|her|them|that|the record)\b|\ba correction\b|\bdebunk|\bfails?\b|"
                        r"\bleft out\b|\bhold (him|her|them|\w+) to\b|\bbreak from (him|her|them)\b|\bpush back\b|\bactually said\b|"
                        r"\bthe one who read\b|\bworse than (he|she|they) said\b|\bname (him|her|them)\b", re.I)


# ── shared ────────────────────────────────────────────────────────────────────────────────────────────────────────────
def read_json(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


def write_json(p: Path, data):
    p.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def walk_strings(node, path=""):
    if isinstance(node, str):
        yield path, node
    elif isinstance(node, dict):
        for k, v in node.items():
            yield from walk_strings(v, f"{path}.{k}" if path else k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from walk_strings(v, f"{path}[{i}]")


def lint_text(node, where: str):
    """Persona rules, in code: no em dash anywhere; spoken prompts avoid the two words Mike fumbles or distrusts."""
    errs = []
    for path, s in walk_strings(node):
        if re.search(r"(^|\.)mike_(notes|edits|new_topics)", path):   # his own words from the Word doc, not my copy
            continue
        if "\u2014" in s:
            errs.append(f"{where}: {path}: em dash")
        spoken = re.search(r"(point_out|prompts|inspiring|angle|mike_angle)", path)
        if spoken and re.search(r"\bhonest", s, re.I):
            errs.append(f"{where}: {path}: 'honest' (persona: say 'Here's the thing')")
        if spoken and re.search(r"\babout \$?\d", s, re.I):
            errs.append(f"{where}: {path}: 'about <number>' (persona: say 'around')")
        if re.search(r"(^|\.)(title|why_now|angle|prompts|inspiring|point_out|mike_angle)(\[|$)", path):
            m = CALLOUT_RE.search(s)
            if m:
                errs.append(f"{where}: {path}: '{m.group(0)}' reads as correcting someone. Mike never calls out a creator")
    return errs


# ── scan ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
def midterm_day(year: int) -> str:
    d = date(year, 11, 1)
    while d.weekday() != 0:
        d += timedelta(days=1)
    return (d + timedelta(days=1)).isoformat()


def weekly_closes(rows):
    """The last close of each completed week (Sunday), the way a weekly chart bar closes. BTC trades every day."""
    weeks = {}
    for d, v in rows:
        dt = datetime.strptime(d, "%Y-%m-%d")
        weeks[tuple(dt.isocalendar())[:2]] = (dt, v)
    return [v for dt, v in sorted(weeks.values()) if dt.weekday() == 6]


def evaluate(check: dict, today: str):
    """-> (state, reading): state is LIVE, QUIET or MANUAL."""
    t = check["type"]
    if t == "always":
        return "LIVE", check.get("note", "standing item")
    if t == "manual":
        return "MANUAL", check["question"]
    if t == "midterm_window":
        y = int(today[:4])
        if y % 4 != 2:
            return "QUIET", f"{y} is not a midterm year"
        e = midterm_day(y)
        gap = (date.fromisoformat(today) - date.fromisoformat(e)).days
        return ("LIVE" if 0 <= gap <= check["days"] else "QUIET"), f"midterm {e}, {gap} days ago (window {check['days']})"
    if t == "fed_hike_within":
        rows = load("FEDUP")
        moves = [(rows[i][0], rows[i - 1][1], rows[i][1]) for i in range(1, len(rows)) if rows[i][1] != rows[i - 1][1]]
        d, a, b = moves[-1]
        gap = (date.fromisoformat(today) - date.fromisoformat(d)).days
        live = b > a and gap <= check["days"]
        return ("LIVE" if live else "QUIET"), f"last Fed move {d}: {a:.2f} to {b:.2f}, {gap} days ago"
    rows = load(check["series"])
    last_d, last = rows[-1]
    name = check["series"]
    if t == "drawdown":
        hi_d, hi = max(rows, key=lambda r: r[1])
        off = (1 - last / hi) * 100
        return ("LIVE" if off >= check["min_pct"] else "QUIET"), f"{name} {last:,.2f} ({last_d}), {off:.1f}% below its {hi_d} high of {hi:,.2f}"
    if t in ("day_drop", "day_jump"):
        chg = (last / rows[-2][1] - 1) * 100
        live = chg <= -check["min_pct"] if t == "day_drop" else chg >= check["min_pct"]
        return ("LIVE" if live else "QUIET"), f"{name} {chg:+.2f}% on {last_d}"
    if t in ("level_above", "level_below"):
        live = last >= check["value"] if t == "level_above" else last <= check["value"]
        return ("LIVE" if live else "QUIET"), f"{name} {last:,.2f} ({last_d}), trigger {check['value']:,}"
    if t == "near_sma":
        closes = weekly_closes(rows)
        sma = sum(closes[-check["weeks"]:]) / check["weeks"]
        gap = (last / sma - 1) * 100
        return ("LIVE" if abs(gap) <= check["within_pct"] else "QUIET"), f"{name} {last:,.0f} is {gap:+.1f}% from its {check['weeks']}-week SMA of {sma:,.0f}"
    if t == "near_low":
        win = [(d, v) for d, v in rows if check["start"] <= d <= check["end"]]
        lo_d, lo = min(win, key=lambda r: r[1])
        gap = (last / lo - 1) * 100
        return ("LIVE" if gap <= check["within_pct"] else "QUIET"), f"{name} {last:,.2f} is {gap:+.1f}% from its {lo_d} low of {lo:,.2f}"
    raise ValueError(f"unknown check type {t}")


def scan_entries(entries, today: str):
    out = []
    for e in entries:
        results = [evaluate(c, today) for c in e["when"]["checks"]]
        states = [r[0] for r in results]
        need_all = e["when"].get("match", "any") == "all"
        if "QUIET" in states and need_all:
            state = "QUIET"
        elif any(s == "LIVE" for s in states) and (not need_all or all(s != "QUIET" for s in states)):
            state = "LIVE"
        elif "MANUAL" in states:
            state = "MANUAL"
        else:
            state = "QUIET"
        out.append({"id": e["id"], "title": e["title"], "state": state, "readings": [r[1] for r in results],
                    "mike_flagged": bool(e.get("mike_note"))})
    return out


def cmd_scan(_a):
    data = read_json(DATASET)
    today = date.today().isoformat()
    res = scan_entries(data["entries"], today)
    res.sort(key=lambda r: not r["mike_flagged"])
    write_json(LAST_SCAN, {"scanned": today, "results": res})
    for state, head in (("LIVE", "LIVE NOW: worth bringing up"), ("MANUAL", "CHECK BY HAND: a person or a logged-in browser has to look"), ("QUIET", "QUIET: not relevant today")):
        rows = [r for r in res if r["state"] == state]
        print(f"\n{head} ({len(rows)})")
        for r in rows:
            print(f"  {'* ' if r['mike_flagged'] else ''}{r['id']}: {r['title']}")
            if state != "QUIET":
                for line in r["readings"]:
                    print(f"      {line}")
    print(f"\nSCAN live={sum(r['state'] == 'LIVE' for r in res)} manual={sum(r['state'] == 'MANUAL' for r in res)} quiet={sum(r['state'] == 'QUIET' for r in res)}  (* = Mike flagged it)")
    return 0


# ── lint + dataset view ───────────────────────────────────────────────────────────────────────────────────────────────
def lint_tabs(tabs, where: str):
    errs = []
    for i, t in enumerate(tabs):
        w = f"{where} tab {i + 1}"
        if t.get("kind") not in TAB_KINDS:
            errs.append(f"{w}: kind must be one of {sorted(TAB_KINDS)}")
        if not t.get("label"):
            errs.append(f"{w}: no label")
        if t.get("kind") != "clip" and not t.get("url"):
            errs.append(f"{w}: no url")
        if t.get("kind") == "clip":
            for k in ("id", "url", "start", "end", "words", "caption", "context"):
                if not t.get(k):
                    errs.append(f"{w}: clip without {k}")
            if t.get("start") and t.get("end") and clock_s(t["end"]) <= clock_s(t["start"]):
                errs.append(f"{w}: clip end is not after its start")
    return errs


def lint_dataset(data):
    errs = lint_text(data, "dataset")
    seen = set()
    for e in data["entries"]:
        eid = e.get("id", "?")
        for k in ("id", "title", "kind", "status", "when", "point_out", "tabs", "sources", "added"):
            if k not in e:
                errs.append(f"{eid}: missing {k}")
        if eid in seen:
            errs.append(f"{eid}: duplicate id")
        seen.add(eid)
        if e.get("kind") not in ENTRY_KINDS:
            errs.append(f"{eid}: kind must be one of {sorted(ENTRY_KINDS)}")
        if e.get("status") not in ENTRY_STATUS:
            errs.append(f"{eid}: status must be one of {sorted(ENTRY_STATUS)}")
        for c in e.get("when", {}).get("checks", []):
            if c.get("type") not in CHECK_TYPES:
                errs.append(f"{eid}: unknown check type {c.get('type')}")
        for n in e.get("numbers", []):
            if not n.get("basis") or not n.get("read"):
                errs.append(f"{eid}: a number without basis + read date: {n.get('text', '')[:50]}")
        errs += lint_tabs(e.get("tabs", []), eid)
    return errs


def tab_line(t):
    if t["kind"] == "clip":
        return f"Clip ({clock_s(t['end']) - clock_s(t['start']):.0f} s): [{t['label']}]({timestamp_link(t['url'], t['start'])}). \"{t['words']}\""
    note = f" {t['show']}" if t.get("show") else ""
    if t["url"].startswith("pending"):   # built only after approval: no link to offer yet
        return f"{t['kind'].capitalize()}: {t['label']}.{note}"
    return f"{t['kind'].capitalize()}: [{t['label']}]({t['url']}).{note}"


def render_dataset(data):
    today = date.today().isoformat()
    scan = {}
    if LAST_SCAN.is_file():
        last = read_json(LAST_SCAN)
        scan = {r["id"]: r for r in last["results"]}
        today = last["scanned"]
    L = ["# Market circumstances: what Mike can point out, and when",
         "",
         f"_GENERATED from `circumstances.json`, do not hand-edit. Last scan {today}. Run `python scripts/discussion.py scan` for the live read._",
         ""]
    for e in data["entries"]:
        state = scan.get(e["id"], {}).get("state", "not scanned")
        flag = " · Mike flagged" if e.get("mike_note") else ""
        L += [f"## {e['title']}", f"`{e['id']}` · {state} · {e['kind']} · {e['status']}{flag}", "", f"**When:** {e['when']['summary']}"]
        for r in scan.get(e["id"], {}).get("readings", []) if state != "QUIET" else []:
            L.append(f"- Now: {r}")
        if e.get("mike_note"):
            L += ["", f"**Mike:** {e['mike_note']}"]
        L += ["", "**Point out:**"] + [f"- {p}" for p in e["point_out"]]
        if e.get("numbers"):
            L += ["", "**Checked numbers:**"] + [f"- {n['text']} ({n['basis']}, read {n['read']})" for n in e["numbers"]]
        if e.get("mike_angle"):
            L += ["", f"**Angle:** {e['mike_angle']}"]
        if e.get("careful"):
            L += ["", "**Careful:**"] + [f"- {c}" for c in e["careful"]]
        L += ["", "**Tabs:**"] + [f"- {tab_line(t)}" for t in e["tabs"]]
        L += ["", "**Where it came from:**"] + [f"- {s}" for s in e["sources"]] + [""]
    L += ["## Videos scanned into this dataset", ""]
    for v in data.get("videos", []):
        L.append(f"- {v['scanned']}: [{v['title']}]({v['url']}), {v['creator']} ({v['published']}). Added: {', '.join(v['entries'])}")
    return "\n".join(L) + "\n"


def cmd_lint(_a):
    data = read_json(DATASET)
    errs = lint_dataset(data)
    if errs:
        for x in errs:
            print(f"FAIL {x}")
        print(f"DATASET-LINT FAIL {len(errs)} problem(s)")
        return 1
    DATASET_MD.write_text(render_dataset(data), encoding="utf-8")
    print(f"DATASET-LINT PASS entries={len(data['entries'])} videos={len(data.get('videos', []))} view={DATASET_MD}")
    return 0


# ── sessions ──────────────────────────────────────────────────────────────────────────────────────────────────────────
def session_dir(name: str) -> Path:
    return MEDIA / name


def load_session(name: str):
    p = session_dir(name) / "TOPICS.json"
    if not p.is_file():
        print(f"FAIL no {p}")
        sys.exit(1)
    return p, read_json(p)


def lint_session(s):
    errs = lint_text(s, "session")
    ids = set()
    for t in s["topics"]:
        tid = t.get("id")
        for k in ("id", "title", "status", "why_now", "angle", "tabs"):
            if k not in t:
                errs.append(f"topic {tid}: missing {k}")
        if "facts" in t:
            errs.append(f"topic {tid}: facts belong under the tab open while he says them, not on the topic")
        if tid in ids:
            errs.append(f"topic {tid}: duplicate id")
        ids.add(tid)
        if t.get("status") not in TOPIC_STATUS:
            errs.append(f"topic {tid}: status must be one of {sorted(TOPIC_STATUS)}")
        for holder in ([t["no_tab"]] if t.get("no_tab") else []) + t.get("tabs", []):
            for f in holder.get("facts", []):
                if not f.get("text") or not f.get("source") or not f.get("read"):
                    errs.append(f"topic {tid}: a fact without text + source + read date: {f.get('text', '')[:50]}")
        errs += lint_tabs(t.get("tabs", []), f"topic {tid}")
        for tab in t.get("tabs", []):
            if tab.get("dropped"):
                continue
            # A clip says its own piece. Any other tab with nothing under it leaves him on screen with nothing to say.
            if t.get("status") == "PROPOSED" and tab.get("kind") != "clip" and not (tab.get("facts") or tab.get("careful") or tab.get("prompts") or tab.get("inspiring")):
                errs.append(f"topic {tid}: tab '{tab.get('label')}' has nothing to say under it")
            if t.get("status") == "APPROVED" and not (tab.get("prompts") or tab.get("inspiring")):
                errs.append(f"topic {tid}: tab '{tab.get('label')}' is approved, so it needs talking-point prompts before RUNDOWN.md")
    return errs + lint_plan(s)


def live_tabs(s):
    """[(topic, tab)] still in play: a rejected topic or a dropped tab is not part of the recording."""
    return [(t, tab) for t in s["topics"] if t.get("status") != "REJECTED" for tab in t.get("tabs", []) if not tab.get("dropped")]


def lint_plan(s):
    """The length and balance rules, in code, for a session he named himself. He stops and talks at every tab, so tabs ARE runtime."""
    if s.get("shape") != "plan":
        return []
    errs, rows = [], live_tabs(s)
    if len(rows) > TAB_BUDGET:
        errs.append(f"plan: {len(rows)} tabs, over the budget of {TAB_BUDGET} (a source a minute, Money and I runs around 12 in 15 minutes)")
    for t, tab in rows:
        if len([f for f in tab.get("facts", []) if not f.get("dropped")]) > FACTS_PER_TAB:
            errs.append(f"plan: topic {t['id']} tab '{tab['label']}' has more than {FACTS_PER_TAB} facts. One fact and one take is the format")
        if len(tab.get("careful", [])) > CAREFUL_PER_TAB:
            errs.append(f"plan: topic {t['id']} tab '{tab['label']}' has more than {CAREFUL_PER_TAB} cautions. Fans are watching: keep only what stops a false line")
    if not any(str(tab.get("show", "")).startswith("We are here") for _t, tab in rows):
        errs.append("plan: no 'We are here' chart. Show a moment from the past and say where we are now (Mike, 2026-11-06)")
    coins = {}
    for t, _tab in rows:
        if t.get("coin"):
            coins[t["coin"]] = coins.get(t["coin"], 0) + 1
    for coin, n in coins.items():
        if coin != PRIMARY_COIN and rows and n / len(rows) > OTHER_COIN_SHARE:
            errs.append(f"plan: {coin} has {n} of {len(rows)} tabs. No coin except {PRIMARY_COIN} gets more than a third")
    for t in s["topics"]:   # the fans of this coin are watching, so every coin topic carries bullish lines
        if t.get("coin") and t.get("status") != "REJECTED":
            holders = [t.get("no_tab") or {}] + [b for b in t.get("tabs", []) if not b.get("dropped")]
            lines = sum(len(h.get("prompts", [])) + len(h.get("inspiring", [])) for h in holders)
            if lines < 2:
                errs.append(f"plan: topic {t['id']} is about {t['coin']} but has {lines} 'Say:' line(s). Give its fans at least 2 bullish lines")
    return errs


def clips_of(s, approved_only=True):
    for t in s["topics"]:
        if approved_only and t["status"] != "APPROVED":
            continue
        for tab in t["tabs"]:
            if tab["kind"] == "clip" and not tab.get("dropped"):
                yield t, tab


def running_order(s):
    by_id = {t["id"]: t for t in s["topics"]}
    return [by_id[i] for i in s.get("order", []) if by_id[i]["status"] == "APPROVED"]


def fact_line(f):
    src = f["source"]
    link = f"[source]({src})" if src.startswith("http") else src
    return f"- {f['text']} ({link}, read {f['read']})"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def deliver_doc(p: Path, s):
    """Write TOPICS.docx, but never over Mike's edits: an edited or ruled document is his, not a generated view."""
    doc = p.parent / "TOPICS.docx"
    if s.get("approved_on"):
        return None
    if doc.is_file() and sha256(doc) != s.get("docx_sha256"):
        print(f"KEPT {doc}: it has been edited since I wrote it, so it was not regenerated")
        return None
    if doc.is_file() and open_in(doc):   # LibreOffice does not lock the file, so the write alone would not catch this
        raise PermissionError(doc)
    build_doc(s, doc)
    s["docx_sha256"] = sha256(doc)
    write_json(p, s)
    return doc


def number_tabs(s):
    """[(n, topic, tab)] in the order Mike records: the running order, each topic's tabs in place."""
    rows, n = [], 0
    for t in running_order(s):
        for tab in t["tabs"]:
            if tab.get("dropped"):
                continue
            n += 1
            rows.append((n, t, tab))
    return rows


def render_rundown(s):
    L = [f"# Rundown: {s['session']}", "", "_Generated from TOPICS.json. Talking points, not a script: say it your way._", ""]
    if s.get("video", {}).get("kept"):
        L += ["**Title and thumbnail you kept:**"] + [f"- {x}" for x in s["video"]["kept"]] + [""]

    def under(holder):
        """What he says while this tab is up: his own notes first, then the talking points, facts and cautions."""
        out = []
        if holder.get("mike_notes") or holder.get("mike_edits"):
            out += ["**Your notes:**"] + [f"- {n}" for n in holder.get("mike_notes", [])] + [f"- {e['now']}" for e in holder.get("mike_edits", [])] + [""]
        out += [f'- **Highlight:** "{p}"' for p in holder.get("highlights", [])]
        out += [f"- **Inspiring:** {p}" for p in holder.get("inspiring", [])] + [f"- {p}" for p in holder.get("prompts", [])]
        facts = [fact_line(f) for f in holder.get("facts", []) if not f.get("dropped")]
        if facts:
            out += ["", "**Facts:**"] + facts
        if holder.get("careful"):
            out += ["", "**Careful:**"] + [f"- {x}" for x in holder["careful"]]
        return out + [""]

    numbered = number_tabs(s)
    for i, t in enumerate(running_order(s), 1):
        L += [f"## {i}. {t['title']}", ""]
        if t.get("mike_notes") or t.get("mike_edits"):
            L += under({"mike_notes": t.get("mike_notes", []), "mike_edits": t.get("mike_edits", [])})
        if t.get("no_tab"):
            L += ["### No tab, on camera", ""] + under(t["no_tab"])
        for n, owner, tab in numbered:
            if owner is t:
                where = tab.get("file") or tab.get("url")
                extra = f" {tab['show']}" if tab.get("show") else ""
                L += [f"### Tab {n}, {tab['kind']}: {tab['label']}", "", f"{where}{extra}", ""] + under(tab)
    return "\n".join(L)


def cmd_render(a):
    p, s = load_session(a.session)
    errs = lint_session(s)
    if errs:
        for x in errs:
            print(f"FAIL {x}")
        print(f"TOPICS-LINT FAIL {len(errs)} problem(s)")
        return 1
    wrote = []
    try:
        doc = deliver_doc(p, s)
    except PermissionError:
        print(f"FAIL {p.parent / 'TOPICS.docx'} is open in {open_in(p.parent / 'TOPICS.docx') or 'another app'}, close it and run this again")
        return 1
    except ModuleNotFoundError:
        print("FAIL python-docx is not installed. Run: pip install --no-deps --no-cache-dir python-docx")
        return 1
    if doc:
        wrote.append(str(doc))
    if running_order(s):
        (p.parent / "RUNDOWN.md").write_text(render_rundown(s), encoding="utf-8")
        wrote.append(str(p.parent / "RUNDOWN.md"))
    print(f"TOPICS-LINT PASS topics={len(s['topics'])} approved={len(running_order(s))} wrote={wrote}")
    print(length_line(s))
    return 0


def approve_from_doc(p: Path, s, name: str):
    doc = p.parent / "TOPICS.docx"
    if not doc.is_file():
        print(f"GATE no {doc}. Run: discussion.py render {name}")
        return 2
    app = open_in(doc)
    if app:
        print(f"GATE {doc.name} is open in {app}, so unsaved deletions would be missed. Save and close it, then run this again.")
        return 2
    if doc.with_suffix(".odt").is_file():   # LibreOffice's save dialog can do this, and TOPICS.docx would then look untouched
        print(f"GATE there is a {doc.stem}.odt next to {doc.name}, so the edits may be in the wrong file. Save as .docx (Keep Current Format).")
        return 2
    ruling = rule_from_doc(doc, s)
    if ruling["errors"]:
        for x in ruling["errors"]:
            print(f"FAIL {x}")
        return 2
    changed, report = apply_ruling(s, ruling)
    if not changed:   # nothing is saved: a document nobody touched is not a ruling
        print(f"GATE {doc.name} is exactly as delivered, which is not a ruling. If Mike wants all of it, he says so: approve --order ...")
        return 2
    s["approved_on"] = date.today().isoformat()
    s["ruled_from"] = doc.name
    write_json(p, s)
    rejected = [t["id"] for t in s["topics"] if t["status"] == "REJECTED"]
    print(f"GATE-APPROVED session={name} order={s['order']} rejected={rejected} from={doc.name}")
    for line in report:
        print(line)
    print(length_line(s))
    print("Next: relay this to Mike, act on any NOTE, CHANGED or NEW TOPIC, add talking-point prompts, then: render, clips, tabs --check")
    return 0


def cmd_approve(a):
    p, s = load_session(a.session)
    if a.from_doc:
        return approve_from_doc(p, s, a.session)
    if not a.order:
        print("FAIL give --from-doc or --order")
        return 2
    ids = {t["id"]: t for t in s["topics"]}
    order = [int(x) for x in a.order.split(",") if x]
    reject = [int(x) for x in a.reject.split(",") if x]
    unknown = [i for i in order + reject if i not in ids]
    if unknown:
        print(f"FAIL unknown topic id(s) {unknown}")
        return 2
    for i in order:
        ids[i]["status"] = "APPROVED"
    for i in reject:
        ids[i]["status"] = "REJECTED"
    s["order"] = order
    drop = {x for x in a.drop_clip.split(",") if x}
    found = set()
    for t in s["topics"]:
        for tab in t["tabs"]:
            if tab["kind"] == "clip" and tab.get("id") in drop:
                tab["dropped"] = True
                found.add(tab["id"])
    if drop - found:
        print(f"FAIL unknown clip id(s) {sorted(drop - found)}")
        return 2
    s["approved_on"] = date.today().isoformat()
    write_json(p, s)
    print(f"GATE-APPROVED session={a.session} order={order} rejected={reject} dropped_clips={sorted(drop)}")
    print("Next: add talking-point prompts to each approved topic, then: render, clips, tabs --check")
    return 0


def require_gate(s, name):
    if not running_order(s):
        print(f"GATE waiting on Mike: no approved topics in {name}. Run after he rules: discussion.py approve {name} --from-doc")
        sys.exit(2)


def cmd_clips(a):
    p, s = load_session(a.session)
    if a.before_ruling and not a.only:   # Mike asked for this one clip by name; the rest of the list is still his to rule on
        print("FAIL --before-ruling needs --only CLIP-N: it is for one clip Mike asked for, never the whole list")
        return 2
    if not a.before_ruling:
        require_gate(s, a.session)
    out_dir = p.parent / "clips"
    bad = 0
    order_pos = {tid: i + 1 for i, tid in enumerate(s["order"])}
    for t, tab in clips_of(s, approved_only=not a.before_ruling):
        if a.only and tab["id"] != a.only:
            continue
        order_pos.setdefault(t["id"], t["id"])
        if tab.get("file") and Path(tab["file"]).is_file() and not a.force:
            print(f"SKIP {tab['id']} already captured: {tab['file']}")
            continue
        slug = re.sub(r"[^a-z0-9]+", "-", tab["label"].lower()).strip("-")[:40]
        out = out_dir / f"{order_pos[t['id']]:02d}-{tab['id']}-{slug}.mp4"
        cmd = [sys.executable, "-u", str(CAPTURE), "--url", tab["url"], "--start", tab["start"], "--end", tab["end"],
               "--out", str(out), "--caption", tab["caption"], "--caption-pos", tab.get("caption_pos", "bottom")]
        if tab.get("expect"):
            cmd += ["--expect", tab["expect"]]
        print(f"CAPTURE {tab['id']} {tab['start']}-{tab['end']} from {tab['url']}", flush=True)
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
        ok = next((x for x in r.stdout.splitlines() if x.startswith("CLIP-INSERT-OK")), None)
        if r.returncode == 0 and ok:
            tab["file"] = str(out)
            write_player(out, tab["label"])
            m = re.search(r'words="(.*)"', ok)
            tab["heard"] = m.group(1) if m else ""
            print(ok)
        else:
            bad += 1
            print(f"CLIP-FAIL {tab['id']}: " + " | ".join(r.stdout.strip().splitlines()[-4:]))
        write_json(p, s)   # a crash mid-run keeps the clips already captured
    print(f"CLIPS done, {bad} failed")
    return 1 if bad else 0


def find_chrome():
    for c in (Path("C:/Program Files/Google/Chrome/Application/chrome.exe"),
              Path("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"),
              Path.home() / "AppData/Local/Google/Chrome/Application/chrome.exe"):
        if c.is_file():
            return str(c)
    return shutil.which("chrome")


PLAYER = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>{title}</title>
<style>html,body{{margin:0;height:100%;background:#000}}video{{width:100%;height:100%;object-fit:contain;display:block;outline:none}}</style>
</head><body><video src="{src}" controls preload="auto"></video>
<script>
const v = document.querySelector('video');
v.focus();
addEventListener('keydown', e => {{
  if (e.code === 'Space' && e.target !== v) {{ e.preventDefault(); v.paused ? v.play() : v.pause(); }}
  if (e.key === 'r' || e.key === 'R') {{ v.currentTime = 0; v.pause(); }}
}});
</script></body></html>
"""


def write_player(mp4: Path, title: str) -> Path:
    """Why a page and not the bare mp4: Chrome AUTOPLAYS a video opened directly, with sound, background tabs included
    (measured 2026-11-05), so a window of clip tabs would all talk at once and be over before Mike reached them. This
    page holds on the first frame until he presses space (or clicks play). R goes back to the start."""
    page = mp4.with_suffix(".html")
    page.write_text(PLAYER.format(title=title.replace("<", ""), src=mp4.name), encoding="utf-8")
    return page


def tab_target(tab):
    """What actually opens: an approved clip's local PLAYER page, every other tab's URL. None = not ready (a clip not
    captured yet, or a local chart still 'pending' its build)."""
    if tab["kind"] == "clip":
        f = tab.get("file")
        if not f or not Path(f).is_file():
            return None
        return write_player(Path(f).resolve(), tab["label"]).as_uri()
    return None if tab["url"].startswith("pending") else tab["url"]


# A page that needs Mike's login or a subscription looks fine to a status code, so the text is read too.
WALL_RE = re.compile(r"log in to unlock|sign in to continue|subscribe to continue|subscribe to read|verify you are human|access denied|unusual traffic", re.I)


def check_tabs(rows, shots: Path):
    from playwright.sync_api import sync_playwright
    shots.mkdir(parents=True, exist_ok=True)
    problems = 0
    with sync_playwright() as pw, tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as prof:
        ctx = pw.chromium.launch_persistent_context(prof, channel="chrome", headless=True, user_agent=UA, viewport={"width": 1600, "height": 950})
        pg = ctx.new_page()
        for n, _t, tab in rows:
            target = tab_target(tab)
            if not target:
                print(f"TAB {n} NOT-READY {tab['label']}: no local file yet")
                problems += 1
                continue
            if "x.com/" in target:
                print(f"TAB {n} SKIP x.com needs your login, not checkable here: {target}")
                continue
            try:
                r = pg.goto(target, wait_until="domcontentloaded", timeout=45000)
                pg.wait_for_timeout(5000)
                status = r.status if r else "local"
                if tab["kind"] == "clip":
                    v = pg.evaluate("() => { const v = document.querySelector('video'); return v ? {w: v.videoWidth, err: v.error && v.error.code, dur: v.duration, paused: v.paused} : null; }")
                    good = bool(v) and not v["err"] and v["w"] > 0 and v["paused"]   # loads, decodes, and waits for Mike
                    print(f"TAB {n} {'OK' if good else 'FAIL'} clip {v}")
                    problems += 0 if good else 1
                else:
                    wall = WALL_RE.search(pg.locator("body").inner_text(timeout=5000) or "")
                    state = "WALL" if wall else ("OK" if status == 200 or target.startswith("file:") else "BAD")   # a local deck has no HTTP status
                    pg.screenshot(path=str(shots / f"tab-{n:02d}.png"))
                    note = f' "{wall.group(0)}"' if wall else ""
                    print(f"TAB {n} {state} {status}{note} {pg.title()[:60]} | {target}")
                    problems += 0 if state == "OK" else 1
            except Exception as e:
                print(f"TAB {n} FAIL {type(e).__name__} {target}")
                problems += 1
        ctx.close()
    return problems


def cmd_tabs(a):
    p, s = load_session(a.session)
    require_gate(s, a.session)
    rows = number_tabs(s)
    for n, t, tab in rows:
        print(f"{n:>2}. [{tab['kind']}] {t['title'][:38]} :: {tab['label']} :: {tab_target(tab) or '(not ready: no local file yet)'}")
    bad = 0
    if a.check:
        bad = check_tabs(rows, p.parent / "_tab-check")
        print(f"TABS-CHECK {'PASS' if not bad else f'{bad} problem(s)'} screenshots={p.parent / '_tab-check'}")
    if a.open:
        missing = [tab["label"] for _, _, tab in rows if not tab_target(tab)]
        chrome = find_chrome()
        if missing or not chrome:
            print(f"FAIL not opening, not ready: {missing}" if missing else "FAIL Chrome not found")
            return 1
        # a NEW window in Mike's normal Chrome, so his logins apply. Never closes or restarts anything.
        subprocess.Popen([chrome, "--new-window"] + [tab_target(tab) for _, _, tab in rows])
        print(f"OPENED {len(rows)} tabs in a new Chrome window")
    return 1 if bad else 0


def cmd_status(a):
    _p, s = load_session(a.session)
    counts = {k: sum(t["status"] == k for t in s["topics"]) for k in TOPIC_STATUS}
    print(f"SESSION {a.session} researched={s['researched']} {counts}")
    if not running_order(s):
        print(f"GATE waiting on Mike's ruling on {s['session']}/TOPICS.docx")
        return 2
    print("Order: " + " > ".join(t["title"][:30] for t in running_order(s)))
    clips = list(clips_of(s))
    print(f"Clips: {sum(bool(c[1].get('file')) for c in clips)}/{len(clips)} captured · Tabs: {len(number_tabs(s))}")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("scan").set_defaults(fn=cmd_scan)
    sub.add_parser("lint").set_defaults(fn=cmd_lint)
    for name, fn in (("render", cmd_render), ("status", cmd_status)):
        x = sub.add_parser(name)
        x.add_argument("session")
        x.set_defaults(fn=fn)
    x = sub.add_parser("approve")
    x.add_argument("session")
    x.add_argument("--from-doc", action="store_true", help="read the ruling out of the TOPICS.docx Mike narrowed")
    x.add_argument("--order", default="", help="approved topic ids in running order, e.g. 3,1,5")
    x.add_argument("--reject", default="")
    x.add_argument("--drop-clip", default="")
    x.set_defaults(fn=cmd_approve)
    x = sub.add_parser("clips")
    x.add_argument("session")
    x.add_argument("--only", default=None)
    x.add_argument("--force", action="store_true")
    x.add_argument("--before-ruling", action="store_true", help="with --only: download one clip Mike asked for by name, before he has ruled on the list")
    x.set_defaults(fn=cmd_clips)
    x = sub.add_parser("tabs")
    x.add_argument("session")
    x.add_argument("--check", action="store_true")
    x.add_argument("--open", action="store_true")
    x.set_defaults(fn=cmd_tabs)
    a = ap.parse_args()
    return a.fn(a)


if __name__ == "__main__":
    sys.exit(main())
