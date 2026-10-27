# BROLL-PLAN: kcc20-live / clip 1 `kcc20-final-kaspa-tokens-on-l1` (FULL, 47.22 s)

Title (clip-plan): "KCC20 Is Final: Kaspa Memes Are Just Kaspa Tokens Now"
Spine: `kcc20-final-kaspa-tokens-on-l1-final.mp4` (staged GOP-seek-friendly as `render-assets/kcc20-final-kaspa-tokens-on-l1.mp4`,
25 fps, 1080x1920, video 47.200 s, audio 47.224 s). Comp: 30 fps, 1416 frames = 47.200 s.
Base (content zone 0..854, seam MEASURED 853/854 on 7 of 8 frames; the 8th, 31 s, is the chat banner edge) over Mike's webcam:
- 0.00-9.10  KCC Coordination Forum X post ("KCC-1, KCC-2 and KCC-20 are now Final, meaning they are ready for full adoption across the ecosystem") + the stream's falling-Kaspa-coins FX (as filmed)
- 9.10-26.52 Nacho the Kat X post ("Migration to KCC-20 is up next")
- 26.52-41.24 KCC Coordination Forum post again, with a burned-in VIEWER CHAT banner ("@basicforge: Can you show us your favorite way to buy Kaspa memes?")
- 41.24-end  Nacho the Kat post, falling-coins FX again from ~45 s
Directives for clip 1 (`clip_directives.py --batch kcc20-live --clip 1`): none. No coverage exemption.
Comp prefix `kl1` (kcc20-live clip 1). Composition id `Kcc20LiveTokensOnL1`. (`Kcc20` is the longform-edited comp, not ours.)

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-22)
| Named in clip | Bucket | Action |
|---|---|---|
| Kaspa / KCC20 (Kaspa token standard) | WELL-KNOWN + reference on disk `kaspa-logo.png` | every Kaspa beat generated WITH `kaspa-logo.png` |
| Ethereum ("ETH tokens") | WELL-KNOWN + reference `ethereum-eth.png` | peers beat generated WITH `ethereum-eth.png` (+ kaspa) |
| Solana ("Solana tokens") | WELL-KNOWN, no file | named explicitly in the prompt (real Solana three-bar mark) |
| Kasplex (third-party indexer) | LESSER-KNOWN, NO reference | NEVER drawn as a logo: code badge only ("NO THIRD-PARTY INDEXER") |
| Nacho the Kat (`nacho.jpg` on disk) | on the base screen-share only, not spoken | not depicted in b-roll (the real post is visible on the base 9.10-26.52) |
No real-person faces; any figure is a faceless silhouette.

## Redaction
Viewer handle "@basicforge" (orange pill, MEASURED x 0-118, y 703-735) on the base 26.52-41.24 (25 fps frames 663..1030).
A viewer's handle must not ship: narrow plate x 0-124, y 698-730 over the handle only; the question text stays (on-topic).

## Budget
Images: 5 b-roll beats (2 full-screen = hook + climax, firm cap 3) + 1 alpha overlay + frame-0 cover = 7 generated images.
B-roll time = 2.82 + 2.58 + 2.78 + 3.72 + 2.90 = 14.80 s of 47.20 s = **31.4 % b-roll / 68.6 % base** (band 25-35 %).
(Planned 16.10 s / 34.1 %; the SFX sweep moved beats 10 and 14 later, see the SFX results.)
Base-showing beats are deliberate: the KCC Coordination Forum post IS the receipt (Mike reads it), and the Nacho post is the
"migration to KCC-20" context. Full-to-full gap 38.7 s (never a sub-1.5 s base flash). No two b-roll beats butt.

## Beats (seconds on the spine; word times from whisper-words-verified.json)
| # | t in-out | Spoken line | Mode | Visual | Asset |
|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Kaspa coin as a colossal glowing monolith being sealed, top 45 % empty; CODE title "KCC20 IS FINAL" + chip "WHAT IT MEANS FOR KASPA" | `thumb-kl1-cover.png` |
| 1 | 0.03-2.88 | "KCC1, KCC2," | base | Mike + the KCC Coordination Forum post (the receipt, cold open on the base) | - |
| 2 | 2.88-5.70 | "and KCC20 are now final," | **FULL (hook)** | Pixar: three towering teal crystal pillars locking down onto a massive Kaspa-logo foundation stone, golden sparks, sense of permanence | `broll-kl1-hook-final-pillars.png` |
| 3 | 5.70-12.30 | "meaning they are ready for full adoption across the ecosystem. KCC20, it is" | base | the post text Mike is reading, then the Nacho "Migration to KCC-20" post (9.10) | - |
| 4 | 12.30-14.88 | "token standard that's built on covenants." | content | Pixar: a glowing teal covenant padlock sealing an ancient contract scroll, small teal token coins minting out of it | `broll-kl1-covenant-mint.png` |
| 5 | 14.88-16.96 | "And it's basically the" | base | Nacho post | - |
| 6 | 16.96-19.74 | "tokens that are just etched into the L1" | content | Pixar: a laser chisel etching token coins directly into a vast glowing teal bedrock block stamped with the Kaspa K | `broll-kl1-etched-l1.png` |
| 7 | 19.90-23.80 | "rather than through a third party indexer like your Kasplex." | badge | RED "NO THIRD-PARTY / INDEXER" (Kasplex has no reference: code only) | code |
| 8 | 24.00-26.30 | "The tokens are now on an L1." | badge | TEAL "TOKENS / ON THE L1" | code |
| 9 | 26.30-32.74 | "I guess there's no reason to start saying KCC20 now, right? Because it's a protocol. Now we can just say Kaspa tokens." | base | the KCC post (receipt) again; viewer handle redacted | - |
| 10 | 32.74-36.46 | "In the same way that we say, how do you buy Solana tokens?" | content | Pixar: a Kaspa coin stepping up onto a winners podium as an equal beside a Solana coin and an Ethereum coin | `broll-kl1-kaspa-peers.png` |
| 11 | 36.46-39.40 | "How do you buy ETH tokens? No, now it's just gonna..." | base | KCC post | - |
| 12 | 39.40-41.15 | "Now we can just really call them Kaspa." | overlay (alpha) | glowing teal Kaspa coin (real alpha PNG) floating at the right of the content zone | `ovl-kl1-kaspa-coin.png` |
| 13 | 41.15-44.40 | "So, yeah! Pump it up again." | base | Nacho post | - |
| 14 | 44.40-end | (gap) "Hell yeah!" | **FULL (climax)** | Pixar: a giant Kaspa coin blasting upward on a teal rocket trail through exploding green candlesticks, confetti of small teal tokens | `broll-kl1-climax-pump.png` |

## SFX (all from `video-creation/assets/sfx/`, picked from `library.json`; t = event - attack_sec)
| event | sound | note |
|---|---|---|
| cover cut (frame 1) | `transition_rapid_whoosh-tight.wav` | whoosh on the thumbnail cut, truncated |
| hook full-screen 2.88 | `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` | short, tail cut 0.30 |
| hook out 5.70 | `transition_rapid_whoosh-tight.wav` | crest in the 5.44-5.98 gap |
| covenant b-roll 12.30 | `kinetic-text/whoosh-4.mp3` | b-roll ingress |
| etched b-roll 16.96 | `kinetic-text/fast-swoosh.wav` | b-roll ingress |
| NO INDEXER badge 19.90 | `ding/sudden-shock-tight.wav` | twist jolt |
| TOKENS ON L1 badge 24.00 | `Impacts/Kick_Impact_01-tight.wav` vol 0.09 | stat hit, crest 23.98 in the Kasplex/The gap |
| Kaspa peers 32.74 | `DING-093.wav` | winner-coin reveal, crest in the tokens./In gap |
| Kaspa coin overlay 39.40 | `kinetic-text/swoosh-2.wav` | icon landing |
| riser into climax | `Riser Sound Effect-2s.wav` vol 0.035 | peak on 44.40 |
| climax full-screen 44.40 | `Impacts/Impact_Hit_01-2-short.wav` | climax hit, crest in the again./Hell gap |
All levels whisper-swept against an encode-matched control (SKILL row 7a), medium.en, 3-5 staggered windows per cue, all decodes
batched through whisper_jobs.py (`_qa/sfx/`):
- Pass 1 (planned cues, 33 windows): 22/33 SAME. Real maskers: Kick_Impact_01-short at 24.10 ("tokens" -> "tokas"), DING at 32.22
  ON "Kaspa tokens" (2/3 worse), and the climax impact at 43.50 + riser 0.07 over the QUIET "Pump it up again" (-38 dB): the mix
  lost the phrase. The rest are control hallucinations / window-edge artifacts (mix reads MORE than control on cue 1).
- Fix by TIMING first: kick -> `-tight` twin, crest 23.98 in the gap, vol 0.09 (badge IN 24.00); ding + peers b-roll -> 32.74
  (gap after "tokens."); climax full + impact -> 44.40 (gap after "again."); riser 0.07 -> 0.035 (v2). Pass 2: kick 2/4 same and
  the 2 diffs are on the already-garbled "Kasplex" word; ding 4/4 equal-or-better; tail v2 reads "pump it up again" in 4/5 windows
  vs control 2/5. Final mix re-verified on the RENDER (report).

## Caption STT decisions (whisper-words-verified.json)
- 0.00/1.50/3.14/9.10/28.64 "KCC 1/2/20" -> tokens KCC1 / KCC2 / KCC20 (one token each).
- 23.32 "CasPlan." -> "Kasplex." (large-v3 window decode "cast black", full-stream transcript "cast black", clip-plan STT fix).
- 32.28 "CasPlan." -> "Kaspa tokens." (full-stream in-context decode at 1307.96 "Now we can just say Kaspa tokens."; clip-plan quote).
- 40.66 "CasPlan." -> "Kaspa." (full-stream "call him Kaspa", window decodes "call them cast"; clip-plan fix "call them Kaspa").
- 37.28 "Heath" -> "ETH" (clip-plan fix). 14.24 "Covenant." -> "covenants.".
- "Hell" onset 46.30 -> 46.08 (RMS onset at 46.1; medium.en word timing 45.64-46.36).
- Gaps 42.06-43.58 / 44.32-46.30 checked: no omitted words (re-decodes hear only "So, yeah! Pump it up again. Hell yeah!"); the
  first is the drawn-out "yeah!", the second is low-level background (-40..-50 dB). Caption cleared at 44.60 ("again." would
  otherwise hold ~1.5 s over silence).
