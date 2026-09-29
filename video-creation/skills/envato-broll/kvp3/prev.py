import json,subprocess,sys,os,urllib.request
picks=[("ice-cracking-slow-motion.json",0,"a"),("ice-cracking-slow-motion.json",1,"b"),("ice-cracking-slow-motion.json",5,"c"),("ice-cracking-slow-motion.json",8,"d"),("q1.json",3,"e"),("cracks-forming-surface-dark.json",7,"f"),("cracks-forming-surface-dark.json",0,"g")]
for f,i,tag in picks:
    r=json.load(open(f,encoding='utf-8'))[i]
    mp4=f"p_{tag}.mp4"
    if not os.path.exists(mp4): urllib.request.urlretrieve(r['previewVideo'],mp4)
    D=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',mp4]).decode().strip())
    wh=subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',mp4]).decode().strip()
    # tile 4 frames
    ts=[D*x for x in (0.1,0.35,0.6,0.85)]
    ins=[];
    for k,t in enumerate(ts):
        subprocess.run(['ffmpeg','-y','-v','error','-ss',f'{t:.2f}','-i',mp4,'-frames:v','1','-vf','scale=480:-2',f'f_{tag}{k}.png'])
    subprocess.run(['ffmpeg','-y','-v','error','-i',f'f_{tag}0.png','-i',f'f_{tag}1.png','-i',f'f_{tag}2.png','-i',f'f_{tag}3.png','-filter_complex','[0][1][2][3]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0',f'sheet_{tag}.png'])
    y=subprocess.run(['ffmpeg','-v','info','-i',mp4,'-vf','signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-','-an','-f','null','-'],capture_output=True,text=True).stdout
    vals=[float(l.split('=')[1]) for l in y.splitlines() if 'YAVG' in l]
    print(tag,D,wh,f"luma mean {sum(vals)/len(vals):.1f}",'|',r['title'][:70],'|',r['url'])
