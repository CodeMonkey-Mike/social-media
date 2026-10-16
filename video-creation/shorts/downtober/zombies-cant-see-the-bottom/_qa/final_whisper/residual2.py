import subprocess, numpy as np
SR=48000
def load(p):
    r=subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-i",p,"-vn","-ac","1","-ar",str(SR),"-f","f32le","-"],capture_output=True)
    return np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64)
R=load('../../../remotion/out/downtober/1-zombies-cant-see-the-bottom.mp4')
S=load('../render-assets/zombies-cant-see-the-bottom.mp4')
M=load('_qa/sfx/v3/W6/mix.m4a')
def lag_of(X,Y,lo=4*SR,hi=9*SR):   # lag L such that X[t+L] ~ Y[t]
    x=X[lo-4800:hi+4800]; y=Y[lo:hi]
    c=np.correlate(x,y,mode='valid')
    return int(np.argmax(c))-4800
for name,X in [('render',R),('offline',M)]:
    L=lag_of(X,S)
    Xa=X[L:] if L>=0 else np.concatenate([np.zeros(-L),X])
    m=min(len(Xa),len(S))
    a=Xa[5*SR:int(8.5*SR)]; b=S[5*SR:int(8.5*SR)]
    g=np.dot(a,b)/np.dot(b,b)
    res=Xa[:m]-g*S[:m]
    globals()[name+'_res']=res
    print(f'{name}: lag {L} samples ({L/SR*1000:.2f} ms), gain {g:.4f}')
def db(x): return 20*np.log10(np.sqrt((x**2).mean())+1e-12)
print(' t     render_SFX  offline_SFX   VO')
for t in list(np.arange(0.0,1.2,0.1))+list(np.arange(22.6,24.2,0.1))+list(np.arange(25.1,26.3,0.1)):
    i=slice(int(t*SR),int((t+0.1)*SR))
    print(f'{t:5.1f}  {db(render_res[i]):8.1f}   {db(offline_res[i]):8.1f}   {db(S[i]):6.1f}')
