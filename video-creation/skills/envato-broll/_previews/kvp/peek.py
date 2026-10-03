# usage: python peek.py <results.json> <idx> <tag>   -> <tag>.mp4 + <tag>.png (4-frame contact sheet, t=10/35/60/85%)
import json, sys, subprocess, urllib.request
res = json.load(open(sys.argv[1], encoding='utf-8')); r = res[int(sys.argv[2])]; tag = sys.argv[3]
urllib.request.urlretrieve(r['previewVideo'], tag + '.mp4')
d = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',tag+'.mp4']).decode().strip())
fps = 4.0 / d
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',tag+'.mp4','-vf',f'fps={fps:.4f},scale=480:-2,tile=4x1','-frames:v','1',tag+'.png'],check=True)
print(tag, f'{d:.1f}s', r['title'][:70], r['url'].split('?')[0])
