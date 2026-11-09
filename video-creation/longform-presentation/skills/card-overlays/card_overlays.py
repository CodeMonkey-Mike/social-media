# card_overlays.py: format 4 of the longform-presentation track (card-overlays.md, this folder).
# A handful of overlays (deck cards, chart stills, rendered clips) laid over a finished screen-share spine INSIDE
# the deck area, in ONE ffmpeg encode: no Remotion comp for the video, no draft.
#
#   python card_overlays.py "media/standard/<p>/overlays/cards.json"            # pages -> shoot -> render -> qa
#   python card_overlays.py "media/standard/<p>/overlays/cards.json" --step shoot   (pages | shoot | render | qa)
#
# The spec (cards.json) lives in media/standard/<p>/overlays/ and every path in it is relative to that folder:
#   { "deck": "../<deck>.html", "spine": "../spine/<final spine>.mp4", "out": "../<p> FINAL-v1.mp4",
#     "region": {"x": 0, "y": 0, "w": 1464, "h": 1080},          # the deck area (omit = the whole 1920x1080 frame)
#     "cards": [ { "id": "ov1-quote", "in": 42.35, "out": 54.0, "say": "<the words it covers>",
#                  "kind": "deck", "zoom": 1.5, "orbs": ["var(--accent-gold)", "var(--accent-purple)"] },
#                { "id": "ov3-flow", "in": ..., "out": ..., "say": "...", "kind": "image", "src": "../assets/diagrams/flow-1.png" },
#                { "id": "ov4-wb",   "in": ..., "out": ..., "say": "...", "kind": "clip",  "src": "ov4-wb.mp4" } ] }
# kind "deck" (default): overlays/<id>.body.html (deck classes, the deck's text verbatim) is wrapped in the deck's own
#   <style> on a region-sized page and screenshotted to <id>.png. kind "image": a still already rendered at the
#   region size (a chart-builder diagram). kind "clip": a video already rendered at the region size and the card's
#   exact length (an animated chart, a whiteboard beat; no audio needed, it is ignored).
# Every overlay is composited at region x,y: stills get the 11-frame entrance (0.93 -> 1 scale + alpha, ease-out
# cubic: the spotlight look), clips an 11-frame alpha fade-in (a drawn-on clip starts blank anyway); all hold, then
# a 0.3 s alpha fade out. Audio is stream-copied; the picture keeps the spine's own frame timestamps.
import argparse, json, os, subprocess, sys, tempfile
from pathlib import Path

IN_FRAMES, OUT_S = 11, 0.3
FULL = {'x': 0, 'y': 0, 'w': 1920, 'h': 1080}

STILL_CSS = r"""
/* card-overlays: the deck's CSS as a still, region-sized */
html,body{scroll-snap-type:none;overflow:hidden;margin:0}
.fade-in{opacity:1!important;transform:none!important}
.card:hover{transform:none;box-shadow:none}
.ov{width:%(w)dpx;height:%(h)dpx;position:relative;overflow:hidden;background:var(--bg-deep,#0a0c10);display:flex;align-items:center;justify-content:center}
.ov .orb{position:absolute}
.ov .stage{position:relative;z-index:1}
.ov .ey{margin-bottom:14px}
"""


def load(spec_path):
    spec_path = Path(spec_path).resolve()
    spec = json.loads(spec_path.read_text(encoding='utf-8'))
    d = spec_path.parent
    for k in ('deck', 'spine', 'out'):
        spec[k] = (d / spec[k]).resolve()
    spec['dir'] = d
    spec['region'] = {**FULL, **(spec.get('region') or {})}
    for c in spec['cards']:
        c['kind'] = c.get('kind', 'deck')
        if c['kind'] not in ('deck', 'image', 'clip'):
            sys.exit(f"card {c['id']}: kind must be deck | image | clip")
        if c['kind'] != 'deck':
            if not c.get('src'):
                sys.exit(f"card {c['id']}: kind {c['kind']} needs src")
            c['src'] = (d / c['src']).resolve()
    return spec


def ffprobe(path, entries):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', entries,
                        '-of', 'default=nw=1:nk=1', str(path)], capture_output=True, text=True)
    return r.stdout.split()


def still_path(spec, c):
    return c['src'] if c['kind'] == 'image' else spec['dir'] / f"{c['id']}.png"


def check(spec, strict=True):
    """strict: every image / clip src must exist and fit (render); pages / shoot only warn (the agents may still be building)."""
    num, den = ffprobe(spec['spine'], 'stream=r_frame_rate')[0].split('/')
    fps = round(int(num) / int(den))
    dur = float(ffprobe(spec['spine'], 'format=duration')[0])
    R = spec['region']
    prev = 0.0
    for c in spec['cards']:
        if not (prev <= c['in'] < c['out'] <= dur):
            sys.exit(f"card {c['id']}: in/out {c['in']}-{c['out']} must be ascending, non-overlapping, inside 0-{dur:.2f}")
        if (round(c['out'] * fps) - round(c['in'] * fps)) < IN_FRAMES + round(OUT_S * fps) + fps:
            sys.exit(f"card {c['id']}: shorter than its entrance + exit + 1 s hold")
        prev = c['out']
        if c['kind'] != 'deck' and not c['src'].exists():
            if strict:
                sys.exit(f"card {c['id']}: src missing: {c['src']}")
            print(f"card {c['id']}: src not built yet: {c['src']}")
            continue
        if c['kind'] == 'image':
            from PIL import Image
            w, h = Image.open(c['src']).size
            if (w, h) != (R['w'], R['h']):
                sys.exit(f"card {c['id']}: image is {w}x{h}, the region is {R['w']}x{R['h']} (render it at the region size)")
        if c['kind'] == 'clip':
            w, h = (int(v) for v in ffprobe(c['src'], 'stream=width,height')[:2])
            n = int(ffprobe(c['src'], 'stream=nb_frames')[0])
            want = round(c['out'] * fps) - round(c['in'] * fps)
            if (w, h) != (R['w'], R['h']):
                sys.exit(f"card {c['id']}: clip is {w}x{h}, the region is {R['w']}x{R['h']} (render it at the region size)")
            if abs(n - want) > 2:
                print(f"card {c['id']}: clip has {n} frames, the window is {want}; "
                      f"{'the last frame is held' if n < want else 'it is trimmed'} to the window")
    return fps


def pages(spec):
    h = spec['deck'].read_text(encoding='utf-8')
    head, css = h[:h.find('<style>')], h[h.find('<style>') + 7:h.find('</style>')]
    R = spec['region']
    for c in spec['cards']:
        if c['kind'] != 'deck':
            continue
        body = (spec['dir'] / f"{c['id']}.body.html").read_text(encoding='utf-8')
        a, b = (c.get('orbs') or ['var(--accent-green)', 'var(--accent-cyan)'])[:2]
        orbs = (f'<div class="orb" style="width:760px;height:760px;background:{a};top:-300px;left:-240px;opacity:.28"></div>'
                f'<div class="orb" style="width:680px;height:680px;background:{b};bottom:-320px;right:-220px;opacity:.22"></div>')
        page = (head + '<style>' + css + STILL_CSS % R + '</style>\n</head>\n<body>\n'
                f'<div class="ov">{orbs}<div class="stage" style="zoom:{c.get("zoom", 1.5)}">\n{body}\n</div></div>\n'
                '</body>\n</html>\n')
        (spec['dir'] / f"{c['id']}.html").write_text(page, encoding='utf-8')
        print('page', c['id'] + '.html')


def shoot(spec):
    from playwright.sync_api import sync_playwright
    R = spec['region']
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': R['w'], 'height': R['h']})
        for c in spec['cards']:
            if c['kind'] != 'deck':
                continue
            f = spec['dir'] / f"{c['id']}.html"
            pg.goto(f.as_uri())
            pg.wait_for_load_state('networkidle')
            pg.evaluate('document.fonts.ready')
            fonts = sorted(set(pg.evaluate("[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)")))
            over = pg.evaluate("((w,h)=>{const r=document.querySelector('.stage').getBoundingClientRect();"
                               f"return r.left<0||r.top<0||r.right>{R['w']}||r.bottom>{R['h']}}})()")
            pg.screenshot(path=str(spec['dir'] / f"{c['id']}.png"))
            print('shot', c['id'] + '.png', 'fonts', fonts, 'OVERFLOWS THE REGION' if over else '')
        b.close()


def entrance(spec, c):
    from PIL import Image
    d = spec['dir'] / '_frames' / c['id']
    d.mkdir(parents=True, exist_ok=True)
    card = Image.open(still_path(spec, c)).convert('RGBA')
    W, H = card.size
    for i in range(IN_FRAMES):
        e = 1 - (1 - (i + 1) / IN_FRAMES) ** 3
        s = 0.93 + 0.07 * e
        w, h = round(W * s), round(H * s)
        sc = card.resize((w, h), Image.LANCZOS)
        sc.putalpha(sc.getchannel('A').point(lambda v: round(v * e)))
        fr = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        fr.paste(sc, ((W - w) // 2, (H - h) // 2), sc)
        fr.save(d / f'in_{i:02d}.png')
    return str(d / 'in_%02d.png')


def render(spec, fps):
    R = spec['region']
    args = ['ffmpeg', '-v', 'error', '-stats', '-y', '-i', str(spec['spine'])]
    graph, last, n_in = [], '0:v', 1
    for k, c in enumerate(spec['cards']):
        f_in, f_out = round(c['in'] * fps), round(c['out'] * fps)
        dur = (f_out - f_in) / fps
        if c['kind'] == 'clip':
            args += ['-i', str(c['src'])]
            graph.append(f'[{n_in}:v]format=rgba,tpad=stop_mode=clone:stop_duration={dur:.6f},trim=duration={dur:.6f},'
                         f'setpts=PTS-STARTPTS,fade=t=in:st=0:d={IN_FRAMES / fps:.6f}:alpha=1,'
                         f'fade=t=out:st={dur - OUT_S:.6f}:d={OUT_S}:alpha=1,setpts=PTS+{f_in}/({fps}*TB)[c{k}]')
            n_in += 1
        else:
            hold = (f_out - f_in - IN_FRAMES) / fps
            args += ['-framerate', str(fps), '-i', entrance(spec, c),
                     '-loop', '1', '-framerate', str(fps), '-t', f'{hold:.6f}', '-i', str(still_path(spec, c))]
            a, b = n_in, n_in + 1
            graph.append(f'[{a}:v]format=rgba[i{k}];[{b}:v]format=rgba[h{k}];[i{k}][h{k}]concat=n=2:v=1:a=0,'
                         f'fade=t=out:st={dur - OUT_S:.6f}:d={OUT_S}:alpha=1,setpts=PTS-STARTPTS+{f_in}/({fps}*TB)[c{k}]')
            n_in += 2
        graph.append(f"[{last}][c{k}]overlay=x={R['x']}:y={R['y']}:eof_action=pass:format=auto[v{k}]")
        last = f'v{k}'
    graph.append(f'[{last}]format=yuv420p[vout]')
    # passthrough keeps the spine's own frame timestamps (desilence joins leave small gaps): a forced -r 30
    # duplicated 19 frames on near-vs-tao and put the picture one frame behind the copied audio
    args += ['-filter_complex', ';'.join(graph), '-map', '[vout]', '-map', '0:a',
             '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-fps_mode', 'passthrough', '-c:a', 'copy',
             '-movflags', '+faststart', str(spec['out'])]
    print('render ->', spec['out'], flush=True)
    rc = subprocess.run(args).returncode
    if rc:
        sys.exit(rc)
    n_spine = ffprobe(spec['spine'], 'stream=nb_frames')[0]
    n_out = ffprobe(spec['out'], 'stream=nb_frames')[0]
    print(f'frames: spine {n_spine}  out {n_out}', 'OK' if n_spine == n_out else 'MISMATCH (timing drifted, do not deliver)')


def qa(spec):
    """Contact sheet: per card the frame before it, mid-entrance, the hold, mid-exit and after (one row each)."""
    from PIL import Image, ImageDraw
    out = spec['out']
    qa_dir = spec['dir'].parent / '_qa'
    qa_dir.mkdir(exist_ok=True)
    tw, th = 384, 216
    sheet = Image.new('RGB', (tw * 5, th * len(spec['cards'])), 'black')
    with tempfile.TemporaryDirectory() as tmp:
        for r, c in enumerate(spec['cards']):
            for col, t in enumerate((c['in'] - 0.3, c['in'] + 0.17, (c['in'] + c['out']) / 2, c['out'] - 0.12, c['out'] + 0.3)):
                p = os.path.join(tmp, f'{r}_{col}.png')
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', str(out), '-frames:v', '1',
                                '-vf', f'scale={tw}:{th}', p], check=True)
                im = Image.open(p).convert('RGB')
                ImageDraw.Draw(im).text((6, 4), f"{c['id']} {t:.2f}s", fill='white')
                sheet.paste(im, (col * tw, r * th))
    dst = qa_dir / (out.stem.replace(' ', '-') + '-cards-sheet.png')
    sheet.save(dst)
    print('qa sheet ->', dst)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('spec', help='media/standard/<project>/overlays/cards.json')
    ap.add_argument('--step', choices=['pages', 'shoot', 'render', 'qa', 'all'], default='all')
    a = ap.parse_args()
    spec = load(a.spec)
    fps = check(spec, strict=a.step in ('render', 'all'))
    if a.step in ('pages', 'all'):
        pages(spec)
    if a.step in ('shoot', 'all'):
        shoot(spec)
    if a.step in ('render', 'all'):
        render(spec, fps)
    if a.step in ('qa', 'all'):
        qa(spec)


if __name__ == '__main__':
    main()
