"""splice.py — a FIX ROUND without a full re-render: re-render only the windows whose timeline changed and splice them
into the previous deliverable (the partial-replacement rule: Mike, 2026-06-06 / 2026-08-01 / 2026-10-14).

Part of longform-presentation/skills/spotlight (read spotlight.md first).

Compares the PREVIOUS resolved spec (a copy saved before re-resolving) with the CURRENT one: every scene, bullet item
or chapter pause whose paused-timeline time moved defines a window [earliest, latest + the entrance] where the comp's
frames (and, for a moved pause, the audio) differ; overlapping windows merge, edges snap to frames. Each window is
rendered from the comp (which already imports the CURRENT data file), its audio is rebuilt from the EDIT with the
current pauses, and ONE filter_complex pass writes the new deliverable = previous FINAL outside the windows + the
new renders inside. Requires the same head_until, tail_from and total pause time as before (otherwise the file
length changes: that is a full stitch, not a splice).

Usage:
  python splice.py --project "media/<project>" --comp <CompId> --edit "<project> EDIT.mp4" \
      --prev-resolved "<project>.scenes.resolved.v2.json" --prev-final "<project> FINAL-v2.mp4" \
      --out "<project> FINAL-v3.mp4" [--margin 0.25] [--dry-run]
"""
import argparse, json, math, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from spot_common import load_resolved, timeline, audio_format, FADE  # noqa: E402
from render_spotlight import run_render, nb_frames  # noqa: E402

ENTRANCE = 0.65     # s: cross-fade 0.35 + scale-in 0.6 -> a scene is settled 0.65 s after its start


def scene_times(spec):
    """{key: paused time} for every scene, bullet item and pause of a resolved spec."""
    tl = spec.get("timeline", {})
    pl = [(p["at"], p["dur"]) for p in tl.get("pauses", [])]
    pause_of = {p["scene"]: p for p in tl.get("pauses", [])}
    shift = lambda t: t + sum(d for a, d in pl if a <= t)
    out = {}
    for s in spec["scenes"]:
        out[f"scene:{s['id']}"] = pause_of[s["id"]]["t_paused"] if s["id"] in pause_of else shift(s["t"])
        for j, it in enumerate(s.get("items", [])):
            if it.get("t") is not None:
                out[f"item:{s['id']}[{j}]"] = shift(it["t"])
    for p in tl.get("pauses", []):
        out[f"pause:{p['scene']}"] = p["t_paused"]
    return out


def edit_time(t, pauses):
    """paused second -> EDIT second (t must not lie inside a pause)."""
    return t - sum(d for T, d in pauses if T + d <= t + 1e-6)


def window_audio(w0, w1, pauses, src, sr, layout, lab):
    """filter lines for [lab] = the audio of paused [w0, w1): EDIT slices + the pauses' silence inside it."""
    segs, cur = [], w0
    for T, d in pauses:
        if T + d <= w0 or T >= w1:
            continue
        if T > cur:
            segs.append(("a", edit_time(cur, pauses), edit_time(T, pauses)))
        segs.append(("z", min(T + d, w1) - max(T, w0)))
        cur = min(T + d, w1)
    if w1 > cur + 1e-6:
        segs.append(("a", edit_time(cur, pauses), edit_time(w1, pauses)))
    lines, labels = [], []
    for i, sg in enumerate(segs):
        l = f"{lab}_{i}"
        if sg[0] == "a":
            _, s, e = sg
            f = f"[{src}]atrim=start={s:.6f}:end={e:.6f},asetpts=PTS-STARTPTS"
            if i + 1 < len(segs) and segs[i + 1][0] == "z":
                f += f",afade=t=out:st={max(0.0, e - s - FADE):.6f}:d={FADE}"
            if i > 0 and segs[i - 1][0] == "z":
                f += f",afade=t=in:st=0:d={FADE}"
            lines.append(f + f"[{l}];")
        else:
            lines.append(f"anullsrc=r={sr}:cl={layout},atrim=duration={sg[1]:.6f},asetpts=PTS-STARTPTS[{l}];")
        labels.append(f"[{l}]")
    if len(segs) == 1:
        lines[-1] = lines[-1].replace(f"[{lab}_0];", f"[{lab}];")
    else:
        lines.append("".join(labels) + f"concat=n={len(segs)}:v=0:a=1[{lab}];")
    return lines


def stream_dur(p, kind):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", f"{kind}:0", "-show_entries",
                                   "stream=duration", "-of", "csv=p=0", p]).decode().strip().rstrip(",")
    return float(out) if out else float("nan")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--comp", required=True)
    ap.add_argument("--edit", required=True)
    ap.add_argument("--prev-resolved", required=True, help="the resolved spec the previous FINAL was built from")
    ap.add_argument("--prev-final", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--margin", type=float, default=0.25, help="s added on each side of every window")
    ap.add_argument("--crf", type=int, default=18)
    ap.add_argument("--concurrency", type=int, default=8)
    ap.add_argument("--dry-run", action="store_true", help="print the windows, render nothing")
    args = ap.parse_args()

    project = os.path.abspath(args.project)
    name = os.path.basename(project)
    new = load_resolved(project)
    old = json.load(open(args.prev_resolved, encoding="utf-8"))
    tn, to = timeline(new), timeline(old)
    fps = tn["fps"]
    if (tn["head"], tn["fps"]) != (to["head"], to["fps"]) or abs(tn["tail_paused"] - to["tail_paused"]) > 1e-6:
        sys.exit(f"head/tail/pauses changed the file length (old head {to['head']} tail {to['tail_paused']}, new head "
                 f"{tn['head']} tail {tn['tail_paused']}): that is a full stitch (stitch.py), not a splice")
    a, b = scene_times(old), scene_times(new)
    raw = []
    for k in sorted(set(a) | set(b)):
        ta, tb = a.get(k), b.get(k)
        if ta is None or tb is None or abs(ta - tb) < 1e-3:
            continue
        lo, hi = min(ta, tb), max(ta, tb)
        if k.startswith("pause:"):
            dur = next(p["dur"] for p in new["timeline"]["pauses"] if p["scene"] == k[6:])
            raw.append((lo, hi + dur, f"{k} {ta:.2f} -> {tb:.2f}"))
        else:
            raw.append((lo - 1.0 / fps, hi + ENTRANCE, f"{k} {ta:.2f} -> {tb:.2f}"))
    if not raw:
        sys.exit("nothing moved between the two resolved specs; nothing to splice")
    raw.sort()
    windows = []
    for lo, hi, why in raw:
        lo, hi = lo - args.margin, hi + args.margin
        if windows and lo <= windows[-1][1]:
            windows[-1][1] = max(windows[-1][1], hi); windows[-1][2].append(why)
        else:
            windows.append([lo, hi, [why]])
    head, tail_p = tn["head"], tn["tail_paused"]
    snap_lo = lambda t: math.floor((max(t, head) - head) * fps) / fps + head
    snap_hi = lambda t: math.ceil((min(t, tail_p) - head) * fps) / fps + head
    windows = [(snap_lo(lo), snap_hi(hi), why) for lo, hi, why in windows]
    print(f"{len(windows)} window(s) to re-render ({sum(hi - lo for lo, hi, _ in windows):.1f} s of {tail_p - head:.1f} s):")
    for i, (lo, hi, why) in enumerate(windows):
        print(f"  {i:02d}  {lo:9.3f} -> {hi:9.3f}  ({hi - lo:5.2f} s, frames {round((lo-head)*fps)}-{round((hi-head)*fps)-1}): " + "; ".join(why))
    if args.dry_run:
        return

    previews = os.path.join(project, "_previews")
    public_dir = os.path.join(project, "render-assets")
    os.makedirs(previews, exist_ok=True)
    renders = []
    for i, (lo, hi, _) in enumerate(windows):
        f0, f1 = round((lo - head) * fps), round((hi - head) * fps) - 1
        out = os.path.join(previews, f"{name}-splice{i:02d}-{f0}-{f1}.mp4")
        want = f1 - f0 + 1
        if os.path.isfile(out) and nb_frames(out) == want:
            print(f"window {i:02d}: {out} already rendered ({want} frames)", flush=True)
        else:
            print(f"window {i:02d}: rendering frames {f0}-{f1} ...", flush=True)
            rc = run_render(args.comp, out, (f0, f1), 16, public_dir, args.concurrency, True, out + ".log")
            got = nb_frames(out) if rc == 0 else -1
            if rc != 0 or got != want:
                sys.exit(f"window {i:02d} FAILED (rc={rc}, frames {got}/{want}); see {out}.log")
        renders.append(out)

    # one pass: prev FINAL outside the windows, the renders (+ EDIT-built audio) inside
    sr, layout = audio_format(args.edit)
    pauses = [(p["t_paused"], p["dur"]) for p in new["timeline"]["pauses"]]
    n = len(windows)
    # video trims are by FRAME NUMBER (a window edge like 260.6667 s written as seconds lands on either side of the
    # frame at 260.66667 depending on rounding; v3 of history-of-crypto came out 2 frames long and 67 ms out of sync
    # from exactly that). Audio trims are sample-exact seconds at full precision.
    fr = lambda t: round(t * fps)
    fc, order, prev = [], [], 0.0
    for i, (lo, hi, _) in enumerate(windows):
        fc.append(f"[0:v]trim=start_frame={fr(prev)}:end_frame={fr(lo)},setpts=PTS-STARTPTS[v{i}a];")
        fc.append(f"[0:a]atrim=start={prev:.6f}:end={lo:.6f},asetpts=PTS-STARTPTS[a{i}a];")
        order.append(f"[v{i}a][a{i}a]")
        fc.append(f"[{i+1}:v]setpts=PTS-STARTPTS[v{i}w];")
        fc.extend(window_audio(lo, hi, pauses, f"{n+1}:a", sr, layout, f"a{i}w"))
        order.append(f"[v{i}w][a{i}w]")
        prev = hi
    fc.append(f"[0:v]trim=start_frame={fr(prev)},setpts=PTS-STARTPTS[vz];")
    fc.append(f"[0:a]atrim=start={prev:.6f},asetpts=PTS-STARTPTS[az];")
    order.append("[vz][az]")
    fc.append("".join(order) + f"concat=n={len(order)}:v=1:a=1[outv][outa]")
    fc_path = args.out + ".filter.txt"
    with open(fc_path, "w", encoding="utf-8") as f:
        f.write("\n".join(fc))
    cmd = ["ffmpeg", "-y", "-i", args.prev_final] + sum([["-i", r] for r in renders], []) + ["-i", args.edit,
           "-filter_complex_script", fc_path, "-map", "[outv]", "-map", "[outa]",
           "-c:v", "libx264", "-crf", str(args.crf), "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(fps),
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", args.out]
    print("encoding ->", args.out, flush=True)
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        os.remove(fc_path)
    except OSError:
        pass
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", r.stderr[-2500:]); sys.exit(1)
    vd, ad = stream_dur(args.out, "v"), stream_dur(args.out, "a")
    pd = stream_dur(args.prev_final, "v")
    print(f"DONE  video {vd:.3f}s / audio {ad:.3f}s (previous FINAL {pd:.3f}s, delta {vd-pd:+.3f}s)  "
          f"A/V drift {abs(vd-ad)*1000:.0f} ms -> {'OK' if abs(vd-ad) < 0.05 else 'CHECK'}")
    qa = os.path.join(project, "_qa"); os.makedirs(qa, exist_ok=True)
    for i, (lo, hi, _) in enumerate(windows):
        for lab, t in (("in", lo - 1.0 / fps), ("start", lo + 1.0 / fps), ("end", hi - 1.0 / fps), ("out", hi + 1.0 / fps)):
            dst = os.path.join(qa, f"{name}-splice{i:02d}-{lab}.jpg")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0.0, t):.3f}", "-i", args.out, "-frames:v", "1", dst])
    print("window edge frames ->", qa)
    print("out =", args.out)


if __name__ == "__main__":
    main()
