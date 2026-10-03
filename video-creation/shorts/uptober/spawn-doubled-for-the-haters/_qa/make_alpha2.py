# Border-connected background key: only near-black pixels CONNECTED to the frame edge go transparent,
# so dark interior detail (pupils, skin rim) stays opaque; soft 2-px edge + glow kept via max-channel ramp.
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
im=Image.open('../ovl-upt1-avocado-raw.png').convert('RGB')
a=np.asarray(im).astype(int).max(axis=2)
dark=a<40
lab,_=ndimage.label(dark)
edge=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
bg=np.isin(lab,list(edge))
ramp=np.clip((a-6)*6,0,255)            # glow/sparkles in the bg region fade by brightness
alpha=np.where(bg,ramp,255).astype('uint8')
alpha=np.asarray(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8)))
out=im.copy(); out.putalpha(Image.fromarray(alpha))
bb=Image.fromarray(alpha).point(lambda v:255 if v>20 else 0).getbbox()
out=out.crop(bb); out.save('../../render-assets/ovl-upt1-avocado.png'); print('bbox',bb,'size',out.size)
