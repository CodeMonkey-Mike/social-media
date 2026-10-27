# kaspa-covenants-yuli — PROJECT-LOG

A vertical AI-persona video on **Kaspa Covenants / the Toccata hardfork**, with **Yuli** as the
speaker, seated in her chair looking at camera. The Yuli counterpart to the Ana **kaspa-toccata**
video (`../kaspa-toccata/ana-webcam-final.png` + `ana-toccata-draft.mp4`).

## Status
- **2026-06-22: Seated webcam still FINALIZED** → `../../MASTER/studio-shots/yuli-pinkchair-webcam.png`.
  Approved base (Soul: monitors centered directly behind her, hair swept behind ears, on-model) + pink
  cat-ears added via a **targeted Nano Banana edit** (NOT a Soul re-roll). Recipe + edit prompt in that
  PNG's `.prompt.txt`. LESSON (Mike): a Soul re-roll redraws everything and cascades (cat-ears -> hair ->
  background); to fix one thing on an approved still, EDIT the PNG with Nano Banana. Rule persisted in
  `../../CLAUDE.md`. Below = the earlier iteration history.
- **2026-06-22: Seated webcam still DONE + APPROVED + promoted to a reusable MASTER asset** →
  `../../MASTER/studio-shots/yuli-pinkchair-webcam.png` (1152x2048, 9:16; prompt alongside it as
  `yuli-pinkchair-webcam.prompt.txt`). Moved out of this project folder so it can be reused across
  videos (Mike, 2026-06-22). Generated via the **YuliV2 Soul** (`text2image_soul_v2`, soul-id
  `668b13cf-fdcc-4dd0-bac8-fe45506fe0f6`, quality 2k, 9:16, 0.12 cr). Mirrors the Ana webcam composition: waist-up webcam
  talking-head, seated leaning back in the **PINK cat-ear chair** (Yuli's locked chair), facing camera
  with a soft genuine smile; dark magenta plaster wall + hot-pink LED glow; Ana's desk behind her
  (green crypto candlestick charts + boom mic) per the webcam-POV background rule. On-model: soft
  youthful faithful face, signature ringlet curls down, coral-rose lip. **Awaiting Mike's approval.**
  - Method note: used the **Soul** (identity-first — Yuli's documented fragile point) rather than a
    Nano Banana studio composite. Trade-off (per `../../CLAUDE.md`): Soul = best identity, invented
    room; the room here reads on-brand (pink studio + green charts) but is not the pixel-exact set. If
    Mike wants the EXACT studio chair/room, do a Nano Banana composite pass: studio angle
    (`../../studio/angles/angle-*-pink.png`) + this still as the identity ref.

## Voice — DONE 2026-06-22 (Higgsfield Seed Speech, YULI-1)
- Script chunked into 8 (2-3 sentences each per the anti-hallucination rule), generated via the
  `higgsfield-voice` Playwright flow (Voiceover mode -> Seed Speech -> YULI-1), curled each mp3.
  ~1 credit total (0.1/gen). Chunk 4 re-gen'd once (first take said "no chain speed" not "split").
- Whisper-verified all 8: words correct, no hallucination. She pronounces Kaspa as "Caspa" (Dominican
  accent, on-brand) and Toccata as "Tokata" — captions will still read Kaspa/Toccata.
- Tracks in `audio/`: `yuli-vo-full.mp3` (72.8s, natural) and `yuli-vo-60s.mp3` (1.2x sped -> 60.6s,
  hits the target; speeding de-drawls this slow voice, per ANA-SPEC). Per-chunk mp3s kept as `chunk*.mp3`.
- **Awaiting Mike: listen + pick natural vs 60s, confirm the "Caspa" pronunciation.**
- **Video route = ElevenLabs lip-sync (NOT Seedance)** off the pink-chair still, driven via Playwright
  like the Ana video. To discuss/build next.

## Video — DRAFT ASSEMBLED 2026-06-22 (ElevenLabs Aurora lip-sync, no Seedance)
- FACE clips = ElevenLabs **Creatify Aurora** lip-sync (image = `yuli-pinkchair-webcam.png`, audio =
  per-chunk natural mp3, 480p, via `skills/elevenlabs-lipsync` Playwright). Chunks chosen 1/4/6/8
  (hook / Toccata / conviction / close). All 448x832, Whisper-verified content.
  - face1 (chunk1, t=0.000), face4 (chunk4, t=23.976), face6 (chunk6, t=41.016) -> DONE.
  - **face8 (chunk8 close): RESOLVED.** Aurora blocked the full chunk8 3x ("Generation failed - Terms of
    Service"). ROOT CAUSE (Mike found): ElevenLabs **prohibits high-risk financial advice** -> the
    superlative claim *"Covenants put Kaspa lightyears ahead of every other crypto"* tripped it. FIX:
    re-cut the close audio to just the benign last sentence *"This changes what a coin can be"*
    (`audio/chunk8b.mp3`, extracted from chunk8 at 4.85s) -> Aurora passed first try (registered at 3%).
    `face8.mp4` placed at master t=69.962. The "lightyears ahead" sentence stays BLACK + audio (its VO
    line is intact; only its face is omitted). Rule persisted in `skills/elevenlabs-lipsync/SKILL.md`.
- **Lip-sync alignment was trivial**: each Aurora clip's speech onset == its source chunk's onset
  EXACTLY (0.3526/0.3535/0.3769s), so no lead-in trim needed — clip frame 0 sits at the chunk's
  master-timeline offset and lips track the VO.
- Assembled with ffmpeg: black 1080x1920 base + full natural VO (`audio/yuli-vo-full.mp3`, 72.8s) +
  the 4 face clips overlaid (cover-scaled) at their offsets; black + audio everywhere else (per Mike).
  -> **`yuli-covenants-DRAFT.mp4`** (72.8s, 1080x1920). QA: faces present, black between, VO continuous.
- **2026-06-22: DESILENCED at 230ms** (Mike) -> **`yuli-covenants-DRAFT-desil.mp4`** (72.8s -> 66.3s; 13
  cuts / 6.5s removed; QA: no swallowed speech). Audio+video cut frame-locked so face lip-sync stays in
  sync. This is the current tightened cut; the pre-desil `yuli-covenants-DRAFT.mp4` is kept as reference.
- **Open / Mike's call:** the close (chunk8) face — retry Aurora after a cooldown, try HeyGen Avatar 4
  (documented uploaded-face fallback in the skill), or leave black. Plus: watch the draft for lip-sync
  quality. Later passes can fill the long black gaps (chunks 2/3/5/7) with b-roll/containers.

## REAL EDIT — DONE 2026-06-22 -> `yuli-covenants-FINAL.mp4` (1080x1920, 66.3s, 89 MB, crf18)
Built from the desilenced spine. Comp = `remotion/src/KaspaCovenantsYuli.tsx` (id `KaspaCovenantsYuli`),
render `--public-dir render-assets`. Mirrors `AnaToccata.tsx`.
- **Spine:** `yuli-covenants-DRAFT-desil.mp4` (faces baked + black + VO) as the continuous base.
- **B-roll = ALL FRESH ChatGPT 9:16 (NO reuse across channels, CLAUDE.md rule):** covenant-coin +
  rule-gates (gap1 rules), ethereum-overload (gap2), ecosystem-rising + kaspa-ecosystem-city (gap3).
  Ken-burns; fade/wipe/slide entrances. Generated via `repurpose/gen-batch-freshchat.js` (chatgpt-profile).
- **Captions:** Caption2 arial-black karaoke from the desil transcript. Fixed mishears: Tokata->TOCCATA,
  Realdify->REAL DEFI, Volts->VAULTS (toccata/defi added to canonical CORRECTIONS; volts hand-fixed).
- **Music:** Race Against Time bed (vol 0.08, fade in/out). **SFX:** Tension riser + Soundjay impacts on
  face cut-ins + Impact_Hit on the ecosystem reveal (all trimmed UNDER the VO; final max -2.1 dB).
- **Transitions:** Remotion-default-style fade/wipe/slide on b-roll entrances + **2 real GlitchBlocks
  swaps** (blocks-max coin->rules @14.3, blocks-strips ecosystem->city @55.4).
- QA: no black gaps; VO-forward mix (mean -18.4, max -2.1); captions corrected; faces + b-roll + glitches verified.
- **Motion punches added (Mike):** 3 fresh Envato vertical green-neon-corridor clips, trimmed to ~1s each,
  open each b-roll gap (`env-tech` @7.1, `env-data` @29.5, `env-clean` @46.5) as quick technical/digital
  motion hits before the conceptual still settles. Sourced via `skills/envato-broll` (search "digital tunnel
  corridor neon green"); big .mov originals recycled, only the 1s cover-cropped mp4s kept. Greenish to match
  Kaspa brand. Final re-rendered -> `yuli-covenants-FINAL.mp4` (66.3s, 88 MB), still no black gaps.

## Caption FLICKER bug — ROOT-CAUSED + FIXED IN THE SKILL 2026-06-22
Mike's recurring complaint (every karaoke video): captions bounce 1<->2 lines rapidly. ROOT CAUSE: the
active word got WIDER padding (`active ? '2px 14px' : '2px 4px'`), changing the line width, flipping the
flex-wrap between 1 and 2 lines as the highlight advanced. Each comp copy-pasted that buggy renderer ->
recurred everywhere. FIX: (1) new canonical flicker-free component `remotion/src/captions/Caption2.tsx`
(constant padding on every word; active toggles ONLY paint), (2) `KaspaCovenantsYuli.tsx` imports it
(inline copy removed), (3) rule + canonical-component pointer written into `skills/captions/captions.md`.
Re-rendered -> stable line count verified on consecutive frames. Older karaoke comps (WiseMan*, CryptoPromo,
AnaToccata) still have inline copies; migrate them to the shared component on request.

## Next (after still approved)
1. Write the Covenants VO script for Yuli (open-loop teaser, gear-3 energy; reuse the longform/short
   covenants angle). Per `../../YULI-SPEC.md` Production route.
2. Voice: Yuli = lip-sync to a pre-made clone track (Higgsfield Audio Seed Speech) via Seedance
   `--audio` + MINIMAL prompt, OR Seedance-native Dominican accent. **480p ONLY.**
3. Seedance 2.0 image-to-video off this still (9:16, 480p), match clip duration to the line.
4. Edit in Remotion (mirror `AnaToccata.tsx` scene-comp pattern), captions (Kaspa not caspa), music,
   then QA + render.
