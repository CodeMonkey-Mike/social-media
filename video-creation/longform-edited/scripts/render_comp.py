#!/usr/bin/env python
"""
render_comp.py — render a longform-edited composition the canonical way (comp-build.md §11), as CODE
(longform graph `final_render` node, 2026-09-28; the draft is rendered by the comp-builder with the same flags).

  python render_comp.py <media/<project>> --mode final|draft [--out <mp4>] [--frames A-B] [--concurrency 4]

- Output goes INTO the project's `_previews/` (never remotion/out/): `<project>-final-vN.mp4` / `<project>-draft-vN.mp4`,
  N bumped so a file Mike is reviewing is never overwritten; the render log lands beside it.
- draft = `--video-bitrate=200k` (the ONLY draft knob; full feature set); final = `--crf=18` (constant quality; the
  two flags are mutually exclusive). Both: `--public-dir <project>/assets --concurrency 4
  --offthreadvideo-cache-size-in-bytes=3221225472 --timeout=120000 --log=verbose` (3 GB, see --ov-cache-mb).
- Disk hygiene first: stale `%TEMP%/remotion-*` bundles are removed and free space is printed (renders die at ENOSPC
  with no warning).
- Verified after: duration == assets/spine.mp4 (+-0.3 s), fps 30, an audio stream.
- CHUNKED (Mike, 2026-10-27): the render runs through video-creation/skills/chunked-render (1-minute chunks from one
  bundle, h264-mkv with pcm audio joined sample-exact, a watchdog that kills + retries a stalled chunk, resume from the
  last good chunk on a re-run, the run-queue pause honoured, desktop notifications). Never call `npx remotion render`
  directly (scripts/check-remotion-render.py fails the repo on it). A standalone run takes the run-queue turn itself.
Machine lines: RENDER-START mode=.. comp=.. out=.. · RENDER-DONE mode=.. out=.. dur=X fps=30 audio=yes · PROGRESS 100%
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
REMOTION = REPO / "video-creation" / "remotion"
sys.path.insert(0, str(REPO / "video-creation" / "skills" / "chunked-render"))
import chunked_render as CR  # noqa: E402


def pascal(slug):
    return "".join(p[:1].upper() + p[1:] for p in re.split(r"[^A-Za-z0-9]+", slug) if p)


def probe(path, entries, select=None):
    cmd = ["ffprobe", "-v", "error"] + (["-select_streams", select] if select else []) + ["-show_entries", entries, "-of", "csv=p=0", str(path)]
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()


def duration(path):
    try:
        return float(probe(path, "format=duration").splitlines()[0])
    except Exception:
        return 0.0


def next_version(prev: Path, stem: str):
    n = 1
    for p in prev.glob(f"{stem}-v*.mp4"):
        m = re.search(r"-v(\d+)(?:-mix)?\.mp4$", p.name)
        if m:
            n = max(n, int(m.group(1)) + 1)
    return n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--mode", choices=["final", "draft"], required=True)
    ap.add_argument("--out", default=None)
    ap.add_argument("--frames", default=None)
    ap.add_argument("--concurrency", type=int, default=4)
    # 3 GB (Mike 2026-10-20, a memory trial: 4 GB -> 3 GB frees ~1 GB while renders run beside his apps; ~770 MB a thread at
    # concurrency 4 vs the ~25 MB that failed, unmeasured in between, so check_broll_motion on the FULL render is the proof;
    # a BROLL-MOTION FAIL = back to 4096), never the old 400 MB (tao-detailed 2026-10-17): Envato clips carry ONE keyframe for the whole clip, and with a 400 MB
    # cache the compositor kept ~25 MB a thread (about 3 HD frames), pruned non-stop over a long render and silently served the
    # NEAREST cached frame, so ~60% of b-roll frames were repeats (3-5 held, then a jump). Short test renders never filled the
    # cache, so they looked clean. Measured on frames 0-1200: 400 MB -> 19-24 of 35 frames frozen, 4096 MB -> 0 on 30 fps clips.
    ap.add_argument("--ov-cache-mb", type=int, default=3072, help="OffthreadVideo frame cache in MB (default 3072; see the note above)")
    ap.add_argument("--comp", default=None, help="composition id override (default <Project>; the vertical lane passes <Project>Vertical)")
    ap.add_argument("--public-dir", default=None, help="public dir override (default <project>/assets; the vertical lane passes assets/vertical)")
    ap.add_argument("--video-only", action="store_true", help="the comp carries no audio and its own duration (the short lane); skip the spine/audio checks")
    ap.add_argument("--props", default=None, help="path to a JSON file passed to Remotion as --props (input props, e.g. {\"captions\": false})")
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    comp_id = a.comp or pascal(proj.name)
    comp = REMOTION / "src" / f"{comp_id}.tsx"
    assets = Path(a.public_dir).resolve() if a.public_dir else proj / "assets"
    if not comp.is_file() or (not a.video_only and not (assets / "spine.mp4").is_file()):
        print(f"FATAL: {comp} or {assets / 'spine.mp4'} missing", file=sys.stderr)
        sys.exit(2)
    prev = proj / "_previews"
    prev.mkdir(parents=True, exist_ok=True)
    out = Path(a.out).resolve() if a.out else prev / f"{proj.name}-{a.mode}-v{next_version(prev, proj.name + '-' + a.mode)}.mp4"
    log = out.with_name(out.stem + "-render.log")
    # disk hygiene
    tmp = Path(os.environ.get("TEMP") or tempfile.gettempdir())   # the launcher's TEMP (D:), not a Git-bash TMPDIR (C:)
    swept = 0
    for d in tmp.glob("remotion-*"):
        try:
            shutil.rmtree(d, ignore_errors=True)
            swept += 1
        except Exception:
            pass
    # the render WRITES to two places: the temp dir (the webpack bundle copies the whole public dir, ~1 GB, plus Chrome's
    # frame cache) and the output's folder. Guard those drives, not the project's (tao-detailed 2026-10-17: C: was full,
    # so TEMP and --out were pointed at D: and the project-drive check refused a render that would never touch C:)
    out.parent.mkdir(parents=True, exist_ok=True)
    free_gb = min(shutil.disk_usage(str(tmp)).free, shutil.disk_usage(str(out.parent)).free) / 1e9
    print(f"disk: swept {swept} stale remotion temp bundle(s); {free_gb:.1f} GB free on the temp + output drives ({tmp} / {out.parent})")
    if free_gb < 5:
        print("FATAL: under 5 GB free; a render needs gigabytes (ENOSPC kills it silently)", file=sys.stderr)
        sys.exit(1)
    quality = ["--crf=18"] if a.mode == "final" else ["--video-bitrate=200k"]
    frames = tuple(int(x) for x in a.frames.split("-")) if a.frames else None
    label = f"{proj.name} {a.mode}" + (f" frames {a.frames}" if a.frames else "")
    print(f"RENDER-START mode={a.mode} comp={comp_id} out={out}")
    try:
        with CR.run_queue.turn(label, kind="render", project=proj.name):
            CR.render(comp=comp_id, out=out, public_dir=assets, quality=quality, frames=frames, audio=True,
                      concurrency=a.concurrency, ov_cache_mb=a.ov_cache_mb, props=a.props, label=label, report=log)
    except (CR.RenderFailed, CR.DeadlineReached) as e:
        print(f"FATAL: render failed: {e}; chunk history + failed-attempt logs: {log}", file=sys.stderr)
        sys.exit(1)
    if not out.is_file():
        print(f"FATAL: no output; log: {log}", file=sys.stderr)
        sys.exit(1)
    # Remotion's AAC encode can leave a trailing audio pad (every-job final v1: audio 1138.859 s vs picture 1138.567 s,
    # 0.3 s over the spine, 2026-10-08). Trim the AUDIO tail to the picture length, video stream copied (sync-safe), so the
    # container length is the picture's and the spine check below measures the render, not the pad.
    try:
        v_dur = float((probe(out, "stream=duration", "v:0").splitlines() or ["0"])[0].strip().strip(",").split(",")[0] or 0)
        a_dur = float((probe(out, "stream=duration", "a:0").splitlines() or ["0"])[0].strip().strip(",").split(",")[0] or 0)
    except ValueError:
        v_dur = a_dur = 0.0
    if v_dur and a_dur and a_dur - v_dur > 0.05:
        trimmed = out.with_name(out.stem + ".audiotrim.tmp.mp4")
        r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out), "-map", "0:v", "-map", "0:a", "-c:v", "copy",
                            "-c:a", "aac", "-b:a", "192k", "-af", f"atrim=0:{v_dur:.6f},asetpts=PTS-STARTPTS", "-movflags", "+faststart", str(trimmed)],
                           capture_output=True, text=True)
        if r.returncode == 0 and trimmed.is_file():
            out.unlink(); trimmed.rename(out)
            print(f"AUDIO-TRIM audio {a_dur:.3f}s -> picture {v_dur:.3f}s (trailing encoder pad removed, video copied)")
        else:
            print(f"WARN: audio tail trim failed, keeping the render as rendered: {r.stderr[-300:]}", file=sys.stderr)
    d_out, d_spine = duration(out), (duration(assets / "spine.mp4") if (assets / "spine.mp4").is_file() else 0.0)
    fps_raw = probe(out, "stream=r_frame_rate", "v:0").splitlines()[0].strip().strip(",").split(",")[0]  # ffprobe csv can trail a comma
    num, den = fps_raw.split("/")
    fps = float(num) / float(den)
    has_audio = "audio" in probe(out, "stream=codec_type", "a")
    ok = (abs(fps - 30) < 0.01) if a.video_only else ((a.frames is not None or abs(d_out - d_spine) <= 0.3) and abs(fps - 30) < 0.01 and has_audio)
    print(f"RENDER-DONE mode={a.mode} out={out} dur={d_out:.3f} spine={d_spine:.3f} fps={fps:g} audio={'yes' if has_audio else 'no'} log={log}")
    if not ok:
        print("FATAL: render does not match the spine (duration / fps / audio)", file=sys.stderr)
        sys.exit(1)
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
