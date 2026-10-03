import subprocess, json
RA='../../../render-assets/'; spine=RA+'pippin-went-dead-then-89x.mp4'
W='sfx/transition_rapid_whoosh.mp3'; I='sfx/Impacts/card-impact-layered.wav'
V={'wtight':[(0.033,W,.12,1.0),(1.215,'sfx/transition_rapid_whoosh-tight.wav',.10,.42)],
   'imp181':[(0.033,W,.12,1.0),(1.81,I,.14,1.5)],
   'kick':[(0.033,W,.12,1.0),(1.195,'sfx/Impacts/Kick_Impact_01-short.wav',.12,.30)],
   'imp181lo':[(0.033,W,.12,1.0),(1.81,I,.10,1.0)]}
jobs=[]
for name,ev in V.items():
    ins=['-i',spine]; fl=[]
    for i,(t,f,v,d) in enumerate(ev):
        ins+=['-i',RA+f]; ms=int(round(t*1000))
        fl.append(f"[{i+1}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{i}]")
    fc='[0:a]aresample=48000[b];'+';'.join(fl)+';[b]'+''.join(f'[s{i}]' for i in range(len(ev)))+f'amix=inputs={len(ev)+1}:normalize=0:duration=first[o]'
    subprocess.run(['ffmpeg','-v','error','-y',*ins,'-filter_complex',fc,'-map','[o]','-t','8','-c:a','aac','-b:a','192k',f'v_{name}.m4a'],check=True)
for name in list(V):
    for w in ('0.00,4.00','0.30,4.30','0.80,4.80','1.00,5.00'):
        jobs.append({'id':f'{name}@{w}','audio':('control.m4a' if name=='control' else f'v_{name}.m4a'),'model':'medium.en','clip':w,'language':'en'})
json.dump(jobs,open('jobs3.json','w'))
