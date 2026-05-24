# Persona — single source of truth for Mike's voice

`persona.json` in this folder is the **one authoritative definition** of @mikeneder / CodeMonkey Mike's identity, voice, terminology, and brand rules. Every skill and agent across the `social-media/` project references it.

## The contract

1. **Never restate voice rules anywhere else.** If a skill needs Mike's voice, terminology, or brand patterns, it links here — it does not copy the rules into its own file. Copies drift; that drift is the exact problem this folder exists to fix (reply-guy once didn't know a rule that lived only in the repurpose folder).
2. **This file wins on conflict.** If a craft/technique reference (e.g. `repurpose/VIRAL-TWEET-STANDARDS.md`) suggests something that contradicts a voice rule here, the persona rule wins. Example: VIRAL standards endorse "end on a screenshot-bait punchline," but `persona.json` → `brand_voice_patterns.no_punchline_drops` cuts aphorism/mic-drop closers. Persona wins.
3. **Grow it here.** New voice observations, terminology, or brand patterns get added to `persona.json`, not scattered into individual skill docs.

## What's in persona.json

- `identity`, `primary_assets`, `stacking_lineup`, `core_theses` — who Mike is and what he believes.
- `writing_style` — top-level tweet pattern, tone, formatting (incl. the no-em-dash rule).
- `reply_voice` — the conversational register for replies (lowercase, openers, length rules, reaction-only ratio).
- `brand_voice_patterns` — what Mike picks vs. cuts (named opposition, no punchline drops, no loose labels, first-person, pattern-break, quantity-not-price, etc.).
- `terminology_rules` — em-dash ban, Kaspa spelling/glossary (Kaspy/Kasy/Kappy/Kasper), GhostDAG, moving-average notation.
- `emoji_rules`, `avoid_in_drafts`, `engages_with`, and a baked `system_prompt`.

## Who references this

| Consumer | Uses persona for |
|---|---|
| `x-reply-guy/` (curated + auto reply) | Reply drafting voice/register, terminology |
| `repurpose/` (content drafting) | Voice + terminology for tweets/threads/polls/YT posts. Craft *technique* lives separately in `repurpose/VIRAL-TWEET-STANDARDS.md` (subordinate to this). |
| Future skills/agents | Any time Mike's voice or terminology is needed |

## What is NOT persona (don't move it here)

- **Workflow/process rules** (e.g. repurpose's cross-platform deployment order, "don't re-surface skipped concepts," IG 4:5 companion rule) — these stay in their skill's own file.
- **Craft/technique references** (e.g. viral hook templates, lead-magnet mechanics) — these stay as companions in the skill that uses them. Persona is *identity and voice*, not *technique*.
