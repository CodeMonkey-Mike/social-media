"""vertical_clips_fix.py: round-2 rebuild of CLIP-9 / CLIP-44 / CLIP-51 vertical twins from CLEAN (caption-free) re-captures.
Clean sources: clipwork/clean/CLIP-<n>-clean.mp4 (capture_clip_insert.py --no-caption, same window)."""
import json, subprocess, sys, re, importlib.util
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, str(Path(__file__).parent))
import vertical_clips as vc
cci = vc.cci
CLEAN = vc.TMP / "clean"
OUT = vc.OUT
CL = vc.CL
NAMES = {"CLIP-9": "CLIP-9-marketing-lead.mp4", "CLIP-44": "CLIP-44-construction-trainee.mp4", "CLIP-51": "CLIP-51-shipbuilder.mp4"}

def band(cid):
    src = CLEAN / f"{cid}-clean.mp4"
    dur = cci.duration(src)
    cap_png = vc.TMP / f"{cid}-cap.png"
    cap_h, lines = vc.caption_png(CL[cid]["caption"], cap_png)
    fw, fh = 1080, 608                         # the WHOLE 1920x1080 frame, never cropped
    block = fh + cap_h
    y0 = max(0, int((1920 - block) / 2 - 40))
    fc = (f"[0:v]split[a][b];"
          f"[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=38:6,eq=brightness=-0.28:saturation=0.85[bg];"
          f"[b]scale={fw}:{fh}:flags=lanczos[fg];[bg][fg]overlay=0:{y0}[t];[t][1:v]overlay=0:{y0+fh},fps=30,format=yuv420p[v]")
    return src, dur, fc, ["-i", cap_png], dict(fg=(fw, fh, y0), cap_h=cap_h, lines=lines)

def portrait(cid):
    """native-portrait phone video: crop the pillar bars, fill 1080x1920, caption at the TOP safe area (y 180+)."""
    src = CLEAN / f"{cid}-clean.mp4"
    dur = cci.duration(src)
    r = vc.sh(["ffmpeg", "-ss", f"{dur/2:.2f}", "-i", src, "-vf", "cropdetect=24:2:0", "-frames:v", "6", "-f", "null", "-"])
    m = re.findall(r"crop=(\d+):(\d+):(\d+):(\d+)", r.stderr)
    w, h, x, y = (int(v) for v in m[-1])
    print("cropdetect", w, h, x, y)
    cap_png = vc.TMP / f"{cid}-cap.png"
    cap_h, lines = vc.caption_png(CL[cid]["caption"], cap_png)
    CAPY = 190
    fc = (f"[0:v]crop={w}:{h}:{x}:{y},scale=1080:1920:flags=lanczos[v0];[v0][1:v]overlay=0:{CAPY},fps=30,format=yuv420p[v]")
    return src, dur, fc, ["-i", cap_png], dict(box=(x, y, w, h), cap_y=(CAPY, CAPY + cap_h), cap_h=cap_h, lines=lines)

def build(cid):
    src, dur, fc, extra, info = (portrait if cid == "CLIP-51" else band)(cid)
    out = OUT / NAMES[cid]
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", src, *extra, "-filter_complex", fc, "-map", "[v]", "-map", "0:a:0",
           "-t", f"{dur:.3f}", "-af", "aresample=48000,apad", "-shortest", "-c:v", "libx264", "-crf", "18", "-preset", "medium",
           "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-ar", "48000", "-movflags", "+faststart", out]
    r = vc.sh(cmd)
    if r.returncode:
        print("FAIL", cid, r.stderr[-600:]); return None
    return out, dur, info

if __name__ == "__main__":
    res = {}
    for cid in sys.argv[1:] or list(NAMES):
        b = build(cid)
        if not b: continue
        out, dur, info = b
        got = cci.duration(out); dims = cci.probe(out, "stream=width,height,r_frame_rate", "v:0")
        aud = cci.has_audio(out); mv = cci.mean_volume_db(out); words = cci.whisper_words(out, "small.en")
        exp = CL[cid]["expect"]; heard = cci.phrase_heard(exp, words)
        ok = abs(got - dur) < 0.1 and aud and mv > -45 and dims.startswith("1080,1920") and heard
        print(f"{'OK  ' if ok else 'WARN'} {cid} {out.name} {dims} dur={got:.3f}/{dur:.3f} audio={aud} mean={mv:.1f}dB info={info} heard={heard}\n     words=\"{words}\"", flush=True)
        qa = vc.PROJ / "_previews" / "vertical-capture" / "vframes"
        vc.sh(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{got/2:.2f}", "-i", out, "-frames:v", "1", qa / f"{out.stem}.png"])
        vc.sh(["ffmpeg", "-y", "-loglevel", "error", "-ss", "0.0", "-i", out, "-frames:v", "1", qa / f"{out.stem}.first.png"])
        res[cid] = dict(file=str(out), dims=dims, dur=got, audio=aud, mean_db=mv, words=words, heard=heard)
    (vc.TMP / "clips-fix-report.json").write_text(json.dumps(res, indent=1, ensure_ascii=False), encoding="utf-8")
