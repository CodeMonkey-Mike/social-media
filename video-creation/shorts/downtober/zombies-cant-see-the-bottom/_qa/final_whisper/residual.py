import subprocess, numpy as np
SR=48000
def load(p):
    r=subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-i",p,"-vn","-ac","1","-ar",str(SR),"-f","f32le","-"],capture_output=True)
    return np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64)
R=load('../../../remotion/out/downtober/1-zombies-cant-see-the-bottom.mp4')
S=load('../render-assets/zombies-cant-see-the-bottom.mp4')
M=load('_qa/sfx/v3/W6/mix.m4a')   # offline model (W6 = current cover whoosh; others as v1 except closing ding)
n=min(len(R),len(S),len(M))
# find best lag of R vs S
seg=slice(SR*3,SR*8)
best=max(range(-2000,2001,1), key=lambda L: np.dot(R[SR*3+L:SR*8+L], S[seg]))
print('lag R vs S (samples):', best)
R2=R[best:best+n-abs(best)] if best>=0 else np.concatenate([np.zeros(-best),R])[:n]
m=min(len(R2),len(S))
# gain match on a no-SFX region 5.0-8.5 s
a=R2[int(5*SR):int(8.5*SR)]; b=S[int(5*SR):int(8.5*SR)]
g=np.dot(a,b)/np.dot(b,b); print('gain R/S on clean region: %.4f'%g)
res=R2[:m]-g*S[:m]
resM=M[:m]-S[:m]
def db(x): return 20*np.log10(np.sqrt((x**2).mean())+1e-12)
print(' t      render_SFX_dB  offline_SFX_dB  VO_dB')
for t in np.arange(20.9,26.5,0.1):
    i=slice(int(t*SR),int((t+0.1)*SR))
    print(f'{t:5.1f}  {db(res[i]):8.1f}      {db(resM[i]):8.1f}    {db(S[i]):6.1f}')
