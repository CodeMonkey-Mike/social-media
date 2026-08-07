# BROLL-PLAN — eliza / clip 3 `trading-against-ourselves` ("We're Trading Against Ourselves")

Spine: `trading-against-ourselves-tightened-desilenced.mp4` (95.26 s, 1080x1920, native 25 fps)
Comp: `ElizaTradingAgainstOurselves` (shared `LivestreamShort` renderer) · public dir `video-creation/shorts/eliza/render-assets/`
Measured content/face seam of THIS clip: **row 853** (row-gradient scan at t=5/35/70/92 s; delta 176-205).

## Budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget (HALVED 2026-07-14)")

| metric | target | this clip |
|---|---|---|
| generated b-roll coverage | ~30% (band 25-35%) | **30.52 s = 32.0%** |
| base video showing | ~70% (band 65-75%) | **64.74 s = 68.0%** |
| distinct images | output of the budget (~8-10 per 95 s) | **11** (+1 thumbnail cover) |
| full-screen moments | 1-3 (FIRM) | **3** — hook, mid transition, climax |

The content zone of this clip is high-value screen-share: DexScreener IF/WETH then CASHCAT/WETH
(0-69 s, with a live cursor chart-walk) and TradingView BTC.D / TOTAL3-USM2 (70-95 s). Mike POINTS at
the chart while narrating "buying in like up here / up at the top / these guys bought down here and
they're selling up here" (**30.9-42.9 s**) and "the ones over here were still buying in"
(**45.3-51.6 s**) — both are deliberate BASE-SHOWING beats, no image over them.

## Beats

| # | tIn | tOut | mode | spoken line | visual | Reference |
|---|---|---|---|---|---|---|
| 1 | 2.90 | 5.50 | **full** | "like we're trading against ourselves" | mirrored dark casino: two identical faceless hooded silhouettes slide the SAME blank coin back and forth, reflections repeating forever | none needed (no named entity) |
| 2 | 9.90 | 12.50 | content | "jumping on these Robinhood memes because it seems exciting" | faceless crowd leaping at a giant slot machine spraying blank glowing coins, lime-green/yellow | Robinhood: **none exists in `schedule-tweets/images/reference/` (generic approved)** — use Robinhood's lime-green/yellow palette, never teal (`feedback_robinhood_coin_color`), and NO invented wordmark/logo |
| 3 | 20.70 | 23.10 | content | "it's going to dwindle out if there's no new retail" | vast arena of empty seats, a thin scatter of silhouettes left, ember glow dying | none needed |
| 4 | 28.54 | 30.90 | content | "...couple hours ago. That's from Robinhood retail." (the **What If** pump he just navigated to) | the What If green figure standing on top of a spiking green candle while faceless retail hands shove glowing cash upward | **`schedule-tweets/images/reference/what-if.jpg`** — MANDATORY, generated WITH the reference (real mark, never invented) |
| 5 | 42.90 | 45.30 | content | "maybe they're going to rotate into another Robinhood token" | three blank coins on pedestals, a money arc rotating between them, one lit lime-green, the others grey | Robinhood: none exists (generic approved), lime/yellow palette |
| 6 | 51.60 | 54.30 | content | "maybe they got pissed off and they just checked out" (PEAK) | faceless silhouette slamming a laptop shut and walking away from a wall of red charts | none needed |
| 7 | 54.30 | 57.20 | **full** | "all the hype is just going to phase away" | a towering crowd of glowing silhouettes dissolving into embers and smoke over an empty arena | none needed |
| 8 | 65.40 | 68.20 | content | "the whole thing that we need more people in crypto" | one bright gateway in the dark, a line of NEW faceless silhouettes walking IN | none needed |
| 9 | 72.40 | 75.30 | content | "outflows of cash coming out of stablecoins" | a cracked vault of blank stacked coins draining a river of glowing cash into a black void | stablecoins: generic (no single project named) |
| 10 | 82.50 | 85.90 | content | "there's more people checking out and that's going to create a lot of weakness" | silhouettes filing out through a glowing exit turnstile as the structure behind them fractures | none needed |
| 11 | 91.80 | 95.40 | **full** | "the money is going to come back in, the bull run starts again" (CLIMAX / hard-out) | colossal neon-green bull bursting out of a wall of light and glowing banknotes, rising line of light behind it | none needed |

Beat 6 -> 7 are **adjacent (tOut == tIn)** so `BrollLayer` hard-cuts content-zone -> full-screen with
no base flash (SKILL production rule 4). Every other pair has >= 2.5 s of deliberate base between it.
Beat 11 runs past the last frame (95.26 s) so the climax never fades out before the hard-out.

### Deliberate BASE-SHOWING beats (mode `base`, no image)
| span | why |
|---|---|
| 0.04-2.90 | frame-0 cover hands off to the real talking head + What If page (SKILL rule 5) |
| 5.50-9.90 | screen-share (What If / DexScreener) carries the "all of us in crypto" line |
| 12.50-20.70 | "we keep bouncing / rotate into another meme" over the live chart |
| 23.10-28.54 | he navigates and points: "now let's go to what if, this pump right here" |
| **30.90-42.90** | **chart-walk he narrates**: "buying in like up here / up at the top / these guys bought down here and they're selling up here" |
| **45.30-51.60** | **chart-walk**: "the ones over here were still buying in ... bought in for the first time" |
| 57.20-65.40 | "disappear over the next few weeks ... any cash into other Robinhood tokens" |
| 68.20-72.40 | segment join into the TradingView BTC.D chart |
| 75.30-82.50 | the doubled "which happens every bear market" anaphora (carried by a badge, not an image) |
| 85.90-91.80 | TOTAL3/USM2 chart he is reading: "started in May ... end in December" (badge only) |

## Reference-image gate (run LIVE against `schedule-tweets/images/reference/`, 2026-08-06)

Named entities in the transcript: **Robinhood** (x4: 10.5, 29.2, 44.1, 63.6 s), **What If** (25.6 s,
"now let's go to what if"), stablecoins (generic class), crypto (generic).
Live listing of `schedule-tweets/images/reference/`: DogInMe, ElizaOS-ai16z-2, ElizaOS-ai16z, LAB,
bittensor-tao, bobo, carousels, ethereum-eth, housecoin, kappy, kaspa-logo, kasy, kroak, linea,
michael-saylor, nacho, slippy, toshi, troll, velvet, **what-if.jpg**.
- **What If -> `what-if.jpg` EXISTS -> beat 4 MUST be generated with it** (done, see beat table).
- Robinhood -> no reference on disk -> generic approved, brand palette only, no invented mark.
- ElizaOS / LAB / Kaspa etc. are NOT named in this clip -> not used.

## SFX (from `video-creation/assets/sfx/`)

| t | file | why | vol |
|---|---|---|---|
| 0.00 | `sfx/transition_rapid_whoosh.mp3` | the frame-0 thumbnail cut into the video | 0.20 |
| 2.90 | `sfx/Cinematic Whoosh 02.wav` | cut into the full-screen hook | 0.30 |
| 28.54 | `sfx/DING.mp3` | the What If / Robinhood-retail reveal | 0.22 |
| 51.60 | `sfx/Impacts/Soundjay_Impact_Main_01.wav` | "got pissed off and checked out" punch | 0.26 |
| 54.30 | `sfx/Cinematic Whoosh 06.wav` | hard cut into the full-screen "hype phases away" | 0.30 |
| 65.40 | `sfx/transition_rapid_whoosh.mp3` | cut into "we need more people in crypto" | 0.22 |
| 82.50 | `sfx/Impacts/Kick_Impact_01.wav` | "more people checking out" -> weakness | 0.24 |
| ~~88.30~~ | ~~`sfx/TING SOUND EFFECT.mp3`~~ | ~~the MAY TO DECEMBER badge reveal~~ | **CUT at build** |
| 89.80 | `sfx/risers/Tension_Rise_Logo_Reveal_3.wav` | riser building INTO the payoff | 0.14 |
| 91.75 | `sfx/Boom - Big Reveal.wav` | impact on the climax full-screen (dur 2.30) | 0.32 |

**AS BUILT: 9 events / 8 distinct files** (was 10/9). Two changes made by the mandatory final-mix
whisper sweep (SKILL QA item 7); both are recorded in full in `remotion/src/constants-eliza-tao.ts`:

1. **Riser substituted.** `Edgy_Riser.wav` does not cross 20 % of its own level until 2.90 s and peaks
   at 5.10 s, so in the plan's 1.20 s run-up (90.60 -> 91.80) it would have rendered 1.2 s of
   near-silence. `Tension_Rise_Logo_Reveal_3.wav` (20 % at 0.85 s, 50 % at 1.80 s, peak 2.55 s) builds
   inside the window; started 89.80, truncated at 91.80 so it crescendos into the Boom.
2. **TING deleted, and the Boom's tail truncated.** The TING at 87.50 put its crest on "started in
   May." and the mix read "stable coin START OF THE MAY". Retiming it to 88.08 (crest in the verified
   88.76-89.02 pause) fixed that but its 0.85 s decay then corrupted "so it stands to reason" into
   "so if you stand" at EVERY gain tested at full render fidelity (0.22 / 0.14 / 0.07); only removing
   it restored the control, and the VO runs unbroken 89.02-91.98 so there is nowhere to retime it to.
   Separately the Boom's 3.40 s ring-out smeared the hard-out line ("the BULL RUN starts again" ->
   "the BORON starts again"); its gain and 91.80 crest are untouched and only the tail is shortened
   to dur 2.30 (truncation step -38 dBFS = 17 dB under the VO, inaudible).
   Final state: all seven whisper-verified windows match the bare spine.

## Code-drawn badges (never over a b-roll image, never overlapping each other)

| tIn | tOut | text | top | inside base stretch |
|---|---|---|---|---|
| 35.60 | 38.40 | BOUGHT / THE TOP / "NEW RETAIL" (red) | 660 | 30.90-42.90 |
| 77.00 | 79.80 | EVERY / BEAR MARKET / "SAME PATTERN" (orange) | 660 | 75.30-82.50 |
| 88.30 | 91.30 | MAY / TO DECEMBER / "STABLECOIN OUTFLOWS" (yellow) | 660 | 85.90-91.80 |

Badge box spans ~531-789 px: below the candle price action Mike points at, above the caption band
(caption text top edge = 838 px at `capY` 890). No badge starts before the thumb frame ends (0.04 s).

## Frame-0 cover

`thumb-etao.png` (generated background) + CODE-DRAWN title "WE'RE TRADING / AGAINST / OURSELVES" and
chip "NO NEW RETAIL" (never baked into the art). ONE frame only (`thumbDur` = 1/fps default); the
base video plays from frame 1.

## Persona guards applied to every prompt

Faceless silhouettes only (no real or invented faces), blank featureless coins (no Bitcoin/Ethereum/
any real mark sneaked in), no text/letters/numbers baked into any image, Robinhood beats use
lime-green/yellow (never Kaspa teal). Every generated image is visually inspected before render; a
violation is REMAPPED to a clean on-disk asset, never regenerated mid-build.
