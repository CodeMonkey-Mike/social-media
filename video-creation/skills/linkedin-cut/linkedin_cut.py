"""linkedin_cut.py: the LinkedIn version of a finished AI Engineering Simplified video (LinkedIn caps native video at
10 minutes). The FINAL is cut in a pause after a sentence that lands as an ending, then the standard end card plays for
the last seconds: "Watch the full video on YouTube" over the channel handle on a yellow banner (the artifacts card,
2026-11-05, handle spelling fixed). Doc: linkedin-cut.md (same folder).

    python linkedin_cut.py "<FINAL.mp4>" --list                       # candidate cut points (sentence ends) near the limit
    python linkedin_cut.py "<FINAL.mp4>" --cut-after "language of AI"  # cut after the LAST occurrence of these words
    python linkedin_cut.py "<FINAL.mp4>" --cut-at 574.9                # or an explicit second (must sit in a pause)

Output: "<FINAL stem>-LINKEDIN.mp4" next to the FINAL + "linkedin-end-card.png" in the project folder. A FINAL already
under the limit needs no LinkedIn version (the FINAL uploads as is): the script says so and writes nothing.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

LIMIT = 600.0          # LinkedIn native video cap, seconds
MARGIN = 2.0           # finished file stays this far under the cap
CARD_SEC = 10.0        # Mike 2026-11-09: "in the last 10 seconds ... show a screen"
TAIL = 0.5             # room kept after the last word before the card
FADE = 0.35            # audio fade-out ending exactly on the cut
HANDLE = "@aiEngineeringSimplified"
FONT = "C:/Windows/Fonts/ariblk.ttf"
W, H = 1920, 1080


def duration(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def frame_size(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                          "-of", "csv=p=0", str(p)], capture_output=True, text=True, check=True).stdout
    w, h = (int(v) for v in out.strip().split(",")[:2])
    return w, h


def make_card(out, handle, w=W, h=H):
    """The artifacts end card: royal-to-teal diagonal gradient, white line, black handle on a yellow banner. Drawn at the
    FINAL's own frame size (2026-11-16: a vertical FINAL gets a portrait card, the line wrapped and the text fit to the
    width); 1920x1080 is byte-for-byte the original card."""
    y, x = np.mgrid[0:h, 0:w]
    t = ((x / w) * 0.6 + (1 - y / h) * 0.4)[..., None]
    grad = (np.array([10, 72, 214]) * (1 - t) + np.array([42, 128, 170]) * t).astype("uint8")
    img = Image.fromarray(grad, "RGB")
    d = ImageDraw.Draw(img)

    def centered(text, font, cy, fill):
        b = d.textbbox((0, 0), text, font=font)
        d.text(((w - (b[2] - b[0])) / 2 - b[0], cy - (b[3] - b[1]) / 2 - b[1]), text, font=font, fill=fill)

    def fit(text, size):          # shrink until the text fits 86% of the width (never at 1920 wide)
        while d.textbbox((0, 0), text, font=ImageFont.truetype(FONT, size))[2] > w * 0.86 - 96 and size > 20:
            size -= 2
        return ImageFont.truetype(FONT, size)

    portrait = h > w
    if portrait:
        f1 = fit("Watch the full video", 80)
        centered("Watch the full video", f1, h * 0.40, "white")
        centered("on YouTube", f1, h * 0.40 + f1.size * 1.3, "white")
        hy = h * 0.40 + f1.size * 1.3 + 260
    else:
        centered("Watch the full video on YouTube", ImageFont.truetype(FONT, 80), 400, "white")
        hy = 610
    font = fit(handle, 92)
    b = d.textbbox((0, 0), handle, font=font)
    tw, th = b[2] - b[0], b[3] - b[1]
    d.rectangle([(w - tw) / 2 - 48, hy - th / 2 - 40, (w + tw) / 2 + 48, hy + th / 2 + 40], fill=(255, 240, 0))
    centered(handle, font, hy, "black")
    img.save(out)
    return out


def words_near_limit(video, latest_end, span=150.0):
    """Word timestamps (local Whisper small.en) for the `span` seconds before the latest allowed cut."""
    import whisper
    import torch
    start = max(0.0, latest_end - span)
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "tail.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.3f}", "-t", f"{span + 15:.3f}", "-i", str(video),
                        "-vn", "-ac", "1", "-ar", "16000", str(wav)], check=True)
        dev = "cuda" if torch.cuda.is_available() else "cpu"
        res = whisper.load_model("small.en", device=dev).transcribe(str(wav), language="en", fp16=dev == "cuda",
                                                                     word_timestamps=True)
    return [{"w": w["word"].strip(), "s": w["start"] + start, "e": w["end"] + start}
            for seg in res["segments"] for w in seg["words"]]


def refine_end(video, whisper_end, look=4.0):
    """Whisper word ends drift (variables, 2026-11-09: 0.25 s early, which faded the last word). Measure instead: 10 ms
    RMS on the FINAL mix from 0.3 s before Whisper's end; the voice ends at the first 200 ms run under VOICE_DB, the next
    speech starts at the first later 100 ms run over it. VOICE_DB sits between the voice (~-22 dB) and the music bed
    (~-40 dB), so a bed under the pause does not read as speech."""
    VOICE_DB, sr = -35.0, 48000
    t0 = max(0.0, whisper_end - 0.3)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t0:.3f}", "-t", f"{look:.3f}", "-i", str(video), "-vn",
                          "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    hop = sr // 100
    n = len(x) // hop
    db = 20 * np.log10(np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1)) + 1e-9)
    loud = db > VOICE_DB
    end = next((i for i in range(n - 20) if not loud[i:i + 20].any()), None)
    if end is None:
        sys.exit(f"no 200 ms pause within {look} s of {whisper_end:.2f} s; pick another sentence (--list)")
    onset = next((j for j in range(end, n - 10) if loud[j:j + 10].all()), n)
    return t0 + end / 100, t0 + onset / 100


def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", s.lower()).split()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("final")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--list", action="store_true", help="print the sentence ends that fit, write nothing")
    g.add_argument("--cut-after", help="cut after the LAST occurrence of these spoken words (before the limit)")
    g.add_argument("--cut-at", type=float, help="cut at this second of the FINAL")
    ap.add_argument("--card-sec", type=float, default=CARD_SEC)
    ap.add_argument("--handle", default=HANDLE)
    ap.add_argument("--out")
    a = ap.parse_args()

    final = Path(a.final).resolve()
    dur = duration(final)
    latest = LIMIT - MARGIN - a.card_sec            # the cut may not be later than this
    if dur <= LIMIT - MARGIN:
        print(f"{final.name} is {dur:.1f} s, already under LinkedIn's {LIMIT:.0f} s: upload the FINAL as is.")
        return

    cut = a.cut_at
    if cut is None:
        words = words_near_limit(final, latest)
        fits = [i for i, w in enumerate(words) if w["e"] + TAIL <= latest]
        if a.list:
            print(f"FINAL {dur:.1f} s; the cut must land by {latest:.1f} s (card {a.card_sec:.0f} s). Sentence ends:")
            sent, first = [], None
            for i in fits:
                w = words[i]
                first = w["s"] if first is None else first
                sent.append(w["w"])
                if re.search(r"[.?!]$", w["w"]):
                    gap = words[i + 1]["s"] - w["e"] if i + 1 < len(words) else 9.9
                    print(f"  {w['e']:7.2f}  (pause {gap:4.2f} s)  {' '.join(sent)}")
                    sent, first = [], None
            return
        target = norm(a.cut_after)
        flat = [norm(w["w"]) for w in words]
        hit = None
        for i in fits:
            seq = [t for f in flat[max(0, i - len(target) - 3): i + 1] for t in f]
            if seq[-len(target):] == target:
                hit = i
        if hit is None:
            sys.exit(f"'{a.cut_after}' not found ending before {latest:.1f} s; run --list")
        voice_end, onset = refine_end(final, words[hit]["e"])
        cut = min(voice_end + TAIL, onset - 0.1)
        print(f"cut after '{a.cut_after}': Whisper word end {words[hit]['e']:.2f} s, measured voice end "
              f"{voice_end:.2f} s, next speech {onset:.2f} s, cut {cut:.2f} s")
    if cut > latest:
        sys.exit(f"cut {cut:.2f} s is past the latest allowed {latest:.2f} s")
    fade = min(FADE, max(0.1, cut - voice_end)) if a.cut_at is None else FADE

    fw, fh = frame_size(final)
    card = make_card(final.parent / ("linkedin-end-card.png" if (fw, fh) == (W, H) else f"linkedin-end-card-{fw}x{fh}.png"),
                     a.handle, fw, fh)
    out = Path(a.out) if a.out else final.with_name(final.stem + "-LINKEDIN.mp4")
    fc = (f"[0:v]trim=0:{cut:.3f},setpts=PTS-STARTPTS,fps=30,format=yuv420p,setsar=1[v0];"
          f"[0:a]atrim=0:{cut:.3f},asetpts=PTS-STARTPTS,aresample=48000,"
          f"afade=t=out:st={cut - fade:.3f}:d={fade:.3f}[a0];"
          f"[1:v]fps=30,format=yuv420p,setsar=1[v1];"
          f"[v0][a0][v1][2:a]concat=n=2:v=1:a=1[v][a]")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(final),
           "-loop", "1", "-t", f"{a.card_sec:.3f}", "-i", str(card),
           "-f", "lavfi", "-t", f"{a.card_sec:.3f}", "-i", "anullsrc=r=48000:cl=stereo",
           "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
           "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True)
    od = duration(out)
    ok = od <= LIMIT - 0.5
    print(f"{out}\nduration {od:.2f} s ({int(od // 60)}:{od % 60:05.2f}), cut {cut:.2f} s + card {a.card_sec:.0f} s: "
          f"{'OK' if ok else 'OVER THE LIMIT'}")
    print(json.dumps({"linkedin_cut": "ok" if ok else "FAIL", "cut": round(cut, 3), "duration": round(od, 3)}))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
