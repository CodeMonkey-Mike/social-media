import json

with open("preview.json", encoding="utf-8") as f:
    data = json.load(f)

# Print all segments with word-level timestamps
print("=== SEGMENTS ===")
for seg in data["segments"]:
    print(f"[{seg['start']:.2f}s–{seg['end']:.2f}s] {seg['text'].strip()}")

# Generate caption groups (2-4 words, break on pause > 0.18s)
words = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        words.append({"word": w["word"].strip(), "start": w.get("start", seg["start"]), "end": w.get("end", seg["end"])})

def colorize(word):
    clean = word.lower().strip(".,!?'\"")
    TEAL   = {"kaspa", "caspa", "kasper", "casper", "kas"}
    GREEN  = {"mainnet", "testnet", "pump", "best"}
    YELLOW = {"27", "days", "cents", "30", "25"}
    if clean in TEAL:   return f'<g>{word}</g>'
    if clean in GREEN:  return f'<g>{word}</g>'
    if clean in YELLOW: return f'<y>{word}</y>'
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

print("\n=== CAPTIONS_KHF ===")
for t, grp in groups:
    html = " ".join(colorize(w["word"]) for w in grp)
    print(f"  {{ t: {t:6.2f}, h: '{html}' }},")
