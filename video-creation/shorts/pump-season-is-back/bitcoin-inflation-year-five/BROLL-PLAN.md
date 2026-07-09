# BROLL-PLAN — bitcoin-inflation-year-five (batch: pump-season-is-back, clip #4, variant: full)

Clip: `bitcoin-inflation-year-five-full.mp4` — 1080x1920, 25fps, 132.0s. Same composited-vertical
livestream layout as clips #1/#2/#3: screen-share top (0..~848 = a static BTC/USD TradingView chart)
+ Mike's face-cam bottom (848..1920). Comp `BitcoinInflationYearFive` runs at 30fps (id
`BitcoinInflationYearFive`, `BIYF_DURATION` 3960f = 132.0s). Seam y848, caption band centre y866.
Do NOT re-split screen/face — the source is already composited.

Topic: DEBUNK THE PUMP. Mike argues the 68k -> 126k move was NOT a real pump. The bear market began
at the December 2021 last-real-top (not the "rinky dink" October 2025 top), so we are in year FIVE
of the bear. Bitcoin's price "really just adjusted to inflation": US money supply grew ~40% and
everything roughly doubled (his tow-truck proof: a Jersey -> upstate NY tow was $800 nine years ago,
$1,600 today; water-heater / plumbing prices likewise doubled). So measured in real purchasing power,
one bitcoin in October 2025 buys about the same as it did in November 2021 — the value "didn't
increase that much, it just looked like it did in dollars, it's just inflation." Closes forward-looking:
this could become perpetual new all-time highs every year, the same way the stock market ran up
through the 1990s (up, retracement, up, retracement) until 2000.

## Image budget (Mike, HARD — matches clip #3's structure)
Mike's rule for THIS clip: **only 2 content-zone images, strictly A/B alternated across every zone
beat** (same shape as clip #3). Final budget = **5 full-screen peak images + 2 content-zone images =
7 distinct total.** The 2 zone images are alternated in strict A, B, A, B order across all 41 zone
beats so **no two adjacent zone beats ever share an image** and the top strip keeps changing every
~2.5-3.4s (nothing static >~3.4s). Full-screens fall only at the 5 peaks. (Earlier drafts had 31 and
then 11 distinct — both retired for this 7-asset budget.)

## Palette — MATCH THE APPROVED THUMBNAIL (derived from `render-assets/thumbnail-full.png`, opened + read)
The thumbnail (corrected to read "BITCOIN JUST TRACKED INFLATION") is **deep matte black + molten
amber/orange glow + gold-yellow + white**, with these motifs: "BITCOIN JUST" in **white**, "TRACKED
INFLATION" in a bright **orange-to-amber gradient (~#ff7a1a -> #ffab2e)**, a large **molten-gold coin**
standing on a **reflective gold floor**, a **yellow-gold up-trending line chart** sweeping across the
lower third, and a faint **amber/orange perspective grid floor**. So BOTH generated zone images are
built in that molten-gold **INFLATION / EROSION** world: black bg, amber-orange glow (**#ff8c1a**),
gold-yellow (**#ffb400**), white accents, generic gold coins, up-trending gold line/candle charts, a
gold grid floor, reflective floor glow, drifting gold dust. Warm gold reads "money / inflation," which
is exactly this clip's thesis (the pump was just the dollar melting).
- **Teal (#00e5ff) stays ONLY as the brand thread** — the 5px zone seam line under each zone beat, for
  set-consistency with clips #1/#2/#3. It is NOT a fill colour in the art.
- The **caption accent is Bitcoin orange (#ff9f1c)** (code `<o>` spans in `constants-biyf.ts`, already
  authored) — it sits in the seam band, separate from the art; it does not change the b-roll palette.
- Numbers/labels are crisp code **Badges**, NEVER baked into generated art (image models mangle text).

## Persona-clean (HARD)
- **NO real cryptocurrency logos** in generated art — no real ₿/BTC mark (the thumbnail's coin carries
  a real ₿; every GENERATED coin must be a **generic blank molten-gold token, no ₿, no ticker**), no
  ETH diamond, none. Every "bitcoin" beat = a generic blank gold coin.
- **The inflation / purchasing-power idea = generic EROSION visuals** — shrinking / melting dollar
  bills, a coin's real size held flat while a nominal shadow balloons, climbing price tags, gold dust
  slipping away. NEVER a real ₿ mark.
- **Currency notes are faceless generic banknotes** — no presidential portraits, no denominations, no
  serial text; blank amber/green generic bills only (no recognizable real people anywhere).
- **No recognizable real people** — no faces, no likenesses; abstract objects only.
- **No baked text/numbers/letters** anywhere in the art (price tags, chart axes stay blank).

## Coverage strategy (clip-specific — justifies near-continuous top-zone cover)
The screen-share top zone is a **static, low-value BTC/USD TradingView chart** that runs the whole clip
(same source setup as clips #1-#3). It is off-message for an "it was never a real pump / it just tracked
inflation" short (a live BTC chart under a debunk-the-pump argument), so for THIS clip the top zone is
covered **near-continuously** by b-roll: every zone beat butts against its neighbours (hard cut, no base
flash), the static chart is always hidden, and Mike's face stays visible below the seam except at the 5
full-screen peaks. This runs hotter than the default ~55-65% budget, justified by the low-value /
off-message static chart (same rationale as clips #2/#3). Full-screen at: the **HOOK**, the
**"adjusted to inflation" thesis reveal**, the **"everything is doubled" turn**, the **"it just looked
like it did in dollars / it's just inflation" CLIMAX**, and the **forward-looking CLOSE**.

## Reference-image gate (glob'd LIVE `schedule-tweets/images/reference/` on 2026-07-09)
Present references: DogInMe, ElizaOS-ai16z (x2), LAB, bittensor-tao, bobo, housecoin, kappy,
kaspa-logo, kasy, kroak, linea, michael-saylor, nacho, slippy, toshi, troll.
This clip names **NO tradeable project/coin with a reference** — it references only "bitcoin"
generically, and the directive FORBIDS a real BTC logo anyway. **-> ZERO reference-gated beats; all
art is generic/thematic.** (Checked live, nothing applies.)

## The 7 distinct images (5 full-screen + 2 reusable A/B zone)
FULL-SCREEN peaks (each used once, at a peak):
- `broll-psb-hook-full.png`     — HOOK: gold coin on a reflective floor, gold line chart spikes to a lone peak then rolls over
- `broll-psb-tracked-full.png`  — THESIS: a coin that looks doubled but an inflation swell matches it, so its real core is unchanged
- `broll-psb-doubled-full.png`  — TURN: a giant amber price bar doubling + a cart of generic goods with tags all 2x
- `broll-psb-illusion-full.png` — CLIMAX: a small gold coin casting an ENORMOUS dollar-shaped shadow (big in dollars, tiny in reality)
- `broll-psb-close-full.png`    — CLOSE: a triumphant gold coin atop a rising staircase of all-time highs into the future
CONTENT-ZONE images (only 2, strictly A/B alternated across all zone beats):
- ZONE A `broll-psb-nominalrise.png` — a generic blank gold coin drifting / rising along a glowing gold up-trending chart (the NOMINAL-only rise; the price only "looks" like it went up)
- ZONE B `broll-psb-lostpower.png`   — shrinking / melting faceless dollar bills + a doubling blank price tag, a coin held flat while the dollars shrink (LOST real purchasing power)

## Beat table (tIn..tOut are comp seconds; mode = full-screen | zone; zone = strict A/B alternation)

| # | tIn | tOut | mode | spoken line | image (asset) | ref |
|---|-----|------|------|-------------|---------------|-----|
| 1 | 0.00 | 3.48 | full | "the idea is that the bear market began in december of" | broll-psb-hook-full.png | - |
| 2 | 3.48 | 6.88 | zone A | "2021, right? at the last real top" | broll-psb-nominalrise.png | - |
| 3 | 6.88 | 9.94 | zone B | "not the rinky dink nonsense that we had in this past" | broll-psb-lostpower.png | - |
| 4 | 9.94 | 13.28 | zone A | "october, but the last real top. so the bear market began back" | broll-psb-nominalrise.png | - |
| 5 | 13.28 | 16.66 | zone B | "then. and we're at year number five of the bear market" | broll-psb-lostpower.png | - |
| 6 | 16.66 | 19.56 | zone A | "which is hard to argue against. but what i've been saying this" | broll-psb-nominalrise.png | - |
| 7 | 19.56 | 22.92 | zone B | "whole time is that the price of bitcoin really just" | broll-psb-lostpower.png | - |
| 8 | 22.92 | 27.06 | full | "adjusted to inflation. 68k to 126k four years" | broll-psb-tracked-full.png | - |
| 9 | 27.06 | 30.48 | zone A | "well, the monetary supply in the us, the dollars increased by like" | broll-psb-nominalrise.png | - |
| 10 | 30.48 | 33.74 | zone B | "what 40%. and everything is like cost almost double" | broll-psb-lostpower.png | - |
| 11 | 33.74 | 36.60 | zone A | "so it's like almost everything is almost double. i'll tell you one thing" | broll-psb-nominalrise.png | - |
| 12 | 36.60 | 39.08 | zone B | "i just had a car today actually, not" | broll-psb-lostpower.png | - |
| 13 | 39.08 | 40.16 | zone A | "just yesterday, i paid for it" | broll-psb-nominalrise.png | - |
| 14 | 40.16 | 43.44 | zone B | "so they're towing it today from a place in jersey to" | broll-psb-lostpower.png | - |
| 15 | 43.44 | 46.44 | zone A | "upstate new york, right? and it cost me" | broll-psb-nominalrise.png | - |
| 16 | 46.44 | 49.70 | zone B | "$1,600. whereas 10 years ago" | broll-psb-lostpower.png | - |
| 17 | 49.70 | 52.74 | zone A | "10 years, no, nine years ago, i had a car" | broll-psb-nominalrise.png | - |
| 18 | 52.74 | 55.96 | zone B | "towed from jersey to upstate new york. it was almost like the same" | broll-psb-lostpower.png | - |
| 19 | 55.96 | 57.30 | zone A | "thing. almost like the same distance" | broll-psb-nominalrise.png | - |
| 20 | 57.30 | 60.10 | zone B | "and it was $800 nine years ago" | broll-psb-lostpower.png | - |
| 21 | 60.10 | 62.58 | zone A | "to do that. and then it was like $1600 today" | broll-psb-nominalrise.png | - |
| 22 | 62.58 | 64.84 | full | "so my point is like everything is doubled" | broll-psb-doubled-full.png | - |
| 23 | 64.84 | 68.08 | zone B | "like i once do a plumbing job, i've probably seen like a water heater" | broll-psb-lostpower.png | - |
| 24 | 68.08 | 71.00 | zone A | "and the price i expected to pay, i would have" | broll-psb-nominalrise.png | - |
| 25 | 71.00 | 73.20 | zone B | "paid like in year 2020. and so it's like it's" | broll-psb-lostpower.png | - |
| 26 | 73.20 | 74.46 | zone A | "like almost double" | broll-psb-nominalrise.png | - |
| 27 | 74.46 | 77.48 | zone B | "what it was. so like everything is almost double" | broll-psb-lostpower.png | - |
| 28 | 77.48 | 80.18 | zone A | "in price. everything costs more" | broll-psb-nominalrise.png | - |
| 29 | 80.18 | 82.72 | zone B | "so they just have to think how much does a bitcoin cost?" | broll-psb-lostpower.png | - |
| 30 | 82.72 | 85.30 | zone A | "like what's the value of bitcoin?" | broll-psb-nominalrise.png | - |
| 31 | 85.30 | 88.28 | zone B | "forget about the dollars. what's the value of bitcoin? and what could" | broll-psb-lostpower.png | - |
| 32 | 88.28 | 91.70 | zone A | "that bitcoin buy you? what you can use it for to buy" | broll-psb-nominalrise.png | - |
| 33 | 91.70 | 94.96 | zone B | "something, you know? and it's almost like a bitcoin" | broll-psb-lostpower.png | - |
| 34 | 94.96 | 98.28 | zone A | "in october of 2025 would buy you" | broll-psb-nominalrise.png | - |
| 35 | 98.28 | 101.22 | zone B | "almost the same amount of stuff that it could" | broll-psb-lostpower.png | - |
| 36 | 101.22 | 103.80 | zone A | "buy you in november of 2021" | broll-psb-nominalrise.png | - |
| 37 | 103.80 | 109.04 | full | "the value of bitcoin didn't increase that much, even though it looked like it did in dollars" | broll-psb-illusion-full.png | - |
| 38 | 109.04 | 111.56 | zone B | "it's just like a just a inflation. i'm starting to" | broll-psb-lostpower.png | - |
| 39 | 111.56 | 114.42 | zone A | "think more and more that it's going to be like new all-time" | broll-psb-nominalrise.png | - |
| 40 | 114.42 | 117.64 | zone B | "highs every single year, just the same way the stock market" | broll-psb-lostpower.png | - |
| 41 | 117.64 | 120.78 | zone A | "went back in the 1990s. you know, it was like constant all-time" | broll-psb-nominalrise.png | - |
| 42 | 120.78 | 123.58 | zone B | "highs, up and then a retracement. and then again" | broll-psb-lostpower.png | - |
| 43 | 123.58 | 126.38 | zone A | "up, and then a retracement. and then again up" | broll-psb-nominalrise.png | - |
| 44 | 126.38 | 128.68 | zone B | "just kept happening like all the time. every single year" | broll-psb-lostpower.png | - |
| 45 | 128.68 | 130.02 | zone A | "up until the" | broll-psb-nominalrise.png | - |
| 46 | 130.02 | 132.00 | full | "year 2000. so it could be the same way" | broll-psb-close-full.png | - |

Distinct generated assets (7): hook-full, tracked-full, doubled-full, illusion-full, close-full
(5 full-screen peaks) + nominalrise (ZONE A) + lostpower (ZONE B) (2 reused zone images). NOTE this
uses the clip-#3 2-image structure Mike directed — an intentional deviation from the generic
ceil(132/15) heuristic, and well under Mike's hard cap. 46 beats total (5 full + 41 zone). The 41
zone beats strictly alternate A/B so **no two adjacent zone beats share an image** (top strip changes
every ~2.5-3.4s, nothing static >~3.4s). All beats butt together = no base flash; the 5 full-screens
(#1, #8, #22, #37, #46) are each isolated between butted zone beats, so the base top is never exposed.
Zone usage: nominalrise (A) x21, lostpower (B) x20.

## Badges (crisp code text, top zone y~300; NEVER baked into art; time-separated, never over captions)
Badges sit at y300 (top zone), captions at y866 (seam) — never collide in space; each window is
time-separated from the next and falls only over ZONE beats (never over a full-screen peak). Dollar
prices carry the amber accent (#ff9f1c); percentages / years stay white (consistent with the caption
colour rule in `constants-biyf.ts`).
- 14.6-18.4  big "YEAR FIVE"          sub "OF THE BEAR"     (amber) — over beats #5/#6 (lostpower/nominalrise)
- 27.2-31.3  big "+40%"               sub "MONEY SUPPLY"    (white) — over beats #9/#10 (nominalrise/lostpower)
- 45.0-48.4  big "$1,600"             sub "TOW · TODAY"     (amber) — over beats #15/#16 (nominalrise/lostpower)
- 57.4-60.6  big "$800"               sub "TOW · 9 YRS AGO" (amber) — over beat #20 (lostpower)
- 98.4-103.6 big "SAME BUYING POWER"  sub "2021 = 2025"     (white) — over beats #35/#36 (lostpower/nominalrise)
- 115.5-119.0 big "JUST LIKE"         sub "THE 1990s"       (white) — over beats #40/#41 (lostpower/nominalrise)

## SFX (from `video-creation/assets/sfx/`, copied into render-assets/sfx; all vol <= 0.55 under the VO)
Simplified render-assets/sfx names (same set as clips #1-#3); mapping to library files in parens.
- t0.00   whoosh.wav        vol0.50 — thumbnail cut -> hook reveal                 (Cinematic Whoosh 02.wav)
- t2.22   impact-kick.wav   vol0.48 — "bear market began" the thesis lands         (Impacts/Kick_Impact_01.wav)
- t3.48   whoosh-rapid.mp3  vol0.42 — hook full -> zone                            (transition_rapid_whoosh.mp3)
- t21.40  riser.wav         vol0.38 — build INTO the inflation reveal              (risers/Tension_Rise_Logo_Reveal_1.wav)
- t22.92  impact-big.wav    vol0.52 — "adjusted to inflation" THESIS reveal (FULL) (Impacts/Impact_1.wav)
- t27.06  whoosh-rapid.mp3  vol0.42 — reveal full -> zone                          (transition_rapid_whoosh.mp3)
- t27.50  cash.mp3          vol0.42 — money printer / +40% money supply (kaching)  (Cash Register Kaching  Sound Effect HD.mp3)
- t44.98  ding.mp3          vol0.40 — "$1,600" cost reveal                         (DING.mp3)
- t62.58  whoosh-rapid.mp3  vol0.42 — zone -> "everything is doubled" full         (transition_rapid_whoosh.mp3)
- t62.72  impact-big.wav    vol0.50 — "everything is doubled" turn lands (FULL)    (Impacts/Impact_1.wav)
- t64.84  whoosh-rapid.mp3  vol0.42 — doubled full -> zone                         (transition_rapid_whoosh.mp3)
- t98.28  ting.mp3          vol0.38 — "same buying power 2021 = 2025" accent       (TING SOUND EFFECT.mp3)
- t103.60 riser.wav         vol0.40 — build INTO the illusion climax               (risers/Tension_Rise_Logo_Reveal_1.wav)
- t103.80 impact-boom.wav   vol0.55 — "it just looked like it did" CLIMAX (biggest, FULL) (Boom - Big Reveal.wav)
- t109.04 whoosh-rapid.mp3  vol0.42 — climax full -> zone                          (transition_rapid_whoosh.mp3)
- t109.34 waitwhat.mp3      vol0.42 — "it's just inflation" the deflating twist    (WAIT WHAT  SOUND EFFECT.mp3)
- t130.02 impact-big.wav    vol0.48 — CLOSE full "so it could be the same way" kicker (Impacts/Impact_1.wav)
17 events, 10 distinct files (whoosh, whoosh-rapid, impact-kick, impact-big, impact-boom, riser, cash,
ding, ting, waitwhat — well above the >=2 gate minimum).

## Reconcile (fill after generation): every beat asset present on disk + referenced in comp; zero orphans.
