#!/usr/bin/env python3
"""short_extract_spans.py — Stage A of the longform-to-short lane.

Cuts every span of a short's cut plan out of the two sources into small, frame-exact
intermediates the Remotion comp can play linearly:

    <work>/span-01.mp4   video only, from the VERTICAL MASTER (all visuals composited)
    <work>/span-01.wav   audio only, from the PAUSED SPINE (clean VO, no bed, no SFX)

Why intermediates and not one OffthreadVideo seeking into the master: seeking a 130 MB
7-minute h264 to five scattered points is the frame-proxy saturation that has killed renders
in this track (comp-build.md §6a). Small linear files sidestep it entirely.

Why the spine for audio: the master's bed would jump at every seam, AND the master's audio
carries ~42.7 ms of AAC priming delay relative to its own video (2048 samples). Pairing master
video with spine audio sheds that for free. See longform-to-short.md §1.

    python short_extract_spans.py <cut-plan.json> <master.mp4> <spine.mp4> <work-dir> [--fps 30]

Writes <work-dir>/spans.json (the resolved frame table the comp reads) and verifies every
intermediate's real frame count before returning 0.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path


def run(cmd: list[str]) -> None:
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("\n".join(cmd[:3]) + " ...")
        print(r.stderr[-2000:])
        raise SystemExit(f"ffmpeg failed ({r.returncode})")


def frames_of(path: Path) -> int:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames",
         "-show_entries", "stream=nb_read_frames", "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True).stdout.strip()
    return int(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("master")
    ap.add_argument("spine")
    ap.add_argument("work")
    ap.add_argument("--fps", type=float, default=30.0)
    ap.add_argument("--crf", type=int, default=16, help="intermediate quality (16 = visually lossless)")
    a = ap.parse_args()

    plan = json.loads(Path(a.plan).read_text(encoding="utf-8"))
    spans = plan["spans"] if isinstance(plan, dict) else plan
    spans = sorted(spans, key=lambda s: s.get("order", 0))
    work = Path(a.work)
    work.mkdir(parents=True, exist_ok=True)

    table, t_out = [], 0.0
    for i, s in enumerate(spans, 1):
        start, end = float(s["start"]), float(s["end"])
        n = int(round((end - start) * a.fps))
        dur = n / a.fps
        vid = work / f"span-{i:02d}.mp4"
        wav = work / f"span-{i:02d}.wav"

        # -ss BEFORE -i for a fast seek, then -frames:v for an exact length.
        # NEVER -to here: it measures from the seek point, not the timeline.
        run(["ffmpeg", "-y", "-v", "error", "-ss", f"{start:.4f}", "-i", a.master,
             "-frames:v", str(n), "-an", "-c:v", "libx264", "-crf", str(a.crf),
             "-preset", "veryfast", "-pix_fmt", "yuv420p", str(vid)])
        run(["ffmpeg", "-y", "-v", "error", "-ss", f"{start:.4f}", "-i", a.spine,
             "-t", f"{dur:.4f}", "-vn", "-ac", "2", "-ar", "48000",
             "-c:a", "pcm_s16le", str(wav)])

        got = frames_of(vid)
        ok = got == n
        print(f"  span {i:02d}  {start:8.3f} -> {end:8.3f}  {dur:6.2f}s  "
              f"{got:4d}/{n:4d} frames  {'OK' if ok else 'FRAME COUNT MISMATCH'}   "
              f"[{s.get('role','?')}, {s.get('sourced','?')}-sourced]")
        if not ok:
            raise SystemExit(f"span {i} extracted {got} frames, expected {n}")

        table.append({
            "i": i, "file": vid.name, "wav": wav.name,
            "src_start": start, "src_end": end,
            "out_start": round(t_out, 4), "frames": n,
            "role": s.get("role"), "sourced": s.get("sourced"),
            "says": s.get("says"),
        })
        t_out += dur

    (work / "spans.json").write_text(json.dumps(
        {"fps": a.fps, "spans_total_seconds": round(t_out, 3), "spans": table},
        indent=1), encoding="utf-8")
    print(f"\n  {len(table)} spans, {t_out:.2f}s total -> {work / 'spans.json'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
