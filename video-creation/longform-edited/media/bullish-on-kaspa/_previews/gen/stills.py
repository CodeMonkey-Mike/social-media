import subprocess,sys,os
from concurrent.futures import ThreadPoolExecutor
OUT=sys.argv[1]; frames=[int(x) for x in sys.argv[2:]]
os.makedirs(OUT,exist_ok=True)
R='C:/Users/mnede/Documents/Claude/social-media/video-creation/remotion'
def go(f):
    o=f'{OUT}/f{f:05d}.jpg'
    p=subprocess.run(f'npx remotion still D:/video-work/bullish-on-kaspa/build-bok BullishOnKaspa "{o}" --frame={f} --image-format=jpeg --jpeg-quality=70 --scale=0.5 --timeout=120000 --log=error',shell=True,cwd=R,capture_output=True,text=True)
    if p.returncode or not os.path.exists(o): print('FAIL',f,p.stdout[-800:],p.stderr[-800:])
    return f
with ThreadPoolExecutor(4) as ex:
    list(ex.map(go,frames))
print('done')
