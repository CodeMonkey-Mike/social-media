"""_patch_words.py — eliza/phantom-hack: restore speech the shipped word pass DROPPED.

whisper-words.json (the Phase 6 pass over this clip's final spine) is missing an entire spoken
line. It jumps from " with." (ending 4.00) straight to " That" (5.34), i.e. 1.34 s of audio with no
words at all. That gap is not silence: it is "I was hacked, man."

Evidence (all on THIS clip's own final spine, 2026-08-07):
  - whisper large-v3 on an isolated 3.4-5.6 s window  -> "I was hacked, man."  [3.40 / 3.84 / 4.30 / 4.74]
  - whisper medium.en on the same isolated window     -> "I was hacked, man."  [3.40 / 4.14 / 4.40 / 4.78]
  - whisper large-v3 on an isolated 0.0-6.5 s window  -> "...I don't fool around with. I was hacked, man. That was horrible."
  - whisper large-v3 over the WHOLE clip              -> "...with i was hacked man that was horrible"
  - the livestream master transcript                  -> [2239.57] I [2240.13] was [2240.39] hacked [2240.81] man

The same passes also put the end of " with." at ~3.44, not 4.00 (the shipped pass stretched it across
the dropped words), so that token's end is trimmed to 3.44 as well.

Corrections that can be expressed as token REWRITES live in the canonical builder
(video-creation/skills/captions/build_captions.py, PHRASE_CORRECTIONS). An INSERTION cannot: a phrase
replacement may never be longer than the run it matches, because there are no timings to invent. Here
the timings are measured, so the fix belongs at the word-pass level. This script is the whole record
of it -- whisper-words.json itself is never modified.

    python _patch_words.py     # -> whisper-words-verified.json (idempotent)
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "whisper-words.json")
OUT = os.path.join(HERE, "whisper-words-verified.json")

# (after this token end, insert these words) -- keyed on the token's own timing so a re-run of the
# Phase 6 pass with different text can never silently apply the patch in the wrong place.
ANCHOR = {"word": " with.", "start": 3.42, "end": 4.00}
TRIM_END = 3.44
INSERT = [
    {"word": " I",       "start": 3.46, "end": 3.86, "probability": 0.90},
    {"word": " was",     "start": 3.86, "end": 4.28, "probability": 0.90},
    {"word": " hacked,", "start": 4.28, "end": 4.58, "probability": 0.90},
    {"word": " man.",    "start": 4.58, "end": 4.98, "probability": 0.90},
]


def main():
    data = json.load(open(SRC, encoding="utf-8"))
    hits = 0
    for seg in data["segments"]:
        words = seg.get("words") or []
        for i, w in enumerate(words):
            if (w["word"] == ANCHOR["word"]
                    and abs(w["start"] - ANCHOR["start"]) < 0.02
                    and abs(w["end"] - ANCHOR["end"]) < 0.02):
                w["end"] = TRIM_END
                seg["words"] = words[:i + 1] + [dict(x) for x in INSERT] + words[i + 1:]
                # keep the segment text consistent with its words
                seg["text"] = "".join(x["word"] for x in seg["words"])
                hits += 1
                break
    if hits != 1:
        raise SystemExit(f"anchor matched {hits} times, expected exactly 1 - inspect before shipping")
    data["text"] = "".join(w["word"] for s in data["segments"] for w in (s.get("words") or []))
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)
    n = sum(len(s.get("words") or []) for s in data["segments"])
    print(f"wrote {OUT}  ({n} words, +{len(INSERT)})")


if __name__ == "__main__":
    main()
