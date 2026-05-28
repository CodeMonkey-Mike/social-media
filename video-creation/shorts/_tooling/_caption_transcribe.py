"""Word-level Whisper transcription for an edited short clip -> captions source.
Usage: python _tooling/_caption_transcribe.py <batch>/<clip-folder>   (e.g. meme-coins/keycat-vs-doginme)
Writes <folder>/whisper-words.json (full result) and prints duration + word count.
"""
import sys, os, json, subprocess

# This script lives in shorts/_tooling/; SHORTS is the shorts/ dir one level up.
SHORTS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True,
    )
    try:
        return float(out.stdout.strip())
    except Exception:
        return None

def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "meme-coins/keycat-vs-doginme"
    clip = os.path.join(SHORTS, folder, "preview.mp4")
    if not os.path.exists(clip):
        print("NOT FOUND:", clip); sys.exit(1)

    print("clip:", clip)
    print("duration:", duration(clip), "s")

    import whisper
    model = whisper.load_model("base")
    result = model.transcribe(clip, word_timestamps=True, language="en")

    out = os.path.join(SHORTS, folder, "whisper-words.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    nwords = sum(len(s.get("words", [])) for s in result["segments"])
    print("segments:", len(result["segments"]), "words:", nwords)
    print("wrote:", out)
    print("---PLAIN---")
    print(result["text"].strip())

if __name__ == "__main__":
    main()
