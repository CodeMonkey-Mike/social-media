"""
SUPERSEDED -> use `video-creation/skills/captions/build_captions.py` (canonical caption skill, captions/captions.md).
The --teal/--yellow/--green/--red colour lists map to the montserrat preset's `--colorize g=/y=/gr=/r=`.
Generate caption groups from a Whisper JSON file.
Usage: python gen_captions_generic.py <json_path> [--teal w1,w2,...] [--yellow w1,w2,...] [--green w1,w2,...]
"""
import json, sys, argparse

ap = argparse.ArgumentParser()
ap.add_argument("json_path")
ap.add_argument("--teal", default="", help="comma-separated words to color teal (Kaspa/tokens)")
ap.add_argument("--yellow", default="", help="comma-separated words for yellow (numbers/urgency)")
ap.add_argument("--green", default="", help="comma-separated words for green (positive/win)")
ap.add_argument("--red", default="", help="comma-separated words for red (negative/warning)")
ap.add_argument("--show-segments", action="store_true")
args = ap.parse_args()

TEAL_WORDS   = set(w.lower() for w in args.teal.split(",") if w)
YELLOW_WORDS = set(w.lower() for w in args.yellow.split(",") if w)
GREEN_WORDS  = set(w.lower() for w in args.green.split(",") if w)
RED_WORDS    = set(w.lower() for w in args.red.split(",") if w)

with open(args.json_path, encoding="utf-8") as f:
    data = json.load(f)

if args.show_segments:
    print("=== SEGMENTS ===")
    for seg in data["segments"]:
        print(f"[{seg['start']:6.2f}s-{seg['end']:6.2f}s] {seg['text'].strip()}")
    print()

words = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        words.append({"word": w["word"].strip(), "start": w.get("start", seg["start"]), "end": w.get("end", seg["end"])})

def colorize(word):
    clean = word.lower().strip(".,!?'\"")
    if clean in TEAL_WORDS:   return f'<g>{word}</g>'
    if clean in YELLOW_WORDS: return f'<y>{word}</y>'
    if clean in GREEN_WORDS:  return f'<gr>{word}</gr>'
    if clean in RED_WORDS:    return f'<r>{word}</r>'
    return word

SHORT = 4
def is_short(w): return len(w.strip(".,!?'\"")) <= SHORT

groups = []
current = []
current_start = None

for i, w in enumerate(words):
    if not current:
        current = [w]; current_start = w["start"]; continue
    gap = w["start"] - words[i-1]["end"]
    all_short = all(is_short(x["word"]) for x in current + [w])
    max_words = 4 if all_short else 3
    if gap > 0.18 or len(current) >= max_words:
        groups.append((current_start, current))
        current = [w]; current_start = w["start"]
    else:
        current.append(w)
if current:
    groups.append((current_start, current))

print("=== CAPTIONS ===")
for t, grp in groups:
    html = " ".join(colorize(w["word"]) for w in grp)
    print(f"  {{ t: {t:6.2f}, h: '{html}' }},")
