"""Offline SFX-over-spine mixer + staggered whisper jobs (zero renders).
Parses SFX_SPON1 from the constants file, frame-quantizes t/dur like Remotion (fps 30), mixes onto the bare
spine audio, and pushes BOTH the mix and the bare control through the same 48 kHz AAC chain."""
import re, subprocess, json, sys, numpy as np, os
HERE=os.path.dirname(os.path.abspath(__file__))
ROOT=os.path.abspath(os.path.join(HERE,'..','..','..','..'))
CONST=os.path.join(ROOT,'remotion','src','constants-spon-spawn-my-own-members-hate-it.ts')
RA=os.path.join(ROOT,'shorts','spon','render-assets')
SPINE=os.path.join(RA,'spawn-my-own-members-hate-it.mp4')
SR=48000; FPS=30
def dec(p):
    r=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True)
    return np.frombuffer(r.stdout,np.float32).reshape(-1,2).copy()
def parse(overrides=None):
    s=open(CONST,encoding='utf-8').read()
    body=s[s.index('export const SFX_SPON1'):]
    body=body[:body.index('];')]
    ev=[]
    for m in re.finditer(r"t:\s*([\d.]+),\s*src:\s*staticFile\('([^']+)'\),\s*vol:\s*([\d.]+),\s*dur:\s*([\d.]+)",body):
        ev.append(dict(t=float(m[1]),src=m[2],vol=float(m[3]),dur=float(m[4])))
    return ev
def mix(ev,out):
    base=dec(SPINE)
    cache={}
    for e in ev:
        if e['src'] not in cache: cache[e['src']]=dec(os.path.join(RA,e['src']))
        a=cache[e['src']]
        f0=round(e['t']*FPS); n=max(1,round(e['dur']*FPS))
        s0=int(f0/FPS*SR); L=min(len(a),int(n/FPS*SR))
        seg=a[:L]*e['vol']
        end=min(len(base),s0+L); base[s0:end]+=seg[:end-s0]
    raw=out+'.f32'
    base.astype(np.float32).tofile(raw)
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i',raw,'-c:a','aac','-b:a','192k',out],check=True)
    os.remove(raw)
if __name__=='__main__':
    tag=sys.argv[1]
    ev=parse()
    if len(sys.argv)>2:  # overrides json: {"idx": {"vol":..,"dur":..,"t":..}}
        for k,v in json.loads(sys.argv[2]).items(): ev[int(k)].update(v)
    mix(ev,os.path.join(HERE,f'mix_{tag}.m4a'))
    print(len(ev),'events mixed ->',f'mix_{tag}.m4a')
