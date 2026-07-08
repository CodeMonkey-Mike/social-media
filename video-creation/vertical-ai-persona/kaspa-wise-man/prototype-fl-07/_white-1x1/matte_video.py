#!/usr/bin/env python3
"""Matte a white-background talking clip to a transparent-alpha WebM (VP9 yuva420p).

Per-frame rembg (u2net_human_seg + alpha matting) on a clean white plate -> RGBA PNG
sequence -> VP9 WebM with a real alpha channel that Remotion <OffthreadVideo> can composite
over any backdrop. Audio is intentionally dropped here (Remotion lays the voice from the
source mp4 via <Audio>), so video and audio stay cleanly separated.

Usage: python matte_video.py <in.mp4> <out.webm>
"""
import os, sys, subprocess, tempfile, glob
from rembg import remove, new_session
from PIL import Image
import numpy as np

def fps_of(path):
    r = subprocess.run(["ffprobe","-v","error","-select_streams","v:0",
                        "-show_entries","stream=r_frame_rate","-of","csv=p=0", path],
                       capture_output=True, text=True)
    num, den = r.stdout.strip().split("/")
    return float(num) / float(den)

def main():
    src, out = sys.argv[1], sys.argv[2]
    fps = fps_of(src)
    sess = new_session("u2net_human_seg")
    with tempfile.TemporaryDirectory() as td:
        # extract frames
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",src,
                        os.path.join(td, "f_%05d.png")], check=True)
        frames = sorted(glob.glob(os.path.join(td, "f_*.png")))
        outdir = os.path.join(td, "cut"); os.makedirs(outdir)
        for i, fp in enumerate(frames):
            im = Image.open(fp).convert("RGB")
            # NO alpha_matting (it leaves a faint translucent veil across the whole frame that shows
            # as a box over dark backdrops). Clean mask + floor low alpha to 0 = truly transparent bg.
            cut = remove(im, session=sess, alpha_matting=False)
            arr = np.array(cut)
            a = arr[:, :, 3].astype(np.int32)
            a[a < 25] = 0
            arr[:, :, 3] = a.astype(np.uint8)
            Image.fromarray(arr, "RGBA").save(os.path.join(outdir, "c_%05d.png" % i))
            if i % 30 == 0:
                print(f"  matted {i}/{len(frames)}", file=sys.stderr)
        # encode RGBA PNG sequence -> VP9 WebM with alpha
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y",
                        "-framerate", f"{fps}",
                        "-i", os.path.join(outdir, "c_%05d.png"),
                        "-c:v","libvpx-vp9","-pix_fmt","yuva420p","-b:v","0","-crf","20",
                        "-an", out], check=True)
    print(f"wrote {out}  ({len(frames)} frames @ {fps:.3f}fps)", file=sys.stderr)

if __name__ == "__main__":
    main()
