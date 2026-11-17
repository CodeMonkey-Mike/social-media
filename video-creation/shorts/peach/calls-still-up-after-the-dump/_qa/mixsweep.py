import json, subprocess, numpy as np, sys
Q='video-creation/shorts/peach/calls-still-up-after-the-dump/_qa'
SP='video-creation/shorts/peach/render-assets/calls-still-up-after-the-dump.mp4'
SFX='video-creation/assets/sfx/'
SR=48000
def load(p):
    a=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(a,np.float32).reshape(-1,2).copy()
base=load(SP)
cache={}
BASE=[  # (t, file, vol, dur)
 (0.033,'transition_rapid_whoosh.mp3',.12,1.0),(0.77,'Impacts/card-impact-layered.wav',.14,.9),(3.85,'DING-093.wav',.10,.45),
 (11.335,'transition_rapid_whoosh-tight.wav',.12,.42),(15.77,'ding/sudden-shock-tight.wav',.10,.40),(19.155,'transition_rapid_whoosh.mp3',.14,1.0),
 (22.72,'Cash Register-ching.wav',.12,.77),(24.435,'transition_rapid_whoosh-tight.wav',.12,.42),(27.675,'transition_rapid_whoosh-tight.wav',.12,.42),
 (33.15,'DING-093.wav',.12,.45),(35.145,'Riser Sound Effect-2s.wav',.40,2.14),(37.13,'Boom - Big Reveal-short.wav',.18,1.05),(37.94,'Cash Register-ching.wav',.12,.77)]
def mix(cues,out):
    m=base.copy()
    for t,f,v,d in cues:
        if f not in cache: cache[f]=load(SFX+f)
        s=cache[f][:int(d*SR)]; i=int(round(t*30))*SR//30
        n=min(len(s),len(m)-i); m[i:i+n]+=v*s[:n]
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-c:a','aac','-b:a','320k',out],input=m.astype(np.float32).tobytes())
def var(changes):
    c=[list(x) for x in BASE]
    for idx,new in changes.items():
        c[idx]=new
    return [tuple(x) for x in c if x is not None]
V={
 'V0':{},
 'V1':{4:(15.77,'ding/sudden-shock-tight.wav',.05,.40),8:(27.675,'transition_rapid_whoosh-tight.wav',.06,.42),9:(33.15,'DING-093.wav',.06,.45)},
 'V2':{4:(15.77,'ding/sudden-shock-tight.wav',.10,.25),8:(27.60,'transition_rapid_whoosh-tight.wav',.12,.30),9:(33.69,'DING-093.wav',.12,.30)},
 'V3':{4:None,8:None,9:None},
}
jobs=[]
for k,ch in V.items():
    out=f'{Q}/mix-{k}.m4a'; mix(var(ch),out)
    for name,c in (('still',15.77),('unaff',27.68),('arrow',33.15)):
        for o,(a,b) in enumerate([(-1.5,2.5),(-2.5,1.5),(-1.0,3.0),(-2.0,2.0)]):
            jobs.append(dict(id=f'{k}-{name}-w{o}',audio=out,model='medium.en',clip=f'{c+a:.2f},{min(39.2,c+b):.2f}'))
    print('mixed',k)
for name,c in (('still',15.77),('unaff',27.68),('arrow',33.15)):
    for o,(a,b) in enumerate([(-1.5,2.5),(-2.5,1.5),(-1.0,3.0),(-2.0,2.0)]):
        jobs.append(dict(id=f'C-{name}-w{o}',audio=f'{Q}/control.m4a',model='medium.en',clip=f'{c+a:.2f},{min(39.2,c+b):.2f}'))
json.dump(jobs,open(f'{Q}/jobs-sweep.json','w'))
print(len(jobs))
