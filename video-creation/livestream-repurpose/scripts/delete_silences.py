"""
delete_silences.py — Canonical DECLICKED silence removal (SKILL.md Phase 2b).

Usage: python delete_silences.py <clip.mp4> [more.mp4 ...]
       (overwrites each file in place)

Method (Mike's Audition workflow, validated 2026-05-23; declick added 2026-05-25):
  - Detect audio vs. silence with a dual-threshold level detector:
      silence < -57 dBFS, audio > -52 dBFS (5 dB hysteresis),
      min-silence 250 ms, min-audio 250 ms, NO pad.
      (Per-20 ms RMS via ffmpeg astats -> hysteresis state machine -> audio regions.)
  - Keep all audio regions, drop every silence > 250 ms.
  - DECLICK: render each kept region as its own segment with an 8 ms audio fade-in/out,
    then concat. WITHOUT this, hard-cut splices (aselect) join slightly-audible word
    tails -> waveform discontinuity -> audible POP/click at every join. The fade forces
    each join to zero amplitude. (This is NOT padding — it doesn't extend kept audio.)

Replaces the deleted recut_all.py (silence-removal mode). Do not revert to a single
aselect pass — that is what caused the pops.
"""
import subprocess, re, sys, io, os, shutil, tempfile
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

SIL_TH, AUD_TH, MIN_SIL, MIN_AUD, WIN = -57.0, -52.0, 0.25, 0.25, 0.02
FADE = 0.008  # 8 ms declick fade at each kept-region edge

def dur(p):
    return float(subprocess.check_output(
        ["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())

def levels(f):
    n = int(round(44100 * WIN))
    r = subprocess.run(["ffmpeg","-i",f,"-af",
        f"aresample=44100,asetnsamples=n={n}:p=0,astats=metadata=1:reset=1,ametadata=print",
        "-f","null","-"], capture_output=True, text=True)
    ts = [float(x) for x in re.findall(r'pts_time:([\d.]+)', r.stderr)]
    vs = [(-100.0 if x in ('-inf','nan') else float(x))
          for x in re.findall(r'lavfi\.astats\.Overall\.RMS_level=(-?[\d.]+|-inf|nan)', r.stderr)]
    m = min(len(ts), len(vs)); return [(ts[i], vs[i]) for i in range(m)]

def coalesce(regs):
    out = []
    for typ, s, e in regs:
        if out and out[-1][0] == typ: out[-1] = [typ, out[-1][1], e]
        else: out.append([typ, s, e])
    return out

def audio_regions(lv):
    if not lv: return []
    regs = []; st = 'sil'; start = lv[0][0]
    for t, v in lv:
        if st == 'sil' and v > AUD_TH: regs.append(['sil', start, t]); st = 'aud'; start = t
        elif st == 'aud' and v < SIL_TH: regs.append(['aud', start, t]); st = 'sil'; start = t
    regs.append([st, start, lv[-1][0] + WIN])
    for r in regs:
        if r[0] == 'sil' and r[2] - r[1] < MIN_SIL: r[0] = 'aud'
    regs = coalesce(regs)
    for r in regs:
        if r[0] == 'aud' and r[2] - r[1] < MIN_AUD: r[0] = 'sil'
    return [(s, e) for typ, s, e in coalesce(regs) if typ == 'aud']

def delete_silences(f):
    auds = audio_regions(levels(f))
    if not auds: return None
    with tempfile.TemporaryDirectory() as work:
        tmps = []
        for i, (s, e) in enumerate(auds):
            d = e - s
            fo = max(0.0, d - FADE)
            af = f"afade=t=in:st=0:d={FADE},afade=t=out:st={fo:.3f}:d={FADE}"
            t = os.path.join(work, f"reg{i}.mp4")
            subprocess.run(["ffmpeg","-y","-ss",f"{s:.3f}","-i",f,"-t",f"{d:.3f}",
                            "-af",af,"-c:v","libx264","-preset","fast","-crf","18",
                            "-c:a","aac","-b:a","192k","-avoid_negative_ts","make_zero",t],
                           check=True, capture_output=True)
            tmps.append(t)
        lst = os.path.join(work, "concat.txt")
        with open(lst, "w") as fh:
            for t in tmps: fh.write(f"file '{t.replace(os.sep,'/')}'\n")
        out_tmp = os.path.join(work, "out.mp4")
        subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lst,"-c","copy",out_tmp],
                       check=True, capture_output=True)
        shutil.move(out_tmp, f)
    return len(auds)

if __name__ == "__main__":
    files = sys.argv[1:]
    if not files:
        print("Usage: python delete_silences.py <clip.mp4> [more.mp4 ...]"); sys.exit(1)
    for f in files:
        if not os.path.exists(f): print(f"  MISSING: {f}"); continue
        b = dur(f); n = delete_silences(f); a = dur(f)
        print(f"  {os.path.basename(f):28s} {b:6.1f}s -> {a:6.1f}s  (-{b-a:.1f}s, {n} regions, declicked)")
