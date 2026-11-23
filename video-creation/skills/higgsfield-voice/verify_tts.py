#!/usr/bin/env python
"""
verify_tts.py: GATE that proves tts-chunks.json matches the canonical SCRIPT.md, per chunk, BEFORE any
voice generation spends credits. Built 2026-07-16 after tts-chunks.json was hand-authored from a stale
draft and 10 chunks were voiced with wrong text (QA had compared audio -> tts-chunks instead of
audio -> SCRIPT.md, so it passed falsely). Python port of verify-tts.js (2026-11-23).

SCRIPT.md convention (ai-engineering screenplay): each chunk is
    **Chunk N - <label>**
    > spoken line 1
    > spoken line 2
    🎬 SHOW: ...      <- ends the spoken block

Usage (CLI):  python verify_tts.py <SCRIPT.md> <tts-chunks.json>
    exit 0 + "ALL <n> chunks MATCH SCRIPT.md" if every chunk's spoken text matches (after
    pronunciation/caps normalization); exit 1 + a per-chunk report otherwise.
Usage (module): from verify_tts import check;  check(script_path, chunks) -> {ok, mismatches, warnings, scriptCount}
"""
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

A = re.ASCII  # \b and \w are ASCII-only here, as they were in the JavaScript gate

# Map both the real word and its Seed-Speech phonetic spelling to one canonical token, so "FAY bull"
# (tts) and "Fable" (script) compare equal; real CONTENT drift still fails. Applied in this order.
_SPELLINGS = [
    (r"fay[- ]?bull", "fable"),
    (r"(?:oh|owe)[- ]?pus+", "opus"),           # "OH pus" / "OH-pus" / "OWE-pus" -> opus
    (r"\b(?:oh|o)[- ]?pis\b", "opus"),           # "Opis" / "OH-pis" (spoken spelling) -> opus
    (r"son[- ]?it", "sonnet"),
    (r"high[- ]?koo", "haiku"),
    (r"\broot\b", "route"),                      # "root" (spoken spelling) -> route
    (r"sub[- ]?agents?", "subagent"),
    (r"read[- ]?only", "readonly"),
    (r"\bq a\b", "qa"),
    (r"extra[- ]?high", "xhigh"),
    (r"long[- ]?form", "longform"),
    (r"bug[- ]?sensitive", "bugsensitive"),
    (r"kind[- ]?of[- ]?thinking", "kindofthinking"),
    (r"frame[- ]?perfect", "frameperfect"),
    (r"b[- ]?roll", "broll"),
    (r"re[- ]?sent", "resent"),
    (r"\bkan[- ]?ton\b", "canton"),              # "Kanton" (spoken spelling, Seed Speech mangled "Canton") -> canton
    (r"\bjulie\b", "yuli"),                      # "Julie" (spoken spelling: Dominican Y- names are said with a J) -> yuli
    (r"\[[^\]]*\]", " "),                        # ElevenLabs v3 inline delivery tags ([excited], [laughs softly]) are not text
    (r"[^a-z0-9]+", " "),
]
_SPELLINGS = [(re.compile(p, A), r) for p, r in _SPELLINGS]

_CHUNK_HEAD = re.compile(r"^\*\*Chunk ([0-9]+)\b", A)
_CHUNK_FILE = re.compile(r"chunk-0*([0-9]+)", re.IGNORECASE)


def norm(s):
    s = (s or "").lower()
    for pat, rep in _SPELLINGS:
        s = pat.sub(rep, s)
    return s.strip()


def extract_script(script_path):
    """Spoken text per chunk from SCRIPT.md: the "> " blockquote lines under each **Chunk N**, stopped
    by the 🎬 SHOW line, the next **Chunk, or a chapter heading. Returns {chunk number: text}."""
    lines = re.split(r"\r?\n", Path(script_path).read_text(encoding="utf-8"))
    out = {}
    cur = None
    for line in lines:
        m = _CHUNK_HEAD.match(line)
        if m:
            cur = int(m.group(1))
            out[cur] = ""
            continue
        if cur and line.startswith("> "):
            out[cur] += (" " if out[cur] else "") + line[2:].strip()
            continue
        if cur and (line.startswith("🎬") or line.startswith("**Chunk") or line.startswith("##")):
            cur = None
    return out


def check(script_path, chunks):
    script = extract_script(script_path)
    mismatches = []
    # Key each chunk by its filename (chunk-09.mp3 -> 9), NOT by list position, so a SUBSET (single-chunk
    # re-roll) is still gated against the correct SCRIPT.md chunk.
    for i, c in enumerate(chunks):
        fm = _CHUNK_FILE.search(c.get("file") or "")
        n = int(fm.group(1)) if fm else i + 1
        if n not in script:
            mismatches.append({"n": n, "reason": "no matching **Chunk " + str(n) + "** in SCRIPT.md"})
            continue
        s = script[n]
        if norm(s) != norm(c.get("text")):
            mismatches.append({"n": n, "reason": "text drift", "script": s, "tts": c.get("text")})
    script_count = len(script)
    # Full-set completeness is a WARN (not fatal) so subsets pass; a full run should still cover every chunk.
    warnings = ([f"count: SCRIPT.md has {script_count} chunks, tts-chunks has {len(chunks)}"]
                if len(chunks) > script_count else [])
    return {"ok": not mismatches, "mismatches": mismatches, "warnings": warnings, "scriptCount": script_count}


def main():
    if len(sys.argv) < 3:
        print("usage: python verify_tts.py <SCRIPT.md> <tts-chunks.json>", file=sys.stderr)
        sys.exit(2)
    script_path, chunks_path = sys.argv[1], sys.argv[2]
    chunks = json.loads(Path(chunks_path).read_text(encoding="utf-8"))
    res = check(script_path, chunks)
    if res["ok"]:
        print(f"ALL {len(chunks)} chunks MATCH SCRIPT.md")
        sys.exit(0)
    print(f"GATE FAILED - {len(res['mismatches'])} chunk(s) do NOT match SCRIPT.md:", file=sys.stderr)
    for m in res["mismatches"]:
        print(f"\n  chunk {m['n']}: {m['reason']}", file=sys.stderr)
        if "script" in m:
            print(f"    SCRIPT: {m['script']}", file=sys.stderr)
            print(f"    tts   : {m['tts']}", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
