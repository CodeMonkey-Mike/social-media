import json, subprocess, numpy as np
w=[x for s in json.load(open('whisper-words.json'))['segments'] for x in s['words']]
p=subprocess.run(['ffmpeg','-v','error','-i','../render-assets/spawn-my-own-members-hate-it.mp4','-ac','1','-ar','16000','-f','s16le','-'],capture_output=True)
a=np.frombuffer(p.stdout,np.int16).astype(float)/32768
def db(t0,t1):
    s=a[int(t0*16000):int(t1*16000)]
    if len(s)==0: return -99
    # 20ms frames
    n=len(s)//320
    f=s[:n*320].reshape(n,320)
    r=20*np.log10(np.sqrt((f**2).mean(1))+1e-9)
    return r
for i in range(len(w)):
    x=w[i]; dur=x['end']-x['start']
    nxt=w[i+1]['start'] if i+1<len(w) else None
    if dur>0.9: 
        r=db(x['start'],x['end']); print(f"LONG word {x['word']!r} {x['start']:.2f}-{x['end']:.2f} voiced%={(r>-45).mean()*100:.0f}")
    if nxt and nxt-x['end']>0.35:
        r=db(x['end'],nxt); print(f"gap after {x['word']!r} {x['end']:.2f}-{nxt:.2f} voiced%={(r>-45).mean()*100:.0f} max={r.max():.1f}")
