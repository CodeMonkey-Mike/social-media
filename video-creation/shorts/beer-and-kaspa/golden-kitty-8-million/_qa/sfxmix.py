import re, subprocess, json, sys
Q='golden-kitty-8-million/_qa'
def events():
    src=open('../../remotion/src/constants-beer-and-kaspa-golden-kitty-8-million.ts',encoding='utf-8').read()
    return [[float(t),f,float(v),float(d)] for t,f,v,d in re.findall(r"\{ t:\s*([\d.]+), src: staticFile\('([^']+)'\), vol: ([\d.]+), dur: ([\d.]+) \}",src)]
def mix(ev,out):
    inputs=['-i','render-assets/golden-kitty-8-million.mp4']; filt=[]
    for k,(t,f,v,d) in enumerate(ev):
        inputs+=['-i','render-assets/'+f]; ms=int(round(t*1000))
        filt.append(f"[{k+1}:a]aresample=48000,atrim=0:{d},volume={v},adelay={ms}|{ms}[s{k}]")
    fc=';'.join(['[0:a]aresample=48000[a0]']+filt+['[a0]'+''.join(f'[s{k}]' for k in range(len(ev)))+f'amix=inputs={len(ev)+1}:normalize=0:duration=first[m]'])
    subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex',fc,'-map','[m]','-ac','2','-c:a','aac','-b:a','192k',out],check=True)
