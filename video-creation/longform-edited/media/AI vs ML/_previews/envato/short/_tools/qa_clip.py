"""QA one or more final vertical b-roll clips: dims/codec/fps/duration, audio streams (must be 0), blackdetect,
freezedetect, mean inter-frame motion (YDIF), and a 5-frame sheet (0, 25, 50, 75, ~100%) at ../qa/<stem>-qa.jpg.
Usage: python qa_clip.py <clip.mp4> [...]"""
import json, re, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
for a in sys.argv[1:]:
    f = Path(a)
    qa = Path(__file__).resolve().parent.parent / "qa"
    qa.mkdir(exist_ok=True)
    j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt",
                                   "-show_entries", "format=duration,size", "-of", "json", str(f)], capture_output=True, text=True).stdout)
    v = [s for s in j["streams"] if s["codec_type"] == "video"][0]
    na = sum(1 for s in j["streams"] if s["codec_type"] == "audio")
    dur = float(j["format"]["duration"])
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(f), "-vf", "blackdetect=d=0.1:pix_th=0.10,freezedetect=n=0.003:d=0.5,signalstats,metadata=print:key=lavfi.signalstats.YDIF",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)
    freezes = re.findall(r"freeze_start: ([\d.]+)", err)
    ydif = [float(x) for x in re.findall(r"YDIF=([\d.]+)", err)][1:]
    mean_ydif = sum(ydif) / len(ydif) if ydif else 0
    still_frames = sum(1 for y in ydif if y < 0.05)
    print(f"{f.name}: {v['width']}x{v['height']} {v['codec_name']} {v['pix_fmt']} {v['r_frame_rate']} {dur:.2f}s "
          f"{int(j['format']['size'])/1e6:.1f}MB audio_streams={na} black={blacks or 'none'} freeze={freezes or 'none'} "
          f"motion_YDIF_mean={mean_ydif:.2f} near_static_frames={still_frames}/{len(ydif)}")
    tiles = []
    for k, frac in enumerate((0.0, 0.25, 0.5, 0.75, 0.98)):
        jp = qa / f"_{f.stem}-{k}.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{dur * frac:.2f}", "-i", str(f), "-frames:v", "1", "-vf", "scale=360:640", str(jp)])
        im = Image.open(jp).convert("RGB")
        d = ImageDraw.Draw(im)
        d.text((8, 8), f"{dur * frac:.2f}s", fill=(255, 255, 0), font=font, stroke_width=2, stroke_fill=(0, 0, 0))
        tiles.append(im)
        jp.unlink()
    sheet = Image.new("RGB", (360 * 5 + 16, 640), (0, 0, 0))
    for k, t in enumerate(tiles):
        sheet.paste(t, (k * 364, 0))
    sheet.save(qa / f"{f.stem}-qa.jpg", quality=88)
