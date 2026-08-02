"""fix_transcript_glossary.py — Phase 2 Step 3: STT corrections on the Whisper JSON.

Mechanizes the DETERMINISTIC half of transcribe-vertical/SKILL.md Step 3 (2026-08-02).
Runs on the raw Whisper JSON BEFORE parse/chunk, so every derived text artifact
(_plain / _words / _chunks_90s) inherits the corrections.

Two tiers — this split is the point:

  AUTO (unambiguous on Mike's streams; fixed in place, counts reported):
    tau -> TAO                (ticker is ALWAYS TAO, never "tau", per the skill)
    casper -> Kaspa           ("fix every occurrence" per the skill; Mike does not
                               cover Casper Network — $CSPR would be said as "CSPR")
    ghost dag / ghostdag -> GhostDAG
    dagent / de-agent (ai) / dag ai / de agent ai -> D-Agent AI

  FLAG ONLY (reported with timestamps, NEVER auto-changed): kaspy / kasy / kappy /
    kasper. These look like Kaspa mishears but are REAL KRC20 token names from the
    persona glossary — whether Mike said the token or Whisper misheard "Kaspa" is a
    judgment call, made by a human/Claude at the Phase 2->3 seam, not by a regex.

Single-word fixes edit word tokens + segment text; bigram fixes MERGE the word pair
into one token (first token keeps its start, absorbs the second's end, second token
is removed) so downstream word-level consumers stay clean. Atomic write; prints a
GLOSSARY summary line the graph parses into the run report.

    python fix_transcript_glossary.py "<transcripts>/<stem>/<stem>.json" [--dry-run]
"""
import argparse
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# token regex: leading whitespace (Whisper tokens carry it) + word + trailing punct
TOKEN_RE = re.compile(r"^(\s*)([A-Za-z][A-Za-z'\-]*)([.,!?:;…]*)$")

SINGLES = {"tau": "TAO", "casper": "Kaspa", "dagent": "D-Agent AI", "de-agent": "D-Agent AI",
           "ghostdag": "GhostDAG"}
# (first, second) -> replacement single token
BIGRAMS = {("ghost", "dag"): "GhostDAG", ("ghost", "dagg"): "GhostDAG",
           ("dag", "ai"): "D-Agent AI", ("de-agent", "ai"): "D-Agent AI",
           ("dagent", "ai"): "D-Agent AI"}
TRIGRAMS = {("de", "agent", "ai"): "D-Agent AI"}
FLAGS = ("kaspy", "kasy", "kappy", "kasper")

# segment/full-text regex equivalents (word-boundary, case-insensitive)
TEXT_RULES = [
    (re.compile(r"\btau\b", re.I), "TAO"),
    (re.compile(r"\bcasper\b", re.I), "Kaspa"),
    (re.compile(r"\bghost[ -]?dagg?\b", re.I), "GhostDAG"),
    (re.compile(r"\b(?:de[ -]agent|dagent|dag)\s+ai\b", re.I), "D-Agent AI"),
    (re.compile(r"\b(?:de[ -]agent|dagent)\b", re.I), "D-Agent AI"),
]


def fmt_ts(t):
    return f"{int(t // 60):02d}:{t % 60:05.2f}"


def core(word):
    m = TOKEN_RE.match(word or "")
    return m.group(2).lower() if m else None


def rewrite(word, replacement):
    m = TOKEN_RE.match(word)
    return f"{m.group(1)}{replacement}{m.group(3)}"


def fix_words(words, counts, flags):
    """One pass over a segment's word list: n-gram merges first, then singles."""
    out = []
    i = 0
    while i < len(words):
        c1 = core(words[i].get("word"))
        c2 = core(words[i + 1].get("word")) if i + 1 < len(words) else None
        c3 = core(words[i + 2].get("word")) if i + 2 < len(words) else None
        if c1 and c2 and c3 and (c1, c2, c3) in TRIGRAMS:
            rep = TRIGRAMS[(c1, c2, c3)]
            w = dict(words[i])
            w["word"] = rewrite(words[i]["word"], rep)
            w["end"] = words[i + 2].get("end", w.get("end"))
            out.append(w)
            counts[rep] = counts.get(rep, 0) + 1
            i += 3
            continue
        if c1 and c2 and (c1, c2) in BIGRAMS:
            rep = BIGRAMS[(c1, c2)]
            w = dict(words[i])
            w["word"] = rewrite(words[i]["word"], rep)
            w["end"] = words[i + 1].get("end", w.get("end"))
            out.append(w)
            counts[rep] = counts.get(rep, 0) + 1
            i += 2
            continue
        if c1 in SINGLES:
            w = dict(words[i])
            w["word"] = rewrite(words[i]["word"], SINGLES[c1])
            out.append(w)
            counts[SINGLES[c1]] = counts.get(SINGLES[c1], 0) + 1
            i += 1
            continue
        if c1 in FLAGS:
            flags.setdefault(c1, []).append(words[i].get("start", 0.0))
        out.append(words[i])
        i += 1
    return out


def fix_text(text, counts_text):
    for rx, rep in TEXT_RULES:
        text, n = rx.subn(rep, text)
        if n:
            counts_text[rep] = counts_text.get(rep, 0) + n
    return text


def main():
    ap = argparse.ArgumentParser(description="Deterministic STT glossary pass on Whisper JSON.")
    ap.add_argument("json_path")
    ap.add_argument("--dry-run", action="store_true", help="report only, write nothing")
    args = ap.parse_args()

    with open(args.json_path, encoding="utf-8") as f:
        data = json.load(f)

    counts, counts_text, flags = {}, {}, {}
    for seg in data.get("segments", []):
        if seg.get("words"):
            seg["words"] = fix_words(seg["words"], counts, flags)
        seg["text"] = fix_text(seg.get("text", ""), counts_text)
    if isinstance(data.get("text"), str):
        data["text"] = fix_text(data["text"], {})

    if not args.dry_run:
        tmp = args.json_path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
        os.replace(tmp, args.json_path)

    merged = dict(counts_text)              # segment-text counts are the readable tally
    for k, v in counts.items():             # word-level may catch tokens outside segments
        merged[k] = max(merged.get(k, 0), v)
    summary = " ".join(f"{k}:{v}" for k, v in sorted(merged.items())) or "none"
    print(f"GLOSSARY fixes: {summary}{' (dry-run, not written)' if args.dry_run else ''}")
    for word, times in sorted(flags.items()):
        shown = ", ".join(fmt_ts(t) for t in times[:8]) + (" ..." if len(times) > 8 else "")
        print(f"FLAG '{word}' x{len(times)} at [{shown}] — real KRC20 token or Kaspa "
              "mishear? Human call at the Phase 3 seam; NOT auto-changed.")
    if not flags:
        print("FLAG none")


if __name__ == "__main__":
    main()
