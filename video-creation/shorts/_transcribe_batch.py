"""Batch word-level Whisper transcription for the 14 remaining Weekend Red clips.
Loads the model once, loops all clips, writes <folder>/whisper-words.json. Skips existing.
No ChatGPT quota involved — safe to run overnight in parallel with image gen.
"""
import os, json
SHORTS = os.path.dirname(os.path.abspath(__file__))

CLIPS = [
    "kaspa-iso20022-swift", "kaspa-entry-doesnt-matter", "ideas-in-a-cemetery",
    "ai-white-collar-first", "webcam-girl-rug-cycle", "why-200-keeps-rugging",
    "no-new-memes-bear-market", "microstrategy-for-ton", "stablecoin-yield-fight",
    "sui-favorites-etfs", "pengu-flips-pepe", "hunt-a-virus-rug",
    "coinmarketcap-test", "human-driving-illegal",
]

import whisper
model = whisper.load_model("base")

for i, folder in enumerate(CLIPS, 1):
    clip = os.path.join(SHORTS, folder, "preview.mp4")
    out = os.path.join(SHORTS, folder, "whisper-words.json")
    if not os.path.exists(clip):
        print(f"[{i}/{len(CLIPS)}] {folder}: NO preview.mp4 — skip"); continue
    if os.path.exists(out):
        print(f"[{i}/{len(CLIPS)}] {folder}: whisper-words.json exists — skip"); continue
    print(f"[{i}/{len(CLIPS)}] {folder}: transcribing...", flush=True)
    result = model.transcribe(clip, word_timestamps=True, language="en")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    nwords = sum(len(s.get("words", [])) for s in result["segments"])
    print(f"    done: {nwords} words -> whisper-words.json", flush=True)

print("ALL TRANSCRIPTIONS DONE")
