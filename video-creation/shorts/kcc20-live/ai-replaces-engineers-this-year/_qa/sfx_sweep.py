"""Offline SFX sweep for kcc20-live clip 3 (SKILL row 7a): mix candidate cue sets onto the bare spine
(Remotion-equivalent: Sequence from=round(t*30), durationInFrames=round(dur*30), linear volume), push each
through the same 48 kHz AAC chain as the render, and emit a whisper_jobs list over staggered windows.
Zero renders."""
import json, os, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CLIP = os.path.dirname(HERE)
SPINE = os.path.join(CLIP, 'ai-replaces-engineers-this-year-final.mp4')
SFX = os.path.join(CLIP, '..', 'render-assets', 'sfx')
OUT = os.path.join(HERE, 'sweep')
os.makedirs(OUT, exist_ok=True)
SR, FPS = 48000, 30


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vn', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


BASE = load(SPINE)
_cache = {}


def sfx(name):
    if name not in _cache:
        _cache[name] = load(os.path.join(SFX, name))
    return _cache[name]


def mix(cues):
    out = BASE.copy()
    for name, t, vol, dur in cues:
        a = sfx(name)
        s = round(t * FPS) * SR // FPS
        n = min(len(a), max(1, round(dur * FPS)) * SR // FPS, len(out) - s)
        out[s:s + n] += a[:n] * vol
    return out


def write(tag, buf):
    wav = os.path.join(OUT, tag + '.wav')
    m4a = os.path.join(OUT, tag + '.m4a')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', wav],
                   input=buf.astype(np.float32).tobytes(), check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-c:a', 'aac', '-b:a', '320k', m4a], check=True)
    os.remove(wav)
    return m4a


WH = 'transition_rapid_whoosh-tight.wav'
IMP = 'Impacts/Impact_Hit_01-2-tight.wav'
KP = 'kinetic-text/knock-pop.wav'
RIS = 'Riser Sound Effect-2s.wav'
BOOM = 'Boom - Big Reveal-short.wav'
SJ = 'Impacts/Soundjay_Impact_Main_01-short.wav'
KICK = 'Impacts/Kick_Impact_01-tight.wav'

# candidate sets per cue region: (tag, [cues], windows)
HEADW = [(0.0, 2.71), (0.0, 1.71), (0.0, 3.24), (0.0, 3.94)]
ANTW = [(3.58, 7.58), (2.58, 6.58), (4.28, 8.28)]
CLIW = [(26.0, 30.0), (25.5, 29.5), (26.6, 30.6), (27.1, 31.1)]
RADW = [(29.46, 33.3), (28.46, 32.46), (30.16, 33.3)]
SETS = {
    'head': (HEADW, {
        'A0': [(WH, 0.033, 0.08, 0.30), (IMP, 0.60, 0.14, 0.30)],
        'A1': [(IMP, 0.60, 0.14, 0.30)],
        'A2': [(WH, 0.033, 0.08, 0.30)],
        'A3': [(WH, 0.033, 0.04, 0.30), (IMP, 0.60, 0.14, 0.30)],
        'A4': [(WH, 0.033, 0.08, 0.30), (IMP, 0.62, 0.14, 0.17)],
    }),
    'ant': (ANTW, {
        'B0': [(KP, 5.08, 0.12, 0.45)],
        'B1': [(KP, 5.08, 0.12, 0.15)],
        'B2': [(KP, 4.97, 0.12, 0.20)],
        'B3': [(KP, 5.08, 0.06, 0.45)],
    }),
    'cli': (CLIW, {
        'C0': [(RIS, 26.62, 0.06, 2.10), (BOOM, 28.61, 0.12, 0.45)],
        'C1': [(RIS, 26.62, 0.03, 2.10), (BOOM, 28.61, 0.12, 0.45)],
        'C2': [(BOOM, 28.61, 0.12, 0.45)],
        'C3': [(BOOM, 28.61, 0.12, 0.25)],
    }),
    'rad': (RADW, {
        'D0': [(SJ, 30.51, 0.12, 0.68)],
        'D1': [(KICK, 30.77, 0.12, 0.32)],
        'D2': [(SJ, 30.51, 0.06, 0.68)],
        'D3': [(IMP, 30.82, 0.12, 0.20)],
        'D4': [(SJ, 30.51, 0.12, 0.68), ][:0] + [(SJ, 30.86, 0.12, 0.30)],
    }),
}

jobs = []
for region, (wins, cands) in SETS.items():
    for tag, cues in cands.items():
        m4a = write(tag, mix(cues))
        for k, (a, b) in enumerate(wins):
            jobs.append({'id': f'{region}|{tag}|w{k}', 'audio': m4a, 'model': 'medium.en', 'language': 'en',
                         'clip': f'{a:.2f},{b:.2f}'})
    ctl = write('CTL', BASE) if not os.path.exists(os.path.join(OUT, 'CTL.m4a')) else os.path.join(OUT, 'CTL.m4a')
    for k, (a, b) in enumerate(wins):
        jobs.append({'id': f'{region}|CTL|w{k}', 'audio': ctl, 'model': 'medium.en', 'language': 'en',
                     'clip': f'{a:.2f},{b:.2f}'})
json.dump(jobs, open(os.path.join(HERE, 'jobs-sweep.json'), 'w'), indent=0)
print(len(jobs), 'jobs')
