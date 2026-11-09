"""join_face_swap_halves.py — join the re-timed halves of ONE face window into one swap clip (comp-build.md 3b, step 5).

    python scripts/join_face_swap_halves.py <media/<project>> <name> <half> <half> [...]

Each half is a re-timed clip assets/face-swap/<half>-higgsfield-bg-swap.mp4 whose window is known from
assets/face-swap/<half>-raw-for-higgsfield.json. The FIRST half is taken from its clip start (its head handle is kept, so
the result still starts `window_starts_at_clip_s` before the window) up to its window end; every later half is taken from
its own window start to its window end. Halves must be contiguous on the spine (each starts where the previous ended).
One sync-safe filter_complex (trim + concat), video only, 30 fps. Writes <name>-higgsfield-bg-swap.mp4 + .json sidecar.
Machine line: SWAP-JOIN ok|FAIL name=<n> clip=<s> window=<a>-<b> window_starts_at_clip_s=<s>
"""
import json, subprocess, sys
from pathlib import Path

FPS = 30
P = Path(sys.argv[1]).resolve(); name = sys.argv[2]; halves = sys.argv[3:]
if len(halves) < 1:   # ONE piece is valid (lets-get-rich 2026-10-31): an unsplit window still needs the sidecar
    print("SWAP-JOIN FAIL need at least one re-timed clip"); sys.exit(1)
D = P / "assets/face-swap"
parts, inputs, chain = [], [], []
for i, h in enumerate(halves):
    src = json.loads((D / f"{h}-raw-for-higgsfield.json").read_text(encoding="utf-8"))
    clip = D / f"{h}-higgsfield-bg-swap.mp4"
    if not clip.is_file():
        print(f"SWAP-JOIN FAIL missing {clip}"); sys.exit(1)
    w0, w1 = src["window_s"]; at = float(src["window_starts_at_clip_s"])
    # FRAME-exact (only-18-months-left 2026-10-26): cutting on rounded seconds kept one extra frame of the first half
    # at the seam, so every later half played 1 frame (33 ms) behind the voice. Work in whole frames of the 30 fps clip.
    at_f = round(at * FPS)
    start_f = 0 if i == 0 else at_f
    end_f = at_f + (round(w1 * FPS) - round(w0 * FPS))
    start, end = start_f / FPS, end_f / FPS
    if i > 0 and abs(w0 - parts[-1]["window_s"][1]) > 0.02:
        print(f"SWAP-JOIN FAIL {h} starts at {w0} but the previous half ends at {parts[-1]['window_s'][1]}"); sys.exit(1)
    parts.append({"half": h, "clip": str(clip), "window_s": [w0, w1], "take_clip_s": [round(start, 3), round(end, 3)]})
    inputs += ["-i", str(clip)]
    chain.append(f"[{i}:v]fps={FPS},trim=start_frame={start_f}:end_frame={end_f},setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
fc = ";".join(chain) + ";" + "".join(f"[v{i}]" for i in range(len(halves))) + f"concat=n={len(halves)}:v=1:a=0[v]"
out = D / f"{name}-higgsfield-bg-swap.mp4"
final_out = out
if any(str(out) == pp["clip"] for pp in parts):   # a one-piece join reads and writes the same file: go via a temp
    out = D / f"{name}-higgsfield-bg-swap.joining.mp4"
r = subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc, "-map", "[v]", "-an",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)],
                   capture_output=True, text=True)
if r.returncode != 0:
    print("SWAP-JOIN FAIL ffmpeg:", r.stderr[-400:]); sys.exit(1)
if out != final_out:
    import os
    os.replace(out, final_out); out = final_out
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=nb_frames,duration",
                        "-of", "csv=p=0", str(out)], capture_output=True, text=True).stdout.strip().split(",")
first = json.loads((D / f"{halves[0]}-raw-for-higgsfield.json").read_text(encoding="utf-8"))
at = float(first["window_starts_at_clip_s"]); w0 = parts[0]["window_s"][0]; w1 = parts[-1]["window_s"][1]
side = {"name": name, "clip": str(out), "clip_frames": int(probe[1]) if len(probe) > 1 and probe[1].isdigit() else None,
        "clip_s": round(float(probe[0]) if probe[0] not in ("", "N/A") else 0.0, 3), "fps": FPS,
        "window_s": [w0, w1], "window_frames": [round(w0 * FPS), round(w1 * FPS)],
        "window_starts_at_clip_s": at, "window_starts_at_clip_frame": round(at * FPS),
        "built_from": (f"{len(halves)} re-timed halves joined at their shared spine time(s) {[p['window_s'][0] for p in parts[1:]]} (desilencer joins in the footage)" if len(halves) > 1 else "one re-timed clip (the window has no join inside; no split)"),
        "halves": parts}
(D / f"{name}-higgsfield-bg-swap.json").write_text(json.dumps(side, indent=2), encoding="utf-8")
print(f"SWAP-JOIN ok name={name} clip={side['clip_s']} window={w0}-{w1} window_starts_at_clip_s={at} frames={side['clip_frames']}")
