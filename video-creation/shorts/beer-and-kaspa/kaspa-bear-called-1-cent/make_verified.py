"""Patch whisper-words.json -> whisper-words-verified.json for clip 1 (kaspa-bear-called-1-cent).
Evidence: _qa/verify-results.json (medium.en whole-file + staggered windows) and _qa/tb-results.json
(medium + small.en staggered windows). Every patch below is backed by >=2 agreeing decodes or by the
on-screen tweet text Mike is reading.
  1. "a" (10.64) -> "at": "it's at 4.8 cents" (medium.en full + both windows).
  2. "3" ".7" / "4" ".8" -> one token "3.7" / "4.8" (split decimal tokens).
  3. "cast" (14.94) -> "kas,": Mike reads the tweet "$KAS bears back in charge"; medium.en/small.en
     hear "Cas, the bears" / "Cass. The bears" (4 of 4 windows).
  4. "on, we'll see" (19.66-19.94) -> "on it and see" (medium.en full + window agree).
  5. "cents" (23.96) -> "cent" ("one cent is in play", medium.en full).
  6. "Boy, that dude was wrong" -> "Boy, was that dude wrong": base "was" (30.68-30.92) overlaps the
     actual "wrong" (medium.en 30.60-30.90); every window hears a short W-word BEFORE "that"
     (with/would/what) and base/medium hear "was". Word re-ordered onto the pre-"that" slot.
Gap scan: largest inter-word gap 0.46 s (29.02-29.48, the breath after "Oh man."); no omitted speech.
"""
import json
d = json.load(open("whisper-words.json", encoding="utf-8"))
W = [dict(word=w["word"].strip(), start=w["start"], end=w["end"]) for s in d["segments"] for w in s["words"]]
out = []
i = 0
while i < len(W):
    w = W[i]
    nxt = W[i+1] if i+1 < len(W) else None
    if w["word"] in ("3", "4") and nxt and nxt["word"].startswith("."):
        out.append(dict(word=w["word"]+nxt["word"], start=w["start"], end=nxt["end"])); i += 2; continue
    if w["word"] == "a" and abs(w["start"]-10.64) < 0.01: w["word"] = "at"
    if w["word"] == "cast": w["word"] = "kas,"
    if w["word"] == "at," and abs(w["start"]-7.00) < 0.01: w["word"] = "at"  # 9. stutter "at, at" -> collapses to one "at"
    if w["word"] == "on," and abs(w["start"]-19.66) < 0.01:
        out.append(dict(word="on", start=19.66, end=19.74))
        out.append(dict(word="it", start=19.74, end=19.80))
        out.append(dict(word="and", start=19.80, end=19.88))
        i += 2  # drop "we'll" (zero-length 19.88)
        continue
    if w["word"] == "cents" and abs(w["start"]-23.96) < 0.01: w["word"] = "cent"
    out.append(w); i += 1
# 7. sentence punctuation from medium.en (drives caption breaks): "lunch." and "3.7."
for w in out:
    if w["word"] == "lunch": w["word"] = "lunch."
    if w["word"] == "3.7": w["word"] = "3.7."
# 8. TOKEN MERGE "one" + "cent" -> "one cent" (both occurrences) so the price call never splits
#    across two caption groups ("calling for one" / "cent kaspa at").
k = 0
while k < len(out) - 1:
    if out[k]["word"] == "one" and out[k+1]["word"] in ("cent", "cent,"):
        out[k:k+2] = [dict(word="one cent", start=out[k]["start"], end=out[k+1]["end"])]
    k += 1
# 6. re-order "was"
ib = next(k for k, w in enumerate(out) if w["word"] == "Boy,")
seq = [w["word"] for w in out[ib:ib+5]]
assert seq == ["Boy,", "that", "dude", "was", "wrong"], seq
boy, that, dude, was, wrong = out[ib:ib+5]
out[ib:ib+5] = [
    dict(word="Boy,", start=boy["start"], end=29.92),
    dict(word="was", start=29.94, end=30.12),
    dict(word="that", start=30.12, end=30.34),
    dict(word="dude", start=30.34, end=30.60),
    dict(word="wrong", start=30.60, end=31.02),
]
gaps = [(round(b["start"]-a["end"], 2), a["word"], b["word"]) for a, b in zip(out, out[1:])]
print("max gap", max(gaps))
json.dump({"text": " ".join(w["word"] for w in out), "segments": [{"start": out[0]["start"], "end": out[-1]["end"], "text": " ".join(w["word"] for w in out), "words": [dict(word=" "+w["word"], start=w["start"], end=w["end"]) for w in out]}], "language": "en"}, open("whisper-words-verified.json", "w", encoding="utf-8"), indent=1)
print(" ".join(w["word"] for w in out))
