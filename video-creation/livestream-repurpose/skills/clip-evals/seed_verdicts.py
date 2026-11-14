"""seed_verdicts.py: ONE-TIME backfill of evals/clip-verdicts.jsonl from what survived before the record existed.

Until 2026-11-13 a keep / kill at a gate was only kept by accident, in two places with no backup:
  * graph/data/agent-clip-strategist-<batch>.log   the strategist's full plan (every proposed clip)
  * graph/data/graph_checkpoints.sqlite            which clip numbers were deleted at gate 4b and gate 2nd, and when
This joins the two into the permanent record, and copies the transcripts that are still on disk into
evals/transcripts/ so those batches can be replayed.

What it cannot recover, and says so in the lines it writes:
  * the prompt version of an old batch (`prompt_version` is null: "not recorded")
  * a batch whose log holds an older plan format without clip numbers: its kills are written as facts
    (`matched: false`) and the batch is left out of every score
  * what the strategist missed (nobody was asked)

Safe to run again: a (batch, clip, gate) already on record is skipped.

  python seed_verdicts.py --dry-run     show what would be written
  python seed_verdicts.py               write it
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sqlite3
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import clip_evals as ce  # noqa: E402

DATA = ce.LSR / "graph" / "data"
CHECKPOINTS = DATA / "graph_checkpoints.sqlite"
BATCHES = ce.REPO_ROOT / "batches.json"
OLD_TRANSCRIPTS = ce.LSR / "transcripts"
SECTION_RE = re.compile(r"\n===== clip-strategist @ ([^\n=]+) =====\n")
DELETED_RE = re.compile(r"deleted \[([0-9, ]*)\]")
# the same wording batch_graph.FABLE_LIMIT_RE matches (this file spawns nothing, so it does not carry the constant)
FABLE_LIMIT_RE = re.compile(r"\bFable\b[^\n]{0,40}\blimit\b|\blimit\b[^\n]{0,40}\bFable\b", re.I)


def plan_from_log(log: Path):
    """(plan, fell_back): the last JSON object with clips[] in the strategist's log."""
    text = log.read_text(encoding="utf-8", errors="replace")
    cands = re.findall(r"```(?:json)?\s*([\{\[].*?[\}\]])\s*```", text, flags=re.S)
    if not cands:
        m = re.search(r"[\{\[].*[\}\]]", text, flags=re.S)
        cands = [m.group(0)] if m else []
    for raw in reversed(cands):
        try:
            d = json.loads(raw)
        except ValueError:
            continue
        if isinstance(d, dict) and d.get("clips"):
            return d, bool(FABLE_LIMIT_RE.search(text))
    return None, bool(FABLE_LIMIT_RE.search(text))


def gates_from_checkpoints() -> dict:
    """{batch: {"4b": {"at": iso, "deleted": [ids]}, "2nd": {...}}} read from a temp COPY of the checkpoint DB
    (a batch may be running against the real one)."""
    from langgraph.checkpoint.sqlite import SqliteSaver
    out = {}
    with tempfile.TemporaryDirectory(prefix="clip-evals-seed-") as tmp:
        copy = Path(tmp) / "checkpoints.sqlite"
        shutil.copyfile(CHECKPOINTS, copy)
        conn = sqlite3.connect(str(copy), check_same_thread=False)
        try:
            saver = SqliteSaver(conn)
            threads = [r[0] for r in conn.execute(
                "select distinct thread_id from checkpoints where thread_id like 'batch-%' "
                "and thread_id not like 'batch-stub%'")]
            for thread in threads:
                for tup in saver.list({"configurable": {"thread_id": thread}}):
                    values = tup.checkpoint.get("channel_values", {})
                    batch = values.get("batch")
                    for gate in ce.GATES:
                        st = (values.get("steps") or {}).get(f"gate_{gate}") or {}
                        m = DELETED_RE.search(st.get("detail") or "")
                        if batch and st.get("status") == "ran" and m:
                            ids = [int(x) for x in m.group(1).replace(" ", "").split(",") if x]
                            out.setdefault(batch, {})[gate] = {"at": st.get("at"), "deleted": ids}
        finally:
            conn.close()
    return out


def briefs() -> dict:
    try:
        d = json.loads(BATCHES.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return {e.get("batch"): (e.get("briefs") or {}).get("clips") for e in d.get("batches", [])}


def build(dry_run: bool) -> int:
    gates, brief_of = gates_from_checkpoints(), briefs()
    old = ce.read_record()
    have = {(x.get("batch"), x.get("clip_id"), x.get("gate")) for x in old if x.get("type") == "verdict"}
    new, report = [], []
    for log in sorted(DATA.glob("agent-clip-strategist-*.log")):
        batch = log.name[len("agent-clip-strategist-"):-len(".log")]
        if batch.startswith("replay-"):
            continue
        plan, fell_back = plan_from_log(log)
        g = gates.get(batch) or {}
        if not plan or "4b" not in g:
            report.append(f"  {batch:26s} SKIPPED ({'no plan in the log' if not plan else 'gate 4b never approved'})")
            continue
        meta = {"prompt_version": None, "prompt_parts": None, "brief": brief_of.get(batch),
                "model": "opus (Fable fallback)" if fell_back else "fable"}
        clips = plan["clips"]
        numbered = all(isinstance(c.get("clip_id"), int) for c in clips)
        ids = {c["clip_id"] for c in clips} if numbered else set()
        killed_all = set(g["4b"]["deleted"]) | set((g.get("2nd") or {}).get("deleted") or [])
        lines = []
        if numbered and killed_all <= ids:
            alive = list(clips)
            for gate in ce.GATES:
                if gate not in g:
                    break
                dead = set(g[gate]["deleted"])
                for c in alive:
                    lines.append(ce._verdict_line(batch, gate, c, "killed" if c["clip_id"] in dead else "kept",
                                                  g[gate]["at"], meta, gate == "4b", "seed"))
                alive = [c for c in alive if c["clip_id"] not in dead]
            note = f"{len(clips)} proposed, {len(killed_all)} killed"
        else:
            # an older plan format (no clip numbers), or a kill that names a clip the log's plan does not have:
            # keep the kills as facts, tie them to nothing
            for gate in ce.GATES:
                for cid in (g.get(gate) or {}).get("deleted") or []:
                    lines.append(ce._verdict_line(batch, gate, {"clip_id": cid}, "killed", g[gate]["at"], meta,
                                                  False, "seed"))
            note = f"UNMATCHED: {len(lines)} kill(s) kept as facts, the batch is left out of scores"
        fresh = [x for x in lines if (x["batch"], x["clip_id"], x["gate"]) not in have]
        new.extend(fresh)
        tdir = OLD_TRANSCRIPTS / f"{batch} LOW BPS VERTICAL"
        srcs = {k: next(iter(tdir.glob(f"*_{suffix}")), None) if tdir.is_dir() else None
                for k, suffix in (("chunks", "chunks_90s.txt"), ("plain", "plain.txt"), ("words", "words.txt"))}
        can_save = bool(srcs["chunks"]) and not (ce.transcripts_dir(batch) / ce.TRANSCRIPT_FILES["chunks"]).is_file()
        if can_save and not dry_run:
            ce.save_transcripts(batch, srcs, None, brief_of.get(batch))
        report.append(f"  {batch:26s} {note}; {len(fresh)} new line(s)"
                      + ("; transcript saved" if can_save else ""))
    print(("DRY RUN: nothing written\n" if dry_run else "") + "\n".join(report))
    print(f"\n{len(new)} line(s) " + ("would be appended to " if dry_run else "appended to ") + str(ce.record_path()))
    if not dry_run:
        ce.append_jsonl(ce.record_path(), new)
    return 0


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass
    ap = argparse.ArgumentParser(description="One-time backfill of the clip verdict record.")
    ap.add_argument("--dry-run", action="store_true")
    sys.exit(build(ap.parse_args().dry_run))
