import re,subprocess,sys
RA='../../render-assets/'
src=open('../../../../remotion/src/constants-uptober-spawn-doubled-for-the-haters.ts',encoding='utf-8').read()
sfx=re.findall(r"\{ t:\s*([\d.]+), src: staticFile\('([^']+)'\), vol: ([\d.]+), dur: ([\d.]+) \}",src)
def mix(out, items):
    args=['ffmpeg','-v','error','-y','-i',RA+'spawn-doubled-for-the-haters.mp4']
    for t,f,v,d in items: args+=['-i',RA+f]
    fc=[]; labs=['[0:a]']
    for i,(t,f,v,d) in enumerate(items,1):
        ms=int(round(float(t)*1000))
        fc.append(f"[{i}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{i}]"); labs.append(f'[s{i}]')
    fc.append(''.join(labs)+f"amix=inputs={len(labs)}:normalize=0:duration=first[o]")
    args+=['-filter_complex',';'.join(fc),'-map','[o]','-ar','48000','-c:a','aac','-b:a','192k',out]
    subprocess.run(args,check=True)
mix('mix_noding15.m4a',[s for s in sfx if s[0]!='15.70'])
mix('mix_ding1590.m4a',[(('15.90',)+s[1:]) if s[0]=='15.70' else s for s in sfx])
print('ok')
