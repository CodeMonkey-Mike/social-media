"""
Snap-to-silence SILENCE-REMOVAL mode (canonical method, SKILL.md Phase 2b).
Silence < -57 dBFS, audio > -52 dBFS (5 dB hysteresis), 250ms min-silence, 250ms min-audio, NO pad.
Drops every silence >250ms; keeps all audio regions. Overwrites preview.mp4 in place
(reproducible from cut_topics_bulls.py). Algorithm reused verbatim from apply_silence_all.py.
"""
import subprocess, re, sys, io, os, shutil
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

CLIPS = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\bulls-are-sleeping-clips"
SIL_TH, AUD_TH, MIN_SIL, MIN_AUD, WIN = -57.0, -52.0, 0.25, 0.25, 0.02

SLUGS = ["bulls-are-sleeping", "price-vs-technology", "heard-of-kaspa-brah"]

def dur(p):
    try: return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())
    except: return 0.0

def levels_file(f):
    n=int(round(44100*WIN))
    r=subprocess.run(["ffmpeg","-i",f,"-af",
                      f"aresample=44100,asetnsamples=n={n}:p=0,astats=metadata=1:reset=1,ametadata=print",
                      "-f","null","-"], capture_output=True, text=True)
    log=r.stderr
    ts=[float(x) for x in re.findall(r'pts_time:([\d.]+)', log)]
    vs=[(-100.0 if x in ('-inf','nan') else float(x))
        for x in re.findall(r'lavfi\.astats\.Overall\.RMS_level=(-?[\d.]+|-inf|nan)', log)]
    m=min(len(ts),len(vs)); return [(ts[i],vs[i]) for i in range(m)]

def coalesce(regs):
    out=[]
    for typ,s,e in regs:
        if out and out[-1][0]==typ: out[-1]=[typ,out[-1][1],e]
        else: out.append([typ,s,e])
    return out

def audio_regions(lv):
    if not lv: return []
    regs=[]; st='sil'; start=lv[0][0]
    for t,v in lv:
        if st=='sil' and v>AUD_TH: regs.append(['sil',start,t]); st='aud'; start=t
        elif st=='aud' and v<SIL_TH: regs.append(['aud',start,t]); st='sil'; start=t
    regs.append([st,start,lv[-1][0]+WIN])
    for r in regs:
        if r[0]=='sil' and r[2]-r[1]<MIN_SIL: r[0]='aud'
    regs=coalesce(regs)
    for r in regs:
        if r[0]=='aud' and r[2]-r[1]<MIN_AUD: r[0]='sil'
    return [(s,e) for typ,s,e in coalesce(regs) if typ=='aud']

def remove_silence(f):
    lv=levels_file(f); auds=audio_regions(lv)
    if not auds: return None
    sel="+".join(f"between(t,{s:.3f},{e:.3f})" for s,e in auds)
    vf=f"select='{sel}',setpts=N/FRAME_RATE/TB"
    af=f"aselect='{sel}',asetpts=N/SR/TB"
    tmp=f+".tmp.mp4"
    subprocess.run(["ffmpeg","-y","-i",f,"-vf",vf,"-af",af,
                    "-c:v","libx264","-preset","fast","-crf","18","-c:a","aac","-b:a","192k",tmp],
                   check=True, capture_output=True)
    shutil.move(tmp,f)
    return len(auds)

print("Snap-to-silence removal (-57/-52, >250ms gaps):\n")
for slug in SLUGS:
    f=os.path.join(CLIPS,slug,"preview.mp4")
    if not os.path.exists(f): print(f"  {slug:24s} MISSING"); continue
    b=dur(f); n=remove_silence(f); a=dur(f)
    pct = (b-a)/b*100 if b else 0
    print(f"  {slug:24s} {b:6.1f}s -> {a:6.1f}s  (-{b-a:4.1f}s, -{pct:4.1f}%, {n} regions)")
print("\nDone.")
