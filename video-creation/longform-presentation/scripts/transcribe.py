"""Word-level transcription utility for the longform-presentation pipeline.

Defaults to the `medium` model on GPU: base smooths over disfluencies (stammers, false
starts), which is exactly what we need to SEE when hunting fumbles. Saves a word-timestamped
json next to the source and prints segments with timestamps.

Usage:
    python transcribe.py "media/<file>.mp4" [--model medium] [--device auto]
"""
import argparse, json, os, sys


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--model", default="medium")
    ap.add_argument("--device", default="auto", help="auto|cuda|cpu")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print("no such file:", args.src); sys.exit(1)

    import torch, whisper
    device = args.device
    if device == "auto":
        device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"loading {args.model} on {device}...")
    model = whisper.load_model(args.model, device=device)
    result = model.transcribe(args.src, word_timestamps=True, language="en",
                              fp16=(device == "cuda"))

    out = args.out or os.path.splitext(args.src)[0] + f".{args.model}-words.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    nwords = sum(len(s.get("words", [])) for s in result["segments"])
    print(f"segments {len(result['segments'])}  words {nwords}  -> {out}\n")
    for s in result["segments"]:
        print(f"[{s['start']:7.2f}-{s['end']:7.2f}] {s['text'].strip()}")


if __name__ == "__main__":
    main()
