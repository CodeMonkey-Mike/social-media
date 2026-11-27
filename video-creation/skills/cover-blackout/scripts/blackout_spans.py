"""Bake BLACK over the video during COVER (non-FACE) spans, leaving the audio completely untouched.

For the gated-face longform-edited track: Mike records the whole chapter to camera, but only the
[FACE] beats may ever show his face; the [COVER] beats are him reading off-screen and must never be
seen. This paints those spans black so the spine itself is self-safe (b-roll layers on top in the
comp; any uncovered gap shows black, never the off-screen reading).

METHOD: we PAINT, never CUT (ffmpeg drawbox thickness=fill over the full frame, gated by `enable`).
Because nothing is removed, audio is copied verbatim and A/V cannot drift. Place every span edge
INSIDE a silence gap (chunk_map sil_before/sil_after) so no face frame flashes at the toggle.

Pass EITHER the spans to black out (--cover) OR the spans to keep as face (--face, the complement
over [0,duration] is blacked). See cover-blackout.md.

--rect x,y,w,h paints only that rectangle instead of the whole frame (2026-11-23: a wrong-channel CTA panel
recorded on a screen share). --crf N encodes libx264 at that crf instead of the NVENC 2 Mbps default: use it
whenever the painted file is a DELIVERABLE spine (a presentation spine is; a longform-edited blackout base is not).
Span edges are frame-exact on the file's own timestamps: a frame is painted when start <= t < end.

Usage:
    python blackout_spans.py "spine/CH1.defumbled.mp4" --out "spine/CH1.blackout.mp4" \
        --cover 13.259-63.879 --cover 88.40-140.10 ...
    python blackout_spans.py "spine/CH1.defumbled.mp4" --out "spine/CH1.blackout.mp4" \
        --face 5.73-10.50 --face 67.25-73.56          # blackout everything else
    python blackout_spans.py "spine/ALL.a.defumbled.mp4" --out "spine/ALL.b.blackout.mp4"         --rect 1400,0,520,400 --crf 18 --cover 64.633-239.100   # one rectangle, deliverable encode
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


def parse_spans(items):
    out = []
    for c in items:
        a, b = c.split("-")
        out.append((float(a), float(b)))
    out.sort()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", required=True)
    ap.add_argument("--cover", action="append", default=[], help="span to BLACK OUT, 'start-end' in seconds (repeatable)")
    ap.add_argument("--face", action="append", default=[], help="span to KEEP as face; the complement is blacked (repeatable)")
    ap.add_argument("--bps", default="2M")
    ap.add_argument("--rect", default=None, help="x,y,w,h: paint only this rectangle (default: the whole frame)")
    ap.add_argument("--crf", type=int, default=None,
                    help="libx264 at this crf instead of NVENC --bps (deliverable spines, e.g. 18)")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print("no such file:", args.src); sys.exit(1)
    if bool(args.cover) == bool(args.face):
        print("pass EITHER --cover (spans to black) OR --face (spans to keep), not both / neither"); sys.exit(1)

    total = dur(args.src)

    if args.cover:
        covers = parse_spans(args.cover)
    else:  # derive blackout spans as the complement of the kept face spans
        faces = parse_spans(args.face)
        covers, cur = [], 0.0
        for a, b in faces:
            if a > cur:
                covers.append((cur, a))
            cur = max(cur, b)
        if cur < total:
            covers.append((cur, total))

    blacked = sum(b - a for a, b in covers)
    print(f"src {total:.2f}s; blacking {len(covers)} span(s) totaling {blacked:.2f}s "
          f"({100*blacked/total:.0f}% of runtime)")
    for a, b in covers:
        print(f"  BLACK {a:.3f}-{b:.3f} ({b-a:.2f}s)")

    enable = "+".join(f"gte(t,{a:.4f})*lt(t,{b:.4f})" for a, b in covers)
    if args.rect:
        x, y, w, h = (int(v) for v in args.rect.split(","))
        box = f"x={x}:y={y}:w={w}:h={h}"
        print(f"  rectangle only: {box}")
    else:
        box = "x=0:y=0:w=iw:h=ih"
    vf = (f"drawbox={box}:color=black@1.0:thickness=fill:enable='{enable}'")

    import json
    with open(args.out + ".cover.json", "w", encoding="utf-8") as f:
        json.dump({"src": args.src, "blackout": covers, "total": total, "rect": args.rect}, f, indent=1)

    if args.crf is not None:
        venc = ["-c:v", "libx264", "-crf", str(args.crf), "-preset", "medium", "-pix_fmt", "yuv420p"]
    else:
        venc = ["-c:v", "h264_nvenc", "-rc", "vbr", "-b:v", args.bps,
                "-maxrate", "2.5M", "-bufsize", "4M", "-preset", "p5"]

    r = subprocess.run(["ffmpeg", "-y", "-i", args.src,
                        "-vf", vf,
                        "-map", "0:v:0", "-map", "0:a:0",
                        *venc, "-fps_mode", "passthrough",
                        "-c:a", "copy", args.out], capture_output=True, text=True)
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", r.stderr[-1800:]); sys.exit(1)

    vd, ad, od = stream_dur(args.out, "v"), stream_dur(args.out, "a"), dur(args.out)
    print(f"DONE  {total:.2f}s -> {od:.2f}s   (video {vd:.2f}/audio {ad:.2f}, drift {abs(vd-ad)*1000:.0f}ms)")
    print(f"out={args.out}")


if __name__ == "__main__":
    main()
