"""Music for a single-take screen-share video (the VS Code coding format): the channel's musical intro from 0:00 with a
clip-gain ramp, then an elevator bed from a spoken cue to the last frame, remix-looped and end-aligned. The video
stream is copied untouched and the recorded voice is not processed; only the music is added under it.

Approved levels (print-function, Mike 2026-10-16) are the defaults: intro 0 dB -> -40 dB over the intro's length
(Premiere keyframes at clip start + clip end, linear in dB), bed -32 dB clip gain with a 1.5 s fade-in.

  python music_bed.py "<master.mkv>" --cue-phrase "this is a cool course" --out "<project> FINAL-v1.mp4"
  python music_bed.py "<master.mkv>" --bed-start 54.70 --track lounge-lover --dry-run

Run from anywhere; asset paths resolve against the repo. Doc: music-bed.md (same folder).
"""
import argparse
import json
import random
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile

VC = Path(__file__).resolve().parents[3]  # video-creation/
INTRO = VC / "assets/intro-outro/music/musical intro.mp3"
LIBRARY = VC / "assets/music/library.json"
SR = 48000
XF = 0.030          # equal-power crossfade at every loop join
PHRASE_BARS = 8     # the loop region is a whole number of 8-bar phrases


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def elevator_tracks():
    """Library rows tagged elevator that have what the loop finder needs (a file, a bpm, analysed segments)."""
    rows = json.loads(LIBRARY.read_text(encoding="utf-8"))["tracks"]
    return [r for r in rows if "elevator" in (r.get("tags") or []) and r.get("bpm") and r.get("primary_file")
            and (r.get("analysis") or {}).get("segments")]


def find_cue(video, phrase, window):
    """End time of the LAST word of `phrase` in the first `window` seconds (local Whisper small.en, word timestamps)."""
    import whisper
    tmp = Path(subprocess.run(["python", "-c", "import tempfile;print(tempfile.gettempdir())"],
                              capture_output=True, text=True).stdout.strip()) / "music_bed_cue.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-t", str(window), "-i", str(video), "-vn", "-ac", "1", "-ar", "16000",
                    str(tmp)], check=True)
    res = whisper.load_model("small.en").transcribe(str(tmp), language="en", fp16=False, word_timestamps=True)
    words = [w for s in res["segments"] for w in s["words"]]
    norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())
    want = [norm(w) for w in phrase.split()]
    toks = [norm(w["word"]) for w in words]
    hits = [i for i in range(len(toks) - len(want) + 1) if toks[i:i + len(want)] == want]
    if not hits:
        sys.exit(f"cue phrase not heard in the first {window} s: {phrase!r}. Transcript: "
                 + " ".join(w["word"].strip() for w in words))
    if len(hits) > 1:
        print(f"WARN: cue phrase heard {len(hits)} times, using the first")
    last = words[hits[0] + len(want) - 1]
    return float(last["end"])


GOOD_MATCH = 0.5    # a join at or above this waveform match is seamless by ear (print-function's approved join: 0.65)


def find_loop(m, track):
    """Bar-aligned remix-loop region inside the track's longest high/steady segment, kept off the song's own intro
    (first 4 bars) and ending (last 8 s): a whole number of 8-bar phrases long, loop_in on a 0.25 s grid, loop_out
    refined +-50 ms to the best waveform match of the audio at loop_in. The LONGEST length whose best join reaches
    GOOD_MATCH wins (fewer repeats); when none does, the best-matching join of any length."""
    bar = 60.0 / track["bpm"] * 4
    phrase = bar * PHRASE_BARS
    segs = [s for s in track["analysis"]["segments"] if s.get("kind") == "peak"] or track["analysis"]["segments"]
    a0, a1 = max(segs, key=lambda s: s["t"][1] - s["t"][0])["t"]
    a0 = max(a0, 4 * bar)
    a1 = min(a1, len(m) / SR - 8.0) - 1.0
    n_max = int((a1 - a0) // phrase)
    if n_max < 1:
        sys.exit(f"{track['id']}: steady segment {a0:.0f}-{a1:.0f} s is shorter than one {phrase:.1f} s phrase")
    from scipy.signal import fftconvolve
    x = m.mean(1)
    W, K = SR, int(0.05 * SR)
    by_len = {}
    for n in range(1, n_max + 1):
        length = n * phrase
        for li in np.arange(a0, a1 - length + 1e-9, 0.25):
            a = x[int(li * SR):int(li * SR) + W]
            s0 = int((li + length) * SR) - K
            seg = x[s0:s0 + W + 2 * K]
            if len(seg) < W + 2 * K:
                continue
            num = fftconvolve(seg, a[::-1], "valid")          # every lag in +-50 ms at sample resolution
            e = np.concatenate([[0], np.cumsum(seg ** 2)])
            r = num / np.sqrt(np.dot(a, a) * (e[W:] - e[:-W]) + 1e-12)
            k = int(np.argmax(r))
            if n not in by_len or r[k] > by_len[n][0]:
                by_len[n] = (float(r[k]), float(li), (s0 + k) / SR)
    good = [n for n in by_len if by_len[n][0] >= GOOD_MATCH]
    best = by_len[max(good)] if good else max(by_len.values())
    if not good:
        print(f"WARN: {track['id']}: no loop join reaches match {GOOD_MATCH}; best {best[0]:.2f}, LISTEN to a join "
              f"or pick another --track")
    return best


def join(a, b):
    n = int(XF * SR)
    t = np.linspace(0, np.pi / 2, n)[:, None]
    return np.concatenate([a[:-n], a[-n:] * np.cos(t) + b[:n] * np.sin(t), b[n:]])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    cue = ap.add_mutually_exclusive_group(required=True)
    cue.add_argument("--cue-phrase", help="the bed starts right after these spoken words (first occurrence)")
    cue.add_argument("--bed-start", type=float, help="the bed starts at this second instead")
    ap.add_argument("--cue-window", type=float, default=300, help="seconds of the head searched for the phrase")
    ap.add_argument("--track", help="library id of the elevator bed (default: a random elevator track)")
    ap.add_argument("--intro-db", type=float, default=0.0, help="intro clip gain at its first sample")
    ap.add_argument("--intro-end-db", type=float, default=-40.0, help="intro clip gain at its last sample")
    ap.add_argument("--bed-db", type=float, default=-32.0, help="bed clip gain")
    ap.add_argument("--fade-in", type=float, default=1.5)
    ap.add_argument("--out", help="output mp4 (default: <video dir>/<folder name> FINAL-v1.mp4)")
    ap.add_argument("--dry-run", action="store_true", help="resolve cue + loop, write nothing")
    args = ap.parse_args()

    video = Path(args.video).resolve()
    vlen = duration(video)
    tracks = elevator_tracks()
    track = next((t for t in tracks if t["id"] == args.track), None) if args.track else random.choice(tracks)
    if track is None:
        sys.exit(f"--track {args.track!r} is not an analysed elevator track: {[t['id'] for t in tracks]}")
    bed_file = VC / track["folder"] / track["primary_file"]
    start = args.bed_start if args.bed_start is not None else find_cue(video, args.cue_phrase, args.cue_window) + 0.06
    m = load(bed_file)
    corr, loop_in, loop_out = find_loop(m, track)
    li, lo = int(loop_in * SR), int(loop_out * SR)
    span = int(round(vlen * SR)) - int(start * SR)
    reps = max(0, int(np.ceil((span - (lo + len(m) - li)) / (lo - li))))
    print(f"bed: {track['id']} ({track['title']}, {track['bpm']} bpm) from {start:.2f} s to {vlen:.2f} s; "
          f"loop {loop_in:.3f}-{loop_out:.3f} s ({loop_out - loop_in:.1f} s, match {corr:.2f}) x{reps} extra passes")
    if args.dry_run:
        return

    mix = np.zeros((int(round(vlen * SR)), 2))
    it = load(INTRO)
    mix[:len(it)] += it * (10 ** (np.linspace(args.intro_db, args.intro_end_db, len(it)) / 20))[:, None]
    bed = m[:lo]
    for _ in range(reps):
        bed = join(bed, m[li:lo])
    bed = join(bed, m[li:])
    head = len(bed) - span                       # end-aligned: the song's real ending lands on the last frame
    if head < 0:                                  # video shorter than one pass of the song: plain tail trim
        bed, head = np.concatenate([bed, np.zeros((-head, 2))]), 0
    bed = bed[head:head + span]
    ramp = np.minimum(1, np.arange(len(bed)) / (args.fade_in * SR))[:, None]
    mix[int(start * SR):int(start * SR) + len(bed)] += bed * ramp * 10 ** (args.bed_db / 20)
    print(f"bed opens at song {head / SR:.2f} s; music peak {20 * np.log10(np.abs(mix).max() + 1e-12):.1f} dBFS")

    out = Path(args.out) if args.out else video.parent / f"{video.parent.name} FINAL-v1.mp4"
    wav = out.with_suffix(".music.wav")
    wavfile.write(wav, SR, mix.astype(np.float32))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(wav), "-filter_complex",
                    "[0:a]aresample=48000[v];[v][1:a]amix=inputs=2:normalize=0:duration=first[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
                    "-movflags", "+faststart", str(out)], check=True)
    wav.unlink()
    frames = lambda p: subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v",
                                       "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", str(p)],
                                      capture_output=True, text=True).stdout.strip()
    fi, fo = frames(video), frames(out)
    print(f"{out}\nvideo frames {fo} (master {fi}) {'OK' if fi == fo else 'MISMATCH'}")


if __name__ == "__main__":
    main()
