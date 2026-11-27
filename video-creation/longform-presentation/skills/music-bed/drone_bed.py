#!/usr/bin/env python
"""drone_bed.py: a DRONE music bed under a finished SCRIPTED standard video (format 4, scripted option).

Read music-bed.md (this folder), "The drone bed on a scripted video". Born on longest-bear (2026-11-25: "use a Drone music
track for background music"). music_bed.py is the coding format's bed (intro sting + a random ELEVATOR track after a spoken
cue); a drone is one continuous tone, so there is no intro, no cue, and no loop-point search: the track is looped end to
end with a long equal-power crossfade, which a steady tone hides.

  python drone_bed.py "<project> NOMUSIC.mp4" --out "<project> FINAL-v1.mp4" [--track tissue-healing-285-hz] [--under 17]
      [--inserts <project>/overlays/inserts.json] [--dry-run]

The picture is stream-copied; the audio (his voice, and the clips' own audio when clips were spliced in) is decoded,
the bed is added under it and the mix is encoded once (AAC 320 kbps). Never run it on a video that already has the bed.

LEVEL: set by measurement, never by a typed gain (feedback: a stock bed mastered hot sat 1 dB under the voice at a
"normal" gain). The bed is placed `--under` LU below the voice's integrated loudness (default 17, Mike's 16 to 18).
DUCK: under every spliced clip (inserts.json) the bed drops 14 dB with 0.3 s ramps (the longform-edited rule): the clips
are somebody else's voice, and a bed under them muddies both.
The bed fades in over 3 s from the first frame and out over the last 4 s. Machine line:
DRONE-BED PASS|FAIL track=<id> voice=<LUFS> bed=<LUFS> under=<LU> frames=<n> (master <n>)
The YouTube license code of the track goes in the video description (print below); record the track in the usage ledger.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile

VC = Path(__file__).resolve().parents[3]  # video-creation/
LIBRARY = VC / "assets/music/library.json"
SR = 48000
XF = 4.0            # s, equal-power crossfade at every loop join (a drone hides it)
FADE_IN, FADE_OUT = 3.0, 4.0
KEEP_END = 12.0     # s of the track's own ending left out of the loop body (the files end on a hit)
DUCK_DB, DUCK_RAMP = -14.0, 0.3

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def duration(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                                capture_output=True, text=True, check=True).stdout.strip())


def lufs_of_file(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-vn", "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True)
    hits = re.findall(r"I:\s*(-?[\d.]+)\s*LUFS", r.stderr)
    if not hits:
        sys.exit(f"could not measure the loudness of {path}")
    return float(hits[-1])


def lufs_of_array(x):
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp) / "bed.wav"
        wavfile.write(p, SR, x.astype(np.float32))
        return lufs_of_file(p)


def join(a, b):
    n = int(XF * SR)
    t = np.linspace(0, np.pi / 2, n)[:, None]
    return np.concatenate([a[:-n], a[-n:] * np.cos(t) + b[:n] * np.sin(t), b[n:]])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video", help="the finished video WITHOUT music (the cover-run render)")
    ap.add_argument("--out", required=True, help="the deliverable, e.g. '<project> FINAL-v1.mp4' (never the input file)")
    ap.add_argument("--track", default="tissue-healing-285-hz", help="library id of the drone track")
    ap.add_argument("--under", type=float, default=17.0, help="LU the bed sits below the voice (Mike's range: 16 to 18)")
    ap.add_argument("--inserts", default=None, help="overlays/inserts.json from clip_insert.py (default: <video dir>/overlays/inserts.json)")
    ap.add_argument("--dry-run", action="store_true", help="measure and report, write nothing")
    a = ap.parse_args()
    video, out = Path(a.video).resolve(), Path(a.out).resolve()
    if video == out:
        sys.exit("--out must not be the input: the mix is written to a new file")
    rows = json.loads(LIBRARY.read_text(encoding="utf-8"))["tracks"]
    track = next((r for r in rows if r["id"] == a.track), None)
    if track is None:
        sys.exit(f"no track {a.track!r} in {LIBRARY}")
    if "drone" not in (track.get("tags") or []):
        print(f"WARN: {a.track} is not tagged drone in the library")
    vlen = duration(video)
    m = load(VC / track["folder"] / track["primary_file"])
    body = m[:max(int(XF * 4 * SR), len(m) - int(KEEP_END * SR))]
    bed = body
    while len(bed) < int(vlen * SR) + int(XF * SR):
        bed = join(bed, body)
    bed = bed[:int(round(vlen * SR))]
    n = len(bed)
    env = np.ones(n)
    env[:int(FADE_IN * SR)] = np.linspace(0, 1, int(FADE_IN * SR))
    env[n - int(FADE_OUT * SR):] = np.minimum(env[n - int(FADE_OUT * SR):], np.linspace(1, 0, int(FADE_OUT * SR)))
    ip = Path(a.inserts) if a.inserts else video.parent / "overlays" / "inserts.json"
    ducks = []
    if ip.is_file():
        for ins in json.loads(ip.read_text(encoding="utf-8"))["inserts"]:
            t0, t1 = ins["at"], ins["at"] + ins["dur"]
            ducks.append((t0, t1))
            g = 10 ** (DUCK_DB / 20)
            i0, i1, r = int(t0 * SR), int(t1 * SR), int(DUCK_RAMP * SR)
            d = np.ones(n)
            d[i0:i1] = g
            d[max(0, i0 - r):i0] = np.linspace(1, g, i0 - max(0, i0 - r))
            d[i1:i1 + r] = np.linspace(g, 1, len(d[i1:i1 + r]))
            env *= d
    voice = lufs_of_file(video)
    bed_l = lufs_of_array(bed)
    gain_db = (voice - a.under) - bed_l
    print(f"voice {voice:.1f} LUFS, bed as in the file {bed_l:.1f} LUFS -> gain {gain_db:+.1f} dB, the bed sits {a.under:.0f} LU under the voice")
    print(f"track {track['id']} ({track['title']}), {vlen:.1f} s of video, {len(body) / SR:.0f} s body looped with {XF:.0f} s crossfades; "
          f"duck under {len(ducks)} clip window(s) {ducks}")
    print(f"YouTube license code for the description: {track.get('yt_license_code')}")
    if a.dry_run:
        return
    mix = bed * env[:, None] * 10 ** (gain_db / 20)
    peak = 20 * np.log10(np.abs(mix).max() + 1e-12)
    wav = out.with_suffix(".bed.wav")
    wavfile.write(wav, SR, mix.astype(np.float32))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(wav), "-filter_complex",
                    "[0:a]aresample=48000[v];[v][1:a]amix=inputs=2:normalize=0:duration=first[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
                    "-movflags", "+faststart", str(out)], check=True)
    wav.unlink()
    frames = lambda p: subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v", "-show_entries",
                                       "stream=nb_read_packets", "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout.strip()
    fi, fo = frames(video), frames(out)
    ok = fi == fo and abs(duration(out) - vlen) < 0.1
    print(f"bed peak {peak:.1f} dBFS; {out}")
    print(f"DRONE-BED {'PASS' if ok else 'FAIL'} track={track['id']} voice={voice:.1f} bed={voice - a.under:.1f} under={a.under:.0f} "
          f"frames={fo} (master {fi})")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
