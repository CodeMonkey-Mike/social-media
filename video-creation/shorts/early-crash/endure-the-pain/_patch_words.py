"""_patch_words.py — build whisper-words-verified.json for early-crash/endure-the-pain.

WHY (remotion-shorts-build SKILL, checklist item 3): "The word JSON can silently OMIT speech."
The batch caption gate (shorts/early-crash/tighten-plan.json, clip #5) flagged master-transcript
1526.20 "we're not feeling yet" as LIKELY "not feeling it yet" and ordered an ear-verify. It is:
the shipped `whisper-words.json` runs feeling(21.24-21.52) -> yet(21.52-21.86) with NO "it", and
two independent isolated medium.en passes on THIS clip's own audio both hear one.

  20.40-22.80 s (word-timed) -> "We're not feeling IT yet."   it 21.44-21.64, p=0.96
  20.60-22.20 s (tight, txt) -> "We're not feeling it yet."

A missing word CANNOT be fixed with a PHRASE_CORRECTION (a replacement may never be longer than the
run it matches — `zip(span, rep)` silently drops the overflow), so the token is patched in here and
the captions are built from the patched file. Timings are taken from the isolated word-timed pass
and mapped onto the shipped pass's own timeline: "feeling" keeps its 21.24-21.52 span, "it" takes
21.52-21.66, and "yet" starts at 21.66 (it kept its 21.86 end, so nothing after moves).

NOT patched, deliberately — the other four caption-gate items all resolve against this clip's own
audio with NO change, and each was re-checked with an isolated medium.en pass:
 - opener: the gate said the drawled pre-"the" was relocked out and the clip "will transcribe 'good
   news is'". It does not: the shipped pass AND an isolated 0.00-2.60 s pass both return "The good
   news is that eventually in the long run", so the article is heard and "the good news is that"
   ships (the gate allowed exactly this).
 - 381.26 "the Alps" -> "the alts": the shipped pass already reads "alts" (p 0.55) and an isolated
   7.60-9.20 s pass returns "buying the alts". Nothing to correct.
 - 383.04 "Robin Hood" -> "Robinhood": the shipped pass already emits ONE token "Robinhood", and an
   isolated 9.20-10.80 s pass returns "going on to the Robinhood chain". Nothing to correct.
 - 395.06 "he hasn't checked out" -> "who hasn't checked out": REJECTED on this clip's audio. The
   "who" the master transcript half-heard is already there EARLIER in the sentence: both the shipped
   pass and an isolated 16.60-19.80 s pass return "...for anybody WHO'S in crypto right now AND
   hasn't checked out", which is grammatical as-is. Forcing "who hasn't" would put a word on screen
   that no 1x pass produced.
 - "the the pain" stutter (gate: caption-normalized to "the pain"): already normalized upstream. The
   shipped pass emits ONE "the" (29.86-30.32, a stretched 0.46 s token) and an isolated 29.20-32.00 s
   pass returns "to endure the pain that we've been seeing". No PROTECTED_DOUBLES / collapse issue.
And the REMOVED fragment "is we're going to start the bull run" (tighten removal 1536.58-1538.55)
appears nowhere in the word stream, so it cannot reach the captions.

Run:  python _patch_words.py     (idempotent; rewrites whisper-words-verified.json from scratch)
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
DST = os.path.join(HERE, "whisper-words-verified.json")

# (start_of_token_to_retime, expected_word, new_start) — make room for the inserted token
RETIMES = [
    (21.52, "yet.", 21.66),
]
# (word, start, end) — inserted in time order into the segment that contains the hole
INSERTS = [
    ("it", 21.52, 21.66),
]

data = json.load(open(SRC, encoding="utf-8"))

for s, old, new_start in RETIMES:
    for seg in data["segments"]:
        for x in seg.get("words", []):
            if abs(x["start"] - s) < 0.02 and x["word"].strip().lower() == old:
                x["start"] = new_start
                break

for w, s, e in INSERTS:
    tok = {"word": " " + w, "start": s, "end": e, "probability": 0.96}
    for seg in data["segments"]:
        words = seg.get("words") or []
        if not words:
            continue
        if words[0]["start"] <= s <= words[-1]["end"]:
            if any(abs(x["start"] - s) < 0.05 and x["word"].strip() == w for x in words):
                break  # already patched
            i = next((k for k, x in enumerate(words) if x["start"] >= s), len(words))
            words.insert(i, tok)
            break
    else:
        raise SystemExit(f"no segment spans {s}s for {w!r}")

data["text"] = " ".join(x["word"].strip() for seg in data["segments"] for x in seg.get("words", []))
json.dump(data, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
n = sum(len(seg.get("words", [])) for seg in data["segments"])
print(f"wrote {DST}  ({n} words, +{len(INSERTS)})")
