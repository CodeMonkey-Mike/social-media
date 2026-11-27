"""Phase 1 of the longform-presentation pipeline: transcode a raw screen recording
(OBS .mkv, usually ~6 Mbps 1080p30) down to a lighter "LOW BPS" mp4 for everything
downstream (transcribe, deck-sync, Remotion).

Unlike the livestream flow's longform_desilence_fast.py, this does NOT cut silences:
a presentation's pauses are intentional. It is a pure single-pass NVENC transcode.

bitrate is a parameter. Default 2M (presentations stay readable at 2 Mbps; the livestream
flow goes as low as 0.7M, which is too soft for slide text and code on screen).

SEVERAL sources = the takes of ONE recording (Mike stopped the recorder and started it again,
e.g. Chapter 1 as one file and the rest as another; plan-to-make-millions, 2026-11-23). They are
joined in the order given into ONE proxy by the concat FILTER (sync-safe: every take starts on a
common timestamp, a take whose audio ends before its picture is padded with silence; never the
concat demuxer), in the same single encode. Nothing is cut. `<out>.takes.json` (the proxy's name
with `.takes.json` in place of `.mp4`) records where each take starts in the proxy.

Usage:
    python to_low_bps.py "media/<recording>.mkv"            # -> "<recording> LOW BPS.mp4", 2 Mbps
    python to_low_bps.py "media/<recording>.mkv" --bps 2.5M
    python to_low_bps.py "media/<recording>.mkv" --out media/foo.mp4
    python to_low_bps.py "raw/<take 1>.mkv" "raw/<take 2>.mkv" --out spine/ALL.lowbps.mp4
"""
import argparse, json, os, subprocess, sys


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", p]).decode().strip())


def _stream(p, sel, entries):
    """One stream's fields as a list of strings (ffprobe csv), [] when the stream is missing."""
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", sel, "-show_entries",
                        f"stream={entries}", "-of", "csv=p=0", p], capture_output=True, text=True)
    return [x for x in r.stdout.strip().split("\n")[0].split(",") if x] if r.stdout.strip() else []


def main():
    ap = argparse.ArgumentParser(description="Transcode a recording to a lower-bitrate mp4 (no silence cutting).")
    ap.add_argument("src", nargs="+",
                    help="source video (e.g. an OBS .mkv). Several sources = the takes of one recording, "
                         "joined in the order given into ONE proxy (needs --out)")
    ap.add_argument("--bps", default="2M",
                    help="target video bitrate (ffmpeg syntax, e.g. 2M, 2500k). Default 2M.")
    ap.add_argument("--out", default=None,
                    help='output path. Default: same folder, "<name> LOW BPS.mp4".')
    args = ap.parse_args()

    srcs = args.src
    for s in srcs:
        if not os.path.isfile(s):
            print(f"no such file: {s}"); sys.exit(1)
    if len(srcs) > 1 and not args.out:
        print("several sources are joined into ONE proxy: pass --out"); sys.exit(1)
    src = srcs[0]

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
    enc = ["-c:v", "h264_nvenc", "-rc", "vbr", "-b:v", args.bps,
           "-maxrate", maxrate, "-bufsize", bufsize, "-preset", "p5",
           "-c:a", "aac", "-b:a", "128k"]

    durs = [dur(s) for s in srcs]
    if len(srcs) == 1:
        print(f"transcoding {os.path.basename(src)}  ({durs[0]:.1f}s)  ->  {args.bps} video / aac 128k")
        cmd = ["ffmpeg", "-y", "-i", src, *enc, out]
    else:
        # the concat filter needs the same picture and sound shape in every take: refuse a mismatch by name
        shapes = [(_stream(s, "v:0", "width,height,r_frame_rate"), _stream(s, "a:0", "sample_rate,channels")) for s in srcs]
        for s, sh in zip(srcs, shapes):
            if not sh[0] or not sh[1]:
                print(f"TAKE WITHOUT A VIDEO OR AN AUDIO STREAM: {os.path.basename(s)}"); sys.exit(1)
            if sh != shapes[0]:
                print(f"TAKES DIFFER: {os.path.basename(s)} is {sh}, {os.path.basename(src)} is {shapes[0]} "
                      "(same resolution, frame rate, sample rate and channels are required to join them)"); sys.exit(1)
        fps = shapes[0][0][2]
        n = len(srcs)
        graph = "".join(f"[{i}:v:0][{i}:a:0]" for i in range(n)) + f"concat=n={n}:v=1:a=1[v][a]"
        inputs = []
        for s in srcs:
            inputs += ["-i", s]
        print(f"joining {n} takes in this order ({sum(durs):.1f}s)  ->  {args.bps} video / aac 128k")
        for s, d in zip(srcs, durs):
            print(f"  take: {os.path.basename(s)}  ({d:.1f}s)")
        cmd = ["ffmpeg", "-y", *inputs, "-filter_complex", graph, "-map", "[v]", "-map", "[a]",
               "-r", fps, "-fps_mode", "cfr", *enc, out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", r.stderr[-1500:]); sys.exit(1)

    if len(srcs) > 1:
        takes, t = [], 0.0
        for s, d in zip(srcs, durs):
            takes.append({"file": os.path.basename(s), "start": round(t, 3), "duration": round(d, 3)})
            t += d
        side = os.path.splitext(out)[0] + ".takes.json"
        with open(side, "w", encoding="utf-8") as f:
            json.dump({"proxy": os.path.basename(out), "takes": takes}, f, indent=2)
        print("TAKES " + " | ".join(f"{k['file']} starts at {k['start']:.2f}s" for k in takes) + f"  -> {side}")

    src_mb = sum(os.path.getsize(s) for s in srcs) / 1e6
    out_mb = os.path.getsize(out) / 1e6
    print(f"DONE  {src_mb:.0f}MB -> {out_mb:.0f}MB   out={out}")


if __name__ == "__main__":
    main()
