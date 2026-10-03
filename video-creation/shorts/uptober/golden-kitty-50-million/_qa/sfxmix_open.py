import re,subprocess,json
RA='../../render-assets/'
src=open('../../../../remotion/src/constants-uptober-golden-kitty-50-million.ts',encoding='utf-8').read()
sfx=re.findall(r"\{ t:\s*([\d.]+), src: staticFile\('([^']+)'\), vol: ([\d.]+), dur: ([\d.]+) \}",src)
def mix(out, items):
    args=['ffmpeg','-v','error','-y','-i',RA+'golden-kitty-50-million.mp4']
    for t,f,v,d in items: args+=['-i',RA+f]
    fc=[]; labs=['[0:a]']
    for i,(t,f,v,d) in enumerate(items,1):
        ms=int(round(float(t)*1000))
        fc.append(f"[{i}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{i}]"); labs.append(f'[s{i}]')
    fc.append(''.join(labs)+f"amix=inputs={len(labs)}:normalize=0:duration=first[o]")
    args+=['-filter_complex',';'.join(fc),'-map','[o]','-ar','48000','-c:a','aac','-b:a','192k',out]
    subprocess.run(args,check=True)
W=[x for x in sfx if x[0]=='0.033'][0]; I=[x for x in sfx if x[0]=='0.51'][0]
rest=[x for x in sfx if x[0] not in ('0.033','0.51')]
V={'cur':[W,I],
   'imp07':[W,(I[0],I[1],'0.07',I[3])],
   'imptrim':[W,(I[0],I[1],I[2],'0.12')],
   'nowhoosh':[I],
   'whooshtrim':[(W[0],W[1],W[2],'0.45'),I],
   'noimp':[W],
   'both_trim':[(W[0],W[1],W[2],'0.45'),(I[0],I[1],I[2],'0.12')]}
jobs=[]
WIN=((0,3.5),(0,4.0),(0.2,3.8),(0,3.0),(0.1,4.2))
for k,v in V.items():
    mix(f'op_{k}.m4a',rest+v)
    for a,b in WIN: jobs.append({"id":f"{k}@{a}-{b}","audio":f"op_{k}.m4a","model":"medium.en","clip":f"{a},{b}"})
for a,b in WIN: jobs.append({"id":f"control@{a}-{b}","audio":"control.m4a","model":"medium.en","clip":f"{a},{b}"})
json.dump(jobs,open('jobs_op.json','w'),indent=1); print(len(jobs))
