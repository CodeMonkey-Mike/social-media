#!/usr/bin/env python
"""cover_runs.py: the COVER RUNS of a SCRIPTED standard presentation video (format 4, scripted option).

Read ../script/script.md and card-overlays.md ("Cover runs") first. card_overlays.py is built for a handful of
separate overlays that each fade back to the recording; a scripted video is covered for most of its runtime by cards
that follow each other. So every RUN of consecutive `[COVER]` lines is rendered here as ONE clip, and the UNCHANGED
card_overlays.py composites those clips: its clip fade-in / fade-out is the move between a screen-share scene and a
cover run, and inside a run the recording can never show through, because a new card is composited over the
PREVIOUS card, never over the recording.

  python cover_runs.py "media/standard/<p>/overlays/cues.json"            # check -> build -> render -> qa
  python cover_runs.py "media/standard/<p>/overlays/cues.json" --step check | build | render | qa
      [--spine <final spine.mp4>] [--out "../<p> FINAL-v1.mp4"] [--deck "../<p>.html"]
      [--cards-dir <folder> ...] [--crf 10]

Input : overlays/cues.json (cue_script.py: the lines, the windows, the runs).
Cards : stills `<id>.png` / `<id>-<state>.png` and animated-chart pages `<id>.html` (time-driven, `window.setT(t)`,
        rendered for their window through html_clip.py), at 1920x1080. Looked up in <project>/assets/cards/,
        then assets/diagrams/, then assets/charts/ (--cards-dir replaces the list).
Frame : a cover ALWAYS fills the whole 1920x1080 frame, hiding the webcam and the CTA (Mike 2026-11-14: scripted =
        screen-share scenes + full-screen cover scenes; there is no deck-area cover and no setting for it).
Output: overlays/runs/<run id>.mp4 (one clip per run, EXACTLY round(out*fps) - round(in*fps) frames, near-lossless
        yuv444p) and overlays/cards.json with one `kind: clip` entry per run (existing non-run cards are kept).
        `render` then runs card_overlays.py --step render on it; `qa` writes the per-card contact sheet into
        <project>/_qa/ and runs the LEAK CHECK (frames of the FINAL inside every run, compared with the run clip).

Inside a run: the first card is simply up (card_overlays.py fades the clip in over the recording); a NEW card enters
with the 11-frame 0.93 -> 1 scale + alpha entrance over the previous card; a new STATE of the same card is a 6-frame
cross-fade; an animated chart plays from t = 0 at its window start, fades in over the previous card and holds its
last frame for the next card to enter over.

THE VERTICAL CUT (`--vertical`, an extra Mike names in the script header or asks for later; script.md "The extras"):
the SAME cues rendered a second time at 1080x1920. Nothing of the 16:9 is touched: the card set is looked up in
<project>/assets/vertical/cards | diagrams | charts (the same file names, every card rebuilt native vertical by its
builder), the run clips go to overlays/runs-v/, the spec to overlays/cards-v.json, the deliverable is
"<project> VERTICAL-v1.mp4". A `[COVER]` scene is the vertical card, full frame. A `[SCREENSHARE]` scene cannot ship as
filmed in 9:16, so the recording is RE-STACKED: the slide area across the top at full width, the webcam centred under
it (card_overlays.py "layout", one encode, the spine's own frame timestamps). The two source rectangles default to the
standard recording layout; on a new OBS layout pass --deck-rect / --cam-rect (x,y,w,h in spine pixels; --cam-rect none
= the slide alone). They are saved in cards-v.json. The QA step adds one tile per screen-share scene and the LAYOUT
PROOF (<project>/_qa/<VERTICAL>-layout-proof.png): both rectangles drawn on a real frame, beside the frame they make.

  python cover_runs.py "media/standard/<p>/overlays/cues.json" --vertical [--step check | build | render | qa]
      [--deck-rect 0,0,1464,1080] [--cam-rect 1466,400,454,680 | none] [--bg 0x0a0c10] [--out "../<p> VERTICAL-v2.mp4"]

FACE SCENES (`[FACE]` lines, 2026-11-22; ../script/script.md "Face scenes"): cue_script.py found the full-camera OBS
scenes in the spine's picture (`face_windows` in cues.json). The build step MEASURES the one crop that centres his face
(../script/face_scenes.py, the longform-edited solver: face on the horizontal centre, eye line about 40% down, bars out
of frame; for --vertical the live height cut to 9:16 around his face), saves it in overlays/face-reframe.json
(face-reframe-v.json) and writes `face_reframe` into cards.json, so card_overlays.py zooms those windows in the same
encode. The QA step writes <project>/_qa/<FINAL>-face-proof.png (the crop drawn on each window, beside the frame it
makes); open it.

Machine lines: COVER-RUNS PASS|FAIL runs=N cards=N frames=N faces=N   ·   LEAK-CHECK PASS|FAIL samples=N min_psnr=<dB>
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import card_overlays as CO  # noqa: E402  (the unchanged renderer: its entrance length, exit length and frame maths)
sys.path.insert(0, str(HERE.parent / "script"))
import face_scenes as FS  # noqa: E402  (the ONE face-scene detector + the measured face crop)

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

IN_FRAMES = CO.IN_FRAMES          # a new card's entrance, the same look as a card_overlays still
XF_FRAMES = 6                     # a state change of the same card
LEAK_PSNR = 30.0                  # dB: a frame of the FINAL inside a run must match the run clip at least this well

# ── the VERTICAL cut (--vertical; script.md "The extras", Mike 2026-11-15) ───────────────────────────────────────────
VERT_W, VERT_H = 1080, 1920
# the screen-share layout of a standard recording, in spine pixels (measured on binance, 1920x1080; card-overlays.md
# "The layout"): the deck area, and the webcam under the membership box in the right column. Re-measure on a new OBS
# layout and pass --deck-rect / --cam-rect; the layout proof in the QA step shows both rectangles on a real frame.
DECK_RECT = {"x": 0, "y": 0, "w": 1464, "h": 1080}
CAM_RECT = {"x": 1466, "y": 400, "w": 454, "h": 680}
VERT_TOP, VERT_GAP, VERT_BOTTOM = 60, 24, 40     # px: above the slide, between the slide and the webcam, under the webcam
CAM_MAX_UP = 1.5                  # the webcam is small in the recording: never enlarge it past this (it goes soft)
VERT_BG = "0x0a0c10"              # the deck's --bg-deep


def _even(v):
    return int(round(v)) // 2 * 2


def stacked_panes(deck, cam):
    """The vertical frame of a SCREEN-SHARE scene: the slide area across the top at full width, the webcam centred
    under it (as large as the room left allows, never past CAM_MAX_UP). cam None = the slide area alone."""
    dh = _even(deck["h"] * VERT_W / deck["w"])
    panes = [{"name": "deck", "src": deck, "dst": {"x": 0, "y": VERT_TOP, "w": VERT_W, "h": dh}}]
    if cam:
        avail = VERT_H - VERT_TOP - dh - VERT_GAP - VERT_BOTTOM
        sc = min(avail / cam["h"], VERT_W / cam["w"], CAM_MAX_UP)
        cw, ch = _even(cam["w"] * sc), _even(cam["h"] * sc)
        panes.append({"name": "webcam", "src": cam, "dst": {"x": _even((VERT_W - cw) / 2), "y": VERT_TOP + dh + VERT_GAP, "w": cw, "h": ch}})
    return panes


def _rect(text):
    try:
        x, y, w, h = (int(v) for v in text.replace(" ", "").split(","))
    except ValueError:
        sys.exit(f"a rectangle is x,y,w,h in spine pixels, got '{text}'")
    return {"x": x, "y": y, "w": w, "h": h}


def probe(path, entries, stream=True):
    r = subprocess.run(["ffprobe", "-v", "error"] + (["-select_streams", "v:0"] if stream else []) +
                       ["-show_entries", entries, "-of", "default=nw=1:nk=1", str(path)], capture_output=True, text=True)
    return r.stdout.split()


def label(seg):
    return seg["card"] + (f".{seg['state']}" if seg.get("state") else "")


class Job:
    def __init__(self, a):
        self.cues_path = Path(a.cues).resolve()
        self.cues = json.loads(self.cues_path.read_text(encoding="utf-8"))
        self.ov = self.cues_path.parent
        self.proj = self.ov.parent
        # the VERTICAL cut is the same cues rendered a second time: its own spec, run clips and card set, so the 16:9
        # files are never touched (cards-v.json, runs-v/, assets/vertical/...)
        self.vertical = bool(a.vertical)
        self.cards_json = self.ov / ("cards-v.json" if self.vertical else "cards.json")
        self.old = json.loads(self.cards_json.read_text(encoding="utf-8")) if self.cards_json.is_file() else {}
        wide = self.ov / "cards.json"            # the 16:9 spec: where a first vertical run finds the spine and the deck
        self.wide = json.loads(wide.read_text(encoding="utf-8")) if self.vertical and wide.is_file() else {}
        ref = self.old if self.old.get("spine") else self.wide
        spine = a.spine or self.cues.get("spine") or (str((self.ov / ref["spine"]).resolve()) if ref.get("spine") else None)
        if not spine or not Path(spine).is_file():
            sys.exit("no spine: pass --spine <final spine.mp4> (or run cue_script.py with --spine)")
        self.spine = Path(spine).resolve()
        num, den = probe(self.spine, "stream=r_frame_rate")[0].split("/")
        self.fps = round(int(num) / int(den))
        self.dur = float(probe(self.spine, "format=duration", stream=False)[0])
        # a cover always fills the whole frame (Mike 2026-11-14): 1920x1080, or the 1080x1920 vertical frame
        self.region = {"x": 0, "y": 0, "w": VERT_W, "h": VERT_H} if self.vertical else dict(CO.FULL)
        self.W, self.H = self.region["w"], self.region["h"]
        root = self.proj / "assets" / "vertical" if self.vertical else self.proj / "assets"
        self.dirs = [Path(d).resolve() for d in a.cards_dir] if a.cards_dir else [root / "cards", root / "diagrams", root / "charts"]
        self.out = a.out or self.old.get("out") or f"../{self.proj.name} {'VERTICAL' if self.vertical else 'FINAL'}-v1.mp4"
        self.deck = a.deck or self.old.get("deck") or self.wide.get("deck") or f"../{self.proj.name}.html"
        self.crf = a.crf
        self.runs_dir = self.ov / ("runs-v" if self.vertical else "runs")
        self.layout = self._layout(a) if self.vertical else None
        self.plan = self._plan()
        self.face_windows = [list(w) for w in self.cues.get("face_windows", [])]
        self.has_face_lines = any(r["tag"] == "FACE" for r in self.cues["lines"])
        self.face_json = self.ov / ("face-reframe-v.json" if self.vertical else "face-reframe.json")

    def face_reframe(self):
        """The measured crop for the face windows ({crop, windows, ...}), cached in face-reframe(-v).json and re-measured
        only when the spine, the windows or the output size change. None when there is no face window."""
        if not self.face_windows:
            return None
        key = {"spine": str(self.spine), "mtime": int(self.spine.stat().st_mtime), "windows": self.face_windows,
               "out": [self.W, self.H]}
        if self.face_json.is_file():
            old = json.loads(self.face_json.read_text(encoding="utf-8"))
            if old.get("key") == key and old.get("crop"):
                return old
        qa_dir = self.proj / "_qa"
        qa_dir.mkdir(exist_ok=True)
        print(f"  measuring the face crop on {len(self.face_windows)} face window(s) ({self.W}x{self.H})", flush=True)
        m = FS.measure(self.spine, self.face_windows, self.W, self.H, qa_dir=qa_dir)
        if not m:
            sys.exit("no face found in the face windows: check them in CUE-REPORT.md section 5b (and the spine's picture)")
        m.update({"key": key, "windows": self.face_windows})
        self.face_json.write_text(json.dumps(m, indent=1) + "\n", encoding="utf-8", newline="\n")
        c = m["crop"]
        print(f"  face crop {c['w']}x{c['h']} at {c['x']},{c['y']} (x{m['scale']}), centred: {'yes' if m['centered'] else 'NO, the zoom cap was hit'}", flush=True)
        return m

    def _layout(self, a):
        """The vertical frame of the screen-share scenes (card_overlays.py "layout"): the rectangles given on the command
        line, else the ones already in cards-v.json, else the standard recording layout."""
        prev = {p["name"]: p["src"] for p in (self.old.get("layout") or {}).get("panes", [])}
        deck = _rect(a.deck_rect) if a.deck_rect else prev.get("deck") or dict(DECK_RECT)
        if a.cam_rect:
            cam = None if a.cam_rect.strip().lower() == "none" else _rect(a.cam_rect)
        else:
            cam = prev.get("webcam") if self.old.get("layout") else dict(CAM_RECT)
        sw, sh = (int(v) for v in probe(self.spine, "stream=width,height")[:2])
        for name, r in (("deck", deck), ("webcam", cam)):
            if r and not (0 <= r["x"] and 0 <= r["y"] and r["x"] + r["w"] <= sw and r["y"] + r["h"] <= sh and r["w"] > 0 and r["h"] > 0):
                sys.exit(f"the {name} rectangle {r} does not fit the {sw}x{sh} spine")
        return {"w": VERT_W, "h": VERT_H, "bg": a.bg or (self.old.get("layout") or {}).get("bg") or VERT_BG,
                "panes": stacked_panes(deck, cam)}

    def _plan(self):
        """Frame maths, identical to card_overlays.py: a clip must hold round(out * fps) - round(in * fps) frames."""
        plan = []
        for run in self.cues.get("runs", []):
            t_out = min(run["tOut"], self.dur)
            f_in, f_out = round(run["tIn"] * self.fps), round(t_out * self.fps)
            segs, edges = [], [round(s["tIn"] * self.fps) - f_in for s in run["segments"]] + [f_out - f_in]
            edges[0] = 0
            for s, a, b in zip(run["segments"], edges, edges[1:]):
                segs.append({**s, "f0": a, "frames": b - a})
            plan.append({"id": run["id"], "in": run["tIn"], "out": t_out, "f_in": f_in, "frames": f_out - f_in,
                         "lines": run["lines"], "segments": segs})
        return plan

    def find(self, name):
        for d in self.dirs:
            if (d / name).is_file():
                return d / name
        return None

    def source(self, seg):
        """(path or None, 'still' | 'page') for a segment's card."""
        if seg.get("kind") == "animated-chart":
            return self.find(f"{seg['card']}.html"), "page"
        name = f"{seg['card']}-{seg['state']}.png" if seg.get("state") else f"{seg['card']}.png"
        return self.find(name), "still"

    # ── check ────────────────────────────────────────────────────────────────────────────────────────────────────
    def check(self):
        fails, flags = [], []
        min_run = IN_FRAMES + round(CO.OUT_S * self.fps) + self.fps
        missing = [r["n"] for r in self.cues["lines"] if r["status"] == "MISSING" and r["tag"] == "COVER"]
        if missing and not self.cues.get("allow_missing"):
            fails.append(f"`[COVER]` script line(s) {', '.join(map(str, missing))} have no window (cue_script.py failed on them)")
        for r in self.cues["lines"]:
            if r["tag"] == "COVER" and r["status"] != "MISSING" and not any(r["n"] in run["lines"] for run in self.plan):
                fails.append(f"script line {r['n']} is a `[COVER]` line with a window but sits in no run")
        prev_out = 0.0
        for run in self.plan:
            if run["in"] < prev_out - 1e-6:
                fails.append(f"{run['id']} starts at {run['in']} before the previous run ends ({prev_out})")
            prev_out = run["out"]
            if run["frames"] < min_run:
                fails.append(f"{run['id']} is {run['frames']} frames; card_overlays.py needs at least {min_run} "
                             f"(entrance + exit + 1 s). Make the line a screen-share line or merge it into a neighbour")
            if sum(s["frames"] for s in run["segments"]) != run["frames"] or any(s["frames"] <= 0 for s in run["segments"]):
                fails.append(f"{run['id']}: its card windows do not add up to the run ({[s['frames'] for s in run['segments']]} vs {run['frames']})")
            for s in run["segments"]:
                src, kind = self.source(s)
                if src is None:
                    want = f"{s['card']}.html" if kind == "page" else (f"{s['card']}-{s['state']}.png" if s.get("state") else f"{s['card']}.png")
                    fails.append(f"{run['id']}: no file `{want}` for card {label(s)} in {', '.join(str(d) for d in self.dirs)}"
                                 + (" (the VERTICAL card set: every card is rebuilt native 1080x1920 by its builder, "
                                    "never a scaled or cropped 16:9 card; script.md 'The extras')" if self.vertical else ""))
                    continue
                if kind == "still":
                    w, h = Image.open(src).size
                    if (w, h) != (self.W, self.H):
                        fails.append(f"{run['id']}: {src.name} is {w}x{h}, a cover is the full frame {self.W}x{self.H} (build it at that size)")
                elif "setT" not in src.read_text(encoding="utf-8", errors="replace"):
                    fails.append(f"{run['id']}: {src.name} has no window.setT(t): an animated chart is a TIME-DRIVEN page (card-overlays.md, kind clip)")
                if s["frames"] < self.fps:
                    flags.append(f"{run['id']}: card {label(s)} is up for only {s['frames'] / self.fps:.2f} s")
        if self.has_face_lines and "face_windows" not in self.cues:
            fails.append("the script has `[FACE]` lines but cues.json has no face windows: re-run cue_script.py with --spine")
        elif self.has_face_lines and not self.face_windows:
            fails.append("the script has `[FACE]` lines but the spine has no full-camera scene (cue_script.py found none): "
                         "was the take recorded without switching OBS to the full-camera scene?")
        for f in flags:
            print(f"  FLAG  {f}")
        for f in fails:
            print(f"  FAIL  {f}")
        return fails

    def machine(self, ok):
        print(f"COVER-RUNS {'PASS' if ok else 'FAIL'} runs={len(self.plan)} cards={sum(len(r['segments']) for r in self.plan)} "
              f"frames={sum(r['frames'] for r in self.plan)} faces={len(self.face_windows)}")

    # ── build ────────────────────────────────────────────────────────────────────────────────────────────────────
    def _signature(self, run):
        srcs = []
        for s in run["segments"]:
            src, _ = self.source(s)
            st = src.stat()
            srcs.append([label(s), s["frames"], str(src), st.st_size, int(st.st_mtime)])
        return {"v": 2, "frames": run["frames"], "fps": self.fps, "size": [self.W, self.H], "crf": self.crf, "segments": srcs}

    def _chart_clip(self, run, k, seg, page):
        """An animated chart rendered for exactly its window (html_clip.py: Playwright frame by frame at setT(f / fps))."""
        clip = self.runs_dir / f"_{run['id']}-{k:02d}-{seg['card']}.mp4"
        if clip.is_file() and clip.stat().st_mtime >= page.stat().st_mtime and \
                (probe(clip, "stream=nb_frames") or ["0"])[0] == str(seg["frames"]):
            return clip
        print(f"  {run['id']}: rendering animated chart {seg['card']} ({seg['frames']} frames) through html_clip.py", flush=True)
        rc = subprocess.run([sys.executable, "-u", str(HERE / "html_clip.py"), str(page), "--frames", str(seg["frames"]),
                             "--fps", str(self.fps), "--size", f"{self.W}x{self.H}", "--crf", "10", "--out", str(clip)]).returncode
        if rc or not clip.is_file():
            sys.exit(f"html_clip.py failed on {page}")
        return clip

    def _build_run(self, run):
        W, H, fps = self.W, self.H, self.fps
        out = self.runs_dir / f"{run['id']}.mp4"
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(fps),
                                "-i", "-", "-an", "-c:v", "libx264", "-crf", str(self.crf), "-preset", "fast", "-pix_fmt", "yuv444p",
                                "-g", str(max(1, fps // 2)),         # a keyframe every half second: the QA seeks into this clip
                                str(out)], stdin=subprocess.PIPE)
        prev, prev_card, written = None, None, 0

        def put(arr, n=1):
            nonlocal written
            buf = arr.tobytes()
            for _ in range(n):
                enc.stdin.write(buf)
            written += n

        for k, seg in enumerate(run["segments"]):
            src, kind = self.source(seg)
            n = seg["frames"]
            if kind == "page":
                clip = self._chart_clip(run, k, seg, src)
                dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(clip), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                       stdout=subprocess.PIPE)
                size, fade, last = W * H * 3, (min(IN_FRAMES, n) if prev is not None else 0), None
                for i in range(n):
                    buf = dec.stdout.read(size)
                    fr = np.frombuffer(buf, dtype=np.uint8).reshape(H, W, 3) if len(buf) == size else last
                    if fr is None:
                        sys.exit(f"{clip} holds no frame")
                    last = fr
                    if i < fade:                                 # fade in over the previous card
                        e = 1 - (1 - (i + 1) / fade) ** 3
                        fr = (prev.astype(np.float32) * (1 - e) + fr.astype(np.float32) * e + 0.5).astype(np.uint8)
                    put(fr)
                dec.stdout.close()
                dec.wait()
                prev = np.array(last)
            else:
                card = Image.open(src).convert("RGB")
                arr = np.asarray(card, dtype=np.uint8)
                if prev is None:
                    tn = 0                                       # the run's first card: card_overlays fades the clip in
                elif seg["card"] == prev_card:
                    tn = min(XF_FRAMES, n)                       # a new state of the same card: cross-fade
                    for i in range(tn):
                        a = (i + 1) / tn
                        put((prev.astype(np.float32) * (1 - a) + arr.astype(np.float32) * a + 0.5).astype(np.uint8))
                else:
                    tn = min(IN_FRAMES, n)                       # a new card: scale + alpha entrance over the previous card
                    for i in range(tn):
                        e = 1 - (1 - (i + 1) / tn) ** 3
                        s = 0.93 + 0.07 * e
                        w, h = round(W * s), round(H * s)
                        x0, y0 = (W - w) // 2, (H - h) // 2
                        base = Image.fromarray(prev)
                        base.paste(Image.blend(base.crop((x0, y0, x0 + w, y0 + h)), card.resize((w, h), Image.LANCZOS), e), (x0, y0))
                        put(np.asarray(base, dtype=np.uint8))
                put(arr, n - tn)
                prev = arr
            prev_card = seg["card"]
        enc.stdin.close()
        if enc.wait():
            sys.exit(f"ffmpeg failed encoding {out}")
        got = int((probe(out, "stream=nb_frames") or ["0"])[0])
        if got != run["frames"] or written != run["frames"]:
            sys.exit(f"{out.name}: {got} frames encoded ({written} written), the window is {run['frames']}")
        (self.runs_dir / f"{run['id']}.json").write_text(json.dumps(self._signature(run)), encoding="utf-8")

    def build(self):
        self.runs_dir.mkdir(parents=True, exist_ok=True)
        for run in self.plan:
            out, sig_p = self.runs_dir / f"{run['id']}.mp4", self.runs_dir / f"{run['id']}.json"
            if out.is_file() and sig_p.is_file() and json.loads(sig_p.read_text(encoding="utf-8")) == self._signature(run):
                print(f"  {run['id']}: unchanged, kept ({run['frames']} frames)")
                continue
            print(f"  {run['id']}: {run['frames']} frames, {len(run['segments'])} card window(s): "
                  + " > ".join(label(s) for s in run["segments"]), flush=True)
            self._build_run(run)
        self._write_cards_json()

    def _rel(self, p):
        p = Path(p)
        if not p.is_absolute():
            return str(p).replace("\\", "/")
        try:
            return str(Path("..") / p.relative_to(self.proj)).replace("\\", "/")
        except ValueError:
            return str(p).replace("\\", "/")

    def _write_cards_json(self):
        by_n = {r["n"]: r for r in self.cues["lines"]}
        runs = []
        for run in self.plan:
            first, last = by_n[run["lines"][0]], by_n[run["lines"][-1]]
            say = first["heard"][:70] + (" ... " + last["heard"][-50:] if last is not first else "")
            entry = {"id": run["id"], "in": run["in"], "out": run["out"], "say": say, "kind": "clip",
                     "src": f"{self.runs_dir.name}/{run['id']}.mp4", "cover_cards": [label(s) for s in run["segments"]]}
            # a run on the video's first / last frame has no recording to fade from / to (card_overlays.py opt-in keys)
            if run["f_in"] == 0:
                entry["fade_in"] = False
            if run["f_in"] + run["frames"] >= round(self.dur * self.fps):
                entry["fade_out"] = False
            runs.append(entry)
        keep = [c for c in self.old.get("cards", []) if not str(c.get("id", "")).startswith("run-")]
        for c in keep:
            if any(c["in"] < r["out"] and r["in"] < c["out"] for r in runs):
                sys.exit(f"cards.json card {c['id']} ({c['in']}-{c['out']}) overlaps a cover run: move it or drop it")
        spec = {k: v for k, v in self.old.items() if k not in ("cards", "region", "deck", "spine", "out", "layout", "face_reframe")}
        spec.update({"deck": self.deck, "spine": self._rel(self.spine), "out": self.out})
        if self.layout:
            spec["layout"] = self.layout     # the vertical frame: card_overlays.py re-stacks the recording onto it
        fr = self.face_reframe()
        if fr:                               # the face scenes: the measured crop, zoomed in the same encode
            spec["face_reframe"] = {"crop": fr["crop"], "windows": self.face_windows}
        spec["cards"] = sorted(keep + runs, key=lambda c: c["in"])
        self.cards_json.write_text(json.dumps(spec, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
        print(f"WROTE {self.cards_json} ({len(runs)} run(s)" + (f" + {len(keep)} other card(s)" if keep else "") + ")")

    # ── render (the unchanged card_overlays.py) ──────────────────────────────────────────────────────────────────
    def render(self):
        rc = subprocess.run([sys.executable, "-u", str(HERE / "card_overlays.py"), str(self.cards_json), "--step", "render"]).returncode
        if rc:
            sys.exit(rc)

    # ── qa ───────────────────────────────────────────────────────────────────────────────────────────────────────
    def _final(self):
        spec = json.loads(self.cards_json.read_text(encoding="utf-8"))
        return (self.ov / spec["out"]).resolve()

    @staticmethod
    def _frame(path, t, w, h, crop=None):
        vf = (f"crop={crop['w']}:{crop['h']}:{crop['x']}:{crop['y']}," if crop else "") + f"scale={w}:{h}"
        r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(0.0, t):.4f}", "-i", str(path), "-frames:v", "1", "-vf", vf,
                            "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
        return np.frombuffer(r.stdout, dtype=np.uint8).reshape(h, w, 3) if len(r.stdout) == w * h * 3 else None

    def qa(self):
        final = self._final()
        if not final.is_file():
            sys.exit(f"no FINAL to QA: {final}")
        qa_dir = self.proj / "_qa"
        qa_dir.mkdir(exist_ok=True)
        fps = self.fps
        tw, th, cols = (216, 384, 8) if self.vertical else (384, 216, 5)
        tiles, n_share = [], 0
        for run in self.plan:
            for s in run["segments"]:
                t = (run["f_in"] + s["f0"] + s["frames"] / 2) / fps
                fr = self._frame(final, t, tw, th)
                im = Image.fromarray(fr) if fr is not None else Image.new("RGB", (tw, th), "black")
                ImageDraw.Draw(im).text((6, 4), f"{run['id']} {label(s)} {t:.2f}s", fill="white")
                tiles.append(im)
        if self.vertical:
            # the screen-share scenes are RE-STACKED in the vertical (the 16:9 ships them as filmed): one tile each, and
            # the layout proof, the two source rectangles drawn on a real frame beside the frame they produce
            shares = [r for r in self.cues["lines"] if r["tag"] == "SCREENSHARE" and r["status"] != "MISSING"]
            n_share = len(shares)
            for r in shares:
                t = (r["tIn"] + r["tOut"]) / 2
                fr = self._frame(final, t, tw, th)
                im = Image.fromarray(fr) if fr is not None else Image.new("RGB", (tw, th), "black")
                ImageDraw.Draw(im).text((6, 4), f"screen-share L{r['n']} {t:.2f}s", fill="yellow")
                tiles.append(im)
            if shares:
                t = (shares[0]["tIn"] + shares[0]["tOut"]) / 2
                sw, sh = (int(v) for v in probe(self.spine, "stream=width,height")[:2])
                pw, ph = 960, round(960 * sh / sw)
                src = self._frame(self.spine, t, pw, ph)
                got = self._frame(final, t, round(ph * self.W / self.H), ph)
                if src is not None and got is not None:
                    proof = Image.new("RGB", (pw + got.shape[1] + 12, ph), "black")
                    left = Image.fromarray(src)
                    d = ImageDraw.Draw(left)
                    for p, colour in zip(self.layout["panes"], ("lime", "yellow", "cyan")):
                        r = p["src"]
                        k = pw / sw
                        d.rectangle([r["x"] * k, r["y"] * k, (r["x"] + r["w"]) * k - 1, (r["y"] + r["h"]) * k - 1], outline=colour, width=3)
                        d.text((r["x"] * k + 8, r["y"] * k + 6), p["name"], fill=colour)
                    proof.paste(left, (0, 0))
                    proof.paste(Image.fromarray(got), (pw + 12, 0))
                    dst = qa_dir / (final.stem.replace(" ", "-") + "-layout-proof.png")
                    proof.save(dst)
                    print(f"layout proof -> {dst} (the rectangles on the recording at {t:.2f} s, and the vertical frame they make)")
        if self.face_windows:
            # the FACE PROOF: per face window, the recording with the measured crop drawn on it, beside the frame it makes
            fr = json.loads(self.face_json.read_text(encoding="utf-8")) if self.face_json.is_file() else {}
            c = fr.get("crop")
            sw, sh = (int(v) for v in probe(self.spine, "stream=width,height")[:2])
            pw, ph = 960, round(960 * sh / sw)
            rows = []
            for k, (fa, fz) in enumerate(self.face_windows):
                t = (fa + fz) / 2
                src = self._frame(self.spine, t, pw, ph)
                got = self._frame(final, t, round(ph * self.W / self.H), ph)
                if src is None or got is None:
                    continue
                left = Image.fromarray(src)
                d = ImageDraw.Draw(left)
                if c:
                    q = pw / sw
                    d.rectangle([c["x"] * q, c["y"] * q, (c["x"] + c["w"]) * q - 1, (c["y"] + c["h"]) * q - 1], outline="lime", width=3)
                d.text((8, 6), f"face {k + 1}: {fa:.2f}-{fz:.2f} s", fill="yellow")
                row = Image.new("RGB", (pw + got.shape[1] + 12, ph), "black")
                row.paste(left, (0, 0))
                row.paste(Image.fromarray(got), (pw + 12, 0))
                rows.append(row)
                fr_t = self._frame(final, t, tw, th)
                im = Image.fromarray(fr_t) if fr_t is not None else Image.new("RGB", (tw, th), "black")
                ImageDraw.Draw(im).text((6, 4), f"face {k + 1} {t:.2f}s", fill="lime")
                tiles.append(im)
                n_share += 1
            if rows:
                proof = Image.new("RGB", (max(r.width for r in rows), sum(r.height for r in rows)), "black")
                y = 0
                for r in rows:
                    proof.paste(r, (0, y))
                    y += r.height
                dst = qa_dir / (final.stem.replace(" ", "-") + "-face-proof.png")
                proof.save(dst)
                print(f"face proof -> {dst} (the crop on the recording, and the frame it makes, per face window)")
        if tiles:
            sheet = Image.new("RGB", (tw * cols, th * ((len(tiles) + cols - 1) // cols)), "black")
            for i, im in enumerate(tiles):
                sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
            dst = qa_dir / (final.stem.replace(" ", "-") + "-cover-cards-sheet.png")
            sheet.save(dst)
            print(f"qa sheet -> {dst} ({len(tiles) - n_share} card window(s)" + (f" + {n_share} screen-share / face scene(s)" if n_share else "") + ")")
        # LEAK CHECK: inside a run the FINAL must BE the run clip (the recording never shows through). Sampled at the
        # middle of every card window and on the frames around every card change; the run's own fade-in / fade-out
        # edges are the sanctioned move to and from the recording and are left out.
        from concurrent.futures import ThreadPoolExecutor
        w, h = (270, 480) if self.vertical else (480, 270)
        edge_in, edge_out = IN_FRAMES + 2, round(CO.OUT_S * fps) + 2
        jobs = []
        for run in self.plan:
            idxs = set()
            for s in run["segments"]:
                idxs.add(s["f0"] + s["frames"] // 2)
                if s["f0"]:                                      # a card change: the frames where a leak would show
                    idxs.update(s["f0"] + d for d in (-1, 0, 1, 3, 6, IN_FRAMES))
            jobs += [(run, i) for i in sorted(idxs) if edge_in <= i < run["frames"] - edge_out]

        def one(job):
            run, i = job
            got = self._frame(final, (run["f_in"] + i + 0.5) / fps, w, h, crop=self.region)
            if got is None:
                return None
            best = -1.0
            for j in (i, i - 1, i + 1):                          # the spine keeps its own frame timestamps: allow one frame
                ref = self._frame(self.runs_dir / f"{run['id']}.mp4", (j + 0.5) / fps, w, h)
                if ref is None:
                    continue
                mse = float(np.mean((got.astype(np.float32) - ref.astype(np.float32)) ** 2))
                best = max(best, 99.0 if mse < 1e-9 else float(10 * np.log10(255.0 ** 2 / mse)))
                if best >= LEAK_PSNR:
                    break
            return run["id"], i, (run["f_in"] + i) / fps, best

        with ThreadPoolExecutor(max_workers=4) as ex:
            res = [r for r in ex.map(one, jobs) if r]
        bad = [f"{rid} frame {i} ({t:.2f} s): {p:.1f} dB" for rid, i, t, p in res if p < LEAK_PSNR]
        for b in bad[:20]:
            print(f"  LEAK  {b}")
        worst = min((p for *_, p in res), default=99.0)
        print(f"LEAK-CHECK {'FAIL' if bad else 'PASS'} samples={len(res)} min_psnr={worst:.1f}")
        return not bad


def main():
    ap = argparse.ArgumentParser(description="Build the cover runs of a scripted standard presentation video.")
    ap.add_argument("cues", help="media/standard/<project>/overlays/cues.json (from cue_script.py)")
    ap.add_argument("--step", choices=["check", "build", "render", "qa", "all"], default="all")
    ap.add_argument("--spine", default=None, help="the FINAL spine (default: the one cue_script.py recorded)")
    ap.add_argument("--out", default=None, help='the deliverable, relative to overlays/ (default "../<project> FINAL-v1.mp4")')
    ap.add_argument("--deck", default=None, help='the deck HTML, relative to overlays/ (default "../<project>.html")')
    ap.add_argument("--cards-dir", action="append", default=[], help="where the card stills / chart pages live (repeatable)")
    ap.add_argument("--crf", type=int, default=10, help="run clips are an intermediate: near-lossless by default")
    ap.add_argument("--vertical", action="store_true",
                    help="build the VERTICAL cut (1080x1920) from the same cues: the card set in assets/vertical/, the run clips in "
                         "overlays/runs-v/, the spec overlays/cards-v.json, the deliverable '<project> VERTICAL-v1.mp4'")
    ap.add_argument("--deck-rect", default=None, help="--vertical: the slide area of the recording, x,y,w,h in spine pixels (default 0,0,1464,1080)")
    ap.add_argument("--cam-rect", default=None, help="--vertical: the webcam in the recording, x,y,w,h (default 1466,400,454,680), or `none`")
    ap.add_argument("--bg", default=None, help="--vertical: the frame colour around the stacked recording (default 0x0a0c10)")
    a = ap.parse_args()
    if not a.vertical and (a.deck_rect or a.cam_rect or a.bg):
        sys.exit("--deck-rect / --cam-rect / --bg belong to --vertical")
    job = Job(a)
    if a.step in ("check", "build", "all"):
        fails = job.check()
        if fails:
            job.machine(False)
            sys.exit(1)
    if a.step in ("build", "all"):
        job.build()
    if a.step in ("check", "build", "all"):
        job.machine(True)
    if a.step in ("render", "all"):
        job.render()
    if a.step in ("qa", "all"):
        if not job.qa():
            sys.exit(1)
    # the extras Mike named in the script header (script.md "The extras"): say what is still owed, so none is forgotten
    ex = job.cues.get("extras") or {}
    if a.step in ("render", "qa", "all") and not job.vertical and any(ex.values()):
        owed = (["the VERTICAL cut (this command again with --vertical)"] if ex.get("vertical") else []) \
            + ([f"the {ex['short']} s SHORT (this track cannot make it yet: script.md 'The extras')"] if ex.get("short") else []) \
            + (["the YT post, once the video is live (run.py ytpost --project <this project folder> --url <link>)"] if ex.get("yt_post") else [])
        print("EXTRAS named in the script header, still to make: " + "; ".join(owed))


if __name__ == "__main__":
    main()
