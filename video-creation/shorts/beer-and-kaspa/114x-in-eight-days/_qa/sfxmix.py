import re, subprocess, json, sys
import os
Q=os.path.abspath('114x-in-eight-days/_qa').replace(os.sep,'/')
SP='render-assets/114x-in-eight-days.mp4'
CONST='../../remotion/src/constants-beer-and-kaspa-114x-in-eight-days.ts'
def events(src=None):
    src=src or open(CONST,encoding='utf-8').read()
    return [[float(t),f,float(v),float(d)] for t,f,v,d in re.findall(r"\{ t:\s*([\d.]+), src: staticFile\('([^']+)'\), vol: ([\d.]+), dur: ([\d.]+) \}",src)]
def mix(ev,out):
    inputs=['-i',SP]; filt=[]
    for k,(t,f,v,d) in enumerate(ev):
        inputs+=['-i','render-assets/'+f]; ms=int(round(t*1000))
        filt.append(f"[{k+1}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{k}]")
    fc=';'.join(['[0:a]aresample=48000[a0]']+filt+['[a0]'+''.join(f'[s{k}]' for k in range(len(ev)))+f'amix=inputs={len(ev)+1}:normalize=0:duration=first[m]'])
    subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex',fc,'-map','[m]','-ac','2','-c:a','aac','-b:a','192k',out],check=True)
def ctrl(out):
    subprocess.run(['ffmpeg','-v','error','-y','-i',SP,'-vn','-ar','48000','-ac','2','-c:a','aac','-b:a','192k',out],check=True)
if __name__=='__main__':
    ev=events(); print(len(ev),'events')
    ctrl(Q+'/mix_ctrl.m4a'); mix(ev,Q+'/mix_sfx.m4a')
    CREST={'transition_rapid_whoosh':0.165,'card-impact-layered':0.03,'Impact_Hit_01-2-short':0.135,'DING-093':0.15,'sudden-shock-tight':0.29,'DSGNImpt':0.03}
    jobs=[]
    for i,(t,f,v,d) in enumerate(ev):
        c=t+[x for k,x in CREST.items() if k in f][0]
        for j,(a,b) in enumerate([(-2.0,2.0),(-1.4,2.6),(-2.6,1.4)]):
            s=max(0,c+a); e=min(63.7,c+b)
            for tag,au in (('c',Q+'/mix_ctrl.m4a'),('m',Q+'/mix_sfx.m4a')):
                jobs.append({'id':f'{i}-{j}-{tag}','audio':au,'model':'medium.en','clip':f'{s:.2f},{e:.2f}'})
    json.dump(jobs,open(Q+'/jobs_sfx.json','w'))
    print(len(jobs),'jobs')
