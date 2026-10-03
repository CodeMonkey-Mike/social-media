# BROLL-PLAN: uptober / clip 1 `spawn-doubled-for-the-haters` (FULL, 45.00 s)

Title: "Dedicated to the Haters: Spawn Doubled in a Day"
Spine: `render-assets/spawn-doubled-for-the-haters.mp4` (1080x1920 @25, has_b_frames 0, video 45.000 s,
audio 45.016 s). Comp renders at 30 fps, **1350 frames** (last frame 1349 = 44.967 s, inside both tracks).
Composition: `UptoberSpawnDoubled` (`remotion/src/UptoberSpawnDoubled.tsx`,
`constants-uptober-spawn-doubled-for-the-haters.ts`, `captionsUptoberSpawnDoubled.ts`).
Scoped build directives for clip 1 (`clip_directives.py --batch uptober --clip 1`): **none (0 of 0)**. No coverage exemption.
Sequel to batch `spon` clip 1 (same token): none of its concepts or files reused.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, rows 600-1300, 8 of 8 frames t=2..44 s; `_qa/measure.py`).
- Content zone = ONE screen the whole clip: DexScreener **SPON/ETH (Market Cap) on Uniswap**, Robinhood chain, chart
  at y ~0-460 (101K-115K on the right axis = the receipt), transactions table y ~470-850, sponge art in the side panel.
- Frame-diff (rows 0..840 @10 fps): no content cuts. Only event: a burned-in viewer chat banner
  ("Keep up the good work Brother! Hit the likes") at y ~700-790, **34.2-35.1 s**: ships as filmed; the $200K badge rides above it.
- STT (medium.en staggered windows, CPU, `_qa/res_stt.json`): disk = **Discord**; the base JSON **OMITTED "WOOHOOO!"**
  (13.34-15.48 gap; RMS envelope voiced 14.55-15.65) -> inserted as "woo!"; "Holy guac. Only guacamole" false start ->
  "holy guacamole"; "I can go" -> "it can go"; "and the market cap" -> "if the market cap"; "going to" -> "gonna".
  Patched into `whisper-words-verified.json`. Pause 19.26-20.84 blanked in the caption band at 19.70.

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.22 + 2.80 + 1.90 + 2.80 + 2.50 = **13.22 s of 45.00 s = 29.4 %** (band 25-35 %). Base **70.6 %**.
- **5 b-roll images**, each used once (45 s short). Full-screens: **2** (hook + climax), inside the FIRM 1-3 cap.
- Plus 1 real alpha overlay (glow-on-black -> alpha) and 6 code-drawn badges, all on BASE beats.
- Receipt chart visible in real stretches: 0.03-1.40, 4.62-8.40, 11.20-24.20 ("look what we did", "I was talking about it
  here"), 26.10-29.30 ("50K yesterday ... 101K today"), 32.10-35.24, 37.74-45.00.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-01: spon.png, pons.png, ethereum-eth.png present)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| SPON (Whisper "Spawn"; not spoken in this clip, it is the chart's token) | lesser-known WITH reference | `spon.png` (lime sponge mascot, holes, bead eyes, smile) | thumb, hook, discord, doubling, not-dead, climax: all generated WITH `spon.png` |
| Discord | WELL-KNOWN brand | none needed | discord beat: named explicitly in the prompt |
| Robinhood (chain) | WELL-KNOWN, not a beat subject | n/a | not drawn; its lime (#CCFF00) is the clip accent (never Kaspa teal) |

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | SPON sponge on a gold winner's podium holding a trophy overhead, doubling lime candle behind, ignored arms-crossed silhouettes; empty top for CODE title "DEDICATED / TO THE / HATERS" + chip "$SPON DOUBLED: 50K TO 101K" | `thumb-upt1-cover.png` | spon.png |
| 1 | 0.03-1.40 | "This one is" | base | face + SPON chart open (Phase 7 rule 5) | none | |
| 2 | 1.40-4.62 | "dedicated to all y'all" | **FULL (hook)** | sponge rock star on stage dedicating a song (mic, spotlight) to an arms-crossed silhouette crowd | `broll-upt1-hook-dedication.png` | spon.png |
| 3 | 4.62-8.40 | "haters out there. But I was talking about it yesterday on stream." | base | SPON chart | none | |
| 4 | 8.40-11.20 | "I had haters in my own Discord hating on this" | content | sponge lounging in a beach chair inside a Discord window, angry bubbles bouncing off a shield | `broll-upt1-discord-haters.png` | spon.png (+ Discord named) |
| 5 | 11.20-17.25 | "play and I'm like, woo! Look what we did, man." | base + badge | chart = "look what we did"; badge "$SPON / LOOK WHAT WE DID" 15.85-17.15 | none | |
| 6 | 17.25-19.55 | "Holy guacamole." | base + OVERLAY | happy cartoon avocado alpha overlay over the transactions table (left), chart clear | `ovl-upt1-avocado.png` | |
| 7 | 19.55-24.20 | "So 50K. I was talking about it here." | base + badge | Mike points at the chart; badge "$50K / THE ENTRY" 20.70-22.90 | none | |
| 8 | 24.20-26.10 | "Went up, doubled our money." | content | sponge pulling the lever of a copy machine: one coin stack in, two out | `broll-upt1-doubling.png` | spon.png |
| 9 | 26.10-29.30 | "It was at 50K yesterday and it's at 101K today." | base + badge | the chart receipt; badge "$101K / DOUBLED FROM $50K" 27.90-29.20 | none | |
| 10 | 29.30-32.10 | "It is definitely not dead and it's just waiting" | content | sponge bursting alive out of a grave mound, blank tombstone tipping, lime candles in the night sky | `broll-upt1-not-dead.png` | spon.png |
| 11 | 32.10-35.24 | "for you guys to buy in. But it can go to 200K if the market cap goes" | base + badge | chart; badge "$200K / NEXT STOP" 33.55-34.95 at top 470 (above the 34.2-35.1 chat banner) | none | |
| 12 | 35.24-37.74 | "to 5 million and that's 100x. Well, at least" | **FULL (climax)** | sponge riding a candlestick rocket past the full moon, green candle + coin trail, fireworks | `broll-upt1-climax-moon.png` | spon.png |
| 13 | 37.74-45.00 | "from yesterday you guys get in now. You're gonna do like a 50x. It goes to 5 million. But if you got in yesterday when I told you, yeah, it could be like 100x." | base + badges | chart; badges "50x / GET IN NOW" 40.00-41.70, "100x / FROM THE $50K ENTRY" 44.00-45.00; hard out | none | |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copies in `render-assets/sfx/`)
whoosh on the frame-0 cover cut, impact on the hook reveal (1.40), tight whooshes into each content cutaway (8.40, 24.20,
29.30), dings on the $SPON / $50K / $101K / $200K / 50x / 100x badges, a short kick on the avocado pop, the payoff impact
on the climax cut (35.24). 13 events. Final list + whisper-sweep notes live in the constants file.

## Manifest (zero orphans)
`thumb-upt1-cover.png`, `broll-upt1-hook-dedication.png`, `broll-upt1-discord-haters.png`, `broll-upt1-doubling.png`,
`broll-upt1-not-dead.png`, `broll-upt1-climax-moon.png`, `ovl-upt1-avocado.png` (from `ovl-upt1-avocado-raw.png`, kept in
the clip folder, OUT of render-assets).
Prompt list: `broll-list.json` (house style: Pixar 3D CGI, deep navy, rim light; spon.png-anchored mascot; no text).
- avocado overlay re-keyed (make_alpha2.py, border-connected) and resized to width 300 / top 455 so it clears the 854 seam (2026-10-01 resume).
