"""
cut-silences.py  —  Remove silent gaps from a video file.

Usage:
    python cut-silences.py --input <path> --output <path>
                           [--noise -35dB] [--duration 0.4] [--pad 0.05]

Output:
    <output>.mp4          — silence-cut video
    <output>.timemap.txt  — shows original timestamps of kept segments
                            (useful for re-calibrating b-roll cues in HTML)
"""

import subprocess, re, sys, os, tempfile, argparse

def detect_silences(input_file, noise='-35dB', duration=0.4):
    cmd = [
        'ffmpeg', '-i', input_file,
        '-af', f'silencedetect=noise={noise}:duration={duration}',
        '-f', 'null', '-'
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    stderr = result.stderr

    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', stderr)]
    ends   = [float(x) for x in re.findall(r'silence_end: ([\d.]+)',   stderr)]

    # Handle trailing silence with no end timestamp
    if len(starts) > len(ends):
        ends.append(float(1e9))

    return list(zip(starts, ends))


def get_duration(input_file):
    cmd = ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
           '-of', 'csv=p=0', input_file]
    return float(subprocess.check_output(cmd).decode().strip())


def build_segments(silences, total_dur, pad=0.05, min_seg=0.15):
    """Convert silence list to (start, end) segments of speech."""
    segments = []
    prev_end = 0.0

    for s_start, s_end in silences:
        seg_start = prev_end
        seg_end   = min(s_start + pad, total_dur)  # keep a tiny tail before silence
        if seg_end - seg_start >= min_seg:
            segments.append((seg_start, seg_end))
        prev_end = max(s_end - pad, 0)              # start next segment just before silence ends

    # Tail after last silence
    if total_dur - prev_end >= min_seg:
        segments.append((prev_end, total_dur))

    return segments


def cut(input_file, output_file, noise='-35dB', duration=0.4, pad=0.05):
    print(f'Detecting silences  (noise={noise}, min_duration={duration}s)...')
    silences = detect_silences(input_file, noise, duration)
    total_dur = get_duration(input_file)
    print(f'  Found {len(silences)} silent sections. Total duration: {total_dur:.1f}s')

    segments = build_segments(silences, total_dur, pad)
    print(f'  Keeping {len(segments)} speech segments.')

    if not segments:
        print('ERROR: no segments found — check noise/duration thresholds.')
        sys.exit(1)

    # Build FFmpeg select/concat filter
    # We use the select filter with setpts to remove gaps
    select_parts = '+'.join(
        f'between(t,{s:.4f},{e:.4f})' for s, e in segments
    )
    vf = f"select='{select_parts}',setpts=N/FRAME_RATE/TB"
    af = f"aselect='{select_parts}',asetpts=N/SR/TB"

    cmd = [
        'ffmpeg', '-i', input_file,
        '-vf', vf,
        '-af', af,
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
        '-c:a', 'aac', '-b:a', '128k',
        output_file, '-y'
    ]

    print(f'\nCutting...')
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print('FFmpeg error:')
        print(result.stderr[-2000:])
        sys.exit(1)

    new_dur = get_duration(output_file)
    removed = total_dur - new_dur
    print(f'\n✓ Done.')
    print(f'  Original : {total_dur:.1f}s')
    print(f'  Trimmed  : {new_dur:.1f}s  (removed {removed:.1f}s of silence)')
    print(f'  Output   : {output_file}')

    # Write timemap — useful for re-calibrating HTML b-roll cues
    timemap_path = output_file.replace('.mp4', '.timemap.txt')
    new_t = 0.0
    with open(timemap_path, 'w') as f:
        f.write('# original_start  original_end  new_start  new_end  duration\n')
        for orig_s, orig_e in segments:
            seg_dur = orig_e - orig_s
            f.write(f'{orig_s:.3f}  {orig_e:.3f}  {new_t:.3f}  {new_t+seg_dur:.3f}  {seg_dur:.3f}\n')
            new_t += seg_dur
    print(f'  Timemap  : {timemap_path}')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--input',    required=True)
    ap.add_argument('--output',   required=True)
    ap.add_argument('--noise',    default='-35dB')
    ap.add_argument('--duration', type=float, default=0.4)
    ap.add_argument('--pad',      type=float, default=0.05)
    args = ap.parse_args()

    if not os.path.exists(args.input):
        print(f'Input not found: {args.input}'); sys.exit(1)

    cut(args.input, args.output, args.noise, args.duration, args.pad)
