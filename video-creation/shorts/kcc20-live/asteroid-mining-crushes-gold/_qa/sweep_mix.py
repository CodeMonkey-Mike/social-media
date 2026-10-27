"""Offline SFX sweep for kcc20-live clip 4: mix candidate cues onto the BARE spine (Remotion semantics:
linear gain, sound starts at round(t*30)/30, truncated at round(dur*30)/30), encode 48k AAC (encode-matched to
the render), and emit whisper_jobs windows. Zero renders."""
import json, subprocess, sys, os
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
RA = os.path.join(HERE, '..', '..', 'render-assets')
SR = 48000
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
spine = load(os.path.join(RA, 'asteroid-mining-crushes-gold.mp4'))
cache = {}
def sfx(f):
    if f not in cache: cache[f] = load(os.path.join(RA, 'sfx', f))
    return cache[f]
def mix(cues):
    out = spine.copy()
    for c in cues:
        s = sfx(c['f']); st = int(round(round(c['t'] * 30) / 30 * SR)); n = int(round(round(c['dur'] * 30) / 30 * SR))
        seg = s[:n] * c['vol']; e = min(len(out), st + len(seg)); out[st:e] += seg[:e - st]
    return out
def write(arr, name):
    wav = os.path.join(HERE, 'sweep', name + '.wav'); m4a = os.path.join(HERE, 'sweep', name + '.m4a')
    p = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', wav], input=arr.astype(np.float32).tobytes(), check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-c:a', 'aac', '-b:a', '320k', '-ar', str(SR), m4a], check=True)
    os.remove(wav); return m4a
if __name__ == '__main__':
    spec = json.load(open(sys.argv[1]))      # {cand_name: {"cues":[...], "event": t}}
    jobs = []
    for name, c in spec.items():
        m4a = write(mix(c['cues']), name)
        ev = c['event']
        for i, (a, b) in enumerate([(ev - 2.0, ev + 2.0), (ev - 1.2, ev + 2.8), (ev - 2.8, ev + 1.2)]):
            a = max(0.0, a); b = min(29.0, b)
            jobs.append({'id': f'{name}-w{i}', 'audio': m4a, 'model': 'medium.en', 'clip': f'{a:.2f},{b:.2f}', 'language': 'en'})
    json.dump(jobs, open(sys.argv[2], 'w'), indent=1); print(len(jobs), 'jobs')
