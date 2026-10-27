"""Fetch previewVideo for search results, probe dims, build a labelled contact sheet (3 frames/candidate)."""
import json, subprocess, sys, urllib.request
from pathlib import Path
res = Path(sys.argv[1]); outdir = Path(sys.argv[2]); outdir.mkdir(parents=True, exist_ok=True)
idx = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else None
d = json.loads(res.read_text(encoding='utf-8'))
tiles = []
for i, x in enumerate(d):
    if idx is not None and i not in idx: continue
    if not x.get('previewVideo'): print(i, 'NO PREVIEW'); continue
    p = outdir / f'p{i}.mp4'
    if not p.exists():
        try:
            req = urllib.request.Request(x['previewVideo'], headers={'User-Agent': 'Mozilla/5.0'})
            p.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        except Exception as e:
            print(i, 'FETCH FAIL', e); continue
    pr = subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-show_entries','format=duration','-of','csv=p=0',str(p)],capture_output=True,text=True).stdout.split()
    w,h = pr[0].split(',')[:2]; dur = float(pr[-1])
    portrait = int(h) > int(w)
    print(i, f'{w}x{h}', 'PORTRAIT' if portrait else 'LANDSCAPE', f'{dur:.1f}s', x['title'][:70])
    if not portrait: continue
    t = outdir / f't{i}.png'
    fr = []
    for k, frac in enumerate((0.1, 0.5, 0.9)):
        f = outdir / f'f{i}_{k}.png'
        subprocess.run(['ffmpeg','-y','-v','error','-ss',str(dur*frac),'-i',str(p),'-frames:v','1','-vf','scale=180:320',str(f)])
        fr.append(f)
    subprocess.run(['ffmpeg','-y','-v','error']+sum([['-i',str(f)] for f in fr],[])+['-filter_complex',
        f"[0][1][2]hstack=3,pad=iw:ih+30:0:30:black,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='{i}':fontcolor=white:fontsize=26:x=6:y=2",str(t)])
    tiles.append(t)
# grid of tiles, 4 per row
rows = [tiles[j:j+4] for j in range(0, len(tiles), 4)]
rowfiles = []
for r, row in enumerate(rows):
    rf = outdir / f'row{r}.png'
    if len(row) == 1: subprocess.run(['ffmpeg','-y','-v','error','-i',str(row[0]),str(rf)])
    else:
        while len(row) < 4: row = row + [row[-1]]
        subprocess.run(['ffmpeg','-y','-v','error']+sum([['-i',str(f)] for f in row],[])+['-filter_complex',f"hstack={len(row)}",str(rf)])
    rowfiles.append(rf)
sheet = outdir / 'sheet.png'
if len(rowfiles) == 1: subprocess.run(['ffmpeg','-y','-v','error','-i',str(rowfiles[0]),str(sheet)])
elif rowfiles: subprocess.run(['ffmpeg','-y','-v','error']+sum([['-i',str(f)] for f in rowfiles],[])+['-filter_complex',f"vstack={len(rowfiles)}",str(sheet)])
print('sheet', sheet)
