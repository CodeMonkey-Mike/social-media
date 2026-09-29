#!/usr/bin/env python
"""
render_comp.py — render a longform-edited composition the canonical way (comp-build.md §11), as CODE
(longform graph `final_render` node, 2026-09-28; the draft is rendered by the comp-builder with the same flags).

  python render_comp.py <media/<project>> --mode final|draft [--out <mp4>] [--frames A-B] [--concurrency 4]

- Output goes INTO the project's `_previews/` (never remotion/out/): `<project>-final-vN.mp4` / `<project>-draft-vN.mp4`,
  N bumped so a file Mike is reviewing is never overwritten; the render log lands beside it.
- draft = `--video-bitrate=200k` (the ONLY draft knob; full feature set); final = `--crf=18` (constant quality; the
  two flags are mutually exclusive). Both: `--public-dir <project>/assets --concurrency 4
  --offthreadvideo-cache-size-in-bytes=419430400 --timeout=120000 --log=verbose`.
- Disk hygiene first: stale `%TEMP%/remotion-*` bundles are removed and free space is printed (renders die at ENOSPC
  with no warning).
- Verified after: duration == assets/spine.mp4 (+-0.3 s), fps 30, an audio stream.
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
    ap.add_argument("--comp", default=None, help="composition id override (default <Project>; the vertical lane passes <Project>Vertical)")
    ap.add_argument("--public-dir", default=None, help="public dir override (default <project>/assets; the vertical lane passes assets/vertical)")
    ap.add_argument("--video-only", action="store_true", help="the comp carries no audio and its own duration (the short lane); skip the spine/audio checks")
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
    tmp = Path(tempfile.gettempdir())
    swept = 0
    for d in tmp.glob("remotion-*"):
        try:
            shutil.rmtree(d, ignore_errors=True)
            swept += 1
        except Exception:
            pass
    free_gb = shutil.disk_usage(str(proj)).free / 1e9
    print(f"disk: swept {swept} stale remotion temp bundle(s); {free_gb:.1f} GB free")
    if free_gb < 5:
        print("FATAL: under 5 GB free; a render needs gigabytes (ENOSPC kills it silently)", file=sys.stderr)
        sys.exit(1)
    quality = ["--crf=18"] if a.mode == "final" else ["--video-bitrate=200k"]
    cmd = ["npx", "remotion", "render", "src/index.ts", comp_id, str(out), *quality, "--public-dir", str(assets),
           f"--concurrency={a.concurrency}", "--offthreadvideo-cache-size-in-bytes=419430400", "--timeout=120000", "--log=verbose"]
    if a.frames:
        cmd.append(f"--frames={a.frames}")
    print(f"RENDER-START mode={a.mode} comp={comp_id} out={out}")
    with open(log, "w", encoding="utf-8", errors="replace") as lf:
        p = subprocess.Popen(cmd, cwd=str(REMOTION), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                             encoding="utf-8", errors="replace", shell=(os.name == "nt"))
        last = ""
        for line in p.stdout:
            lf.write(line)
            m = re.search(r"Rendered\s+(\d+)/(\d+)|Rendering frames.*?(\d{1,3})%", line)  # frame progress only, never bundling %
            if m:
                pct = m.group(3) or str(int(100 * int(m.group(1)) / max(1, int(m.group(2)))))
                m = re.match(r"(\d+)", pct)
            if m and m.group(1) != last:
                last = m.group(1)
                print(f"PROGRESS {last}%", flush=True)
        p.wait()
    if p.returncode != 0 or not out.is_file():
        print(f"FATAL: render exit {p.returncode}; log: {log}", file=sys.stderr)
        sys.exit(1)
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
