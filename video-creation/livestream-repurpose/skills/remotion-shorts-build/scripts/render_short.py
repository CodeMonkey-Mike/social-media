#!/usr/bin/env python
"""
render_short.py - the ONE way a livestream short is rendered and fixed (SKILL.md row 7), as CODE.

Mike, 2026-10-05: a short gets ONE full-quality render on the first try. There is NO low-bitrate
draft in this lane (the 0.2-0.3 Mbps draft is a longform-edited review proxy only), so this tool has
no draft mode and no bitrate knob. A defect found in QA is fixed by SPLICE: re-render only the bad
window and stitch it into the full render, never a second full render.

  python render_short.py full   --batch B --clip N --slug S --comp CompId
  python render_short.py splice --batch B --clip N --slug S --comp CompId --frames A-B [--frames C-D ...]
  python render_short.py audio  --batch B --clip N --slug S --comp CompId

full    Renders remotion/out/<batch>/<n>-<slug>.mp4 at the final quality (h264, crf 18, the Remotion
        default every shipped short has used). Verifies fps 30, 1080x1920, an audio stream, and the
        frame total against --expect-frames when given.
splice  VISUAL fix. Re-renders ONLY the given frame windows (inclusive, 30 fps frame numbers, same
        final quality), then `filter_complex concat`s them into the existing full render. The audio
        track of the full render is stream-copied untouched. Verified after: frame total unchanged,
        PSNR of every untouched region high (a low value = a mis-numbered window or a colour shift),
        PSNR of every patched window reported (high = the fix did not change the picture).
        The pre-splice file is kept in the clip's _qa/splice/ folder.
audio   AUDIO-only fix (an SFX that masks the VO, a level, a cue retime). Renders the comp's audio
        alone (`--codec=wav`, zero video frames) and remuxes it over the full render with `-c:v copy`.

Every Remotion invocation runs inside the `render` stage lock (stage_lock.py, capacity 2); the tool
takes and releases the lock itself, and is re-entrant if the caller already holds it under --slug.
After a splice or an audio fix, re-run the finalized-short gate and the row-7 checks on the result.

Machine lines: RENDER-START / RENDER-DONE / SPLICE-DONE / AUDIO-DONE / FATAL.
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
REPO = HERE.parents[4]
VC = REPO / "video-creation"
REMOTION = VC / "remotion"
SHORTS = VC / "shorts"
STAGE_LOCK = SHORTS / "_tooling" / "stage_lock.py"

FPS = 30
# The final quality. Remotion's h264 default is crf 18; it is pinned here so it can never drift and
# so a draft flag (`--video-bitrate`) has nowhere to go.
FINAL_QUALITY = ["--codec=h264", "--crf=18"]
# The splice concat re-encodes the stitched picture once (ffmpeg, seconds). One notch above the
# render quality so the untouched frames do not visibly lose a generation.
SPLICE_CRF = "16"
MERGE_GAP_FRAMES = 90      # windows closer than 3 s merge: a Remotion invocation costs ~25 s of bundling
KEPT_PSNR_FLOOR = 38.0     # dB; an untouched region below this is a mis-numbered window or a colour shift


def fatal(msg, code=1):
    print(f"FATAL: {msg}", file=sys.stderr, flush=True)
    sys.exit(code)


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)


def probe(path, entries, select=None, extra=None):
    cmd = ["ffprobe", "-v", "error"] + (["-select_streams", select] if select else []) + (extra or []) + \
          ["-show_entries", entries, "-of", "default=nw=1", str(path)]
    out = {}
    for line in run(cmd).stdout.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            out.setdefault(k.strip(), v.strip())
    return out


def frame_count(path):
    v = probe(path, "stream=nb_read_packets", "v:0", ["-count_packets"]).get("nb_read_packets", "0")
    return int(v) if v.isdigit() else 0


def duration(path):
    try:
        return float(probe(path, "format=duration").get("duration", "0"))
    except ValueError:
        return 0.0


def video_facts(path):
    v = probe(path, "stream=width,height,r_frame_rate,pix_fmt,color_range,color_space,color_transfer,color_primaries", "v:0")
    num, den = (v.get("r_frame_rate", "0/1").split("/") + ["1"])[:2]
    v["fps"] = float(num) / float(den or 1)
    return v


def has_audio(path):
    return probe(path, "stream=codec_type", "a:0").get("codec_type") == "audio"


# -- the render lock -----------------------------------------------------------------------------

class RenderLock:
    """`render` is a counting lock (capacity 2, Mike's hard ceiling). Never render outside it."""

    def __init__(self, owner, timeout_min):
        self.owner, self.timeout_min, self.mine = owner, timeout_min, False

    def __enter__(self):
        r = run([sys.executable, str(STAGE_LOCK), "acquire", "render", "--owner", self.owner,
                 "--timeout-min", str(self.timeout_min)])
        print(r.stdout.strip(), flush=True)
        if r.returncode != 0:
            fatal(f"could not take the render lock for {self.owner} (exit {r.returncode}); not rendering outside it")
        self.mine = "already held" not in r.stdout    # re-entrant hold belongs to the caller: leave it
        return self

    def __exit__(self, *exc):
        if self.mine:
            print(run([sys.executable, str(STAGE_LOCK), "release", "render", "--owner", self.owner]).stdout.strip(),
                  flush=True)
        return False


# -- remotion ------------------------------------------------------------------------------------

def remotion_render(comp, out, public_dir, log, concurrency, extra):
    """One Remotion CLI call. `extra` carries the quality flags or the wav codec, plus --frames."""
    cmd = ["npx", "remotion", "render", "src/index.ts", comp, str(out), *extra,
           f"--public-dir={public_dir}", f"--concurrency={concurrency}"]
    with open(log, "w", encoding="utf-8", errors="replace") as lf:
        lf.write("$ " + " ".join(cmd) + "\n")
        lf.flush()
        p = subprocess.Popen(cmd, cwd=str(REMOTION), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                             encoding="utf-8", errors="replace", shell=(os.name == "nt"))
        last = ""
        for line in p.stdout:
            lf.write(line)
            m = re.search(r"Rendered\s+(\d+)/(\d+)", line)
            if m:
                pct = str(int(100 * int(m.group(1)) / max(1, int(m.group(2)))) // 10 * 10)
                if pct != last:
                    last = pct
                    print(f"PROGRESS {pct}%", flush=True)
        p.wait()
    if p.returncode != 0 or not Path(out).is_file():
        fatal(f"remotion render exit {p.returncode}; log: {log}")


def check_disk(path):
    free_gb = shutil.disk_usage(str(path)).free / 1e9
    print(f"disk: {free_gb:.1f} GB free")
    if free_gb < 2:
        fatal("under 2 GB free; a render dies at ENOSPC with no warning. Free space first (ask Mike).")


# -- windows -------------------------------------------------------------------------------------

def parse_windows(specs, total):
    wins = []
    for s in specs:
        m = re.fullmatch(r"\s*(\d+)\s*-\s*(\d+)\s*", s)
        if not m:
            fatal(f"--frames wants A-B (inclusive frame numbers at {FPS} fps), got {s!r}", 2)
        a, b = int(m.group(1)), int(m.group(2))
        if a > b or b >= total:
            fatal(f"window {a}-{b} is outside the render (frames 0-{total - 1})", 2)
        wins.append([a, b])
    wins.sort()
    merged = [wins[0]]
    for a, b in wins[1:]:
        if a - merged[-1][1] - 1 < MERGE_GAP_FRAMES:
            merged[-1][1] = max(merged[-1][1], b)
        else:
            merged.append([a, b])
    return merged


def region_psnr(new, old, start, end_excl):
    """Average PSNR (dB) of frames [start, end_excl) between two files; inf when identical."""
    f = (f"[0:v]trim=start_frame={start}:end_frame={end_excl},setpts=PTS-STARTPTS[a];"
         f"[1:v]trim=start_frame={start}:end_frame={end_excl},setpts=PTS-STARTPTS[b];[a][b]psnr")
    r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(new), "-i", str(old), "-filter_complex", f, "-f", "null", "-"])
    m = re.search(r"average:(inf|[\d.]+)", r.stderr)
    if not m:
        fatal(f"could not read PSNR for frames {start}-{end_excl - 1}: {r.stderr[-400:]}")
    return float("inf") if m.group(1) == "inf" else float(m.group(1))


# -- modes ---------------------------------------------------------------------------------------

def paths(a):
    out = Path(a.out).resolve() if a.out else REMOTION / "out" / a.batch / f"{a.clip}-{a.slug}.mp4"
    public = Path(a.public_dir).resolve() if a.public_dir else SHORTS / a.batch / "render-assets"
    qa = SHORTS / a.batch / a.slug / "_qa"
    if not public.is_dir():
        fatal(f"public dir not found: {public} (pass --public-dir)", 2)
    if not (REMOTION / "src" / f"{a.comp}.tsx").is_file():
        fatal(f"composition file not found: {REMOTION / 'src' / (a.comp + '.tsx')}", 2)
    qa.mkdir(parents=True, exist_ok=True)
    out.parent.mkdir(parents=True, exist_ok=True)
    return out, public, qa


def mode_full(a):
    out, public, qa = paths(a)
    check_disk(out.parent)
    log = qa / "render_full.log"
    print(f"RENDER-START mode=full comp={a.comp} out={out} quality={' '.join(FINAL_QUALITY)}", flush=True)
    t0 = time.time()
    with RenderLock(a.slug, a.lock_timeout_min):
        remotion_render(a.comp, out, public, log, a.concurrency, FINAL_QUALITY)
    v, n = video_facts(out), frame_count(out)
    problems = []
    if abs(v["fps"] - FPS) > 0.01:
        problems.append(f"fps {v['fps']:g} (want {FPS})")
    if (v.get("width"), v.get("height")) != ("1080", "1920"):
        problems.append(f"size {v.get('width')}x{v.get('height')} (want 1080x1920)")
    if not has_audio(out):
        problems.append("no audio stream")
    if a.expect_frames and n != a.expect_frames:
        problems.append(f"{n} frames (want {a.expect_frames})")
    print(f"RENDER-DONE mode=full out={out} frames={n} dur={duration(out):.3f} fps={v['fps']:g} "
          f"mbps={out.stat().st_size * 8 / max(0.001, duration(out)) / 1e6:.2f} secs={time.time() - t0:.0f} log={log}", flush=True)
    if problems:
        fatal("full render failed verification: " + "; ".join(problems))


def mode_splice(a):
    out, public, qa = paths(a)
    if not out.is_file():
        fatal(f"no full render to splice into: {out}. Run `render_short.py full` first.", 2)
    if not a.frames:
        fatal("splice needs at least one --frames A-B window", 2)
    check_disk(out.parent)
    total, v = frame_count(out), video_facts(out)
    wins = parse_windows(a.frames, total)
    patched = sum(b - a_ + 1 for a_, b in wins)
    print(f"RENDER-START mode=splice comp={a.comp} full={out} frames={total} windows={wins} "
          f"({patched} frames = {100 * patched / total:.1f}% of the short)", flush=True)
    if patched > 0.6 * total:
        print("NOTE: the windows cover most of the short; a clip-wide defect is the one case for `full` again.")
    work = qa / "splice"
    work.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%H%M%S")
    t0 = time.time()

    # 1. render ONLY the windows, at the final quality
    patches = []
    with RenderLock(a.slug, a.lock_timeout_min):
        for s, e in wins:
            patch = work / f"patch-{s}-{e}-{stamp}.mp4"
            remotion_render(a.comp, patch, public, work / f"patch-{s}-{e}-{stamp}.log", a.concurrency,
                            FINAL_QUALITY + [f"--frames={s}-{e}"])
            got = frame_count(patch)
            if got != e - s + 1:
                fatal(f"patch {s}-{e} rendered {got} frames, expected {e - s + 1}; nothing was spliced")
            patches.append(patch)

    # 2. stitch: untouched picture from the full render + the patches; the full render's audio is copied
    kept, cursor = [], 0
    for s, e in wins:
        if s > cursor:
            kept.append((cursor, s))            # [start, end) of untouched frames
        cursor = e + 1
    if cursor < total:
        kept.append((cursor, total))
    parts, labels = [], []
    if kept:
        parts.append(f"[0:v]split={len(kept)}" + "".join(f"[k{i}]" for i in range(len(kept))))
    seq = sorted([("k", i, s) for i, (s, _) in enumerate(kept)] + [("p", i, s) for i, (s, _) in enumerate(wins)],
                 key=lambda t: t[2])
    for kind, i, _ in seq:
        if kind == "k":
            s, e = kept[i]
            parts.append(f"[k{i}]trim=start_frame={s}:end_frame={e},setpts=PTS-STARTPTS[K{i}]")
            labels.append(f"[K{i}]")
        else:
            parts.append(f"[{i + 1}:v]setpts=PTS-STARTPTS[P{i}]")
            labels.append(f"[P{i}]")
    parts.append("".join(labels) + f"concat=n={len(labels)}:v=1:a=0[v]")
    tmp = work / f"spliced-{stamp}.mp4"
    cmd = ["ffmpeg", "-hide_banner", "-y", "-i", str(out)]
    for p in patches:
        cmd += ["-i", str(p)]
    cmd += ["-filter_complex", ";".join(parts), "-map", "[v]", "-map", "0:a", "-c:a", "copy",
            "-c:v", "libx264", "-crf", SPLICE_CRF, "-preset", "medium", "-r", str(FPS),
            "-pix_fmt", v.get("pix_fmt") or "yuv420p"]
    for flag, key in (("-color_range", "color_range"), ("-colorspace", "color_space"),
                      ("-color_trc", "color_transfer"), ("-color_primaries", "color_primaries")):
        if v.get(key) and v[key] not in ("unknown", "N/A"):
            cmd += [flag, v[key]]
    cmd += ["-movflags", "+faststart", str(tmp)]
    r = run(cmd)
    if r.returncode != 0 or not tmp.is_file():
        fatal(f"ffmpeg concat failed: {r.stderr[-800:]}")

    # 3. verify BEFORE the full render is replaced
    new_total = frame_count(tmp)
    if new_total != total:
        fatal(f"spliced file has {new_total} frames, the full render has {total}; the full render was left untouched ({tmp})")
    if abs(duration(tmp) - duration(out)) > 0.05:
        fatal(f"spliced duration {duration(tmp):.3f}s vs {duration(out):.3f}s; the full render was left untouched ({tmp})")
    report, bad = [], []
    for s, e in kept:
        db = region_psnr(tmp, out, s, e)
        report.append(f"kept {s}-{e - 1}: {db:.1f} dB")
        if db < KEPT_PSNR_FLOOR:
            bad.append(f"untouched frames {s}-{e - 1} read {db:.1f} dB (< {KEPT_PSNR_FLOOR}): mis-numbered window or colour shift")
    for (s, e), _ in zip(wins, patches):
        db = region_psnr(tmp, out, s, e + 1)
        report.append(f"patched {s}-{e}: {db:.1f} dB vs the old picture")
    for line in report:
        print("  " + line)
    if bad:
        fatal("; ".join(bad) + f". The full render was left untouched ({tmp})")

    # 4. keep the pre-splice render, then swap the spliced file in
    backup = work / f"{out.stem}.pre-splice-{stamp}.mp4"
    shutil.copy2(out, backup)
    os.replace(tmp, out)
    print(f"SPLICE-DONE out={out} frames={new_total} windows={wins} patched_frames={patched} "
          f"secs={time.time() - t0:.0f} pre_splice={backup}", flush=True)
    print("next: re-run finalized_short_gate.py and the row-7 checks on the spliced render.")


def mode_audio(a):
    out, public, qa = paths(a)
    if not out.is_file():
        fatal(f"no full render to remux: {out}. Run `render_short.py full` first.", 2)
    check_disk(out.parent)
    work = qa / "splice"
    work.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%H%M%S")
    wav, tmp = work / f"audio-{stamp}.wav", work / f"remux-{stamp}.mp4"
    total = frame_count(out)
    print(f"RENDER-START mode=audio comp={a.comp} full={out} (zero video frames rendered)", flush=True)
    t0 = time.time()
    with RenderLock(a.slug, a.lock_timeout_min):
        remotion_render(a.comp, wav, public, work / f"audio-{stamp}.log", a.concurrency, ["--codec=wav"])
    if abs(duration(wav) - duration(out)) > 0.1:
        fatal(f"audio render is {duration(wav):.3f}s, the full render is {duration(out):.3f}s; nothing was remuxed")
    r = run(["ffmpeg", "-hide_banner", "-y", "-i", str(out), "-i", str(wav), "-map", "0:v", "-map", "1:a",
             "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", str(tmp)])
    if r.returncode != 0 or not tmp.is_file():
        fatal(f"ffmpeg remux failed: {r.stderr[-800:]}")
    if frame_count(tmp) != total or not has_audio(tmp):
        fatal(f"remux lost frames or audio; the full render was left untouched ({tmp})")
    backup = work / f"{out.stem}.pre-audio-{stamp}.mp4"
    shutil.copy2(out, backup)
    os.replace(tmp, out)
    print(f"AUDIO-DONE out={out} frames={total} dur={duration(out):.3f} secs={time.time() - t0:.0f} pre_audio={backup}", flush=True)
    print("next: whisper-verify the new mix (row 7a) and re-run the gate.")


def main():
    ap = argparse.ArgumentParser(description="Render a livestream short at full quality, or fix one by splice. No draft mode.")
    ap.add_argument("mode", choices=["full", "splice", "audio"])
    ap.add_argument("--batch", required=True)
    ap.add_argument("--clip", required=True, type=int, help="the clip number n (the render is <n>-<slug>.mp4)")
    ap.add_argument("--slug", required=True)
    ap.add_argument("--comp", required=True, help="Remotion composition id (the .tsx basename registered in Root.tsx)")
    ap.add_argument("--frames", action="append", default=[], help="splice: an inclusive frame window A-B; repeat for more")
    ap.add_argument("--expect-frames", type=int, default=0, help="full: the comp's durationInFrames, verified when given")
    ap.add_argument("--public-dir", default=None, help="default video-creation/shorts/<batch>/render-assets")
    ap.add_argument("--out", default=None, help="override the render path (tests and repairs only)")
    ap.add_argument("--concurrency", type=int, default=8)
    ap.add_argument("--lock-timeout-min", type=float, default=170)
    a = ap.parse_args()
    {"full": mode_full, "splice": mode_splice, "audio": mode_audio}[a.mode](a)


if __name__ == "__main__":
    main()
