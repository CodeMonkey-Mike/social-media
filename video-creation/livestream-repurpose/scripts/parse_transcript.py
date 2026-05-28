import json, textwrap

import sys, os
src = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\mnede\Documents\Claude\video-creation\livestream-repurpose\transcripts\bulls are sleeping LOW BPS VERTICAL.json"
base = os.path.splitext(src)[0]
out_txt = base + "_words.txt"
out_plain = base + "_plain.txt"

with open(src, encoding="utf-8") as f:
    data = json.load(f)

lines_words = []
lines_plain = []

for seg in data["segments"]:
    seg_start = seg["start"]
    seg_end = seg["end"]
    words = seg.get("words", [])

    if words:
        # Word-level: one line per word with timestamp
        for w in words:
            t = w.get("start", seg_start)
            mins = int(t // 60)
            secs = t % 60
            lines_words.append(f"[{mins:02d}:{secs:05.2f}]  {w['word'].strip()}")
    else:
        # Fallback: segment-level
        t = seg_start
        mins = int(t // 60)
        secs = t % 60
        lines_words.append(f"[{mins:02d}:{secs:05.2f}]  {seg['text'].strip()}")

    # Plain text: full segment text
    lines_plain.append(seg["text"].strip())

with open(out_txt, "w", encoding="utf-8") as f:
    f.write("\n".join(lines_words))

with open(out_plain, "w", encoding="utf-8") as f:
    f.write(" ".join(lines_plain))

print(f"Word-level transcript: {len(lines_words)} words -> {out_txt}")
print(f"Plain transcript -> {out_plain}")
