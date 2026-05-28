import glob
from PIL import Image, ImageDraw, ImageFont
import sys

frames = sorted(glob.glob('frames/f*.jpg'))
FPS = 30
try:
    font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
except:
    font = ImageFont.load_default()

def label(im, text):
    d = ImageDraw.Draw(im)
    d.rectangle([0,0,150,28], fill=(0,0,0))
    d.text((5,3), text, fill=(255,210,40), font=font)
    return im

def montage(indices, cols, thumb_w, out, title=None):
    thumb_h = int(thumb_w*9/16)
    rows = (len(indices)+cols-1)//cols
    pad = 4
    titleh = 34 if title else 0
    W = cols*thumb_w + (cols+1)*pad
    H = rows*thumb_h + (rows+1)*pad + titleh
    canvas = Image.new('RGB',(W,H),(18,18,18))
    d = ImageDraw.Draw(canvas)
    if title:
        d.text((8,6), title, fill=(255,255,255), font=font)
    for k,idx in enumerate(indices):
        im = Image.open(frames[idx]).convert('RGB').resize((thumb_w,thumb_h))
        t = idx/FPS
        label(im, f"{t:0.2f}s")
        r,c = divmod(k,cols)
        x = pad + c*(thumb_w+pad)
        y = titleh + pad + r*(thumb_h+pad)
        canvas.paste(im,(x,y))
    canvas.save(out, quality=88)
    print('wrote', out, len(indices),'frames')

mode = sys.argv[1] if len(sys.argv)>1 else 'overview'

if mode=='overview':
    # 10 montages, each 10s, sampling every 10th frame (3fps) = 30 thumbs, 6x5
    for blk in range(10):
        lo = blk*10*FPS
        idxs = list(range(lo, lo+10*FPS, 10))
        montage(idxs, 6, 320, f'montages/overview_{blk:02d}.jpg',
                title=f'{blk*10}-{blk*10+10}s  (sampled 3 fps)')
elif mode=='deep':
    # full 30fps deep dives of 2s windows: pass start seconds as args
    for start in [float(x) for x in sys.argv[2:]]:
        lo = int(start*FPS)
        idxs = list(range(lo, lo+60))  # 2s @30fps
        montage(idxs, 10, 190, f'montages/deep_{start:0.0f}s.jpg',
                title=f'DEEP {start:.0f}-{start+2:.0f}s  full 30 fps (every frame)')
