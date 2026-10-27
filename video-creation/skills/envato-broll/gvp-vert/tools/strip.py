import subprocess, sys, os, json
# usage: strip.py <in.mp4> <out.png> [n]
f, out = sys.argv[1], sys.argv[2]; n = int(sys.argv[3]) if len(sys.argv) > 3 else 8
d = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
fps = n / d
subprocess.run(['ffmpeg','-y','-v','error','-i',f,'-vf',f'fps={fps:.4f},scale=228:-2,tile={n}x1','-frames:v','1',out])
r = subprocess.run(['ffmpeg','-i',f,'-vf','signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-','-f','null','-'],capture_output=True,text=True)
ys = [float(l.split('=')[1]) for l in r.stdout.splitlines() if 'YAVG' in l]
print(os.path.basename(f), f'dur {d:.2f}s  luma mean {sum(ys)/len(ys):.0f}  min {min(ys):.0f} max {max(ys):.0f}')
