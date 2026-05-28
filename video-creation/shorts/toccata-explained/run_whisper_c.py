import whisper, json
base = r"C:\Users\mnede\Documents\Claude\video-creation\shorts\toccata-explained"
model = whisper.load_model("base")
path = base + "\\seg-C-candidate.mp4"
r = model.transcribe(path, word_timestamps=True, language="en")
with open(base + "\\whisper-C.json", "w") as f:
    json.dump(r, f, indent=2)
print("TEXT:", r["text"][:200])
words = [w for s in r["segments"] for w in s.get("words", [])]
for w in words:
    print(f"  {w['start']:.2f}  {w['word']}")
