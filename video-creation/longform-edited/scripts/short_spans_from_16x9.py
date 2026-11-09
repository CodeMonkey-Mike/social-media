#!/usr/bin/env python
"""short_spans_from_16x9.py — paint a short's spans into the ADAPTER vertical master (longform-to-short.md, 16:9-SOURCED MODE).

    python scripts/short_spans_from_16x9.py <media/<project>> [--plan SHORT-CUT-PLAN.snapped.json] [--comp <CompId>] [--dry-run]

For every span of the (snapped) cut plan, in FINAL-video seconds:
  1. render that frame range from the project's 16:9 comp WITHOUT its caption track (render_comp.py --mode final
     --frames a-b --props {"captions": false}), crf 18;
  2. re-frame it 9:16: FACE spans crop 608x1080 on the measured face centre (assets/vertical/face-crop.json, the window
     the span sits in, else the mean), COVER spans centre-crop; scale to 1080x1920;
     A span may carry `fit_windows` (final-video seconds): inside each one the 16:9 frame is shown WHOLE instead of cropped,
     letterboxed on its own blurred, darkened frame (a frame-filling text card such as a scoreboard card, whose 608 px slice
     would clip the headline; growth-vs-product 2026-10-23). `box` = [x, y, w, h] of the 16:9 frame to show (default the
     whole frame); the window switches hard, so start it on the card's cross-fade and end it after the next ingress.
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


def face_pct_from_render(path: Path, samples: int = 9):
    """Median horizontal face centre (percent of width) over `samples` frames of a rendered 16:9 span; None when no face."""
    import cv2
    import numpy as np
    cap = cv2.VideoCapture(str(path))
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    if n <= 0:
        return None, []
    cas = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    pcts = []
    for k in range(samples):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int((k + 0.5) * n / samples))
        ok, fr = cap.read()
        if not ok:
            continue
        g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        faces = cas.detectMultiScale(g, 1.1, 5, minSize=(110, 110))
        if len(faces):
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            pcts.append(round(100.0 * (x + w / 2) / fr.shape[1], 2))
    cap.release()
    return (float(np.median(pcts)) if pcts else None), pcts


def track_crop(out16: Path, out9: Path, fps: int, smooth_frames: int = 21):
    """Per-frame face-tracked 608x1080 crop of a 16:9 render -> 1080x1920. Returns (n_frames, n_detected, x_min_pct, x_max_pct)."""
    import cv2
    import numpy as np
    cap = cv2.VideoCapture(str(out16))
    cas = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    cxs = []
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        faces = cas.detectMultiScale(g, 1.1, 5, minSize=(110, 110))
        if len(faces):
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            cxs.append(x + w / 2)
        else:
            cxs.append(np.nan)
    cap.release()
    n = len(cxs)
    arr = np.array(cxs, dtype=float)
    det = ~np.isnan(arr)
    if det.sum() == 0:
        arr[:] = 960.0
    else:
        idx = np.arange(n)
        arr = np.interp(idx, idx[det], arr[det])          # gaps (the whip-in's rolled frames) ride the neighbours
    k = max(3, smooth_frames | 1)
    pad = np.pad(arr, (k // 2, k // 2), mode="edge")
    sm = np.convolve(pad, np.ones(k) / k, mode="valid")
    xs = np.clip(np.round(sm - CROP_W / 2), 0, 1920 - CROP_W).astype(int)
    xs = (xs // 2) * 2
    enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", "1080x1920", "-r", str(fps), "-i", "-",
                            "-an", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", str(out9)], stdin=subprocess.PIPE)
    cap = cv2.VideoCapture(str(out16))
    i = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        x0 = int(xs[min(i, n - 1)])
        crop = fr[0:CROP_H, x0:x0 + CROP_W]
        enc.stdin.write(cv2.resize(crop, (1080, 1920), interpolation=cv2.INTER_LANCZOS4).tobytes())
        i += 1
    cap.release()
    enc.stdin.close()
    enc.wait()
    if enc.returncode != 0 or not out9.is_file():
        print("FATAL: tracked crop encode failed"); sys.exit(1)
    pct = (sm / 1920.0) * 100.0
    return n, int(det.sum()), float(pct.min()), float(pct.max())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project"); ap.add_argument("--plan", default=None); ap.add_argument("--comp", default=None)
    ap.add_argument("--scope", default="ALL"); ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--reuse-renders", action="store_true", help="keep existing span-NN-16x9.mp4 renders, only re-crop and re-paint")
    ap.add_argument("--track-face", action="store_true",
                    help="with --face-from-render: a FACE span whose sampled face centres spread more than --track-spread percent gets a "
                         "per-frame TRACKED crop (Haar every frame, gaps interpolated, path smoothed over ~0.7 s, window follows the face) "
                         "instead of one static crop (growth-vs-product 2026-10-23: the signature open pushes the face 52 -> 38 percent)")
    ap.add_argument("--track-spread", type=float, default=8.0)
    ap.add_argument("--face-from-render", action="store_true",
                    help="FACE spans: detect the face on the RENDERED 16:9 span (OpenCV Haar, median of sampled frames) and crop on its centre. "
                         "For comps that do NOT reframe the face to the centre (growth-vs-product 2026-10-23: the signature open and the side "
                         "panels push the face left, so a centre crop halves it). Measurements -> assets/short/span-face-crop.json")
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
    # captions OFF (the short captions every span itself) AND pops OFF (longform-to-short.md: a 1920-wide kinetic word pop is cut
    # by the 608 px slice; the short draws a pop natively). A comp without a `pops` prop ignores it. (lets-get-rich 2026-11-01)
    props = work / "props-nocaptions.json"; props.write_text(json.dumps({"captions": False, "pops": False}), encoding="utf-8")
    rendered, face_log = [], []
    for i, s in enumerate(plan["spans"], 1):
        a0, b0 = float(s["start"]), float(s["end"])
        f0, f1 = int(round(a0 * FPS)), int(round(b0 * FPS))      # [f0, f1) frames of the comp
        sourced = str(s.get("sourced", "COVER")).upper()
        # The comp's picture is already REFRAMED: the measured face sits on the horizontal centre (face_point_out x=960,
        # comp-build 3a) and punch-ins scale about it, so every comp-rendered span centre-crops. The raw-footage face
        # centre (face-crop.json, ~62 percent) applies only to spans cut from the SPINE, never from the comp (the first
        # paint of every-job used 62 percent on comp renders and cut Mike's face at the left edge, 2026-10-08).
        pct = 50.0
        out16 = work / f"span-{i:02d}-16x9.mp4"; out9 = work / f"span-{i:02d}-9x16.mp4"
        if a.dry_run:
            print(f"SPAN-16x9 {i} {a0:.3f}-{b0:.3f} {sourced} crop_x=? frames={f1 - f0} (dry run)", flush=True)
            continue
        if not (a.reuse_renders and out16.is_file()):
            cmd = [sys.executable, "-u", str(HERE / "render_comp.py"), str(P), "--mode", "final", "--frames", f"{f0}-{f1 - 1}",
                   "--props", str(props), "--out", str(out16)]
            if a.comp:
                cmd += ["--comp", a.comp]
            r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
            if r.returncode != 0 or not out16.is_file():
                print("FATAL: span render failed\n" + (r.stdout + r.stderr)[-1500:]); sys.exit(1)
        tracked = False
        if a.face_from_render and sourced == "FACE":
            med, pcts = face_pct_from_render(out16)
            if med is None:
                print(f"WARN span {i}: no face detected on the render, centre crop", flush=True)
            else:
                pct = med
            spread = (max(pcts) - min(pcts)) if pcts else 0.0
            entry = {"span": i, "start": a0, "end": b0, "samples_pct": pcts, "crop_pct": pct, "spread_pct": round(spread, 2)}
            if a.track_face and pcts and spread > a.track_spread:
                nf, nd, lo, hi = track_crop(out16, out9, FPS)
                entry.update({"tracked": True, "track_frames": nf, "track_detected": nd, "track_min_pct": round(lo, 2), "track_max_pct": round(hi, 2)})
                print(f"SPAN-16x9 {i} {a0:.3f}-{b0:.3f} {sourced} TRACKED face {lo:.1f}-{hi:.1f}% ({nd}/{nf} frames detected) frames={f1 - f0}", flush=True)
                tracked = True
            face_log.append(entry)
        if tracked:
            rendered.append((a0, b0, out9))
            continue
        cx = max(0, min(1920 - CROP_W, int(round(pct / 100.0 * 1920 - CROP_W / 2)) // 2 * 2))
        print(f"SPAN-16x9 {i} {a0:.3f}-{b0:.3f} {sourced} crop_x={cx} face_pct={pct:.1f} frames={f1 - f0}", flush=True)
        fits = s.get("fit_windows") or []
        if fits:
            # crop version as the base; each fit window overlays the whole 16:9 frame (its `box`) letterboxed on a blurred fill of itself
            parts = [f"[0:v]split={1 + 2 * len(fits)}[c]" + "".join(f"[bg{k}][fg{k}]" for k in range(len(fits))),
                     f"[c]crop={CROP_W}:{CROP_H}:{cx}:0,scale=1080:1920:flags=lanczos[base]"]
            last = "[base]"
            for k, fw in enumerate(fits):
                fa, fb = float(fw["a"]) - a0, float(fw["b"]) - a0
                bx, by, bw, bh = fw.get("box") or [0, 0, 1920, 1080]
                fh = int(round(1080 * bh / bw)) // 2 * 2
                parts.append(f"[bg{k}]scale=-2:1920:flags=bicubic,crop=1080:1920,boxblur=40:2,eq=brightness=-0.3:saturation=0.8[bgb{k}]")
                parts.append(f"[fg{k}]crop={bw}:{bh}:{bx}:{by},scale=1080:{fh}:flags=lanczos[fgs{k}]")
                parts.append(f"[bgb{k}][fgs{k}]overlay=0:(H-h)/2[fit{k}]")
                parts.append(f"{last}[fit{k}]overlay=0:0:enable='between(t,{max(0.0, fa):.3f},{fb:.3f})'[o{k}]")
                last = f"[o{k}]"
                print(f"  FIT window {fw['a']}-{fw['b']} (span-relative {max(0.0, fa):.3f}-{fb:.3f}) box={[bx, by, bw, bh]} -> 1080x{fh}", flush=True)
            r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(out16), "-filter_complex", ";".join(parts), "-map", last, "-r", str(FPS),
                                "-an", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", str(out9)], capture_output=True, text=True)
        else:
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
    if face_log:
        fp = P / "assets" / "short" / "span-face-crop.json"; fp.parent.mkdir(parents=True, exist_ok=True)
        fp.write_text(json.dumps({"method": "haar frontal face on the rendered 16:9 span, median of sampled frames", "spans": face_log}, indent=1), encoding="utf-8")
        print(f"FACE-CROP-PER-SPAN {fp} spans={len(face_log)}")
    (work / "spans-16x9.json").write_text(json.dumps([{"start": a0, "end": b0, "file": str(f)} for a0, b0, f in rendered], indent=1), encoding="utf-8")
    print(f"MASTER-PAINTED {master} spans={len(rendered)}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
