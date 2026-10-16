"""Offline SFX mix onto the bare spine (zero renders) + encode-matched control. Mirrors Remotion's mix:
linear volume per cue, cue truncated at dur, summed (no normalisation), 48 kHz AAC."""
import json, re, subprocess, sys, os
ROOT = os.path.abspath('.')
RA = 'video-creation/shorts/downtober/render-assets'
SPINE = f'{RA}/long-term-plays-58x-350x.mp4'
Q = 'video-creation/shorts/downtober/long-term-plays-58x-350x/_qa'
const = open('video-creation/remotion/src/constants-downtober-long-term-plays-58x-350x.ts', encoding='utf-8').read()
body = re.search(r'SFX_DT3: Sfx\[\] = \[(.*?)\];', const, re.S).group(1)
cues = [dict(t=float(m.group(1)), src=m.group(2), vol=float(m.group(3)), dur=float(m.group(4)))
        for m in re.finditer(r"\{ t: ([\d.]+), src: staticFile\('([^']+)'\), vol: ([\d.]+), dur: ([\d.]+) \}", body)]
over = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
for i, c in enumerate(cues):
    if str(i) in over: c.update(over[str(i)])
out = sys.argv[2] if len(sys.argv) > 2 else f'{Q}/mix.m4a'
args = ['ffmpeg', '-v', 'error', '-y', '-i', SPINE]
for c in cues: args += ['-i', f'{RA}/{c["src"]}']
fl = []
for i, c in enumerate(cues, 1):
    fl.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{c["dur"]},volume={c["vol"]},adelay={int(round(c["t"]*1000))}|{int(round(c["t"]*1000))}[s{i}]')
fl.append('[0:a]aresample=48000,aformat=channel_layouts=stereo[b]')
fl.append('[b]' + ''.join(f'[s{i}]' for i in range(1, len(cues)+1)) + f'amix=inputs={len(cues)+1}:normalize=0:duration=first[m]')
args += ['-filter_complex', ';'.join(fl), '-map', '[m]', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', out]
subprocess.run(args, check=True)
print('mixed', out, [(c['t'], c['src'], c['vol'], c['dur']) for c in cues])
if not os.path.exists(f'{Q}/control.m4a') or '--control' in sys.argv:
    subprocess.run(['ffmpeg','-v','error','-y','-i',SPINE,'-vn','-af','aresample=48000,aformat=channel_layouts=stereo','-c:a','aac','-b:a','320k','-ar','48000',f'{Q}/control.m4a'], check=True)
    print('control written')
