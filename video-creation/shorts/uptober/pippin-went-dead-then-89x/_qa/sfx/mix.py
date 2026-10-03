import re, subprocess, sys, json
RA='../../../render-assets/'
src=open('../../../../../remotion/src/constants-uptober-pippin-went-dead-then-89x.ts',encoding='utf-8').read()
sec=src[src.index('export const SFX_PIP2'):]
ev=[(float(t),f,float(v),float(d)) for t,f,v,d in re.findall(r"t:\s*([\d.]+), src: staticFile\('([^']+)'\), vol: ([\d.]+), dur: ([\d.]+)",sec)]
print(len(ev),'events')
spine=RA+'pippin-went-dead-then-89x.mp4'
# control: spine audio through 48k AAC
subprocess.run(['ffmpeg','-v','error','-y','-i',spine,'-vn','-ar','48000','-c:a','aac','-b:a','192k','control.m4a'],check=True)
ins=['-i',spine]; fl=[]
for i,(t,f,v,d) in enumerate(ev):
    ins+=['-i',RA+f]
    ms=int(round(t*1000))
    fl.append(f"[{i+1}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{i}]")
fl.append('[0:a]aresample=48000'+''.join(f'[s{i}]' for i in range(len(ev))).join(['[b];[b]','']) if False else '')
mixin='[0:a]aresample=48000[b];'+';'.join(fl[:-1])+';[b]'+''.join(f'[s{i}]' for i in range(len(ev)))+f'amix=inputs={len(ev)+1}:normalize=0:duration=first[o]'
subprocess.run(['ffmpeg','-v','error','-y',*ins,'-filter_complex',mixin,'-map','[o]','-c:a','aac','-b:a','192k','mix.m4a'],check=True)
jobs=[]
for i,(t,f,v,d) in enumerate(ev):
    for off in (-1.2,-0.6):
        a=max(0,t+off); b=min(35.8,a+4.0)
        for name in ('control','mix'):
            jobs.append({'id':f'e{i}@{t}{off:+}-{name}','audio':f'{name}.m4a','model':'medium.en','clip':f'{a:.2f},{b:.2f}','language':'en'})
json.dump(jobs,open('jobs.json','w'),indent=1); print(len(jobs),'jobs')
