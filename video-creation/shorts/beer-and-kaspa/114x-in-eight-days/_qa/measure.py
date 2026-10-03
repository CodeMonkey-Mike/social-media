import subprocess, numpy as np
SP='render-assets/114x-in-eight-days.mp4'
def frame(t,w=1080,h=1920):
    raw=subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',SP,'-frames:v','1','-f','rawvideo','-pix_fmt','gray','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.uint8).reshape(h,w).astype(float)
seams=[]
for t in range(2,63,5):
    f=frame(t); m=f.mean(1); g=np.abs(np.diff(m[600:1300])); i=int(np.argmax(g))+600
    seams.append(i+1); 
print('seam candidates',seams)
# content-zone scene cuts via frame diff at 10fps
raw=subprocess.run(['ffmpeg','-v','error','-i',SP,'-vf','fps=10,scale=108:192,format=gray','-f','rawvideo','-'],capture_output=True).stdout
a=np.frombuffer(raw,np.uint8).reshape(-1,192,108).astype(float)
top=a[:,:84,:]
d=np.abs(np.diff(top,axis=0)).mean((1,2))
for i,v in enumerate(d):
    if v>6: print(f'cut ~{(i+1)/10:.1f}s diff {v:.1f}')
