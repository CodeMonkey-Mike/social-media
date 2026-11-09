import glob,os,time,json
W=max(glob.glob('D:/video-work/bullish-on-kaspa/tmp/chunked-render/*'),key=os.path.getmtime)
f=r'C:\Users\mnede\AppData\Local\Temp\claude\e7c02e421f9816cd\fc0f710e-b14c-4b21-a59e-9246d56bf12c\tasks\bj7jaypk3.output'
t=time.time()
while time.time()-t<570:
    s=open(f,encoding='utf8',errors='replace').read() if os.path.exists(f) else ''
    if 'RENDER-DONE' in s or 'Traceback' in s: break
    time.sleep(15)
mk=glob.glob(W+'/*.mkv')
print(W,len(mk),'chunks done of ~10');print(s[-400:])
for j in glob.glob(W+'/*.json'):
    try:
        d=json.load(open(j,encoding='utf8'));c=d.get('chunks',{});print(os.path.basename(j),'ok',sum(1 for v in c.values() if v.get('ok')),'failed-attempts',sum(1 for v in c.values() for a in v.get('attempts',[]) if not a.get('ok')))
    except Exception as e: pass
