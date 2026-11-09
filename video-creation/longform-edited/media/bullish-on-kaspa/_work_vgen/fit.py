import numpy as np
from PIL import Image, ImageFilter
import sys
def fit(src,dst,top,bot):
    im=Image.open(src).convert('RGB'); w,h=im.size
    s=1080/w; im=im.resize((1080,round(h*s)),Image.LANCZOS); H=im.size[1]
    a=np.asarray(im)
    t=a[:top][::-1] if top else a[:0]; b=a[H-bot:][::-1] if bot else a[:0]
    # mirrored strips, blurred
    def strip(x,edge):
        if len(x)==0: return x
        im2=Image.fromarray(x).filter(ImageFilter.GaussianBlur(25)); return np.asarray(im2)
    ts=strip(a[:top][::-1].copy() if top else a[:0],0); bs=strip(a[H-bot:][::-1].copy() if bot else a[:0],0)
    full=np.concatenate([ts,a,bs]).astype(np.float32)
    # feather seams: blend blurred full over a band around seams
    blur=np.asarray(Image.fromarray(full.astype(np.uint8)).filter(ImageFilter.GaussianBlur(12))).astype(np.float32)
    for y0 in (top,top+H):
        for y in range(y0-30,y0+30):
            if 0<=y<full.shape[0]:
                k=1-abs(y-y0)/30; full[y]=full[y]*(1-k)+blur[y]*k
    Image.fromarray(full.astype(np.uint8)).save(dst)
    print(dst,Image.open(dst).size)
fit('_work_vgen/IMG-1-pickaxe-coin.png','assets/vertical/img/IMG-1-pickaxe-coin.png',200,100)
fit('_work_vgen/IMG-3-sombrero-coin.png','assets/vertical/img/IMG-3-sombrero-coin.png',150,150)
fit('_work_vgen/IMG-4-nacho-coin.png','assets/vertical/img/IMG-4-nacho-coin.png',150,150)
