import re, subprocess, json, sys
C='../../../remotion/src/constants-spon-september-114x-in-eight-days.ts'
src=open(C,encoding='utf-8').read()
body=src.split('export const SFX_S114')[1]
ev=[]
for m in re.finditer(r"\{\s*t:\s*([\d.]+),\s*src:\s*staticFile\('([^']+)'\),\s*vol:\s*([\d.]+),\s*dur:\s*([\d.]+)",body):
    ev.append((float(m[1]),m[2],float(m[3]),float(m[4])))
SP='../render-assets/september-114x-in-eight-days.mp4'
ins=['-i',SP]; f=[]
for i,(t,s,v,d) in enumerate(ev):
    ins+=['-i','../render-assets/'+s]
    ms=int(round(t*1000))
    f.append(f"[{i+1}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{i}]")
f.append("[0:a]aresample=48000[b]")
f.append("[b]"+"".join(f"[s{i}]" for i in range(len(ev)))+f"amix=inputs={len(ev)+1}:normalize=0:duration=first[o]")
subprocess.run(['ffmpeg','-v','error','-y']+ins+['-filter_complex',';'.join(f),'-map','[o]','-c:a','aac','-b:a','192k','-ar','48000','_qa/mix.m4a'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',SP,'-vn','-c:a','aac','-b:a','192k','-ar','48000','_qa/control.m4a'],check=True)
jobs=[]
for i,(t,s,v,d) in enumerate(ev):
    for k,(a,b) in enumerate([(-1.5,2.5),(-2.5,1.8),(-0.8,3.2)]):
        lo=max(0,t+a); hi=min(57.3,t+b)
        for tag in ['mix','control']:
            jobs.append({'id':f'c{i}-w{k}-{tag}','audio':f'_qa/{tag}.m4a','model':'medium.en','clip':f'{lo:.2f},{hi:.2f}'})
json.dump(jobs,open('_qa/jobs_sfx.json','w'),indent=0)
print(len(ev),'events',len(jobs),'jobs')
