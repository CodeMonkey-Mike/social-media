# Chunk Possibilities — Future Enhancement Idea

## The Problem with the Current Approach

The current `create-short` workflow reads the full transcript in one pass and identifies 3–5 topics. This works, but has a blind spot: if Mike discusses the same topic (e.g. a KRC20 token) at minute 8 and again at minute 38, the skill may only surface one of those moments — or pick the weaker one.

## The Proposed Approach

### Step 1 — Chunk the transcript
Split the Whisper word-level JSON into time-window chunks (e.g. 3-minute blocks), preserving start/end timestamps for each chunk.

### Step 2 — Tag each chunk with topics
Analyze each chunk independently and label the topics it covers (e.g. "KRC20 token KAPPY", "Kaspa price target", "macro/Fed take", etc.).

### Step 3 — Group chunks by topic
Merge all chunks that share the same topic label into a single topic entry with multiple timestamp ranges. e.g.:

```
Topic: "KRC20 token KAPPY"
  Segment A: 8:12 – 10:45
  Segment B: 38:03 – 40:17
```

### Step 4 — Multi-segment clip cutting
When building the short, you now have options:
- Pick the single best segment (current behavior)
- Combine the best moments from both segments into one short

The real win: if Mike's clearest *explanation* of a topic is at minute 8 but his best *energy/hook* is at minute 38, you can cut both and concatenate them into one ~30s short that has the strong setup AND the strong closer. Uses the existing re-encode + concat pipeline (never `-c copy` across splice points).

## Why This Is Better for Long Livestreams

- A 44-minute livestream might return to the same topic 2–4 times
- Each revisit often has a different angle: first mention is the setup, later mentions are the punchline or the "and here's why it matters"
- Chunking + grouping surfaces all of them instead of just the first or loudest

## Implementation Would Need

1. A chunking script — splits the Whisper JSON by time window (configurable chunk size, e.g. 3 min)
2. Per-chunk topic extraction — Claude analyzes each chunk and returns a topic tag list
3. Topic merge pass — deduplicates and groups chunks that share the same tag
4. Updated Phase 2 (topic-finding) output — instead of "here are 5 topics," output "here are 5 topics, topic X appears in 3 segments"
5. Updated clip-cutting guidance — multi-segment cuts using the existing re-encode pipeline in `create-short` SKILL.md

## Status

IMPLEMENTED and documented as the default topic-finding method in the `create-short` skill
(section "TOPIC EXTRACTION — CHUNK METHOD"). Reusable script:
`video-creation/livestream-repurpose/chunk_transcript.py` (90s windows).
Agreed chunk size: 90 seconds.
