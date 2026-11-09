# html_clip.py: render a TIME-DRIVEN HTML page (window.setT(t) sets the whole state as a pure function of t)
# into an mp4 clip, frame by frame, with Playwright + ffmpeg. The card-overlays "clip" kind for an ANIMATED
# CHART (card-overlays.md): the chart-builder's own HTML is the animation, no Remotion port, deterministic.
#
#   python html_clip.py "media/standard/<p>/assets/charts/<chart>.html" --frames 1089 --out "media/standard/<p>/overlays/<id>.mp4"
#       [--fps 30] [--size 1464x1080] [--crf 18]
import argparse, shutil, subprocess, sys, tempfile
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('page')
    ap.add_argument('--frames', type=int, required=True, help='exact frame count of the card window')
    ap.add_argument('--out', required=True)
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--size', default='1464x1080')
    ap.add_argument('--crf', type=int, default=18)
    a = ap.parse_args()
    w, h = (int(v) for v in a.size.lower().split('x'))
    page_uri = Path(a.page).resolve().as_uri()
    out = Path(a.out).resolve()
    from playwright.sync_api import sync_playwright
    tmp = Path(tempfile.mkdtemp(prefix='html_clip_'))
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            pg = b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1)
            pg.goto(page_uri)
            pg.wait_for_load_state('networkidle')
            pg.evaluate('document.fonts.ready')
            if not pg.evaluate("typeof window.setT === 'function'"):
                sys.exit('the page has no window.setT(t)')
            # the page must be a pure function of t: no live animation may run
            anim = pg.evaluate("document.getAnimations ? document.getAnimations().length : 0")
            if anim:
                sys.exit(f'the page has {anim} running CSS animations/transitions: setT must be the only clock')
            for f in range(a.frames):
                pg.evaluate(f'window.setT({f / a.fps:.6f})')
                pg.screenshot(path=str(tmp / f'{f:05d}.png'))
                if f % 100 == 0:
                    print(f'frame {f}/{a.frames}', flush=True)
            b.close()
        out.parent.mkdir(parents=True, exist_ok=True)
        rc = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(a.fps), '-i', str(tmp / '%05d.png'),
                             '-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'medium', '-pix_fmt', 'yuv420p',
                             '-movflags', '+faststart', str(out)]).returncode
        if rc:
            sys.exit(rc)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    n = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=nb_frames,width,height',
                        '-of', 'default=nw=1:nk=1', str(out)], capture_output=True, text=True).stdout.split()
    print('clip ->', out, 'frames/size', n, 'OK' if n and n[-1] == str(a.frames) else 'FRAME COUNT MISMATCH')


if __name__ == '__main__':
    main()
