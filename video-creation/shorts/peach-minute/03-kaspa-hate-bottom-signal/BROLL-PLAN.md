# BROLL-PLAN — `03-kaspa-hate-bottom-signal` (batch `peach-minute`, clip 3)

_Authored BEFORE generation; the timing table below is the FINAL, as-shipped manifest (it was revised
once during the build, see "Shot map" — the original hook timing was written against a wrong
assumption about the base's first second)._

Spine: `preview.mp4` (FINAL, tightened + desilenced 450ms, NOT re-cut) — **40.455s, 1080x1920, 25fps**.
Comp `KaspaHateBottomSignal` runs at **30fps**, `durationInFrames = 1213` (40.433s, just inside the
clip so there is no black tail frame).

Measured base geometry (row-gradient scan at t=1/8/16/24/32/39s, all six agree): **seam y=853**
(screen-share above, webcam below). Caption band centre **y=905** — below the seam, over the green
backdrop, above his hairline (measured hair top y~980-1000). So captions NEVER sit on content-zone
b-roll (which covers 0..853) and never over his eyes.

## Shot map of the base (MEASURED this build, and it changed the plan)

Frame-diff of the base content zone vs t=14.4s: **213** at t=0.2 and t=0.6, **~1.5** at t=0.9 and at
every later sample (14.9 / 24.5 / 25.0 / 34.0 / 40.2).

- **0.00 - ~0.80s = a DIFFERENT screen-share**: an X/Twitter timeline (a Watcher.Guru post), left over
  from the tighten keep-span `[652.86, 653.66]`. Off message, and it hard-cuts at ~0.80s.
- **~0.80 - 40.46s = ONE static slide**: "Three Paths for Iran, Bitcoin/Kaspa Scenarios", three
  scenario cards each printing a KASPA price ($0.50 / $0.10 / $2.40). That is the only other shot in
  the clip.

Consequence: the HOOK full-screen starts at **tIn 0.00** (not 1.60 as first drafted) so the X page and
its cut are never on screen, and the base is revealed at **2.90 exactly on "down at two cents"** — the
slide's own KASPA **$0.10** card lands as the receipt for the question he is answering. That also makes
the long base stretches genuinely valuable rather than filler.

## Coverage budget (canonical: `video-creation/SKILL.md` "B-roll coverage budget (HALVED 2026-07-14)")

| | seconds | % | target / band |
|---|---|---|---|
| generated b-roll | **13.42** | **33.2%** | ~30%, band 25-35 |
| BASE showing | **27.04** | **66.8%** | ~70%, band 65-75 |

- **5 distinct images, zero reuse** (a 40s clip; the ~6-8 image reference is for ~75s).
- **Full-screen: 2** (hook + climax). Cap 1-3 is FIRM. They are **29.30s** apart, so there is no
  full-screen -> tiny-gap -> full-screen base flash anywhere.
- Smallest gap between ANY two b-roll beats: **2.80s** (>= the 1.5s rule).
- Longest base stretch: **8.70s** (2.90 -> 11.60) — deliberate, it is the "$0.10 Kaspa" slide reveal;
  a code-drawn badge (not b-roll) carries the visual beat inside it.

## Reference-image gate (MANDATORY — named project = **Kaspa**)

`ls schedule-tweets/images/reference/` run LIVE this build. Present: `DogInMe.png`, `ElizaOS-ai16z-2.png`,
`ElizaOS-ai16z.webp`, `LAB.png`, `bittensor-tao.png`, `bobo.png`, `carousels`, `housecoin.webp`,
`kappy.png`, **`kaspa-logo.png`**, `kasy.png`, `kroak.png`, `linea.png`, `michael-saylor.png`,
`nacho.jpg`, `slippy.png`, `toshi.png`, `troll.png`, `velvet.png`, `what-if.jpg`.

- **`kaspa-logo.png` was ATTACHED as the reference** on all three Kaspa-coin spotlight images (cover,
  hook, climax) via `gen-batch-freshchat.js` per-item `ref`.
- The two scene images that only carry a small coin describe the mark in WORDS ("a mirrored backwards
  capital K, greenish-cyan"), per `persona.json image_generation.kaspa_logo_reference`: do NOT attach
  the standalone coin to a complex multi-element scene, it eats the scene.
- Every Kaspa coin: **backwards-K (mirrored capital K), greenish-cyan / teal. Never gold, never a
  forward K** (`persona.json image_generation.kaspa_coin`). Verified on every rendered frame.
- The clip ALSO carries the real branding pixel-perfect: `kaspa-logo.png` is composited as the
  persistent top-left corner watermark, so no frame depends on a model-drawn logo.

## Beats (as shipped)

| # | t in -> t out | dur | mode | spoken line | visual | file | ref |
|---|---|---|---|---|---|---|---|
| — | frame 0 | 1 frame | COVER | (thumbnail) | Kaspa coin buried under a swarm of blank red comment bubbles; title + chip CODE-drawn on top, never baked into the art | `thumbnail-pm3.png` | kaspa-logo.png |
| 1 | 0.00 -> 2.90 | 2.90 | **FULL** | "i get a lot of people asking if kaspa's gonna go" | HOOK. Kaspa coin sinking through cold dark water, red descending arrow behind it. Also hides the X-page shot + its cut | `broll-pm3-two-cents.png` | kaspa-logo.png |
| — | 2.90 -> 11.60 | 8.70 | **BASE** | "down at two cents and all this stuff like that. i do wanna say that when i make kaspa videos, i get a lot of content" | REVEAL on "two cents": the slide's KASPA $0.10 card is the receipt. Badge A rides here | — | — |
| 2 | 11.60 -> 14.86 | 3.26 | CONTENT | "a lot of comments, i get a lot of comments from people that are negative" | wall of blank red comment bubbles + thumbs-down, one small teal Kaspa coin nearly swallowed | `broll-pm3-negative-comments.png` | words only |
| — | 14.86 -> 19.54 | 4.68 | **BASE** | "a year ago, let's say i would hardly get any negative comments about kaspa" | deliberate: the CONTRAST line is carried on his face, nothing over it | — | — |
| 3 | 19.54 -> 21.95 | 2.41 | CONTENT | "and now it's like three out of 10 comments on my videos" | THE TITLE STAT: exactly ten bubbles, exactly three glowing red, seven dead grey | `broll-pm3-three-of-ten.png` | words only |
| — | 21.95 -> 27.10 | 5.15 | **BASE** | "are like negative. or maybe more, i don't know. so it just makes me think" | deliberate base. Badge B rides here | — | — |
| 4 | 27.10 -> 29.40 | 2.30 | CONTENT | "that there's that much hate that's being spread around" | faceless black silhouette crowd radiating colliding red hate waves, one distant teal glow | `broll-pm3-hate-spread.png` | words only |
| — | 29.40 -> 32.20 | 2.80 | **BASE** | "when it gets to that point and it gets to that low" | deliberate base; the riser builds under it | — | — |
| 5 | 32.20 -> 34.75 | 2.55 | **FULL** | "things are gonna start flying soon" | CLIMAX. Kaspa coin blasting up out of a cracked dark pit, teal shockwave tearing the red storm apart | `broll-pm3-flying-soon.png` | kaspa-logo.png |
| — | 34.75 -> 40.46 | 5.70 | **BASE** | "you know, when a project gets that much hate, it's like something's gotta change really soon" | the punchline lands on his face. Badge C rides here | — | — |

**Asset reconciliation (zero orphans):** 5 plan beats = 5 comp `staticFile` b-roll refs = 5 files on
disk in `render-assets/`; 1 cover = 1 ref = 1 file. `md5sum` of all 6 generated PNGs: all distinct
(no mis-capture / duplicate). The finalized-short gate re-checks both directions and passes.

**Asset edit:** `broll-pm3-three-of-ten.png` was REFRAMED after a QA chunk render (not regenerated):
the source was 3:2, and `_kit.BrollLayer`'s Ken Burns push (scale 1.00 -> 1.07) cropped the outer
bubbles so "exactly ten" stopped reading. It was recomposited onto a canvas at the content-zone aspect
(1536x1213) with the grid inset by 1/1.07 over a blurred backdrop, so all ten bubbles survive the full
Ken Burns. Same filename, same beat mapping.

## Code-drawn overlays (NOT b-roll — they never blanket the content zone)

All three sit **inside BASE stretches**, are **time-disjoint**, and share ONE vertical band (centre
y=300, box ~185-415) so they can never collide with each other, with the captions (y=905), with the
corner watermark (top-left, y 28-140), or with the frame-0 cover (1 frame; earliest badge tIn 4.60).
Each states something the CAPTIONS DO NOT.

| badge | tIn -> tOut | big | sub | colour | rides base gap |
|---|---|---|---|---|---|
| A | 4.60 -> 7.30 | `$0.02?` | THE QUESTION I KEEP GETTING | red `#ff5252` | 2.90-11.60 |
| B | 23.60 -> 26.30 | `30%+` | OF EVERY COMMENT, NEGATIVE | red `#ff5252` | 21.95-27.10 |
| C | 36.30 -> 39.20 | `PEAK HATE` | IS WHERE THE TURN STARTS | teal `#00e5ff` | 34.75-40.46 |

Persistent: `logo-kaspa.png` corner watermark (the REAL Kaspa reference asset), z above the frame-0
cover — the watermark is the only graphic SKILL rule 3 permits over the thumbnail.

## SFX (from `video-creation/assets/sfx/`, copied into `render-assets/sfx/`)

10 events, 7 distinct files, max vol 0.42. Whoosh on the thumbnail cut + every b-roll transition;
impacts on the two reveals; a riser builds INTO the climax boom. The closing sting is deliberately
quiet (documented "sting masks the punchline" defect) and the whole mix is whisper-verified.

| t | file | vol | why |
|---|---|---|---|
| 0.00 | `sfx/Cinematic Whoosh 02.wav` | 0.42 | frame-0 cover cut straight into the HOOK full-screen |
| 2.90 | `sfx/transition_rapid_whoosh.mp3` | 0.34 | HOOK full -> base REVEAL (the Kaspa $0.10 slide) |
| 3.60 | `sfx/Impacts/Kick_Impact_01.wav` | 0.30 | "two cents" lands |
| 11.60 | `sfx/transition_rapid_whoosh.mp3` | 0.30 | base -> negative-comments zone |
| 19.54 | `sfx/transition_rapid_whoosh.mp3` | 0.30 | base -> three-out-of-ten zone |
| 20.34 | `sfx/Impacts/Impact_3.wav` | 0.36 | "three out of 10" (the title-stat reveal) |
| 27.10 | `sfx/transition_rapid_whoosh.mp3` | 0.28 | base -> hate-spread zone |
| 30.10 | `sfx/risers/Tension_Rise_Logo_Reveal_1.wav` | 0.26 | riser builds INTO the climax |
| 32.20 | `sfx/Boom - Big Reveal.wav` | 0.42 | CLIMAX full-screen hard cut |
| 39.30 | `sfx/Impacts/card-impact-hit01-3-short.wav` | 0.16 | "change really soon" button (quiet on purpose) |

**Mask check (SKILL QA item 7):** the final MIX transcribes every line, including the closing
punchline, in full. The one line that read differently off the render ("and it gets to that low") was
A/B tested: the SAME 4.6s window transcribes IDENTICALLY with the riser at 0.26 and with NO riser at
all, so it is source ambiguity in a mumbled phrase, not masking. No cue volume was changed.

## Caption corrections (delegation MANDATORY)

Built with the canonical skill:
`python video-creation/skills/captions/build_captions.py --words whisper-words.json --style montserrat --var CAPTIONS_PM3 --colorize "g=kaspa,kaspa's y=three,10,two,cents r=negative,hate"`.

- **KASPA, never "Casper".** Whisper heard "Casper"/"Casper's" on all 3 hits (t=2.38, 7.94, 18.50); the
  builder's `CORRECTIONS` table (`casper/kasper/caspa -> kaspa`) fixed every one. Re-verified by eye on
  FINAL-RENDER frames at t=2.50 ("if **kaspa's** gonna"), t=8.50 ("**kaspa** videos, i") and t=18.60
  ("comments about **kaspa.**"), plus a mechanical scan of the caption array: 0 "casper"-style spellings.
- **No em dashes** anywhere (mechanically scanned: 0).
- Dropped the stranded leading "is" at t=0.00 (a 0.10s fragment: the tighten cut lands mid-clause), so
  caption 1 is "i get a lot" at t=0.10. Whisper's own pass on the render also drops it.
- Split "much hate, you know, it's" (legal under the preset but ~979px wide in a 980px box, so it would
  have wrapped onto the face) into "much hate," + "you know, it's".
- "point and i / get to that low" -> "point and it / gets to that low" (see the mask check above).

## Persona guards

- Conviction clip: capitulation reads as a BOTTOM SIGNAL. Nothing frames Mike's calls as mistakes.
- Kaspa is never "Casper" ($CSPR is a different chain) on screen or in any prompt.
- Every generated coin that is not Kaspa is BLANK/GENERIC; prompts explicitly forbade the Ethereum
  diamond, the Bitcoin symbol and any other real project mark. All 6 images inspected: none present.
- Every human figure is a FACELESS silhouette (verified in `broll-pm3-hate-spread.png`).
- All 6 generated images were visually inspected before rendering. **No violations, so no remaps.**
