"""Two-zone desilence + fumble removal in ONE sync-safe pass.

  * 0..split          : cut silences >= sil_pre  (tighter intro)
  * split..end        : cut silences >= sil_post (looser; keeps short pauses)
  * --cut a-b spans   : remove explicitly (fumbles / false starts), anywhere

All cuts are merged, complemented over [0,duration], and rendered with a single
filter_complex (trim+atrim+concat) so audio and video stay locked.

Usage:
    python build_two_zone.py "media/<file>.mp4" --out "media/<out>.mp4" \
        --split 90 --sil-pre 0.5 --sil-post 1.0 \
        --cut 97.5-107.06 --cut 242.2-265.42 ...
"""
import argparse, os, re, subprocess, sys


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", p]).decode().strip())


def stream_dur(p, kind):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", f"{kind}:0",
         "-show_entries", "stream=duration", "-of", "csv=p=0", p]).decode().strip())


def detect_silences(src, noise, d):
    r = subprocess.run(["ffmpeg", "-i", src, "-af",
                        f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"],
                       capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", r.stderr)]
    spans = []
    for s in starts:
        e = next((e for e in ends if e > s), None)
        if e is not None:
            spans.append((s, e))
    return spans


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", required=True)
    ap.add_argument("--split", type=float, default=90.0)
    ap.add_argument("--sil-pre", type=float, default=0.5)
    ap.add_argument("--sil-post", type=float, default=1.0)
    ap.add_argument("--noise", default="-50dB")
    ap.add_argument("--pad", type=float, default=0.06)
    ap.add_argument("--cut", action="append", default=[], help="explicit span to remove 'a-b'")
    ap.add_argument("--bps", default="2M")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print("no such file:", args.src); sys.exit(1)
    total = dur(args.src)

    # silence detection at the finer threshold captures everything; zone rule filters post-split
    raw = detect_silences(args.src, args.noise, min(args.sil_pre, args.sil_post))
    sil_cuts = []
    for s, e in raw:
        zone_min = args.sil_pre if s < args.split else args.sil_post
        if (e - s) >= zone_min:
            a = s + args.pad
            b = max(a, e - args.pad)
            if b - a > 0.05:
                sil_cuts.append((a, b))

    fumble_cuts = []
    for c in args.cut:
        a, b = c.split("-")
        fumble_cuts.append((float(a), float(b)))

    cuts = sorted(sil_cuts + fumble_cuts)
    # merge / complement
    keeps, cur = [], 0.0
    merged = 0.0
    for a, b in cuts:
        if a > cur:
            keeps.append((cur, a))
        merged += max(0.0, b - max(a, cur))
        cur = max(cur, b)
    if cur < total:
        keeps.append((cur, total))

    print(f"src {total:.2f}s | {len(sil_cuts)} silence cuts + {len(fumble_cuts)} fumble cuts "
          f"= {merged:.1f}s removed -> {len(keeps)} keep spans")

    # Persist the exact spans next to the output — the EDIT4 (banks-own-chain) cut list was
    # unrecoverable because only the transient filter file ever held it.
    import json
    with open(args.out + ".spans.json", "w", encoding="utf-8") as f:
        json.dump({"src": args.src, "args": vars(args), "keeps": keeps,
                   "sil_cuts": sil_cuts, "fumble_cuts": fumble_cuts}, f, indent=1)

    parts, labels = [], []
    for i, (a, b) in enumerate(keeps):
        d = b - a
        # DECLICK (mandatory, same as the shorts cutter): 8ms fade in/out per kept span forces
        # every concat join to zero amplitude. Without it each splice is a waveform
        # discontinuity -> audible pop (heard on banks-own-chain FINAL, 2026-06-11).
        fade = f",afade=t=in:st=0:d=0.008,afade=t=out:st={max(0.0, d - 0.008):.3f}:d=0.008" if d > 0.02 else ""
        parts.append(f"[0:v]trim=start={a:.3f}:end={b:.3f},setpts=PTS-STARTPTS[v{i}];")
        parts.append(f"[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS{fade}[a{i}];")
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
