"""[DIAGNOSIS ONLY — do NOT derive cuts from this. Canonical defumble = video-creation/skills/defumbler/defumbler.md
   (chunk-map + cut-only-in-silence). This runs on a WHOLE-FILE transcript, which HIDES retakes and DRIFTS;
   cutting from it clips words and misses fumbles. Use it to eyeball, never to cut.]

Flag fumble candidates in a whisper word-timestamp json (longform-edited Phase 3 helper).

Implements the skill heuristics (longform-edited.md Phase 3):
  * restart/restatement : same normalized 3-gram occurring twice within a ~22-word window
  * stall/held word     : word duration > 1.3s
  * hesitation gap      : inter-word gap > 0.9s (voiced stalls survive the silence pass)

Output is CANDIDATES for human review in context, not automatic cuts.

Usage:
    python detect_fumbles.py "media/<project>/<name>.medium-words.json" [--window 22]
"""
import argparse, json, re, sys


def norm(w):
    return re.sub(r"[^a-z0-9']", "", w.lower())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("words_json")
    ap.add_argument("--window", type=int, default=22)
    ap.add_argument("--max-dur", type=float, default=1.3)
    ap.add_argument("--max-gap", type=float, default=0.9)
    args = ap.parse_args()

    with open(args.words_json, encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict) and "segments" in data:   # whisper result json
        words = [w for seg in data["segments"] for w in seg.get("words", [])]
    elif isinstance(data, dict) and "words" in data:
        words = data["words"]
    else:
        words = data
    if not words:
        print("no words found"); sys.exit(1)

    def ctx(i, n=8):
        lo, hi = max(0, i - n), min(len(words), i + n + 1)
        return " ".join(w["word"].strip() for w in words[lo:hi])

    flags = []

    # repeated 3-grams within window
    grams = {}
    for i in range(len(words) - 2):
        g = tuple(norm(words[i + k]["word"]) for k in range(3))
        if any(len(t) == 0 for t in g):
            continue
        if g in grams and i - grams[g] <= args.window and i - grams[g] >= 1:
            j = grams[g]
            flags.append((words[j]["start"], words[i + 2]["end"], "RESTART/RESTATE",
                          f"3-gram '{' '.join(g)}' repeats at word {j}->{i} | ...{ctx(i)}..."))
        grams[g] = i

    # held words
    for i, w in enumerate(words):
        d = w["end"] - w["start"]
        if d > args.max_dur:
            flags.append((w["start"], w["end"], "HELD-WORD",
                          f"'{w['word'].strip()}' held {d:.2f}s | ...{ctx(i)}..."))

    # hesitation gaps
    for i in range(1, len(words)):
        gap = words[i]["start"] - words[i - 1]["end"]
        if gap > args.max_gap:
            flags.append((words[i - 1]["end"], words[i]["start"], "GAP",
                          f"{gap:.2f}s gap before '{words[i]['word'].strip()}' | ...{ctx(i)}..."))

    flags.sort()
    for s, e, kind, msg in flags:
        print(f"[{s:8.2f}-{e:8.2f}] {kind:16s} {msg}")
    print(f"\n{len(flags)} candidates")


if __name__ == "__main__":
    main()
