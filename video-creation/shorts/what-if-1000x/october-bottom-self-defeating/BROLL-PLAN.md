# BROLL-PLAN — what-if-1000x clip 3, `october-bottom-self-defeating`

**Title (open loop):** The October Bottom Defeats Itself
**Spine:** `october-bottom-self-defeating-tightened-desilenced.mp4` — 59.159 s audio / 59.12 s video,
1080x1920, 25 fps source. Copied into `render-assets/october-bottom-self-defeating.mp4`.
**Comp:** `OctoberBottomSelfDefeating` @ 30 fps, `durationInFrames = 1775` (59.1667 s). The last spoken
word "it" runs 59.00-59.18, so the comp deliberately overshoots the 59.12 s video stream by 0.047 s; the
closing FULL-screen b-roll (beat 7) covers the frame from 56.95 s to past the end, so no video-tail frame
is ever visible.
**Measured seam (screen-share / webcam divider):** y = **854** (green-screen onset scan at
t = 3/12/22/33/41/50/57 s: rows <= 853 read 0.00 green on every frame, row 854 is the first row that
reads green on every frame). Content-mode b-roll covers 0..854. Caption centre `capY = 924` (70 px below
the seam, ~200 px above his eyes, which sit at y ~1130-1180).

**Base video content zone (corrected 2026-08-03 against the finished render, was stated as Housecoin
throughout):** the screen-share CHANGES mid-clip. Roughly 0-29 s it is a CoinMarketCap **Housecoin**
page (chart + markets table) — real, on-brand crypto footage, but NOT what he is talking about (he never
says "Housecoin" here). From ~29 s to the end it is a **Coinglass "Bitcoin Monthly returns (%)" table**,
which IS exactly his argument (red/green September and August, year by year). That is why the two long
base stretches sit in the second half: the screen-share there is the receipt for the litany, so it earns
the screen. Base shows 70.3 % of the runtime, and those stretches are punctuated with **code-drawn
badges**, which do not blanket the zone, rather than with more images.

**Assembly note:** the source segments play NON-chronologically (`assembly_order [1, 0]`). The
FOMO / last-chance / 90 % argument runs first (0-30 s), then the historical post-halving-year litany
(2021, 2017) that vindicates it (30-59 s). The b-roll follows that order, not the livestream's.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget (HALVED 2026-07-14)")

| | |
|---|---|
| Runtime | 59.17 s |
| B-roll on screen | **17.57 s = 29.7 %** (band 25-35 %, target ~30 %) |
| Base showing | **41.60 s = 70.3 %** |
| Distinct images | **7** (one per beat, zero reuse) |
| Full-screen moments | **3** (hook, the last-chance turn, the climax) — at the FIRM 1-3 cap, not over |
| Largest base gap | 13.55 s (43.40 -> 56.95), the rapid-fire 2021/2017 litany, carried by badges C + D |

## Beat sheet (mode `base` = deliberate NO-image beat, screen-share + webcam show)

| # | Window (s) | Mode | Spoken line | Visual | Reference |
|---|---|---|---|---|---|
| — | 0.000-0.033 | thumb | (frame 0 only) | Designed cover: code-drawn title "90% SAY THE / BOTTOM IS / OCTOBER" + chip "SO IT PROBABLY ISN'T" over `thumbnail-obsd.png` | n/a |
| — | 0.033-1.25 | **base** | "i keep saying there's going to" | Cover hands straight off to Mike + the live screen-share (SKILL rule 5: base-first from frame 1) | n/a |
| 1 | 1.25-3.85 | **full** | "be an enormous amount of people that are going to be buying in in October" | HOOK: an enormous crowd of faceless silhouettes surging toward a colossal glowing calendar monolith, one square burning amber | none (no named project) |
| — | 3.85-9.25 | **base** | "just because they think that's going to be when the bottom is" | His delivery + the screen-share; deliberate gap | n/a |
| 2 | 9.25-11.85 | content | "and then when they see those green candles and they're going to get scared that they missed the bottom" | A towering wall of neon-green candlesticks rocketing up, a huddle of faceless silhouettes below staring up in panic | none |
| — | 11.85-14.60 | **base** | "they're going to start, you know, just" | n/a | n/a |
| 3 | 14.60-17.15 | content | "buying in out of FOMO ... they're going to push some really green candles" | Stampede of faceless silhouettes charging through a glowing green doorway into a neon market hall, motion-blur streaks | none |
| — | 17.15-22.55 | **base** | "you know in October and it may even start September" | Deliberate gap; his cadence carries it | n/a |
| 4 | 22.55-25.15 | **full** | "so right now this may be your last chance" | THE TURN: a colossal gate closing on a narrowing blade of teal light, one lone silhouette stepping through, green candle pillars beyond | none |
| — | 25.15-26.95 | **base** | "right, because if 90%" | n/a | n/a |
| 5 | 26.95-29.45 | content | "of people believe the bottom is in October, it's probably not going to be October" | A vast crowd of faceless silhouettes all pointing at ONE burning square on a dark calendar wall while a single teal-lit silhouette faces the other way | none |
| — | 29.45-40.90 | **base (11.45 s, deliberate)** | "remember what happened last year / September is always red in the post-halving year / so I'm going to sell" | Screen-share + webcam. Badges **A** (31.00-33.80) and **B** (35.30-38.40) carry it; no image blankets the zone | n/a |
| 6 | 40.90-43.40 | content | "everybody turns August red and then September turn green" | THE FLIP: two enormous calendar pages swapping in mid-air, the red one cracking apart and falling, the green one rising, embers and autumn leaves | none |
| — | 43.40-56.95 | **base (13.55 s, deliberate)** | "like in 2021 we had a red September, a green August / 2017 red September green August / everybody was expecting a red September" | The rapid-fire litany is the performance; badges **C** (45.60-48.60) and **D** (50.60-53.40) carry it, and the riser starts under it at 55.20 | n/a |
| 7 | 56.95-59.30* | **full** | "because it'll happen every single time. But they flipped it" | CLIMAX: one colossal neon-green candlestick erupting up through a shattering wall of red candlesticks, shards flying, faceless silhouettes below thrown back | none |

\* `tOut` deliberately runs past the 59.1667 s end of the comp so the `BrollLayer` 0.12 s fade-out never
ghosts the art back to base on the last rendered frame, AND so the 0.047 s of comp that outlives the
video stream is fully covered. Visible = 2.22 s.

## Reference-image gate (MANDATORY)

`ls schedule-tweets/images/reference/` run LIVE 2026-08-03: `DogInMe.png, ElizaOS-ai16z-2.png,
ElizaOS-ai16z.webp, LAB.png, bittensor-tao.png, bobo.png, carousels, ethereum-eth.png, housecoin.webp,
kappy.png, kaspa-logo.png, kasy.png, kroak.png, linea.png, michael-saylor.png, nacho.jpg, slippy.png,
toshi.png, troll.png, velvet.png, what-if.jpg`.

**This clip names NO project, coin or ticker.** Every word of the transcript was checked: the only proper
nouns are month names (October, September, August) and years (2021, 2017). So **no beat is
reference-gated**, and no beat may carry invented branding. Every coin/candle rendered in the b-roll is
generic: **blank, symbol-free** shapes; every human figure is a **faceless silhouette**. (The Housecoin
CMC page visible in the base video is the livestream's own screen-share, not b-roll, so it is not a
reference-gate subject.)

## Badges (code-drawn, content zone, over BASE only)

Every window sits inside a base stretch with no b-roll running, and **no two badges share a time window**
(A ends 33.80 < B 35.30; B ends 38.40 < C 45.60; C ends 48.60 < D 50.60), so a collision is impossible in
time, whatever the bands are.

**Band geometry, MEASURED on the finished render 2026-08-03** (the planned "y ~200-400 / ~520-720" was
wrong: `Badge.top` is the box CENTRE, not its top edge, and a `line1` that wraps to two lines makes the
box much taller than planned):

| | `top` | measured box | vs seam 854 | vs caption glyph tops (~892-904) |
|---|---|---|---|---|
| A | 300 | ~150-450 | clear | clear |
| B | 620 | ~456-784 | clear | ~108 px above |
| C | 300 | ~124-476 | clear | clear |
| D | 620 | ~362-878 (`EVERY CYCLE` wraps to 2 lines) | crosses by ~24 px | ~23 px above, **no overlap** |

Badge D is the tight one: it dips just past the seam into the top of the webcam zone and clears the
caption by ~23 px. Verified frame-accurate on the render (frame 1560, t = 52.0 s) — the green border and
the caption stroke do not touch. If this badge is ever re-authored, shorten `line1` or raise `top`.

| | Window | Band | Text | Why it is not a caption repeat |
|---|---|---|---|---|
| A | 31.00-33.80 | 300 | LAST YEAR / SAME SCRIPT / "EVERYBODY KNEW THE RULE" | names the precedent he is about to prove |
| B | 35.30-38.40 | 620 | THE RULE / SEPTEMBER RED / "POST-HALVING GOSPEL" | states the crowd's belief as a system |
| C | 45.60-48.60 | 300 | 2021 AND 2017 / SAME PATTERN / "RED SEPTEMBER, GREEN AUGUST" | pins the litany to the two years |
| D | 50.60-53.40 | 620 | EVERY CYCLE / THE SAME BET / "SO EVERYBODY CROWDED IT" | explains WHY a known pattern breaks |

## SFX (`video-creation/assets/sfx/`, >= 2 required)

| t | file | why |
|---|---|---|
| 0.03 | Cinematic Whoosh 02.wav | frame-0 thumbnail cut |
| 1.22 | transition_rapid_whoosh.mp3 | cut into the hook full-screen |
| 9.22 | Cinematic Whoosh 06.wav | cut into the green-candles cutaway |
| 14.57 | transition_rapid_whoosh.mp3 | cut into the FOMO stampede |
| 22.52 | Cinematic Whoosh 02.wav | cut into the last-chance full-screen (the turn) |
| 26.92 | Impacts/Impact_2.wav | impact under the 90 % cutaway |
| 30.98 | DING.mp3 | badge A reveal |
| 35.28 | ding/ding.mp3 | badge B reveal |
| 40.87 | Cinematic Whoosh 06.wav | cut into the calendar flip |
| 45.58 | TING SOUND EFFECT.mp3 | badge C reveal (the 2021/2017 receipt) |
| 52.88 | risers/Tension_Rise_Logo_Reveal_3.wav | riser building INTO the climax. Its RMS envelope was measured: it peaks at ~4.05 s in, so it starts at 52.88 and the peak lands exactly on the 56.93 impact (`dur 4.10` truncates the decay tail under that impact) |
| 56.93 | Impacts/Impact_2.wav | climax impact on "but they flipped it" |

All volumes are whisper-verified against the FINAL mix (SKILL item 7): any cue that makes a line
transcribe worse off the render than off the spine gets swept down until the line comes back.

**Verification actually run 2026-08-03 (medium model, identical settings on both):** the render and the
bare spine transcribe IDENTICALLY except two ASR coin-flips — `it'll happen` -> `it happened` (56.6-57.1)
and `turn green` -> `turned green` (~44.9). Both were chased down and **neither is SFX-masking**: an
offline reproduction of the exact Remotion mix was swept with the riser at 0.16 / 0.10 / 0.00 and the
climax impact at 0.24 / 0.00, and `it happened` persists even with BOTH cues fully muted, i.e. it is a
contraction ambiguity in the source audio, not a sting on top of the line. (`post-having` for
"post-halving" at 35.9 likewise comes off the BARE SPINE, so it is a source mishear, not the badge-B ding;
the caption already reads `post-halving`.) No volume change was warranted, so none was made.
All 12 cues were also confirmed audibly PRESENT in the render by residual analysis (render minus
gain-matched spine): peaks -33 to -21 dBFS, sitting 2-14 dB under the VO.

## Caption notes (canonical skill: `skills/captions/captions.md`, `montserrat` preset)

Built with `build_captions.py --style montserrat --var CAPTIONS_OBSD`
`--colorize "g=october y=90%,2021,2017 gr=green r=red,scared,fomo"`.

- `post -halving` -> **`post-halving`** applied automatically (hyphen-continuation merge + `CORRECTIONS`).
- The batch's `stt_garble_flags` listed `~2334.9 "I'm sell" = "I'll sell"` and `~2609.1 "phone moment" =
  "FOMO moment"`. **Neither garble exists in this clip's medium-model word timings** (they came off the
  base-model source transcript): the spine reads "so I'm going to sell" and "out of FOMO". Verified by a
  second, independent medium-model pass on the isolated 36.6-39.8 s slice, which also returns "So I'm
  going to sell". Nothing to fix, so nothing was invented.
- ONE manual edit: the builder emitted a 0.18 s orphan caption `it` at 59.00. Merged into the previous
  chunk as `but they <y>flipped it</y>` at 57.96 so the hard-out punchline lands as one readable line.
- No em dashes anywhere on screen.

## Persona guards applied

- Conviction and vindication: the crowd front-runs and gets flipped; Mike is the one who called it. No
  beat frames any trade or call of his as a mistake.
- The FOMO buyers and the "sell before red September" crowd are the OPPOSITION, never Mike.
- No real project marks: no Bitcoin glyph, no Ethereum diamond, no ticker text, no invented logos. Coins
  and candles are generic shapes.
- No real-person faces: every figure is a faceless silhouette.
- Hard-out ending kept (no CTA) per house strategy.
