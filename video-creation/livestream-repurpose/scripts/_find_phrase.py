"""Locate a phrase in a Whisper word-level JSON and print start/end timestamps.

Usage: python _find_phrase.py <whisper.json> "search phrase" [occurrence]
Prints every match (or the Nth) as: start=SS.ss end=SS.ss  [mm:ss-mm:ss]  <matched words>
Matching is case-insensitive, punctuation-stripped, whitespace-normalized.
"""
import json, os, re, sys

src = sys.argv[1]
phrase = sys.argv[2]
want = int(sys.argv[3]) if len(sys.argv) > 3 else 0  # 0 = all

with open(src, encoding="utf-8") as f:
    data = json.load(f)

def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", s.lower()).strip()

words = []
for seg in data["segments"]:
    for w in seg.get("words", []):
        words.append((w.get("start"), w.get("end"), norm(w["word"])))

target = norm(phrase).split()
n = len(target)
matches = []
for i in range(len(words) - n + 1):
    if [words[i + k][2] for k in range(n)] == target:
        matches.append((words[i][0], words[i + n - 1][1]))

def fmt(t):
    return f"{int(t//60):02d}:{t%60:05.2f}"

if not matches:
    print("NO MATCH for:", phrase)
else:
    for idx, (s, e) in enumerate(matches, 1):
        if want and idx != want:
            continue
        print(f"#{idx}  start={s:.2f} end={e:.2f}  [{fmt(s)} - {fmt(e)}]")
