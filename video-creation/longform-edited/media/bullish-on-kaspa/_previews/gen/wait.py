import time,os,glob
f=r'C:\Users\mnede\AppData\Local\Temp\claude\e7c02e421f9816cd\fc0f710e-b14c-4b21-a59e-9246d56bf12c\tasks\bj7jaypk3.output'
t=time.time(); s=''
while time.time()-t<575:
    s=open(f,encoding='utf8',errors='replace').read() if os.path.exists(f) else ''
    if 'RENDER-DONE' in s or 'Traceback' in s or 'exited with' in s: break
    time.sleep(15)
print(round(time.time()-t),s[-500:])
P=r'C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\bullish-on-kaspa\_previews'
import json
for j in glob.glob(P+r'\*draft*render.log'):
    try:
        d=json.load(open(j,encoding='utf8')); c=d['chunks']; print('chunks ok',sum(1 for v in c.values() if v.get('ok')),'of seen',len(c),'fails',sum(1 for v in c.values() for a in v['attempts'] if not a['ok']))
    except Exception as e: print(j,e)
