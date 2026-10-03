import re, subprocess, json
C='../../../remotion/src/constants-spon-september-114x-in-eight-days.ts'
body=open(C,encoding='utf-8').read().split('export const SFX_S114')[1]
base=[[float(m[1]),m[2],float(m[3]),float(m[4])] for m in re.finditer(r"\{\s*t:\s*([\d.]+),\s*src:\s*staticFile\('([^']+)'\),\s*vol:\s*([\d.]+),\s*dur:\s*([\d.]+)",body)]
SP='../render-assets/september-114x-in-eight-days.mp4'
def mix(ev,out):
    ins=['-i',SP]; f=[]
    for i,(t,s,v,d) in enumerate(ev):
        ins+=['-i','../render-assets/'+s]; ms=int(round(t*1000))
        f.append(f"[{i+1}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{i}]")
    f.append("[0:a]aresample=48000[b]")
    f.append("[b]"+"".join(f"[s{i}]" for i in range(len(ev)))+f"amix=inputs={len(ev)+1}:normalize=0:duration=first[o]")
    subprocess.run(['ffmpeg','-v','error','-y']+ins+['-filter_complex',';'.join(f),'-map','[o]','-c:a','aac','-b:a','192k','-ar','48000',out],check=True)
variants={
 'c5A':(5,dict(vol=0.08)),'c5B':(5,dict(t=21.95)),'c5C':(5,dict(dur=0.45)),
 'c6A':(6,dict(vol=0.10)),'c6B':(6,dict(t=24.245,dur=0.45)),
 'c10A':(10,dict(t=42.115)),'c10B':(10,dict(vol=0.10)),
}
wins={5:[(21.0,24.0),(21.5,24.4),(20.6,23.9),(21.8,25.2)],6:[(23.3,26.4),(24.0,27.0),(22.5,25.9),(24.2,26.2)],10:[(41.2,44.2),(41.9,45.0),(40.6,43.5),(42.1,44.1)]}
jobs=[]
for cue,ws in wins.items():
    for k,(a,b) in enumerate(ws):
        jobs.append({'id':f'ctl-{cue}-{k}','audio':'_qa/control.m4a','model':'medium.en','clip':f'{a},{b}'})
        jobs.append({'id':f'orig-{cue}-{k}','audio':'_qa/mix.m4a','model':'medium.en','clip':f'{a},{b}'})
for name,(cue,ch) in variants.items():
    ev=[list(e) for e in base]
    if 't' in ch: ev[cue][0]=ch['t']
    if 'vol' in ch: ev[cue][2]=ch['vol']
    if 'dur' in ch: ev[cue][3]=ch['dur']
    mix(ev,f'_qa/mix_{name}.m4a')
    for k,(a,b) in enumerate(wins[cue]):
        jobs.append({'id':f'{name}-{k}','audio':f'_qa/mix_{name}.m4a','model':'medium.en','clip':f'{a},{b}'})
json.dump(jobs,open('_qa/jobs_sweep.json','w'))
print(len(jobs))
