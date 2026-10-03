"""Offline SFX sweep: mix cue sets onto the bare spine, 48 kHz AAC (render chain), plus an encode-matched control."""
import json, subprocess, sys
RA='../../../render-assets/'
SPINE=RA+'no-job-is-safe-robots.mp4'
def mix(cues, out):
    args=['ffmpeg','-v','error','-y','-i',SPINE]
    filt=[]; labels=['[0:a]']
    for i,(t,src,vol,dur) in enumerate(cues):
        args+=['-i',RA+'sfx/'+src]
        d=int(round(t*1000))
        filt.append(f'[{i+1}:a]atrim=0:{dur},asetpts=PTS-STARTPTS,volume={vol},adelay={d}|{d},aresample=48000[s{i}]')
        labels.append(f'[s{i}]')
    if cues:
        filt.append(''.join(labels)+f'amix=inputs={len(labels)}:normalize=0:duration=first[m]')
        args+=['-filter_complex',';'.join(filt),'-map','[m]']
    else:
        args+=['-map','0:a']
    args+=['-ar','48000','-c:a','aac','-b:a','320k',out]
    subprocess.run(args,check=True)
sets=json.load(open(sys.argv[1]))
for name,cues in sets.items():
    mix(cues, name+'.m4a'); print('mixed',name)
