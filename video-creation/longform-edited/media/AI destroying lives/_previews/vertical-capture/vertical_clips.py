"""
vertical_clips.py: the 9:16 (1080x1920) twins of the 16:9 clip inserts of 'AI destroying lives'.

capture_clip_insert.py has no vertical mode (it always letterboxes to 1920x1080), and the 16:9 files already carry the
verified window, the audio, and per-clip fixes (the blurred private name bars on CLIP-40 / CLIP-42, caption on top where the
source has its own chyron). So each vertical is derived from its 16:9 twin:
  1. crop the burned 96 px context band off the picture (top for caption_pos=top, else bottom),
  2. crop black pillar bars (CLIP-27 is 4:3, CLIP-51 is a phone video),
  3. fit the whole picture to 1080 wide (never cropped sideways) over a blurred, darkened copy of itself,
  4. burn the SAME context caption big, in a band directly under the picture,
  5. keep the audio, 30 fps, exact length, then re-verify audio + Whisper words.
"""
import json
import subprocess
import sys
import importlib.util
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
PROJ = Path(r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\AI destroying lives")
SRC = PROJ / "assets" / "clip-inserts"
OUT = PROJ / "assets" / "vertical" / "clip-inserts"
TMP = PROJ / "_previews" / "vertical-capture" / "clipwork"
TMP.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
FONT = Path.home() / "AppData/Local/Microsoft/Windows/Fonts/Montserrat-Bold.otf"

spec = importlib.util.spec_from_file_location(
    "cci", r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\skills\clip-inserts\capture_clip_insert.py")
cci = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cci)

cover = json.loads((PROJ / "COVER-PLAN.json").read_text(encoding="utf-8"))
CL = {c["id"]: c for c in cover["clip_inserts"]}
IDS = ["CLIP-29", "CLIP-3", "CLIP-12", "CLIP-20", "CLIP-2", "CLIP-27", "CLIP-9", "CLIP-24", "CLIP-30", "CLIP-6", "CLIP-16",
       "CLIP-21", "CLIP-61", "CLIP-42", "CLIP-40", "CLIP-51", "CLIP-44"]


def twin(cid):
    m = sorted(SRC.glob(f"{cid}-*.mp4"))
    assert len(m) == 1, (cid, m)
    return m[0]


def sh(cmd):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, encoding="utf-8", errors="replace")
    return r


def content_box(src, dur, band_pos):
    """x,w of the real picture (black pillar bars removed), measured on the band-free picture."""
    cy = 96 if band_pos == "top" else 0
    r = sh(["ffmpeg", "-ss", f"{dur/2:.2f}", "-i", src, "-vf", f"crop=1920:984:0:{cy},cropdetect=24:2:0",
            "-frames:v", "6", "-f", "null", "-"])
    import re
    m = re.findall(r"crop=(\d+):(\d+):(\d+):(\d+)", r.stderr)
    w, h, x, y = (int(v) for v in m[-1]) if m else (1920, 984, 0, 0)
    if w >= 1880:
        return 0, 1920
    return x, w


def caption_png(text, path, cap_w=1080, size=46, margin=72):
    f = ImageFont.truetype(str(FONT), size)
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if f.getlength(t) <= cap_w - 2 * margin:
            cur = t
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    lh = int(size * 1.35)
    cap_h = 2 * 34 + lh * len(lines)
    im = Image.new("RGBA", (cap_w, cap_h), (0, 0, 0, 168))
    d = ImageDraw.Draw(im)
    y = 34
    for ln in lines:
        x = (cap_w - f.getlength(ln)) / 2
        d.text((x + 2, y + 2), ln, font=f, fill=(0, 0, 0, 150))
        d.text((x, y), ln, font=f, fill=(255, 255, 255, 255))
        y += lh
    im.save(path)
    return cap_h, lines


def build(cid):
    c = CL[cid]
    src = twin(cid)
    dur = cci.duration(src)
    pos = c.get("caption_pos", "bottom")
    x, w = content_box(src, dur, pos)
    cy = 96 if pos == "top" else 0
    ch = 984
    cap_png = TMP / f"{cid}-cap.png"
    cap_h, lines = caption_png(c["caption"], cap_png)
    s = min(1080 / w, (1920 - cap_h) / ch)
    fw, fh = int(round(w * s / 2) * 2), int(round(ch * s / 2) * 2)
    block = fh + cap_h
    y0 = 0 if block >= 1860 else max(0, int((1920 - block) / 2 - 40))
    fx = (1080 - fw) // 2
    fc = (
        f"[0:v]crop={w}:{ch}:{x}:{cy},split[a][b];"
        f"[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=38:6,eq=brightness=-0.28:saturation=0.85[bg];"
        f"[b]scale={fw}:{fh}:flags=lanczos[fg];"
        f"[bg][fg]overlay={fx}:{y0}[t];"
        f"[t][1:v]overlay=0:{y0 + fh},fps=30,format=yuv420p[v]"
    )
    out = OUT / src.name
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-i", cap_png, "-filter_complex", fc,
           "-map", "[v]", "-map", "0:a:0", "-t", f"{dur:.3f}", "-af", "aresample=48000,apad", "-shortest",
           "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-ar", "48000",
           "-movflags", "+faststart", out]
    r = sh(cmd)
    if r.returncode:
        print("FAIL", cid, r.stderr[-600:])
        return None
    return out, dict(box=(x, w), fg=(fw, fh, y0), cap_h=cap_h, lines=lines, dur=dur)


if __name__ == "__main__":
    only = sys.argv[1:] or IDS
    res = {}
    for cid in only:
        b = build(cid)
        if not b:
            continue
        out, info = b
        got = cci.duration(out)
        dims = cci.probe(out, "stream=width,height,r_frame_rate", "v:0")
        aud = cci.has_audio(out)
        mv = cci.mean_volume_db(out)
        words = cci.whisper_words(out, "small.en")
        exp = CL[cid].get("expect") or ""
        heard = cci.phrase_heard(exp, words) if exp else None
        ok = abs(got - info["dur"]) < 0.1 and aud and mv > -45 and dims.startswith("1080,1920") and heard is not False
        print(f"{'OK  ' if ok else 'WARN'} {cid} {out.name} {dims} dur={got:.3f}/{info['dur']:.3f} audio={aud} mean={mv:.1f}dB "
              f"box={info['box']} fg={info['fg']} expect={exp!r} heard={heard}\n     words=\"{words}\"", flush=True)
        res[cid] = dict(file=str(out), dims=dims, dur=got, audio=aud, mean_db=mv, words=words, expect=exp, heard=heard)
    (TMP / "clips-report.json").write_text(json.dumps(res, indent=1, ensure_ascii=False), encoding="utf-8")
