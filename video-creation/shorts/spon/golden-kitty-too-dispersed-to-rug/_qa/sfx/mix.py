import re, subprocess, sys, json
RA='C:/Users/mnede/Documents/Claude/social-media/video-creation/shorts/spon/render-assets/'
CONST='C:/Users/mnede/Documents/Claude/social-media/video-creation/remotion/src/constants-spon-golden-kitty-too-dispersed-to-rug.ts'
def cues(src=None):
    s=open(src or CONST,encoding='utf-8').read()
    body=s[s.index('export const SFX_GK2'):]
    out=[]
    for line in body.splitlines():
        if line.strip().startswith('//'): continue
        m=re.search(r"t:\s*([\d.]+),\s*src:\s*staticFile\('([^']+)'\),\s*vol:\s*([\d.]+),\s*dur:\s*([\d.]+)",line)
        if m: out.append(dict(t=float(m[1]),src=m[2],vol=float(m[3]),dur=float(m[4])))
    return out
def mix(cs,out):
    args=['ffmpeg','-v','error','-y','-i',RA+'golden-kitty-too-dispersed-to-rug.mp4']
    for c in cs: args+=['-i',RA+c['src']]
    fl=[]
    for i,c in enumerate(cs,1):
        ms=int(round(c['t']*1000))
        fl.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{c['dur']},volume={c['vol']},adelay={ms}|{ms}[s{i}]")
    fl.append("[0:a]aresample=48000,aformat=channel_layouts=stereo[b]")
    fl.append("[b]"+"".join(f"[s{i}]" for i in range(1,len(cs)+1))+f"amix=inputs={len(cs)+1}:normalize=0:duration=first[m]")
    args+=['-filter_complex',";".join(fl),'-map','[m]','-c:a','aac','-b:a','192k','-ar','48000',out]
    subprocess.run(args,check=True)
if __name__=='__main__':
    cs=cues(); json.dump(cs,open('cues.json','w'),indent=1)
    mix(cs,'mix-v1.m4a')
    subprocess.run(['ffmpeg','-v','error','-y','-i',RA+'golden-kitty-too-dispersed-to-rug.mp4','-vn','-c:a','aac','-b:a','192k','-ar','48000','control.m4a'],check=True)
    print(len(cs),'cues')
