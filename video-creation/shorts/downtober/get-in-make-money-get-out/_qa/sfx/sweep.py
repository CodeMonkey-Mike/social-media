import json, subprocess, os
HERE=os.path.dirname(os.path.abspath(__file__))
PUB=os.path.abspath(os.path.join(HERE,'..','..','..','render-assets'))
SPINE=os.path.join(PUB,'get-in-make-money-get-out.mp4')
WT='sfx/transition_rapid_whoosh-tight.wav'; DING='sfx/DING-093.wav'; CH='sfx/Cash Register-ching.wav'
groups={
 'A': (8.385, [('A0',[dict(t=8.385,f=WT,vol=0.12,dur=0.42)]), ('A1',[dict(t=8.385,f=WT,vol=0.06,dur=0.42)]),
               ('A2',[dict(t=8.385,f=WT,vol=0.12,dur=0.25)]), ('A3',[dict(t=8.135,f=WT,vol=0.12,dur=0.30)]),
               ('A4',[dict(t=8.385,f=WT,vol=0.04,dur=0.25)])]),
 'B': (16.50, [('B0',[dict(t=16.50,f=DING,vol=0.12,dur=0.45)]), ('B1',[dict(t=16.50,f=DING,vol=0.06,dur=0.45)]),
               ('B2',[dict(t=16.50,f=DING,vol=0.12,dur=0.25)]), ('B3',[dict(t=16.83,f=DING,vol=0.12,dur=0.30)])]),
 'C': (18.095,[('C0',[dict(t=18.095,f=WT,vol=0.12,dur=0.42)]), ('C1',[dict(t=18.095,f=WT,vol=0.06,dur=0.42)]),
               ('C2',[dict(t=18.035,f=WT,vol=0.12,dur=0.28)]), ('C3',[dict(t=18.095,f=WT,vol=0.12,dur=0.21)])]),
 'D': (20.065,[('D0',[dict(t=20.065,f=CH,vol=0.12,dur=0.70)]), ('D1',[dict(t=20.065,f=CH,vol=0.06,dur=0.70)]),
               ('D2',[dict(t=20.065,f=CH,vol=0.12,dur=0.25)])]),
}
jobs=[]
ctl=os.path.join(HERE,'control.m4a')
for g,(anchor,cands) in groups.items():
    wins=[(max(0,anchor+a),min(27.3,anchor+b)) for a,b in [(-1.6,1.4),(-2.2,1.0),(-1.0,2.0),(-1.3,1.7),(-1.9,1.2)]]
    for k,(s,e) in enumerate(wins):
        jobs.append(dict(id=f"{g}ctl_w{k}",audio=ctl,model='medium.en',clip=f'{s:.2f},{e:.2f}',language='en'))
    for name,cues in cands:
        out=os.path.join(HERE,f'sw-{name}.m4a')
        inputs=['-i',SPINE]; fl=[]
        for i,c in enumerate(cues):
            inputs+=['-i',os.path.join(PUB,c['f'])]; ms=int(round(c['t']*1000))
            fl.append(f"[{i+1}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{c['dur']},volume={c['vol']},adelay={ms}|{ms}[s{i}]")
        fc='[0:a]aresample=48000,aformat=channel_layouts=stereo[b];'+';'.join(fl)+';[b]'+''.join(f'[s{i}]' for i in range(len(cues)))+f'amix=inputs={len(cues)+1}:normalize=0:duration=first[m]'
        subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex',fc,'-map','[m]','-c:a','aac','-ar','48000','-b:a','320k',out],check=True)
        for k,(s,e) in enumerate(wins):
            jobs.append(dict(id=f"{name}_w{k}",audio=out,model='medium.en',clip=f'{s:.2f},{e:.2f}',language='en'))
json.dump(jobs,open(os.path.join(HERE,'jobs-sweep.json'),'w'),indent=0); print(len(jobs),'jobs')
