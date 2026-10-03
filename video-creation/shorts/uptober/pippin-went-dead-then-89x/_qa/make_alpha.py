# glow-on-black -> alpha-from-max-channel (gold/green read darker in luma), crop to bbox.
from PIL import Image
import numpy as np
im=Image.open('ovl-pip2-bell-raw.png').convert('RGB')
a=np.asarray(im).astype(int).max(axis=2)
alpha=np.clip(np.where(a<14,0,(a-14)*2.4),0,255).astype('uint8')
out=im.copy(); out.putalpha(Image.fromarray(alpha))
bb=Image.fromarray(alpha).point(lambda v:255 if v>20 else 0).getbbox()
out=out.crop(bb); out.save('../render-assets/ovl-pip2-bell.png'); print('bbox',bb,'size',out.size)
# preview over a mid-grey + discord-dark check background
for name,col in (('grey',(128,128,128)),('dark',(49,51,56))):
    bg=Image.new('RGBA',out.size,col+(255,)); bg.alpha_composite(out); bg.convert('RGB').resize((300,int(300*out.size[1]/out.size[0]))).save(f'_qa/v/bell_{name}.jpg')
