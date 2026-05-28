import whisper, json
base = r"C:\Users\mnede\Documents\Claude\video-creation\shorts\toccata-explained"
model = whisper.load_model("base")
for seg, fname in [("A", "seg-A-candidate.mp4"), ("B", "seg-B-candidate.mp4")]:
    path = base + "\\" + fname
    r = model.transcribe(path, word_timestamps=True, language="en")
    out = base + "\\whisper-" + seg + ".json"
    with open(out, "w") as f:
        json.dump(r, f, indent=2)
    print(f"Seg {seg}: {r['text'][:150]}")
    words = [w for s in r["segments"] for w in s.get("words", [])]
    for w in words:
        print(f"  {w['start']:.2f}-{w['end']:.2f}  {w['word']}")
