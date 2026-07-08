# Yuli — persona spec (locked parameters)

Single source of truth for generating Yuli. Read before any generation. Same workflow as Ana
(`ANA-SPEC.md`) — idealize first into approved masters, derive the Soul training set from the
masters, train, validate. Everything downstream must match this.

## Identity & idealization (LOCKED — UPDATED 2026-06-15: thin-face rule DROPPED, retrained)
- Real age 34 → render as **~28 years old** (a little younger, not dramatic).
- **FAITHFUL SOFT FACE + 18%-trimmed CURVY BODY (face-3 / body-2, Mike+Ana+Yuli approved 2026-06-15).**
  ⚠️ The OLD "thin slim narrow face" rule was WRONG and made the first Soul a generic lookalike (Mike
  AND Yuli agreed). Her real face is **soft, slightly-full, youthful** — full cheeks, soft jawline,
  warm rounded brown eyes, full natural brows, full lips, coral lip, genuine soft smiles. **Hold the
  face SHAPE faithful, just youthen to ~28; do NOT thin/narrow it AND do NOT fatten/round it.** The
  recurring drift is now toward fuller-when-on-a-body, so still keep the face anchored on a face master
  for body shots.
- **Body fat reduced ~18%** vs her real photos, applied to the **body only** (slimmer torso, waist,
  arms) while staying genuinely curvy/natural, NOT skinny. Petite. NEVER thin the body to skinny.
- Height: **4.9 feet (decimal) = ~4'11" / 149 cm** — petite/short. Use for full-body proportions.
  (Height given in decimal feet, the Dominican Republic convention; 4.9 ft = 58.8 in, NOT 4'9".)
- Keep EXACT identity: fair/light skin, dark **curly** hair (her signature — natural ringlet curls,
  usually worn down), warm face, same eyes/brows/nose/lips, bone structure, face shape. Never change
  ethnicity/skin tone, and never straighten her hair (curls are core to her look).

## STRATEGY — Yuli is different from Ana: MINIMAL-TOUCH from real photos (Mike 2026-06-13)
Ana's synthetic-master chain (photo → idealized master → face-tries → re-locked masters → add
makeup) does NOT work for Yuli: every Nano Banana pass averages her features toward generic, and by
the time makeup is layered on a 3-4-generation-removed face she stops looking like herself (her curls
+ soft delicate face are harder to reconstruct than Ana's straight hair / strong single anchor).
**The fix that works:** anchor DIRECTLY on her real solo selfies, ONE real photo per gen, with the
LIGHTEST possible edit — keep her exact face SHAPE (soft, slightly-full, youthful — NOT thinned), her
real soft-glam makeup, curls; only age her to ~28, swap the background to clean blurred, improve
light/sharpness. Validated on CA29331E
(`MASTER/makeup-preview/yuli-from-real-makeup-CA29331E.png`) — first render that read as her made-up
self. Build her whole face training set this way (one minimal-touch cleanup per real photo); only the
body/full-body needs generation (no real full-body exists), anchored on the made-up face master.
NEVER feed a 2nd/3rd competing face photo into a single gen — it shifts her face (caused drift).

## Recipe findings (HARD RULES — UPDATED 2026-06-15)
- **Soft genuine smiles are FINE and on-brand** (her real face has them). Prefer relaxed gentle/soft
  smiles or a warm genuine smile; avoid only the over-wide forced grin. (The old "no wide smiles" +
  "keep her slim face" guardrails were the cause of the generic lookalike — DROPPED.)
- Use the faithful-shape prompt block (see "Master generation recipe" below): faithful soft slightly-
  full youthful face, youthened ~28, do NOT thin/narrow AND do NOT fatten/round.
- Anchor every gen on the master image(s) / a real solo photo, not a 2nd competing photo (the originals
  are the real
  heavier 34-yo body and will pull her back toward it).
- Natural realistic skin texture (visible pores), not plastic/over-smoothed. No text/watermark.
- Curly hair worn down by default unless a look calls for it up.

## Source photos (best solo anchors — Yuli, fair skin + dark curly hair)
- **`source-photos/Messenger_creation_E0B602F6-...jpeg`** — BEST face anchor: clean white wall, curls down,
  soft-neutral, even light, sharp.
- `source-photos/Messenger_creation_B554B086-...jpeg` — red v-neck, curls down, soft-neutral (face + upper body).
- `source-photos/Messenger_creation_37D5291B-...jpeg` — navy floral, curls down, neutral.
- Lively/soft-smile variety: `...193F90A8...` (car, sunglasses), `...CA29331E...` (maroon, rose).
- No solo full-body photo exists → build her figure from the approved master via idealization
  (same as Ana). Mike's note: overweight overall but slim-faced; petite at 4'11".

## Model / tooling
- Master generation: Higgsfield **Nano Banana Pro** (`nano_banana_2`), `--resolution 2k`,
  identity-preserving reference edit (pass the source photos via `--image`).
- Soul variant to train: **`--soul-2`** (fashion-editorial stills + ref for image-to-video).
- Soul generation: `text2image_soul_v2 --soul-id <id> --quality 2k --aspect_ratio <r>`.
  aspect_ratio enum: `1:1 16:9 9:16 4:3 3:4 3:2 2:3` only — NO 4:5 (use 3:4 for portrait).

## Use cases
- IG videos about the crypto-rich community — them talking AND moving (walking, gesturing, to
  camera), casual NOT cinematic.
- Elegant full-body / dress fashion stills.

## Production route (UPDATED 2026-06-14 — applies to both Ana & Yuli)
- **Video = Seedance 2.0 image-to-video off the Soul stills** (`seedance_2_0`, start image = a Soul
  still, 9:16, **480p ONLY — never higher (hard rule, root CLAUDE.md); Remotion upscales free**). Holds identity in motion.
- **Voice — TWO routes (pick per video):**
  1. **LIP-SYNC to a pre-made track (PREFERRED when you have her cloned voice, e.g. video1-crypto).**
     Generate the accented YULI-1 clone track FIRST (Higgsfield Audio Seed Speech), then drive Seedance
     with the track via `--audio` AND a **MINIMAL prompt** — this is the ONLY way it lip-syncs to the
     provided track. Working prompt: `"A woman speaking to the camera, natural accurate lip sync to the
     spoken audio, locked static selfie shot."` ⚠️ A VERBOSE prompt (scene/energy/"talking excitedly")
     makes Seedance IGNORE `--audio` and INVENT its own speech (verified 2026-06-15: said "the view is
     insane"). `generate_audio:true` is fine — PROMPT VERBOSITY is the lever. Verify with Whisper that
     the clip speaks the real line. (Mirrors kaspa-wise-man `_lipsync-test/_resp2.json`.)
  2. **Seedance-NATIVE voice (validated 2026-06-14, when no clone track):** put the exact line in quotes
     in the prompt AND add "speaks English with a distinct, clearly noticeable Dominican Spanish accent."
     Seedance generates the dialogue + audio itself. Keep the prompt otherwise minimal (verbose degrades
     pronunciation). ElevenLabs library Dominican voices were tried + DROPPED ("did not sound like them").
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

## Master generation recipe (face-3 / body-2, the CURRENT approved look)
Faithful-shape prompt block (copied from `_build/compare-options/_gen.sh`, the approved opt3/opt2):
> "Reproduce the EXACT face and identity of the woman in the reference photo: same soft slightly-full
> youthful face shape, same full cheeks, same soft jawline, same warm rounded brown eyes, same full
> natural eyebrows, same nose, same full lips, same warm fair skin, same dark curly hair. Do NOT slim,
> narrow or thin her face. Keep her real face SHAPE faithful but make her look about 28 years old,
> fresh and youthful. Her signature soft natural glam makeup… [makeup block below]. Natural realistic
> skin texture with visible pores, photorealistic, clean softly-blurred neutral background."
- **Faces:** one real solo anchor per gen (`E0B602F6` best, `B554B086`, `CA29331E`, `37D5291B`).
- **Bodies:** anchor on a NEW face master (e.g. `_build/training-set-yuli-v2/f1-…`), add "body trimmed ~18%
  slimmer, still curvy not skinny, petite ~4'11", ~28yo." Full-body/standalone gens still drift the
  face fuller — anchor body shots on the FACE master, frame as tight as the use case allows.
- Compare renders that locked this: `_build/compare-options/opt3-face.png` (face) + `opt2-body.png` (body).
- OLD masters (`MASTER/yuli-master-*-18pct.png`) = the over-idealized thin-face look; SUPERSEDED.

## Status
- 2026-06-15: Soul RETRAINED in the face-3/body-2 look (thin-face rule dropped) → validated → on-model.

## Trained Soul (USE THIS for all Yuli generation)
- Soul name **YuliV2**, `--soul-2`, reference id **`668b13cf-fdcc-4dd0-bac8-fe45506fe0f6`** (also in
  `.soul-yuli-id.txt`). Trained 2026-06-15 on the 11-image set `_build/training-set-yuli-v2/` (5 faithful
  faces off real anchors + 6 body/dress shots, all face-3/body-2). Replaces the old generic-lookalike
  Soul `f75e48f5-…` (do NOT use the old id).
- Generate with: `higgsfield generate create text2image_soul_v2 --prompt "..." --soul-id 668b13cf-fdcc-4dd0-bac8-fe45506fe0f6 --quality 2k --aspect_ratio <r> --wait`
- aspect_ratio enum: `1:1 16:9 9:16 4:3 3:4 3:2 2:3` only — NO 4:5 (use 3:4 for portrait/talking-head).
- Validated 2026-06-15 (`_build/validate-yuli-v2/`): talking-head / full-body casual / beach-selfie all
  on-model and clearly HER. Always still include in the prompt: faithful soft youthful face (do NOT
  thin or fatten), fuller curvy body trimmed ~18%, signature soft-glam makeup, curls down, soft
  genuine smile ok, petite ~4'11", ~28yo.

## Signature makeup block (paste into prompts for her default polished look)
"her signature soft natural glam makeup: fresh dewy glowing skin, warm peachy-pink blush, softly
groomed natural brows, light neutral eyeshadow with subtle mascara and no harsh eyeliner, a warm
coral-rose satin lip — youthful, glowy, polished but natural." (Bare-faced or fuller evening glam
available on request per video.)
