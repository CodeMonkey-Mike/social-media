#!/usr/bin/env python3
"""lint-short-spans.py — MECHANICAL GATE + SNAPPER for the longform-to-short lane.

A short's cut plan arrives with boundaries chosen from a Whisper transcript, and Whisper word
boundaries are loose: measured on kaspa 30bps, a 180 ms "gap" between two words still contained
5 ms windows at -18 dBFS (plosive tails, breaths, the next word's onset). Cutting on the
transcript's number therefore clips. This tool measures the real audio and SNAPS each boundary
to the nearest genuine trough, so the plan does not have to be right to the millisecond.

⛔ **Do NOT expect real silence here.** The source is a DESILENCED spine: the silence was removed
on purpose, so what remains between words is 100-180 ms of breath and plosive tail with only a
NARROW instantaneous trough at the true word boundary (measured: -61 to -95 dBFS at the trough,
but only 5-15 ms wide). So the target is the deepest instantaneous trough, not a quiet band, and
the builder MUST crossfade ~12 ms at every splice (same principle as the desilencer's 8 ms
declick). A gate that demanded a quiet guard band would reject every boundary in the file.

    python lint-short-spans.py <cut-plan.json> <spine.mp4> [--floor -45] [--hard -30]
                               [--search 1.2] [--write-snapped out.json]

For every boundary it reports the requested time, the snapped time, the move, and the trough
depth. Exit 0 when every boundary found a trough at or below --floor; exit 1 when a boundary
cannot even reach --hard, which means it is mid-vowel and the span edge must move elsewhere.

Cut plan shape (the short-cut-strategist contract): {"spans":[{"start":s,"end":e,...}, ...]}
Times are FINAL-VIDEO seconds, the same clock as the paused spine.
"""
import argparse
import io
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

WIN = 0.005          # 5 ms analysis window


def envelope(path: Path) -> tuple[np.ndarray, float]:
    """Decode to mono 16k and return a per-window peak-dBFS envelope + its rate."""
    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", "16000", "-f", "wav", "-"],
        capture_output=True, check=True).stdout
    with wave.open(io.BytesIO(pcm)) as w:
        sr = w.getframerate()
        raw = w.readframes(w.getnframes())
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    step = int(sr * WIN)
    n = len(x) // step
    frames = np.abs(x[:n * step].reshape(n, step)).max(axis=1)
    db = 20 * np.log10(np.maximum(frames, 1e-7))
    return db, 1.0 / WIN


def level_at(db: np.ndarray, hz: float, t: float) -> float:
    i = int(round(t * hz))
    return float(db[min(max(i, 0), len(db) - 1)])


def snap(db: np.ndarray, hz: float, t: float, floor: float, search: float):
    """Nearest trough at or below `floor`; if none, the deepest point in the window.

    Nearest-wins, not deepest-wins: a deeper trough 900 ms away would silently rewrite the
    editorial choice, so we take the first offset that qualifies and only fall back to the
    global minimum when nothing in range clears the floor.
    """
    span = int(round(search * hz))
    i0 = int(round(t * hz))
    lo, hi = max(0, i0 - span), min(len(db), i0 + span + 1)
    for off in range(0, span + 1):
        for cand in ({i0} if off == 0 else {i0 - off, i0 + off}):
            if lo <= cand < hi and db[cand] <= floor:
                return cand / hz, float(db[cand]), True
    j = int(np.argmin(db[lo:hi])) + lo
    return j / hz, float(db[j]), False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("spine")
    ap.add_argument("--floor", type=float, default=-45.0,
                    help="trough depth (peak dBFS) that counts as a clean word boundary")
    ap.add_argument("--hard", type=float, default=-30.0,
                    help="above this even the best trough is mid-vowel; the edge must move")
    ap.add_argument("--search", type=float, default=1.2,
                    help="how far either side of a requested boundary to hunt (default 1.2s)")
    ap.add_argument("--write-snapped", help="write a copy of the plan with boundaries snapped")
    a = ap.parse_args()

    plan = json.loads(Path(a.plan).read_text(encoding="utf-8"))
    spans = plan["spans"] if isinstance(plan, dict) else plan
    db, hz = envelope(Path(a.spine))

    print(f"lint-short-spans — {len(spans)} span(s), floor {a.floor} dBFS, hard limit {a.hard} dBFS, "
          f"search +/-{a.search}s\n")
    fails, moved = 0, 0
    for i, s in enumerate(spans, 1):
        for edge in ("start", "end"):
            t = float(s[edge])
            at = level_at(db, hz, t)
            st, lvl, clean = snap(db, hz, t, a.floor, a.search)
            d = st - t
            if lvl > a.hard:
                fails += 1
                print(f"  FAIL span {i} {edge:5s} {t:8.3f}s  as-planned {at:6.1f} dBFS  "
                      f"-> best trough in range is only {lvl:6.1f} dBFS (mid-vowel). Move this edge.")
                continue
            if abs(d) > 0.0005:
                moved += 1
            s[edge] = round(st, 4)
            tag = "OK  " if abs(d) <= 0.0005 else ("SNAP" if clean else "WEAK")
            note = "" if clean else "   (no clean trough in range, took the deepest point)"
            print(f"  {tag} span {i} {edge:5s} {t:8.3f}s  as-planned {at:6.1f} dBFS  "
                  f"-> {st:8.3f}s ({d:+.3f}s) trough {lvl:6.1f} dBFS{note}")

    total = sum(float(s["end"]) - float(s["start"]) for s in spans)
    print(f"\n  spans total after snapping: {total:.2f}s   ({moved} boundary/boundaries moved)")

    if fails:
        print(f"\nGATE FAILED — {fails} boundary/boundaries have no usable trough nearby.")
        return 1
    if a.write_snapped:
        out = plan if isinstance(plan, dict) else {"spans": spans}
        Path(a.write_snapped).write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
        print(f"  snapped plan -> {a.write_snapped}")
    print("\nGATE OK — every boundary sits in silence.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
