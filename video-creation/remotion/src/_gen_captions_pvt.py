"""Print the CAPTIONS_PVT array from the video-2 Whisper JSON.
Grouping per SKILL.md (2-4 words; break on >0.18s gap or word limit). Lowercase.
Fixes Whisper mishears (Casper->kaspa, Dix connection->disconnection). Light color-coding.
"""
import json

JSON_SRC = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\bulls-are-sleeping-clips\price-vs-technology\preview.json"

with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)

words = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        words.append({"word": w["word"].strip(), "start": w["start"], "end": w["end"]})

# Mishear fixes (case-insensitive, applied to the raw token, keep trailing punctuation)
FIX = {"casper": "kaspa", "caspers": "kaspa", "casper,": "kaspa,", "casper.": "kaspa.",
       "dix": "", "connection": "disconnection"}  # "dix connection" -> "disconnection"

def fix_token(raw):
    low = raw.lower()
    if low in FIX:
        return FIX[low]
    return raw

SHORT = 4
def is_short(w): return len(w.strip(".,!?'")) <= SHORT

GREEN  = {"kaspa", "higher", "opportunity", "undervalued"}   # <gr>
YELLOW = {"dollar", "tomorrow", "3", "million"}              # <y>
def colorize(tok):
    clean = tok.lower().strip(".,!?'\"")
    if clean in GREEN:  return f"<gr>{tok}</gr>"
    if clean in YELLOW: return f"<y>{tok}</y>"
    return tok

# Apply fixes first, dropping any token that fixes to empty (the stray "dix")
fixed = []
for w in words:
    ft = fix_token(w["word"])
    if ft == "":
        continue
    fixed.append({"word": ft, "start": w["start"], "end": w["end"]})

groups, cur, cur_start = [], [], None
for i, w in enumerate(fixed):
    if not cur:
        cur = [w]; cur_start = w["start"]; continue
    gap = w["start"] - fixed[i-1]["end"]
    all_short = all(is_short(x["word"]) for x in cur + [w])
    mx = 4 if all_short else 3
    if gap > 0.18 or len(cur) >= mx:
        groups.append((cur_start, cur)); cur = [w]; cur_start = w["start"]
    else:
        cur.append(w)
if cur: groups.append((cur_start, cur))

print("export const CAPTIONS_PVT: { t: number; h: string }[] = [")
for t, grp in groups:
    text = " ".join(colorize(w["word"]) for w in grp).lower().replace("'", "\\'")
    print(f"  {{ t: {t:6.2f}, h: '{text}' }},")
print("];")
