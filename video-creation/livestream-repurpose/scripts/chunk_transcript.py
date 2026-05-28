"""Break a Whisper JSON transcript into fixed time-window chunks for topic finding.

Usage: python chunk_transcript.py <whisper.json> [window_seconds]

Each chunk is a timestamped window of the transcript, so topics can be located
WITH their timestamps instead of reading one blob with no time markers.
Default window: 90s. Output: <basename>_chunks_<window>s.txt
"""
import json, os, sys

src = sys.argv[1]
window = int(sys.argv[2]) if len(sys.argv) > 2 else 90
out = os.path.splitext(src)[0] + f"_chunks_{window}s.txt"

with open(src, encoding="utf-8") as f:
    data = json.load(f)

# Flatten to a stream of (start, word) using word-level timing where available.
words = []
for seg in data["segments"]:
    segw = seg.get("words", [])
    if segw:
        for w in segw:
            words.append((w.get("start", seg["start"]), w["word"].strip()))
    else:
        words.append((seg["start"], seg["text"].strip()))

def fmt(t):
    return f"{int(t // 60):02d}:{t % 60:05.2f}"

lines = []
bucket_start = 0.0
bucket_words = []

def flush(end_t):
    if not bucket_words:
        return
    text = " ".join(bucket_words)
    lines.append(f"\n=== [{fmt(bucket_start)} - {fmt(end_t)}] ===")
    lines.append(text)

for start, word in words:
    if start >= bucket_start + window:
        flush(start)
        # advance bucket_start in whole-window steps so chunks stay aligned
        while start >= bucket_start + window:
            bucket_start += window
        bucket_words = []
    bucket_words.append(word)

if bucket_words:
    flush(words[-1][0])

with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines).lstrip())

n_chunks = sum(1 for l in lines if l.startswith("\n==="))
print(f"{n_chunks} chunks ({window}s windows) -> {out}")
