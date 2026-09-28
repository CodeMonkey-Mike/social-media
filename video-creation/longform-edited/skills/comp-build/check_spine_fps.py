#!/usr/bin/env python
"""
check_spine_fps.py <spine.mp4> <comp_fps>  (Python port of check-spine-fps.sh, 2026-09-28)

Fails if the spine's frame rate != the comp's fps. A mismatch silently truncates the render's tail
(comp-build.md §1: the ethereum-rwa 29.97 spine under a 30 fps comp clipped the last words). Run
BEFORE writing DUR and BEFORE any render. Also prints the frame count DUR must be: ceil(duration*fps).
Exit 0 = OK, 1 = rates differ, 2 = usage / probe failure.
"""
import math
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def probe(path, entries, select=None):
    cmd = ["ffprobe", "-v", "error"] + (["-select_streams", select] if select else []) + \
          ["-show_entries", entries, "-of", "csv=p=0", path]
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace").stdout.strip()


def main():
    if len(sys.argv) < 3:
        print("usage: check_spine_fps.py <spine.mp4> <comp_fps>", file=sys.stderr)
        sys.exit(2)
    sp, fps = sys.argv[1], float(sys.argv[2])
    r = probe(sp, "stream=r_frame_rate", "v").splitlines()[0] if probe(sp, "stream=r_frame_rate", "v") else ""
    if "/" not in r:
        print(f"check_spine_fps: could not probe {sp}", file=sys.stderr)
        sys.exit(2)
    num, den = r.split("/")
    act = float(num) / float(den)
    dur = float(probe(sp, "format=duration") or 0)
    need = math.ceil(dur * fps)
    print(f"spine fps={r} (={act:.4f})  comp fps={fps:g}  spine={dur:.3f}s  DUR must be ceil(duration*fps) = {need} frames")
    if abs(act - fps) < 0.001:
        print("check_spine_fps: OK")
        print(f"SPINE-FPS PASS fps={act:.3f} frames={need}")
        sys.exit(0)
    print(f"check_spine_fps: FAIL; rates differ. DUR must be ceil(duration*fps) = {need} frames, NOT the spine's frame count.")
    print(f"SPINE-FPS FAIL fps={act:.3f} comp={fps:g}")
    sys.exit(1)


if __name__ == "__main__":
    main()
