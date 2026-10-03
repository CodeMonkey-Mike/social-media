import json,sys,subprocess,os,urllib.request
# usage: probe.py results.json tag [idx,idx,...]
res=json.load(open(sys.argv[1],encoding='utf-8')); tag=sys.argv[2]
idx=[int(x) for x in sys.argv[3].split(',')] if len(sys.argv)>3 else range(len(res))
for i in idx:
    r=res[i]; pv=r.get('previewVideo')
    if not pv: print(i,'no preview'); continue
    f=f'{tag}-{i}.mp4'
    if not os.path.exists(f):
        try: urllib.request.urlretrieve(pv,f)
        except Exception as e: print(i,'dl fail',e); continue
    o=subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height:format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout.split()
    wh=o[0] if o else '?'; w,h=(wh.split(',')+['0'])[:2]
    port=int(h)>int(w) if w.isdigit() and h.isdigit() else None
    print(i,wh,'PORTRAIT' if port else 'landscape',r['duration'],r['title'][:70])
    if port:
        d=float(o[1]) if len(o)>1 else 4
        subprocess.run(['ffmpeg','-y','-v','error','-i',f,'-vf',f'fps={6/max(d,1):.3f},scale=180:-2,tile=6x1','-frames:v','1',f'{tag}-{i}.jpg'])
