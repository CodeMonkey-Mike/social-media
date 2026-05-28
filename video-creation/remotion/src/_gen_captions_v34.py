"""Print caption arrays for videos 3 (heard-of-kaspa-brah) and 4 (eth-flips-btc).
Grouping per SKILL.md (2-4 words; break on >0.18s gap or word limit). Lowercase.
Fixes mishears; light color-coding. <gr> green=kaspa, <o> orange=bitcoin, <y> yellow=numbers, <r> red=hate."""
import json

BASE = r"C:\Users\mnede\Documents\Claude\video-creation\shorts\bulls-are-sleeping-clips"
JOBS = [
    ("VIDEO 3 (heard-of-kaspa-brah)", f"{BASE}\\heard-of-kaspa-brah\\preview.json",
     {"brandon": "randy", "brandon,": "randy,", "casper": "kaspa", "casper.": "kaspa.",
      "casper,": "kaspa,", "brown": "brah", "brown?": "brah?", "caspa": "kaspa"}),
    ("VIDEO 4 (eth-flips-btc)", f"{BASE}\\eth-flips-btc\\preview.json",
     {"casper": "kaspa", "caspa": "kaspa", "casper.": "kaspa.", "casper,": "kaspa,"}),
]

SHORT = 4
def is_short(w): return len(w.strip(".,!?'")) <= SHORT
GREEN  = {"kaspa", "kaspa,", "kaspa."}
ORANGE = {"bitcoin", "bitcoin.", "bitcoin,", "btc"}
YELLOW = {"$3,", "$3", "$30,", "$30", "$30.", "100", "trillion", "billion", "one,", "one.", "one", "two."}
RED    = {"hate", "hate,", "hate."}
def colorize(tok):
    c = tok.lower().strip(".,!?'\"")
    raw = tok
    if c in {x.strip('.,') for x in GREEN}:  return f"<gr>{raw}</gr>"
    if c in {x.strip('.,') for x in ORANGE}: return f"<o>{raw}</o>"
    if c in {x.strip('.,') for x in RED}:    return f"<r>{raw}</r>"
    if raw.strip('.,').lstrip('$').isdigit() or c in {"trillion","billion","one","two"}: return f"<y>{raw}</y>"
    return raw

def fix(tok, fixes):
    return fixes.get(tok.lower(), tok)

for label, path, fixes in JOBS:
    data = json.load(open(path, encoding="utf-8"))
    words = [{"word": fix(w["word"].strip(), fixes), "start": w["start"], "end": w["end"]}
             for seg in data["segments"] for w in seg.get("words", [])]
    groups, cur, cs = [], [], None
    for i, w in enumerate(words):
        if not cur: cur=[w]; cs=w["start"]; continue
        gap = w["start"] - words[i-1]["end"]
        mx = 4 if all(is_short(x["word"]) for x in cur+[w]) else 3
        if gap > 0.18 or len(cur) >= mx: groups.append((cs,cur)); cur=[w]; cs=w["start"]
        else: cur.append(w)
    if cur: groups.append((cs,cur))
    print(f"\n// ===== {label} =====")
    for t, grp in groups:
        text = " ".join(colorize(w["word"]) for w in grp).lower().replace("'", "\\'")
        print(f"  {{ t: {t:6.2f}, h: '{text}' }},")
