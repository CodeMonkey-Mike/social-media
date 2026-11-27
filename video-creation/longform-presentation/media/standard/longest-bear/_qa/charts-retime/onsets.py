"""Measure the real voice onsets of cue words in the longest-bear spine (Whisper word starts can absorb a pause).

python onsets.py <spine.mp4> <words.json> <a> <b> [--floor -45]
Prints every silent stretch (RMS under the floor for >= 60 ms) inside [a, b], then every Whisper word with the
envelope's onset estimate: if the word's Whisper start falls inside a silent stretch, the onset is that stretch's end.
"""
import json
import subprocess
import sys

import numpy as np

SR = 16000
HOP = 0.005
WIN = 0.020


def decode(path, a, b):
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", path, "-vn", "-ac", "1",
                        "-ar", str(SR), "-f", "f32le", "-"], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32)


def env(x):
    n = int(WIN * SR)
    h = int(HOP * SR)
    out = []
    for i in range(0, max(1, len(x) - n), h):
        seg = x[i:i + n]
        out.append(20 * np.log10(np.sqrt(np.mean(seg * seg)) + 1e-9))
    return np.array(out)


def main():
    spine, words, a, b = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
    floor = float(sys.argv[sys.argv.index("--floor") + 1]) if "--floor" in sys.argv else -45.0
    pad = 1.0
    x = decode(spine, a - pad, b + pad)
    e = env(x)
    t0 = a - pad
    tt = t0 + np.arange(len(e)) * HOP + WIN / 2
    quiet = e < floor
    stretches = []
    i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if (j - i) * HOP >= 0.06:
                stretches.append((tt[i], tt[j - 1]))
            i = j
        else:
            i += 1
    print(f"window {a}-{b}, floor {floor} dB, peak {e.max():.1f} dB")
    print("silent stretches:", ", ".join(f"{s:.3f}-{q:.3f}" for s, q in stretches if q > a - 0.5 and s < b + 0.5))
    d = json.load(open(words, encoding="utf-8"))
    W = [w for s in d["segments"] for w in s.get("words", [])]
    for w in W:
        if w["end"] < a - 0.6 or w["start"] > b + 0.6:
            continue
        ws = w["start"]
        onset = ws
        for s, q in stretches:
            if s - 0.01 <= ws <= q + 0.01:
                onset = q + HOP
                break
        # the envelope across the word, 40 ms steps
        k0 = int(round((ws - 0.10 - t0 - WIN / 2) / HOP))
        k1 = int(round((min(w["end"], ws + 0.60) - t0 - WIN / 2) / HOP))
        strip = " ".join(f"{e[k]:4.0f}" for k in range(max(0, k0), min(len(e), k1), 8))
        flag = "  <-- onset later" if onset > ws + 0.02 else ""
        print(f"{ws:8.3f} {w['end']:8.3f} onset {onset:8.3f} {w['word']!r:16} | {strip}{flag}")


if __name__ == "__main__":
    main()
