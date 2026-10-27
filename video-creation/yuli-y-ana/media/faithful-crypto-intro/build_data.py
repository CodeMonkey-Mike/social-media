#!/usr/bin/env python
"""faithful-crypto-intro: generate remotion/src/FaithfulCryptoIntroData.ts from timeline.json + COVER-PLAN.json +
the files on disk (face clips in clips/, b-roll in assets/vid + assets/img, captions.json). Re-run after any asset change.
Face clips: the chosen take per scene is read from clips/choice.json ({"01":"chunk-01.mp4", ...}); the clip's own speech
onset is measured so the lips land on the clean VO track (trim = clip onset - track onset in the scene)."""
import json, os, re, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
REMOTION_SRC = os.path.abspath('../../../remotion/src')
tl = json.load(open('timeline.json')); cp = json.load(open('COVER-PLAN.json'))
FPS = tl['fps']; TOTAL = tl['total']
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode().strip())
def onset(f):
    out = subprocess.run(['ffmpeg','-i',f,'-af','silencedetect=n=-32dB:d=0.08','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',out)]
    return en[0] if st and st[0] < 0.05 and en else 0.0
choice = json.load(open('clips/choice.json')) if os.path.exists('clips/choice.json') else {n: f'chunk-{n}.mp4' for n in ['01','02','03','04']}
# clips with NO audio stream (ElevenLabs Aurora previews are muted) carry their speech onset in clips/onsets.json
# (Aurora's lips start exactly at the source audio's onset: 0.25 s pad + the chunk's own onset).
# Aurora clips: lips start exactly at the padded track's onset = 0.25 s pad + the chunk's own onset (timeline.json face[]).
def aurora_onset(n): return 0.25 + tl['face'][n]['on']
os.makedirs('render-assets/video', exist_ok=True); os.makedirs('render-assets/images', exist_ok=True)
face = {}
# EAR LOCK (Mike, 2026-10-18, v11): Aurora (and Seedance) move the chair's cat-ears with the head, and a livelier take
# moves them more (v9's welcome brought the defect back after v4 had hidden it). The camera is static, so the ears + the
# wall around them are pasted from FRAME 0 onto every frame, but ONLY where both frame 0 and the current frame are
# ear-or-wall (never hair, never skin: v10 froze her hairline by locking a dilated zone blindly). Mask = the pink chair
# pixels of frame 0 above the hairline (y < 26% of the frame; the chair-top strip is excluded), dilated 60 px (the monitors + wall it reaches are static too); per frame
# the lock is dropped wherever either frame shows the HEAD (hair or skin = warm tones, r >= g >= b). Applied to the
# scenes listed in EAR_LOCK only (Mike: the welcome scene; the opening was fine as generated). Motion is printed.
EAR_LOCK = {'03'}


def ear_lock(src, dst):
    import numpy as np
    from PIL import Image, ImageFilter
    w, h = [int(x) for x in subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src]).decode().strip().split(',')]
    fps = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', src]).decode().strip()
    # CFR decode: the Aurora mp4 is variable-timed (gaps), ffmpeg fills them with repeats so frame k sits at k/fps, timing kept
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)
    f0 = fr[0].astype(int); top = int(h * 0.26)
    r, g, b = f0[..., 0], f0[..., 1], f0[..., 2]
    pink = (r > 150) & (r - g > 50) & (r - b > 20) & (g > 60); pink[top:] = False
    zone = np.asarray(Image.fromarray((pink * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(121))) > 0

    def eligible(f):   # NOT the head: hair (dark or brown) and skin are warm/neutral (r >= g >= b); the pink ear, the
        return ~((f[..., 0] >= f[..., 1]) & (f[..., 1] >= f[..., 2]))   # magenta wall and the blue/green monitors are not
    base = zone & eligible(f0); out = np.empty_like(fr)
    for k in range(len(fr)):
        m = base & eligible(fr[k].astype(int))
        a = (np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))).astype(np.float32) / 255.0)[..., None]
        out[k] = (fr[k].astype(np.float32) * (1 - a) + fr[0].astype(np.float32) * a).astype(np.uint8)
    has_audio = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip() != ''
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', fps, '-i', '-'] + (['-i', src, '-map', '0:v', '-map', '1:a', '-c:a', 'copy'] if has_audio else []) + ['-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', dst]
    subprocess.run(cmd, input=out.tobytes(), check=True)
    pk = pink[:top]; ears = fr[:, :top].astype(int); before = max(abs(ears[i] - ears[0])[pk].mean() for i in range(len(fr)))
    chk = out[:, :top].astype(int); after = max(abs(chk[i] - chk[0])[pk].mean() for i in range(len(out)))
    print(f'  ear lock {os.path.basename(src)}: {pink.sum()} ear px, {len(fr)} frames, ear-pixel motion {before:.2f} -> {after:.2f}')


for n, fn in choice.items():
    src = os.path.join('clips', fn); dst = f'render-assets/video/face-{n}.mp4'
    if n in EAR_LOCK:
        ear_lock(src, dst)
    else:
        shutil.copyfile(src, dst)
    face[n] = {'src': f'video/face-{n}.mp4', 'onset': round(aurora_onset(n) if 'aurora' in fn else onset(src), 3), 'len': round(dur(src), 3)}
scenes = []
for s in tl['scenes']:
    d = dict(s)
    if s['kind'] == 'face-solo':
        n = s['clip'].split('-')[1]; track_on = s['speech'][0] - s['t0']
        d['clip'] = face[n]['src']; d['trim'] = round(max(face[n]['onset'] - track_on, 0), 3)
    if s['kind'] == 'face-duo':
        d['clips'] = {}
        for who, c in s['clips'].items():
            n = c.split('-')[1]; track_on = s['speech'][0] - s['t0']
            d['clips'][who] = {'src': face[n]['src'], 'trim': round(max(face[n]['onset'] - track_on, 0), 3)}
    scenes.append(d)
# cover slots from COVER-PLAN + disk. Slot times were authored against the VO scene spans recorded in
# COVER-PLAN.json['scene_spans']; map them linearly onto the CURRENT timeline's spans so a re-voiced line keeps
# its covers on the same words.
old_spans = cp.get('scene_spans') or {}
new_spans = {s['id']: (s['t0'], s['t1']) for s in scenes}
def remap(t):
    for sid, (a, b) in old_spans.items():
        if a - 1e-6 <= t <= b + 1e-6:
            na, nb = new_spans[sid]; return round(na + (t - a) / (b - a) * (nb - na), 3)
    return t
slots = []
for sl in cp['slots']:
    sl = dict(sl); sl['t'] = [remap(sl['t'][0]), remap(sl['t'][1])]
    if sl['type'] == 'envato':
        hits = [f for f in os.listdir('assets/vid') if f.startswith(sl['id'] + '-')] if os.path.isdir('assets/vid') else []
        if not hits: print('MISSING', sl['id']); continue
        shutil.copyfile(os.path.join('assets/vid', hits[0]), 'render-assets/video/' + hits[0])
        slots.append({'id': sl['id'], 'kind': 'video', 'src': 'video/' + hits[0], 't0': sl['t'][0], 't1': sl['t'][1]})
    else:
        hits = [f for f in os.listdir('assets/img') if f.startswith(sl['id'] + '-')] if os.path.isdir('assets/img') else []
        if not hits: print('MISSING', sl['id']); continue
        shutil.copyfile(os.path.join('assets/img', hits[0]), 'render-assets/images/' + hits[0])
        slots.append({'id': sl['id'], 'kind': 'image', 'src': 'images/' + hits[0], 't0': sl['t'][0], 't1': sl['t'][1]})
# the cover layer must be CONTINUOUS: stretch every slot to the next slot's start (the 0.3 s VO gaps were
# rendering black, 2026-10-17 v1) and the last one to the end card, so the crossfades always overlap a neighbour.
slots.sort(key=lambda x: x['t0'])
end_card_t0 = next(s['t0'] for s in scenes if s['kind'] == 'end-card')
for i, sl in enumerate(slots):
    sl['t1'] = slots[i + 1]['t0'] if i + 1 < len(slots) else end_card_t0
caps = json.load(open('render-assets/captions.json', encoding='utf-8'))
# the title pop = the word FAITHFUL in S3; the subscribe pop = the word SUBSCRIBE
def word_time(w, lo, hi):
    for g in caps:
        for x in g['words']:
            if x['w'] == w and lo <= x['start'] <= hi: return x['start']
    return None
s3 = next(s for s in scenes if s['id'] == 'S3'); vo9 = next(s for s in scenes if s['id'] == 'VO09')
title_t = word_time('FAITHFUL', s3['t0'], s3['t1']) or (s3['speech'][0] + 1.2)
sub_t = word_time('SUBSCRIBE', vo9['t0'], vo9['t1']) or (vo9['speech'][0] + 0.8)
data = {'FPS': FPS, 'TOTAL': TOTAL, 'DURATION': int(round(TOTAL * FPS)), 'scenes': scenes, 'slots': slots, 'captions': caps,
        'titleT': round(title_t, 3), 'subscribeT': round(sub_t, 3),
        'music': {'src': 'audio/seabreeze-46.wav', 'startSec': 0, 'db': -19, 'fadeOutSec': 1.0},  # Mike's pick 2026-10-17: -12.5 LUFS cut, -19 dB -> ~16.5 dB under the -15.3 LUFS VO; its hit-and-decay ending lands on the end card
        'vo': 'audio/vo.wav', 'sfx': {'title': 'audio/impact-title.wav', 'subscribe': 'audio/impact-subscribe.wav'}}
ts = "// GENERATED by yuli-y-ana/media/faithful-crypto-intro/build_data.py — do not edit by hand.\n" \
     "export const DATA = " + json.dumps(data, indent=1) + " as const;\n" \
     "export type SceneT = (typeof DATA)['scenes'][number];\n"
open(os.path.join(REMOTION_SRC, 'FaithfulCryptoIntroData.ts'), 'w', encoding='utf-8').write(ts)
print('face:', json.dumps(face)); print('slots:', len(slots), '| titleT', data['titleT'], '| subscribeT', data['subscribeT'], '| frames', data['DURATION'])
