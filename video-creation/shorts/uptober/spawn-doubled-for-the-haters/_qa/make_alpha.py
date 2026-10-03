# glow-on-black -> alpha-from-max-channel (green/brown avocado reads dark in luma), crop to bbox.
from PIL import Image
im=Image.open('ovl-upt1-avocado-raw.png').convert('RGB')
r,g,b=im.split()
mx=Image.eval(Image.merge('RGB',(r,g,b)).convert('RGB').split()[0],lambda v:v)
import numpy as np
a=np.asarray(im).astype(int).max(axis=2)
alpha=np.clip(np.where(a<14,0,(a-14)*2.4),0,255).astype('uint8')
out=im.copy(); out.putalpha(Image.fromarray(alpha))
bb=Image.fromarray(alpha).point(lambda v:255 if v>20 else 0).getbbox()
out=out.crop(bb); out.save('../../render-assets/ovl-upt1-avocado.png'); print('bbox',bb,'size',out.size)
