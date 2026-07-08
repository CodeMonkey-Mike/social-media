import sys, os, json, whisper
SHORTS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
folders = ["best-coin-to-buy/tao-decentralized-ai","best-coin-to-buy/lab-353x-bear-call",
           "best-coin-to-buy/ai-supercycle-bigger-than-dotcom","best-coin-to-buy/linea-chosen-by-swift"]
model = whisper.load_model("base")
for folder in folders:
    clip = os.path.join(SHORTS, folder, "tightened.mp4")
    if not os.path.exists(clip):
        print("MISSING", clip); continue
    r = model.transcribe(clip, word_timestamps=True, language="en")
    out = os.path.join(SHORTS, folder, "whisper-words.json")
    json.dump(r, open(out,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
    nw = sum(len(s.get("words",[])) for s in r["segments"])
    print("OK", folder, "words", nw)
print("ALL DONE")
