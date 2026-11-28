#!/usr/bin/env python
"""
reconcile_batch_status.py: derive each batch's lifecycle status from the queues.

Python port of reconcile-batch-status.js (2026-11-27; the JS was deleted the same day). It prints the same
table and writes batches.json byte for byte as the JS did (2-space indent, non-ASCII kept as is, LF, one
trailing newline; checked on the real registry). Two kinds of number the registry does not hold today would
be written differently, with the value kept: a whole number above 2**53 stays exact (JS rounded it), and a
fraction below 0.0001 is written in exponent form (1e-06).

The single source of truth for whether a batch is finished is the publishing state in
schedule-tweets/data/{shorts,longs}.json, NOT the hand-maintained pipeline flags (which drift: a batch can read
`pipelines.shorts: "active"` long after all its shorts posted). This script recomputes batches.json `status`
from the queues, so cleanup can reclaim a batch's source artifacts the moment it is fully published, and never
before.

Status it writes (top-level `batches[].status`):
  active     still has unposted shorts/longs, OR nothing queued yet, OR repurpose pending.
             cleanup PROTECTS an active batch's folders.
  completed  every queued short AND long of this batch is posted everywhere, and the repurpose lane is done.
             cleanup may RECLAIM it. (Replaces the old "archived"; cleanup still honours "archived" as a
             synonym.)

Completion rule: a batch is `completed` only when ALL of:
  1. it has at least one queued item (short or long) carrying its batch id: this guards against marking a
     batch complete that was produced but never published;
  2. every queued short with batch == <id> is fully posted (no platform pending / posting / failed);
  3. every queued long with batch == <id> is fully posted;
  4. pipelines.repurpose is not "pending" (the transcript is still needed by the tweet/image lane until
     repurpose is done: completing early would let cleanup recycle it);
  5. FRESHNESS GUARD: none of the batch's own files were written in the last FRESH_HOURS (6). Rules 1-4 read
     the queue, but a batch mid-build has produced NOTHING to the queue yet, so an in-flight project can look
     identical to a finished one. See below.

NOTE: the queue is treated as the publish manifest. Clips rendered but never staged to shorts.json are
invisible here: stage them, or the batch may complete without them.

WHY THE FRESHNESS GUARD (Mike, 2026-08-12): `johnny` was cut that morning; its longform posted while its two
shorts were still being built and had never been staged to shorts.json. So the queue read 1/1 longs, 0/0
shorts, repurpose done: rules 1-4 all passed, the batch flipped to `completed`, and cleanup recycled its source
master + transcripts WHILE lane 2 was running on them. A brand-new project that is still being processed must
never be reclaimable. The guard holds any batch whose files are still being written; once the work goes quiet
for FRESH_HOURS the normal queue-derived rules take over, so nothing is pinned `active` for ever.

The guard deliberately does NOT consult `pipelines.shorts`: those flags drift (see above) and would peg
long-finished batches `active` for good. Recent write activity corrects itself.

MANUAL OVERRIDE: a batch that never flows through the queues (a longform uploaded by hand, never staged to
longs.json) cannot be derived and would stay `active` for ever. Set `manual_status` ("completed" | "active")
on that batch and this script honours it as written, skipping derivation, so a later run never reverts the
hand-set value.

Usage:
  python scripts/reconcile_batch_status.py [--dry-run]
  --dry-run : print the table + the flips it WOULD make, write nothing.

BATCH_FRESH_HOURS=<n> changes the freshness window for one run (0 turns the guard off).
cleanup/cleanup.py runs this first, on every run.
"""
import argparse
import json
import math
import os
import re
import stat
import sys
import time
from decimal import ROUND_HALF_UP, Decimal

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BATCHES = os.path.join(REPO_ROOT, "batches.json")
SHORTS = os.path.join(REPO_ROOT, "schedule-tweets", "data", "shorts.json")
LONGS = os.path.join(REPO_ROOT, "schedule-tweets", "data", "longs.json")

MISSING = object()          # a field the JSON object does not have (JS: undefined)

# A platform slot is "done" in any of these terminal states; everything else (pending / posting / failed)
# means the item is not fully published yet.
DONE = {"posted", "posted_unverified", "skip", "skipped"}

_INDEX_KEY = re.compile(r"0|[1-9][0-9]*")


def fresh_hours():
    """The freshness window (rule 5): a batch touched this recently is still in flight. BATCH_FRESH_HOURS
    overrides it for one run: 0 (or anything that is not a number) turns the guard off."""
    raw = os.environ.get("BATCH_FRESH_HOURS")
    if raw is None:
        return 6.0
    if not raw.strip():
        return 0.0
    try:
        return float(raw.strip())
    except ValueError:
        return math.nan


# ── JSON in, the same JSON out ────────────────────────────────────────────────────────────────────────
def _js_object(pairs):
    """A JSON object with its keys in the order a JS object lists them: whole-number names first, lowest
    first, then every other name as written. batches.json has no such key today; this keeps the file the
    same if one ever appears."""
    d = dict(pairs)
    index = sorted((k for k in d if _INDEX_KEY.fullmatch(k) and int(k) < 2 ** 32 - 1), key=int)
    if not index:
        return d
    seen = set(index)
    return {**{k: d[k] for k in index}, **{k: v for k, v in d.items() if k not in seen}}


def _js_float(text):
    """1.0 is written back as 1, as JS wrote it."""
    f = float(text)
    return int(f) if f.is_integer() and abs(f) < 1e21 else f


def _no_constant(name):
    raise ValueError(f"{name} is not valid JSON")


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.loads(f.read(), object_pairs_hook=_js_object, parse_float=_js_float, parse_constant=_no_constant)


def rows_of(data, key):
    """data[key] as a list ([] when the file holds no such list)."""
    rows = data.get(key) if isinstance(data, dict) else None
    return rows if isinstance(rows, list) else []


def dump(path, data):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


# ── JS-shaped comparisons (so an odd registry entry is judged as it always was) ───────────────────────
def truthy(v):
    if v is MISSING or v is None or v is False:
        return False
    if isinstance(v, (int, float)) and not isinstance(v, bool):
        return v == v and v != 0
    if isinstance(v, str):
        return v != ""
    return True                                 # true, and any object or array (an empty one too)


def same(a, b):
    """JS ===: equal value AND the same kind of value."""
    if a is MISSING or b is MISSING or a is None or b is None:
        return a is b
    if isinstance(a, bool) or isinstance(b, bool):
        return isinstance(a, bool) and isinstance(b, bool) and a == b
    if isinstance(a, str) or isinstance(b, str):
        return isinstance(a, str) and isinstance(b, str) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return a == b
    return a is b                               # objects and arrays: only the very same one


def text(v):
    """A value the way a JS template string printed it."""
    if v is MISSING:
        return "undefined"
    if v is None:
        return "null"
    if v is True:
        return "true"
    if v is False:
        return "false"
    if isinstance(v, float):
        if v != v:
            return "NaN"
        if math.isinf(v):
            return "Infinity" if v > 0 else "-Infinity"
        return str(int(v)) if v.is_integer() else repr(v)
    return str(v)


def get(obj, key):
    return obj.get(key, MISSING) if isinstance(obj, dict) else MISSING


def item_posted(item):
    platforms = get(item, "platforms")
    slots = list(platforms.values()) if isinstance(platforms, dict) else []
    return all(isinstance(get(s, "status"), str) and get(s, "status") in DONE for s in slots)


def newest_write(paths):
    """The newest modified time (ms) among a batch's own files, or 0 when it owns nothing on disk. It walks
    FILES instead of trusting folder times: a folder's time also moves when something is removed from it (a
    cleanup run, a Recycle Bin restore), which would read as "fresh" for the wrong reason. Missing paths are
    skipped."""
    newest = 0.0

    def visit(p, depth):
        nonlocal newest
        if depth > 12:
            return
        try:
            st = os.stat(p)
        except OSError:
            return
        if stat.S_ISREG(st.st_mode):
            newest = max(newest, st.st_mtime_ns / 1e6)
            return
        if not stat.S_ISDIR(st.st_mode):
            return
        try:
            names = os.listdir(p)
        except OSError:
            return
        for name in names:
            visit(os.path.join(p, name), depth + 1)

    for p in paths:
        if isinstance(p, str) and p:
            visit(p if os.path.isabs(p) else os.path.join(REPO_ROOT, p), 0)
    return newest


def batch_paths(b):
    """Every on-disk location a batch declares. Used only for the freshness check."""
    dirs = b.get("directories")
    return [b.get("source_media"), b.get("transcripts_dir"), b.get("shorts_source"), b.get("dashboard"),
            *(dirs if isinstance(dirs, list) else [])]


def _one_decimal(x):
    """x with one decimal, a half rounded up (what JS toFixed(1) printed)."""
    return str(Decimal(x).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


def reconcile(reg, shorts, longs, hours, now_ms):
    """Recompute every batch's status in place. -> (rows for the table, the flips made)."""
    rows, flips = [], []
    for b in reg["batches"]:
        if not isinstance(b, dict):
            continue
        batch = get(b, "batch")
        sh = [s for s in shorts if isinstance(s, dict) and same(get(s, "batch"), batch)]
        lo = [x for x in longs if isinstance(x, dict) and same(get(x, "batch"), batch)]
        sh_pending = sum(1 for s in sh if not item_posted(s))
        lo_pending = sum(1 for x in lo if not item_posted(x))
        repurpose = get(get(b, "pipelines"), "repurpose")
        row = {"batch": batch, "shorts": f"{len(sh) - sh_pending}/{len(sh)}", "longs": f"{len(lo) - lo_pending}/{len(lo)}",
               "repurpose": repurpose if truthy(repurpose) else "-", "from": get(b, "status")}

        # Manual override. Some batches never flow through the queues (a longform published by hand, never
        # staged to longs.json), so completion cannot be derived from the publish manifest: derivation would
        # peg them `active` for ever. A human sets `manual_status` ("completed" | "active") and it is honoured
        # as written, so a later run never reverts the hand-set value.
        manual = get(b, "manual_status")
        if truthy(manual):
            new_status, why = manual, "manual_status (locked)"
        else:
            completed = True
            reasons = []
            if not sh and not lo:
                completed = False
                reasons.append("no queued items")
            if sh_pending:
                completed = False
                reasons.append(f"{sh_pending} short(s) pending")
            if lo_pending:
                completed = False
                reasons.append(f"{lo_pending} long(s) pending")
            if same(repurpose, "pending"):
                completed = False
                reasons.append("repurpose pending")

            # Rule 5, the freshness guard. Only evaluated when the queue-derived rules say "completed": a
            # batch still being written to is in flight whatever the queue shows, because work that has not
            # reached the queue is invisible to rules 1-4.
            if completed and hours > 0:
                newest = newest_write(batch_paths(b))
                age_h = (now_ms - newest) / 3600000 if newest else math.inf
                if age_h < hours:
                    completed = False
                    ago = f"{math.floor(age_h * 60 + 0.5)}m" if age_h < 1 else f"{_one_decimal(age_h)}h"
                    reasons.append(f"files written {ago} ago (<{text(hours)}h)")

            new_status = "completed" if completed else "active"
            why = "fully posted" if completed else ", ".join(reasons)

        row.update(to=new_status, why=why)
        rows.append(row)
        if not same(row["from"], new_status):
            flips.append({"batch": batch, "from": row["from"], "to": new_status})
        b["status"] = new_status
    return rows, flips


def main(argv=None):
    ap = argparse.ArgumentParser(description="Recompute each batch's status in batches.json from the post queues.")
    ap.add_argument("--dry-run", action="store_true", help="print the table and the flips it WOULD make; write nothing")
    args = ap.parse_args(argv)
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    reg = load(BATCHES)
    shorts = rows_of(load(SHORTS), "shorts")
    longs = rows_of(load(LONGS), "longs")
    rows, flips = reconcile(reg, shorts, longs, fresh_hours(), time.time() * 1000)

    # ---- report ----
    def pad(v, n):
        s = text(v)
        return s + " " * (n - len(s.encode("utf-16-le")) // 2)      # an emoji counts as two, as it did in JS

    print(pad("batch", 20), pad("shorts✓", 9), pad("longs✓", 8), pad("repurpose", 11), pad("status", 11), "  reason")
    print("-" * 86)
    for r in rows:
        arrow = text(r["to"]) if same(r["from"], r["to"]) else f"{text(r['from'])} -> {text(r['to'])}"
        print(pad(r["batch"], 20), pad(r["shorts"], 9), pad(r["longs"], 8), pad(r["repurpose"], 11),
              pad(arrow, 11), "  " + r["why"])
    print("-" * 86)

    if not flips:
        print("No status changes — batches.json already in sync.")
        return 0
    print(f"{'[DRY RUN] would flip' if args.dry_run else 'Flipping'} {len(flips)} batch(es):")
    for f in flips:
        print(f"  {text(f['batch'])}: {text(f['from'])} -> {text(f['to'])}")

    if args.dry_run:
        print("\n[DRY RUN] no file written. Re-run without --dry-run to apply.")
        return 0
    dump(BATCHES, reg)
    print(f"\nWrote {BATCHES}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
