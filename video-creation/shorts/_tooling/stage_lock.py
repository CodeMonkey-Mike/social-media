"""Cross-agent stage lock for parallel shorts builds.

WHY: a shorts build has four stages that use DIFFERENT resources:
    read/plan (none) -> generate b-roll (ChatGPT Chrome profile) -> build comp (none) -> render (CPU)
Only `chatgpt` and `render` are exclusive, and they are exclusive over DIFFERENT things, so clip N's
render can safely overlap clip N+1's image generation. Serializing whole builds wastes that overlap.

Two hard constraints this enforces:
  - `chatgpt`: all ChatGPT image generation shares ONE Chrome profile (chatgpt-profile). Two
    concurrent runs collide mid-generation and mis-capture each other's images.
  - `render`: a Remotion render uses every core (CPU-only h264 on this box, no GPU encode). This
    stage is a COUNTING lock with a HARD CEILING OF 2 CONCURRENT RENDERS (Mike, 2026-08-18, after a
    six-builder batch took the machine down). Never raise MAX_CONCURRENT["render"] above 2, and never
    render outside this lock: the ceiling is enforced here in code precisely so it cannot be
    forgotten by a build agent. `chatgpt` stays exclusive (capacity 1) for the shared Chrome profile.

Usage (from any build agent, repo root):
    python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner <slug>   # blocks
    ... generate images ...
    python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner <slug>

    python video-creation/shorts/_tooling/stage_lock.py acquire render  --owner <slug>   # blocks
    ... remotion render ...      # at most 2 builders are ever inside this section
    python video-creation/shorts/_tooling/stage_lock.py release render  --owner <slug>

`acquire` blocks (polling) until free, then writes the lock. `release` is safe to call when you do
not hold it (no-op with a warning).

STALE LOCKS. A caller that lives for the whole locked section passes `--holder-pid <its own pid>`
(the batch graph does). Such a slot is broken ONLY when that process is dead, never for its age:
on 2026-11-23 (batch `evaa-pieverse`) clip 2's image round sat out a ChatGPT image cap for 146 min
inside the graph, the 90-minute age rule broke its live lock, and clip 3's generator started on the
same Chrome profile (it only survived because the generator waits for the profile). A slot with no
holder pid (an agent calling this from a shell that exits right away) still falls back to the age
rule, --stale-min (default 90), so a crashed agent cannot wedge the pipeline forever.
"""
import argparse
import json
import os
import sys
import time

LOCK_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".locks")
STAGES = ("chatgpt", "render")

# HARD CEILINGS. `render` is 2 by Mike's standing rule (2026-08-18): never more than two shorts
# rendering at once, because Remotion encodes h264 on CPU here (no GPU path on Windows) and a
# six-way parallel build crashed the machine. Do not raise these.
#
# `chatgpt` stays 1 BY DESIGN, for TWO independent reasons (so fixing one never justifies raising
# it): (a) all generation shares ONE Chrome profile and concurrent runs mis-capture each other's
# images; (b) Mike, 2026-08-19: ChatGPT enforces account-level image caps per hour, so generating
# faster just hits the limit sooner — a second profile/account buys nothing. The intended
# optimization is the PIPELINE, not parallel generation: clip N renders while clip N+1 generates
# (the two stages hold different locks, so they already overlap). Do not propose a second profile.
MAX_CONCURRENT = {"chatgpt": 1, "render": 2}


def capacity(stage):
    return MAX_CONCURRENT.get(stage, 1)


def slot_path(stage, i):
    return os.path.join(LOCK_DIR, f"{stage}.{i}.lock")


def read_slot(stage, i):
    try:
        with open(slot_path(stage, i), encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def pid_alive(pid):
    """True when process `pid` is running. Windows: OpenProcess + GetExitCodeProcess (no tasklist
    spawn per poll); elsewhere os.kill(pid, 0)."""
    try:
        pid = int(pid)
    except (TypeError, ValueError):
        return False
    if pid <= 0:
        return False
    if os.name == "nt":
        import ctypes
        from ctypes import wintypes
        k32 = ctypes.WinDLL("kernel32", use_last_error=True)
        k32.OpenProcess.restype = wintypes.HANDLE
        h = k32.OpenProcess(0x1000, False, pid)          # PROCESS_QUERY_LIMITED_INFORMATION
        if not h:
            return ctypes.get_last_error() == 5           # ACCESS_DENIED = it exists, not ours
        try:
            code = wintypes.DWORD()
            if not k32.GetExitCodeProcess(h, ctypes.byref(code)):
                return True
            return code.value == 259                      # STILL_ACTIVE
        finally:
            k32.CloseHandle(h)
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def stale_reason(cur, stale_min, now=None):
    """Why this held slot may be broken, or None when it must be left alone."""
    now = time.time() if now is None else now
    hp = cur.get("holder_pid")
    if hp:
        return None if pid_alive(hp) else f"its holder process {hp} is gone"
    age = (now - cur.get("ts", 0)) / 60.0
    if age > stale_min:
        return f"held {age:.0f} min with no holder pid (> {stale_min} stale threshold)"
    return None


def holders(stage):
    """[(slot_index, lock_dict)] for every currently held slot of this stage."""
    out = []
    for i in range(capacity(stage)):
        cur = read_slot(stage, i)
        if cur:
            out.append((i, cur))
    return out


def acquire(stage, owner, stale_min, timeout_min, poll_s, holder_pid=None):
    """Take one of this stage's slots, blocking until one frees. Capacity is the hard ceiling.
    `holder_pid`: the long-lived process that owns the slot (see STALE LOCKS above)."""
    os.makedirs(LOCK_DIR, exist_ok=True)
    cap = capacity(stage)
    waited = 0.0
    announced = False
    while True:
        # re-entrant: already holding a slot
        for i, cur in holders(stage):
            if cur.get("owner") == owner:
                print(f"lock '{stage}' slot {i} already held by {owner} (re-entrant, ok)")
                return 0
        # break stale slots first
        for i in range(cap):
            cur = read_slot(stage, i)
            why = stale_reason(cur, stale_min) if cur else None
            if why:
                print(f"lock '{stage}' slot {i} held by {cur.get('owner')}: {why} - breaking it")
                try:
                    os.unlink(slot_path(stage, i))
                except OSError:
                    pass
        free = [i for i in range(cap) if read_slot(stage, i) is None]
        if not free:
            held = holders(stage)
            if not announced:
                who = ", ".join(f"{c.get('owner')}" for _, c in held)
                print(f"lock '{stage}' at capacity {cap}/{cap} (held by {who}); {owner} waiting...")
                announced = True
            if waited / 60.0 > timeout_min:
                print(f"TIMEOUT after {timeout_min} min waiting for a '{stage}' slot. "
                      "Not stealing; report the block.")
                return 2
            time.sleep(poll_s)
            waited += poll_s
            continue
        i = free[0]
        tmp = slot_path(stage, i) + f".{os.getpid()}.tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            rec = {"owner": owner, "pid": os.getpid(), "ts": time.time(),
                   "stage": stage, "slot": i}
            if holder_pid:
                rec["holder_pid"] = int(holder_pid)
            json.dump(rec, f)
        try:
            os.replace(tmp, slot_path(stage, i))
        except OSError:
            try:
                os.unlink(tmp)
            except OSError:
                pass
            continue
        # confirm we actually won it (last-writer-wins guard against a same-instant racer)
        time.sleep(0.4)
        back = read_slot(stage, i)
        if back and back.get("pid") == os.getpid():
            print(f"acquired '{stage}' slot {i} ({i + 1}/{cap}) for {owner}"
                  + (f" after {waited / 60:.1f} min" if waited else ""))
            return 0
        announced = False


def release(stage, owner):
    mine = [i for i, cur in holders(stage) if cur.get("owner") == owner]
    if not mine:
        held = holders(stage)
        if held:
            who = ", ".join(c.get("owner") for _, c in held)
            print(f"WARNING: no '{stage}' slot held by {owner} (held by {who}). Not releasing.")
            return 1
        print(f"lock '{stage}' not held; nothing to release")
        return 0
    for i in mine:
        os.unlink(slot_path(stage, i))
        print(f"released '{stage}' slot {i} ({owner})")
    return 0


def status():
    os.makedirs(LOCK_DIR, exist_ok=True)
    for stage in STAGES:
        cap = capacity(stage)
        held = holders(stage)
        print(f"  {stage:8s} {len(held)}/{cap} in use"
              + ("" if cap == 1 else "   (hard ceiling)"))
        for i, cur in held:
            print(f"      slot {i}: {cur.get('owner')} "
                  f"({(time.time() - cur.get('ts', 0)) / 60:.1f} min)")
        if not held:
            print("      free")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("action", choices=["acquire", "release", "status"])
    ap.add_argument("stage", nargs="?", choices=STAGES)
    ap.add_argument("--owner", default="unknown")
    ap.add_argument("--stale-min", type=float, default=90)
    ap.add_argument("--timeout-min", type=float, default=180)
    ap.add_argument("--poll-s", type=float, default=20)
    ap.add_argument("--holder-pid", type=int, default=None,
                    help="pid of the long-lived process that owns the slot; the slot is then "
                         "broken only when that process is dead, never for its age")
    a = ap.parse_args()
    if a.action == "status":
        sys.exit(status())
    if not a.stage:
        ap.error("stage is required for acquire/release")
    if a.action == "acquire":
        sys.exit(acquire(a.stage, a.owner, a.stale_min, a.timeout_min, a.poll_s, a.holder_pid))
    sys.exit(release(a.stage, a.owner))
