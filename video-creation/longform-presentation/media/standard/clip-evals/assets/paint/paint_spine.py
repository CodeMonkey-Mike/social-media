"""Paint the empty deck area of the clip-evals spine (Mike recorded on the pieverse OBS scene: black deck area, webcam
at x 1371..1919, y 400..1079). Each chapter's span gets that chapter's deck slide; CH15's three screen-share lines get
the Evals dashboard captures. The slide images get a transparent hole where the webcam is and are laid OVER the spine,
so the spine stays the main input: its frames, timestamps and audio pass through (audio stream-copied).

    python paint_spine.py            -> spine/clip-evals EDIT2.painted.mp4 (+ paint-plan.txt beside this file)
"""
import importlib.util, json, subprocess, sys
from pathlib import Path
from PIL import Image
HERE = Path(__file__).resolve().parent; PROJ = HERE.parents[1]
SPINE = PROJ / "spine/clip-evals EDIT2.enhanced.mp4"; OUT = PROJ / "spine/clip-evals EDIT2.painted.mp4"
HOLE = (1371, 400, 1920, 1080)
spec = importlib.util.spec_from_file_location("sc", PROJ.parents[2] / "skills/script/script_common.py")
SC = importlib.util.module_from_spec(spec); spec.loader.exec_module(SC)
script = SC.parse((PROJ / "SCRIPT.md").read_text(encoding="utf-8"))
chapter = {e["n"]: int(e["section"].split(" - ")[0].replace("CH", "")) for e in script["lines"]}
cues = json.loads((PROJ / "overlays/cues.json").read_text(encoding="utf-8"))
dur = float(cues["duration"])
DASH = {350: "dash-top", 351: "dash-batch", 352: "dash-replays"}   # CH15's three screen-share lines (script file lines)
marks = []                                                          # (start time, image name)
for ln in sorted((l for l in cues["lines"] if l.get("tIn") is not None), key=lambda l: l["tIn"]):
    img = DASH.get(ln["n"]) or (f"slide-{chapter[ln['n']]:02d}" if chapter[ln["n"]] != 15 else None)
    if img is None:
        img = "dash-replays"                                        # rest of CH15 (covered): never the "switch to the browser" slide
    if not marks or marks[-1][1] != img:
        marks.append((0.0 if not marks else ln["tIn"], img))
for name in {m[1] for m in marks}:                                  # punch the webcam hole
    im = Image.open(HERE / f"{name}.png").convert("RGBA"); a = im.split()[3].point(lambda _: 255)
    a.paste(0, HOLE); im.putalpha(a); im.save(HERE / f"{name}.holed.png")
lst = ["ffconcat version 1.0"]
for i, (t, name) in enumerate(marks):
    end = marks[i + 1][0] if i + 1 < len(marks) else dur + 1.0
    lst += [f"file '{(HERE / (name + '.png')).as_posix()}'", f"duration {end - t:.3f}"]
lst.append(f"file '{(HERE / (marks[-1][1] + '.png')).as_posix()}'")
(HERE / "paint.ffconcat").write_text("\n".join(lst) + "\n", encoding="utf-8")
(HERE / "paint-plan.txt").write_text("\n".join(f"{t:8.2f}  {n}" for t, n in marks) + "\n", encoding="utf-8")
print("\n".join(f"{t:8.2f}  {n}" for t, n in marks))
BG = HERE / "paint-bg.mp4"
bgcmd = ["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(HERE / "paint.ffconcat"),
         "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-t", f"{dur + 0.5:.3f}", str(BG)]
# the spine stays the main input (its frames, timestamps and audio pass through); the background goes over it and the
# webcam, cropped from the spine itself, goes back on top
cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(SPINE), "-i", str(BG), "-filter_complex",
       f"[0:v]split[s][c];[c]crop={HOLE[2]-HOLE[0]}:{HOLE[3]-HOLE[1]}:{HOLE[0]}:{HOLE[1]}[cam];"
       f"[s][1:v]overlay=0:0:eof_action=repeat[t];[t][cam]overlay={HOLE[0]}:{HOLE[1]}[v]",
       "-map", "[v]", "-map", "0:a", "-c:a", "copy", "-c:v", "libx264", "-crf", "18", "-preset", "medium",
       "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUT)]
if "--plan" not in sys.argv:
    r = subprocess.run(bgcmd).returncode or subprocess.run(cmd).returncode
    BG.unlink(missing_ok=True); sys.exit(r)
