# video-creation — visual style guide & shared-asset index

_Living doc. The canonical home for **cross-video visual style** (transitions, motion, SFX,
generated-image look) and an **index of the shared assets** in this folder. It starts thin and
**grows every time we standardize a rule or add a reusable asset** — same discipline as the
per-track skills: when a look is decided, write it here that turn so it doesn't regress._

**Point, don't duplicate.** Spoken/written voice + brand terminology = `persona/persona.json`.
Per-track editing mechanics = `longform-edited/longform-edited.md`,
`longform-presentation/longform-presentation.md`. Stock b-roll sourcing =
`envato-broll/SKILL.md`. This guide owns the **visual house style** that spans tracks.

---

## 1. Transitions

Full reference + sample preview renders: **`transitions/README.md`** (this folder).

The rules in one breath:
- **Chapter/topic/slide change:** pick **exactly ONE** presentation per video and use it for every
  chapter change. Safe defaults (no render config): **slide / flip / cube**. Premium (need Chrome
  `canvas-draw-element` flag at render, no Firefox/Safari): **book-flip / swap**.
- **B-roll / container in & out:** small consistent set — **fade** (default), **wipe**, and reserve
  **clockWipe/iris** for one emphasis beat.
- **HARD RULE:** never run a sync-locked talking-head spine through `<TransitionSeries>` (it
  overlaps neighbors and shortens the timeline → audio drift). TransitionSeries only for
  self-contained sequential scenes; overlays animate their own in/out over a continuous face.

---

## 2. B-roll conventions (per longform; canonical detail in `longform-edited.md` rule #2)

- **Budget ≈ 5 stock videos + 5 generated images** for an ~11-min longform. Sparse on purpose —
  the container-overlay presentation is the dominant visual layer; b-roll is punctuation.
- **1 to 4 seconds on screen, never more.** A stock clip longer than 4s: use its **first 4s** only.
- Plan slots in `media/<project>/BROLL-PLAN.md` and get sign-off BEFORE capturing.
- Stock video sourcing: `envato-broll/SKILL.md`. Receipts (article screenshots) are a separate
  device and don't count against the 10.

---

## 3. Generated-image look (ChatGPT, purpose `longform-broll` in the chat pool)

Append this style line to every longform b-roll image prompt:

> dark navy fintech editorial illustration, cinematic lighting, high contrast, neon red accent for
> threat beats, neon cyan accent for opportunity beats, 16:9, no words / text / letters / numbers
> anywhere in the image.

- Setup/payoff pairs (a "before" and a "broken after") must be generated with the first as a
  `--reference` so composition matches.
- Pool-managed via `repurpose/gen-batch-freshchat.js --prefix=broll --batch=<id> --purpose=longform-broll`
  (chat pool tracked in root `chatgpt-image-chats.json`). Keep `longform-broll` separate from the shorts
  `broll` style chat. This is the LONGFORM case → **pass `--outdir` pointed at the PROJECT'S OWN folder**
  (`media/<project>/assets/`, per §5 + `video-creation/SKILL.md` "Asset folder organization"); NEVER the shared
  `assets/` root and NEVER `assets/projects/` (retired — SHORTS now use `--batch` → `shorts/<batch>/render-assets/`,
  not `assets/projects/`; see SKILL.md). The generator hard-refuses any write under `video-creation/assets/`.

---

## 4. SFX library (`assets/sfx/`)

Reusable across videos. Index (add as we acquire):

- **Impact:** `Boom - Big Reveal.wav`, `Boom 2.wav`, `Punch 1.mp3`
- **Whoosh/transition:** `Cinematic Whoosh 02.wav`, `Cinematic Whoosh 06.wav`, `Riser Sound Effect.mp3`
- **Stinger/accent:** `DING.mp3`, `Cash Register.mp3`, `Cash Register Kaching ...mp3`, `MGS Alert.mp3`

Pair SFX to motion: whoosh on a slide/cube chapter change, boom/riser on a reveal, ka-ching on a
money/gain beat, ding on a checklist tick. Duck under VO.

---

## 5. Asset organization (what lives here vs in a project)

- **Shared & evergreen → this folder:** `sfx/`, `fonts/`, `music/` (+ `music/library.json`),
  and reusable b-roll that's genuinely cross-video.
- **Project-specific / work-in-progress → the project folder** (`media/<project>/assets/`), so
  project cleanup recycles it. Promote an asset up here only once it's proven reusable.
- Loose top-level files are legacy per-project dumps; migrate into named subdirs over time.

---

## Changelog
- 2026-06-11 — created. Seeded with the chapter-transition rule (+ render-cost split & the
  TransitionSeries audio-sync hard rule), b-roll budget, longform image style, SFX index.
