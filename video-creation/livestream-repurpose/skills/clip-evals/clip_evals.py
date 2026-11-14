"""clip_evals.py: the eval SCORE LAYER for the livestream clip-strategist (Lane 2).

Full doc: clip-evals.md (same folder). In short:

  the RECORD   evals/clip-verdicts.jsonl   append-only. One line per clip per gate ("kept" / "killed"), plus
               "missed" lines (what the strategist should have found). The batch graph writes it at the 4b and
               2nd gates. Never rewritten, never recycled, committed to Git.
  the INPUTS   evals/transcripts/<batch>/  the transcript files the strategist read, kept so an old batch can
               be replayed after cleanup recycled the batch itself.
  REPLAYS      evals/replays/<batch>--<prompt version>--rN.json   what the strategist picks from an old
               transcript under the prompt as it is NOW.
  the SCORE    precision / recall from the record, and every replay matched against the recorded verdicts.

Commands:
  python clip_evals.py list
  python clip_evals.py score [--batch B] [--json]
  python clip_evals.py replay --batch B [--brief "..."]
  python clip_evals.py missed --batch B "12:30-14:10 the ETF rant; 45:00 kaspa hashrate"     (or: none)
  python clip_evals.py record --batch B --gate 4b|2nd     (repair: re-record a gate from the plan on disk)

This file spawns nothing itself: `replay` goes through batch_graph.spawn_agent, so the Fable-to-Opus fallback
and the API-overload respawn are the batch orchestrator's own.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

HERE = Path(__file__).resolve().parent
LSR = HERE.parents[1]                       # video-creation/livestream-repurpose
REPO_ROOT = LSR.parents[1]
SHORTS = REPO_ROOT / "video-creation" / "shorts"
EVALS = Path(os.environ.get("CLIP_EVALS_DIR") or (LSR / "evals"))   # tests point this at a temp folder

SCHEMA = 1
MATCH_MIN = 0.5          # a new pick is "the same clip" when it shares >= 50% of the shorter clip's seconds
MISS_NEAR_S = 30.0       # a miss given as one timestamp counts as found when a pick lands within 30 s of it
GATES = ("4b", "2nd")

AGENT = REPO_ROOT / ".claude" / "agents" / "clip-strategist.md"
# What the prompt version is made of. persona.json is left out on purpose: it changes for reasons that have
# nothing to do with clip selection, and it would make every batch look like a new prompt.
PROMPT_FILES = {
    "agent": AGENT,
    "topic_finding": LSR / "skills" / "topic-finding" / "SKILL.md",
    "clip_selection": LSR / "skills" / "clip-selection-dashboard" / "SKILL.md",
}
TRANSCRIPT_FILES = {"chunks": "chunks_90s.txt", "plain": "plain.txt", "words": "words.txt"}


# ── paths ────────────────────────────────────────────────────────────────────

def record_path() -> Path:
    return EVALS / "clip-verdicts.jsonl"


def transcripts_dir(batch: str) -> Path:
    return EVALS / "transcripts" / batch


def replays_dir() -> Path:
    return EVALS / "replays"


def scores_path() -> Path:
    return EVALS / "scores.jsonl"


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def _warn(msg: str):
    print(f"[clip-evals] WARNING: {msg}", file=sys.stderr, flush=True)


def _write_json_atomic(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8", newline="\n")
    os.replace(tmp, path)


# ── the record (append-only) ─────────────────────────────────────────────────

def read_jsonl(path: Path) -> list:
    if not path.is_file():
        return []
    out = []
    for i, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        raw = raw.strip()
        if not raw:
            continue
        try:
            out.append(json.loads(raw))
        except ValueError:
            _warn(f"line {i} of {path.name} is not JSON, skipped")
    return out


def read_record() -> list:
    return read_jsonl(record_path())


def append_jsonl(path: Path, lines: list):
    """Append only. Nothing in this module rewrites or trims a .jsonl file."""
    if not lines:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    lead = ""
    if path.is_file() and path.stat().st_size:
        with open(path, "rb") as f:
            f.seek(-1, os.SEEK_END)
            if f.read(1) != b"\n":
                lead = "\n"          # a hand edit left no final newline: never glue two records together
    with open(path, "a", encoding="utf-8", newline="\n") as f:
        f.write(lead)
        for line in lines:
            f.write(json.dumps(line, ensure_ascii=False, separators=(",", ":")) + "\n")


# ── clips, segments, matching ────────────────────────────────────────────────

def segs_of(clip) -> list:
    """A clip's segments as [[start, end], ...] seconds on the vertical master."""
    out = []
    for s in (clip or {}).get("segments") or []:
        try:
            a, b = (float(s["start"]), float(s["end"])) if isinstance(s, dict) else (float(s[0]), float(s[1]))
        except (KeyError, TypeError, ValueError, IndexError):
            continue
        if b > a:
            out.append([round(a, 2), round(b, 2)])
    return out


def _merge(segs: list) -> list:
    out = []
    for a, b in sorted(segs):
        if out and a <= out[-1][1]:
            out[-1][1] = max(out[-1][1], b)
        else:
            out.append([a, b])
    return out


def seconds(segs: list) -> float:
    return round(sum(b - a for a, b in _merge(segs)), 2)


def overlap(x: list, y: list) -> float:
    """Seconds two clips have in common (each clip may be several segments)."""
    x, y = _merge(x), _merge(y)
    i = j = 0
    total = 0.0
    while i < len(x) and j < len(y):
        lo, hi = max(x[i][0], y[j][0]), min(x[i][1], y[j][1])
        if hi > lo:
            total += hi - lo
        if x[i][1] < y[j][1]:
            i += 1
        else:
            j += 1
    return total


def match_score(x: list, y: list) -> tuple:
    """(share of the SHORTER clip that is common, intersection over union)."""
    inter, dx, dy = overlap(x, y), seconds(x), seconds(y)
    if not inter or not dx or not dy:
        return 0.0, 0.0
    return inter / min(dx, dy), inter / (dx + dy - inter)


def best_match(pick_segs: list, judged: list) -> Optional[dict]:
    """The judged clip a new pick corresponds to, or None. A candidate must share >= MATCH_MIN of the shorter
    clip; among candidates the highest intersection-over-union wins, which tells a long clip from the short
    impact clip cut out of it."""
    best, best_key = None, (0.0, 0.0)
    for c in judged:
        if not c.get("segments"):
            continue
        share, iou = match_score(pick_segs, c["segments"])
        if share >= MATCH_MIN and (iou, share) > best_key:
            best, best_key = c, (iou, share)
    return best


# ── the prompt version ───────────────────────────────────────────────────────

def git_blob_hash(path: Path) -> str:
    """The hash Git gives this file's content (line endings normalised), so a committed version can be read
    back later with `git cat-file -p <hash>`."""
    data = path.read_bytes().replace(b"\r\n", b"\n")
    return hashlib.sha1(b"blob %d\0" % len(data) + data).hexdigest()


def agent_model() -> Optional[str]:
    """`model/effort` from the clip-strategist's frontmatter, e.g. "fable/max"."""
    try:
        head = AGENT.read_text(encoding="utf-8").split("---", 2)[1]
    except (OSError, IndexError):
        return None
    got = {k: (re.search(rf"^{k}:\s*(\S+)", head, re.M) or [None, None])[1] for k in ("model", "effort")}
    return "/".join(v for v in (got["model"], got["effort"]) if v) or None


def prompt_info(template: str) -> dict:
    """The version of everything that steers the strategist: its agent file, the two doctrine skills it reads,
    and the instruction text the graph sends (`template` = that text with placeholders for the paths)."""
    parts = {k: (git_blob_hash(p) if p.is_file() else None) for k, p in PROMPT_FILES.items()}
    parts["template"] = hashlib.sha1(template.replace("\r\n", "\n").encode("utf-8")).hexdigest()
    joined = "|".join(f"{k}={parts[k]}" for k in sorted(parts))
    return {"prompt_version": hashlib.sha1(joined.encode("utf-8")).hexdigest()[:12],
            "prompt_parts": parts, "model": agent_model()}


def fell_back(log: Path, offset: int, limit_re) -> bool:
    """True when the agent log shows the Fable-limit refusal since `offset` (so the run finished on Opus)."""
    try:
        with open(log, "rb") as f:
            f.seek(offset)
            return bool(limit_re.search(f.read().decode("utf-8", "replace")))
    except OSError:
        return False


# ── what the batch graph calls ───────────────────────────────────────────────

def save_transcripts(batch: str, sources: dict, master_seconds=None, brief=None) -> int:
    """Keep the transcript files the strategist read (cleanup recycles the originals with the batch)."""
    dest = transcripts_dir(batch)
    copied = 0
    for key, name in TRANSCRIPT_FILES.items():
        src = sources.get(key)
        if src and Path(src).is_file() and not (dest / name).is_file():
            dest.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dest / name)
            copied += 1
    meta_path = dest / "meta.json"
    if dest.is_dir() and not meta_path.is_file():
        _write_json_atomic(meta_path, {
            "v": SCHEMA, "batch": batch, "saved_at": now_iso(),
            "master_seconds": round(float(master_seconds), 2) if master_seconds else None,
            "last_word_seconds": last_word_seconds(dest / TRANSCRIPT_FILES["words"]),
            "brief": brief if brief and brief != "none" else None,
        })
    return copied


def last_word_seconds(words_file: Path) -> Optional[float]:
    """The time of the last spoken word, read off the word-timing file ([MM:SS.ss] or [H:MM:SS.ss])."""
    try:
        stamps = re.findall(r"^\[(\d+(?::\d+){1,2}(?:\.\d+)?)\]", words_file.read_text(encoding="utf-8"), re.M)
    except OSError:
        return None
    return clock_to_seconds(stamps[-1]) if stamps else None


def stamp_selection(batch: str, plan_path: Path, template: str, brief, sources: dict,
                    master_seconds=None, fallback_model: Optional[str] = None) -> str:
    """Right after the strategist's plan validates: write WHICH PROMPT produced it into clip-plan.json (the
    prompt can change before the gate is approved, hours later) and keep the transcripts."""
    info = prompt_info(template)
    if fallback_model:
        info["model"] = f"{fallback_model} (Fable fallback)"
    plan = json.loads(Path(plan_path).read_text(encoding="utf-8"))
    plan["eval"] = {**info, "brief": brief if brief and brief != "none" else None, "selected_at": now_iso()}
    _write_json_atomic(Path(plan_path), plan)
    save_transcripts(batch, sources, master_seconds, brief)
    return info["prompt_version"]


def _verdict_line(batch, gate, clip, verdict, at, meta, with_proposal, source) -> dict:
    segs = segs_of(clip)
    line = {
        "v": SCHEMA, "type": "verdict", "batch": batch, "clip_id": clip.get("clip_id"),
        "slug": clip.get("slug"), "gate": gate, "verdict": verdict, "at": at,
        "segments": segs or None, "seconds": seconds(segs) if segs else None,
        "prompt_version": meta.get("prompt_version"), "model": meta.get("model"), "source": source,
    }
    if not segs:
        line["matched"] = False          # a kill with no proposal to tie it to: kept as a fact, left out of scores
    if with_proposal and segs:
        line.update({"title": clip.get("title"), "variant": clip.get("variant"), "brief": meta.get("brief"),
                     "prompt_parts": meta.get("prompt_parts"), "proposal": clip})
    return line


def record_gate(batch: str, gate: str, plan: dict, missed: Optional[str] = None, at: Optional[str] = None,
                source: str = "gate") -> dict:
    """Write one gate's verdicts. `plan` is clip-plan.json AFTER the gate's deletes were applied: `clips` are the
    survivors ("kept"), and `deleted_at_gate` rows for this gate are the kills (they carry the full clip).
    Safe to call twice: a (batch, clip, gate) already on record is skipped."""
    at = at or now_iso()
    old = read_record()
    have = {(x.get("batch"), x.get("clip_id"), x.get("gate")) for x in old if x.get("type") == "verdict"}
    has_proposal = {(x.get("batch"), x.get("clip_id")) for x in old if x.get("proposal")}
    meta = plan.get("eval") or {}
    new, counts = [], {"kept": 0, "killed": 0, "already": 0, "missed": 0}

    def add(clip, verdict, when):
        key = (batch, clip.get("clip_id"), gate)
        if key in have:
            counts["already"] += 1
            return
        have.add(key)
        new.append(_verdict_line(batch, gate, clip, verdict, when, meta,
                                 (batch, clip.get("clip_id")) not in has_proposal, source))
        counts[verdict] += 1

    for clip in plan.get("clips") or []:
        add(clip, "kept", at)
    for row in plan.get("deleted_at_gate") or []:
        if row.get("gate") == gate:
            add(row.get("clip") or {"clip_id": row.get("clip_id"), "slug": row.get("slug")}, "killed",
                row.get("at") or at)
    append_jsonl(record_path(), new)
    if missed:
        counts["missed"] = record_missed(batch, missed, gate=gate, at=at, source=source)
    return counts


def clock_to_seconds(text: str) -> float:
    parts = [float(p) for p in text.split(":")]
    return round(sum(p * 60 ** i for i, p in enumerate(reversed(parts))), 2)


_CLOCK = r"\d{1,3}:\d{2}(?::\d{2})?(?:\.\d+)?"
_MISS_RE = re.compile(rf"^\s*({_CLOCK})(?:\s*(?:-|to)\s*({_CLOCK}))?\s*[,:]?\s*(.*)$", re.S)


def parse_missed(text: str) -> list:
    """"12:30-14:10 the ETF rant; 45:00 kaspa hashrate" -> one item per `;` or line. A time range or a single
    timestamp is optional (times are the vertical master's, as printed in the 90 s chunk transcript). "none"
    means the review found nothing missing, which is what lets recall be 100% instead of unknown."""
    if (text or "").strip().lower() in ("none", "no", "nothing", "0"):
        return [{"none": True, "start": None, "end": None, "note": None}]
    items = []
    for raw in re.split(r"[;\n]+", text or ""):
        raw = raw.strip()
        if not raw:
            continue
        m = _MISS_RE.match(raw)
        if m:
            start = clock_to_seconds(m.group(1))
            end = clock_to_seconds(m.group(2)) if m.group(2) else None
            if end is not None and end <= start:
                end = None
            items.append({"none": False, "start": start, "end": end, "note": m.group(3).strip() or None})
        else:
            items.append({"none": False, "start": None, "end": None, "note": raw})
    return items


def record_missed(batch: str, text: str, gate: Optional[str] = None, at: Optional[str] = None,
                  source: str = "cli") -> int:
    old = read_record()
    have = {(x.get("batch"), x.get("none"), x.get("start"), x.get("end"), x.get("note"))
            for x in old if x.get("type") == "missed"}
    new = []
    for item in parse_missed(text):
        key = (batch, item["none"], item["start"], item["end"], item["note"])
        if key in have:
            continue
        have.add(key)
        new.append({"v": SCHEMA, "type": "missed", "batch": batch, "gate": gate, "at": at or now_iso(),
                    **item, "source": source})
    append_jsonl(record_path(), new)
    return len(new)


# ── scoring ──────────────────────────────────────────────────────────────────

def clip_table(lines: list, batch: Optional[str] = None) -> dict:
    """The record folded to one row per clip: {(batch, clip_id): {gates: {"4b": "kept", ...}, segments, ...}}."""
    clips = {}
    for x in lines:
        if x.get("type") != "verdict" or (batch and x.get("batch") != batch):
            continue
        c = clips.setdefault((x["batch"], x.get("clip_id")), {
            "batch": x["batch"], "clip_id": x.get("clip_id"), "slug": None, "title": None, "segments": None,
            "prompt_version": None, "model": None, "gates": {}, "matched": True})
        c["gates"][x.get("gate")] = x.get("verdict")
        for f in ("slug", "title", "segments", "prompt_version", "model"):
            if x.get(f) and not c[f]:
                c[f] = x[f]
        if x.get("matched") is False:
            c["matched"] = False
    return clips


def miss_table(lines: list, batch: Optional[str] = None) -> dict:
    """{batch: [missed items]}. A batch is in here only when a miss review was recorded (items may be empty)."""
    out = {}
    for x in lines:
        if x.get("type") != "missed" or (batch and x.get("batch") != batch):
            continue
        items = out.setdefault(x["batch"], [])
        if not x.get("none"):
            items.append(x)
    return out


def _pct(num, den):
    return round(100.0 * num / den, 1) if den else None


def score_record(lines: list, batch: Optional[str] = None) -> dict:
    """Precision and recall straight from the gate record, per prompt version (and model)."""
    clips, misses = clip_table(lines, batch), miss_table(lines, batch)
    groups, unmatched = {}, []
    for c in clips.values():
        if not c["matched"]:
            unmatched.append(c)
            continue
        key = f"{c['prompt_version'] or 'not recorded'} | {c['model'] or 'unknown'}"
        g = groups.setdefault(key, {"prompt_version": c["prompt_version"], "model": c["model"], "batches": set(),
                                    "clips": []})
        g["batches"].add(c["batch"])
        g["clips"].append(c)
    # a batch whose kills cannot be tied to a proposal has no trustworthy "kept" list either: leave it out whole
    bad_batches = {c["batch"] for c in unmatched}
    rows = []
    for key in sorted(groups):
        g = groups[key]
        cl = [c for c in g["clips"] if c["batch"] not in bad_batches and "4b" in c["gates"]]
        kept = [c for c in cl if c["gates"]["4b"] == "kept"]
        second = [c for c in cl if "2nd" in c["gates"]]
        reached_2nd = {c["batch"] for c in second}
        judged_reached = [c for c in cl if c["batch"] in reached_2nd]
        final_kept = [c for c in second if c["gates"]["2nd"] == "kept"]
        rb = sorted(b for b in g["batches"] if b in misses and b not in bad_batches)
        kept_rb = sum(1 for c in kept if c["batch"] in rb)
        n_missed = sum(len(misses[b]) for b in rb)
        rows.append({
            "group": key, "prompt_version": g["prompt_version"], "model": g["model"],
            "batches": len({c["batch"] for c in cl}), "judged": len(cl), "kept_4b": len(kept),
            "killed_4b": len(cl) - len(kept), "selection_precision": _pct(len(kept), len(cl)),
            "killed_2nd": len(second) - len(final_kept),
            "final_precision": _pct(len(final_kept), len(judged_reached)),
            "recall_batches": len(rb), "missed": n_missed, "recall": _pct(kept_rb, kept_rb + n_missed),
        })
    return {"rows": rows,
            "unmatched": sorted({(c["batch"], c["clip_id"]) for c in unmatched}, key=str),
            "left_out_batches": sorted(bad_batches)}


def load_replays(batch: Optional[str] = None) -> list:
    out = []
    for p in sorted(replays_dir().glob("*.json")) if replays_dir().is_dir() else []:
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except ValueError:
            _warn(f"{p.name} is not JSON, skipped")
            continue
        if isinstance(d, dict) and d.get("plan") and (not batch or d.get("batch") == batch):
            d["file"] = p.name
            out.append(d)
    return out


def _found_miss(segs: list, items: list) -> Optional[dict]:
    for m in items:
        if m.get("start") is None:
            continue
        if m.get("end") is not None:
            span = [[m["start"], m["end"]]]
            if overlap(segs, span) >= min(10.0, 0.3 * min(seconds(segs), seconds(span))):
                return m
        elif any(a - MISS_NEAR_S <= m["start"] <= b + MISS_NEAR_S for a, b in segs):
            return m
    return None


def score_replay(rep: dict, clips: dict, misses: dict) -> dict:
    """One replay against the recorded verdicts of its batch. The 4b verdict is the answer key: 4b judges the
    CHOICE of clip, while a 2nd-gate kill may judge the edit."""
    batch = rep.get("batch")
    judged = [c for c in clips.values() if c["batch"] == batch and c["matched"] and "4b" in c["gates"]]
    kept = {c["clip_id"] for c in judged if c["gates"]["4b"] == "kept"}
    killed = {c["clip_id"] for c in judged if c["gates"]["4b"] == "killed"}
    res = {"file": rep.get("file"), "batch": batch, "prompt_version": rep.get("prompt_version"),
           "model": rep.get("model"), "picks": 0, "hit": 0, "bad": 0, "found_miss": 0, "unjudged": 0,
           "kept_total": len(kept), "killed_total": len(killed), "kept_refound": set(), "killed_repicked": set(),
           "detail": []}
    for p in (rep.get("plan") or {}).get("clips") or []:
        segs = segs_of(p)
        if not segs:
            continue
        res["picks"] += 1
        m = best_match(segs, judged)
        if m and m["gates"]["4b"] == "killed":
            res["bad"] += 1
            res["killed_repicked"].add(m["clip_id"])
            what = f"re-picks KILLED clip {m['clip_id']} ({m['slug']})"
        elif m:
            res["hit"] += 1
            res["kept_refound"].add(m["clip_id"])
            what = f"matches kept clip {m['clip_id']} ({m['slug']})"
        else:
            miss = _found_miss(segs, misses.get(batch) or [])
            if miss:
                res["found_miss"] += 1
                what = f"finds a recorded miss ({miss.get('note') or 'no note'})"
            else:
                res["unjudged"] += 1
                what = "no verdict on record (new territory)"
        res["detail"].append({"slug": p.get("slug"), "seconds": seconds(segs), "result": what})
    return res


def score_replays(lines: list, batch: Optional[str] = None) -> dict:
    clips, misses = clip_table(lines), miss_table(lines)
    per = [score_replay(r, clips, misses) for r in load_replays(batch)]
    groups = {}
    for r in per:
        key = f"{r['prompt_version'] or 'unknown'} | {r['model'] or 'unknown'}"
        g = groups.setdefault(key, {"group": key, "replays": 0, "picks": 0, "hit": 0, "bad": 0, "found_miss": 0,
                                    "unjudged": 0, "kept_total": 0, "killed_total": 0, "kept_refound": 0,
                                    "killed_repicked": 0})
        g["replays"] += 1
        for f in ("picks", "hit", "bad", "found_miss", "unjudged", "kept_total", "killed_total"):
            g[f] += r[f]
        g["kept_refound"] += len(r["kept_refound"])
        g["killed_repicked"] += len(r["killed_repicked"])
    rows = []
    for key in sorted(groups):
        g = groups[key]
        good = g["hit"] + g["found_miss"]
        g["precision_on_judged"] = _pct(good, good + g["bad"])
        g["kept_refound_pct"] = _pct(g["kept_refound"], g["kept_total"])
        g["killed_repicked_pct"] = _pct(g["killed_repicked"], g["killed_total"])
        rows.append(g)
    for r in per:
        r["kept_refound"], r["killed_repicked"] = sorted(r["kept_refound"]), sorted(r["killed_repicked"])
    return {"rows": rows, "replays": per}


def _fmt(v, suffix="%"):
    return "-" if v is None else f"{v}{suffix}"


def print_score(rec: dict, rep: dict, detail: bool = True):
    print("FROM THE GATE RECORD (what was proposed, and what was kept or killed)")
    print(f"  {'prompt version | model':44s} {'batches':>7s} {'judged':>6s} {'kept':>5s} {'kill 4b':>7s} "
          f"{'precision':>9s} {'kill 2nd':>8s} {'final':>7s} {'recall':>14s}")
    for r in rec["rows"]:
        recall = (f"{_fmt(r['recall'])} ({r['recall_batches']} b.)" if r["recall_batches"] else "not reviewed")
        print(f"  {r['group'][:44]:44s} {r['batches']:7d} {r['judged']:6d} {r['kept_4b']:5d} {r['killed_4b']:7d} "
              f"{_fmt(r['selection_precision']):>9s} {r['killed_2nd']:8d} {_fmt(r['final_precision']):>7s} "
              f"{recall:>14s}")
    if not rec["rows"]:
        print("  (nothing on record yet)")
    if rec["left_out_batches"]:
        print(f"  left out (a kill that cannot be tied to a proposal): {', '.join(rec['left_out_batches'])}")
    print("\nREPLAYS (old transcripts re-run under a later prompt, matched to the 4b verdicts)")
    print(f"  {'prompt version | model':44s} {'replays':>7s} {'picks':>5s} {'kept':>5s} {'killed':>6s} "
          f"{'misses':>6s} {'new':>4s} {'precision':>9s} {'kept found':>10s} {'kills repicked':>14s}")
    for g in rep["rows"]:
        print(f"  {g['group'][:44]:44s} {g['replays']:7d} {g['picks']:5d} {g['hit']:5d} {g['bad']:6d} "
              f"{g['found_miss']:6d} {g['unjudged']:4d} {_fmt(g['precision_on_judged']):>9s} "
              f"{_fmt(g['kept_refound_pct']):>10s} {_fmt(g['killed_repicked_pct']):>14s}")
    if not rep["rows"]:
        print("  (no replays yet: python clip_evals.py replay --batch <batch>)")
    if detail:
        for r in rep["replays"]:
            print(f"\n  {r['file']}")
            for d in r["detail"]:
                print(f"    {d['seconds']:6.1f}s  {str(d['slug'])[:46]:46s} {d['result']}")


def save_score(rec: dict, rep: dict) -> bool:
    """Append this score to scores.jsonl, unless it is identical to the last one saved."""
    body = {"record": rec["rows"], "replays": [{k: v for k, v in g.items()} for g in rep["rows"]]}
    old = read_jsonl(scores_path())
    if old and {k: old[-1].get(k) for k in body} == body:
        return False
    append_jsonl(scores_path(), [{"v": SCHEMA, "at": now_iso(), **body}])
    return True


# ── commands ─────────────────────────────────────────────────────────────────

def cmd_score(args) -> int:
    lines = read_record()
    rec, rep = score_record(lines, args.batch), score_replays(lines, args.batch)
    if args.json:
        print(json.dumps({"record": rec, "replays": rep}, indent=2, ensure_ascii=False))
    else:
        print_score(rec, rep)
    if not args.batch and (rec["rows"] or rep["rows"]) and save_score(rec, rep) and not args.json:
        print(f"\nsaved to {scores_path()}")
    return 0


def cmd_list(args) -> int:
    lines = read_record()
    clips, misses, reps = clip_table(lines), miss_table(lines), load_replays()
    batches = sorted({c["batch"] for c in clips.values()})
    print(f"{record_path()}: {len(lines)} lines, {len(batches)} batches")
    print(f"  {'batch':26s} {'prompt version':14s} {'model':24s} {'4b kept/killed':>14s} {'2nd kept/killed':>15s} "
          f"{'misses':>8s} {'transcript':>10s} {'replays':>7s}")
    for b in batches:
        cl = [c for c in clips.values() if c["batch"] == b]

        def tally(gate):
            got = [c["gates"][gate] for c in cl if gate in c["gates"]]
            return f"{got.count('kept')}/{got.count('killed')}" if got else "-"
        pv = next((c["prompt_version"] for c in cl if c["prompt_version"]), None) or "not recorded"
        model = next((c["model"] for c in cl if c["model"]), None) or "unknown"
        miss = str(len(misses[b])) if b in misses else "not asked"
        saved = "saved" if (transcripts_dir(b) / TRANSCRIPT_FILES["chunks"]).is_file() else "gone"
        print(f"  {b[:26]:26s} {pv:14s} {model[:24]:24s} {tally('4b'):>14s} {tally('2nd'):>15s} {miss:>8s} "
              f"{saved:>10s} {sum(1 for r in reps if r.get('batch') == b):7d}")
    return 0


def cmd_missed(args) -> int:
    n = record_missed(args.batch, args.text, gate=args.gate, source="cli")
    print(f"recorded {n} new missed line(s) for {args.batch}")
    return 0


def cmd_record(args) -> int:
    plan_path = SHORTS / args.batch / "clip-plan.json"
    if not plan_path.is_file():
        print(f"no plan on disk: {plan_path}", file=sys.stderr)
        return 1
    counts = record_gate(args.batch, args.gate, json.loads(plan_path.read_text(encoding="utf-8")),
                         missed=args.missed, source="repair")
    print(f"{args.batch} gate {args.gate}: {counts}")
    return 0


REPLAY_NOTE = (
    "\n\nREPLAY FOR EVALUATION, NOT A PRODUCTION RUN. Nothing will be cut from this plan. The vertical master is "
    "NOT on disk: {length}. Do not run ffmpeg, ffprobe or cut_topics.py. Work ONLY from the three transcript files "
    "listed above, and from nothing else about this batch: do not open any earlier plan for it, and do not read "
    "anything else under `video-creation/livestream-repurpose/evals/` (that folder holds the answer key). Write "
    "ONLY the plan file named above, in the same schema, then finish."
)


def check_replay_plan(plan, limit: Optional[float]) -> Optional[str]:
    clips = plan.get("clips") if isinstance(plan, dict) else None
    if not isinstance(clips, list) or not clips:
        return "the plan has no clips[]"
    for c in clips:
        segs = segs_of(c)
        if not segs or len(segs) != len(c.get("segments") or []):
            return f"clip {c.get('slug')!r} has a missing or bad segment"
        if limit and max(b for _, b in segs) > limit:
            return f"clip {c.get('slug')!r} ends after the recording ({limit:.0f}s)"
    return None


def cmd_replay(args) -> int:
    batch = args.batch
    tdir = transcripts_dir(batch)
    files = {k: tdir / name for k, name in TRANSCRIPT_FILES.items()}
    if not files["chunks"].is_file():
        print(f"no saved transcript for {batch} ({files['chunks']}); it cannot be replayed", file=sys.stderr)
        return 1
    meta = json.loads((tdir / "meta.json").read_text(encoding="utf-8")) if (tdir / "meta.json").is_file() else {}
    sys.path.insert(0, str(LSR / "graph"))
    import batch_graph as bg  # noqa: E402  (heavy import: only the replay needs it)

    info = prompt_info(bg.clip_prompt_template())
    replays_dir().mkdir(parents=True, exist_ok=True)
    n = len(list(replays_dir().glob(f"{batch}--{info['prompt_version']}--r*.json"))) + 1
    dest = replays_dir() / f"{batch}--{info['prompt_version']}--r{n}.json"
    brief = args.brief if args.brief is not None else meta.get("brief")
    master, last = meta.get("master_seconds"), meta.get("last_word_seconds")
    limit = (master + 0.5) if master else ((last + 30.0) if last else None)
    length = (f"it is {master:.0f} s long, so no segment may end after that" if master else
              f"the last word is spoken at {last:.0f} s, so no segment may end after that" if last else
              "no segment may end after the last word of the transcript")
    prompt = bg.clip_prompt_text(batch, files["chunks"], files["plain"], files["words"],
                                 "NOT ON DISK (evaluation replay)", dest, brief or "none")
    prompt += REPLAY_NOTE.format(length=length)
    log_name = f"agent-clip-strategist-replay-{batch}.log"
    log = bg.DATA / log_name
    offset = log.stat().st_size if log.is_file() else 0
    print(f"[clip-evals] replaying {batch} under prompt {info['prompt_version']} -> {dest.name}", flush=True)
    rc, out = bg.spawn_agent({"batch": batch, "no_heartbeat": True}, "evals_replay", "clip-strategist", prompt,
                             log_name)
    if not bg.persist_agent_json(out, dest, want_key="clips"):
        print(f"replay failed: clip-strategist exit {rc} and no plan was written. tail:\n{out[-800:]}",
              file=sys.stderr)
        return 1
    plan = json.loads(dest.read_text(encoding="utf-8"))
    problem = check_replay_plan(plan, limit)
    if problem:
        dest.rename(dest.with_suffix(".invalid.json"))
        print(f"replay plan INVALID ({problem}); kept as {dest.with_suffix('.invalid.json').name}, not scored",
              file=sys.stderr)
        return 1
    if fell_back(log, offset, bg.FABLE_LIMIT_RE):
        info["model"] = f"{bg.FABLE_FALLBACK_MODEL} (Fable fallback)"
    _write_json_atomic(dest, {"v": SCHEMA, "batch": batch, **info, "brief": brief, "replayed_at": now_iso(),
                              "plan": plan})
    lines = read_record()
    res = score_replay({**json.loads(dest.read_text(encoding="utf-8")), "file": dest.name},
                       clip_table(lines), miss_table(lines))
    print(f"\n{dest.name}: {res['picks']} picks | {res['hit']} match a kept clip | {res['bad']} re-pick a "
          f"killed clip | {res['found_miss']} find a recorded miss | {res['unjudged']} have no verdict")
    for d in res["detail"]:
        print(f"  {d['seconds']:6.1f}s  {str(d['slug'])[:46]:46s} {d['result']}")
    print("\nfull table: python video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py score")
    return 0


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass
    ap = argparse.ArgumentParser(description="The eval score layer for the livestream clip-strategist.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("score", help="precision / recall from the record, and every replay against it")
    s.add_argument("--batch")
    s.add_argument("--json", action="store_true")
    s.set_defaults(fn=cmd_score)
    s = sub.add_parser("list", help="what is on record, batch by batch")
    s.set_defaults(fn=cmd_list)
    s = sub.add_parser("replay", help="re-run the clip-strategist on a saved transcript and score its picks")
    s.add_argument("--batch", required=True)
    s.add_argument("--brief", default=None, help="override the batch's original per-run brief")
    s.set_defaults(fn=cmd_replay)
    s = sub.add_parser("missed", help="record what the strategist should have found")
    s.add_argument("--batch", required=True)
    s.add_argument("--gate", choices=GATES, default=None)
    s.add_argument("text", help='"12:30-14:10 the ETF rant; 45:00 kaspa hashrate"  or  none')
    s.set_defaults(fn=cmd_missed)
    s = sub.add_parser("record", help="repair: re-record one gate from the clip-plan.json on disk")
    s.add_argument("--batch", required=True)
    s.add_argument("--gate", choices=GATES, required=True)
    s.add_argument("--missed", default=None)
    s.set_defaults(fn=cmd_record)
    args = ap.parse_args()
    return args.fn(args)


if __name__ == "__main__":
    sys.exit(main())
