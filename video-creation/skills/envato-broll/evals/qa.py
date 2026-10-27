"""qa.py: per assets/vid clip -> probe (codec/size/fps/dur/audio), 5 frames (0, slot-in, mid, slot-out, last),
motion score (mean abs diff between frames 0.4 s apart inside the slot), luma; one sheet per clip."""
import io, json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat
V = Path(r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\evals\assets\vid")
W = Path(__file__).parent
trims = {l.split("\t")[0]: l.split("\t") for l in (W / "trims.tsv").read_text().splitlines()}
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 16)
def frame(p, t, w=384):
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(p), "-frames:v", "1", "-vf", f"scale={w}:-2", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True)
    return Image.open(io.BytesIO(r.stdout)).convert("RGB")
ids = sys.argv[1:] or sorted(trims, key=int)
rep = []
for i in ids:
    f = next(V.glob(f"BR-{i}-*.mp4"))
    pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(f)], capture_output=True, text=True).stdout)
    vs = [s for s in pr["streams"] if s["codec_type"] == "video"][0]
    na = sum(1 for s in pr["streams"] if s["codec_type"] == "audio")
    dur = float(pr["format"]["duration"]); head = float(trims[i][2]); slot = float(trims[i][3])
    ts = [0.0, head, head + slot / 2, min(head + slot, dur - 0.05), dur - 0.05]
    ims = [frame(f, t) for t in ts]
    # motion inside the slot
    diffs = []
    t = head
    while t + 0.4 <= head + slot:
        a, b = frame(f, t, 192).convert("L"), frame(f, t + 0.4, 192).convert("L")
        diffs.append(ImageStat.Stat(ImageChops.difference(a, b)).mean[0]); t += 0.4
    luma = [round(ImageStat.Stat(im.convert("L")).mean[0], 1) for im in ims]
    row = dict(id=f"BR-{i}", file=f.name, codec=vs["codec_name"], wh=f"{vs['width']}x{vs['height']}", fps=vs["r_frame_rate"],
               dur=round(dur, 2), audio_streams=na, slot_in=head, slot=slot, MB=round(f.stat().st_size / 1e6, 1),
               motion=[round(d, 2) for d in diffs], luma=luma)
    rep.append(row); print(json.dumps(row))
    sheet = Image.new("RGB", (384 * 5, ims[0].height + 22), (0, 0, 0))
    for k, (im, t) in enumerate(zip(ims, ts)):
        sheet.paste(im, (k * 384, 22))
        ImageDraw.Draw(sheet).text((k * 384 + 4, 2), f"BR-{i} t={t:.2f}" + (" IN" if k == 1 else " OUT" if k == 3 else ""), fill=(255, 220, 0), font=font)
    sheet.save(W / "prev" / f"qa{i}.jpg", quality=80)
(W / "qa.json").write_text(json.dumps(rep, indent=1))
