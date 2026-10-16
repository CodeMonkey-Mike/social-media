#!/usr/bin/env python
"""
check_card_words.py: prove no chapter title card SPLITS A WORD (Mike, 2026-10-11, retire-early: the KASPA card snapped into
the silent closure of the 'p' in "Kas|pa", so the draft said "Kasp" ... card ... "pa"; the same class as the tao CH2 pause
that split "Now"). A plosive closure is real silence, so the silence gates (snap + lint-pause-silence) cannot tell it from
the gap before a word. This check listens instead: on the PAUSED spine it transcribes the first seconds after every card
pause and requires the first word heard to start with the same sound as the chapter's first word in AS-RECORDED.md (the
card goes BEFORE the voice). A split leaves the word's second syllable first ("pa" for "Kaspa") and FAILS.

Usage: python check_card_words.py <media/<project>> --paused <spine/ALL.<x>.paused.mp4> [--sidecar <paused.json>]
Machine line: CARD-WORDS PASS|FAIL cards=N fails=M
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
WHISPER = Path.home() / "AppData/Local/Programs/Python/Python312/Scripts/whisper"
HEADER_RE = re.compile(r"^###\s+(CH\s*\d+)\s*[-:]\s*([^(\n]+?)\s*\((\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\)([^\n]*)", re.M)
ROW_RE = re.compile(r'^\|\s*\d+(?:\.\d+)?\s*\|\s*"([^"]+)"', re.M)
# first-sound classes: letters that START the same sound when Whisper respells a word (Casper / Kaspa, TOW / TAO, ...)
SOUND = {"c": "k", "k": "k", "q": "k", "g": "g", "t": "t", "d": "t", "p": "p", "b": "p", "a": "V", "e": "V", "i": "V",
         "o": "V", "u": "V", "y": "V", "f": "f", "v": "f", "s": "s", "z": "s", "x": "s"}


def first_sound(word: str) -> str:
    w = re.sub(r"[^a-z]", "", word.lower())
    if w.startswith("ph"):
        return "f"
    return SOUND.get(w[:1], w[:1]) if w else ""


def chapter_first_words(asr: str):
    """{card label: (chapter id, first word)} for every chapter with a card ON."""
    out = {}
    heads = list(HEADER_RE.finditer(asr))
    for i, m in enumerate(heads):
        lab = re.search(r'card\s+ON\s*"([^"]+)"', m.group(5))
        if not lab:
            continue
        body = asr[m.end(): heads[i + 1].start() if i + 1 < len(heads) else len(asr)]
        row = ROW_RE.search(body)
        if row:
            out[lab.group(1)] = (m.group(1).replace(" ", ""), row.group(1).split()[0])
    return out


def heard_first_word(paused: Path, start: float, length: float, tmp: Path, tag: str) -> str:
    wav = tmp / f"{tag}.wav"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{start:.3f}", "-t", f"{length:.3f}",
                    "-i", str(paused), "-vn", "-ar", "16000", "-ac", "1", str(wav)], check=True)
    subprocess.run([str(WHISPER), str(wav), "--model", "small.en", "--word_timestamps", "True", "--output_format", "json",
                    "--output_dir", str(tmp), "--language", "en"], capture_output=True)
    j = tmp / f"{tag}.json"
    if not j.is_file():
        return ""
    words = [w["word"].strip() for s in json.loads(j.read_text(encoding="utf-8")).get("segments", []) for w in s.get("words", [])]
    words = [w for w in words if re.search(r"[A-Za-z]", w)]
    return words[0] if words else ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--paused", required=True)
    ap.add_argument("--sidecar", default=None)
    ap.add_argument("--listen", type=float, default=2.5, help="seconds transcribed after each card pause")
    a = ap.parse_args()
    proj, paused = Path(a.project_dir), Path(a.paused)
    side = Path(a.sidecar) if a.sidecar else paused.with_suffix(".json")
    pauses = sorted(json.loads(side.read_text(encoding="utf-8")).get("pauses") or [], key=lambda p: float(p["at"]))
    firsts = chapter_first_words((proj / "AS-RECORDED.md").read_text(encoding="utf-8"))
    fails, n = [], 0
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        shift = 0.0
        for p in pauses:
            at, dur = float(p["at"]), float(p.get("dur") or 0)
            pause_end = at + shift + dur                      # paused-spine seconds where the voice resumes
            shift += dur
            label = p.get("card")
            if p.get("clip") or not label:
                continue
            n += 1
            want = firsts.get(label)
            if not want:
                print(f"  warn  card {label}: no chapter with card ON \"{label}\" and a first beat row in AS-RECORDED.md")
                continue
            heard = heard_first_word(paused, pause_end, a.listen, tmp, f"card{n}")
            ok = bool(heard) and first_sound(heard) == first_sound(want[1])
            line = (f"card {label} ({want[0]}) at source {at:.3f}: voice resumes {pause_end:.3f}s, first word heard "
                    f"{heard!r} vs the chapter's first word {want[1]!r}")
            print(("  ok    " if ok else "  FAIL  ") + line)
            if not ok:
                fails.append(f"{label}: heard {heard!r} first, expected {want[1]!r} (the card split a word or sits after the voice "
                             "starts: move the chapter's AS-RECORDED header time to the first word's true onset)")
    for f in fails:
        print(f"FAIL  {f}")
    print(f"CARD-WORDS {'FAIL' if fails else 'PASS'} cards={n} fails={len(fails)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
