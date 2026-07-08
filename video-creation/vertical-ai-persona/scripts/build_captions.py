#!/usr/bin/env python3
"""SUPERSEDED -> use `video-creation/skills/captions/build_captions.py --style arial-black` (canonical caption
skill, captions/captions.md). This is the original crypto-promo/wise-man karaoke builder, kept for reference.

Build karaoke caption data for the crypto-promo final video.

Transcribes each clip on its OWN clean audio (most accurate word timings),
offsets each clip's words by its cumulative start position in the concatenated
final timeline, groups words into short caption groups (Mother-Satori style:
~3-4 words, break on sentence punctuation), and writes captions.json:
  [ { "text": "...", "start": s, "end": s,
      "words": [ {"w": "WORD", "start": s, "end": s}, ... ] }, ... ]

Run from crypto-promo/. Uses local whisper.exe (offline).
"""
import json, os, re, subprocess, sys

WHISPER = r"C:/Users/mnede/AppData/Local/Programs/Python/Python312/Scripts/whisper.exe"
CLIPS = [
    "s1-clinic-q1", "s1-clinic-q2", "s1-clinic-q3",
    "s2-resort-q1", "s2-resort-q2", "s2-resort-q3", "s2-resort-q4",
    "s3-friend-q1", "s3-friend-q2", "s4-cta",
]
MAX_WORDS = 4          # max words per caption group
MAX_GROUP_SECS = 1.6   # force a new group if it would run longer than this

def dur(path):
    r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
                        "-of","default=noprint_wrappers=1:nokey=1", path],
                       capture_output=True, text=True)
    return float(r.stdout.strip())

def transcribe_words(clip_path, outdir):
    wav = os.path.join(outdir, "a.wav")
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",clip_path,
                    "-vn","-ar","16000","-ac","1",wav], check=True)
    subprocess.run([WHISPER, wav, "--model","small","--language","en",
                    "--output_format","json","--word_timestamps","True",
                    "--output_dir",outdir,"--fp16","False"],
                   capture_output=True, text=True)
    j = json.load(open(os.path.join(outdir,"a.json"), encoding="utf-8"))
    words = []
    for seg in j["segments"]:
        for w in seg.get("words", []):
            tok = w["word"].strip()
            if tok:
                words.append({"w": tok, "start": w["start"], "end": w["end"]})
    return words

def main():
    import tempfile
    base = 0.0
    all_words = []
    for clip in CLIPS:
        path = os.path.join("clips", clip + ".mp4")
        d = dur(path)
        with tempfile.TemporaryDirectory() as td:
            ws = transcribe_words(path, td)
        for w in ws:
            all_words.append({"w": w["w"], "start": round(w["start"]+base, 3),
                              "end": round(w["end"]+base, 3)})
        print(f"  {clip:18s} {d:6.2f}s  +{len(ws)} words  (base now {base:.2f})", file=sys.stderr)
        base += d

    # group words into caption groups
    groups = []
    cur = []
    def flush():
        if cur:
            groups.append({
                "text": " ".join(x["w"] for x in cur).upper(),
                "start": cur[0]["start"], "end": cur[-1]["end"],
                "words": [{"w": x["w"].upper(), "start": x["start"], "end": x["end"]} for x in cur],
            })
    for w in all_words:
        if cur and (len(cur) >= MAX_WORDS or (w["end"] - cur[0]["start"]) > MAX_GROUP_SECS):
            flush(); cur = []
        cur.append(w)
        if re.search(r"[.!?]$", w["w"]):   # break after sentence-ending punctuation
            flush(); cur = []
    flush()

    # strip trailing punctuation from display text (keep it clean, karaoke style)
    for g in groups:
        g["text"] = re.sub(r"[.,!?]", "", g["text"])
        for w in g["words"]:
            w["w"] = re.sub(r"[.,!?]", "", w["w"])

    json.dump(groups, open("_captions/captions.json","w",encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"\nwrote {len(groups)} caption groups -> _captions/captions.json", file=sys.stderr)

if __name__ == "__main__":
    main()
