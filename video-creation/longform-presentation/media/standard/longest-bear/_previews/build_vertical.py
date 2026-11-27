"""longest-bear VERTICAL: the 7:30 cover, the vertical cover runs, the deck pages, the render, QA, then the join with the
AI cold open. One turn of the video run queue, detached and guarded. A re-run keeps every unchanged cover run.

Final = the intro (vertical-intro/intro-preview-v3.mp4, its first 16.0 s) + the vertical render from spine 9.0 s on; the
audio is the intro's, then the delivered 16:9 FINAL-v2's from 9.0 s (same timeline, the drone bed already in it), with a
0.25 s crossfade on the same voice. python _previews/build_vertical.py [--from <step number>]"""
import os
import subprocess
import sys
import time
from pathlib import Path

PROJ = Path(__file__).resolve().parents[1]
REPO = Path(r"C:\Users\mnede\Documents\Claude\social-media")
sys.path.insert(0, str(REPO / "video-creation" / "skills" / "run-queue"))
import run_queue as RQ  # noqa: E402

LABEL = "render longest-bear vertical"
SK = REPO / "video-creation" / "longform-presentation" / "skills"
MAIN = "longest-bear VERTICAL-main.mp4"
FINAL = "longest-bear VERTICAL-v1.mp4"
INTRO = "vertical-intro/intro-preview-v3.mp4"
WIDE = "longest-bear FINAL-v2.mp4"
INTRO_S, RESUME, XF = 16.0, 9.0, 0.25
SPINE = "spine/longest-bear EDIT.enhanced+clips.mp4"
ENDING_T = 595.25                                       # spine s: the first browser frame is 595.2667
END_DECK = {"x": 0, "y": 0, "w": 1464, "h": 1080}
END_CAM = {"x": 1472, "y": 400, "w": 448, "h": 680}
sys.path.insert(0, str(REPO / "video-creation" / "longform-presentation" / "skills" / "card-overlays"))
import card_overlays as CO  # noqa: E402  (layout_graph: the one re-stack)
import cover_runs as CR  # noqa: E402  (stacked_panes: the one vertical layout)
RECTS = ["--deck-rect", "0,0,1370,1080", "--cam-rect", "1372,400,548,680"]
COVER = [str(SK / "card-overlays" / "cover_runs.py"), "overlays/cues.json", "--vertical", "--out", f"../{MAIN}", *RECTS, "--step"]


def cover_730():
    """The vertical twin of assets/cards/cover-730.mp4: two full-frame slides, 867 frames, a 0.3 s fade at 455.52."""
    a, b = "assets/vertical/cards/full-four-year-cycle.png", "assets/vertical/cards/full-three-weeks.png"
    t0, tm, t1 = 450.0, 455.52, 478.9
    n = round(t1 * 30) - round(t0 * 30)
    off = (round(tm * 30) - round(t0 * 30)) / 30 - 0.15
    graph = (f"[0:v]fps=30,format=yuv444p,setsar=1[x];[1:v]fps=30,format=yuv444p,setsar=1[y];"
             f"[x][y]xfade=transition=fade:duration=0.3:offset={off:.4f}[v]")
    return subprocess.call(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-framerate", "30", "-t", f"{off + 0.4:.4f}", "-i", a,
                            "-loop", "1", "-framerate", "30", "-t", f"{n / 30 - off + 0.1:.4f}", "-i", b, "-filter_complex", graph,
                            "-map", "[v]", "-frames:v", str(n), "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-pix_fmt",
                            "yuv444p", "assets/vertical/cards/cover-730.mp4"], cwd=str(PROJ))


def decode(path):
    """The file's audio as 48 kHz stereo float, timestamps honoured (the delivered audio keeps the spine's small gaps)."""
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-map", "0:a:0", "-af",
                          "aresample=async=1:min_hard_comp=0.010:first_pts=0", "-ac", "2", "-ar", "48000", "-f", "f32le", "-"],
                         capture_output=True, cwd=str(PROJ), check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)


def join():
    """Picture: the intro's first 16.0 s, then the vertical render from spine 9.0 s. Sound: assembled sample by sample
    (an ffmpeg atrim/acrossfade chain shifted the whole track 44 ms, 2026-11-25): output[t] = intro[t] up to the join,
    then the delivered audio at t - (INTRO_S - RESUME), with a 0.25 s crossfade centred on the join (a pause)."""
    import numpy as np
    video = PROJ / "_previews" / "vertical-video-only.mp4"
    if not video.is_file() or video.stat().st_mtime < (PROJ / MAIN).stat().st_mtime:
        # THE ENDING (from the frame the browser appears, ENDING_T): his freeform talk was recorded with a wider browser
        # and a narrower webcam than the rest, so it is re-stacked from the spine with its own two rectangles
        lay = {"w": 1080, "h": 1920, "bg": "0x0a0c10", "panes": CR.stacked_panes(END_DECK, END_CAM)}
        graph = (f"[0:v]trim=end_frame={round(INTRO_S * 30)},setpts=PTS-STARTPTS,format=yuv420p,setsar=1[v0];"
                 f"[1:v]trim=start={RESUME}:end={ENDING_T},setpts=PTS-STARTPTS,format=yuv420p,setsar=1[v1];"
                 f"[2:v]trim=start={ENDING_T},setpts=PTS-STARTPTS[tail];" + CO.layout_graph(lay, "tail") + ";"
                 f"[base]format=yuv420p,setsar=1[v2];[v0][v1][v2]concat=n=3:v=1:a=0[v]")
        rc = subprocess.call(["ffmpeg", "-y", "-v", "error", "-i", INTRO, "-i", MAIN, "-i", SPINE, "-filter_complex", graph,
                              "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-fps_mode",
                              "passthrough", str(video)], cwd=str(PROJ))
        if rc:
            return rc
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration", "-of",
                                "csv=p=0", str(video)], capture_output=True, text=True, check=True).stdout.strip())
    r, n = 48000, round(dur * 48000)
    intro, wide = decode(INTRO), decode(WIDE)
    shift = round((INTRO_S - RESUME) * r)
    a, b = round((INTRO_S - XF / 2) * r), round((INTRO_S + XF / 2) * r)
    out = np.zeros((n, 2), np.float32)
    out[:a] = intro[:a]
    ramp = np.linspace(0.0, 1.0, b - a, dtype=np.float32)[:, None]
    out[a:b] = intro[a:b] * (1 - ramp) + wide[a - shift:b - shift] * ramp
    take = wide[b - shift:n - shift]
    out[b:b + len(take)] = take
    wav = PROJ / "_previews" / "vertical-audio.f32"
    out.tofile(wav)
    rc = subprocess.call(["ffmpeg", "-y", "-v", "error", "-i", str(video), "-f", "f32le", "-ar", "48000", "-ac", "2", "-i", str(wav),
                          "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-movflags",
                          "+faststart", FINAL], cwd=str(PROJ))
    wav.unlink(missing_ok=True)
    return rc


def py(args):
    return lambda: subprocess.call([sys.executable, "-u", *args], cwd=str(PROJ))


STEPS = [
    ("COVER 7:30", cover_730),
    ("BUILD cover runs", py(COVER + ["build"])),
    ("SHARE pages", py([str(SK / "card-overlays" / "share_pages.py"), "SCRIPT.md", "--cards", "cards-v.json", "--pages",
                        "assets/share-pages-v", "--extra", "extra-covers-v.json", "--region", "0,60,1080,850",
                        "--face-crop", "810,2,606,1076"])),
    ("RENDER", py(COVER + ["render"])),
    ("QA", py(COVER + ["qa"])),
    ("JOIN intro", join),
]


def report(status):
    if os.environ.get(RQ.REPORT_ENV):
        Path(os.environ[RQ.REPORT_ENV]).write_text(status, encoding="utf-8")


def main():
    RQ.detach(LABEL)
    first = int(sys.argv[sys.argv.index("--from") + 1]) if "--from" in sys.argv else 1
    with RQ.turn(LABEL, kind="run", project="longest-bear"):
        for i, (name, step) in enumerate(STEPS, 1):
            if i < first:
                continue
            print(f"== {i} {name} {time.strftime('%H:%M:%S')}", flush=True)
            rc = step()
            if rc:
                print(f"== FAILED at {name} (exit {rc})", flush=True)
                RQ.notify(LABEL, f"FAILED at {name} (exit {rc}). Check the run-queue log.")
                report("failed")
                return rc
        print(f"== DONE {time.strftime('%H:%M:%S')}", flush=True)
        RQ.notify(LABEL, f"Run finished: {FINAL} is ready.")
        report("done")
    return 0


if __name__ == "__main__":
    sys.exit(main())
