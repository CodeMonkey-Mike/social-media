"""whisper_jobs.py — batch Whisper decoder: load the model ONCE, run every window.

WHY (measured 2026-08-19, RTX 4070 Laptop, torch cu128): openai-whisper already runs on CUDA
here, and a warm decode of a 4 s verification window takes ~1.6 s — but EVERY separate
`whisper` / `python -c` invocation pays ~20.5 s of model load plus ~5-10 s of interpreter and
torch startup first. A builder's SFX sweep (10-30 staggered windows + whole-file passes +
encode-matched controls) was spending 10-15 MINUTES on reloads for seconds of real compute.
This tool is the sanctioned fix: group all decodes of a build step into one jobs file and run
them in one process. Same engine, same models, same timings as the canonical pipeline — only
the reload tax is removed. (remotion-shorts-build SKILL.md mandates this for any multi-decode
verification step.)

Jobs file (JSON list; every field except `audio` optional):
    [
      { "id": "cue1-w1", "audio": "path/to/clip.mp4", "model": "medium.en",
        "clip": "17.0,21.0",          # decode only this window (seconds in the file)
        "language": "en",
        "word_timestamps": false,
        "initial_prompt": null }
    ]

HOW `clip` IS HANDLED (fixed 2026-09-03, after two builders each lost ~30 min to it):
A `clip` window is PRE-CUT with ffmpeg to a small 16 kHz mono WAV and decoded as a whole
file. Whisper's own `clip_timestamps` is deliberately NOT used any more, because it has two
defects that both bit the `tendies` batch:

  1. IT HANGS when a window ends at or past the audio duration. In whisper/transcribe.py the
     loop exits on `seek >= seek_clip_end`, but advances by
     `segment_size = min(N_FRAMES, content_frames - seek, seek_clip_end - seek)`. When
     seek_clip_end sits beyond content_frames, `content_frames - seek` hits 0 first, so
     segment_size becomes 0 and `seek += 0` spins forever on a zero-width mel segment: no
     error, no output, ~0.13 cores, indefinitely. (A 46.000 s file with "42.0,46.0" wedges;
     "42.0,45.9" does not.) Windows are still CLAMPED to duration - CLIP_END_GUARD as a second
     line of defence.
  2. IT IS PATHOLOGICALLY SLOW. `model.transcribe(path)` calls `load_audio(path)`, which
     ffmpeg-decodes the ENTIRE file on EVERY call; `clip_timestamps` narrows only what is
     PROCESSED, never what is LOADED. N windows against one 1080x1920 mp4 meant N full video
     decodes. Measured: a 13-job batch ran 50+ min and produced nothing; the same decodes off
     pre-cut WAVs ran 0.4-1.6 s each (57 jobs in ~2 min).

Pre-cut temp WAVs are written to a TemporaryDirectory and removed on exit.

Usage:
    python video-creation/shorts/_tooling/whisper_jobs.py --jobs jobs.json --out results.json

Output: {id: {"text": ..., "segments": [{"start","end","text"}, ...],
              "words": [...only if word_timestamps]}, ...}
Jobs are grouped by model; each model is loaded once (CUDA if available) and freed before the
next group, so mixing medium.en and large-v3 in one run is fine on the 8 GB card.
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import time

# A clip window must never end AT the container duration (see the docstring: whisper's
# clip_timestamps loop wedges). We cut our own WAVs now, but the clamp stays as defence.
CLIP_END_GUARD = 0.10


def probe_duration(path):
    """Container duration in seconds, or None if ffprobe cannot read it."""
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", path],
            capture_output=True, text=True, check=True).stdout.strip()
        return float(out)
    except Exception:
        return None


def parse_clip(spec):
    """'17.0,21.0' -> (17.0, 21.0). Returns None for anything else (incl. odd counts)."""
    try:
        parts = [float(x) for x in str(spec).split(",") if x.strip() != ""]
    except ValueError:
        return None
    return (parts[0], parts[1]) if len(parts) == 2 else None


def precut(src, start, end, tmpdir, job_id):
    """Cut [start,end) to a 16 kHz mono WAV so whisper loads seconds, not the whole file.

    Returns the WAV path, or None if ffmpeg fails (caller falls back to the full file).
    """
    dst = os.path.join(tmpdir, f"{job_id}.wav")
    cmd = ["ffmpeg", "-nostdin", "-v", "error", "-y",
           "-ss", f"{start:.3f}", "-to", f"{end:.3f}", "-i", src,
           "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", dst]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except Exception as e:
        print(f"[whisper_jobs]   WARN precut failed for {job_id}: {e}", flush=True)
        return None
    return dst if os.path.isfile(dst) and os.path.getsize(dst) > 44 else None


def main():
    ap = argparse.ArgumentParser(description="Batch Whisper decodes: one model load, many windows.")
    ap.add_argument("--jobs", required=True, help="jobs JSON (see module docstring)")
    ap.add_argument("--out", required=True, help="results JSON path")
    ap.add_argument("--device", default=None, help="override device (default: cuda if available)")
    args = ap.parse_args()

    with open(args.jobs, encoding="utf-8") as f:
        jobs = json.load(f)
    if not isinstance(jobs, list) or not jobs:
        sys.exit("jobs file must be a non-empty JSON list")
    for i, j in enumerate(jobs):
        if not j.get("audio"):
            sys.exit(f"job[{i}] missing 'audio'")
        j.setdefault("id", f"job{i}")
        j.setdefault("model", "medium.en")

    import torch      # heavy imports after arg validation
    import whisper

    device = args.device or ("cuda" if torch.cuda.is_available() else "cpu")
    fp16 = device == "cuda"
    results = {}
    by_model = {}
    for j in jobs:
        by_model.setdefault(j["model"], []).append(j)

    tmp = tempfile.TemporaryDirectory(prefix="whisper_jobs_")
    tmpdir = tmp.name
    for model_name, group in by_model.items():
        t0 = time.time()
        model = whisper.load_model(model_name, device=device)
        print(f"[whisper_jobs] {model_name} loaded on {device} in {time.time() - t0:.1f}s "
              f"({len(group)} job(s))", flush=True)
        for j in group:
            kw = {"language": j.get("language", "en"), "fp16": fp16, "verbose": None}
            if j.get("word_timestamps"):
                kw["word_timestamps"] = True
            if j.get("initial_prompt"):
                kw["initial_prompt"] = j["initial_prompt"]

            # A `clip` window is pre-cut to a small WAV rather than handed to whisper's
            # clip_timestamps (which hangs at the duration boundary and reloads the whole
            # file every call). Times in the result are rebased to the SOURCE file so
            # callers see the same numbers clip_timestamps used to give them.
            src, offset = j["audio"], 0.0
            win = parse_clip(j["clip"]) if j.get("clip") else None
            if win:
                start, end = win
                dur = probe_duration(j["audio"])
                if dur is not None and end > dur - CLIP_END_GUARD:
                    clamped = max(start + 0.05, dur - CLIP_END_GUARD)
                    if clamped < end:
                        print(f"[whisper_jobs]   {j['id']}: clip end {end:.2f} -> "
                              f"{clamped:.2f} (file is {dur:.2f}s; guard)", flush=True)
                        end = clamped
                if end > start:
                    cut = precut(j["audio"], start, end, tmpdir, j["id"])
                    if cut:
                        src, offset = cut, start

            t1 = time.time()
            r = model.transcribe(src, **kw)
            out = {"text": r["text"].strip(),
                   "segments": [{"start": s["start"] + offset, "end": s["end"] + offset,
                                 "text": s["text"]}
                                for s in r.get("segments", [])],
                   "decode_s": round(time.time() - t1, 2)}
            if j.get("word_timestamps"):
                words = []
                for s in r.get("segments", []):
                    for w in s.get("words", []):
                        w = dict(w)
                        if "start" in w:
                            w["start"] += offset
                        if "end" in w:
                            w["end"] += offset
                        words.append(w)
                out["words"] = words
            results[j["id"]] = out
            print(f"[whisper_jobs]   {j['id']}: {out['decode_s']}s", flush=True)
        del model
        if device == "cuda":
            torch.cuda.empty_cache()

    tmp.cleanup()

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print(f"[whisper_jobs] wrote {len(results)} result(s) -> {args.out}", flush=True)


if __name__ == "__main__":
    main()
