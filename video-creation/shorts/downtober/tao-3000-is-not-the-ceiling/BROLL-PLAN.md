# BROLL-PLAN: downtober / clip 2 `tao-3000-is-not-the-ceiling` (FULL)

Title: "TAO to 3000? That Is Not the Ceiling"
Spine: `shorts/downtober/render-assets/tao-3000-is-not-the-ceiling.mp4` (1080x1920, video 19.28 s @25, audio 19.29 s)
Comp: 578 frames @30 = 19.267 s. Seam MEASURED at 853/854 (row-mean step on 6 of 6 frames) -> content zone 0..854.
Base content zone: TradingView MEMECO dominance chart (light background, dumping line) + the burned-in chat banner
"@jhonnyg3228 tao going to 3000" at y~735-775 (ships as filmed; it is the line Mike is reading = the hook receipt).
Directives for clip 2 (`clip_directives.py --batch downtober --clip 2`): none. No coverage exemption.

## Budget (canonical: video-creation/SKILL.md "B-roll coverage budget", HALVED 2026-07-14)
- B-roll images: 3 beats, 1.70 + 2.14 + 2.26 = **6.10 s of 19.27 s = 31.7 % b-roll / 68.3 % base**.
- Full-screens: 2 (hook + climax), inside the FIRM cap of 3. No full->full adjacency (14.4 s apart).
- Plus 1 small alpha overlay (not a zone cover) and 3 code-drawn badges. Base shows in real stretches
  (0-3.3, 5.0-6.56, 8.70-16.14 apart from the overlay/badges, 18.40-end).

## Reference gate (named projects)
- **TAO / Bittensor**: well-known brand AND `schedule-tweets/images/reference/bittensor-tao.png` exists (checked live
  2026-10-15) -> every TAO-coin image is generated WITH that reference attached and named explicitly
  ("TAO coin with the Bittensor tau logo"). No other project is named in the clip.

## Beats

| # | t (s) | spoken line | mode | visual | asset | reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | PHOTOREAL oversized TAO coin, single focus, dark gradient, top third empty for the code-drawn title "TAO TO $3,000?" + chip "NOT THE CEILING" | `thumb-dt2-cover.png` | bittensor-tao.png |
| 1 | 0.00-3.30 | "TAO going to 3000. Yeah." | base | chat banner "tao going to 3000" visible; code-drawn badge "$3,000" / "TAO PRICE CALL" 0.40-2.60 at top 400 | (badge) | n/a |
| 2 | 3.30-5.00 | "Yeah. Hell yeah." | **full (HOOK)** | colossal TAO coin rising over a night skyline, green fireworks, tiny faceless rooftop silhouettes cheering | `broll-dt2-hook-tao-fireworks.png` | bittensor-tao.png |
| 3 | 5.00-6.56 | "I totally agree. TAO going to three." | base | screen-share + face (deliberate 1.56 s base beat) | (none) | n/a |
| 4 | 6.56-8.70 | "I think TAO can go a lot more than that" | content | TAO coin smashing UP through a shattering glass ceiling (the title beat) | `broll-dt2-glass-ceiling.png` | bittensor-tao.png |
| 5 | 8.70-9.58 | "in the long run," | base | screen-share | (none) | n/a |
| 6 | 9.58-11.16 | "a lot more than that in the long run," | base + overlay | glowing green up-arrow alpha overlay over the chart, right side (top 170, left 600, w 380) | `ovl-dt2-green-arrow.png` | n/a |
| 7 | 11.30-13.80 | "we just got some craziness going on right now." | base + badge | the base chart (dumping MEMECO line) IS the craziness; badge "CRAZINESS" / "RIGHT NOW" 12.12-13.85 (on the word) top 400 | (badge) | n/a |
| 8 | 13.80-16.14 | "We should be going into one hell of a" | base | screen-share + face, riser builds under it | (none) | n/a |
| 9 | 16.14-18.40 | "fantastic economic expansion." | **full (CLIMAX)** | booming city at dawn, skyscrapers and cranes rising, a giant TAO coin rising like the sun on the horizon | `broll-dt2-climax-expansion.png` | bittensor-tao.png |
| 10 | 18.40-19.27 | "Very, very soon." | base + badge | badge "VERY SOON" / "ECONOMIC EXPANSION" 18.42-end top 400 | (badge) | n/a |

## Assets (file-level manifest, zero orphans)
| file | used by beat | generator |
|---|---|---|
| `thumb-dt2-cover.png` | 0 | ChatGPT (gen_batch.py), ref attached |
| `broll-dt2-hook-tao-fireworks.png` | 2 | ChatGPT (gen_batch.py), ref attached |
| `broll-dt2-glass-ceiling.png` | 4 | ChatGPT (gen_batch.py), ref attached |
| `broll-dt2-climax-expansion.png` | 9 | ChatGPT (gen_batch.py), ref attached |
| `ovl-dt2-green-arrow-src.png` -> `ovl-dt2-green-arrow.png` | 6 | ChatGPT glow-on-black -> alpha-from-luminance (Pillow) |

## SFX (from video-creation/assets/sfx, copied into render-assets/sfx/)
| t (crest) | cue | why |
|---|---|---|
| 0.033 | transition_rapid_whoosh | frame-0 cover cut to the base |
| 3.30 | Impacts/card-impact-layered | hook full-screen reveal |
| 6.56 | transition_rapid_whoosh-tight | into the glass-ceiling cutaway |
| 9.58 | DING-093 | green arrow overlay pops |
| 12.12 | ding/sudden-shock-tight (vol 0.10) | "craziness" badge, on the word |
| 14.1->16.14 | Riser Sound Effect-2s (low) -> Boom - Big Reveal-short | riser builds INTO the climax payoff |
| 18.42 | DING-093 | VERY SOON badge |
Every SFX cue is whisper-verified against an encode-matched control on the final mix (SKILL row 7/7a).

## As built (2026-10-15)
- 8 SFX events (7 distinct files); the planned 0.40 ding on the opening badge was DROPPED before render (two cues over "TAO going" in the first 0.4 s was a masking risk for no payoff; the frame-0 whoosh carries the open).
- Offline mix vs encode-matched control (medium.en, 16 staggered windows): no masking. Final render whisper-verified the same way.
- Post-render fix: caption "yeah." retimed 3.38 -> 2.58 (measured onset) and spliced (`render_short.py splice --frames 74-118`).
- Reconciled: every beat has its asset, every asset is referenced, every ref exists (gate PASS). The arrow's ChatGPT source `ovl-dt2-green-arrow-src.png` moved to `_qa/src/` (only the alpha PNG ships).
