"""Offline SFX masking sweep for kcc20-live clip 2 (SKILL row 7a): mix the SFX list onto the bare spine,
push control + mix through the same 48 kHz AAC chain, build staggered whisper windows per cue."""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
CLIP = os.path.abspath(os.path.join(HERE, '..', '..'))
RA = os.path.abspath(os.path.join(CLIP, '..', 'render-assets'))
SPINE = os.path.join(CLIP, 'last-chance-to-own-assets-final.mp4')
CONST = os.path.abspath(os.path.join(CLIP, '..', '..', '..', 'remotion', 'src', 'constants-kcc20-live-last-chance-to-own-assets.ts'))

def sfx_list(src_text):
    out = []
    for m in re.finditer(r"\{\s*t:\s*([\d.]+),\s*src:\s*staticFile\('([^']+)'\),\s*vol:\s*([\d.]+),\s*dur:\s*([\d.]+)\s*\}", src_text):
        out.append(dict(t=float(m[1]), src=m[2], vol=float(m[3]), dur=float(m[4])))
    return out

def mix(sfx, out):
    args = ['ffmpeg', '-v', 'error', '-y', '-i', SPINE]
    for s in sfx:
        args += ['-i', os.path.join(RA, s['src'])]
    fc = []
    labels = ['[0:a]aresample=48000[a0]']
    for i, s in enumerate(sfx, 1):
        d = int(round(s['t'] * 1000))
        labels.append(f"[{i}:a]aresample=48000,atrim=0:{s['dur']},volume={s['vol']},adelay={d}|{d}[s{i}]")
    ins = '[a0]' + ''.join(f'[s{i}]' for i in range(1, len(sfx) + 1))
    labels.append(f"{ins}amix=inputs={len(sfx)+1}:normalize=0:duration=first[m]")
    args += ['-filter_complex', ';'.join(labels), '-map', '[m]', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', out]
    subprocess.run(args, check=True)

if __name__ == '__main__':
    tag = sys.argv[1] if len(sys.argv) > 1 else 'v1'
    sfx = sfx_list(open(CONST, encoding='utf-8').read())
    print(len(sfx), 'cues')
    ctrl = os.path.join(HERE, 'control.m4a')
    if not os.path.exists(ctrl):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SPINE, '-vn', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', ctrl], check=True)
    mixf = os.path.join(HERE, f'mix-{tag}.m4a')
    mix(sfx, mixf)
    jobs = []
    for k, s in enumerate(sfx):
        ev = s['t']
        for off in (-1.6, -0.9, -0.3):
            a = max(0.0, ev + off); b = min(31.40, a + 3.4)
            for name, f in (('ctl', ctrl), (tag, mixf)):
                jobs.append({'id': f'c{k:02d}@{ev:.2f}{off:+.1f}-{name}', 'audio': f, 'model': 'medium.en', 'clip': f'{a:.2f},{b:.2f}'})
    json.dump(jobs, open(os.path.join(HERE, f'jobs-{tag}.json'), 'w'), indent=1)
    print(len(jobs), 'jobs')
