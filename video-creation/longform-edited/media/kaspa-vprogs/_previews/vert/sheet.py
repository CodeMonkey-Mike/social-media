import sys,glob,subprocess,json
from PIL import Image, ImageDraw
tag=sys.argv[1]; cols=int(sys.argv[2]) if len(sys.argv)>2 else 4
fs=sorted(glob.glob(f'{tag}-*.mp4'),key=lambda s:int(s.rsplit('-',1)[1].split('.')[0]))
strips=[]
for f in fs:
    o=subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height:format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout.split()
    w,h=map(int,o[0].split(',')); 
    if h<=w: continue
    d=float(o[1]); out=f.replace('.mp4','.s.jpg')
    subprocess.run(['ffmpeg','-y','-v','error','-i',f,'-vf',f'fps={4/max(d,1):.4f},scale=130:-2,tile=4x1','-frames:v','1',out])
    strips.append((f,Image.open(out)))
sw=max(i.width for _,i in strips); sh=max(i.height for _,i in strips)+18
rows=(len(strips)+cols-1)//cols
c=Image.new('RGB',(cols*(sw+10),rows*sh),'white'); d=ImageDraw.Draw(c)
for k,(f,i) in enumerate(strips):
    x=(k%cols)*(sw+10); y=(k//cols)*sh
    d.text((x+3,y+3),f,fill='black'); c.paste(i,(x,y+18))
c.save(f'sheet-{tag}.jpg',quality=85); print(c.size)
