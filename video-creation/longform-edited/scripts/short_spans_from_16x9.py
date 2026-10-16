#!/usr/bin/env python
"""short_spans_from_16x9.py — paint a short's spans into the ADAPTER vertical master (longform-to-short.md, 16:9-SOURCED MODE).

    python scripts/short_spans_from_16x9.py <media/<project>> [--plan SHORT-CUT-PLAN.snapped.json] [--comp <CompId>] [--dry-run]

For every span of the (snapped) cut plan, in FINAL-video seconds:
  1. render that frame range from the project's 16:9 comp WITHOUT its caption track (render_comp.py --mode final
     --frames a-b --props {"captions": false}), crf 18;
  2. re-frame it 9:16: FACE spans crop 608x1080 on the measured face centre (assets/vertical/face-crop.json, the window
     the span sits in, else the mean), COVER spans centre-crop; scale to 1080x1920;
  3. paint it into <project>-VERTICAL.mp4 at exactly [a, b] (the canvas is black elsewhere; one filter_complex of
     overlays, the canvas re-encoded once).
The lane's short_extract_spans.py then cuts the same [a, b] out of this master as if it were a delivered vertical.
Machine lines: SPAN-16x9 <n> <a>-<b> <FACE|COVER> crop_x=<x> frames=<n> · MASTER-PAINTED <file> spans=<n> · PROGRESS 100%
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
FPS = 30
CROP_W, CROP_H = 608, 1080          # 9:16 of a 1080-high frame


def probe_dur(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project"); ap.add_argument("--plan", default=None); ap.add_argument("--comp", default=None)
    ap.add_argument("--scope", default="ALL"); ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--reuse-renders", action="store_true", help="keep existing span-NN-16x9.mp4 renders, only re-crop and re-paint")
    a = ap.parse_args()
    P = Path(a.project).resolve()
    plan_p = Path(a.plan) if a.plan else P / "SHORT-CUT-PLAN.snapped.json"
    plan = json.loads(plan_p.read_text(encoding="utf-8"))
    master = P / f"{P.name}-VERTICAL.mp4"
    blank = master.with_name(master.stem + ".blank-canvas.mp4")
    if blank.is_file():                      # a re-paint starts from the untouched canvas, never from a painted master
        master.unlink(missing_ok=True); blank.rename(master)
    if not master.is_file():
        print(f"FATAL: adapter master missing: {master} (a black 1080x1920 canvas on the paused spine's clock)"); sys.exit(2)
    fc = json.loads((P / "assets" / "vertical" / "face-crop.json").read_text(encoding="utf-8"))
    mean_pct = float(fc.get("mean_pct") or 62.0)
    # the face windows are SOURCE-spine seconds; the plan is FINAL-video seconds: map through the paused sidecar
    paused = sorted((P / "spine").glob(f"{a.scope}.?.paused.json"))
    pauses = json.loads(paused[-1].read_text(encoding="utf-8"))["pauses"] if paused else []
    def sh(t):
        return t + sum(float(p.get("dur") or 1.5) for p in pauses if float(p["at"]) <= t + 1e-6)
    wins = [(sh(float(w["window"][0])), sh(float(w["window"][1])), float(w["mean_pct"])) for w in fc.get("windows") or []]

    work = P / "_previews" / "short-16x9"; work.mkdir(parents=True, exist_ok=True)
    props = work / "props-nocaptions.json"; props.write_text(json.dumps({"captions": False}), encoding="utf-8")
    rendered = []
    for i, s in enumerate(plan["spans"], 1):
        a0, b0 = float(s["start"]), float(s["end"])
        f0, f1 = int(round(a0 * FPS)), int(round(b0 * FPS))      # [f0, f1) frames of the comp
        sourced = str(s.get("sourced", "COVER")).upper()
        # The comp's picture is already REFRAMED: the measured face sits on the horizontal centre (face_point_out x=960,
        # comp-build 3a) and punch-ins scale about it, so every comp-rendered span centre-crops. The raw-footage face
        # centre (face-crop.json, ~62 percent) applies only to spans cut from the SPINE, never from the comp (the first
        # paint of every-job used 62 percent on comp renders and cut Mike's face at the left edge, 2026-10-08).
        pct = 50.0
        cx = max(0, min(1920 - CROP_W, int(round(pct / 100.0 * 1920 - CROP_W / 2)) // 2 * 2))
        out16 = work / f"span-{i:02d}-16x9.mp4"; out9 = work / f"span-{i:02d}-9x16.mp4"
        print(f"SPAN-16x9 {i} {a0:.3f}-{b0:.3f} {sourced} crop_x={cx} frames={f1 - f0}", flush=True)
        if a.dry_run:
            continue
        if not (a.reuse_renders and out16.is_file()):
            cmd = [sys.executable, "-u", str(HERE / "render_comp.py"), str(P), "--mode", "final", "--frames", f"{f0}-{f1 - 1}",
                   "--props", str(props), "--out", str(out16)]
            if a.comp:
                cmd += ["--comp", a.comp]
            r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
            if r.returncode != 0 or not out16.is_file():
                print("FATAL: span render failed\n" + (r.stdout + r.stderr)[-1500:]); sys.exit(1)
        r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(out16), "-vf", f"crop={CROP_W}:{CROP_H}:{cx}:0,scale=1080:1920:flags=lanczos,fps={FPS}",
                            "-an", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", str(out9)], capture_output=True, text=True)
        if r.returncode != 0:
            print("FATAL: crop failed\n" + r.stderr[-800:]); sys.exit(1)
        rendered.append((a0, b0, out9))
    if a.dry_run:
        return
    # paint every span into the canvas at its exact time (one pass)
    inputs = ["-i", str(master)]
    chain, last = [], "[0:v]"
    for k, (a0, b0, f) in enumerate(rendered, 1):
        inputs += ["-i", str(f)]
        chain.append(f"[{k}:v]setpts=PTS-STARTPTS+{a0:.6f}/TB[s{k}]")
        chain.append(f"{last}[s{k}]overlay=eof_action=pass:enable='between(t,{a0:.3f},{b0:.3f})'[v{k}]")
        last = f"[v{k}]"
    painted = master.with_name(master.stem + ".painted.mp4")
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(chain), "-map", last, "-an",
                        "-r", str(FPS), "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(painted)],
                       capture_output=True, text=True)
    if r.returncode != 0 or not painted.is_file():
        print("FATAL: paint failed\n" + r.stderr[-1500:]); sys.exit(1)
    d0, d1 = probe_dur(master), probe_dur(painted)
    if abs(d0 - d1) > 0.1:
        print(f"FATAL: painted master is {d1:.3f}s, canvas was {d0:.3f}s"); sys.exit(1)
    backup = master.with_name(master.stem + ".blank-canvas.mp4")
    if not backup.is_file():
        master.rename(backup)
    else:
        master.unlink()
    painted.rename(master)
    (work / "spans-16x9.json").write_text(json.dumps([{"start": a0, "end": b0, "file": str(f)} for a0, b0, f in rendered], indent=1), encoding="utf-8")
    print(f"MASTER-PAINTED {master} spans={len(rendered)}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
