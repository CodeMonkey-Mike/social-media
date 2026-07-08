"""Phase 1 of the longform-presentation pipeline: transcode a raw screen recording
(OBS .mkv, usually ~6 Mbps 1080p30) down to a lighter "LOW BPS" mp4 for everything
downstream (transcribe, deck-sync, Remotion).

Unlike the livestream flow's longform_desilence_fast.py, this does NOT cut silences:
a presentation's pauses are intentional. It is a pure single-pass NVENC transcode.

bitrate is a parameter. Default 2M (presentations stay readable at 2 Mbps; the livestream
flow goes as low as 0.7M, which is too soft for slide text and code on screen).

Usage:
    python to_low_bps.py "media/<recording>.mkv"            # -> "<recording> LOW BPS.mp4", 2 Mbps
    python to_low_bps.py "media/<recording>.mkv" --bps 2.5M
    python to_low_bps.py "media/<recording>.mkv" --out media/foo.mp4
"""
import argparse, os, subprocess, sys


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", p]).decode().strip())


def main():
    ap = argparse.ArgumentParser(description="Transcode a recording to a lower-bitrate mp4 (no silence cutting).")
    ap.add_argument("src", help="source video (e.g. an OBS .mkv)")
    ap.add_argument("--bps", default="2M",
                    help="target video bitrate (ffmpeg syntax, e.g. 2M, 2500k). Default 2M.")
    ap.add_argument("--out", default=None,
                    help='output path. Default: same folder, "<name> LOW BPS.mp4".')
    args = ap.parse_args()

    src = args.src
    if not os.path.isfile(src):
        print(f"no such file: {src}"); sys.exit(1)

    out = args.out or os.path.join(
        os.path.dirname(src),
        os.path.splitext(os.path.basename(src))[0] + " LOW BPS.mp4")

    # maxrate/bufsize scale off the target so the cap tracks --bps (VBR with headroom for text/motion).
    def _to_bits(s):
        s = s.strip().upper()
        if s.endswith("M"):
            return int(float(s[:-1]) * 1_000_000)
        if s.endswith("K"):
            return int(float(s[:-1]) * 1_000)
        return int(s)
    b = _to_bits(args.bps)
    maxrate = f"{int(b * 1.25)}"
    bufsize = f"{int(b * 2)}"

    D = dur(src)
    print(f"transcoding {os.path.basename(src)}  ({D:.1f}s)  ->  {args.bps} video / aac 128k")
    cmd = ["ffmpeg", "-y", "-i", src,
           "-c:v", "h264_nvenc", "-rc", "vbr", "-b:v", args.bps,
           "-maxrate", maxrate, "-bufsize", bufsize, "-preset", "p5",
           "-c:a", "aac", "-b:a", "128k", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", r.stderr[-1500:]); sys.exit(1)

    src_mb = os.path.getsize(src) / 1e6
    out_mb = os.path.getsize(out) / 1e6
    print(f"DONE  {src_mb:.0f}MB -> {out_mb:.0f}MB   out={out}")


if __name__ == "__main__":
    main()
