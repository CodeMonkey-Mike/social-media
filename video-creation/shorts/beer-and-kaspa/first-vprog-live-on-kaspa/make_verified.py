"""Patch whisper-words.json -> whisper-words-verified.json for clip 3 (first-vprog-live-on-kaspa).
Evidence: _qa/verify-results.json (medium.en whole-file + staggered medium.en / small.en windows) and the
on-screen post Mike is reading ("Tic-tac-toe is live on Kaspa testnet: the first vprog, a verifiable
program with real execution and real settlement").
  1. "B" + "-Prog" (x2) -> "vProg"; "V" + "-Progs" -> "vProgs" (split tokens; clip-plan stt fix, on-screen text).
  2. "Tic" "-Tac" "-Toe" -> one token "tic-tac-toe" (so it never splits across groups).
  3. "sentiment." -> "settlement." (the on-screen post; windows hear "sediment" = his read of "settlement").
  4. FALSE START: the REPEAT "it's on a" (23.54-24.10) dropped: "and it's on a, it's on a proof of work" -> "and it's
     on a proof of work" (captions are not 1:1 with audio; readability wins).
  5. "I get there eventually" -> "I think eventually" (medium.en whole-file pass; windows split between
     "I get they/that/there", none reads as an intelligible phrase).
  6. "KRC" + "20s." -> one token "KRC20s." (clip-plan stt fix).
  8. "buy" + "-in" -> one token "buy-in".
  7. "Casper" -> kaspa is handled by the captions skill's CORRECTIONS (not patched here).
Gap scan: largest inter-word gaps 0.92 s (5.22-6.14) and 0.88 s (2.00-2.88) are real pauses between the
tweet lines he reads (no window decodes extra speech there); no omitted speech.
"""
import json
d = json.load(open("whisper-words.json", encoding="utf-8"))
W = [dict(word=w["word"].strip(), start=w["start"], end=w["end"]) for s in d["segments"] for w in s["words"]]
out = []
i = 0
while i < len(W):
    w = W[i]
    n1 = W[i+1] if i+1 < len(W) else None
    n2 = W[i+2] if i+2 < len(W) else None
    if w["word"] in ("B", "V") and n1 and n1["word"].lower().startswith("-prog"):
        out.append(dict(word="v" + n1["word"][1:].replace("prog", "Prog"), start=w["start"], end=n1["end"])); i += 2; continue
    if w["word"] == "Tic" and n1 and n1["word"] == "-Tac" and n2 and n2["word"].startswith("-Toe"):
        out.append(dict(word="tic-tac-toe", start=w["start"], end=n2["end"])); i += 3; continue
    if w["word"] == "KRC" and n1 and n1["word"].startswith("20"):
        out.append(dict(word="KRC" + n1["word"], start=w["start"], end=n1["end"])); i += 2; continue
    if w["word"] == "buy" and n1 and n1["word"] == "-in":   # 8. "buy" "-in" -> "buy-in"
        out.append(dict(word="buy-in", start=w["start"], end=n1["end"])); i += 2; continue
    if w["word"] == "sentiment.": w = dict(w, word="settlement.")
    # 4. false start: drop the REPEAT "it's on a" (23.54-24.10) and keep the first limb "it's on a,"
    #    (22.92-23.54) so "and it's on a" stays one group and "proof of work." follows it.
    if w["word"] == "it's" and abs(w["start"] - 23.54) < 0.01:
        assert [x["word"] for x in W[i:i+3]] == ["it's", "on", "a"], W[i:i+3]
        i += 3; continue
    if w["word"] == "a," and abs(w["start"] - 23.36) < 0.01: w = dict(w, word="a")
    # 5. "I get there eventually" -> "I think eventually"
    if w["word"] == "get" and abs(w["start"] - 53.50) < 0.01 and n1 and n1["word"] == "there":
        out.append(dict(word="think", start=w["start"], end=n1["end"])); i += 2; continue
    out.append(w); i += 1
gaps = sorted(((round(b["start"]-a["end"], 2), a["word"], b["word"]) for a, b in zip(out, out[1:])), reverse=True)[:3]
print("largest gaps", gaps)
txt = " ".join(w["word"] for w in out)
json.dump({"text": txt, "segments": [{"start": out[0]["start"], "end": out[-1]["end"], "text": txt,
           "words": [dict(word=" "+w["word"], start=w["start"], end=w["end"]) for w in out]}], "language": "en"},
          open("whisper-words-verified.json", "w", encoding="utf-8"), indent=1)
print(txt)
