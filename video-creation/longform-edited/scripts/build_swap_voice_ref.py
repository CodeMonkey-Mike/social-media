#!/usr/bin/env python
"""
build_swap_voice_ref.py — the real-voice AUDIO REFERENCE for a face background swap (comp-build.md section 3b, step 3).

The reference must line up with the source clip sent to Seedance sample for sample:
    [silence = the head handle]  +  [the window's audio off the FINAL spine]  +  [silence = the tail handle]
exactly as long as the clip. It is built by CONCATENATING real silence. Never with `adelay`: that wrote files with
no leading silence (speech at 0.04 s instead of at the head handle, the file short by the handle), the voice ran
ahead of the picture it was sent with, and 45 credits of generations were thrown away (golden-kitty, 2026-10-02).

The script checks its own output and FAILS (exit 1) unless the file is the clip length (within 30 ms) and the
handles are silent while the window is not.

Usage: python build_swap_voice_ref.py <media/<project>> <name> [<name> ...]
  reads  assets/face-swap/<name>-raw-for-higgsfield.json   (build_face_swap_source.py)
  writes _previews/qa/bg-swap/<name>-audio.mp3
Machine line per clip: SWAP-VOICE-REF ok|FAIL name=<n> clip=<s> head=<s> window=<s>
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def envelope(path, sr=8000):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    hop = sr // 100
    n = len(x) // hop
    return np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1))


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    proj = Path(sys.argv[1]).resolve()
    vertical = "--vertical" in sys.argv[2:]          # the 9:16 lane keeps its sources under assets/vertical/face-swap/
    bad = 0
    for name in [x for x in sys.argv[2:] if not x.startswith("--")]:
        sj = proj / "assets" / ("vertical/face-swap" if vertical else "face-swap") / f"{name}-raw-for-higgsfield.json"
        if not sj.is_file():
            print(f"FATAL: {sj} missing (run build_face_swap_source.py first)", file=sys.stderr)
            sys.exit(2)
        d = json.loads(sj.read_text(encoding="utf-8"))
        spine = Path(d["final_spine"])
        w0, w1 = d["window_frames"][0] / 30.0, d["window_frames"][1] / 30.0
        head, clip = d["head_handle_frames"] / 30.0, float(d["clip_s"])
        tail = max(0.0, clip - head - (w1 - w0))
        out = proj / "_previews" / "qa" / ("bg-swap-vertical" if vertical else "bg-swap") / f"{name}-audio.mp3"
        out.parent.mkdir(parents=True, exist_ok=True)
        parts, labels, inputs, idx = [], [], ["-i", str(spine)], 1
        if head > 0.001:
            inputs += ["-f", "lavfi", "-t", f"{head:.4f}", "-i", "anullsrc=r=44100:cl=stereo"]
            labels.append(f"[{idx}:a]")
            idx += 1
        parts.append(f"[0:a]atrim=start={w0:.4f}:end={w1:.4f},asetpts=PTS-STARTPTS,aresample=44100,aformat=channel_layouts=stereo[w]")
        labels.append("[w]")
        if tail > 0.001:
            inputs += ["-f", "lavfi", "-t", f"{tail:.4f}", "-i", "anullsrc=r=44100:cl=stereo"]
            labels.append(f"[{idx}:a]")
        fc = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=0:a=1[a]"
        r = subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc, "-map", "[a]", "-t", f"{clip:.4f}",
                            "-c:a", "libmp3lame", "-q:a", "2", str(out)], capture_output=True, text=True)
        ok = r.returncode == 0 and out.is_file()
        why = r.stderr[-300:] if not ok else ""
        if ok:
            e = envelope(out)
            length = len(e) / 100.0
            h = int(round(head * 100))
            head_rms = float(e[: max(1, h - 3)].mean()) if h > 4 else 0.0
            win_rms = float(e[h + 5: h + 5 + int((w1 - w0) * 100) - 10].mean())
            if abs(length - clip) > 0.03:
                ok, why = False, f"file is {length:.2f}s, the clip is {clip:.2f}s"
            elif head_rms > 3.0:
                ok, why = False, f"the head handle is not silent (rms {head_rms:.1f}): the voice would run ahead of the picture"
            elif win_rms < 20.0:
                ok, why = False, f"the window is silent (rms {win_rms:.1f})"
        bad += not ok
        print(f"SWAP-VOICE-REF {'ok' if ok else 'FAIL'} name={name} clip={clip:.2f} head={head:.3f} window={w1 - w0:.3f}" + (f"  {why}" if why else ""))
        if ok:
            print(f"WROTE {out}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
