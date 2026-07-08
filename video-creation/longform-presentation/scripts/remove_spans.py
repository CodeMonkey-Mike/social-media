"""Remove explicit time spans from a video (fumbles, false starts, dead takes) while keeping
A/V locked. Same single-pass filter_complex (trim+atrim+concat) the desilence step uses, so
audio and video cannot drift. Cuts are the COMPLEMENT of the kept spans over [0, duration].

Usage:
    python remove_spans.py "media/<file>.mp4" --out "media/<out>.mp4" \
        --cut 106.70-108.02 --cut 167.94-174.62 ...
"""
import argparse, os, subprocess, sys


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", p]).decode().strip())


def stream_dur(p, kind):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", f"{kind}:0",
         "-show_entries", "stream=duration", "-of", "csv=p=0", p]).decode().strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", required=True)
    ap.add_argument("--cut", action="append", default=[], help="span to REMOVE, 'start-end' in seconds")
    ap.add_argument("--bps", default="2M")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print("no such file:", args.src); sys.exit(1)
    total = dur(args.src)

    cuts = []
    for c in args.cut:
        a, b = c.split("-")
        cuts.append((float(a), float(b)))
    cuts.sort()
    removed = sum(b - a for a, b in cuts)

    # keeps = complement of cuts over [0, total]
    keeps, cur = [], 0.0
    for a, b in cuts:
        if a > cur:
            keeps.append((cur, a))
        cur = max(cur, b)
    if cur < total:
        keeps.append((cur, total))

    print(f"src {total:.2f}s; removing {len(cuts)} span(s) totaling {removed:.2f}s -> {len(keeps)} keep spans")

    parts, labels = [], []
    for i, (a, b) in enumerate(keeps):
        parts.append(f"[0:v]trim=start={a:.3f}:end={b:.3f},setpts=PTS-STARTPTS[v{i}];")
        parts.append(f"[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS[a{i}];")
        labels.append(f"[v{i}][a{i}]")
    parts.append("".join(labels) + f"concat=n={len(keeps)}:v=1:a=1[outv][outa]")
    fc_path = args.out + ".filter.txt"
    with open(fc_path, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))

    r = subprocess.run(["ffmpeg", "-y", "-i", args.src,
                        "-filter_complex_script", fc_path,
                        "-map", "[outv]", "-map", "[outa]",
                        "-c:v", "h264_nvenc", "-rc", "vbr", "-b:v", args.bps,
                        "-maxrate", "2.5M", "-bufsize", "4M", "-preset", "p5",
                        "-c:a", "aac", "-b:a", "128k", args.out], capture_output=True, text=True)
    try: os.remove(fc_path)
    except OSError: pass
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", r.stderr[-1800:]); sys.exit(1)

    vd, ad, od = stream_dur(args.out, "v"), stream_dur(args.out, "a"), dur(args.out)
    print(f"DONE  {total:.2f}s -> {od:.2f}s   (video {vd:.2f}/audio {ad:.2f}, drift {abs(vd-ad)*1000:.0f}ms)")
    print(f"out={args.out}")


if __name__ == "__main__":
    main()
