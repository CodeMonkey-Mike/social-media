"""Offline SFX mix check (remotion-shorts-build row 7a): spine + SFX cues mixed with ffmpeg exactly like the comp
(atrim to dur, linear volume, delay to t), then both the mix and an encode-matched control (bare spine) pushed through
48 kHz AAC. Writes a whisper_jobs.json of short staggered windows around every cue for both."""
import json, re, subprocess, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))  # video-creation
CONST = os.path.join(ROOT, 'remotion', 'src', 'constants-downtober-get-in-make-money-get-out.ts')
PUB = os.path.join(ROOT, 'shorts', 'downtober', 'render-assets')
SPINE = os.path.join(PUB, 'get-in-make-money-get-out.mp4')
tag = sys.argv[1] if len(sys.argv) > 1 else 'plan'
override = json.loads(sys.argv[2]) if len(sys.argv) > 2 else None
src = open(CONST, encoding='utf-8').read()
body = src[src.index('export const SFX_DT4'):]
cues = []
for m in re.finditer(r"\{\s*t:\s*([\d.]+),\s*src:\s*staticFile\('([^']+)'\),\s*vol:\s*([\d.]+),\s*dur:\s*([\d.]+)\s*\}", body):
    cues.append(dict(t=float(m.group(1)), f=m.group(2), vol=float(m.group(3)), dur=float(m.group(4))))
if override is not None:
    cues = override
inputs = ['-i', SPINE]
fl = []
for i, c in enumerate(cues):
    inputs += ['-i', os.path.join(PUB, c['f'])]
    ms = int(round(c['t'] * 1000))
    fl.append(f"[{i+1}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{c['dur']},volume={c['vol']},adelay={ms}|{ms}[s{i}]")
mixin = '[0:a]aresample=48000,aformat=channel_layouts=stereo[b];' + ';'.join(fl) + ';[b]' + ''.join(f'[s{i}]' for i in range(len(cues))) + f'amix=inputs={len(cues)+1}:normalize=0:duration=first[m]'
out = os.path.join(HERE, f'mix-{tag}.m4a')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', mixin, '-map', '[m]', '-c:a', 'aac', '-ar', '48000', '-b:a', '320k', out], check=True)
ctl = os.path.join(HERE, 'control.m4a')
if not os.path.exists(ctl):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SPINE, '-vn', '-c:a', 'aac', '-ar', '48000', '-b:a', '320k', ctl], check=True)
jobs = []
for c in cues:
    cue = c.get('cue', c['t'])
    for k, (a, b) in enumerate([(-1.6, 1.4), (-2.2, 1.0), (-1.0, 2.0)]):
        s, e = max(0.0, cue + a), min(27.30, cue + b)
        for nm, path in (('mix', out), ('ctl', ctl)):
            jobs.append({'id': f"c{c['t']:.3f}_w{k}_{nm}", 'audio': path, 'model': 'medium.en', 'clip': f'{s:.2f},{e:.2f}', 'language': 'en'})
json.dump(jobs, open(os.path.join(HERE, f'jobs-{tag}.json'), 'w'), indent=0)
print(len(cues), 'cues', len(jobs), 'jobs ->', out)
