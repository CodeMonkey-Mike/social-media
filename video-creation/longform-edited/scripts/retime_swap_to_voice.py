#!/usr/bin/env python
"""
retime_swap_to_voice.py — pull a Higgsfield background-swap clip back onto the REAL voice (comp-build.md section 3b).

Why (golden-kitty, 2026-10-02): Seedance re-synthesises the speech it was given and animates the lips to ITS OWN
audio, which is paced differently from the real take: it lengthens the pauses at the desilencer joins and can
even add a word. Measured on an 11 s clip: in sync for the first sentence, 0.4 s late after the first join,
0.9 s late by the end. The spine keeps the REAL voice, so the returned picture has to be re-timed, not offset.

Method: dynamic time warping between the loudness envelope of the real voice and of the returned clip's own
audio gives, for every moment of real speech, the moment the model says the same thing. The delay is trusted
only where there is speech, carried flat across the silences, smoothed, and the picture is rebuilt so the frame
shown at time t is the returned frame from time t + delay(t). Output: video only, at the comp's frame rate,
exactly as long as the reference voice, ready to lay over the face window from the source clip JSON's
`window_starts_at_clip_s`.

PROOF (the gate): the same warp is applied to the returned audio's envelope, and the leftover delay is measured
in EVERY speech window. FAIL (exit 1) when a leftover is over 60 ms (two frames) or when fewer than 90% of the
speech windows can be locked at all. A FAIL clip does not air.

Usage: python retime_swap_to_voice.py <returned-swap.mp4> <real-voice.mp3|wav> --out <assets/face-swap/F<n>-higgsfield-bg-swap.mp4>
           --source-json <assets/face-swap/F<n>-raw-for-higgsfield.json> [--fps 30] [--max-delay 1.5] [--max-lead 0.4]
It also FAILS when the model ran so late that the face window needs footage past the end of the returned clip.
Machine line: SWAP-RETIME ok|FAIL delay_before=<min..max ms> residual=<max ms> coverage=<pct> frames=N
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HOP = 0.01      # 10 ms envelope


def envelope(path, sr=8000):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    hop = int(sr * HOP)
    n = len(x) // hop
    return np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1))


def probe(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height,r_frame_rate",
                                   "-of", "json", str(path)]).decode()
    s = json.loads(out)["streams"][0]
    a, b = s["r_frame_rate"].split("/")
    return int(s["width"]), int(s["height"]), float(a) / float(b)


def feat(e):
    """log envelope, z-scored: loudness shape, not level."""
    x = np.log1p(e)
    return (x - x.mean()) / (x.std() + 1e-9)


def dtw_map(ref, out, max_lead, max_delay):
    """for every ref index i, the out index j saying the same thing (banded DTW on the envelope shape)."""
    a, b = feat(ref), feat(out)
    n, m = len(a), len(b)
    lo_b, hi_b = int(max_lead / HOP), int(max_delay / HOP)
    INF = 1e18
    D = np.full((n + 1, m + 1), INF, dtype=np.float64)
    D[0, 0] = 0.0
    for i in range(1, n + 1):
        j0, j1 = max(1, i - lo_b), min(m, i + hi_b)
        if j0 > j1:
            continue
        cost = np.abs(a[i - 1] - b[j0 - 1: j1])
        prev = np.minimum(D[i - 1, j0 - 1: j1], D[i - 1, j0: j1 + 1])      # diagonal, up
        row = np.empty(j1 - j0 + 1)
        left = INF
        for k in range(j1 - j0 + 1):                                       # left needs the running row
            best = min(prev[k], left)
            row[k] = cost[k] + best
            left = row[k]
        D[i, j0: j1 + 1] = row
    # backtrack from the best end on the last ref row
    j = int(np.argmin(D[n, 1:]) + 1)
    i = n
    path = []
    while i > 0 and j > 0:
        path.append((i - 1, j - 1))
        steps = (D[i - 1, j - 1], D[i - 1, j], D[i, j - 1])
        s = int(np.argmin(steps))
        if s == 0:
            i, j = i - 1, j - 1
        elif s == 1:
            i -= 1
        else:
            j -= 1
    path.reverse()
    jm = np.zeros(n)
    cnt = np.zeros(n)
    for pi, pj in path:
        jm[pi] += pj
        cnt[pi] += 1
    return jm / np.maximum(cnt, 1)


def local_delay(ref, out, max_delay, win=0.8, step=0.1):
    """(times, delays, locked flags) for every speech window of ref: the delay of `out` behind it."""
    n = min(len(ref), len(out))
    w, st, md = int(win / HOP), int(step / HOP), int(max_delay / HOP)
    floor = max(float(np.percentile(ref[:n], 60)) * 0.5, 1.0)
    ts, ds, ok = [], [], []
    for c in range(w // 2, n - w // 2, st):
        a = ref[c - w // 2: c + w // 2]
        if a.mean() < floor:
            continue
        a = a - a.mean()
        best, best_c = 0, -2.0
        for lag in range(-md, md + 1):
            lo, hi = c - w // 2 + lag, c + w // 2 + lag
            if lo < 0 or hi > len(out):
                continue
            b = out[lo:hi] - out[lo:hi].mean()
            cc = float((a * b).sum() / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9))
            if cc > best_c:
                best, best_c = lag, cc
        ts.append(c * HOP)
        ds.append(best * HOP)
        ok.append(best_c >= 0.6)
    return np.array(ts), np.array(ds), np.array(ok)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("swap")
    ap.add_argument("voice")
    ap.add_argument("--out", required=True)
    ap.add_argument("--fps", type=float, default=30.0)
    ap.add_argument("--max-delay", type=float, default=1.5)
    ap.add_argument("--max-lead", type=float, default=0.4)
    ap.add_argument("--source-json", default=None,
                    help="the <name>-raw-for-higgsfield.json of the clip that was sent: limits the ran-out-of-footage check to the FACE "
                         "WINDOW (the handles are thrown away, so running out inside the tail handle is harmless)")
    a = ap.parse_args()
    swap, voice, outp = Path(a.swap), Path(a.voice), Path(a.out)
    ref, got = envelope(voice), envelope(swap)
    n = len(ref)
    jm = dtw_map(ref, got, a.max_lead, a.max_delay)
    d = (jm - np.arange(n)) * HOP                                  # delay of the returned speech, per 10 ms of real voice
    floor = max(float(np.percentile(ref, 60)) * 0.5, 1.0)
    sm_ref = np.convolve(ref, np.ones(15) / 15, mode="same")
    speech = sm_ref > floor
    if speech.sum() < 20:
        print("FATAL: no speech found in the reference voice", file=sys.stderr)
        sys.exit(1)
    ti = np.arange(n)
    d = np.interp(ti, ti[speech], d[speech])                       # trust the map only where he is speaking
    k = 12                                                         # +-120 ms running median, then a short mean
    d = np.array([np.median(d[max(0, i - k): i + k + 1]) for i in range(n)])
    d = np.convolve(np.pad(d, 5, mode="edge"), np.ones(11) / 11, mode="valid")
    dur = n * HOP
    n_frames = int(round(dur * a.fps))
    t = np.arange(n_frames) / a.fps
    src_t = np.maximum.accumulate(t + np.interp(t, ti * HOP, d))   # never step backwards in the returned clip
    w, h, sfps = probe(swap)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(swap), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    fsz = w * h * 3
    n_src = len(raw) // fsz
    idx = np.clip(np.round(src_t * sfps).astype(int), 0, n_src - 1)
    win = (0.0, dur)
    if a.source_json:
        sj = json.loads(Path(a.source_json).read_text(encoding="utf-8"))
        w0 = float(sj["window_starts_at_clip_s"])
        win = (w0, w0 + (sj["window_frames"][1] - sj["window_frames"][0]) / 30.0)
    in_win = (t >= win[0]) & (t < win[1])
    ran_out = float((src_t[in_win] > (n_src - 1) / sfps + 0.02).mean()) if in_win.any() else 0.0
    outp.parent.mkdir(parents=True, exist_ok=True)
    enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", f"{a.fps}", "-i", "-",
                            "-an", "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(outp)],
                           stdin=subprocess.PIPE)
    for i in idx:
        enc.stdin.write(raw[i * fsz: (i + 1) * fsz])
    enc.stdin.close()
    if enc.wait() != 0 or not outp.is_file():
        print("FATAL: encode failed", file=sys.stderr)
        sys.exit(1)
    # PROOF: warp the returned audio's envelope with the same map; the leftover delay in EVERY speech window
    te = ti * HOP
    warped = np.interp(np.maximum.accumulate(te + d), np.arange(len(got)) * HOP, got)
    ts2, ds2, ok2 = local_delay(ref, warped, 0.4)
    coverage = float(ok2.mean()) if len(ok2) else 0.0
    resid = float(np.abs(ds2[ok2]).max()) if ok2.any() else 9.9
    curve = [[round(float(x), 1), int(round(float(np.interp(x, te, d)) * 1000))] for x in np.arange(0.5, dur, 0.5)]
    passed = resid <= 0.06 and coverage >= 0.9 and ran_out < 0.02
    report = {"swap": str(swap), "voice": str(voice), "out": str(outp), "fps": a.fps, "frames": int(n_frames), "source_fps": sfps,
              "delay_before_ms": [int(round(float(d[speech].min()) * 1000)), int(round(float(d[speech].max()) * 1000))],
              "residual_delay_after_ms": int(round(resid * 1000)), "speech_windows_locked_pct": round(coverage * 100, 1),
              "window_s": [round(win[0], 3), round(win[1], 3)],
              "window_frames_past_the_end_of_the_returned_clip_pct": round(ran_out * 100, 1), "delay_curve_s_ms": curve, "passed": passed}
    outp.with_suffix(".retime.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"SWAP-RETIME {'ok' if passed else 'FAIL'} delay_before={report['delay_before_ms'][0]}..{report['delay_before_ms'][1]}ms "
          f"residual={report['residual_delay_after_ms']}ms coverage={report['speech_windows_locked_pct']}% frames={n_frames}")
    print(f"WROTE {outp}")
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
