#!/usr/bin/env python
"""
build_face_swap_source.py — cut the SOURCE clip for a face window's background swap (Higgsfield video-to-video).

Why a script (golden-kitty, 2026-10-02): a face window on the FINAL spine is usually several raw sentences butted
together by the desilencer (jump cuts inside the window), and everything outside the window is BLACK on the
spine (cover-blackout). So the clip can neither be one raw span, nor take its handles from the spine. This builds:
    [head handle, real un-blacked footage]  +  [the window's own frames, verbatim off the final spine]  +  [tail handle]
The handles come from the UN-BLACKED defumbled spine (`<scope>.a.defumbled.mp4`): the footage just before the
window's first frame and just after its last frame, found by matching a SEQUENCE of frames (a talking head has
long near-identical stretches, and webcam footage carries duplicated frames, so one frame alone is ambiguous).
The model's first and last frames are its unstable ones; the handles (0.4 s default) are what gets thrown away.

The picture is PRE-CROPPED to the measured face reframe (assets/face-reframe.json), so the model spends its
pixels on Mike and the returned clip is already centred and zoomed: the comp plays a swap clip full-frame and
does NOT apply FACE_REFRAME to it (comp-build.md section 3a). Audio is dropped: the comp keeps the spine's audio.

Usage: python build_face_swap_source.py <media/<project>> --window 0.0-9.667 --name F1 --approx-src 6.78
           [--scope ALL] [--handle 0.4] [--no-crop]
  --approx-src = where the window starts on the a.defumbled spine, in seconds (read it off
                 spine/<scope>.a.defumbled._chunkmap.txt); it anchors the first match.
Writes assets/face-swap/<name>-raw-for-higgsfield.mp4 + .json (its own folder: assets/vid/ is reconciled against the
cover plan and would call these orphans). Machine line: FACE-SWAP-SOURCE ...
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
FPS = 30
TW, TH = 96, 54          # match size
EPS = 0.004               # the trims select by TIMESTAMP, exactly like the matcher's seeks. A frame-COUNT select
#                           (`between(n, ...)`) landed two frames late on this footage and pulled black frames into the window.


def final_spine(proj: Path, scope: str):
    hits = sorted(h for h in (proj / "spine").glob(f"{scope}.?.*.mp4")
                  if h.name[len(scope) + 1] >= "c" and ".lowbps." not in h.name and ".paused." not in h.name)
    return hits[-1] if hits else None


def frames(video: Path, f0: int, n: int):
    """n small grey frames starting at frame f0 (frame-accurate: -ss after -i)."""
    cmd = ["ffmpeg", "-v", "error", "-i", str(video), "-ss", f"{max(0, f0) / FPS:.4f}", "-frames:v", str(n), "-vf",
           f"scale={TW}:{TH},format=gray", "-f", "rawvideo", "-"]
    raw = subprocess.run(cmd, capture_output=True).stdout
    k = len(raw) // (TW * TH)
    return np.frombuffer(raw[: k * TW * TH], dtype=np.uint8).reshape(k, TH, TW).astype(np.float32)


def duration(p: Path) -> float:
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).decode().strip())


def best_start(seq, src: Path, lo: int, hi: int):
    """the source frame index in [lo, hi] where `seq` (k frames) matches best as a sequence -> (index, mse)."""
    k = len(seq)
    A = frames(src, lo, hi - lo + k)
    best, best_e = lo, 1e18
    for j in range(0, len(A) - k + 1):
        e = float(((A[j:j + k] - seq) ** 2).mean())
        if e < best_e - 1e-6:
            best, best_e = lo + j, e
    return best, best_e


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--window", required=True, help="a-b seconds on the FINAL spine")
    ap.add_argument("--name", required=True)
    ap.add_argument("--approx-src", type=float, required=True, help="where the window starts on the a.defumbled spine (s)")
    ap.add_argument("--scope", default="ALL")
    ap.add_argument("--handle", type=float, default=0.4)
    ap.add_argument("--no-crop", action="store_true")
    ap.add_argument("--vertical", action="store_true",
                    help="the VERTICAL (9:16) lane: crop 608x1080 centred on the face measured for this window in "
                         "assets/vertical/face-crop.json, and write to assets/vertical/face-swap/")
    ap.add_argument("--reuse-json", default=None,
                    help="a <name>-raw-for-higgsfield.json already built for the SAME window (the 16:9 one): take the located "
                         "source indices from it instead of matching again")
    ap.add_argument("--whole-seconds", action="store_true",
                    help="extend the tail handle so the clip is a whole number of seconds (required for Seedance: it stretches otherwise)")
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    w0, w1 = (float(x) for x in a.window.split("-"))
    fs = final_spine(proj, a.scope)
    src = proj / "spine" / f"{a.scope}.a.defumbled.mp4"
    if not fs or not src.is_file():
        print("FATAL: final spine or the a.defumbled spine missing", file=sys.stderr)
        sys.exit(2)
    n0, n1 = int(round(w0 * FPS)), int(round(w1 * FPS))          # window frames [n0, n1)
    G = frames(fs, n0, n1 - n0)
    if G.mean(axis=(1, 2)).min() < 8:
        dark = [n0 + i for i, g in enumerate(G) if g.mean() < 8]
        print(f"FATAL: the window holds BLACK frames on the spine (first at frame {dark[0]} = {dark[0] / FPS:.3f}s): "
              "trim --window to the face frames", file=sys.stderr)
        sys.exit(1)
    src_total = int(duration(src) * FPS)
    h = int(round(a.handle * FPS))
    # where the window's FIRST frames sit in the source (1 s of frames as the sequence), near the hint
    k = min(FPS, len(G))
    hint = int(round(a.approx_src * FPS))
    reuse = json.loads(Path(a.reuse_json).read_text(encoding="utf-8")) if a.reuse_json else None
    if reuse and [int(x) for x in reuse["window_frames"]] != [n0, n1]:
        print(f"FATAL: --reuse-json is for window frames {reuse['window_frames']}, this window is {[n0, n1]}", file=sys.stderr)
        sys.exit(2)
    if reuse:
        m0, e0 = int(reuse["source_index_of_first_window_frame"]), float(reuse["match_mse"]["head"])
    else:
        m0, e0 = best_start(G[:k], src, max(0, hint - 3 * FPS), min(src_total - k, hint + 3 * FPS))
    # where the window's LAST frames sit: the take only moves forward, so search from m0 + (window length - k)
    # (a join may sit inside the last second, so shorten the sequence until it is one continuous run)
    m1, e1 = None, 1e9
    if reuse:
        m1, e1 = int(reuse["source_index_of_last_window_frame"]), float(reuse["match_mse"]["tail"])
    for kt in (() if reuse else (k, 15, 8, 5)):
        kt = min(kt, len(G))
        lo = m0 + (len(G) - kt)
        m_tail, e1 = best_start(G[-kt:], src, lo, min(src_total - kt, lo + 90 * FPS))
        m1 = m_tail + kt - 1                                      # source index of the window's last frame
        if e1 <= 25:
            break
    if max(e0, e1) > 25:
        print(f"FATAL: the window could not be located in {src.name} (match error {e0:.1f} / {e1:.1f}); check --approx-src", file=sys.stderr)
        sys.exit(1)
    head = min(h, m0)
    tail = min(h, src_total - 1 - m1)
    if a.whole_seconds:
        # Seedance takes an INTEGER duration and STRETCHES a shorter reference to fill it (a 4.6 s clip came back 7% slow,
        # lips drifting off the voice). Pad the tail handle so the clip is a whole number of seconds: no stretch.
        total = head + (n1 - n0) + tail
        tail = min(src_total - 1 - m1, tail + (-total) % FPS)
    crop, crop_px = "", None
    rf = proj / "assets" / "face-reframe.json"
    vface = proj / "assets" / "vertical" / "face-crop.json"
    if a.vertical:
        if not vface.is_file():
            print(f"FATAL: {vface} missing (the vertical graph's v_face_crop node measures it)", file=sys.stderr)
            sys.exit(2)
        vc = json.loads(vface.read_text(encoding="utf-8"))
        # the face centre of THIS window (the subject drifts between windows: vertical-repurpose.md section 1b)
        hit = next((w for w in vc.get("windows", []) if float(w["window"][0]) - 0.05 <= w0 and w1 <= float(w["window"][1]) + 0.05), None)
        pct = float((hit or vc)["mean_pct"])
        cw, chh = 608, 1080                                   # 9:16 of the full frame height
        cx = max(0, min(1920 - cw, int(round(pct / 100.0 * 1920 - cw / 2)) // 2 * 2))
        crop_px = [cw, chh, cx, 0]
        crop = f",crop={cw}:{chh}:{cx}:0"
    elif not a.no_crop and rf.is_file():
        m = json.loads(rf.read_text(encoding="utf-8"))
        sc = float(m["scale"])
        cw, chh = int(1920 / sc) // 2 * 2, int(1080 / sc) // 2 * 2
        cx, cy = int(round(-m["x"] / sc)), int(round(-m["y"] / sc))
        crop_px = [cw, chh, cx, cy]
        crop = f",crop={cw}:{chh}:{cx}:{cy}"
    out = proj / "assets" / ("vertical/face-swap" if a.vertical else "face-swap") / f"{a.name}-raw-for-higgsfield.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)
    parts, labels = [], []
    if head:
        parts.append(f"[1:v]trim=start={(m0 - head) / FPS - EPS:.4f}:end={m0 / FPS - EPS:.4f},setpts=N/{FPS}/TB,format=yuv420p[h]")
        labels.append("[h]")
    parts.append(f"[0:v]trim=start={n0 / FPS - EPS:.4f}:end={n1 / FPS - EPS:.4f},setpts=N/{FPS}/TB,format=yuv420p[w]")
    labels.append("[w]")
    if tail:
        parts.append(f"[2:v]trim=start={(m1 + 1) / FPS - EPS:.4f}:end={(m1 + 1 + tail) / FPS - EPS:.4f},setpts=N/{FPS}/TB,format=yuv420p[t]")
        labels.append("[t]")
    fc = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=1:a=0,setpts=N/{FPS}/TB{crop}[v]"
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(fs), "-i", str(src), "-i", str(src), "-filter_complex", fc, "-map", "[v]",
           "-r", str(FPS), "-an", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", str(out)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 or not out.is_file():
        print("FATAL: ffmpeg failed\n" + r.stderr[-800:], file=sys.stderr)
        sys.exit(1)
    n_out = head + (n1 - n0) + tail
    # verify the WRITTEN clip: the frame count, and no black frame anywhere (black = the window ran past the face)
    chk = frames(out, 0, n_out + 5)
    dark = [i for i, f in enumerate(chk) if f.mean() < 8]
    if len(chk) != n_out or dark:
        print(f"FATAL: the clip has {len(chk)} frames (expected {n_out}) and black frames at {dark[:6]}: "
              "trim --window to the face frames", file=sys.stderr)
        sys.exit(1)
    # the desilencer joins inside the window = where the picture jumps (for the QA of the returned clip)
    d = ((G[1:] - G[:-1]) ** 2).mean(axis=(1, 2))
    med = float(np.median(d)) + 1e-6
    jumps = [round((head + i + 1) / FPS, 3) for i, v in enumerate(d) if v > max(150.0, 60 * med)]   # hard pose changes only
    meta = {"name": a.name, "final_spine": str(fs), "handles_from": str(src), "window_s": [w0, w1], "window_frames": [n0, n1],
            "clip": str(out), "clip_frames": n_out, "clip_s": round(n_out / FPS, 3),
            "window_starts_at_clip_frame": head, "window_starts_at_clip_s": round(head / FPS, 3),
            "head_handle_frames": head, "tail_handle_frames": tail,
            "source_index_of_first_window_frame": m0, "source_index_of_last_window_frame": m1,
            "match_mse": {"head": round(e0, 2), "tail": round(e1, 2)}, "picture_jumps_at_clip_s": jumps,
            "pre_cropped_to_face_reframe": crop_px,
            "note": "the clip is PRE-FRAMED (already centred and zoomed): the comp plays the returned swap clip full-frame, "
                    "WITHOUT FACE_REFRAME, starting at window_starts_at_clip_s; the spine's audio stays. The window frames are the "
                    "final spine's own frames, so the returned clip lines up with the spine frame for frame."}
    out.with_suffix(".json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"FACE-SWAP-SOURCE name={a.name} frames={n_out} ({n_out / FPS:.2f}s) head={head} tail={tail} "
          f"match_mse={e0:.1f}/{e1:.1f} jumps={len(jumps)} crop={crop_px}")
    print(f"WROTE {out}")


if __name__ == "__main__":
    main()
