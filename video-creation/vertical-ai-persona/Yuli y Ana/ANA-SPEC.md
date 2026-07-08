# Ana — persona spec (locked parameters)

Single source of truth for generating Ana. Read before any generation. Everything downstream
(Soul training set, Soul, stills, talking-head video, full-body/dress shots) must match this.

## Identity & idealization (LOCKED)
- Real age 32 → render as **~26 years old**.
- **Body fat reduced ~12%** vs her real photos (naturally slimmer face/neck/shoulders/torso, more
  jaw definition, less under-chin fullness). NOT skinny/gaunt — healthy normal figure. 12% chosen
  over 10% (too subtle) and 15% (starts to soften identity).
- Height: **5.6 feet (decimal) = ~5'7" / 170 cm** — use for full-body proportions. (Height was given
  in decimal feet, a normal convention in the Dominican Republic; 5.6 ft = 67.2 in, NOT 5'6".)
- **Figure is naturally CURVY:** fuller, more pronounced rounded backside (glutes) that visibly
  projects in side-profile and rear/3-4-behind views. This is true to her real body — KEEP it even
  though overall body fat is reduced 12% (slim overall, but curvy/pronounced rear, not flat).
  Default AI renders her too flat behind; always emphasize the real curve on side/rear shots.
- Keep EXACT identity: medium-brown skin, warm genuine smile, long straight dark hair, same eyes,
  nose, bone structure, face shape. Never change ethnicity/skin tone/hair.

## Master reference images (the anchors — derive everything from these)
- `MASTER/ana-master-face-12pct.png` — face anchor (talking-head, 12%)
- `MASTER/ana-master-body-12pct.png` — upper-body anchor (12%)
- `MASTER/ana-master-fullbody-12pct.png` — full-body figure anchor (12%)

## Training-set consistency (HARD RULE — learned 2026-06-14)
- **Every side/rear/3-4-behind training image MUST show her curvy pronounced backside.** A single
  FLAT side/rear shot in the training set creates a MIXED SIGNAL and the Soul averages toward FLAT on
  all side/rear generations (exactly the spec's "AI defaults flat" warning). Front shots reading slim
  are FINE and consistent (slim-front, curvy-rear) — the contradiction is only flat *side/rear* shots.
- Caught when a beach rear shot came out flat: the cause was `ana-15-fullbody-side-profile` (flat, in a
  business suit) contradicting the curvy `ana-16`/`ana-17`. Fix: regenerated `ana-15` curve-correct
  (Nano Banana anchored on `ana-17`) and RETRAINED the Soul. Old flat one → `_build/training-set/_superseded/`.
- When fixing a training image, anchor on a curve-correct reference (`ana-16`/`ana-17` / real `source-photos/ana2.jpeg`)
  via `nano_banana_2 --image`, and explicitly forbid flattening ("do NOT flatten or slim the glutes/hips").

## Recipe findings (HARD RULES — learned from culls)
- **No wide/open-mouth smiles.** Big grins puff the cheeks and soften the jaw → reads FULLER and
  OLDER and drifts off-identity (caused culls 03/05/06, Mike flagged 03). Use **gentle closed-lip
  or soft smiles, or neutral** expressions only.
- Always include the guardrail: "slim face, defined jawline, do not add facial fullness."
- Anchor every gen on the master image(s) above, not the original photos (those are the real
  fuller 32-yo figure and will pull her back).
- Natural realistic skin texture (visible pores), not plastic/over-smoothed. No text/watermark.

## Trained Soul (USE THIS for all Ana generation)
- Soul name **Ana**, `--soul-2`, reference id **`eb2566fb-c2ca-4f53-9846-efcab279350e`** (also in
  `.soul-ana-id.txt`). **RETRAINED 2026-06-14** on the curve-consistent 17-image set (flat `ana-15`
  side-profile replaced — see Training-set consistency rule). Validated on a front bar still (identity good).
  Supersedes the old `328e2c3e-15a8-4f5d-be3b-1c89846c9dd4` (trained 2026-06-13; do not use — flat-backside signal).
- Generate with: `higgsfield generate create text2image_soul_v2 --prompt "..." --soul-id eb2566fb-c2ca-4f53-9846-efcab279350e --quality 2k --aspect_ratio <r> --wait`
- soul_v2 aspect_ratio enum: `1:1 16:9 9:16 4:3 3:4 3:2 2:3` only — **NO 4:5** (use 3:4 for portrait/talking-head). Validated Soul 2026-06-13: talking-head/full-body/dress/backside all on-model.
- Still apply the recipe rules below in every prompt (no wide smiles; curvy pronounced backside on side/rear).

## Model / tooling
- Generator: Higgsfield **Nano Banana Pro** (`nano_banana_2`), 2k, identity-preserving reference edit.
- Soul variant to train: **`--soul-2`** (best for fashion-editorial stills + reference for
  image-to-video). Talking-head video = animate Soul stills. Cinematic Soul optional add later.

## Use cases
- IG videos about the crypto-rich community — them talking AND moving (walking, gesturing, to
  camera), casual NOT cinematic.
- Elegant **full-body / dress** fashion stills (first-class, not just talking-head).

## Production route (UPDATED 2026-06-14 — applies to both Ana & Yuli)
- **Video = Seedance 2.0 image-to-video off the Soul stills** (`seedance_2_0`, start image = a Soul
  still, 9:16, **480p ONLY — never higher (hard rule, root CLAUDE.md); Remotion upscales free**). Holds identity in motion.
- **Voice = Seedance-NATIVE (validated 2026-06-14).** Seedance 2.0 DOES generate the spoken dialogue +
  audio from the prompt — put the exact line in quotes AND add "speaks English with a distinct, clearly
  noticeable Dominican Spanish accent." (Correction: the old "Seedance has no TTS" note was WRONG.)
  ElevenLabs was tried 2026-06-14 and DROPPED — the library Dominican voices "did not sound like them."
  No ElevenLabs, no separate TTS, no recordings needed. (Future upside if they ever send a voice note:
  an ElevenLabs IVC/PVC cloned from their REAL voice — authentic + scriptable.)
- **⚠️ ANA-2 voice (Higgsfield Seed Speech) renders SLOW / drawn-out — speed it up. SPECIFIC TO ANA-2
  (2026-06-19).** When using the ANA-2 preset, her cadence comes out slow; EXCITED takes are even
  slower (raw excited ~5.6s vs ~4.1s neutral, same length). The lip-sync matches whatever audio you
  feed it, so **speed the AUDIO up front (atempo) BEFORE lip-syncing** — neutral lines 1.2x, EXCITED
  lines ~1.5x to hit the same brisk pace — then the video renders right with NO post-step. (On the
  Toccata closing I only did 1.2x, so the excited clip came out slow and I had to patch it with an
  extra ~1.3x on the finished video; avoid that by bumping the audio atempo instead.)
  This is an **ANA-2 quirk ONLY** — Yuli's and Mike's Higgsfield voices come out fine and do NOT need it.
  (Also: liberally use "!" + ALL CAPS in the ANA-2 prompt for energy — see memory tts-exclamations-caps.)
- **Match clip DURATION to the spoken line.** A duration longer than the line makes Seedance invent
  gibberish + hallucinate to fill the gap (an 8s clip on a ~5s line produced ~2.6s of nonsense). Render
  close to the line length, then trim the tail.
- **Multi-character dialogue — NEVER two speakers in ONE generation** (causes hallucinations; learned
  before, reconfirmed 2026-06-14). One speaking character per generation; the other is in frame but
  just smiles/listens (prompt: "does not speak"). For a multi-line conversation in ONE static scene:
  generate ONE clip per line, CHAIN it (start each next clip from the LAST FRAME of the previous clip,
  not the original still, so poses carry over), prompt "static locked-off camera, no camera movement,"
  then concatenate the clips → a seamless single-take. The first clip's start = the approved
  both-in-frame still.
- **Listener must NOT hold a frozen smile** (Mike, 2026-06-14 — a glued continuous smile reads
  inhuman). Prompt the non-speaker to "listen with a calm, relaxed, natural expression, a subtle nod
  or glance, not speaking and not holding a fixed smile." Chaining from the previous clip's last frame
  also helps (she carries over turned toward her friend, not staring at camera). VALIDATED on the
  beach-bar dialogue video, 2026-06-14. Kaspa spoken as "caspa" (see kaspa-wise-man CONCEPT.md).

## Source photos
- Best face anchor: `source-photos/ana1.jpeg`. Body/proportions: `source-photos/ana2.jpeg`. Secondary angle: `source-photos/Messenger_creation_5F599A27...jpeg`.
- Most Messenger_* photos are Yuli or both; no other solo-Ana photos exist.
