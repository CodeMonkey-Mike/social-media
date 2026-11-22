#!/usr/bin/env python
"""face_scenes.py: the FACE scenes of a scripted standard recording (script.md, "Face scenes"; Mike 2026-11-22).

A `[FACE]` line is recorded on Mike's FULL-CAMERA OBS scene (the scene longform-edited records on), switched to for
the line and back. Nothing paints the picture on this track (no blackout), so the face scenes are found IN the picture:

  the screen-share scene : the webcam sits in the right column, so the frame's right edge is live picture
  the full-camera scene  : the camera does not fill the 16:9 canvas, so both side edges are black pillar bars

A frame is a FACE frame when the left and the right edge strips are both black and the middle of the frame is not.
Measured 2026-11-22: the full-camera scene (AI vs ML, 2026-11-10) has about 85 px of bar each side; every screen-share
layout (both channels) has the webcam against the right edge. On a new OBS layout, check the proof image
(`--proof`) before trusting it; the cue step also cross-checks every `[FACE]` line against these windows.

Two jobs, one module (imported by cue_script.py, cover_runs.py and desilence_preset.py, so there is ONE detector):
  detect(video)                      -> [(t_in, t_out)] face windows, frame-accurate on the file's own timestamps
  measure(video, windows, out_w, out_h, qa_dir)
                                     -> the CROP that centres his face (the longform-edited measured reframe, the same
                                        solver: face on the horizontal centre, eye line about 40% down, small headroom,
                                        bars out of frame), for a 16:9 or a 9:16 output, + a preview per window

  python face_scenes.py "<spine.mp4>" [--measure] [--vertical] [--proof <png>]
Machine line: FACE-SCENES windows=N total=<s> [crop=w:h:x:y scale=<s> centered=true|false]
"""
import argparse
import importlib.util
import json
import statistics
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
REFRAME = HERE.parents[2] / "longform-edited" / "scripts" / "measure_face_reframe.py"

SW, SH = 192, 108          # the scan frame: one pixel = a 10x10 block of a 1920x1080 frame
EDGE_COLS = 4              # 40 px at each side edge (the bars are about 85 px)
ROWS = slice(4, 104)       # leave the top and bottom few rows out (a lower third, a rounded corner)
DARK_MEAN, DARK_P95 = 14.0, 28.0     # luma: a black bar (0-16) passes, a webcam picture never does
LIVE_MEAN = 22.0           # the middle of a face frame is live picture
MIN_RUN_S = 0.3            # a face window shorter than this is a glitch, not a scene
MERGE_GAP = 3              # frames: a face run broken by this few non-face frames is one window


def _frame_times(video):
    """Every video frame's presentation time, in display order (packet pts, sorted: no decode)."""
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "packet=pts_time",
                        "-of", "csv=p=0", str(video)], capture_output=True, text=True)
    ts = sorted(float(x.strip().rstrip(",")) for x in r.stdout.split() if x.strip().rstrip(",") not in ("", "N/A"))
    return ts


def _fps(video):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate",
                        "-of", "csv=p=0", str(video)], capture_output=True, text=True)
    n, d = r.stdout.strip().split("/")
    return int(n) / int(d)


def classify(video):
    """[bool] per frame (display order): True = the full-camera scene."""
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(video), "-an", "-vf", f"scale={SW}:{SH}:flags=area,format=gray",
                          "-fps_mode", "passthrough", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    size, out = SW * SH, []
    while True:
        buf = p.stdout.read(size)
        if len(buf) < size:
            break
        f = np.frombuffer(buf, dtype=np.uint8).reshape(SH, SW).astype(np.float32)
        left, right = f[ROWS, :EDGE_COLS], f[ROWS, SW - EDGE_COLS:]
        mid = f[20:90, 40:150]
        dark = all(s.mean() < DARK_MEAN and np.percentile(s, 95) < DARK_P95 for s in (left, right))
        out.append(bool(dark and mid.mean() > LIVE_MEAN))
    p.stdout.close()
    p.wait()
    return out


def detect(video):
    """[(t_in, t_out)]: the face windows, t_in = the first face frame's time, t_out = the time the next frame starts."""
    flags = classify(video)
    ts = _frame_times(video)
    if not flags:
        return []
    fps = _fps(video)
    if len(ts) < len(flags):                         # a container without packet times: fall back to the frame rate
        ts = [i / fps for i in range(len(flags))]
    runs, cur = [], None
    for i, f in enumerate(flags):
        if f:
            if cur and i - cur[1] <= MERGE_GAP + 1:
                cur[1] = i
            else:
                cur = [i, i]
                runs.append(cur)
    out = []
    for a, b in runs:
        t0 = ts[a]
        t1 = ts[b + 1] if b + 1 < len(ts) else ts[b] + 1 / fps
        if t1 - t0 >= MIN_RUN_S:
            out.append((round(t0, 3), round(t1, 3)))
    return out


def _reframe_module():
    spec = importlib.util.spec_from_file_location("measure_face_reframe", REFRAME)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _grab(video, t, dest):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.3f}", "-i", str(video), "-frames:v", "1", str(dest)],
                   capture_output=True)
    return dest if dest.is_file() else None


def measure(video, windows, out_w=1920, out_h=1080, qa_dir=None, samples=5, eye_line=0.40, max_headroom=0.10,
            min_scale=1.0, max_scale=1.6):
    """The one crop (x, y, w, h in spine pixels) that frames every face window for an out_w x out_h output.
    16:9: the longform-edited solver (measure_face_reframe.solve), unchanged. 9:16: the full live height, as wide as
    9:16 allows, centred on his face and kept inside the live picture. Returns a dict, or None when no face is found."""
    mr = _reframe_module()
    W, H = mr.W, mr.H
    tmp = Path(qa_dir or Path(video).parent) / "_face-scan"
    tmp.mkdir(parents=True, exist_ok=True)
    boxes, areas, firsts, per = [], [], [], []
    for k, (a, b) in enumerate(windows):
        got = []
        for s in range(samples):
            t = a + (b - a) * (s + 0.5) / samples
            png = _grab(video, t, tmp / f"w{k}-{s}.png")
            if not png:
                continue
            if s == 0:
                firsts.append((k, png))
            ar = mr.active_area(png)
            if ar:
                areas.append(ar)
            fb = mr.face_box(png)
            if fb:
                got.append(fb)
        per.append({"window": [a, b], "detections": len(got),
                    "face_cx": round(statistics.median(x[0] + x[2] / 2 for x in got), 1) if got else None})
        boxes += got
    if not boxes or not areas:
        return None
    cx = statistics.median(x[0] + x[2] / 2 for x in boxes)
    eye_y = statistics.median(x[1] + mr.EYE_IN_BOX * x[3] for x in boxes)
    box_h = statistics.median(x[3] for x in boxes)
    head_top = statistics.median(x[1] for x in boxes) - mr.HAIR_ABOVE_BOX * box_h
    area = (max(x[0] for x in areas) + 2, min(x[1] for x in areas) - 2, max(x[2] for x in areas) + 2, min(x[3] for x in areas) - 2)
    ax0, ax1, ay0, ay1 = area
    if out_w * H == out_h * W:                       # 16:9: the longform-edited measured reframe, the same solver
        s, left, top, centered, need = mr.solve(cx, eye_y, head_top, area, eye_line, max_headroom, min_scale, max_scale)
        cw, ch = W / s, H / s
    else:                                            # 9:16 (or any other shape): the live height, centred on the face
        ch = ay1 - ay0
        cw = ch * out_w / out_h
        if cw > ax1 - ax0:
            cw, ch = ax1 - ax0, (ax1 - ax0) * out_h / out_w
        left = min(max(cx - cw / 2, ax0), ax1 - cw)
        top = ay0 + ((ay1 - ay0) - ch) / 2
        centered = abs((left + cw / 2) - cx) < 2
        s, need = out_h / ch, {}
    crop = {"x": int(round(left)) // 2 * 2, "y": int(round(top)) // 2 * 2, "w": int(round(cw)) // 2 * 2, "h": int(round(ch)) // 2 * 2}
    previews = []
    if qa_dir:
        for k, png in firsts:
            im = Image.open(png).convert("RGB")
            dst = Path(qa_dir) / f"face-{k + 1}-reframed.jpg"
            im.crop((crop["x"], crop["y"], crop["x"] + crop["w"], crop["y"] + crop["h"])).resize(
                (out_w // 2, out_h // 2), Image.LANCZOS).save(dst, quality=88)
            previews.append(str(dst))
    for p in tmp.glob("*.png"):
        p.unlink()
    try:
        tmp.rmdir()
    except OSError:
        pass
    spread = [w["face_cx"] for w in per if w["face_cx"] is not None]
    return {"crop": crop, "out": [out_w, out_h], "scale": round(out_h / crop["h"], 3), "centered": bool(centered),
            "face_cx": round(cx, 1), "eye_y": round(eye_y, 1), "active_area": list(area),
            "face_cx_spread": [min(spread), max(spread)] if spread else None, "windows": per, "previews": previews,
            "scale_needed_by": {k: round(v, 3) for k, v in need.items()}}


def proof(video, windows, dest, crop=None):
    """One image per face window: the frame with the crop drawn on it, so a wrong detection or framing shows."""
    tiles = []
    for k, (a, b) in enumerate(windows):
        png = _grab(video, (a + b) / 2, Path(dest).with_suffix(f".{k}.png"))
        if not png:
            continue
        im = Image.open(png).convert("RGB")
        Path(png).unlink()
        d = ImageDraw.Draw(im)
        if crop:
            d.rectangle([crop["x"], crop["y"], crop["x"] + crop["w"] - 1, crop["y"] + crop["h"] - 1], outline="lime", width=6)
        d.text((20, 20), f"face {k + 1}: {a:.2f}-{b:.2f} s", fill="yellow")
        tiles.append(im.resize((960, 540)))
    if tiles:
        sheet = Image.new("RGB", (960, 540 * len(tiles)), "black")
        for i, t in enumerate(tiles):
            sheet.paste(t, (0, 540 * i))
        sheet.save(dest)
    return bool(tiles)


def main():
    ap = argparse.ArgumentParser(description="Find the full-camera FACE scenes of a scripted standard recording.")
    ap.add_argument("video")
    ap.add_argument("--measure", action="store_true", help="also measure the crop that centres his face")
    ap.add_argument("--vertical", action="store_true", help="with --measure: the crop for the 1080x1920 cut")
    ap.add_argument("--proof", default=None, help="write a proof image (each window's middle frame, the crop drawn on it)")
    ap.add_argument("--json", default=None, help="write the result as JSON")
    a = ap.parse_args()
    wins = detect(a.video)
    res = {"video": str(Path(a.video).resolve()), "windows": [list(w) for w in wins]}
    for w in wins:
        print(f"  face {w[0]:.3f} - {w[1]:.3f} s ({w[1] - w[0]:.2f} s)")
    line = f"FACE-SCENES windows={len(wins)} total={sum(b - a for a, b in wins):.2f}"
    if a.measure and wins:
        m = measure(a.video, wins, *((1080, 1920) if a.vertical else (1920, 1080)),
                    qa_dir=Path(a.proof).parent if a.proof else None)
        if m:
            res["reframe"] = m
            c = m["crop"]
            line += f" crop={c['w']}:{c['h']}:{c['x']}:{c['y']} scale={m['scale']} centered={'true' if m['centered'] else 'false'}"
        else:
            line += " crop=none (no face found)"
    if a.proof and wins:
        proof(a.video, wins, a.proof, (res.get("reframe") or {}).get("crop"))
        print(f"proof -> {a.proof}")
    if a.json:
        Path(a.json).write_text(json.dumps(res, indent=1) + "\n", encoding="utf-8")
    print(line)


if __name__ == "__main__":
    main()
