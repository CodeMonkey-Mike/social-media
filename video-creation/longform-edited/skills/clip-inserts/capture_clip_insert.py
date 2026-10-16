#!/usr/bin/env python
"""
capture_clip_insert.py — pull a third-party CLIP INSERT (a few seconds of someone saying the thing, WITH ITS OWN
AUDIO), normalise it for the comp, burn the context caption on every frame, and VERIFY it (audio present and not
silent, exact length, Whisper hears the expected words). Canonical tool of skills/clip-inserts/clip-inserts.md
(Mike, 2026-10-09: clip inserts are a standing consideration on every longform-edited video; the every-job Huang
clip was first captured muted and had to be re-muxed after the draft, which is the failure this tool prevents).

Usage:
  python capture_clip_insert.py --url <URL> --start 33:04.6 --end 33:14.6 --out <project>/assets/clip-inserts/CLIP-1-<slug>.mp4
         --caption "Jensen Huang, June 2026, repeating a warning made about 10 years earlier"
         [--expect "nobody goes into this field"] [--whisper-model small.en] [--font <ttf/otf>] [--keep-src] [--no-whisper]

Pull order (every step is a real file on disk, verified before the next; every yt-dlp call has a timeout, so a DASH
stream that will not seek, the every-job stall, falls through instead of hanging):
  1. yt-dlp SECTION pull with audio (--download-sections, --force-keyframes-at-cuts, best video <= 1080p + best audio).
  2. The same window from a single PROGRESSIVE (muxed) stream, which seeks reliably where DASH stalls.
  3. Full best-AUDIO pull, muxed onto whatever section video came back, at the window.
  4. Last resort: the whole video (<= 720p), trimmed with ffmpeg.
Normalise: 1920x1080 letterboxed (never stretched), 30 fps, H.264 crf 18, AAC 48 kHz stereo, exactly end-start long.
Caption: white bold sans (Montserrat Bold by default), centred over a translucent black band along the bottom edge.
Verify: audio stream + mean volume, duration, Whisper transcript (+ --expect phrase must be heard).
Machine lines: CLIP-INSERT-PULLED method=<section|audio-mux|full> src=<file> · CLIP-INSERT-OK file=<out> dur=<s> audio=yes
words="<transcript>" · FAIL <why> · PROGRESS <n>%
Exit: 0 = OK · 1 = FAIL · 2 = usage.
"""
import argparse
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DEFAULT_FONTS = [
    Path("C:/Windows/Fonts/Montserrat-Bold.otf"),
    Path("C:/Windows/Fonts/Montserrat-Bold.ttf"),
    Path.home() / "AppData/Local/Microsoft/Windows/Fonts/Montserrat-Bold.otf",
    Path.home() / "AppData/Local/Microsoft/Windows/Fonts/Montserrat-Bold.ttf",
    Path("C:/Windows/Fonts/arialbd.ttf"),
]


def tc(s: str) -> float:
    """'33:04.6' / '1:02:03.5' / '64.2' -> seconds."""
    parts = [float(p) for p in str(s).strip().split(":")]
    secs = 0.0
    for p in parts:
        secs = secs * 60 + p
    return secs


class _Result:
    def __init__(self, rc, text):
        self.returncode, self.stdout, self.stderr = rc, text, text


def _kill_tree(pid: int):
    if sys.platform == "win32":
        subprocess.run(["taskkill", "/PID", str(pid), "/T", "/F"], capture_output=True)
    else:
        try:
            os.killpg(os.getpgid(pid), signal.SIGKILL)
        except Exception:
            pass


def run(cmd, timeout=None, **kw):
    """ffmpeg / ffprobe (no timeout): captured pipes. yt-dlp (a timeout is given): output goes to a FILE and a timeout
    kills the whole process TREE. yt-dlp spawns ffmpeg / node children that inherit its pipes, so a plain
    subprocess.run(timeout=) kills yt-dlp and then waits forever for the orphan holding the pipe (2026-10-09)."""
    cmd = [str(c) for c in cmd]
    if timeout is None:
        return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)
    with tempfile.TemporaryFile("w+", encoding="utf-8", errors="replace") as log:
        proc = subprocess.Popen(cmd, stdout=log, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL, **kw)
        try:
            rc = proc.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            _kill_tree(proc.pid)
            print(f"  TIMEOUT after {timeout}s: {' '.join(cmd[:3])} ... (process tree killed)", flush=True)
            return _Result(124, "timed out")
        log.seek(0)
        return _Result(rc, log.read())


def probe(path, entries, select=None):
    cmd = ["ffprobe", "-v", "error"]
    if select:
        cmd += ["-select_streams", select]
    cmd += ["-show_entries", entries, "-of", "csv=p=0", str(path)]
    return run(cmd).stdout.strip()


def duration(path) -> float:
    try:
        return float(probe(path, "format=duration").splitlines()[0])
    except Exception:
        return 0.0


def has_audio(path) -> bool:
    return "audio" in probe(path, "stream=codec_type", "a")


def mean_volume_db(path) -> float:
    r = run(["ffmpeg", "-v", "info", "-i", str(path), "-af", "volumedetect", "-vn", "-f", "null", "-"])
    m = re.search(r"mean_volume:\s*(-?[\d.]+) dB", r.stderr or "")
    return float(m.group(1)) if m else -99.0


def ytdlp_cmd():
    exe = shutil.which("yt-dlp")
    return [exe] if exe else [sys.executable, "-m", "yt_dlp"]


def ff_escape_path(p: Path) -> str:
    """A path inside a filter option value: forward slashes, the drive colon escaped."""
    return str(p).replace("\\", "/").replace(":", "\\:")


SECTION_TIMEOUT = 240     # a DASH stream that will not seek stalls here (every-job, 2026-10-08): fall through, never hang
FULL_TIMEOUT = 1800


def pull_section(url, start, end, tmp: Path, fmt: str, name: str):
    out = tmp / f"{name}.%(ext)s"
    for stale in tmp.glob(f"{name}.*"):
        stale.unlink(missing_ok=True)
    print(f"  pulling the section [{fmt}] (timeout {SECTION_TIMEOUT}s) ...", flush=True)
    r = run(ytdlp_cmd() + ["--no-playlist", "-f", fmt, "--download-sections", f"*{start:.3f}-{end:.3f}",
                           "--force-keyframes-at-cuts", "--merge-output-format", "mp4", "-o", str(out), url],
            timeout=SECTION_TIMEOUT)
    files = sorted(p for p in tmp.glob(f"{name}.*") if p.suffix.lower() not in (".part", ".ytdl"))
    if r.returncode != 0 or not files:
        print(f"  section pull [{fmt}] failed (rc {r.returncode}): {(r.stderr or r.stdout).strip().splitlines()[-1:] or ['no output']}", flush=True)
        return None
    return files[0]


def pull_audio(url, tmp: Path):
    out = tmp / "audio.%(ext)s"
    print(f"  pulling the FULL audio (timeout {FULL_TIMEOUT}s) ...", flush=True)
    r = run(ytdlp_cmd() + ["--no-playlist", "-f", "ba/b", "-o", str(out), url], timeout=FULL_TIMEOUT)
    files = sorted(p for p in tmp.glob("audio.*") if p.suffix.lower() not in (".part", ".ytdl"))
    if r.returncode != 0 or not files:
        print(f"  full audio pull failed (rc {r.returncode}): {(r.stderr or r.stdout).strip().splitlines()[-1:] or ['no output']}")
        return None
    return files[0]


def pull_full(url, tmp: Path):
    out = tmp / "full.%(ext)s"
    print(f"  pulling the FULL video <= 720p (timeout {FULL_TIMEOUT}s) ...", flush=True)
    r = run(ytdlp_cmd() + ["--no-playlist", "-f", "bv*[height<=720]+ba/b[height<=720]/bv*+ba/b",
                           "--merge-output-format", "mp4", "-o", str(out), url], timeout=FULL_TIMEOUT)
    files = sorted(p for p in tmp.glob("full.*") if p.suffix.lower() not in (".part", ".ytdl"))
    if r.returncode != 0 or not files:
        print(f"  full pull failed (rc {r.returncode}): {(r.stderr or r.stdout).strip().splitlines()[-1:] or ['no output']}")
        return None
    return files[0]


def normalise(video: Path, out: Path, dur: float, caption: str, font: Path, tmp: Path,
              audio: Path = None, video_offset: float = 0.0, audio_offset: float = 0.0, fps: int = 30,
              caption_pos: str = "bottom"):
    """One ffmpeg pass: trim to the window, letterbox to 1920x1080 @fps, burn the caption, AAC 48k stereo.
    caption_pos 'top' puts the band at the top of the frame: use it whenever the source carries its own lower-third
    (a news chyron, a network bug), so the two never stack (retire-early visual-qa, 2026-10-10)."""
    textfile = tmp / "caption.txt"
    textfile.write_text(caption, encoding="utf-8")
    band_y, text_y = ("0", "26") if caption_pos == "top" else ("ih-96", "h-70")
    vf = ("scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,"
          f"fps={fps},format=yuv420p,"
          f"drawbox=x=0:y={band_y}:w=iw:h=96:color=black@0.55:t=fill,"
          f"drawtext=fontfile='{ff_escape_path(font)}':textfile='{ff_escape_path(textfile)}':expansion=none:fontcolor=white:fontsize=44:"
          f"x=(w-text_w)/2:y={text_y}:shadowcolor=black@0.6:shadowx=2:shadowy=2")
    cmd = ["ffmpeg", "-y", "-loglevel", "error"]
    cmd += ["-ss", f"{video_offset:.3f}", "-i", str(video)]
    if audio is not None:
        cmd += ["-ss", f"{audio_offset:.3f}", "-i", str(audio), "-map", "0:v:0", "-map", "1:a:0"]
    else:
        cmd += ["-map", "0:v:0", "-map", "0:a:0"]
    cmd += ["-t", f"{dur:.3f}", "-vf", vf, "-af", "aresample=48000,apad", "-shortest",
            "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-ar", "48000",
            "-movflags", "+faststart", str(out)]
    r = run(cmd)
    if r.returncode != 0:
        print("FAIL ffmpeg normalise: " + (r.stderr or "").strip()[-800:])
        return False
    return True


def whisper_words(path: Path, model_name: str) -> str:
    try:
        import torch
        import whisper
    except Exception as e:  # pragma: no cover
        return f"(whisper unavailable: {e})"
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = whisper.load_model(model_name, device=device)
    res = model.transcribe(str(path), language="en", fp16=(device == "cuda"))
    return " ".join(str(res.get("text", "")).split())


def norm_words(s: str):
    return re.findall(r"[a-z0-9']+", s.lower())


def phrase_heard(expect: str, heard: str) -> bool:
    """Every expected word (3+ letters) appears in order in the transcript (Whisper drops fillers and punctuation)."""
    e = [w for w in norm_words(expect) if len(w) >= 3]
    h = norm_words(heard)
    i = 0
    for w in h:
        if i < len(e) and w == e[i]:
            i += 1
    return i == len(e) and len(e) > 0


def main():
    global SECTION_TIMEOUT
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--start", required=True, help="window start in the source, M:SS.s or H:MM:SS.s or seconds")
    ap.add_argument("--end", required=True, help="window end (exclusive)")
    ap.add_argument("--out", required=True, help="<project>/assets/clip-inserts/CLIP-<n>-<slug>.mp4")
    ap.add_argument("--caption", required=True, help="the context caption burned on every frame: who, where, when")
    ap.add_argument("--expect", default=None, help="a phrase Whisper must hear in the clip (FAIL otherwise)")
    ap.add_argument("--whisper-model", default="small.en")
    ap.add_argument("--no-whisper", action="store_true")
    ap.add_argument("--font", default=None, help="font file for the caption (default: Montserrat Bold)")
    ap.add_argument("--caption-pos", choices=("bottom", "top"), default="bottom",
                    help="where the context band sits; 'top' when the source has its own lower-third / chyron")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--keep-src", action="store_true", help="keep the raw pulls beside the project's _previews/")
    ap.add_argument("--section-timeout", type=int, default=SECTION_TIMEOUT, help="seconds before a section pull is abandoned for the next method")
    a = ap.parse_args()
    SECTION_TIMEOUT = a.section_timeout

    start, end = tc(a.start), tc(a.end)
    dur = round(end - start, 3)
    if dur <= 0.2:
        print("usage: --end must be after --start", file=sys.stderr)
        sys.exit(2)
    out = Path(a.out).resolve()
    if out.suffix.lower() != ".mp4":
        print("usage: --out must be an .mp4", file=sys.stderr)
        sys.exit(2)
    out.parent.mkdir(parents=True, exist_ok=True)
    font = Path(a.font) if a.font else next((f for f in DEFAULT_FONTS if f.is_file()), None)
    if not font or not font.is_file():
        print(f"FAIL no caption font found (pass --font); looked for {[str(f) for f in DEFAULT_FONTS]}")
        sys.exit(1)
    # raw pulls live under the project's _previews/ when the out path is inside a project, else a temp dir
    proj = next((p.parent for p in out.parents if p.name == "assets"), None)
    tmp = (proj / "_previews" / "clip-src" / out.stem) if proj else Path(tempfile.mkdtemp(prefix="clip-insert-"))
    if tmp.exists() and not a.keep_src:
        shutil.rmtree(tmp, ignore_errors=True)
    tmp.mkdir(parents=True, exist_ok=True)

    print(f"CLIP-INSERT window {start:.3f}-{end:.3f} ({dur:.3f}s) from {a.url}")
    method, video, audio, v_off, a_off = None, None, None, 0.0, 0.0
    def usable(p):
        return p is not None and has_audio(p) and mean_volume_db(p) > -45.0 and duration(p) >= dur - 0.5
    sec = pull_section(a.url, start, end, tmp, "bv*[height<=1080]+ba/b[height<=1080]/bv*+ba/b", "section")
    print("PROGRESS 20%", flush=True)
    if not usable(sec):
        # a single progressive (muxed) stream seeks reliably where DASH stalls; 720p or whatever exists
        prog = pull_section(a.url, start, end, tmp, "b[height<=720][acodec!=none]/b[acodec!=none]/b", "section-prog")
        if usable(prog):
            sec = prog
    print("PROGRESS 30%", flush=True)
    if usable(sec):
        method, video = "section", sec
    else:
        if sec is not None:
            print(f"  section file {sec.name}: audio={'yes' if has_audio(sec) else 'NO'} dur={duration(sec):.2f}s; muxing the full audio onto it")
        full_audio = pull_audio(a.url, tmp)
        print("PROGRESS 50%")
        if sec is not None and full_audio is not None and duration(sec) >= dur - 0.5:
            method, video, audio, a_off = "audio-mux", sec, full_audio, start
        else:
            full = pull_full(a.url, tmp)
            print("PROGRESS 60%")
            if full is None:
                print("FAIL could not pull the source in any way (section, audio, full); check the URL and yt-dlp (memory: --js-runtimes node)")
                sys.exit(1)
            method, video, v_off = "full", full, start
            if not has_audio(full) and full_audio is not None:
                audio, a_off = full_audio, start
    print(f"CLIP-INSERT-PULLED method={method} src={video}")
    if not normalise(video, out, dur, a.caption, font, tmp, audio=audio, video_offset=v_off, audio_offset=a_off, fps=a.fps,
                     caption_pos=a.caption_pos):
        sys.exit(1)
    print("PROGRESS 80%")

    # ── verify, the whole point ──
    problems = []
    got = duration(out)
    if abs(got - dur) > 0.15:
        problems.append(f"duration {got:.3f}s, planned {dur:.3f}s")
    if not has_audio(out):
        problems.append("no audio stream (a clip insert must carry its own voice)")
    else:
        mv = mean_volume_db(out)
        if mv < -45.0:
            problems.append(f"audio is silent (mean volume {mv:.1f} dB)")
    w, h = (probe(out, "stream=width,height", "v:0").split(",") + ["", ""])[:2]
    if (w, h) != ("1920", "1080"):
        problems.append(f"frame is {w}x{h}, not 1920x1080")
    words = ""
    if not a.no_whisper and not problems:
        words = whisper_words(out, a.whisper_model)
        print(f"  whisper ({a.whisper_model}): {words}")
        if a.expect and not phrase_heard(a.expect, words):
            problems.append(f"expected phrase not heard: {a.expect!r}")
    if problems:
        for p in problems:
            print(f"FAIL  {p}")
        print(f"CLIP-INSERT-FAIL file={out} ({len(problems)} problem(s)); the raw pulls are in {tmp}")
        sys.exit(1)
    if not a.keep_src:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f"CLIP-INSERT-OK file={out} dur={got:.3f} audio=yes words=\"{words}\"")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
