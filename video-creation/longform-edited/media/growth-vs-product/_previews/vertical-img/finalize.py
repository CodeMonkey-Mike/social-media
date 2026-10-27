import hashlib, sys
from pathlib import Path
import numpy as np
from PIL import Image

P = Path(r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\growth-vs-product")
NATIVE = P/"_previews"/"vertical-img"/"native"
OUT = P/"assets"/"vertical"/"img"
QA = P/"_previews"/"vertical-img"/"qa"
QA.mkdir(exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

def md5(p): return hashlib.md5(Path(p).read_bytes()).hexdigest()

others = {p.name: md5(p) for p in list((P/"assets"/"img").glob("*.png")) + list((P/"assets"/"short"/"img").glob("*.png"))}
seen = {}
for src in sorted(NATIVE.glob("IMG-*.png")):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    out = im.resize((1080, 1920), Image.LANCZOS)
    dst = OUT/src.name
    out.save(dst, optimize=True)
    chk = Image.open(dst)
    h_ = md5(dst)
    dup = [k for k, v in {**others, **seen}.items() if v == h_]
    seen[dst.name] = h_
    print(f"{dst.name}: native {w}x{h} (ratio {w/h:.4f}, 9:16={9/16:.4f}) -> {chk.size} mode={chk.mode} bytes={dst.stat().st_size} dup_of={dup}")
    # corner sweep at boosted brightness (watermark / signature check): 4 corners 260x260 of the 1080x1920, brightened x4 gamma
    a = np.asarray(out).astype(np.float32)/255
    boosted = np.clip(a**0.45*1.6, 0, 1)
    c = 300
    tiles = [boosted[:c,:c], boosted[:c,-c:], boosted[-c:,:c], boosted[-c:,-c:]]
    sheet = np.concatenate([np.concatenate(tiles[:2],1), np.concatenate(tiles[2:],1)],0)
    Image.fromarray((sheet*255).astype(np.uint8)).save(QA/f"corners-{src.stem}.png")
