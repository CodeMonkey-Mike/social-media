#!/usr/bin/env python3
"""burst_profile.py — per-10ms RMS + silence readout around a suspected anomalous sound burst.

Part of the `burst-removal` skill. Use it to SEE the energy shape of a region so you can place a
cut that excises a burst (throat-clear, cough, click, mic-bump, lip-smack) while leaving the words
on either side intact. Pairs with Whisper word-timestamps (which give the word boundaries) — this
gives the silence floors between them where the cut edges must land.

Usage:
    python burst_profile.py "<file>" <start_sec> <end_sec> [--sil -52] [--loud -22]

Prints one line per 10 ms window: time, RMS dB, a bar, and a marker:
    <SIL  = below the silence threshold (a safe place for a cut edge)
    <<    = above the loud threshold (speech OR the burst itself)

A burst reads as a loud hump sitting BETWEEN two <SIL troughs, where the transcript says there
should be a gap. Put cut-start in the trough after the prior word, cut-end in the trough before the
next word. NEVER put a cut edge on a non-silent sample.
"""
import argparse, json, re, subprocess, sys


def sample_rate(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0",
         "-show_entries", "stream=sample_rate", "-of", "csv=p=0", path],
        capture_output=True, text=True).stdout.strip()
    return int(out or "48000")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("start", type=float)
    ap.add_argument("end", type=float)
    ap.add_argument("--sil", type=float, default=-52.0, help="silence threshold dB (cut-edge safe below this)")
    ap.add_argument("--loud", type=float, default=-22.0, help="loud threshold dB (speech/burst above this)")
    a = ap.parse_args()

    sr = sample_rate(a.file)
    win = max(1, round(sr / 100))  # 10 ms window
    af = (f"asetnsamples=n={win}:p=0,astats=metadata=1:reset=1,"
          f"ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-")
    cmd = ["ffmpeg", "-hide_banner", "-ss", str(a.start), "-to", str(a.end),
           "-i", a.file, "-af", af, "-f", "null", "-"]
    p = subprocess.run(cmd, capture_output=True, text=True)
    text = p.stdout + p.stderr  # ametadata file=- goes to stdout, but be tolerant
    times = re.findall(r"pts_time:([0-9.]+)", text)
    rms = re.findall(r"RMS_level=(-?[0-9.]+|-?inf)", text)
    if not times:
        sys.exit("no astats output — check the file path / ffmpeg")
    for t, r in zip(times, rms):
        base = a.start + float(t)
        val = -99.0 if "inf" in r else float(r)
        bar = "#" * max(0, int((val + 70) / 2))
        mark = " <SIL" if val < a.sil else (" <<" if val > a.loud else "")
        print(f"{base:8.3f}  {val:7.1f}  {bar}{mark}")


if __name__ == "__main__":
    main()
