"""Generate constants-bulls.ts (CAPTIONS only) from the Whisper JSON of the final bulls clip.
Grouping per SKILL.md: 2-4 word groups, break on pause >0.18s or word limit
(max 3, or 4 if all words <=4 chars). Lowercase. Light color-coding of key terms.
"""
import json, os

JSON_SRC = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\bulls-are-sleeping-clips\bulls-are-sleeping\preview.json"
OUT_TS   = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\remotion\src\constants-bulls.ts"

with open(JSON_SRC, encoding="utf-8") as f:
    data = json.load(f)

words = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        words.append({"word": w["word"].strip(), "start": w["start"], "end": w["end"]})

dur = words[-1]["end"] if words else 30.0

SHORT = 4
def is_short(w): return len(w.strip(".,!?'")) <= SHORT

# Color sets (tags consumed by BullsAreSleeping.tsx colourize)
GREEN  = {"bulls", "bull"}                                   # <gr>
RED    = {"bears", "bear", "knocked", "crash", "down", "checked"}  # <r>
YELLOW = {"109", "290", "291", "2017", "2015", "days", "day"}      # <y>

def fix_and_color(word):
    raw = word
    clean = word.lower().strip(".,!?'\"")
    # brand mishear fixes (none expected in this clip, but keep the hook)
    if clean in GREEN:  return f"<gr>{raw}</gr>"
    if clean in RED:    return f"<r>{raw}</r>"
    if clean in YELLOW: return f"<y>{raw}</y>"
    return raw

groups = []
cur = []
cur_start = None
for i, w in enumerate(words):
    if not cur:
        cur = [w]; cur_start = w["start"]; continue
    gap = w["start"] - words[i-1]["end"]
    all_short = all(is_short(x["word"]) for x in cur + [w])
    max_words = 4 if all_short else 3
    if gap > 0.18 or len(cur) >= max_words:
        groups.append((cur_start, cur)); cur = [w]; cur_start = w["start"]
    else:
        cur.append(w)
if cur:
    groups.append((cur_start, cur))

lines = []
for t, grp in groups:
    text = " ".join(fix_and_color(w["word"]) for w in grp).lower()
    # keep color tags lowercase-safe: lower() above is fine since tags are already lowercase
    text = text.replace("'", "\\'")
    lines.append(f"  {{ t: {t:6.2f}, h: '{text}' }},")

ts = (
    "import { staticFile } from 'remotion';\n\n"
    "export const FPS_BULLS = 30;\n"
    f"export const DURATION_BULLS = {dur:.2f};\n"
    "export const TOTAL_FRAMES_BULLS = Math.round(DURATION_BULLS * FPS_BULLS);\n\n"
    "export const CLIP_BULLS = staticFile('bulls-clip.mp4');\n\n"
    "// Captions only — word-grouped from Whisper, lowercase, light color-coding.\n"
    "// <g> teal | <y> yellow | <gr> green | <r> red | <o> orange\n"
    "export const CAPTIONS_BULLS: { t: number; h: string }[] = [\n"
    + "\n".join(lines) + "\n];\n"
)

with open(OUT_TS, "w", encoding="utf-8") as f:
    f.write(ts)

print(f"Wrote {len(groups)} caption groups, clip {dur:.1f}s -> {OUT_TS}")
