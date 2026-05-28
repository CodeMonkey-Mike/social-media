import json

with open(r"C:\Users\mnede\Documents\Claude\social-media\video-creation\livestream-repurpose\transcripts\market update VERTICAL.json", encoding="utf-8") as f:
    data = json.load(f)

# Everything around "best goddamn coin" and onwards to mainnet context
print("=== 1710–1750s ===")
for s in data["segments"]:
    if 1710 <= s["start"] <= 1750:
        print(f"[{s['start']:.2f}s – {s['end']:.2f}s]  {s['text'].strip()}")
