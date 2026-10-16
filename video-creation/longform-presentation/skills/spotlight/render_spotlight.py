"""render_spotlight.py — render the spotlight comp's middle window in frame-range PARTS, resume-safe.

Part of longform-presentation/skills/spotlight (read spotlight.md first).

Why parts: a long Remotion render on this Windows machine dies in its final ffmpeg stitch once the Chrome
workers have eaten the desktop heap (the ~14k-frame handle ceiling, 2026-07-07); the fix is frame-range renders
well under it, joined afterwards by ONE standalone ffmpeg (stitch.py does that join together with the EDIT's
head/tail, sync-safe filter_complex). Every part is verified by frame count; an existing good part is skipped,
so a killed run is simply re-run.

Renders are --muted: the middle's audio comes from the EDIT at stitch time (no Remotion AAC lag in the
deliverable). The render --public-dir is the project's small `render-assets/` folder (NOT video-creation/assets,
which is multi-GB and gets copied into every bundle); --prep-audio fills it with the middle-window audio slice
(chapter pauses inserted, exactly as the stitcher will) for Studio / QA listening.

The middle window and its frame count come from the resolved spec's `timeline` block (spot_common.py): the
EDIT window [head_until, tail_from) PLUS the planned chapter pauses.

Usage (from anywhere):
  python render_spotlight.py --project "<media/<project>>" --comp <CompId> --edit "<project> EDIT.mp4" --prep-audio
  python render_spotlight.py --project "<media/<project>>" --comp <CompId>                 # all parts (resume-safe)
  python render_spotlight.py --project ... --comp ... --frames 0-300 --with-audio          # one probe chunk, audible
A full run takes tens of minutes: launch it detached with a log (see the skill doc) and poll; never as a tracked
background task. Outputs: <project>/_previews/<project>-middle-partNN.mp4 (+ .log each); probes land there too.
"""
import argparse, glob, os, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
REMOTION = os.path.normpath(os.path.join(HERE, "..", "..", "..", "remotion"))
sys.path.insert(0, HERE)
from spot_common import load_resolved, timeline, audio_format, middle_audio_graph, describe  # noqa: E402


def nb_frames(p):
    try:
        out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames",
                                       "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", p]).decode()
        return int(out.strip().rstrip(","))      # ffprobe's csv writer leaves a trailing comma
    except Exception:
        return -1


def run_render(comp, out, frames, crf, public_dir, concurrency, muted, log):
    cmd = ["npx", "remotion", "render", "src/index.ts", comp, out, f"--frames={frames[0]}-{frames[1]}",
           f"--crf={crf}", "--public-dir", public_dir, f"--concurrency={concurrency}", "--log=verbose"]
    if muted:
        cmd.append("--muted")
    print(" ".join(cmd), flush=True)
    with open(log, "w", encoding="utf-8") as lf:
        lf.write(" ".join(cmd) + "\n")
        r = subprocess.run(cmd, cwd=REMOTION, stdout=lf, stderr=subprocess.STDOUT, shell=(os.name == "nt"))
    return r.returncode


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True, help="media/<project> folder (holds <project>.scenes.resolved.json)")
    ap.add_argument("--comp", required=True, help="Remotion composition id")
    ap.add_argument("--edit", help="the EDIT mp4 (only needed with --prep-audio)")
    ap.add_argument("--prep-audio", action="store_true", help="write render-assets/middle-audio.m4a from the EDIT")
    ap.add_argument("--frames", help="A-B: render ONE probe chunk (comp frames, inclusive) instead of the parts")
    ap.add_argument("--with-audio", action="store_true", help="probe only: keep the comp audio (default muted)")
    ap.add_argument("--part-frames", type=int, default=9000, help="frames per part (default 9000 = 5 min @30)")
    ap.add_argument("--crf", type=int, default=16, help="part encode crf (default 16; the stitch re-encodes at 18)")
    ap.add_argument("--concurrency", type=int, default=8)
    args = ap.parse_args()

    project = os.path.abspath(args.project)
    name = os.path.basename(project)
    spec = load_resolved(project)
    tl = timeline(spec)                      # head/tail (EDIT s), chapter pauses, middle_frames (paused timeline)
    total = tl["middle_frames"]
    public_dir = os.path.join(project, "render-assets")
    previews = os.path.join(project, "_previews")
    os.makedirs(public_dir, exist_ok=True); os.makedirs(previews, exist_ok=True)
    print(f"{name}: {describe(tl)}; public-dir {public_dir}")

    if args.prep_audio:
        if not args.edit:
            sys.exit("--prep-audio needs --edit")
        out = os.path.join(public_dir, "middle-audio.m4a")
        sr, layout = audio_format(args.edit)
        fc_path = out + ".filter.txt"
        with open(fc_path, "w", encoding="utf-8") as f:
            f.write("\n".join(middle_audio_graph(tl, sr, layout)))
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", args.edit, "-filter_complex_script", fc_path,
                               "-map", "[ma]", "-vn", "-c:a", "aac", "-b:a", "160k", out])
        os.remove(fc_path)
        print(f"audio slice (EDIT {tl['head']:.3f}-{tl['tail']:.3f} s + the chapter pauses) ->", out)

    if args.frames:
        a, b = (int(x) for x in args.frames.split("-"))
        out = os.path.join(previews, f"{name}-probe-{a}-{b}.mp4")
        rc = run_render(args.comp, out, (a, b), args.crf, public_dir, args.concurrency, not args.with_audio, out + ".log")
        print("probe", "OK" if rc == 0 else f"FAILED rc={rc} (see {out}.log)", "->", out, nb_frames(out), "frames")
        sys.exit(rc)

    parts = []
    k = 0
    for a in range(0, total, args.part_frames):
        b = min(a + args.part_frames, total) - 1
        parts.append((k, a, b)); k += 1
    print(f"{len(parts)} parts of <= {args.part_frames} frames")
    t0 = time.time()
    for k, a, b in parts:
        out = os.path.join(previews, f"{name}-middle-part{k:02d}.mp4")
        want = b - a + 1
        if os.path.isfile(out) and nb_frames(out) == want:
            print(f"part {k:02d} [{a}-{b}] already rendered ({want} frames), skip", flush=True)
            continue
        print(f"part {k:02d} [{a}-{b}] rendering ...", flush=True)
        t1 = time.time()
        rc = run_render(args.comp, out, (a, b), args.crf, public_dir, args.concurrency, True, out + ".log")
        got = nb_frames(out) if rc == 0 else -1
        if rc != 0 or got != want:
            sys.exit(f"part {k:02d} FAILED (rc={rc}, frames {got}/{want}); see {out}.log. Re-run to resume.")
        print(f"part {k:02d} done: {want} frames in {(time.time()-t1)/60:.1f} min", flush=True)
    print(f"ALL PARTS DONE in {(time.time()-t0)/60:.1f} min:")
    for p in sorted(glob.glob(os.path.join(previews, f"{name}-middle-part*.mp4"))):
        print("  ", p)


if __name__ == "__main__":
    main()
