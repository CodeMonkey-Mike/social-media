#!/usr/bin/env python
"""chunked_render.py — THE way every longform Remotion render runs (Mike, 2026-10-27). Read chunked-render.md.

A long render is cut into 1-MINUTE CHUNKS (1800 frames at 30 fps), each rendered on its own from ONE prebuilt bundle,
each kept on disk the moment it verifies. A crash, a stall, a reboot or a pause costs at most one chunk, never the
render: a re-run skips every chunk already done. Born of 2026-10-27: a final died at 94% and lost everything, another hung
on its last 2 frames for 30+ minutes, and nobody was told.

  - Chunks render with Remotion's `h264-mkv` codec: h264 picture + UNCOMPRESSED pcm audio, so chunks join sample-exact
    (measured: a 2-chunk join is bit-identical to the same range rendered whole). The picture is stream-copied; the audio
    is encoded to AAC ONCE at the end. Never concatenate AAC-bearing mp4 chunks (each one's encoder priming offsets the
    picture 42.7 ms per seam: the 2026-10-27 concat drifted 0.68 s and dropped 24 frames).
  - WATCHDOG inside the renderer (never a Claude-session watcher, which memory pressure reaps): no new frame for
    --stall-s (default 6 min; 15 min before the first frame) = the chunk's process TREE is killed and the chunk retried,
    up to 3 attempts; every attempt's log is kept and the frame it hung on is recorded in the manifest.
  - Chunks are fingerprinted (bundle code + public-dir listing + flags + props): a changed comp never reuses stale chunks.
  - Between chunks: the run queue's PAUSE is honoured (run_queue.py pause, nothing lost) and an optional --deadline HH:MM
    stops cleanly before a chunk that would not finish in time (exit 3).
  - Verified: every chunk's frame count; the joined picture's frame count == the range AND every timestamp exactly n/fps;
    audio length == picture length. Desktop notifications on stall/retry, failure and done (notify.py).

Library:
    from chunked_render import render, RenderFailed
    render(comp="Only18MonthsLeft", out=Path(...), public_dir=Path(...), quality=["--crf=18"], label="only-18 final")

CLI (a hand-run render takes the run-queue turn itself):
    python chunked_render.py --comp <Id> --out <mp4> --public-dir <dir> [--crf 18 | --video-bitrate 200k]
        [--frames A-B] [--chunk 1800] [--no-audio] [--props <json>] [--deadline HH:MM] [--label "..."]
Machine lines: CHUNK i/n frames A-B ok|skip|STALL|FAIL · PROGRESS n% · CHUNKED-RENDER-DONE out=.. frames=N
Exit: 0 done · 1 failed · 3 paused for --deadline (re-run resumes).
"""
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from datetime import datetime, timedelta
from pathlib import Path

HERE = Path(__file__).resolve().parent
VC = HERE.parents[1]                                   # video-creation/
REMOTION = VC / "remotion"
sys.path.insert(0, str(VC / "skills" / "run-queue"))
from notify import notify  # noqa: E402
import run_queue  # noqa: E402

CHUNK = 1800            # 1 minute at 30 fps (Mike's rule)
STALL_S = 6 * 60        # no new frame for this long = stalled
FIRST_FRAME_S = 15 * 60  # browser launch + compositor warm-up before frame 1
ATTEMPTS = 3
FAKE_ENV = "CHUNKED_RENDER_FAKE"   # tests: a python script standing in for `npx remotion`


class RenderFailed(RuntimeError):
    pass


class DeadlineReached(RuntimeError):
    pass


def log(msg):
    print(f"{datetime.now():%H:%M:%S} {msg}", flush=True)


def _remotion(args):
    fake = os.environ.get(FAKE_ENV)
    return [sys.executable, fake, *args] if fake else ["npx", "remotion", *args]


def _run(cmd, **kw):
    return subprocess.run(cmd, cwd=str(REMOTION), shell=(os.name == "nt" and cmd[0] == "npx"),
                          capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)


def _ffprobe(path, *args):
    return subprocess.run(["ffprobe", "-v", "error", *args, str(path)], capture_output=True, text=True).stdout.strip()


def _frame_pts(path):
    out = _ffprobe(path, "-select_streams", "v:0", "-show_entries", "packet=pts_time", "-of", "csv=p=0")
    return sorted(float(x.strip(",")) for x in out.split() if x.strip(",") not in ("", "N/A"))


def _audio_seconds(path):
    """End of the last audio packet (pts + duration): works for the .mkv chunks, whose streams carry no duration field."""
    out = _ffprobe(path, "-select_streams", "a:0", "-show_entries", "packet=pts_time,duration_time", "-of", "csv=p=0")
    end = None
    for ln in out.splitlines():
        parts = [x for x in ln.strip().split(",") if x]
        try:
            e = float(parts[0]) + float(parts[1])
        except (ValueError, IndexError):
            continue
        end = e if end is None or e > end else end
    return end


def _kill_tree(pid):
    if os.name == "nt":
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(pid)], capture_output=True)
    else:
        try:
            os.killpg(os.getpgid(pid), 9)
        except Exception:
            pass


# ── bundle + composition metadata ───────────────────────────────────────────────────────────────────────────────────

def bundle(public_dir: Path, dest: Path, entry="src/index.ts"):
    if dest.exists():
        shutil.rmtree(dest, ignore_errors=True)
    r = _run(_remotion(["bundle", entry, "--public-dir", str(public_dir), "--out-dir", str(dest), "--log=error"]))
    if r.returncode != 0 or not (dest / "index.html").is_file():
        raise RenderFailed(f"remotion bundle failed: {(r.stdout + r.stderr)[-800:]}")
    return dest


def comp_frames(bundle_dir: Path, comp: str, props=None):
    """(durationInFrames, fps) of `comp` as the bundle resolves it (input props included)."""
    # no --log=error here: Remotion prints the composition table at INFO level, so --log=error hides the table itself
    args = ["compositions", str(bundle_dir)] + ([f"--props={Path(props).resolve()}"] if props else [])   # Remotion's cwd is not ours
    r = _run(_remotion(args))
    for ln in ((r.stdout or "") + "\n" + (r.stderr or "")).splitlines():
        m = re.match(rf"^\s*{re.escape(comp)}\s+(\d+(?:\.\d+)?)\s+\d+x\d+\s+(\d+)\b", ln)
        if m:
            return int(m.group(2)), float(m.group(1))
    raise RenderFailed(f"composition {comp} not found in the bundle: {(r.stdout + r.stderr)[-600:]}")


def fingerprint(bundle_dir: Path, public_dir: Path, flags):
    h = hashlib.sha256()
    for p in sorted(bundle_dir.glob("*.js")):
        h.update(p.name.encode()); h.update(p.read_bytes())
    for p in sorted(public_dir.rglob("*")):
        if p.is_file():
            st = p.stat()
            h.update(f"{p.relative_to(public_dir).as_posix()}|{st.st_size}|{st.st_mtime_ns}".encode())
    h.update(json.dumps(flags, sort_keys=True).encode())
    return h.hexdigest()[:20]


# ── one chunk, watched ──────────────────────────────────────────────────────────────────────────────────────────────

def _render_chunk(bundle_dir, comp, path: Path, a, b, flags, logpath: Path, stall_s, first_frame_s, on_frame):
    """Render frames a..b into `path`; returns (ok, why, last_frame). Kills the process tree on a stall."""
    cmd = _remotion(["render", str(bundle_dir), comp, str(path), "--codec=h264-mkv", f"--frames={a}-{b}", *flags])
    state = {"frame": -1, "t": time.time()}
    with open(logpath, "w", encoding="utf-8", errors="replace") as lf:
        lf.write(" ".join(cmd) + "\n")
        p = subprocess.Popen(cmd, cwd=str(REMOTION), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                             encoding="utf-8", errors="replace", shell=(os.name == "nt" and cmd[0] == "npx"))

        def reader():
            for line in p.stdout:
                lf.write(line)
                for m in re.finditer(r"Rendered\s+(\d+)/(\d+)", line):
                    n = int(m.group(1))
                    if n != state["frame"]:
                        state["frame"], state["t"] = n, time.time()
                        on_frame(n)
        th = threading.Thread(target=reader, daemon=True)
        th.start()
        why = ""
        while p.poll() is None:
            time.sleep(2)
            limit = first_frame_s if state["frame"] < 1 else stall_s
            if time.time() - state["t"] > limit:
                why = f"STALL: no new frame for {int(limit)} s at chunk frame {state['frame']} (comp frame {a + max(0, state['frame'])})"
                _kill_tree(p.pid)
                break
        try:
            p.wait(timeout=60)
        except subprocess.TimeoutExpired:
            _kill_tree(p.pid)
        th.join(timeout=10)
    if why:
        return False, why, state["frame"]
    if p.returncode != 0:
        return False, f"render exit {p.returncode}", state["frame"]
    return True, "", state["frame"]


def _verify_chunk(path: Path, a, b, fps, audio, last=False):
    if not path.is_file():
        return "no output file"
    n = len(_frame_pts(path))
    if n != b - a + 1:
        return f"{n} frames, want {b - a + 1}"
    if audio:
        s = _audio_seconds(path)
        # the comp's LAST chunk may run short by the source's own tail (a spine whose audio stops ~20-40 ms before its
        # picture, e.g. inference 2026-10-27): allow the join check's 30 ms there, never a long tail
        want_s = (b - a + 1) / fps
        if s is None or (abs(s - want_s) > 0.002 and not (last and 0 <= want_s - s <= 0.03)):
            return f"audio {s} s, want {(b - a + 1) / fps:.4f} s"
    return ""


# ── the render ──────────────────────────────────────────────────────────────────────────────────────────────────────

def render(*, comp, out, public_dir, quality, frames=None, chunk=CHUNK, audio=True, concurrency=4, ov_cache_mb=None,
           props=None, extra=None, label=None, deadline=None, workdir=None, stall_s=STALL_S, first_frame_s=FIRST_FRAME_S,
           attempts=ATTEMPTS, keep_chunks=False, report=None):
    """Render `comp` (frames A-B inclusive, default all) into `out` (.mp4) chunk by chunk. Raises RenderFailed, or
    DeadlineReached when --deadline stops it cleanly (a re-run resumes). `report` = a log path beside the output: the
    per-chunk attempt history is written there, and every FAILED attempt's log is copied next to it (the evidence)."""
    try:
        return _render(comp=comp, out=out, public_dir=public_dir, quality=quality, frames=frames, chunk=chunk, audio=audio,
                       concurrency=concurrency, ov_cache_mb=ov_cache_mb, props=props, extra=extra, label=label,
                       deadline=deadline, workdir=workdir, stall_s=stall_s, first_frame_s=first_frame_s, attempts=attempts,
                       keep_chunks=keep_chunks, report=report)
    finally:
        if report:
            _write_report(Path(report))


_LAST = {}   # the last render's work dir + manifest, for the report


def _write_report(report: Path):
    work, man = _LAST.get("work"), _LAST.get("man")
    if not man:
        return
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(man, indent=2), encoding="utf-8")
    for name, rec in man.get("chunks", {}).items():
        for k, att in enumerate(rec.get("attempts", []), 1):
            src = work / att["log"] if work and att.get("log") else None
            if src and src.is_file():
                shutil.copyfile(src, report.with_name(f"{report.stem}.{name}.attempt{k}.log"))


def _render(*, comp, out, public_dir, quality, frames, chunk, audio, concurrency, ov_cache_mb, props, extra, label,
            deadline, workdir, stall_s, first_frame_s, attempts, keep_chunks, report):
    out, public_dir = Path(out).resolve(), Path(public_dir).resolve()
    label = label or f"{comp} render"
    flags = list(quality) + [f"--concurrency={concurrency}", "--timeout=120000", "--log=verbose"]
    if ov_cache_mb:
        flags.append(f"--offthreadvideo-cache-size-in-bytes={int(ov_cache_mb) * 1024 * 1024}")
    if not audio:
        flags.append("--muted")
    if props:
        flags.append(f"--props={Path(props).resolve()}")
    flags += list(extra or [])
    key = hashlib.sha1(json.dumps([comp, str(public_dir), flags, frames], sort_keys=True).encode()).hexdigest()[:12]
    work = Path(workdir) if workdir else _work_root() / f"{comp}-{key}"
    work.mkdir(parents=True, exist_ok=True)
    log(f"CHUNKED-RENDER-START comp={comp} out={out} work={work}")
    bdir = bundle(public_dir, work / "bundle")
    total, fps = comp_frames(bdir, comp, props)
    a0, b0 = (frames if frames else (0, total - 1))
    if not (0 <= a0 <= b0 < total):
        raise RenderFailed(f"frames {a0}-{b0} outside the composition (0-{total - 1})")
    fp = fingerprint(bdir, public_dir, flags)
    man_p = work / "manifest.json"
    man = json.loads(man_p.read_text(encoding="utf-8")) if man_p.is_file() else {}
    if man.get("fingerprint") != fp:
        for old in work.glob("chunk-*.mkv"):
            old.unlink()
        man = {"fingerprint": fp, "comp": comp, "chunks": {}}
    _LAST.update(work=work, man=man)
    ranges = [(s, min(s + chunk - 1, b0)) for s in range(a0, b0 + 1, chunk)]
    want = b0 - a0 + 1
    done_frames, last_pct = 0, [-1]

    def progress(n_in_chunk):
        pct = int(100 * (done_frames + n_in_chunk) / want)
        if pct != last_pct[0]:
            last_pct[0] = pct
            print(f"PROGRESS {min(pct, 99)}%", flush=True)

    t_start, rate = time.time(), None
    for i, (a, b) in enumerate(ranges):
        name = f"chunk-{a:06d}-{b:06d}"
        path = work / f"{name}.mkv"
        rec = man["chunks"].setdefault(name, {"attempts": []})
        if rec.get("ok") and not _verify_chunk(path, a, b, fps, audio, last=(b == total - 1)):
            log(f"CHUNK {i + 1}/{len(ranges)} frames {a}-{b} skip (already rendered)")
            done_frames += b - a + 1
            continue
        for att in range(1, attempts + 1):
            run_queue.wait_while_paused(label)
            if deadline:
                est = (b - a + 1) / rate if rate else (b - a + 1) / 3.0
                if datetime.now() + timedelta(seconds=est) > deadline:
                    man_p.write_text(json.dumps(man, indent=2), encoding="utf-8")
                    raise DeadlineReached(f"stopped before chunk {i + 1}/{len(ranges)} for the {deadline:%H:%M} deadline; "
                                          f"{i} chunk(s) kept, a re-run resumes")
            path.unlink(missing_ok=True)
            lp = work / f"{name}.attempt{len(rec['attempts']) + 1}.log"
            t0 = time.time()
            ok, why, last = _render_chunk(bdir, comp, path, a, b, flags, lp, stall_s, first_frame_s, progress)
            bad = why or _verify_chunk(path, a, b, fps, audio, last=(b == total - 1))
            rec["attempts"].append({"at": datetime.now().isoformat(timespec="seconds"), "ok": not bad, "why": bad,
                                    "last_frame": last, "log": lp.name, "seconds": round(time.time() - t0)})
            if not bad:
                rec["ok"] = True
                rate = (b - a + 1) / max(1.0, time.time() - t0)
                lp.unlink(missing_ok=True)            # a clean attempt's verbose log is noise; failed ones are kept
                rec["attempts"][-1]["log"] = None
                done_frames += b - a + 1
                log(f"CHUNK {i + 1}/{len(ranges)} frames {a}-{b} ok ({rate:.1f} fps, attempt {att})")
                break
            log(f"CHUNK {i + 1}/{len(ranges)} frames {a}-{b} FAIL attempt {att}/{attempts}: {bad} (log kept: {lp})")
            man_p.write_text(json.dumps(man, indent=2), encoding="utf-8")
            if att < attempts:
                notify(label, f"Chunk {i + 1} of {len(ranges)} {'stalled' if bad.startswith('STALL') else 'failed'} "
                              f"({bad[:90]}). Retrying it (attempt {att + 1} of {attempts}); finished chunks are kept.")
        else:
            man_p.write_text(json.dumps(man, indent=2), encoding="utf-8")
            notify(label, f"Render FAILED: chunk {i + 1} of {len(ranges)} failed {attempts} times. {done_frames} of {want} "
                          f"frames are kept; a re-run resumes from this chunk.")
            raise RenderFailed(f"chunk {name} failed {attempts} times; last: {rec['attempts'][-1]['why']}")
        man_p.write_text(json.dumps(man, indent=2), encoding="utf-8")

    # join: picture stream-copied, pcm audio encoded to AAC once; timestamps snapped to the frame grid
    lst = work / "concat.txt"
    lst.write_text("".join(f"file '{(work / f'chunk-{a:06d}-{b:06d}.mkv').as_posix()}'\n" for a, b in ranges), encoding="utf-8")
    joined = work / "joined.mkv"
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(joined)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise RenderFailed(f"concat failed: {r.stderr[-600:]}")
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp_out = out.with_name(out.stem + ".chunked.tmp.mp4")
    amap = ["-map", "0:a", "-c:a", "aac", "-b:a", "320k"] if audio else []
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(joined), "-map", "0:v", "-c:v", "copy", *amap,
                        "-video_track_timescale", str(int(round(fps))), "-movflags", "+faststart", str(tmp_out)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise RenderFailed(f"mux failed: {r.stderr[-600:]}")
    pts = _frame_pts(tmp_out)
    off = sum(1 for k, t in enumerate(pts) if abs(t - k / fps) > 1e-4)
    if len(pts) != want or off:
        raise RenderFailed(f"joined picture: {len(pts)} frames (want {want}), {off} off the 1/{fps:g} grid")
    if audio:
        s = _audio_seconds(tmp_out)
        if s is None or abs(s - want / fps) > 0.03:
            raise RenderFailed(f"joined audio {s} s vs picture {want / fps:.3f} s")
    os.replace(tmp_out, out)
    if report:
        _write_report(Path(report))          # before the work dir goes: a recovered stall's log is evidence too
    if not keep_chunks:
        shutil.rmtree(work, ignore_errors=True)
    mins = (time.time() - t_start) / 60
    log(f"CHUNKED-RENDER-DONE out={out} frames={want} chunks={len(ranges)} minutes={mins:.1f}")
    print("PROGRESS 100%", flush=True)
    notify(label, f"Render done: {out.name} ({want / fps / 60:.1f} min of video, {len(ranges)} chunks, {mins:.0f} min).")
    return {"out": str(out), "frames": want, "fps": fps, "chunks": len(ranges)}


def _work_root():
    """CHUNKED_RENDER_DIR, else the Windows TEMP the launcher set (on C:, never D:: a removable drive), else the OS
    temp. Not tempfile.gettempdir(): it prefers TMPDIR, which a Git-bash parent exports as C:'s temp (2026-10-27)."""
    root = os.environ.get("CHUNKED_RENDER_DIR") or os.environ.get("TEMP") or tempfile.gettempdir()
    return Path(root) / "chunked-render"


def _deadline(s):
    if not s:
        return None
    h, m = map(int, s.split(":"))
    d = datetime.now().replace(hour=h, minute=m, second=0, microsecond=0)
    return d if d > datetime.now() else d + timedelta(days=1)


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description="Chunked, resumable, watched Remotion render (chunked-render.md).")
    ap.add_argument("--comp", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--public-dir", required=True)
    q = ap.add_mutually_exclusive_group()
    q.add_argument("--crf", type=int, default=None)
    q.add_argument("--video-bitrate", default=None)
    ap.add_argument("--frames", default=None, help="A-B inclusive (default: the whole composition)")
    ap.add_argument("--chunk", type=int, default=CHUNK)
    ap.add_argument("--no-audio", action="store_true")
    ap.add_argument("--concurrency", type=int, default=4)
    ap.add_argument("--ov-cache-mb", type=int, default=None)
    ap.add_argument("--props", default=None)
    ap.add_argument("--deadline", default=None, help="HH:MM: stop cleanly before a chunk that would not finish in time")
    ap.add_argument("--label", default=None)
    ap.add_argument("--skip-queue", action="store_true", help="start now, overlapping the queue (Mike's explicit ask only)")
    ap.add_argument("--keep-chunks", action="store_true")
    a = ap.parse_args()
    quality = [f"--crf={a.crf}"] if a.crf is not None else ([f"--video-bitrate={a.video_bitrate}"] if a.video_bitrate else ["--crf=18"])
    frames = tuple(int(x) for x in a.frames.split("-")) if a.frames else None
    label = a.label or f"{a.comp} render"
    try:
        with run_queue.turn(label, kind="render", skip=a.skip_queue):
            render(comp=a.comp, out=a.out, public_dir=a.public_dir, quality=quality, frames=frames, chunk=a.chunk,
                   audio=not a.no_audio, concurrency=a.concurrency, ov_cache_mb=a.ov_cache_mb, props=a.props, label=label,
                   deadline=_deadline(a.deadline), keep_chunks=a.keep_chunks)
    except DeadlineReached as e:
        log(f"PAUSED-FOR-DEADLINE {e}")
        notify(label, f"Paused for your deadline: {e}")
        sys.exit(3)
    except RenderFailed as e:
        log(f"CHUNKED-RENDER-FAIL {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
