import json, subprocess, sys, os, urllib.request
base = sys.argv[1]; slots = sys.argv[2:]
prev = os.path.join(base, 'prev'); os.makedirs(prev, exist_ok=True)
def probe(p):
    r = subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-show_entries','format=duration','-of','json',p],capture_output=True,text=True)
    j = json.loads(r.stdout or '{}'); s=(j.get('streams') or [{}])[0]
    return s.get('width'), s.get('height'), float(j.get('format',{}).get('duration',0) or 0)
for slot in slots:
    d = json.load(open(os.path.join(base, f'br{slot}.json'), encoding='utf-8'))
    tiles = []
    for j, r in enumerate(d):
        pv = r.get('previewVideo'); f = os.path.join(prev, f'b{slot}_{j}.mp4')
        if not os.path.exists(f):
            try:
                req = urllib.request.Request(pv, headers={'User-Agent':'Mozilla/5.0'})
                open(f,'wb').write(urllib.request.urlopen(req, timeout=60).read())
            except Exception as e:
                print(slot, j, 'DL FAIL', e); continue
        w,h,dur = probe(f)
        print(f'BR-{slot} #{j} {w}x{h} {dur:.1f}s {r["title"][:70]}')
        if not w or w >= h: continue
        # 4 frames across clip, each scaled to 152x270, labelled
        fr = []
        for k, t in enumerate([0.1,0.35,0.6,0.85]):
            o = os.path.join(prev, f'b{slot}_{j}_{k}.png')
            subprocess.run(['ffmpeg','-y','-v','error','-ss',str(dur*t),'-i',f,'-frames:v','1','-vf','scale=152:270',o])
            fr.append(o)
        row = os.path.join(prev, f'b{slot}_{j}_row.png')
        args = ['ffmpeg','-y','-v','error']
        for o in fr: args += ['-i', o]
        args += ['-filter_complex', ''.join(f'[{i}]' for i in range(4)) + f"hstack=4,drawtext=text='#{j}':x=4:y=4:fontsize=28:fontcolor=yellow:box=1:boxcolor=black", row]
        subprocess.run(args); tiles.append(row)
    # stack rows into sheets of up to 7 rows (2 columns of rows)
    for s in range(0, len(tiles), 6):
        grp = tiles[s:s+6]
        while len(grp) % 2: grp.append(grp[-1])
        out = os.path.join(base, f'sheet_br{slot}_{s//6}.png')
        args = ['ffmpeg','-y','-v','error']
        for o in grp: args += ['-i', o]
        n=len(grp); half=n//2
        fc = ''.join(f'[{i}]' for i in range(half)) + f'vstack={half}[a];' + ''.join(f'[{i}]' for i in range(half,n)) + f'vstack={half}[b];[a][b]hstack=2' if half>1 else '[0][1]hstack=2'
        args += ['-filter_complex', fc, out]; subprocess.run(args)
