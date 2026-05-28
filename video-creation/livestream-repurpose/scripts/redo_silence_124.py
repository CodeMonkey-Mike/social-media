"""
Redo silence deletion for videos 1, 2, 4 WITHOUT the click/pop at joins.
Root cause of pops: hard-cut splices (aselect) join points where a word tail is still
slightly audible -> waveform discontinuity -> click. Fix: render each kept audio region
with a short fade-in/out (declick) so every join hits zero amplitude. No pad, same
-57/-52 dBFS / 250ms detection as the canonical method.

Pipeline per clip: re-extract RAW (re-encode segments + concat) -> detect audio regions
-> render each region with 8ms audio fades -> concat -> overwrite preview.mp4.
Leaves video 3 (deleted) and video 5 (trimmed) untouched.
"""
import json, subprocess, os, shutil, tempfile

BASE     = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose"
SRC      = os.path.join(BASE, "media", "bulls are sleeping LOW BPS VERTICAL.mp4")
JSON_SRC = os.path.join(BASE, "transcripts", "bulls are sleeping LOW BPS VERTICAL.json")
CLIPS    = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\bulls-are-sleeping-clips"

SIL_TH, AUD_TH, MIN_SIL, MIN_AUD, WIN = -57.0, -52.0, 0.25, 0.25, 0.02
FADE = 0.008  # 8ms declick fade at each region edge

# Segment phrase boundaries for the 3 silence-delete clips (same as original extraction)
TOPICS = {
    "bulls-are-sleeping": [
        ("i put my thumbnail", "the bears are coming back and knocked over", 600),
        ("we're in this gigantic bear flag", "unbelievably boring you know", 60),
        ("hopefully doesn't work out like what i showed you", "we're not even halfway through at this point", 2900),
    ],
    "price-vs-technology": [
        ("but the price is what it is what the market thinks today", "that is taking advantage of the gap i would say", 2400),
        ("caspa is undervalued until a dollar", "it all depends on the time frame", 3050),
    ],
    "heard-of-kaspa-brah": [
        ("well randy you go around", "somebody's gonna tell these people", 950),
        ("they're going to see kaspa", "remember that kaspa is a stable coin", 1080),
    ],
}

with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)
all_words = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        all_words.append({"word": w["word"].strip().lower().strip(".,!?'\""),
                          "start": w.get("start", seg["start"]), "end": w.get("end", seg["end"])})

def _norm(p): return [w.strip().lower().strip(".,!?'\"") for w in p.split()]
def find_start(p, after=0):
    ws=_norm(p); n=len(ws)
    for i,w in enumerate(all_words):
        if w["start"]<after: continue
        if [x["word"] for x in all_words[i:i+n]]==ws: return all_words[i]["start"]
    return None
def find_end(p, after=0):
    ws=_norm(p); n=len(ws)
    for i,w in enumerate(all_words):
        if w["start"]<after: continue
        if [x["word"] for x in all_words[i:i+n]]==ws: return all_words[i+n-1]["end"]
    return None

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())

def extract_raw(segs, out_path, work):
    """Re-extract the raw multi-segment clip (re-encode each, concat)."""
    tmps=[]
    for i,(s,e) in enumerate(segs):
        t=os.path.join(work,f"raw{i}.mp4")
        subprocess.run(["ffmpeg","-y","-ss",str(s),"-i",SRC,"-t",str(e-s),
                        "-c:v","libx264","-preset","fast","-crf","20","-c:a","aac","-b:a","192k",
                        "-avoid_negative_ts","make_zero",t], check=True, capture_output=True)
        tmps.append(t)
    if len(tmps)==1:
        shutil.copy(tmps[0], out_path); return
    lst=os.path.join(work,"raw_concat.txt")
    with open(lst,"w") as f:
        for t in tmps: f.write(f"file '{t.replace(os.sep,'/')}'\n")
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lst,"-c","copy",out_path],
                   check=True, capture_output=True)

def levels(f):
    n=int(round(44100*WIN))
    r=subprocess.run(["ffmpeg","-i",f,"-af",
        f"aresample=44100,asetnsamples=n={n}:p=0,astats=metadata=1:reset=1,ametadata=print",
        "-f","null","-"], capture_output=True, text=True)
    import re
    ts=[float(x) for x in re.findall(r'pts_time:([\d.]+)', r.stderr)]
    vs=[(-100.0 if x in ('-inf','nan') else float(x))
        for x in re.findall(r'lavfi\.astats\.Overall\.RMS_level=(-?[\d.]+|-inf|nan)', r.stderr)]
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

def remove_silence_declick(raw, out_path, work):
    """Keep audio regions, drop gaps >250ms, with an 8ms audio fade on each region edge (declick)."""
    auds=audio_regions(levels(raw))
    if not auds: return None
    tmps=[]
    for i,(s,e) in enumerate(auds):
        d=e-s
        fo=max(0.0, d-FADE)
        af=f"afade=t=in:st=0:d={FADE},afade=t=out:st={fo:.3f}:d={FADE}"
        t=os.path.join(work,f"reg{i}.mp4")
        subprocess.run(["ffmpeg","-y","-ss",f"{s:.3f}","-i",raw,"-t",f"{d:.3f}",
                        "-af",af,"-c:v","libx264","-preset","fast","-crf","18",
                        "-c:a","aac","-b:a","192k","-avoid_negative_ts","make_zero",t],
                       check=True, capture_output=True)
        tmps.append(t)
    lst=os.path.join(work,"reg_concat.txt")
    with open(lst,"w") as f:
        for t in tmps: f.write(f"file '{t.replace(os.sep,'/')}'\n")
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lst,"-c","copy",out_path],
                   check=True, capture_output=True)
    return len(auds)

print("Redo silence delete (declicked) for videos 1,2,4:\n")
for slug, seg_defs in TOPICS.items():
    segs=[]
    for sp,ep,after in seg_defs:
        s=find_start(sp,after); e=find_end(ep, after=(s or after))
        segs.append((s,e))
    out=os.path.join(CLIPS,slug,"preview.mp4")
    with tempfile.TemporaryDirectory() as work:
        raw=os.path.join(work,"raw.mp4")
        extract_raw(segs, raw, work)
        b=dur(raw)
        n=remove_silence_declick(raw, out, work)
        a=dur(out)
    print(f"  {slug:24s} raw {b:6.1f}s -> {a:6.1f}s  ({n} regions, declicked joins)")
print("\nDone. Joins now fade to zero (no pop). Refresh the dashboard.")
