import subprocess, numpy as np
src='../../render-assets/spawn-doubled-for-the-haters.mp4'
W,H=108,192
# low-res 10fps gray for cut detection
p=subprocess.run(['ffmpeg','-v','error','-i',src,'-vf','fps=10,scale=108:192,format=gray','-f','rawvideo','-'],capture_output=True)
a=np.frombuffer(p.stdout,np.uint8).reshape(-1,H,W).astype(float)
top=a[:,:84,:]
d=np.abs(np.diff(top,axis=0)).mean(axis=(1,2))
for i,v in enumerate(d):
    if v>6: print(f'cut ~{(i+1)/10:.1f}s diff={v:.1f}')
# seam: full res rows on several frames
for t in [2,8,15,22,28,34,40,44]:
    q=subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',src,'-frames:v','1','-vf','format=gray','-f','rawvideo','-'],capture_output=True)
    f=np.frombuffer(q.stdout,np.uint8).reshape(1920,1080).astype(float)
    rm=f.mean(axis=1)
    g=np.abs(np.diff(rm))
    lo,hi=600,1300
    idx=lo+np.argmax(g[lo:hi])
    print('t',t,'seam step at',idx,idx+1,'mag',round(g[idx],1))
