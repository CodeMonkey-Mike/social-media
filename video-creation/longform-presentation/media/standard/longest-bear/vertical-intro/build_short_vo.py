"""The VO on the VERTICAL's clock, for the short lane (longform-to-short.md "A vertical with a LEAD-IN").
Vertical time = spine time + 7.0 s. The file = the cold open's own audio (wind + his opening words) for the first 16.0 s,
then the enhanced spine shifted by 7.0 s (timestamps honoured), no music bed. Also writes overlays/vertical-clock.json.
    python vertical-intro/build_short_vo.py
"""
import json
import subprocess
from pathlib import Path

import numpy as np
from scipy.io import wavfile

PROJ = Path(__file__).resolve().parents[1]
SPINE = PROJ / "spine" / "longest-bear EDIT.enhanced+clips.mp4"
INTRO = PROJ / "vertical-intro" / "intro-preview-v3.mp4"
VERTICAL = PROJ / "longest-bear VERTICAL-v1.mp4"
OUT = PROJ / "vertical-intro" / "vertical-clock-vo.wav"
LEAD, INTRO_S, XF, SR = 7.0, 16.0, 0.02, 48000


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-map", "0:a:0", "-af",
                          "aresample=async=1:min_hard_comp=0.010:first_pts=0", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)


def lag_ms(a, b, t, n=4.0):
    """Offset of a against b (ms) around second t, searched within +/- 0.5 s."""
    x = b[int(t * SR):int((t + n) * SR), 0]
    y = a[int((t - 0.5) * SR):int((t + n + 0.5) * SR), 0]
    size = len(x) + len(y)
    c = np.fft.irfft(np.fft.rfft(y, size) * np.conj(np.fft.rfft(x, size)), size)[:SR + 1]
    return (int(np.argmax(c)) - SR // 2) / SR * 1000


spine, intro, vert = decode(SPINE), decode(INTRO), decode(VERTICAL)
lead, join, half = round(LEAD * SR), round(INTRO_S * SR), round(XF * SR / 2)
shifted = np.concatenate([np.zeros((lead, 2), np.float32), spine])
out = shifted.copy()
out[:join - half] = intro[:join - half]
ramp = np.linspace(0.0, 1.0, 2 * half, dtype=np.float32)[:, None]
out[join - half:join + half] = intro[join - half:join + half] * (1 - ramp) + shifted[join - half:join + half] * ramp
wavfile.write(OUT, SR, (np.clip(out, -1, 1) * 32767).astype(np.int16))

bad = 0
for t in (9.0, 30.0, 250.0, 520.0, 855.0):
    off = lag_ms(out, vert, t)
    print(f"  t={t:6.1f}s  VO vs vertical {off:+6.1f} ms")
    bad += abs(off) > 25
print(f"VO {len(out) / SR:.3f}s  vertical audio {len(vert) / SR:.3f}s  SYNC {'FAIL' if bad else 'PASS'}")

clock = {"lead_s": LEAD, "vo": "../vertical-intro/vertical-clock-vo.wav",
         "note": ("vertical 0.0-16.0 s is an AI-generated cold open, no card in cues.json (sourced: COVER). 0.0-1.0 a shirtless man "
                  "in black leather pants kicks a polar bear off a snowy peak; 1.0-2.5 the bear flies away; 3.5-5.0 he flexes and "
                  "roars, close up; 0.0-7.0 wind only, NO words; 5.0-7.0 Mike walks into the shot; 7.0 Mike's first words (\"What's "
                  "up you guys\") while he walks up; 12.5-14.0 the mountain bursts into snow and becomes his room; from 14.0 he is "
                  "at his desk, still the same sentence flow (\"...longest bear market ever\" ends 14.32).")}
(PROJ / "overlays" / "vertical-clock.json").write_text(json.dumps(clock, indent=1), encoding="utf-8")
raise SystemExit(1 if bad else 0)
