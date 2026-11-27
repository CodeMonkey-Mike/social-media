#!/usr/bin/env python
"""clip_insert.py: splice third-party CLIPS (each with its OWN voice) into the final spine of a SCRIPTED standard video.

Read clip-insert.md (this folder) and ../script/script.md first. Born on longest-bear (2026-11-25): "show a montage of four or
five clips of people saying we're in a new bull market".

A script line `[INSERT]` CLIP-<NAME>: ... sits under a spoken line. That line is the SET-UP: Mike says it and ends the
sentence. The recording pauses at the end of its last word, the clips play back to back, full frame, with their own audio,
and the recording resumes. Nothing is overlaid: the clips are spliced INTO the spine, so the spine, its words JSON and
everything after the splice move later by the montage's length. cue_script.py then works on the augmented spine.

  python clip_insert.py bake "media/standard/<p>/SCRIPT.md" \
      --spine "media/standard/<p>/spine/<final spine>.mp4" --words "media/standard/<p>/spine/<final spine>.medium-words.json"
      [--clips-dir media/standard/<p>/assets/clip-inserts] [--out-dir media/standard/<p>/overlays] [--allow-noisy]

Input : the clips `assets/clip-inserts/<ID>-<n>-<slug>.mp4` (ID = the `[INSERT]` id, e.g. CLIP-MONTAGE-1-cnbc.mp4, played in
        the order of n), each already 1920x1080 / 30 fps with audio, from ../../../longform-edited/skills/clip-inserts/
        capture_clip_insert.py (`--no-caption`: Mike's call for longest-bear, no names, no captions).
Output: <spine stem>+clips.mp4 and <stem>+clips.medium-words.json beside the spine (the words JSON with every time at or
        after the splice moved later by the montage's length), and <out-dir>/inserts.json (the splice point `at`, the length
        `dur`, each clip's window). The original spine and words are never touched, so a re-run starts from them again.

How the splice point is found (never typed in): the set-up line is aligned to the transcript the way cue_script.py aligns
it, and the splice is 0.2 s after its last word (inside the pause the silence pass left: 200 ms after + 100 ms before the
next word), on a frame boundary. The spine's audio there must be silent (volumedetect, mean under -50 dB); a splice that is
not is a FAIL with the measured level (re-pick, or --allow-noisy when Mike has listened).

The clips' loudness is matched to his voice (loudnorm to the spine's measured integrated loudness), each with a 15 ms
fade in and out; clips cut hard against each other and against the recording (no transition, a montage is a hard cut).
Video is re-encoded once (crf 12, near-lossless) and audio at 320 kbps AAC; the card render copies that audio and the
music mix re-encodes it after, so no generation is added that was not already going to happen.

Machine line: CLIP-INSERT PASS|FAIL inserts=N clips=N at=<s> dur=<s> frames=<out> (spine <in> + <clip frames>)
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "script"))
import script_common as SC  # noqa: E402
import cue_script as CS  # noqa: E402  (the one aligner)

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

AFTER_S = 0.2           # the splice sits this long after the set-up line's last word (inside the residual silence)
FADE_S = 0.015          # clip audio fade in / out
SILENT_DB = -50.0       # the audio at the splice must be quieter than this (mean volume)
W, H = 1920, 1080


def probe(path, entries, v=True):
    r = subprocess.run(["ffprobe", "-v", "error"] + (["-select_streams", "v:0"] if v else []) +
                       ["-show_entries", entries, "-of", "default=nw=1:nk=1", str(path)], capture_output=True, text=True)
    return r.stdout.split()


def fps_of(path):
    num, den = probe(path, "stream=r_frame_rate")[0].split("/")
    return round(int(num) / int(den))


def mean_db(path, t0, t1):
    """Mean volume (dB) of the audio between t0 and t1 seconds."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-ss", f"{max(0.0, t0):.4f}", "-t", f"{t1 - t0:.4f}", "-i", str(path),
                        "-vn", "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True)
    m = re.search(r"mean_volume:\s*(-?[\d.]+|-inf)", r.stderr)
    return float(m.group(1)) if m and m.group(1) != "-inf" else -99.0


def integrated_lufs(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-vn", "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True)
    hits = re.findall(r"I:\s*(-?[\d.]+)\s*LUFS", r.stderr)
    return float(hits[-1]) if hits else -20.0


def find_clips(clips_dir, cid):
    files = [p for p in Path(clips_dir).glob(f"{cid}-*.mp4")]
    def n_of(p):
        m = re.match(re.escape(cid) + r"-(\d+)", p.stem)
        return int(m.group(1)) if m else 999
    return sorted(files, key=n_of)


def splice_point(parsed, words_path, ins):
    """(at seconds, the set-up line's text, the aligned last word's end, the next word's start) for one `[INSERT]`."""
    lines = parsed["lines"]
    words = CS.load_words(words_path)
    res, T = CS.align(lines, words)
    idx = next((i for i, e in enumerate(lines) if e["n"] == ins["after"]), None)
    if idx is None or res[idx] is None:
        sys.exit(f"the set-up line (script line {ins['after']}) was not found in the transcript: cue it first (cue_script.py) "
                 "and check CUE-REPORT.md, or fix the line")
    r = res[idx]
    end_tok = r["ti_l"] + r["k_tail"]
    nxt = next((res[j] for j in range(idx + 1, len(lines)) if res[j]), None)
    if nxt:
        end_tok = min(end_tok, nxt["ti_f"] - 1)
    end_tok = min(end_tok, len(T) - 1)
    wi = T[end_tok][1]
    w_end = words[wi]["end"]
    n_start = words[wi + 1]["start"] if wi + 1 < len(words) else w_end + 1.0
    return w_end, n_start, "".join(w["raw"] for w in words[max(0, wi - 5):wi + 1]).strip()


def shift_words(src, dst, at, dur):
    data = json.loads(Path(src).read_text(encoding="utf-8"))
    segs = data["segments"] if isinstance(data, dict) else data

    def mv(o, k):
        if k in o and isinstance(o[k], (int, float)) and o[k] >= at - 1e-9:
            o[k] = round(o[k] + dur, 3)
    for s in segs:
        for k in ("start", "end"):
            mv(s, k)
        for w in s.get("words", []):
            for k in ("start", "end"):
                mv(w, k)
    Path(dst).write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8", newline="\n")


def bake(a):
    script, spine, words = Path(a.script).resolve(), Path(a.spine).resolve(), Path(a.words).resolve()
    proj = script.parent
    parsed = SC.parse(script.read_text(encoding="utf-8"))
    if not parsed["inserts"]:
        sys.exit("the script has no `[INSERT]` line")
    if len(parsed["inserts"]) > 1:
        sys.exit("one `[INSERT]` per video for now: clip_insert.py splices one montage (script.md 'The extras')")
    ins = parsed["inserts"][0]
    clips_dir = Path(a.clips_dir) if a.clips_dir else proj / "assets" / "clip-inserts"
    out_dir = Path(a.out_dir) if a.out_dir else proj / "overlays"
    clips = find_clips(clips_dir, ins["id"])
    if not clips:
        sys.exit(f"no clips: expected {clips_dir}/{ins['id']}-<n>-<slug>.mp4 (captured with capture_clip_insert.py --no-caption)")
    fps = fps_of(spine)
    n_spine = int(probe(spine, "stream=nb_frames")[0])
    w_end, n_start, tail = splice_point(parsed, words, ins)
    gap = n_start - w_end
    at = round((w_end + min(AFTER_S, 0.6 * gap)) * fps) / fps
    if a.at is not None:          # a hand-measured trough: Whisper can butt two words together over a real pause
        at = round(a.at * fps) / fps
        if abs(at - w_end) > 1.0:
            sys.exit(f"--at {a.at} is more than 1 s from the set-up line's end ({w_end:.3f} s)")
    print(f"set-up line {ins['after']} ends '...{tail}' at {w_end:.3f} s; the next word starts at {n_start:.3f} s (gap {gap:.2f} s)")
    if gap < 0.25:
        print(f"  FLAG  only {gap:.2f} s between the set-up and the next word: the splice is tight")
    if a.at is None and not (w_end < at < n_start):
        sys.exit(f"splice {at:.3f} s is not inside the pause {w_end:.3f} to {n_start:.3f}")
    db = mean_db(spine, at - 0.06, at + 0.06)
    print(f"  splice at {at:.3f} s (frame {round(at * fps)}), the audio there: {db:.1f} dB")
    if db > SILENT_DB and not a.allow_noisy:
        sys.exit(f"CLIP-INSERT FAIL: the spine is not silent at the splice ({db:.1f} dB over {SILENT_DB} dB): listen at "
                 f"{at:.2f} s; --allow-noisy if Mike has")
    lufs = max(-23.0, min(-14.0, integrated_lufs(spine)))
    print(f"  voice loudness {lufs:.1f} LUFS: the clips are matched to it")

    cf, ca, frames = [], [], []
    for p in clips:
        d = float(probe(p, "format=duration", v=False)[0])
        has_a = bool(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=codec_type", "-of", "csv=p=0",
                                     str(p)], capture_output=True, text=True).stdout.strip())
        if not has_a:
            sys.exit(f"{p.name} has no audio stream: a clip insert plays with its own voice (never a muted cover)")
        n = int(d * fps)
        frames.append(n)
        print(f"  clip {p.name}: {d:.2f} s -> {n} frames")
    fi = round(at * fps)
    g = [f"[0:v]trim=end={fi / fps:.6f},setpts=PTS-STARTPTS,format=yuv420p[va]",
         f"[0:a]atrim=end={fi / fps:.6f},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo[aa]"]
    seq = ["[va][aa]"]
    for i, (p, n) in enumerate(zip(clips, frames), 1):
        dur = n / fps
        g.append(f"[{i}:v]fps={fps},scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:black,setsar=1,"
                 f"trim=end_frame={n},setpts=PTS-STARTPTS,format=yuv420p[cv{i}]")
        g.append(f"[{i}:a]loudnorm=I={lufs}:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo,atrim=end={dur:.6f},"
                 f"asetpts=PTS-STARTPTS,apad=whole_dur={dur:.6f},afade=t=in:d={FADE_S},afade=t=out:st={dur - FADE_S:.6f}:d={FADE_S}[ca{i}]")
        seq.append(f"[cv{i}][ca{i}]")
    g.append(f"[0:v]trim=start={fi / fps:.6f},setpts=PTS-STARTPTS,format=yuv420p[vb]")   # by TIME: the spine keeps its own frame timestamps
    g.append(f"[0:a]atrim=start={fi / fps:.6f},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo[ab]")
    seq.append("[vb][ab]")
    g.append("".join(seq) + f"concat=n={len(seq)}:v=1:a=1[v][a]")
    out = spine.with_name(spine.stem + "+clips.mp4")
    args = ["ffmpeg", "-v", "error", "-stats", "-y", "-i", str(spine)]
    for p in clips:
        args += ["-i", str(p)]
    args += ["-filter_complex", ";".join(g), "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "12", "-preset", "fast",
             "-pix_fmt", "yuv420p", "-fps_mode", "passthrough", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart", str(out)]
    print(f"baking -> {out}", flush=True)
    if subprocess.run(args).returncode:
        sys.exit("ffmpeg failed")
    n_out = int(probe(out, "stream=nb_frames")[0])
    want = n_spine + sum(frames)
    dur = sum(frames) / fps
    ok = abs(n_out - want) <= 1
    new_words = out.with_name(out.stem + ".medium-words.json")
    shift_words(words, new_words, at, dur)
    out_dir.mkdir(parents=True, exist_ok=True)
    rec = {"script": str(script), "source_spine": str(spine), "source_words": str(words), "spine": str(out), "words": str(new_words),
           "fps": fps, "inserts": [{"id": ins["id"], "after_line": ins["after"], "line": ins["n"], "at": round(at, 4),
                                    "dur": round(dur, 4), "frames": sum(frames), "voice_lufs": lufs,
                                    "clips": [{"file": str(p), "frames": n, "start": round(at + sum(frames[:k]) / fps, 4),
                                               "dur": round(n / fps, 4)} for k, (p, n) in enumerate(zip(clips, frames))]}]}
    (out_dir / "inserts.json").write_text(json.dumps(rec, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"WROTE {out_dir / 'inserts.json'}; words {new_words.name}")
    print(f"CLIP-INSERT {'PASS' if ok else 'FAIL'} inserts=1 clips={len(clips)} at={at:.3f} dur={dur:.3f} frames={n_out} "
          f"(spine {n_spine} + {sum(frames)})")
    if not ok:
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description="Splice clips with their own voice into the final spine of a scripted video.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("bake", help="build <spine>+clips.mp4, the shifted words JSON and overlays/inserts.json")
    b.add_argument("script")
    b.add_argument("--spine", required=True, help="the FINAL spine (the original, never the +clips file)")
    b.add_argument("--words", required=True, help="the FINAL spine's <name>.medium-words.json (the original)")
    b.add_argument("--clips-dir", default=None, help="default: <script folder>/assets/clip-inserts")
    b.add_argument("--out-dir", default=None, help="default: <script folder>/overlays")
    b.add_argument("--at", type=float, default=None, help="splice here (seconds, measured silence) when the word times are wrong")
    b.add_argument("--allow-noisy", action="store_true", help="splice even where the audio is not silent (Mike has listened)")
    a = ap.parse_args()
    if a.cmd == "bake":
        bake(a)


if __name__ == "__main__":
    main()
