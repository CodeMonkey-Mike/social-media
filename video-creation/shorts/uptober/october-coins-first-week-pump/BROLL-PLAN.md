# BROLL-PLAN: uptober / clip 6 `october-coins-first-week-pump` (FULL, 34.73 s)

Title: "October Coins Pump the First Week of October"
Spine: `render-assets/october-coins-first-week-pump.mp4` (1080x1920 @25, has_b_frames 0, video 34.760 s,
audio 34.766 s). Comp renders at 30 fps, **1042 frames** (last frame 1041 = 34.700 s, inside both tracks).
Composition: `UptoberOctoberCoins` (`remotion/src/UptoberOctoberCoins.tsx`,
`constants-uptober-october-coins-first-week-pump.ts`, `captionsUptoberOctoberCoins.ts`).
Scoped build directives for clip 6 (`clip_directives.py --batch uptober --clip 6`): **none (0 of 0)**. No coverage exemption.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, rows 600-1300, 9 of 9 frames t=2..34 s; `_qa/measure.py`).
- Content zone (frame-diff rows 0..840 @10 fps, cuts at 1.6 / 2.0 / 4.7 / 15.3 s):
  - 0.0-1.6 DexScreener search "uptober" (25+ separate UPTOBER tokens listed);
  - 1.6-2.0 chart loading; 2.0-15.3 **UPTOBER/SOL (Market Cap) on Raydium**, axis to 175M, one spike to ~75M = the receipt
    for "this thing hit a 75 million market cap" (pair created 1y 11mo ago, i.e. October 2024);
  - 15.3-end **Pumpkin/SOL (Market Cap) on PumpSwap** (mkt cap ~$69K) = "the pumpkin related ones" / "I call this a 29K".
  - A burned-in viewer chat banner "Got price prediction for uptober??" (y ~720-780) is on screen from ~5 s: ships as filmed;
    every badge sits at top 560 (~455-665), clear of it.
- STT (medium.en staggered windows, CPU, `_qa/stt_res.json`, `_qa/res_29k.json`): the spoken word is **"October"** in every
  instance, even with an "Uptober" initial_prompt, so captions say "october" (the screen carries UPTOBER). "going to" -> "gonna"
  x3; the false start "it did it on um," (8.20-9.46) dropped and blanked at 8.30; "I call this a 29K market cap" confirmed 5/5.
  Patched into `whisper-words-verified.json`. No omitted speech (whole-clip medium.en matches the word stream).

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 2.26 + 2.24 + 2.68 + 1.98 + 2.413 = **11.573 s of 34.733 s = 33.3 %** (band 25-35 %). Base **66.7 %**.
- **5 b-roll images**, each used once (35 s short). Full-screens: **2** (hook + climax), inside the FIRM 1-3 cap.
- Plus 5 code-drawn badges, all on BASE beats.
- Receipt charts visible in real stretches: 0.03-2.48 (search), 4.74-12.60 (the UPTOBER 75M spike + $75M / 1ST WEEK badges),
  14.84-19.62 (Pumpkin chart + PUMPKIN badge), 22.30-26.48 ($29K call), 28.46-32.32 (2024 badge).

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-01: `uptober.png` present)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| UPTOBER / "October" coins (the chart's token; 25+ tokens share the name) | lesser-known WITH reference | `uptober.png` (tabby cat, green hoodie + cape, glowing eyes, green arrow) | thumb, hook, early-vs-pumpkins, climax: generated WITH `uptober.png`, cat ONLY, its "UPTOBER" lettering NOT reproduced. Used as the SEASONAL "Uptober" mascot (same reading as Lane 3's plan), never claimed as the 75M coin's own logo (that coin's banner is a different grey cat); the 75M claim rides on the real chart + a code badge. |
| Pumpkin (Pumpkin/SOL) | lesser-known, NO reference | none | no logo drawn: generic jack-o'-lanterns as a concept + code badge "PUMPKIN". Flag: Mike may add a reference. |
| Solana | WELL-KNOWN brand | none needed | solana beat: named explicitly, real three-bar logo |

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | uptober cat on a number-free calendar page whose first row glows green, green candle behind; empty top for CODE title "PUMP HARD, / GET OUT / FAST" + chip "ONE OCTOBER COIN HIT $75M IN WEEK 1" | `thumb-oc6-cover.png` | uptober.png |
| 1 | 0.03-2.48 | "October is one of those plays that it's gonna" | base | face + DexScreener "uptober" search (Phase 7 rule 5) | none | |
| 2 | 2.48-4.74 | "pump hard and you're gonna get out really fast." | **FULL (hook)** | the cat leaping off the peak of a green candle rocket, green parachute opening, rocket tipping | `broll-oc6-hook-bailout.png` | uptober.png |
| 3 | 4.74-12.60 | "This thing hit a 75 million market cap, and ... did it like in the first week of October? So on Solana" | base + badges | UPTOBER chart, 75M spike; badges "$75M / UPTOBER MARKET CAP" 5.75-7.45, "1ST / WEEK OF OCTOBER" 10.40-11.70 | none | |
| 4 | 12.60-14.84 | "imagine going up out of the blue, going up to 70 million." | content | Solana-gradient rocket with the Solana logo punching out of a calm blue sky | `broll-oc6-solana-blue.png` | (Solana named) |
| 5 | 14.84-19.62 | "The pumpkin related ones will probably pump in the ending of October, whereas" | base + badge | Pumpkin/SOL chart; badge "PUMPKIN / PUMPS LATE OCTOBER" 16.40-18.40 | none | |
| 6 | 19.62-22.30 | "the October related coins will probably pump" | content | the cat blasting off at dawn on a green rocket while jack-o'-lanterns sleep on hay bales | `broll-oc6-early-vs-pumpkins.png` | uptober.png |
| 7 | 22.30-26.48 | "in the beginning of October. I call this a 29K market cap because" | base + badge | Pumpkin chart; badge "$29K / THE CALL" 25.20-26.40 | none | |
| 8 | 26.48-28.46 | "everybody's gonna buy back in in October." | content | faceless silhouettes scrambling back onto a green-candle roller coaster at an autumn carnival | `broll-oc6-buy-back-in.png` | |
| 9 | 28.46-32.32 | "If we get that type of a pump we could be seeing something like in 2024, like a" | base + badge | chart; badge "2024 / IF IT REPEATS" 30.80-32.20 | none | |
| 10 | 32.32-34.73 | "70 million dollar type of October coin." | **FULL (climax)** | the cat enthroned atop a green candle tower piercing the clouds, harvest moon, coin rain, fireworks; hard out | `broll-oc6-climax-70m.png` | uptober.png |

Same-topic check (no duplicate b-roll): the October shorts already built (`ewp1`, `ewp-c6`, `ppz2`, `ai1`) used zombie hordes, a
FOMO door, October sun, hibernating bears, etc.; none of those concepts are reused (the "buy back in" beat is a coaster, not a door).
Lane 3's uptober.png hook (cat flying up a green arrow) is not reused either.

## SFX (crest-aligned; staged copies in `render-assets/sfx/`)
whoosh on the frame-0 cover cut; card impact on the hook reveal (2.48); tight whooshes into each content cutaway (12.60, 19.62,
26.48); dings on the $75M / 1ST / PUMPKIN / $29K / 2024 badges; the payoff impact on the climax cut (32.32). **11 events.**
Final list + whisper-verify notes live in the constants file.

## Manifest (zero orphans)
`thumb-oc6-cover.png`, `broll-oc6-hook-bailout.png`, `broll-oc6-solana-blue.png`, `broll-oc6-early-vs-pumpkins.png`,
`broll-oc6-buy-back-in.png`, `broll-oc6-climax-70m.png`.
Prompt list: `broll-list.json` (house style: Pixar 3D CGI, deep navy, rim light; uptober.png-anchored cat; no text).
