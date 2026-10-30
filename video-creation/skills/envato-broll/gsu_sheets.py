import json,subprocess,urllib.request,os,sys
os.makedirs('prev',exist_ok=True);os.makedirs('sheets',exist_ok=True)
def run(a): subprocess.run(a,capture_output=True)
for i in range(1,13):
  rows=[]
  for n,c in enumerate(json.load(open(f'br{i}.json'))):
    k=f'br{i}_{n}';p=f'prev/{k}.mp4'
    if not os.path.exists(p) or os.path.getsize(p)<1000:
      req=urllib.request.Request(c['previewVideo'],headers={'User-Agent':'Mozilla/5.0'})
      open(p,'wb').write(urllib.request.urlopen(req,timeout=60).read())
    d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p],capture_output=True,text=True).stdout)
    fr=[]
    for f in (0.1,0.5,0.9):
      o=f'prev/{k}_{f}.png';run(['ffmpeg','-v','error','-y','-ss',str(d*f),'-i',p,'-frames:v','1','-vf',f"scale=320:180,drawtext=text='{k}':fontcolor=yellow:fontsize=20:x=4:y=4",o]);fr.append(o)
    r=f'prev/{k}_row.png';run(['ffmpeg','-v','error','-y']+sum([['-i',x] for x in fr],[])+['-filter_complex','hstack=3',r]);rows.append(r)
  run(['ffmpeg','-v','error','-y']+sum([['-i',x] for x in rows],[])+['-filter_complex',f'vstack={len(rows)}',f'sheets/br{i}.png'])
  print(i,len(rows))
