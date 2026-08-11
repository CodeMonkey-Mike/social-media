# BROLL-PLAN — last-year / clip #2 `lab-353x-underestimate` (variant: full)

"I Estimated a 20X on LAB. We Did a 353X." (batch title, clip-plan rank 2).
Spine: `lab-353x-underestimate-final.mp4`, 1080x1920 @ 25 fps, **71.36 s** (5C was passthrough, so
`-final` == `-tightened-desilenced`; both files are byte-identical at 23,883,840 B and their audio
streams share MD5 `a09d2ab4bdfc4f704043cf044f0a72d7` with the staged
`render-assets/lab-353x-underestimate.mp4`).
Register: **conviction / vindicated**. Every underestimate in this clip is a WIN that beat his own
call. Nothing is framed as a mistake.

## What the BASE actually shows (read off RENDERED FRAMES, not assumed)

Row-gradient seam scan at t = 1/5/12/20/30/40/50/58/62/66/70 s: the screen-share/webcam divider is
**row 853** on every frame that has a hard divider (t=1/62/70 fall inside a soft/low-contrast band and
report the weak 710/747 edge; the eight strong readings are all 853). Same livestream layout as the
`early-crash` and `tutorial` batches.

| span | content zone (upper 853 px) | on-message? |
|---|---|---|
| 0.00-20.16 | **$TUT project site** (yellow "TUTORIAL" wordmark, `ca: 0xCAAE...`, Buy $TUT, the WAGMI anime mascot, a live chat line at the bottom) | YES - it is the very coin the 94x/"I thought it was dead" run is about |
| 20.16-47.32 | **CoinMarketCap $TUT page**, FROZEN: Market cap $150.77M -> $151.44M, +612.19% vol/mktcap, the all-time chart with the October collapse and the vertical recovery spike, Tutorial Markets table (Binance TUT/USDT $0.1902 ...) | YES - it is the literal receipt for "it didn't recover at all" and "back to its all-time high" |
| 47.32-51.08 | **cryptorich.vip "Top Performing Assets" 2025 leaderboard**, scrolled live: MYX +55171.9% **552x** (Insider Alert), TRASH 148x (Mike), TUT 128x (Insider Alert), AIA 127x, PIPPIN 89x, Bobby The Cat 60x, DISCO 47x, BROAK 34x (Mike), GIGGLE 30x, PYTHIA 28x, JYAI 21x, OMALLEY 18x (Mike) ... | YES - THE receipt for "insane amounts of good plays". The strongest single frame in the clip |
| 51.08-64.52 | **cryptorich.vip PREMIUM MEMBERSHIP** page + a live CoinMarketCap candle chart + the 552x/198x/148x/128x/128x/127x multiplier strip | YES (his own numbers, on screen) |
| 64.52-69.56 | ⛔ **the CELEBRATION VIDEO DROP** (see the hard guard below) | PROTECTED |
| 69.56-71.36 | back to the PREMIUM MEMBERSHIP page | - |

A 1 s-bucket content-zone frame-diff scan reads <= 0.3 mean across 21-47 s and 52-64 s: the page is
**frozen** for those stretches, which is why the long deliberate base gaps below cost nothing.

## ⛔ HARD GUARD 1 — the CELEBRATION VIDEO DROP, 64.52-69.56 s

The delegation flagged "~5 s that MEASURES at speech level (mean -19.3 dB), untranscribed, likely
Mike's live reaction". **Measured, it is neither dead air nor his reaction: it is a celebration video
he plays in the screen-share, with its own crowd audio.**

```
picture: content-zone frame-diff jumps 72.10 at 64.520 and 49.99 at 69.560; every frame between them
         is a moving picture-in-picture of a crowd cheering/dancing under trees (verified at
         t = 65.0 / 66.5 / 68.0 / 69.5 s), occupying roughly x 0-935, y 0-555
audio:   continuous -17 to -22 dB from 64.88 to 69.76 with NO internal silence (0.1 s RMS), then a
         declicked join to digital silence at 69.785-69.800 (-94 dB) before "Holy" at 69.82
words:   the clip's own pass AND an independent medium.en whole-clip pass both return ZERO words in
         64.88-69.72 - it is not speech, so nothing may be captioned over it
```

Therefore: **no b-roll, no overlay, no badge and no SFX cue may touch 64.30-69.80 s.** Covering it
with a picture deletes the payoff Mike deliberately played; a sting on top of it covers it in the
audio domain (the `tutorial` batch's Schwarzenegger-drop precedent). Enforced mechanically at bundle
time in the constants file. The ONE caption action taken there is a **blank caption at 65.10** so the
band does not freeze "bear market nonetheless." on screen for 6.3 s over the drop.

## ⛔ HARD GUARD 2 — the scatter-gather SPLICE is at t = 51.080 s, and it is covered

This clip is two master ranges glued together (616.55-695.10 and 726.56-752.44, ~31 s apart).
Full-clip frame-difference scan (1782 frames): **51.080 is the only frame in the clip where the
content zone AND the face zone jump together** (content 36.43 = leaderboard -> PREMIUM MEMBERSHIP,
face 18.90 = his head jumps) with no page interaction to explain it. The master confirms the join
word-for-word: segment 0 ends on the truncated "...so I'm calling them right" (master "right"
694.40-695.32, cut at 695.10) and segment 1 opens 40 ms into "pumps" (master 726.52-726.94), which is
why both Whisper passes read the glued result as "so I'm calling them pumps."

**B7 is a full-screen cover over 50.90-53.55**, opaque from 51.02 (BrollLayer fades in over 0.12 s),
so the join frame is hidden. The four other diff spikes (33.84 / 53.44 / 58.28 / 62.56) are
face-zone-only with a static content zone = ordinary 5B desilence micro-cuts, and are not covered.

## Caption decisions (canonical tool only)

Built with `skills/captions/build_captions.py --style montserrat`, i.e. house style, no hand edits.

| item | decision |
|---|---|
| "seeing that **I** didn't recover at all" | FIXED to "that **it** didn't recover" via a new keyed `PHRASE_CORRECTION` in the canonical tool (medium.en whole-clip + the master both read "it"; the subject is the COIN). Without it the caption reads as Mike failing, which inverts the register |
| "lab" -> "LAB", "velvet" -> "Velvet" | **casing only, and the montserrat preset lowercases via CSS, so both are invisible on screen** - no rule added (a no-op rule is worse than none). The brand is carried by the reference-image b-roll instead |
| tau -> TAO, Casper -> Kaspa | standing global glossary in the tool; **neither token occurs in this clip**, so nothing fires |
| "off a lab" -> "off of lab" | fires from the existing `what-if-1000x` rule at 60.32 |
| "so i'm calling them pumps" | KEPT. It is what the glued audio says (see HARD GUARD 2). The clip-plan's "I'm calling them right" is the pre-tighten master wording; captioning that would not match the audio |
| 64.88-69.72 | blank caption at 65.10 (band clears over the celebration drop) |
| colour | `<y>` on the ESTIMATES (20x, 30x), `<gr>` on the ACTUALS (353x, 58x, 94x), `<r>` on "dead"/"crash" - the estimate-vs-actual contrast is the clip's whole argument |

## Reference-image gate (MANDATORY, done LIVE 2026-08-11)

`ls schedule-tweets/images/reference/` -> 24 entries: DogInMe.png, ElizaOS-ai16z-2.png,
ElizaOS-ai16z.webp, **LAB.png**, **TUT-tutorial.jpg**, bittensor-tao.png, bobo.png, carousels/,
cooper.jpg, ethereum-eth.png, housecoin.webp, kappy.png, kaspa-logo.png, kasy.png, kroak.png,
linea.png, michael-saylor.png, nacho.jpg, slippy.png, tendies.jpg, toshi.png, troll.png,
**velvet.png**, what-if.jpg.

Named projects in this clip: **LAB** (7.54 s, 60.66 s), **Velvet** (11.76 s), and the unnamed "this"
at 13.68-23.70 which the base screen-share identifies as **$TUT / Tutorial**. All three have a
reference on disk, so all three beats are generated WITH the reference and carry the real mark:

| beat | reference | mark |
|---|---|---|
| B2, B8 | `schedule-tweets/images/reference/LAB.png` | neon-green LAB wordmark + flask |
| B3 | `schedule-tweets/images/reference/velvet.png` | violet Velvet chevron + wordmark |
| B4 | `schedule-tweets/images/reference/TUT-tutorial.jpg` | black wedge-T on amber |
| thumb | `LAB.png` | the cover carries the real LAB mark |

The other four images (B1, B5, B6, B7) name no project: **blank featureless coins and faceless
silhouettes only**, no invented logo, no real person.

## Coverage budget (halved budget, SKILL item 4)

| | |
|---|---|
| b-roll covered | 2.65+2.25+2.25+2.65+2.60+2.85+2.65+2.95 = **20.85 s = 29.2 %** (target ~30 %, band 25-35) |
| base showing | **50.51 s = 70.8 %** (target ~70 %, band 65-75) |
| distinct images | **8**, zero reuse (the 6-8 band for a ~71 s clip) |
| beat lengths | 2.25-2.95 s ("changes every 1-3 s") |
| full-screens | **3** = hook + the 51.08 splice/turn + the climax, the three sanctioned moments, at the FIRM 1-3 cap |
| full -> full gaps | 46.70 s and 6.05 s - a sub-1 s base flash between full-screens is impossible |
| accent | content-mode divider = **GREEN `#39ff14`** (LAB's own brand green), NOT the component-default teal (teal reads as Kaspa, which this clip is not about) |

## Beat table

| # | mode | tIn | tOut | dur | spoken line (clip-relative) | visual | reference |
|---|---|---|---|---|---|---|---|
| - | BASE | 0.040 | 1.50 | 1.46 | "but it's absolutely insane, man." | frame 0 is the ONE-frame cover; the video opens base-first on Mike + the $TUT site | - |
| B1 | **full** | 1.50 | 4.15 | 2.65 | "it just goes back to how I underestimate things" (2.76-5.26) | HOOK: a tiny faceless hooded silhouette at the foot of a colossal green candle column vanishing into storm cloud; his own low marker line is far below the top | none |
| - | BASE | 4.15 | 6.30 | 2.15 | "...how I underestimate things. I estimated the" | the payoff word lands on his face | - |
| B2 | content | 6.30 | 8.55 | 2.25 | "the 20x on LAB and we did a..." (6.60-8.60) | THE CALL: the real LAB flask mark, green light erupting out of it up a lab wall | **LAB.png** |
| - | BASE | 8.55 | 10.60 | 2.05 | "...353x." | the first big number lands on the base + the code-drawn **353X badge** (8.75-10.30) | - |
| B3 | content | 10.60 | 12.85 | 2.25 | "I estimated like a 30x on Velvet and we did a 58x" (10.18-13.24) | THE SECOND CALL: the real violet Velvet chevron over a rising violet ribbon | **velvet.png** |
| - | BASE | 12.85 | 16.90 | 4.05 | "and we did a 94x on this and I didn't think we were going to" | the **94X badge** (14.65-16.30) over the $TUT site that IS "this" | - |
| B4 | content | 16.90 | 19.55 | 2.65 | "I didn't think it was going to make a comeback. I didn't think it was going to go back to its all time high" (17.46-20.92) | THE COMEBACK: the real amber wedge-T mark climbing out of cold ash back into light | **TUT-tutorial.jpg** |
| - | BASE | 19.55 | 24.30 | 4.75 | "...its all time high. I thought it was essentially dead if it was going to pump. but I mean, after this" | DELIBERATE: the CMC $TUT page (the crash + the recovery spike) arrives at 20.16 and is the receipt for every word of it | - |
| B5 | content | 24.30 | 26.90 | 2.60 | "after this October 10th crash and seeing that it didn't recover at all" (24.34-28.48) | THE CRASH: a red canyon of shattered candles, blank featureless coins tumbling into the dust | none |
| - | BASE | 26.90 | 36.60 | 9.70 | "...at all, just kept it going down after October 10th. I mean, I underestimated this too. this is like, it's crazy because I'm like, you know, should I be such" | ⛔ DELIBERATE, the long one: the frozen CMC chart under it literally draws the bleed he is describing, and the self-aware turn is pure delivery | - |
| B6 | content | 36.60 | 39.45 | 2.85 | "should I be more of a moon boy?" (37.94-39.40) | MOON BOY: a faceless hooded silhouette sitting on a crescent moon over a neon skyline of green candle towers | none |
| - | BASE | 39.45 | 50.90 | 11.45 | "because I am just not seeing, I'm seeing the good plays and I'm playing them, right? obviously I got all these amazing plays. it's insane amounts of good plays, right? so I'm calling them" | ⛔ DELIBERATE, the longest: **the Top Performing Assets leaderboard reveals at 47.32 and is scrolled live to 50.5** - covering the clip's single best receipt to hit a b-roll quota would be the documented wrong call. An SFX ding marks the reveal instead | - |
| B7 | **full** | 50.90 | 53.55 | 2.65 | "so I'm calling them pumps. now I'm getting the good coins" (49.88-53.16) | THE TURN + THE SPLICE COVER (join at 51.080): one blank coin lifted glowing out of a field of dull grey ones, green light picking it out | none |
| - | BASE | 53.55 | 59.60 | 6.05 | "but I have these lower expectations. like obviously the biggest disparity was, okay, I'm probably going to get" | DELIBERATE: the setup line is pure face, and the multiplier strip sits under it | - |
| B8 | **full** | 59.60 | 62.55 | 2.95 | "a 20x off of LAB and it ends up going to 353x" (59.68-62.56) | CLIMAX: the real LAB mark blazing on a frozen bear-market ridge, a green light column bursting up out of the ice | **LAB.png** |
| - | BASE | 62.55 | 64.52 | 1.97 | "you know, freaking bear market nonetheless." | the peak line lands on his face | - |
| - | ⛔ PROTECTED | 64.52 | 69.56 | 5.04 | (no speech) | the CELEBRATION VIDEO DROP - nothing over it, in either domain | - |
| - | BASE | 69.56 | 71.36 | 1.80 | "holy crap. geez." | the deliberate HARD-OUT on his face. No graphic, no SFX, no tail, no CTA | - |

## Assets (generated straight into the shared batch `render-assets/`, `*-ly-lab-*` namespace)

| file | beat |
|---|---|
| `broll-ly-lab-hook.png` | B1 |
| `broll-ly-lab-labcall.png` | B2 (ref LAB.png) |
| `broll-ly-lab-velvet.png` | B3 (ref velvet.png) |
| `broll-ly-lab-comeback.png` | B4 (ref TUT-tutorial.jpg) |
| `broll-ly-lab-crash.png` | B5 |
| `broll-ly-lab-moonboy.png` | B6 |
| `broll-ly-lab-pumps.png` | B7 |
| `broll-ly-lab-climax.png` | B8 (ref LAB.png) |
| `thumb-ly-lab353.png` | frame-0 cover art (title + chip drawn in CODE on top, never baked) |

Zero orphans: 8 beats <-> 8 images <-> 8 comp refs, plus the one thumb.

## Overlays / badges

**Two code-drawn badges only**, both inside base gaps, neither sharing a frame with any b-roll beat
or with each other, both at `top 590` (box ~494-686, i.e. >= 119 px clear of the caption band and
clear of the $TUT site's bottom "GET IT" banner at y ~820):

| badge | window | line |
|---|---|---|
| `353X` (green) | 8.75-10.30 | "and we did a 353x" |
| `94X` (yellow) | 14.65-16.30 | "and we did a 94x on this" |

No image overlays: the three named projects are carried by reference-generated b-roll, and the clip
has no third graphic that would earn a frame. Nothing starts under the frame-0 cover.

---

# BUILD RECORD (2026-08-11) — what the shipped comp actually does

Comp: `remotion/src/LastYearLab353xUnderestimate.tsx` + `constants-last-year-lab-353x.ts`
(composition id `LastYearLab353xUnderestimate`, 1080x1920, 2140 frames @30 fps).
Render: `remotion/out/last-year/2-lab-353x-underestimate.mp4` (71.381 s, 61.6 MB).

Every beat, mode, in/out time, the three full-screens, the 51.080 splice cover, the two badges and
the eight asset filenames are **exactly as planned above**. Deltas:

| # | delta | why |
|---|---|---|
| 1 | **SFX added** (the plan above did not cover audio): 9 events / 8 distinct files | contract item 5 |
| 2 | A whoosh on the B7 turn/splice cut (t 50.75, crest 50.90) was BUILT, TESTED and **DELETED** | an offline, encode-matched whisper sweep proved it turned "so I'm calling them PUMPS" into "PUNKS" at 2 of 3 offsets. TIMING was tried first (crest moved into the real 51.52-51.76 speech gap) and still failed; the cue is decoration on a transition, not a payoff hit, so it was deleted. Full reasoning in the constants file's SFX block |
| 3 | The climax RISER was swapped from `Tension_Rise_Logo_Reveal_3` (5.76 s, crest 2.55, started 57.05) to the **1 s library variant** at 58.95 | the long riser inserted a phantom "well" after "okay" at BOTH 0.09 and 0.06 gain (gain was the wrong knob); shortening it took the climax windows from 1/3 to 2/3 MATCH and no real word is lost in any window |
| 4 | `broll-ly-lab-climax.png` was **shifted 150 px up** (mirrored bottom fill) after the first full render | the generated LAB wordmark landed at frame y ~790-830, i.e. UNDER the caption band (805-975), so the caption sat on top of the brand mark - the style guide's "never over b-roll text". Re-rendered; the mark now reads at y ~650-720, ~120 px clear. `climax-orig.png` kept in the session scratchpad |
| 5 | ONE keyed `PHRASE_CORRECTION` added to the canonical caption tool | "seeing that **I** didn't recover" -> "that **it** didn't recover" (the coin, not Mike) |
| 6 | ONE blank caption entry at 65.10 | clears the band over the celebration drop instead of freezing "bear market nonetheless." for 6.26 s |

Captions live in the constants file as `CAPTIONS_LY_LAB` (the canonical tool's TS output); there is no
separate `captions-*.txt` in this clip folder and none is needed.
