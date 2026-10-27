#!/usr/bin/env python
"""faithful-crypto-intro: captions = the canonical arial-black karaoke builder on vo.wav, then the project fixes:
mishear map (Ana/Faithful/TAO/Julie->YULI), the smeared duo "and" pinned to the S3 onset, regroup on the chunk-first
words (matched by text + timeline time), each coin name on its own card. Run after build_timeline.py."""
import json, subprocess, sys
subprocess.run([sys.executable, '../../../skills/captions/build_captions.py', '--transcribe', 'render-assets/audio/vo.wav', '--style', 'arial-black', '--out', 'render-assets/captions.json'], check=True)
c = json.load(open('render-assets/captions.json', encoding='utf-8'))
words = sorted([w for g in c for w in g['words']], key=lambda w: w['start'])
fix = {'ANNA': 'ANA', 'FACEBOOK': 'FAITHFUL', 'THAO': 'TAO', 'TAU': 'TAO', 'TAW': 'TAO', 'CASPA': 'KASPA', 'YULIE': 'YULI', 'YULING': 'YULI', 'JULIE': 'YULI', 'JULY': 'YULI', 'HULI': 'YULI', 'KANTON': 'CANTON'}
for w in words:
    w['w'] = fix.get(w['w'].upper(), w['w'].upper())
tl = json.load(open('timeline.json')); s3 = next(s for s in tl['scenes'] if s['id'] == 'S3')
for i, w in enumerate(words):
    if w['w'] == 'AND' and s3['t0'] - 1.0 < w['start'] < s3['speech'][0] - 0.1:
        w['start'] = round(s3['speech'][0], 2); words[i - 1]['end'] = min(words[i - 1]['end'], s3['t0'] - 0.15); print('pinned AND ->', w)
expect = {'S1': 'HI', 'S2': 'HI', 'S3': 'AND', 'VO05': 'ON', 'VO06': 'SOME', 'VO07': 'WE', 'VO08': 'WE', 'VO09': 'SO', 'END': 'SEE'}
forced = set()
for s in tl['scenes']:
    ts = s['speech'][0]; cands = [i for i, w in enumerate(words) if w['w'] == expect[s['id']] and abs(w['start'] - ts) < 0.9]
    if cands:
        forced.add(min(cands, key=lambda i: abs(words[i]['start'] - ts)))
    else:
        print('WARN no first-word match', s['id'])
solo = {'KASPA', 'TAO', 'CANTON'}; groups = []; cur = []


def flush():
    global cur
    if cur:
        groups.append({'text': ' '.join(w['w'] for w in cur), 'start': cur[0]['start'], 'end': cur[-1]['end'], 'words': cur}); cur = []


for i, w in enumerate(words):
    if i in forced or w['w'] in solo:
        flush()
    elif cur and (len(cur) >= 4 or w['end'] - cur[0]['start'] > 1.8 or w['start'] - cur[-1]['end'] > 0.45):
        flush()
    cur.append(w)
    if w['w'] in solo:
        flush()
flush()
json.dump(groups, open('render-assets/captions.json', 'w', encoding='utf-8'), indent=1)
for g in groups:
    print(f"{g['start']:6.2f}-{g['end']:6.2f}  {g['text']}")
