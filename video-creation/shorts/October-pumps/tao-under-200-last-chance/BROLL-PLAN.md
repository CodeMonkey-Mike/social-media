# BROLL-PLAN — tao-under-200-last-chance (variant: full)

Batch `October-pumps`, clip #3. Base = `tao-under-200-last-chance-final.mp4`
(1080x1920, 25 fps, **29.56 s**, output of raw cut -> Phase 5 tighten -> 5B desilence -> 5C filler
removal; FINAL, not re-cut). Comp runs at 30 fps / **886 frames** (29.533 s, just inside the clip so
there is no black tail frame).

**Measured geometry:** the base is ALREADY composited vertical. Row-mean gradient scan at
t = 1 / 5 / 10 / 15 / 20 / 25 / 29 s puts the hard screen-share/webcam divider on the same row on all
seven frames: **y = 853/854** (gradient 141-217 grey levels, next-strongest row only 20-40).
Content-zone b-roll therefore covers 0..854. Caption centre at **y = 890** (below the seam, above
Mike's hairline ~y1030, nowhere near his eyes ~y1400).

## Screen-share content map (frame-accurate, decoded at 4-10 fps around every transition)

| span | what is on screen |
|---|---|
| **0.00 - 4.40** | **OFF-MESSAGE: the CoinMarketCap page for MONAD (MON)**, the previous topic. Nothing to do with TAO |
| 4.40 - 6.40 | the CMC search dropdown opening over the MON page (Bittensor is one row in a long list) |
| **6.40 - 8.00** | **DEAD: white "Loading Data" / "Loading data..." page (1.60 s of nothing)** |
| **8.00 - 29.56** | **the CoinMarketCap BITTENSOR (TAO) page: price 199.73, 24h +2.42 %, market cap 2.22B, max supply 21M TAO, Bittensor Markets with TAO/USDT 199.67 on Binance.** This is THE receipt of the clip: the screen literally shows TAO under $200 while he says it |

The off-message opener and the dead loading window are covered by b-roll; the 21.6 s of live TAO-under-$200
receipt is left SHOWING on purpose. That is the deliberate base beat this clip is built around.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget", HALVED 2026-07-14)

| metric | value | target |
|---|---|---|
| b-roll covered | **9.93 s / 29.56 s = 33.6 %** | ~30 % (band 25-35 %) OK |
| base showing | **19.63 s = 66.4 %** | ~70 % (band 65-75 %) OK |
| distinct images | **5** b-roll (+1 thumbnail background) | output of the budget, ~1 per 5.9 s of runtime, avg 1.99 s per beat |
| full-screen beats | **2** (hook / climax) | 1-3 FIRM, OK |
| max base gap | 10.10 s (8.20 - 18.30), the live TAO-under-$200 CMC page + 2 badges | deliberate |
| reuse within clip | none, every beat has its own asset | OK |

## Beats

| # | t_in | t_out | dur | mode | spoken line | visual | asset |
|---|---|---|---|---|---|---|---|
| - | 0.00 | 1.60 | 1.60 | **BASE** | "you're gonna get your last chance at this point" | open on Mike + the screen-share (frame-0 thumb is ONE frame, base from frame 1) | - |
| 1 | 1.60 | 3.60 | 2.00 | **full** | "your last chance at this point **to get any of the larger cap**" (HOOK) | colossal armored vault gate grinding shut at the end of a black corridor, one narrow blade of teal-green light still spilling through, a faceless silhouette sprinting for it. Covers the OFF-MESSAGE Monad page | `broll-tao200-hook.png` |
| 2 | 3.60 | 6.40 | 2.80 | content | "to get any of the larger cap, **especially like with TAO**. you might have your last chance" | the real Bittensor TAO mark as a colossal monolith of polished dark stone with teal-green edge light on a cracked plain, faceless silhouettes at its base (**generated WITH `bittensor-tao.png`**). Butt-joined to beat 1, so it HARD-CUTS | `broll-tao200-tao-monolith.png` |
| 3 | 6.40 | 8.20 | 1.80 | content | "your last chance **over these few weeks** is TAO" | black-glass hourglass with glowing teal-green sand almost run out, the real TAO mark burning inside the falling sand (**generated WITH `bittensor-tao.png`**). Butt-joined to beat 2, HARD CUT. Covers the DEAD loading window | `broll-tao200-hourglass.png` |
| - | 8.20 | 18.30 | 10.10 | **BASE** | "is TAO **under $200**. imagine that. imagine the five years you were thinking back to when TAO was under $200 and you're saying you're glad that you bought TAO under $200." | **THE RECEIPT.** The CMC Bittensor page finishes painting at ~8.08 showing 199.73 / 2.22B mcap / TAO+USDT 199.67 and stays up for the whole imagination section. Deliberately NOT covered. Badges `5 YEARS LATER` 10.40-12.90 and `21M MAX SUPPLY` 14.60-16.90 sit over it | - |
| 4 | 18.30 | 20.00 | 1.70 | content | "**don't be that guy** who says, **damn, i should have bought** when i saw it" | faceless silhouette slumped on the floor of a dark empty apartment, head in hands, while beyond the rain-streaked window a colossal green ascending mountain of light climbs into the night with the real TAO mark burning at its peak (**generated WITH `bittensor-tao.png`**) | `broll-tao200-regret.png` |
| - | 20.00 | 27.90 | 7.90 | **BASE** | "when i saw it under $200. codemonkey mike was talking about it, but i just didn't pay attention. yeah, that's not too good." | the TAO page is still up (still under $200) while he describes missing it. Badge `FOLLOW ME` 22.60-25.00 | - |
| 5 | 27.90 | 29.53 | 1.63 | **full** | "**don't be that guy. nobody wants to be that guy.**" (CLIMAX / close) | a single faceless silhouette alone in heavy rain on an empty night street, cold white spotlight, while a vast skyline of glowing green candle towers blazes upward behind him. Runs to the last frame, so the loop-out is the image, not a mid-word face | `broll-tao200-that-guy.png` |

**Two boundary values are MEASURED, not rounded** (both defects were caught on the first full render's
boundary frames and fixed before shipping, because `BrollLayer` fades a non-adjacent beat out over
`tOut-0.12 .. tOut`):
- beat 3 `tOut` is **8.20**, not 8.00: the CMC chart does not finish painting until ~8.08 (frames at
  7.84 / 7.92 / 8.00 still read "Loading Data"), so ending at 8.00 crossfaded to a WHITE loading page.
- beat 5 `tOut` is written as **29.70** in the constants, i.e. PAST the comp's last frame (29.533), so
  no fade-out falls inside the render; a `tOut` of 29.53 dissolved the closing image back into the
  webcam over the final 4 frames. Effective on-screen coverage is still 27.90 - 29.533 = 1.63 s.

**Full-screen adjacency (SKILL production rule 4):** only 2 full-screens and they are 24.3 s apart, so
no full-to-full flash can exist. Beats 1 -> 2 and 2 -> 3 are butt-joined (gap 0.00 s) so `BrollLayer`
hard-cuts instead of fading through the base. Every other b-roll-to-base gap is >= 7.90 s, so there is
no sub-1 s base flash anywhere in the clip.

## Frame-0 thumbnail

`thumbnail-tao200.png` = generated background (the real TAO mark as a monumental glowing emblem on a
black stone pedestal with a steep green chart line sweeping past it; the upper 45 % is deliberately
empty stormy sky so the code-drawn title has clean space) with the hook title drawn in CODE on top,
never baked into the art:

- title `YOUR LAST / CHANCE AT TAO / UNDER $200`, chip `DO NOT BE THAT GUY` (neon green).
- ONE frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`). Base video from frame 1.
- Nothing else may start under it: the earliest badge `tIn` is 10.40 s, the earliest b-roll `tIn` is 1.60 s.
- No em dashes anywhere on screen; the chip reads "DO NOT BE THAT GUY", not a contraction.

## Overlays / badges (never collide in time OR space)

Code-drawn badges, all at `top: 300` (content zone) while captions live at `y 890`. Each sits over a
BASE stretch, never over a b-roll beat, and each states something the captions do NOT.

| tIn | tOut | colour | content | sits over |
|---|---|---|---|---|
| 10.40 | 12.90 | teal | `5 YEARS` / `LATER` / `REMEMBER THIS` | BASE 8.20-18.30 |
| 14.60 | 16.90 | green | `21M MAX` / `SUPPLY` / `LIKE BITCOIN` (read straight off the CMC page under it, which lists Max supply 21M TAO) | BASE 8.20-18.30 |
| 22.60 | 25.00 | yellow | `FOLLOW` / `ME` / `DO NOT MISS IT` (persona CTA: "Follow me", never a handle) | BASE 20.00-27.90 |

Time gaps between consecutive badges: 1.70 s and 5.70 s, so no two are ever on screen together. The
first badge starts 2.20 s after beat 3 ends and the last ends 2.90 s before beat 5 starts, so no badge
ever shares a frame with a b-roll image either. All start long after the frame-0 thumb.

**STRING-LENGTH BUDGET (measured, then fixed).** The shared `Badge` is absolutely positioned at
`left:50%` with no width, so its containing block is only HALF the frame (540 px) and its content box
is ~436 px. The first draft used `FROM NOW` / `MAX SUPPLY` / `THIS PRICE LOOKS INSANE` /
`SO YOU ARE NOT THAT GUY`; on the draft render all four WRAPPED and the extra line spilled outside the
rounded border. Measured safe limits, now respected by every string above: line2 or a solo line1
(82 px) <= 7 chars, line1 that has a line2 (60 px) <= 11 chars, sub (32 px + 0.12em tracking)
<= 15 chars. Re-verified on stills at frames 330 / 450 / 690: all three badges render on single lines
fully inside the box. `_kit.tsx` was deliberately NOT modified (five sibling clips were rendering
against it at the same time).

## SFX (from `video-creation/assets/sfx/`, all under the VO)

Cue = the file's own MEASURED peak/attack landing on the beat, not the file start. Envelopes measured
on this machine at 20 ms RMS: `transition_rapid_whoosh` peaks 0.18 s in, `Cinematic Whoosh 06` 0.58 s,
`Cinematic Whoosh 02` 0.86 s, `Impact_3` 0.32 s, `ding/sudden-shock` 0.34 s, `TING` 0.84 s,
`Edgy_Riser` 5.14 s, `Boom - Big Reveal` 0.04 s.

| lands at | fires at | file | vol | why |
|---|---|---|---|---|
| 0.18 | 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.46 | the frame-0 thumbnail cut |
| 1.60 | 1.02 | `sfx/Cinematic Whoosh 06.wav` | 0.80 | sweeps INTO the HOOK full-screen (quiet file, vol raised) |
| 3.60 | 3.42 | `sfx/transition_rapid_whoosh.mp3` | 0.40 | the hard cut from the hook into the TAO monolith |
| 6.40 | 5.54 | `sfx/Cinematic Whoosh 02.wav` | 0.50 | the hard cut into the hourglass beat |
| 8.36 | 8.04 | `sfx/Impacts/Impact_3.wav` | 0.46 | **IMPACT on "$200"** and on the frame the real TAO-under-$200 page is revealed |
| 18.64 | 18.30 | `sfx/ding/sudden-shock.mp3` | 0.42 | lands on "damn"; its onset doubles as the sting on the regret cutaway (18.30) |
| 21.96 | 21.12 | `sfx/TING SOUND EFFECT.mp3` | 0.48 | bell on "codemonkey mike" |
| 22.76-27.90 | 22.76 | `sfx/risers/Edgy_Riser.wav` | 0.26 | riser BUILDS INTO the climax (crest 27.90) |
| 27.94 | 27.90 | `sfx/Boom - Big Reveal.wav` | 0.52 | **weight on "don't be that guy"**, on the exact frame of the CLIMAX full-screen cut |

9 events / 8 distinct files (>= 2 required). Whoosh on the thumbnail cut and on every b-roll transition,
one riser building into the closing impact, impacts reserved for the two beats that carry the clip
(the "$200" reveal and the "don't be that guy" close).

## Reference-image gate (MANDATORY, run live during THIS build)

Named project in this clip: **Bittensor / TAO** (ticker spoken 4 times). Live `ls` of
`schedule-tweets/images/reference/` run during this build returned: DogInMe, ElizaOS-ai16z-2,
ElizaOS-ai16z, LAB, **bittensor-tao.png**, bobo, carousels, housecoin, kappy, kaspa-logo, kasy, kroak,
linea, michael-saylor, nacho, slippy, toshi, troll, velvet.

**`bittensor-tao.png` EXISTS (139x102 RGBA, the real tau mark), so every TAO beat is generated WITH it**
via the reference-capable generator (`repurpose/gen-images.js`, per-item `ref`, which carries the
2026-07-14 post-send re-baseline gate so an uploaded reference can never be captured as the render).
Reference-carrying assets: `broll-tao200-tao-monolith.png`, `broll-tao200-hourglass.png`,
`broll-tao200-regret.png`, `thumbnail-tao200.png` (4 of the 6 generated images). The tau glyph is NEVER
hand-drawn or invented. The two purely emotional beats (`broll-tao200-hook.png`, the closing vault; and
`broll-tao200-that-guy.png`, the lone figure) carry no project mark by design and were generated with
`repurpose/generate-broll-reload.js`.

The clip ALSO carries TAO's real branding through the BASE video itself: the CoinMarketCap Bittensor
page is on screen for 21.6 s of a 29.6 s short.

## Persona constraints baked into every prompt

The attached Bittensor mark is the ONLY logo allowed, and only in the four beats that upload it. No
other real cryptocurrency logo or mark (no Bitcoin symbol, no Ethereum diamond), every other coin blank
and generic, no real-person faces, crowds and figures are faceless silhouettes, and no lettering /
words / numbers anywhere in the art (all text is code-drawn). Every generated image is visually
inspected before the render.

## Final-render QA (all run on `remotion/out/October-pumps/3-tao-under-200-last-chance.mp4`)

- **Gate:** `finalized_short_gate.py` prints **PASS** (15 distinct staticFile refs, thumbnail
  `thumbnail-tao200.png`, 5 b-roll assets, 8 sfx refs, nothing missing).
- **Structure/collision check (code):** 5 b-roll beats, 33.6 % coverage, 2 full-screens (24.30 s
  apart), 3 badges, 9 SFX. No badge/badge time overlap, no badge over a b-roll beat, nothing starts
  before the frame-0 thumb, no b-roll overlap, no sub-1.5 s base flash between beats. PASS.
- **Frame-0 thumbnail is ONE frame:** mean |f1 - f0| = **104.3** grey levels while |f2 - f1| = 6.8 and
  |f3 - f2| = 7.0, i.e. the cover is replaced immediately at frame 1 and the base plays from there.
- **Overlay frame checks:** frames pulled at every b-roll `tIn`/`tOut`, every badge `tIn`/`tOut` and the
  thumb handoff, then visually inspected. No two graphics ever share a region; badges sit at y185-460,
  captions at y838-942, content-zone b-roll at y0-854.
- **SFX verified on the FINAL render** by aligned subtraction of the source spine audio (lag -42.7 ms,
  corr 0.943, gain 1.0002): all **9/9** cues measure **25.9 to 44.2 dB above the residual floor**
  (-56.9 dB), i.e. every one is genuinely audible under the VO.
- **Audio:** integrated **-16.8 LUFS**, true peak **-2.9 dBFS**, peak sample level -2.95 dB, no
  clipping. `blackdetect d=0.1` finds **no black segment**.
- **Whisper-verify (independent `small`-model pass on the shipped render):** **0.938** word similarity
  over 105 caption words. The ONLY diffs are the four intentional TAO fixes (Whisper hears "Tau",
  captions read TAO, never "towel" and never "tau"), one Whisper "as/is" variance, and the documented
  `code monkey` -> `codemonkey` brand fix. Caption onset drift over 35 anchored rows: median -0.04 s,
  p05 -0.06 s, p95 -0.02 s, max +0.00 s, and **0 captions appear more than 0.35 s after their word**.
- **Asset reconciliation:** 15 comp `staticFile()` refs, **0 missing on disk**, 15 files in
  `render-assets/`, **0 orphans** in either direction. `md5sum` over the 6 pngs: **0 duplicates**.
- **Persona inspection:** all 6 generated images inspected at full size. The Bittensor mark is the only
  logo present, no other crypto mark, no real-person face (every figure is a back-turned or faceless
  silhouette), no readable lettering or numbers in the art. **No remap was needed.**
- **On-screen text:** 46 on-screen strings scanned, **zero** em dashes, en dashes, double hyphens or
  `@` handles. The CTA badge reads "FOLLOW ME".
- Note: on beat 4 the tau glyph sits at the mountain summit, which falls just above the content-zone
  centre crop, so the mark reads on beats 2 and 3 and on the frame-0 cover; the image was still
  generated WITH the reference per the gate.
