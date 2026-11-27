"""Paint the empty deck area of the livestream-aws spine (Mike recorded the screen-share lines over a black deck
area; the AI channel's OBS layout: webcam at x 1371..1919, y 400..1079). Copied from langgraph-updates' paint_spine.py (itself adapted from clip-evals'), with
one change for the face scenes: the paint is OFF inside the full-camera windows (cues.json `face_windows`, found in the
picture), so his face is never painted over. The first face window is widened to start at 0.

Each screen-share line gets the still its `[NOTE]` names (shoot_slides.py). The still switches in the middle of the
cover run before the line, where a card hides the recording, so a run's fade in and out shows the same still as the
screen-share line beside it. The still goes OVER the spine and the webcam, cropped from the spine itself, goes back on
top, so the spine stays the main input: its frames, timestamps and audio pass through (audio stream-copied).

    python paint_spine.py [--plan]   -> spine/livestream-aws EDIT.painted.mp4 (+ paint-plan.txt beside this file)
"""
import json, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJ = HERE.parents[1]
SPINE = PROJ / "spine/livestream-aws EDIT.enhanced.mp4"
OUT = PROJ / "spine/livestream-aws EDIT.painted.mp4"
HOLE = (1371, 400, 1920, 1080)
STILL = {63: "slide-ec2-question", 87: "slide-the-gate", 117: "slide-ec2-answer",
         155: "slide-langgraph-playlist"}     # SCRIPT.md line -> still

cues = json.loads((PROJ / "overlays/cues.json").read_text(encoding="utf-8"))
dur = float(cues["duration"])
runs = sorted(cues["runs"], key=lambda r: r["tIn"])
ss = sorted((l for l in cues["lines"] if l["n"] in STILL), key=lambda l: l["tIn"])
assert [l["n"] for l in ss] == sorted(STILL), "a screen-share line moved: update STILL"
marks = [(0.0, STILL[ss[0]["n"]])]
for ln in ss[1:]:
    run = max((r for r in runs if r["tOut"] <= ln["tIn"] + 1e-6), key=lambda r: r["tOut"])
    marks.append(((run["tIn"] + run["tOut"]) / 2, STILL[ln["n"]]))
faces = [list(w) for w in cues["face_windows"]]
faces[0][0] = 0.0
off = "+".join(f"gte(t,{a:.4f})*lt(t,{b:.4f})" for a, b in faces)
enable = f"not({off})"

lst = ["ffconcat version 1.0"]
for i, (t, name) in enumerate(marks):
    end = marks[i + 1][0] if i + 1 < len(marks) else dur + 1.0
    lst += [f"file '{(HERE / (name + '.png')).as_posix()}'", f"duration {end - t:.3f}"]
lst.append(f"file '{(HERE / (marks[-1][1] + '.png')).as_posix()}'")
(HERE / "paint.ffconcat").write_text("\n".join(lst) + "\n", encoding="utf-8")
plan = [f"{t:8.2f}  {n}" for t, n in marks] + [f"face window (no paint) {a:.2f}-{b:.2f}" for a, b in faces]
(HERE / "paint-plan.txt").write_text("\n".join(plan) + "\n", encoding="utf-8")
print("\n".join(plan))

BG = HERE / "paint-bg.mp4"
bgcmd = ["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(HERE / "paint.ffconcat"),
         "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-t", f"{dur + 0.5:.3f}",
         str(BG)]
cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(SPINE), "-i", str(BG), "-filter_complex",
       f"[0:v]split[s][c];[c]crop={HOLE[2]-HOLE[0]}:{HOLE[3]-HOLE[1]}:{HOLE[0]}:{HOLE[1]}[cam];"
       f"[s][1:v]overlay=0:0:eof_action=repeat:shortest=1:enable='{enable}'[t];"   # end with the spine, not the still track
       f"[t][cam]overlay={HOLE[0]}:{HOLE[1]}:enable='{enable}'[v]",
       "-map", "[v]", "-map", "0:a", "-c:a", "copy", "-c:v", "libx264", "-crf", "18", "-preset", "medium",
       "-pix_fmt", "yuv420p", "-fps_mode", "passthrough", "-movflags", "+faststart", str(OUT)]
if "--plan" not in sys.argv:
    r = subprocess.run(bgcmd).returncode or subprocess.run(cmd).returncode
    BG.unlink(missing_ok=True)
    sys.exit(r)
