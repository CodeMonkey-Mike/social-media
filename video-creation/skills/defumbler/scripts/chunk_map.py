"""chunk_map.py — silence-segmented, per-chunk transcript map (the reliable defumble primitive).

WHY THIS EXISTS (read defumbler.md): Whisper run on a whole multi-take recording HIDES retakes
(it dedupes "say-it / stop / retake" into one collapsed "held word"), and its word timestamps
drift up to ~2.5s. Cutting from that = clipped words AND missed fumbles (failed 3x on silverscript
before this). The fix: cut the audio at SILENCE boundaries (rock-solid, don't move across
thresholds) into voiced chunks, and transcribe each chunk IN ISOLATION (short clips transcribe
honestly). Now every retake is its own visible chunk and every cut boundary lives in a silence gap,
so a cut can never land inside a word.

Output:
  <src>._chunkmap.txt   human-readable: [idx] start-end (dur) gapBefore  text
  <src>._chunkmap.json  machine: [{i,start,end,text,sil_before:[s,e],sil_after:[s,e]}]
The .json's sil_before/sil_after let you place every cut in the MIDDLE of a silence (never on a word).

Usage:
    python chunk_map.py "<video-or-audio>"  [--noise -42dB] [--sil-d 0.30] [--min-chunk 0.25]
                                            [--model medium]
"""
import argparse, json, os, re, subprocess, sys, tempfile


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def duration(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", p]).decode().strip())


def detect_silences(src, noise, d):
    r = run(["ffmpeg", "-i", src, "-af", f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"])
    starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", r.stderr)]
    spans = []
    for s in starts:
        e = next((e for e in ends if e > s), None)
        if e is not None:
            spans.append((s, e))
    return spans


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--noise", default="-42dB", help="silence threshold; do NOT go hotter than ~-40 (clips syllables)")
    ap.add_argument("--sil-d", type=float, default=0.30, help="min silence to split a take/retake on")
    ap.add_argument("--min-chunk", type=float, default=0.25, help="ignore voiced blips shorter than this")
    ap.add_argument("--model", default="medium")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print("no such file:", args.src); sys.exit(1)

    total = duration(args.src)
    sil = detect_silences(args.src, args.noise, args.sil_d)

    # voiced chunks = complement of silence over [0,total]; remember the silence on each side
    chunks, cur, prev_sil = [], 0.0, (0.0, 0.0)
    for s, e in sil:
        if s > cur + args.min_chunk:
            chunks.append({"start": cur, "end": s, "sil_before": list(prev_sil), "sil_after": [s, e]})
        cur = max(cur, e)
        prev_sil = (s, e)
    if cur < total - args.min_chunk:
        chunks.append({"start": cur, "end": total, "sil_before": list(prev_sil), "sil_after": [total, total]})

    import whisper
    m = whisper.load_model(args.model)
    txt_path = os.path.splitext(args.src)[0] + "._chunkmap.txt"
    json_path = os.path.splitext(args.src)[0] + "._chunkmap.json"
    tf = open(txt_path, "w", encoding="utf-8")
    prev_end = 0.0
    for i, c in enumerate(chunks):
        a, b = c["start"], c["end"]
        wav = os.path.join(tempfile.gettempdir(), "chunkmap_seg.wav")
        run(["ffmpeg", "-y", "-v", "error", "-ss", str(a), "-to", str(b), "-i", args.src,
             "-vn", "-ac", "1", "-ar", "16000", wav])
        r = m.transcribe(wav, language="en", word_timestamps=False)
        text = " ".join(s["text"].strip() for s in r["segments"]).strip()
        c["i"], c["text"] = i, text
        gap = a - prev_end
        tf.write(f"[{i:03d}] {a:7.2f}-{b:7.2f} ({b-a:4.1f}s) gap{gap:4.1f}  {text}\n")
        prev_end = b
    tf.close()
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=1)
    print(f"{len(chunks)} chunks ({len(sil)} silence spans) -> {txt_path}")
    print(f"machine map -> {json_path}  (use sil_before/sil_after to place cuts inside silence)")


if __name__ == "__main__":
    main()
