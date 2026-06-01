# Playbook: repurpose (transcript → posts)

**Trigger:** "make tweets from this", "what can I post from the livestream", or a transcript dropped in
`repurpose/transcripts-ad-hoc/`.
**Canonical detail:** `repurpose/SKILL.md`. **Voice/terminology:** `persona/persona.json` (read before drafting).

## Entry
- Default transcript source = the batch registry `batches.json` (repo root). Read the transcript from
  disk — don't ask Mike to paste it.
- Ad-hoc one-offs: `repurpose/transcripts-ad-hoc/` (`.txt`/`.md`/`.srt`/`.vtt`) — the override path, not the default.
- Draft into `repurpose/output/`, then persist approved drafts to `schedule-tweets/data/*.json`.

## Flow
1. Surface topics worth posting (Phase 1 in SKILL.md).
2. Mike picks concepts; draft variations in this order: long tweet → one-liner → thread → X poll → YT poll → YT post.
3. Write approved drafts to the queue files. Images → `playbooks/image-gen.md`.

## Watch for
- Two variations = genuinely different **angles**, not paraphrases.
- Dropped concepts don't resurface within a cycle.
- Geopolitical / dark-register content stays **tweet-tier** (no YT post/poll amplification).
- Project-focused tweets get a `Follow: @handle` final line (handles in `persona.json → project_handles`); **skip for Kaspa**.
- **Out of scope here:** cadence / timing / order / status flips that affect the active queue — those are schedule-tweets decisions.
