import json, sys, subprocess, urllib.request, os
# usage: prev.py <slot>   -> p<slot>_<i>.mp4 + sheet<slot>.png (rows=candidates, 4 frames each)
n = sys.argv[1]
items = json.load(open(f's{n}.json', encoding='utf-8'))
rows = []
for i, x in enumerate(items):
    v = x.get('previewVideo')
    if not v: continue
    f = f'p{n}_{i}.mp4'
    if not os.path.exists(f):
        try:
            req = urllib.request.Request(v, headers={'User-Agent': 'Mozilla/5.0'})
            open(f, 'wb').write(urllib.request.urlopen(req, timeout=60).read())
        except Exception as e:
            print('fail', i, e); continue
    d = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout.strip() or 0)
    rows.append((i, f, d))
for i, f, d in rows:
    # 4 frames evenly, 320 wide, labelled
    out = f'row{n}_{i}.png'
    fps = 4.0 / max(d, 0.5)
    subprocess.run(['ffmpeg','-y','-v','error','-i',f,'-vf',f"fps={fps},scale=320:-2,tile=4x1",'-frames:v','1',out])
args = []
for i, f, d in rows: args += ['-i', f'row{n}_{i}.png']
if len(rows) > 1:
    subprocess.run(['ffmpeg','-y','-v','error',*args,'-filter_complex',f"{''.join(f'[{k}:v]' for k in range(len(rows)))}vstack=inputs={len(rows)}",f'sheet{n}.png'])
else:
    os.replace(f'row{n}_{rows[0][0]}.png', f'sheet{n}.png')
for i, f, d in rows: print(i, round(d,1), items[i]['duration'], items[i]['title'][:70])
