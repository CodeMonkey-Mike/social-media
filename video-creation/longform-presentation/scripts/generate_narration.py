#!/usr/bin/env python3
"""
generate_narration.py — render the Zcash longform narration with the ElevenLabs PVC.

Parses the per-slide blockquotes out of an emphasis-marked script (narration-emphasis-v3.md)
and calls the ElevenLabs text-to-speech API once per slide, writing slide-N.mp3 files.

Targets the v3 model so the CAPS / stretched-vowels / [audio tags] / ellipses are honored.
Reads the API key from the ELEVENLABS_API_KEY env var (never hard-coded / committed).

Usage (run from anywhere; paths default to the zcash-exploit project):
  python scripts/generate_narration.py --slides 1                 # just slide 1 (the test)
  python scripts/generate_narration.py --slides 1-9               # a range
  python scripts/generate_narration.py --slides all               # everything
  python scripts/generate_narration.py --slides 1 --dry-run       # print parsed text, no API call

Key options: --voice-id, --model, --stability, --similarity, --style, --script, --outdir.
"""
import argparse
import json
import os
import re
import sys
import urllib.request
import urllib.error

PROJECT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "media", "zcash exploit",
)
DEFAULT_SCRIPT = os.path.join(PROJECT, "narration-emphasis-v3.md")
DEFAULT_OUTDIR = os.path.join(PROJECT, "audio")
DEFAULT_VOICE = "w5hJEzvYpyioFoEAv8tO"  # "Clone of Mike" (Professional Voice Clone)
API_BASE = "https://api.elevenlabs.io/v1/text-to-speech"


def parse_slides(script_path):
    """Return {slide_number: spoken_text} from the emphasis markdown.

    A slide starts at '### SLIDE N:'. The spoken copy is the blockquote ('> ...') lines
    that follow, up to the '**Marked:' line. Bare '>' lines become paragraph breaks.
    """
    with open(script_path, encoding="utf-8") as f:
        lines = f.readlines()

    slides, cur, buf = {}, None, []

    def flush():
        if cur is not None:
            text = "".join(buf)
            text = re.sub(r"[ \t]+\n", "\n", text)        # trim trailing spaces
            text = re.sub(r"\n{3,}", "\n\n", text).strip()  # collapse blank runs
            slides[cur] = text

    for ln in lines:
        m = re.match(r"^###\s*SLIDE\s+(\d+)\s*:", ln, re.I)
        if m:
            flush()
            cur, buf = int(m.group(1)), []
            continue
        if cur is None:
            continue
        if ln.lstrip().startswith("**Marked"):  # end of this slide's spoken block
            flush()
            cur = None
            continue
        if ln.startswith(">"):
            content = ln[1:].lstrip(" ").rstrip("\n")
            buf.append("\n\n" if content == "" else content + " ")
    flush()
    return slides


def expand_slide_arg(arg, available):
    if arg.lower() == "all":
        return sorted(available)
    out = []
    for part in arg.split(","):
        part = part.strip()
        if "-" in part:
            a, b = part.split("-", 1)
            out.extend(range(int(a), int(b) + 1))
        elif part:
            out.append(int(part))
    return [n for n in out if n in available]


def synth(text, out_path, voice_id, key, model, stability, similarity, style):
    # v3 audio tags like "[drawn out]" only work on the v3 model; on any other model
    # they get read aloud, so strip them (keep CAPS / stretched spelling / ellipses).
    if "v3" not in model:
        text = re.sub(r"\s*\[[^\]]*\]\s*", " ", text)
        text = re.sub(r"[ \t]{2,}", " ", text)
    body = json.dumps({
        "text": text,
        "model_id": model,
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity,
            "style": style,
            "use_speaker_boost": True,
        },
    }).encode("utf-8")
    url = f"{API_BASE}/{voice_id}?output_format=mp3_44100_128"
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "xi-api-key": key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    })
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
    with open(out_path, "wb") as f:
        f.write(data)
    return len(data)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slides", default="1", help="'1', '1-9', '1,3,5', or 'all'")
    ap.add_argument("--text", default=None, help="raw text to synth instead of slides (for tone tests)")
    ap.add_argument("--label", default="test", help="output filename stem when using --text")
    ap.add_argument("--script", default=DEFAULT_SCRIPT)
    ap.add_argument("--outdir", default=DEFAULT_OUTDIR)
    ap.add_argument("--voice-id", default=DEFAULT_VOICE)
    ap.add_argument("--model", default="eleven_multilingual_v2")
    ap.add_argument("--stability", type=float, default=0.3)
    ap.add_argument("--similarity", type=float, default=0.75)
    ap.add_argument("--style", type=float, default=0.6)
    ap.add_argument("--dry-run", action="store_true", help="print parsed text, no API call")
    args = ap.parse_args()

    key = os.environ.get("ELEVENLABS_API_KEY")
    if not args.dry_run and not key:
        sys.exit("ELEVENLABS_API_KEY not set in environment.")
    os.makedirs(args.outdir, exist_ok=True)
    print(f"model={args.model}  voice={args.voice_id}  "
          f"stability={args.stability} similarity={args.similarity} style={args.style}")

    # Raw-text mode: one-off tone test, bypasses the slide parser.
    if args.text is not None:
        out_path = os.path.join(args.outdir, f"{args.label}.mp3")
        print(f"[{args.label}] {len(args.text)} chars -> {out_path} ...", end="", flush=True)
        nbytes = synth(args.text, out_path, args.voice_id, key, args.model,
                       args.stability, args.similarity, args.style)
        print(f" OK ({nbytes/1024:.0f} KB)")
        return

    slides = parse_slides(args.script)
    if not slides:
        sys.exit(f"No slides parsed from {args.script}")
    want = expand_slide_arg(args.slides, set(slides))
    if not want:
        sys.exit(f"No matching slides for --slides {args.slides}; available: {sorted(slides)}")

    for n in want:
        text = slides[n]
        if args.dry_run:
            print(f"\n===== SLIDE {n}  ({len(text)} chars) =====\n{text}")
            continue
        out_path = os.path.join(args.outdir, f"slide-{n}.mp3")
        print(f"[slide {n}] {len(text)} chars -> {out_path} ...", end="", flush=True)
        try:
            nbytes = synth(text, out_path, args.voice_id, key, args.model,
                           args.stability, args.similarity, args.style)
            print(f" OK ({nbytes/1024:.0f} KB)")
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")
            print(f" HTTP {e.code}\n{detail}")
            sys.exit(1)


if __name__ == "__main__":
    main()
