import re, subprocess, sys, json
RA='C:/Users/mnede/Documents/Claude/social-media/video-creation/shorts/kcc20-live/render-assets/'
src=open('C:/Users/mnede/Documents/Claude/social-media/video-creation/remotion/src/constants-kcc20-live-kcc20-final-kaspa-tokens-on-l1.ts',encoding='utf-8').read()
cues=[(float(t),f,float(v),float(d)) for t,f,v,d in re.findall(r"\{ t:\s*([\d.]+),\s*src: staticFile\('([^']+)'\), vol: ([\d.]+), dur: ([\d.]+)",src)]
def mix(out, cues, overrides={}):
    ins=['-i',RA+'kcc20-final-kaspa-tokens-on-l1.mp4']; fl=[]; labs=['[0:a]aresample=48000[a0]']
    for i,(t,f,v,d) in enumerate(cues):
        t,v,d=overrides.get(i,(t,v,d))
        fr0=round(t*30); fr=max(1,round(d*30))
        ins+=['-i',RA+f]
        labs.append(f'[{i+1}:a]aresample=48000,atrim=0:{fr/30:.4f},volume={v},adelay={int(fr0/30*1000)}|{int(fr0/30*1000)}[s{i}]')
    n=len(cues)
    labs.append('[a0]'+''.join(f'[s{i}]' for i in range(n))+f'amix=inputs={n+1}:normalize=0:duration=first[m]')
    subprocess.run(['ffmpeg','-v','error','-y',*ins,'-filter_complex',';'.join(labs),'-map','[m]','-c:a','aac','-b:a','192k','-ar','48000',out],check=True)
if __name__=='__main__':
    print(len(cues),'cues'); 
    mix('mix-all.m4a',cues)
    subprocess.run(['ffmpeg','-v','error','-y','-i',RA+'kcc20-final-kaspa-tokens-on-l1.mp4','-vn','-c:a','aac','-b:a','192k','-ar','48000','control.m4a'],check=True)
    json.dump(cues,open('cues.json','w'))
