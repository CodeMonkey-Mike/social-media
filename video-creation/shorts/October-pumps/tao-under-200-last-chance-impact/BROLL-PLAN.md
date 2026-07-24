# BROLL-PLAN — tao-under-200-last-chance-impact (variant: impact)

Batch `October-pumps`, clip #8. Base = `tao-under-200-last-chance-impact-final.mp4`
(1080x1920, 25 fps, **21.92 s**, output of raw cut -> tighten -> desilence -> filler removal; FINAL, not re-cut).
Comp runs at 30 fps / **657 frames** (21.90 s, just inside the clip so there is no black tail frame).

Impact sibling of clip #3 `tao-under-200-last-chance`. **Every image in this plan is generated fresh
into THIS clip's own `render-assets/`**; nothing is shared with clip #3 (repo rule: every image is unique).

**Measured geometry:** the base is ALREADY composited vertical. Row-mean gradient scan at
t = 0.5 / 3 / 6 / 9 / 12 / 15 / 18 / 21 s puts the hard screen-share/webcam divider on the same row on
all eight frames: **y = 853/854** (gradient 178-223 grey levels, next-strongest edge is 27). Content-zone
b-roll therefore covers 0..854. Caption centre at **y = 890** (below the seam, above Mike's hairline
~y1030, nowhere near his eyes ~y1480).

## Screen-share content map (frame-accurate, decoded at 25 fps)

| span | what is on screen |
|---|---|
| **0.00 - 21.92** | the **CoinMarketCap "Bittensor TAO" page**: the 24h price line pinned at **199.7**, ceiling label 202.0, market cap **$2.22B**, FDV $4.19B, max supply **21M TAO**, rank **#34**, and the "Bittensor Markets" table (Binance TAO/USDT $199.67, Coinbase TAO/USD $199.85, Upbit TAO/KRW $197.03). From ~20.4 s the cursor hovers the chart and a tooltip reads 07/20/2026 $193.43. |

There is **no dead window and nothing off-message anywhere in this clip** — the content zone is the
literal receipt of the sentence he is speaking ("is TAO under $200"): the sub-$200 print is on screen
the entire time. That is why this build sits at the LOW-MIDDLE of the b-roll band and leaves long,
deliberate BASE stretches: covering that chart would be throwing away the proof.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget", HALVED 2026-07-14)

| metric | value | target |
|---|---|---|
| b-roll covered | **7.36 s / 21.90 s = 33.6 %** | ~30 % (band 25-35 %) OK |
| base showing | **14.54 s = 66.4 %** | ~70 % (band 65-75 %) OK |
| distinct images | **4** (+1 thumbnail background) | output of the budget, ~1 per 5.5 s, avg 1.84 s per beat |
| full-screen beats | **2** (hook / the "don't be that guy" close) | 1-2 at this length, FIRM, OK |
| max base gap | 5.54 s (13.60 - 19.14, carried by badge B + the on-message CMC page) | deliberate |
| reuse within clip | none, every beat has its own asset | OK |

## Beats

| # | t_in | t_out | dur | mode | spoken line | visual | asset |
|---|---|---|---|---|---|---|---|
| - | 0.00 | 1.30 | 1.30 | **BASE** | "is TAO under" | open on Mike + the CMC page with the 199.7 price line (frame-0 thumb is ONE frame, base from frame 1) | - |
| 1 | 1.30 | 3.20 | 1.90 | **full** | "**$200.** imagine that. imagine the five" (HOOK) | black void, a colossal obsidian monolith coin bearing the real TAO tau mark, hanging just BELOW a blazing horizontal neon-teal ceiling line that spans the frame; one tiny faceless silhouette at the bottom looking up | `broll-taoi-hook-200.png` **[TAO reference]** |
| - | 3.20 | 8.42 | 5.22 | **BASE** | "years you were thinking back to when TAO was under $200 and you're saying, you're glad that you" | the CMC chart with its Jul '23 to Jul '26 axis IS the five-years visual; + BADGE `BITTENSOR / TAO` 5.00-7.20 | - |
| 2 | 8.42 | 9.82 | 1.40 | content | "**bought TAO under $200.**" | dawn summit: a lone faceless silhouette stands on a ridge of glowing green glass steps, turned back and down toward a tiny distant teal marker far below in the valley, the tau mark glowing on that marker | `broll-taoi-glad-bought.png` **[TAO reference]** |
| - | 9.82 | 12.30 | 2.48 | **BASE** | "don't be that guy who says, damn, i" | the price line at 199.7 is the punchline behind the line; SFX `sudden-shock` lands on "damn" | - |
| 3 | 12.30 | 13.60 | 1.30 | content | "**should have bought when i saw it** under $200." | dark empty room, a faceless silhouette slumped on the floor with its head in its hands, behind it a floor-to-ceiling window where an enormous green line rockets off the top of the frame, a dim tau mark etched on the glass | `broll-taoi-regret.png` **[TAO reference]** |
| - | 13.60 | 19.14 | 5.54 | **BASE** | "under $200. CodeMonkey Mike was talking about it, but i just didn't pay attention. yeah, that's not too good." | the CMC page (the receipt he was talking about); + BADGE `HE SAID IT / ON STREAM` 15.20-17.60; the riser starts at 14.14 and builds through this whole stretch | - |
| 4 | 19.14 | 21.90 | 2.76 | **full** | "**don't be that guy. nobody wants to be that guy.**" (CLIMAX + close) | rain-slick empty platform in heavy fog, one small faceless silhouette left standing alone as a colossal wall of green light streaks away into the distance carrying a luminous tau mark, the figure's shadow stretched long behind it | `broll-taoi-left-behind.png` **[TAO reference]** |

**Full-screen adjacency (SKILL production rule 4):** the 2 full-screens are 15.94 s apart, so no
full-to-full flash exists. Every b-roll-to-base gap is >= 2.48 s, so there is no sub-1.5 s base flash
anywhere. The clip ends ON the closing full-screen (no 0.x s base flash at the tail), which is also the
loop frame.

## Frame-0 thumbnail

`thumbnail-taoi.png` = generated background (a colossal luminous tau monolith rising out of black fog at
the BOTTOM of the frame, a hard neon-teal threshold line beneath it, faceless silhouettes at its base,
upper half deliberately empty dark sky) with the hook title drawn in CODE on top, never baked into the art:

- title `TAO UNDER $200` / `DON'T BE` / `THAT GUY`, chip `IMAGINE FIVE YEARS FROM NOW` (neon green).
- ONE frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`). Base video from frame 1.
- Nothing else may start under it: the earliest badge `tIn` is 5.00 s, the earliest b-roll `tIn` is 1.30 s.
- No em dashes anywhere on screen. No `@mikeneder` anywhere.

## Overlays / badges (never collide in time OR space)

Code-drawn badges, both at `top: 620` (content zone) while captions live at `y 890`. Each states
something the captions do NOT, and each sits over a BASE stretch, never over a b-roll beat.

| tIn | tOut | colour | content | sits over |
|---|---|---|---|---|
| 5.00 | 7.20 | teal | `BITTENSOR` / `TAO` / `RANK #34, 21M MAX SUPPLY` | BASE 3.20-8.42 |
| 15.20 | 17.60 | green | `HE SAID IT` / `LIVE` / `RECEIPTS, NOT HINDSIGHT` | BASE 13.60-19.14 |

**Badge Y position was MEASURED on the draft render, not assumed.** A `Badge` is `left:50%` +
`translate(-50%)`, so its shrink-to-fit width is capped at 1080-540 = 540 px, every line wraps inside
~436 px of content, and the rendered box is ~306 px tall. At the historical `top: 300` that box lands on
y150-460 and COVERS THE PRICE CHART (y~120-390), which is this clip's entire receipt. Moved to
`top: 620` => box y467-773: below the chart, above the seam (854), 65 px clear of the caption text
top (~838). Chart stays visible, nothing collides.

Time gap between them: 8.00 s, so they are never on screen together. Badge A ends 1.22 s before beat 2
starts; badge B starts 1.60 s after beat 3 ends and ends 1.54 s before beat 4 starts, so neither ever
shares a frame with a b-roll image. Both start long after the frame-0 thumb.

## SFX (from `video-creation/assets/sfx/`, all under the VO)

Cue = the file's own MEASURED attack/peak landing on the beat, not the file start. Envelopes measured
on this machine for THIS build (20 ms RMS for attack/peak, 0.2 s RMS for the riser crest):
`transition_rapid_whoosh` peak 0.18 s, `Cinematic Whoosh 02` peak 0.86 s, `Cinematic Whoosh 06` peak
0.58 s, `Cash Register` attack 0.26 s, `ding/sudden-shock` attack 0.18 s, `Impacts/Impact_Hit_01-2`
attack 0.06 s, `Impacts/Impact_3` attack 0.22 s, `Boom - Big Reveal` attack 0.02 s,
`risers/Edgy_Riser` crest 5.00 s. Quiet FILES (Whoosh 06 -16.7 dB RMS, Cash Register -16.2 dB vs Boom
at -0.0 dB) get a higher `vol` so they are actually audible under the VO.

| lands at | fires at | file | vol | why |
|---|---|---|---|---|
| 0.18 | 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.46 | the frame-0 thumbnail cut |
| 1.30 | 0.44 | `sfx/Cinematic Whoosh 02.wav` | 0.50 | sweeps INTO the HOOK full-screen |
| 1.30 | 1.24 | `sfx/Impacts/Impact_Hit_01-2.wav` | 0.44 | the hit on **"$200"**, the first of the two weighted beats |
| 3.20 | 3.02 | `sfx/transition_rapid_whoosh.mp3` | 0.36 | the cut back out of the hook full-screen |
| 8.42 | 7.84 | `sfx/Cinematic Whoosh 06.wav` | 0.78 | into the "glad that you bought" cutaway |
| 9.42 | 9.16 | `sfx/Cash Register.mp3` | 0.72 | kaching ATTACKS on the second **"$200"** (the payoff) |
| 11.30 | 11.12 | `sfx/ding/sudden-shock.mp3` | 0.40 | lands on "**damn**" |
| 12.30 | 12.12 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | into the regret cutaway |
| 19.14 | 14.14 | `sfx/risers/Edgy_Riser.wav` | 0.26 | riser BUILDS INTO the close (crest 19.14) |
| 19.14 | 19.12 | `sfx/Boom - Big Reveal.wav` | 0.50 | the biggest hit of the short, on "**don't be that guy**" |
| 21.36 | 21.14 | `sfx/Impacts/Impact_3.wav` | 0.42 | the button on "**be that guy.**" |

11 events / 9 distinct files. Whoosh on the thumbnail cut and on every b-roll transition, one riser
building into the closing impact, impacts reserved for the two weighted beats ("$200" and "don't be
that guy") plus the final button.

## Reference-image gate

Named project/coin in this clip: **TAO (Bittensor)**. Live `ls schedule-tweets/images/reference/` run
during THIS build: `DogInMe.png, ElizaOS-ai16z-2.png, ElizaOS-ai16z.webp, LAB.png, bittensor-tao.png,
bobo.png, carousels, housecoin.webp, kappy.png, kaspa-logo.png, kasy.png, kroak.png, linea.png,
michael-saylor.png, nacho.jpg, slippy.png, toshi.png, troll.png, velvet.png`.

**`bittensor-tao.png` EXISTS**, so it is MANDATORY: **all 5 images (4 b-roll beats + the thumbnail
background) are generated WITH `schedule-tweets/images/reference/bittensor-tao.png` uploaded as the
reference.** The tau mark is never hand-drawn or invented. The job file is written as a REAL file (not
via `node -e` inside a quoted shell string, which ate the Windows backslashes on an earlier clip in this
batch and silently dropped the upload) and the ref path is verified on disk before the run; a TEXT reply
from ChatGPT instead of an image means the reference did not upload and the run is fixed, never continued.

## Final-render QA (all run on `remotion/out/October-pumps/8-tao-under-200-last-chance-impact.mp4`)

- **Finalized-short gate:** PASS (thumbnail `thumbnail-taoi.png`, 4 b-roll assets, 10 sfx refs, 15
  staticFile refs all present in the public dir).
- **Structure/collision check (code):** 4 b-roll beats, 33.6 % coverage, 2 full-screens, 2 badges,
  11 SFX. No badge/badge time overlap, no badge over a b-roll beat, nothing starts before the frame-0
  thumb, no b-roll overlap, no sub-1.5 s base flash, no tail flash. PASS.
- **Frame-0 thumbnail is ONE frame:** mean |f1 - f0| = 110.7 grey levels while |f2 - f1| = 0.9 and
  |f3 - f2| = 2.0, i.e. the cover is replaced immediately at frame 1 and the base plays from there.
- **Overlay frame checks:** frames pulled on the final render at every b-roll tIn/tOut and every badge
  tIn/tOut and visually inspected. No two graphics ever share a region. Badges sit at y467-790,
  captions at y838-942, the price chart at y120-390 stays fully visible under both badges (the badge
  Y was MEASURED and moved from 300 to 620 after the draft showed it covering the chart).
- **Blackdetect:** no black segment >= 0.1 s. 657 frames, 1080x1920, 30 fps, 21.95 s container.
- **Audio:** integrated **-16.6 LUFS**, true peak **-1.0 dBFS**, max sample level -1.0 dB, zero clipped
  samples.
- **SFX audibility (aligned subtraction of the source spine, lag +42.7 ms, gain 0.998, residual floor
  -36.0 dB):** all 11 cues measure **+8.2 to +24.8 dB over the residual floor** at their LANDING time,
  i.e. every one is actually audible under the VO.
- **Whisper-verify (independent second pass on the shipped render):** 0.954 word similarity vs the
  caption text. The ONLY 3 diffs are Whisper hearing the ticker as "tau" where the caption correctly
  reads **tao** (the documented ticker fix). Caption onset drift over 25 anchored rows: median +0.04 s,
  p05 +0.02 s, p95 +0.10 s, max +0.10 s, and **0 captions appear more than 0.35 s after their word**.
- **TICKER RULE:** zero occurrences of "towel" or "tau" in the caption track; 3 rows read `tao`
  (0.00 / 4.56 / 8.42), all with the teal accent.
- **Asset reconciliation:** 15 comp `staticFile()` refs, **0 missing on disk**, 15 files in the public
  dir, **0 orphans** in either direction. `md5sum` over all 5 pngs: **0 duplicates**.
- **Persona inspection:** all 5 images inspected. The tau mark is the real Bittensor glyph from the
  reference in every one; no other cryptocurrency logo or mark, no real-person face, every human is a
  faceless silhouette, no readable lettering beyond the tau.
- **On-screen text:** zero em/en dashes in any title/chip/badge/caption string; no `@mikeneder`.

## Persona constraints baked into every prompt

The tau mark from the reference is the ONLY marking permitted anywhere in the art. No other
cryptocurrency logo or symbol (no Bitcoin, no Ethereum diamond), no real-person faces, every human is a
faceless silhouette, and no lettering / words / numbers anywhere (all on-screen text is code-drawn).
Every generated image is visually inspected before the render.
