#!/usr/bin/env python
"""faithful-crypto-intro: lock the timeline from the final chunk mp3s (audio/chunk-NN.mp3) -> timeline.json +
render-assets/audio/vo.wav (the clean continuous VO master). Re-run after any voice change, then make_captions.py
and build_data.py. Face scenes end 0.3 s after the spoken words; VO chunks are trimmed (0.12 s lead / 0.15 s tail)
and spaced 0.3 s; Yuli's VO chunks get atempo 1.08; the unison close pairs 10 (Ana) + 11 (Yuli)."""
import subprocess, json, re, os
A = 'audio'; os.makedirs(f'{A}/_tl', exist_ok=True)


def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode().strip())


def bounds(f, thr='-32dB'):
    out = subprocess.run(['ffmpeg', '-i', f, '-af', f'silencedetect=n={thr}:d=0.08', '-f', 'null', '-'], capture_output=True, text=True).stderr
    d = dur(f); st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', out)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
    on = en[0] if st and st[0] < 0.05 and en else 0.0
    off = st[-1] if st and st[-1] > on + 0.3 and (not en or en[-1] <= st[-1]) else d
    return on, off, d


# --- per-chunk loudness match (2026-10-18): Ana's ElevenLabs v3 lines came out up to 5 dB hotter than Yuli's Seed Speech
# lines (-10 vs -15 LUFS). Every chunk is gained to TARGET_LUFS (plain gain, capped so the true peak stays under -1 dBTP)
# into audio/_norm/chunk-NN.mp3, and everything below reads the normalized copies.
TARGET_LUFS = -15.0
os.makedirs(f'{A}/_norm', exist_ok=True)


def lufs_peak(f):
    out = subprocess.run(['ffmpeg', '-i', f, '-filter_complex', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', out)[-1]); pk = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', out)
    return I, (float(pk[-1]) if pk else -3.0)


for n in ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']:
    I, pk = lufs_peak(f'{A}/chunk-{n}.mp3'); g = min(TARGET_LUFS - I, -1.0 - pk)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{A}/chunk-{n}.mp3', '-af', f'volume={g:.2f}dB', '-b:a', '192k', f'{A}/_norm/chunk-{n}.mp3'], check=True)
    print(f'chunk-{n}: {I:6.1f} LUFS, peak {pk:5.1f} -> gain {g:+.1f} dB')
SRC = f'{A}/_norm'   # normalized chunk copies feed the timeline + the VO master
LEAD, TAIL, GAP = 0.12, 0.15, 0.30
atempo = {'05': 1.08, '07': 1.08, '09': 1.08, '11': 1.08}
vo = {}
for n in ['05', '06', '07', '08', '09', '10', '11']:
    on, off, d = bounds(f'{SRC}/chunk-{n}.mp3'); a = atempo.get(n, 1.0)
    ss = max(on - LEAD, 0); to = min(off + TAIL, d)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{ss:.3f}', '-to', f'{to:.3f}', '-i', f'{SRC}/chunk-{n}.mp3', '-af', f'atempo={a}', '-ar', '48000', '-ac', '2', f'{A}/_tl/{n}.wav'], check=True)
    L = dur(f'{A}/_tl/{n}.wav'); vo[n] = {'len': L, 'atempo': a, 'speech_on': LEAD, 'speech_off': L - TAIL}
face = {}
for n in ['01', '02', '03', '04']:
    on, off, d = bounds(f'{SRC}/chunk-{n}.mp3'); face[n] = {'on': on, 'off': off, 'len': d}
scenes = []; t = 0.0


def add(id, kind, t0, t1, **kw):
    scenes.append(dict(id=id, kind=kind, t0=round(t0, 3), t1=round(t1, 3), **kw))


s1 = face['01']['off'] + 0.30
add('S1', 'face-solo', 0, s1, who='yuli', clip='chunk-01', track='chunk-01', track_at=0.0, speech=[face['01']['on'], face['01']['off']]); t = s1
s2 = t + face['02']['off'] + 0.30
add('S2', 'face-solo', t, s2, who='ana', clip='chunk-02', track='chunk-02', track_at=t, speech=[t + face['02']['on'], t + face['02']['off']]); t = s2
d03 = face['04']['on'] - face['03']['on']
s3_end = t + max(face['03']['off'] + d03, face['04']['off']) + 0.55
add('S3', 'face-duo', t, s3_end, clips={'yuli': 'chunk-03', 'ana': 'chunk-04'}, tracks={'chunk-03': t + d03, 'chunk-04': t}, speech=[t + face['04']['on'], t + max(face['03']['off'] + d03, face['04']['off'])]); t = s3_end
for n in ['05', '06', '07', '08', '09']:
    add(f'VO{n}', 'vo', t, t + vo[n]['len'], track=f'_tl/{n}', track_at=t, speech=[t + vo[n]['speech_on'], t + vo[n]['speech_off']]); t += vo[n]['len'] + GAP
end_len = max(vo['10']['len'], vo['11']['len'])
add('END', 'end-card', t, t + end_len + 1.2, tracks={'_tl/10': t, '_tl/11': t}, speech=[t + LEAD, t + max(vo['10']['speech_off'], vo['11']['speech_off'])]); total = t + end_len + 1.2
json.dump({'fps': 30, 'total': round(total, 3), 'scenes': scenes, 'vo': vo, 'face': face, 'params': {'LEAD': LEAD, 'TAIL': TAIL, 'GAP': GAP, 'atempo': atempo}}, open('timeline.json', 'w'), indent=1)
for s in scenes:
    print(f"{s['id']:6} {s['kind']:9} {s['t0']:6.2f} - {s['t1']:6.2f}  ({s['t1'] - s['t0']:.2f}s)")
print('TOTAL', round(total, 2), 's')
inputs = []; filt = []


def path(k):
    return f"{SRC}/{k}.mp3" if k.startswith('chunk') else f"{A}/{k}.wav"


def addtrack(p, at):
    i = len(filt); inputs.extend(['-i', p]); filt.append(f'[{i}:a]adelay={int(at * 1000)}|{int(at * 1000)}[a{i}]')


for s in scenes:
    if 'track' in s:
        addtrack(path(s['track']), s['track_at'])
    if 'tracks' in s:
        for k, v in s['tracks'].items():
            addtrack(path(k), v)
n = len(filt); mix = ''.join(f'[a{k}]' for k in range(n)) + f'amix=inputs={n}:normalize=0:dropout_transition=0,atrim=0:{total:.3f}[out]'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(filt) + ';' + mix, '-map', '[out]', '-ar', '48000', '-ac', '2', 'render-assets/audio/vo.wav'], check=True)
out = subprocess.run(['ffmpeg', '-i', 'render-assets/audio/vo.wav', '-filter_complex', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('vo.wav', round(dur('render-assets/audio/vo.wav'), 2), 's  LUFS:', re.findall(r'I:\s+(-?[\d.]+) LUFS', out)[-1])
