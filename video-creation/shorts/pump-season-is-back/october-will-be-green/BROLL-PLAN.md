# BROLL-PLAN — october-will-be-green (batch: pump-season-is-back, clip #3, variant: full)

Clip: `october-will-be-green-full.mp4` — 1080x1920, 25fps, 50.6s. Same composited-vertical
livestream layout as clips #1/#2: screen-share top (0..~848) + Mike's face-cam bottom (848..1920).
Comp `OctoberWillBeGreen` runs at 30fps (id `OctoberWillBeGreen`, `OWBG_DURATION` 1518f = 50.6s).
Seam y848, caption band centre y866. Do NOT re-split screen/face — the source is already composited.

Topic: CONVICTION CALL. "October will be green. Mark my words." Mike's mechanism: a crowd betting on
a RED October is the FUEL that turns it green — they see not-so-red candles, FOMO in, their own buying
flips the candles green, others pile on, and October ends very green "regardless of what happened."
Closes on an open loop: if everyone has already bought back in, is a NEW bottom coming after October?

## Image budget (Mike's HARD cap) — EXACTLY 6 distinct b-roll images = 4 full-screen + 2 content-zone
- **4 FULL-SCREEN** (each at its peak): `broll-psb-hook.png` (hook), `broll-psb-greenregardless.png`
  (payoff), `broll-psb-crossroads.png` (climax), `broll-psb-newlevel.png` (close).
- **2 CONTENT-ZONE, reused + alternated:** `broll-psb-verygreen.png` (**zone A**) and
  `broll-psb-expect.png` (**zone B**). Per Mike's budget the content-zone is just these 2 generic-green
  images, alternated STRICTLY A/B across every zone beat so no two adjacent zone beats share an image
  (nothing static >3s). No other zone image is used. hook + both zone images are ALREADY on disk in
  `render-assets/`; only the 3 remaining full-screens need generating (see `broll-list.json`).

## Palette — MATCH THE APPROVED THUMBNAIL (derived from `render-assets/thumbnail-full.png`)
The thumbnail is **deep matte black + acid neon-green glow (#39ff14) + white**, with these motifs:
an October **wall-calendar** page lit green, an **up-only green candlestick chart** rocketing up-right,
a glowing green **upward arrow**, a green **perspective grid floor**, green **energy mist** and radiating
green **light-streaks**. So ALL generated b-roll is built in that acid-green PUMP world (black bg, acid
neon-green glow, white accents, green candles / calendar / grid / mist). This is the SAME green family
as clip #1 (community-receipts), so the three shorts read as a set.
- The 2 zone images are deliberately generic-green backdrops (calendar-pump A / roadmap-horizon B) so
  they read as flavor under ANY spoken line and can alternate everywhere without looking literal.
- **Teal (#00e5ff) stays ONLY as the brand thread** — the 5px zone seam line under each zone beat and
  set-consistency with clips #1/#2. Not a fill colour in the art.
- Numbers/labels are crisp code **Badges** (below), NEVER baked into generated art (models mangle text).

## Persona-clean (HARD)
- **NO real cryptocurrency logos** in generated art — no ₿/BTC, no ETH diamond, none. Every coin is a
  generic blank/green token; charts are generic green candlesticks with no tickers or numbers.
- **No recognizable real people** — no faces anywhere in the generated art.
- **No baked text/numbers/letters** in the art (calendar cells stay blank green blocks).

## Coverage strategy (clip-specific — justifies near-continuous top-zone cover)
The screen-share top zone is a **static, mildly bearish BTC/USD TradingView chart + a real-ticker
watchlist panel** (BTC/ETH/SOL prices visible) that runs the whole clip. It is low-value AND slightly
off-message for a green-conviction short (a down/red BTC chart under a "GREEN" hype call), so for THIS
clip the top zone is covered **near-continuously** by the 2 alternating zone backdrops: every zone beat
butts against its neighbours (hard cut, no base flash), the bearish chart is always hidden, and Mike's
face stays visible below the seam except at the 4 full-screen peaks. Full-screen at: the HOOK, the
"very green october regardless" PAYOFF, and the closing open-loop CLIMAX (two butted fulls).

## Reference-image gate (glob'd LIVE `schedule-tweets/images/reference/` on 2026-07-09)
Present references: DogInMe, ElizaOS-ai16z (x2), LAB, bittensor-tao, bobo, housecoin, kappy,
kaspa-logo, kasy, kroak, linea, michael-saylor, nacho, slippy, toshi, troll.
This clip names **NO tradeable project/coin** — it is a generic macro conviction call about "October"
and "the coin" (never named), and the directive FORBIDS a real BTC logo anyway. **-> ZERO
reference-gated beats; all art is generic/thematic.** (Checked live, nothing applies.)

## Beat table (tIn..tOut are comp seconds; mode = full-screen | zone). Beats are contiguous/butted.
Zone beats alternate STRICTLY A (`verygreen`) / B (`expect`) so no two adjacent zone beats match.

| # | tIn | tOut | mode | spoken line | visual (backdrop) | asset | ref |
|---|-----|------|------|-------------|-------------------|-------|-----|
| 1 | 0.00 | 3.16 | full | "october will be green. mark my words. october will be" | HOOK: October calendar glowing acid-green, green up-candles erupting up + a green up-arrow, light-streaks, mist | broll-psb-hook.png | - |
| 2 | 3.16 | 5.94 | zone | "green unless there's a black swan event in october" | zone A: green calendar-pump backdrop | broll-psb-verygreen.png | - |
| 3 | 5.94 | 8.44 | zone | "and it is my long standing expectation" | zone B: green roadmap/horizon backdrop | broll-psb-expect.png | - |
| 4 | 8.44 | 11.16 | zone | "and i still expect that i haven't changed that i" | zone A: green calendar-pump backdrop | broll-psb-verygreen.png | - |
| 5 | 11.16 | 14.02 | zone | "think that october is going to be very" | zone B: green roadmap/horizon backdrop | broll-psb-expect.png | - |
| 6 | 14.02 | 16.60 | zone | "green because there are tons and tons of people" | zone A: green calendar-pump backdrop | broll-psb-verygreen.png | - |
| 7 | 16.60 | 19.14 | zone | "who think it's going to be red and they're going to" | zone B: green roadmap/horizon backdrop | broll-psb-expect.png | - |
| 8 | 19.14 | 21.24 | zone | "fomo in. they're going to see not so red" | zone A: green calendar-pump backdrop | broll-psb-verygreen.png | - |
| 9 | 21.24 | 24.76 | zone | "candles and they were like oh let me just throw more in and they're going to turn those" | zone B: green roadmap/horizon backdrop | broll-psb-expect.png | - |
| 10 | 24.76 | 28.58 | zone | "candles green and then others going to be like oh my god it's going up. let me throw" | zone A: green calendar-pump backdrop | broll-psb-verygreen.png | - |
| 11 | 28.58 | 31.72 | zone | "them all in and they're going to push those candles even greener and we're going to" | zone B: green roadmap/horizon backdrop | broll-psb-expect.png | - |
| 12 | 31.72 | 34.96 | full | "see a very green october regardless of what happened" | PAYOFF (FULL): whole October calendar + market blazing acid-green, green up-only chart rocketing top-right, big green up-arrow, green fireworks | broll-psb-greenregardless.png | - |
| 13 | 34.96 | 37.84 | zone | "so i just think that it's impossible that october is" | zone A: green calendar-pump backdrop | broll-psb-verygreen.png | - |
| 14 | 37.84 | 41.04 | zone | "going to be it's going to be green because people are going to be buying in" | zone B: green roadmap/horizon backdrop | broll-psb-expect.png | - |
| 15 | 41.04 | 43.38 | zone | "it makes the question like will there be a new bottom after" | zone A: green calendar-pump backdrop | broll-psb-verygreen.png | - |
| 16 | 43.38 | 45.56 | zone | "october because if so many people have already bought" | zone B: green roadmap/horizon backdrop | broll-psb-expect.png | - |
| 17 | 45.56 | 48.24 | full | "back in will the coin actually" | CLIMAX (FULL): glowing acid-green price path cresting a peak then forking into two glowing routes, a big faint green question mark, green grid floor | broll-psb-crossroads.png | - |
| 18 | 48.24 | 50.60 | full | "go down to a new level." | CLOSE (FULL, butts against #17): the path settling to a new lower green support level, a bright green "new level" line under the prior peak, calm green mist, reflective | broll-psb-newlevel.png | - |

Distinct assets (6, per Mike's HARD budget): **4 full-screen** = hook, greenregardless, crossroads,
newlevel; **2 content-zone (reused + strictly A/B alternated)** = verygreen (A), expect (B).
(>= gate min 4 for a 50.6s clip. Every beat butts its neighbours = no base flash; no two adjacent
zone beats share an image, so the top zone changes every ~2-3s and is never static >3s.)

## Badges (crisp code text, top zone y~300; NEVER baked into art; time-separated, never over captions)
Badges sit at y300 (top zone), captions at y866 (seam) — never collide in space; each window is
time-separated from the next and falls only over ZONE beats (never over a full-screen peak). They carry
the per-beat meaning the 2 generic zone backdrops no longer illustrate literally.
- 21.4-24.6  big "THE FLIP"      sub "RED TO GREEN"  (green) — over the flip mechanism (#9)
- 35.4-39.2  big "CAN'T STAY RED" sub "THEY BUY IN"   (green) — over the impossible beat (#13)
- 41.3-44.8  big "NEW BOTTOM?"    sub "AFTER OCTOBER"  (teal)  — over the question/newbottom beats (#15/16)

## SFX (from `video-creation/assets/sfx/`, copied into render-assets/sfx; all vol <= 0.55 under the VO)
Simplified render-assets/sfx names (same set as clip #1); mapping to library files in parens.
- t0.00  whoosh.wav        vol0.50 — thumbnail cut -> hook reveal            (Cinematic Whoosh 02.wav)
- t1.08  impact-kick.wav   vol0.50 — "green." first conviction hit           (Impacts/Kick_Impact_01.wav)
- t3.16  whoosh-rapid.mp3  vol0.42 — hook full -> zone                       (transition_rapid_whoosh.mp3)
- t16.60 impact-kick.wav   vol0.42 — "red" the crowd's doomed bet lands      (Impacts/Kick_Impact_01.wav)
- t19.14 whoosh-rapid.mp3  vol0.44 — "fomo in" the rush                      (transition_rapid_whoosh.mp3)
- t21.24 cash.mp3          vol0.42 — candles start flipping green (kaching)  (Cash Register Kaching.mp3)
- t24.76 ding.mp3          vol0.40 — "turn those candles green"              (DING.mp3)
- t28.02 waitwhat.mp3      vol0.42 — "oh my god it's going up"               (WAIT WHAT SOUND EFFECT.mp3)
- t29.20 riser.wav         vol0.38 — build INTO the payoff                   (risers/Tension_Rise_Logo_Reveal_1.wav)
- t31.72 impact-big.wav    vol0.55 — "very green october regardless" (PAYOFF, biggest) (Impacts/Impact_1.wav)
- t34.96 whoosh-rapid.mp3  vol0.42 — payoff full -> zone                     (transition_rapid_whoosh.mp3)
- t35.44 ting.mp3          vol0.38 — "impossible" conviction accent          (TING SOUND EFFECT.mp3)
- t43.60 riser.wav         vol0.38 — build INTO the close                    (risers/Tension_Rise_Logo_Reveal_1.wav)
- t45.56 impact-boom.wav   vol0.50 — crossroads full turn (open-loop climax) (Boom - Big Reveal.wav)
- t48.24 waitwhat.mp3      vol0.40 — "a new level" reflective open-loop close (WAIT WHAT SOUND EFFECT.mp3)
15 events, 9 distinct files (whoosh, whoosh-rapid, impact-kick, impact-big, impact-boom, riser, cash,
ding, ting, waitwhat — well above the >=2 gate minimum).

## Reconcile (fill after generation): every beat asset present on disk + referenced in comp; zero orphans.
On disk now: broll-psb-hook.png, broll-psb-verygreen.png, broll-psb-expect.png (+ thumbnail). Still to
generate (broll-list.json): broll-psb-greenregardless.png, broll-psb-crossroads.png, broll-psb-newlevel.png.
