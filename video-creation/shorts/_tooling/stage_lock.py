"""Cross-agent stage lock for parallel shorts builds.

WHY: a shorts build has four stages that use DIFFERENT resources:
    read/plan (none) -> generate b-roll (ChatGPT Chrome profile) -> build comp (none) -> render (CPU)
Only `chatgpt` and `render` are exclusive, and they are exclusive over DIFFERENT things, so clip N's
render can safely overlap clip N+1's image generation. Serializing whole builds wastes that overlap.

Two hard constraints this enforces:
  - `chatgpt`: all ChatGPT image generation shares ONE Chrome profile (chatgpt-profile). Two
    concurrent runs collide mid-generation and mis-capture each other's images.
  - `render`: a Remotion render uses every core (CPU-only h264 on this box, no GPU encode). Two
    concurrent renders roughly double each other's wall time and can exhaust handles.

Usage (from any build agent, repo root):
    python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner <slug>   # blocks
    ... generate images ...
    python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner <slug>

    python video-creation/shorts/_tooling/stage_lock.py acquire render  --owner <slug>   # blocks
    ... remotion render ...
    python video-creation/shorts/_tooling/stage_lock.py release render  --owner <slug>

`acquire` blocks (polling) until free, then writes the lock. Stale locks older than --stale-min
(default 90) are broken automatically so a crashed agent cannot wedge the pipeline forever.
`release` is safe to call when you do not hold it (no-op with a warning).
"""
import argparse
import json
import os
import sys
import time

LOCK_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".locks")
STAGES = ("chatgpt", "render")


def lock_path(stage):
    return os.path.join(LOCK_DIR, f"{stage}.lock")


def read_lock(stage):
    try:
        with open(lock_path(stage), encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def acquire(stage, owner, stale_min, timeout_min, poll_s):
    os.makedirs(LOCK_DIR, exist_ok=True)
    waited = 0.0
    announced = False
    while True:
        cur = read_lock(stage)
        if cur:
            age_min = (time.time() - cur.get("ts", 0)) / 60.0
            if cur.get("owner") == owner:
                print(f"lock '{stage}' already held by {owner} (re-entrant, ok)")
                return 0
            if age_min > stale_min:
                print(f"lock '{stage}' held by {cur.get('owner')} for {age_min:.0f} min "
                      f"(> {stale_min} stale threshold) - breaking it")
                cur = None
            else:
                if not announced:
                    print(f"lock '{stage}' held by {cur.get('owner')} ({age_min:.1f} min); "
                          f"{owner} waiting...")
                    announced = True
                if waited / 60.0 > timeout_min:
                    print(f"TIMEOUT after {timeout_min} min waiting for '{stage}' "
                          f"(holder {cur.get('owner')}). Not stealing; report the block.")
                    return 2
                time.sleep(poll_s)
                waited += poll_s
                continue
        # free (or broken) -> take it
        tmp = lock_path(stage) + f".{os.getpid()}.tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump({"owner": owner, "pid": os.getpid(), "ts": time.time(),
                       "stage": stage}, f)
        try:
            os.replace(tmp, lock_path(stage))
        except OSError:
            os.unlink(tmp)
            continue
        # confirm we actually won it (last-writer-wins guard against a same-instant racer)
        time.sleep(0.4)
        back = read_lock(stage)
        if back and back.get("pid") == os.getpid():
            print(f"acquired '{stage}' for {owner}" + (f" after {waited / 60:.1f} min" if waited else ""))
            return 0
        announced = False


def release(stage, owner):
    cur = read_lock(stage)
    if not cur:
        print(f"lock '{stage}' not held; nothing to release")
        return 0
    if cur.get("owner") != owner:
        print(f"WARNING: lock '{stage}' is held by {cur.get('owner')}, not {owner}. Not releasing.")
        return 1
    os.unlink(lock_path(stage))
    print(f"released '{stage}' ({owner})")
    return 0


def status():
    os.makedirs(LOCK_DIR, exist_ok=True)
    for stage in STAGES:
        cur = read_lock(stage)
        if cur:
            print(f"  {stage:8s} HELD by {cur.get('owner')} "
                  f"({(time.time() - cur.get('ts', 0)) / 60:.1f} min)")
        else:
            print(f"  {stage:8s} free")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("action", choices=["acquire", "release", "status"])
    ap.add_argument("stage", nargs="?", choices=STAGES)
    ap.add_argument("--owner", default="unknown")
    ap.add_argument("--stale-min", type=float, default=90)
    ap.add_argument("--timeout-min", type=float, default=180)
    ap.add_argument("--poll-s", type=float, default=20)
    a = ap.parse_args()
    if a.action == "status":
        sys.exit(status())
    if not a.stage:
        ap.error("stage is required for acquire/release")
    if a.action == "acquire":
        sys.exit(acquire(a.stage, a.owner, a.stale_min, a.timeout_min, a.poll_s))
    sys.exit(release(a.stage, a.owner))
