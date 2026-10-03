"""Offline SFX mix onto the bare spine (mirrors LivestreamShort: Sequence from=round(t*30), Audio volume=vol,
truncated at dur) + encode-matched control. Usage: mix_sfx.py <out.m4a> [--control] [--override i:vol:dur ...]"""
import re, sys, subprocess, os
HERE=os.path.dirname(os.path.abspath(__file__))
ROOT=os.path.abspath(os.path.join(HERE,'..','..','..','..'))  # video-creation
SP=os.path.join(ROOT,'shorts','spon','render-assets','zombies-pushed-btc-back-above-50-week.mp4')
RA=os.path.join(ROOT,'shorts','spon','render-assets')
C=open(os.path.join(ROOT,'remotion','src','constants-spon-zombies-pushed-btc-back-above-50-week.ts'),encoding='utf-8').read()
body=C.split('export const SFX_ZB4')[1]
cues=[(float(t),f,float(v),float(d)) for t,f,v,d in re.findall(r"\{ t:\s*([\d.]+), src: staticFile\('([^']+)'\), vol: ([\d.]+), dur: ([\d.]+) \}",body)]
out=sys.argv[1]; control='--control' in sys.argv
for o in [a for a in sys.argv[2:] if ':' in a]:
    p=o.split(':'); i=int(p[0]); t,f,_,_=cues[i]; cues[i]=(float(p[3]) if len(p)>3 else t,f,float(p[1]),float(p[2]))
cues=[c for c in cues if c[2]>0]
if control: cues=[]
args=['ffmpeg','-v','error','-y','-i',SP]
fil=[]; labs=['[0:a]aresample=48000[a0]']
for k,(t,f,v,d) in enumerate(cues):
    args+=['-i',os.path.join(RA,f)]
    st=round(t*30)/30; du=round(d*30)/30
    fil.append(f"[{k+1}:a]aresample=48000,atrim=0:{du},volume={v},adelay={int(st*1000)}:all=1[s{k}]")
mix='[a0]'+''.join(f'[s{k}]' for k in range(len(cues)))
if cues:
    fil.append(f"{mix}amix=inputs={len(cues)+1}:normalize=0:duration=first[m]")
    fc=';'.join(labs+fil); mp='[m]'
else:
    fc=labs[0]; mp='[a0]'
args+=['-filter_complex',fc,'-map',mp,'-ac','2','-c:a','aac','-b:a','192k','-ar','48000',out]
subprocess.run(args,check=True); print('wrote',out,len(cues),'cues')
