"""stitch.py — assemble the deliverable: EDIT head + rendered spotlight middle (parts) + EDIT tail, ONE ffmpeg pass.

Part of longform-presentation/skills/spotlight (read spotlight.md first).

The middle window [head_until, tail_from) of the EDIT is replaced by the Remotion parts' VIDEO; its AUDIO is the
EDIT's own audio for that window (the parts are rendered --muted) with the planned CHAPTER PAUSES inserted as
exact digital silence (spot_common.middle_audio_graph; the comp rendered the matching freeze), so the whole
deliverable's audio is the untouched EDIT track plus silences and A/V stays locked by construction. Everything
is cut and joined with filter_complex trim/atrim + concat in a single pass (the track's hard rule: NEVER the
concat demuxer, it drifts).

Checks before encoding: every part is 1920x1080 at the spec fps and the parts' frame counts sum to exactly the
resolved spec's `timeline.middle_frames`. After: durations (EDIT + pauses), A/V drift (< 50 ms), a frame either
side of both seams and one in the middle of every chapter pause written to <project>/_qa/ for a look.

Usage:
  python stitch.py --edit "<project> EDIT.mp4" --project "<media/<project>>" --out "<project> FINAL-v1.mp4" [--crf 18]
  (parts are picked up from <project>/_previews/<project>-middle-part*.mp4; --parts overrides)
"""
import argparse, glob, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from spot_common import load_resolved, timeline, audio_format, middle_audio_graph, describe  # noqa: E402


def probe(p):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames",
                                   "-show_entries", "stream=width,height,r_frame_rate,nb_read_frames",
                                   "-of", "json", p]).decode()
    s = json.loads(out)["streams"][0]
    num, den = s["r_frame_rate"].split("/")
    return int(s["width"]), int(s["height"]), float(num) / float(den), int(s["nb_read_frames"])


def stream_dur(p, kind):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", f"{kind}:0", "-show_entries",
                                   "stream=duration", "-of", "csv=p=0", p]).decode().strip().rstrip(",")
    return float(out) if out else float("nan")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--edit", required=True)
    ap.add_argument("--project", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--parts", nargs="*", help="override the middle parts (in order)")
    ap.add_argument("--crf", type=int, default=18)
    args = ap.parse_args()

    project = os.path.abspath(args.project)
    name = os.path.basename(project)
    spec = load_resolved(project)
    tl = timeline(spec)
    fps, head, tail, want = tl["fps"], tl["head"], tl["tail"], tl["middle_frames"]
    print(f"{name}: {describe(tl)}")
    parts = args.parts or sorted(glob.glob(os.path.join(project, "_previews", f"{name}-middle-part*.mp4")))
    if not parts:
        sys.exit("no middle parts found")
    total = 0
    for p in parts:
        w, h, pf, n = probe(p)
        if (w, h) != (1920, 1080) or abs(pf - fps) > 0.01:
            sys.exit(f"{p}: {w}x{h} @ {pf} (want 1920x1080 @ {fps})")
        total += n
        print(f"part {os.path.basename(p)}: {n} frames")
    if total != want:
        sys.exit(f"parts hold {total} frames, the middle window needs {want} (= ({tail} - {head} + "
                 f"{tl['pause_total']} s of pauses) x {fps}); re-render the missing range before stitching")
    edit_total = stream_dur(args.edit, "v")
    print(f"EDIT {edit_total:.3f}s; head [0,{head}) + middle {total} frames + tail [{tail},end)")

    # filter graph: head v/a from the EDIT, middle v = parts concat (video only) + a = EDIT slices with the chapter
    # pauses' silence inserted, tail v/a from the EDIT
    n = len(parts)
    sr, layout = audio_format(args.edit)
    # the EDIT's video is trimmed by FRAME NUMBER (a boundary like 1176.7667 s written as seconds lands on either side
    # of the frame at 1176.76667 depending on rounding; frames are the exact unit), its audio by sample-exact seconds
    fc = [f"[0:v]trim=start_frame=0:end_frame={round(head * fps)},setpts=PTS-STARTPTS[hv];",
          f"[0:a]atrim=start=0:end={head:.6f},asetpts=PTS-STARTPTS[ha];"]
    for i in range(n):
        fc.append(f"[{i+1}:v]setpts=PTS-STARTPTS[p{i}];")
    fc.append("".join(f"[p{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0[mv];")
    fc.extend(middle_audio_graph(tl, sr, layout))
    fc.append(f"[0:v]trim=start_frame={round(tail * fps)},setpts=PTS-STARTPTS[tv];")
    fc.append(f"[0:a]atrim=start={tail:.6f},asetpts=PTS-STARTPTS[ta];")
    fc.append("[hv][ha][mv][ma][tv][ta]concat=n=3:v=1:a=1[outv][outa]")
    fc_path = args.out + ".filter.txt"
    with open(fc_path, "w", encoding="utf-8") as f:
        f.write("\n".join(fc))
    cmd = ["ffmpeg", "-y", "-i", args.edit] + sum([["-i", p] for p in parts], []) + \
          ["-filter_complex_script", fc_path, "-map", "[outv]", "-map", "[outa]",
           "-c:v", "libx264", "-crf", str(args.crf), "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(fps),
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", args.out]
    print("encoding ->", args.out, flush=True)
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        os.remove(fc_path)
    except OSError:
        pass
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", r.stderr[-2500:]); sys.exit(1)

    vd, ad = stream_dur(args.out, "v"), stream_dur(args.out, "a")
    expect = edit_total + tl["pause_total"]  # the EDIT plus the inserted pauses (the middle replaces, never shortens)
    print(f"DONE  video {vd:.3f}s / audio {ad:.3f}s (EDIT {edit_total:.3f}s + pauses {tl['pause_total']:.2f}s = "
          f"{expect:.3f}s, delta {vd-expect:+.3f}s)  A/V drift {abs(vd-ad)*1000:.0f} ms -> "
          f"{'OK' if abs(vd-ad) < 0.05 else 'CHECK'}")
    qa = os.path.join(project, "_qa"); os.makedirs(qa, exist_ok=True)
    for label, t in (("seam1", head), ("seam2", tl["tail_paused"])):
        for off in (-1.0 / fps, 1.0 / fps):
            tt = max(0.0, t + off)
            dst = os.path.join(qa, f"{name}-{label}-{'before' if off < 0 else 'after'}.jpg")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{tt:.3f}", "-i", args.out, "-frames:v", "1", dst])
    for p in spec.get("timeline", {}).get("pauses", []):
        tt = p["t_paused"] + p["dur"] / 2.0
        dst = os.path.join(qa, f"{name}-pause-{p['scene']}.jpg")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{tt:.3f}", "-i", args.out, "-frames:v", "1", dst])
    print("seam + pause frames ->", qa)
    print("out =", args.out)


if __name__ == "__main__":
    main()
