import subprocess, json, sys
A="C:/Users/mnede/Documents/Claude/social-media/video-creation/assets/sfx/"
SP="C:/Users/mnede/Documents/Claude/social-media/video-creation/shorts/peach/render-assets/pengu-flips-pepe-impact.mp4"
base=[(0.00,'transition_rapid_whoosh-tight.wav',.5,.42),(6.35,'DING-093.wav',.25,.93),(7.67,'Impacts/Kick_Impact_01-short.wav',.4,.55),
      (9.25,'kinetic-text/fast-swoosh.wav',.22,.57),(10.92,'Cash Register-ching.wav',.35,.77)]
V={
 'A':[(3.26,'Impacts/Impact_Hit_01-2-tight.wav',.32,.30)],
 'B':[(3.16,'Impacts/Impact_Hit_01-2-short.wav',.32,.40)],
 'C':[(3.30,'Impacts/Impact_Hit_01-2-short.wav',.18,.55)],
 'D':[(3.12,'Impacts/Impact_Hit_01-2-tight.wav',.32,.30)],
}
for k,hook in V.items():
    ev=base+hook
    ins=['-i',SP]; f=[]
    for i,(t,fn,v,d) in enumerate(ev):
        ins+=['-i',A+fn]; ms=int(round(t*1000))
        f.append(f"[{i+1}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{i}]")
    f.append("[0:a]aresample=48000[b]"); f.append("[b]"+''.join(f"[s{i}]" for i in range(len(ev)))+f"amix=inputs={len(ev)+1}:normalize=0:duration=first[o]")
    subprocess.run(['ffmpeg','-v','error','-y',*ins,'-filter_complex',';'.join(f),'-map','[o]','-c:a','aac','-b:a','320k',f'sfx/mix-{k}.m4a'],check=True)
print('ok')
