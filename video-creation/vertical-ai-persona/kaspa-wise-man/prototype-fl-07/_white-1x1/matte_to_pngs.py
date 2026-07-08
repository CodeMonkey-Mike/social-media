#!/usr/bin/env python3
"""Matte a white-bg talking clip to a TRANSPARENT PNG SEQUENCE (RGBA).

Remotion composites a PNG sequence's alpha perfectly (unlike VP9-alpha webm, which
Chromium renders as a black box). Each source frame -> rembg human-seg mask ->
floor low alpha to 0 (truly transparent bg, no veil) -> RGBA PNG named by source index.

Usage: python matte_to_pngs.py <in.mp4> <out_dir>
"""
import os, sys, subprocess, tempfile, glob
from rembg import remove, new_session
from PIL import Image
import numpy as np

def main():
    src, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    sess = new_session("u2net_human_seg")
    with tempfile.TemporaryDirectory() as td:
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",src,
                        os.path.join(td, "f_%05d.png")], check=True)
        frames = sorted(glob.glob(os.path.join(td, "f_*.png")))
        for i, fp in enumerate(frames):
            im = Image.open(fp).convert("RGB")
            cut = remove(im, session=sess, alpha_matting=False)
            arr = np.array(cut)
            a = arr[:, :, 3].astype(np.int32)
            a[a < 25] = 0
            arr[:, :, 3] = a.astype(np.uint8)
            Image.fromarray(arr, "RGBA").save(os.path.join(outdir, "c_%05d.png" % i))
            if i % 30 == 0:
                print(f"  matted {i}/{len(frames)}", file=sys.stderr)
    print(f"wrote {len(frames)} PNGs -> {outdir}", file=sys.stderr)

if __name__ == "__main__":
    main()
