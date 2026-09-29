#!/usr/bin/env python
"""
bake_card_pauses.py — insert the title-card pauses into the FINAL spine (longform graph `card_pauses` node,
2026-09-28; Python, sync-safe filter_complex only).

Each chapter with a title card gets a freeze + silence of --pause seconds inserted in the SILENCE TROUGH just
before the chapter's first word (comp-build.md §5/§13a: "the pause goes in the silence BETWEEN the words",
never mid-word; lint-pause-silence.py is the gate). The insert point is SNAPPED: the script RMS-scans
[t-0.8, t+0.3] in 10 ms bins (the lint's own method, threshold -45 dB) and takes the center of the trough
nearest the planned time; a boundary with no trough FAILS (exit 1) and prints what it measured.

Usage: python bake_card_pauses.py <spine.mp4> --cards "40.22:CH2 NOT AN L2,137.58:CH3 WHERE IT STANDS"
         --out <spine/ALL.g.paused.mp4> [--pause 1.5] [--json <sidecar>]
Sidecar JSON (the comp reads CARD_T + PAUSE from it): {pauses:[{at, planned, dur, card, sits_in}], pause_s,
source, output, output_duration_s}. Machine lines: PAUSE-SNAP <card> planned=t at=t trough=a-b ·
BAKED <out> dur=X (+N*P) · PROGRESS 100%
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
THRESH = -45.0


def probe(path, entries, select=None):
    cmd = ["ffprobe", "-v", "error"] + (["-select_streams", select] if select else []) + ["-show_entries", entries, "-of", "csv=p=0", str(path)]
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()


def rms_bins(spine, start, length):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-ss", f"{start:.3f}", "-t", f"{length:.3f}", "-i", str(spine), "-af",
                        "asetnsamples=n=441:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level",
                        "-f", "null", "-"], capture_output=True, text=True)
    vals = [(-99.0 if "inf" in v else float(v)) for v in re.findall(r"RMS_level=(-?inf|-?[\d.]+)", p.stderr)]
    return [(start + i * 0.01, v) for i, v in enumerate(vals)]


def snap(spine, t):
    """Center of the silence trough nearest the planned time t (search [t-0.8, t+0.3])."""
    bins = rms_bins(spine, max(0.0, t - 0.8), 1.1)
    runs, cur = [], None
    for bt, v in bins:
        if v <= THRESH:
            cur = [bt, bt + 0.01] if cur is None else [cur[0], bt + 0.01]
        elif cur:
            runs.append(cur)
            cur = None
    if cur:
        runs.append(cur)
    runs = [r for r in runs if r[1] - r[0] >= 0.029]  # at least 3 bins (the lint's 30 ms guard; float-safe)
    if not runs:
        deepest = min(bins, key=lambda b: b[1]) if bins else (t, 0.0)
        return None, f"no silence trough (<= {THRESH} dB, >= 30 ms) within [{t - 0.8:.2f}, {t + 0.3:.2f}]; deepest bin {deepest[1]:.1f} dB @{deepest[0]:.2f}"
    best = min(runs, key=lambda r: min(abs(t - r[0]), abs(t - r[1]), 0 if r[0] <= t <= r[1] else 9))
    # refine INSIDE the trough with the gate's own containment metric (its bins start at at-0.15, so a
    # 30 ms trough only passes at the point whose 3-bin guard is entirely inside it): pick the quietest
    cands = []
    x = best[0]
    while x <= best[1] + 1e-9:
        cands.append((containment(spine, round(x, 3)), round(x, 3)))
        x += 0.005
    guard, at = min(cands)
    if guard > THRESH:
        return None, f"trough {best[0]:.3f}-{best[1]:.3f} too narrow for the gate's 30 ms guard (best {guard:.1f} dB @{at})"
    return at, f"trough {best[0]:.3f}-{best[1]:.3f}, gate guard {guard:.1f} dB"


def containment(spine, at):
    """lint-pause-silence.py's load-bearing check, verbatim: max RMS of the bin holding `at` and its two
    neighbours, measured on bins that start at at-0.15 (must be <= THRESH)."""
    bins = rms_bins(spine, max(0.0, at - 0.15), 0.30)
    if not bins:
        return 0.0
    vals = [v for _, v in bins]
    times = [bt for bt, _ in bins]
    mid = min(range(len(vals)), key=lambda i: abs(times[i] - (at - 0.005)))
    guard = vals[max(0, mid - 1):mid + 2]
    return max(guard) if guard else 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spine")
    ap.add_argument("--cards", required=True, help='"t:label,t:label" planned insert times (chapter first-word onsets)')
    ap.add_argument("--out", required=True)
    ap.add_argument("--pause", type=float, default=1.5)
    ap.add_argument("--json", default=None)
    a = ap.parse_args()
    spine, out = Path(a.spine), Path(a.out)
    if not spine.is_file():
        print(f"FATAL: {spine} missing", file=sys.stderr)
        sys.exit(2)
    src_dur = float(probe(spine, "format=duration") or 0)
    fps_raw = probe(spine, "stream=r_frame_rate", "v:0").splitlines()[0]
    num, den = fps_raw.split("/")
    fps = float(num) / float(den)
    sr = probe(spine, "stream=sample_rate", "a:0").splitlines()[0] or "48000"
    ch = probe(spine, "stream=channel_layout", "a:0").splitlines()[0] or "stereo"
    cards = []
    for item in a.cards.split(","):
        t, _, label = item.partition(":")
        cards.append((float(t), label.strip()))
    cards.sort()
    pauses, bad = [], []
    for t, label in cards:
        at, where = snap(spine, t)
        if at is None:
            bad.append(f"{label} @{t}: {where}")
            continue
        pauses.append({"at": at, "planned": t, "dur": a.pause, "card": label, "sits_in": where})
        print(f"PAUSE-SNAP {label} planned={t} at={at} {where}")
    if bad:
        for b in bad:
            print(f"FAIL  {b}")
        sys.exit(1)
    # sync-safe filter_complex: segments + (freeze frame + silence) per pause, one concat
    P = a.pause
    fparts, order, prev, k = [], [], 0.0, 0
    for i, pz in enumerate(pauses):
        at = pz["at"]
        fparts.append(f"[0:v]trim=start={prev:.3f}:end={at:.3f},setpts=PTS-STARTPTS[v{k}];"
                      f"[0:a]atrim=start={prev:.3f}:end={at:.3f},asetpts=PTS-STARTPTS[a{k}]")
        order += [f"[v{k}][a{k}]"]
        k += 1
        fparts.append(f"[0:v]trim=start={at:.3f}:end={at + 2 / fps:.3f},setpts=PTS-STARTPTS,loop=loop=-1:size=1:start=0,"
                      f"trim=duration={P:.3f},setpts=PTS-STARTPTS[v{k}];"
                      f"anullsrc=r={sr}:cl={ch},atrim=duration={P:.3f},asetpts=PTS-STARTPTS[a{k}]")
        order += [f"[v{k}][a{k}]"]
        k += 1
        prev = at
    fparts.append(f"[0:v]trim=start={prev:.3f},setpts=PTS-STARTPTS[v{k}];[0:a]atrim=start={prev:.3f},asetpts=PTS-STARTPTS[a{k}]")
    order += [f"[v{k}][a{k}]"]
    k += 1
    fc = ";".join(fparts) + ";" + "".join(order) + f"concat=n={k}:v=1:a=1[vo][ao]"
    out.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(spine), "-filter_complex", fc, "-map", "[vo]", "-map", "[ao]",
                        "-r", f"{fps:g}", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "192k", str(out)], capture_output=True, text=True)
    if r.returncode != 0:
        print("FATAL: ffmpeg failed\n" + r.stderr[-1500:], file=sys.stderr)
        sys.exit(1)
    out_dur = float(probe(out, "format=duration") or 0)
    expect = src_dur + len(pauses) * P
    print(f"BAKED {out} dur={out_dur:.3f} (expected {expect:.3f} = {src_dur:.3f} + {len(pauses)}*{P})")
    if abs(out_dur - expect) > 0.1:
        print(f"FAIL  output duration off by {out_dur - expect:+.3f}s", file=sys.stderr)
        sys.exit(1)
    side = Path(a.json) if a.json else out.with_suffix(".json")
    side.write_text(json.dumps({"pauses": pauses, "pause_s": P, "source": str(spine), "output": str(out),
                                "output_duration_s": round(out_dur, 3), "fps": fps,
                                "note": "every comp cue is a SOURCE time; sh() adds pause_s per pause whose `at` <= t"},
                               indent=2), encoding="utf-8")
    print(f"WROTE {side}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
