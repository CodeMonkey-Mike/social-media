"""Measure real word timings in a source: python measure.py <media> <start_s> <end_s> [model]
Prints each word with its absolute time in the source (the source's own clock)."""
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
src, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
model_name = sys.argv[4] if len(sys.argv) > 4 else "small.en"
wav = Path(tempfile.gettempdir()) / "measure_clip.wav"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(t0), "-to", str(t1), "-i", src, "-vn", "-ac", "1", "-ar", "16000", str(wav)], check=True)
import torch
import whisper

device = "cuda" if torch.cuda.is_available() else "cpu"
m = whisper.load_model(model_name, device=device)
r = m.transcribe(str(wav), word_timestamps=True, language="en", condition_on_previous_text=False)
for seg in r["segments"]:
    print(f"[{t0 + seg['start']:7.2f} - {t0 + seg['end']:7.2f}] {seg['text'].strip()}")
print("--- words")
line = []
for seg in r["segments"]:
    for w in seg.get("words", []):
        line.append(f"{t0 + w['start']:.2f}:{w['word'].strip()}")
print(" ".join(line))
