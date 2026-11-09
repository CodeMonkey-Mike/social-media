# remux_enhanced.py: put Mike's Adobe Enhance Speech track back onto the EDIT's video stream (card-overlays.md,
# procedure step 1). The EDIT's audio was handed to him as a WAV; what comes back is audio only (wav / mp3 / m4a) or
# a video with the enhanced track. Either way: the video stream is COPIED from the EDIT (never re-encoded), the
# enhanced audio is encoded AAC 48 kHz 192 kb/s, and the result is refused if the two lengths differ by more than a
# frame (an Enhance pass must not change the timeline; the overlays are cued on the EDIT).
#
#   python remux_enhanced.py "media/standard/<p>/spine/<p> EDIT.mp4" "<enhanced file>" --out "media/standard/<p>/spine/<p> EDIT.enhanced.mp4"
import argparse, subprocess, sys


def probe(path, stream, entries):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', stream, '-show_entries', entries,
                        '-of', 'default=nw=1:nk=1', path], capture_output=True, text=True)
    return r.stdout.split()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('edit')
    ap.add_argument('enhanced')
    ap.add_argument('--out', required=True)
    ap.add_argument('--tolerance', type=float, default=0.05, help='seconds; default about a frame and a half')
    a = ap.parse_args()
    v_dur = float(probe(a.edit, 'v:0', 'stream=duration')[0])
    e_dur = float(probe(a.enhanced, 'a:0', 'stream=duration')[0])
    print(f'EDIT video {v_dur:.3f}s  enhanced audio {e_dur:.3f}s  delta {e_dur - v_dur:+.3f}s')
    if abs(e_dur - v_dur) > a.tolerance:
        sys.exit('the enhanced track is not the EDIT length: wrong source file, or Enhance changed the timeline; not remuxed')
    rc = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.edit, '-i', a.enhanced, '-map', '0:v:0', '-map', '1:a:0',
                         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest',
                         '-movflags', '+faststart', a.out]).returncode
    if rc:
        sys.exit(rc)
    n_edit, n_out = probe(a.edit, 'v:0', 'stream=nb_frames')[0], probe(a.out, 'v:0', 'stream=nb_frames')[0]
    md5 = lambda p: subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-map', '0:v:0', '-c', 'copy', '-f', 'md5', '-'],
                                   capture_output=True, text=True).stdout.strip()
    same = md5(a.edit) == md5(a.out)
    print(f'frames EDIT {n_edit} out {n_out}; video stream identical: {same}')
    # audio offset at five points, on FULLY decoded audio. Never measure this with `-ss` into the mp4: input seeking
    # into AAC showed phantom +32 ms / +59 ms jumps at exactly 300 s and 600 s on binance (2026-10-31) that a full
    # decode proved were not there (0.1 ms everywhere).
    import numpy as np
    def full(p):
        r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], capture_output=True)
        return np.frombuffer(r.stdout, dtype=np.int16).astype(np.float64)
    x, y = full(a.edit), full(a.out)
    worst = 0.0
    for k in range(1, 6):
        i, n, pad = int(len(x) * k / 6.5), 6 * 48000, 4800
        seg, win = x[i + pad:i + n - pad], y[i:i + n]
        if len(win) < n or not seg.any():
            continue
        off = (np.argmax(np.correlate(win, seg, mode='valid')) - pad) / 48
        worst = max(worst, abs(off))
        print(f'  audio offset at {i / 48000:6.1f}s: {off:+.2f} ms')
    ok = n_edit == n_out and same and worst < 5
    print('spine ->', a.out, 'OK' if ok else 'CHECK FAILED, do not use')


if __name__ == '__main__':
    main()
