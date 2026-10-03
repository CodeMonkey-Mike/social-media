import subprocess, json
RA='../../../render-assets/'; spine=RA+'pippin-went-dead-then-89x.mp4'
W='sfx/transition_rapid_whoosh.mp3'; I='sfx/Impacts/card-impact-layered.wav'
V={'full':[(0.033,W,.12,1.0),(1.35,I,.14,1.5)],
   'nowhoosh':[(1.35,I,.14,1.5)],
   'noimpact':[(0.033,W,.12,1.0)],
   'imp08':[(0.033,W,.12,1.0),(1.35,I,.08,1.5)],
   'impshort':[(0.033,W,.12,1.0),(1.35,I,.14,0.5)],
   'whoosh06':[(0.033,W,.06,1.0),(1.35,I,.14,1.5)]}
jobs=[]
for name,ev in V.items():
    ins=['-i',spine]; fl=[]
    for i,(t,f,v,d) in enumerate(ev):
        ins+=['-i',RA+f]; ms=int(round(t*1000))
        fl.append(f"[{i+1}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{i}]")
    fc='[0:a]aresample=48000[b];'+';'.join(fl)+';[b]'+''.join(f'[s{i}]' for i in range(len(ev)))+f'amix=inputs={len(ev)+1}:normalize=0:duration=first[o]'
    subprocess.run(['ffmpeg','-v','error','-y',*ins,'-filter_complex',fc,'-map','[o]','-t','8','-c:a','aac','-b:a','192k',f'v_{name}.m4a'],check=True)
for name in ['control']+list(V):
    for w in ('0.00,4.00','0.30,4.30','0.80,4.80','1.00,5.00'):
        jobs.append({'id':f'{name}@{w}','audio':('control.m4a' if name=='control' else f'v_{name}.m4a'),'model':'medium.en','clip':w,'language':'en'})
json.dump(jobs,open('jobs2.json','w'))
