"""[DIAGNOSIS ONLY — do NOT derive cuts from this. Canonical defumble = video-creation/skills/defumbler/defumbler.md
   (chunk-map + cut-only-in-silence). This whole-file approach HIDES retakes and DRIFTS; cutting from it clips
   words and misses fumbles. Use it to eyeball, never to cut.]

Coverage audit: find voiced spans Whisper did NOT transcribe (hidden retakes/fumbles).

Whisper dedupes repeated takes (drops/merges/zero-width words), so the word-json is not a
complete map of the speech. This audits the gap: it diffs the ffmpeg silencedetect voiced
spans against word-json coverage and reports every voiced-but-untranscribed stretch. Treat
each one >= ~1s as a hidden take/fumble until proven otherwise (longform-edited.md Phase 3,
"Whisper HIDES retakes" — learned on banks-own-chain 2026-06-11).

Usage:
    python audit_coverage.py "media/<p>/<name> LOW BPS.mp4"            # json defaults to <name>.medium-words.json
        [--words <words.json>] [--noise -50dB] [--sil 2.0] [--min-gap 1.5]
        [--transcribe]      # force-transcribe each flagged span in isolation (word timestamps)
        [--energy a-b]      # fine energy map (-38dB d=0.2) of a window, for take boundaries
"""
import argparse, json, os, re, subprocess, sys


def detect_silences(src, noise, d):
    r = subprocess.run(["ffmpeg", "-i", src, "-af",
                        f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"],
                       capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", r.stderr)]
    spans = []
    for s in starts:
        e = next((e for e in ends if e > s), None)
        if e is not None:
            spans.append((s, e))
    return spans


def duration(src):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", src]).decode().strip())


def load_words(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict) and "segments" in data:
        return [w for seg in data["segments"] for w in seg.get("words", [])]
    return data["words"] if isinstance(data, dict) else data


def transcribe_span(src, a, b, model):
    import tempfile
    wav = os.path.join(tempfile.gettempdir(), "audit_span.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(a), "-to", str(b),
                    "-i", src, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)
    r = model.transcribe(wav, language="en", word_timestamps=True)
    out = [(w["start"] + a, w["end"] + a, w["word"].strip())
           for seg in r["segments"] for w in seg.get("words", [])]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--words")
    ap.add_argument("--noise", default="-50dB")
    ap.add_argument("--sil", type=float, default=2.0, help="silence min-duration (match your desilence pass)")
    ap.add_argument("--min-gap", type=float, default=1.5, help="report uncovered stretches longer than this")
    ap.add_argument("--transcribe", action="store_true", help="force-transcribe each flagged span")
    ap.add_argument("--energy", help="fine energy map of window 'a-b' (-38dB d=0.2) and exit")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print("no such file:", args.src); sys.exit(1)

    if args.energy:
        a, b = (float(x) for x in args.energy.split("-"))
        spans = detect_silences(args.src, "-38dB", 0.2)
        print(f"energy map {a}-{b} (silences at -38dB/0.2s; speech = the gaps between):")
        for s, e in spans:
            if e > a and s < b:
                print(f"  quiet {s:8.2f} - {e:8.2f}  ({e - s:.2f}s)")
        return

    words_path = args.words or os.path.splitext(args.src)[0] + ".medium-words.json"
    if not os.path.isfile(words_path):
        print("no words json:", words_path); sys.exit(1)
    words = load_words(words_path)
    total = duration(args.src)
    sil = detect_silences(args.src, args.noise, args.sil)

    voiced, cur = [], 0.0
    for s, e in sil:
        if s > cur:
            voiced.append((cur, s))
        cur = max(cur, e)
    if cur < total:
        voiced.append((cur, total))

    flagged = []
    for a, b in voiced:
        ws = [w for w in words if w["end"] > a and w["start"] < b]
        cur2 = a
        for w in ws:
            if w["start"] - cur2 > args.min_gap:
                flagged.append((cur2, w["start"]))
            cur2 = max(cur2, w["end"])
        if b - cur2 > args.min_gap:
            flagged.append((cur2, b))
        if not ws and b - a > 0.1:
            flagged.append((a, b))

    print(f"{len(flagged)} voiced-but-untranscribed span(s) (> {args.min_gap}s, or wordless blips):")
    for a, b in flagged:
        print(f"  UNCOVERED {a:8.2f} - {b:8.2f}  ({b - a:.1f}s)")

    if args.transcribe and flagged:
        import whisper
        model = whisper.load_model("medium")
        for a, b in flagged:
            got = transcribe_span(args.src, max(0, a - 0.3), min(total, b + 0.3), model)
            print(f"--- span {a:.2f}-{b:.2f} ---")
            if not got:
                print("  (no speech detected — likely noise/breath; cut if it would float between silence cuts)")
            for s, e, w in got:
                print(f"  {s:8.2f} {e:8.2f}  {w}")


if __name__ == "__main__":
    main()
