# BROLL-PLAN - lab-called-20x-did-353x (batch `what-if-1000x`, clip 4, variant `solo`)

Title (frame-0 cover): **"We Estimated 20x. LAB Did 353x."**
Contract: `video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md` (halved b-roll budget:
~30% generated b-roll / ~70% base showing, full-screens 1-3 FIRM, BASE beats are explicit rows).

Spine: `lab-called-20x-did-353x-tightened-desilenced.mp4` - 61.20s, 1080x1920, 25fps, already tightened +
desilenced. NOT re-cut, NOT re-desilenced.
Comp runs at **30fps, 1836 frames = 61.200s** (video stream 61.200s, audio 61.224s, so the last rendered
frame t=61.167s lands inside both streams: no black tail frame, no audio underrun).
Measured seam (screen-share -> webcam): **y = 854** on every sampled frame (green-onset row scan at
0.5-60s, 1s steps; the 45-54s samples read null only because his hair fills those rows). Content-mode
b-roll covers 0..**855**.
Caption centre `capY` = **925** (70px under the seam, on his hairline, ~300px above his eyes).

## Source assembly (why the story jumps) and what the BASE video shows

Source segments play NON-chronologically, assembly `[2,3,1,4,0]`, so the clip is: the 20x estimate ->
what actually happened -> the seven-cents 353x payoff -> "it decided to just fly" -> the other wins.

| base window | what is on the screen-share |
|---|---|
| 0.00-43.40 | The REAL **CoinMarketCap LAB page**: the all-time chart running flat along $0.078 through Nov 25 - Apr 26, the near-vertical pump to ~$20 in Jun-Jul 26, the drop back to $0.13, plus the live stats rail (mkt cap $68.6M, 1B max supply, 28.02K holders) and the LAB Markets table (Binance Alpha, Bitget, Gate, KuCoin). This chart **is** the 353x receipt. |
| 43.40-61.20 | Hard screen-share change at the seg boundary: the **What If (IF/WETH) dexscreener chart** on Uniswap, +$35.7M mkt cap, the transactions tape. Correct for "get in my community" but OFF-MESSAGE for the LAB/Velvet/Pippin receipts, which is why the two b-roll cutaways in this stretch earn their place. |

Because the CMC LAB chart is the receipt this whole short is about, it is SHOWN, not covered: the b-roll
lands on the hook, the two price extremes he names, the 353x climax, the punchline, and the two named
projects that are NOT on screen (Velvet, and the plan beat). Everything else is a deliberate BASE beat.

## Beat table

| # | window (s) | dur | spoken line | visual | mode | reference |
|---|---|---|---|---|---|---|
| BASE | 0.000-1.320 | 1.32 | "i only estimated that i would" | frame-0 cover hands off to Mike + the live LAB chart | base | - |
| B1 | 1.320-3.900 | 2.58 | "do like a 20x off of LAB" | HOOK full-screen: the neon-green LAB flask emblem struck into a heavy 3D coin on a black pedestal under one spotlight, a SHORT green trajectory arc behind it that stops low in frame (the modest 20x estimate) | **full** | `LAB.png` |
| BASE | 3.900-9.600 | 5.70 | "it's crazy, ended up doing 350x. i had LAB listed as a private gem. i thought eventually down the road we'll do a 20x" | the CMC chart with the vertical pump right there on screen while he says "ended up doing 350x". Badge A rides this stretch. | base | - |
| B2 | 9.600-12.100 | 2.50 | "we swing trade, we, you know, goes up, we sell" | content-zone: dark trading terminal, a neon-green price line oscillating inside a tight range, a green up-arrow and a dim down-arrow ping-ponging along it, blank featureless discs changing hands (the plan he thought he was executing) | content | - |
| BASE | 12.100-17.050 | 4.95 | "but it goes down, buy back in. it did bottom out in december" | back on the chart's flat left-hand side, which is literally that bottom | base | - |
| B3 | 17.050-19.750 | 2.70 | "at eight cents or seven and a half cents" | content-zone: THE BOTTOM. The LAB flask coin small, dark and half-buried in rubble at the floor of a deep canyon, one faint green ember on it, cold December moonlight, enormous black walls rising out of frame | content | `LAB.png` |
| BASE | 19.750-22.600 | 2.85 | "or something like that. right. and we're over here selling this damn thing" | base | base | - |
| B4 | 22.600-25.850 | 3.25 | "at like $25 or $27 or something like that" | content-zone: THE TOP. The same coin now blazing at the summit of a towering neon-green ridge, a cascade of blank featureless discs pouring off the peak into a dark vault below (the sell) | content | `LAB.png` |
| B5 | 25.850-29.550 | 3.70 | "you imagine that, getting to like seven cents, you know, 353x man" | CLIMAX full-screen: the coin ERUPTING off the canyon floor straight up a vertical column of neon-green light that tears out of the top of frame, shockwave ring at the base, embers, the canyon walls lit green. **Hard-cuts out of B4** - the two windows are BUTTED at 25.850 (a draft render on 2026-08-03 proved a 0.13s gap still flashes the base for 4 frames: `BrollLayer`'s 0.18s EPS only suppresses the FADES, it does not fill the gap. See `_qa/frames/cutseq.png`.) | **full** | `LAB.png` |
| BASE | 29.550-41.280 | 11.73 | "it was just nuts how that worked out. i thought i was still going to be holding it, maybe swing trading, building the size of my bag, 2x in my bag, 3x in my bag, just from regular movements" | the longest deliberate BASE stretch: this is the reflective beat and the chart behind him is the answer to it. Badges B and C ride it (visual change at 30.1 and 37.6) | base | - |
| B6 | 41.280-43.950 | 2.67 | "and that thing decided to just fly" | PUNCHLINE full-screen: the coin far above the storm layer, punching through cloud into dawn light with a long neon-green contrail curving up out of frame. Also COVERS the hard screen-share change at 43.40 (CMC LAB -> What If dexscreener) so the jump cut never shows | **full** | `LAB.png` |
| BASE | 43.950-50.450 | 6.50 | "and that's why you got to get in my community. then we just did like a 350x two months ago on a LAB token" | base | base | - |
| B7 | 50.450-53.150 | 2.70 | "that 58x on the velvet token" | content-zone: a heavy 3D coin on violet obsidian carrying the real Velvet double-chevron mark, deep purple-to-black gradient, a steep violet trajectory rising behind it | content | `velvet.png` |
| BASE | 53.150-61.200 | 8.05 | "that was just a month ago. right. earlier this year we did the 85x on pippin. this is crazy in a bear market nonetheless, man. oh my god." | hard-out close on his face. Badges D and E ride it (visual change at 55.1 and 58.0) | base | - |

**Budget: 20.10s of b-roll / 61.20s = 32.8% b-roll, 67.2% base showing** (band 25-35% / 65-75%).
**Distinct images: 7** (+1 thumbnail background) = one new image per 8.7s, inside the guidance
(~6 per 60s, ~1 per 10s). No image serves two beats; no image is reused from another clip.
**Full-screens: 3** (hook 1.32, climax 25.85, punchline/transition 41.28) - the FIRM 1-3 cap, exactly.
They are 22.0s and 11.7s apart, so there is never a sub-1s base flash between two full-screens.

## Reference-image gate (MANDATORY, named projects)

`ls schedule-tweets/images/reference/` run LIVE this build (2026-08-03): `DogInMe.png ·
ElizaOS-ai16z-2.png · ElizaOS-ai16z.webp · **LAB.png** · bittensor-tao.png · bobo.png · carousels ·
ethereum-eth.png · housecoin.webp · kappy.png · kaspa-logo.png · kasy.png · kroak.png · linea.png ·
michael-saylor.png · nacho.jpg · slippy.png · toshi.png · troll.png · **velvet.png** · what-if.jpg`.

- **LAB -> `schedule-tweets/images/reference/LAB.png` EXISTS** (neon-green outlined conical flask with a
  green liquid swirl + the LAB wordmark, on dark). **Every LAB beat (B1, B3, B4, B5, B6) and the
  thumbnail background is generated WITH that reference attached**, so the short carries the real mark.
- **Velvet -> `schedule-tweets/images/reference/velvet.png` EXISTS** (white/violet angular double-chevron
  "V" + Velvet wordmark on deep purple). **B7 is generated WITH it attached.**
- **Pippin -> NO reference on disk.** No Pippin logo is generated and none is invented. Pippin is carried
  by the captions ("the 85x on pippin", teal) and by **code-drawn Badge D ("85X / ON PIPPIN")** over the
  base video - real text, never a blank stand-in object and never a fake logo.
- Generation tool: `repurpose/gen-batch-freshchat.js --list=... --prefix=broll --outdir=<clip>/render-assets
  --purpose=broll --chat-batch=what-if-1000x`. It is the reference-capable batch generator (per-item `ref`),
  which is required here: SKILL Phase 7 rule 6 forbids leaving a project that HAS a reference to the
  text-only generators (`generate-broll-reload.js` cannot attach one). Run inside the `chatgpt` stage lock.

## Persona guards applied

- **The 20x call reads VINDICATED, never wrong.** B1 shows a real, deliberate, lit-up call (a short arc =
  a conservative estimate), and every later image escalates from it. Nothing in the art or the badges
  frames the estimate as a miss; the story is "we underpromised and it overdelivered".
- Every non-LAB / non-Velvet coin in every image is a **blank featureless disc** (no Ethereum diamond, no
  Bitcoin mark, no invented project logos). Any human figure is a **faceless silhouette**.
- **No lettering baked into any generated image** (brand marks are the flask / chevron emblems only); the
  cover title + chip are drawn in CODE over the art, so they stay editable and sharp.
- No em dashes anywhere on screen. TAO/Kaspa spellings are enforced by the caption builder.

## Overlays (code-drawn badges) - no two collide in time OR space

Badge plates shrink-to-fit a ~440px column and render roughly 380-440px tall around `top`, so `top 320`
renders y ~128-512 and `top 600` renders y ~409-789. Both bands sit fully inside the frame, above the
seam (855) and above the caption band (top edge ~880).

| badge | window (s) | band | line1 / line2 / sub | why it is not a caption repeat |
|---|---|---|---|---|
| A | 6.40-8.95 | top 600 | CALLED IT / PRIVATE GEM / OUR TARGET WAS A 20X | names the call itself (a private-gem listing with a stated target), which the captions never state as a claim |
| B | 30.10-32.60 | top 320 | 7.5 CENTS IN / $27 OUT / THAT IS THE 353X | does the arithmetic the whole clip implies but never states in one place |
| C | 37.60-40.10 | top 600 | THE PLAN WAS / SWING THE BAG | labels the reflective stretch, and sets up "it decided to just fly" |
| D | 55.10-57.40 | top 320 | 85X / ON PIPPIN / EARLIER THIS YEAR | Pippin has no reference image, so its beat is carried as REAL TEXT, not an invented logo |
| E | 58.00-60.40 | top 600 | BEAR MARKET / NO LESS / 353X 58X 85X | stacks the three wins against the market backdrop, the vindication close |

Every badge window sits inside a BASE stretch (no badge is ever under a b-roll image), no two badge
windows overlap in time, and consecutive badges alternate bands. Nothing starts under the frame-0 cover
(`LivestreamShort` suppresses badges/overlays while the thumb is up anyway).

## SFX (from `video-creation/assets/sfx/`) - 11 events, 7 distinct files

| t (s) | file | vol | why |
|---|---|---|---|
| 0.02 | Cinematic Whoosh 02.wav | 0.38 | the frame-0 cover cut |
| 1.30 | transition_rapid_whoosh.mp3 | 0.40 | cut INTO the hook full-screen |
| 6.38 | DING.mp3 | 0.24 | badge A reveal (the private-gem call) |
| 17.03 | Cinematic Whoosh 06.wav | 0.28 | cut into THE BOTTOM cutaway |
| 22.58 | Cinematic Whoosh 06.wav | 0.28 | cut into THE TOP cutaway |
| 25.83 | transition_rapid_whoosh.mp3 | 0.34 | cut INTO the climax full-screen |
| 26.30 | risers/Tension_Rise_Logo_Reveal_3.wav | 0.14 | riser building through "getting to like seven cents" |
| 27.70 | Impacts/Impact_2.wav | 0.26 | **IMPACT exactly on "353x"** (the mandated reveal hit; volume swept against Whisper so it never masks the line) |
| 30.08 | TING SOUND EFFECT.mp3 | 0.22 | badge B reveal (7.5 cents in, $27 out) |
| 41.26 | transition_rapid_whoosh.mp3 | 0.34 | cut INTO the punchline full-screen (also masks the screen-share change at 43.40) |
| 55.08 | DING.mp3 | 0.22 | badge D reveal (85x on Pippin) |

Volumes are deliberately low: an SFX cue that masks the VO is a build defect, not a mixing taste call.
The 27.70 impact is whisper-verified on the FINAL render against the spine-only transcription.

## Frame-0 thumbnail (IG/TikTok cover)

ONE frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`); the video plays base-first from
frame 1. Generated background art with the title + chip drawn in CODE on top, never baked into the art.

- title: `WE CALLED 20X` / `IT DID 353X` (the estimate is vindicated by the outcome, not corrected by it)
- chip: `7.5 CENTS TO $27` (LAB green `#39ff14`), titleSize 132
- background: `thumbnail-lab353.png` - the LAB flask coin low in frame launching up a neon-green light
  column that fades into darkness at the top, so the code-drawn title stays legible.

## Caption corrections (MANDATORY for this clip)

Source of truth = `video-creation/skills/captions/build_captions.py` (`PHRASE_CORRECTIONS`,
what-if-1000x block), never a hand edit of the emitted array. Output: `remotion/src/captionsLab353.ts`.

| heard (base and/or medium Whisper) | shipped |
|---|---|
| "20x off a lab" | "20x off of lab" |
| "off of lab AS crazy" | "off of lab THAT'S crazy" (VERIFIED 2026-08-03: three isolated medium passes all return "that is crazy", so "it's" was wrong) |
| "i had to list it" / "had a listed" | "i had it listed" (VERIFIED 2026-08-03: three isolated medium passes over 4.5-9.5s - 1x, 0.75x, and LAB-biased prompt - all return "i had IT listed", so "lab" is NOT spoken here and is NOT put on screen) |
| "as a private jet" | "as a private gem" |
| "I was just nuts" | "it was just nuts" |
| "the 85x on Pippen" / "I'm pippin" | "the 85x on pippin" |
| "at like 25 or $27" | "at like $25 or $27" |
| "three x in my bag" | "3x in my bag" |

Verified NOT a garble (both a base and a targeted medium-model pass agree, so the captions stay faithful
to the audio): he says **"350x"** at 5.10s and 48.24s and **"353x"** at 27.70s. The precise number 353x is
used on the cover and in badge B.

Colour tags: `<gr>` lab / fly (LAB's neon green), `<y>` every multiple (20x, 350x, 353x, 58x, 85x, 2x, 3x),
`<g>` velvet / pippin (teal), `<r>` bear market. No em dashes on screen.

## Files (zero orphans)

`render-assets/` (the render `--public-dir`):
`lab-called-20x-did-353x.mp4` (spine) · `thumbnail-lab353.png` · `broll-wi04-hook-lab-20x.png` ·
`broll-wi04-swing-plan.png` · `broll-wi04-bottom-cents.png` · `broll-wi04-top-sold.png` ·
`broll-wi04-climax-353x.png` · `broll-wi04-just-fly.png` · `broll-wi04-velvet-58x.png` ·
`sfx/...` (7 shared files copied in, never junctioned).
Comp: `remotion/src/LabCalled20xDid353x.tsx` + `remotion/src/constants-lab353.ts` +
`remotion/src/captionsLab353.ts`. Composition id `LabCalled20xDid353x`.
Render: `remotion/out/what-if-1000x/4-lab-called-20x-did-353x.mp4`.
