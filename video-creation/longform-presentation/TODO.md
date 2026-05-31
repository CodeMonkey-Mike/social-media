# Longform-presentation — PARKED (if we resume)

_Parked behind the vertical-AI-persona pivot (see `../vertical-ai-persona/`). This track has no
video concept yet — it's a setup/foundation idea. The Higgsfield "can we do talking-head?" discovery
notes and most of the original open questions have since been answered by the vertical-persona work
(no TTS API; voice is a sample fed to Seedance, UI voiceover only; Seedance speaks the prompt verbatim;
30s = stitch 2–3 clips). Those are dropped. What's below is only what's still live if we revive longform._

---

## The vision

Longform 16:9 presentation videos where:
1. **First ~30 seconds:** Mike's AI clone (talking head) sits in the **bottom-right corner** as a PiP
   over the presentation.
2. **After 30s:** the presentation goes **full-screen**, and from then on only the **cloned voice**
   (voiceover) continues — no more on-camera clone.

The presentation itself is an HTML/animated slide deck. Style reference:
`kaspa_toccata_hardfork_deck.html` (editorial scroll deck, Playfair Display + DM Sans + JetBrains Mono).

Split to remember: **clone VIDEO = first 30s only** (bottom-right PiP); **cloned VOICE = whole video**
(continuous across the hand-off).

---

## Decisions LOCKED (2026-05-28)

| # | Decision | Choice |
|---|---|---|
| 1 | Canvas | **16:9 1920×1080**, landscape (YouTube longform). Length varies per video. |
| 2 | Production architecture | **Remotion** — owns the timeline, clone PiP overlay, 30s hand-off, voice sync. |
| 3 | Narration↔slide sync | **Voice-first.** Generate the voiceover → run the repo's existing Whisper word-timing tooling → those timings drive the Remotion slide cues. (No new sync tech needed.) |

---

## Still-open longform-specific questions (answer when we resume)

1. **Clone-intro mechanic:** PiP over *what* (opening slide / title card / dedicated intro bg)?
   Size/shape/position? 30s hand-off transition = hard cut / fade / slide-out?
2. **Batch registry shape:** one `batches.json` with a `type` field (`shorts` vs `longform`), or a
   separate longform registry? (Lean: one file, two shapes.)
3. **Persona clone section:** add an AI-clone behavior section to `persona/persona.json` — spoken
   register (vs tweet voice), the 30s intro pattern, voice direction, avatar visual/wardrobe/background,
   spoken "don'ts".
