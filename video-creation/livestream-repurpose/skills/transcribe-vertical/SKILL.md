# Transcribe the vertical livestream (Phase 2) (livestream-repurpose track skill - CANONICAL)

_Moved VERBATIM from `video-creation/SKILL.md` on 2026-07-08 (Mike: per-track skills live in the track folder; this predates that convention). **This file is now canonical**; the master SKILL.md keeps a pointer stub and the phase-map table points here. Paths inside are written relative to `video-creation/` exactly as in the original._

> **Canonical invocation (2026-08-02 — LangGraph migration Wave 1):** Phase 2 runs inside the
> intake graph (`graph/run.py`, see intake-verticalize/SKILL.md), which wraps the whisper
> command + `parse_transcript.py` + `chunk_transcript.py` below IN ORDER, with one addition:
> `scripts/fix_transcript_glossary.py` runs on the Whisper JSON BEFORE parse/chunk, so every
> derived artifact inherits the corrections. It mechanizes the DETERMINISTIC tier of Step 3
> (tau->TAO, Casper->Kaspa, GhostDAG, D-Agent AI — auto-fixed, counts reported) and only FLAGS
> kaspy/kasy/kappy/kasper with timestamps (real KRC20 token names; token-vs-mishear is a human
> call at the Phase 2->3 seam — the graph report lists every flag; adjudicate them before
> Phase 3). The prose below remains the SPEC and the manual fallback.

## Phase 2 — Transcribe the vertical livestream

Phase 3+ all read a transcript, so it must exist first. Transcribe the **`…VERTICAL.mp4`** produced
in Phase 1 (transcribe the vertical, not the raw 16:9 — keeps one canonical artifact name across
the whole batch).

### Output layout
All transcript artifacts live in a per-livestream folder named after the VERTICAL file:
`livestream-repurpose/transcripts/<name VERTICAL>/`, holding:
- `<name VERTICAL>.json` — raw Whisper output with per-word `start`/`end` (the source of truth)
- `<name VERTICAL>_plain.txt` — readable paragraph text
- `<name VERTICAL>_words.txt` — flat word + timestamp list
- `<name VERTICAL>_chunks_90s.txt` — 90-second windows (the working artifact for Phase 3 tagging)

### Steps
1. **Run local Whisper** (installed on this machine; no API key) on the VERTICAL mp4, word-level,
   writing the JSON straight into the transcript folder:
   ```
   python -m whisper "livestream-repurpose/media/<name> VERTICAL.mp4" \
     --model small --word_timestamps True --output_format json \
     --output_dir "livestream-repurpose/transcripts/<name> VERTICAL/"
   ```
   `small` is the right accuracy/speed trade for a ~1-hour stream; `base` is reserved for the
   short per-clip caption pass (Phase 6).
2. **Derive the text artifacts** from that JSON — `parse_transcript.py` writes `_plain.txt` /
   `_words.txt` and `chunk_transcript.py` writes `_chunks_90s.txt`, both next to the `.json`, so
   they land in the folder automatically.
3. **Apply STT corrections** — Whisper mishears Mike's crypto vocabulary. Fix every occurrence:
   **Kaspa** (not Casper/Kaspy/Kasy/Kappy — any K-prefixed mishearing), **GhostDAG** (not
   "ghost"), **D-Agent AI** (pronounced "D-Agent AI" — Whisper renders it "DAG AI" / "de-agent
   ai" / "dagent"; the correct token is **D-Agent AI**), **TAO** (Mike PRONOUNCES $TAO as "tau",
   so Whisper writes "tau"; the ticker is always **TAO**, NEVER "tau" in any caption/title — the
   Greek letter tau is only correct as the coin's logo glyph), and the other brand names per the
   repurpose skill's correction list. These errors otherwise poison topic-finding and captions
   downstream.

The `_chunks_90s.txt` then feeds **Phase 3** directly.

---
