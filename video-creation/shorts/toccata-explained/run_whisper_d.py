import whisper, json
base = r"C:\Users\mnede\Documents\Claude\video-creation\shorts\toccata-explained"
model = whisper.load_model("base")
r = model.transcribe(base + "\\seg-D-candidate.mp4", word_timestamps=True, language="en")
with open(base + "\\whisper-D.json", "w") as f:
    json.dump(r, f, indent=2)
print("TEXT:", r["text"])
for s in r["segments"]:
    for w in s.get("words", []):
        print(f"  {w['start']:.2f}  {w['word']}")
