import sys, subprocess, json, glob, os
# post.py <br> <start> <len> <slug>
br, start, ln, slug = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
SRC = r'C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/golden-kitty/_envato-src'
OUT = r'C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/golden-kitty/assets/vid'
src = [f for f in glob.glob(f'{SRC}/BR-{br}.*') if not f.endswith('.zip')]
src = [f for f in src if f.endswith(('.mp4', '.mov', '.MOV', '.MP4', '.m4v'))]
assert len(src) == 1, src
src = src[0]
os.makedirs(OUT, exist_ok=True)
out = f'{OUT}/BR-{br}-{slug}.mp4'
VF='setparams=color_trc=bt709,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080'
if len(sys.argv) > 5 and sys.argv[5] == 'alpha':
    fargs = ['-f','lavfi','-i','color=c=black:s=1920x1080:r=25','-filter_complex',f'[0:v]{VF},format=yuva420p[f];[1:v][f]overlay=shortest=1,format=yuv420p[v]','-map','[v]']
else:
    fargs = ['-map','0:v:0','-vf',VF+',format=yuv420p']
subprocess.run(['ffmpeg','-y','-v','error','-ss',str(start),'-i',src,*fargs,'-t',str(ln),
  '-c:v','libx264','-preset','medium','-crf','18','-an','-dn','-map_metadata','-1','-write_tmcd','0','-movflags','+faststart',out],check=True)
p = json.loads(subprocess.run(['ffprobe','-v','error','-show_entries','stream=codec_type,codec_name,width,height:format=duration,size','-of','json',out],capture_output=True,text=True).stdout)
print(out, p['format']['duration'], int(p['format']['size'])//1000, 'KB', [(s['codec_type'],s.get('codec_name'),s.get('width'),s.get('height')) for s in p['streams']])
# QA sheet: 6 frames across the clip
d = float(p['format']['duration'])
subprocess.run(['ffmpeg','-y','-v','error','-i',out,'-vf',f'fps={6/d},scale=320:-2,tile=6x1','-frames:v','1',f'qa_BR-{br}.png'])
