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
base=[x for x in sfx if x[0]!='5.115']
w=[x for x in sfx if x[0]=='5.115'][0]
vars={'v06':[(w[0],w[1],'0.06',w[3])],'v03':[(w[0],w[1],'0.03',w[3])],'drop':[],
      'late':[('5.275',w[1],'0.12',w[3])]}  # crest 5.44 between "it" and "has"? (it 5.28-5.44)
jobs=[]
for k,v in vars.items():
    mix(f'mix_{k}.m4a',base+v)
    for a,b in ((3.0,6.6),(3.5,7.1),(4.2,7.8)):
        jobs.append({"id":f"{k}@{a}","audio":f"mix_{k}.m4a","model":"medium.en","clip":f"{a},{b}"})
for a,b in ((3.0,6.6),(3.5,7.1),(4.2,7.8)):
    jobs.append({"id":f"control@{a}","audio":"control.m4a","model":"medium.en","clip":f"{a},{b}"})
    jobs.append({"id":f"all@{a}","audio":"mix_all.m4a","model":"medium.en","clip":f"{a},{b}"})
json.dump(jobs,open('jobs_sfx2.json','w'),indent=1); print(len(jobs))
