"""longest-bear: cover runs -> deck-area pages -> render -> QA -> drone bed, as ONE turn of the video run queue, detached
and guarded (run_queue.detach), so a reaped Claude Code task never stops it. Stops at the first failing step; a re-run
resumes (cover_runs keeps every unchanged run). Replaces build_final.sh."""
import os
import subprocess
import sys
import time
from pathlib import Path

PROJ = Path(__file__).resolve().parents[1]
REPO = Path(r"C:\Users\mnede\Documents\Claude\social-media")
sys.path.insert(0, str(REPO / "video-creation" / "skills" / "run-queue"))
import run_queue as RQ  # noqa: E402

LABEL = "render longest-bear"
SK = REPO / "video-creation" / "longform-presentation" / "skills"
OUT = "../longest-bear NOMUSIC.mp4"
COVER = [str(SK / "card-overlays" / "cover_runs.py"), "overlays/cues.json", "--out", OUT, "--step"]
STEPS = [
    ("BUILD cover runs", COVER + ["build"]),
    ("SHARE pages", [str(SK / "card-overlays" / "share_pages.py"), "SCRIPT.md"]),
    ("RENDER", COVER + ["render"]),
    ("QA", COVER + ["qa"]),
    ("MUSIC", [str(SK / "music-bed" / "drone_bed.py"), "longest-bear NOMUSIC.mp4", "--out", "longest-bear FINAL-v2.mp4",
               "--inserts", "overlays/inserts.json"]),
]


def report(status):
    if os.environ.get(RQ.REPORT_ENV):
        Path(os.environ[RQ.REPORT_ENV]).write_text(status, encoding="utf-8")


def main():
    RQ.detach(LABEL)
    with RQ.turn(LABEL, kind="run", project="longest-bear"):
        for name, args in STEPS:
            print(f"== {name} {time.strftime('%H:%M:%S')}", flush=True)
            rc = subprocess.call([sys.executable, "-u", *args], cwd=str(PROJ))
            if rc:
                print(f"== FAILED at {name} (exit {rc})", flush=True)
                RQ.notify(LABEL, f"FAILED at {name} (exit {rc}). Check the run-queue log.")
                report("failed")
                return rc
        print(f"== DONE {time.strftime('%H:%M:%S')}", flush=True)
        RQ.notify(LABEL, "Run finished: longest-bear FINAL-v2.mp4 is ready.")
        report("done")
    return 0


if __name__ == "__main__":
    sys.exit(main())
